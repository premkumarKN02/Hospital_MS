import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Filter,
  ShieldAlert,
  UserCheck,
  FileText,
  X,
  EyeOff
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { enterpriseStore } from '../../services/enterpriseDataStore';

interface IncidentReport {
  id: string;
  incidentNumber: string;
  incidentType: 'Medication Administration Error' | 'Patient Fall / Bedrail' | 'Needle Stick / Sharps Injury' | 'Equipment Malfunction' | 'Surgical Complication' | 'Near Miss';
  severity: 'NEAR_MISS' | 'MINOR_NO_HARM' | 'MODERATE_TEMPORARY_HARM' | 'SENTINEL_EVENT';
  department: string;
  dateTime: string;
  description: string;
  reportedBy: string; // or Anonymous
  rootCauseAnalysis: string; // RCA
  capaAction: string; // Corrective & Preventive Action
  capaStatus: 'OPEN_INVESTIGATION' | 'CAPA_IMPLEMENTED' | 'CLOSED_VERIFIED';
}

export const IncidentReportingPage: React.FC = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState(false);

  const [incidents, setIncidents] = useState<IncidentReport[]>(() => {
    const saved = localStorage.getItem('hospital_safety_incidents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
    {
      id: 'INC-01',
      incidentNumber: 'INC-2026-081',
      incidentType: 'Near Miss',
      severity: 'NEAR_MISS',
      department: 'Central Pharmacy & Daycare',
      dateTime: '2026-10-06 11:20 AM',
      description: 'Look-Alike Sound-Alike (LASA) drug confusion intercepted: Cefotaxime 1g was picked instead of Ceftriaxone 1g. Barcode scanner flagged mismatch at verification desk.',
      reportedBy: 'Pharmacist Priya (Anonymous Flagged)',
      rootCauseAnalysis: 'Similar green vial labeling and physical storage in adjacent shelf bins without tall-man lettering separator.',
      capaAction: 'Separated LASA medicines with distinct orange visual dividers; mandatory dual barcode double-scan implemented.',
      capaStatus: 'CLOSED_VERIFIED'
    },
    {
      id: 'INC-02',
      incidentNumber: 'INC-2026-082',
      incidentType: 'Patient Fall / Bedrail',
      severity: 'MINOR_NO_HARM',
      department: 'Inpatient Ward 3 (Room 304)',
      dateTime: '2026-10-07 02:40 AM',
      description: 'Post-op patient attempted unassisted unsteadied ambulation to bathroom at night. Slipped on bedside floor. Caught immediately by duty nurse, vitals normal, CT scan negative for trauma.',
      reportedBy: 'Staff Nurse Geetha',
      rootCauseAnalysis: 'Patient Morse Fall Scale was assessed at 45 (Moderate Risk), but nurse call bell cord was displaced out of direct arm reach.',
      capaAction: 'Installed magnetic clip call bells within arm reach; illuminated night floor path sensor strip activated for all high-fall risk patients.',
      capaStatus: 'CAPA_IMPLEMENTED'
    },
    {
      id: 'INC-03',
      incidentNumber: 'INC-2026-083',
      incidentType: 'Needle Stick / Sharps Injury',
      severity: 'MINOR_NO_HARM',
      department: 'Emergency Room (Trauma Bay 2)',
      dateTime: '2026-10-07 09:15 PM',
      description: 'Junior nursing intern sustained superficial needle prick on left index finger while recapping IV cannula needle post resuscitation cannulation.',
      reportedBy: 'Nursing Intern Arun',
      rootCauseAnalysis: 'Breach of standard precaution: Manual recapping of two-handed needle instead of immediate disposal into puncture-proof sharps bin.',
      capaAction: 'Post-exposure prophylaxis (PEP) protocol and source HIV/HBV testing completed (Negative). Retraining on mandatory single-handed safety retracting cannulae.',
      capaStatus: 'CAPA_IMPLEMENTED'
    }
  ];
  });

  const [newInc, setNewInc] = useState({
    incidentType: 'Near Miss' as const,
    severity: 'NEAR_MISS' as const,
    department: 'General Ward',
    description: '',
    isAnonymous: false,
    reporterName: '',
    rootCauseAnalysis: '',
    capaAction: ''
  });

  // Persist incidents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hospital_safety_incidents', JSON.stringify(incidents));
    } catch (e) {
      console.error(e);
    }
  }, [incidents]);

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const created: IncidentReport = {
      id: `INC-0${incidents.length + 4}`,
      incidentNumber: `INC-2026-${Math.floor(88 + Math.random() * 50)}`,
      incidentType: newInc.incidentType,
      severity: newInc.severity,
      department: newInc.department,
      dateTime: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: newInc.description,
      reportedBy: newInc.isAnonymous ? 'Anonymous Staff Report' : (newInc.reporterName || 'Staff Member'),
      rootCauseAnalysis: newInc.rootCauseAnalysis || 'Investigation under review by Clinical Safety Officer',
      capaAction: newInc.capaAction || 'CAPA action plan being framed',
      capaStatus: 'OPEN_INVESTIGATION'
    };

    const mapType = (t: string): 'MEDICATION_ERROR' | 'PATIENT_FALL' | 'NEEDLE_STICK' | 'SURGICAL_EVENT' | 'EQUIPMENT_FAIL' | 'SECURITY' => {
      if (t.includes('Medication')) return 'MEDICATION_ERROR';
      if (t.includes('Fall')) return 'PATIENT_FALL';
      if (t.includes('Needle')) return 'NEEDLE_STICK';
      if (t.includes('Equipment')) return 'EQUIPMENT_FAIL';
      if (t.includes('Surgical')) return 'SURGICAL_EVENT';
      return 'SECURITY';
    };

    const mapSeverity = (s: string): 'NEAR_MISS' | 'MINOR' | 'MODERATE' | 'SENTINEL_EVENT' => {
      if (s === 'SENTINEL_EVENT') return 'SENTINEL_EVENT';
      if (s.includes('MODERATE')) return 'MODERATE';
      if (s.includes('MINOR')) return 'MINOR';
      return 'NEAR_MISS';
    };

    enterpriseStore.logSafetyIncident({
      incidentType: mapType(created.incidentType),
      severity: mapSeverity(created.severity),
      location: created.department,
      description: `${created.incidentType}: ${created.description}`
    });

    setIncidents([created, ...incidents]);
    setIsNewIncidentModalOpen(false);
  };

  const handleVerifyCapa = (id: string) => {
    setIncidents(prev => prev.map(i => {
      if (i.id === id) {
        return {
          ...i,
          capaStatus: 'CLOSED_VERIFIED'
        };
      }
      return i;
    }));
  };

  const filtered = incidents.filter(i => {
    const matchSev = selectedSeverity === 'ALL' || i.severity === selectedSeverity;
    const matchSearch = i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.incidentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSev && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="card-stylish p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Clinical Incident Reporting, Sentinel Events &amp; CAPA
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              NABH/JCI non-punitive incident logging, Root Cause Analysis (RCA 5-Whys), and Corrective &amp; Preventive Action verification
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNewIncidentModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Report Patient Safety Incident
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Incidents Logged</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{incidents.length} Reports</p>
          <p className="text-[11px] text-slate-500 mt-1">Open safety reporting culture</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-emerald-500 uppercase">Sentinel Events</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">0 Events</p>
          <p className="text-[11px] text-slate-500 mt-1">Zero severe harm cases</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-indigo-500 uppercase">Near Miss Interceptions</span>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {incidents.filter(i => i.severity === 'NEAR_MISS').length} Caught
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Stopped before reaching patient</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-blue-500 uppercase">CAPA Resolution Rate</span>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">100%</p>
          <p className="text-[11px] text-slate-500 mt-1">Preventive protocols implemented</p>
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
            placeholder="Search incident, department, root cause..."
            className="input-stylish !pl-10 pr-3"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="select-stylish text-xs"
          >
            <option value="ALL">All Severity Grades</option>
            <option value="NEAR_MISS">Near Miss</option>
            <option value="MINOR_NO_HARM">Minor / No Harm</option>
            <option value="MODERATE_TEMPORARY_HARM">Moderate Harm</option>
            <option value="SENTINEL_EVENT">Sentinel Event</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="table-container-stylish">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 py-3">Incident # & Date</th>
                <th className="px-4 py-3">Category & Department</th>
                <th className="px-4 py-3">Severity Grade</th>
                <th className="px-4 py-3">Event Description</th>
                <th className="px-4 py-3">Root Cause (RCA) & CAPA Action</th>
                <th className="px-4 py-3">CAPA Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((i) => (
                <tr key={i.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 dark:text-white font-mono text-xs">{i.incidentNumber}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{i.dateTime}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-white text-xs">{i.incidentType}</div>
                    <span className="badge-slate text-[10px] mt-0.5">{i.department}</span>
                  </td>

                  <td className="px-4 py-3">
                    {i.severity === 'NEAR_MISS' ? (
                      <span className="badge-indigo">Near Miss</span>
                    ) : i.severity === 'MINOR_NO_HARM' ? (
                      <span className="badge-amber">Minor / No Harm</span>
                    ) : (
                      <span className="badge-rose">Sentinel Event</span>
                    )}
                  </td>

                  <td className="px-4 py-3 max-w-xs">
                    <div className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2">{i.description}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">By: {i.reportedBy}</div>
                  </td>

                  <td className="px-4 py-3 max-w-xs">
                    <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      <strong>RCA:</strong> {i.rootCauseAnalysis}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                      <strong>CAPA:</strong> {i.capaAction}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {i.capaStatus === 'CLOSED_VERIFIED' ? (
                      <span className="badge-emerald">Closed &amp; Verified</span>
                    ) : (
                      <span className="badge-blue">CAPA Active</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {i.capaStatus !== 'CLOSED_VERIFIED' && (
                        <button
                          onClick={() => handleVerifyCapa(i.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors"
                        >
                          Verify CAPA
                        </button>
                      )}
                      <button
                        onClick={() => window.print()}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold"
                      >
                        Audit RCA
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Incident Modal */}
      {isNewIncidentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="card-stylish w-full max-w-md bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Report Patient Safety Incident / Near Miss
              </h3>
              <button onClick={() => setIsNewIncidentModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Incident Category</label>
                  <select
                    value={newInc.incidentType}
                    onChange={(e) => setNewInc({ ...newInc, incidentType: e.target.value as any })}
                    className="input-stylish text-xs"
                  >
                    <option value="Near Miss">Near Miss</option>
                    <option value="Medication Administration Error">Medication Error</option>
                    <option value="Patient Fall / Bedrail">Patient Fall</option>
                    <option value="Needle Stick / Sharps Injury">Needle Stick Injury</option>
                    <option value="Equipment Malfunction">Equipment Malfunction</option>
                    <option value="Surgical Complication">Surgical Complication</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Severity Grade</label>
                  <select
                    value={newInc.severity}
                    onChange={(e) => setNewInc({ ...newInc, severity: e.target.value as any })}
                    className="input-stylish text-xs"
                  >
                    <option value="NEAR_MISS">Near Miss (No Contact)</option>
                    <option value="MINOR_NO_HARM">Minor / No Harm</option>
                    <option value="MODERATE_TEMPORARY_HARM">Moderate Temporary Harm</option>
                    <option value="SENTINEL_EVENT">Sentinel Event</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department / Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ICU / Ward 3 / Pharmacy"
                  value={newInc.department}
                  onChange={(e) => setNewInc({ ...newInc, department: e.target.value })}
                  className="input-stylish text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Event Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe what occurred, timing, patient vitals, and immediate containment..."
                  value={newInc.description}
                  onChange={(e) => setNewInc({ ...newInc, description: e.target.value })}
                  className="input-stylish text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={newInc.isAnonymous}
                  onChange={(e) => setNewInc({ ...newInc, isAnonymous: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="anonCheck" className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                  <EyeOff className="w-3.5 h-3.5" />
                  Submit as Anonymous Non-Punitive Report (Identity Protected)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewIncidentModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Submit Incident for RCA
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
        title="Patient Safety Incident & CAPA Summary"
        text={`Hospital Quality & Safety: ${incidents.length} incidents logged, 0 sentinel events, 100% CAPA compliance.`}
        url={window.location.href}
      />
    </div>
  );
};
