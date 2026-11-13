import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../lib/api';
import {
  Calendar,
  Search,
  ArrowLeft,
  RefreshCw,
  Plus,
  Clock,
  User,
  Stethoscope,
  Phone,
  CheckCircle2,
  XCircle,
  IndianRupee,
  FileText,
  Printer,
  X,
  CreditCard,
  Share2,
  Mail
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';

interface Props {
  onNavigate?: (page: string) => void;
}

interface AppointmentItem {
  id: string;
  appointmentNo: string;
  patientName: string;
  patientUhid: string;
  patientPhone: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: 'OPD_CONSULT' | 'TELECONSULT' | 'REVIEW' | 'PROCEDURE';
  visitReason: string;
  consultationFee: number;
  paid: boolean;
  paymentMode?: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';
}

const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  {
    id: 'apt-001',
    appointmentNo: 'APT-2026-1001',
    patientName: 'K. Ramachandran',
    patientUhid: 'UHID-88201',
    patientPhone: '+91 94441 23456',
    doctorName: 'Dr. Arunachalam Kumar',
    department: 'Interventional Cardiology',
    appointmentDate: '2026-10-10',
    appointmentTime: '09:30 AM',
    appointmentType: 'OPD_CONSULT',
    visitReason: 'Post-angioplasty routine evaluation & ECG review',
    consultationFee: 800,
    paid: true,
    paymentMode: 'UPI',
    status: 'CONFIRMED'
  },
  {
    id: 'apt-002',
    appointmentNo: 'APT-2026-1002',
    patientName: 'S. Meenakshi Ammal',
    patientUhid: 'UHID-88209',
    patientPhone: '+91 98840 98765',
    doctorName: 'Dr. Sindhu Rajagopalan',
    department: 'General Medicine & Diabetology',
    appointmentDate: '2026-10-10',
    appointmentTime: '10:15 AM',
    appointmentType: 'OPD_CONSULT',
    visitReason: 'HbA1c quarterly review & insulin dosage titration',
    consultationFee: 600,
    paid: true,
    paymentMode: 'CASH',
    status: 'CHECKED_IN'
  },
  {
    id: 'apt-003',
    appointmentNo: 'APT-2026-1003',
    patientName: 'M. Selvaraj',
    patientUhid: 'UHID-88215',
    patientPhone: '+91 97910 11223',
    doctorName: 'Dr. P. Sundaram',
    department: 'Joint Replacement & Orthopedics',
    appointmentDate: '2026-10-10',
    appointmentTime: '11:00 AM',
    appointmentType: 'REVIEW',
    visitReason: 'Bilateral knee joint pain & X-ray review',
    consultationFee: 700,
    paid: false,
    status: 'SCHEDULED'
  },
  {
    id: 'apt-004',
    appointmentNo: 'APT-2026-1004',
    patientName: 'Priyadharshini D.',
    patientUhid: 'UHID-88224',
    patientPhone: '+91 93610 55443',
    doctorName: 'Dr. Joseph',
    department: 'Emergency & Critical Care',
    appointmentDate: '2026-10-10',
    appointmentTime: '11:45 AM',
    appointmentType: 'OPD_CONSULT',
    visitReason: 'Acute vertigo & blood pressure fluctuation',
    consultationFee: 600,
    paid: true,
    paymentMode: 'CARD',
    status: 'COMPLETED'
  },
  {
    id: 'apt-005',
    appointmentNo: 'APT-2026-1005',
    patientName: 'G. Venkatesan',
    patientUhid: 'UHID-88232',
    patientPhone: '+91 94443 77889',
    doctorName: 'Dr. Arunachalam Kumar',
    department: 'Interventional Cardiology',
    appointmentDate: '2026-10-11',
    appointmentTime: '09:00 AM',
    appointmentType: 'TELECONSULT',
    visitReason: 'Lipid report follow-up (Video Consult)',
    consultationFee: 500,
    paid: true,
    paymentMode: 'UPI',
    status: 'SCHEDULED'
  }
];

