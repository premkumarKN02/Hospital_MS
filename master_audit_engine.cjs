const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5175';

// All 52 Discovered Routes
const ALL_ROUTES = [
  // 1. Landing & Public Portal
  { route: 'landing', name: 'Unified Landing & Portal Portal', category: 'Public / Gateway', auth: null },
  { route: 'home', name: 'Public Hospital Home', category: 'Public Website', auth: null },
  { route: 'about', name: 'About Hospital & Group', category: 'Public Website', auth: null },
  { route: 'doctor', name: 'Doctors & Specialists Directory', category: 'Public Website', auth: null },
  { route: 'services', name: 'Clinical Departments & Services', category: 'Public Website', auth: null },
  { route: 'treatments', name: 'Specialty Treatments & Procedures', category: 'Public Website', auth: null },
  { route: 'facilities', name: 'Infrastructure & Diagnostic Facilities', category: 'Public Website', auth: null },
  { route: 'appointments', name: 'Public Appointment Request', category: 'Public Website', auth: null },
  { route: 'wellness', name: 'Preventive Health Packages', category: 'Public Website', auth: null },
  { route: 'blog', name: 'Clinical Blog & Articles', category: 'Public Website', auth: null },
  { route: 'faq', name: 'Patient FAQ & Help Center', category: 'Public Website', auth: null },
  { route: 'contact', name: 'Contact & Branch Locator', category: 'Public Website', auth: null },
  { route: 'patient-info', name: 'Visitor Guidelines & Patient Guide', category: 'Public Website', auth: null },

  // 2. Auth Flow Pages
  { route: 'staff-login', name: 'Staff Clinical Auth Portal', category: 'Authentication', auth: null },
  { route: 'patient-login', name: 'Patient Self-Service Auth', category: 'Authentication', auth: null },
  { route: 'patient-register', name: 'Patient Self-Registration', category: 'Authentication', auth: null },

  // 3. Clinical HMS Modules
  { route: 'admin-dashboard', name: 'Executive Operations Dashboard', category: 'Executive Administration', auth: 'admin' },
  { route: 'patient-list', name: 'Patient Master Directory (UHID Registry)', category: 'HMS Clinical Care', auth: 'admin' },
  { route: 'appointment-list', name: 'Central OPD Appointment Roster', category: 'HMS Clinical Care', auth: 'admin' },
  { route: 'doctor-list', name: 'Consultant & Surgeon Roster', category: 'HMS Clinical Care', auth: 'admin' },
  { route: 'hms-opd', name: 'OPD Clinical Consultation Desk', category: 'HMS Clinical Care', auth: 'doctor' },
  { route: 'hms-ipd', name: 'IPD Ward & Bed Matrix', category: 'HMS Clinical Care', auth: 'admin' },
  { route: 'hms-ot', name: 'Operation Theatre & Surgical Suite', category: 'HMS Diagnostic & Surgical', auth: 'admin' },
  { route: 'hms-lis', name: 'Laboratory Information System (LIS)', category: 'HMS Diagnostic & Surgical', auth: 'admin' },
  { route: 'hms-ris', name: 'Radiology & Imaging System (RIS / PACS)', category: 'HMS Diagnostic & Surgical', auth: 'admin' },
  { route: 'hms-bloodbank', name: 'Blood Bank & Transfusion Logistics', category: 'HMS Diagnostic & Surgical', auth: 'admin' },
  { route: 'hms-emergency', name: 'Emergency & Trauma Triage Center', category: 'HMS Diagnostic & Surgical', auth: 'admin' },
  { route: 'doctor-radar', name: 'Doctor Real-Time Geolocation Radar', category: 'HMS Diagnostic & Surgical', auth: 'admin' },

  // 4. ERP Operations & Supply Chain
  { route: 'erp-pharmacy', name: 'Pharmacy Formulary & Batch Dispensing', category: 'ERP Supply Chain', auth: 'admin' },
  { route: 'erp-billing', name: 'Enterprise Billing & Invoicing Desk', category: 'ERP Revenue Cycle', auth: 'admin' },
  { route: 'erp-tpa-claims', name: 'TPA Health Insurance Claims Desk', category: 'ERP Revenue Cycle', auth: 'admin' },
  { route: 'erp-procurement', name: 'Material Procurement & Purchase Orders', category: 'ERP Supply Chain', auth: 'admin' },
  { route: 'erp-biomedical', name: 'Biomedical Engineering & Preventive Maintenance', category: 'ERP Asset Management', auth: 'admin' },
  { route: 'erp-cssd-infection', name: 'CSSD Sterilization & Infection Surveillance', category: 'ERP Quality & Safety', auth: 'admin' },
  { route: 'erp-finance', name: 'Cost Center & Department Financial Ledger', category: 'ERP Revenue Cycle', auth: 'admin' },

  // 5. HRMS Healthcare Workforce
  { route: 'hrms-roster', name: 'Clinical Shift Roster & On-Call Matrix', category: 'HRMS Workforce', auth: 'admin' },
  { route: 'hrms-leaves', name: 'Medical Staff Leave Approval Console', category: 'HRMS Workforce', auth: 'admin' },
  { route: 'staff-list', name: 'Employee Registry & HR Records', category: 'HRMS Workforce', auth: 'admin' },
  { route: 'hrms-payroll', name: 'Clinical Payroll, Allowances & Payslips', category: 'HRMS Workforce', auth: 'admin' },
  { route: 'hrms-credentialing', name: 'NABH Doctor Credentialing & Privileging', category: 'HRMS Workforce', auth: 'admin' },

  // 6. CRM & Patient Engagement
  { route: 'crm-pipeline', name: 'Patient Care Leads & Pipeline Funnel', category: 'CRM & Outreach', auth: 'admin' },
  { route: 'crm-feedback', name: 'Patient NPS Experience & Grievance Desk', category: 'CRM & Outreach', auth: 'admin' },
  { route: 'crm-health-packages', name: 'Preventive Health Checkup Bundles', category: 'CRM & Outreach', auth: 'admin' },
  { route: 'crm-referrals', name: 'Doctor & Partner Clinic Referral Network', category: 'CRM & Outreach', auth: 'admin' },

  // 7. Clinical Governance & Safety
  { route: 'admin-incidents', name: 'Clinical Incident & Sentinel Event Log', category: 'Governance & Safety', auth: 'admin' },
  { route: 'admin-compliance', name: 'NABH / JCI Statutory Compliance Tracker', category: 'Governance & Safety', auth: 'admin' },

  // 8. Patient Self-Service Portal
  { route: 'patient-dashboard', name: 'Patient Personal Health Dashboard', category: 'Patient Portal', auth: 'patient' },
  { route: 'book-appointment', name: 'Patient Direct Clinic Booking', category: 'Patient Portal', auth: 'patient' },
  { route: 'my-appointments', name: 'Patient Consultation History & Slips', category: 'Patient Portal', auth: 'patient' },
  { route: 'my-records', name: 'Patient Electronic Health Records (EHR)', category: 'Patient Portal', auth: 'patient' },

  // 9. Error / Fallback
  { route: 'not-found', name: '404 Unified Recovery Page', category: 'System Error', auth: null }
];

