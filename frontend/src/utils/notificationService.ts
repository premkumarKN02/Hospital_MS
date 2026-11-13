/**
 * ============================================================================
 * SINDHU CLINIC - NOTIFICATION SERVICE
 * ============================================================================
 * Handles automated and 1-click WhatsApp and Email notification dispatch
 * for both patients and the clinic doctor desk.
 *
 * Ensures:
 * 1. Doctor receives full patient vitals, token, appointment time, and medical reason.
 * 2. Patient receives verified appointment slip, token, doctor details, and clinic address.
 * 3. Email dispatch sends simultaneous confirmation to both Doctor and Patient (via CC).
 * 4. Contact inquiries trigger instant WhatsApp and Email notifications to both parties.
 */

import { CLINIC_CONFIG, DOCTORS } from '../config/clinicData';
import { AppointmentFormData, ContactFormData } from '../types';

export interface AppointmentNotificationData extends AppointmentFormData {
  confirmationCode: string;
  tokenNumber: number;
}

/**
 * Normalizes phone numbers into clean international format without '+', spaces, or dashes.
 * Defaults Indian 10-digit mobile numbers to country code 91.
 */
export function cleanPhoneNumber(rawPhone: string): string {
  if (!rawPhone) return '';
  const cleaned = rawPhone.replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return cleaned;
  }
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `91${cleaned.substring(1)}`;
  }
  return cleaned;
}

/**
 * Clinic / Doctor WhatsApp number from master config
 */
export const DOCTOR_WHATSAPP_NUMBER = CLINIC_CONFIG.doctorWhatsappNumber || '919876543210';

/**
 * Builds the comprehensive WhatsApp message intended for the Doctor / Clinic Reception Desk.
 */
export function buildDoctorAppointmentMessage(data: AppointmentNotificationData): string {
  const doctor = DOCTORS.find((d) => d.id === data.doctorId) || DOCTORS[0];
  const preferredChannels = data.preferredContactMethods?.length
    ? data.preferredContactMethods.join(', ')
    : 'WhatsApp, Phone';

  return `*${CLINIC_CONFIG.name.toUpperCase()} - NEW APPOINTMENT NOTIFICATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━
*Booking Reference:* ${data.confirmationCode}
*Allocated Token:* Token #${data.tokenNumber}

*PATIENT DETAILS:*
• Name: *${data.fullName.trim()}*
• Age / Gender: ${data.age.trim()} / ${data.gender || 'Not specified'}
• Phone: *+${cleanPhoneNumber(data.phone)}*
• Email: ${data.email.trim() || 'Not provided'}

*CONSULTATION DETAILS:*
• Doctor: *${doctor.name}*
• Date: *${data.preferredDate}*
• Session / Window: *${data.preferredTime}*
• Consultation Type: ${data.consultationType}
• Reason / Symptoms: ${data.reasonForVisit.trim() || 'General Medical Consultation'}
• Preferred Contact: ${preferredChannels}

━━━━━━━━━━━━━━━━━━━━━━━━━━
_Automated notification from ${CLINIC_CONFIG.name} Patient Booking Portal_`;
}

/**
 * Builds the official WhatsApp confirmation message intended for the Patient's phone.
 */
export function buildPatientAppointmentMessage(data: AppointmentNotificationData): string {
  const doctor = DOCTORS.find((d) => d.id === data.doctorId) || DOCTORS[0];
  const clinicAddress = `${CLINIC_CONFIG.address.line1}, ${CLINIC_CONFIG.address.line2}, ${CLINIC_CONFIG.address.city}`;

  return `*${CLINIC_CONFIG.name.toUpperCase()} - APPOINTMENT CONFIRMATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━
Dear *${data.fullName.trim()}*, your consultation appointment has been registered!

*Reference Code:* *${data.confirmationCode}*
*Your Token Number:* *Token #${data.tokenNumber}*

*Consulting Doctor:* ${doctor.name} (${doctor.specialization})
*Scheduled Date:* *${data.preferredDate}*
*Preferred Window:* *${data.preferredTime}*
*Consultation Type:* ${data.consultationType}

*CLINIC ADDRESS:*
${clinicAddress}
Landmark: ${CLINIC_CONFIG.address.landmarkNote}
Google Maps: ${CLINIC_CONFIG.address.mapsUrl}

*CLINIC HELPDESK:*
Phone: ${CLINIC_CONFIG.phoneDisplay}
Hours: ${CLINIC_CONFIG.timings.summary}

*IMPORTANT INSTRUCTIONS:*
1. Please arrive 10-15 minutes prior to your time window.
2. Carry all previous prescriptions, test reports, and list of current medications.
3. Show this token confirmation at the front reception counter.

We wish you good health and recovery!
_${CLINIC_CONFIG.name} Team_`;
}

