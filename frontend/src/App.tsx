import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SaaSLayout } from './components/layout/SaaSLayout';
import { VoiceAssistantModal } from './components/voice/VoiceAssistantModal';
import { FloatingVoiceController } from './components/voice/FloatingVoiceController';
import { AiMedicalCopilot } from './components/ai/AiMedicalCopilot';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ShieldAlert, ArrowRight } from 'lucide-react';

// SaaS Core Module Pages
// HMS
import { OpdConsultationDesk } from './pages/hms/OpdConsultationDesk';
import { IpdBedMatrixPage } from './pages/hms/IpdBedMatrixPage';
import PatientListPage from './pages/admin/PatientListPage';
import AppointmentListPage from './pages/admin/AppointmentListPage';
import DoctorListPage from './pages/admin/DoctorListPage';

// CRM
import { CrmPipelinePage } from './pages/crm/CrmPipelinePage';
import { PatientFeedbackPage } from './pages/crm/PatientFeedbackPage';

// ERP
import { PharmacyInventoryPage } from './pages/erp/PharmacyInventoryPage';
import { BillingInvoicePage } from './pages/erp/BillingInvoicePage';

// HRMS
import { HrmsRosterPage } from './pages/hrms/HrmsRosterPage';
import { LeaveManagementPage } from './pages/hrms/LeaveManagementPage';
import StaffListPage from './pages/admin/StaffListPage';

// HMS Advanced Clinical & Diagnostics
import { OtSurgerySuitePage } from './pages/hms/OtSurgerySuitePage';
import { LisLaboratoryPage } from './pages/hms/LisLaboratoryPage';
import { RisRadiologyPage } from './pages/hms/RisRadiologyPage';
import { BloodBankPage } from './pages/hms/BloodBankPage';
import { EmergencyTraumaPage } from './pages/hms/EmergencyTraumaPage';
import { DoctorLiveTrackingMap } from './components/maps/DoctorLiveTrackingMap';

// ERP Supply Chain, Operations & Finance
import { TpaInsuranceClaimsPage } from './pages/erp/TpaInsuranceClaimsPage';
import { ProcurementPoPage } from './pages/erp/ProcurementPoPage';
import { BiomedicalEquipmentPage } from './pages/erp/BiomedicalEquipmentPage';
import { CssdInfectionControlPage } from './pages/erp/CssdInfectionControlPage';
import { FinanceCostCenterPage } from './pages/erp/FinanceCostCenterPage';

// Healthcare HRMS & Governance
import { HealthcarePayrollPage } from './pages/hrms/HealthcarePayrollPage';
import { DoctorCredentialingPage } from './pages/hrms/DoctorCredentialingPage';

// CRM & Patient Programs
import { PreventiveHealthPackagesPage } from './pages/crm/PreventiveHealthPackagesPage';
import { ReferralNetworkPage } from './pages/crm/ReferralNetworkPage';

// Quality, Safety & Regulatory Governance
import { IncidentReportingPage } from './pages/admin/IncidentReportingPage';
import { StatutoryCompliancePage } from './pages/admin/StatutoryCompliancePage';

// Dashboards & Portals
import AdminDashboard from './pages/admin/AdminDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import MyAppointmentsPage from './pages/patient/MyAppointmentsPage';
import MyRecordsPage from './pages/patient/MyRecordsPage';
import BookAppointmentPage from './pages/patient/BookAppointmentPage';

// Auth Pages
import StaffLoginPage from './pages/auth/StaffLoginPage';
import PatientLoginPage from './pages/auth/PatientLoginPage';
import PatientRegisterPage from './pages/auth/PatientRegisterPage';

// Public Catalog Views (available via route)
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DoctorPage } from './pages/DoctorPage';
import { ServicesPage } from './pages/ServicesPage';
import { TreatmentsPage } from './pages/TreatmentsPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { AppointmentPage } from './pages/AppointmentPage';
import { HealthCheckupsPage } from './pages/HealthCheckupsPage';
import { BlogPage } from './pages/BlogPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { PatientInfoPage } from './pages/PatientInfoPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { DoctorMobileCheckInPage } from './pages/doctor/DoctorMobileCheckInPage';
import { LandingLoginPage } from './pages/landing/LandingLoginPage';