const VIEWPORTS = [
  { name: 'Desktop (1920x1080)', width: 1920, height: 1080 },
  { name: 'Laptop (1366x768)', width: 1366, height: 768 },
  { name: 'Tablet (768x1024)', width: 768, height: 1024 },
  { name: 'Mobile Large (414x896)', width: 414, height: 896 },
  { name: 'Mobile Small (375x667)', width: 375, height: 667 }
];

// Helper to fetch JSON from CDP endpoint
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

// Color Luminance & WCAG Contrast Calculation Function (injected into browser DOM)
const CONTRAST_AUDIT_EXPR = `
(() => {
  function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function parseRgba(str) {
    if (!str) return null;
    const match = str.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
    if (!match) return null;
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: match[4] !== undefined ? parseFloat(match[4]) : 1
    };
  }

  function getEffectiveBackground(elem) {
    let curr = elem;
    while (curr && curr !== document.body) {
      const bg = window.getComputedStyle(curr).backgroundColor;
      const parsed = parseRgba(bg);
      if (parsed && parsed.a > 0.5) {
        return parsed;
      }
      curr = curr.parentElement;
    }
    // Default body bg
    const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
    return isDark ? { r: 15, g: 23, b: 42, a: 1 } : { r: 255, g: 255, b: 255, a: 1 };
  }

  const issues = [];
  const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, td, th, input, textarea');

  let examinedCount = 0;
  let transparentCount = 0;
  let lowContrastCount = 0;

  for (const el of allElements) {
    const text = el.innerText?.trim();
    if (!text || text.length === 0) continue;
    examinedCount++;

    const style = window.getComputedStyle(el);
    const opacity = parseFloat(style.opacity);
    const color = style.color;
    const textColor = parseRgba(color);
    const fontSize = parseFloat(style.fontSize);
    const fontWeight = parseInt(style.fontWeight) || 400;
    const isLargeText = fontSize >= 24 || (fontSize >= 18.5 && fontWeight >= 700);

    // 1. Extreme Opacity / Transparency check
    if (opacity < 0.4 && opacity > 0) {
      transparentCount++;
      issues.push({
        type: 'TRANSPARENT_TEXT',
        severity: opacity < 0.2 ? 'S1' : 'S2',
        element: el.tagName.toLowerCase(),
        text: text.slice(0, 60),
        opacity: opacity,
        color: color,
        location: el.className || 'no-class'
      });
    }

    // 2. Alpha transparency in text color
    if (textColor && textColor.a < 0.4 && textColor.a > 0) {
      transparentCount++;
      issues.push({
        type: 'FADED_ALPHA_COLOR',
        severity: textColor.a < 0.2 ? 'S1' : 'S2',
        element: el.tagName.toLowerCase(),
        text: text.slice(0, 60),
        alpha: textColor.a,
        color: color,
        location: el.className || 'no-class'
      });
    }

    // 3. Contrast calculation against effective background
    if (textColor && textColor.a >= 0.4) {
      const bg = getEffectiveBackground(el);
      const lumText = getLuminance(textColor.r, textColor.g, textColor.b);
      const lumBg = getLuminance(bg.r, bg.g, bg.b);
      const L1 = Math.max(lumText, lumBg);
      const L2 = Math.min(lumText, lumBg);
      const contrast = (L1 + 0.05) / (L2 + 0.05);

      const requiredContrast = isLargeText ? 3.0 : 4.5;
      if (contrast < requiredContrast && contrast > 1.05) {
        lowContrastCount++;
        // Check if white on white or light gray on white
        if (contrast < 2.5) {
          issues.push({
            type: 'CRITICAL_LOW_CONTRAST',
            severity: 'S2',
            contrast: contrast.toFixed(2),
            required: requiredContrast,
            element: el.tagName.toLowerCase(),
            text: text.slice(0, 60),
            color: color,
            bg: 'rgb(' + bg.r + ',' + bg.g + ',' + bg.b + ')',
            location: (el.className || '').slice(0, 80)
          });
        }
      }
    }
  }

  // Check horizontal overflow
  const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth + 2;

  // Inspect all buttons
  const buttons = Array.from(document.querySelectorAll('button')).map(b => {
    const text = b.innerText?.trim() || b.getAttribute('aria-label') || b.getAttribute('title') || 'UNLABELLED_BUTTON';
    const rect = b.getBoundingClientRect();
    const style = window.getComputedStyle(b);
    return {
      text: text.slice(0, 40),
      disabled: b.disabled,
      cursor: style.cursor,
      visible: rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden',
      hasAria: !!(b.getAttribute('aria-label') || b.innerText?.trim())
    };
  });

  // Broken images
  const brokenImages = Array.from(document.querySelectorAll('img')).filter(img => {
    return img.naturalWidth === 0 && img.src && !img.src.startsWith('data:');
  }).map(img => img.src);

  return {
    examinedTextCount: examinedCount,
    issues: issues.slice(0, 15), // Top 15 issues per page
    totalIssuesFound: issues.length,
    transparentCount,
    lowContrastCount,
    buttonsCount: buttons.length,
    unlabelledButtons: buttons.filter(b => !b.hasAria).length,
    brokenImagesCount: brokenImages.length,
    brokenImages: brokenImages.slice(0, 5),
    hasHorizontalScroll,
    scrollWidth: document.documentElement.scrollWidth,
    windowWidth: window.innerWidth
  };
})()
`;

