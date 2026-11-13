const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const BROWSER_PATHS = [
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];
const CHROME_PATH = BROWSER_PATHS.find(p => fs.existsSync(p));
const BASE_URL = 'http://localhost:5175';

const TARGET_PAGES = [
  {
    name: 'My Health Dashboard',
    route: 'patient-dashboard',
    section: 'Patient Care Portal',
    expectedTexts: ['Welcome, Rajesh', 'SNHC-2024-00002', 'UIDAI CONNECTED', 'Patient Care Portal']
  },
  {
    name: 'Book Consultation',
    route: 'book-appointment',
    section: 'Patient Care Portal',
    expectedTexts: ['Book Clinic Consultation', 'Dr. Arunachalam Kumar', 'Appointment Date']
  },
  {
    name: 'My Appointments',
    route: 'my-appointments',
    section: 'Patient Care Portal',
    expectedTexts: ['My Consultation History', 'Consultation Fee', 'Doctor:']
  },
  {
    name: 'My Medical Records',
    route: 'my-records',
    section: 'Patient Care Portal',
    expectedTexts: ['Electronic Health Records (EHR)', 'Complete Blood Count', 'NABH']
  },
  {
    name: 'Patient Feedback & NPS',
    route: 'crm-feedback',
    section: 'Experience & Care',
    expectedTexts: ['Patient Experience & NPS Feedback Desk', 'Net Promoter Score (NPS)', 'Log Patient Review']
  }
];

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

