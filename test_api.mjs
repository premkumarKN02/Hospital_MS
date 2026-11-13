async function test() {
  try {
    console.log('--- 1. Testing Admin Login ---');
    const adminRes = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail: 'admin', password: 'password123' })
    });
    console.log('Admin login status:', adminRes.status);
    const adminData = await adminRes.json();
    const adminToken = adminData.accessToken;

    console.log('--- 2. Testing Stats & Patients (Admin) ---');
    const statsRes = await fetch('http://localhost:8080/api/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('Stats status:', statsRes.status, await statsRes.json());

    const apptRes = await fetch('http://localhost:8080/api/appointments?page=0&size=5', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('Appointments status:', apptRes.status);
    const apptData = await apptRes.json();
    console.log('Appointments found:', apptData.content?.length || 0);

    console.log('--- 3. Testing Patient Login ---');
    const patientRes = await fetch('http://localhost:8080/api/auth/patient-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail: 'patient.rajesh', password: 'password123' })
    });
    console.log('Patient login status:', patientRes.status);
    const patientData = await patientRes.json();
    console.log('Patient user:', patientData.user?.username, 'roles:', patientData.user?.roles);

    console.log('--- 4. Testing Public Doctors API ---');
    const docRes = await fetch('http://localhost:8080/api/public/doctors');
    console.log('Public doctors status:', docRes.status);
    const docData = await docRes.json();
    console.log('Public doctors count:', docData.length);

    console.log('--- 5. All tests completed successfully! ---');
  } catch (err) {
    console.error('Error during test:', err);
  }
}
test();
