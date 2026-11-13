const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const url = 'http://localhost:5175/';
const tempFile = path.join(os.tmpdir(), 'voice_and_navbar_verified.png').replace(/\\/g, '/');
const outputArtifact = 'C:\\Users\\ELCOT\\.gemini\\antigravity\\brain\\3a4cf2bd-74fc-4cd9-ba7b-113dbcd0e7ae\\voice_and_navbar_verified.png';

if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

console.log('Capturing standard desktop view (1500x950)...');
const proc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--hide-scrollbars',
  '--window-size=1500,950',
  `--screenshot=${tempFile}`,
  url
]);

// Give Chrome up to 6 seconds to render and capture, then check and finish
const timer = setInterval(() => {
  if (fs.existsSync(tempFile) && fs.statSync(tempFile).size > 10000) {
    console.log('Screenshot detected! Size:', fs.statSync(tempFile).size);
    clearInterval(timer);
    try { proc.kill(); } catch (e) {}
    fs.copyFileSync(tempFile, outputArtifact);
    console.log('Copied to artifacts:', outputArtifact);
    process.exit(0);
  }
}, 500);

setTimeout(() => {
  clearInterval(timer);
  if (fs.existsSync(tempFile)) {
    console.log('Timeout reached, but file exists. Size:', fs.statSync(tempFile).size);
    fs.copyFileSync(tempFile, outputArtifact);
    console.log('Copied to artifacts:', outputArtifact);
  } else {
    console.error('File not produced in 10s');
  }
  try { proc.kill(); } catch (e) {}
  process.exit(0);
}, 10000);
