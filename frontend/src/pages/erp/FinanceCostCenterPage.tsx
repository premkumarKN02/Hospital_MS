import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Filter,
  TrendingUp,
  Building2,
  PieChart,
  Receipt,
  CreditCard,
  X,
  FileText,
  Landmark,
  ShieldCheck,
  Check,
  Download
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { formatCurrency } from '../../utils/currencyService';

interface CostCenter {
  id: string;
  department: string;
  monthlyRevenue: number;
  monthlyExpense: number;
  netMargin: number;
  marginPercentage: number;
  headOfDepartment: string;
  status: 'PROFITABLE' | 'HEALTHY_MARGIN' | 'COST_ATTENTION';
}

interface DoctorPayout {
  id: string;
  doctorName: string;
  specialization: string;
  opdConsultationsCount: number;
  surgeriesCount: number;
  grossEarnings: number;
  tdsDeduction: number;
  netPayable: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber: string;
  payoutStatus: 'VERIFIED_READY' | 'DISBURSED' | 'PENDING_AUDIT';
  utrNumber?: string;
  disbursedAt?: string;
}

interface CounterShiftReconciliation {
  id: string;
  counterName: string;
  cashierName: string;
  cashAmount: number;
  cardAmount: number;
  upiAmount: number;
  totalCollected: number;
  discrepancy: number;
  status: 'BALANCED_VERIFIED' | 'DISCREPANCY_FLAGGED';
  settledAt: string;
}

