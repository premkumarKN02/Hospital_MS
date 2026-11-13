const { spawn } = require('child_process');
const http = require('http');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const cp = spawn(CHROME, ['--headless=new', '--remote-debugging-port=9222', '--no-sandbox', '--disable-gpu']);

const ROUTES_TO_TEST = [
  'landing', 'home', 'about', 'doctor', 'services', 'treatments',
  'facilities', 'appointments', 'wellness', 'blog', 'faq', 'contact'
];

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

      for (const r of ROUTES_TO_TEST) {
        await send('Page.navigate', { url: `http://localhost:5175/#${r}` });
        // Wait until body has content
        let res = {};
        for (let attempt = 0; attempt < 5; attempt++) {
          await new Promise(res => setTimeout(res, 800));
          const evalRes = await send('Runtime.evaluate', {
            expression: `({
              route: '${r}',
              title: document.title,
              h1: document.querySelector('h1, h2')?.innerText?.trim() || '',
              bodyLength: document.body.innerText?.length || 0,
              buttons: document.querySelectorAll('button').length,
              inputs: document.querySelectorAll('input').length
            })`,
            returnByValue: true
          });
          res = evalRes.result?.result?.value || {};
          if (res.bodyLength > 100) break;
        }
        console.log(`Route /#${r.padEnd(15)}: chars=${String(res.bodyLength).padStart(5)} | btns=${String(res.buttons).padStart(2)} | inpts=${String(res.inputs).padStart(2)} | heading="${res.h1?.slice(0, 40)}"`);
      }

      cp.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error('Test failed:', err);
    cp.kill();
    process.exit(1);
  }
}, 1500);
