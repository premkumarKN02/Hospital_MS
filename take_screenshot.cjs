const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chrome = '"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"';
const url = process.argv[2] || 'http://localhost:5175/';
const outFile = process.argv[3] || path.join(__dirname, 'preview.png');

console.log('Capturing:', url, '->', outFile);
try {
  execSync(`${chrome} --headless=new --disable-gpu --no-sandbox --hide-scrollbars --window-size=1500,950 --screenshot="${outFile}" "${url}"`, { timeout: 15000 });
  if (fs.existsSync(outFile)) {
    console.log('Captured successfully! Size:', fs.statSync(outFile).size);
  } else {
    console.error('File not created');
  }
} catch (err) {
  console.error('Error capturing screenshot:', err.message);
}
