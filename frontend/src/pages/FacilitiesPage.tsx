import React from 'react';
import {
  Building2,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  ArrowRight,
  Info
} from 'lucide-react';
import { CLINIC_FACILITIES, CLINIC_CONFIG } from '../config/clinicData';
import { PageRoute } from '../types';
import { IconHelper } from '../components/common/IconHelper';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderNotice } from '../components/common/PlaceholderNotice';

interface FacilitiesPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Breadcrumbs */}
      <Breadcrumbs currentTitle="Clinic Facilities & Experience" onNavigate={onNavigate} />

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden bg-[#041628] rounded-3xl p-8 sm:p-14 text-white shadow-soft-xl">
          {/* Authentic Clinic Backdrop — Vivid & Recognizable */}
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600"
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/98 via-slate-950/90 to-brand-950/85 pointer-events-none" />
          <div className="canva-hero-frame" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 text-tealAccent-300 text-xs font-bold backdrop-blur-md border border-teal-400/40 shadow-sm">
              <Building2 className="w-3.5 h-3.5" />
              <span>Modern Clinical Infrastructure</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">
              Facilities &amp; Clinic Experience
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light drop-shadow-sm">
              Step inside Sindhu Clinic. Designed from the ground up to offer clinical hygiene, acoustic privacy, and calm comfort for patients and accompanying family members.
            </p>
          </div>
        </div>
      </section>

      {/* Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PlaceholderNotice />
      </div>

      {/* Facilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-container">
          {CLINIC_FACILITIES.map((facility) => (
            <div
              key={facility.id}
              className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-7 flex flex-col justify-between min-h-[460px] shadow-soft-lg hover:shadow-2xl transition-all duration-300 border border-white/20 group"
            >
              {/* Full-bleed Real Facility Backdrop Photo */}
              <img
                src={facility.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'}
                alt={facility.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
              />

              {/* Multi-stop Scrim for 100% Contrast */}
              <div className="full-bleed-card-scrim" />

              {/* Canva Delicately Inset Border Frame */}
              <div className="canva-frame" />

              {/* Top Section */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/85 backdrop-blur-md text-tealAccent-300 border border-white/20 flex items-center justify-center shadow-md">
                    <IconHelper name={facility.iconName} className="w-5 h-5 text-tealAccent-300" />
                  </div>
                  {facility.badge && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-200 bg-teal-900/60 backdrop-blur-md px-3 py-1 rounded-full border border-teal-400/30">
                      {facility.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide leading-snug group-hover:text-tealAccent-200 transition-colors drop-shadow-sm">
                    {facility.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white font-medium leading-relaxed drop-shadow-md">
                    {facility.shortDescription}
                  </p>
                </div>
              </div>

              {/* Bottom Infrastructure Highlights */}
              <div className="relative z-10 pt-4 mt-4 border-t border-white/15 space-y-3">
                <p className="text-[11px] font-bold text-tealAccent-300 uppercase tracking-wider drop-shadow-sm">
                  Infrastructure Highlights:
                </p>
                <ul className="space-y-1.5">
                  {facility.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-white font-medium drop-shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-tealAccent-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white">{detail}</span>
                    </li>
                  ))}
                </ul>

                {facility.title.includes('[') && (
                  <div className="p-2.5 bg-amber-950/60 backdrop-blur-md rounded-xl border border-amber-400/30 text-[11px] text-amber-200">
                    <em>Subject to clinic confirmation.</em>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hygiene & Sanitization Standard Showcase */}
      <section className="bg-brand-50/70 py-16 border-y border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="medical-badge medical-badge-teal">
                Our Cleanliness Guarantee
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-950">
                Hospital-Grade Infection Control in an Outpatient Setting
              </h2>
              <p className="text-sm text-slateSubtle-600 leading-relaxed">
                Infection prevention is non-negotiable in medical practice. At Sindhu Clinic, daily sterilization cycles and continuous contact-surface disinfection safeguard every visitor.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs sm:text-sm perspective-container">
                <div className="perspective-card relative overflow-hidden p-5 rounded-2xl border border-white/20 shadow-lg min-h-[140px] flex flex-col justify-end">
                  <img
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
                    alt="Disinfected Couch"
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                    loading="lazy"
                  />
                  <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
                  <div className="canva-frame" />
                  <div className="relative z-10">
                    <p className="font-extrabold text-white text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">Disinfected After Each Patient</p>
                    <p className="text-xs text-white/90 font-medium mt-0.5 leading-snug drop-shadow-sm">Examination couch sheets are replaced or disinfected immediately.</p>
                  </div>
                </div>

                <div className="perspective-card relative overflow-hidden p-5 rounded-2xl border border-white/20 shadow-lg min-h-[140px] flex flex-col justify-end">
                  <img
                    src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800"
                    alt="Touchless Sanitization"
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                    loading="lazy"
                  />
                  <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
                  <div className="canva-frame" />
                  <div className="relative z-10">
                    <p className="font-extrabold text-white text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">Touchless Sanitization</p>
                    <p className="text-xs text-white/90 font-medium mt-0.5 leading-snug drop-shadow-sm">Automated alcohol dispensers located in reception and consultation areas.</p>
                  </div>
                </div>

                <div className="perspective-card relative overflow-hidden p-5 rounded-2xl border border-white/20 shadow-lg min-h-[140px] flex flex-col justify-end">
                  <img
                    src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800"
                    alt="Regulated Waste Management"
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                    loading="lazy"
                  />
                  <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
                  <div className="canva-frame" />
                  <div className="relative z-10">
                    <p className="font-extrabold text-white text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">Regulated Waste Management</p>
                    <p className="text-xs text-white/90 font-medium mt-0.5 leading-snug drop-shadow-sm">Segregated biomedical bins for cotton swabs, sharps, and general materials.</p>
                  </div>
                </div>

                <div className="perspective-card relative overflow-hidden p-5 rounded-2xl border border-white/20 shadow-lg min-h-[140px] flex flex-col justify-end">
                  <img
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"
                    alt="Air Quality & Ventilation"
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                    loading="lazy"
                  />
                  <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
                  <div className="canva-frame" />
                  <div className="relative z-10">
                    <p className="font-extrabold text-white text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">Air Quality &amp; Ventilation</p>
                    <p className="text-xs text-white/90 font-medium mt-0.5 leading-snug drop-shadow-sm">Proper fresh air exchange and filtration to prevent indoor viral stagnation.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 perspective-container">
              <div className="perspective-card relative overflow-hidden p-7 sm:p-8 rounded-3xl border border-white/25 shadow-2xl space-y-4 min-h-[320px] flex flex-col justify-between">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
                  alt="Accessible Clinic Entrance"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                  loading="lazy"
                />
                <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
                <div className="canva-frame" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-white font-extrabold text-lg drop-shadow-sm">
                    <HeartHandshake className="w-6 h-6 text-tealAccent-300" />
                    <span>Accessible &amp; Welcoming to All</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-sm">
                    We recognize that visiting a clinic can be challenging for elderly patients with joint pain, expectant mothers, or individuals with restricted mobility.
                  </p>
                  <div className="space-y-2 text-xs text-white/90 font-medium pt-1">
                    <p>&bull; <strong className="text-white">Ground Floor Access:</strong> No long stairs or elevator waits.</p>
                    <p>&bull; <strong className="text-white">Drop-off Bay:</strong> Direct car access at the clinic gate.</p>
                    <p>&bull; <strong className="text-white">Attendant Assistance:</strong> Reception staff ready to assist walk-in elders.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Appointment CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden bg-[#041628] text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-soft-xl">
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1400"
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/98 via-slate-950/90 to-brand-950/85 pointer-events-none" />
          <div className="canva-hero-frame" />

          <div className="relative z-10 space-y-5">
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
              Experience Healthcare with Complete Peace of Mind
            </h3>
            <p className="text-sm sm:text-base text-white max-w-xl mx-auto leading-relaxed font-medium drop-shadow-md">
              Reserve your consultation slot today. Our front desk team ensures organized tokens and minimal wait times.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => onNavigate('appointments')}
                className="btn-teal py-3 px-8 text-sm font-bold shadow-soft-sm"
              >
                Book an Appointment
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 rounded-xl bg-slate-900/85 hover:bg-slate-900 border border-white/30 text-white font-bold text-sm backdrop-blur-md shadow-md transition-all hover:scale-105"
              >
                View Location &amp; Directions
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
