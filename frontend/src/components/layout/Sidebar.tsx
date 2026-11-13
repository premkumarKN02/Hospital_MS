import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Stethoscope,
  Bed,
  Users,
  CalendarCheck,
  PhoneCall,
  Pill,
  Receipt,
  CalendarDays,
  CalendarRange,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  LogOut,
  ShieldCheck,
  FileText,
  Scissors,
  FlaskConical,
  Scan,
  Droplets,
  Siren,
  FileCheck,
  ShoppingCart,
  Cpu,
  Banknote,
  Award,
  Network,
  AlertTriangle,
  Activity,
  Building2,
  UserCheck,
  Radio,
  ExternalLink
} from 'lucide-react';
import { PageRoute } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { HospitalBranch } from '../../utils/branchService';

export interface SidebarProps {
  currentPage: PageRoute;
  onNavigate: (route: PageRoute) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  activeBranch?: HospitalBranch;
  onSelectBranch?: (branch: HospitalBranch) => void;
}

export interface NavSectionItem {
  route: PageRoute;
  label: string;
  badge?: string;
  badgeColor?: string;
}

export interface NavTopicGroup {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isDirectLink?: boolean;
  route?: PageRoute;
  items: NavSectionItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const { user, logout, login } = useAuth();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  // Role detection
  const userRole = (user?.roles?.[0] || 'ROLE_ADMIN').toUpperCase();
  const isPatient = userRole === 'ROLE_PATIENT' || user?.username?.startsWith('patient');
  const isDoctor = userRole === 'ROLE_DOCTOR' || user?.username?.startsWith('dr.');
  const isNurse = userRole === 'ROLE_NURSE' || user?.username?.startsWith('nurse');
  const isReception = userRole === 'ROLE_RECEPTION' || user?.username?.startsWith('reception');

