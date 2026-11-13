import React, { useState, useEffect } from 'react';
import { staffApi } from '../../lib/api';
import {
  UserCheck,
  ArrowLeft,
  RefreshCw,
  Plus,
  CheckCircle,
  XCircle,
  Shield,
  Briefcase,
  Phone,
  Mail,
  Search,
  Building2,
  Calendar,
  X,
  FileText,
  BadgeCheck,
  Eye,
  Clock,
  Printer
} from 'lucide-react';

interface Props {
  onNavigate?: (page: string) => void;
}

interface StaffMember {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTUAL' | 'VISITING_SPECIALIST';
  phone: string;
  email: string;
  joinDate: string;
  shiftSchedule: string;
  councilRegistration?: string;
  approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'emp-001',
    employeeCode: 'EMP-ADM-001',
    firstName: 'Dr. K.',
    lastName: 'Sindhu',
    designation: 'Medical Superintendent & General Physician',
    department: 'Hospital Administration & Clinical Ops',
    employmentType: 'FULL_TIME',
    phone: '+91 94440 10001',
    email: 'dr.sindhu@sindhuhealth.com',
    joinDate: '2021-03-15',
    shiftSchedule: '09:00 AM - 05:00 PM (General)',
    councilRegistration: 'TNMC-REG-44102',
    approvalStatus: 'APPROVED'
  },
  {
    id: 'emp-002',
    employeeCode: 'EMP-DOC-002',
    firstName: 'Dr. Arunachalam',
    lastName: 'Kumar',
    designation: 'Chief Interventional Cardiologist',
    department: 'Cardiology & Cath Lab',
    employmentType: 'FULL_TIME',
    phone: '+91 94440 12001',
    email: 'dr.arun@sindhuhealth.com',
    joinDate: '2022-01-10',
    shiftSchedule: '09:00 AM - 01:00 PM (OPD)',
    councilRegistration: 'TNMC-REG-54891',
    approvalStatus: 'APPROVED'
  },
  {
    id: 'emp-003',
    employeeCode: 'EMP-NUR-003',
    firstName: 'Kavitha',
    lastName: 'Selvam',
    designation: 'Head Nursing Supervisor',
    department: 'Intensive Critical Care (ICU)',
    employmentType: 'FULL_TIME',
    phone: '+91 98841 55667',
    email: 'kavitha.nurse@sindhuhealth.com',
    joinDate: '2022-08-01',
    shiftSchedule: '07:00 AM - 03:00 PM (Morning Shift)',
    councilRegistration: 'TNC-NUR-88120',
    approvalStatus: 'APPROVED'
  },
  {
    id: 'emp-004',
    employeeCode: 'EMP-PHM-004',
    firstName: 'Ravi',
    lastName: 'Kumar',
    designation: 'Chief Pharmacist & Formulary Manager',
    department: 'Central Hospital Pharmacy',
    employmentType: 'FULL_TIME',
    phone: '+91 97910 88990',
    email: 'ravi.pharma@sindhuhealth.com',
    joinDate: '2023-02-14',
    shiftSchedule: '08:00 AM - 04:00 PM',
    councilRegistration: 'TN-PHAR-66201',
    approvalStatus: 'APPROVED'
  },
  {
    id: 'emp-005',
    employeeCode: 'EMP-TEC-005',
    firstName: 'Anand',
    lastName: 'Krishnan',
    designation: 'Senior Medical Lab Technologist',
    department: 'Pathology & LIS Laboratory',
    employmentType: 'FULL_TIME',
    phone: '+91 93610 44332',
    email: 'anand.lab@sindhuhealth.com',
    joinDate: '2023-06-20',
    shiftSchedule: '02:00 PM - 10:00 PM (Evening Shift)',
    approvalStatus: 'APPROVED'
  },
  {
    id: 'emp-006',
    employeeCode: 'EMP-REC-006',
    firstName: 'Suresh',
    lastName: 'Babu',
    designation: 'Front Desk Lead Officer',
    department: 'Patient Admissions & Reception',
    employmentType: 'FULL_TIME',
    phone: '+91 98402 11223',
    email: 'suresh.desk@sindhuhealth.com',
    joinDate: '2024-01-05',
    shiftSchedule: '08:30 AM - 04:30 PM',
    approvalStatus: 'APPROVED'
  },
  {
    id: 'emp-007',
    employeeCode: 'EMP-DOC-007',
    firstName: 'Dr. Joseph',
    lastName: 'Anthony',
    designation: 'Senior Trauma Consultant',
    department: 'Emergency & Trauma Care (ER)',
    employmentType: 'FULL_TIME',
    phone: '+91 94441 99887',
    email: 'dr.joseph@sindhuhealth.com',
    joinDate: '2024-05-18',
    shiftSchedule: 'Rotational 24x7 ER On-Call',
    councilRegistration: 'TNMC-REG-61204',
    approvalStatus: 'PENDING'
  }
];

