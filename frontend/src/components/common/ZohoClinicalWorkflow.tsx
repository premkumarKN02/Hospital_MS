import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MessageSquare,
  FileText,
  Activity,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
  UserCheck,
  Sparkles,
  ChevronRight,
  Database,
  BellRing,
  Stethoscope
} from 'lucide-react';
import { PageRoute } from '../../types';
import { CLINIC_CONFIG, DOCTORS } from '../../config/clinicData';

interface ZohoClinicalWorkflowProps {
  onNavigate: (page: PageRoute) => void;
}

export const ZohoClinicalWorkflow: React.FC<ZohoClinicalWorkflowProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const workflowSteps = [
    {
      id: 'scheduling',
      title: 'Appointment Scheduling',
      icon: Calendar,
      shortTag: 'Digital Booking',
      headline: 'Effortless Multichannel Appointment Booking & Token Queue',
      description: 'Patients can seamlessly schedule visits through our website form, direct WhatsApp, or a quick phone call. We eliminate double-bookings and provide organized morning and evening session tokens.',
      bullets: [
        'Dedicated session windows (Morning 9am-1pm & Evening 5pm-9pm)',
        'Zero waiting room congestion via digitized token allocation',
        'Automated slot confirmations and directions sent to patient’s phone',
        'Flexible rescheduling with advance notification'
      ],
      mockupType: 'calendar',
      actionLabel: 'Schedule an Appointment',
      actionRoute: 'appointments' as PageRoute
    },
    {
      id: 'omnichannel',
      title: 'WhatsApp & Reminders',
      icon: MessageSquare,
      shortTag: 'Instant Updates',
      headline: 'Omnichannel Communication & Real-time Visit Alerts',
      description: 'Never miss an appointment or forget follow-up dates. Sindhu Clinic coordinates with patients via WhatsApp and SMS for instant token confirmations, pre-visit instructions, and lab report alerts.',
      bullets: [
        'Instant WhatsApp confirmation with unique booking reference code',
        'Automated pre-visit fasting or medication reminders for tests',
        'Direct chat with reception desk for quick questions or rescheduling',
        'Prompt digital delivery of validated laboratory reports'
      ],
      mockupType: 'whatsapp',
      actionLabel: 'Chat on WhatsApp',
      actionRoute: 'contact' as PageRoute
    },
    {
      id: 'consultation',
      title: 'Physician Consultation',
      icon: Stethoscope,
      shortTag: 'Attentive Care',
      headline: 'Unhurried, Private One-on-One Outpatient Clinical Care',
      description: 'Healing begins with attentive clinical evaluation. Our primary physician reviews complete medical history, previous discharge notes, and current prescriptions in an acoustically insulated, private suite.',
      bullets: [
        'Comprehensive symptom review without rushed consultations',
        'Evidence-based clinical physical examination protocols',
        'Legible, clear handwritten/digital prescriptions with meal timings',
        'Empathetic doctor-patient dialogue in plain, jargon-free language'
      ],
      mockupType: 'ehr',
      actionLabel: 'View Doctor Profile',
      actionRoute: 'doctor' as PageRoute
    },
    {
      id: 'diagnostics',
      title: 'Lab & Diagnostic Sync',
      icon: Activity,
      shortTag: 'Accredited Testing',
      headline: 'On-Site Diagnostic Sample Collection & Digital Report Delivery',
      description: 'Convenient blood draws and routine sample collections on-site, supported by accredited diagnostic partner laboratories with barcoded tracking to guarantee accuracy.',
      bullets: [
        'On-site blood and urine sample desk for routine medical profiles',
        'Complete metabolic, HbA1c, thyroid, and lipid profiling',
        'Digital reports sent directly to patient WhatsApp and Email',
        'Physician review and interpretation without repeating registration'
      ],
      mockupType: 'lab',
      actionLabel: 'Explore Health Checkups',
      actionRoute: 'wellness' as PageRoute
    },
    {
      id: 'continuity',
      title: 'Follow-up & Recovery Care',
      icon: ShieldCheck,
      shortTag: '7-Day Window',
      headline: 'Structured Follow-up Cycles & Long-term Wellness Tracking',
      description: 'Care does not end when you leave the consultation suite. We support your recovery with structured follow-up timelines, medication dosage titrations, and chronic disease check-ins.',
      bullets: [
        '7-day follow-up review window for acute medical consultations',
        'Routine 30-to-90 day monitoring for diabetes and blood pressure',
        'Medication efficacy review to avoid unnecessary long-term pills',
        'Empowering patients with dietary and active lifestyle guidance'
      ],
      mockupType: 'followup',
      actionLabel: 'Read Patient Guidelines',
      actionRoute: 'patient-info' as PageRoute
    }
  ];

  const currentStep = workflowSteps[activeTab];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-900 text-xs font-bold shadow-soft-sm">
          <Sparkles className="w-4 h-4 text-tealAccent-600" />
          <span>Patient-Centered Clinical Workflow</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
          How Sindhu Clinic Delivers Seamless, High-Standard Care
        </h2>
        <p className="text-sm sm:text-base text-slateSubtle-600 leading-relaxed">
          Inspired by modern healthcare management workflows: intuitive scheduling, real-time communication, unhurried consultations, and continuous recovery support.
        </p>
      </div>

      {/* Zoho-style Interactive Horizontal Tab Navigator */}
      <div className="bg-slateSubtle-100/90 p-1.5 sm:p-2 rounded-2xl sm:rounded-full border border-slateSubtle-200/90 shadow-soft-sm mb-10 overflow-x-auto flex items-center justify-start sm:justify-center gap-1.5 no-scrollbar">
        {workflowSteps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeTab === idx;
          return (
            <button
              key={step.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'bg-brand-800 text-white shadow-soft-md transform scale-[1.02]'
                  : 'text-slateSubtle-700 hover:text-brand-900 hover:bg-white/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-tealAccent-300' : 'text-slateSubtle-500'}`} />
              <span>{step.title}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Feature Content Pane */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slateSubtle-200 shadow-soft-lg grid grid-cols-1 lg:grid-cols-12 gap-10 items-center transition-all duration-300">
        
        {/* Left Column: Descriptive Content & Key Benefits (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="medical-badge medical-badge-teal text-xs">
              {currentStep.shortTag}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-950 leading-tight">
              {currentStep.headline}
            </h3>
            <p className="text-sm sm:text-base text-slateSubtle-600 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slateSubtle-400">
              Key Workflow Features:
            </h4>
            <div className="space-y-2">
              {currentStep.bullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slateSubtle-700">
                  <CheckCircle2 className="w-4 h-4 text-tealAccent-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate(currentStep.actionRoute)}
              className="btn-primary text-xs sm:text-sm py-3 px-6 font-bold shadow-soft-sm group"
            >
              <span>{currentStep.actionLabel}</span>
              <ArrowRight className="w-4 h-4 text-tealAccent-300 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="btn-outline text-xs sm:text-sm py-3 px-5 font-semibold"
            >
              <span>Inquire at Reception</span>
            </button>
          </div>
        </div>

        {/* Right Column: Zoho-style Live Interactive Mockup Card (6 cols) */}
        <div className="lg:col-span-6">
          <div className="perspective-card relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl overflow-hidden min-h-[380px]">
            {/* Real-world clinical software / technology background */}
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000"
              alt="Clinical Digital Health Interface"
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="lazy"
            />

            {/* Dark Scrim Overlay */}
            <div className="full-bleed-card-scrim bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-brand-950/95" />

            {/* Canva Inset Border Line */}
            <div className="canva-frame" />
            
            {/* Top Mockup Header Bar */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/20 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="ml-2 text-xs font-bold text-white drop-shadow-sm">
                  Sindhu Clinic Patient Portal View
                </span>
              </div>
              <span className="text-[11px] font-bold text-tealAccent-300 bg-tealAccent-950/60 border border-tealAccent-400/40 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                Active Process
              </span>
            </div>

            {/* Dynamic Interactive Mockup Body based on selected Tab */}
            {currentStep.mockupType === 'calendar' && (
              <div className="relative z-10 space-y-4">
                <div className="bg-brand-900/90 backdrop-blur-md text-white rounded-2xl p-4 flex items-center justify-between border border-tealAccent-500/40 shadow-lg">
                  <div>
                    <p className="text-xs text-tealAccent-300 font-bold uppercase tracking-wider">Today's Token Window</p>
                    <p className="text-base font-extrabold text-white mt-0.5 drop-shadow-sm">{CLINIC_CONFIG.timings.summary}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-tealAccent-400 opacity-90" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/15 space-y-1 text-white">
                    <span className="text-[10px] uppercase font-bold text-slate-300">Morning Session</span>
                    <p className="font-extrabold text-white text-sm">9:00 AM – 1:00 PM</p>
                    <span className="text-[10px] text-tealAccent-300 font-bold">● Tokens Active</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/15 space-y-1 text-white">
                    <span className="text-[10px] uppercase font-bold text-slate-300">Evening Session</span>
                    <p className="font-extrabold text-white text-sm">5:00 PM – 9:00 PM</p>
                    <span className="text-[10px] text-tealAccent-300 font-bold">● Advance Slots Open</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-tealAccent-950/80 backdrop-blur-md border border-tealAccent-400/50 text-xs text-tealAccent-200 flex items-center justify-between">
                  <span className="font-medium text-white drop-shadow-sm">Fast Token Confirmation via SMS / WhatsApp</span>
                  <CheckCircle2 className="w-4 h-4 text-tealAccent-300" />
                </div>
              </div>
            )}

            {currentStep.mockupType === 'whatsapp' && (
              <div className="relative z-10 space-y-3 font-sans">
                {/* Chat Bubble 1 */}
                <div className="bg-slate-900/90 backdrop-blur-md border border-white/15 rounded-2xl rounded-tl-none p-3.5 max-w-[85%] text-xs text-white shadow-md space-y-1">
                  <p className="font-bold text-tealAccent-300">Sindhu Clinic Reception Desk</p>
                  <p className="text-white/95">Hello Mr. Sharma, your consultation slot with {DOCTORS[0].name} has been confirmed for <strong className="text-tealAccent-200">Today at 10:30 AM</strong> (Token #14).</p>
                  <span className="text-[10px] text-slate-300 block text-right font-medium">09:15 AM ✓✓</span>
                </div>

                {/* Chat Bubble 2 (User) */}
                <div className="bg-emerald-900/90 backdrop-blur-md border border-emerald-500/40 rounded-2xl rounded-tr-none p-3 max-w-[80%] ml-auto text-xs text-white shadow-md space-y-0.5">
                  <p className="text-white">Thank you! Should I bring my previous blood sugar reports?</p>
                  <span className="text-[10px] text-emerald-200 block text-right font-medium">09:17 AM ✓✓</span>
                </div>

                {/* Chat Bubble 3 */}
                <div className="bg-slate-900/90 backdrop-blur-md border border-white/15 rounded-2xl rounded-tl-none p-3.5 max-w-[85%] text-xs text-white shadow-md space-y-1">
                  <p className="font-bold text-tealAccent-300">Sindhu Clinic Reception Desk</p>
                  <p className="text-white/95">Yes, please bring all past reports and current medicine strips. See you soon!</p>
                  <span className="text-[10px] text-slate-300 block text-right font-medium">09:18 AM ✓✓</span>
                </div>
              </div>
            )}

            {currentStep.mockupType === 'ehr' && (
              <div className="relative z-10 space-y-3 text-xs">
                <div className="p-3.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/15 flex items-center justify-between text-white">
                  <div>
                    <p className="font-bold text-white text-sm">{DOCTORS[0].name}</p>
                    <p className="text-[11px] text-tealAccent-300 font-medium">{DOCTORS[0].specialization}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-brand-800/80 border border-brand-400/30 text-tealAccent-200 font-bold text-[11px] rounded-lg">
                    Outpatient Suite
                  </span>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-xl border border-white/15 space-y-2 text-white">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-tealAccent-300">Clinical Focus:</span>
                    <span className="text-white font-semibold">Attentive Review</span>
                  </div>
                  <p className="text-white/90 leading-relaxed text-[11px] font-medium">
                    &bull; Blood Pressure measured: 124/82 mmHg (Well Controlled)<br />
                    &bull; Fasting Glucose trend: Stable on minimal medication<br />
                    &bull; Dietary advice: Increase fiber intake &amp; 30m morning walk
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-tealAccent-950/80 border border-tealAccent-400/40 text-tealAccent-200 text-[11px] font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-tealAccent-300 flex-shrink-0" />
                  <span className="text-white">Acoustic room privacy verified. 100% confidential notes.</span>
                </div>
              </div>
            )}

            {currentStep.mockupType === 'lab' && (
              <div className="relative z-10 space-y-3 text-xs">
                <div className="p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/15 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-tealAccent-300" />
                    <span className="font-bold text-white">Routine Metabolic Profile</span>
                  </div>
                  <span className="text-[11px] font-bold text-tealAccent-300 bg-tealAccent-950/60 border border-tealAccent-400/40 px-2 py-0.5 rounded">
                    Verified &amp; Dispatched
                  </span>
                </div>

                <div className="space-y-2 p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/15 text-[11px] text-white">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Sample Drawn:</span>
                    <span className="font-bold text-white">On-Site Collection Desk</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Partner Lab:</span>
                    <span className="font-bold text-white">Accredited Testing Center</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Delivery Channel:</span>
                    <span className="font-bold text-tealAccent-300">WhatsApp &amp; PDF Email</span>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-950/80 border border-blue-400/40 text-blue-200 rounded-lg text-[11px] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-tealAccent-300" />
                  <span className="text-white">Barcoded tube tracking ensures zero specimen confusion.</span>
                </div>
              </div>
            )}

            {currentStep.mockupType === 'followup' && (
              <div className="relative z-10 space-y-3 text-xs">
                <div className="p-3.5 bg-gradient-to-r from-teal-700 to-teal-800 text-white rounded-xl flex items-center justify-between border border-teal-400/40">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-teal-200">Care Continuity</p>
                    <p className="font-extrabold text-sm text-white">7-Day Complimentary Follow-up</p>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-teal-300" />
                </div>

                <div className="p-3.5 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/15 space-y-2 text-[11px] text-white">
                  <p className="font-bold text-tealAccent-300">Structured Recovery Milestones:</p>
                  <p className="text-white/90 leading-relaxed font-medium">
                    1. Day 1–3: Complete prescribed medication course<br />
                    2. Day 4–5: Review symptom improvement log<br />
                    3. Day 7: Brief clinic follow-up or report assessment
                  </p>
                </div>

                <div className="p-2.5 bg-brand-950/80 border border-brand-400/40 text-brand-200 rounded-lg text-[11px] font-medium flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-tealAccent-300" />
                  <span className="text-white">Dedicated physician monitoring until full daily vitality resumes.</span>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </section>
  );
};