/**
 * Generates direct WhatsApp Click-to-Chat deep link for the Doctor / Reception Desk.
 */
export function generateDoctorWhatsAppUrl(data: AppointmentNotificationData): string {
  const message = buildDoctorAppointmentMessage(data);
  return `https://api.whatsapp.com/send?phone=${DOCTOR_WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
}

/**
 * Generates direct WhatsApp Click-to-Chat deep link for the Patient's mobile.
 */
export function generatePatientWhatsAppUrl(data: AppointmentNotificationData): string {
  const cleanPhone = cleanPhoneNumber(data.phone);
  const message = buildPatientAppointmentMessage(data);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
}

/**
 * Builds the complete plaintext email body for the Dual Email notification.
 */
export function buildAppointmentEmailBody(data: AppointmentNotificationData): string {
  const doctor = DOCTORS.find((d) => d.id === data.doctorId) || DOCTORS[0];
  const clinicAddress = `${CLINIC_CONFIG.address.line1}, ${CLINIC_CONFIG.address.line2}, ${CLINIC_CONFIG.address.city}`;

  return `======================================================================
${CLINIC_CONFIG.name.toUpperCase()} - APPOINTMENT CONFIRMATION & CLINICAL SLIP
======================================================================

Dear ${data.fullName.trim()},

Your outpatient consultation appointment has been scheduled at ${CLINIC_CONFIG.name}.
A copy of this confirmation has been sent simultaneously to both the Patient and the Clinic Reception Desk.

APPOINTMENT SUMMARY:
----------------------------------------------------------------------
• Appointment Reference : ${data.confirmationCode}
• Outpatient Token      : Token #${data.tokenNumber}
• Consulting Physician  : ${doctor.name} (${doctor.specialization})
• Consultation Date     : ${data.preferredDate}
• Preferred Time Window : ${data.preferredTime}
• Consultation Type     : ${data.consultationType}
• Reason for Visit      : ${data.reasonForVisit.trim() || 'General Consultation'}

PATIENT RECORD:
----------------------------------------------------------------------
• Patient Name          : ${data.fullName.trim()}
• Age / Gender          : ${data.age.trim()} / ${data.gender || 'Not specified'}
• Contact Phone         : +${cleanPhoneNumber(data.phone)}
• Registered Email      : ${data.email.trim() || 'Not provided'}
• Notification Methods  : ${data.preferredContactMethods?.join(', ') || 'WhatsApp, Email'}

CLINIC LOCATION & CONTACT:
----------------------------------------------------------------------
• Address               : ${clinicAddress}
• Landmark              : ${CLINIC_CONFIG.address.landmarkNote}
• Helpline Phone        : ${CLINIC_CONFIG.phoneDisplay}
• Reception Email       : ${CLINIC_CONFIG.emailAddress}
• Google Maps           : ${CLINIC_CONFIG.address.mapsUrl}
• Clinic Timings        : ${CLINIC_CONFIG.timings.summary}

PATIENT CHECKLIST FOR VISIT:
----------------------------------------------------------------------
1. Please arrive at reception 10 to 15 minutes before your consultation window.
2. Bring your past medical records, discharge summaries, and ongoing medication strips.
3. Present this confirmation code (${data.confirmationCode}) or Token #${data.tokenNumber} at the front desk.
4. For any emergencies, call 108/112 immediately or proceed to the nearest tertiary emergency department.

Warm regards,
Sindhu Clinic Administration
${CLINIC_CONFIG.emailAddress} | ${CLINIC_CONFIG.phoneDisplay}
`;
}

/**
 * Generates pre-filled mailto: URI targeting BOTH the Doctor/Clinic and the Patient (via CC).
 */
export function generateDualEmailUrl(data: AppointmentNotificationData): string {
  const doctor = DOCTORS.find((d) => d.id === data.doctorId) || DOCTORS[0];
  const subject = `[${CLINIC_CONFIG.name}] Appointment Confirmation: ${data.fullName.trim()} - Token #${data.tokenNumber} (Ref: ${data.confirmationCode})`;
  const body = buildAppointmentEmailBody(data);
  const patientEmail = data.email.trim();

  // Send to clinic email with CC to patient email so both receive the exact thread
  const ccParam = patientEmail ? `&cc=${encodeURIComponent(patientEmail)}` : '';

  return `mailto:${encodeURIComponent(CLINIC_CONFIG.emailAddress)}?subject=${encodeURIComponent(subject)}${ccParam}&body=${encodeURIComponent(body)}`;
}

