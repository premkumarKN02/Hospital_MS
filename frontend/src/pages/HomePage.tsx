import React, { useState } from 'react';
import {
  Calendar,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Activity,
  HeartPulse,
  Sparkles,
  Star,
  Users,
  ChevronDown,
  Building2,
  MessageSquare,
  FileText,
  Search,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { CLINIC_CONFIG, DOCTORS, MEDICAL_SERVICES, HEALTH_CONDITIONS, CLINIC_FACILITIES, FAQS, BLOG_POSTS, SAMPLE_TESTIMONIALS } from '../config/clinicData';
import { PageRoute } from '../types';
import { IconHelper } from '../components/common/IconHelper';
import { PlaceholderNotice } from '../components/common/PlaceholderNotice';
import { ConsultationIllustration, DigitalBookingIllustration } from '../components/common/MedicalIllustrations';
import { ClinicMetricsBar } from '../components/common/ClinicMetricsBar';
import { ZohoClinicalWorkflow } from '../components/common/ZohoClinicalWorkflow';
import { SectionHeading } from '../components/common/SectionHeading';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const primaryDoctor = DOCTORS[0];
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [selectedSymptomIdx, setSelectedSymptomIdx] = useState<number>(0);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const quickSymptomGuides = [
    {
      symptom: 'Persistent Fever or Body Ache',
      category: 'Acute Infectious Care',
      recommendation: 'General Medical Consultation with blood investigation review.',
      serviceId: 'general-consultation',
      urgency: 'Within 24–48 Hours',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'
    },
    {
      symptom: 'Elevated Blood Sugar or HbA1c',
      category: 'Metabolic & Diabetes',
      recommendation: 'Personalized sugar level stabilization and dietary counseling.',
      serviceId: 'diabetes-metabolic-care',
      urgency: 'Planned Consultation',
      imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800'
    },
    {
      symptom: 'High Blood Pressure or Dizziness',
      category: 'Cardiovascular Care',
      recommendation: 'Serial blood pressure assessment and cardiac risk profile.',
      serviceId: 'hypertension-cardiac-risk',
      urgency: 'Prompt Assessment',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800'
    },
    {
      symptom: 'Seasonal Cough, Allergies or Wheezing',
      category: 'Respiratory Health',
      recommendation: 'Chest auscultation, allergy trigger check, and nebulization support.',
      serviceId: 'respiratory-seasonal-illness',
      urgency: 'Prompt Assessment',
      imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800'
    },
    {
      symptom: 'Annual Routine Health Check',
      category: 'Preventive Wellness',
      recommendation: 'Comprehensive biomarker screening and organ health audit.',
      serviceId: 'preventive-health-screenings',
      urgency: 'Elective Scheduling',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="space-y-20 lg:space-y-28 pb-16">
      
      {/* 1. HERO SECTION — Portfolio-inspired rich orb background */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/30 pt-8 sm:pt-14 pb-16 lg:pb-24 border-b border-slateSubtle-200/60">
        
        {/* ── Portfolio-style layered orb background ── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={{zIndex:0}}>
          {/* Large teal blob — top left (like premkumar's hero glow) */}
          <div className="animate-blob absolute" style={{
            top:'-80px', left:'-60px', width:'500px', height:'500px',
            background:'radial-gradient(circle, rgba(20,184,166,0.18) 0%, rgba(56,189,248,0.10) 40%, transparent 70%)',
            filter:'blur(50px)'
          }} />
          {/* Blue blob — top right */}
          <div className="animate-blob-delayed absolute" style={{
            top:'0px', right:'-100px', width:'450px', height:'450px',
            background:'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(99,102,241,0.08) 50%, transparent 70%)',
            filter:'blur(55px)'
          }} />
          {/* Purple blob — bottom center */}
          <div className="animate-blob-reverse absolute" style={{
            bottom:'-60px', left:'30%', width:'420px', height:'420px',
            background:'radial-gradient(circle, rgba(139,92,246,0.10) 0%, rgba(167,139,250,0.06) 50%, transparent 70%)',
            filter:'blur(50px)'
          }} />
          {/* Small accent orb — floating midway */}
          <div className="animate-float-diag absolute" style={{
            top:'30%', left:'55%', width:'200px', height:'200px',
            background:'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)',
            filter:'blur(35px)'
          }} />
          {/* Ghost watermark heading — Premkumar bg-heading style */}
          <span className="ghost-heading select-none" style={{
            top:'50%', bottom:'auto',transform:'translate(-50%,-50%)',
            color:'rgba(30,64,175,0.03)'
          }}>SINDHU CLINIC</span>
          {/* Subtle grid pattern overlay */}
          <div style={{
            position:'absolute', inset:0, opacity:0.4,
            backgroundImage:'radial-gradient(rgba(30,64,175,0.06) 1px, transparent 1px)',
            backgroundSize:'32px 32px'
          }} />

          {/* Floating Medical Cross Vector Element (Top-right Canva-style element) */}
          <div className="absolute top-8 right-12 hidden md:block pointer-events-none animate-float opacity-20">
            <svg viewBox="0 0 60 60" fill="none" className="w-16 h-16">
              <rect x="22" y="5" width="16" height="50" rx="8" fill="#0d9488" />
              <rect x="5" y="22" width="50" height="16" rx="8" fill="#0d9488" />
            </svg>
          </div>

          {/* Floating Medical Cross Vector Element (Left ambient) */}
          <div className="absolute bottom-16 left-8 hidden lg:block pointer-events-none animate-float-delayed opacity-15">
            <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
              <rect x="15" y="3" width="10" height="34" rx="5" fill="#3b82f6" />
              <rect x="3" y="15" width="34" height="10" rx="5" fill="#3b82f6" />
            </svg>
          </div>

          {/* Subtle ECG Heartbeat Pulse Line along bottom */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-20">
            <svg viewBox="0 0 1200 48" preserveAspectRatio="none" className="w-full h-10">
              <polyline
                points="0,24 200,24 230,24 250,6 270,42 290,10 310,38 330,24 700,24 730,6 750,42 770,10 790,38 810,24 1200,24"
                stroke="#0d9488" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Modern Rounded Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-200/80 text-brand-900 text-xs sm:text-sm font-bold shadow-soft-sm hover:border-brand-400 transition-colors">
                <span className="w-2.5 h-2.5 rounded-full bg-tealAccent-500 animate-pulse" />
                <span>Modern Outpatient Healthcare Practice</span>
                <span className="text-slateSubtle-300">|</span>
                <span className="text-tealAccent-700 font-semibold hidden sm:inline">Attentive 1-on-1 Care</span>
              </div>

              {/* Bold Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-brand-950 tracking-tight leading-[1.12]">
                Personalized Healthcare, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-800 via-tealAccent-600 to-indigo-600">
                  Built on Trust &amp; Science.
                </span>
              </h1>

              {/* Supporting Description */}
              <p className="text-base sm:text-lg text-slateSubtle-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Welcome to <strong>{CLINIC_CONFIG.name}</strong>. We offer dedicated physician consultations, preventive health screenings, and tailored chronic care in an unhurried, hygienic clinical environment.
              </p>

              {/* Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => onNavigate('appointments')}
                  className="w-full sm:w-auto btn-primary text-sm sm:text-base py-3.5 px-8 shadow-soft-md group"
                >
                  <Calendar className="w-5 h-5 text-tealAccent-300 group-hover:scale-110 transition-transform" />
                  <span>Book an Appointment</span>
                  <ArrowRight className="w-4 h-4 text-tealAccent-300 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href={CLINIC_CONFIG.phoneCallValue}
                  className="w-full sm:w-auto btn-secondary text-sm sm:text-base py-3.5 px-6"
                >
                  <Phone className="w-5 h-5 text-tealAccent-700" />
                  <span>Call Reception Desk</span>
                </a>
              </div>

              {/* Modern Trust Indicator Pills */}
              <div className="pt-6 border-t border-slateSubtle-200/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-tealAccent-50 text-tealAccent-700 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slateSubtle-900">Dedicated Physician</h4>
                    <p className="text-[11px] sm:text-xs text-slateSubtle-500">Unhurried one-on-one time</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-800 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slateSubtle-900">Hospital-Grade Safe</h4>
                    <p className="text-[11px] sm:text-xs text-slateSubtle-500">Rigorous disinfection cycle</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 col-span-2 sm:col-span-1">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slateSubtle-900">Morning &amp; Evening</h4>
                    <p className="text-[11px] sm:text-xs text-slateSubtle-500">Flexible consultation slots</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: High-End Clinical Visual Showcase & Interactive Doctor Card (5 cols) */}
            <div className="lg:col-span-5 relative">
              
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Full-Bleed Canva Clinical Showcase Card */}
                <div className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-8 min-h-[460px] flex flex-col justify-between shadow-2xl border border-white/30 group">
                  {/* Full-bleed Consultation Suite Photo */}
                  <img
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000"
                    alt="Modern Clinical Consultation Suite"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                  />
                  <div className="full-bleed-card-scrim" />
                  <div className="canva-frame" />

                  {/* Top Badges directly on image */}
                  <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/80 backdrop-blur-md text-teal-200 text-xs font-bold border border-teal-400/40 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Live Outpatient Suite</span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/95 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/25 shadow-sm">
                      Ground Floor &bull; Private
                    </span>
                  </div>

                  {/* Bottom Doctor & Facility Snapshot directly on image */}
                  <div className="relative z-10 space-y-4 pt-8">
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 shadow-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={primaryDoctor.photoUrl}
                            alt={primaryDoctor.name}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-teal-300 shadow-md"
                          />
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-200 bg-teal-950/70 border border-teal-400/30 px-2 py-0.5 rounded-md inline-block">
                              Consultant Physician
                            </span>
                            <h4 className="font-extrabold text-white text-sm sm:text-base leading-snug mt-0.5 drop-shadow-md">
                              {primaryDoctor.name}
                            </h4>
                            <p className="text-[12px] text-white font-medium drop-shadow-sm">
                              {primaryDoctor.qualifications}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => onNavigate('doctor')}
                          className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-brand-950 text-xs font-bold shadow-md transition-all flex items-center gap-1"
                        >
                          <span>Bio</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2.5 border-t border-white/20 font-semibold text-white drop-shadow-sm">
                        <div className="flex items-center gap-1.5 text-white">
                          <Clock className="w-3.5 h-3.5 text-teal-300" />
                          <span className="text-white">9:00 AM – 9:00 PM</span>
                        </div>
                        <span className="text-emerald-300 font-extrabold text-[11px] bg-emerald-950/70 border border-emerald-400/40 px-2.5 py-0.5 rounded-full">
                          ● Open Today
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Micro-Badge Top Right [Amber Glow] */}
                <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2 p-2.5 px-4 rounded-2xl bg-white shadow-[0_10px_25px_-5px_rgba(245,158,11,0.25)] border border-amber-200 text-xs font-extrabold text-slate-900 animate-float">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>⭐ 4.9/5 Patient Satisfaction</span>
                </div>

                {/* Floating Micro-Badge Bottom Left [Teal Glow] */}
                <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-2 p-2.5 px-4 rounded-2xl bg-white shadow-[0_10px_25px_-5px_rgba(20,184,166,0.25)] border border-teal-200 text-xs font-extrabold text-slate-900 animate-float-delayed">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Evidence-Based Medicine</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
 
      {/* HIGH-TRUST CLINICAL METRICS & KPI COUNTERS (ZOHO HEALTHCARE CRM STYLE) */}
      <ClinicMetricsBar />

      {/* 2. INTERACTIVE SYMPTOM NAVIGATOR (SMART UI/UX GUIDANCE TOOL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-indigo-950 rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-soft-xl space-y-8">
          
          {/* Real-world hospital diagnostic backdrop with transparent scrim */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200"
              alt=""
              className="w-full h-full object-cover opacity-15 mix-blend-luminosity scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-900/90 to-indigo-950/95" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-800/80 pb-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950/80 text-tealAccent-300 text-xs font-bold backdrop-blur-md border border-teal-400/40 shadow-sm">
                <Search className="w-3.5 h-3.5" />
                <span>Interactive Care Navigator</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                What Health Concern Brings You Here Today?
              </h2>
              <p className="text-xs sm:text-sm text-slateSubtle-300">
                Select your current situation below to see our clinical approach and schedule an appropriate consultation.
              </p>
            </div>

            <button
              onClick={() => onNavigate('services')}
              className="btn-outline bg-slate-900/85 hover:bg-slate-900 border-white/30 text-white font-bold text-xs py-2.5 px-5 whitespace-nowrap self-start md:self-auto backdrop-blur-md shadow-md transition-all hover:scale-105"
            >
              <span>View All 12 Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Symptom Selectors (7 cols) */}
            <div className="lg:col-span-7 space-y-2">
              {quickSymptomGuides.map((guide, idx) => {
                const isSelected = selectedSymptomIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedSymptomIdx(idx)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-center justify-between border ${
                      isSelected
                        ? 'bg-white text-slateSubtle-900 border-white shadow-soft-md'
                        : 'bg-slate-950/80 hover:bg-slate-900 text-white border-white/20 backdrop-blur-md shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-brand-800 text-white shadow-sm' : 'bg-slate-900/90 text-tealAccent-300 border border-teal-400/30'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-sm">{guide.symptom}</p>
                        <p className={`text-xs ${isSelected ? 'text-tealAccent-700 font-semibold' : 'text-slateSubtle-400'}`}>
                          {guide.category}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-brand-800' : 'text-slateSubtle-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Recommended Care Card with Full-Bleed Background & Canva Inset Frame (5 cols) */}
            <div className="lg:col-span-5 relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-soft-xl border border-white/20 perspective-card flex flex-col justify-between min-h-[440px] group">
              {/* Full Background Photo */}
              <img
                src={quickSymptomGuides[selectedSymptomIdx].imageUrl}
                alt={quickSymptomGuides[selectedSymptomIdx].symptom}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
              />
              {/* Dark Translucent Gradient Scrim */}
              <div className="full-bleed-card-scrim" />
              {/* Canva Inset Line Frame */}
              <div className="canva-frame" />

              {/* Content directly on top of the image */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="medical-badge medical-badge-teal text-[11px] bg-teal-950/80 border border-teal-400/40 text-teal-200 backdrop-blur-md shadow-sm">
                    Recommended Action
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300 bg-slate-950/85 px-3 py-1 rounded-full backdrop-blur-md border border-teal-400/30 shadow-sm">
                    {quickSymptomGuides[selectedSymptomIdx].category}
                  </span>
                </div>

                <h3 className="font-extrabold text-xl sm:text-2xl text-white leading-snug drop-shadow-sm">
                  {quickSymptomGuides[selectedSymptomIdx].symptom}
                </h3>

                <p className="text-xs sm:text-sm text-white font-medium leading-relaxed drop-shadow-md">
                  {quickSymptomGuides[selectedSymptomIdx].recommendation}
                </p>

                <div className="p-3.5 bg-slate-950/85 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-between text-xs shadow-md">
                  <span className="font-bold text-white drop-shadow-sm">Recommended Window:</span>
                  <span className="font-extrabold text-teal-300 drop-shadow-sm">{quickSymptomGuides[selectedSymptomIdx].urgency}</span>
                </div>
              </div>

              <div className="relative z-10 space-y-2 pt-4">
                <button
                  onClick={() => onNavigate('appointments')}
                  className="w-full btn-teal py-3 text-sm font-bold shadow-soft-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Consultation Now</span>
                </button>

                <button
                  onClick={() => onNavigate('treatments')}
                  className="w-full text-center text-xs font-semibold text-teal-300 hover:text-white py-1.5 flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Learn More About This Condition</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. WHY CHOOSE SINDHU CLINIC — Portfolio-inspired glass cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Rich portfolio-style orb layer */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
          <div className="animate-blob absolute" style={{
            top:'-40px', left:'-20px', width:'360px', height:'360px',
            background:'radial-gradient(circle, rgba(20,184,166,0.14) 0%, rgba(56,189,248,0.08) 50%, transparent 70%)',
            filter:'blur(50px)'
          }} />
          <div className="animate-blob-delayed absolute" style={{
            bottom:'-30px', right:'-20px', width:'400px', height:'400px',
            background:'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)',
            filter:'blur(55px)'
          }} />
          <div className="animate-float-diag absolute" style={{
            top:'50%', left:'50%', width:'250px', height:'250px',
            background:'radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)',
            filter:'blur(40px)', transform:'translate(-50%,-50%)'
          }} />
          {/* Ghost section label */}
          <span className="ghost-heading">WHY CHOOSE</span>
        </div>

        <SectionHeading
          badge="Patient-Centered Quality"
          badgeVariant="blue"
          title="Why Patients and Families Choose Sindhu Clinic"
          subtitle="Healthcare should be personal, reassuring, and evidence-driven. Here is our unwavering commitment to your wellness."
          watermarkIcon={<Stethoscope className="w-20 h-20" />}
          className="mb-12 relative z-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 perspective-container">
          {/* 1. Unhurried Consultations */}
          <div className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-7 flex flex-col justify-between min-h-[380px] shadow-soft-lg hover:shadow-2xl transition-all duration-300 border border-white/20 group">
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
              alt="Unhurried Consultations"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
            />
            <div className="full-bleed-card-scrim" />
            <div className="canva-frame" />
            <div className="relative z-10 space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-950/85 backdrop-blur-md flex items-center justify-center text-blue-200 border border-white/25 shadow-lg">
                <Stethoscope className="w-6 h-6 text-blue-200" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200 bg-blue-900/70 border border-blue-400/40 backdrop-blur-md px-2.5 py-1 rounded-full inline-block">
                1-on-1 Care
              </span>
              <h3 className="font-extrabold text-xl text-white pt-1 drop-shadow-sm group-hover:text-blue-200 transition-colors">
                Unhurried Consultations
              </h3>
            </div>
            <p className="relative z-10 text-xs sm:text-sm text-white leading-relaxed font-medium drop-shadow-md pt-3 border-t border-white/25">
              We never rush medical evaluations. You receive full clinical attention required to investigate symptoms and review past records thoroughly.
            </p>
          </div>

          {/* 2. Evidence-Based Medicine */}
          <div className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-7 flex flex-col justify-between min-h-[380px] shadow-soft-lg hover:shadow-2xl transition-all duration-300 border border-white/20 group">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
              alt="Evidence-Based Medicine"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
            />
            <div className="full-bleed-card-scrim" />
            <div className="canva-frame" />
            <div className="relative z-10 space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-950/85 backdrop-blur-md flex items-center justify-center text-teal-200 border border-white/25 shadow-lg">
                <ShieldCheck className="w-6 h-6 text-teal-200" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-200 bg-teal-900/70 border border-teal-400/40 backdrop-blur-md px-2.5 py-1 rounded-full inline-block">
                Safe Protocols
              </span>
              <h3 className="font-extrabold text-xl text-white pt-1 drop-shadow-sm group-hover:text-teal-200 transition-colors">
                Evidence-Based Medicine
              </h3>
            </div>
            <p className="relative z-10 text-xs sm:text-sm text-white leading-relaxed font-medium drop-shadow-md pt-3 border-t border-white/25">
              Strict avoidance of unnecessary lab tests and excessive prescriptions. We adhere to clinical protocols centered on minimal, effective pharmacotherapy.
            </p>
          </div>

          {/* 3. Hygienic & Calming Space */}
          <div className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-7 flex flex-col justify-between min-h-[380px] shadow-soft-lg hover:shadow-2xl transition-all duration-300 border border-white/20 group">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
              alt="Hygienic & Calming Space"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
            />
            <div className="full-bleed-card-scrim" />
            <div className="canva-frame" />
            <div className="relative z-10 space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-950/85 backdrop-blur-md flex items-center justify-center text-purple-200 border border-white/25 shadow-lg">
                <Sparkles className="w-6 h-6 text-purple-200" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-200 bg-purple-900/70 border border-purple-400/40 backdrop-blur-md px-2.5 py-1 rounded-full inline-block">
                Hospital Grade
              </span>
              <h3 className="font-extrabold text-xl text-white pt-1 drop-shadow-sm group-hover:text-purple-200 transition-colors">
                Hygienic &amp; Calming Space
              </h3>
            </div>
            <p className="relative z-10 text-xs sm:text-sm text-white leading-relaxed font-medium drop-shadow-md pt-3 border-t border-white/25">
              Hospital-grade disinfection protocols, comfortable air-conditioned waiting lounge, and barrier-free ground-floor access for seniors and wheelchair patients.
            </p>
          </div>

          {/* 4. Continuous Care Partner */}
          <div className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-7 flex flex-col justify-between min-h-[380px] shadow-soft-lg hover:shadow-2xl transition-all duration-300 border border-white/20 group">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800"
              alt="Continuous Care Partner"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
            />
            <div className="full-bleed-card-scrim" />
            <div className="canva-frame" />
            <div className="relative z-10 space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-950/85 backdrop-blur-md flex items-center justify-center text-amber-200 border border-white/25 shadow-lg">
                <HeartPulse className="w-6 h-6 text-amber-200" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-200 bg-amber-900/70 border border-amber-400/40 backdrop-blur-md px-2.5 py-1 rounded-full inline-block">
                Long-Term Vitality
              </span>
              <h3 className="font-extrabold text-xl text-white pt-1 drop-shadow-sm group-hover:text-amber-200 transition-colors">
                Continuous Care Partner
              </h3>
            </div>
            <p className="relative z-10 text-xs sm:text-sm text-white leading-relaxed font-medium drop-shadow-md pt-3 border-t border-white/25">
              From chronic disease monitoring (diabetes, BP) to post-viral follow-ups, we support your health journey with structured reviews and guidance.
            </p>
          </div>
        </div>
      </section>

      {/* 4. ABOUT THE CLINIC TEASER WITH STYLISH CLINIC PHOTO */}
      <section className="bg-gradient-to-br from-blue-50/70 via-slate-50 to-teal-50/50 py-16 sm:py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <span className="medical-badge medical-badge-teal">
                About Sindhu Clinic
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-950 leading-tight">
                Dedicated Outpatient Healthcare Rooted in Medical Ethics
              </h2>
              <p className="text-sm sm:text-base text-slateSubtle-600 leading-relaxed">
                Founded with a mission to deliver accessible, high-standard clinical care, <strong>{CLINIC_CONFIG.name}</strong> provides comprehensive diagnostic consultations, routine preventive evaluations, and chronic ailment management.
              </p>
              <p className="text-sm sm:text-base text-slateSubtle-600 leading-relaxed">
                We believe modern medicine functions best when deep clinical knowledge is paired with genuine compassion. Every patient is treated with dignity, and every diagnosis is communicated in simple, actionable terms.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slateSubtle-800">
                  <CheckCircle2 className="w-4 h-4 text-tealAccent-600 flex-shrink-0" />
                  <span>Scalable single-to-multi-doctor clinic architecture</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slateSubtle-800">
                  <CheckCircle2 className="w-4 h-4 text-tealAccent-600 flex-shrink-0" />
                  <span>Digital appointment workflow &amp; minimal waiting times</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slateSubtle-800">
                  <CheckCircle2 className="w-4 h-4 text-tealAccent-600 flex-shrink-0" />
                  <span>Integrated sample collection support through accredited labs</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('about')}
                  className="btn-primary text-sm shadow-md"
                >
                  <span>Learn More About Our Mission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('facilities')}
                  className="btn-outline text-sm"
                >
                  <span>Explore Facilities</span>
                </button>
              </div>
            </div>

            {/* Right Column: Full-Bleed Canva Clinic Imagery & Care Standards */}
            <div className="lg:col-span-6">
              <div className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-8 min-h-[460px] flex flex-col justify-between shadow-2xl border border-white/30 group">
                {/* Full-bleed Clinic Interior Photo */}
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000"
                  alt="Modern Hospital Clinic Interior"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                />
                <div className="full-bleed-card-scrim" />
                <div className="canva-frame" />

                {/* Top Badges directly on image */}
                <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold bg-teal-900/80 backdrop-blur-md text-teal-200 px-3 py-1 rounded-full border border-teal-400/30">
                    Hygienic Lounge &amp; Private Consultation Suites
                  </span>
                  <span className="text-[11px] text-white/95 font-bold bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm">
                    Wheelchair Accessible
                  </span>
                </div>

                {/* Bottom Care Standards directly over image */}
                <div className="relative z-10 space-y-4 pt-8">
                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 shadow-xl space-y-3">
                    <h3 className="font-extrabold text-base sm:text-lg text-white border-b border-white/15 pb-2.5 flex items-center justify-between">
                      <span>Our Clinical Care Standards</span>
                      <Award className="w-5 h-5 text-teal-300" />
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/15 space-y-1">
                        <h4 className="font-extrabold text-tealAccent-300 text-xs sm:text-sm">Clinical Integrity</h4>
                        <p className="text-white/95 leading-relaxed font-medium drop-shadow-sm">
                          Evidence-based prescriptions and zero redundant tests.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/15 space-y-1">
                        <h4 className="font-extrabold text-tealAccent-300 text-xs sm:text-sm">Patient Privacy</h4>
                        <p className="text-white/95 leading-relaxed font-medium drop-shadow-sm">
                          100% confidential discussions in acoustic private suites.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. DOCTOR INTRODUCTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden bg-[#041628] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-soft-xl">
          {/* Authentic Clinical Architecture Backdrop */}
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1400"
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/98 via-slate-950/90 to-brand-950/85 pointer-events-none" />
          <div className="canva-hero-frame" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Doctor Photo */}
            <div className="lg:col-span-4 text-center lg:text-left">
              <div className="relative inline-block">
                <img
                  src={primaryDoctor.photoUrl}
                  alt={primaryDoctor.name}
                  className="w-48 h-48 sm:w-64 sm:h-64 rounded-3xl object-cover border-4 border-white/20 shadow-soft-xl mx-auto"
                />
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-tealAccent-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  Primary Physician
                </div>
              </div>
            </div>

            {/* Doctor Details */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-teal-400/40 text-tealAccent-300 text-xs font-bold backdrop-blur-md shadow-sm">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Physician &amp; Clinical Lead</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {primaryDoctor.name}
              </h2>

              <p className="text-sm sm:text-base text-tealAccent-300 font-medium">
                {primaryDoctor.qualifications} &bull; {primaryDoctor.specialization}
              </p>

              <p className="text-xs text-white/90 font-medium drop-shadow-sm">
                Registration: {primaryDoctor.registrationNumber} &bull; Experience: {primaryDoctor.experienceYears}
              </p>

              <p className="text-sm sm:text-base text-white leading-relaxed italic font-medium drop-shadow-md">
                &ldquo;{primaryDoctor.treatmentPhilosophy}&rdquo;
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-tealAccent-300 uppercase tracking-wider mb-2 drop-shadow-sm">
                  Areas of Clinical Expertise:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {primaryDoctor.areasOfExpertise.slice(0, 4).map((exp, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-slate-950/85 text-xs font-bold text-white border border-white/25 drop-shadow-sm shadow-sm"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('doctor')}
                  className="btn-teal text-sm py-2.5 px-5 font-semibold"
                >
                  <span>View Full Profile &amp; Bio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('appointments')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-white/30 text-white text-sm font-bold backdrop-blur-md shadow-md transition-all hover:scale-105"
                >
                  <span>Schedule Consultation</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. MEDICAL SERVICES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Decorative orbs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/2 right-0 w-72 h-72 rounded-full animate-float"
            style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.11) 0%, transparent 70%)', filter: 'blur(45px)' }} />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full animate-blob-delayed"
            style={{ background: 'radial-gradient(circle, rgba(30,64,175,0.09) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <SectionHeading
            align="left"
            badge="Comprehensive Care"
            badgeVariant="blue"
            title="Our Medical Services"
            subtitle="Personalized outpatient services designed to support you from acute illnesses to long-term wellness."
            watermarkIcon={<Activity className="w-20 h-20" />}
            className="max-w-2xl"
          />

          <button
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-800 hover:text-brand-950 group"
          >
            <span>View All 12 Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 perspective-container">
          {MEDICAL_SERVICES.slice(0, 6).map((service) => {
            return (
              <div
                key={service.id}
                className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-7 flex flex-col justify-between min-h-[420px] shadow-soft-lg hover:shadow-2xl transition-all duration-300 border border-white/20 group"
              >
                {/* Full Background Photograph covering the entire box */}
                <img
                  src={service.imageUrl || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800'}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                />
                
                {/* Dark Translucent Gradient Scrim */}
                <div className="full-bleed-card-scrim" />

                {/* Canva-inspired subtle inset line frame */}
                <div className="canva-frame" />

                {/* Content placed directly on top of the image */}
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 shadow-lg group-hover:scale-105 transition-transform">
                      <IconHelper name={service.iconName} className="w-5 h-5 text-teal-300" />
                    </div>
                    <div className="flex items-center gap-2">
                      {service.isPopular && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-400/40 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                          Popular
                        </span>
                      )}
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-200 bg-teal-950/80 border border-teal-400/40 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-extrabold text-xl text-white leading-snug drop-shadow-sm group-hover:text-teal-200 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white font-medium leading-relaxed drop-shadow-md line-clamp-3">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Key Benefits Preview directly over image */}
                  <div className="space-y-1.5 pt-2 border-t border-white/15">
                    {service.keyBenefits.slice(0, 2).map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white font-medium drop-shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight text-white">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions directly over image */}
                <div className="relative z-10 pt-4 mt-4 border-t border-white/15 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('services')}
                    className="text-xs font-bold text-teal-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Explore Service</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('appointments')}
                    className="btn-teal text-xs py-2 px-4 font-bold shadow-md hover:scale-105 transition-transform"
                  >
                    Book Visit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. CLINICAL CARE & PATIENT OPERATIONS WORKFLOW (ZOHO HEALTHCARE CRM STYLE) */}
      <ZohoClinicalWorkflow onNavigate={onNavigate} />

      {/* 8. DIGITAL BOOKING SPOTLIGHT (MODERN LANDING PAGE SECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 perspective-container">
        <div className="perspective-card relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-white/25 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[440px]">
          {/* Real-world clinical desk / booking background image */}
          <img
            src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1600"
            alt="Clinical Appointment Desk"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            loading="lazy"
          />

          {/* Dark Multi-stop Scrim */}
          <div className="full-bleed-card-scrim bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-brand-950/85" />

          {/* Canva Inset Border Frame */}
          <div className="canva-frame" />
          
          <div className="relative z-10 lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-purple-500/30 text-purple-200 border border-purple-400/40 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Fast Digital Workflow</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Effortless Online Appointment Scheduling
            </h2>
            <p className="text-sm sm:text-base text-white/95 font-medium leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
              No long queues or crowded waiting rooms. Request an appointment slot online, receive a confirmation code, and walk in with minimal waiting time.
            </p>

            <div className="space-y-3 pt-2 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/30 border border-purple-400/40 text-purple-200 flex items-center justify-center font-bold backdrop-blur-md">1</div>
                <span className="font-semibold text-white drop-shadow-sm">Pick preferred morning or evening session</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-500/30 border border-teal-400/40 text-teal-200 flex items-center justify-center font-bold backdrop-blur-md">2</div>
                <span className="font-semibold text-white drop-shadow-sm">Receive instant request reference code</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/30 border border-blue-400/40 text-sky-200 flex items-center justify-center font-bold backdrop-blur-md">3</div>
                <span className="font-semibold text-white drop-shadow-sm">Confirmed via WhatsApp or Phone SMS</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('appointments')}
                className="btn-primary text-sm py-3 px-6 shadow-xl"
              >
                <Calendar className="w-4 h-4 text-tealAccent-300" />
                <span>Open Booking Form</span>
              </button>
              <a
                href={CLINIC_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-teal text-sm py-3 px-6 shadow-xl"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>

          <div className="relative z-10 lg:col-span-5 hidden lg:block">
            <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Live Consultation Slots</span>
                </div>
                <span className="text-[11px] font-bold text-tealAccent-300 bg-tealAccent-950/60 px-2.5 py-0.5 rounded-full border border-tealAccent-400/30">
                  Real-time
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 flex items-center justify-between shadow-md">
                  <div>
                    <p className="font-extrabold text-white text-xs sm:text-sm drop-shadow-sm">Morning Outpatient Session</p>
                    <p className="text-[11px] text-tealAccent-300 font-semibold">09:00 AM – 01:00 PM</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/25 text-emerald-300 font-bold text-[10px] rounded-lg border border-emerald-400/40 shadow-sm">Available</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 flex items-center justify-between shadow-md">
                  <div>
                    <p className="font-extrabold text-white text-xs sm:text-sm drop-shadow-sm">Evening Outpatient Session</p>
                    <p className="text-[11px] text-tealAccent-300 font-semibold">05:00 PM – 09:00 PM</p>
                  </div>
                  <span className="px-2.5 py-1 bg-teal-500/25 text-teal-300 font-bold text-[10px] rounded-lg border border-teal-400/40 shadow-sm">Open</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-tealAccent-950/60 border border-tealAccent-400/30 text-[11px] text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-tealAccent-300 flex-shrink-0" />
                <span>Zero wait assurance when token is pre-booked</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. FEATURED TREATMENTS & CONDITIONS */}
      <section className="bg-slateSubtle-100/70 py-16 sm:py-20 border-y border-slateSubtle-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            badge="Clinical Conditions"
            badgeVariant="teal"
            title="Conditions We Frequently Evaluate"
            subtitle="Explore symptom overviews and understand when to consult a doctor. All condition guides are framed with clinical safety and medical rigor."
            watermarkIcon={<HeartPulse className="w-20 h-20" />}
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-container">
            {HEALTH_CONDITIONS.slice(0, 6).map((condition) => (
              <div
                key={condition.id}
                className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-7 flex flex-col justify-between min-h-[420px] shadow-soft-lg hover:shadow-2xl transition-all duration-300 border border-white/20 group"
              >
                {/* Full Background Photograph */}
                <img
                  src={condition.imageUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'}
                  alt={condition.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                />
                
                {/* Dark Translucent Gradient Scrim */}
                <div className="full-bleed-card-scrim" />

                {/* Canva-inspired subtle inset line frame */}
                <div className="canva-frame" />

                {/* Content placed directly on top of the image */}
                <div className="relative z-10 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-200 bg-teal-950/80 border border-teal-400/40 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                      {condition.category}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg sm:text-xl text-white leading-snug drop-shadow-sm group-hover:text-teal-200 transition-colors">
                    {condition.name}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-white font-medium leading-relaxed drop-shadow-md line-clamp-3">
                    {condition.overview}
                  </p>

                  <div className="pt-2 border-t border-white/15">
                    <p className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider mb-1.5 drop-shadow-sm">
                      Common Red Flags to Watch:
                    </p>
                    <ul className="space-y-1.5">
                      {condition.whenToConsult.slice(0, 2).map((flag, idx) => (
                        <li key={idx} className="text-xs text-white font-medium bg-amber-950/70 p-2 rounded-xl border border-amber-400/40 backdrop-blur-sm flex items-start gap-1.5 drop-shadow-sm">
                          <span className="text-amber-300 font-bold mt-0.5">&bull;</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="relative z-10 pt-4 mt-4 border-t border-white/15 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('treatments')}
                    className="text-xs font-bold text-teal-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Condition Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('appointments')}
                    className="text-xs font-bold text-white bg-slate-900/85 hover:bg-slate-900 border border-white/25 px-3 py-1.5 rounded-xl transition-all backdrop-blur-md shadow-md flex items-center gap-1"
                  >
                    <span>Consult Doctor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-8">
            <button
              onClick={() => onNavigate('treatments')}
              className="btn-secondary text-sm font-semibold"
            >
              <span>Explore All Health Conditions &amp; Protocols</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 9. CLINIC FACILITIES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <SectionHeading
            align="left"
            badge="Modern Infrastructure"
            badgeVariant="teal"
            title="Clinic Facilities & Comfort"
            subtitle="A calm, hygienic clinical environment designed with patient dignity, accessibility, and modern safety in mind."
            watermarkIcon={<Building2 className="w-20 h-20" />}
            className="max-w-2xl"
          />

          <button
            onClick={() => onNavigate('facilities')}
            className="btn-outline text-xs sm:text-sm font-semibold"
          >
            <span>Explore Facilities Page</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-container">
          {CLINIC_FACILITIES.slice(0, 3).map((fac) => (
            <div
              key={fac.id}
              className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-7 flex flex-col justify-between min-h-[430px] shadow-soft-lg hover:shadow-2xl transition-all duration-300 border border-white/20 group"
            >
              {/* Full-bleed Real Background Photo */}
              <img
                src={fac.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'}
                alt={fac.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
              />

              {/* Dark Multi-stop Scrim for 100% Text Readability */}
              <div className="full-bleed-card-scrim" />

              {/* Canva Delicately Inset Border Frame */}
              <div className="canva-frame" />

              {/* Top Section: Badges & Icon */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/85 backdrop-blur-md text-tealAccent-300 border border-white/20 flex items-center justify-center shadow-md">
                    <IconHelper name={fac.iconName} className="w-5 h-5 text-tealAccent-300" />
                  </div>
                  {fac.badge && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-200 bg-teal-900/60 backdrop-blur-md px-3 py-1 rounded-full border border-teal-400/30">
                      {fac.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide leading-snug group-hover:text-tealAccent-200 transition-colors drop-shadow-sm">
                    {fac.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white leading-relaxed font-medium line-clamp-3 drop-shadow-md">
                    {fac.shortDescription}
                  </p>
                </div>
              </div>

              {/* Bottom Details Section */}
              <div className="relative z-10 pt-4 mt-4 border-t border-white/15 space-y-3">
                <ul className="space-y-1.5">
                  {fac.details.slice(0, 2).map((d, i) => (
                    <li key={i} className="text-xs text-white flex items-start gap-2 font-medium drop-shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-tealAccent-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white">{d}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onNavigate('facilities')}
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900/85 hover:bg-slate-900 text-white font-semibold text-xs border border-white/25 transition-all backdrop-blur-md shadow-md"
                >
                  <span>Facility Details & Equipment</span>
                  <ArrowRight className="w-3.5 h-3.5 text-tealAccent-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. SAMPLE TESTIMONIALS (CLEARLY MARKED PLACEHOLDERS) */}
      <section className="bg-slateSubtle-100/60 py-16 sm:py-20 border-y border-slateSubtle-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            badge="Patient Feedback [Sample Demonstration]"
            badgeVariant="amber"
            title="What Patients Value in Our Practice"
            subtitle="Notice: The following testimonials are formatted sample templates for preview demonstration. Verified patient testimonials will be updated upon clinic authorization."
            watermarkIcon={<Users className="w-20 h-20" />}
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-container">
            {SAMPLE_TESTIMONIALS.map((test) => (
              <div
                key={test.id}
                className="perspective-card relative overflow-hidden rounded-3xl p-7 min-h-[350px] shadow-xl border border-white/20 group flex flex-col justify-between hover:-translate-y-2 transition-all duration-300"
              >
                {/* Real Background Clinical Photo */}
                <img
                  src={test.imageUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'}
                  alt={test.patientName}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                  loading="lazy"
                />

                {/* Dark Scrim Overlay */}
                <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/95 via-slate-900/85 to-slate-950/70" />

                {/* Canva Inset Border Frame */}
                <div className="canva-frame" />

                {/* Star Rating & Quote */}
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-300">
                      {Array.from({ length: test.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-200 bg-amber-500/25 border border-amber-400/40 px-2.5 py-1 rounded-full backdrop-blur-md">
                      Sample Feedback
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-white/95 font-medium italic leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                    &ldquo;{test.comment}&rdquo;
                  </p>
                </div>

                {/* Patient Attribution Directly on Top of Photo */}
                <div className="relative z-10 pt-4 border-t border-white/20 mt-4">
                  <p className="text-sm font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                    {test.patientName}
                  </p>
                  <p className="text-xs text-tealAccent-300 font-semibold mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    {test.visitReason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Common Inquiries"
          badgeVariant="blue"
          title="Frequently Asked Questions"
          subtitle="Quick answers regarding consultations, clinic timings, and appointment booking."
          watermarkIcon={<HelpCircle className="w-20 h-20" />}
          className="mb-10"
        />

        <div className="space-y-3">
          {FAQS.slice(0, 5).map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slateSubtle-200 overflow-hidden shadow-soft-sm transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slateSubtle-900 flex items-center justify-between gap-4 hover:bg-slateSubtle-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-tealAccent-600 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slateSubtle-600 leading-relaxed border-t border-slateSubtle-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center pt-6">
          <button
            onClick={() => onNavigate('faq')}
            className="text-xs sm:text-sm font-bold text-brand-800 hover:underline inline-flex items-center gap-1"
          >
            <span>View All FAQ Categories &amp; Policies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 12. HIGH-IMPACT APPOINTMENT CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden bg-gradient-to-r from-brand-950 via-brand-900 to-tealAccent-900 rounded-3xl p-8 sm:p-14 text-white shadow-soft-xl text-center space-y-6">
          
          {/* Authentic Hospital Background Photo with Dark Gradient Scrim */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1400"
              alt=""
              className="w-full h-full object-cover opacity-15 mix-blend-luminosity scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-900/90 to-tealAccent-950/95" />
          </div>

          {/* ── Ambient Glow Elements & Canvas Vectors ── */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Glowing teal orb */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full animate-pulse-glow"
              style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.30) 0%, transparent 70%)', filter: 'blur(50px)' }} />
            {/* Blue glow orb */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full animate-float"
              style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)', filter: 'blur(50px)' }} />

            {/* Decorative Vector Medical Cross (Top-Right) */}
            <div className="absolute top-6 right-8 opacity-15 animate-float hidden sm:block">
              <svg viewBox="0 0 60 60" fill="none" className="w-16 h-16">
                <rect x="22" y="4" width="16" height="52" rx="8" fill="white" />
                <rect x="4" y="22" width="52" height="16" rx="8" fill="white" />
              </svg>
            </div>

            {/* Decorative Vector Medical Cross (Bottom-Left) */}
            <div className="absolute bottom-6 left-8 opacity-15 animate-float-delayed hidden sm:block">
              <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                <rect x="15" y="3" width="10" height="34" rx="5" fill="#5eead4" />
                <rect x="3" y="15" width="34" height="10" rx="5" fill="#5eead4" />
              </svg>
            </div>

            {/* Subtle ECG heartbeat line across bottom */}
            <div className="absolute bottom-0 left-0 right-0 opacity-15">
              <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-8">
                <polyline
                  points="0,20 200,20 230,4 260,36 290,4 320,36 350,20 700,20 730,4 760,36 790,20 1200,20"
                  stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Micro grid pattern */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.12,
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-teal-400/40 text-tealAccent-200 text-xs font-bold backdrop-blur-md shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-tealAccent-300" />
              <span>Ready for Your Consultation?</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold max-w-2xl mx-auto tracking-tight leading-tight">
              Prioritize Your Health with Attentive, Professional Medical Care.
            </h2>

            <p className="text-sm sm:text-base text-white font-medium max-w-xl mx-auto leading-relaxed drop-shadow-md">
              Schedule your appointment with <strong>{primaryDoctor.name}</strong> online or connect with our front desk. Fast confirmations, organized token queues.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => onNavigate('appointments')}
                className="w-full sm:w-auto btn-teal py-3.5 px-8 text-sm sm:text-base shadow-soft-lg font-bold group"
              >
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Book Appointment Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={CLINIC_CONFIG.phoneCallValue}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/85 hover:bg-slate-900 border border-white/30 text-white text-sm sm:text-base font-bold backdrop-blur-md shadow-md transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-tealAccent-300" />
                <span>Call Reception</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