export default function AppointmentListPage({ onNavigate }: Props) {
  const [appointments, setAppointments] = useState<AppointmentItem[]>(() => {
    const saved = localStorage.getItem('hospital_appointments_registry_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_APPOINTMENTS;
  });

  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedAppointmentForShare, setSelectedAppointmentForShare] = useState<AppointmentItem | null>(null);

  // New Appointment Form State
  const [newAppt, setNewAppt] = useState({
    patientName: '',
    patientUhid: '',
    patientPhone: '',
    doctorName: 'Dr. Arunachalam Kumar',
    department: 'Interventional Cardiology',
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '10:00 AM',
    appointmentType: 'OPD_CONSULT' as AppointmentItem['appointmentType'],
    visitReason: '',
    consultationFee: 800,
    paid: true,
    paymentMode: 'UPI'
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hospital_appointments_registry_v1', JSON.stringify(appointments));
    } catch (e) {
      console.error(e);
    }
  }, [appointments]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentApi.list({ page: 0, size: 50 });
      const apiList = res.data?.content || [];
      if (apiList.length > 0) {
        // Map backend appointments
        const mapped = apiList.map((a: any) => ({
          id: a.id || String(Date.now()),
          appointmentNo: a.appointmentNo || `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          patientName: a.patientName || a.patient?.firstName ? `${a.patient?.firstName} ${a.patient?.lastName || ''}` : 'Hospital Patient',
          patientUhid: a.patientUhid || a.patient?.uhid || 'UHID-88200',
          patientPhone: a.patientPhone || a.patient?.phone || '+91 90000 00000',
          doctorName: a.doctorName || a.doctor?.name || 'Dr. Arunachalam Kumar',
          department: a.department || 'Clinical Medicine',
          appointmentDate: a.appointmentDate || '2026-10-10',
          appointmentTime: a.appointmentTime || '10:00 AM',
          appointmentType: (a.appointmentType || 'OPD_CONSULT') as any,
          visitReason: a.visitReason || a.notes || 'General Clinical Review',
          consultationFee: a.consultationFee || 600,
          paid: a.paid ?? true,
          paymentMode: a.paymentMode || 'CASH',
          status: a.status || 'SCHEDULED'
        }));
        setAppointments(mapped);
      }
    } catch (err) {
      console.warn('Backend appointment API offline, maintaining local reactive state.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: AppointmentItem['status']) => {
    try {
      await appointmentApi.updateStatus(id, newStatus).catch(() => {});
    } catch (err) {
      console.error(err);
    }
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const togglePayment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, paid: !a.paid } : a))
    );
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppt.patientName.trim()) return;

    const created: AppointmentItem = {
      id: `apt-${Date.now()}`,
      appointmentNo: `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: newAppt.patientName,
      patientUhid: newAppt.patientUhid || `UHID-${Math.floor(88200 + Math.random() * 900)}`,
      patientPhone: newAppt.patientPhone || '+91 94440 00000',
      doctorName: newAppt.doctorName,
      department: newAppt.department,
      appointmentDate: newAppt.appointmentDate,
      appointmentTime: newAppt.appointmentTime,
      appointmentType: newAppt.appointmentType,
      visitReason: newAppt.visitReason || 'General OPD Consultation',
      consultationFee: Number(newAppt.consultationFee),
      paid: newAppt.paid,
      paymentMode: newAppt.paymentMode,
      status: 'CONFIRMED'
    };

    setAppointments([created, ...appointments]);
    setShowAddModal(false);
    setNewAppt({
      patientName: '',
      patientUhid: '',
      patientPhone: '',
      doctorName: 'Dr. Arunachalam Kumar',
      department: 'Interventional Cardiology',
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '10:00 AM',
      appointmentType: 'OPD_CONSULT',
      visitReason: '',
      consultationFee: 800,
      paid: true,
      paymentMode: 'UPI'
    });
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchStatus = !statusFilter || a.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !searchQuery ||
      a.appointmentNo.toLowerCase().includes(q) ||
      a.patientName.toLowerCase().includes(q) ||
      a.patientUhid.toLowerCase().includes(q) ||
      a.doctorName.toLowerCase().includes(q) ||
      a.visitReason.toLowerCase().includes(q);
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
            className="p-2.5 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-2xs cursor-pointer"
            title="Return to Executive Dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white font-jakarta flex items-center gap-2.5">
              <span className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-200 dark:border-blue-800">
                <Calendar className="w-6 h-6" />
              </span>
              Clinical Appointments Master Desk
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Multi-specialty patient scheduling, consult confirmations, front desk check-in &amp; fee tracking
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Book New Appointment
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            aria-label="Share Schedule via Live Email / WhatsApp / CSV"
            className="p-2.5 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            title="Share Schedule via Live Email / WhatsApp / CSV"
          >
            <Share2 className="w-4 h-4 text-blue-600" />
            Share
          </button>
          <button
            onClick={() => window.print()}
            aria-label="Print Today's Schedule"
            className="p-2.5 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            title="Print Today's Schedule"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={fetchAppointments}
            aria-label="Refresh Schedule"
            className="p-2.5 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-600 dark:text-slate-300 shadow-sm cursor-pointer"
            title="Refresh Schedule"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="stat-card-stylish p-4">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Total Today</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{appointments.length}</p>
        </div>
        <div className="stat-card-stylish p-4">
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">Confirmed</span>
          <p className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1">
            {appointments.filter((a) => a.status === 'CONFIRMED').length}
          </p>
        </div>
        <div className="stat-card-stylish p-4">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase">Checked In</span>
          <p className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">
            {appointments.filter((a) => a.status === 'CHECKED_IN').length}
          </p>
        </div>
        <div className="stat-card-stylish p-4">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Completed</span>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
            {appointments.filter((a) => a.status === 'COMPLETED').length}
          </p>
        </div>
        <div className="stat-card-stylish p-4">
          <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase">Total Fees</span>
          <p className="text-xl font-black text-purple-700 dark:text-purple-300 mt-1">
            ₹{appointments.reduce((sum, a) => sum + (a.paid ? a.consultationFee : 0), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-stylish p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Patient, UHID, Doctor, Appointment #..."
            className="input-stylish !pl-10 pr-3 text-xs"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select-stylish text-xs"
          >
            <option value="">All Statuses ({appointments.length})</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CHECKED_IN">Checked In (At Hospital)</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="table-container-stylish">
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-base font-semibold text-slate-700">No appointments match your search criteria</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting the status filter or click "Book New Appointment".</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Appt No & Time</th>
                    <th className="px-5 py-3.5">Patient Details</th>
                    <th className="px-5 py-3.5">Consultant Doctor</th>
                    <th className="px-5 py-3.5">Type & Reason</th>
                    <th className="px-5 py-3.5">Fee & Payment</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Desk Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map((a) => (
                    <tr key={a.id} className="hover:bg-blue-50/30 transition">
                      {/* Appt No & Time */}
                      <td className="px-5 py-4">
                        <div className="font-mono font-bold text-blue-700 text-xs">{a.appointmentNo}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {a.appointmentDate} · {a.appointmentTime}
                        </div>
                      </td>

                      {/* Patient Details */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-xs">{a.patientName}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{a.patientUhid}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" /> {a.patientPhone}
                        </div>
                      </td>

                      {/* Doctor Details */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                          {a.doctorName}
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold">
                          {a.department}
                        </span>
                      </td>

                      {/* Type & Reason */}
                      <td className="px-5 py-4 max-w-xs">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {a.appointmentType.replace('_', ' ')}
                        </span>
                        <div className="text-xs text-slate-600 mt-1 line-clamp-1">{a.visitReason}</div>
                      </td>

                      {/* Fee & Payment */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-xs">₹{a.consultationFee}</div>
                        <button
                          onClick={() => togglePayment(a.id)}
                          className={`mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full transition flex items-center gap-1 ${
                            a.paid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                          }`}
                          title="Click to toggle payment status"
                        >
                          <CreditCard className="w-2.5 h-2.5" />
                          {a.paid ? `Paid (${a.paymentMode || 'Desk'})` : 'Payment Pending'}
                        </button>
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-full inline-flex items-center gap-1 ${
                            a.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : a.status === 'CONFIRMED'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : a.status === 'CHECKED_IN'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                              : a.status === 'CANCELLED'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>

                      {/* Quick Desk Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          <button
                            onClick={() => setSelectedAppointmentForShare(a)}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Share / Email Appointment Slip via Live SMTP & WhatsApp"
                          >
                            <Mail className="w-3 h-3" />
                            Email Slip
                          </button>
                          {a.status === 'SCHEDULED' && (
                            <button
                              onClick={() => updateStatus(a.id, 'CONFIRMED')}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                            >
                              Confirm
                            </button>
                          )}
                          {a.status === 'CONFIRMED' && (
                            <button
                              onClick={() => updateStatus(a.id, 'CHECKED_IN')}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                            >
                              Check In
                            </button>
                          )}
                          {a.status === 'CHECKED_IN' && (
                            <button
                              onClick={() => updateStatus(a.id, 'COMPLETED')}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            >
                              Mark Done
                            </button>
                          )}
                          {a.status !== 'CANCELLED' && a.status !== 'COMPLETED' && (
                            <button
                              onClick={() => updateStatus(a.id, 'CANCELLED')}
                              className="px-2 py-1 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-50"
                            >
                              Cancel
                            </button>
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

        {/* Modal: Book New Appointment */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                  <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Calendar className="w-5 h-5" />
                  </span>
                  Book Patient Appointment
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Krishnan"
                      value={newAppt.patientName}
                      onChange={(e) => setNewAppt({ ...newAppt, patientName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">UHID / Patient ID</label>
                    <input
                      type="text"
                      placeholder="Auto-generated if empty"
                      value={newAppt.patientUhid}
                      onChange={(e) => setNewAppt({ ...newAppt, patientUhid: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98400 12345"
                      value={newAppt.patientPhone}
                      onChange={(e) => setNewAppt({ ...newAppt, patientPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Consultation Mode</label>
                    <select
                      value={newAppt.appointmentType}
                      onChange={(e) => setNewAppt({ ...newAppt, appointmentType: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                    >
                      <option value="OPD_CONSULT">OPD In-Person Visit</option>
                      <option value="TELECONSULT">Video Teleconsultation</option>
                      <option value="REVIEW">Post-Procedure Review</option>
                      <option value="PROCEDURE">Daycare Minor Procedure</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Consultant Doctor</label>
                  <select
                    value={newAppt.doctorName}
                    onChange={(e) => {
                      const doc = e.target.value;
                      let dept = 'Clinical Medicine';
                      let fee = 600;
                      if (doc.includes('Arunachalam')) {
                        dept = 'Interventional Cardiology';
                        fee = 800;
                      } else if (doc.includes('Sundaram')) {
                        dept = 'Joint Replacement & Orthopedics';
                        fee = 700;
                      } else if (doc.includes('Sindhu')) {
                        dept = 'General Medicine & Diabetology';
                        fee = 600;
                      } else if (doc.includes('Joseph')) {
                        dept = 'Emergency & Critical Care';
                        fee = 600;
                      }
                      setNewAppt({ ...newAppt, doctorName: doc, department: dept, consultationFee: fee });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                  >
                    <option value="Dr. Arunachalam Kumar">Dr. Arunachalam Kumar — Interventional Cardiology (₹800)</option>
                    <option value="Dr. Sindhu Rajagopalan">Dr. Sindhu Rajagopalan — General Medicine & Diabetology (₹600)</option>
                    <option value="Dr. P. Sundaram">Dr. P. Sundaram — Joint Replacement & Orthopedics (₹700)</option>
                    <option value="Dr. Joseph">Dr. Joseph — Emergency & Critical Care (₹600)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Appointment Date</label>
                    <input
                      type="date"
                      required
                      value={newAppt.appointmentDate}
                      onChange={(e) => setNewAppt({ ...newAppt, appointmentDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                    <select
                      value={newAppt.appointmentTime}
                      onChange={(e) => setNewAppt({ ...newAppt, appointmentTime: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                    >
                      <option value="09:00 AM">09:00 AM - 09:30 AM</option>
                      <option value="09:30 AM">09:30 AM - 10:00 AM</option>
                      <option value="10:00 AM">10:00 AM - 10:30 AM</option>
                      <option value="10:30 AM">10:30 AM - 11:00 AM</option>
                      <option value="11:00 AM">11:00 AM - 11:30 AM</option>
                      <option value="11:30 AM">11:30 AM - 12:00 PM</option>
                      <option value="04:00 PM">04:00 PM - 04:30 PM</option>
                      <option value="05:00 PM">05:00 PM - 05:30 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chief Reason for Consultation</label>
                  <input
                    type="text"
                    placeholder="e.g. Chest pain follow-up, breathlessness, routine wellness"
                    value={newAppt.visitReason}
                    onChange={(e) => setNewAppt({ ...newAppt, visitReason: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Consultation Fee (INR)</label>
                    <input
                      type="number"
                      value={newAppt.consultationFee}
                      onChange={(e) => setNewAppt({ ...newAppt, consultationFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fee Payment Status</label>
                    <select
                      value={newAppt.paid ? newAppt.paymentMode : 'PENDING'}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'PENDING') {
                          setNewAppt({ ...newAppt, paid: false, paymentMode: '' });
                        } else {
                          setNewAppt({ ...newAppt, paid: true, paymentMode: val });
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                    >
                      <option value="UPI">Paid via UPI / QR</option>
                      <option value="CASH">Paid via Cash Counter</option>
                      <option value="CARD">Paid via POS Card</option>
                      <option value="PENDING">Pay at Front Desk</option>
                    </select>
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
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/25 transition"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Universal Share Modal for Complete Appointment Schedule */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          title="Clinical Appointments Daily Master Schedule"
          summaryText={`CLINICAL APPOINTMENTS DAILY MASTER SCHEDULE\nDate: ${new Date().toLocaleDateString()}\nTotal Appointments: ${appointments.length}\nConfirmed: ${appointments.filter(a => a.status === 'CONFIRMED').length} | Checked-in: ${appointments.filter(a => a.status === 'CHECKED_IN').length}\n\nKey Appointments:\n${appointments.slice(0, 8).map(a => `• ${a.appointmentNo} | ${a.patientName} (${a.patientUhid}) | Dr. ${a.doctorName} (${a.department}) | ${a.appointmentTime} | Status: ${a.status}`).join('\n')}\n\nGenerated from Sindhu Healthcare Network Desk`}
          csvData={appointments.map(a => ({
            AppointmentNo: a.appointmentNo,
            PatientName: a.patientName,
            UHID: a.patientUhid,
            Phone: a.patientPhone,
            Doctor: a.doctorName,
            Department: a.department,
            Date: a.appointmentDate,
            Time: a.appointmentTime,
            Type: a.appointmentType,
            Fee: a.consultationFee,
            Status: a.status
          }))}
        />

        {/* Individual Appointment Slip Share Modal */}
        {selectedAppointmentForShare && (
          <ShareModal
            isOpen={!!selectedAppointmentForShare}
            onClose={() => setSelectedAppointmentForShare(null)}
            title={`Appointment Confirmation Slip - ${selectedAppointmentForShare.appointmentNo}`}
            summaryText={`SINDHU HEALTHCARE NETWORK - APPOINTMENT CONFIRMATION SLIP\n\nAppointment Token: ${selectedAppointmentForShare.appointmentNo}\nPatient: ${selectedAppointmentForShare.patientName} (${selectedAppointmentForShare.patientUhid})\nContact: ${selectedAppointmentForShare.patientPhone}\n\nConsultant: ${selectedAppointmentForShare.doctorName}\nDepartment: ${selectedAppointmentForShare.department}\nSchedule: ${selectedAppointmentForShare.appointmentDate} at ${selectedAppointmentForShare.appointmentTime}\nType: ${selectedAppointmentForShare.appointmentType}\nReason: ${selectedAppointmentForShare.visitReason}\n\nConsultation Fee: ₹${selectedAppointmentForShare.consultationFee} (${selectedAppointmentForShare.paid ? 'PAID - ' + (selectedAppointmentForShare.paymentMode || 'Desk') : 'PAY AT COUNTER'})\nStatus: ${selectedAppointmentForShare.status}\n\nPlease arrive 15 minutes before scheduled slot with your UHID and KYC identification.`}
            defaultRecipientEmail=""
            csvData={[{
              AppointmentNo: selectedAppointmentForShare.appointmentNo,
              PatientName: selectedAppointmentForShare.patientName,
              UHID: selectedAppointmentForShare.patientUhid,
              Phone: selectedAppointmentForShare.patientPhone,
              Doctor: selectedAppointmentForShare.doctorName,
              Department: selectedAppointmentForShare.department,
              Date: selectedAppointmentForShare.appointmentDate,
              Time: selectedAppointmentForShare.appointmentTime,
              Fee: selectedAppointmentForShare.consultationFee,
              Status: selectedAppointmentForShare.status
            }]}
          />
        )}
      </div>
  );
}
