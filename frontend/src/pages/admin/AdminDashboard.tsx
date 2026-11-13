import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi, appointmentApi, ipdApi, billingApi, auditApi } from '../../lib/api';
import { formatCurrency, getActiveCurrency } from '../../utils/currencyService';
import { getActiveBranch, HOSPITAL_BRANCHES } from '../../utils/branchService';
import {
  Users,
  Calendar,
  Globe,
  CheckCircle,
  UserCheck,
  Stethoscope,
  ClipboardList,
  Bell,
  Activity,
  TrendingUp,
  Clock,
  Bed,
  Pill,
  Receipt,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Building2,
  DollarSign,
  HeartPulse,
  Award,
  Scissors,
  FlaskConical,
  Scan,
  Droplets,
  Siren,
  FileCheck,
  ShoppingCart,
  Cpu,
  Banknote,
  Layers,
  Network,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ExternalLink,
  Filter,
  Download,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
  CheckSquare,
  Search,
  FileText
} from 'lucide-react';

interface Stats {
  totalPatients: number;
  todayAppointments: number;
  todayCompleted: number;
  activeDoctors: number;
  totalStaff: number;
  pendingApprovals: number;
  date: string;
}

interface Props {
  onNavigate?: (page: string) => void;
}

interface PatientRecord {
  id: string;
  uhid: string;
  patient: string;
  ageGender: string;
  doctor: string;
  dept: string;
  time: string;
  status: 'Admitted' | 'In Consultation' | 'Observation' | 'Discharged' | 'Critical Care';
  room: string;
  bill: number;
  payment: string;
  payStatus: 'verified' | 'pending';
}

const PATIENTS_MOCK_DATA: PatientRecord[] = [
  { id: 'ADM-1084', uhid: 'UHID-40291', patient: 'Rohan Deshmukh', ageGender: '42M', doctor: 'Dr. Priya Sharma', dept: 'Cardiology', time: 'Today, 09:15 AM', status: 'Admitted', room: 'ICU Bed 04', bill: 304125, payment: 'TPA Pre-Approved', payStatus: 'verified' },
  { id: 'ADM-1085', uhid: 'UHID-40292', patient: 'Ananya Srinivasan', ageGender: '29F', doctor: 'Dr. Rajesh Patel', dept: 'General Medicine', time: 'Today, 10:30 AM', status: 'In Consultation', room: 'OPD Suite 2', bill: 4500, payment: 'Self-Pay Cleared', payStatus: 'verified' },
  { id: 'ADM-1086', uhid: 'UHID-40293', patient: 'Vikram Malhotra', ageGender: '63M', doctor: 'Dr. Alok Verma', dept: 'Orthopedics', time: 'Yesterday, 14:00', status: 'Admitted', room: 'Ward 3, Bed 12', bill: 185000, payment: 'Cashless Settled', payStatus: 'verified' },
  { id: 'ADM-1087', uhid: 'UHID-40294', patient: 'Kavita Nair', ageGender: '35F', doctor: 'Dr. Sunita Rao', dept: 'Oncology', time: 'Today, 08:45 AM', status: 'Observation', room: 'Daycare Chem-02', bill: 42000, payment: 'TPA Pre-Approved', payStatus: 'verified' },
  { id: 'ADM-1088', uhid: 'UHID-40295', patient: 'Farhan Akhtar', ageGender: '51M', doctor: 'Dr. David Chen', dept: 'Neurology', time: '28 Feb, 11:20 AM', status: 'Discharged', room: 'Deluxe Suite 402', bill: 245000, payment: 'Cashless Settled', payStatus: 'verified' },
  { id: 'ADM-1089', uhid: 'UHID-40296', patient: 'Meera Nambiar', ageGender: '19F', doctor: 'Dr. Priya Sharma', dept: 'Emergency', time: 'Today, 11:05 AM', status: 'Critical Care', room: 'Trauma Bay 1', bill: 89000, payment: 'Pre-Auth Under Review', payStatus: 'pending' },
  { id: 'ADM-1090', uhid: 'UHID-40297', patient: 'Harish Chandra', ageGender: '58M', doctor: 'Dr. Priya Sharma', dept: 'Cardiology', time: 'Today, 07:40 AM', status: 'Admitted', room: 'CCU Bed 02', bill: 412000, payment: 'TPA Pre-Approved', payStatus: 'verified' },
  { id: 'ADM-1091', uhid: 'UHID-40298', patient: 'Pooja Hegde', ageGender: '31F', doctor: 'Dr. Rajesh Patel', dept: 'General Medicine', time: 'Today, 11:45 AM', status: 'In Consultation', room: 'OPD Suite 5', bill: 3200, payment: 'Self-Pay Cleared', payStatus: 'verified' },
  { id: 'ADM-1092', uhid: 'UHID-40299', patient: 'Siddharth Roy', ageGender: '47M', doctor: 'Dr. Alok Verma', dept: 'Orthopedics', time: 'Yesterday, 16:30', status: 'Observation', room: 'Ward 2, Bed 08', bill: 68500, payment: 'Cashless Settled', payStatus: 'verified' },
  { id: 'ADM-1093', uhid: 'UHID-40300', patient: 'Sneha Kulkarni', ageGender: '26F', doctor: 'Dr. Sunita Rao', dept: 'Oncology', time: 'Today, 12:10 PM', status: 'Discharged', room: 'OPD Suite 1', bill: 12500, payment: 'Self-Pay Cleared', payStatus: 'verified' },
  { id: 'ADM-1094', uhid: 'UHID-40301', patient: 'Arjun Rampal', ageGender: '44M', doctor: 'Dr. David Chen', dept: 'Neurology', time: 'Today, 08:00 AM', status: 'Admitted', room: 'Ward 1, Bed 03', bill: 154000, payment: 'TPA Pre-Approved', payStatus: 'verified' },
  { id: 'ADM-1095', uhid: 'UHID-40302', patient: 'Deepa Mehta', ageGender: '53F', doctor: 'Dr. Rajesh Patel', dept: 'General Medicine', time: '29 Feb, 15:10 PM', status: 'Discharged', room: 'Private Suite 201', bill: 98000, payment: 'Cashless Settled', payStatus: 'verified' },
];

