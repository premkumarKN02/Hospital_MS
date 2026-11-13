import React, { useState, useEffect } from 'react';
import {
  Scissors,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
  Plus,
  Search,
  CheckCircle2,
  Activity,
  Bed,
  FileText,
  Printer,
  Share2,
  X
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { enterpriseStore } from '../../services/enterpriseDataStore';

interface SurgeryCase {
  id: string;
  patientName: string;
  mrn: string;
  procedureName: string;
  theatreName: string; // OT 1, OT 2, etc.
  leadSurgeon: string;
  anesthetist: string;
  scrubNurse: string;
  scheduledTime: string;
  estimatedDuration: string;
  status: 'SCHEDULED' | 'PRE_OP_PACU' | 'INTRA_OP' | 'POST_OP_RECOVERY' | 'COMPLETED';
  whoChecklist: {
    signIn: boolean;
    timeOut: boolean;
    signOut: boolean;
  };
  implantUsed?: string;
  bloodUnitsReserved: string;
}

export const OtSurgerySuitePage: React.FC = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewSurgeryModalOpen, setIsNewSurgeryModalOpen] = useState(false);

  const [surgeries, setSurgeries] = useState<SurgeryCase[]>(() => {
    const saved = localStorage.getItem('hospital_ot_surgeries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
    {
      id: 'OT-2026-081',
      patientName: 'Karthik Narayanan',
      mrn: 'UHID-88214',
      procedureName: 'Laparoscopic Cholecystectomy',
      theatreName: 'OT 1 (General & GI Suite)',
      leadSurgeon: 'Dr. R. Arun (Surgical Gastroenterologist)',
      anesthetist: 'Dr. M. Sridhar (Senior Anesthesiologist)',
      scrubNurse: 'Sister Deepa (OT Team Lead)',
      scheduledTime: '08:30 AM - 10:30 AM',
      estimatedDuration: '2 Hours',
      status: 'INTRA_OP',
      whoChecklist: { signIn: true, timeOut: true, signOut: false },
      implantUsed: 'Titanium Hem-o-lok Clips (Batch HM-902)',
      bloodUnitsReserved: '1 Unit PRBC B+ve'
    },
    {
      id: 'OT-2026-082',
      patientName: 'Saraswathi Ammal',
      mrn: 'UHID-88220',
      procedureName: 'Total Knee Arthroplasty (TKR - Left)',
      theatreName: 'OT 2 (Orthopedic & Joint Suite)',
      leadSurgeon: 'Dr. P. Sundaram (Joint Replacement Specialist)',
      anesthetist: 'Dr. V. Kavitha',
      scrubNurse: 'Sister Selvi',
      scheduledTime: '11:00 AM - 01:30 PM',
      estimatedDuration: '2.5 Hours',
      status: 'PRE_OP_PACU',
      whoChecklist: { signIn: true, timeOut: false, signOut: false },
      implantUsed: 'Zimmer NexGen Trabecular Metal Knee System',
      bloodUnitsReserved: '2 Units PRBC O+ve'
    },
    {
      id: 'OT-2026-083',
      patientName: 'Mohammed Tariq',
      mrn: 'UHID-88235',
      procedureName: 'Coronary Artery Bypass Graft (CABG x3)',
      theatreName: 'OT 3 (Cardiac Surgery Suite)',
      leadSurgeon: 'Dr. A. Joseph (Chief CTVS Surgeon)',
      anesthetist: 'Dr. K. Sindhu (Cardiac Anesthesia)',
      scrubNurse: 'Nurse John Paul',
      scheduledTime: '07:00 AM - 12:30 PM',
      estimatedDuration: '5.5 Hours',
      status: 'INTRA_OP',
      whoChecklist: { signIn: true, timeOut: true, signOut: false },
      implantUsed: 'Medtronic Mosaic Bioprosthesis & Cannulae',
      bloodUnitsReserved: '4 Units PRBC, 2 FFP'
    },
    {
      id: 'OT-2026-084',
      patientName: 'Deepak Varma',
      mrn: 'UHID-88241',
      procedureName: 'Cataract Phacoemulsification + Toric IOL',
      theatreName: 'Minor OT (Daycare Surgery)',
      leadSurgeon: 'Dr. N. Gayathri (Ophthalmologist)',
      anesthetist: 'Topical / Local Block',
      scrubNurse: 'Sister Revathi',
      scheduledTime: '02:00 PM - 02:45 PM',
      estimatedDuration: '45 Mins',
      status: 'SCHEDULED',
      whoChecklist: { signIn: false, timeOut: false, signOut: false },
      implantUsed: 'Alcon AcrySof IQ Toric IOL (+21.5D)',
      bloodUnitsReserved: 'Nil'
    }
  ];
  });

  const [newSurgery, setNewSurgery] = useState({
    patientName: '',
    mrn: '',
    procedureName: '',
    theatreName: 'OT 1 (General & GI Suite)',
    leadSurgeon: '',
    anesthetist: '',
    scrubNurse: '',
    scheduledTime: '10:00 AM - 12:00 PM',
    estimatedDuration: '2 Hours',
    implantUsed: '',
    bloodUnitsReserved: '1 Unit PRBC'
  });

  // Persist surgeries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hospital_ot_surgeries', JSON.stringify(surgeries));
    } catch (e) {
      console.error(e);
    }
  }, [surgeries]);

  const handleAddSurgery = (e: React.FormEvent) => {
    e.preventDefault();
    const created: SurgeryCase = {
      id: `OT-2026-0${surgeries.length + 85}`,
      patientName: newSurgery.patientName,
      mrn: newSurgery.mrn || `UHID-${Math.floor(88000 + Math.random() * 1000)}`,
      procedureName: newSurgery.procedureName,
      theatreName: newSurgery.theatreName,
      leadSurgeon: newSurgery.leadSurgeon || 'Consultant Surgeon on Call',
      anesthetist: newSurgery.anesthetist || 'Duty Anesthesiologist',
      scrubNurse: newSurgery.scrubNurse || 'Duty OT Nurse',
      scheduledTime: newSurgery.scheduledTime,
      estimatedDuration: newSurgery.estimatedDuration,
      status: 'SCHEDULED',
      whoChecklist: { signIn: false, timeOut: false, signOut: false },
      implantUsed: newSurgery.implantUsed || 'Standard Surgical Consumables',
      bloodUnitsReserved: newSurgery.bloodUnitsReserved
    };

    enterpriseStore.bookSurgery({
      theater: created.theatreName,
      patientName: created.patientName,
      uhid: created.mrn,
      procedure: created.procedureName,
      specialty: 'General / Specialist Surgery',
      leadSurgeon: created.leadSurgeon,
      anesthesiologist: created.anesthetist,
      startTime: created.scheduledTime,
      duration: created.estimatedDuration,
      status: 'SCHEDULED',
      urgency: 'ELECTIVE',
      whoChecklist: { signIn: false, timeOut: false, signOut: false },
      branchId: 'branch-chennai-greams'
    });

    setSurgeries([created, ...surgeries]);
    setIsNewSurgeryModalOpen(false);
  };

  const handleToggleChecklist = (id: string, step: 'signIn' | 'timeOut' | 'signOut') => {
    setSurgeries(prev => prev.map(s => {
      if (s.id === id) {
        const updatedChecklist = { ...s.whoChecklist, [step]: !s.whoChecklist[step] };
        let newStatus = s.status;
        if (updatedChecklist.signOut) newStatus = 'POST_OP_RECOVERY';
        else if (updatedChecklist.timeOut) newStatus = 'INTRA_OP';
        else if (updatedChecklist.signIn) newStatus = 'PRE_OP_PACU';

        enterpriseStore.updateSurgeryStatus(id, newStatus as any);
        return { ...s, whoChecklist: updatedChecklist, status: newStatus };
      }
      return s;
    }));
  };

  const handleAdvanceStatus = (id: string) => {
    setSurgeries(prev => prev.map(s => {
      if (s.id === id) {
        let nextStatus: SurgeryCase['status'] = 'COMPLETED';
        if (s.status === 'SCHEDULED') nextStatus = 'PRE_OP_PACU';
        else if (s.status === 'PRE_OP_PACU') nextStatus = 'INTRA_OP';
        else if (s.status === 'INTRA_OP') nextStatus = 'POST_OP_RECOVERY';
        else if (s.status === 'POST_OP_RECOVERY') nextStatus = 'COMPLETED';
        else nextStatus = 'COMPLETED';

        enterpriseStore.updateSurgeryStatus(id, nextStatus as any);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const filtered = surgeries.filter(s => {
    const matchTheatre = selectedTheatre === 'ALL' || s.theatreName.includes(selectedTheatre);
    const matchSearch = s.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.procedureName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.leadSurgeon.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mrn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTheatre && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="card-stylish p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-xl border border-blue-200 dark:border-blue-800">
            <Scissors className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Operation Theatre (OT) &amp; Surgical Suite Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              Live surgical table scheduling, WHO surgical safety checklists, PACU post-op recovery, and implant tracking
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNewSurgeryModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Schedule Surgery
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            title="Share Schedule"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            title="Print Roster"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-slate-500 uppercase">Today's Total Cases</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{surgeries.length} Surgeries</p>
          <p className="text-[11px] text-emerald-600 mt-1">4 Active OT Tables</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Intra-Op Underway</span>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
            {surgeries.filter(s => s.status === 'INTRA_OP').length} Cases
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Anaesthesia active</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase">PACU Recovery Beds</span>
          <p className="text-2xl font-bold text-sky-700 dark:text-sky-300 mt-1">2 Occupied</p>
          <p className="text-[11px] text-slate-500 mt-1">Vitals stable</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">WHO Checklist Compliance</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">100%</p>
          <p className="text-[11px] text-slate-500 mt-1">NABH Mandatory Zero-Error</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-stylish p-4 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, procedure, surgeon, MRN..."
            className="input-stylish !pl-10 pr-3"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedTheatre}
            onChange={(e) => setSelectedTheatre(e.target.value)}
            className="select-stylish text-xs"
          >
            <option value="ALL">All Operation Theatres</option>
            <option value="OT 1">OT 1 (General & GI)</option>
            <option value="OT 2">OT 2 (Orthopedics)</option>
            <option value="OT 3">OT 3 (Cardiac Surgery)</option>
            <option value="Minor OT">Minor OT (Daycare)</option>
          </select>
        </div>
      </div>

      {/* Main Surgery Table */}
      <div className="table-container-stylish">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 py-3">Case ID & Time</th>
                <th className="px-4 py-3">Patient & MRN</th>
                <th className="px-4 py-3">Surgical Procedure & Implants</th>
                <th className="px-4 py-3">Theatre & Team</th>
                <th className="px-4 py-3">WHO Safety Checklist</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Blood Reserve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 dark:text-white font-mono text-xs">{s.id}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {s.scheduledTime}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{s.patientName}</div>
                    <div className="text-xs text-slate-500 font-mono">{s.mrn}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{s.procedureName}</div>
                    {s.implantUsed && (
                      <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5 font-medium">
                        Implants: {s.implantUsed}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span className="badge-slate text-[11px]">{s.theatreName}</span>
                    <div className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
                      Surgeon: {s.leadSurgeon.split('(')[0]}
                    </div>
                    <div className="text-[11px] text-slate-400">Anaesth: {s.anesthetist}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <button
                        onClick={() => handleToggleChecklist(s.id, 'signIn')}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                          s.whoChecklist.signIn
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}
                        title="Click to toggle Sign-In (Before induction)"
                      >
                        Sign-In {s.whoChecklist.signIn ? '✓' : ''}
                      </button>

                      <button
                        onClick={() => handleToggleChecklist(s.id, 'timeOut')}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                          s.whoChecklist.timeOut
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}
                        title="Click to toggle Time-Out (Before skin incision)"
                      >
                        Time-Out {s.whoChecklist.timeOut ? '✓' : ''}
                      </button>

                      <button
                        onClick={() => handleToggleChecklist(s.id, 'signOut')}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                          s.whoChecklist.signOut
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}
                        title="Click to toggle Sign-Out (Before patient leaves OT)"
                      >
                        Sign-Out {s.whoChecklist.signOut ? '✓' : ''}
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-1">
                      {s.status === 'INTRA_OP' ? (
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-md text-xs font-bold flex items-center gap-1">
                          <Activity className="w-3 h-3 animate-pulse text-blue-600" />
                          Intra-Op
                        </span>
                      ) : s.status === 'PRE_OP_PACU' ? (
                        <span className="badge-blue">Pre-Op PACU</span>
                      ) : s.status === 'POST_OP_RECOVERY' ? (
                        <span className="badge-emerald">Post-Op PACU</span>
                      ) : s.status === 'COMPLETED' ? (
                        <span className="badge-emerald">Discharged PACU</span>
                      ) : (
                        <span className="badge-slate">Scheduled</span>
                      )}
                      {s.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleAdvanceStatus(s.id)}
                          className="text-[10px] text-blue-600 hover:text-blue-800 dark:text-blue-400 font-semibold underline mt-0.5"
                        >
                          Advance Phase &rarr;
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-md text-[11px] font-semibold">
                      {s.bloodUnitsReserved}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Surgery Booking Modal */}
      {isNewSurgeryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="card-stylish w-full max-w-lg bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-rose-600" />
                Schedule Surgical Case & Book OT Table
              </h3>
              <button onClick={() => setIsNewSurgeryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSurgery} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={newSurgery.patientName}
                    onChange={(e) => setNewSurgery({ ...newSurgery, patientName: e.target.value })}
                    className="input-stylish text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Patient MRN (UHID)</label>
                  <input
                    type="text"
                    placeholder="UHID-88250"
                    value={newSurgery.mrn}
                    onChange={(e) => setNewSurgery({ ...newSurgery, mrn: e.target.value })}
                    className="input-stylish text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Proposed Procedure Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Open Inguinal Hernioplasty"
                  value={newSurgery.procedureName}
                  onChange={(e) => setNewSurgery({ ...newSurgery, procedureName: e.target.value })}
                  className="input-stylish text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Theatre Suite</label>
                  <select
                    value={newSurgery.theatreName}
                    onChange={(e) => setNewSurgery({ ...newSurgery, theatreName: e.target.value })}
                    className="input-stylish text-xs"
                  >
                    <option value="OT 1 (General & GI Suite)">OT 1 (General & GI Suite)</option>
                    <option value="OT 2 (Orthopedic & Joint Suite)">OT 2 (Orthopedic & Joint Suite)</option>
                    <option value="OT 3 (Cardiac Surgery Suite)">OT 3 (Cardiac Surgery Suite)</option>
                    <option value="Minor OT (Daycare Surgery)">Minor OT (Daycare Surgery)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Lead Operating Surgeon</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. R. Arun"
                    value={newSurgery.leadSurgeon}
                    onChange={(e) => setNewSurgery({ ...newSurgery, leadSurgeon: e.target.value })}
                    className="input-stylish text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Anesthesiologist</label>
                  <input
                    type="text"
                    placeholder="Dr. M. Sridhar"
                    value={newSurgery.anesthetist}
                    onChange={(e) => setNewSurgery({ ...newSurgery, anesthetist: e.target.value })}
                    className="input-stylish text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Time Slot</label>
                  <input
                    type="text"
                    placeholder="09:00 AM - 11:30 AM"
                    value={newSurgery.scheduledTime}
                    onChange={(e) => setNewSurgery({ ...newSurgery, scheduledTime: e.target.value })}
                    className="input-stylish text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Implants / High-Value Consumables</label>
                  <input
                    type="text"
                    placeholder="e.g. Prolene Mesh 15x15cm"
                    value={newSurgery.implantUsed}
                    onChange={(e) => setNewSurgery({ ...newSurgery, implantUsed: e.target.value })}
                    className="input-stylish text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Blood Units Reserved</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Unit PRBC A+ve"
                    value={newSurgery.bloodUnitsReserved}
                    onChange={(e) => setNewSurgery({ ...newSurgery, bloodUnitsReserved: e.target.value })}
                    className="input-stylish text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewSurgeryModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Confirm OT Booking
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
        title="Operation Theatre Daily Surgical Schedule"
        text={`Hospital OT Roster: ${surgeries.length} scheduled cases across 4 suites with active WHO checklist verification.`}
        url={window.location.href}
      />
    </div>
  );
};
