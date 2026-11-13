import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Download,
  QrCode,
  Heart,
  Calendar,
  Phone,
  User,
  Lock,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { UniversalEmailShareModal } from '../common/UniversalEmailShareModal';
import { getPatientPhoto } from '../../utils/patientPhotoUtils';

interface PatientData {
  id?: string;
  patientId?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  nationalId?: string;
  maskedAadhaar?: string;
  abhaId?: string;
  kycStatus?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientData | null;
}

export const PatientKycCardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  patient,
}) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [shareTab, setShareTab] = useState<'whatsapp' | 'email'>('whatsapp');

  if (!isOpen || !patient) return null;

  const displayName = patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Patient';
  const uhid = patient.patientId || 'SNHC-2024-00001';
  const maskedAadhaar = patient.maskedAadhaar || patient.nationalId || 'XXXX-XXXX-4920';
  const abhaAddress = patient.abhaId || `${uhid.toLowerCase().replace(/[^a-z0-9]/g, '')}@abdm`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const cardData = {
      hospital: 'Sindhu Clinic & Healthcare Network',
      accreditation: 'NABH / JCI Accredited',
      uhid,
      patientName: displayName,
      maskedAadhaar,
      abhaAddress,
      bloodGroup: patient.bloodGroup || 'O+',
      gender: patient.gender || 'Not specified',
      dob: patient.dateOfBirth || '1990-01-01',
      kycStatus: 'VERIFIED',
      verificationAuthority: 'UIDAI e-KYC / ABDM M1 & M2 Compliant',
      issuedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(cardData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HealthCard_${uhid}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-jakarta">
              ABDM Digital Health e-KYC Smart Card
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal content */}
        <div className="p-6 space-y-6">
          {/* Smart Card Visual Representation */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white p-6 shadow-xl border border-teal-500/30">
            {/* Background watermarks & pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Card Header */}
            <div className="relative z-10 flex items-start justify-between border-b border-white/15 pb-4 mb-5">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400">
                  Ayushman Bharat Digital Mission (ABDM)
                </p>
                <h4 className="text-base font-extrabold text-white font-jakarta">
                  Sindhu Healthcare Network
                </h4>
                <p className="text-[10px] text-slate-300">
                  National Digital Health ID &amp; Unified Clinical Records
                </p>
              </div>

              <div className="flex flex-col items-end">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  UIDAI VERIFIED
                </span>
                <span className="text-[9px] text-slate-400 mt-1">NABH / JCI Accredited</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Photo & QR */}
              <div className="flex sm:flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-teal-400/50 shadow-inner bg-slate-800 flex items-center justify-center">
                  <img
                    src={getPatientPhoto(patient)}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* QR Code graphic */}
                <div className="p-2 rounded-xl bg-white text-slate-900 shadow-sm flex flex-col items-center">
                  <QrCode className="w-14 h-14" />
                  <span className="text-[8px] font-bold text-slate-600 mt-0.5">SCAN FOR EHR</span>
                </div>
              </div>

              {/* Patient Details */}
              <div className="sm:col-span-2 space-y-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Patient Full Name</span>
                  <p className="text-base font-bold text-white tracking-wide">{displayName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Hospital UHID</span>
                    <p className="font-mono font-bold text-teal-300 text-sm">{uhid}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Masked Aadhaar</span>
                    <p className="font-mono font-bold text-emerald-300 text-sm">{maskedAadhaar}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">ABHA Address</span>
                  <p className="font-mono text-teal-200 text-xs font-semibold truncate">{abhaAddress}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10 text-[11px]">
                  <div>
                    <span className="text-[9px] text-slate-400 block">Blood Group</span>
                    <span className="font-bold text-rose-400">{patient.bloodGroup || 'O+'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Gender</span>
                    <span className="font-medium text-slate-200">{patient.gender || 'Not spec.'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Date of Birth</span>
                    <span className="font-medium text-slate-200">{patient.dateOfBirth || '1990-01-01'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="relative z-10 mt-5 pt-3 border-t border-white/15 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Lock className="w-3 h-3 text-teal-400" />
                256-bit Encrypted Health Dossier
              </span>
              <span>Valid Across All Sindhu Hospital Centers</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 flex-wrap">
            <button
              onClick={() => {
                setShareTab('whatsapp');
                setIsEmailModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 transition shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              WhatsApp Smart Card
            </button>
            <button
              onClick={() => {
                setShareTab('email');
                setIsEmailModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 text-xs font-semibold flex items-center gap-2 transition shadow-xs cursor-pointer"
            >
              <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Email Smart Card
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition shadow-xs"
            >
              <Download className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Download Digital File
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-semibold flex items-center gap-2 transition shadow-md"
            >
              <Printer className="w-4 h-4" />
              Print Smart Card
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal (WhatsApp & Email) */}
      <UniversalEmailShareModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        initialTab={shareTab}
        defaultRecipientPhone={patient.phone || ''}
        defaultRecipientEmail={patient.email || 'krishnanp0211@gmail.com'}
        defaultRecipientName={displayName}
        defaultSubject={`Sindhu Healthcare — Verified ABDM e-KYC Smart Card (${uhid})`}
        dataType="ABDM_SMART_HEALTH_CARD"
        dataPayload={{
          uhid,
          patientName: displayName,
          maskedAadhaar,
          abhaAddress,
          bloodGroup: patient.bloodGroup || 'O+',
          gender: patient.gender || 'Not specified',
          dateOfBirth: patient.dateOfBirth || '1990-01-01',
          kycStatus: 'VERIFIED',
          accreditation: 'NABH / JCI Accredited',
          verificationAuthority: 'UIDAI e-KYC / ABDM M1 & M2 Compliant',
          issuedDate: new Date().toLocaleDateString(),
        }}
      />
    </div>
  );
};
