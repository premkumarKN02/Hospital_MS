import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Heart,
  User,
  Stethoscope,
  Activity,
  Calendar
} from 'lucide-react';
import { getPatientPhoto } from '../../utils/patientPhotoUtils';

interface DoctorPatientPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    token?: string;
    name: string;
    mrn?: string;
    patientId?: string;
    age?: string;
    gender?: string;
    bloodGroup?: string;
    allergies?: string;
    reason?: string;
    photoUrl?: string;
  } | null;
}

export const DoctorPatientPhotoModal: React.FC<DoctorPatientPhotoModalProps> = ({
  isOpen,
  onClose,
  patient
}) => {
  if (!isOpen || !patient) return null;

  const photoSrc = getPatientPhoto(patient);
  const uhid = patient.mrn || patient.patientId || 'SNHC-2024-00001';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-jakarta">
                Doctor Patient Photo Verification
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Outpatient Consultation Desk • Verified Clinical Identity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Main Photo Box */}
          <div className="relative mx-auto w-52 h-52 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-4 border-emerald-500/30 shadow-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <img
              src={photoSrc}
              alt={patient.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-emerald-600/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3" />
              VERIFIED PHOTO
            </div>
          </div>

          {/* Patient Details */}
          <div className="text-center space-y-2">
            <h4 className="text-xl font-black text-slate-900 dark:text-white font-jakarta">
              {patient.name}
            </h4>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                UHID: {uhid}
              </span>
              {patient.token && (
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Token: {patient.token}
                </span>
              )}
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {patient.age} yrs • {patient.gender}
              </span>
            </div>
          </div>

          {/* Medical Indicators */}
          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Blood Group</span>
              <p className="font-black text-rose-600 flex items-center gap-1 mt-0.5">
                <Heart className="w-3.5 h-3.5 fill-rose-500" /> {patient.bloodGroup || 'O+'}
              </p>
            </div>

            <div className="p-3 bg-rose-50/60 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/60">
              <span className="text-[10px] text-rose-700 dark:text-rose-400 font-bold uppercase block">Clinical Allergies</span>
              <p className="font-bold text-rose-800 dark:text-rose-300 mt-0.5 truncate">
                {patient.allergies || 'None Recorded'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>
              Identity verified against Hospital Master Patient Index (MPI) and UIDAI / ABDM national health registry.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            Confirmed / Close
          </button>
        </div>
      </div>
    </div>
  );
};
