import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Calendar,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  Clock,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { CLINIC_CONFIG } from '../config/clinicData';
import { PageRoute } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderNotice } from '../components/common/PlaceholderNotice';
import { AadhaarConnectivityCheckModal } from '../components/patient/AadhaarConnectivityCheckModal';

interface PatientInfoPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const PatientInfoPage: React.FC<PatientInfoPageProps> = ({ onNavigate }) => {
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);

  return (
    <div className="space-y-16 pb-20">
      {/* Breadcrumbs */}
      <Breadcrumbs currentTitle="Patient Information & Guidelines" onNavigate={onNavigate} />

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden bg-[#041628] rounded-3xl p-8 sm:p-14 text-white shadow-soft-xl">
          {/* Authentic Clinical Guidance Backdrop — Vivid & Recognizable */}
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1600"
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/98 via-slate-950/90 to-brand-950/85 pointer-events-none" />
          <div className="canva-hero-frame" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 text-tealAccent-300 text-xs font-bold backdrop-blur-md border border-teal-400/40 shadow-sm">
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Patient Care Guide</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">
              Patient Information &amp; Visit Guide
            </h1>
            <p className="text-sm sm:text-base text-white leading-relaxed font-medium drop-shadow-md">
              Everything you need to know before visiting Sindhu Clinic: what to bring, consultation steps, medical record handling, and clinic guidelines.
            </p>
          </div>
        </div>
      </section>

      {/* Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PlaceholderNotice />
      </div>

      {/* What to Bring Checklist */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slateSubtle-200 shadow-soft-md space-y-6">
          <div className="border-b border-slateSubtle-100 pb-4">
            <span className="medical-badge medical-badge-teal mb-2">Checklist</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-950">
              What to Bring to Your Consultation
            </h2>
            <p className="text-xs sm:text-sm text-slateSubtle-600 mt-1">
              Having the right documents on hand enables our physician to perform a complete, accurate clinical assessment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-container">
            <div className="perspective-card relative overflow-hidden p-6 rounded-3xl border border-white/20 shadow-xl min-h-[190px] flex flex-col justify-end group">
              <img
                src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800"
                alt="Past Medical Records"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                loading="lazy"
              />
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
              <div className="canva-frame" />
              <div className="relative z-10 space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-slate-950/85 backdrop-blur-md text-tealAccent-300 border border-white/20 flex items-center justify-center font-extrabold text-xs shadow-md">
                  1
                </div>
                <h3 className="font-extrabold text-white text-base drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">Past Medical Records</h3>
                <p className="text-xs text-white/95 font-medium leading-relaxed drop-shadow-sm">
                  Hospital discharge summaries, previous diagnoses, surgical histories, or specialist consult sheets.
                </p>
              </div>
            </div>

            <div className="perspective-card relative overflow-hidden p-6 rounded-3xl border border-white/20 shadow-xl min-h-[190px] flex flex-col justify-end group">
              <img
                src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=800"
                alt="Current Medication"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                loading="lazy"
              />
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
              <div className="canva-frame" />
              <div className="relative z-10 space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-slate-950/85 backdrop-blur-md text-tealAccent-300 border border-white/20 flex items-center justify-center font-extrabold text-xs shadow-md">
                  2
                </div>
                <h3 className="font-extrabold text-white text-base drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">Current Medication Bottles / Strips</h3>
                <p className="text-xs text-white/95 font-medium leading-relaxed drop-shadow-sm">
                  Bring actual medicine strips or an updated list of all pills, supplements, and dosages you currently take.
                </p>
              </div>
            </div>

            <div className="perspective-card relative overflow-hidden p-6 rounded-3xl border border-white/20 shadow-xl min-h-[190px] flex flex-col justify-end group">
              <img
                src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800"
                alt="Recent Lab Reports"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                loading="lazy"
              />
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
              <div className="canva-frame" />
              <div className="relative z-10 space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-slate-950/85 backdrop-blur-md text-tealAccent-300 border border-white/20 flex items-center justify-center font-extrabold text-xs shadow-md">
                  3
                </div>
                <h3 className="font-extrabold text-white text-base drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">Recent Lab &amp; Scan Reports</h3>
                <p className="text-xs text-white/95 font-medium leading-relaxed drop-shadow-sm">
                  Any blood tests, urine reports, ECGs, X-rays, or ultrasound reports conducted within the last 6 to 12 months.
                </p>
              </div>
            </div>

            <div className="perspective-card relative overflow-hidden p-6 rounded-3xl border border-white/20 shadow-xl min-h-[190px] flex flex-col justify-end group">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
                alt="Symptom Diary"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                loading="lazy"
              />
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
              <div className="canva-frame" />
              <div className="relative z-10 space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-slate-950/85 backdrop-blur-md text-tealAccent-300 border border-white/20 flex items-center justify-center font-extrabold text-xs shadow-md">
                  4
                </div>
                <h3 className="font-extrabold text-white text-base drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">Symptom Log or Diary</h3>
                <p className="text-xs text-white/95 font-medium leading-relaxed drop-shadow-sm">
                  Note when your symptoms began, potential triggers, blood pressure or home sugar logs if you maintain one.
                </p>
              </div>
            </div>

            <div className="perspective-card relative overflow-hidden p-6 rounded-3xl border border-white/20 shadow-xl min-h-[190px] flex flex-col justify-end group">
              <img
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800"
                alt="Allergy Information"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                loading="lazy"
              />
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
              <div className="canva-frame" />
              <div className="relative z-10 space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-slate-950/85 backdrop-blur-md text-tealAccent-300 border border-white/20 flex items-center justify-center font-extrabold text-xs shadow-md">
                  5
                </div>
                <h3 className="font-extrabold text-white text-base drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">Allergy Information</h3>
                <p className="text-xs text-white/95 font-medium leading-relaxed drop-shadow-sm">
                  Be prepared to state any known drug allergies (e.g. penicillin, sulfa, NSAIDs) or dietary intolerances.
                </p>
              </div>
            </div>

            <div className="perspective-card relative overflow-hidden p-6 rounded-3xl border border-white/20 shadow-xl min-h-[190px] flex flex-col justify-end group">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
                alt="Photo ID"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                loading="lazy"
              />
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
              <div className="canva-frame" />
              <div className="relative z-10 space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-slate-950/85 backdrop-blur-md text-tealAccent-300 border border-white/20 flex items-center justify-center font-extrabold text-xs shadow-md">
                  6
                </div>
                <h3 className="font-extrabold text-white text-base drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">Valid Photo ID &amp; Payment Mode</h3>
                <p className="text-xs text-white/95 font-medium leading-relaxed drop-shadow-sm">
                  Govt-issued ID for registration and your preferred payment mode (UPI, card, or cash).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation & Follow-up Policies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Consultation Process */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slateSubtle-200 shadow-soft-sm space-y-4">
            <h3 className="font-bold text-xl text-brand-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-700" />
              <span>Consultation &amp; Prescription Process</span>
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slateSubtle-600 leading-relaxed">
              <p>
                <strong>Attentive Listening:</strong> Your consultation begins with an open dialogue where you can express all your symptoms and health concerns without feeling rushed.
              </p>
              <p>
                <strong>Legible Prescriptions:</strong> Every prescription is clearly handwritten or digitally generated, detailing generic and brand names, exact meal timings, duration, and key precautions.
              </p>
              <p>
                <strong>Medication Education:</strong> Our doctor explains the therapeutic purpose of each tablet or syrup so you understand how it contributes to your recovery.
              </p>
            </div>
          </div>

          {/* Card 2: Follow-up Guidelines */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slateSubtle-200 shadow-soft-sm space-y-4">
            <h3 className="font-bold text-xl text-brand-950 flex items-center gap-2">
              <Clock className="w-5 h-5 text-tealAccent-600" />
              <span>Follow-up &amp; Report Review Policy</span>
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slateSubtle-600 leading-relaxed">
              <p>
                <strong>7-Day Follow-Up Window:</strong> A complimentary or reduced-fee follow-up review is available within 7 days of the primary consultation for the same acute episode.
              </p>
              <p>
                <strong>Lab Report Review:</strong> If diagnostic tests were ordered during your visit, you may drop by or arrange a quick review once results are generated.
              </p>
              <p>
                <strong>Chronic Disease Check-ins:</strong> Patients managing diabetes or hypertension are generally advised a routine 30 to 90-day review schedule to monitor drug efficacy.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Billing, Punctuality & Confidentiality */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 perspective-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="perspective-card relative overflow-hidden p-7 rounded-3xl border border-white/20 shadow-xl min-h-[220px] group flex flex-col justify-between">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
              alt="Payment & Billing"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
              loading="lazy"
            />
            <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
            <div className="canva-frame" />

            <div className="relative z-10 space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-950/85 backdrop-blur-md text-tealAccent-300 border border-white/20 flex items-center justify-center shadow-md">
                <CreditCard className="w-6 h-6 text-tealAccent-300" />
              </div>
              <h4 className="font-extrabold text-white text-lg drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">Payment &amp; Billing</h4>
              <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-sm">
                Transparent consultation fees with official computer-printed receipts. We accept UPI (Google Pay, PhonePe), credit/debit cards, and cash.
              </p>
            </div>
          </div>

          <div className="perspective-card relative overflow-hidden p-7 rounded-3xl border border-white/20 shadow-xl min-h-[220px] group flex flex-col justify-between">
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"
              alt="Punctuality & Tokens"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
              loading="lazy"
            />
            <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
            <div className="canva-frame" />

            <div className="relative z-10 space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-950/85 backdrop-blur-md text-tealAccent-300 border border-white/20 flex items-center justify-center shadow-md">
                <Clock className="w-6 h-6 text-tealAccent-300" />
              </div>
              <h4 className="font-extrabold text-white text-lg drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">Punctuality &amp; Tokens</h4>
              <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-sm">
                Please arrive 10 minutes before your slot. If you need to reschedule or cancel, kindly notify our front desk at least 2 hours in advance.
              </p>
            </div>
          </div>

          <div className="perspective-card relative overflow-hidden p-7 rounded-3xl border border-white/20 shadow-xl min-h-[220px] group flex flex-col justify-between">
            <img
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800"
              alt="Privacy & Data Security"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
              loading="lazy"
            />
            <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
            <div className="canva-frame" />

            <div className="relative z-10 space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-950/85 backdrop-blur-md text-tealAccent-300 border border-white/20 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6 text-tealAccent-300" />
              </div>
              <h4 className="font-extrabold text-white text-lg drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">Privacy &amp; Data Security</h4>
              <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-sm">
                Your medical history, phone number, and diagnoses are guarded under strict ethical medical secrecy. No data is shared with third parties.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ABDM & Aadhaar e-KYC Guidelines & Quick Connectivity Verification */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-teal-50 via-emerald-50/40 to-white dark:from-slate-900 dark:to-slate-800 rounded-3xl p-6 sm:p-10 border border-teal-200 dark:border-teal-800/60 shadow-soft-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-teal-200/60 dark:border-slate-700/60 pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                ABDM &amp; UIDAI Compliant e-KYC
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Aadhaar Digital Health ID &amp; Records Linkage
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Link your 12-digit Aadhaar to your Patient UHID to unify your hospital prescriptions, lab reports, and ABDM health records nationwide.
              </p>
            </div>

            <button
              onClick={() => setIsCheckModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4" />
              Check Aadhaar Link Status
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Instant Bidirectional Search
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Doctors &amp; patients can look up complete clinical history by simply providing either the Aadhaar number or the Patient UHID.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Masked UIDAI Privacy
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Raw 12-digit Aadhaar numbers are never stored in plaintext. They are irreversibly hashed; only masked format (XXXX-XXXX-1234) is maintained.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-teal-600" />
                Digital Health Smart Card
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Download or print your tamper-proof ABDM Health Card with embedded QR code for fast, touchless hospital check-ins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment CTA with Full-Bleed Canva Hero Frame */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 perspective-container">
        <div className="perspective-card relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-white/25 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 min-h-[160px]">
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1400"
            alt="Consultation Desk"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            loading="lazy"
          />
          <div className="full-bleed-card-scrim bg-gradient-to-r from-slate-950/98 via-slate-900/90 to-brand-950/85" />
          <div className="canva-hero-frame" />

          <div className="relative z-10 space-y-1 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">Ready for Your Visit?</h3>
            <p className="text-sm text-white/95 font-medium drop-shadow-sm">
              Schedule your consultation online or connect with our front desk reception.
            </p>
          </div>
          <button
            onClick={() => onNavigate('appointments')}
            className="relative z-10 btn-teal py-3.5 px-8 text-sm font-bold shadow-2xl hover:scale-105 transition-transform whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            <span>Book an Appointment</span>
          </button>
        </div>
      </section>

      {/* Aadhaar Connectivity Check Modal */}
      <AadhaarConnectivityCheckModal
        isOpen={isCheckModalOpen}
        onClose={() => setIsCheckModalOpen(false)}
      />

    </div>
  );
};
