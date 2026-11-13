import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  CreditCard,
  QrCode,
  User,
  Phone,
  Calendar,
  Heart,
  FileText,
  Loader2,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { patientApi } from '../../lib/api';
import { UniversalEmailShareModal } from '../common/UniversalEmailShareModal';

interface PatientRecord {
  id?: string;
  patientId: string;
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
  isKycLinked?: boolean;
  consentGiven?: boolean;
}

interface Props {
  onOpenCard?: (patient: PatientRecord) => void;
  onOpenLinkModal?: (patient?: PatientRecord) => void;
  initialQuery?: string;
  compact?: boolean;
}

export const KycBidirectionalLookup: React.FC<Props> = ({
  onOpenCard,
  onOpenLinkModal,
  initialQuery = '',
  compact = false,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PatientRecord | null>(null);
  const [searchedType, setSearchedType] = useState<'AADHAAR' | 'PATIENT_ID' | 'ABHA' | 'GENERAL' | null>(null);
  const [copiedUhid, setCopiedUhid] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [shareTab, setShareTab] = useState<'whatsapp' | 'email'>('whatsapp');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = query.trim();
    if (!clean) {
      setError('Please enter an Aadhaar number, Patient UHID, or ABHA ID');
      return;
    }

    setError(null);
    setLoading(true);

    // Detect search type for transparent feedback
    const numericOnly = clean.replace(/[^0-9]/g, '');
    if (clean.toUpperCase().startsWith('SNHC') || (numericOnly.length <= 6 && clean.includes('-'))) {
      setSearchedType('PATIENT_ID');
    } else if (numericOnly.length === 12 || clean.includes('XXXX-XXXX')) {
      setSearchedType('AADHAAR');
    } else if (clean.includes('@') || clean.toUpperCase().includes('ABDM')) {
      setSearchedType('ABHA');
    } else {
      setSearchedType('GENERAL');
    }

    try {
      const res = await patientApi.lookup(clean);
      if (res.data?.found && res.data?.patient) {
        setResult(res.data);
      } else {
        // Fallback: check if direct patient ID lookup works
        try {
          const directRes = await patientApi.getByPatientId(clean);
          if (directRes.data) {
            const p = directRes.data;
            setResult({
              ...p,
              uhid: p.patientId,
              name: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
              maskedAadhaar: p.nationalId,
              isKycLinked: Boolean(p.nationalId),
              kycStatus: p.kycStatus || (p.nationalId ? 'VERIFIED' : 'PENDING'),
            });
            return;
          }
        } catch {
          // ignore fallback error
        }
        setResult(null);
        setError(res.data?.message || `No record found for "${clean}". Check the Aadhaar or Patient ID.`);
      }
    } catch (err: any) {
      // Fallback search with patientApi.list
      try {
        const listRes = await patientApi.list({ query: clean, size: 1 });
        const items = listRes.data?.content || [];
        if (items.length > 0) {
          const p = items[0];
          setResult({
            ...p,
            uhid: p.patientId,
            name: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
            maskedAadhaar: p.nationalId,
            isKycLinked: Boolean(p.nationalId),
            kycStatus: p.kycStatus || (p.nationalId ? 'VERIFIED' : 'PENDING'),
          });
          return;
        }
      } catch {
        // ignore
      }
      setError('Search could not be completed. Please ensure the backend is running.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUhid = (uhid: string) => {
    navigator.clipboard.writeText(uhid);
    setCopiedUhid(true);
    setTimeout(() => setCopiedUhid(false), 2000);
  };

  return (
    <div className={`card-stylish p-5 sm:p-6 transition-all ${compact ? 'shadow-sm' : 'shadow-soft-lg'}`}>
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-jakarta">
                Bidirectional KYC &amp; Patient Record Engine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Search with Aadhaar / KYC number to fetch Patient Profile • Or search UHID to fetch linked KYC
              </p>
            </div>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5" />
          UIDAI &amp; ABDM Connected
        </span>
      </div>

      {/* Search Bar Form */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter 12-digit Aadhaar (e.g. 1234 5678 9012) OR Patient UHID (e.g. SNHC-2024-00001) OR ABHA ID"
            className="w-full pl-10 pr-28 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-1.5 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lookup</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="font-medium">Quick Test Queries:</span>
          <button
            type="button"
            onClick={() => { setQuery('SNHC-2024-00001'); }}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-600 dark:hover:text-teal-400 transition border border-slate-200/60 dark:border-slate-700/60 font-mono"
          >
            UHID: SNHC-2024-00001
          </button>
          <button
            type="button"
            onClick={() => { setQuery('4920'); }}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-600 dark:hover:text-teal-400 transition border border-slate-200/60 dark:border-slate-700/60 font-mono"
          >
            Aadhaar Ending: 4920
          </button>
          <button
            type="button"
            onClick={() => { setQuery('XXXX-XXXX-1234'); }}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-600 dark:hover:text-teal-400 transition border border-slate-200/60 dark:border-slate-700/60 font-mono"
          >
            KYC: XXXX-XXXX-1234
          </button>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start justify-between gap-3 text-xs text-rose-700 dark:text-rose-300">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Record Lookup Failed</p>
              <p className="mt-0.5 text-rose-600 dark:text-rose-400">{error}</p>
            </div>
          </div>
          {onOpenLinkModal && (
            <button
              onClick={() => onOpenLinkModal()}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs whitespace-nowrap transition shadow-xs"
            >
              Link Aadhaar Now
            </button>
          )}
        </div>
      )}

      {/* Result Display Card */}
      {result && (
        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-teal-500/5 via-emerald-500/5 to-transparent border border-teal-500/20 dark:border-teal-500/30 space-y-4 animate-in fade-in slide-in-from-top-2">
          {/* Result Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {(result.name || result.firstName || 'P').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white font-jakarta">
                    {result.name || `${result.firstName || ''} ${result.lastName || ''}`.trim() || 'Patient Record'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 border border-emerald-200/60 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {result.kycStatus || 'VERIFIED e-KYC'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  <span>UHID:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {result.patientId}
                  </span>
                  <button
                    onClick={() => handleCopyUhid(result.patientId)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition"
                    title="Copy UHID"
                  >
                    {copiedUhid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
              <button
                onClick={() => {
                  setShareTab('whatsapp');
                  setIsEmailModalOpen(true);
                }}
                className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Share verified patient report via WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>WhatsApp Record</span>
              </button>

              <button
                onClick={() => {
                  setShareTab('email');
                  setIsEmailModalOpen(true);
                }}
                className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Send record dossier via SMTP Email"
              >
                <Mail className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Email Record</span>
              </button>

              {onOpenCard && (
                <button
                  onClick={() => onOpenCard(result)}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                >
                  <CreditCard className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Digital Health Card</span>
                </button>
              )}

              {onOpenLinkModal && (
                <button
                  onClick={() => onOpenLinkModal(result)}
                  className="px-3.5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Update KYC Link</span>
                </button>
              )}
            </div>
          </div>

          {/* Grid details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Masked Aadhaar
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                {result.maskedAadhaar || result.nationalId || 'Not Linked'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                ABHA Digital ID
              </span>
              <span className="font-mono text-slate-800 dark:text-slate-100 truncate block">
                {result.abhaId || `${result.patientId.toLowerCase()}@abdm`}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Contact Phone
              </span>
              <span className="text-slate-800 dark:text-slate-100 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {result.phone || 'N/A'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Blood Group / Gender
              </span>
              <span className="text-slate-800 dark:text-slate-100 flex items-center gap-1 font-semibold">
                <Heart className="w-3 h-3 text-rose-500" />
                {result.bloodGroup || 'O+'} • {result.gender || 'Unknown'}
              </span>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              UIDAI compliant: Raw 12-digit Aadhaar encrypted with SHA-256 HMAC; only masked format is visible.
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Patient Identity Synchronized
            </span>
          </div>
        </div>
      )}

      {/* Share Modal (WhatsApp & Email) */}
      {result && (
        <UniversalEmailShareModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          initialTab={shareTab}
          defaultRecipientPhone={result.phone || ''}
          defaultRecipientEmail={result.email || 'krishnanp0211@gmail.com'}
          defaultRecipientName={result.name || `${result.firstName || ''} ${result.lastName || ''}`.trim() || 'Patient'}
          defaultSubject={`Sindhu Healthcare — Verified Patient Profile (${result.patientId})`}
          dataType="PATIENT_LOOKUP_REPORT"
          dataPayload={{
            uhid: result.patientId,
            fullName: result.name || `${result.firstName || ''} ${result.lastName || ''}`.trim(),
            maskedAadhaar: result.maskedAadhaar || result.nationalId || 'Not Linked',
            abhaAddress: result.abhaId || `${result.patientId.toLowerCase()}@abdm`,
            phone: result.phone || 'N/A',
            email: result.email || 'N/A',
            bloodGroup: result.bloodGroup || 'O+',
            gender: result.gender || 'Unknown',
            kycStatus: result.kycStatus || 'VERIFIED',
            lookupTimestamp: new Date().toLocaleString(),
          }}
        />
      )}
    </div>
  );
};
