import React, { useState, useEffect } from 'react';
import {
  Banknote,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Filter,
  DollarSign,
  Download,
  FileText,
  User,
  ShieldCheck,
  X,
  CreditCard,
  Building2,
  Check
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { formatCurrency } from '../../utils/currencyService';

interface PayrollRecord {
  id: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  designation: string;
  basicSalary: number;
  hraAllowance: number;
  nightShiftAllowance: number;
  onCallSpecialDuty: number;
  grossSalary: number;
  pfDeduction: number;
  esiDeduction: number;
  tdsDeduction: number;
  netDisbursement: number;
  paymentStatus: 'DISBURSED' | 'PENDING_APPROVAL';
  disbursedDate?: string;
  bankAccountMasked?: string;
}

const INITIAL_PAYROLL: PayrollRecord[] = [
  {
    id: 'PAY-01',
    employeeCode: 'EMP-DOC-101',
    employeeName: 'Dr. Arunachalam Kumar',
    department: 'Cardiology & Cath Lab',
    designation: 'Senior Consultant Cardiologist',
    basicSalary: 220000,
    hraAllowance: 45000,
    nightShiftAllowance: 0,
    onCallSpecialDuty: 35000,
    grossSalary: 300000,
    pfDeduction: 1800,
    esiDeduction: 0,
    tdsDeduction: 30000,
    netDisbursement: 268200,
    paymentStatus: 'DISBURSED',
    disbursedDate: '2026-10-01',
    bankAccountMasked: 'HDFC Bank •••• 4091'
  },
  {
    id: 'PAY-02',
    employeeCode: 'EMP-NUR-204',
    employeeName: 'Nurse Kavitha M.',
    department: 'ICU Critical Care',
    designation: 'Head Nursing Officer',
    basicSalary: 38000,
    hraAllowance: 9500,
    nightShiftAllowance: 6000,
    onCallSpecialDuty: 2500,
    grossSalary: 56000,
    pfDeduction: 1800,
    esiDeduction: 420,
    tdsDeduction: 0,
    netDisbursement: 53780,
    paymentStatus: 'DISBURSED',
    disbursedDate: '2026-10-01',
    bankAccountMasked: 'SBI •••• 8812'
  },
  {
    id: 'PAY-03',
    employeeCode: 'EMP-TEC-311',
    employeeName: 'Anand C. (Lab Tech)',
    department: 'Pathology & LIS',
    designation: 'Senior Medical Lab Technologist',
    basicSalary: 32000,
    hraAllowance: 8000,
    nightShiftAllowance: 3500,
    onCallSpecialDuty: 1500,
    grossSalary: 45000,
    pfDeduction: 1800,
    esiDeduction: 337,
    tdsDeduction: 0,
    netDisbursement: 42863,
    paymentStatus: 'DISBURSED',
    disbursedDate: '2026-10-01',
    bankAccountMasked: 'ICICI Bank •••• 1120'
  },
  {
    id: 'PAY-04',
    employeeCode: 'EMP-PHM-402',
    employeeName: 'Ravi Kumar',
    department: 'Central Pharmacy',
    designation: 'Chief Pharmacist',
    basicSalary: 42000,
    hraAllowance: 10500,
    nightShiftAllowance: 2000,
    onCallSpecialDuty: 0,
    grossSalary: 54500,
    pfDeduction: 1800,
    esiDeduction: 408,
    tdsDeduction: 0,
    netDisbursement: 52292,
    paymentStatus: 'PENDING_APPROVAL',
    bankAccountMasked: 'Axis Bank •••• 9940'
  }
];

export const HealthcarePayrollPage: React.FC = () => {
  const [payrollList, setPayrollList] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem('hospital_hrms_payroll_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PAYROLL;
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    try {
      localStorage.setItem('hospital_hrms_payroll_v1', JSON.stringify(payrollList));
    } catch (e) {
      console.error(e);
    }
  }, [payrollList]);

  const handleApprovePayroll = (id: string) => {
    setPayrollList((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              paymentStatus: 'DISBURSED',
              disbursedDate: new Date().toISOString().split('T')[0]
            }
          : p
      )
    );
  };

  const totalPayrollGross = payrollList.reduce((acc, p) => acc + p.grossSalary, 0);
  const totalNetDisbursed = payrollList.reduce((acc, p) => acc + (p.paymentStatus === 'DISBURSED' ? p.netDisbursement : 0), 0);
  const totalTdsCollected = payrollList.reduce((acc, p) => acc + p.tdsDeduction, 0);
  const pendingCount = payrollList.filter((p) => p.paymentStatus === 'PENDING_APPROVAL').length;

  const filtered = payrollList.filter((p) => {
    const matchDept = selectedDept === 'ALL' || p.department.includes(selectedDept);
    const matchSearch =
      p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.designation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <Banknote className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-jakarta">
              Healthcare HRMS Payroll &amp; Compensation Desk
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Doctor retainers, rotational night shift differentials, statutory EPF/ESI/TDS withholdings, and NEFT files
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            Generate Bank NEFT Batch
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold"
            title="Print Payroll Ledger"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Monthly Payroll Outlay</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalPayrollGross)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{payrollList.length} Processed Staff</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 uppercase">Net Disbursed via Bank</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{formatCurrency(totalNetDisbursed)}</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Automated salary credit</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-blue-200/80 shadow-sm">
          <span className="text-xs font-bold text-blue-600 uppercase">Statutory TDS Withheld</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{formatCurrency(totalTdsCollected)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Section 192/194J Challan</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-sm">
          <span className="text-xs font-bold text-amber-600 uppercase">Pending Approvals</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{pendingCount} Personnel</p>
          <p className="text-[11px] text-amber-600 mt-0.5">Roster audit ready</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee, ID, designation..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="ICU">ICU Critical Care</option>
            <option value="Pathology">Pathology &amp; LIS</option>
            <option value="Pharmacy">Central Pharmacy</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Employee &amp; ID</th>
                <th className="px-5 py-3.5">Department &amp; Role</th>
                <th className="px-5 py-3.5">Basic + HRA</th>
                <th className="px-5 py-3.5">Night &amp; On-Call</th>
                <th className="px-5 py-3.5">Deductions (PF/TDS)</th>
                <th className="px-5 py-3.5">Net Take-Home</th>
                <th className="px-5 py-3.5 text-right">Desk Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 text-xs">{p.employeeName}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{p.employeeCode}</div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-xs font-medium text-slate-800">{p.designation}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {p.department}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-xs font-bold text-slate-900">{formatCurrency(p.basicSalary + p.hraAllowance)}</div>
                    <div className="text-[10px] text-slate-400">Basic: {formatCurrency(p.basicSalary)}</div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-xs text-blue-600 font-semibold">
                      +{formatCurrency(p.nightShiftAllowance + p.onCallSpecialDuty)}
                    </div>
                    <div className="text-[10px] text-slate-400">Night: {formatCurrency(p.nightShiftAllowance)}</div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-xs text-rose-600 font-semibold">
                      -{formatCurrency(p.pfDeduction + p.esiDeduction + p.tdsDeduction)}
                    </div>
                    <div className="text-[10px] text-slate-400">PF: {formatCurrency(p.pfDeduction)} · TDS: {formatCurrency(p.tdsDeduction)}</div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-xs font-black text-emerald-600">{formatCurrency(p.netDisbursement)}</div>
                    {p.paymentStatus === 'DISBURSED' ? (
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Disbursed ({p.disbursedDate})
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApprovePayroll(p.id)}
                        className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition animate-pulse"
                        title="Click to approve and disburse"
                      >
                        Approve &amp; Disburse
                      </button>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedPayslip(p)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 ml-auto transition shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Interactive Payslip Viewer */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">MONTHLY SALARY SLIP</span>
                <h3 className="font-black text-slate-900 text-lg font-jakarta">Sindhu Health Tertiary Care</h3>
              </div>
              <button onClick={() => setSelectedPayslip(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Employee Summary Card */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Employee Name</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedPayslip.employeeName}</p>
                  <p className="text-slate-500">{selectedPayslip.designation}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Code &amp; Department</span>
                  <p className="font-mono font-bold text-slate-800">{selectedPayslip.employeeCode}</p>
                  <p className="text-slate-500">{selectedPayslip.department}</p>
                </div>
              </div>

              {/* Earnings & Deductions Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-1.5">
                  <h4 className="font-bold text-emerald-900 text-[11px] uppercase border-b border-emerald-100 pb-1">Earnings (INR)</h4>
                  <div className="flex justify-between"><span>Basic Salary:</span><span className="font-semibold">{formatCurrency(selectedPayslip.basicSalary)}</span></div>
                  <div className="flex justify-between"><span>HRA Allowance:</span><span className="font-semibold">{formatCurrency(selectedPayslip.hraAllowance)}</span></div>
                  <div className="flex justify-between"><span>Night Shift:</span><span className="font-semibold">{formatCurrency(selectedPayslip.nightShiftAllowance)}</span></div>
                  <div className="flex justify-between"><span>On-Call Duty:</span><span className="font-semibold">{formatCurrency(selectedPayslip.onCallSpecialDuty)}</span></div>
                  <div className="pt-1 border-t border-emerald-200 flex justify-between font-bold text-emerald-950">
                    <span>Gross Total:</span><span>{formatCurrency(selectedPayslip.grossSalary)}</span>
                  </div>
                </div>

                <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-1.5">
                  <h4 className="font-bold text-rose-900 text-[11px] uppercase border-b border-rose-100 pb-1">Deductions (INR)</h4>
                  <div className="flex justify-between"><span>Provident Fund (EPF):</span><span className="font-semibold">-{formatCurrency(selectedPayslip.pfDeduction)}</span></div>
                  <div className="flex justify-between"><span>ESI Health:</span><span className="font-semibold">-{formatCurrency(selectedPayslip.esiDeduction)}</span></div>
                  <div className="flex justify-between"><span>Income Tax (TDS):</span><span className="font-semibold">-{formatCurrency(selectedPayslip.tdsDeduction)}</span></div>
                  <div className="pt-1 border-t border-rose-200 flex justify-between font-bold text-rose-950">
                    <span>Total Deductions:</span>
                    <span>-{formatCurrency(selectedPayslip.pfDeduction + selectedPayslip.esiDeduction + selectedPayslip.tdsDeduction)}</span>
                  </div>
                </div>
              </div>

              {/* Net Payout Callout */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Net Take-Home Salary</span>
                  <div className="text-xl font-black text-white">{formatCurrency(selectedPayslip.netDisbursement)}</div>
                </div>
                <div className="text-right text-[11px] text-slate-300">
                  <span>Disbursed to: {selectedPayslip.bankAccountMasked || 'HDFC Bank •••• 4091'}</span>
                  <div className="text-emerald-400 font-bold mt-0.5">Direct Credit Confirmed ✓</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Payslip
              </button>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Bank NEFT Batch Transfer File */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <Download className="w-5 h-5 text-emerald-600" />
                Generate Bank NEFT / RTGS Transfer File
              </h3>
              <button onClick={() => setIsExportModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
                <span className="font-bold text-emerald-900 text-sm">Corporate Batch Summary</span>
                <p className="text-emerald-800">
                  Ready to disburse <strong>{formatCurrency(totalNetDisbursed)}</strong> across {payrollList.length} verified hospital personnel accounts.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-[11px] text-slate-700 space-y-1">
                <div className="text-slate-400 font-sans font-bold uppercase text-[10px]">File Format: CSV / NPCI Standard</div>
                <div>BENEFICIARY_NAME,ACCOUNT_NO,IFSC,AMOUNT,REMARKS</div>
                <div>ARUNACHALAM KUMAR,501004499120,HDFC0000041,268200.00,SAL_OCT2026</div>
                <div>KAVITHA M,301994812004,SBIN0001201,53780.00,SAL_OCT2026</div>
                <div>ANAND C,000401889123,ICIC0000004,42863.00,SAL_OCT2026</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const headers = "Employee Code,Employee Name,Department,Designation,Gross Salary,PF Deduction,ESI Deduction,TDS,Net Disbursement,Payment Status";
                  const rows = payrollList.map(p =>
                    `"${p.employeeCode}","${p.employeeName}","${p.department}","${p.designation}",${p.grossSalary},${p.pfDeduction},${p.esiDeduction},${p.tdsDeduction},${p.netDisbursement},"${p.paymentStatus}"`
                  );
                  const csvData = [headers, ...rows].join("\n");
                  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", `HOSPITAL_NEFT_PAYROLL_${new Date().toISOString().slice(0, 10)}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  setIsExportModalOpen(false);
                  showToast('Bank NEFT Batch Transfer CSV downloaded successfully.');
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download NEFT CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