async function runTest() {
  console.log('================================================================');
  console.log('🏥 SOFTWARE TEST SUITE: PATIENT PORTAL & CLINICAL WORKSPACE');
  console.log('Target User: patient.rajesh (Rajesh Kannan)');
  console.log('================================================================\n');

  // Step 1: Authenticate patient.rajesh
  console.log('▶ Step 1: Authenticating patient.rajesh via Spring Boot backend...');
  const loginRes = await fetch('http://localhost:8080/api/auth/patient-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail: 'patient.rajesh', password: 'password123' })
  });

  if (loginRes.status !== 200) {
    throw new Error(`Authentication failed with status: ${loginRes.status}`);
  }

  const authData = await loginRes.json();
  console.log(`  ✓ Auth Success! Token issued (Bearer ${authData.accessToken.slice(0, 16)}...)`);
  console.log(`  ✓ User ID: ${authData.user.id} | Roles: [${authData.user.roles.join(', ')}]`);

  // Step 2: Patient Profile & KYC Verification
  console.log('\n▶ Step 2: Validating Patient Identity & e-KYC status via Backend API...');
  const lookupRes = await fetch('http://localhost:8080/api/patients/lookup?identifier=patient.rajesh', {
    headers: { 'Authorization': `Bearer ${authData.accessToken}` }
  });
  const lookupData = await lookupRes.json();
  console.log(`  ✓ Patient Record Found: ${lookupData.found}`);
  console.log(`  ✓ Full Name: ${lookupData.name} | UHID: ${lookupData.uhid}`);
  console.log(`  ✓ Masked Aadhaar: ${lookupData.maskedAadhaar} | KYC Status: ${lookupData.kycStatus}`);

  // Step 3: Launch Headless Chrome
  console.log('\n▶ Step 3: Launching clean Headless Chrome for DOM & UI inspection...');
  const os = require('os');
  const path = require('path');
  const tempProfile = path.join(os.tmpdir(), `test_chrome_patient_${Date.now()}`);

  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${tempProfile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1920,1080'
  ]);

  await sleep(1500);

  let version;
  for (let i = 0; i < 10; i++) {
    try {
      version = await fetchJson('http://127.0.0.1:9222/json/version');
      break;
    } catch {
      await sleep(500);
    }
  }

  if (!version) {
    chrome.kill();
    throw new Error('Could not establish connection to Chrome on port 9222');
  }

  console.log(`  ✓ Connected to Chrome: ${version.Browser}`);
  const targets = await fetchJson('http://127.0.0.1:9222/json/list');
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const wsUrl = pageTarget.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
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

  // Seed authenticated patient session into localStorage
  await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
  await sleep(1500);
  await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      localStorage.setItem('accessToken', '${authData.accessToken}');
      localStorage.setItem('refreshToken', '${authData.refreshToken}');
      localStorage.setItem('user', JSON.stringify(${JSON.stringify(authData.user)}));
    })()`,
    awaitPromise: false
  });
  // Reload page to re-initialize React AuthContext from localStorage
  await sendCommand('Page.reload');
  await sleep(2000);

  console.log('\n▶ Step 4: Executing In-Depth UI & Component Verification Matrix...');
  const testResults = [];

  for (const page of TARGET_PAGES) {
    runtimeErrors.length = 0;
    const url = `${BASE_URL}/#${page.route}`;
    await sendCommand('Page.navigate', { url });
    await sleep(2500);

    // Extract page DOM state
    const evalRes = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const bodyText = document.body.innerText || '';
        const h1 = document.querySelector('h1')?.innerText || '';
        const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean);
        const sidebarGreeting = document.querySelector('.font-serif.italic')?.innerText || '';
        return {
          bodyText,
          h1,
          buttonsCount: buttons.length,
          sidebarGreeting,
          title: document.title
        };
      })()`,
      returnByValue: true
    });

    const val = evalRes.result?.result?.value || evalRes.result?.value || {};
    const bodyText = val.bodyText || '';
    const missingTexts = page.expectedTexts.filter(txt => !bodyText.toLowerCase().includes(txt.toLowerCase()));
    const passed = missingTexts.length === 0 && runtimeErrors.length === 0;

    // Capture screenshot
    const shot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    const filename = `screenshot_${page.route}.png`;
    if (shot.result?.data) {
      fs.writeFileSync(filename, Buffer.from(shot.result.data, 'base64'));
    }

    testResults.push({
      page: page.name,
      route: `#${page.route}`,
      section: page.section,
      h1: val.h1,
      sidebarGreeting: val.sidebarGreeting,
      buttonsFound: val.buttonsCount,
      missingTexts,
      runtimeErrors: [...runtimeErrors],
      screenshot: filename,
      passed
    });
  }

  // Teardown Chrome
  ws.close();
  chrome.kill();

  console.log('\n================================================================');
  console.log('📊 COMPREHENSIVE TEST RESULTS SUMMARY');
  console.log('================================================================');

  let allPassed = true;
  for (const res of testResults) {
    const statusMark = res.passed ? '✅ PASS' : '❌ FAIL';
    if (!res.passed) allPassed = false;
    console.log(`\n${statusMark} | ${res.page} (${res.route})`);
    console.log(`   • Section: [${res.section}]`);
    console.log(`   • Header H1: "${res.h1}"`);
    console.log(`   • Sidebar Greeting: "Welcome, ${res.sidebarGreeting}"`);
    console.log(`   • Interactive Buttons: ${res.buttonsFound} detected`);
    console.log(`   • Screenshot Saved: ${res.screenshot}`);
    if (res.missingTexts.length > 0) {
      console.log(`   ⚠️ Missing Content: ${JSON.stringify(res.missingTexts)}`);
    }
    if (res.runtimeErrors.length > 0) {
      console.log(`   ⚠️ Runtime Errors: ${JSON.stringify(res.runtimeErrors)}`);
    }
  }

  console.log('\n================================================================');
  if (allPassed) {
    console.log('🎉 ALL 5 TEST MODULES PASSED 100% WITH ZERO ERRORS!');
  } else {
    console.log('⚠️ SOME TESTS ENCOUNTERED DISCREPANCIES. REVIEW LOGS ABOVE.');
  }
  console.log('================================================================\n');

  process.exit(allPassed ? 0 : 1);
}

runTest().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