export const FinanceCostCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DEPT_PNL' | 'DOCTOR_PAYOUTS' | 'DAILY_RECONCILIATION'>('DEPT_PNL');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Search & Filters
  const [costCenterSearch, setCostCenterSearch] = useState('');
  const [costCenterStatusFilter, setCostCenterStatusFilter] = useState<string>('ALL');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorStatusFilter, setDoctorStatusFilter] = useState<string>('ALL');

  // Modals
  const [isAddCostCenterOpen, setIsAddCostCenterOpen] = useState(false);
  const [selectedPayoutForVoucher, setSelectedPayoutForVoucher] = useState<DoctorPayout | null>(null);
  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // State: Cost Centers
  const [costCenters, setCostCenters] = useState<CostCenter[]>(() => {
    const saved = localStorage.getItem('hospital_cost_centers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'CC-01',
        department: 'Surgical Gastroenterology & GI',
        monthlyRevenue: 3450000,
        monthlyExpense: 1850000,
        netMargin: 1600000,
        marginPercentage: 46.4,
        headOfDepartment: 'Dr. R. Arun',
        status: 'PROFITABLE'
      },
      {
        id: 'CC-02',
        department: 'Interventional Cardiology & Cath Lab',
        monthlyRevenue: 5200000,
        monthlyExpense: 2900000,
        netMargin: 2300000,
        marginPercentage: 44.2,
        headOfDepartment: 'Dr. Joseph',
        status: 'PROFITABLE'
      },
      {
        id: 'CC-03',
        department: 'Joint Replacement & Orthopedics',
        monthlyRevenue: 2800000,
        monthlyExpense: 1600000,
        netMargin: 1200000,
        marginPercentage: 42.8,
        headOfDepartment: 'Dr. P. Sundaram',
        status: 'HEALTHY_MARGIN'
      },
      {
        id: 'CC-04',
        department: 'Central Pharmacy & Material Retail',
        monthlyRevenue: 4100000,
        monthlyExpense: 3200000,
        netMargin: 900000,
        marginPercentage: 21.9,
        headOfDepartment: 'Chief Pharmacist Ravi',
        status: 'HEALTHY_MARGIN'
      },
      {
        id: 'CC-05',
        department: 'Diagnostic Radiology & CT/MRI',
        monthlyRevenue: 1950000,
        monthlyExpense: 1100000,
        netMargin: 850000,
        marginPercentage: 43.6,
        headOfDepartment: 'Dr. S. Mohan',
        status: 'HEALTHY_MARGIN'
      },
      {
        id: 'CC-06',
        department: 'Emergency & Trauma Care (24x7)',
        monthlyRevenue: 1250000,
        monthlyExpense: 1180000,
        netMargin: 70000,
        marginPercentage: 5.6,
        headOfDepartment: 'Dr. Joseph',
        status: 'COST_ATTENTION'
      }
    ];
  });

  // State: Doctor Payouts
  const [doctorPayouts, setDoctorPayouts] = useState<DoctorPayout[]>(() => {
    const saved = localStorage.getItem('hospital_doctor_payouts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'PAY-01',
        doctorName: 'Dr. R. Arun',
        specialization: 'Surgical Gastroenterology',
        opdConsultationsCount: 184,
        surgeriesCount: 22,
        grossEarnings: 485000,
        tdsDeduction: 48500,
        netPayable: 436500,
        bankName: 'HDFC Bank Ltd',
        accountNumber: 'XXXX-XXXX-8921',
        ifscCode: 'HDFC0001042',
        panNumber: 'ABCPA1234D',
        payoutStatus: 'VERIFIED_READY'
      },
      {
        id: 'PAY-02',
        doctorName: 'Dr. K. Sindhu',
        specialization: 'General Medicine & Diabetology',
        opdConsultationsCount: 310,
        surgeriesCount: 0,
        grossEarnings: 280000,
        tdsDeduction: 28000,
        netPayable: 252000,
        bankName: 'State Bank of India',
        accountNumber: 'XXXX-XXXX-4412',
        ifscCode: 'SBIN0004521',
        panNumber: 'XYZPS5678K',
        payoutStatus: 'VERIFIED_READY'
      },
      {
        id: 'PAY-03',
        doctorName: 'Dr. P. Sundaram',
        specialization: 'Orthopedic Surgery',
        opdConsultationsCount: 142,
        surgeriesCount: 16,
        grossEarnings: 390000,
        tdsDeduction: 39000,
        netPayable: 351000,
        bankName: 'ICICI Bank Ltd',
        accountNumber: 'XXXX-XXXX-7782',
        ifscCode: 'ICIC0000184',
        panNumber: 'MNBPO9012F',
        payoutStatus: 'DISBURSED',
        utrNumber: 'NEFT-HOSP-20261005-4109',
        disbursedAt: '2026-10-05 14:30'
      },
      {
        id: 'PAY-04',
        doctorName: 'Dr. Joseph',
        specialization: 'Cardiology & Emergency Interventions',
        opdConsultationsCount: 165,
        surgeriesCount: 18,
        grossEarnings: 520000,
        tdsDeduction: 52000,
        netPayable: 468000,
        bankName: 'Axis Bank',
        accountNumber: 'XXXX-XXXX-9934',
        ifscCode: 'UTIB0000215',
        panNumber: 'JKLPC3321H',
        payoutStatus: 'PENDING_AUDIT'
      }
    ];
  });

  // State: Counter Reconciliations
  const [counterShifts, setCounterShifts] = useState<CounterShiftReconciliation[]>(() => {
    const saved = localStorage.getItem('hospital_counter_reconciliations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'SHIFT-01',
        counterName: 'Counter 1 - Main OPD Registration & Billing',
        cashierName: 'Priya R. (Senior Cashier)',
        cashAmount: 64500,
        cardAmount: 142000,
        upiAmount: 98000,
        totalCollected: 304500,
        discrepancy: 0,
        status: 'BALANCED_VERIFIED',
        settledAt: 'Today, 02:00 PM'
      },
      {
        id: 'SHIFT-02',
        counterName: 'Counter 2 - Emergency 24x7 Triage POS',
        cashierName: 'Rajesh K. (ER Billing Desk)',
        cashAmount: 32000,
        cardAmount: 85000,
        upiAmount: 74000,
        totalCollected: 191000,
        discrepancy: 0,
        status: 'BALANCED_VERIFIED',
        settledAt: 'Today, 02:15 PM'
      },
      {
        id: 'SHIFT-03',
        counterName: 'Counter 3 - Inpatient Discharge Settlement',
        cashierName: 'Meena S. (IPD Accounts)',
        cashAmount: 28000,
        cardAmount: 65000,
        upiAmount: 51400,
        totalCollected: 144400,
        discrepancy: 0,
        status: 'BALANCED_VERIFIED',
        settledAt: 'Today, 01:45 PM'
      },
      {
        id: 'SHIFT-04',
        counterName: 'Counter 4 - Central Pharmacy Retail Dispensing',
        cashierName: 'Selvam T. (Pharmacy POS)',
        cashAmount: 24000,
        cardAmount: 20000,
        upiAmount: 42000,
        totalCollected: 86000,
        discrepancy: 0,
        status: 'BALANCED_VERIFIED',
        settledAt: 'Today, 02:30 PM'
      }
    ];
  });

  // New Cost Center Form State
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptHod, setNewDeptHod] = useState('');
  const [newDeptRevenue, setNewDeptRevenue] = useState('');
  const [newDeptExpense, setNewDeptExpense] = useState('');

  // New Shift Audit Form State
  const [newShiftCounter, setNewShiftCounter] = useState('Counter 1 - Main OPD Registration & Billing');
  const [newShiftCashier, setNewShiftCashier] = useState('');
  const [newShiftCash, setNewShiftCash] = useState('');
  const [newShiftCard, setNewShiftCard] = useState('');
  const [newShiftUpi, setNewShiftUpi] = useState('');

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hospital_cost_centers', JSON.stringify(costCenters));
    } catch (e) {
      console.error(e);
    }
  }, [costCenters]);

  useEffect(() => {
    try {
      localStorage.setItem('hospital_doctor_payouts', JSON.stringify(doctorPayouts));
    } catch (e) {
      console.error(e);
    }
  }, [doctorPayouts]);

  useEffect(() => {
    try {
      localStorage.setItem('hospital_counter_reconciliations', JSON.stringify(counterShifts));
    } catch (e) {
      console.error(e);
    }
  }, [counterShifts]);

  // Handle Add Cost Center
  const handleAddCostCenter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptHod.trim()) return;

    const rev = parseFloat(newDeptRevenue) || 0;
    const exp = parseFloat(newDeptExpense) || 0;
    const net = rev - exp;
    const margin = rev > 0 ? parseFloat(((net / rev) * 100).toFixed(1)) : 0;
    const status: CostCenter['status'] =
      margin > 30 ? 'PROFITABLE' : margin > 15 ? 'HEALTHY_MARGIN' : 'COST_ATTENTION';

    const newCenter: CostCenter = {
      id: `CC-${String(costCenters.length + 1).padStart(2, '0')}`,
      department: newDeptName.trim(),
      monthlyRevenue: rev,
      monthlyExpense: exp,
      netMargin: net,
      marginPercentage: margin,
      headOfDepartment: newDeptHod.trim(),
      status
    };

    setCostCenters([...costCenters, newCenter]);
    setIsAddCostCenterOpen(false);
    setNewDeptName('');
    setNewDeptHod('');
    setNewDeptRevenue('');
    setNewDeptExpense('');
    showToast(`Registered cost center: ${newCenter.department}`);
  };

  // Handle Disburse Doctor Payout
  const handleConfirmDisbursement = (payoutId: string) => {
    const utr = `NEFT-HOSP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setDoctorPayouts(prev =>
      prev.map(p => {
        if (p.id === payoutId) {
          const updated: DoctorPayout = {
            ...p,
            payoutStatus: 'DISBURSED',
            utrNumber: utr,
            disbursedAt: nowStr
          };
          if (selectedPayoutForVoucher && selectedPayoutForVoucher.id === payoutId) {
            setSelectedPayoutForVoucher(updated);
          }
          return updated;
        }
        return p;
      })
    );
    showToast(`Bank transfer completed! UTR: ${utr}`);
  };

  // Handle Reconcile Shift
  const handleAddShiftReconciliation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShiftCashier.trim()) return;

    const cash = parseFloat(newShiftCash) || 0;
    const card = parseFloat(newShiftCard) || 0;
    const upi = parseFloat(newShiftUpi) || 0;
    const total = cash + card + upi;

    const newShift: CounterShiftReconciliation = {
      id: `SHIFT-${String(counterShifts.length + 1).padStart(2, '0')}`,
      counterName: newShiftCounter,
      cashierName: newShiftCashier.trim(),
      cashAmount: cash,
      cardAmount: card,
      upiAmount: upi,
      totalCollected: total,
      discrepancy: 0,
      status: 'BALANCED_VERIFIED',
      settledAt: 'Just now'
    };

    setCounterShifts([newShift, ...counterShifts]);
    setIsReconcileModalOpen(false);
    setNewShiftCashier('');
    setNewShiftCash('');
    setNewShiftCard('');
    setNewShiftUpi('');
    showToast(`Shift audited & reconciled for ${newShift.counterName}`);
  };

  // Calculated Metrics
  const totalHospitalRevenue = costCenters.reduce((acc, c) => acc + c.monthlyRevenue, 0);
  const totalHospitalExpense = costCenters.reduce((acc, c) => acc + c.monthlyExpense, 0);
  const totalNetOperatingProfit = totalHospitalRevenue - totalHospitalExpense;
  const overallMargin = totalHospitalRevenue > 0 ? ((totalNetOperatingProfit / totalHospitalRevenue) * 100).toFixed(1) : '0';

  const totalDisbursedPayouts = doctorPayouts
    .filter(d => d.payoutStatus === 'DISBURSED')
    .reduce((acc, d) => acc + d.netPayable, 0);
  const totalPendingPayouts = doctorPayouts
    .filter(d => d.payoutStatus !== 'DISBURSED')
    .reduce((acc, d) => acc + d.netPayable, 0);

  // Filtered lists
  const filteredCostCenters = costCenters.filter(c => {
    const matchesSearch =
      c.department.toLowerCase().includes(costCenterSearch.toLowerCase()) ||
      c.headOfDepartment.toLowerCase().includes(costCenterSearch.toLowerCase());
    const matchesStatus = costCenterStatusFilter === 'ALL' || c.status === costCenterStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredDoctorPayouts = doctorPayouts.filter(d => {
    const matchesSearch =
      d.doctorName.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      d.specialization.toLowerCase().includes(doctorSearch.toLowerCase());
    const matchesStatus = doctorStatusFilter === 'ALL' || d.payoutStatus === doctorStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="card-stylish p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <DollarSign className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Hospital Financial Accounting &amp; Departmental Cost Centers
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              Departmental P&amp;L margins, consultant doctor fee share payouts (TDS withheld), and daily cash counter reconciliation
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
            title="Share financial report"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
            title="Print report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* High-Level Hospital Financial Health */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-slate-500 uppercase">Gross Revenue (MTD)</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(totalHospitalRevenue)}</p>
          <p className="text-[11px] text-emerald-600 mt-1">+14.2% YoY growth</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-slate-500 uppercase">Operating Expenditure</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(totalHospitalExpense)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Salaries, drugs, utilities</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-emerald-500 uppercase">Net Operating Profit</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(totalNetOperatingProfit)}</p>
          <p className="text-[11px] text-emerald-600 mt-1">Operating EBITDA</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-indigo-500 uppercase">Overall Hospital Margin</span>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{overallMargin}%</p>
          <p className="text-[11px] text-slate-500 mt-1">Healthy tertiary tier</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('DEPT_PNL')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'DEPT_PNL'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Departmental P&amp;L &amp; Cost Centers ({costCenters.length})
        </button>
        <button
          onClick={() => setActiveTab('DOCTOR_PAYOUTS')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'DOCTOR_PAYOUTS'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Doctor Consultation &amp; Surgery Share ({doctorPayouts.length})
        </button>
        <button
          onClick={() => setActiveTab('DAILY_RECONCILIATION')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'DAILY_RECONCILIATION'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          Daily Counter Cash/POS Reconciliation ({counterShifts.length})
        </button>
      </div>

      {/* TAB 1: DEPARTMENT PNL */}
      {activeTab === 'DEPT_PNL' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search department or HOD..."
                  value={costCenterSearch}
                  onChange={e => setCostCenterSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select
                value={costCenterStatusFilter}
                onChange={e => setCostCenterStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Health Margins</option>
                <option value="PROFITABLE">High Contributor</option>
                <option value="HEALTHY_MARGIN">Healthy</option>
                <option value="COST_ATTENTION">Cost Intensive</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddCostCenterOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Department Cost Center
            </button>
          </div>

          <div className="table-container-stylish">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-4 py-3">Cost Center Department</th>
                    <th className="px-4 py-3">Head of Department</th>
                    <th className="px-4 py-3">Gross Revenue (MTD)</th>
                    <th className="px-4 py-3">Direct Expenditure</th>
                    <th className="px-4 py-3">Net Operating Margin</th>
                    <th className="px-4 py-3">Profit Margin %</th>
                    <th className="px-4 py-3 text-right">Health Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCostCenters.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">{c.department}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{c.id}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-xs text-slate-700 dark:text-slate-300">{c.headOfDepartment}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{formatCurrency(c.monthlyRevenue)}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-xs text-slate-500">{formatCurrency(c.monthlyExpense)}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">{formatCurrency(c.netMargin)}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{c.marginPercentage}%</div>
                        <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              c.marginPercentage > 30 ? 'bg-emerald-500' : c.marginPercentage > 15 ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(5, c.marginPercentage * 2))}%` }}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right">
                        {c.status === 'PROFITABLE' ? (
                          <span className="badge-emerald">High Contributor</span>
                        ) : c.status === 'HEALTHY_MARGIN' ? (
                          <span className="badge-blue">Healthy</span>
                        ) : (
                          <span className="badge-amber">Cost Intensive</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredCostCenters.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-xs text-slate-400">
                        No departmental cost centers found matching filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTOR PAYOUTS */}
      {activeTab === 'DOCTOR_PAYOUTS' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search doctor or specialty..."
                  value={doctorSearch}
                  onChange={e => setDoctorSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select
                value={doctorStatusFilter}
                onChange={e => setDoctorStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Payout Status</option>
                <option value="VERIFIED_READY">Ready for NEFT</option>
                <option value="DISBURSED">Disbursed</option>
                <option value="PENDING_AUDIT">Pending Audit</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Disbursed: <strong className="text-emerald-600">{formatCurrency(totalDisbursedPayouts)}</strong></span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">Pending: <strong className="text-amber-600">{formatCurrency(totalPendingPayouts)}</strong></span>
            </div>
          </div>

          <div className="table-container-stylish">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-4 py-3">Doctor &amp; Specialization</th>
                    <th className="px-4 py-3">OPD Visits</th>
                    <th className="px-4 py-3">Surgeries Done</th>
                    <th className="px-4 py-3">Gross Fee Share</th>
                    <th className="px-4 py-3">TDS Deduction (10%)</th>
                    <th className="px-4 py-3">Net Payable Amount</th>
                    <th className="px-4 py-3 text-right">Settlement Voucher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredDoctorPayouts.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">{d.doctorName}</div>
                        <div className="text-[11px] text-slate-500">{d.specialization}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{d.bankName} • {d.accountNumber}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{d.opdConsultationsCount} Patients</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{d.surgeriesCount} Surgeries</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">{formatCurrency(d.grossEarnings)}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-xs text-rose-600 font-medium">-{formatCurrency(d.tdsDeduction)}</div>
                        <span className="text-[10px] text-slate-400">Sec 194J</span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(d.netPayable)}</div>
                        {d.utrNumber && <div className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">{d.utrNumber}</div>}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {d.payoutStatus === 'DISBURSED' ? (
                            <button
                              onClick={() => setSelectedPayoutForVoucher(d)}
                              className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded text-xs font-semibold hover:bg-emerald-100 transition flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> View Voucher
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedPayoutForVoucher(d)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition flex items-center gap-1 shadow-xs"
                            >
                              <Landmark className="w-3.5 h-3.5" /> Disburse NEFT
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDoctorPayouts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-xs text-slate-400">
                        No doctor payout accounts found matching filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DAILY RECONCILIATION */}
      {activeTab === 'DAILY_RECONCILIATION' && (
        <div className="space-y-4">
          <div className="card-stylish p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Daily Cash &amp; Digital Counter Settlement</h3>
                <p className="text-xs text-slate-500">Reconcile physical cash, credit card swipe terminals, and UPI QR codes with hospital accounts</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge-emerald">Shift 1 Books Balanced</span>
                <button
                  onClick={() => setIsReconcileModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Reconcile Shift
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase">Cash at Counters</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(counterShifts.reduce((acc, s) => acc + s.cashAmount, 0))}
                </p>
                <p className="text-[11px] text-slate-400">Vault safe deposited</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase">Credit Card POS Swipes</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(counterShifts.reduce((acc, s) => acc + s.cardAmount, 0))}
                </p>
                <p className="text-[11px] text-slate-400">HDFC &amp; ICICI Merchant EDC</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase">UPI / Online Collections</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(counterShifts.reduce((acc, s) => acc + s.upiAmount, 0))}
                </p>
                <p className="text-[11px] text-slate-400">Instant nodal settlement</p>
              </div>
            </div>
          </div>

          {/* Shift Table */}
          <div className="table-container-stylish">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-4 py-3">Counter &amp; Station</th>
                    <th className="px-4 py-3">Cashier</th>
                    <th className="px-4 py-3">Cash In Vault</th>
                    <th className="px-4 py-3">Card EDC Swipes</th>
                    <th className="px-4 py-3">UPI QR Scan</th>
                    <th className="px-4 py-3">Total Collection</th>
                    <th className="px-4 py-3 text-right">Settlement Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {counterShifts.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">{s.counterName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{s.id} • {s.settledAt}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-slate-700 dark:text-slate-300">{s.cashierName}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatCurrency(s.cashAmount)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatCurrency(s.cardAmount)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatCurrency(s.upiAmount)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(s.totalCollected)}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="badge-emerald">Balanced</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD DEPARTMENT COST CENTER */}
      {isAddCostCenterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Add Department Cost Center</h3>
              </div>
              <button
                onClick={() => setIsAddCostCenterOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCostCenter} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Department / Specialty Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Neurology & Neuro-Surgery"
                  value={newDeptName}
                  onChange={e => setNewDeptName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Head of Department (HOD)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar, MS, MCh"
                  value={newDeptHod}
                  onChange={e => setNewDeptHod(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Monthly Revenue (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="2500000"
                    value={newDeptRevenue}
                    onChange={e => setNewDeptRevenue(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Monthly Expense (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="1400000"
                    value={newDeptExpense}
                    onChange={e => setNewDeptExpense(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
                Operating margin percentage and financial contributor health status will be calculated automatically based on inputs.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCostCenterOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-sm"
                >
                  Register Center
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DOCTOR SETTLEMENT VOUCHER & NEFT DISBURSEMENT */}
      {selectedPayoutForVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Doctor Fee Share Settlement Voucher
                </h3>
              </div>
              <button
                onClick={() => setSelectedPayoutForVoucher(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Voucher Shell */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-3">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    SINDHU HEALTHCARE HOSPITAL &amp; RESEARCH INSTITUTE
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Consultant Physician Professional Retainer &amp; Case Share Ledger
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    GSTIN: 33AAACH1234F1Z8 • TAN: CHES01234D
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      selectedPayoutForVoucher.payoutStatus === 'DISBURSED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : selectedPayoutForVoucher.payoutStatus === 'VERIFIED_READY'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {selectedPayoutForVoucher.payoutStatus === 'DISBURSED'
                      ? 'DISBURSED & CREDITED'
                      : selectedPayoutForVoucher.payoutStatus === 'VERIFIED_READY'
                      ? 'AUDITED • READY FOR NEFT'
                      : 'PENDING CFO AUDIT'}
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    Voucher: VOUCH-{selectedPayoutForVoucher.id}
                  </p>
                </div>
              </div>

              {/* Beneficiary Details */}
              <div className="grid grid-cols-2 gap-3 py-1">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Consultant Doctor</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {selectedPayoutForVoucher.doctorName}
                  </span>
                  <p className="text-[11px] text-slate-500">{selectedPayoutForVoucher.specialization}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Tax PAN &amp; Category</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {selectedPayoutForVoucher.panNumber}
                  </span>
                  <p className="text-[11px] text-slate-500">Sec 194J Professional Services</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Bank &amp; Account</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {selectedPayoutForVoucher.bankName}
                  </span>
                  <p className="text-[11px] font-mono text-slate-500">{selectedPayoutForVoucher.accountNumber}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Bank IFSC Code</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {selectedPayoutForVoucher.ifscCode}
                  </span>
                  <p className="text-[11px] text-slate-500">Core Banking Solutions</p>
                </div>
              </div>

              {/* Earnings Breakdown */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-1.5">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>OPD Consultations ({selectedPayoutForVoucher.opdConsultationsCount} patients @ contracted rate)</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatCurrency(selectedPayoutForVoucher.grossEarnings * 0.45)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Inpatient Procedures &amp; Surgeries ({selectedPayoutForVoucher.surgeriesCount} major OT cases)</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatCurrency(selectedPayoutForVoucher.grossEarnings * 0.55)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-1.5">
                  <span>Gross Remuneration</span>
                  <span>{formatCurrency(selectedPayoutForVoucher.grossEarnings)}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-medium">
                  <span>TDS Deducted @ 10% (Section 194J)</span>
                  <span>-{formatCurrency(selectedPayoutForVoucher.tdsDeduction)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-emerald-600 dark:text-emerald-400 border-t border-slate-200 dark:border-slate-700 pt-2">
                  <span>Net Disbursable Amount</span>
                  <span>{formatCurrency(selectedPayoutForVoucher.netPayable)}</span>
                </div>
              </div>

              {/* UTR Confirmation if Disbursed */}
              {selectedPayoutForVoucher.payoutStatus === 'DISBURSED' && (
                <div className="p-3 bg-emerald-100/70 dark:bg-emerald-950/60 rounded-xl border border-emerald-300 dark:border-emerald-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                    <ShieldCheck className="w-4 h-4" /> Transfer Verified
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    NEFT Reference / UTR:{' '}
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {selectedPayoutForVoucher.utrNumber}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Timestamp: {selectedPayoutForVoucher.disbursedAt}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => window.print()}
                className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Voucher
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPayoutForVoucher(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  Close
                </button>
                {selectedPayoutForVoucher.payoutStatus !== 'DISBURSED' && (
                  <button
                    type="button"
                    onClick={() => handleConfirmDisbursement(selectedPayoutForVoucher.id)}
                    className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Landmark className="w-4 h-4" /> Confirm &amp; Initiate NEFT
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: RECONCILE CASH SHIFT */}
      {isReconcileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Reconcile Counter Shift Cash</h3>
              </div>
              <button
                onClick={() => setIsReconcileModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddShiftReconciliation} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Cash Counter Station
                </label>
                <select
                  value={newShiftCounter}
                  onChange={e => setNewShiftCounter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Counter 1 - Main OPD Registration & Billing">Counter 1 - Main OPD Registration &amp; Billing</option>
                  <option value="Counter 2 - Emergency 24x7 Triage POS">Counter 2 - Emergency 24x7 Triage POS</option>
                  <option value="Counter 3 - Inpatient Discharge Settlement">Counter 3 - Inpatient Discharge Settlement</option>
                  <option value="Counter 4 - Central Pharmacy Retail Dispensing">Counter 4 - Central Pharmacy Retail Dispensing</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Cashier / Billing Officer Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand K. (Staff ID: CS-104)"
                  value={newShiftCashier}
                  onChange={e => setNewShiftCashier(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Cash in Drawer (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="35000"
                    value={newShiftCash}
                    onChange={e => setNewShiftCash(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Card EDC (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="50000"
                    value={newShiftCard}
                    onChange={e => setNewShiftCard(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    UPI QR Scans (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="45000"
                    value={newShiftUpi}
                    onChange={e => setNewShiftUpi(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReconcileModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-sm"
                >
                  Audit &amp; Balance Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Hospital Executive Financial Ledger Summary"
        text={`Hospital Financial Health: ${formatCurrency(totalHospitalRevenue)} Gross Revenue, ${overallMargin}% net operating profit margin.`}
        url={window.location.href}
      />
    </div>
  );
};
