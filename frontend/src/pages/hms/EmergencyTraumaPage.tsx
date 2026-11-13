import React, { useState, useEffect } from 'react';
import {
  Siren,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Truck,
  Activity,
  ShieldCheck,
  User,
  X,
  PhoneCall,
  Flame,
  Radio,
  ArrowRight,
  HeartPulse
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { DoctorLiveTrackingMap } from '../../components/maps/DoctorLiveTrackingMap';

interface ErPatient {
  id: string;
  erToken: string;
  patientName: string;
  ageGender: string;
  esiTriage: 1 | 2 | 3 | 4 | 5;
  chiefComplaint: string;
  bayAllocated: string;
  vitals: {
    bp: string;
    pulse: number;
    spo2: number;
    gcs: number;
  };
  attendingEmergencyDoctor: string;
  status: 'ACTIVE_RESUSCITATION' | 'UNDER_OBSERVATION' | 'TRANSFERRED_TO_ICU' | 'TRANSFERRED_TO_WARD' | 'DISCHARGED';
  isMlcCase: boolean;
  arrivalTime: string;
}

interface AmbulanceUnit {
  vehicleNo: string;
  type: 'Advanced Cardiac Life Support (ACLS)' | 'Basic Life Support (BLS)';
  paramedicLead: string;
  status: 'READY_IN_HOSPITAL' | 'ON_DISPATCH_RUN' | 'MAINTENANCE';
  currentLocation: string;
  oxygenReady: boolean;
}

const INITIAL_ER_PATIENTS: ErPatient[] = [
  {
    id: 'ER-01',
    erToken: 'TR-101',
    patientName: 'Venkatesh Babu',
    ageGender: '48M',
    esiTriage: 1,
    chiefComplaint: 'Acute Crushing Chest Pain, Diaphoresis, Suspected STEMI',
    bayAllocated: 'Red Trauma Bay 1 (Crash Bay)',
    vitals: { bp: '80/50', pulse: 128, spo2: 89, gcs: 14 },
    attendingEmergencyDoctor: 'Dr. Joseph (Emergency Care)',
    status: 'ACTIVE_RESUSCITATION',
    isMlcCase: false,
    arrivalTime: '08:42 AM'
  },
  {
    id: 'ER-02',
    erToken: 'TR-102',
    patientName: 'Praveen S.',
    ageGender: '24M',
    esiTriage: 2,
    chiefComplaint: 'RTA Road Accident, Open Right Tibia Fracture, Lacerations',
    bayAllocated: 'Yellow Bay 2',
    vitals: { bp: '110/70', pulse: 98, spo2: 97, gcs: 15 },
    attendingEmergencyDoctor: 'Dr. Arunachalam Kumar',
    status: 'UNDER_OBSERVATION',
    isMlcCase: true,
    arrivalTime: '09:10 AM'
  },
  {
    id: 'ER-03',
    erToken: 'TR-103',
    patientName: 'Saradha Devi',
    ageGender: '62F',
    esiTriage: 3,
    chiefComplaint: 'Severe Acute Bronchospasm, Asthma Exacerbation',
    bayAllocated: 'Yellow Bay 4',
    vitals: { bp: '135/85', pulse: 104, spo2: 92, gcs: 15 },
    attendingEmergencyDoctor: 'Dr. Sindhu Rajagopalan',
    status: 'UNDER_OBSERVATION',
    isMlcCase: false,
    arrivalTime: '09:35 AM'
  }
];

const INITIAL_AMBULANCES: AmbulanceUnit[] = [
  {
    vehicleNo: 'TN-09-EM-9901',
    type: 'Advanced Cardiac Life Support (ACLS)',
    paramedicLead: 'Paramedic Muthu (ACLS Certified)',
    status: 'READY_IN_HOSPITAL',
    currentLocation: 'Emergency Portico Bay A',
    oxygenReady: true
  },
  {
    vehicleNo: 'TN-09-EM-9902',
    type: 'Advanced Cardiac Life Support (ACLS)',
    paramedicLead: 'Paramedic Anand',
    status: 'ON_DISPATCH_RUN',
    currentLocation: 'Enroute to Guindy Industrial Hub (ETA 12 mins)',
    oxygenReady: true
  },
  {
    vehicleNo: 'TN-09-EM-9903',
    type: 'Basic Life Support (BLS)',
    paramedicLead: 'Paramedic Ravi',
    status: 'READY_IN_HOSPITAL',
    currentLocation: 'Emergency Portico Bay B',
    oxygenReady: true
  }
];

export const EmergencyTraumaPage: React.FC = () => {
  const [erPatients, setErPatients] = useState<ErPatient[]>(() => {
    const saved = localStorage.getItem('hospital_er_patients_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ER_PATIENTS;
  });

  const [ambulances, setAmbulances] = useState<AmbulanceUnit[]>(() => {
    const saved = localStorage.getItem('hospital_ambulances_fleet_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_AMBULANCES;
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
  const [activeCodeAlert, setActiveCodeAlert] = useState<string | null>(null);

  // Transfer Modal State
  const [transferringPatient, setTransferringPatient] = useState<ErPatient | null>(null);
  const [transferDestination, setTransferDestination] = useState<ErPatient['status']>('TRANSFERRED_TO_ICU');

  // Ambulance Dispatch Modal State
  const [dispatchingAmb, setDispatchingAmb] = useState<AmbulanceUnit | null>(null);
  const [dispatchLocation, setDispatchLocation] = useState('Guindy Ring Road Junction');

  // New Patient Form State
  const [newPatient, setNewPatient] = useState({
    patientName: '',
    ageGender: '45M',
    esiTriage: 2 as 1 | 2 | 3 | 4 | 5,
    chiefComplaint: '',
    bayAllocated: 'Yellow Bay 3',
    isMlcCase: false,
    bp: '120/80',
    pulse: 88,
    spo2: 98,
    gcs: 15
  });

  useEffect(() => {
    try {
      localStorage.setItem('hospital_er_patients_v1', JSON.stringify(erPatients));
      localStorage.setItem('hospital_ambulances_fleet_v1', JSON.stringify(ambulances));
    } catch (e) {
      console.error(e);
    }
  }, [erPatients, ambulances]);

  const handleRegisterTriage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.patientName.trim()) return;

    const created: ErPatient = {
      id: `ER-${Date.now()}`,
      erToken: `TR-${100 + erPatients.length + 1}`,
      patientName: newPatient.patientName,
      ageGender: newPatient.ageGender,
      esiTriage: newPatient.esiTriage,
      chiefComplaint: newPatient.chiefComplaint || 'Emergency Triage Evaluation',
      bayAllocated: newPatient.bayAllocated,
      vitals: {
        bp: newPatient.bp,
        pulse: Number(newPatient.pulse),
        spo2: Number(newPatient.spo2),
        gcs: Number(newPatient.gcs)
      },
      attendingEmergencyDoctor: 'Dr. Joseph (Emergency Care)',
      status: newPatient.esiTriage === 1 ? 'ACTIVE_RESUSCITATION' : 'UNDER_OBSERVATION',
      isMlcCase: newPatient.isMlcCase,
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setErPatients([created, ...erPatients]);
    setIsTriageModalOpen(false);
  };

  const handleExecuteTransfer = () => {
    if (!transferringPatient) return;
    setErPatients((prev) =>
      prev.map((p) =>
        p.id === transferringPatient.id ? { ...p, status: transferDestination } : p
      )
    );
    setTransferringPatient(null);
  };

  const handleExecuteDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchingAmb) return;
    setAmbulances((prev) =>
      prev.map((a) =>
        a.vehicleNo === dispatchingAmb.vehicleNo
          ? {
              ...a,
              status: 'ON_DISPATCH_RUN',
              currentLocation: `Dispatched to: ${dispatchLocation} (Sirens Active)`
            }
          : a
      )
    );
    setDispatchingAmb(null);
  };

  const triggerCode = (codeName: string) => {
    setActiveCodeAlert(codeName);
    setTimeout(() => {
      setActiveCodeAlert(null);
    }, 6000);
  };

  const filteredPatients = erPatients.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      p.patientName.toLowerCase().includes(q) ||
      p.erToken.toLowerCase().includes(q) ||
      p.chiefComplaint.toLowerCase().includes(q) ||
      p.bayAllocated.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Code Broadcast Banner */}
      {activeCodeAlert && (
        <div className="p-4 rounded-2xl bg-rose-600 text-white font-bold flex items-center justify-between shadow-xl animate-bounce">
          <div className="flex items-center gap-3">
            <Radio className="w-6 h-6 animate-spin" />
            <span className="text-sm tracking-wide">
              HOSPITAL EMERGENCY BROADCAST: {activeCodeAlert} ACTIVATED IN ER TRAUMA RESUSCITATION BAY! ALL CRITICAL TEAMS MOBILIZE!
            </span>
          </div>
          <button
            onClick={() => setActiveCodeAlert(null)}
            className="px-3 py-1 bg-white text-rose-700 rounded-lg text-xs font-bold"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
            <Siren className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-jakarta">
              Emergency, Trauma Bay &amp; Ambulance Dispatch Hub
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Level 1 trauma triage, crash resuscitation bays, Code Blue broadcasting, and GPS ambulance fleet tracking
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => triggerCode('CODE BLUE (CARDIAC ARREST)')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Flame className="w-4 h-4" />
            Code Blue
          </button>
          <button
            onClick={() => triggerCode('CODE RED (FIRE EMERGENCY)')}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-rose-600/20"
          >
            <AlertTriangle className="w-4 h-4" />
            Code Red
          </button>
          <button
            onClick={() => setIsTriageModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span className="text-white font-bold">Triage Intake (ESI)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card-stylish p-5 flex flex-col justify-between border-rose-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Resuscitation (ESI 1)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-rose-700 font-jakarta">
              {erPatients.filter((p) => p.esiTriage === 1).length}
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
              Critical Crash Bay Occupied
            </p>
          </div>
        </div>

        <div className="stat-card-stylish p-5 flex flex-col justify-between border-amber-200/80">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Emergent / Urgent (ESI 2-3)</span>
          <div className="mt-3">
            <p className="text-3xl font-black text-amber-700 font-jakarta">
              {erPatients.filter((p) => p.esiTriage === 2 || p.esiTriage === 3).length}
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
              Active Triage Patients
            </p>
          </div>
        </div>

        <div className="stat-card-stylish p-5 flex flex-col justify-between border-blue-200/80">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Ambulances Ready</span>
          <div className="mt-3">
            <p className="text-3xl font-black text-blue-700 font-jakarta">
              {ambulances.filter((a) => a.status === 'READY_IN_HOSPITAL').length} / {ambulances.length}
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
              Fleet Units Ready
            </p>
          </div>
        </div>

        <div className="stat-card-stylish p-5 flex flex-col justify-between border-emerald-200/80">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Median Triage Time</span>
          <div className="mt-3">
            <p className="text-3xl font-black text-emerald-700 font-jakarta">
              90s
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
              Door-to-Doctor Assessment
            </p>
          </div>
        </div>
      </div>

      {/* Main Patients Table */}
      <div className="table-container-stylish bg-slate-50/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Active Trauma Bay &amp; Resuscitation Census
          </h2>
          <div className="relative w-full sm:w-80 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emergency token, patient, complaint..."
              className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/90 shadow-2xs">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-100/90 dark:bg-slate-800/95 border-b border-slate-200 dark:border-slate-700 text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Token &amp; Arrival</th>
                <th className="px-5 py-3.5">Patient &amp; Demographics</th>
                <th className="px-5 py-3.5">ESI Triage Level</th>
                <th className="px-5 py-3.5">Complaint &amp; Bay</th>
                <th className="px-5 py-3.5">Live Vitals</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Emergency Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/40 transition">
                  <td className="px-5 py-4">
                    <div className="font-mono font-black text-rose-700 text-xs">{p.erToken}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{p.arrivalTime}</div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">{p.patientName}</div>
                    <div className="text-[11px] text-slate-500">{p.ageGender}</div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    {p.esiTriage === 1 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-rose-50 text-rose-700 border border-rose-200 animate-pulse whitespace-nowrap shadow-2xs">
                        <Flame className="w-3.5 h-3.5 text-rose-600" />
                        ESI 1: Resuscitation
                      </span>
                    ) : p.esiTriage === 2 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap shadow-2xs">
                        ESI 2: Emergent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap shadow-2xs">
                        ESI 3: Urgent
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 max-w-xs">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs line-clamp-1">{p.chiefComplaint}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-[10px] font-semibold">
                      {p.bayAllocated}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      BP: {p.vitals.bp} · P: {p.vitals.pulse}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      SpO2: <span className={p.vitals.spo2 < 90 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>{p.vitals.spo2}%</span> · GCS: {p.vitals.gcs}/15
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    {p.status === 'ACTIVE_RESUSCITATION' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap shadow-2xs">
                        <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                        Active Resuscitation
                      </span>
                    ) : p.status === 'UNDER_OBSERVATION' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Observation
                      </span>
                    ) : p.status === 'TRANSFERRED_TO_ICU' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap shadow-2xs">
                        ICU Transferred
                      </span>
                    ) : p.status === 'TRANSFERRED_TO_WARD' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap shadow-2xs">
                        Ward Transferred
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Discharged
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setTransferringPatient(p)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-blue-600/25 cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                      title="Update Patient Disposition or Bed Transfer"
                    >
                      <span className="text-white font-bold">Disposition / Transfer</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Specialist Doctor On-Call Geolocation Radar & GPS */}
      <div className="pt-2">
        <DoctorLiveTrackingMap />
      </div>

      {/* Ambulance Fleet Cards */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-indigo-600" />
          Live Ambulance Fleet Status &amp; Paramedic Readiness
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ambulances.map((amb, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900 text-xs">{amb.vehicleNo}</span>
                {amb.status === 'READY_IN_HOSPITAL' ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Ready for Dispatch
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                    On Mission Run
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 font-medium">{amb.type}</p>
              <div className="text-xs text-slate-800 font-semibold">Lead: {amb.paramedicLead}</div>
              <div className="text-xs text-blue-700 font-medium bg-blue-50/60 p-2 rounded-xl border border-blue-100">
                {amb.currentLocation}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-600 flex items-center gap-1 font-semibold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> O2 Tested
                </span>
                {amb.status === 'READY_IN_HOSPITAL' && (
                  <button
                    onClick={() => setDispatchingAmb(amb)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Dispatch Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Transfer / Disposition */}
      {transferringPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <Activity className="w-5 h-5 text-rose-600" />
                Emergency Patient Disposition
              </h3>
              <button onClick={() => setTransferringPatient(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 text-sm">{transferringPatient.patientName} ({transferringPatient.erToken})</span>
                <p className="text-slate-500 font-medium">{transferringPatient.chiefComplaint}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Transfer Destination</label>
                <select
                  value={transferDestination}
                  onChange={(e) => setTransferDestination(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="TRANSFERRED_TO_ICU">Critical Transfer to Intensive Care Unit (ICU / ICCU)</option>
                  <option value="TRANSFERRED_TO_WARD">Transfer to Inpatient Medical Ward (Bed Matrix)</option>
                  <option value="ACTIVE_RESUSCITATION">Cath Lab Emergency Intervention (PPCI)</option>
                  <option value="DISCHARGED">Stabilized &amp; Discharged with OPD Follow-Up</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setTransferringPatient(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteTransfer}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/25 text-xs transition cursor-pointer"
              >
                <span className="text-white font-bold">Execute Transfer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Ambulance Dispatch */}
      {dispatchingAmb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <Truck className="w-5 h-5 text-blue-600" />
                Dispatch Ambulance: {dispatchingAmb.vehicleNo}
              </h3>
              <button onClick={() => setDispatchingAmb(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteDispatch} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Emergency Pickup Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OMR IT Highway Toll Plaza, Sholinganallur"
                  value={dispatchLocation}
                  onChange={(e) => setDispatchLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-blue-800 space-y-1">
                <span className="font-bold">Paramedic Lead:</span> {dispatchingAmb.paramedicLead}
                <p className="text-[11px]">Oxygen verified, defibrillator online, siren priority auto-broadcasting.</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDispatchingAmb(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/25 text-xs"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Triage Intake */}
      {isTriageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <Siren className="w-5 h-5 text-rose-600" />
                Emergency Triage Intake (ESI Protocol)
              </h3>
              <button onClick={() => setIsTriageModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterTriage} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Patient Name"
                    value={newPatient.patientName}
                    onChange={(e) => setNewPatient({ ...newPatient, patientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age &amp; Gender</label>
                  <input
                    type="text"
                    placeholder="e.g. 52M / 28F"
                    value={newPatient.ageGender}
                    onChange={(e) => setNewPatient({ ...newPatient, ageGender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ESI Triage Severity</label>
                <select
                  value={newPatient.esiTriage}
                  onChange={(e) => setNewPatient({ ...newPatient, esiTriage: Number(e.target.value) as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value={1}>Level 1: Resuscitation (Immediate Life Threat)</option>
                  <option value={2}>Level 2: Emergent (High Risk / Chest Pain / Trauma)</option>
                  <option value={3}>Level 3: Urgent (Requires 2+ Resources)</option>
                  <option value={4}>Level 4: Less Urgent</option>
                  <option value={5}>Level 5: Non-Urgent</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chief Presenting Complaint</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Severe shortness of breath, anaphylaxis"
                  value={newPatient.chiefComplaint}
                  onChange={(e) => setNewPatient({ ...newPatient, chiefComplaint: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bay Allocated</label>
                  <select
                    value={newPatient.bayAllocated}
                    onChange={(e) => setNewPatient({ ...newPatient, bayAllocated: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                  >
                    <option value="Red Trauma Bay 1 (Crash Bay)">Red Trauma Bay 1</option>
                    <option value="Red Trauma Bay 2">Red Trauma Bay 2</option>
                    <option value="Yellow Bay 3">Yellow Bay 3</option>
                    <option value="Yellow Bay 4">Yellow Bay 4</option>
                    <option value="Green Fast-Track Bay">Green Fast-Track</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    value={newPatient.bp}
                    onChange={(e) => setNewPatient({ ...newPatient, bp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTriageModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md shadow-rose-600/25 transition"
                >
                  Admit into Triage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
