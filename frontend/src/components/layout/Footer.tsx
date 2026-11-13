import React from 'react';
import {
  HeartPulse,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { CLINIC_CONFIG, MEDICAL_SERVICES } from '../../config/clinicData';
import { PageRoute } from '../../types';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
  onOpenModal: (type: 'disclaimer' | 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenModal }) => {
  const quickLinks: { title: string; route: PageRoute }[] = [
    { title: 'Home', route: 'home' },
    { title: 'About Sindhu Clinic', route: 'about' },
    { title: 'Doctor Profile', route: 'doctor' },
    { title: 'Clinical Services', route: 'services' },
    { title: 'Treatments & Care', route: 'treatments' },
    { title: 'Clinic Facilities', route: 'facilities' },
    { title: 'Preventive Wellness', route: 'wellness' },
    { title: 'Patient Information', route: 'patient-info' },
    { title: 'Health Resources & Blog', route: 'blog' },
    { title: 'Frequently Asked Questions', route: 'faq' },
    { title: 'Contact & Directions', route: 'contact' },
  ];

  return (
    <footer className="bg-slateSubtle-900 text-slateSubtle-300 pt-16 pb-24 lg:pb-12 border-t border-slateSubtle-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slateSubtle-800">
          
          {/* Column 1: Clinic Overview & Branding (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center text-white shadow-soft-sm">
                <HeartPulse className="w-5 h-5 text-tealAccent-400" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">Sindhu</span>{' '}
                <span className="text-xl font-light text-tealAccent-400">Clinic</span>
              </div>
            </div>

            <p className="text-sm text-slateSubtle-400 leading-relaxed">
              {CLINIC_CONFIG.subheadline} Committed to clinical precision, empathetic listening, and accessible primary healthcare.
            </p>

            {/* Emergency Box */}
            <div className="bg-slateSubtle-800/80 border border-slateSubtle-700/80 rounded-xl p-3.5 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>Emergency Advisory</span>
              </div>
              <p className="text-slateSubtle-400 leading-normal">
                Outpatient clinic. For life-threatening emergencies, please proceed immediately to the nearest tertiary emergency department or dial 108/112.
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {quickLinks.slice(0, 6).map((item) => (
                <li key={item.route}>
                  <button
                    onClick={() => {
                      onNavigate(item.route);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-white/90 hover:text-tealAccent-300 transition-colors flex items-center gap-1.5 text-left font-medium"
                  >
                    <ChevronRight className="w-3 h-3 text-teal-400" />
                    <span>{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Patient Care & Services (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">
              Clinical Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {MEDICAL_SERVICES.slice(0, 6).map((svc) => (
                <li key={svc.id}>
                  <button
                    onClick={() => {
                      onNavigate('services');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-white/90 hover:text-tealAccent-300 transition-colors flex items-center gap-1.5 text-left truncate max-w-full font-medium"
                  >
                    <ChevronRight className="w-3 h-3 text-teal-400 flex-shrink-0" />
                    <span className="truncate">{svc.title}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    onNavigate('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-tealAccent-300 hover:underline font-bold flex items-center gap-1 pt-1"
                >
                  <span>View All 12 Services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Hours (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">
              Clinic Contact
            </h4>
            
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-tealAccent-400 flex-shrink-0 mt-0.5" />
                <span className="text-white/90 font-medium">
                  {CLINIC_CONFIG.address.line1}, {CLINIC_CONFIG.address.line2}, {CLINIC_CONFIG.address.city}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-tealAccent-400 flex-shrink-0" />
                <a
                  href={CLINIC_CONFIG.phoneCallValue}
                  className="hover:text-teal-300 font-bold text-white transition-colors"
                >
                  {CLINIC_CONFIG.phoneDisplay}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-tealAccent-400 flex-shrink-0" />
                <a
                  href={`mailto:${CLINIC_CONFIG.emailAddress}`}
                  className="hover:text-teal-300 font-bold text-white transition-colors truncate"
                >
                  {CLINIC_CONFIG.emailDisplay}
                </a>
              </div>

              <div className="pt-2 border-t border-slateSubtle-800 space-y-1">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Clock className="w-4 h-4 text-tealAccent-400" />
                  <span>Consultation Timings</span>
                </div>
                <p className="text-xs text-white/80 pl-6">
                  Mon – Sat: {CLINIC_CONFIG.timings.weekdayMorning} &amp; {CLINIC_CONFIG.timings.weekdayEvening}
                </p>
                <p className="text-xs text-white/80 pl-6">
                  Sun: {CLINIC_CONFIG.timings.sunday}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Medical Disclaimer Banner */}
        <div className="py-6 border-b border-slateSubtle-800 text-xs text-slateSubtle-400 leading-relaxed text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="flex-1">
            <strong>Medical Disclaimer:</strong> {CLINIC_CONFIG.medicalDisclaimer}
          </p>
          <div className="flex items-center space-x-4 flex-shrink-0">
            <button
              onClick={() => onOpenModal('disclaimer')}
              className="text-tealAccent-400 hover:underline"
            >
              Full Disclaimer
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenModal('privacy')}
              className="text-tealAccent-400 hover:underline"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenModal('terms')}
              className="text-tealAccent-400 hover:underline"
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slateSubtle-500 gap-3">
          <p>
            &copy; {new Date().getFullYear()} {CLINIC_CONFIG.name}. All rights reserved. Outpatient Healthcare Practice.
          </p>
          <p className="text-slateSubtle-500 text-[11px]">
            Designed with clinical precision &bull; Scalable Single-to-Multi Doctor Architecture
          </p>
        </div>
      </div>
    </footer>
  );
};