export default function AdminDashboard({ onNavigate }: Props) {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [todayAppts, setTodayAppts] = useState<any[]>([]);
  const [ipdCensus, setIpdCensus] = useState<any>({ totalBeds: 180, occupiedBeds: 144, occupancyRate: 80, availableBeds: 36 });
  const [billingStats, setBillingStats] = useState<any>({ totalBilled: 2450000, totalCollected: 2180000, totalPending: 270000 });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [currency, setCurrency] = useState(getActiveCurrency());
  const [branch, setBranch] = useState(getActiveBranch());
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Blueprint Layout State
  const [activeMode, setActiveMode] = useState<'clinical' | 'finance'>('clinical');
  const [activePillar, setActivePillar] = useState<'all' | 'clinical' | 'diagnostic' | 'erp' | 'governance'>('clinical');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('29 Feb - 04 Mar');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');
  const [tablePage, setTablePage] = useState(1);

  // Listen to global currency and branch changes
  useEffect(() => {
    const handleCurrencyChange = (e: any) => setCurrency(e.detail);
    const handleBranchChange = (e: any) => setBranch(e.detail);

    window.addEventListener('currencyChange', handleCurrencyChange);
    window.addEventListener('branchChange', handleBranchChange);

    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange);
      window.removeEventListener('branchChange', handleBranchChange);
    };
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [statsRes, apptRes, censusRes, billRes, auditRes] = await Promise.all([
        dashboardApi.stats().catch(() => ({ data: { totalPatients: 1420, todayAppointments: 48, todayCompleted: 36, activeDoctors: 24, totalStaff: 112, pendingApprovals: 3 } })),
        appointmentApi.today().catch(() => ({ data: [] })),
        ipdApi.getCensus().catch(() => ({ data: { totalBeds: 180, occupiedBeds: 144, occupancyRate: 80, availableBeds: 36 } })),
        billingApi.getStats().catch(() => ({ data: { totalBilled: 2450000, totalCollected: 2180000, totalPending: 270000 } })),
        auditApi.getLogs().catch(() => ({ data: [] })),
      ]);

      setStats(statsRes.data);
      setTodayAppts(apptRes.data || []);
      if (censusRes.data && censusRes.data.totalBeds) setIpdCensus(censusRes.data);
      if (billRes.data && billRes.data.totalBilled) setBillingStats(billRes.data);
      setAuditLogs(auditRes.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load dashboard telemetry:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Filtered Patients Data
  const filteredPatients = useMemo(() => {
    return PATIENTS_MOCK_DATA.filter((p) => {
      const matchesSearch =
        searchQuery === '' ||
        p.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.room.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept =
        selectedDept === 'All Departments' || p.dept === selectedDept;

      const matchesStatus =
        selectedStatus === 'All Statuses' || p.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [searchQuery, selectedDept, selectedStatus]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDept('All Departments');
    setSelectedStatus('All Statuses');
    setSelectedDateRange('29 Feb - 04 Mar');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ══════════════════════════════════════════════════════════════
          1. BLUEPRINT HEADER & MODE SELECTOR
          - Graceful Editorial Serif "Dashboard" Title
          - Segmented pill toggle: [ Clinical Operations | Supply & Finance ]
          - Rapid Admission & Sync Telemetry Actions
          ══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-slate-950 tracking-tight">
              Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200/80">
              {branch.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Real-time telemetry across inpatient beds, physician consultations, laboratory diagnostics, and financial claims.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segmented Pill Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-full border border-slate-200 flex items-center text-xs shadow-2xs">
            <button
              onClick={() => setActiveMode('clinical')}
              className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                activeMode === 'clinical'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Clinical Operations
            </button>
            <button
              onClick={() => setActiveMode('finance')}
              className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                activeMode === 'finance'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Supply & Finance
            </button>
          </div>

          {/* Sync Button */}
          <button
            onClick={fetchDashboardData}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            title="Synchronize live hospital metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
          </button>

          {/* Rapid Admission Button */}
          <button
            onClick={() => onNavigate?.('hms-opd')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>OPD Desk</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. HORIZONTAL FILTER BAR & DUAL-MONTH CALENDAR POPOVER
          - Pill-style interactive dropdowns matching the user's blueprint
          - Interactive double-month calendar dropdown with presets
          - Department filter, Status filter, Search input, Clear button
          ══════════════════════════════════════════════════════════════ */}
      <div className="relative">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Pill 1: Date Range Trigger */}
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                showDatePicker
                  ? 'bg-blue-50 border-blue-400 text-blue-800 ring-2 ring-blue-100'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Date range: <strong className="text-slate-950">{selectedDateRange}</strong></span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
            </button>

            {/* Pill 2: Department Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Departments">All Departments</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Oncology">Oncology</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Neurology">Neurology</option>
                <option value="Emergency">Emergency</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Pill 3: Status Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Admitted">Admitted</option>
                <option value="In Consultation">In Consultation</option>
                <option value="Observation">Observation</option>
                <option value="Discharged">Discharged</option>
                <option value="Critical Care">Critical Care</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Clear Filter Button */}
            {(searchQuery || selectedDept !== 'All Departments' || selectedStatus !== 'All Statuses' || selectedDateRange !== '29 Feb - 04 Mar') && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>Clear filter</span>
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients, doctors, bills..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            COMPACT QUICK-WINDOW DROPDOWN (SUBTLE, NON-INTRUSIVE)
            ══════════════════════════════════════════════════════════════ */}
        {showDatePicker && (
          <div className="absolute top-full left-0 mt-1.5 z-40 bg-white border border-slate-200/90 rounded-xl shadow-lg p-1.5 w-64 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2.5 py-1.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
              Select Analysis Range
            </div>
            {[
              { label: '29 Feb - 04 Mar (Default)', val: '29 Feb - 04 Mar' },
              { label: 'Today (04 Mar)', val: '04 Mar' },
              { label: 'Last 7 Days', val: '26 Feb - 04 Mar' },
              { label: 'This Month (March)', val: '01 Mar - 31 Mar' },
              { label: 'Last Month (February)', val: '01 Feb - 29 Feb' },
              { label: 'Q1 FY26 (Jan - Mar)', val: '01 Jan - 31 Mar' }
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedDateRange(preset.val);
                  setShowDatePicker(false);
                }}
                className={`w-full px-3 py-2 rounded-lg text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  selectedDateRange === preset.val
                    ? 'bg-blue-50 text-blue-800 font-bold'
                    : 'text-slate-700 hover:bg-sky-50 hover:text-sky-800'
                }`}
              >
                <span>{preset.label}</span>
                {selectedDateRange === preset.val && (
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. THREE FUNCTION BOXES (RICH GREEN & BLUE SHADINGS)
          - Box 1 (Green Variant): % Inpatient Capacity (80%, Target Met)
          - Box 2 (Blue Variant): Consultations Completed Today (48, +8.4% MoM)
          - Box 3 (Dual Blue-Green Shading): Outstanding Clinical Claims
          ══════════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* FUNCTION BOX 1: % Inpatient Capacity (Emerald & Mint Shading) */}
        <div className="bg-gradient-to-br from-white via-white to-emerald-50/40 border border-emerald-200/90 shadow-[0_4px_20px_-2px_rgba(5,150,105,0.06),0_2px_6px_-1px_rgba(5,150,105,0.02)] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
                  <Bed className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 tracking-tight">
                  % Inpatient Capacity
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3 text-emerald-600" /> Target Met
              </span>
            </div>

            <div className="mt-2">
              <div className="flex items-baseline justify-between">
                <p className="text-4xl sm:text-[44px] font-extrabold text-slate-950 font-mono tracking-tight leading-none">
                  {ipdCensus.occupancyRate || 80}%
                </p>
                <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {ipdCensus.occupiedBeds || 144} / {ipdCensus.totalBeds || 180} Beds
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-2">
                Active census across intensive care, trauma, general & executive suites
              </p>
            </div>

            {/* Glowing Emerald Progress Bar */}
            <div className="mt-4 w-full h-2 bg-emerald-100/50 rounded-full overflow-hidden border border-emerald-200/40">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${ipdCensus.occupancyRate || 80}%` }}
              />
            </div>
          </div>

          {/* Breakdown Mini-Metrics (3 cols) */}
          <div className="mt-5 pt-3.5 border-t border-emerald-100/60 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Occupied</span>
              <span className="text-sm font-extrabold text-slate-950 font-mono">144</span>
            </div>
            <div className="border-x border-emerald-100/60">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Available</span>
              <span className="text-sm font-extrabold text-emerald-700 font-mono">36</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Critical</span>
              <span className="text-sm font-extrabold text-slate-900 font-mono">28</span>
            </div>
          </div>
        </div>

        {/* FUNCTION BOX 2: Consultations Completed Today (Royal & Sky Blue Shading) */}
        <div className="bg-gradient-to-br from-white via-white to-sky-50/40 border border-blue-200/90 shadow-[0_4px_20px_-2px_rgba(37,99,235,0.06),0_2px_6px_-1px_rgba(37,99,235,0.02)] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-blue-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 tracking-tight">
                  Consultations Completed Today
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50/90 border border-blue-200/80 px-2.5 py-0.5 rounded-full">
                <ArrowUp className="w-3 h-3 text-blue-600" /> +8.4% MoM
              </span>
            </div>

            <div className="mt-2">
              <div className="flex items-baseline justify-between">
                <p className="text-4xl sm:text-[44px] font-extrabold text-slate-950 font-mono tracking-tight leading-none">
                  {stats?.todayAppointments || '48'}
                </p>
                <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {stats?.todayCompleted || '36'} Completed
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-2">
                Outpatient registry & physician queue across 14 specialist clinics
              </p>
            </div>

            {/* Royal Blue Progress Bar */}
            <div className="mt-4 w-full h-2 bg-blue-100/50 rounded-full overflow-hidden border border-blue-200/40">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-sky-500 rounded-full transition-all duration-500"
                style={{ width: '75%' }}
              />
            </div>
          </div>

          {/* Breakdown Mini-Metrics (3 cols) */}
          <div className="mt-5 pt-3.5 border-t border-blue-100/60 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Booked</span>
              <span className="text-sm font-extrabold text-slate-950 font-mono">48</span>
            </div>
            <div className="border-x border-blue-100/60">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Done</span>
              <span className="text-sm font-extrabold text-blue-700 font-mono">36</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">In Queue</span>
              <span className="text-sm font-extrabold text-slate-800 font-mono">12</span>
            </div>
          </div>
        </div>

        {/* FUNCTION BOX 3: Outstanding Clinical & Billing Claims (Dual Green & Blue Shading) */}
        <div className="bg-gradient-to-br from-white via-slate-50/40 to-emerald-50/25 border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04),0_2px_6px_-1px_rgba(15,23,42,0.02)] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-emerald-300/80 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
                  <Receipt className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 tracking-tight">
                  Outstanding Claims & Aging
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                ₹21.8L Collected
              </span>
            </div>

            {/* Blueprint Multi-Tier Interval Breakdown with Blue & Green Shadings */}
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200/60 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-emerald-950">0 - 30 Days</span>
                </div>
                <span className="font-mono font-bold text-emerald-950">₹18,50,000</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-blue-50/80 border border-blue-200/60 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-semibold text-blue-950">31 - 60 Days</span>
                </div>
                <span className="font-mono font-bold text-blue-950">₹3,13,000</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-sky-50/80 border border-sky-200/60 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span className="font-semibold text-sky-950">61 - 75 Days</span>
                </div>
                <span className="font-mono font-bold text-sky-950">₹2,13,000</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span className="font-semibold text-slate-800">76+ Days</span>
                </div>
                <span className="font-mono font-bold text-slate-950">₹93,600</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Realized Efficiency</span>
            <span className="font-mono font-extrabold text-emerald-700">91.2% Cleared</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. "DETAILS" DATA TABLE (BLUEPRINT REPLICA)
          - Graceful Serif Header "Details"
          - Blue "Export CSV" Button
          - Soft Warm Slate Table Header Strip
          - High-contrast 100% opacity rows
          - Interactive Pagination < 1 [2] 3 4 ... 12 >
          ══════════════════════════════════════════════════════════════ */}
      <section className="editorial-card p-5 sm:p-6 space-y-4">
        {/* Table Title & Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-950 tracking-tight">
              Details
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Verified clinical records, active admissions, and insurance reimbursement claims
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-slate-500">
              Showing <strong className="text-slate-900">{filteredPatients.length}</strong> records
            </span>
            <button
              onClick={() => alert('Exporting verified clinical ledger to CSV...')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* High-Contrast Enterprise Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-3 px-4">Patient & UHID</th>
                <th className="py-3 px-4">Attending Physician</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Admission / Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Billed Amount</th>
                <th className="py-3 px-4">Payment / TPA</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <p className="font-semibold">No patient records match the selected filters.</p>
                    <button
                      onClick={clearFilters}
                      className="mt-2 text-xs text-blue-600 font-bold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-950">{record.patient}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[11px] text-blue-700 font-semibold">{record.uhid}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] text-slate-500 font-medium">{record.ageGender}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{record.doctor}</div>
                      <div className="text-[11px] text-slate-500">{record.room}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800">{record.dept}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                      {record.time}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          record.status === 'Admitted'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : record.status === 'Discharged'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : record.status === 'In Consultation'
                            ? 'bg-blue-50/70 text-blue-700 border-blue-200'
                            : record.status === 'Critical Care'
                            ? 'bg-blue-100 text-blue-900 border-blue-300 font-bold'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            record.status === 'Discharged' ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                        />
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-950">
                      {formatCurrency(record.bill, currency.code)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-800">
                        <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                        {record.payment}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onNavigate?.('patient-list')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Blueprint Pagination Controls */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredPatients.length}</strong> of 160 active hospital admissions
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTablePage(Math.max(1, tablePage - 1))}
              disabled={tablePage === 1}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center font-bold disabled:opacity-40 cursor-pointer"
            >
              &lt;
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setTablePage(page)}
                className={`w-8 h-8 rounded-lg font-bold transition-all cursor-pointer ${
                  tablePage === page
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-slate-400">...</span>
            <button
              onClick={() => setTablePage(12)}
              className={`w-8 h-8 rounded-lg font-bold transition-all cursor-pointer ${
                tablePage === 12
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
              }`}
            >
              12
            </button>
            <button
              onClick={() => setTablePage(Math.min(12, tablePage + 1))}
              disabled={tablePage === 12}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center font-bold disabled:opacity-40 cursor-pointer"
            >
              &gt;
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. UNIFIED ENTERPRISE OPERATING SUITES
          - Curated 24 Hospital Desks
          - Strictly Blue and Green variants only (Zero unwanted colors)
          - Clean white cards with hairline borders and soft hover elevations
          ══════════════════════════════════════════════════════════════ */}
      <section className="editorial-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-slate-950 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Unified Hospital Operating Suites
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Direct dispatch across clinical wings, diagnostic labs, supply chain, ERP, HRMS & compliance
            </p>
          </div>

          {/* Interactive Pillar Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Desks' },
              { id: 'clinical', label: 'Clinical (HMS)' },
              { id: 'diagnostic', label: 'Diagnostics (LIS/RIS)' },
              { id: 'erp', label: 'Supply & ERP' },
              { id: 'governance', label: 'HRMS & Quality' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePillar(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activePillar === tab.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Cards Per Row on Desktop — Strictly Blue & Green Variant Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            // Clinical (HMS)
            { label: 'OPD Doctor Desk', sub: 'Consultations & Rx', icon: Stethoscope, route: 'hms-opd', pillar: 'clinical', iconColor: 'text-blue-600', iconBg: 'bg-blue-50 border-blue-200' },
            { label: 'IPD Ward & Beds', sub: 'Sensor Census Matrix', icon: Bed, route: 'hms-ipd', pillar: 'clinical', iconColor: 'text-emerald-700', iconBg: 'bg-emerald-50 border-emerald-200' },
            { label: 'OT & Surgery', sub: 'WHO Checklists & PACU', icon: Scissors, route: 'hms-ot', pillar: 'clinical', iconColor: 'text-blue-700', iconBg: 'bg-blue-50 border-blue-200' },
            { label: 'Emergency (ER)', sub: 'ESI 1-5 Triage & Fleet', icon: Siren, route: 'hms-emergency', pillar: 'clinical', iconColor: 'text-blue-800', iconBg: 'bg-blue-100 border-blue-300' },
            { label: 'Blood Bank', sub: 'Rh & Cross-Match', icon: Droplets, route: 'hms-bloodbank', pillar: 'clinical', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50 border-emerald-200' },
            { label: 'Patient EMR (MPI)', sub: 'Master Health Index', icon: Users, route: 'patient-list', pillar: 'clinical', iconColor: 'text-blue-600', iconBg: 'bg-blue-50 border-blue-200' },
            { label: 'Appointments', sub: 'Queue & Consultations', icon: Calendar, route: 'appointment-list', pillar: 'clinical', iconColor: 'text-teal-700', iconBg: 'bg-teal-50 border-teal-200' },

            // Diagnostics (LIS/RIS)
            { label: 'LIS Pathology', sub: 'Panic Alerts & Barcodes', icon: FlaskConical, route: 'hms-lis', pillar: 'diagnostic', iconColor: 'text-blue-600', iconBg: 'bg-blue-50 border-blue-200' },
            { label: 'RIS Radiology', sub: 'PACS DICOM & CT/MRI', icon: Scan, route: 'hms-ris', pillar: 'diagnostic', iconColor: 'text-emerald-700', iconBg: 'bg-emerald-50 border-emerald-200' },
            { label: 'Biomedical Assets', sub: 'PPM & Calibration', icon: Cpu, route: 'erp-biomedical', pillar: 'diagnostic', iconColor: 'text-teal-600', iconBg: 'bg-teal-50 border-teal-200' },

            // Supply Chain & ERP
            { label: 'Pharmacy Formulary', sub: 'GRN & Cold Chain', icon: Pill, route: 'erp-pharmacy', pillar: 'erp', iconColor: 'text-emerald-700', iconBg: 'bg-emerald-50 border-emerald-200' },
            { label: 'TPA Insurance', sub: 'Cashless Pre-Auth', icon: FileCheck, route: 'erp-tpa-claims', pillar: 'erp', iconColor: 'text-blue-700', iconBg: 'bg-blue-50 border-blue-200' },
            { label: 'Procurement & PO', sub: '3-Way Match GRN', icon: ShoppingCart, route: 'erp-procurement', pillar: 'erp', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50 border-emerald-200' },
            { label: 'CSSD & Bio-Waste', sub: 'Autoclave & BMW Track', icon: ShieldCheck, route: 'erp-cssd-infection', pillar: 'erp', iconColor: 'text-teal-700', iconBg: 'bg-teal-50 border-teal-200' },
            { label: 'Cost Center P&L', sub: 'Doctor Fee Shares', icon: DollarSign, route: 'erp-finance', pillar: 'erp', iconColor: 'text-emerald-700', iconBg: 'bg-emerald-50 border-emerald-200' },
            { label: 'GST Counter POS', sub: 'Tax Invoices & Cash', icon: Receipt, route: 'erp-billing', pillar: 'erp', iconColor: 'text-blue-600', iconBg: 'bg-blue-50 border-blue-200' },

            // Workforce & Governance (HRMS / CRM)
            { label: 'Healthcare Payroll', sub: 'Salary Disbursals', icon: Banknote, route: 'hrms-payroll', pillar: 'governance', iconColor: 'text-emerald-700', iconBg: 'bg-emerald-50 border-emerald-200' },
            { label: 'Doctor Credentialing', sub: 'Privileging & CME', icon: Award, route: 'hrms-credentialing', pillar: 'governance', iconColor: 'text-blue-700', iconBg: 'bg-blue-50 border-blue-200' },
            { label: 'Shift Duty Roster', sub: '24/7 Clock-In & Shifts', icon: Clock, route: 'hrms-roster', pillar: 'governance', iconColor: 'text-teal-700', iconBg: 'bg-teal-50 border-teal-200' },
            { label: 'Staff Directory', sub: 'Hospital Personnel', icon: UserCheck, route: 'staff-list', pillar: 'governance', iconColor: 'text-blue-600', iconBg: 'bg-blue-50 border-blue-200' },
            { label: 'Incidents & CAPA', sub: 'Safety Sentinel & Root', icon: AlertTriangle, route: 'admin-incidents', pillar: 'governance', iconColor: 'text-blue-800', iconBg: 'bg-blue-50 border-blue-200' },
            { label: 'JCI / NABH Audits', sub: 'AERB & Licenses', icon: ShieldCheck, route: 'admin-compliance', pillar: 'governance', iconColor: 'text-emerald-700', iconBg: 'bg-emerald-50 border-emerald-200' },
            { label: 'Health Packages', sub: 'Executive Checkups', icon: HeartPulse, route: 'crm-health-packages', pillar: 'governance', iconColor: 'text-teal-700', iconBg: 'bg-teal-50 border-teal-200' },
            { label: 'Referral Network', sub: 'Tertiary Doctors', icon: Network, route: 'crm-referrals', pillar: 'governance', iconColor: 'text-blue-700', iconBg: 'bg-blue-50 border-blue-200' }
          ]
            .filter((suite) => activePillar === 'all' || suite.pillar === activePillar)
            .map((suite, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate?.(suite.route)}
                className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md p-4 rounded-xl text-left flex flex-col justify-between group cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg ${suite.iconBg} ${suite.iconColor} border flex items-center justify-center shrink-0`}>
                    <suite.icon className="w-4 h-4" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-950 group-hover:text-blue-600 transition-colors truncate">
                    {suite.label}
                  </p>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    {suite.sub}
                  </p>
                </div>
              </button>
            ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. CLINICAL QUALITY GOVERNANCE & BREAK-GLASS AUDIT STREAM
          Strict Blue & Green Variant Badges
          ══════════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Accreditation & Quality Governance */}
        <div className="editorial-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-normal text-slate-950">
                  Quality & Accreditation
                </h3>
                <p className="text-[11px] text-slate-500">NABH 5th Edition & JCI Hospital Standards</p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Gold Standard
            </span>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wide">
                NABH Quality Index
              </span>
              <p className="text-2xl font-extrabold text-emerald-700 font-mono mt-0.5">
                96.4%
              </p>
              <p className="text-[10px] text-slate-600 font-medium mt-0.5">
                Compliant across IPSG 1–6 patient safety targets
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div>
                <span className="font-semibold text-slate-950">Open CAPA Audit Findings</span>
                <p className="text-[10px] text-slate-500">Corrective actions in progress</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                3 Pending
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div>
                <span className="font-semibold text-slate-950">Hospital-Acquired Infection (HAI)</span>
                <p className="text-[10px] text-slate-500">Benchmark target &lt; 1.0%</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                0.12% Safe
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div>
                <span className="font-semibold text-slate-950">Hand Hygiene Compliance</span>
                <p className="text-[10px] text-slate-500">WHO 5-moments sensor audit</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                98.2% Pass
              </span>
            </div>
          </div>
        </div>

        {/* Live Break-Glass Emergency Audit Surveillance */}
        <div className="lg:col-span-2 editorial-card p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-normal text-slate-950">
                  Immutable Break-Glass & Clinical Audit Stream
                </h3>
                <p className="text-[11px] text-slate-500">Cryptographically anchored compliance ledger for emergency overrides</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Surveillance Online
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-bold text-[10px] uppercase tracking-wider border-b border-slate-200">
                  <th className="py-2.5 px-3">Security Action</th>
                  <th className="py-2.5 px-3">Clinical Justification</th>
                  <th className="py-2.5 px-3">Target Entity</th>
                  <th className="py-2.5 px-3">Verification</th>
                  <th className="py-2.5 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(auditLogs.length > 0 ? auditLogs.slice(0, 4) : [
                  { action: 'BREAK_GLASS_ACCESS', reason: 'Emergency resuscitation & stat toxicology access', entityName: 'Patient EMR (UHID-40291)', principal: 'Dr. Priya Sharma • ICU Intensivist', status: 'VERIFIED_SIGNATURE', time: '09:15 AM' },
                  { action: 'NARCOTIC_OVERRIDE', reason: 'Stat fentanyl administration for trauma laparotomy', entityName: 'Pyxis MedStation 4B', principal: 'Nurse Sarah Jenkins • Trauma Nurse', status: 'VERIFIED_SIGNATURE', time: '08:52 AM' },
                  { action: 'VIP_CHART_UNMASK', reason: 'Cardiothoracic consult for ambassadorial admission', entityName: 'Deluxe Suite 402', principal: 'Dr. Rajesh Patel • Chief of Surgery', status: 'COMPLIANCE_PASS', time: '08:15 AM' },
                  { action: 'EMERGENCY_DISPENSE', reason: 'Code Blue epinephrine bolus release without pre-PO', entityName: 'Central Crash Cart #3', principal: 'Code Blue Team Lead', status: 'VERIFIED_SIGNATURE', time: '07:40 AM' },
                ]).map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{log.reason}</div>
                      <div className="text-[10px] text-blue-700 font-medium">{log.principal}</div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {log.entityName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle className="w-2.5 h-2.5" />
                        Verified
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[11px] text-slate-700 font-bold">
                      {log.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
