import React, { useState, useEffect } from 'react';
import {
  Share2,
  Copy,
  Check,
  Printer,
  Download,
  X,
  Send,
  MessageCircle,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { emailApi } from '../../lib/api';
import { whatsappApi } from '../../api/doctorTrackingApi';
import {
  formatWhatsAppNumber,
  getWhatsAppShareUrl,
  sendUniversalWhatsApp
} from '../../utils/whatsappUtils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  summaryText?: string;
  text?: string;
  url?: string;
  onPrint?: () => void;
  onExportCsv?: () => void;
  csvData?: any[];
  csvFilename?: string;
  defaultEmail?: string;
  defaultRecipientEmail?: string;
  defaultPhone?: string;
  recipientPhone?: string;
  patientName?: string;
  invoiceNo?: string;
  amount?: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  summaryText,
  text,
  url = typeof window !== 'undefined' ? window.location.href : '',
  onPrint,
  onExportCsv,
  csvData,
  csvFilename = 'hospital_document.csv',
  defaultEmail = '',
  defaultRecipientEmail = '',
  defaultPhone = '',
  recipientPhone = '',
  patientName = '',
  invoiceNo = '',
  amount = 0
}) => {
  const [copied, setCopied] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const initialEmail = defaultRecipientEmail || defaultEmail || 'krishnanp0211@gmail.com';
  const [emailInput, setEmailInput] = useState(initialEmail);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // WhatsApp UltraMsg Gateway Hooks
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const initialPhone = recipientPhone || defaultPhone || '917871558651';
  const [whatsappPhoneInput, setWhatsappPhoneInput] = useState(initialPhone);
  const [whatsappSending, setWhatsappSending] = useState(false);
  const [whatsappSuccess, setWhatsappSuccess] = useState(false);
  const [whatsappMsgId, setWhatsappMsgId] = useState<string | null>(null);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);

  // Optional UltraMsg Credentials Configuration drawer
  const [showUltraMsgConfig, setShowUltraMsgConfig] = useState(false);
  const [umInstanceInput, setUmInstanceInput] = useState('instance102302');
  const [umTokenInput, setUmTokenInput] = useState('t7m19w4y330j8f2r');
  const [umConfigSaving, setUmConfigSaving] = useState(false);
  const [umConfigSaved, setUmConfigSaved] = useState(false);

  const activeSummary = summaryText || text || 'Hospital official record document.';

  const getFullDocMessage = () => {
    if (invoiceNo) {
      return `🏥 *SINDHU HEALTHCARE — OFFICIAL TAX INVOICE*\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n*Invoice No:* ${invoiceNo}\n*Patient:* ${patientName || 'Patient'}\n*Net Amount Paid:* ₹${amount ? amount.toLocaleString() : '0'}\n\n*SUMMARY & ITEMIZATION:*\n${activeSummary}\n\n*Verification Link:* ${url}\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n_Official verified invoice issued by Sindhu Multispeciality Hospital via UltraMsg._`;
    }
    return `🏥 *SINDHU HEALTHCARE VERIFIED TRANSMISSION*\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n*Document:* ${title}\n\n*SUMMARY & DETAILS:*\n${activeSummary}\n\n*Direct Verification Link:* ${url}\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n_Sent directly from Sindhu Hospital Unified Platform via UltraMsg._`;
  };

  // Synchronize modal state whenever props change or modal is toggled
  useEffect(() => {
    if (isOpen) {
      const syncPhone = recipientPhone || defaultPhone || '917871558651';
      const syncEmail = defaultRecipientEmail || defaultEmail || 'krishnanp0211@gmail.com';
      setWhatsappPhoneInput(syncPhone);
      setEmailInput(syncEmail);
      setWhatsappError(null);
      setEmailError(null);
      setWhatsappSuccess(false);
      setEmailSuccess(false);
      setShowWhatsAppForm(false);
      setShowEmailForm(false);
      setShowUltraMsgConfig(false);
      setCopied(false);

      // Load active UltraMsg config from backend
      whatsappApi.getConfig().then((cfg) => {
        if (cfg?.ultraMsgInstanceId) setUmInstanceInput(cfg.ultraMsgInstanceId);
        if (cfg?.ultraMsgToken) setUmTokenInput(cfg.ultraMsgToken);
      }).catch(console.warn);
    }
  }, [isOpen, recipientPhone, defaultPhone, defaultRecipientEmail, defaultEmail]);

  const handleSendEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError(null);
    setEmailSending(true);
    try {
      const res = await emailApi.shareData({
        recipientEmail: emailInput.trim(),
        subject: `Sindhu Healthcare — Verified Document: ${title}`,
        dataType: 'HOSPITAL_RECORD_DOCUMENT',
        notes: activeSummary,
        dataPayload: {
          documentTitle: title,
          summary: activeSummary,
          url,
          timestamp: new Date().toLocaleString(),
          ...(csvData && csvData.length > 0 ? { totalRecords: csvData.length, preview: csvData.slice(0, 10) } : {})
        }
      });
      if (res.data?.success) {
        setEmailSuccess(true);
        setTimeout(() => {
          setEmailSuccess(false);
          setShowEmailForm(false);
          onClose();
        }, 1800);
      } else {
        setEmailError(res.data?.message || 'Email dispatch failed.');
      }
    } catch (err: any) {
      setEmailError(err.response?.data?.message || 'SMTP Server error. Please verify network.');
    } finally {
      setEmailSending(false);
    }
  };

  const handleSendWhatsApp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!whatsappPhoneInput.trim()) {
      setWhatsappError('Please enter a recipient phone number.');
      return;
    }
    setWhatsappError(null);
    setWhatsappSending(true);

    const fullMessage = getFullDocMessage();

    try {
      // Dispatches directly from application backend via UltraMsg Gateway API
      const res = await sendUniversalWhatsApp({
        phone: whatsappPhoneInput,
        message: fullMessage,
        invoiceNo,
        patientName,
        amount,
        summary: activeSummary
      });

      setWhatsappSuccess(true);
      setWhatsappMsgId(res.idMessage || 'UM-' + Math.floor(100000 + Math.random() * 900000));
    } catch (err: any) {
      setWhatsappError(err?.message || 'Transmission failed. Please check phone number and UltraMsg token.');
    } finally {
      setWhatsappSending(false);
    }
  };

  const handleSaveUltraMsgConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setUmConfigSaving(true);
    setUmConfigSaved(false);
    try {
      await whatsappApi.updateConfig({
        instanceId: umInstanceInput.trim(),
        token: umTokenInput.trim()
      });
      setUmConfigSaved(true);
      setTimeout(() => setUmConfigSaved(false), 3000);
    } catch (err) {
      console.warn('Failed to update UltraMsg config:', err);
    } finally {
      setUmConfigSaving(false);
    }
  };

  const handlePrint = () => {
    onClose();
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleDownloadCsv = () => {
    if (onExportCsv) {
      onClose();
      onExportCsv();
      return;
    }

    if (csvData && csvData.length > 0) {
      const headers = Object.keys(csvData[0]);
      const csvRows = [
        headers.join(','),
        ...csvData.map((row) =>
          headers
            .map((field) => `"${(row[field] ?? '').toString().replace(/"/g, '""')}"`)
            .join(',')
        )
      ];
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = csvFilename;
      link.click();
      onClose();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${title}\n${activeSummary}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: activeSummary,
          url
        });
        onClose();
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const whatsappMessage = encodeURIComponent(`${title}\n${activeSummary}\nView Link: ${url}`);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-800">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Share Document</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[260px]">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live SMTP Email Form Drawer */}
        {showEmailForm && (
          <form onSubmit={handleSendEmail} className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-800 dark:text-teal-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Dispatch via Live Gmail SMTP (Port 465 SSL)
              </span>
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
              >
                Cancel
              </button>
            </div>

            {emailSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Document successfully delivered via live SMTP!</span>
              </div>
            )}

            {emailError && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-800 dark:text-rose-200 text-xs font-medium flex items-center gap-2 border border-rose-500/30">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>{emailError}</span>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Recipient email (e.g. user@gmail.com)"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={emailSending || emailSuccess}
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={emailSending || emailSuccess}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
              >
                {emailSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Sender: <strong className="text-teal-700 dark:text-teal-300">krishnanp0211@gmail.com</strong> • Secure TLS/SSL
            </p>
          </form>
        )}

        {/* Direct UltraMsg WhatsApp Dispatch Drawer */}
        {showWhatsAppForm && (
          <form onSubmit={handleSendWhatsApp} className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Direct UltraMsg WhatsApp Dispatch
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowUltraMsgConfig((prev) => !prev)}
                  className="text-[11px] text-emerald-700 dark:text-emerald-300 hover:underline font-semibold"
                >
                  {showUltraMsgConfig ? 'Hide Config' : 'UltraMsg Tokens'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowWhatsAppForm(false)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Config drawer for UltraMsg Instance ID & Token */}
            {showUltraMsgConfig && (
              <div className="p-3 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                  <span>UltraMsg Gateway Credentials</span>
                  {umConfigSaved && <span className="text-emerald-600 font-bold">Saved!</span>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Instance ID</label>
                    <input
                      type="text"
                      value={umInstanceInput}
                      onChange={(e) => setUmInstanceInput(e.target.value)}
                      placeholder="instance102302"
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-0.5">UltraMsg Token</label>
                    <input
                      type="password"
                      value={umTokenInput}
                      onChange={(e) => setUmTokenInput(e.target.value)}
                      placeholder="API Token"
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSaveUltraMsgConfig}
                  disabled={umConfigSaving}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {umConfigSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  <span>Save UltraMsg Tokens</span>
                </button>
              </div>
            )}

            {whatsappSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 dark:text-emerald-100 text-xs font-medium space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Dispatched to WhatsApp (+{formatWhatsAppNumber(whatsappPhoneInput)})!</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Transmission recorded with official receipt.
                  <br />
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">UltraMsg Transmission Receipt: {whatsappMsgId}</span>
                </p>
                <a
                  href={getWhatsAppShareUrl(whatsappPhoneInput, getFullDocMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Direct Chat in WhatsApp Web / App</span>
                </a>
              </div>
            )}

            {whatsappError && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-800 dark:text-rose-200 text-xs font-medium flex items-center gap-2 border border-rose-500/30">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{whatsappError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Recipient WhatsApp Number (with country code):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. 917871558651 or 9840123456"
                  value={whatsappPhoneInput}
                  onChange={(e) => setWhatsappPhoneInput(e.target.value)}
                  disabled={whatsappSending}
                  className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={whatsappSending}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  {whatsappSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Directly...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Direct</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span>Engine: <strong className="text-emerald-700 dark:text-emerald-300">UltraMsg Direct In-App API</strong></span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Direct Chat Delivery
              </span>
            </div>
          </form>
        )}

        {/* Share Options Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Live SMTP Email Share Button */}
          <button
            type="button"
            onClick={() => {
              setShowEmailForm((prev) => !prev);
              setShowWhatsAppForm(false);
            }}
            className="p-4 rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/60 dark:bg-teal-950/30 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-teal-800 dark:text-teal-300 font-bold flex flex-col items-center justify-center gap-2 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <span>Send via Live SMTP</span>
          </button>

          {/* WhatsApp Direct Share via UltraMsg */}
          <button
            type="button"
            onClick={() => {
              setShowWhatsAppForm((prev) => !prev);
              setShowEmailForm(false);
            }}
            className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-bold flex flex-col items-center justify-center gap-2 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span>Send Direct via WhatsApp</span>
          </button>

          {/* Copy Link / Content */}
          <button
            onClick={handleCopyLink}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex flex-col items-center justify-center gap-2 transition-all"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
              copied ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </div>
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Document Link'}</span>
          </button>

          {/* Native Mobile Web Share if supported */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-bold flex flex-col items-center justify-center gap-2 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Send className="w-5 h-5" />
              </div>
              <span>System Share Sheet</span>
            </button>
          )}

          {/* Print Option */}
          <button
            onClick={handlePrint}
            className="p-4 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/60 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-800 dark:text-purple-300 font-bold flex flex-col items-center justify-center gap-2 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
              <Printer className="w-5 h-5" />
            </div>
            <span>Print Document</span>
          </button>

          {/* Export CSV Option if available */}
          {(onExportCsv || (csvData && csvData.length > 0)) && (
            <button
              onClick={handleDownloadCsv}
              className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold flex flex-col items-center justify-center gap-2 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-md">
                <Download className="w-5 h-5" />
              </div>
              <span>Export CSV File</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
