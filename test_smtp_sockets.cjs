const net = require('net');
const tls = require('tls');

console.log('Testing Port 587 (STARTTLS)...');
const client587 = net.createConnection({ host: 'smtp.gmail.com', port: 587 }, () => {
  console.log('Successfully connected to smtp.gmail.com:587!');
  client587.end();
});
client587.on('data', (d) => console.log('587 Greeting:', d.toString().trim()));
client587.on('error', (err) => console.error('587 Error:', err.message));

console.log('Testing Port 465 (Direct SSL)...');
const client465 = tls.connect({ host: 'smtp.gmail.com', port: 465 }, () => {
  console.log('Successfully connected to smtp.gmail.com:465!');
  client465.end();
});
client465.on('data', (d) => console.log('465 Greeting:', d.toString().trim()));
client465.on('error', (err) => console.error('465 Error:', err.message));
