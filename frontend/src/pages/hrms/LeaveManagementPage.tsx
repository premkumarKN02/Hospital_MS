import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  User,
  ShieldAlert,
  ShieldCheck,
  Building,
  Printer,
  Share2
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { useAuth } from '../../context/AuthContext';
import { hrmsApi } from '../../lib/api';

interface LeaveApplication {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  leaveType: 'Casual Leave (CL)' | 'Sick Leave (SL)' | 'Earned Leave (EL)' | 'Maternity Leave';
  fromDate: string;
  toDate: string;
  daysCount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedDate: string;
}

export const LeaveManagementPage: React.FC = () => {
  const { user } = useAuth();
  const userRole = (user?.roles?.[0] || 'ROLE_ADMIN').toUpperCase();
  const isAdmin = userRole === 'ROLE_ADMIN' || user?.username === 'admin';
  const isDoctor = userRole === 'ROLE_DOCTOR' || user?.username?.startsWith('dr.');
  const isNurse = userRole === 'ROLE_NURSE' || user?.username?.startsWith('nurse');

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [leaves, setLeaves] = useState<LeaveApplication[]>(() => {
    const saved = localStorage.getItem('hospital_hrms_leaves');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: '1',
        employeeName: 'Priya Darshini',
        employeeId: 'EMP-000008',
        department: 'Quality & NABH',
        leaveType: 'Casual Leave (CL)',
        fromDate: '2026-10-06',
        toDate: '2026-10-07',
        daysCount: 2,
        reason: 'Personal family emergency',
        status: 'APPROVED',
        appliedDate: '2026-10-05'
      },
      {
        id: '2',
        employeeName: 'Anand Krishnan',
        employeeId: 'EMP-000006',
        department: 'Pathology Lab',
        leaveType: 'Sick Leave (SL)',
        fromDate: '2026-10-08',
        toDate: '2026-10-09',
        daysCount: 2,
        reason: 'Fever and viral throat infection',
        status: 'PENDING',
        appliedDate: '2026-10-06'
      },
      {
        id: '3',
        employeeName: 'Kavitha Selvam',
        employeeId: 'EMP-000004',
        department: 'ICU / CCU',
        leaveType: 'Earned Leave (EL)',
        fromDate: '2026-10-15',
        toDate: '2026-10-18',
        daysCount: 4,
        reason: 'Annual family vacation',
        status: 'PENDING',
        appliedDate: '2026-10-04'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('hospital_hrms_leaves', JSON.stringify(leaves));
    } catch (e) {
      console.error(e);
    }
  }, [leaves]);

  useEffect(() => {
    hrmsApi.getLeaves().then((res) => {
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((item: any) => ({
          id: item.id || String(Date.now()),
          employeeName: item.employeeName || 'Staff Member',
          employeeId: item.employeeId || 'EMP-000001',
          department: item.departmentName || 'Clinical Block',
          leaveType: (item.leaveType === 'CASUAL' ? 'Casual Leave (CL)' :
                      item.leaveType === 'SICK' ? 'Sick Leave (SL)' :
                      item.leaveType === 'PRIVILEGE' ? 'Earned Leave (EL)' : 'Maternity Leave') as any,
          fromDate: item.startDate || '2026-10-10',
          toDate: item.endDate || '2026-10-11',
          daysCount: 2,
          reason: item.reason || '',
          status: item.status || 'PENDING',
          appliedDate: item.createdAt ? item.createdAt.split('T')[0] : '2026-10-08'
        }));
        setLeaves(mapped);
      }
    }).catch(console.error);
  }, []);

  const currentStaffName = user?.fullName || (isDoctor ? 'Dr. Arun Kumar' : isNurse ? 'Kavitha Selvam' : 'Dr. Arun Kumar');
  const currentStaffId = isDoctor ? 'EMP-000002' : isNurse ? 'EMP-000004' : 'EMP-000002';
  const currentDept = isDoctor ? 'Cardiology' : isNurse ? 'ICU / CCU' : 'Clinical Block';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicantName, setApplicantName] = useState(currentStaffName);
  const [leaveType, setLeaveType] = useState<LeaveApplication['leaveType']>('Casual Leave (CL)');
  const [fromDate, setFromDate] = useState('2026-10-12');
  const [toDate, setToDate] = useState('2026-10-13');
  const [reason, setReason] = useState('');

  const handleApprove = (id: string) => {
    if (!isAdmin) return;
    hrmsApi.updateLeaveStatus(id, 'APPROVED').catch(console.error);
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'APPROVED' } : l))
    );
  };

  const handleReject = (id: string) => {
    if (!isAdmin) return;
    hrmsApi.updateLeaveStatus(id, 'REJECTED').catch(console.error);
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'REJECTED' } : l))
    );
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    hrmsApi.applyLeave({
      leaveType: leaveType.includes('Casual') ? 'CASUAL' :
                 leaveType.includes('Sick') ? 'SICK' :
                 leaveType.includes('Earned') ? 'PRIVILEGE' : 'MATERNITY',
      startDate: fromDate,
      endDate: toDate,
      reason
    }).catch(console.error);

    const newApp: LeaveApplication = {
      id: Date.now().toString(),
      employeeName: applicantName || currentStaffName,
      employeeId: currentStaffId,
      department: currentDept,
      leaveType,
      fromDate,
      toDate,
      daysCount: 2,
      reason,
      status: 'PENDING',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setLeaves([newApp, ...leaves]);
    setIsModalOpen(false);
    setReason('');
  };

  const pendingLeavesCount = leaves.filter((l) => l.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="card-radial-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {isAdmin ? (
              <span className="px-2.5 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-full text-[11px] font-bold flex items-center gap-1 border border-purple-200 dark:border-purple-800">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                Medical Superintendent Approval Desk
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full text-[11px] font-bold flex items-center gap-1 border border-indigo-200 dark:border-indigo-800">
                <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Staff Personal Leave Portal
              </span>
            )}
            {isAdmin && pendingLeavesCount > 0 && (
              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full text-[10px] font-bold animate-pulse">
                {pendingLeavesCount} Pending Review
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5 font-jakarta">
            <span className="p-2.5 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-2xl border border-purple-100 dark:border-purple-800">
              <Calendar className="w-6 h-6" />
            </span>
            {isAdmin ? 'Staff Leave & Absence Management' : 'My Leave & Absence Portal'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {isAdmin
              ? 'Hospital-wide leave requests, duty coverage review, and superintendent approval authority'
              : 'Personal clinical leave applications, entitlement quotas & approval status tracking'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-2.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-2xl text-xs font-bold flex items-center gap-2 border border-indigo-200 dark:border-indigo-800 transition-colors shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            Share Report
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition"
          >
            <Printer className="w-4 h-4" />
            Print Ledger
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Apply For Leave
          </button>
        </div>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-radial-surface bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1 transition-colors">
          <span className="text-xs text-slate-400 dark:text-slate-400 font-bold uppercase">Casual Leave (CL)</span>
          <p className="text-2xl font-black text-slate-800 dark:text-white">10 / 12 Days</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">2 days consumed this calendar year</p>
        </div>

        <div className="card-radial-surface bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1 transition-colors">
          <span className="text-xs text-slate-400 dark:text-slate-400 font-bold uppercase">Sick Leave (SL)</span>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">7 / 8 Days</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">1 day consumed with medical certificate</p>
        </div>

        <div className="card-radial-surface bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1 transition-colors">
          <span className="text-xs text-slate-400 dark:text-slate-400 font-bold uppercase">Earned Leave (EL)</span>
          <p className="text-2xl font-black text-purple-700 dark:text-purple-400">14 / 15 Days</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">1 day consumed (Annual privilege balance)</p>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card-radial-surface bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            {isAdmin ? `Recent Leave Requests (${leaves.length})` : 'My Submitted Leave Requests'}
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-400">
            {isAdmin ? 'Medical Superintendent Review Desk' : 'Verified by Hospital HRMS'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-4 font-bold">Staff Member & ID</th>
                <th className="py-3 px-4 font-bold">Department</th>
                <th className="py-3 px-4 font-bold">Leave Type</th>
                <th className="py-3 px-4 font-bold">Duration</th>
                <th className="py-3 px-4 font-bold">Reason</th>
                <th className="py-3 px-4 font-bold text-center">Status</th>
                <th className="py-3 px-4 font-bold text-right">
                  {isAdmin ? 'Superintendent Action' : 'Approval Tracking'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaves.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <p className="font-black text-slate-900 dark:text-white text-xs">{l.employeeName}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-400 font-mono">{l.employeeId}</p>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">{l.department}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">{l.leaveType}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {l.fromDate} to {l.toDate}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400">{l.daysCount} Days</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 italic max-w-xs truncate">{l.reason}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        l.status === 'APPROVED'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : l.status === 'REJECTED'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {/* ONLY Admin/Supervisor has the authority to Approve or Reject! */}
                    {isAdmin ? (
                      l.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(l.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-sm transition-all"
                            title="Approve staff leave"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(l.id)}
                            className="px-3 py-1 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-lg font-bold text-[11px] border border-rose-200 dark:border-rose-800 transition-all"
                            title="Reject staff leave"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-400 text-[11px] font-medium">Logged &amp; Finalized</span>
                      )
                    ) : (
                      /* Regular Staff View: Status indicator only, NO APPROVE/REJECT BUTTONS! */
                      l.status === 'PENDING' ? (
                        <div className="flex items-center justify-end">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-amber-500" />
                            Awaiting Supt. Review
                          </span>
                        </div>
                      ) : l.status === 'APPROVED' ? (
                        <div className="flex items-center justify-end">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Approved by Administration
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1.5">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Rejected with Notice
                          </span>
                        </div>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleApplyLeave}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4"
          >
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Submit Leave Application</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Applicant Name</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Leave Type</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as any)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                <option value="Sick Leave (SL)">Sick Leave (SL)</option>
                <option value="Earned Leave (EL)">Earned Leave (EL)</option>
                <option value="Maternity Leave">Maternity Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Justification / Reason</label>
              <textarea
                rows={3}
                required
                placeholder="State the reason for leave..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Submit Application
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Universal Share Modal for Leave Ledger */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Staff Leave Ledger & Absence Requests"
        summaryText={`STAFF LEAVE APPLICATIONS & ABSENCE SUMMARY\nLeave Balances: CL (10/12) | SL (7/8) | EL (14/15)\n\nApplications:\n${leaves.map(l => `• ${l.employeeName} (${l.employeeId}) | ${l.leaveType} | ${l.fromDate} to ${l.toDate} (${l.daysCount} Days) | Status: ${l.status} | Reason: ${l.reason}`).join('\n')}\n\nGenerated from Sarvam Hospital HRMS Management Desk`}
        csvData={leaves.map(l => ({
          EmployeeID: l.employeeId,
          Name: l.employeeName,
          Department: l.department,
          LeaveType: l.leaveType,
          FromDate: l.fromDate,
          ToDate: l.toDate,
          Days: l.daysCount,
          Status: l.status,
          Reason: l.reason,
          AppliedDate: l.appliedDate
        }))}
        csvFilename="Staff_Leave_Ledger.csv"
      />
    </div>
  );
};
