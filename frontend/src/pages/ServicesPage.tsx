import React, { useState } from 'react';
import {
  Stethoscope,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Info,
  X,
  Search,
  Filter
} from 'lucide-react';
import { MEDICAL_SERVICES, CLINIC_CONFIG } from '../config/clinicData';
import { MedicalService, PageRoute } from '../types';
import { IconHelper } from '../components/common/IconHelper';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderNotice } from '../components/common/PlaceholderNotice';
import { PageHeroBanner } from '../components/common/PageHeroBanner';

interface ServicesPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Primary Care', 'Chronic Care', 'Specialized Care', 'Wellness', 'Consultation'];

  const filteredServices = MEDICAL_SERVICES.filter((svc) => {
    const matchesCategory = selectedCategory === 'All' || svc.category === selectedCategory;
    const matchesSearch =
      svc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Breadcrumbs */}
      <Breadcrumbs currentTitle="Medical Services" onNavigate={onNavigate} />

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PageHeroBanner
          badge="Comprehensive Outpatient Care"
          badgeIcon={<Stethoscope className="w-3.5 h-3.5 text-teal-300" />}
          title="Clinical &"
          titleAccent="Medical Services"
          subtitle="Explore our range of primary healthcare, chronic disease management, and preventive wellness consultations provided at Sindhu Clinic."
          icon={<Stethoscope className="w-16 h-16" />}
          bgImageUrl="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600"
          className="rounded-3xl shadow-soft-xl"
        />
      </div>

      {/* Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PlaceholderNotice />
      </div>

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slateSubtle-200 shadow-soft-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Categories Pill Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-brand-800 text-white shadow-sm'
                    : 'bg-slateSubtle-100 text-slateSubtle-700 hover:bg-slateSubtle-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slateSubtle-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slateSubtle-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>

        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-container">
          {filteredServices.map((service) => (
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
              
              {/* Dark Translucent Gradient Scrim ensuring 100% text readability */}
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
                        Popular Choice
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
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300 drop-shadow-sm">
                    Clinical Highlights:
                  </p>
                  {service.keyBenefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-white font-medium drop-shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions directly over image */}
              <div className="relative z-10 pt-4 mt-4 border-t border-white/15 flex items-center justify-between">
                <button
                  onClick={() => setSelectedService(service)}
                  className="text-xs font-bold text-teal-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Clinical Details</span>
                </button>

                <button
                  onClick={() => onNavigate('appointments')}
                  className="btn-teal text-xs py-2 px-4 font-bold shadow-md hover:scale-105 transition-transform"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Visit</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slateSubtle-200 space-y-3">
            <Info className="w-10 h-10 text-slateSubtle-400 mx-auto" />
            <p className="font-semibold text-slateSubtle-700">No services match your search criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="btn-outline text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Detail Modal with Photo Banner */}
      {selectedService && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slateSubtle-900/60 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-soft-xl border border-slateSubtle-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Image Banner if present */}
            {selectedService.imageUrl ? (
              <div className="relative h-48 w-full overflow-hidden bg-slate-900 flex-shrink-0">
                <img
                  src={selectedService.imageUrl}
                  alt={selectedService.title}
                  className="w-full h-full object-cover"
                />
                <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-900/40" />
                <div className="canva-hero-frame pointer-events-none" />
                <button
                  onClick={() => setSelectedService(null)}
                  aria-label="Close details"
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md transition-colors border border-white/20"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="absolute bottom-4 left-6 right-6 z-10 text-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300 bg-teal-950/80 border border-teal-400/40 px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm inline-block mb-1.5">
                    {selectedService.category}
                  </span>
                  <h3 className="font-extrabold text-xl sm:text-2xl text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {selectedService.title}
                  </h3>
                </div>
              </div>
            ) : (
              <div className="p-6 border-b border-slateSubtle-100 flex items-center justify-between bg-slateSubtle-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-800">
                    <IconHelper name={selectedService.iconName} className="w-5 h-5 text-brand-800" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slateSubtle-900 text-lg leading-tight">
                      {selectedService.title}
                    </h3>
                    <span className="text-xs text-tealAccent-700 font-semibold">
                      {selectedService.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  aria-label="Close details"
                  className="p-1.5 rounded-lg text-slateSubtle-400 hover:text-slateSubtle-700 hover:bg-slateSubtle-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slateSubtle-600 leading-relaxed">
              <div>
                <h4 className="font-bold text-slateSubtle-900 mb-1">Service Overview</h4>
                <p>{selectedService.fullDescription}</p>
              </div>

              <div>
                <h4 className="font-bold text-slateSubtle-900 mb-1">Target Patients</h4>
                <p>{selectedService.targetAudience}</p>
              </div>

              <div>
                <h4 className="font-bold text-slateSubtle-900 mb-1">Key Clinical Benefits</h4>
                <ul className="space-y-1.5 pt-1">
                  {selectedService.keyBenefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-tealAccent-600 flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedService.preparationNote && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <strong>Patient Preparation Note:</strong> {selectedService.preparationNote}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slateSubtle-100 bg-slateSubtle-50 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedService(null)}
                className="btn-outline text-xs py-2 px-4"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedService(null);
                  onNavigate('appointments');
                }}
                className="btn-primary text-xs py-2 px-5 font-bold shadow-sm"
              >
                <Calendar className="w-4 h-4 text-tealAccent-300" />
                <span>Book This Service</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scalable Service Architecture Banner with Real-World Backdrop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden bg-brand-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft-xl border border-white/20">
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200"
              alt=""
              className="w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-900/90 to-brand-900/95" />
          </div>
          <div className="canva-hero-frame pointer-events-none" />

          <div className="relative z-10 space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">Need a Specific Health Evaluation?</h3>
            <p className="text-xs sm:text-sm text-white font-medium leading-relaxed drop-shadow-md">
              If you have previous medical records or are experiencing symptoms not listed above, our physician provides thorough preliminary reviews.
            </p>
          </div>
          <button
            onClick={() => onNavigate('appointments')}
            className="relative z-10 btn-teal py-3 px-6 text-sm font-bold shadow-soft-sm whitespace-nowrap"
          >
            Schedule a Consultation
          </button>
        </div>
      </section>

    </div>
  );
};
