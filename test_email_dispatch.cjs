const http = require('http');

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 8080,
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
          } catch {
            resolve({ statusCode: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log('--- 1. Testing Live SMTP Share-Data to knpremkumar1@gmail.com ---');
  try {
    const shareRes = await postJson('/api/email/share-data', {
      recipientEmail: 'knpremkumar1@gmail.com',
      recipientName: 'Dr. Prem Kumar',
      subject: 'Sindhu Healthcare — Verified Health Dossier Test (SNHC-2024-00001)',
      dataType: 'PATIENT_HEALTH_DOSSIER',
      notes: 'Test dispatch from updated SMTP Port 587 STARTTLS pipeline.',
      dataPayload: {
        UHID: 'SNHC-2024-00001',
        Patient: 'S. Vijayalakshmi',
        BloodGroup: 'O+',
        Status: 'VERIFIED UIDAI e-KYC',
      },
    });
    console.log('Share Data Response:', JSON.stringify(shareRes, null, 2));
  } catch (err) {
    console.error('Share Data Error:', err.message);
  }

  console.log('\n--- 2. Testing Doctor Tracking Activation to knpremkumar1@gmail.com ---');
  try {
    const trackRes = await postJson('/api/doctors/tracking/request-activation', {
      doctorEmail: 'knpremkumar1@gmail.com',
    });
    console.log('Doctor Tracking Response:', JSON.stringify(trackRes, null, 2));
  } catch (err) {
    console.error('Doctor Tracking Error:', err.message);
  }
}

run();
