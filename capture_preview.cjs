const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const url = 'http://localhost:5175/';
const tempFile = path.join(os.tmpdir(), 'hms_live_screenshot.png').replace(/\\/g, '/');
const outputDest = path.join(__dirname, 'hms_live_screenshot.png');

if (fs.existsSync(tempFile)) {
  try { fs.unlinkSync(tempFile); } catch(e){}
}

console.log('Capturing UI screenshot at:', url);
const proc = spawn(chromePath, [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--hide-scrollbars',
  '--virtual-time-budget=3000',
  '--window-size=1550,1100',
  `--screenshot=${tempFile}`,
  url
]);

proc.on('close', (code) => {
  console.log('Chrome finished with exit code:', code);
  setTimeout(() => {
    if (fs.existsSync(tempFile)) {
      console.log('Captured successfully! Size:', fs.statSync(tempFile).size);
      try {
        fs.copyFileSync(tempFile, outputDest);
        console.log('Copied to:', outputDest);
      } catch(err) {
        console.error('Copy error:', err.message);
      }
    } else {
      console.error('File not created at:', tempFile);
    }
  }, 1000);
});
