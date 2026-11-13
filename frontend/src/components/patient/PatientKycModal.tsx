import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  CheckCircle2,
  UploadCloud,
  FileText,
  AlertCircle,
  Eye,
  X,
  Globe2,
} from 'lucide-react';

interface PatientKycModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    id: string;
    patientId: string; // UHID
    firstName: string;
    lastName: string;
    phone: string;
    nationalId?: string;
    consentGiven?: boolean;
    consentDate?: string;
    abhaId?: string;
  };
  onSaveKyc?: (data: { nationalId: string; idType: string; consentGiven: boolean; abhaId?: string; kycStatus?: string }) => void;
}

export const PatientKycModal: React.FC<PatientKycModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSaveKyc,
}) => {
  const [idType, setIdType] = useState('AADHAAR');
  const [rawId, setRawId] = useState('');
  const [treatmentConsent, setTreatmentConsent] = useState(true);
  const [diagConsent, setDiagConsent] = useState(true);
  const [telehealthConsent, setTelehealthConsent] = useState(true);
  const [insuranceConsent, setInsuranceConsent] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<{ name: string; size: string; status: string; date: string } | null>(null);
  const [documents, setDocuments] = useState<Array<{ name: string; size: string; status: string; date: string }>>([
    { name: 'National_ID_Front_Masked.pdf', size: '1.2 MB', status: 'VERIFIED', date: 'Today, 10:14 AM' },
    { name: 'Patient_Consent_Form_Signed.pdf', size: '840 KB', status: 'VERIFIED', date: 'Today, 10:15 AM' },
  ]);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  // Masking preview based on jurisdiction
  const getMaskedPreview = (val: string) => {
    if (!val) return patient.nationalId || 'XXXX-XXXX-••••';
    const clean = val.replace(/[^a-zA-Z0-9]/g, '');
    if (clean.length < 4) return 'XXXX-' + clean;
    const last4 = clean.slice(-4);
    if (idType === 'PAN') return 'XXXXX' + last4;
    if (idType === 'EMIRATES_ID') return '784-XXXX-XXXXXXX-' + clean.slice(-1);
    if (idType === 'SINGAPORE_NRIC') return 'SXXXX' + last4;
    if (idType === 'NHS_NUMBER') return 'XXX-XXX-' + last4;
    return 'XXXX-XXXX-' + last4;
  };

  const handleSave = () => {
    const masked = getMaskedPreview(rawId);
    if (onSaveKyc) {
      const uhidClean = (patient.patientId || 'patient').toLowerCase().replace(/[^a-z0-9]/g, '');
      onSaveKyc({
        nationalId: masked,
        idType,
        consentGiven: treatmentConsent && diagConsent,
        abhaId: patient.abhaId || `${uhidClean}@abdm`,
        kycStatus: 'VERIFIED',
      });
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocuments((prev) => [
        ...prev,
        {
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          status: 'VERIFIED',
          date: 'Just now',
        },
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-teal-500/10 via-cyan-500/5 to-transparent border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Privacy-Preserving KYC & Consent Dossier
                </h3>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> JCI / NABH Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Patient: <span className="font-semibold text-slate-800 dark:text-slate-200">{patient.firstName} {patient.lastName}</span> ({patient.patientId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Privacy Guarantee Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <Lock className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold text-slate-900 dark:text-white">Zero Raw Identity Storage Policy:</span> Under international healthcare data regulations, raw national identification numbers are never stored in plaintext. The platform generates an irreversible cryptographic digest for Master Patient Index deduplication and stores only the masked representation.
            </div>
          </div>

          {/* National Identity Verification Form */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-teal-500" />
              1. International Identification & Masking
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  ID Document Type
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="AADHAAR">Aadhaar (India - 12 Digits)</option>
                  <option value="PAN">PAN Card (India Tax Identification)</option>
                  <option value="EMIRATES_ID">Emirates ID (UAE - Federal Authority)</option>
                  <option value="NHS_NUMBER">NHS Number (UK - 10 Digits)</option>
                  <option value="SINGAPORE_NRIC">NRIC / FIN (Singapore)</option>
                  <option value="SAUDI_IQAMA">Iqama / Civil ID (Saudi Arabia)</option>
                  <option value="PASSPORT">International Passport (ICAO Standard)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Enter ID Number (Masked Upon Entry)
                </label>
                <input
                  type="text"
                  placeholder={idType === 'PAN' ? 'ABCDE1234F' : '12-digit or alphanumeric ID'}
                  value={rawId}
                  onChange={(e) => setRawId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Masked Database Representation
                </label>
                <div className="px-3 py-2 text-xs rounded-xl border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-mono font-bold flex items-center justify-between">
                  <span>{getMaskedPreview(rawId)}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Granular Consent Ledger */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-teal-500" />
              2. Centralized Patient Consent Ledger
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={treatmentConsent}
                  onChange={(e) => setTreatmentConsent(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">General Clinical Treatment</span>
                  <span className="text-slate-500 dark:text-slate-400">Consent for OPD diagnosis, medication prescription & clinical vitals</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={diagConsent}
                  onChange={(e) => setDiagConsent(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">Diagnostic Data Sharing</span>
                  <span className="text-slate-500 dark:text-slate-400">Sharing lab pathology & radiology PACS imaging across departments</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={telehealthConsent}
                  onChange={(e) => setTelehealthConsent(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">Telehealth & Remote Review</span>
                  <span className="text-slate-500 dark:text-slate-400">Permission for virtual follow-up calls & remote specialist consults</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={insuranceConsent}
                  onChange={(e) => setInsuranceConsent(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">Insurance / TPA Settlement</span>
                  <span className="text-slate-500 dark:text-slate-400">Release of discharge summary & bills to insurance provider for claims</span>
                </div>
              </label>
            </div>
          </div>

          {/* Secure Document Vault */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-500" />
                3. Credential Dossier & Scanned Documents
              </h4>
              <label className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 hover:bg-teal-100 cursor-pointer transition-colors">
                <UploadCloud className="w-3.5 h-3.5" />
                Upload New Doc
                <input type="file" onChange={handleUploadSim} className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
              </label>
            </div>

            <div className="space-y-2">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{doc.name}</div>
                      <div className="text-slate-400 dark:text-slate-400">Size: {doc.size} • {doc.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {doc.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                      title="View Verified Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            Consent Token: <span className="font-mono text-slate-700 dark:text-slate-300">CNS-{patient.patientId || 'UHID'}-VERIFIED</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors"
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4 text-white" /> : <ShieldCheck className="w-4 h-4" />}
              {isSaved ? 'KYC Verified & Saved!' : 'Save KYC & Consent'}
            </button>
          </div>
        </div>

        {/* Interactive Document Viewer Modal */}
        {previewDoc && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-xl">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{previewDoc.name}</h3>
                    <p className="text-[11px] text-slate-400">Encrypted Dossier Document • {previewDoc.size}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Simulated Official Identity Credential Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 text-[10px] text-slate-500">
                  <span>ISSUING JURISDICTION: {idType}</span>
                  <span className="text-emerald-600 font-bold">DIGITALLY SIGNED</span>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-400 text-[10px]">SUBJECT PATIENT NAME:</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white font-sans">{patient.firstName} {patient.lastName}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">PATIENT UHID:</span>
                    <span className="font-bold text-teal-600">{patient.patientId || 'UHID-2026-081'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">MASKED ID REF:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{getMaskedPreview(rawId)}</span>
                  </div>
                </div>
                <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[10px] text-emerald-800 dark:text-emerald-300 font-sans flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  Cryptographic verification hash matched with central healthcare trust provider.
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90"
                >
                  Close Document Viewer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
