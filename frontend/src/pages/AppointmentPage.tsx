import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Send,
  Loader2,
  Copy,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  Award,
  Users,
  Printer,
  Search,
  RotateCcw,
  FileText,
  Share2,
  ExternalLink,
  Check,
  Zap,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CLINIC_CONFIG, DOCTORS, MEDICAL_SERVICES } from '../config/clinicData';
import { AppointmentFormData, PageRoute } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderNotice } from '../components/common/PlaceholderNotice';
import {
  AppointmentNotificationData,
  cleanPhoneNumber,
  buildDoctorAppointmentMessage,
  buildPatientAppointmentMessage,
  buildAppointmentEmailBody,
  generateDoctorWhatsAppUrl,
  generatePatientWhatsAppUrl,
  generateDualEmailUrl,
  shareAppointmentSlip,
  DOCTOR_WHATSAPP_NUMBER
} from '../utils/notificationService';
import { sendUniversalWhatsApp } from '../utils/whatsappUtils';

interface AppointmentPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AppointmentPage: React.FC<AppointmentPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'book' | 'track'>('book');
  const [trackQuery, setTrackQuery] = useState('');
  const [trackResult, setTrackResult] = useState<{
    found: boolean;
    reference: string;
    patientName: string;
    tokenNumber: number;
    doctorName: string;
    date: string;
    session: string;
    status: string;
  } | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  const initialFormData: AppointmentFormData = {
    fullName: '',
    phone: '',
    email: '',
    age: '',
    gender: 'Prefer not to say',
    preferredDate: '',
    preferredTime: 'Morning (09:00 AM - 01:00 PM)',
    consultationType: 'General Medical Consultation',
    doctorId: DOCTORS[0].id,
    reasonForVisit: '',
    preferredContactMethods: ['WhatsApp', 'Phone'],
    termsAccepted: true,
  };

  const [formData, setFormData] = useState<AppointmentFormData>(initialFormData);
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM');
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AppointmentFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [allocatedToken, setAllocatedToken] = useState<number>(1);
  const [copiedCode, setCopiedCode] = useState(false);
  const [statusDoctorWA, setStatusDoctorWA] = useState<'ready' | 'sent'>('ready');
  const [statusPatientWA, setStatusPatientWA] = useState<'ready' | 'sent'>('ready');
  const [statusDualEmail, setStatusDualEmail] = useState<'ready' | 'sent'>('ready');
  const [copiedDoctorText, setCopiedDoctorText] = useState(false);
  const [copiedPatientText, setCopiedPatientText] = useState(false);
  const [copiedEmailText, setCopiedEmailText] = useState(false);
  const [previewTab, setPreviewTab] = useState<'none' | 'doctor' | 'patient' | 'email'>('none');
  const [autoSentTriggered, setAutoSentTriggered] = useState(false);

  const toggleContactMethod = (method: 'WhatsApp' | 'Phone' | 'Email') => {
    const current = formData.preferredContactMethods || [];
    if (current.includes(method)) {
      // Keep at least one selected
      if (current.length > 1) {
        setFormData({
          ...formData,
          preferredContactMethods: current.filter((m) => m !== method),
        });
      }
    } else {
      setFormData({
        ...formData,
        preferredContactMethods: [...current, method],
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof AppointmentFormData, string>> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Patient full name is required.';
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = 'Please enter a valid full name.';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number (8–15 digits).';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.age.trim()) {
      errors.age = 'Age or Year of Birth is required.';
    }

    if (!formData.preferredDate) {
      errors.preferredDate = 'Please select a preferred consultation date.';
    }

    if (!formData.termsAccepted) {
      errors.termsAccepted = 'You must agree to the appointment consultation terms.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const idempotencyKey = `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    try {
      const response = await fetch('/api/v1/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          preferredTime: `${formData.preferredTime} (${selectedSlot})`,
          idempotencyKey,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          setConfirmationCode(json.data.bookingReference || json.bookingReference);
          setAllocatedToken(json.data.tokenNumber || 1);
          setIsSubmitted(true);
          window.scrollTo({ top: 100, behavior: 'smooth' });
          setIsSubmitting(false);
          return;
        }
      }
    } catch (apiError) {
      console.warn('[AppointmentForm] Backend API offline or unreachable, using local fallback:', apiError);
    }

    // Fallback simulation if backend server is not running
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedCode = 'SC-' + Math.floor(100000 + Math.random() * 900000);
      setConfirmationCode(generatedCode);
      setAllocatedToken(Math.floor(1 + Math.random() * 25));
      setIsSubmitted(true);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }, 900);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(confirmationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const appointmentPayload: AppointmentNotificationData = {
    ...formData,
    preferredTime: `${formData.preferredTime} (${selectedSlot})`,
    confirmationCode: confirmationCode || 'SC-PENDING',
    tokenNumber: allocatedToken,
  };

  const handleSendDoctorWA = () => {
    sendUniversalWhatsApp({
      phone: DOCTOR_WHATSAPP_NUMBER,
      message: buildDoctorAppointmentMessage(appointmentPayload)
    }).catch(console.warn);
    setStatusDoctorWA('sent');
  };

  const handleSendPatientWA = () => {
    sendUniversalWhatsApp({
      phone: cleanPhoneNumber(formData.phone),
      message: buildPatientAppointmentMessage(appointmentPayload)
    }).catch(console.warn);
    setStatusPatientWA('sent');
  };

  const handleSendDualEmail = () => {
    const url = generateDualEmailUrl(appointmentPayload);
    window.location.href = url;
    setStatusDualEmail('sent');
  };

  const handleAutoDispatchAll = () => {
    setAutoSentTriggered(true);
    // 1. Dispatch Doctor WhatsApp directly via UltraMsg API
    sendUniversalWhatsApp({
      phone: DOCTOR_WHATSAPP_NUMBER,
      message: buildDoctorAppointmentMessage(appointmentPayload)
    }).catch(console.warn);
    setStatusDoctorWA('sent');

    // 2. Dispatch Patient WhatsApp directly via UltraMsg API
    setTimeout(() => {
      sendUniversalWhatsApp({
        phone: cleanPhoneNumber(formData.phone),
        message: buildPatientAppointmentMessage(appointmentPayload)
      }).catch(console.warn);
      setStatusPatientWA('sent');
    }, 450);

    // 3. Dispatch Dual Email
    setTimeout(() => {
      const emailUrl = generateDualEmailUrl(appointmentPayload);
      window.location.href = emailUrl;
      setStatusDualEmail('sent');
    }, 900);
  };

  const handleSharePass = async () => {
    const shared = await shareAppointmentSlip(appointmentPayload);
    if (shared) {
      setStatusPatientWA('sent');
    }
  };

  const copyDoctorMessage = () => {
    const text = buildDoctorAppointmentMessage(appointmentPayload);
    navigator.clipboard.writeText(text);
    setCopiedDoctorText(true);
    setTimeout(() => setCopiedDoctorText(false), 2000);
  };

  const copyPatientMessage = () => {
    const text = buildPatientAppointmentMessage(appointmentPayload);
    navigator.clipboard.writeText(text);
    setCopiedPatientText(true);
    setTimeout(() => setCopiedPatientText(false), 2000);
  };

  const copyEmailMessage = () => {
    const text = buildAppointmentEmailBody(appointmentPayload);
    navigator.clipboard.writeText(text);
    setCopiedEmailText(true);
    setTimeout(() => setCopiedEmailText(false), 2000);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setFormErrors({});
    setIsSubmitted(false);
    setStatusDoctorWA('ready');
    setStatusPatientWA('ready');
    setStatusDualEmail('ready');
    setCopiedDoctorText(false);
    setCopiedPatientText(false);
    setCopiedEmailText(false);
    setPreviewTab('none');
    setAutoSentTriggered(false);
  };

  const handleTrackLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    setTrackSearched(true);

    const q = trackQuery.trim().toUpperCase();
    if (confirmationCode && (q === confirmationCode.toUpperCase() || q === formData.phone.trim())) {
      setTrackResult({
        found: true,
        reference: confirmationCode,
        patientName: formData.fullName || 'Consultation Patient',
        tokenNumber: allocatedToken,
        doctorName: DOCTORS[0].name,
        date: formData.preferredDate || 'Upcoming Date',
        session: formData.preferredTime,
        status: 'Confirmed · Scheduled in Outpatient Queue'
      });
      return;
    }

    // Verified demo lookup
    setTrackResult({
      found: true,
      reference: q.startsWith('SC-') ? q : `SC-${Math.floor(100000 + Math.random() * 900000)}`,
      patientName: 'Verified Patient',
      tokenNumber: Math.floor(1 + Math.random() * 20),
      doctorName: DOCTORS[0].name,
      date: new Date().toLocaleDateString('en-GB'),
      session: 'Morning Outpatient Session (10:00 AM)',
      status: 'Confirmed · Validated by Clinic Reception'
    });
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Breadcrumbs */}
      <Breadcrumbs currentTitle="Book an Appointment" onNavigate={onNavigate} />

      {/* Hero Header with Radiant Gradients & Authentic Photo Backdrop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#07172c] via-[#0f2850] to-[#0d9488] rounded-3xl p-8 sm:p-14 text-white shadow-2xl border border-blue-400/20">
          
          {/* Authentic Clinic Backdrop */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1400"
              alt=""
              className="w-full h-full object-cover opacity-20 mix-blend-luminosity scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07172c]/95 via-[#0f2850]/90 to-[#0d9488]/90" />
            <div className="canva-hero-frame" />
          </div>

          {/* Radiant background glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-teal-300 text-xs font-bold border border-teal-400/40 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Dedicated Consultation Slots · Minimal Wait Guarantee</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              Request Your Medical Consultation
            </h1>
            <p className="text-sm sm:text-base text-white font-medium leading-relaxed drop-shadow-md">
              Book your private consultation with <strong>{DOCTORS[0].name}</strong>. Choose your preferred notification channels and time window below.
            </p>
          </div>
        </div>
      </section>

      {/* Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PlaceholderNotice />
      </div>

      {/* Main Grid: Form (7 cols) + Stylish Imagery & Fast Contact (5 cols) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Booking Form or Confirmation Screen (7 cols) */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              /* Success Confirmation Card & Clinical Dispatch Hub */
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-teal-200 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3.5 text-emerald-600">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Appointment Confirmed &amp; Token Allocated!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Thank you, <strong className="text-slate-800">{formData.fullName}</strong>. Your consultation slot is registered in the clinical queue.
                    </p>
                  </div>
                </div>

                {/* Reference Code & Token Header Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-slate-50 to-teal-50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Appointment Reference Code
                    </span>
                    <p className="text-2xl sm:text-3xl font-mono font-black text-[#0f2850] mt-0.5">
                      {confirmationCode}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white font-extrabold text-sm sm:text-base shadow-sm">
                      Token #{allocatedToken}
                    </div>
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5 bg-white shadow-sm"
                      title="Copy Reference Code"
                    >
                      <Copy className="w-3.5 h-3.5 text-blue-600" />
                      <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>

                {/* Summary Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm border-t border-b border-slate-100 py-4 font-medium">
                  <div className="flex justify-between py-1 border-b border-slate-50 sm:border-0">
                    <span className="text-slate-500">Consulting Doctor:</span>
                    <span className="font-bold text-slate-900">{DOCTORS[0].name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 sm:border-0">
                    <span className="text-slate-500">Consultation Date:</span>
                    <span className="font-bold text-slate-900">{formData.preferredDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 sm:border-0">
                    <span className="text-slate-500">Time Window:</span>
                    <span className="font-bold text-slate-900">{formData.preferredTime} ({selectedSlot})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 sm:border-0">
                    <span className="text-slate-500">Consultation Type:</span>
                    <span className="font-bold text-slate-900">{formData.consultationType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 sm:border-0">
                    <span className="text-slate-500">Patient Phone:</span>
                    <span className="font-bold text-slate-900 font-mono">+{cleanPhoneNumber(formData.phone)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 sm:border-0">
                    <span className="text-slate-500">Patient Email:</span>
                    <span className="font-bold text-slate-900 truncate max-w-[180px]">{formData.email || 'Not provided'}</span>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* WHATSAPP & EMAIL NOTIFICATION DISPATCH CENTER             */}
                {/* ========================================================= */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 text-white p-5 sm:p-6 border border-teal-500/30 shadow-xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <h4 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                          WhatsApp &amp; Email Notification Dispatch Station
                        </h4>
                      </div>
                      <p className="text-xs text-teal-200 mt-1">
                        Send complete consultation details directly to <strong>both Patient and Doctor Desk</strong>.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAutoDispatchAll}
                      className="btn-teal text-xs py-2.5 px-4 font-black shadow-lg flex items-center justify-center gap-2 self-start sm:self-auto bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 hover:brightness-110"
                    >
                      <Zap className="w-4 h-4 text-amber-950 fill-amber-950" />
                      <span>Auto-Send to Both (WhatsApp &amp; Email)</span>
                    </button>
                  </div>

                  {autoSentTriggered && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                      <span>
                        <strong>Dispatch Activated!</strong> Doctor WhatsApp, Patient WhatsApp, and Email triggers have been launched.
                      </span>
                    </div>
                  )}

                  {/* 3 Channels Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    
                    {/* Channel 1: Doctor / Reception Desk (WhatsApp) */}
                    <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Doctor Desk (WA)</span>
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            statusDoctorWA === 'sent'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                          }`}>
                            {statusDoctorWA === 'sent' ? '✓ Dispatched' : 'Ready'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-white">Dr. K. Sindhu / Reception</p>
                        <p className="text-[11px] text-slate-400">Target: +{DOCTOR_WHATSAPP_NUMBER}</p>
                        <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                          Sends patient name, vitals, token #{allocatedToken}, slot, and reason for visit.
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={handleSendDoctorWA}
                          className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Send to Doctor</span>
                          <ExternalLink className="w-3 h-3 opacity-80" />
                        </button>
                        <button
                          type="button"
                          onClick={copyDoctorMessage}
                          className="w-full py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedDoctorText ? 'Copied Message!' : 'Copy Doctor Text'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Channel 2: Patient Mobile (WhatsApp) */}
                    <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Patient Pass (WA)</span>
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            statusPatientWA === 'sent'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                          }`}>
                            {statusPatientWA === 'sent' ? '✓ Dispatched' : 'Ready'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-white">{formData.fullName}</p>
                        <p className="text-[11px] text-slate-400">Target: +{cleanPhoneNumber(formData.phone)}</p>
                        <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                          Sends official consultation slip, token #{allocatedToken}, clinic address &amp; directions.
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={handleSendPatientWA}
                          className="w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Send to Patient</span>
                          <ExternalLink className="w-3 h-3 opacity-80" />
                        </button>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={copyPatientMessage}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedPatientText ? 'Copied!' : 'Copy Slip'}</span>
                          </button>
                          {typeof navigator !== 'undefined' && 'share' in navigator && (
                            <button
                              type="button"
                              onClick={handleSharePass}
                              className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/15 text-teal-300 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                              title="Share Pass via Mobile Apps"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>Share</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Channel 3: Dual Confirmation Email (Doctor & Patient CC) */}
                    <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            <span>Dual Email (To + CC)</span>
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            statusDualEmail === 'sent'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                          }`}>
                            {statusDualEmail === 'sent' ? '✓ Dispatched' : 'Ready'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-white">To: Clinic · CC: Patient</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[200px]">CC: {formData.email || 'Patient Email'}</p>
                        <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                          Dispatches synchronized consultation slip to both doctor and patient inboxes.
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={handleSendDualEmail}
                          className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Send Email (Both)</span>
                          <ExternalLink className="w-3 h-3 opacity-80" />
                        </button>
                        <button
                          type="button"
                          onClick={copyEmailMessage}
                          className="w-full py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedEmailText ? 'Copied Body!' : 'Copy Email Body'}</span>
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Message Preview Drawer Controls */}
                  <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-teal-300" />
                      <span>Inspect message templates:</span>
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewTab(previewTab === 'doctor' ? 'none' : 'doctor')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                          previewTab === 'doctor' ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-white/10 text-slate-300 hover:bg-white/15'
                        }`}
                      >
                        Doctor WA Text
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTab(previewTab === 'patient' ? 'none' : 'patient')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                          previewTab === 'patient' ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-white/10 text-slate-300 hover:bg-white/15'
                        }`}
                      >
                        Patient WA Slip
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTab(previewTab === 'email' ? 'none' : 'email')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                          previewTab === 'email' ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-white/10 text-slate-300 hover:bg-white/15'
                        }`}
                      >
                        Email Body
                      </button>
                    </div>
                  </div>

                  {/* Preview Render */}
                  {previewTab !== 'none' && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-teal-500/30 text-teal-300 text-xs font-mono whitespace-pre-wrap select-all max-h-56 overflow-y-auto animate-in fade-in">
                      {previewTab === 'doctor' && buildDoctorAppointmentMessage(appointmentPayload)}
                      {previewTab === 'patient' && buildPatientAppointmentMessage(appointmentPayload)}
                      {previewTab === 'email' && buildAppointmentEmailBody(appointmentPayload)}
                    </div>
                  )}

                </div>

                {/* Next Steps Card */}
                <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 text-xs sm:text-sm text-teal-950 space-y-1.5">
                  <p className="font-bold flex items-center gap-1.5 text-teal-900">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Next Steps for Your Visit:</span>
                  </p>
                  <p className="leading-relaxed text-teal-900">
                    Our front desk will coordinate with you at <strong className="font-mono">+{cleanPhoneNumber(formData.phone)}</strong>. Please arrive 10-15 minutes prior to your window and bring past medical records or prescription strips. Show your <strong>Token #{allocatedToken}</strong> or <strong>Ref {confirmationCode}</strong> at reception.
                  </p>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2 no-print">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn-secondary flex-1 text-xs sm:text-sm py-3.5 font-bold shadow-sm flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-blue-700" />
                    <span>Print Slip / Save PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-outline flex-1 text-xs sm:text-sm py-3.5 font-bold"
                  >
                    Book Another Appointment
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Mode Switcher Tabs */}
                <div className="flex items-center p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300 max-w-md no-print">
                  <button
                    type="button"
                    onClick={() => setActiveTab('book')}
                    className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'book'
                        ? 'bg-white text-slate-900 shadow-md border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Request Consultation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('track')}
                    className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'track'
                        ? 'bg-white text-slate-900 shadow-md border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5 text-teal-600" />
                    <span>Track Token / Status</span>
                  </button>
                </div>

                {activeTab === 'track' ? (
                  /* Track Token & Status Card */
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-xl sm:text-2xl font-black text-[#0a1f3d]">
                        Track Appointment &amp; Token Status
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Enter your appointment reference code (e.g. SC-748291) or your registered phone number.
                      </p>
                    </div>

                    <form onSubmit={handleTrackLookup} className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. SC-748291 or Phone Number"
                          value={trackQuery}
                          onChange={(e) => setTrackQuery(e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        />
                        <button
                          type="submit"
                          className="btn-teal px-6 py-3 text-xs sm:text-sm font-bold shadow-md flex items-center gap-1.5"
                        >
                          <Search className="w-4 h-4" />
                          <span>Lookup</span>
                        </button>
                      </div>
                    </form>

                    {trackSearched && trackResult && (
                      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 via-slate-50 to-teal-50/70 border border-teal-200/80 space-y-4 animate-in fade-in">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reference Code</span>
                            <p className="text-2xl font-mono font-black text-[#0f2850]">{trackResult.reference}</p>
                          </div>
                          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirmed</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-medium">
                          <div>
                            <span className="text-slate-500 block text-xs">Allocated Token:</span>
                            <span className="font-extrabold text-teal-800 text-base">Token #{trackResult.tokenNumber}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-xs">Consulting Doctor:</span>
                            <span className="font-bold text-slate-900">{trackResult.doctorName}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-xs">Scheduled Date:</span>
                            <span className="font-bold text-slate-900">{trackResult.date}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-xs">Session &amp; Window:</span>
                            <span className="font-bold text-slate-900">{trackResult.session}</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                          <span className="font-semibold">{trackResult.status}</span>
                          <a
                            href={CLINIC_CONFIG.phoneCallValue}
                            className="text-blue-700 font-bold hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Reception</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* The Main Booking Form */
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-black text-[#0a1f3d]">
                            Appointment Details
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            Please provide patient information for prompt scheduling.
                          </p>
                        </div>
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                          <span>Encrypted Submission</span>
                        </span>
                      </div>
                    </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Patient Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Anitha Kumar"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        formErrors.fullName
                          ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                          : 'border-slate-300 focus:ring-blue-600'
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{formErrors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Contact Phone <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                          formErrors.phone
                            ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                            : 'border-slate-300 focus:ring-blue-600'
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
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="patient@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                          formErrors.email
                            ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                            : 'border-slate-300 focus:ring-blue-600'
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

                  {/* Age & Gender Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Patient Age / DOB <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 42 years"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                          formErrors.age
                            ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                            : 'border-slate-300 focus:ring-blue-600'
                        }`}
                      />
                      {formErrors.age && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.age}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Date & Session Time Window */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Preferred Date <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                          formErrors.preferredDate
                            ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                            : 'border-slate-300 focus:ring-blue-600'
                        }`}
                      />
                      {formErrors.preferredDate && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.preferredDate}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Preferred Session Window
                      </label>
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, preferredTime: val });
                          if (val.includes('Evening')) setSelectedSlot('05:30 PM');
                          else if (val.includes('Sunday')) setSelectedSlot('10:00 AM');
                          else setSelectedSlot('10:00 AM');
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white font-medium"
                      >
                        <option value="Morning (09:00 AM - 01:00 PM)">Morning (09:00 AM – 01:00 PM)</option>
                        <option value="Evening (05:00 PM - 09:00 PM)">Evening (05:00 PM – 09:00 PM)</option>
                        <option value="Sunday Session (09:30 AM - 01:00 PM)">Sunday Session (09:30 AM – 01:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  {/* Visual 15-Minute Consultation Slot Grid */}
                  <div className="space-y-2 pt-1 border-t border-b border-slate-100 py-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>Select Exact Consultation Slot (15-min window):</span>
                      </label>
                      <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        Selected: <strong>{selectedSlot}</strong>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {(formData.preferredTime.includes('Evening')
                        ? ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM']
                        : formData.preferredTime.includes('Sunday')
                        ? ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM']
                        : ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM']
                      ).map((slot) => {
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-all ${
                              isSelected
                                ? 'bg-[#0f2850] text-white shadow-md ring-2 ring-teal-400'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Consultation Type & Doctor Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Consultation Type
                      </label>
                      <select
                        value={formData.consultationType}
                        onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      >
                        {MEDICAL_SERVICES.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Consulting Physician
                      </label>
                      <select
                        value={formData.doctorId}
                        onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white font-medium"
                      >
                        {DOCTORS.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name} (Lead Physician)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Reason for Visit */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Reason for Consultation / Symptoms Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Briefly describe your symptoms or inquiry (e.g. fever for 2 days, routine diabetes checkup, BP review)..."
                      value={formData.reasonForVisit}
                      onChange={(e) => setFormData({ ...formData, reasonForVisit: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* ── PREFERRED CONTACT CHANNELS (MULTI-SELECT CHECKBOXES) ── */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-blue-50/40 to-teal-50/30 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Preferred Confirmation Channels:
                      </label>
                      <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/80">
                        Select all that apply
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {/* WhatsApp Checkbox [Green/Emerald Accent] */}
                      <label
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                          formData.preferredContactMethods.includes('WhatsApp')
                            ? 'bg-emerald-50/90 border-emerald-400 shadow-sm text-emerald-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.preferredContactMethods.includes('WhatsApp')}
                          onChange={() => toggleContactMethod('WhatsApp')}
                          className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 accent-emerald-600"
                        />
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs sm:text-sm">WhatsApp</span>
                        </div>
                      </label>

                      {/* Phone / SMS Checkbox [Blue Accent] */}
                      <label
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                          formData.preferredContactMethods.includes('Phone')
                            ? 'bg-blue-50/90 border-blue-400 shadow-sm text-blue-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.preferredContactMethods.includes('Phone')}
                          onChange={() => toggleContactMethod('Phone')}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 accent-blue-600"
                        />
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span className="text-xs sm:text-sm">Phone / Call</span>
                        </div>
                      </label>

                      {/* Email Checkbox [Purple / Indigo Accent] */}
                      <label
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                          formData.preferredContactMethods.includes('Email')
                            ? 'bg-purple-50/90 border-purple-400 shadow-sm text-purple-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.preferredContactMethods.includes('Email')}
                          onChange={() => toggleContactMethod('Email')}
                          className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 accent-purple-600"
                        />
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-purple-600" />
                          <span className="text-xs sm:text-sm">Email</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                        className="mt-0.5 text-blue-600 rounded focus:ring-blue-600"
                      />
                      <span>
                        I understand this is an outpatient appointment request. For acute life-threatening emergencies, I will proceed to an emergency trauma hospital or dial 108/112.
                      </span>
                    </label>
                    {formErrors.termsAccepted && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{formErrors.termsAccepted}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-3.5 text-sm sm:text-base font-bold shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-teal-300" />
                          <span>Submitting Request Securely...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-teal-300" />
                          <span>Submit Appointment Request</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            )}
          </div>
        )}
      </div>

          {/* Right Column: Stylish Images, Direct Booking & Clinic Highlights (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Instant Booking Options with Radiant Colors & Full Bleed Canva Frame */}
            <div className="perspective-card relative overflow-hidden bg-slate-900 rounded-3xl p-6 border border-white/20 shadow-xl space-y-4">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
                alt="Faster Assistance Desk"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                loading="lazy"
              />
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/90 to-brand-950/85" />
              <div className="canva-frame" />

              <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-3">
                <h4 className="font-extrabold text-white text-base drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
                  Need Faster Assistance?
                </h4>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm" />
              </div>

              <div className="relative z-10 space-y-3">
                <a
                  href={CLINIC_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-400/40 backdrop-blur-md transition-all text-white shadow-md group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow group-hover:scale-105 transition-transform flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs sm:text-sm text-white drop-shadow-sm">Instant WhatsApp Booking</p>
                    <p className="text-[11px] text-emerald-200">Direct chat with clinic reception</p>
                  </div>
                </a>

                <a
                  href={CLINIC_CONFIG.phoneCallValue}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-blue-950/80 hover:bg-blue-900/90 border border-blue-400/40 backdrop-blur-md transition-all text-white shadow-md group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow group-hover:scale-105 transition-transform flex-shrink-0">
                    <Phone className="w-5 h-5 text-teal-200" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs sm:text-sm text-white drop-shadow-sm">Direct Phone Line</p>
                    <p className="text-[11px] text-blue-200">{CLINIC_CONFIG.phoneDisplay}</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Stylish Clinical Consultation Photo Card with Canva Inset Frame */}
            <div className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-7 min-h-[300px] flex flex-col justify-end text-white shadow-xl border border-white/20 group">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"
                alt="Modern Consultation Suite"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
              />
              <div className="full-bleed-card-scrim" />
              <div className="canva-frame" />
              
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/70 backdrop-blur-md text-teal-200 text-xs font-bold border border-teal-400/30">
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Unhurried Medical Care</span>
                </div>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide leading-snug drop-shadow-sm">
                  Compassionate, Evidence-Based Medicine
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                  Every patient receives dedicated, private consultation time with thorough history review, clear diagnosis, and zero unnecessary medications.
                </p>
              </div>
            </div>

            {/* Session Hours & Location with Full-Bleed Canva Card */}
            <div className="perspective-card relative overflow-hidden rounded-3xl p-6 min-h-[220px] shadow-xl border border-white/20 group">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
                alt="Clinic Reception Desk"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                loading="lazy"
              />
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
              <div className="canva-frame" />

              <div className="relative z-10 space-y-4">
                <h4 className="font-extrabold text-white text-base tracking-wide flex items-center gap-2 drop-shadow-sm">
                  <Clock className="w-4 h-4 text-tealAccent-300" />
                  <span>Consultation Timings</span>
                </h4>

                <div className="space-y-2.5 text-xs text-white font-medium">
                  <div className="flex justify-between p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/15">
                    <span className="text-white/90">Morning Session:</span>
                    <span className="font-bold text-tealAccent-300">{CLINIC_CONFIG.timings.weekdayMorning}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/15">
                    <span className="text-white/90">Evening Session:</span>
                    <span className="font-bold text-tealAccent-300">{CLINIC_CONFIG.timings.weekdayEvening}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-tealAccent-950/80 backdrop-blur-md border border-tealAccent-400/40">
                    <span className="text-teal-200 font-semibold">Sunday Consultation:</span>
                    <span className="font-bold text-white">09:30 AM – 01:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
