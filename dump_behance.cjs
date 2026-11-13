const { execSync } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const url = 'https://www.behance.net/gallery/250635005/Warehouse-Management-SaaS-Dashboard-UX-UI-Design';

console.log('Running Chrome headless to dump DOM...');
try {
  const cmd = `"${chromePath}" --headless --disable-gpu --dump-dom --user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${url}"`;
  const output = execSync(cmd, { maxBuffer: 50 * 1024 * 1024, timeout: 30000 }).toString();
  fs.writeFileSync('behance_dump.html', output);
  console.log('Saved behance_dump.html, length:', output.length);

  // Extract project title, project images
  const images = Array.from(new Set([...output.matchAll(/https:\/\/mir-s3-cdn-cf\.behance\.net\/project_modules\/[^\s"'<>]+/g)].map(m => m[0])));
  console.log('Found images:', images.length);
  images.forEach(img => console.log('IMG:', img));

  const title = (output.match(/<title>([^<]+)<\/title>/i) || [])[1];
  console.log('Page title:', title);
} catch (err) {
  console.error('Error running Chrome:', err.message);
}
