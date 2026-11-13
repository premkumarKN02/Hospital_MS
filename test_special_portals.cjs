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

      const portals = [
        { name: 'Doctor Mobile Tracker', url: 'http://localhost:5175/#doctor-mobile-tracker' },
        { name: 'Direct Tracker Link with Query Params', url: 'http://localhost:5175/doctor/mobile-tracker?token=doc-live-token&email=dr.priya@sindhu.health' },
        { name: 'Public OPD Request Modal', url: 'http://localhost:5175/#appointments' },
        { name: 'Doctor Radar Live Map', url: 'http://localhost:5175/#doctor-radar' }
      ];

      for (const p of portals) {
        await send('Page.navigate', { url: p.url });
        await new Promise(r => setTimeout(r, 1800));

        const res = await send('Runtime.evaluate', {
          expression: `JSON.stringify({
            name: '${p.name}',
            title: document.title,
            h1: document.querySelector('h1, h2')?.innerText?.trim() || '',
            bodyLength: document.body.innerText?.length || 0,
            buttonsCount: document.querySelectorAll('button').length,
            inputsCount: document.querySelectorAll('input').length,
            firstFewButtons: Array.from(document.querySelectorAll('button')).slice(0, 5).map(b => b.innerText.trim()).filter(Boolean)
          })`,
          returnByValue: true
        });

        console.log('Special Portal Result:', JSON.parse(res.result?.result?.value || '{}'));
      }

      cp.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error('Test error:', err);
    cp.kill();
    process.exit(1);
  }
}, 1500);