  // Complete, domain-organized navigation groups matching all hospital suites
  const getNavGroups = (): NavTopicGroup[] => {
    if (isPatient) {
      return [
        {
          id: 'patient-dashboard-single',
          label: 'Dashboard',
          icon: LayoutGrid,
          isDirectLink: true,
          route: 'patient-dashboard' as PageRoute,
          items: []
        },
        {
          id: 'patient-portal',
          label: 'Patient Care Portal',
          icon: Users,
          items: [
            { route: 'patient-dashboard' as PageRoute, label: 'My Health Dashboard' },
            { route: 'book-appointment' as PageRoute, label: 'Book Consultation', badge: 'New', badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
            { route: 'my-appointments' as PageRoute, label: 'My Appointments' },
            { route: 'my-records' as PageRoute, label: 'My Medical Records' }
          ]
        },
        {
          id: 'patient-experience',
          label: 'Experience & Care',
          icon: UserCheck,
          items: [
            { route: 'crm-feedback' as PageRoute, label: 'Patient Feedback & NPS' }
          ]
        }
      ];
    }

    if (isDoctor) {
      return [
        {
          id: 'doctor-opd-single',
          label: 'Dashboard Overview',
          icon: LayoutGrid,
          isDirectLink: true,
          route: 'hms-opd' as PageRoute,
          items: []
        },
        {
          id: 'clinical-desks',
          label: 'Clinical Desks',
          icon: Stethoscope,
          items: [
            { route: 'hms-opd' as PageRoute, label: 'OPD Doctor Desk' },
            { route: 'hms-ipd' as PageRoute, label: 'IPD Ward & Beds' },
            { route: 'hms-ot' as PageRoute, label: 'OT & Surgery Suites' },
            { route: 'appointment-list' as PageRoute, label: 'Doctor Appointments' },
            { route: 'patient-list' as PageRoute, label: 'Patients EMR Chart' }
          ]
        },
        {
          id: 'diagnostics-roster',
          label: 'Diagnostics & Roster',
          icon: FlaskConical,
          items: [
            { route: 'hms-lis' as PageRoute, label: 'LIS Pathology Lab' },
            { route: 'hms-ris' as PageRoute, label: 'RIS Radiology & PACS' },
            { route: 'hrms-credentialing' as PageRoute, label: 'CME & Credentialing' },
            { route: 'hrms-roster' as PageRoute, label: 'Doctor Duty Roster' },
            { route: 'doctor-radar' as PageRoute, label: 'Doctor Live Radar & GPS', badge: 'LIVE', badgeColor: 'bg-emerald-500' },
            { route: 'hrms-leaves' as PageRoute, label: 'Leave Requests' }
          ]
        }
      ];
    }

    if (isNurse) {
      return [
        {
          id: 'nurse-ipd-single',
          label: 'Ward Overview',
          icon: LayoutGrid,
          isDirectLink: true,
          route: 'hms-ipd' as PageRoute,
          items: []
        },
        {
          id: 'nursing-ward',
          label: 'Nursing & Ward Care',
          icon: Bed,
          items: [
            { route: 'hms-ipd' as PageRoute, label: 'IPD Ward & Bed Matrix' },
            { route: 'hms-emergency' as PageRoute, label: 'Emergency (ER) Triage' },
            { route: 'hms-opd' as PageRoute, label: 'OPD Nursing Triage' },
            { route: 'patient-list' as PageRoute, label: 'Ward Patient Charts' },
            { route: 'erp-pharmacy' as PageRoute, label: 'Ward Medication Stock' }
          ]
        },
        {
          id: 'infection-shifts',
          label: 'Infection & Duty Shifts',
          icon: Activity,
          items: [
            { route: 'erp-cssd-infection' as PageRoute, label: 'Infection Control & CSSD' },
            { route: 'hrms-roster' as PageRoute, label: 'Nurse Shift Roster' },
            { route: 'hrms-leaves' as PageRoute, label: 'Duty Leave Requests' }
          ]
        }
      ];
    }

    if (isReception) {
      return [
        {
          id: 'reception-appt-single',
          label: 'Front Desk Overview',
          icon: LayoutGrid,
          isDirectLink: true,
          route: 'appointment-list' as PageRoute,
          items: []
        },
        {
          id: 'front-desk',
          label: 'Front Desk & Patient Access',
          icon: CalendarCheck,
          items: [
            { route: 'appointment-list' as PageRoute, label: 'Appointments Desk' },
            { route: 'patient-list' as PageRoute, label: 'Patient Intake (MPI)' },
            { route: 'erp-billing' as PageRoute, label: 'Billing POS & Counter' },
            { route: 'crm-pipeline' as PageRoute, label: 'Patient Leads Pipeline' },
            { route: 'crm-health-packages' as PageRoute, label: 'Health Checkup Packages' }
          ]
        },
        {
          id: 'insurance-feedback',
          label: 'Insurance & Claims',
          icon: FileCheck,
          items: [
            { route: 'erp-tpa-claims' as PageRoute, label: 'TPA Pre-Auth Desk' },
            { route: 'crm-feedback' as PageRoute, label: 'Patient Feedback' },
            { route: 'hrms-roster' as PageRoute, label: 'Duty Clock-In Roster' }
          ]
        }
      ];
    }

    // Default: Executive Hospital Administrator Suite (All 29 modules categorized)
    return [
      {
        id: 'admin-dashboard-single',
        label: 'Dashboard Overview',
        icon: LayoutGrid,
        isDirectLink: true,
        route: 'admin-dashboard' as PageRoute,
        items: []
      },
      {
        id: 'clinical-diagnostics',
        label: 'Clinical & Diagnostics (HMS)',
        icon: Stethoscope,
        items: [
          { route: 'hms-opd' as PageRoute, label: 'OPD Doctor Desk' },
          { route: 'hms-ipd' as PageRoute, label: 'IPD Ward & Bed Matrix' },
          { route: 'hms-ot' as PageRoute, label: 'OT & Surgery Suites' },
          { route: 'hms-emergency' as PageRoute, label: 'Emergency & Trauma (ER)' },
          { route: 'hms-lis' as PageRoute, label: 'LIS Pathology Lab' },
          { route: 'hms-ris' as PageRoute, label: 'RIS Radiology & PACS' },
          { route: 'hms-bloodbank' as PageRoute, label: 'Blood Bank Inventory' },
          { route: 'doctor-radar' as PageRoute, label: 'Doctor Live Radar & GPS', badge: 'LIVE', badgeColor: 'bg-emerald-500' }
        ]
      },
      {
        id: 'supply-finance',
        label: 'Supply Chain & Finance (ERP)',
        icon: Receipt,
        items: [
          { route: 'erp-pharmacy' as PageRoute, label: 'Pharmacy Formulary' },
          { route: 'erp-billing' as PageRoute, label: 'Billing POS & Invoices' },
          { route: 'erp-tpa-claims' as PageRoute, label: 'TPA Insurance Pre-Auth' },
          { route: 'erp-procurement' as PageRoute, label: 'Procurement & 3-Way PO' },
          { route: 'erp-biomedical' as PageRoute, label: 'Biomedical Assets (PPM)' },
          { route: 'erp-cssd-infection' as PageRoute, label: 'CSSD & Infection Control' },
          { route: 'erp-finance' as PageRoute, label: 'Cost Center P&L Reports' }
        ]
      },
      {
        id: 'patient-crm',
        label: 'Patient Care & CRM',
        icon: Users,
        items: [
          { route: 'patient-list' as PageRoute, label: 'Patients Registry (EMR)' },
          { route: 'appointment-list' as PageRoute, label: 'Appointments Master' },
          { route: 'crm-pipeline' as PageRoute, label: 'Patient Leads Pipeline' },
          { route: 'crm-feedback' as PageRoute, label: 'Patient Feedback & NPS' },
          { route: 'crm-health-packages' as PageRoute, label: 'Health Checkup Packages' },
          { route: 'crm-referrals' as PageRoute, label: 'Doctor Referral Network' }
        ]
      },
      {
        id: 'human-resources',
        label: 'Human Resources (HRMS)',
        icon: Building2,
        items: [
          { route: 'doctor-list' as PageRoute, label: 'Specialist Doctors' },
          { route: 'staff-list' as PageRoute, label: 'Hospital Staff Directory' },
          { route: 'hrms-roster' as PageRoute, label: 'Duty Shifts & Roster' },
          { route: 'hrms-leaves' as PageRoute, label: 'Staff Leave Approvals' },
          { route: 'hrms-payroll' as PageRoute, label: 'Healthcare Payroll' },
          { route: 'hrms-credentialing' as PageRoute, label: 'Doctor Credentialing' }
        ]
      },
      {
        id: 'governance-quality',
        label: 'Governance & Quality',
        icon: ShieldCheck,
        items: [
          { route: 'admin-incidents' as PageRoute, label: 'Incidents Sentinel (CAPA)' },
          { route: 'admin-compliance' as PageRoute, label: 'NABH & AERB Compliance' }
        ]
      }
    ];
  };

  const navGroups = getNavGroups();

  // Accordion state: ALWAYS OPEN ALL SECTIONS by default when opening the application!
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    navGroups.forEach((group) => {
      initialState[group.id] = true; // All sections open by default as requested
    });
    return initialState;
  });

  // Automatically ensure all sections are open by default unless explicitly toggled off
  useEffect(() => {
    setOpenTopics((prev) => {
      const next = { ...prev };
      navGroups.forEach((group) => {
        if (next[group.id] === undefined) {
          next[group.id] = true;
        }
      });
      return next;
    });
  }, [user?.roles]);

  // Automatically expand the active topic when currentPage changes
  useEffect(() => {
    navGroups.forEach((group) => {
      if (group.items.some((item) => item.route === currentPage)) {
        setOpenTopics((prev) => ({ ...prev, [group.id]: true }));
      }
    });
  }, [currentPage]);

  const toggleTopic = (id: string) => {
    setOpenTopics((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSwitchRole = (roleType: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTION' | 'PATIENT') => {
    setShowRoleSwitcher(false);
    if (roleType === 'ADMIN') {
      login('admin', 'password123');
      onNavigate('admin-dashboard');
    } else if (roleType === 'DOCTOR') {
      login('dr.arun', 'password123');
      onNavigate('hms-opd');
    } else if (roleType === 'NURSE') {
      login('nurse.kavitha', 'password123');
      onNavigate('hms-ipd');
    } else if (roleType === 'RECEPTION') {
      login('reception', 'password123');
      onNavigate('appointment-list');
    } else if (roleType === 'PATIENT') {
      login('patient.rajesh', 'password123');
      onNavigate('patient-dashboard');
    }
  };

  const getRoleDisplayName = () => {
    if (isPatient) return 'Patient Portal';
    if (isDoctor) return 'Consultant Physician';
    if (isNurse) return 'ICU Nurse Supervisor';
    if (isReception) return 'Front Desk Officer';
    return 'Hospital Administrator';
  };

  const getGreetingName = (): string => {
    if (!user) return 'Member';
    if (user.username === 'patient.rajesh') return 'Rajesh';

    const raw = (user.fullName && user.fullName.trim() !== '')
      ? user.fullName
      : (user.username || 'Member');

    // Remove any parenthetical descriptor, e.g. "(Medical Director)", "(Patient)"
    const clean = raw.replace(/\s*\([^)]*\)/g, '').trim();

    // Check for honorifics / medical titles (e.g. Dr., Doctor, Nurse, Prof., Mr., Mrs., etc.)
    const titleRegex = /^(dr\.?|doctor|nurse|prof\.?|mr\.?|mrs\.?|ms\.?)\s+/i;
    const match = clean.match(titleRegex);

    if (match) {
      const rawTitle = match[1].toLowerCase();
      let formattedTitle = 'Dr.';
      if (rawTitle.startsWith('nurse')) formattedTitle = 'Nurse';
      else if (rawTitle.startsWith('prof')) formattedTitle = 'Prof.';
      else if (rawTitle.startsWith('mr.')) formattedTitle = 'Mr.';
      else if (rawTitle.startsWith('mrs.')) formattedTitle = 'Mrs.';
      else if (rawTitle.startsWith('ms.')) formattedTitle = 'Ms.';
      else if (rawTitle.startsWith('doc')) formattedTitle = 'Dr.';

      const namePart = clean.substring(match[0].length).trim();
      if (!namePart) {
        return formattedTitle;
      }
      return `${formattedTitle} ${namePart}`;
    }

    if (clean.toLowerCase() === 'admin' || clean.toLowerCase().includes('administrator')) {
      return 'Administrator';
    }

    if (clean.toLowerCase().includes('reception') || clean.toLowerCase().includes('front desk')) {
      return 'Front Desk';
    }

    // For standard non-titled names (e.g., "Rajesh Kannan", "Suresh Babu")
    const words = clean.split(/\s+/);
    return words[0] || clean || 'Member';
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Shell (Clean light & dark enterprise styling with blue & green accents) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col transition-all duration-200 ease-in-out text-slate-800 dark:text-slate-100 no-print ${
          isCollapsed ? 'w-[72px]' : 'w-[256px]'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        aria-label="Sidebar Navigation"
      >
        {/* Top Header: Brand Logo & Name + Collapse Toggle */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                <path d="M12 5v14"/><path d="M5 12h14"/>
              </svg>
            </div>
            {!isCollapsed && (
              <span className="font-extrabold text-xs tracking-wider text-slate-950 dark:text-white uppercase font-sans">
                SINDHU HEALTH
              </span>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex w-7 h-7 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 items-center justify-center transition cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Graceful Editorial Greeting (Serif style from blueprint, clean high-contrast) */}
        {!isCollapsed && (
          <div className="px-5 pt-2 pb-5 border-b border-slate-100 dark:border-slate-800 mb-2">
            <h2 className="font-serif text-[24px] font-normal text-slate-900 dark:text-white leading-tight tracking-tight">
              Welcome,
              <br />
              <span className="font-serif italic text-blue-700 dark:text-blue-400 font-medium">
                {getGreetingName()}
              </span>
            </h2>
          </div>
        )}

        {/* Navigation Topics Directory */}
        <div className="flex-1 overflow-y-auto min-h-0 py-2 px-3 space-y-1 sidebar-scrollbar">
          {navGroups.map((group) => {
            const Icon = group.icon;
            const hasActiveChild = group.items.some((item) => item.route === currentPage);
            const isDirectActive = group.isDirectLink && group.route === currentPage;
            const isOpen = !!openTopics[group.id];

            // If direct link (e.g. Dashboard)
            if (group.isDirectLink && group.route) {
              return (
                <div key={group.id} className="relative">
                  <button
                    onClick={() => {
                      onNavigate(group.route!);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center transition-all duration-150 cursor-pointer ${
                      isCollapsed
                        ? 'justify-center p-2.5 rounded-xl'
                        : 'justify-between px-3.5 py-2.5 rounded-xl text-[13.5px]'
                    } ${
                      isDirectActive
                        ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-bold border border-sky-200/90 dark:border-sky-800 shadow-2xs'
                        : 'text-slate-700 dark:text-slate-300 hover:text-sky-800 dark:hover:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-800 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-5 h-5 flex items-center justify-center shrink-0 ${
                        isDirectActive
                          ? 'text-sky-700 dark:text-sky-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        <Icon className="w-4 h-4 stroke-[2]" />
                      </div>
                      {!isCollapsed && <span className="truncate">{group.label}</span>}
                    </div>
                  </button>
                </div>
              );
            }

            // Expandable Topic Group
            return (
              <div key={group.id} className="space-y-0.5">
                {/* Topic Header Row */}
                <button
                  onClick={() => {
                    if (isCollapsed) {
                      onToggleCollapse();
                    }
                    toggleTopic(group.id);
                  }}
                  className={`w-full flex items-center transition-all duration-150 cursor-pointer ${
                    isCollapsed
                      ? 'justify-center p-2.5 rounded-lg'
                      : 'justify-between px-2.5 py-2 rounded-lg'
                  } ${
                    hasActiveChild
                      ? 'text-sky-950 dark:text-sky-200 font-bold bg-sky-50/80 dark:bg-slate-800/80 border border-sky-100/80 dark:border-slate-700/80 shadow-2xs'
                      : 'text-slate-800 dark:text-slate-200 hover:text-sky-900 dark:hover:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-800 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-4 h-4 flex items-center justify-center shrink-0 ${
                      hasActiveChild
                        ? 'text-sky-700 dark:text-sky-400'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    {!isCollapsed && (
                      <span className="text-[12.5px] font-bold tracking-tight text-slate-900 dark:text-white truncate text-left">
                        {group.label}
                      </span>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="text-slate-400 shrink-0 ml-auto pl-1">
                      {isOpen ? (
                        <ChevronUp className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      )}
                    </div>
                  )}
                </button>

                {/* Expanded Sections Tree */}
                {!isCollapsed && isOpen && group.items.length > 0 && (
                  <div className="pl-6 pr-1 space-y-0.5 mt-0.5 mb-1.5 animate-in fade-in-50 duration-150">
                    {group.items.map((item) => {
                      const isActive = currentPage === item.route;
                      return (
                        <button
                          key={item.route}
                          onClick={() => {
                            onNavigate(item.route);
                            onCloseMobile();
                          }}
                          className={`w-full flex items-center justify-between text-left py-1.5 px-2.5 text-[12px] rounded-lg transition-all duration-150 cursor-pointer ${
                            isActive
                              ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-bold border border-sky-200/90 dark:border-sky-800 shadow-2xs'
                              : 'text-slate-700 dark:text-slate-300 hover:text-sky-800 dark:hover:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-800 font-medium'
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── 3. DOCKED BOTTOM USER PROFILE AREA ── */}
        <div className="mt-auto border-t border-slate-200/90 dark:border-slate-800 p-3 bg-white dark:bg-slate-900 relative flex-shrink-0">
          {!isCollapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                {/* User Info Trigger */}
                <button
                  onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                  className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-90 transition-opacity group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0 shadow-xs">
                    {user?.username ? user.username.slice(0, 2).toUpperCase() : 'AD'}
                  </div>

                  <div className="min-w-0" title={user?.fullName || user?.username || 'Staff User'}>
                    <p className="text-[12px] font-bold text-slate-950 dark:text-white truncate">
                      {user?.fullName
                        ? user.fullName.replace(/\s*\([^)]*\)/g, '').trim()
                        : (user?.username || 'Staff User')}
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold truncate">
                      {getRoleDisplayName()}
                    </p>
                  </div>
                </button>

                {/* Sign Out Action Button */}
                <button
                  onClick={() => {
                    logout();
                    onNavigate('landing');
                  }}
                  title="Sign out to landing page"
                  aria-label="Sign out"
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 stroke-[1.8]" />
                </button>
              </div>

              {/* Persona Quick Switcher Popover */}
              {showRoleSwitcher && (
                <div className="absolute bottom-16 left-3 right-3 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
                    Simulate Healthcare Persona
                  </div>

                  {[
                    { role: 'ADMIN' as const, label: 'Administrator', desc: 'Full Hospital Operations' },
                    { role: 'DOCTOR' as const, label: 'Dr. Arun Kumar', desc: 'OPD Doctor Desk & Rx' },
                    { role: 'NURSE' as const, label: 'Nurse Kavitha', desc: 'IPD Ward & ESI Triage' },
                    { role: 'RECEPTION' as const, label: 'Front Desk Officer', desc: 'Appointments & POS' },
                    { role: 'PATIENT' as const, label: 'Rajesh (Patient)', desc: 'Self-Service Portal' }
                  ].map((p) => (
                    <button
                      key={p.role}
                      onClick={() => handleSwitchRole(p.role)}
                      className="w-full px-2.5 py-1.5 rounded-xl text-left hover:bg-blue-50 dark:hover:bg-slate-800 text-xs transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400">
                          {p.label}
                        </div>
                        <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{p.desc}</div>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </button>
                  ))}

                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1.5 pt-1.5">
                    <button
                      onClick={() => {
                        setShowRoleSwitcher(false);
                        onNavigate('landing');
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-blue-600 dark:text-blue-400 font-bold transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>🏥 Landing &amp; Login Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                title={`User: ${user?.fullName || 'Staff'}`}
                aria-label={`User profile: ${user?.fullName || 'Staff'}`}
                className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[12px] font-bold text-blue-700 dark:text-blue-300 hover:scale-105 transition-transform cursor-pointer"
              >
                {user?.username ? user.username.slice(0, 2).toUpperCase() : 'AD'}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
