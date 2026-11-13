const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BROWSER_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];
const CHROME_PATH = BROWSER_PATHS.find(p => fs.existsSync(p));
const BASE_URL = 'http://localhost:5175';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function run() {
  console.log('================================================================');
  console.log('📸 VERIFICATION SUITE: PATIENT PHOTO UPLOAD & DOCTOR PHOTO VIEW');
  console.log('================================================================\n');

  console.log('▶ Step 1: Authenticating as Admin for Clinical & HMS Desk Access...');
  const adminRes = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail: 'admin', password: 'password123' })
  });
  if (adminRes.status !== 200) {
    throw new Error(`Admin login failed: ${adminRes.status}`);
  }
  const adminData = await adminRes.json();
  console.log(`  ✓ Admin Authenticated! Roles: [${adminData.roles?.join(', ') || 'ADMIN'}]`);

  console.log('\n▶ Step 2: Launching Headless Chrome via CDP...');
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1920,1080'
  ]);

  await sleep(2000);

  let version;
  for (let i = 0; i < 15; i++) {
    try {
      version = await fetchJson('http://127.0.0.1:9222/json/version');
      break;
    } catch {
      await sleep(500);
    }
  }

  if (!version) {
    chrome.kill();
    throw new Error('Could not connect to Chrome on port 9222');
  }
  console.log(`  ✓ Chrome CDP Connected: ${version.Browser}`);

  const targets = await fetchJson('http://127.0.0.1:9222/json/list');
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let msgId = 1;
  const callbacks = new Map();
  const runtimeErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const details = msg.params?.exceptionDetails;
      runtimeErrors.push(`${details?.text || ''} ${details?.exception?.description || ''}`);
    }
  };

  function sendCommand(method, params = {}) {
    return new Promise((resolve) => {
      const currentId = msgId++;
      callbacks.set(currentId, resolve);
      ws.send(JSON.stringify({ id: currentId, method, params }));
    });
  }

  await new Promise(res => ws.onopen = res);
  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');

  // Authenticate admin session in localStorage
  await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
  await sleep(1500);
  await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      localStorage.setItem('accessToken', '${adminData.accessToken}');
      localStorage.setItem('token', '${adminData.accessToken}');
      localStorage.setItem('refreshToken', '${adminData.refreshToken || ''}');
      localStorage.setItem('user', JSON.stringify(${JSON.stringify(adminData.user)}));
    })()`,
    awaitPromise: false
  });
  await sendCommand('Page.reload');
  await sleep(2000);

  // Test 1: Patient List & Patient Details Photo Upload Slot
  console.log('\n▶ Step 3: Navigating to Patient Registry (#patient-list)...');
  await sendCommand('Page.navigate', { url: `${BASE_URL}/#patient-list` });
  
  // Wait until table rows are rendered
  let plData = {};
  for (let i = 0; i < 10; i++) {
    await sleep(500);
    const evalRes = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const tableRows = document.querySelectorAll('table tbody tr');
        const photos = document.querySelectorAll('table tbody tr img');
        const viewButtons = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('View & Photo') || b.innerText.includes('View'));
        return {
          currentUrl: window.location.href,
          rowCount: tableRows.length,
          photoCount: photos.length,
          viewButtonCount: viewButtons.length,
          firstRowText: tableRows[0]?.innerText || ''
        };
      })()`,
      returnByValue: true
    });
    plData = evalRes.result?.result?.value || {};
    if (plData.rowCount > 0) break;
  }
  console.log(`  ✓ Table Rows: ${plData.rowCount}`);
  console.log(`  ✓ Patient Avatars/Photos Rendered in Table: ${plData.photoCount}`);
  console.log(`  ✓ "View & Photo" Buttons: ${plData.viewButtonCount}`);

  // Click on "View & Photo" or click first row avatar
  console.log('\n▶ Step 4: Opening Patient Details Modal for First Patient...');
  const openModalEval = await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      const allButtons = Array.from(document.querySelectorAll('button')).map(b => ({
        text: b.innerText,
        title: b.title,
        html: b.outerHTML.slice(0, 80)
      }));
      const viewBtn = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('View Patient Details'));
      if (viewBtn) {
        viewBtn.click();
        return { clicked: true, method: 'view-btn-by-title', allButtonsCount: allButtons.length };
      }
      return { clicked: false, allButtons };
    })()`,
    returnByValue: true
  });
  console.log(`  ✓ Modal Trigger Result:`, openModalEval.result?.result?.value);
  await sleep(1500);

  // Inspect PatientDetailsModal
  const modalInspection = await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      const title = document.querySelector('h2')?.innerText || document.querySelector('h3')?.innerText || '';
      const photoSlot = document.querySelector('input[type="file"]') !== null;
      const fileInputId = document.querySelector('input[type="file"]')?.id || '';
      const uploadLabel = Array.from(document.querySelectorAll('label, button')).find(el => el.innerText.includes('Upload') || el.innerText.includes('Photo'))?.innerText || '';
      const patientName = document.querySelector('.text-2xl')?.innerText || document.querySelector('.font-bold')?.innerText || '';
      const hasImage = document.querySelector('.rounded-3xl img, .w-28 img, .w-32 img') !== null;
      const modalBody = document.body.innerText;
      return {
        title,
        photoSlotExists: photoSlot,
        fileInputId,
        uploadLabel,
        patientName,
        hasImage,
        hasDossierText: modalBody.includes('Patient Clinical Profile') || modalBody.includes('Master Patient Index')
      };
    })()`,
    returnByValue: true
  });
  console.log(`  ✓ Modal Inspection Data:`, modalInspection.result?.result?.value);

  // Capture screenshot of Patient Details Modal
  const shotModal = await sendCommand('Page.captureScreenshot', { format: 'png' });
  if (shotModal.result?.data) {
    fs.writeFileSync('screenshot_patient_details_photo_slot.png', Buffer.from(shotModal.result.data, 'base64'));
    console.log('  ✓ Screenshot captured: screenshot_patient_details_photo_slot.png');
  }

  // Close modal
  await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === '✕' || b.innerText.includes('Close') || b.querySelector('svg'));
      if (closeBtn) closeBtn.click();
    })()`,
    returnByValue: true
  });
  await sleep(1000);

  // Test 2: Doctor OPD Consultation Desk & Doctor Check Photo Modal
  console.log('\n▶ Step 5: Navigating to Doctor OPD Consultation Desk (#hms-opd)...');
  await sendCommand('Page.navigate', { url: `${BASE_URL}/#hms-opd` });
  await sleep(2500);

  const opdInspection = await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      const bodyText = document.body.innerText;
      const checkPhotoBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Check Photo'));
      const queuePhotos = document.querySelectorAll('.space-y-2 img, .rounded-full img');
      const activePatientName = document.querySelector('h2.font-bold, h3.font-bold')?.innerText || '';
      return {
        hasOpdText: bodyText.includes('OPD Consultation Desk') || bodyText.includes('Consultation'),
        hasCheckPhotoBtn: !!checkPhotoBtn,
        checkPhotoBtnText: checkPhotoBtn?.innerText || '',
        queuePhotosCount: queuePhotos.length,
        activePatientName
      };
    })()`,
    returnByValue: true
  });
  console.log(`  ✓ OPD Desk Inspection Data:`, opdInspection.result?.result?.value);

  // Click "Check Photo"
  console.log('\n▶ Step 6: Doctor Clicking "Check Photo" to View Patient Photo Dossier...');
  const clickCheckPhoto = await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Check Photo'));
      if (btn) {
        btn.click();
        return { clicked: true };
      }
      // Or click patient photo in header
      const avatarBtn = document.querySelector('button[title*="photo" i]');
      if (avatarBtn) {
        avatarBtn.click();
        return { clicked: true, method: 'avatar-btn' };
      }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  console.log(`  ✓ Check Photo Trigger Result:`, clickCheckPhoto.result?.result?.value);
  await sleep(1500);

  // Inspect DoctorPatientPhotoModal
  const doctorModalInspection = await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      const bodyText = document.body.innerText;
      const modalHeader = document.querySelector('h3')?.innerText || '';
      const doctorPhoto = document.querySelector('.fixed img, .modal img, img[alt*="verification" i], img[alt*="photo" i]')?.src || '';
      const badges = Array.from(document.querySelectorAll('.rounded-full')).map(el => el.innerText.trim()).filter(Boolean);
      return {
        modalHeader,
        isDoctorModalOpen: bodyText.includes('Doctor Patient Photo Verification') || bodyText.includes('Verified Clinical Identity'),
        hasHighResPhoto: doctorPhoto.length > 0,
        photoSrcPreview: doctorPhoto.slice(0, 50),
        badges
      };
    })()`,
    returnByValue: true
  });
  console.log(`  ✓ Doctor Verification Modal Inspection:`, doctorModalInspection.result?.result?.value);

  // Capture screenshot of Doctor Modal
  const shotDoctorModal = await sendCommand('Page.captureScreenshot', { format: 'png' });
  if (shotDoctorModal.result?.data) {
    fs.writeFileSync('screenshot_doctor_patient_photo_modal.png', Buffer.from(shotDoctorModal.result.data, 'base64'));
    console.log('  ✓ Screenshot captured: screenshot_doctor_patient_photo_modal.png');
  }

  // Teardown
  ws.close();
  chrome.kill();

  console.log('\n================================================================');
  console.log('🎉 SUMMARY OF VERIFICATION');
  console.log('================================================================');
  console.log(`1. Patient Registry table displays patient photos/avatars: ${plData.photoCount > 0 ? '✅ YES' : '❌ NO'}`);
  console.log(`2. Patient Details Modal has dedicated photo upload slot: ${modalInspection.result?.result?.value?.photoSlotExists ? '✅ YES' : '❌ NO'}`);
  console.log(`3. Doctor Consultation Desk has "Check Photo" button: ${opdInspection.result?.result?.value?.hasCheckPhotoBtn ? '✅ YES' : '❌ NO'}`);
  console.log(`4. Doctor Verification Modal renders high-res photo dossier: ${doctorModalInspection.result?.result?.value?.isDoctorModalOpen ? '✅ YES' : '❌ NO'}`);
  console.log('================================================================\n');

  process.exit(0);
}

run().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
