import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ShieldAlert,
  Loader2,
  ExternalLink,
  Copy,
  Zap,
  Stethoscope
} from 'lucide-react';
import { CLINIC_CONFIG } from '../config/clinicData';
import { ContactFormData, PageRoute } from '../types';
import { emailApi } from '../lib/api';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderNotice } from '../components/common/PlaceholderNotice';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import {
  cleanPhoneNumber,
  buildDoctorInquiryMessage,
  buildPatientInquiryMessage,
  generateDoctorInquiryWhatsAppUrl,
  generatePatientInquiryWhatsAppUrl,
  generateDualInquiryEmailUrl,
  DOCTOR_WHATSAPP_NUMBER
} from '../utils/notificationService';
import { sendUniversalWhatsApp } from '../utils/whatsappUtils';

interface ContactPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const initialForm: ContactFormData = {
    fullName: '',
    phone: '',
    email: '',
    subject: 'General Consultation Inquiry',
    message: ''
  };

  const [formData, setFormData] = useState<ContactFormData>(initialForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusDoctorWA, setStatusDoctorWA] = useState<'ready' | 'sent'>('ready');
  const [statusPatientWA, setStatusPatientWA] = useState<'ready' | 'sent'>('ready');
  const [statusEmail, setStatusEmail] = useState<'ready' | 'sent'>('ready');
  const [copiedDoctorText, setCopiedDoctorText] = useState(false);
  const [copiedPatientText, setCopiedPatientText] = useState(false);
  const [autoSentTriggered, setAutoSentTriggered] = useState(false);

  const validate = (): boolean => {
    const errors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Please enter your full name.';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Please provide your contact phone number.';
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Please provide a message with at least 10 characters.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await emailApi.sendContact({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      setStatusEmail('sent');
    } catch (err) {
      console.warn('Backend SMTP contact notification warning:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleSendDoctorWA = () => {
    sendUniversalWhatsApp({
      phone: DOCTOR_WHATSAPP_NUMBER,
      message: buildDoctorInquiryMessage(formData)
    }).catch(console.warn);
    setStatusDoctorWA('sent');
  };

  const handleSendPatientWA = () => {
    sendUniversalWhatsApp({
      phone: cleanPhoneNumber(formData.phone),
      message: buildPatientInquiryMessage(formData)
    }).catch(console.warn);
    setStatusPatientWA('sent');
  };

  const handleSendDualEmail = async () => {
    setIsSubmitting(true);
    try {
      await emailApi.sendContact({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      setStatusEmail('sent');
    } catch (err) {
      console.warn('Backend SMTP fallback to mailto:', err);
      const url = generateDualInquiryEmailUrl(formData);
      window.location.href = url;
      setStatusEmail('sent');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoDispatchAll = async () => {
    setAutoSentTriggered(true);
    // Doctor WA directly via UltraMsg
    sendUniversalWhatsApp({
      phone: DOCTOR_WHATSAPP_NUMBER,
      message: buildDoctorInquiryMessage(formData)
    }).catch(console.warn);
    setStatusDoctorWA('sent');

    // Patient WA directly via UltraMsg
    setTimeout(() => {
      sendUniversalWhatsApp({
        phone: cleanPhoneNumber(formData.phone),
        message: buildPatientInquiryMessage(formData)
      }).catch(console.warn);
      setStatusPatientWA('sent');
    }, 450);

    // Live Dual SMTP Email
    try {
      await emailApi.sendContact({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      setStatusEmail('sent');
    } catch (err) {
      const emailUrl = generateDualInquiryEmailUrl(formData);
      window.location.href = emailUrl;
      setStatusEmail('sent');
    }
  };

  const copyDoctorMessage = () => {
    const text = buildDoctorInquiryMessage(formData);
    navigator.clipboard.writeText(text);
    setCopiedDoctorText(true);
    setTimeout(() => setCopiedDoctorText(false), 2000);
  };

  const copyPatientMessage = () => {
    const text = buildPatientInquiryMessage(formData);
    navigator.clipboard.writeText(text);
    setCopiedPatientText(true);
    setTimeout(() => setCopiedPatientText(false), 2000);
  };

  const handleResetForm = () => {
    setFormData(initialForm);
    setFormErrors({});
    setIsSubmitted(false);
    setStatusDoctorWA('ready');
    setStatusPatientWA('ready');
    setStatusEmail('ready');
    setCopiedDoctorText(false);
    setCopiedPatientText(false);
    setAutoSentTriggered(false);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Breadcrumbs */}
      <Breadcrumbs currentTitle="Contact & Location" onNavigate={onNavigate} />

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PageHeroBanner
          badge="We Are Here for You"
          badgeIcon={<MapPin className="w-3.5 h-3.5 text-teal-300" />}
          title="Contact Sindhu Clinic &"
          titleAccent="Location"
          subtitle="Find our exact address, consultation timings, direct phone numbers, and interactive query form. We look forward to welcoming you."
          icon={<MapPin className="w-16 h-16" />}
          bgImageUrl="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600"
          className="rounded-3xl shadow-soft-xl"
        />
      </div>

      {/* Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PlaceholderNotice />
      </div>

      {/* Main Grid: Contact Cards & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Contact Details & Timings (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Info Card */}
            <div className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/20 shadow-xl space-y-5">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000"
                alt="Clinic Reception"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                loading="lazy"
              />
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/92 to-slate-950/85" />
              <div className="canva-frame" />

              <h3 className="relative z-10 font-extrabold text-xl text-white border-b border-white/15 pb-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
                Clinic Details
              </h3>

              <div className="relative z-10 space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 shadow-lg flex-shrink-0">
                    <MapPin className="w-4 h-4 text-teal-300" />
                  </div>
                  <div>
                    <p className="font-extrabold text-white drop-shadow-sm">Physical Address</p>
                    <p className="text-white/95 font-medium mt-0.5 leading-relaxed drop-shadow-sm">
                      {CLINIC_CONFIG.address.line1}, {CLINIC_CONFIG.address.line2}, {CLINIC_CONFIG.address.city}
                    </p>
                    <p className="text-[11px] text-teal-300 font-semibold mt-1 drop-shadow-sm">
                      {CLINIC_CONFIG.address.landmarkNote}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 shadow-lg flex-shrink-0">
                    <Phone className="w-4 h-4 text-teal-300" />
                  </div>
                  <div>
                    <p className="font-extrabold text-white drop-shadow-sm">Phone Support</p>
                    <a
                      href={CLINIC_CONFIG.phoneCallValue}
                      className="text-teal-200 font-bold hover:text-white underline mt-0.5 block drop-shadow-sm"
                    >
                      {CLINIC_CONFIG.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 shadow-lg flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-teal-300" />
                  </div>
                  <div>
                    <p className="font-extrabold text-white drop-shadow-sm">WhatsApp Desk</p>
                    <a
                      href={CLINIC_CONFIG.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-200 font-bold hover:text-white underline mt-0.5 block drop-shadow-sm"
                    >
                      {CLINIC_CONFIG.whatsappDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 shadow-lg flex-shrink-0">
                    <Mail className="w-4 h-4 text-teal-300" />
                  </div>
                  <div>
                    <p className="font-extrabold text-white drop-shadow-sm">Email Inquiries</p>
                    <a
                      href={`mailto:${CLINIC_CONFIG.emailAddress}?subject=Sindhu%20Clinic%20Inquiry`}
                      className="text-teal-200 font-bold hover:text-white underline mt-0.5 block drop-shadow-sm truncate"
                    >
                      {CLINIC_CONFIG.emailDisplay}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Timings Card */}
            <div className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/20 shadow-xl space-y-4">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000"
                alt="Clinic Timings"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                loading="lazy"
              />
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/90 to-brand-950/85" />
              <div className="canva-frame" />

              <h3 className="relative z-10 font-extrabold text-lg text-white flex items-center gap-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
                <Clock className="w-5 h-5 text-teal-300" />
                <span>Weekly Consultation Schedule</span>
              </h3>

              <div className="relative z-10 space-y-2 text-xs sm:text-sm text-white/95 font-medium">
                <div className="flex justify-between py-2 border-b border-white/15 drop-shadow-sm">
                  <span className="font-bold text-white">Monday – Saturday (Morning):</span>
                  <span className="text-teal-200 font-semibold">{CLINIC_CONFIG.timings.weekdayMorning}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/15 drop-shadow-sm">
                  <span className="font-bold text-white">Monday – Saturday (Evening):</span>
                  <span className="text-teal-200 font-semibold">{CLINIC_CONFIG.timings.weekdayEvening}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/15 drop-shadow-sm">
                  <span className="font-bold text-white">Sunday Session:</span>
                  <span className="text-teal-200 font-semibold">{CLINIC_CONFIG.timings.sunday}</span>
                </div>
                <p className="text-[11px] text-white/80 pt-1 italic drop-shadow-sm">
                  Public holidays: Advance notice posted at reception.
                </p>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="perspective-card relative overflow-hidden rounded-2xl p-5 border border-red-500/30 shadow-xl space-y-2 text-xs text-white">
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1000"
                alt="Emergency Care"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                loading="lazy"
              />
              <div className="full-bleed-card-scrim bg-gradient-to-r from-red-950/98 via-slate-950/92 to-amber-950/90" />
              <div className="canva-frame" />

              <div className="relative z-10 flex items-center gap-2 font-extrabold text-amber-300 text-sm drop-shadow-sm">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Emergency Situations:</span>
              </div>
              <p className="relative z-10 leading-relaxed font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                {CLINIC_CONFIG.emergencyNotice}
              </p>
            </div>

          </div>

          {/* Right Column: Contact Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slateSubtle-200 shadow-soft-md space-y-6">
              
              <div className="border-b border-slateSubtle-100 pb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-brand-950">
                  Send an Inquiry to Reception
                </h3>
                <p className="text-xs sm:text-sm text-slateSubtle-500 mt-0.5">
                  Have questions regarding doctor availability, report collection, or checkup packages? Leave a message.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 text-white border border-teal-500/30 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-3.5 text-emerald-400">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-black text-white">Inquiry Received &amp; Notifications Ready!</h4>
                      <p className="text-xs text-teal-200 mt-0.5">
                        Thank you, <strong className="text-white">{formData.fullName}</strong>. Your query is registered.
                      </p>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-slate-400">Sender Phone:</span>
                      <span className="font-bold text-white font-mono">+{cleanPhoneNumber(formData.phone)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-slate-400">Sender Email:</span>
                      <span className="font-bold text-white truncate max-w-[200px]">{formData.email || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-slate-400">Subject:</span>
                      <span className="font-bold text-teal-300">{formData.subject}</span>
                    </div>
                  </div>

                  {/* Master Auto-Dispatch Button */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleAutoDispatchAll}
                      className="w-full btn-teal py-3 px-4 font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 hover:brightness-110"
                    >
                      <Zap className="w-4 h-4 text-amber-950 fill-amber-950" />
                      <span>Auto-Send to Both (WhatsApp &amp; Email)</span>
                    </button>
                    {autoSentTriggered && (
                      <p className="text-[11px] text-emerald-300 text-center font-medium">
                        ✓ All notifications triggered to Doctor Desk and Patient Mobile!
                      </p>
                    )}
                  </div>

                  {/* 3 Channels */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Doctor WhatsApp */}
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 space-y-2.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1">
                            <Stethoscope className="w-3 h-3" />
                            <span>Doctor (WA)</span>
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            statusDoctorWA === 'sent'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                          }`}>
                            {statusDoctorWA === 'sent' ? '✓ Sent' : 'Ready'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                          Sends inquiry query to reception (+{DOCTOR_WHATSAPP_NUMBER}).
                        </p>
                      </div>

                      <div className="space-y-1 pt-1.5 border-t border-white/10">
                        <button
                          type="button"
                          onClick={handleSendDoctorWA}
                          className="w-full py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Send Doctor</span>
                          <ExternalLink className="w-3 h-3 opacity-80" />
                        </button>
                        <button
                          type="button"
                          onClick={copyDoctorMessage}
                          className="w-full py-1 px-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-[10px] font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedDoctorText ? 'Copied!' : 'Copy Text'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Patient WhatsApp */}
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 space-y-2.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>Patient (WA)</span>
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            statusPatientWA === 'sent'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                          }`}>
                            {statusPatientWA === 'sent' ? '✓ Sent' : 'Ready'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                          Sends receipt to patient mobile (+{cleanPhoneNumber(formData.phone)}).
                        </p>
                      </div>

                      <div className="space-y-1 pt-1.5 border-t border-white/10">
                        <button
                          type="button"
                          onClick={handleSendPatientWA}
                          className="w-full py-1.5 px-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Send Patient</span>
                          <ExternalLink className="w-3 h-3 opacity-80" />
                        </button>
                        <button
                          type="button"
                          onClick={copyPatientMessage}
                          className="w-full py-1 px-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-[10px] font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedPatientText ? 'Copied!' : 'Copy Slip'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Dual Email */}
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 space-y-2.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>Dual Email</span>
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            statusEmail === 'sent'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                          }`}>
                            {statusEmail === 'sent' ? '✓ Sent' : 'Ready'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                          Sends inquiry to clinic with patient in CC.
                        </p>
                      </div>

                      <div className="space-y-1 pt-1.5 border-t border-white/10">
                        <button
                          type="button"
                          onClick={handleSendDualEmail}
                          className="w-full py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Send Email</span>
                          <ExternalLink className="w-3 h-3 opacity-80" />
                        </button>
                      </div>
                    </div>

                  </div>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="btn-outline text-xs py-2 px-5 text-white border-white/20 hover:bg-white/10"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-slateSubtle-700 uppercase tracking-wider mb-1">
                      Your Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Babu"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        formErrors.fullName ? 'border-rose-300 bg-rose-50/30' : 'border-slateSubtle-300 focus:ring-brand-700'
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{formErrors.fullName}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slateSubtle-700 uppercase tracking-wider mb-1">
                        Phone Number <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                          formErrors.phone ? 'border-rose-300 bg-rose-50/30' : 'border-slateSubtle-300 focus:ring-brand-700'
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.phone}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slateSubtle-700 uppercase tracking-wider mb-1">
                        Email Address <span className="text-slateSubtle-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                          formErrors.email ? 'border-rose-300 bg-rose-50/30' : 'border-slateSubtle-300 focus:ring-brand-700'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slateSubtle-700 uppercase tracking-wider mb-1">
                      Inquiry Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slateSubtle-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
                    >
                      <option value="General Consultation Inquiry">General Consultation Inquiry</option>
                      <option value="Appointment Rescheduling">Appointment Rescheduling</option>
                      <option value="Lab Test Report Query">Lab Test Report Query</option>
                      <option value="Health Checkup Package Information">Health Checkup Package Information</option>
                      <option value="Other Feedback or Inquiry">Other Feedback or Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slateSubtle-700 uppercase tracking-wider mb-1">
                      Message <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Please write your inquiry here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        formErrors.message ? 'border-rose-300 bg-rose-50/30' : 'border-slateSubtle-300 focus:ring-brand-700'
                      }`}
                    />
                    {formErrors.message && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{formErrors.message}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-3.5 text-sm font-bold shadow-soft-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-tealAccent-300" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-tealAccent-300" />
                          <span>Send Message to Reception</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* Google Maps Embed Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slateSubtle-200 shadow-soft-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-lg text-brand-950">Location &amp; Landmark Map</h3>
              <p className="text-xs text-slateSubtle-500">
                Easily navigable via Google Maps, auto-rickshaw, or private vehicle with nearby patient parking.
              </p>
            </div>
            <a
              href={CLINIC_CONFIG.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-xs py-2 px-4 inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Get Driving Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="perspective-card relative overflow-hidden rounded-2xl h-80 border border-white/20 shadow-xl flex flex-col items-center justify-center p-6 text-center space-y-3">
            <img
              src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=1200"
              alt="Clinic Location Map View"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              loading="lazy"
            />
            <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/75" />
            <div className="canva-frame" />

            <div className="relative z-10 w-14 h-14 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 shadow-xl">
              <MapPin className="w-7 h-7 text-teal-300" />
            </div>
            <div className="relative z-10 space-y-1">
              <p className="font-extrabold text-lg text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">{CLINIC_CONFIG.name} Location</p>
              <p className="text-xs sm:text-sm text-white/95 font-medium max-w-md drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                {CLINIC_CONFIG.address.line1}, {CLINIC_CONFIG.address.line2}, {CLINIC_CONFIG.address.city}
              </p>
              <p className="text-xs text-teal-300 font-mono mt-1 font-semibold drop-shadow-sm">
                {CLINIC_CONFIG.address.mapsEmbedNote}
              </p>
            </div>
            <a
              href={CLINIC_CONFIG.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 btn-teal text-xs py-2.5 px-6 font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Open in Google Maps App
            </a>
          </div>
        </div>
      </section>

      {/* Direct Booking Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden bg-[#041628] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft-lg">
          {/* Authentic Clinical Architecture Backdrop — Vivid & Recognizable */}
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1400"
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/98 via-slate-950/90 to-brand-950/85 pointer-events-none" />
          <div className="canva-hero-frame" />

          <div className="relative z-10 space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">Ready to Consult our Primary Physician?</h3>
            <p className="text-xs sm:text-sm text-white/95 font-medium drop-shadow-sm">
              Skip queue delays by scheduling an appointment online in advance.
            </p>
          </div>
          <button
            onClick={() => onNavigate('appointments')}
            className="relative z-10 btn-teal py-3 px-7 text-sm font-bold shadow-soft-sm whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment Online</span>
          </button>
        </div>
      </section>

    </div>
  );
};
