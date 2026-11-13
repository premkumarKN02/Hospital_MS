import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  Clock,
  Calendar,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  HeartPulse,
  MapPin,
  MessageSquare,
  ShieldAlert,
  Activity,
  Globe,
  Search,
  ShieldCheck,
  Info,
  FileText,
  BookOpen,
  HelpCircle,
  Stethoscope,
  Building2,
  Package,
  User
} from 'lucide-react';
import { CLINIC_CONFIG } from '../../config/clinicData';
import { PageRoute } from '../../types';
import { Language, TRANSLATIONS } from '../../utils/translations';

interface HeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  lang?: Language;
  onToggleLang?: () => void;
  onOpenSearch?: () => void;
  onOpenCalculators?: () => void;
  onOpenInsurance?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  lang = 'en',
  onToggleLang,
  onOpenSearch,
  onOpenCalculators,
  onOpenInsurance
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  // Scroll detection for sticky elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMoreOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
    setIsMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Primary desktop navigation links (always directly visible on lg, xl, 2xl)
  const primaryNavItems: { title: string; route: PageRoute; badge?: string }[] = [
    { title: t.navHome, route: 'home' },
    { title: t.navServices, route: 'services' },
    { title: t.navTreatments, route: 'treatments' },
    { title: t.navDoctor, route: 'doctor' },
    { title: t.navWellness, route: 'wellness' },
    { title: t.navFacilities, route: 'facilities' },
    { title: t.navContact, route: 'contact' },
  ];

  // Secondary items located in the interactive "More ▾" dropdown
  const moreNavItems: { title: string; route: PageRoute; icon: React.ReactNode; desc: string }[] = [
    {
      title: t.navAbout,
      route: 'about',
      icon: <Info className="w-4 h-4 text-blue-500" />,
      desc: 'Our clinical philosophy & primary care standards'
    },
    {
      title: t.navPatientGuide,
      route: 'patient-info',
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
      desc: 'Checklist, appointment tips & clinic policies'
    },
    {
      title: t.navBlog,
      route: 'blog',
      icon: <BookOpen className="w-4 h-4 text-purple-500" />,
      desc: 'Doctor-written patient health articles'
    },
    {
      title: t.navFaq,
      route: 'faq',
      icon: <HelpCircle className="w-4 h-4 text-amber-500" />,
      desc: 'Common questions on consultations & tests'
    },
    {
      title: 'Patient Portal',
      route: 'patient-login',
      icon: <HeartPulse className="w-4 h-4 text-teal-600" />,
      desc: 'View personal medical records, prescriptions & lab results'
    },
    {
      title: 'Staff & Admin Portal',
      route: 'staff-login',
      icon: <Building2 className="w-4 h-4 text-blue-600" />,
      desc: 'Employee management, clinical scheduling & approvals'
    }
  ];

  // All navigation items for mobile drawer
  const allMobileNavItems: { title: string; route: PageRoute; icon: React.ReactNode; badge?: string }[] = [
    { title: t.navHome, route: 'home', icon: <HeartPulse className="w-4 h-4 text-teal-500" /> },
    { title: 'Patient Portal', route: 'patient-login', icon: <User className="w-4 h-4 text-teal-600" />, badge: 'Login' },
    { title: 'Staff Portal', route: 'staff-login', icon: <Building2 className="w-4 h-4 text-blue-600" /> },
    { title: t.navServices, route: 'services', icon: <Stethoscope className="w-4 h-4 text-blue-500" /> },
    { title: t.navTreatments, route: 'treatments', icon: <Activity className="w-4 h-4 text-rose-500" /> },
    { title: t.navDoctor, route: 'doctor', icon: <Stethoscope className="w-4 h-4 text-teal-600" /> },
    { title: t.navWellness, route: 'wellness', icon: <Package className="w-4 h-4 text-emerald-500" /> },
    { title: t.navFacilities, route: 'facilities', icon: <Building2 className="w-4 h-4 text-amber-500" /> },
    { title: t.navPatientGuide, route: 'patient-info', icon: <FileText className="w-4 h-4 text-emerald-500" /> },
    { title: t.navAbout, route: 'about', icon: <Info className="w-4 h-4 text-blue-500" /> },
    { title: t.navBlog, route: 'blog', icon: <BookOpen className="w-4 h-4 text-purple-500" /> },
    { title: t.navFaq, route: 'faq', icon: <HelpCircle className="w-4 h-4 text-amber-500" /> },
    { title: t.navContact, route: 'contact', icon: <Phone className="w-4 h-4 text-teal-600" /> },
  ];

  const isMoreActive = ['about', 'patient-info', 'blog', 'faq'].includes(currentPage);

  return (
    <header className="w-full inset-x-0 top-0 left-0 right-0 z-50 sticky m-0 p-0 transition-all duration-300">
      
      {/* ── Level 1: Global Multi-Level Brand Utility Bar ── */}
      <div className="w-full bg-[#07172c] text-white text-xs py-2 px-3 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Live Status & Location */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px] whitespace-nowrap shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <span className="hidden xs:inline">Open Today: 9:00 AM – 9:00 PM</span>
              <span className="xs:hidden">Open: 9 AM–9 PM</span>
            </div>
            
            <div className="hidden md:flex items-center gap-1.5 text-white/90 text-[11px] font-medium whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
              <span>{CLINIC_CONFIG.address.city}</span>
            </div>

            <div className="hidden xl:flex items-center gap-1.5 text-white/90 text-[11px] font-medium whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
              <span>{CLINIC_CONFIG.timings.summary}</span>
            </div>
          </div>

          {/* Right: Quick Links, Emergency Hotline, WhatsApp, Insurance & Language */}
          <div className="flex items-center space-x-2 sm:space-x-4 text-[11px] flex-shrink-0">
            
            {/* Emergency Hotline (Desktop / Tablet) */}
            <div className="hidden lg:flex items-center gap-1.5 text-amber-300 font-semibold whitespace-nowrap">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>{t.emergencyNotice}</span>
            </div>

            <span className="hidden lg:inline text-slate-700">|</span>

            {/* OPD Insurance Guide Trigger */}
            <button
              onClick={onOpenInsurance}
              className="hidden md:inline-flex items-center gap-1.5 text-teal-300 hover:text-white font-semibold transition-colors whitespace-nowrap"
              title="OPD Insurance Reimbursement & TPA Guidance"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>{t.insuranceGuide}</span>
            </button>

            <span className="hidden md:inline text-slate-700">|</span>

            {/* Phone Call Link */}
            <a
              href={CLINIC_CONFIG.phoneCallValue}
              className="flex items-center gap-1.5 text-white hover:text-teal-300 font-bold transition-colors group whitespace-nowrap"
              title="Call Clinic Reception"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">{CLINIC_CONFIG.phoneDisplay}</span>
              <span className="sm:hidden text-[11px]">{t.callClinic}</span>
            </a>

            <span className="hidden xs:inline text-slate-700">|</span>

            {/* WhatsApp Link */}
            <a
              href={CLINIC_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xs:flex items-center gap-1.5 text-teal-300 hover:text-teal-200 font-semibold transition-colors whitespace-nowrap"
              title="Chat on WhatsApp Desk"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{t.whatsAppDesk}</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>

            <span className="text-slate-700">|</span>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="px-2 py-0.5 rounded-lg bg-teal-950/80 hover:bg-teal-900 border border-teal-400/40 text-teal-300 font-bold transition-all flex items-center gap-1 shadow-sm whitespace-nowrap"
              title="Switch language between English and Tamil"
            >
              <Globe className="w-3 h-3 text-teal-300 flex-shrink-0" />
              <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Patient Portal Link */}
            <button
              onClick={() => handleNavClick('patient-login')}
              className="text-white hover:text-teal-300 font-bold transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <User className="w-3 h-3 text-teal-400" />
              <span>Patient Portal</span>
            </button>

            <span className="hidden sm:inline text-slate-700">|</span>

            {/* Staff Portal Link */}
            <button
              onClick={() => handleNavClick('staff-login')}
              className="hidden sm:flex text-slate-300 hover:text-white font-medium transition-colors items-center gap-1 whitespace-nowrap"
            >
              <span>Staff Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Level 2: Main Brand Navigation Bar ── */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,40,80,0.12)] py-2 border-b border-slate-200'
            : 'bg-white/98 backdrop-blur-md border-b border-slate-200/80 py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 xl:gap-4">
          
          {/* Brand Logo & Clinical Identity */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left focus:outline-none flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#0f2850] via-[#1e3a8a] to-[#0d9488] flex items-center justify-center text-white shadow-md group-hover:scale-105 group-hover:shadow-teal-500/20 transition-all duration-300 relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <HeartPulse className="w-5 h-5 text-teal-300 group-hover:rotate-6 transition-transform" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-[#0a1f3d] leading-none">
                  Sindhu
                </span>
                <span className="text-lg sm:text-2xl font-light tracking-tight text-teal-600 leading-none">
                  Clinic
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-0.5 flex items-center gap-1.5">
                <span>Physician &amp; Primary Care</span>
                <span className="w-1 h-1 rounded-full bg-teal-500 hidden xs:inline-block" />
                <span className="text-teal-600 font-semibold lowercase hidden xs:inline-block">est. quality</span>
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links (Visible on lg, xl, 2xl screens: ≥ 1024px) */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
            {primaryNavItems.map((item) => {
              const isActive = currentPage === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`px-2 xl:px-2.5 py-1.5 xl:py-2 rounded-xl text-[12.5px] xl:text-[13px] font-medium transition-all duration-200 relative flex items-center gap-1 whitespace-nowrap ${
                    isActive
                      ? 'text-[#0f2850] font-bold bg-blue-50/90 shadow-sm border border-blue-200/70'
                      : 'text-slate-600 hover:text-[#0f2850] hover:bg-slate-100/80'
                  }`}
                >
                  <span>{item.title}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Interactive "More ▾" Dropdown for Secondary Navigation */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`px-2.5 xl:px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 relative flex items-center gap-1.5 ${
                  isMoreActive || isMoreOpen
                    ? 'text-[#0f2850] font-bold bg-blue-50/90 shadow-sm border border-blue-200/70'
                    : 'text-slate-600 hover:text-[#0f2850] hover:bg-slate-100/80'
                }`}
                aria-expanded={isMoreOpen}
                aria-haspopup="true"
              >
                <span>{t.navMore}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isMoreOpen ? 'rotate-180 text-teal-600' : 'text-slate-400'
                  }`}
                />
                {isMoreActive && (
                  <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full" />
                )}
              </button>

              {/* Dropdown Menu Card */}
              {isMoreOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Explore Clinic
                    </span>
                  </div>

                  <div className="space-y-1">
                    {moreNavItems.map((item) => {
                      const isActive = currentPage === item.route;
                      return (
                        <button
                          key={item.route}
                          onClick={() => handleNavClick(item.route)}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-[#0f2850] font-bold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-[#0f2850]'
                          }`}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 mt-0.5 flex-shrink-0">
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold leading-tight">{item.title}</p>
                            <p className="text-[11px] text-slate-400 font-normal truncate mt-0.5">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Action Tools in Dropdown */}
                  <div className="border-t border-slate-100 mt-2 pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setIsMoreOpen(false);
                        onOpenCalculators?.();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-teal-800 hover:bg-teal-50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-teal-600" />
                        <span>{t.healthTools}</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-900">4 Tools</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMoreOpen(false);
                        onOpenInsurance?.();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-blue-800 hover:bg-blue-50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>{t.insuranceGuide}</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">OPD Claims</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Action Buttons (Visible on lg, xl, 2xl screens: ≥ 1024px) */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-2.5 flex-shrink-0">
            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#0f2850] hover:bg-slate-100 border border-slate-200/80 transition-all shadow-sm"
              title="Search clinic services, doctors, symptoms"
            >
              <Search className="w-3.5 h-3.5 text-teal-600" />
              <span>Search</span>
            </button>

            {/* Book Appointment CTA */}
            <button
              onClick={() => handleNavClick('appointments')}
              className="inline-flex items-center gap-2 px-3.5 xl:px-4 py-2 xl:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0f2850] via-[#1e3a8a] to-[#0d9488] hover:from-[#0a1b36] hover:to-[#0b7a70] active:scale-[0.98] transition-all shadow-md hover:shadow-lg shadow-blue-900/20 group border border-white/20 whitespace-nowrap"
            >
              <Calendar className="w-4 h-4 text-teal-300 group-hover:scale-110 transition-transform" />
              <span>{t.bookAppointment}</span>
            </button>
          </div>

          {/* Mobile & Tablet Controls (< 1024px: lg:hidden) - Unified, Zero Button Duplication */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden flex-shrink-0">
            {/* Single Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-[#0f2850] hover:bg-slate-100 border border-slate-200 transition-colors shadow-sm"
              title="Search"
              aria-label="Search clinic"
            >
              <Search className="w-4 h-4 text-teal-600" />
            </button>

            {/* Compact Book Visit Action for Phones */}
            <button
              onClick={() => handleNavClick('appointments')}
              className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0f2850] to-[#0d9488] shadow-sm whitespace-nowrap active:scale-95 transition-transform"
            >
              {t.bookVisit}
            </button>

            {/* Hamburger / Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-[#0f2850] hover:bg-slate-100 transition-colors border border-slate-200 shadow-sm"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-900 animate-in spin-in-90 duration-150" />
              ) : (
                <Menu className="w-5 h-5 text-slate-800" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Backdrop Overlay (< 1024px) ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-[90px] sm:top-[98px] bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer Menu (< 1024px) ── */}
      {isMobileMenuOpen && (
        <div className="relative z-50 lg:hidden bg-white border-b border-slate-200 shadow-2xl max-h-[calc(100vh-100px)] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          
          {/* Operating Hours & Language Bar */}
          <div className="px-4 py-2.5 bg-blue-50/80 border-b border-blue-100 text-xs text-blue-950 flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>{CLINIC_CONFIG.timings.summary}</span>
            </span>
            <button
              onClick={onToggleLang}
              className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-300 flex items-center gap-1"
            >
              <Globe className="w-3 h-3" />
              <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          </div>

          {/* Quick Clinical Tools Grid */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border-b border-slate-100">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCalculators?.();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-teal-800 shadow-sm active:scale-95 transition-transform"
            >
              <Activity className="w-4 h-4 text-teal-600" />
              <span>{t.healthTools}</span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenInsurance?.();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-blue-800 shadow-sm active:scale-95 transition-transform"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>{t.insuranceGuide}</span>
            </button>
          </div>

          {/* Full Navigation List */}
          <div className="px-3 py-3 space-y-1">
            {allMobileNavItems.map((item) => {
              const isActive = currentPage === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0f2850] to-[#1e3a8a] text-white font-bold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.title}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-teal-400 text-slate-900' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-teal-300' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Actions Bar */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2.5">
            <button
              onClick={() => handleNavClick('appointments')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0f2850] via-[#1e3a8a] to-[#0d9488] shadow-md active:scale-98 transition-transform"
            >
              <Calendar className="w-4 h-4 text-teal-300" />
              <span>{t.bookAppointment}</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={CLINIC_CONFIG.phoneCallValue}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>{t.callClinic}</span>
              </a>
              <a
                href={CLINIC_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-900 shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