export function AppContent() {
  // Check if opening the direct Doctor Mobile Geolocation Tracker portal
  const isDoctorMobilePortal =
    window.location.pathname.includes('/doctor/mobile-tracker') ||
    window.location.hash.includes('doctor-mobile-tracker') ||
    (window.location.search.includes('token=') && !window.location.hash.includes('patient'));

  if (isDoctorMobilePortal) {
    return <DoctorMobileCheckInPage />;
  }

  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageRoute>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) return hash as PageRoute;
    return localStorage.getItem('user') ? 'admin-dashboard' : 'landing';
  });
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(() => window.location.search.includes('copilot=true'));
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Role detection
  const userRole = (user?.roles?.[0] || 'ROLE_ADMIN').toUpperCase();
  const isPatient = userRole === 'ROLE_PATIENT' || user?.username?.startsWith('patient');
  const isDoctor = userRole === 'ROLE_DOCTOR' || user?.username?.startsWith('dr.');
  const isNurse = userRole === 'ROLE_NURSE' || user?.username?.startsWith('nurse');
  const isReception = userRole === 'ROLE_RECEPTION' || user?.username?.startsWith('reception');

  // Global Ctrl+K / Cmd+K listener for instant search
  useEffect(() => {
    if (isPatient && isAiCopilotOpen) {
      setIsAiCopilotOpen(false);
    }
  }, [isPatient, isAiCopilotOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTo = (page: PageRoute | string) => {
    window.location.hash = page;
    setCurrentPage(page as PageRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync with window.location.hash for shareable links & browser history
  useEffect(() => {
    const handleHashChange = () => {
      const hashStr = window.location.hash.replace('#', '');
      const validRoutes: PageRoute[] = [
        'landing',
        'admin-dashboard',
        'hms-opd',
        'hms-ipd',
        'patient-list',
        'appointment-list',
        'doctor-list',
        'crm-pipeline',
        'crm-feedback',
        'erp-pharmacy',
        'erp-billing',
        'hrms-roster',
        'hrms-leaves',
        'staff-list',
        'hms-ot',
        'hms-lis',
        'hms-ris',
        'hms-bloodbank',
        'hms-emergency',
        'erp-tpa-claims',
        'erp-procurement',
        'erp-biomedical',
        'erp-cssd-infection',
        'erp-finance',
        'hrms-payroll',
        'hrms-credentialing',
        'crm-health-packages',
        'crm-referrals',
        'admin-incidents',
        'admin-compliance',
        'patient-dashboard',
        'book-appointment',
        'my-appointments',
        'my-records',
        'staff-login',
        'patient-login',
        'patient-register',
        'home',
        'about',
        'doctor',
        'services',
        'treatments',
        'facilities',
        'appointments',
        'wellness',
        'blog',
        'faq',
        'contact',
        'patient-info',
        'doctor-radar'
      ];

      if (!hashStr) {
        if (!user && !localStorage.getItem('user')) {
          setCurrentPage('landing');
        } else if (isPatient) setCurrentPage('patient-dashboard');
        else if (isDoctor) setCurrentPage('hms-opd');
        else if (isNurse) setCurrentPage('hms-ipd');
        else if (isReception) setCurrentPage('appointment-list');
        else setCurrentPage('admin-dashboard');
      } else if (validRoutes.includes(hashStr as PageRoute)) {
        setCurrentPage(hashStr as PageRoute);
      } else {
        setCurrentPage(!user && !localStorage.getItem('user') ? 'landing' : (isPatient ? 'patient-dashboard' : 'admin-dashboard'));
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user?.username]);

  // Automatic Workspace Redirection when switching role
  useEffect(() => {
    if (isPatient && (currentPage === 'admin-dashboard' || currentPage === 'hms-opd' || currentPage === 'hms-ipd' || currentPage === 'erp-billing' || currentPage === 'hrms-leaves')) {
      navigateTo('patient-dashboard');
    } else if (isDoctor && (currentPage === 'admin-dashboard' || currentPage === 'erp-billing' || currentPage === 'erp-pharmacy')) {
      navigateTo('hms-opd');
    } else if (isNurse && (currentPage === 'admin-dashboard' || currentPage === 'erp-billing' || currentPage === 'crm-pipeline')) {
      navigateTo('hms-ipd');
    } else if (isReception && (currentPage === 'admin-dashboard' || currentPage === 'hms-opd' || currentPage === 'hrms-leaves')) {
      navigateTo('appointment-list');
    }
  }, [user?.username]);

  // Strict Role-Based View Guard
  const renderCurrentModule = () => {
    // 1. Patient Guard
    if (isPatient) {
      const allowedPatientRoutes: PageRoute[] = [
        'patient-dashboard',
        'book-appointment',
        'my-appointments',
        'my-records',
        'crm-feedback',
        'patient-login',
        'patient-register'
      ];

      if (!allowedPatientRoutes.includes(currentPage)) {
        return (
          <div className="card-radial-surface p-8 sm:p-12 rounded-3xl max-w-lg mx-auto text-center space-y-4 my-12 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center border border-rose-200 dark:border-rose-800">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white font-jakarta">
              Access Restricted
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This clinical and administrative management module is restricted to hospital personnel. You have been directed back to your patient portal.
            </p>
            <button
              onClick={() => navigateTo('patient-dashboard')}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
            >
              Go to Patient Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );
      }
    }

    // 2. Doctor Guard: Block billing desk and HRMS staff directory
    if (isDoctor) {
      const doctorRestrictedRoutes: PageRoute[] = ['erp-billing', 'erp-pharmacy', 'staff-list'];
      if (doctorRestrictedRoutes.includes(currentPage)) {
        return (
          <div className="card-radial-surface p-8 sm:p-12 rounded-3xl max-w-lg mx-auto text-center space-y-4 my-12 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white font-jakarta">
              Administrative Module
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Financial Point-of-Sale billing and pharmacy procurement are managed by Billing Officers and Pharmacists.
            </p>
            <button
              onClick={() => navigateTo('hms-opd')}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
            >
              Back to OPD Consultation Desk <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );
      }
    }

    // 3. Render Authorized Page
    switch (currentPage) {
      // 1. Executive Dashboard
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={navigateTo} />;

      // 2. HMS Modules
      case 'hms-opd':
        return <OpdConsultationDesk />;
      case 'hms-ipd':
        return <IpdBedMatrixPage />;
      case 'hms-ot':
        return <OtSurgerySuitePage />;
      case 'hms-lis':
        return <LisLaboratoryPage />;
      case 'hms-ris':
        return <RisRadiologyPage />;
      case 'hms-bloodbank':
        return <BloodBankPage />;
      case 'hms-emergency':
        return <EmergencyTraumaPage />;
      case 'patient-list':
        return <PatientListPage onNavigate={navigateTo} />;
      case 'appointment-list':
        return <AppointmentListPage onNavigate={navigateTo} />;
      case 'doctor-list':
        return <DoctorListPage onNavigate={navigateTo} />;

      // 3. CRM Modules
      case 'crm-pipeline':
        return <CrmPipelinePage />;
      case 'crm-feedback':
        return <PatientFeedbackPage />;
      case 'crm-health-packages':
        return <PreventiveHealthPackagesPage />;
      case 'crm-referrals':
        return <ReferralNetworkPage />;

      // 4. ERP Modules
      case 'erp-pharmacy':
        return <PharmacyInventoryPage />;
      case 'erp-billing':
        return <BillingInvoicePage />;
      case 'erp-tpa-claims':
        return <TpaInsuranceClaimsPage />;
      case 'erp-procurement':
        return <ProcurementPoPage />;
      case 'erp-biomedical':
        return <BiomedicalEquipmentPage />;
      case 'erp-cssd-infection':
        return <CssdInfectionControlPage />;
      case 'erp-finance':
        return <FinanceCostCenterPage />;

      // 5. HRMS Modules
      case 'hrms-roster':
        return <HrmsRosterPage />;
      case 'hrms-leaves':
        return <LeaveManagementPage />;
      case 'hrms-payroll':
        return <HealthcarePayrollPage />;
      case 'hrms-credentialing':
        return <DoctorCredentialingPage />;
      case 'staff-list':
        return <StaffListPage onNavigate={navigateTo} />;

      // Quality & Safety Governance Modules
      case 'admin-incidents':
        return <IncidentReportingPage />;
      case 'admin-compliance':
        return <StatutoryCompliancePage />;

      // 6. Patient Portal Self-Service
      case 'patient-dashboard':
        return <PatientDashboard onNavigate={navigateTo} />;
      case 'book-appointment':
        return <BookAppointmentPage onNavigate={navigateTo} />;
      case 'my-appointments':
        return <MyAppointmentsPage onNavigate={navigateTo} />;
      case 'my-records':
        return <MyRecordsPage onNavigate={navigateTo} />;

      // Landing Page & Public Hero Portal
      case 'landing':
        return <LandingLoginPage onNavigate={navigateTo} />;

      // 7. Auth Portals
      case 'staff-login':
        return <StaffLoginPage onNavigate={navigateTo} />;
      case 'patient-login':
        return <PatientLoginPage onNavigate={navigateTo} />;
      case 'patient-register':
        return <PatientRegisterPage onNavigate={navigateTo} />;

      // Optional public catalog pages
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'about':
        return <AboutPage onNavigate={navigateTo} />;
      case 'doctor':
        return <DoctorPage onNavigate={navigateTo} />;
      case 'services':
        return <ServicesPage onNavigate={navigateTo} />;
      case 'treatments':
        return <TreatmentsPage onNavigate={navigateTo} />;
      case 'facilities':
        return <FacilitiesPage onNavigate={navigateTo} />;
      case 'appointments':
        return <AppointmentPage onNavigate={navigateTo} />;
      case 'wellness':
        return <HealthCheckupsPage onNavigate={navigateTo} />;
      case 'blog':
        return <BlogPage onNavigate={navigateTo} />;
      case 'faq':
        return <FaqPage onNavigate={navigateTo} />;
      case 'contact':
        return <ContactPage onNavigate={navigateTo} />;
      case 'patient-info':
        return <PatientInfoPage onNavigate={navigateTo} />;

      case 'doctor-radar':
        return (
          <div className="space-y-6">
            <DoctorLiveTrackingMap />
          </div>
        );

      default:
        return isPatient ? <PatientDashboard onNavigate={navigateTo} /> : <AdminDashboard onNavigate={navigateTo} />;
    }
  };

  // Full-Screen Render for Landing Page & Standalone Auth Portals (No Dashboard Sidebar)
  const isAuthOrLandingPage =
    currentPage === 'landing' ||
    currentPage === 'staff-login' ||
    currentPage === 'patient-login' ||
    currentPage === 'patient-register';

  if (isAuthOrLandingPage) {
    return renderCurrentModule();
  }

  return (
    <SaaSLayout
      currentPage={currentPage}
      onNavigate={navigateTo}
      onOpenVoice={() => setIsVoiceOpen(true)}
      onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
      onOpenSearch={() => setIsSearchOpen(true)}
      overlays={
        <>
          {/* Voice Assistant Modal */}
          <VoiceAssistantModal
            isOpen={isVoiceOpen}
            onClose={() => setIsVoiceOpen(false)}
            onNavigate={navigateTo}
          />

          {/* AI Medical Copilot Drawer */}
          <AiMedicalCopilot
            isOpen={isAiCopilotOpen}
            onClose={() => setIsAiCopilotOpen(false)}
            onNavigate={navigateTo}
          />

          {/* Global Quick Search */}
          <GlobalSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onNavigate={navigateTo}
          />
        </>
      }
    >
      {/* Active Module View */}
      {renderCurrentModule()}
    </SaaSLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
