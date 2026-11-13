import React from 'react';
import {
  HeartPulse,
  ShieldCheck,
  Award,
  Users,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building2,
  HeartHandshake,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { CLINIC_CONFIG, DOCTORS } from '../config/clinicData';
import { PageRoute } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderNotice } from '../components/common/PlaceholderNotice';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { SectionHeading } from '../components/common/SectionHeading';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const primaryDoctor = DOCTORS[0];

  const coreValues = [
    {
      title: 'Clinical Integrity',
      desc: 'We prescribe and recommend solely what is strictly medically necessary, respecting patient trust and evidence-based standards.',
      icon: ShieldCheck,
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Compassionate Listening',
      desc: 'Healing begins with hearing. Every patient consultation is given dedicated time without hurried interruptions.',
      icon: HeartHandshake,
      imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Preventive Focus',
      desc: 'Our clinical philosophy emphasizes early detection and lifestyle re-engineering to prevent disease progression before acute complications occur.',
      icon: HeartPulse,
      imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Patient Dignity & Privacy',
      desc: 'Acoustic privacy in consultation rooms and stringent medical confidentiality ensure complete peace of mind for every family member.',
      icon: Users,
      imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Breadcrumbs */}
      <Breadcrumbs currentTitle="About Sindhu Clinic" onNavigate={onNavigate} />

      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PageHeroBanner
          badge="Our Story & Philosophy"
          badgeIcon={<HeartPulse className="w-3.5 h-3.5 text-teal-300" />}
          title="Delivering Attentive, Compassionate"
          titleAccent="Healthcare"
          subtitle={`At ${CLINIC_CONFIG.name}, our founding commitment is simple yet profound: restoring the deeply personal, unhurried bond between patient and doctor.`}
          icon={<HeartPulse className="w-16 h-16" />}
          bgImageUrl="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600"
          className="rounded-3xl shadow-soft-xl"
        />
      </div>

      {/* Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PlaceholderNotice />
      </div>

      {/* Introduction & Origin */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="medical-badge medical-badge-blue">
              Our Foundations
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-950">
              A Healthcare Environment Designed Around You
            </h2>
            <p className="text-sm sm:text-base text-slateSubtle-600 leading-relaxed">
              In an era where healthcare can often feel commercialized, crowded, and impersonal, <strong>{CLINIC_CONFIG.name}</strong> was established as an outpatient haven of calm medical attentiveness.
            </p>
            <p className="text-sm sm:text-base text-slateSubtle-600 leading-relaxed">
              Led by our primary consultant physician <strong>{primaryDoctor.name}</strong>, our clinic focuses on comprehensive general medicine, chronic disease stability (such as hypertension and diabetes), and proactive preventive screening.
            </p>
            <p className="text-sm sm:text-base text-slateSubtle-600 leading-relaxed">
              We operate under the firm conviction that a successful medical outcome depends on two foundational elements: an accurate, scientifically grounded physical diagnosis, and a supportive, empathetic relationship where patients understand their body and health numbers.
            </p>
          </div>

          <div className="lg:col-span-5 perspective-container">
            <div className="perspective-card relative overflow-hidden p-7 rounded-3xl border border-white/25 shadow-2xl space-y-6 min-h-[340px]">
              {/* Background Photo */}
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
                alt="Clinic Pillars"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                loading="lazy"
              />
              {/* Dark Scrim */}
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
              {/* Canva Frame */}
              <div className="canva-frame" />

              <h3 className="relative z-10 font-extrabold text-xl text-white border-b border-white/20 pb-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                Key Clinic Pillars
              </h3>
              <div className="relative z-10 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-tealAccent-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white drop-shadow-sm">Unhurried Evaluations</h4>
                    <p className="text-xs text-white/90 font-medium">Every symptom and previous report is reviewed carefully.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-tealAccent-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white drop-shadow-sm">Rational Prescriptions</h4>
                    <p className="text-xs text-white/90 font-medium">Minimal pharmacotherapy with zero polypharmacy.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-tealAccent-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white drop-shadow-sm">Barrier-Free Accessibility</h4>
                    <p className="text-xs text-white/90 font-medium">Ground-floor entrance designed for senior citizens.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-brand-50/60 py-16 border-y border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 perspective-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="perspective-card relative overflow-hidden p-8 rounded-3xl border border-white/25 shadow-2xl space-y-4 min-h-[300px] flex flex-col justify-between">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"
                alt="Our Vision"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                loading="lazy"
              />
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
              <div className="canva-frame" />

              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-950/85 backdrop-blur-md text-white flex items-center justify-center border border-white/25 shadow-lg">
                  <Award className="w-6 h-6 text-tealAccent-300" />
                </div>
                <h3 className="text-2xl font-extrabold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">Our Vision</h3>
                <p className="text-sm sm:text-base text-white/95 font-medium leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                  To stand as the community’s most trusted outpatient healthcare practice—celebrated for patient-centric empathy, clinical excellence, absolute transparency, and setting the benchmark for ethical medical consultation.
                </p>
              </div>
            </div>

            <div className="perspective-card relative overflow-hidden p-8 rounded-3xl border border-white/25 shadow-2xl space-y-4 min-h-[300px] flex flex-col justify-between">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
                alt="Our Mission"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                loading="lazy"
              />
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
              <div className="canva-frame" />

              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-950/85 backdrop-blur-md text-white flex items-center justify-center border border-white/25 shadow-lg">
                  <HeartPulse className="w-6 h-6 text-rose-300" />
                </div>
                <h3 className="text-2xl font-extrabold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">Our Mission</h3>
                <p className="text-sm sm:text-base text-white/95 font-medium leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                  To empower individuals and families with accurate clinical diagnoses, proactive lifestyle guidance, and compassionate therapeutic care, preventing medical complications before they arise and fostering long-term wellness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Our Guiding Ethics"
          badgeVariant="blue"
          title="Our Core Values"
          subtitle="Every consultation, interaction, and prescription at Sindhu Clinic is governed by these moral cornerstones."
          watermarkIcon={<Award className="w-20 h-20" />}
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container">
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="perspective-card relative overflow-hidden rounded-3xl p-7 min-h-[340px] shadow-xl border border-white/20 group flex flex-col justify-between hover:-translate-y-2 transition-all duration-300"
              >
                {/* Background Photo */}
                <img
                  src={val.imageUrl}
                  alt={val.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                  loading="lazy"
                />
                <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
                <div className="canva-frame" />

                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950/85 backdrop-blur-md text-white flex items-center justify-center border border-white/25 shadow-lg">
                    <Icon className="w-6 h-6 text-tealAccent-300" />
                  </div>
                  <h4 className="font-extrabold text-xl text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">{val.title}</h4>
                  <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                    {val.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hygiene, Safety, & Environment */}
      <section className="bg-slateSubtle-100/70 py-16 border-y border-slateSubtle-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="medical-badge medical-badge-teal">
                Safety &amp; Sanitation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-950">
                A Calming, Hospital-Grade Sanitized Clinic Environment
              </h2>
              <p className="text-xs sm:text-sm text-slateSubtle-600 leading-relaxed">
                Visiting a clinic should bring reassurance, not stress. We maintain strict environmental disinfection standards to protect our patients and their accompanying families.
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm text-slateSubtle-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tealAccent-600" />
                  <span>Routine surface sanitization between patient visits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tealAccent-600" />
                  <span>Single-use disposable couch covers, gloves, and examination consumables</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tealAccent-600" />
                  <span>High-efficiency air circulation and purified indoor air</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tealAccent-600" />
                  <span>Strict biomedical waste segregation adhering to healthcare norms</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white p-7 rounded-3xl border border-slateSubtle-200 shadow-soft-sm space-y-4">
                <h4 className="font-bold text-brand-900 text-base">Patient-First Philosophy</h4>
                <p className="text-xs sm:text-sm text-slateSubtle-600 leading-relaxed">
                  We regard every patient as a whole person, not merely a collection of symptoms or test reports. We examine sleep patterns, stress levels, dietary routines, and work life to uncover the genuine drivers behind physical illness.
                </p>
                <div className="p-4 rounded-xl bg-tealAccent-50 border border-tealAccent-200/60 text-xs text-tealAccent-900 leading-relaxed">
                  <strong>Our Promise:</strong> You will never leave Sindhu Clinic wondering why a test was ordered or what a medicine does. We explain every step with clarity and warmth.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Future Growth Roadmap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden bg-[#041628] text-white rounded-3xl p-8 sm:p-12 shadow-soft-lg space-y-6 border border-white/20">
          {/* Authentic Clinical Architecture Backdrop — Vivid & Recognizable */}
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600"
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/98 via-slate-950/92 to-brand-950/88 pointer-events-none" />
          <div className="canva-hero-frame" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 text-tealAccent-300 text-xs font-bold backdrop-blur-md border border-teal-400/40 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 text-teal-300" />
              <span>Looking Ahead</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-white">
              Our Vision for Future Expansion &amp; Multidisciplinary Care
            </h3>

            <p className="text-sm sm:text-base text-white/95 font-medium max-w-3xl leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              While Sindhu Clinic currently operates around our primary consultant physician, our clinical and technological architecture has been intentionally designed to scale. As our community grows, our roadmap includes:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 shadow-xl space-y-1.5 transition-transform hover:-translate-y-1">
                <h4 className="font-extrabold text-sm sm:text-base text-tealAccent-300 drop-shadow-sm">Visiting Specialists</h4>
                <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-sm">Future specialized clinics in cardiology, pediatric wellness, and women's health.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 shadow-xl space-y-1.5 transition-transform hover:-translate-y-1">
                <h4 className="font-extrabold text-sm sm:text-base text-tealAccent-300 drop-shadow-sm">Enhanced Diagnostics</h4>
                <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-sm">In-house point-of-care testing and digital health monitoring integration.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 shadow-xl space-y-1.5 transition-transform hover:-translate-y-1">
                <h4 className="font-extrabold text-sm sm:text-base text-tealAccent-300 drop-shadow-sm">Community Health Initiatives</h4>
                <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-sm">Regular free community health awareness camps and diabetes screening sessions.</p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('appointments')}
                className="btn-teal py-3.5 px-6 text-sm font-bold shadow-lg hover:scale-105 transition-transform"
              >
                <span>Book a Consultation Today</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
              <button
                onClick={() => onNavigate('doctor')}
                className="px-6 py-3.5 rounded-xl bg-slate-900/85 hover:bg-slate-900 border border-white/30 text-white font-bold text-sm backdrop-blur-md shadow-lg hover:scale-105 transition-all"
              >
                <span>Meet Our Primary Doctor</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
