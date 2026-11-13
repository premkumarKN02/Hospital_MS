import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  UserCheck,
  Building2,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  Sunrise,
  Sun,
  Moon,
  Printer,
  Share2,
  Plus,
  X,
  User
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';

interface StaffRoster {
  id: string;
  employeeId: string;
  name: string;
  role: 'DOCTOR' | 'NURSE' | 'TECHNICIAN' | 'ADMIN';
  department: string;
  shift: 'MORNING' | 'EVENING' | 'NIGHT' | 'GENERAL';
  shiftTiming: string;
  attendanceStatus: 'CLOCKED_IN' | 'NOT_STARTED' | 'ON_LEAVE' | 'CLOCKED_OUT';
  clockInTime?: string;
  clockOutTime?: string;
}

const INITIAL_ROSTER: StaffRoster[] = [
  {
    id: '1',
    employeeId: 'EMP-000002',
    name: 'Dr. Arunachalam Kumar',
    role: 'DOCTOR',
    department: 'Cardiology',
    shift: 'MORNING',
    shiftTiming: '08:00 AM - 02:00 PM',
    attendanceStatus: 'CLOCKED_IN',
    clockInTime: '07:55 AM'
  },
  {
    id: '2',
    employeeId: 'EMP-000003',
    name: 'Dr. Sindhu Rajagopalan',
    role: 'DOCTOR',
    department: 'General Medicine',
    shift: 'GENERAL',
    shiftTiming: '09:00 AM - 05:00 PM',
    attendanceStatus: 'CLOCKED_IN',
    clockInTime: '08:50 AM'
  },
  {
    id: '3',
    employeeId: 'EMP-000004',
    name: 'Kavitha Selvam (ICU Lead)',
    role: 'NURSE',
    department: 'ICU / CCU',
    shift: 'MORNING',
    shiftTiming: '07:00 AM - 03:00 PM',
    attendanceStatus: 'CLOCKED_IN',
    clockInTime: '06:45 AM'
  },
  {
    id: '4',
    employeeId: 'EMP-000005',
    name: 'Suresh Babu',
    role: 'ADMIN',
    department: 'Front Desk / Reception',
    shift: 'GENERAL',
    shiftTiming: '08:30 AM - 04:30 PM',
    attendanceStatus: 'CLOCKED_IN',
    clockInTime: '08:25 AM'
  },
  {
    id: '5',
    employeeId: 'EMP-000006',
    name: 'Anand Krishnan',
    role: 'TECHNICIAN',
    department: 'Pathology Lab',
    shift: 'EVENING',
    shiftTiming: '02:00 PM - 10:00 PM',
    attendanceStatus: 'NOT_STARTED'
  },
  {
    id: '6',
    employeeId: 'EMP-000007',
    name: 'Ravi Shankar',
    role: 'ADMIN',
    department: 'Pharmacy',
    shift: 'GENERAL',
    shiftTiming: '09:00 AM - 05:00 PM',
    attendanceStatus: 'CLOCKED_IN',
    clockInTime: '08:58 AM'
  },
  {
    id: '7',
    employeeId: 'EMP-000008',
    name: 'Priya Darshini (Quality Lead)',
    role: 'ADMIN',
    department: 'Quality & NABH',
    shift: 'GENERAL',
    shiftTiming: '09:00 AM - 05:00 PM',
    attendanceStatus: 'ON_LEAVE'
  },
  {
    id: '8',
    employeeId: 'EMP-000009',
    name: 'Sister Mary (OT Lead)',
    role: 'NURSE',
    department: 'Operation Theatre',
    shift: 'NIGHT',
    shiftTiming: '08:00 PM - 08:00 AM',
    attendanceStatus: 'NOT_STARTED'
  }
];

