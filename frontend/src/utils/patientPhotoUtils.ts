/**
 * Patient Photo Storage & Utility Manager
 * Enables dedicated photo slots for patient profiles and verified viewing for doctors.
 */

export const DEFAULT_PATIENT_PHOTOS: Record<string, string> = {
  // Rajesh Kannan / patient.rajesh
  'SNHC-2024-00001': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'SNHC-2024-00002': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  'SNHC-2024-00003': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  'patient.rajesh': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  'Rajesh Kumar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'Rajesh Kannan': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  'Sangeetha Raman': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'Murugesan Veerappan': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
};

const FALLBACK_GENERIC_PHOTO = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';

export function getPatientPhoto(patientOrId: any): string {
  if (!patientOrId) return FALLBACK_GENERIC_PHOTO;

  let key = '';
  if (typeof patientOrId === 'string') {
    key = patientOrId;
  } else {
    // If patient object has direct photoUrl or profilePictureUrl
    if (patientOrId.photoUrl) return patientOrId.photoUrl;
    if (patientOrId.profilePictureUrl) return patientOrId.profilePictureUrl;
    key = patientOrId.patientId || patientOrId.id || patientOrId.mrn || patientOrId.name || patientOrId.username || '';
  }

  // 1. Check local storage uploaded photos
  try {
    const customMap = JSON.parse(localStorage.getItem('hospital_patient_photos_v1') || '{}');
    if (customMap[key]) {
      return customMap[key];
    }
    // Also check alternate keys if available
    if (typeof patientOrId === 'object' && patientOrId !== null) {
      if (patientOrId.patientId && customMap[patientOrId.patientId]) return customMap[patientOrId.patientId];
      if (patientOrId.id && customMap[patientOrId.id]) return customMap[patientOrId.id];
      if (patientOrId.mrn && customMap[patientOrId.mrn]) return customMap[patientOrId.mrn];
      if (patientOrId.name && customMap[patientOrId.name]) return customMap[patientOrId.name];
    }
  } catch (err) {
    console.error('Error reading patient photo map:', err);
  }

  // 2. Check defaults map
  if (DEFAULT_PATIENT_PHOTOS[key]) {
    return DEFAULT_PATIENT_PHOTOS[key];
  }
  if (typeof patientOrId === 'object' && patientOrId !== null) {
    if (patientOrId.name && DEFAULT_PATIENT_PHOTOS[patientOrId.name]) {
      return DEFAULT_PATIENT_PHOTOS[patientOrId.name];
    }
    if (patientOrId.patientId && DEFAULT_PATIENT_PHOTOS[patientOrId.patientId]) {
      return DEFAULT_PATIENT_PHOTOS[patientOrId.patientId];
    }
  }

  return FALLBACK_GENERIC_PHOTO;
}

export function savePatientPhoto(key: string, dataUrl: string): void {
  if (!key || !dataUrl) return;
  try {
    const customMap = JSON.parse(localStorage.getItem('hospital_patient_photos_v1') || '{}');
    customMap[key] = dataUrl;
    localStorage.setItem('hospital_patient_photos_v1', JSON.stringify(customMap));
    // Dispatch custom event so all active views update in real time
    window.dispatchEvent(new CustomEvent('patient-photo-updated', { detail: { key, dataUrl } }));
  } catch (err) {
    console.error('Error saving patient photo:', err);
  }
}

export function removePatientPhoto(key: string): void {
  if (!key) return;
  try {
    const customMap = JSON.parse(localStorage.getItem('hospital_patient_photos_v1') || '{}');
    delete customMap[key];
    localStorage.setItem('hospital_patient_photos_v1', JSON.stringify(customMap));
    window.dispatchEvent(new CustomEvent('patient-photo-updated', { detail: { key, dataUrl: null } }));
  } catch (err) {
    console.error('Error removing patient photo:', err);
  }
}
