import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  ArrowRight,
  Stethoscope,
  Activity,
  HeartPulse,
  ShieldCheck,
  Building2,
  HelpCircle,
  Sparkles,
  Calendar,
  LayoutDashboard
} from 'lucide-react';
import { PageRoute } from '../../types';
import {
  DOCTORS,
  MEDICAL_SERVICES,
  HEALTH_CONDITIONS,
  HEALTH_PACKAGES,
  CLINIC_FACILITIES,
  FAQS
} from '../../config/clinicData';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Module' | 'Service' | 'Condition' | 'Package' | 'Facility' | 'Doctor' | 'FAQ';
  route: PageRoute;
  badge?: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageRoute) => void;
  lang?: 'en' | 'ta';
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  lang = 'en'
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Compile searchable dataset
  const searchableData: SearchResultItem[] = [
    // Hospital Operating Modules
    {
      id: 'mod-exec',
      title: 'Executive Command Center',
      subtitle: 'Hospital-wide KPIs, IPD bed occupancy, census & audit streams',
      category: 'Module',
      route: 'admin-dashboard',
      badge: 'Admin'
    },
    {
      id: 'mod-ot',
      title: 'Operation Theatre (OT) & Surgical Suite',
      subtitle: 'Surgical scheduling, WHO safety checklist, PACU recovery & implant ledger',
      category: 'Module',
      route: 'hms-ot',
      badge: 'Clinical'
    },
    {
      id: 'mod-lis',
      title: 'Laboratory Information System (LIS)',
      subtitle: 'Pathology worklists, barcode sample accessioning & critical panic alerts',
      category: 'Module',
      route: 'hms-lis',
      badge: 'Diagnostics'
    },
    {
      id: 'mod-ris',
      title: 'Radiology Information System (RIS & PACS)',
      subtitle: 'Modality queues (CT, MRI, X-Ray, USG), DICOM viewer stub & TAT',
      category: 'Module',
      route: 'hms-ris',
      badge: 'Diagnostics'
    },
    {
      id: 'mod-bloodbank',
      title: 'Blood Bank & Component Inventory',
      subtitle: 'ABO/Rh component stocks (PRBC, FFP, Platelets), cross-matching & donors',
      category: 'Module',
      route: 'hms-bloodbank',
      badge: 'Blood Bank'
    },
    {
      id: 'mod-emergency',
      title: 'Emergency, Trauma & Ambulance Hub',
      subtitle: 'ESI Triage Levels 1-5, resuscitation crash bays & ambulance fleet GPS',
      category: 'Module',
      route: 'hms-emergency',
      badge: 'Emergency'
    },
    {
      id: 'mod-opd',
      title: 'OPD Doctor Consultation Desk & Rx',
      subtitle: 'Outpatient queue, patient intake vitals & digital prescription builder',
      category: 'Module',
      route: 'hms-opd',
      badge: 'Clinical'
    },
    {
      id: 'mod-ipd',
      title: 'IPD Ward & Bed Occupancy Matrix',
      subtitle: 'Inpatient census, ward bed allocation, admissions & transfers',
      category: 'Module',
      route: 'hms-ipd',
      badge: 'Clinical'
    },
    {
      id: 'mod-emr',
      title: 'Master Patient Index & EMR Registry',
      subtitle: 'Patient search, duplicate verification, masked National ID KYC',
      category: 'Module',
      route: 'patient-list',
      badge: 'EMR'
    },
    {
      id: 'mod-pharmacy',
      title: 'Pharmacy Inventory & Formulary Ledger',
      subtitle: 'Inward GRN receipt, burn rate velocity, storage conditions & department demand',
      category: 'Module',
      route: 'erp-pharmacy',
      badge: 'ERP'
    },
    {
      id: 'mod-billing',
      title: 'GST Billing & Counter POS Cashier',
      subtitle: 'Tax invoices, itemized charges, UPI checkout & receipt printing',
      category: 'Module',
      route: 'erp-billing',
      badge: 'Finance'
    },
    {
      id: 'mod-tpa',
      title: 'TPA Insurance Claims & Cashless Desk',
      subtitle: 'Pre-auth authorizations, enhancement requests, query resolution & denials',
      category: 'Module',
      route: 'erp-tpa-claims',
      badge: 'Insurance'
    },
    {
      id: 'mod-procurement',
      title: 'Procurement, Purchase Orders & Vendors',
      subtitle: 'Multi-tier PO generation, 3-way matching (PO vs GRN vs Invoice) & vendors',
      category: 'Module',
      route: 'erp-procurement',
      badge: 'ERP'
    },
    {
      id: 'mod-biomedical',
      title: 'Biomedical Engineering & Equipment Assets',
      subtitle: 'Medical equipment PPM schedules, breakdown ticketing & AMC/CMC contracts',
      category: 'Module',
      route: 'erp-biomedical',
      badge: 'Assets'
    },
    {
      id: 'mod-cssd',
      title: 'CSSD Sterilization & Infection Control',
      subtitle: 'Autoclave spore test verification, tray sterility & BMW waste tracking',
      category: 'Module',
      route: 'erp-cssd-infection',
      badge: 'Quality'
    },
    {
      id: 'mod-finance',
      title: 'Financial Accounting & Cost Center P&L',
      subtitle: 'Departmental P&L, doctor consultation fee shares & POS reconciliation',
      category: 'Module',
      route: 'erp-finance',
      badge: 'Finance'
    },
    {
      id: 'mod-payroll',
      title: 'Healthcare Payroll & Remuneration',
      subtitle: 'Monthly payroll runs, night shift differentials, EPF/ESI/TDS & NEFT export',
      category: 'Module',
      route: 'hrms-payroll',
      badge: 'HRMS'
    },
    {
      id: 'mod-credentialing',
      title: 'Doctor Credentialing & Clinical Privileging',
      subtitle: 'Medical council licenses, surgical privileges matrix & BLS/ACLS status',
      category: 'Module',
      route: 'hrms-credentialing',
      badge: 'HRMS'
    },
    {
      id: 'mod-incidents',
      title: 'Patient Safety Incidents & CAPA',
      subtitle: 'Sentinel event logging, anonymous whistleblowing, 5-Whys RCA & CAPA',
      category: 'Module',
      route: 'admin-incidents',
      badge: 'Safety'
    },
    {
      id: 'mod-compliance',
      title: 'Statutory Licenses & NABH Accreditation',
      subtitle: 'AERB, Fire NOC, BMW, Pharmacy permits & NABH 5th Edition compliance',
      category: 'Module',
      route: 'admin-compliance',
      badge: 'Compliance'
    },
    {
      id: 'mod-packages',
      title: 'Preventive Health Packages & Corporate MOUs',
      subtitle: 'Comprehensive checkup package builder, corporate wellness agreements',
      category: 'Module',
      route: 'crm-health-packages',
      badge: 'CRM'
    },
    {
      id: 'mod-referrals',
      title: 'Doctor Referral Network & Affiliates',
      subtitle: 'Referring doctor directory, tertiary patient cases & handback notes',
      category: 'Module',
      route: 'crm-referrals',
      badge: 'CRM'
    },
    // Doctor
    {
      id: 'doc-1',
      title: `${DOCTORS[0].name} (${DOCTORS[0].qualifications})`,
      subtitle: `${DOCTORS[0].specialization} · Reg: ${DOCTORS[0].registrationNumber}`,
      category: 'Doctor',
      route: 'doctor',
      badge: 'Consultant'
    },
    // Services
    ...MEDICAL_SERVICES.map((s) => ({
      id: `svc-${s.id}`,
      title: s.title,
      subtitle: s.shortDescription,
      category: 'Service' as const,
      route: 'services' as PageRoute,
      badge: s.category
    })),
    // Conditions
    ...HEALTH_CONDITIONS.map((c) => ({
      id: `cond-${c.id}`,
      title: `${c.name} Management`,
      subtitle: c.overview,
      category: 'Condition' as const,
      route: 'treatments' as PageRoute,
      badge: 'Protocol'
    })),
    // Checkup Packages
    ...HEALTH_PACKAGES.map((p) => ({
      id: `pkg-${p.id}`,
      title: p.name,
      subtitle: `${p.tagline} · ${p.targetGroup}`,
      category: 'Package' as const,
      route: 'wellness' as PageRoute,
      badge: p.samplePricePlaceholder
    })),
    // Facilities
    ...CLINIC_FACILITIES.map((f) => ({
      id: `fac-${f.id}`,
      title: f.title,
      subtitle: f.shortDescription,
      category: 'Facility' as const,
      route: 'facilities' as PageRoute,
      badge: f.badge
    })),
    // Top FAQs
    ...FAQS.map((faq) => ({
      id: `faq-${faq.id}`,
      title: faq.question,
      subtitle: faq.answer.slice(0, 110) + '...',
      category: 'FAQ' as const,
      route: 'faq' as PageRoute,
      badge: faq.category
    }))
  ];

  const filteredResults = query.trim()
    ? searchableData.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.badge && item.badge.toLowerCase().includes(q))
        );
      }).slice(0, 8)
    : searchableData.slice(0, 6);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredResults[selectedIndex]);
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    onNavigate(item.route);
    onClose();
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Module':
        return <LayoutDashboard className="w-4 h-4 text-indigo-400" />;
      case 'Doctor':
        return <Stethoscope className="w-4 h-4 text-teal-400" />;
      case 'Service':
        return <Activity className="w-4 h-4 text-blue-400" />;
      case 'Condition':
        return <HeartPulse className="w-4 h-4 text-rose-400" />;
      case 'Package':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'Facility':
        return <Building2 className="w-4 h-4 text-amber-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-purple-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="relative p-4 sm:p-5 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-teal-300 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              lang === 'ta'
                ? 'மருத்துவ சேவை, அறிகுறிகள், அல்லது பரிசோதனைகளைத் தேடுக...'
                : 'Search clinic services, doctor, symptoms, tests, or FAQs...'
            }
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs text-slate-400">
          <span className="font-semibold text-slate-400 whitespace-nowrap">
            {lang === 'ta' ? 'விரைவு தேடல்:' : 'Popular:'}
          </span>
          {['Fever', 'Diabetes', 'ECG', 'Checkup Package', 'Timings', 'Doctor'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors text-xs whitespace-nowrap"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[50vh] overflow-y-auto p-2 space-y-1">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm font-semibold text-white">No direct matches found</p>
              <p className="text-xs text-slate-400">
                Try searching for general terms like "consultation", "sugar", "pressure", or "fever".
              </p>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-2xl flex items-center justify-between gap-3 transition-colors ${
                    isSelected
                      ? 'bg-slate-800/90 border border-teal-400/40 text-white'
                      : 'hover:bg-slate-800/50 text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-center flex-shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white truncate">{item.title}</span>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950 text-teal-300 border border-teal-500/30 flex-shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-teal-300 font-semibold flex-shrink-0">
                    <span className="hidden sm:inline">Go</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-3 bg-slate-950/80 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">↵</kbd> Select
            </span>
          </div>
          <button
            onClick={() => {
              onNavigate('appointments');
              onClose();
            }}
            className="text-teal-300 hover:text-white font-bold flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