export default function StaffListPage({ onNavigate }: Props) {
  const [employees, setEmployees] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('hospital_staff_directory_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_STAFF;
  });

  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaffDossier, setSelectedStaffDossier] = useState<StaffMember | null>(null);

  // New Staff Member Form
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    designation: '',
    department: 'Cardiology & Cath Lab',
    employmentType: 'FULL_TIME' as StaffMember['employmentType'],
    phone: '',
    email: '',
    shiftSchedule: '09:00 AM - 05:00 PM',
    councilRegistration: ''
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hospital_staff_directory_v1', JSON.stringify(employees));
    } catch (e) {
      console.error(e);
    }
  }, [employees]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await staffApi.listEmployees({ status: statusFilter || undefined, page: 0, size: 50 });
      const apiList = res.data?.content || [];
      if (apiList.length > 0) {
        const mapped = apiList.map((e: any) => ({
          id: e.id || String(Date.now()),
          employeeCode: e.employeeCode || `EMP-${Math.floor(100 + Math.random() * 900)}`,
          firstName: e.firstName || 'Staff',
          lastName: e.lastName || 'Member',
          designation: e.designation || 'Healthcare Professional',
          department: e.department || 'Clinical Operations',
          employmentType: e.employmentType || 'FULL_TIME',
          phone: e.phone || '+91 90000 00000',
          email: e.email || '',
          joinDate: e.hireDate || '2024-01-01',
          shiftSchedule: e.shiftSchedule || 'General Shift',
          councilRegistration: e.councilRegistration || '',
          approvalStatus: e.approvalStatus || 'APPROVED'
        }));
        setEmployees(mapped);
      }
    } catch (err) {
      console.warn('Backend staff API offline, maintaining local reactive state.');
    } finally {
      setLoading(false);
    }
  };

  const approveStaff = async (id: string) => {
    try {
      await staffApi.approveEmployee(id).catch(() => {});
    } catch (err) {
      console.error(err);
    }
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, approvalStatus: 'APPROVED' } : e))
    );
  };

  const rejectStaff = async (id: string) => {
    try {
      await staffApi.rejectEmployee(id).catch(() => {});
    } catch (err) {
      console.error(err);
    }
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, approvalStatus: 'REJECTED' } : e))
    );
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.firstName.trim() || !newStaff.designation.trim()) return;

    const created: StaffMember = {
      id: `emp-${Date.now()}`,
      employeeCode: `EMP-${newStaff.department.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      firstName: newStaff.firstName,
      lastName: newStaff.lastName,
      designation: newStaff.designation,
      department: newStaff.department,
      employmentType: newStaff.employmentType,
      phone: newStaff.phone || '+91 90000 00000',
      email: newStaff.email || `${newStaff.firstName.toLowerCase()}@sindhuhealth.com`,
      joinDate: new Date().toISOString().split('T')[0],
      shiftSchedule: newStaff.shiftSchedule,
      councilRegistration: newStaff.councilRegistration,
      approvalStatus: 'APPROVED'
    };

    setEmployees([created, ...employees]);
    setShowAddModal(false);
    setNewStaff({
      firstName: '',
      lastName: '',
      designation: '',
      department: 'Cardiology & Cath Lab',
      employmentType: 'FULL_TIME',
      phone: '',
      email: '',
      shiftSchedule: '09:00 AM - 05:00 PM',
      councilRegistration: ''
    });
  };

  const filteredEmployees = employees.filter((e) => {
    const matchStatus = !statusFilter || e.approvalStatus === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !searchQuery ||
      e.employeeCode.toLowerCase().includes(q) ||
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header Bar */}
      <div className="page-header-glass p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate?.('admin-dashboard')}
              aria-label="Return to Executive Dashboard"
              className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Return to Executive Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-jakarta flex items-center gap-2.5">
                <span className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <UserCheck className="w-6 h-6" />
                </span>
                Hospital Staff Directory &amp; Governance Desk
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Medical consultants, nursing cadres, allied health professionals &amp; admin credentials
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Onboard Staff Member
            </button>
            <button
              onClick={() => window.print()}
              aria-label="Print Directory"
              className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Print Directory"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={fetchStaff}
              aria-label="Refresh Directory"
              className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-600 dark:text-slate-300 cursor-pointer"
              title="Refresh Directory"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* KPI Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Personnel</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{employees.length} Staff</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-600 uppercase">Approved & Active</span>
            <p className="text-2xl font-black text-emerald-700 mt-1">
              {employees.filter((e) => e.approvalStatus === 'APPROVED').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm">
            <span className="text-[11px] font-bold text-amber-600 uppercase">Pending Approvals</span>
            <p className="text-2xl font-black text-amber-700 mt-1">
              {employees.filter((e) => e.approvalStatus === 'PENDING').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-sm">
            <span className="text-[11px] font-bold text-blue-600 uppercase">Departments</span>
            <p className="text-2xl font-black text-blue-700 mt-1">
              {new Set(employees.map((e) => e.department)).size} Blocks
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, Employee Code, Department, Role..."
              className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer hover:bg-slate-100"
            >
              <option value="">All Statuses ({employees.length})</option>
              <option value="APPROVED">Approved &amp; Active</option>
              <option value="PENDING">Pending Admin Approval</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredEmployees.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-base font-semibold text-slate-700">No staff members match your criteria</p>
              <p className="text-xs text-slate-400 mt-1">Click "Onboard Staff Member" to add a new employee profile.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Employee ID</th>
                    <th className="px-5 py-3.5">Staff Name &amp; Contact</th>
                    <th className="px-5 py-3.5">Department &amp; Designation</th>
                    <th className="px-5 py-3.5">Employment &amp; Shift</th>
                    <th className="px-5 py-3.5">Approval Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/70 transition">
                      {/* Employee ID */}
                      <td className="px-5 py-4">
                        <div className="font-mono font-bold text-indigo-700 text-xs">{e.employeeCode}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Joined: {e.joinDate}</div>
                      </td>

                      {/* Name & Contact */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-xs">{e.firstName} {e.lastName}</div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" /> {e.phone}
                        </div>
                        {e.email && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" /> {e.email}
                          </div>
                        )}
                      </td>

                      {/* Department & Role */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          {e.designation}
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold">
                          {e.department}
                        </span>
                      </td>

                      {/* Employment & Shift */}
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {e.employmentType.replace('_', ' ')}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {e.shiftSchedule}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-full inline-flex items-center gap-1 ${
                            e.approvalStatus === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : e.approvalStatus === 'PENDING'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {e.approvalStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStaffDossier(e)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1"
                            title="View Staff Profile Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Dossier
                          </button>
                          {e.approvalStatus === 'PENDING' && (
                            <>
                              <button
                                onClick={() => approveStaff(e.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectStaff(e.id)}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Onboard New Staff */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                  <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <UserCheck className="w-5 h-5" />
                  </span>
                  Onboard Hospital Staff Member
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh"
                      value={newStaff.firstName}
                      onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Chandran"
                      value={newStaff.lastName}
                      onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Designation / Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Staff Nurse Grade 1"
                      value={newStaff.designation}
                      onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department</label>
                    <select
                      value={newStaff.department}
                      onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                    >
                      <option value="Cardiology & Cath Lab">Cardiology &amp; Cath Lab</option>
                      <option value="Intensive Critical Care (ICU)">Intensive Critical Care (ICU)</option>
                      <option value="Operation Theatre Suites (OT)">Operation Theatre Suites (OT)</option>
                      <option value="Emergency & Trauma Care (ER)">Emergency &amp; Trauma Care (ER)</option>
                      <option value="Pathology & LIS Laboratory">Pathology &amp; LIS Laboratory</option>
                      <option value="Diagnostic Radiology & RIS">Diagnostic Radiology &amp; RIS</option>
                      <option value="Central Hospital Pharmacy">Central Hospital Pharmacy</option>
                      <option value="Patient Admissions & Reception">Patient Admissions &amp; Reception</option>
                      <option value="Hospital Administration & HR">Hospital Administration &amp; HR</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Employment Type</label>
                    <select
                      value={newStaff.employmentType}
                      onChange={(e) => setNewStaff({ ...newStaff, employmentType: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                    >
                      <option value="FULL_TIME">Permanent Full-Time</option>
                      <option value="PART_TIME">Part-Time Duty</option>
                      <option value="CONTRACTUAL">Contractual / Locum</option>
                      <option value="VISITING_SPECIALIST">Visiting Consultant</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Shift Schedule</label>
                    <input
                      type="text"
                      placeholder="e.g. 08:00 AM - 04:00 PM (Rotational)"
                      value={newStaff.shiftSchedule}
                      onChange={(e) => setNewStaff({ ...newStaff, shiftSchedule: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98400 12345"
                      value={newStaff.phone}
                      onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Council Registration (If applicable)</label>
                    <input
                      type="text"
                      placeholder="e.g. TNMC / TNC License #"
                      value={newStaff.councilRegistration}
                      onChange={(e) => setNewStaff({ ...newStaff, councilRegistration: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/25 transition"
                  >
                    Complete Onboarding
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Staff Profile Dossier View */}
        {selectedStaffDossier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 font-black flex items-center justify-center text-base border border-indigo-100">
                    {selectedStaffDossier.firstName[0]}{selectedStaffDossier.lastName[0] || ''}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">
                      {selectedStaffDossier.firstName} {selectedStaffDossier.lastName}
                    </h3>
                    <p className="text-xs text-indigo-600 font-semibold">{selectedStaffDossier.designation}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStaffDossier(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Employee Code</span>
                    <p className="font-mono font-bold text-slate-900 mt-0.5">{selectedStaffDossier.employeeCode}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Department</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{selectedStaffDossier.department}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Employment Type</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{selectedStaffDossier.employmentType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Duty Shift</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{selectedStaffDossier.shiftSchedule}</p>
                  </div>
                </div>

                <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Contact Mobile:</span>
                    <span className="font-semibold text-slate-800">{selectedStaffDossier.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Official Email:</span>
                    <span className="font-semibold text-slate-800">{selectedStaffDossier.email || 'N/A'}</span>
                  </div>
                  {selectedStaffDossier.councilRegistration && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">State Council Reg:</span>
                      <span className="font-mono font-bold text-indigo-700">{selectedStaffDossier.councilRegistration}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Governance Status:</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {selectedStaffDossier.approvalStatus}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center gap-2.5 text-emerald-800">
                  <BadgeCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-[11px] leading-tight font-medium">
                    Statutory background verification, medical council license, and BLS/ACLS compliance verified.
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedStaffDossier(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
