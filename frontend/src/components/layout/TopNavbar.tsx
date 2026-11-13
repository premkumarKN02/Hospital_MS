import React, { useState } from 'react';
import {
  Search,
  Bell,
  Bot,
  Menu,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  X,
  PanelLeft
} from 'lucide-react';
import { PageRoute } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { CurrencyConfig } from '../../utils/currencyService';
import { HospitalBranch } from '../../utils/branchService';

export interface TopNavbarProps {
  currentPage: PageRoute;
  onOpenMobileMenu: () => void;
  onOpenVoice: () => void;
  onOpenAiCopilot: () => void;
  onOpenSearch: () => void;
  activeBranch?: HospitalBranch;
  onSelectBranch?: (branch: HospitalBranch) => void;
  activeCurrency?: CurrencyConfig;
  onSelectCurrency?: (currency: CurrencyConfig) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentPage,
  onOpenMobileMenu,
  onOpenAiCopilot,
  onOpenSearch,
  activeBranch,
  onSelectBranch,
  activeCurrency,
  onSelectCurrency,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic contextual breadcrumb
  const getBreadcrumbContext = () => {
    switch (currentPage) {
      case 'admin-dashboard':
        return { section: 'Governance', page: 'Command Center' };
      case 'admin-incidents':
        return { section: 'Safety & Quality', page: 'Incidents & CAPA' };
      case 'admin-compliance':
        return { section: 'Governance', page: 'NABH Compliance' };
      case 'hms-opd':
        return { section: 'Clinical', page: 'OPD Doctor Desk' };
      case 'hms-ipd':
        return { section: 'Clinical', page: 'IPD Ward & Census' };
      case 'hms-ot':
        return { section: 'Surgical', page: 'OT Suite & PACU' };
      case 'hms-emergency':
        return { section: 'Emergency', page: 'Trauma & Triage' };
      case 'hms-lis':
        return { section: 'Diagnostics', page: 'LIS Pathology' };
      case 'hms-ris':
        return { section: 'Diagnostics', page: 'RIS Radiology & PACS' };
      case 'hms-bloodbank':
        return { section: 'Diagnostics', page: 'Blood Bank' };
      case 'patient-list':
        return { section: 'Registry', page: 'Patient Master (MPI)' };
      case 'appointment-list':
        return { section: 'Scheduling', page: 'Appointments Console' };
      case 'erp-pharmacy':
        return { section: 'Supply Chain', page: 'Pharmacy Formulary' };
      case 'erp-billing':
        return { section: 'Finance', page: 'Billing & Invoicing' };
      case 'erp-tpa-claims':
        return { section: 'Insurance', page: 'TPA Cashless Pre-Auth' };
      case 'erp-procurement':
        return { section: 'Supply Chain', page: 'Procurement & POs' };
      case 'erp-biomedical':
        return { section: 'Assets', page: 'Biomedical PPM' };
      case 'erp-cssd-infection':
        return { section: 'Operations', page: 'CSSD & Infection' };
      case 'erp-finance':
        return { section: 'Finance', page: 'Cost Center P&L' };
      case 'hrms-roster':
        return { section: 'Workforce', page: 'Shift Roster' };
      case 'hrms-leaves':
        return { section: 'Workforce', page: 'Leave Approvals' };
      case 'hrms-payroll':
        return { section: 'Workforce', page: 'Payroll & Disbursal' };
      case 'hrms-credentialing':
        return { section: 'Governance', page: 'Doctor Credentials' };
      case 'doctor-list':
        return { section: 'Staff', page: 'Physician Directory' };
      case 'staff-list':
        return { section: 'Staff', page: 'Employee Directory' };
      case 'crm-pipeline':
        return { section: 'CRM', page: 'Patient Leads Pipeline' };
      case 'crm-feedback':
        return { section: 'CRM', page: 'Feedback & NPS' };
      case 'crm-health-packages':
        return { section: 'CRM', page: 'Health Packages' };
      case 'crm-referrals':
        return { section: 'CRM', page: 'Referral Network' };
      case 'patient-dashboard':
        return { section: 'Patient Portal', page: 'My Health' };
      case 'book-appointment':
        return { section: 'Patient Portal', page: 'Book Appointment' };
      case 'my-appointments':
        return { section: 'Patient Portal', page: 'My Consultations' };
      case 'my-records':
        return { section: 'Patient Portal', page: 'Medical Records' };
      default:
        return { section: 'Overview', page: 'Executive Dashboard' };
    }
  };

  const breadcrumbs = getBreadcrumbContext();

  return (
    <header className={`h-[60px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between fixed top-0 right-0 z-30 transition-all duration-200 ease-in-out shadow-[0_1px_2px_rgba(0,0,0,0.02)] no-print ${
      isCollapsed ? 'left-0 lg:left-[72px]' : 'left-0 lg:left-[256px]'
    }`}>

      {/* ── LEFT ZONE: Mobile Menu + Contextual Breadcrumb ── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger */}
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open Navigation Drawer"
          className="lg:hidden p-2 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Mobile-only brand */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              <path d="M12 5v14"/><path d="M5 12h14"/>
            </svg>
          </div>
          <span className="text-xs font-bold text-slate-950 dark:text-white">SINDHU</span>
        </div>

        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 truncate">
          <span className="text-slate-600 dark:text-slate-400 font-medium">{breadcrumbs.section}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="text-slate-950 dark:text-white font-bold truncate">{breadcrumbs.page}</span>
        </nav>
      </div>

      {/* ── RIGHT ZONE: Search Bar + AI Copilot + Alerts ── */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Modern Search Trigger (with Ctrl K Badge) */}
        <div className="w-[200px] sm:w-[260px] lg:w-[320px] hidden md:block">
          <button
            onClick={onOpenSearch}
            aria-label="Search records, patients and services"
            className="w-full h-8 flex items-center justify-between px-2.5 rounded-lg bg-slate-100/70 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2 min-w-0 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200">
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs truncate">Search records, patients...</span>
            </div>

          </button>
        </div>

        {/* Mobile Search Icon */}
        <button
          onClick={onOpenSearch}
          className="md:hidden w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          title="Search"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* AI Medical Copilot Button */}
        <button
          onClick={onOpenAiCopilot}
          className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center transition-colors cursor-pointer"
          title="AI Medical Copilot"
          aria-label="AI Medical Copilot"
        >
          <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400 stroke-[2]" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors relative cursor-pointer"
            title="Clinical Alerts"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 sm:w-88 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">Priority Alerts</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                    3 New
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                  aria-label="Close Alerts"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto mt-1">
                <div className="py-2.5 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-900 dark:text-white leading-tight">Critical Lab: K+ 6.8 mEq/L</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">UHID: P-9802 (ICU-04) • Needs urgent review</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 block">8m ago</span>
                  </div>
                </div>

                <div className="py-2.5 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-900 dark:text-white leading-tight">OT-1 Clearance Approved</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">CABG for Dr. Arun scheduled at 14:00</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 block">22m ago</span>
                  </div>
                </div>

                <div className="py-2.5 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-900 dark:text-white leading-tight">Blood Bank Verified</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">2 Units PRBCs reserved for Trauma Bay</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 block">40m ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
