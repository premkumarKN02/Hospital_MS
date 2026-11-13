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
      await send('Log.enable');

      ws.addEventListener('message', (e) => {
        const msg = JSON.parse(e.data);
        if (msg.method === 'Runtime.exceptionThrown') {
          console.log('EXCEPTION:', msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text);
        }
      });

      console.log('Navigating to http://localhost:5175/#landing ...');
      await send('Page.navigate', { url: 'http://localhost:5175/#landing' });
      await new Promise(r => setTimeout(r, 2000));

      const res = await send('Runtime.evaluate', {
        expression: 'JSON.stringify({ title: document.title, rootHTML: document.getElementById("root")?.innerHTML, rootChildren: document.getElementById("root")?.children.length, bodyHTML: document.body.innerHTML.slice(0, 300) })',
        returnByValue: true
      });

      console.log('DOM Evaluation:', JSON.parse(res.result?.result?.value || '{}'));
      cp.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error('Probe failed:', err);
    cp.kill();
    process.exit(1);
  }
}, 1500);
