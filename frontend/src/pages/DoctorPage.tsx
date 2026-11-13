import React from 'react';
import {
  Stethoscope,
  Award,
  Clock,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  Languages,
  BookOpen,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { CLINIC_CONFIG, DOCTORS } from '../config/clinicData';
import { PageRoute } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderNotice } from '../components/common/PlaceholderNotice';
import { PageHeroBanner } from '../components/common/PageHeroBanner';

interface DoctorPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const DoctorPage: React.FC<DoctorPageProps> = ({ onNavigate }) => {
  const doctor = DOCTORS[0];

  return (
    <div className="space-y-16 pb-20">
      {/* Breadcrumbs */}
      <Breadcrumbs currentTitle="Doctor Profile" onNavigate={onNavigate} />

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PageHeroBanner
          badge="Primary Medical Practitioner"
          badgeIcon={<Stethoscope className="w-3.5 h-3.5 text-teal-300" />}
          title="Meet Our"
          titleAccent="Primary Physician"
          subtitle="Dedicated clinical expertise, compassionate listening, and thorough outpatient medical consultation at Sindhu Clinic."
          icon={<Stethoscope className="w-16 h-16" />}
          bgImageUrl="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1600"
          className="rounded-3xl shadow-soft-xl"
        />
      </div>

      {/* Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PlaceholderNotice />
      </div>

      {/* Main Profile Card Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slateSubtle-200 shadow-soft-lg grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Photo & Key Stats as Unified Canva Card */}
          <div className="lg:col-span-5 perspective-container">
            <div className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/25 shadow-2xl space-y-6 text-center lg:text-left min-h-[600px] flex flex-col justify-between">
              {/* Background Clinical Suite Photo */}
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000"
                alt="Consultation Suite"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                loading="lazy"
              />
              {/* Dark Scrim */}
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/90 to-brand-950/85" />
              {/* Canva Frame */}
              <div className="canva-frame" />

              <div className="relative z-10 space-y-5">
                <div className="relative inline-block mx-auto lg:mx-0 group">
                  <div className="p-1 rounded-3xl bg-gradient-to-tr from-tealAccent-400 via-brand-500 to-tealAccent-300 shadow-2xl">
                    <img
                      src={doctor.photoUrl}
                      alt={doctor.name}
                      className="w-48 h-48 sm:w-56 sm:h-56 rounded-[22px] object-cover bg-white mx-auto"
                    />
                  </div>
                  <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-brand-900 to-tealAccent-700 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg border border-tealAccent-300/50 flex items-center gap-1.5 whitespace-nowrap">
                    <ShieldCheck className="w-3.5 h-3.5 text-tealAccent-300" />
                    <span>Lead Physician</span>
                  </span>
                </div>

                {/* Quick Details Box with Glass High-Contrast Typography */}
                <div className="bg-slate-900/85 backdrop-blur-xl rounded-2xl p-5 border border-white/15 space-y-3.5 text-xs sm:text-sm text-left">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-tealAccent-300">
                      Qualifications
                    </p>
                    <p className="font-bold text-white mt-0.5 drop-shadow-sm">
                      {doctor.qualifications}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-2.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-tealAccent-300">
                      Medical Registration
                    </p>
                    <p className="font-bold text-white mt-0.5 drop-shadow-sm">
                      {doctor.registrationNumber}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-2.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-tealAccent-300">
                      Clinical Experience
                    </p>
                    <p className="font-bold text-white mt-0.5 drop-shadow-sm">
                      {doctor.experienceYears}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-2.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-tealAccent-300 flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-tealAccent-300" />
                      <span>Languages Spoken</span>
                    </p>
                    <p className="font-bold text-white mt-0.5 drop-shadow-sm">
                      {doctor.languages.join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct CTA */}
              <div className="relative z-10 pt-2">
                <button
                  onClick={() => onNavigate('appointments')}
                  className="w-full btn-teal py-3.5 text-sm font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  <Calendar className="w-4 h-4 text-brand-950" />
                  <span>Book Consultation With Doctor</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Philosophy & Expertise */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="medical-badge medical-badge-teal mb-2">
                Consultant Physician &amp; Diabetologist
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-950">
                {doctor.name}
              </h2>
              <p className="text-sm sm:text-base font-semibold text-brand-700 mt-1">
                {doctor.specialization}
              </p>
            </div>

            {/* Biography */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-brand-950 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-tealAccent-600" />
                <span>Professional Biography</span>
              </h3>
              <p className="text-sm sm:text-base text-slateSubtle-600 leading-relaxed">
                {doctor.bio}
              </p>
            </div>

            {/* Treatment Philosophy as Canva Card */}
            <div className="perspective-card relative overflow-hidden p-6 sm:p-7 rounded-2xl border border-white/20 shadow-xl space-y-2.5 min-h-[140px] flex flex-col justify-center">
              <img
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1000"
                alt="Doctor Philosophy"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                loading="lazy"
              />
              <div className="full-bleed-card-scrim bg-gradient-to-r from-brand-950/98 via-slate-950/90 to-brand-950/85" />
              <div className="canva-frame" />

              <div className="relative z-10 space-y-2">
                <h3 className="font-extrabold text-base text-white flex items-center gap-2 drop-shadow-sm">
                  <HeartHandshake className="w-5 h-5 text-tealAccent-300" />
                  <span>Treatment &amp; Care Philosophy</span>
                </h3>
                <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed italic drop-shadow-md">
                  &ldquo;{doctor.treatmentPhilosophy}&rdquo;
                </p>
              </div>
            </div>

            {/* Consultation Approach */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-brand-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-tealAccent-600" />
                <span>Consultation Approach</span>
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {doctor.consultationApproach.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slateSubtle-50 border border-slateSubtle-200/70">
                    <CheckCircle2 className="w-4 h-4 text-tealAccent-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slateSubtle-700 font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas of Expertise */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-brand-950 flex items-center gap-2">
                <Award className="w-5 h-5 text-tealAccent-600" />
                <span>Areas of Clinical Expertise</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {doctor.areasOfExpertise.map((area, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slateSubtle-50 border border-slateSubtle-200/80 text-xs sm:text-sm font-semibold text-slateSubtle-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tealAccent-500"></span>
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Availability Schedule Table */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-lg text-brand-950 flex items-center gap-2">
                <Clock className="w-5 h-5 text-tealAccent-600" />
                <span>Weekly Consultation Schedule</span>
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-slateSubtle-200">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slateSubtle-100/80 text-slateSubtle-700 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5 sm:p-4">Day(s)</th>
                      <th className="p-3.5 sm:p-4">Consultation Timings</th>
                      <th className="p-3.5 sm:p-4">Queue / Protocol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slateSubtle-100">
                    {doctor.availability.map((avail, idx) => (
                      <tr key={idx} className="hover:bg-slateSubtle-50">
                        <td className="p-3.5 sm:p-4 font-semibold text-brand-950">{avail.days}</td>
                        <td className="p-3.5 sm:p-4 text-slateSubtle-700 font-medium">{avail.timings}</td>
                        <td className="p-3.5 sm:p-4 text-slateSubtle-500 text-xs">{avail.note || 'Regular tokens'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Scalable Multi-Doctor Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 perspective-container">
        <div className="perspective-card relative overflow-hidden p-6 sm:p-7 rounded-3xl border border-white/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200"
            alt="Medical Team"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            loading="lazy"
          />
          <div className="full-bleed-card-scrim bg-gradient-to-r from-slate-950/98 via-slate-900/90 to-brand-950/85" />
          <div className="canva-frame" />

          <div className="relative z-10 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 shadow-md flex-shrink-0">
              <UserPlus className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-white drop-shadow-sm">Scalable Medical Team Architecture</h4>
              <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-sm">
                This website is built with a scalable team structure. As Sindhu Clinic onboards visiting specialists or additional resident doctors, new doctor profiles can be activated with a single configuration entry.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="relative z-10 btn-teal text-xs py-2.5 px-5 font-bold shadow-md whitespace-nowrap hover:scale-105 transition-transform"
          >
            Inquire at Reception
          </button>
        </div>
      </section>

    </div>
  );
};