async function main() {
  console.log('================================================================');
  console.log('🩺 SINDHU NARAYANI HEALTHCARE - COMPLETE AUTOMATED QA & UI AUDIT');
  console.log('   Framework: React 18, Vite 5, Tailwind CSS, Spring Boot 3.3.4');
  console.log('   Target: ' + BASE_URL);
  console.log('================================================================\n');

  const userDataDir = path.join(os.tmpdir(), `agy_audit_${Date.now()}`);
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${userDataDir}`,
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
    console.error('Failed to attach Chrome CDP on 9222');
    chrome.kill();
    process.exit(1);
  }

  console.log(`✓ Attached to Headless Chrome DevTools Protocol (${version.Browser})`);

  const targets = await fetchJson('http://127.0.0.1:9222/json/list');
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let msgId = 1;
  const callbacks = new Map();
  const runtimeErrors = [];
  const failedRequests = [];

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
      runtimeErrors.push({
        text: details?.text || 'Uncaught error',
        desc: details?.exception?.description || '',
        url: details?.url || ''
      });
    }
    if (msg.method === 'Network.responseReceived') {
      const resp = msg.params.response;
      if (resp && resp.status >= 400 && !resp.url.includes('/api/')) {
        failedRequests.push({ url: resp.url, status: resp.status });
      }
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
  await sendCommand('Network.enable');

  // Define Mock Auth Users
  const ADMIN_USER = {
    id: 'u-admin-01',
    username: 'admin',
    email: 'admin@sindhu.health',
    fullName: 'Dr. Sundaram (Medical Director / Super Admin)',
    roles: ['ROLE_ADMIN'],
    preferredLanguage: 'en'
  };

  const PATIENT_USER = {
    id: 'u-patient-02',
    username: 'patient.rajesh',
    email: 'rajesh@example.com',
    fullName: 'Rajesh Kannan',
    roles: ['ROLE_PATIENT'],
    preferredLanguage: 'en'
  };

  const DOCTOR_USER = {
    id: 'u-doc-03',
    username: 'dr.priya',
    email: 'dr.priya@sindhu.health',
    fullName: 'Dr. Priya Sundaram',
    roles: ['ROLE_DOCTOR'],
    preferredLanguage: 'en'
  };

  // 1. Initial Page Load to initialize localStorage
  await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
  await sleep(1500);

  const routeResults = [];
  const allDefects = [];
  let defectIdCounter = 1;

  function addDefect(defect) {
    const id = `DEF-${String(defectIdCounter++).padStart(3, '0')}`;
    allDefects.push({ id, ...defect });
  }

  console.log('\n--- 1. AUDITING ALL 52 DISCOVERED ROUTES (LIGHT & DARK THEMES) ---');

  for (let idx = 0; idx < ALL_ROUTES.length; idx++) {
    const routeObj = ALL_ROUTES[idx];
    const userToInject = routeObj.auth === 'patient' ? PATIENT_USER :
                         routeObj.auth === 'doctor' ? DOCTOR_USER :
                         routeObj.auth === 'admin' ? ADMIN_USER : null;

    // Inject credentials into localStorage
    await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        if (${userToInject ? 'true' : 'false'}) {
          localStorage.setItem('accessToken', 'mock-jwt-token-active-audit');
          localStorage.setItem('refreshToken', 'mock-jwt-refresh-active-audit');
          localStorage.setItem('user', JSON.stringify(${JSON.stringify(userToInject)}));
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      })()`,
      awaitPromise: false
    });

    runtimeErrors.length = 0;
    failedRequests.length = 0;

    const targetUrl = `${BASE_URL}/#${routeObj.route}`;
    await sendCommand('Page.navigate', { url: targetUrl });
    await sleep(700);

    // Evaluate basic DOM and UI
    const evalData = await sendCommand('Runtime.evaluate', {
      expression: `({
        title: document.title,
        heading: document.querySelector('h1, h2')?.innerText?.trim() || '',
        textLength: document.body.innerText?.length || 0,
        buttons: Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean),
        inputs: document.querySelectorAll('input, select, textarea').length,
        links: document.querySelectorAll('a').length,
        images: document.querySelectorAll('img').length
      })`,
      returnByValue: true
    });

    const pageMeta = evalData.result?.result?.value || {};

    // Audit Colors, Opacity, and Contrast in Light Theme
    const lightAuditEval = await sendCommand('Runtime.evaluate', {
      expression: CONTRAST_AUDIT_EXPR,
      returnByValue: true
    });
    const lightAudit = lightAuditEval.result?.result?.value || {};

    // Toggle Dark Theme and audit
    await sendCommand('Runtime.evaluate', {
      expression: `document.documentElement.classList.add('dark'); document.body.classList.add('dark');`
    });
    await sleep(250);

    const darkAuditEval = await sendCommand('Runtime.evaluate', {
      expression: CONTRAST_AUDIT_EXPR,
      returnByValue: true
    });
    const darkAudit = darkAuditEval.result?.result?.value || {};

    // Restore Light Theme for subsequent tests
    await sendCommand('Runtime.evaluate', {
      expression: `document.documentElement.classList.remove('dark'); document.body.classList.remove('dark');`
    });

    // Check for defects
    const hasConsoleError = runtimeErrors.length > 0;
    const hasFailedReqs = failedRequests.length > 0;
    const isBlank = (pageMeta.textLength || 0) < 50;

    let routeStatus = 'PASS';
    if (hasConsoleError || isBlank) {
      routeStatus = 'FAIL';
    } else if (lightAudit.totalIssuesFound > 0 || darkAudit.totalIssuesFound > 0 || lightAudit.hasHorizontalScroll) {
      routeStatus = 'WARNING';
    }

    // Register defects if found
    if (hasConsoleError) {
      runtimeErrors.forEach(err => {
        addDefect({
          title: `Console/Runtime Exception on #${routeObj.route}`,
          module: routeObj.category,
          page: routeObj.name,
          route: `/#${routeObj.route}`,
          severity: 'S1',
          priority: 'P1',
          description: `Runtime JavaScript error: ${err.text} - ${err.desc.slice(0, 100)}`,
          impact: 'Potential broken interactions or white-screen in production',
          recommendedFix: 'Add try-catch boundary or fix property access'
        });
      });
    }

    if (lightAudit.hasHorizontalScroll) {
      addDefect({
        title: `Unintended Horizontal Scroll on #${routeObj.route}`,
        module: routeObj.category,
        page: routeObj.name,
        route: `/#${routeObj.route}`,
        severity: 'S3',
        priority: 'P2',
        description: `Content width (${lightAudit.scrollWidth}px) exceeds viewport width (${lightAudit.windowWidth}px)`,
        impact: 'Causes unwanted horizontal page wobble and awkward mobile UX',
        recommendedFix: 'Add overflow-x-hidden to outer container or fix rigid fixed-width elements'
      });
    }

    if (lightAudit.transparentCount > 0 || darkAudit.transparentCount > 0) {
      const topTrans = [...(lightAudit.issues || []), ...(darkAudit.issues || [])].find(i => i.type === 'TRANSPARENT_TEXT' || i.type === 'FADED_ALPHA_COLOR');
      if (topTrans) {
        addDefect({
          title: `Faded / Low Opacity Text on #${routeObj.route}`,
          module: routeObj.category,
          page: routeObj.name,
          route: `/#${routeObj.route}`,
          severity: topTrans.severity,
          priority: 'P2',
          description: `Text "${topTrans.text}" rendered with opacity ${topTrans.opacity || topTrans.alpha}. Location: ${topTrans.location}`,
          impact: 'Severely impaired readability for visually impaired users',
          recommendedFix: 'Replace low opacity tokens with theme-compliant high contrast slate-700 / slate-300'
        });
      }
    }

    if (lightAudit.unlabelledButtons > 0) {
      addDefect({
        title: `Unlabelled Icon-Only Buttons on #${routeObj.route}`,
        module: routeObj.category,
        page: routeObj.name,
        route: `/#${routeObj.route}`,
        severity: 'S2',
        priority: 'P2',
        description: `Found ${lightAudit.unlabelledButtons} button(s) lacking visible text or aria-label attribute`,
        impact: 'Screen readers and assistive technologies announce unlabelled buttons as generic "button"',
        recommendedFix: 'Add aria-label="..." and title="..." to all icon-only buttons'
      });
    }

    const item = {
      index: idx + 1,
      route: routeObj.route,
      name: routeObj.name,
      category: routeObj.category,
      auth: routeObj.auth || 'Public',
      status: routeStatus,
      heading: pageMeta.heading || 'N/A',
      textChars: pageMeta.textLength || 0,
      buttons: pageMeta.buttons?.length || 0,
      inputs: pageMeta.inputs || 0,
      lightContrastIssues: lightAudit.totalIssuesFound || 0,
      darkContrastIssues: darkAudit.totalIssuesFound || 0,
      unlabelledButtons: lightAudit.unlabelledButtons || 0,
      hasOverflow: lightAudit.hasHorizontalScroll || false,
      runtimeErrors: runtimeErrors.length
    };
    routeResults.push(item);

    const mark = routeStatus === 'PASS' ? '✅' : routeStatus === 'WARNING' ? '⚠️' : '❌';
    console.log(`${mark} [${String(idx + 1).padStart(2)}/52] /#${routeObj.route.padEnd(23)} | ${routeStatus.padEnd(7)} | btns: ${String(item.buttons).padStart(2)} | inpts: ${String(item.inputs).padStart(2)} | chars: ${String(item.textChars).padStart(5)} | colorIssues: ${item.lightContrastIssues + item.darkContrastIssues}`);
  }

  // 2. RESPONSIVE DESIGN TESTING ACROSS 5 VIEWPORTS
  console.log('\n--- 2. AUDITING RESPONSIVE VIEWPORTS & BREAKPOINTS ---');
  const responsiveFindings = [];

  for (const vp of VIEWPORTS) {
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768
    });
    await sleep(300);

    // Sample key operational pages
    const testPages = ['admin-dashboard', 'hms-opd', 'patient-dashboard', 'book-appointment', 'erp-pharmacy'];
    let overflowCount = 0;

    for (const tp of testPages) {
      await sendCommand('Page.navigate', { url: `${BASE_URL}/#${tp}` });
      await sleep(400);

      const check = await sendCommand('Runtime.evaluate', {
        expression: `({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasHScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
        })`,
        returnByValue: true
      });
      const res = check.result?.result?.value || {};
      if (res.hasHScroll) {
        overflowCount++;
        responsiveFindings.push({
          viewport: vp.name,
          page: tp,
          scrollWidth: res.scrollWidth,
          clientWidth: res.clientWidth,
          diff: res.scrollWidth - res.clientWidth
        });
      }
    }

    console.log(`📱 ${vp.name.padEnd(25)} : ${overflowCount === 0 ? '✅ 0 Layout Breaches' : `⚠️ ${overflowCount} Pages have Horizontal Overflow`}`);
  }

  // Reset viewport
  await sendCommand('Emulation.clearDeviceMetricsOverride');

  // 3. AUDITING GLOBAL OVERLAYS & CONTROLLERS (Search, Voice, Copilot)
  console.log('\n--- 3. AUDITING MODALS, DRAWERS & FLOATING CONTROLLERS ---');

  // Navigate to admin-dashboard
  await sendCommand('Page.navigate', { url: `${BASE_URL}/#admin-dashboard` });
  await sleep(1000);

  // A. Trigger AI Copilot Drawer via query param
  await sendCommand('Page.navigate', { url: `${BASE_URL}/?copilot=true#admin-dashboard` });
  await sleep(1000);
  const copilotCheck = await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      const drawer = document.querySelector('[role="complementary"]') || document.querySelector('.copilot-drawer') || Array.from(document.querySelectorAll('div')).find(d => d.innerText && d.innerText.includes('Clinical AI Copilot'));
      return {
        copilotRendered: !!drawer,
        title: drawer?.innerText?.slice(0, 50) || ''
      };
    })()`,
    returnByValue: true
  });
  console.log('🤖 AI Medical Copilot Drawer:', copilotCheck.result?.result?.value);

  // B. Trigger Global Search Modal (Simulate Ctrl+K)
  const searchCheck = await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true });
      window.dispatchEvent(event);
      const modal = document.querySelector('input[placeholder*="Search"]') || document.querySelector('[role="dialog"]');
      return {
        searchModalActive: !!modal,
        placeholder: modal?.getAttribute('placeholder') || ''
      };
    })()`,
    returnByValue: true
  });
  console.log('🔍 Global Search Modal (Ctrl+K):', searchCheck.result?.result?.value);

  // 4. Capture Final High-Resolution Evidence Screenshots
  console.log('\n--- 4. CAPTURING EVIDENCE SCREENSHOTS ---');
  const screenshotPages = [
    { route: 'landing', filename: 'audit_screenshot_landing.png' },
    { route: 'admin-dashboard', filename: 'audit_screenshot_admin_dashboard.png' },
    { route: 'hms-opd', filename: 'audit_screenshot_hms_opd.png' },
    { route: 'erp-pharmacy', filename: 'audit_screenshot_erp_pharmacy.png' },
    { route: 'patient-dashboard', filename: 'audit_screenshot_patient_dashboard.png' },
    { route: 'book-appointment', filename: 'audit_screenshot_book_appointment.png' }
  ];

  for (const s of screenshotPages) {
    await sendCommand('Page.navigate', { url: `${BASE_URL}/#${s.route}` });
    await sleep(1200);
    const ss = await sendCommand('Page.captureScreenshot', { format: 'png' });
    if (ss.result?.data) {
      fs.writeFileSync(path.join(__dirname, s.filename), Buffer.from(ss.result.data, 'base64'));
      console.log(`📸 Saved evidence screenshot: ${s.filename}`);
    }
  }

  // Save audit data payload
  const auditDataPayload = {
    timestamp: new Date().toISOString(),
    totalRoutes: ALL_ROUTES.length,
    testedRoutes: routeResults.length,
    routeResults,
    responsiveFindings,
    allDefects
  };

  fs.writeFileSync(path.join(__dirname, 'audit_raw_results.json'), JSON.stringify(auditDataPayload, null, 2));
  console.log(`\n💾 Saved raw audit results to audit_raw_results.json`);

  chrome.kill();
  console.log('\n✅ Automated Inspection Phase Completed Successfully!\n');
}

main().catch(err => {
  console.error('Fatal error during test audit execution:', err);
  process.exit(1);
});
