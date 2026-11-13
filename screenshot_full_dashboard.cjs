const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const url = 'http://localhost:5175/';
const tempFile = path.join(os.tmpdir(), 'full_page_dashboard_live.png');
const profileDir = path.join(os.tmpdir(), 'chrome_snap_profile');
const outputArtifact = 'C:\\Users\\ELCOT\\.gemini\\antigravity\\brain\\1b5cd1a8-1e11-4dda-9b22-cf6b232540d6\\dashboard_live.png';
const localCopy = 'd:\\Work\\HospitalManagementSystem\\dashboard_live.png';

if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

console.log('Capturing full canvas screenshot (1600x1800)...');
const proc = spawn(chromePath, [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--hide-scrollbars',
  `--user-data-dir=${profileDir}`,
  '--window-size=1600,1800',
  `--screenshot=${tempFile}`,
  url
]);

const timer = setTimeout(() => {
  console.log('Timeout reached, terminating Chrome...');
  try { proc.kill(); } catch (e) {}
}, 5000);

proc.on('close', (code) => {
  clearTimeout(timer);
  console.log('Chrome closed with code:', code);
  if (fs.existsSync(tempFile) && fs.statSync(tempFile).size > 0) {
    console.log('SUCCESS: Size:', fs.statSync(tempFile).size);
    fs.copyFileSync(tempFile, outputArtifact);
    fs.copyFileSync(tempFile, localCopy);
    console.log('Copied to artifacts:', outputArtifact);
  } else {
    console.error('File not found or empty at:', tempFile);
  }
});
