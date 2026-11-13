const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const url = 'http://localhost:5175/?copilot=true';
const tempFile = path.join(os.tmpdir(), 'copilot_section_redesigned_live.png').replace(/\\/g, '/');
const outputArtifact = 'C:\\Users\\ELCOT\\.gemini\\antigravity\\brain\\3a4cf2bd-74fc-4cd9-ba7b-113dbcd0e7ae\\copilot_section_redesigned_live.png';

if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

console.log('Capturing Copilot Drawer screenshot (1600x1200)...');
const proc = spawn(chromePath, [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--hide-scrollbars',
  '--window-size=1600,1200',
  `--screenshot=${tempFile}`,
  url
]);

proc.on('close', (code) => {
  console.log('Chrome closed with code:', code);
  if (fs.existsSync(tempFile)) {
    console.log('SUCCESS: Size:', fs.statSync(tempFile).size);
    fs.copyFileSync(tempFile, outputArtifact);
    console.log('Copied to artifacts:', outputArtifact);
  } else {
    console.error('File not found at:', tempFile);
  }
});
