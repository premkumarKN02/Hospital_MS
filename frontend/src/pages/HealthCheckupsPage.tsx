import React from 'react';
import {
  ShieldCheck,
  Calendar,
  CheckCircle2,
  HeartPulse,
  Users,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { HEALTH_PACKAGES, CLINIC_CONFIG } from '../config/clinicData';
import { PageRoute } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderNotice } from '../components/common/PlaceholderNotice';

interface HealthCheckupsPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const HealthCheckupsPage: React.FC<HealthCheckupsPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Breadcrumbs */}
      <Breadcrumbs currentTitle="Preventive Health & Checkups" onNavigate={onNavigate} />

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden bg-[#041628] rounded-3xl p-8 sm:p-14 text-white shadow-soft-xl">
          {/* Authentic Checkup Lab Backdrop — Vivid & Recognizable */}
          <img
            src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1600"
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/98 via-slate-950/90 to-brand-950/85 pointer-events-none" />
          <div className="canva-hero-frame" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 text-tealAccent-300 text-xs font-bold backdrop-blur-md border border-teal-400/40 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Proactive Wellness Medicine</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">
              Preventive Health Checkups &amp; Screenings
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light drop-shadow-sm">
              Detect silent health imbalances before symptoms develop. Our physician-guided preventive packages provide comprehensive baseline health benchmarks.
            </p>
          </div>
        </div>
      </section>

      {/* Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PlaceholderNotice />
      </div>

      {/* Why Preventive Health Matters */}
      {/* Screening Importance Hero Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 perspective-container">
        <div className="perspective-card relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl p-6 sm:p-10 border border-white/25 shadow-2xl min-h-[380px]">
          {/* Background Clinical Photo */}
          <img
            src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200"
            alt="Clinical Screening"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            loading="lazy"
          />
          {/* Dark Scrim */}
          <div className="full-bleed-card-scrim bg-gradient-to-r from-slate-950/98 via-slate-900/90 to-brand-950/85" />
          {/* Canva Inset Line */}
          <div className="canva-frame" />

          <div className="relative z-10 lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-tealAccent-500/30 text-tealAccent-200 border border-tealAccent-400/40 backdrop-blur-md">
              Early Detection Saves Lives
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              Why Routine Health Screenings Matter
            </h2>
            <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              Major lifestyle conditions such as hypertension, type 2 diabetes, high cholesterol, and fatty liver disease rarely produce acute symptoms in their early stages.
            </p>
            <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              A comprehensive annual health screening establishes your personal baseline, detects subtle organ stress, and allows your doctor to reverse risk factors through lifestyle and dietary guidance rather than lifelong medications.
            </p>
          </div>

          <div className="relative z-10 lg:col-span-5 bg-slate-900/85 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-tealAccent-300 uppercase tracking-wider">Screening Checklist Guidelines:</h3>
            <ul className="space-y-2.5 text-xs text-white">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-tealAccent-300 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium"><strong className="text-white font-bold">Age 20–35:</strong> Annual blood pressure, BMI, fasting glucose &amp; lipid panel.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-tealAccent-300 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium"><strong className="text-white font-bold">Age 35–50:</strong> Complete metabolic profile, HbA1c, liver &amp; kidney evaluation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-tealAccent-300 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium"><strong className="text-white font-bold">Age 50+:</strong> Bi-annual review, ECG, bone mineral density, and micronutrient levels.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Checkup Packages Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="medical-badge medical-badge-teal">
            Checkup Packages [Sample Templates]
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-950">
            Tailored Health Screening Profiles
          </h2>
          <p className="text-xs sm:text-sm text-slateSubtle-500">
            The following checkup packages are sample configurations for preview. Final test lists and pricing will be determined by Sindhu Clinic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-container">
          {HEALTH_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[500px] shadow-soft-lg hover:shadow-2xl transition-all duration-300 border group ${
                pkg.popular
                  ? 'border-tealAccent-400 ring-2 ring-tealAccent-400/40'
                  : 'border-white/20'
              }`}
            >
              {/* Full-bleed Real Lab Background Photo */}
              <img
                src={pkg.imageUrl || 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800'}
                alt={pkg.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
              />

              {/* Dark Multi-stop Scrim for 100% Readability */}
              <div className="full-bleed-card-scrim" />

              {/* Canva Delicately Inset Border Frame */}
              <div className="canva-frame" />

              {/* Top Section */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-200 bg-teal-900/70 backdrop-blur-md px-3 py-1 rounded-full border border-teal-400/30">
                    {pkg.targetGroup}
                  </span>
                  {pkg.popular && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200 bg-amber-900/70 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/40">
                      Recommended Profile
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide leading-snug group-hover:text-tealAccent-200 transition-colors drop-shadow-sm">
                    {pkg.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-white font-medium leading-relaxed drop-shadow-md">
                    {pkg.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-3 bg-slate-950/85 backdrop-blur-md rounded-xl border border-white/20 text-xs text-white flex items-center justify-between shadow-md">
                  <span className="font-bold text-white drop-shadow-sm">Estimated Package Fee:</span>
                  <span className="font-mono font-bold text-tealAccent-300 text-sm drop-shadow-sm">{pkg.samplePricePlaceholder}</span>
                </div>

                {/* Included Tests List */}
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] font-bold text-tealAccent-300 uppercase tracking-wider drop-shadow-sm">
                    Included Clinical Investigations:
                  </p>
                  <ul className="space-y-1.5">
                    {pkg.includedTests.map((test, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-white font-medium drop-shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-tealAccent-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white">{test}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions Section */}
              <div className="relative z-10 pt-5 mt-5 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-white font-semibold drop-shadow-sm">
                  Rec. Frequency: {pkg.recommendedFrequency}
                </span>
                <button
                  onClick={() => onNavigate('appointments')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-brand-950 font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  <Calendar className="w-4 h-4 text-brand-900" />
                  <span>Inquire / Book Checkup</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Preparation Instructions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 perspective-container">
        <div className="perspective-card relative overflow-hidden rounded-3xl p-7 sm:p-9 border border-white/25 shadow-xl space-y-4 min-h-[220px]">
          {/* Background Clinical Photo */}
          <img
            src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200"
            alt="Checkup Preparation"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            loading="lazy"
          />
          {/* Dark Amber/Slate Scrim */}
          <div className="full-bleed-card-scrim bg-gradient-to-r from-amber-950/95 via-slate-950/90 to-brand-950/90" />
          {/* Canva Inset Line */}
          <div className="canva-frame" />

          <div className="relative z-10 flex items-center gap-2.5 text-white font-extrabold text-lg sm:text-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/25 border border-amber-400/40 flex items-center justify-center backdrop-blur-md">
              <AlertCircle className="w-5 h-5 text-amber-300" />
            </div>
            <span>How to Prepare for Your Preventive Health Checkup</span>
          </div>

          <ul className="relative z-10 space-y-2 text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            <li>&bull; <strong className="text-amber-200">Fasting Requirement:</strong> Maintain 8 to 10 hours of overnight fasting if blood sugar or lipid panels are scheduled. Water is permitted.</li>
            <li>&bull; <strong className="text-amber-200">Medications:</strong> Take regular morning blood pressure medications with a small sip of water, unless instructed otherwise by our physician.</li>
            <li>&bull; <strong className="text-amber-200">Previous Records:</strong> Bring previous test files, ECG strips, or health records from prior years for biomarker comparison.</li>
          </ul>
        </div>
      </section>

    </div>
  );
};