export const HrmsRosterPage: React.FC = () => {
  const [roster, setRoster] = useState<StaffRoster[]>(() => {
    const saved = localStorage.getItem('hospital_staff_roster_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ROSTER;
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<string>('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewDutyModalOpen, setIsNewDutyModalOpen] = useState(false);

  // New Duty Assignment Form
  const [newDuty, setNewDuty] = useState({
    name: '',
    employeeId: `EMP-${Math.floor(100000 + Math.random() * 900000)}`,
    role: 'NURSE' as StaffRoster['role'],
    department: 'ICU / CCU',
    shift: 'MORNING' as StaffRoster['shift'],
    shiftTiming: '07:00 AM - 03:00 PM'
  });

  useEffect(() => {
    try {
      localStorage.setItem('hospital_staff_roster_v1', JSON.stringify(roster));
    } catch (e) {
      console.error(e);
    }
  }, [roster]);

  const handleToggleClock = (staffId: string) => {
    setRoster((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          if (s.attendanceStatus === 'CLOCKED_IN') {
            return {
              ...s,
              attendanceStatus: 'CLOCKED_OUT',
              clockOutTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          } else if (s.attendanceStatus === 'NOT_STARTED' || s.attendanceStatus === 'CLOCKED_OUT') {
            return {
              ...s,
              attendanceStatus: 'CLOCKED_IN',
              clockInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          }
        }
        return s;
      })
    );
  };

  const handleCreateDuty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDuty.name.trim()) return;

    let timing = '09:00 AM - 05:00 PM';
    if (newDuty.shift === 'MORNING') timing = '07:00 AM - 03:00 PM';
    else if (newDuty.shift === 'EVENING') timing = '02:00 PM - 10:00 PM';
    else if (newDuty.shift === 'NIGHT') timing = '09:00 PM - 07:00 AM';

    const created: StaffRoster = {
      id: `roster-${Date.now()}`,
      employeeId: newDuty.employeeId,
      name: newDuty.name,
      role: newDuty.role,
      department: newDuty.department,
      shift: newDuty.shift,
      shiftTiming: timing,
      attendanceStatus: 'NOT_STARTED'
    };

    setRoster([created, ...roster]);
    setIsNewDutyModalOpen(false);
    setNewDuty({
      name: '',
      employeeId: `EMP-${Math.floor(100000 + Math.random() * 900000)}`,
      role: 'NURSE',
      department: 'ICU / CCU',
      shift: 'MORNING',
      shiftTiming: '07:00 AM - 03:00 PM'
    });
  };

  const filteredRoster = roster.filter((r) => {
    const matchShift = selectedShiftFilter === 'ALL' || r.shift === selectedShiftFilter;
    const matchRole = selectedRoleFilter === 'ALL' || r.role === selectedRoleFilter;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !searchQuery ||
      r.name.toLowerCase().includes(q) ||
      r.employeeId.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q);
    return matchShift && matchRole && matchQuery;
  });

  const onDutyCount = roster.filter((r) => r.attendanceStatus === 'CLOCKED_IN').length;
  const onLeaveCount = roster.filter((r) => r.attendanceStatus === 'ON_LEAVE').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 font-jakarta">
            <span className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
              <CalendarDays className="w-6 h-6" />
            </span>
            Staff Duty Roster &amp; Biometric Attendance Desk
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time doctor and nursing shift allocations, live punch-in logging, and ward roster tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsNewDutyModalOpen(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Allocate Shift
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold border border-slate-200 flex items-center gap-1.5"
            title="Print Shift Roster"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Roster</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{roster.length} Personnel</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-sm">
          <span className="text-xs text-emerald-600 font-bold uppercase">Currently On Duty</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{onDutyCount} Active</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-sm">
          <span className="text-xs text-amber-600 font-bold uppercase">Upcoming Shifts</span>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {roster.filter((r) => r.attendanceStatus === 'NOT_STARTED').length} Waiting
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-200/80 shadow-sm">
          <span className="text-xs text-rose-600 font-bold uppercase">On Approved Leave</span>
          <p className="text-2xl font-black text-rose-700 mt-1">{onLeaveCount} Staff</p>
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
            placeholder="Search employee name, ID, department..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-rose-500 focus:bg-white"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedShiftFilter}
            onChange={(e) => setSelectedShiftFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Shifts</option>
            <option value="MORNING">Morning Shift (07:00 - 15:00)</option>
            <option value="EVENING">Evening Shift (14:00 - 22:00)</option>
            <option value="NIGHT">Night Shift (21:00 - 07:00)</option>
            <option value="GENERAL">General Shift (09:00 - 17:00)</option>
          </select>

          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Cadres</option>
            <option value="DOCTOR">Consultant Doctors</option>
            <option value="NURSE">Nursing Officers</option>
            <option value="TECHNICIAN">Diagnostic Technicians</option>
            <option value="ADMIN">Administrative Officers</option>
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Employee Name &amp; ID</th>
                <th className="px-5 py-3.5">Cadre &amp; Department</th>
                <th className="px-5 py-3.5">Shift Window</th>
                <th className="px-5 py-3.5">Attendance Status</th>
                <th className="px-5 py-3.5">Punch Logged</th>
                <th className="px-5 py-3.5 text-right">Biometric Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoster.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                    <div className="font-mono text-[11px] text-slate-400 mt-0.5">{item.employeeId}</div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.role === 'DOCTOR'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : item.role === 'NURSE'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.role}
                    </span>
                    <div className="text-xs font-medium text-slate-700 mt-1">{item.department}</div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                      {item.shift === 'MORNING' && <Sunrise className="w-3.5 h-3.5 text-amber-500" />}
                      {item.shift === 'EVENING' && <Sun className="w-3.5 h-3.5 text-orange-500" />}
                      {item.shift === 'NIGHT' && <Moon className="w-3.5 h-3.5 text-indigo-500" />}
                      {item.shift === 'GENERAL' && <Clock className="w-3.5 h-3.5 text-emerald-500" />}
                      {item.shift}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.shiftTiming}</div>
                  </td>

                  <td className="px-5 py-4">
                    {item.attendanceStatus === 'CLOCKED_IN' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> On Duty (Active)
                      </span>
                    ) : item.attendanceStatus === 'CLOCKED_OUT' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 w-max">
                        Shift Completed
                      </span>
                    ) : item.attendanceStatus === 'ON_LEAVE' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 w-max">
                        On Leave
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 w-max">
                        Upcoming Shift
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    {item.clockInTime ? (
                      <div className="text-xs font-mono font-semibold text-slate-800">
                        In: {item.clockInTime} {item.clockOutTime ? `· Out: ${item.clockOutTime}` : ''}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No punch yet</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right">
                    {item.attendanceStatus !== 'ON_LEAVE' && (
                      <button
                        onClick={() => handleToggleClock(item.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                          item.attendanceStatus === 'CLOCKED_IN'
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {item.attendanceStatus === 'CLOCKED_IN' ? 'Clock Out' : 'Clock In'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Allocate Shift */}
      {isNewDutyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <span className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <CalendarDays className="w-5 h-5" />
                </span>
                Assign Staff Duty Shift
              </h3>
              <button onClick={() => setIsNewDutyModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDuty} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Staff Member Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sister Deepa"
                  value={newDuty.name}
                  onChange={(e) => setNewDuty({ ...newDuty, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cadre Role</label>
                  <select
                    value={newDuty.role}
                    onChange={(e) => setNewDuty({ ...newDuty, role: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                  >
                    <option value="DOCTOR">Consultant Doctor</option>
                    <option value="NURSE">Nursing Officer</option>
                    <option value="TECHNICIAN">Technician</option>
                    <option value="ADMIN">Administrative Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duty Shift</label>
                  <select
                    value={newDuty.shift}
                    onChange={(e) => setNewDuty({ ...newDuty, shift: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                  >
                    <option value="MORNING">Morning (07:00 - 15:00)</option>
                    <option value="EVENING">Evening (14:00 - 22:00)</option>
                    <option value="NIGHT">Night (21:00 - 07:00)</option>
                    <option value="GENERAL">General (09:00 - 17:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department / Ward Unit</label>
                <select
                  value={newDuty.department}
                  onChange={(e) => setNewDuty({ ...newDuty, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                >
                  <option value="ICU / CCU">ICU / CCU</option>
                  <option value="Operation Theatre">Operation Theatre</option>
                  <option value="Emergency Care (ER)">Emergency Care (ER)</option>
                  <option value="General Ward">General Ward</option>
                  <option value="Pathology Lab">Pathology Lab</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Front Desk">Front Desk</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewDutyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md shadow-rose-600/25 transition"
                >
                  Assign Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
