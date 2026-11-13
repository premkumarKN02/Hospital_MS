import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Smartphone,
  KeyRound,
  ArrowRight,
  RefreshCw,
  Lock,
  UserCheck,
  Sparkles,
  Link,
  Check,
} from 'lucide-react';
import { patientApi } from '../../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultUhid?: string;
  onSuccessLinked?: (patient: any) => void;
}

export const AadhaarConnectivityCheckModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultUhid = '',
  onSuccessLinked,
}) => {
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [uhidInput, setUhidInput] = useState(defaultUhid);
  const [step, setStep] = useState<'CHECK' | 'LINK_OTP' | 'SUCCESS'>('CHECK');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Linkage check result
  const [checkResult, setCheckResult] = useState<{
    isLinked: boolean;
    maskedAadhaar?: string;
    uhid?: string;
    patient?: any;
    message?: string;
  } | null>(null);

  // OTP flow
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('123456');
  const [generatedOtp, setGeneratedOtp] = useState('123456');
  const [abhaIdInput, setAbhaIdInput] = useState('');

  if (!isOpen) return null;

  // Format 12-digit Aadhaar input as "XXXX XXXX XXXX"
  const handleAadhaarChange = (val: string) => {
    const raw = val.replace(/[^0-9]/g, '').slice(0, 12);
    let formatted = raw;
    if (raw.length > 4 && raw.length <= 8) {
      formatted = `${raw.slice(0, 4)} ${raw.slice(4)}`;
    } else if (raw.length > 8) {
      formatted = `${raw.slice(0, 4)} ${raw.slice(4, 8)} ${raw.slice(8)}`;
    }
    setAadhaarInput(formatted);
  };

  const handleCheckConnectivity = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAadhaar = aadhaarInput.replace(/[^0-9]/g, '');
    if (cleanAadhaar.length !== 12) {
      setError('Please enter a full 12-digit Aadhaar Number');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await patientApi.checkAadhaarLink({
        aadhaar: cleanAadhaar,
        uhid: uhidInput.trim(),
      });
      const data = res.data;
      setCheckResult(data);

      if (data.isLinked) {
        // Aadhaar is already linked!
        setStep('CHECK');
      } else {
        // Aadhaar not linked, auto suggest to link now
        const last4 = cleanAadhaar.slice(-4);
        setAbhaIdInput(`${(uhidInput.trim() || 'patient').toLowerCase().replace(/[^a-z0-9]/g, '')}${last4}@abdm`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not verify Aadhaar connectivity with hospital server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = () => {
    const cleanAadhaar = aadhaarInput.replace(/[^0-9]/g, '');
    if (cleanAadhaar.length !== 12) {
      setError('Enter a valid 12-digit Aadhaar first.');
      return;
    }
    // Generate simulated 6-digit OTP
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    setOtpInput(mockOtp);
    setOtpSent(true);
    setStep('LINK_OTP');
    setError(null);
  };

  const handleVerifyAndLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAadhaar = aadhaarInput.replace(/[^0-9]/g, '');
    if (!otpInput || otpInput.trim().length < 4) {
      setError('Please enter the 6-digit verification OTP');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await patientApi.linkAadhaar({
        uhid: uhidInput.trim() || defaultUhid || 'SNHC-2024-00001',
        aadhaar: cleanAadhaar,
        otp: otpInput.trim(),
        abhaId: abhaIdInput.trim(),
        consentGiven: true,
      });

      if (res.data?.success) {
        setCheckResult({
          isLinked: true,
          maskedAadhaar: res.data.maskedAadhaar,
          uhid: res.data.uhid,
          patient: res.data.patient,
          message: res.data.message,
        });
        setStep('SUCCESS');
        if (onSuccessLinked) {
          onSuccessLinked(res.data.patient);
        }
      } else {
        setError(res.data?.message || 'Linking failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error communicating with UIDAI / Hospital verification server.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAadhaarInput('');
    setCheckResult(null);
    setStep('CHECK');
    setError(null);
    setOtpSent(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-jakarta">
                Aadhaar e-KYC Connectivity &amp; Linkage
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Check connection status or link your 12-digit Aadhaar to your Patient UHID
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: CHECK CONNECTIVITY */}
          {step === 'CHECK' && (
            <form onSubmit={handleCheckConnectivity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  12-Digit Aadhaar / Virtual ID Number
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={aadhaarInput}
                    onChange={(e) => handleAadhaarChange(e.target.value)}
                    placeholder="XXXX XXXX XXXX (e.g. 5421 8920 4920)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Privacy guaranteed: Masked preview will be generated automatically.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Hospital Patient UHID (Optional for check, required for link)
                </label>
                <input
                  type="text"
                  value={uhidInput}
                  onChange={(e) => setUhidInput(e.target.value)}
                  placeholder="e.g. SNHC-2024-00001"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Checking Connectivity...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Check Connectivity &amp; Status
                    </>
                  )}
                </button>
              </div>

              {/* Result State */}
              {checkResult && (
                <div className="mt-4 p-4 rounded-2xl border transition-all animate-in fade-in">
                  {checkResult.isLinked ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Aadhaar is ACTIVE &amp; LINKED to Hospital Record!
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60">
                        <p>Linked UHID: <span className="font-mono font-bold text-slate-900 dark:text-white">{checkResult.uhid || checkResult.patient?.patientId}</span></p>
                        <p>Masked ID: <span className="font-mono font-semibold">{checkResult.maskedAadhaar}</span></p>
                        <p>Status: <span className="text-emerald-700 dark:text-emerald-400 font-semibold">VERIFIED e-KYC</span></p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-3">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-bold">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Aadhaar Not Yet Connected
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        This Aadhaar number is currently not linked to any hospital patient record. You can link it instantly using OTP verification.
                      </p>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2"
                      >
                        <Link className="w-3.5 h-3.5" />
                        Proceed to Link Aadhaar Now
                      </button>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION & LINK */}
          {step === 'LINK_OTP' && (
            <form onSubmit={handleVerifyAndLink} className="space-y-4">
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-800 dark:text-teal-200 flex items-start gap-2">
                <Smartphone className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Simulated UIDAI OTP Dispatched</p>
                  <p className="text-[11px] text-teal-700 dark:text-teal-300 mt-0.5">
                    For demonstration, your 6-digit UIDAI e-KYC OTP is: <span className="font-mono font-bold bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border">{generatedOtp}</span>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Enter 6-Digit OTP
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Patient UHID to Connect
                </label>
                <input
                  type="text"
                  required
                  value={uhidInput}
                  onChange={(e) => setUhidInput(e.target.value)}
                  placeholder="e.g. SNHC-2024-00001"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  ABDM ABHA Address
                </label>
                <input
                  type="text"
                  value={abhaIdInput}
                  onChange={(e) => setAbhaIdInput(e.target.value)}
                  placeholder="e.g. snhc-2024-00001@abdm"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Patient gives explicit consent to link Aadhaar for ABDM health records exchange.</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('CHECK')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying &amp; Linking...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Confirm &amp; Link Aadhaar e-KYC
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 'SUCCESS' && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white font-jakarta">
                Aadhaar Connected Successfully!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                Your 12-digit Aadhaar has been securely authenticated and linked with Patient UHID{' '}
                <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{checkResult?.uhid}</span>.
              </p>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-left space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Masked Identity:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{checkResult?.maskedAadhaar}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verification Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">VERIFIED e-KYC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ABDM Registry:</span>
                  <span className="text-teal-600 dark:text-teal-300">Synchronized</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Check Another
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-semibold rounded-xl shadow-md transition hover:opacity-90"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
