import React from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Phone,
  Building
} from 'lucide-react';
import { CLINIC_CONFIG } from '../../config/clinicData';
import { PageRoute } from '../../types';

interface InsuranceGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageRoute) => void;
  lang?: 'en' | 'ta';
}

export const InsuranceGuidanceModal: React.FC<InsuranceGuidanceModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  lang = 'en'
}) => {
  if (!isOpen) return null;

  const tpaList = [
    'Star Health & Allied Insurance',
    'Care Health Insurance',
    'HDFC ERGO Health',
    'Medi Assist TPA',
    'Paramount Health TPA',
    'ICICI Lombard Health',
    'Niva Bupa Health Insurance',
    'Vidal Health TPA'
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950/60 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-950/85 border border-blue-400/30 flex items-center justify-center text-teal-300 shadow-md">
              <ShieldCheck className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {lang === 'ta' ? 'மருத்துவக் காப்பீடு & கிளைம் வழிகாட்டி' : 'Insurance, TPA & OPD Reimbursement'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {lang === 'ta'
                  ? 'வெளிநோயாளி ஆலோசனை கட்டணக் கிளைம் நடைமுறைகள்'
                  : 'How outpatient consultation billing & health insurance claims work'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Key Principle: OPD vs IPD */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 space-y-2">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-400" />
              <span>Outpatient (OPD) Consultation vs Inpatient (IPD)</span>
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs">
              Sindhu Clinic is a licensed <strong>primary care outpatient consultation clinic</strong>. Most Indian commercial health policies cover hospitalization (24+ hours inpatient). However, modern <strong>OPD Care Riders, Corporate Health Covers, and Preventive Health Benefits</strong> provide reimbursement for day-to-day doctor visits and lab tests.
            </p>
          </div>

          {/* 3 Steps to Claim Reimbursement */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-teal-300">
              3 Steps to Claim OPD Reimbursement:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
                <span className="w-6 h-6 rounded-lg bg-teal-950 border border-teal-500/40 text-teal-300 text-xs font-black flex items-center justify-center">1</span>
                <p className="font-bold text-white text-xs">Computerized Receipt</p>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Request an official printed tax receipt at our reception desk with patient name and consultation date.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
                <span className="w-6 h-6 rounded-lg bg-teal-950 border border-teal-500/40 text-teal-300 text-xs font-black flex items-center justify-center">2</span>
                <p className="font-bold text-white text-xs">Physician Prescription</p>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Keep your official prescription signed and stamped with Dr. Sindhu's Medical Council registration number.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
                <span className="w-6 h-6 rounded-lg bg-teal-950 border border-teal-500/40 text-teal-300 text-xs font-black flex items-center justify-center">3</span>
                <p className="font-bold text-white text-xs">Upload via Insurer App</p>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Submit photos of your bill and prescription on your insurer's portal for direct bank account settlement.
                </p>
              </div>
            </div>
          </div>

          {/* Supported Insurers / TPAs */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
              Common Insurers &amp; TPAs Our Patients Claim With:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {tpaList.map((tpa) => (
                <div
                  key={tpa}
                  className="p-2 rounded-xl bg-slate-950/70 border border-white/10 text-center text-[11px] text-slate-200 font-semibold"
                >
                  {tpa}
                </div>
              ))}
            </div>
          </div>

          {/* Ayushman Bharat & Government Schemes Note */}
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Ayushman Bharat (PM-JAY) &amp; CMCHIS Guidance:</strong>
              <p className="mt-0.5 leading-relaxed text-amber-200/90 text-[11px]">
                Under government guidelines, PM-JAY and Tamil Nadu CMCHIS apply primarily to empanelled secondary and tertiary surgical hospital admissions. For patients needing tertiary referral, our primary physician issues structured referral notes to the nearest empanelled government and medical college hospital facilities.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px]">Need billing assistance? Ask our reception desk.</span>
          <a
            href={CLINIC_CONFIG.phoneCallValue}
            className="text-teal-300 hover:text-white font-bold flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call {CLINIC_CONFIG.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
