const { execSync } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const url = 'https://www.behance.net/gallery/250635005/Warehouse-Management-SaaS-Dashboard-UX-UI-Design';

console.log('Taking screenshot with Chrome headless=new...');
try {
  const cmd = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --screenshot="behance_screenshot.png" --window-size=1920,3000 "${url}"`;
  execSync(cmd, { timeout: 25000 });
  console.log('Screenshot taken!');
  if (fs.existsSync('behance_screenshot.png')) {
    console.log('File size:', fs.statSync('behance_screenshot.png').size);
  }
} catch (e) {
  console.error('Error:', e.message);
}
