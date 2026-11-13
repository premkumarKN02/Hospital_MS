import React, { useState } from 'react';
import {
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldAlert,
  Search,
  ChevronRight
} from 'lucide-react';
import { HEALTH_CONDITIONS, CLINIC_CONFIG } from '../config/clinicData';
import { PageRoute } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderNotice } from '../components/common/PlaceholderNotice';

interface TreatmentsPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const TreatmentsPage: React.FC<TreatmentsPageProps> = ({ onNavigate }) => {
  const [selectedConditionId, setSelectedConditionId] = useState<string>(HEALTH_CONDITIONS[0].id);

  const selectedCondition =
    HEALTH_CONDITIONS.find((c) => c.id === selectedConditionId) || HEALTH_CONDITIONS[0];

  return (
    <div className="space-y-16 pb-20">
      {/* Breadcrumbs */}
      <Breadcrumbs currentTitle="Treatments & Health Conditions" onNavigate={onNavigate} />

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden bg-[#041628] rounded-3xl p-8 sm:p-14 text-white shadow-soft-xl">
          {/* Authentic Clinical Guidance Backdrop — Vivid & Recognizable */}
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1600"
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/98 via-slate-950/90 to-brand-950/85 pointer-events-none" />
          <div className="canva-hero-frame" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 text-tealAccent-300 text-xs font-bold backdrop-blur-md border border-teal-400/40 shadow-sm">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Evidence-Based Clinical Guidance</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">
              Health Conditions &amp; Clinical Care
            </h1>
            <p className="text-sm sm:text-base text-white leading-relaxed font-medium drop-shadow-md">
              Understand common medical ailments, recognize early warning red flags, and learn how our outpatient practice evaluates and stabilizes health conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PlaceholderNotice />
      </div>

      {/* Interactive Master-Detail Condition Browser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation: List of Conditions (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-5 border border-slateSubtle-200 shadow-soft-sm space-y-2">
            <h3 className="text-xs font-bold text-slateSubtle-400 uppercase tracking-wider px-3 py-2">
              Select Health Condition
            </h3>
            <div className="space-y-1.5">
              {HEALTH_CONDITIONS.map((cond) => {
                const isSelected = cond.id === selectedConditionId;
                return (
                  <button
                    key={cond.id}
                    onClick={() => setSelectedConditionId(cond.id)}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all duration-150 flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-800 text-white font-bold shadow-soft-sm'
                        : 'text-slateSubtle-700 hover:bg-slateSubtle-100 hover:text-brand-900'
                    }`}
                  >
                    <div>
                      <p className="text-xs sm:text-sm font-semibold">{cond.name}</p>
                      <p className={`text-[11px] ${isSelected ? 'text-tealAccent-300' : 'text-slateSubtle-400'}`}>
                        {cond.category}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-tealAccent-300' : 'text-slateSubtle-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Detail Pane (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slateSubtle-200 shadow-soft-md space-y-7">
            
            {/* Condition High-Resolution Photo Banner with Canva Inset Frame */}
            <div className="relative h-60 sm:h-72 w-full rounded-3xl overflow-hidden shadow-soft-lg group">
              <img
                src={selectedCondition.imageUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1000'}
                alt={selectedCondition.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              />
              <div className="full-bleed-card-scrim" />
              <div className="canva-frame" />
              
              <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between h-full">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-200 bg-teal-900/70 backdrop-blur-md px-3 py-1 rounded-full border border-teal-400/30">
                    {selectedCondition.category}
                  </span>
                </div>

                <div>
                  <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight drop-shadow-sm">
                    {selectedCondition.name}
                  </h2>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <h4 className="font-bold text-slateSubtle-900 text-sm uppercase tracking-wide">
                Condition Overview
              </h4>
              <p className="text-sm sm:text-base text-slateSubtle-600 leading-relaxed">
                {selectedCondition.overview}
              </p>
            </div>

            {/* Common Symptoms */}
            <div className="space-y-3">
              <h4 className="font-bold text-slateSubtle-900 text-sm uppercase tracking-wide">
                Common Clinical Presentations:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedCondition.commonSymptoms.map((symp, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slateSubtle-50 border border-slateSubtle-100 text-xs sm:text-sm text-slateSubtle-700">
                    <CheckCircle2 className="w-4 h-4 text-tealAccent-600 flex-shrink-0 mt-0.5" />
                    <span>{symp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* When to Consult Doctor (Red Flags) */}
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2.5">
              <h4 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>When to Consult a Doctor (Red Flag Indicators):</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-amber-900">
                {selectedCondition.whenToConsult.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">&bull;</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clinic Approach */}
            <div className="space-y-2">
              <h4 className="font-bold text-slateSubtle-900 text-sm uppercase tracking-wide">
                Our Outpatient Evaluation &amp; Management Approach
              </h4>
              <p className="text-sm text-slateSubtle-600 leading-relaxed bg-brand-50/50 p-4 rounded-2xl border border-brand-100">
                {selectedCondition.clinicApproach}
              </p>
            </div>

            {/* CTA inside Detail */}
            <div className="pt-4 border-t border-slateSubtle-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slateSubtle-500">
                Facing persistent symptoms? Schedule a one-on-one consultation.
              </p>
              <button
                onClick={() => onNavigate('appointments')}
                className="btn-primary text-xs sm:text-sm py-2.5 px-6 font-bold shadow-soft-sm whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-tealAccent-300" />
                <span>Book Consultation for This Condition</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Medical Safety Disclaimer Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 perspective-container">
        <div className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-7 border border-white/20 shadow-xl flex items-start gap-4 text-xs sm:text-sm text-white leading-relaxed">
          <img
            src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200"
            alt="Medical Safety Notice"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            loading="lazy"
          />
          <div className="full-bleed-card-scrim bg-gradient-to-r from-slate-950/98 via-slate-900/90 to-brand-950/85" />
          <div className="canva-frame" />

          <div className="relative z-10 w-11 h-11 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/25 flex items-center justify-center text-teal-300 shadow-lg flex-shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5 text-teal-300" />
          </div>
          <div className="relative z-10 space-y-1">
            <h4 className="font-extrabold text-white text-base drop-shadow-sm">Clinical Safety &amp; Diagnostic Disclaimer</h4>
            <p className="text-white/95 font-medium leading-relaxed drop-shadow-sm">
              Information on this page is for public educational awareness and should not replace an in-person physical clinical examination. Never alter your prescribed dosages without consulting your physician.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
