const http = require('http');

const payload = JSON.stringify({
  recipientEmail: 'knpremkumar1@gmail.com',
  recipientName: 'Dr. Prem Kumar (Administrator)',
  category: 'PATIENT_HEALTH_DOSSIER',
  subject: 'Sindhu Healthcare — Verified Health Dossier & On-Call Dispatch Test',
  customNotes: 'Testing direct SMTP live SSL delivery from Hospital Unified Platform.',
  dataAttributes: {
    'Hospital Base': 'Chennai Tertiary Medical City Base Hub',
    'Specialist Name': 'Dr. Prem Kumar, MS, MCh',
    'Clinical Designation': 'Chief Trauma & Transplant Surgeon',
    'Emergency Radar Status': 'ACTIVE_STREAMING',
    'Encryption Protocol': 'Port 465 SSL Active'
  }
});

const req = http.request(
  {
    hostname: 'localhost',
    port: 8080,
    path: '/api/email/share-data',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  },
  (res) => {
    let body = '';
    res.on('data', (d) => (body += d));
    res.on('end', () => {
      console.log('HTTP Status:', res.statusCode);
      console.log('Response:', body);
    });
  }
);

req.on('error', (e) => {
  console.error('Request Error:', e.message);
});

req.write(payload);
req.end();
