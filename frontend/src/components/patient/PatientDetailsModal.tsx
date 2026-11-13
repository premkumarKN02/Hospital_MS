import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Camera,
  Upload,
  CheckCircle2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  ShieldCheck,
  AlertCircle,
  Printer,
  Share2,
  CreditCard
} from 'lucide-react';
import { getPatientPhoto, savePatientPhoto, removePatientPhoto } from '../../utils/patientPhotoUtils';

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
  onPhotoUpdated?: (patientId: string, photoUrl: string) => void;
}

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  isOpen,
  onClose,
  patient,
  onPhotoUpdated
}) => {
  if (!isOpen || !patient) return null;

  const patientKey = patient.patientId || patient.id || 'SNHC-2024-00001';
  const [currentPhoto, setCurrentPhoto] = useState<string>(() => getPatientPhoto(patient));
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fullName = patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Patient User';
  const uhid = patient.patientId || patient.mrn || 'SNHC-2024-00001';
  const maskedAadhaar = patient.maskedAadhaar || patient.nationalId || 'XXXX-XXXX-4922';
  const abhaAddress = patient.abhaId || `${uhid.toLowerCase().replace(/[^a-z0-9]/g, '')}@abdm`;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCurrentPhoto(dataUrl);
      savePatientPhoto(patientKey, dataUrl);
      if (patient.id && patient.id !== patientKey) {
        savePatientPhoto(patient.id, dataUrl);
      }
      if (patient.patientId && patient.patientId !== patientKey) {
        savePatientPhoto(patient.patientId, dataUrl);
      }
      onPhotoUpdated?.(patientKey, dataUrl);
      showToast('Patient photo uploaded and saved successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    removePatientPhoto(patientKey);
    if (patient.id) removePatientPhoto(patient.id);
    if (patient.patientId) removePatientPhoto(patient.patientId);
    const fallback = getPatientPhoto({ ...patient, photoUrl: undefined });
    setCurrentPhoto(fallback);
    onPhotoUpdated?.(patientKey, fallback);
    showToast('Patient photo reset to standard avatar.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Toast Alert */}
        {toastMsg && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 border border-emerald-400 animate-slide-down">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-200 dark:border-blue-800">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-jakarta flex items-center gap-2">
                Patient Clinical Profile &amp; Photo ID
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                UHID: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{uhid}</span> • Master Patient Index
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Main Identity Banner with Photo Slot */}
          <div className="p-5 bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/60 dark:to-slate-800/20 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Photo Slot */}
            <div className="flex flex-col items-center flex-shrink-0 space-y-2.5">
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <img
                    src={currentPhoto}
                    alt={fullName}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                </div>

                {/* Camera Overlay Icon */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Click to upload or update patient photo"
                  className="absolute -bottom-2 -right-2 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg border-2 border-white dark:border-slate-800 transition transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Hidden file input for photo upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              {/* Upload & Remove Button Actions */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  Upload Photo
                </button>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  title="Reset to default photo"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Profile Overview Details */}
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white font-jakarta">
                    {fullName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {patient.gender || 'Male'} • DOB: {patient.dateOfBirth || '1989-03-12'}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 w-fit mx-auto sm:mx-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  UIDAI VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Blood Group</span>
                  <p className="font-black text-rose-600 flex items-center gap-1 mt-0.5">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" /> {patient.bloodGroup || 'O+'}
                  </p>
                </div>

                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">ABHA Health Address</span>
                  <p className="font-mono font-bold text-teal-600 dark:text-teal-400 truncate mt-0.5">
                    {abhaAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Demographics Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Contact &amp; Identification</span>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-semibold">{patient.phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>{patient.email || 'patient.rajesh@gmail.com'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>National ID: <span className="font-mono font-bold">{maskedAadhaar}</span></span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Residential Location</span>
              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>{patient.addressLine1 || 'Flat 4B, Emerald Heights, Shanthi Colony'}, {patient.city || 'Chennai'}, {patient.state || 'Tamil Nadu'}</span>
              </div>
              <div className="pt-1 text-[11px] text-slate-500">
                <span>Emergency Contact: <strong className="text-slate-800 dark:text-slate-200">{patient.emergencyContactName || 'Deepa Rajesh'} ({patient.emergencyContactRelation || 'SPOUSE'})</strong> - {patient.emergencyContactPhone || '+91 98765 43219'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Profile Dossier
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition"
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
};
