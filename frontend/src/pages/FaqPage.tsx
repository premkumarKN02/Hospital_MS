import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageSquare,
  Phone,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { FAQS, CLINIC_CONFIG } from '../config/clinicData';
import { PageRoute } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderNotice } from '../components/common/PlaceholderNotice';

interface FaqPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-3']);

  const categories = [
    'All',
    'Appointments',
    'Consultation',
    'Clinic Timings',
    'Doctor',
    'Payments & Reports',
    'Emergency'
  ];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Breadcrumbs */}
      <Breadcrumbs currentTitle="Frequently Asked Questions" onNavigate={onNavigate} />

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden bg-[#041628] rounded-3xl p-8 sm:p-14 text-white shadow-soft-xl">
          {/* Authentic Clinical Architecture Backdrop — Vivid & Recognizable */}
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600"
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/98 via-slate-950/90 to-brand-950/85 pointer-events-none" />
          <div className="canva-hero-frame" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 text-tealAccent-300 text-xs font-bold backdrop-blur-md border border-teal-400/40 shadow-sm">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Patient Help Center</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">
              Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base text-white leading-relaxed font-medium drop-shadow-md">
              Find transparent answers about appointment procedures, consultation hours, diagnostic test reports, and clinic policies.
            </p>
          </div>
        </div>
      </section>

      {/* Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PlaceholderNotice />
      </div>

      {/* Search & Categories Filter */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slateSubtle-200 shadow-soft-sm space-y-4">
          
          <div className="relative">
            <Search className="w-4 h-4 text-slateSubtle-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slateSubtle-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-brand-800 text-white shadow-sm'
                    : 'bg-slateSubtle-100 text-slateSubtle-700 hover:bg-slateSubtle-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Accordion List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slateSubtle-200 overflow-hidden shadow-soft-sm transition-all"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slateSubtle-900 flex items-center justify-between gap-4 hover:bg-slateSubtle-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-tealAccent-700 bg-tealAccent-50 px-2 py-0.5 rounded-md hidden sm:inline">
                      {faq.category}
                    </span>
                    <span>{faq.question}</span>
                  </div>
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

        {filteredFaqs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slateSubtle-200 space-y-3">
            <HelpCircle className="w-10 h-10 text-slateSubtle-400 mx-auto" />
            <p className="font-semibold text-slateSubtle-700">No matching questions found.</p>
            <p className="text-xs text-slateSubtle-500">Have a specific question not covered here? Feel free to contact our reception.</p>
          </div>
        )}
      </section>

      {/* Still Have Questions Box with Full-Bleed Canva Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 perspective-container">
        <div className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"
            alt="Clinic Reception Assistance"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            loading="lazy"
          />
          <div className="full-bleed-card-scrim bg-gradient-to-r from-slate-950/98 via-slate-900/90 to-brand-950/85" />
          <div className="canva-frame" />

          <div className="relative z-10 space-y-1 text-center sm:text-left">
            <h3 className="font-extrabold text-lg sm:text-xl text-white drop-shadow-sm">
              Still Have a Question?
            </h3>
            <p className="text-xs sm:text-sm text-white/95 font-medium drop-shadow-sm">
              Our front desk reception is happy to guide you with timings, tokens, and records.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <a
              href={CLINIC_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-teal text-xs sm:text-sm py-2.5 px-4 font-bold shadow-md hover:scale-105 transition-transform"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="px-4 py-2.5 rounded-xl border border-white/30 text-white font-bold text-xs sm:text-sm backdrop-blur-md bg-slate-900/85 hover:bg-slate-900 shadow-md transition-all hover:scale-105"
            >
              <span>Contact Page</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
