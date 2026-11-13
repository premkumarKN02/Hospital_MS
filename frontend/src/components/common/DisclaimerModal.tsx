import React from 'react';
import { X, ShieldAlert, ShieldCheck, FileText } from 'lucide-react';
import { CLINIC_CONFIG } from '../../config/clinicData';

interface DisclaimerModalProps {
  isOpen: boolean;
  type: 'disclaimer' | 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-slateSubtle-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-soft-xl border border-slateSubtle-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slateSubtle-100 flex items-center justify-between bg-slateSubtle-50">
          <div className="flex items-center gap-2.5">
            {type === 'disclaimer' && <ShieldAlert className="w-5 h-5 text-amber-600" />}
            {type === 'privacy' && <ShieldCheck className="w-5 h-5 text-tealAccent-600" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-brand-700" />}
            <h3 className="font-bold text-slateSubtle-900 text-lg">
              {type === 'disclaimer' && 'Medical & Clinical Disclaimer'}
              {type === 'privacy' && 'Patient Privacy & Confidentiality Policy'}
              {type === 'terms' && 'Terms of Clinic Consultation'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slateSubtle-400 hover:text-slateSubtle-700 hover:bg-slateSubtle-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slateSubtle-600 leading-relaxed">
          {type === 'disclaimer' && (
            <>
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-medium">
                Important Emergency Warning: {CLINIC_CONFIG.emergencyNotice}
              </div>
              <p>
                The information provided on the <strong>{CLINIC_CONFIG.name}</strong> website is strictly for general informational, educational, and awareness purposes. It does NOT constitute formal medical advice, clinical diagnosis, prognosis, or therapeutic recommendation.
              </p>
              <h4 className="font-semibold text-slateSubtle-900">Physician-Patient Relationship</h4>
              <p>
                Browsing this website, submitting an appointment request, or communicating via WhatsApp/email does not establish a formal physician-patient relationship until an in-person or official teleconsultation is conducted by our registered physician.
              </p>
              <h4 className="font-semibold text-slateSubtle-900">Treatment Claims & Medications</h4>
              <p>
                Never disregard professional medical advice or delay seeking clinical examination because of something you have read on this website. Dosages, symptom guides, and diagnostic overviews must always be individualized by a qualified healthcare provider.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <p>
                At <strong>{CLINIC_CONFIG.name}</strong>, safeguarding patient dignity, health privacy, and confidentiality is our highest ethical obligation.
              </p>
              <h4 className="font-semibold text-slateSubtle-900">Data Collection & Use</h4>
              <p>
                Information submitted through our appointment booking or contact forms (including patient name, contact number, age, and reason for consultation) is collected solely for scheduling and medical triage. We never sell, lease, or distribute patient contact details to commercial third parties.
              </p>
              <h4 className="font-semibold text-slateSubtle-900">Medical Record Security</h4>
              <p>
                Prescriptions, lab findings, and consultation notes are safeguarded under strict medical confidentiality protocols. Records are accessed strictly by authorized healthcare personnel directly involved in your care.
              </p>
              <h4 className="font-semibold text-slateSubtle-900">Communication Preferences</h4>
              <p>
                Appointment confirmations and lab report updates are sent via your requested communication channel (WhatsApp/SMS/Email). You may modify your communication preferences at any time by informing reception.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p>
                By requesting an appointment or utilizing clinical services at <strong>{CLINIC_CONFIG.name}</strong>, you acknowledge and agree to our outpatient operational guidelines.
              </p>
              <h4 className="font-semibold text-slateSubtle-900">Appointments & Tokens</h4>
              <p>
                Online appointment bookings represent an appointment request. Our reception team confirms the exact appointment slot or token number based on the doctor’s schedule and clinical queue.
              </p>
              <h4 className="font-semibold text-slateSubtle-900">Consultation Timings</h4>
              <p>
                While we make every effort to maintain punctuality, medical consultations require compassionate, unhurried time. Unforeseen acute patient evaluations may occasionally cause minor schedule adjustments. We appreciate your patience.
              </p>
              <h4 className="font-semibold text-slateSubtle-900">Cancellation & Rescheduling</h4>
              <p>
                If you are unable to attend your scheduled consultation, kindly notify our front desk at least 2 hours in advance so another patient may be accommodated.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slateSubtle-100 bg-slateSubtle-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-brand-800 text-white font-medium text-sm hover:bg-brand-900 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
