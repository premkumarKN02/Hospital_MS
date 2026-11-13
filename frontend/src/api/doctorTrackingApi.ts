import axios from 'axios';

export interface DoctorLocation {
  id: string;
  doctorEmail: string;
  doctorName: string;
  employeeCode?: string;
  specialization?: string;
  phone?: string;
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  speedKmh?: number;
  batteryLevel?: number;
  status: 'ACTIVE_STREAMING' | 'ON_CALL_STANDBY' | 'IN_TRANSIT_TO_HOSPITAL' | 'AT_CAMPUS' | 'OFFLINE';
  distanceToHospitalKm: number;
  etaMinutes: number;
  activationToken?: string;
  permissionGranted: boolean;
  permissionGrantedAt?: string;
  lastPingAt?: string;
  invitationSentAt?: string;
}

export interface ActivationResponse {
  success: boolean;
  email: string;
  phone?: string;
  doctorName: string;
  activationToken: string;
  activationLink: string;
  emailDispatched: boolean;
  whatsappDispatched?: boolean;
  whatsappMessageId?: string;
  emailWarning?: string;
}

const API_BASE = '/api/doctors/tracking';

export const doctorTrackingApi = {
  // 1. Send live activation invitation via email
  requestActivation: async (data: {
    doctorEmail: string;
    doctorName?: string;
    specialization?: string;
    phone?: string;
    originUrl?: string;
  }): Promise<ActivationResponse> => {
    const res = await axios.post<ActivationResponse>(`${API_BASE}/request-activation`, data);
    return res.data;
  },

  // 2. Verify token on mobile link click
  verifyToken: async (token: string): Promise<DoctorLocation> => {
    const res = await axios.get<DoctorLocation>(`${API_BASE}/verify-token`, {
      params: { token }
    });
    return res.data;
  },

  // 3. Grant GPS permission
  grantPermission: async (token: string): Promise<DoctorLocation> => {
    const res = await axios.post<DoctorLocation>(`${API_BASE}/grant-permission`, null, {
      params: { token }
    });
    return res.data;
  },

  // 4. Stream mobile GPS ping
  sendPing: async (data: {
    doctorEmail?: string;
    activationToken?: string;
    phone?: string;
    latitude: number;
    longitude: number;
    accuracyMeters?: number;
    speedKmh?: number;
    batteryLevel?: number;
  }): Promise<DoctorLocation> => {
    const res = await axios.post<DoctorLocation>(`${API_BASE}/ping`, data);
    return res.data;
  },

  // 5. Get all live on-call doctors for admin map
  getLiveDoctors: async (): Promise<DoctorLocation[]> => {
    const res = await axios.get<DoctorLocation[]>(`${API_BASE}/live`);
    return res.data;
  },

  // 6. Simulate transit step towards hospital
  simulateTransit: async (email: string): Promise<DoctorLocation> => {
    const res = await axios.post<DoctorLocation>(`${API_BASE}/simulate-transit`, null, {
      params: { email }
    });
    return res.data;
  },

  // 7. Delete a specific tracker
  deleteTracker: async (email: string): Promise<{ success: boolean; message: string }> => {
    const res = await axios.delete(`${API_BASE}/delete`, {
      params: { email }
    });
    return res.data;
  },

  // 8. Purge all dummy / demo locations
  clearDemoTrackers: async (): Promise<{ success: boolean; message: string }> => {
    const res = await axios.post(`${API_BASE}/clear-demo`);
    return res.data;
  },

  // 8. Relocate hub and re-align on-call doctors around user's live coordinates
  relocateHub: async (latitude: number, longitude: number, hospitalName?: string): Promise<DoctorLocation[]> => {
    const res = await axios.post<DoctorLocation[]>(`${API_BASE}/relocate-hub`, {
      latitude,
      longitude,
      hospitalName
    });
    return res.data;
  }
};

export const whatsappApi = {
  // Get UltraMsg / WhatsApp status & connected account details
  getStatus: async (): Promise<{
    enabled: boolean;
    activeProvider?: string;
    stateInstance: string;
    phone: string;
    idInstance: string;
    apiUrl: string;
    tokenMasked?: string;
    ultraMsgStatus?: any;
  }> => {
    const res = await axios.get('/api/whatsapp/status');
    return res.data;
  },

  // Get UltraMsg configuration settings
  getConfig: async (): Promise<{
    activeProvider: string;
    ultraMsgEnabled: boolean;
    ultraMsgApiUrl: string;
    ultraMsgInstanceId: string;
    ultraMsgTokenMasked: string;
    ultraMsgToken: string;
    greenApiEnabled: boolean;
    greenApiIdInstance: string;
  }> => {
    const res = await axios.get('/api/whatsapp/config');
    return res.data;
  },

  // Update UltraMsg runtime configuration
  updateConfig: async (data: {
    instanceId?: string;
    token?: string;
    apiUrl?: string;
  }): Promise<{
    success: boolean;
    message: string;
    config: any;
  }> => {
    const res = await axios.post('/api/whatsapp/config', data);
    return res.data;
  },

  // Send custom WhatsApp text message directly via UltraMsg Gateway
  sendMessage: async (phone: string, message: string): Promise<{
    success: boolean;
    idMessage?: string;
    error?: string;
    provider?: string;
    directDelivery?: boolean;
  }> => {
    const res = await axios.post('/api/whatsapp/send', { phone, message });
    return res.data;
  },

  // Send quick verification test message
  sendTest: async (phone?: string): Promise<{
    success: boolean;
    idMessage?: string;
    error?: string;
  }> => {
    const res = await axios.post('/api/whatsapp/test', null, { params: { phone } });
    return res.data;
  },

  // Send official tax invoice directly via UltraMsg Gateway
  sendInvoice: async (data: {
    phone: string;
    invoiceNo: string;
    patientName: string;
    amount: number;
    paymentMode?: string;
    summary?: string;
  }): Promise<{
    success: boolean;
    idMessage?: string;
    error?: string;
    provider?: string;
    directDelivery?: boolean;
  }> => {
    const res = await axios.post('/api/whatsapp/send-invoice', data);
    return res.data;
  },

  // Send file by URL via UltraMsg Gateway
  sendFileByUrl: async (data: {
    phone: string;
    urlFile: string;
    fileName?: string;
    caption?: string;
  }): Promise<{
    success: boolean;
    idMessage?: string;
    error?: string;
  }> => {
    const res = await axios.post('/api/whatsapp/send-file-url', data);
    return res.data;
  }
};