/**
 * ============================================================================
 * CONTACT & INQUIRY FORM NOTIFICATIONS
 * ============================================================================
 */

export function buildDoctorInquiryMessage(data: ContactFormData): string {
  return `*${CLINIC_CONFIG.name.toUpperCase()} - NEW WEBSITE INQUIRY*
━━━━━━━━━━━━━━━━━━━━━━━━━━
*From:* *${data.fullName.trim()}*
*Phone:* *+${cleanPhoneNumber(data.phone)}*
*Email:* ${data.email.trim() || 'Not provided'}
*Subject:* *${data.subject}*

*MESSAGE CONTENT:*
"${data.message.trim()}"

━━━━━━━━━━━━━━━━━━━━━━━━━━
_Received via Sindhu Clinic Contact Portal_`;
}

export function buildPatientInquiryMessage(data: ContactFormData): string {
  return `*${CLINIC_CONFIG.name.toUpperCase()} - INQUIRY ACKNOWLEDGMENT*
━━━━━━━━━━━━━━━━━━━━━━━━━━
Dear *${data.fullName.trim()}*, thank you for reaching out to ${CLINIC_CONFIG.name}!

We have received your inquiry regarding *"${data.subject}"*.
Our clinic team will review your query and contact you at *+${cleanPhoneNumber(data.phone)}* during clinic operating hours.

Clinic Address: ${CLINIC_CONFIG.address.line1}, ${CLINIC_CONFIG.address.city}
Helpline: ${CLINIC_CONFIG.phoneDisplay}
Timings: ${CLINIC_CONFIG.timings.summary}

Thank you for choosing ${CLINIC_CONFIG.name}!`;
}

export function generateDoctorInquiryWhatsAppUrl(data: ContactFormData): string {
  const message = buildDoctorInquiryMessage(data);
  return `https://api.whatsapp.com/send?phone=${DOCTOR_WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
}

export function generatePatientInquiryWhatsAppUrl(data: ContactFormData): string {
  const cleanPhone = cleanPhoneNumber(data.phone);
  const message = buildPatientInquiryMessage(data);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
}

export function generateDualInquiryEmailUrl(data: ContactFormData): string {
  const subject = `[${CLINIC_CONFIG.name} Inquiry] ${data.subject} - ${data.fullName.trim()}`;
  const body = `======================================================================
${CLINIC_CONFIG.name.toUpperCase()} - WEBSITE INQUIRY TRANSMISSION
======================================================================

Sender Name    : ${data.fullName.trim()}
Phone Number   : +${cleanPhoneNumber(data.phone)}
Email Address  : ${data.email.trim() || 'Not provided'}
Subject        : ${data.subject}

Message:
----------------------------------------------------------------------
${data.message.trim()}

----------------------------------------------------------------------
This message was submitted via the ${CLINIC_CONFIG.name} contact form.
A copy is CC'd to the sender for their records.
`;

  const patientEmail = data.email.trim();
  const ccParam = patientEmail ? `&cc=${encodeURIComponent(patientEmail)}` : '';

  return `mailto:${encodeURIComponent(CLINIC_CONFIG.emailAddress)}?subject=${encodeURIComponent(subject)}${ccParam}&body=${encodeURIComponent(body)}`;
}

/**
 * Mobile Web Share API trigger for sharing appointment slip to WhatsApp or messaging apps.
 */
export async function shareAppointmentSlip(data: AppointmentNotificationData): Promise<boolean> {
  const message = buildPatientAppointmentMessage(data);
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `${CLINIC_CONFIG.name} Appointment - Token #${data.tokenNumber}`,
        text: message,
      });
      return true;
    } catch {
      // User cancelled share or unsupported
      return false;
    }
  }
  return false;
}
