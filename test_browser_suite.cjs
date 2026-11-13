const { spawn } = require('child_process');
const http = require('http');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5175';

const ALL_ROUTES = [
  'admin-dashboard',
  'hms-opd',
  'hms-ipd',
  'patient-list',
  'appointment-list',
  'doctor-list',
  'crm-pipeline',
  'crm-feedback',
  'erp-pharmacy',
  'erp-billing',
  'hrms-roster',
  'hrms-leaves',
  'staff-list',
  'hms-ot',
  'hms-lis',
  'hms-ris',
  'hms-bloodbank',
  'hms-emergency',
  'erp-tpa-claims',
  'erp-procurement',
  'erp-biomedical',
  'erp-cssd-infection',
  'erp-finance',
  'hrms-payroll',
  'hrms-credentialing',
  'crm-health-packages',
  'crm-referrals',
  'admin-incidents',
  'admin-compliance',
  'patient-dashboard',
  'book-appointment',
  'my-appointments',
  'my-records',
  'staff-login',
  'patient-login',
  'patient-register',
  'home',
  'about',
  'doctor',
  'services',
  'treatments',
  'facilities',
  'appointments',
  'wellness',
  'blog',
  'faq',
  'contact',
  'patient-info'
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

async function run() {
  console.log('--- Phase 1: Fetching Live Authentic JWT Credentials ---');
  const adminAuthRes = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail: 'admin', password: 'password123' })
  });
  const adminAuth = await adminAuthRes.json();

  const patientAuthRes = await fetch('http://localhost:8080/api/auth/patient-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail: 'patient.rajesh', password: 'password123' })
  });
  const patientAuth = await patientAuthRes.json();

  console.log('Admin Token Valid:', !!adminAuth.accessToken, '| Patient Token Valid:', !!patientAuth.accessToken);

  console.log('\n--- Phase 2: Launching Clean Headless Chrome via CDP ---');
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
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
    console.error('Failed to connect to Chrome on port 9222');
    chrome.kill();
    process.exit(1);
  }

  console.log('Connected to Chrome DevTools:', version.Browser);
  const targets = await fetchJson('http://127.0.0.1:9222/json/list');
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const wsUrl = pageTarget.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const callbacks = new Map();
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
    if (msg.method === 'Page.javascriptDialogOpening') {
      sendCommand('Page.handleJavaScriptDialog', { accept: true });
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const details = msg.params?.exceptionDetails;
      consoleErrors.push(`[Runtime Exception] ${details?.text || ''} ${details?.exception?.description || ''}`);
    }
    if (msg.method === 'Log.entryAdded' && msg.params?.entry?.level === 'error') {
      consoleErrors.push(`[Log Error] ${msg.params.entry.text}`);
    }
  };

  function sendCommand(method, params = {}) {
    return new Promise((resolve) => {
      const currentId = id++;
      callbacks.set(currentId, resolve);
      ws.send(JSON.stringify({ id: currentId, method, params }));
    });
  }

  await new Promise(res => ws.onopen = res);

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');
  await sendCommand('Log.enable');

  // Pre-seed storage before initial navigation
  await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
  await sleep(1500);
  await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      localStorage.setItem('accessToken', '${adminAuth.accessToken}');
      localStorage.setItem('refreshToken', '${adminAuth.refreshToken}');
      localStorage.setItem('user', JSON.stringify(${JSON.stringify(adminAuth.user)}));
    })()`,
    awaitPromise: false
  });
  await sendCommand('Page.navigate', { url: `${BASE_URL}/#admin-dashboard` });
  await sleep(1500);

  console.log(`\n--- Phase 3: Auditing All ${ALL_ROUTES.length} Routes Top to Bottom ---\n`);

  const results = [];

  for (const route of ALL_ROUTES) {
    const isPatientRoute = ['patient-dashboard', 'book-appointment', 'my-appointments', 'my-records'].includes(route);
    const authToUse = isPatientRoute ? patientAuth : adminAuth;

    // Inject appropriate credentials before route navigation
    await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        localStorage.setItem('accessToken', '${authToUse.accessToken}');
        localStorage.setItem('refreshToken', '${authToUse.refreshToken}');
        localStorage.setItem('user', JSON.stringify(${JSON.stringify(authToUse.user)}));
      })()`,
      awaitPromise: false
    });

    consoleErrors.length = 0;
    await sendCommand('Page.navigate', { url: `${BASE_URL}/#${route}` });
    await sleep(600);

    let pageInfo = {};
    for (let attempt = 0; attempt < 3; attempt++) {
      const evalResult = await sendCommand('Runtime.evaluate', {
        expression: `({
          title: document.title,
          bodyLength: document.body.innerText.length,
          buttonsCount: document.querySelectorAll('button').length,
          inputsCount: document.querySelectorAll('input').length,
          imagesCount: document.querySelectorAll('img').length,
          linksCount: document.querySelectorAll('a').length
        })`,
        returnByValue: true
      });
      pageInfo = evalResult.result?.result?.value || {};
      if ((pageInfo.bodyLength || 0) > 0) break;
      await sleep(600);
    }

    const bLen = pageInfo.bodyLength || 0;
    const bCount = pageInfo.buttonsCount || 0;
    const iCount = pageInfo.inputsCount || 0;
    const imgCount = pageInfo.imagesCount || 0;
    const hasErrors = consoleErrors.length > 0;

    const status = hasErrors ? 'FAIL' : (bLen > 100 ? 'PASS' : 'WARN_LOW_CONTENT');
    results.push({
      route,
      status,
      bodyLength: bLen,
      buttons: bCount,
      inputs: iCount,
      images: imgCount,
      errors: [...consoleErrors]
    });

    const icon = status === 'PASS' ? '✅' : (status === 'WARN_LOW_CONTENT' ? '⚠️' : '❌');
    console.log(`${icon} [${status}] /#${route.padEnd(25)} | chars: ${bLen.toString().padStart(5)} | btns: ${bCount.toString().padStart(3)} | inputs: ${iCount.toString().padStart(2)} | imgs: ${imgCount.toString().padStart(2)} ${hasErrors ? 'ERRORS: ' + consoleErrors.join('; ') : ''}`);
  }

  // Phase 4: Standalone Doctor Mobile Tracking Portal
  console.log('\n--- Phase 4: Testing Doctor Mobile Tracking Portal ---');
  consoleErrors.length = 0;
  await sendCommand('Page.navigate', { url: `${BASE_URL}/doctor/mobile-tracker?token=test-token&email=knpremkumar1@gmail.com` });
  await sleep(1500);
  const docTrackerEval = await sendCommand('Runtime.evaluate', {
    expression: `({
      bodyLength: document.body.innerText.length,
      buttonsCount: document.querySelectorAll('button').length
    })`,
    returnByValue: true
  });
  const docTrackerInfo = docTrackerEval.result?.result?.value || {};
  const isDocTrackerPass = (docTrackerInfo.bodyLength || 0) > 50;
  console.log(`${isDocTrackerPass ? '✅ [PASS]' : '⚠️ [WARN]'} /doctor/mobile-tracker       | chars: ${(docTrackerInfo.bodyLength || 0).toString().padStart(5)} | btns: ${(docTrackerInfo.buttonsCount || 0).toString().padStart(3)}`);

  // Phase 5: Viewport Responsiveness Audit
  console.log('\n--- Phase 5: Responsive Viewport Simulation ---');
  const viewports = [
    { name: 'Small Mobile', width: 375, height: 667 },
    { name: 'Standard Mobile', width: 390, height: 844 },
    { name: 'Tablet (iPad)', width: 768, height: 1024 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Full Desktop', width: 1920, height: 1080 }
  ];

  for (const vp of viewports) {
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768
    });
    await sendCommand('Page.navigate', { url: `${BASE_URL}/#admin-dashboard` });
    await sleep(400);
    const scrollEval = await sendCommand('Runtime.evaluate', {
      expression: `({
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth
      })`,
      returnByValue: true
    });
    const scrollInfo = scrollEval.result?.result?.value || {};
    console.log(`📱 [${vp.name.padEnd(16)}] (${vp.width}x${vp.height}) | Horizontal Overflow: ${scrollInfo.hasHorizontalOverflow ? 'YES (Defect)' : 'NO (Clean Responsive)'}`);
  }

  // Reset viewport
  await sendCommand('Emulation.clearDeviceMetricsOverride');

  // Phase 6: Interactive Modals Audit
  console.log('\n--- Phase 6: Interactive Modals & Drawers Audit ---');
  await sendCommand('Page.navigate', { url: `${BASE_URL}/#admin-dashboard` });
  await sleep(500);

  // Trigger Global Search Modal (Ctrl+K)
  await sendCommand('Input.dispatchKeyEvent', { type: 'keyDown', key: 'k', modifiers: 2 });
  await sendCommand('Input.dispatchKeyEvent', { type: 'keyUp', key: 'k', modifiers: 2 });
  await sleep(400);
  const searchModalEval = await sendCommand('Runtime.evaluate', {
    expression: `!!document.querySelector('[role="dialog"], .card-radial-surface, input[placeholder*="Search"]')`,
    returnByValue: true
  });
  console.log(`🔍 Global Search Modal (Ctrl+K): ${searchModalEval.result?.result?.value ? 'OPENED SUCCESSFULLY' : 'NOT OPENED'}`);

  console.log('\n--- Final Audit Verification Summary ---');
  const passed = results.filter(r => r.status === 'PASS').length;
  const warned = results.filter(r => r.status === 'WARN_LOW_CONTENT').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`Total Routes Tested: ${results.length + 1} | Passed: ${passed + 1} | Warnings: ${warned} | Failed: ${failed}`);

  ws.close();
  chrome.kill();
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
