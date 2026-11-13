import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ExternalLink,
  Phone
} from 'lucide-react';
import { emailApi } from '../../lib/api';
import {
  sendUniversalWhatsApp,
  getWhatsAppShareUrl,
  formatWhatsAppNumber,
  buildWhatsAppPayloadMessage
} from '../../utils/whatsappUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultRecipientEmail?: string;
  defaultRecipientName?: string;
  defaultRecipientPhone?: string;
  defaultSubject?: string;
  dataType?: string; // e.g. "PATIENT_RECORD", "KYC_CARD", "APPOINTMENT", "INVOICE"
  dataPayload?: Record<string, any>;
  initialTab?: 'whatsapp' | 'email';
  onSuccess?: () => void;
}

export const UniversalEmailShareModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultRecipientEmail = '',
  defaultRecipientName = '',
  defaultRecipientPhone = '',
  defaultSubject = '',
  dataType = 'HEALTHCARE_DATA',
  dataPayload = {},
  initialTab,
  onSuccess,
}) => {
  // Extract initial phone from props or payload
  const resolvedPhone =
    defaultRecipientPhone ||
    dataPayload?.phone ||
    dataPayload?.Phone ||
    dataPayload?.mobile ||
    '917871558651';

  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email'>(
    initialTab || (resolvedPhone ? 'whatsapp' : 'email')
  );

  // Email form state
  const [recipientEmail, setRecipientEmail] = useState(defaultRecipientEmail);
  const [recipientName, setRecipientName] = useState(defaultRecipientName);
  const [subject, setSubject] = useState(
    defaultSubject || `Sindhu Healthcare — Verified ${dataType.replace(/_/g, ' ')}`
  );
  const [notes, setNotes] = useState('');
  const [showDataPreview, setShowDataPreview] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  // WhatsApp form state
  const [whatsappPhone, setWhatsappPhone] = useState(resolvedPhone);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const [whatsappSentSuccess, setWhatsappSentSuccess] = useState(false);
  const [directWhatsAppUrl, setDirectWhatsAppUrl] = useState<string>('');

  // Sync state whenever props change or modal opens
  useEffect(() => {
    if (isOpen) {
      const ph =
        defaultRecipientPhone ||
        dataPayload?.phone ||
        dataPayload?.Phone ||
        dataPayload?.mobile ||
        '917871558651';
      setWhatsappPhone(ph);
      setRecipientEmail(defaultRecipientEmail);
      setRecipientName(defaultRecipientName);
      setSubject(
        defaultSubject || `Sindhu Healthcare — Verified ${dataType.replace(/_/g, ' ')}`
      );
      if (initialTab) {
        setActiveTab(initialTab);
      }
      setEmailError(null);
      setWhatsappError(null);
      setEmailSentSuccess(false);
      setWhatsappSentSuccess(false);
      setDirectWhatsAppUrl('');
    }
  }, [
    isOpen,
    defaultRecipientPhone,
    defaultRecipientEmail,
    defaultRecipientName,
    defaultSubject,
    dataType,
    dataPayload,
    initialTab
  ]);

  if (!isOpen) return null;

  // Handle Email SMTP Submission
  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim())) {
      setEmailError('Please enter a valid recipient email address.');
      return;
    }

    setEmailError(null);
    setEmailLoading(true);

    try {
      const res = await emailApi.shareData({
        recipientEmail: recipientEmail.trim(),
        recipientName: recipientName.trim(),
        subject: subject.trim(),
        notes: notes.trim(),
        dataType,
        dataPayload,
      });

      if (res.data?.success) {
        setEmailSentSuccess(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setEmailSentSuccess(false);
          onClose();
        }, 2200);
      } else {
        setEmailError(res.data?.message || 'Email dispatch failed. Please check network.');
      }
    } catch (err: any) {
      setEmailError(err.response?.data?.message || 'SMTP server error. Ensure SMTP credentials are active.');
    } finally {
      setEmailLoading(false);
    }
  };

  // Handle WhatsApp Submission
  const handleSubmitWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappPhone.trim()) {
      setWhatsappError('Please enter a recipient phone number.');
      return;
    }

    setWhatsappError(null);
    setWhatsappLoading(true);

    const waMessage = buildWhatsAppPayloadMessage({
      title: subject,
      dataType,
      notes,
      dataPayload
    });

    // Dispatches directly via UltraMsg backend API (no third-party window popup)
    try {
      await sendUniversalWhatsApp({
        phone: whatsappPhone,
        message: waMessage
      });

      setWhatsappSentSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setWhatsappError(err?.message || 'UltraMsg gateway error. Please verify phone number.');
    } finally {
      setWhatsappLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-teal-500/20 text-teal-600 dark:text-teal-400'
            }`}>
              {activeTab === 'whatsapp' ? (
                <MessageCircle className="w-5 h-5" />
              ) : (
                <Mail className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-jakarta">
                Share Healthcare Data
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeTab === 'whatsapp'
                  ? 'Official WhatsApp Web / Mobile & Green-API Gateway'
                  : 'Encrypted TLS 1.3 delivery via verified SMTP'}
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

        {/* Tab Selector */}
        <div className="px-6 pt-4 pb-1">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setActiveTab('whatsapp')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Share</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('email')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'email'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>SMTP Email</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* ========================================================= */}
          {/* TAB 1: WHATSAPP SHARE                                     */}
          {/* ========================================================= */}
          {activeTab === 'whatsapp' && (
            <>
              {whatsappSentSuccess ? (
                <div className="text-center py-6 space-y-3.5 animate-in zoom-in-95">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white font-jakarta">
                    Delivered Directly to WhatsApp Chat!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                    The document has been formatted and sent directly to{' '}
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatWhatsAppNumber(whatsappPhone)}
                    </span>
                    {' '}via UltraMsg Gateway.
                  </p>

                  <div className="pt-2 flex flex-col gap-2">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 text-left space-y-1">
                      <div className="flex items-center gap-2 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Direct Delivery Recorded</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Message processed and receipt generated by Sindhu Hospital platform.
                      </p>
                    </div>

                    <a
                      href={getWhatsAppShareUrl(
                        whatsappPhone,
                        buildWhatsAppPayloadMessage({
                          title: subject,
                          dataType,
                          notes,
                          dataPayload
                        })
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Direct Chat in WhatsApp Web / App</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setWhatsappSentSuccess(false);
                      }}
                      className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Send to Another Number
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitWhatsApp} className="space-y-4">
                  {whatsappError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{whatsappError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Recipient WhatsApp Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={whatsappPhone}
                        onChange={(e) => setWhatsappPhone(e.target.value)}
                        placeholder="e.g. 9840123456 or 917871558651"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      10-digit Indian numbers auto-prefix with +91. International codes supported.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Document Title / Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Custom Clinical Instructions / Note (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add follow-up instructions, physician advice, or remarks..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>

                  {/* Data Payload Accordion Preview */}
                  {dataPayload && Object.keys(dataPayload).length > 0 && (
                    <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowDataPreview(!showDataPreview)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition"
                      >
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-emerald-600" />
                          Preview Attached Data ({Object.keys(dataPayload).length} attributes)
                        </span>
                        {showDataPreview ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>

                      {showDataPreview && (
                        <div className="p-3 bg-white dark:bg-slate-900 text-[11px] font-mono divide-y divide-slate-100 dark:divide-slate-800 max-h-40 overflow-y-auto">
                          {Object.entries(dataPayload).map(([k, v]) => (
                            <div key={k} className="py-1 flex justify-between gap-2">
                              <span className="text-slate-400">{k}:</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-100 truncate text-right">
                                {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Security info */}
                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Direct in-app dispatch via UltraMsg WhatsApp Gateway. Delivered straight to recipient's phone number without opening external client applications.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={whatsappLoading}
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      {whatsappLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4" />
                          <span>Send on WhatsApp</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* ========================================================= */}
          {/* TAB 2: SMTP EMAIL                                         */}
          {/* ========================================================= */}
          {activeTab === 'email' && (
            <>
              {emailSentSuccess ? (
                <div className="text-center py-8 space-y-3 animate-in zoom-in-95">
                  <div className="w-16 h-16 bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white font-jakarta">
                    Email Sent Successfully!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                    The health record data has been formatted and delivered to{' '}
                    <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{recipientEmail}</span>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitEmail} className="space-y-4">
                  {emailError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{emailError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Recipient Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="patient@example.com or doctor@hospital.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Recipient Full Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Category Tag
                      </label>
                      <span className="block px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-teal-600 dark:text-teal-400">
                        {dataType.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Custom Notes / Clinical Remarks (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any instructions, next follow-up date, or note for the recipient..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                  </div>

                  {/* Data Payload Accordion Preview */}
                  {dataPayload && Object.keys(dataPayload).length > 0 && (
                    <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowDataPreview(!showDataPreview)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition"
                      >
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-teal-600" />
                          Preview Attached Data ({Object.keys(dataPayload).length} attributes)
                        </span>
                        {showDataPreview ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>

                      {showDataPreview && (
                        <div className="p-3 bg-white dark:bg-slate-900 text-[11px] font-mono divide-y divide-slate-100 dark:divide-slate-800 max-h-40 overflow-y-auto">
                          {Object.entries(dataPayload).map(([k, v]) => (
                            <div key={k} className="py-1 flex justify-between gap-2">
                              <span className="text-slate-400">{k}:</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-100 truncate text-right">
                                {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Security info */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>
                      Encrypted TLS 1.3 transfer via Gmail Live SMTP (Port 465 SSL). Full audit log recorded.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={emailLoading}
                      className="flex-1 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      {emailLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Dispatching via SMTP...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Email Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
