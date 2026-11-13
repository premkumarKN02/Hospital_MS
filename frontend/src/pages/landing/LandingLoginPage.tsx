import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageRoute } from '../../types';
import {
  Stethoscope,
  Activity,
  Radio,
  MapPin,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  Bed,
  Pill,
  FileText,
  Clock,
  Compass,
  Zap,
  Users,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface LandingLoginPageProps {
  onNavigate: (page: PageRoute | string) => void;
}

export const LandingLoginPage: React.FC<LandingLoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();

  // Active Login Tab: 'staff' | 'patient'
  const [activeTab, setActiveTab] = useState<'staff' | 'patient'>('staff');

  // Staff Login Form
  const [staffForm, setStaffForm] = useState({ usernameOrEmail: '', password: '' });
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [staffError, setStaffError] = useState('');
  const [staffLoading, setStaffLoading] = useState(false);

  // Patient Login Form
  const [patientForm, setPatientForm] = useState({ usernameOrEmail: '', password: '' });
  const [showPatientPassword, setShowPatientPassword] = useState(false);
  const [patientError, setPatientError] = useState('');
  const [patientLoading, setPatientLoading] = useState(false);

  // Quick Demo Auto-Fill & Instant Login
  const handleDemoLogin = async (username: string, pass: string, isPatient = false) => {
    if (isPatient) {
      setPatientForm({ usernameOrEmail: username, password: pass });
      setPatientError('');
      setPatientLoading(true);
      try {
        await login(username, pass, true);
        onNavigate('patient-dashboard');
      } catch (err: any) {
        setPatientError(err.response?.data?.message || 'Login failed. Please verify credentials.');
      } finally {
        setPatientLoading(false);
      }
    } else {
      setStaffForm({ usernameOrEmail: username, password: pass });
      setStaffError('');
      setStaffLoading(true);
      try {
        await login(username, pass, false);
        if (username.startsWith('dr.')) {
          onNavigate('hms-opd');
        } else if (username.startsWith('nurse.')) {
          onNavigate('hms-ipd');
        } else if (username === 'reception') {
          onNavigate('appointment-list');
        } else {
          onNavigate('admin-dashboard');
        }
      } catch (err: any) {
        setStaffError(err.response?.data?.message || 'Login failed. Please verify credentials.');
      } finally {
        setStaffLoading(false);
      }
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError('');
    setStaffLoading(true);
    try {
      await login(staffForm.usernameOrEmail, staffForm.password, false);
      if (staffForm.usernameOrEmail.startsWith('dr.')) {
        onNavigate('hms-opd');
      } else if (staffForm.usernameOrEmail.startsWith('nurse.')) {
        onNavigate('hms-ipd');
      } else if (staffForm.usernameOrEmail === 'reception') {
        onNavigate('appointment-list');
      } else {
        onNavigate('admin-dashboard');
      }
    } catch (err: any) {
      setStaffError(err.response?.data?.message || 'Invalid username or password.');
    } finally {
      setStaffLoading(false);
    }
  };

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPatientError('');
    setPatientLoading(true);
    try {
      await login(patientForm.usernameOrEmail, patientForm.password, true);
      onNavigate('patient-dashboard');
    } catch (err: any) {
      setPatientError(err.response?.data?.message || 'Invalid patient ID or password.');
    } finally {
      setPatientLoading(false);
    }
  };

  const scrollToLogin = () => {
    document.getElementById('login-portal-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* ── MAIN HEADER NAVIGATION ── */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <Activity className="w-7 h-7 text-blue-600 dark:text-blue-400 animate-pulse shrink-0" />
            <div>
              <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white font-jakarta">
                Sindhu Healthcare
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-sm sm:text-base font-extrabold text-slate-700 dark:text-slate-200">
            <button
              onClick={() => onNavigate('doctor-radar')}
              className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <Radio className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Emergency Radar</span>
            </button>
            <button
              onClick={() => onNavigate('hms-opd')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              OPD Desks
            </button>
            <button
              onClick={() => onNavigate('hms-ipd')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Bed Matrix
            </button>
            <button
              onClick={() => onNavigate('erp-pharmacy')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Pharmacy ERP
            </button>
            <button
              onClick={() => onNavigate('patient-login')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Patient Portal
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollToLogin}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm sm:text-base shadow-sm shadow-blue-500/25 transition-all flex items-center justify-center cursor-pointer"
            >
              <span>Portal Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── 3. HERO SECTION WITH EMBEDDED MULTI-ROLE LOGIN PORTAL ── */}
      <section className="relative overflow-hidden pt-8 pb-24 lg:pt-16 lg:pb-36">
        {/* Ambient Glowing Orbs Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left 7 Columns: Value Proposition & Platform Highlights */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-jakarta leading-[1.15]">
                Complete Hospital Operations,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500">
                  Real-Time Clinical Care
                </span>{' '}
                &amp; Emergency GPS Telemetry.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
                Seamlessly unifies Outpatient Consultations, Inpatient Ward Bed Matrix, Surgical Theatre Tracking, Pharmacy Inventory, and <strong>100% Free Real-World Doctor GPS Radar</strong> into one resilient hospital intelligence ecosystem.
              </p>

              {/* Key Advantage Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                  <Radio className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-pulse shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">Live Doctor GPS Radar</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real Leaflet satellite telemetry for on-call surgeons</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                  <Bed className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">IPD Bed Ward Matrix</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live bed occupancy &amp; critical patient triage</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                  <Pill className="w-6 h-6 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">Pharmacy &amp; ERP Billing</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Automated batch stock &amp; insurance claims</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                  <Users className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">Patient Self-Service</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instant appointment booking &amp; lab results</p>
                  </div>
                </div>
              </div>

              {/* Direct Exploration Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => onNavigate('doctor-radar')}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Launch Live Emergency Radar Map</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('book-appointment')}
                  className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-sm border border-slate-200 dark:border-slate-700 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Book Patient Appointment</span>
                </button>
              </div>
            </div>

            {/* Right 5 Columns: Interactive Multi-Role Login Card */}
            <div className="lg:col-span-5" id="login-portal-section">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative">
                
                {/* Header of Card */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-jakarta">
                      Portal Authentication
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      Sign in to access clinical or patient workspace
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80">
                    HIPAA 256-bit
                  </span>
                </div>

                {/* Role Switcher Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-6">
                  <button
                    onClick={() => { setActiveTab('staff'); setStaffError(''); }}
                    className={`py-2.5 px-4 rounded-xl text-sm font-extrabold transition-all flex items-center justify-center ${
                      activeTab === 'staff'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>Staff &amp; Doctors</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('patient'); setPatientError(''); }}
                    className={`py-2.5 px-4 rounded-xl text-sm font-extrabold transition-all flex items-center justify-center ${
                      activeTab === 'patient'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>Patient Portal</span>
                  </button>
                </div>

                {/* ── TAB 1: STAFF & CLINICAL LOGIN ── */}
                {activeTab === 'staff' && (
                  <div className="space-y-5 animate-fade-in">
                    {staffError && (
                      <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-sm font-semibold text-rose-700 dark:text-rose-300">
                        <span>{staffError}</span>
                      </div>
                    )}

                    <form onSubmit={handleStaffSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                          Staff ID or Username
                        </label>
                        <div>
                          <input
                            type="text"
                            value={staffForm.usernameOrEmail}
                            onChange={(e) => setStaffForm({ ...staffForm, usernameOrEmail: e.target.value })}
                            placeholder="e.g. admin or dr.prem"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-sm font-extrabold text-slate-700 dark:text-slate-300">
                            Password
                          </label>
                          <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                            Forgot?
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type={showStaffPassword ? 'text' : 'password'}
                            value={staffForm.password}
                            onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 pr-16 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setShowStaffPassword(!showStaffPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          >
                            {showStaffPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={staffLoading}
                        className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm sm:text-base shadow-md transition-all flex items-center justify-center cursor-pointer disabled:opacity-60"
                      >
                        {staffLoading ? (
                          <span>Authenticating Staff...</span>
                        ) : (
                          <span>Sign In to Operating System</span>
                        )}
                      </button>
                    </form>

                    {/* Quick 1-Click Demo Login Credentials */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                        <span>1-Click Instant Demo Login:</span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold">Auto-fills &amp; Signs In</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleDemoLogin('admin', 'password123', false)}
                          className="p-3 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-left transition-all group"
                        >
                          <div className="font-black text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            Super Admin
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">Full System Control</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDemoLogin('dr.arun', 'password123', false)}
                          className="p-3 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-700 text-left transition-all group"
                        >
                          <div className="font-black text-sm text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            Dr. Arun Kumar
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">Chief Doctor (OPD Desk)</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDemoLogin('nurse.kavitha', 'password123', false)}
                          className="p-3 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 text-left transition-all group"
                        >
                          <div className="font-black text-sm text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            Nurse Kavitha
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">IPD Inpatient Wards</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDemoLogin('reception', 'password123', false)}
                          className="p-3 rounded-xl bg-slate-100 hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-amber-950/60 border border-slate-200 dark:border-slate-700 text-left transition-all group"
                        >
                          <div className="font-black text-sm text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                            Front Desk
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">Appointments &amp; Triage</div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 2: PATIENT SELF-SERVICE LOGIN ── */}
                {activeTab === 'patient' && (
                  <div className="space-y-5 animate-fade-in">
                    {patientError && (
                      <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-sm font-semibold text-rose-700 dark:text-rose-300">
                        <span>{patientError}</span>
                      </div>
                    )}

                    <form onSubmit={handlePatientSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                          Patient ID / Registered Phone
                        </label>
                        <div>
                          <input
                            type="text"
                            value={patientForm.usernameOrEmail}
                            onChange={(e) => setPatientForm({ ...patientForm, usernameOrEmail: e.target.value })}
                            placeholder="e.g. patient1 or registered phone"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-sm font-extrabold text-slate-700 dark:text-slate-300">
                            Password
                          </label>
                          <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                            Forgot?
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type={showPatientPassword ? 'text' : 'password'}
                            value={patientForm.password}
                            onChange={(e) => setPatientForm({ ...patientForm, password: e.target.value })}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 pr-16 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPatientPassword(!showPatientPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          >
                            {showPatientPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={patientLoading}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base shadow-md transition-all flex items-center justify-center cursor-pointer disabled:opacity-60"
                      >
                        {patientLoading ? (
                          <span>Accessing Patient Records...</span>
                        ) : (
                          <span>Access Patient Portal</span>
                        )}
                      </button>
                    </form>

                    {/* Quick Demo Patient */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                        1-Click Patient Demo:
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDemoLogin('patient.rajesh', 'password123', true)}
                        className="w-full p-3 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-700 text-left transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-black text-sm text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            Rajesh Kumar (Patient)
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">View appointments, lab reports &amp; bills</div>
                        </div>
                      </button>
                    </div>

                    {/* New Patient Registration Callout */}
                    <div className="text-center pt-2.5">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        New patient?{' '}
                        <button
                          type="button"
                          onClick={() => onNavigate('patient-register')}
                          className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                        >
                          Register Health Account
                        </button>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. LIVE METRICS & CAPABILITIES BAR ── */}
      <section className="border-y border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md py-10 mt-8 lg:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-jakarta">
                &lt; 12 Mins
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                Emergency Dispatch &amp; Code Red Response
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-jakarta">
                100% Free
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                Real-Time Leaflet &amp; Satellite GPS Radar
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-jakarta">
                350+ Beds
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                Real-Time IPD Ward Telemetry
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400 font-jakarta">
                99.99%
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                Enterprise Uptime &amp; HIPAA Data Encryption
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. ENTERPRISE CLINICAL & OPERATIONS SUITE ── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white font-jakarta tracking-tight">
              Integrated Modules Designed for High-Reliability Healthcare
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Explore specialized modules engineered for hospital directors, clinicians, trauma teams, and patients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Emergency Radar */}
            <div
              onClick={() => onNavigate('doctor-radar')}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer group space-y-4"
            >
              <Radio className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Doctor Live Geolocation Radar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  OpenStreetMap &amp; Esri Satellite tracking for on-call surgeons with real-time transit telemetry, speed, battery, and travel ETA.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Open Live Radar</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: OPD Consultation Desk */}
            <div
              onClick={() => onNavigate('hms-opd')}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer group space-y-4"
            >
              <Stethoscope className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  OPD Clinical Consultation Desk
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Doctor workspace with instant digital EHR, vitals telemetry, ICD-10 diagnosis codes, prescription orders, and AI Copilot.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>View OPD Module</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: IPD Bed Ward Matrix */}
            <div
              onClick={() => onNavigate('hms-ipd')}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer group space-y-4"
            >
              <Bed className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  IPD Ward Bed Grid Matrix
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Visual floor-by-floor bed grid for ICU, CCU, General Wards with oxygen supply status, nurse handovers, and discharge clearing.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>View Bed Matrix</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Pharmacy ERP */}
            <div
              onClick={() => onNavigate('erp-pharmacy')}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer group space-y-4"
            >
              <Pill className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Pharmacy Inventory &amp; ERP
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Real-time stock ledger, batch expiry alerts, automated supplier PO re-ordering, and prescription dispense validation.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                <span>Open Pharmacy ERP</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 5: Diagnostic Suite */}
            <div
              onClick={() => onNavigate('hms-lis')}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer group space-y-4"
            >
              <Activity className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  LIS Laboratory &amp; RIS Imaging
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Automated pathology analyzer data feeds, DICOM radiology viewing, and rapid patient SMS result dispatch.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                <span>View Lab Diagnostics</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 6: Patient Self-Service */}
            <div
              onClick={() => onNavigate('patient-dashboard')}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer group space-y-4"
            >
              <Users className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Patient Health Records Portal
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Patients can view active prescriptions, schedule specialist consults, track lab tests, and settle billing online.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>Access Patient Portal</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. SPOTLIGHT CALLOUT: EMERGENCY DOCTOR RADAR ── */}
      <section className="py-12 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5 w-fit">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-300" />
                Live GPS Telemetry Feature
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-jakarta tracking-tight text-white">
                Real-Time On-Call Doctor Geolocation Radar
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Our emergency dispatchers and triage teams track on-call specialists across city transit lines with live speed, battery levels, reverse-geocoded street addresses, and automated arrival ETAs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('doctor-radar')}
                className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Launch Interactive Radar</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={scrollToLogin}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In to Authorize Access</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FOOTER ── */}
      <footer className="bg-white dark:bg-[#05080f] border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Activity className="w-7 h-7 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <span className="font-black text-base text-slate-900 dark:text-white font-jakarta">
                  Sindhu Healthcare Systems
                </span>
                <p className="text-xs text-slate-500">Autonomous Healthcare Operating Intelligence</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
              <button onClick={() => onNavigate('doctor-radar')} className="hover:text-blue-600 dark:hover:text-white">Emergency Radar</button>
              <button onClick={() => onNavigate('hms-opd')} className="hover:text-blue-600 dark:hover:text-white">OPD Desks</button>
              <button onClick={() => onNavigate('hms-ipd')} className="hover:text-blue-600 dark:hover:text-white">Bed Matrix</button>
              <button onClick={() => onNavigate('erp-pharmacy')} className="hover:text-blue-600 dark:hover:text-white">Pharmacy</button>
              <button onClick={() => onNavigate('patient-login')} className="hover:text-blue-600 dark:hover:text-white">Patient Portal</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 Sindhu Healthcare Integrated Platform. All rights reserved. Encrypted &amp; HIPAA Compliant.</p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>System All Green</span>
              </span>
              <span>•</span>
              <span>Emergency Dispatch: +91 44 2836 7000</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
