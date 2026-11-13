const { spawn } = require('child_process');
const http = require('http');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const cp = spawn(CHROME, ['--headless=new', '--remote-debugging-port=9222', '--no-sandbox', '--disable-gpu']);

setTimeout(async () => {
  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9222/json/list', res => {
        let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });

    const page = list.find(t => t.type === 'page') || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    const send = (m, p={}) => new Promise(r => {
      const i = id++;
      const h = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === i) { ws.removeEventListener('message', h); r(msg); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: i, method: m, params: p }));
    });

    ws.onopen = async () => {
      await send('Page.enable');
      await send('Runtime.enable');

      // Login as admin
      await send('Page.navigate', { url: 'http://localhost:5175/#hms-ipd' });
      await send('Runtime.evaluate', {
        expression: `(() => {
          localStorage.setItem('user', JSON.stringify({
            id: 'admin-1', username: 'admin', email: 'admin@sindhu.health', fullName: 'Super Admin', roles: ['ROLE_ADMIN']
          }));
        })()`
      });
      await send('Page.navigate', { url: 'http://localhost:5175/#hms-ipd' });
      await new Promise(r => setTimeout(r, 1500));

      // Switch to dark mode
      await send('Runtime.evaluate', {
        expression: `document.documentElement.classList.add('dark'); document.body.classList.add('dark');`
      });
      await new Promise(r => setTimeout(r, 500));

      // Evaluate contrast details
      const evalRes = await send('Runtime.evaluate', {
        expression: `(() => {
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
            return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]), a: match[4] !== undefined ? parseFloat(match[4]) : 1 };
          }
          function getEffectiveBg(elem) {
            let curr = elem;
            while (curr && curr !== document.body) {
              const bg = window.getComputedStyle(curr).backgroundColor;
              const p = parseRgba(bg);
              if (p && p.a > 0.5) return p;
              curr = curr.parentElement;
            }
            return { r: 15, g: 23, b: 42, a: 1 };
          }

          const findings = [];
          document.querySelectorAll('span, p, h1, h2, h3, h4, td, th, div, label').forEach(el => {
            const text = el.innerText?.trim();
            if (!text || text.length === 0 || text.length > 50 || el.children.length > 0) return;
            const style = window.getComputedStyle(el);
            const tc = parseRgba(style.color);
            if (!tc) return;
            const bg = getEffectiveBg(el);
            const l1 = getLuminance(tc.r, tc.g, tc.b);
            const l2 = getLuminance(bg.r, bg.g, bg.b);
            const c = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
            if (c < 3.0) {
              findings.push({
                text,
                color: style.color,
                bg: 'rgb(' + bg.r + ',' + bg.g + ',' + bg.b + ')',
                contrast: c.toFixed(2),
                classes: el.className
              });
            }
          });
          return findings.slice(0, 10);
        })()`,
        returnByValue: true
      });

      console.log('Sample Dark Mode Low-Contrast Items in Pharmacy:', evalRes.result?.result?.value);
      cp.kill();
      process.exit(0);
    };
  } catch (e) {
    console.error(e);
    cp.kill();
    process.exit(1);
  }
}, 1500);
