import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor — attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/api/auth/login') || error.config?.url?.includes('/api/auth/patient-login');
      if (!isLoginRequest) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        if (window.location.hash !== '#staff-login' && window.location.hash !== '#patient-login') {
          window.location.hash = 'staff-login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// ─── Auth API ────────────────────────────────────────────────────────────────
export const authApi = {
  login: (usernameOrEmail: string, password: string) =>
    apiClient.post('/api/auth/login', { usernameOrEmail, password }),
  patientLogin: (usernameOrEmail: string, password: string) =>
    apiClient.post('/api/auth/patient-login', { usernameOrEmail, password }),
  register: (data: object) => apiClient.post('/api/auth/register', data),
  patientRegister: (data: object) => apiClient.post('/api/auth/patient-register', data),
  logout: () => apiClient.post('/api/auth/logout'),
  me: () => apiClient.get('/api/auth/me'),
};

// ─── Patient API ──────────────────────────────────────────────────────────────
export const patientApi = {
  list: (params?: object) => apiClient.get('/api/patients', { params }),
  get: (id: string) => apiClient.get(`/api/patients/${id}`),
  getByPatientId: (pid: string) => apiClient.get(`/api/patients/by-patient-id/${pid}`),
  getByNationalId: (nid: string) => apiClient.get(`/api/patients/by-national-id/${nid}`),
  lookup: (identifier: string) => apiClient.get('/api/patients/lookup', { params: { identifier } }),
  checkAadhaarLink: (data: { aadhaar: string; uhid?: string }) => apiClient.post('/api/patients/check-aadhaar-link', data),
  linkAadhaar: (data: { uhid?: string; patientId?: string; aadhaar: string; otp: string; abhaId?: string; consentGiven?: boolean }) =>
    apiClient.post('/api/patients/link-aadhaar', data),
  create: (data: object) => apiClient.post('/api/patients', data),
  update: (id: string, data: object) => apiClient.put(`/api/patients/${id}`, data),
  deactivate: (id: string) => apiClient.delete(`/api/patients/${id}`),
};

// ─── Appointment API ──────────────────────────────────────────────────────────
export const appointmentApi = {
  list: (params?: object) => apiClient.get('/api/appointments', { params }),
  today: (status?: string) => apiClient.get('/api/appointments/today', { params: { status } }),
  get: (id: string) => apiClient.get(`/api/appointments/${id}`),
  getBookedSlots: (doctorId: string, date: string) =>
    apiClient.get('/api/appointments/booked-slots', { params: { doctorId, date } }),
  create: (data: object) => apiClient.post('/api/appointments', data),
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/api/appointments/${id}/status`, null, { params: { status } }),
  cancel: (id: string, reason?: string) =>
    apiClient.delete(`/api/appointments/${id}`, { params: { reason } }),
};

// ─── Staff API ────────────────────────────────────────────────────────────────
export const staffApi = {
  listEmployees: (params?: object) => apiClient.get('/api/staff/employees', { params }),
  getEmployee: (id: string) => apiClient.get(`/api/staff/employees/${id}`),
  createEmployee: (data: object) => apiClient.post('/api/staff/employees', data),
  approveEmployee: (id: string) => apiClient.patch(`/api/staff/employees/${id}/approve`),
  rejectEmployee: (id: string) => apiClient.patch(`/api/staff/employees/${id}/reject`),
  listDoctors: (params?: object) => apiClient.get('/api/staff/doctors', { params }),
  getDoctor: (id: string) => apiClient.get(`/api/staff/doctors/${id}`),
  createDoctor: (data: object) => apiClient.post('/api/staff/doctors', data),
};

// ─── Dashboard API ─────────────────────────────────────────────────────────────
export const dashboardApi = {
  stats: () => apiClient.get('/api/dashboard/stats'),
};

// ─── Public API ─────────────────────────────────────────────────────────────────
export const publicApi = {
  doctors: () => apiClient.get('/api/public/doctors'),
  contact: (data: object) => apiClient.post('/api/public/contact', data),
  appointmentRequest: (data: object) => apiClient.post('/api/public/appointment-request', data),
};

// ─── HRMS Leaves API ────────────────────────────────────────────────────────────
export const hrmsApi = {
  getLeaves: (status?: string) =>
    apiClient.get('/api/hrms/leaves', { params: status ? { status } : {} }).catch(() => ({ data: [] })),
  applyLeave: (data: object) => apiClient.post('/api/hrms/leaves', data),
  updateLeaveStatus: (id: string, status: string) =>
    apiClient.put(`/api/hrms/leaves/${id}/status`, { status }),
  getBalances: () => apiClient.get('/api/hrms/leaves/balances').catch(() => ({ data: {} })),
};

// ─── HMS IPD Beds & Admission API ───────────────────────────────────────────────
export const ipdApi = {
  getBeds: () => apiClient.get('/api/hms/ipd/beds').catch(() => ({ data: [] })),
  admitPatient: (data: object) => apiClient.post('/api/hms/ipd/admissions', data),
  dischargePatient: (bedId: string) => apiClient.post('/api/hms/ipd/discharge', { bedId }),
  getCensus: () => apiClient.get('/api/hms/ipd/census').catch(() => ({ data: {} })),
};

// ─── ERP Pharmacy & Inventory API ───────────────────────────────────────────────
export const pharmacyApi = {
  getInventory: () => apiClient.get('/api/erp/pharmacy/inventory').catch(() => ({ data: [] })),
  dispense: (batchId: string, quantity: number) =>
    apiClient.post('/api/erp/pharmacy/dispense', { batchId, quantity }),
  stockIn: (batchId: string, quantity: number) =>
    apiClient.post('/api/erp/pharmacy/stock-in', { batchId, quantity }),
  getStats: () => apiClient.get('/api/erp/pharmacy/stats').catch(() => ({ data: {} })),
};

// ─── ERP Billing & Invoicing API ────────────────────────────────────────────────
export const billingApi = {
  getInvoices: () => apiClient.get('/api/erp/billing/invoices').catch(() => ({ data: [] })),
  createInvoice: (data: object) => apiClient.post('/api/erp/billing/invoices', data),
  recordPayment: (invoiceId: string, amount: number, paymentMode = 'CASH') =>
    apiClient.post('/api/erp/billing/payments', { invoiceId, amount, paymentMode }),
  getStats: () => apiClient.get('/api/erp/billing/stats').catch(() => ({ data: {} })),
};

// ─── Audit & Governance API ─────────────────────────────────────────────────────
export const auditApi = {
  getLogs: (entity?: string) =>
    apiClient.get('/api/audit/logs', { params: entity ? { entity } : {} }).catch(() => ({ data: [] })),
  createLog: (data: object) => apiClient.post('/api/audit/logs', data),
};

// ─── Master Patient Index & KYC API ─────────────────────────────────────────────
export const mpiApi = {
  checkDuplicate: (data: { phone?: string; firstName?: string; lastName?: string; dateOfBirth?: string; nationalId?: string }) =>
    apiClient.post('/api/patients/check-duplicate', data).catch(() => ({ data: { isDuplicateSuspected: false, matches: [] } })),
  updateKyc: (patientId: string, data: object) =>
    apiClient.post(`/api/patients/${patientId}/kyc`, data),
  getConsents: (patientId: string) =>
    apiClient.get(`/api/patients/${patientId}/consents`).catch(() => ({ data: {} })),
  lookup: (identifier: string) =>
    apiClient.get('/api/patients/lookup', { params: { identifier } }),
  checkAadhaarLink: (data: { aadhaar: string; uhid?: string }) =>
    apiClient.post('/api/patients/check-aadhaar-link', data),
  linkAadhaar: (data: { uhid?: string; patientId?: string; aadhaar: string; otp: string; abhaId?: string; consentGiven?: boolean }) =>
    apiClient.post('/api/patients/link-aadhaar', data),
};

// ─── SMTP Live Email & Data Sharing API ─────────────────────────────────────────
export const emailApi = {
  getStatus: () => apiClient.get('/api/email/status').catch(() => ({ data: { active: false } })),
  sendContact: (data: { fullName: string; phone: string; email?: string; subject?: string; message: string }) =>
    apiClient.post('/api/email/contact', data),
  shareData: (data: { recipientEmail: string; recipientName?: string; subject?: string; notes?: string; dataType?: string; dataPayload?: Record<string, any> }) =>
    apiClient.post('/api/email/share-data', data),
  sendDirect: (data: { to: string; subject?: string; message: string; isHtml?: boolean }) =>
    apiClient.post('/api/email/send', data),
};

