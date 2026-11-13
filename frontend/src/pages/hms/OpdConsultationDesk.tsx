import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Activity,
  Plus,
  Trash2,
  FileCheck,
  Clock,
  Printer,
  Share2,
  AlertCircle,
  Save,
  CheckCircle2,
  UserPlus,
  X,
  Search,
  Check,
  Calendar,
  FlaskConical,
  FileText,
  Send,
  Radio,
  Camera,
  Eye
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { DoctorPatientPhotoModal } from '../../components/patient/DoctorPatientPhotoModal';
import { getPatientPhoto } from '../../utils/patientPhotoUtils';

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instruction: string;
}

export interface OpdPatientRecord {
  token: string;
  name: string;
  initials: string;
  mrn: string;
  age: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  emergencyContact: string;
  allergies: string;
  reason: string;
  status: 'In-Consult' | 'Waiting' | 'Completed';
  chiefComplaints: string;
  diagnosis: string;
  bpSystolic: string;
  bpDiastolic: string;
  pulse: string;
  spO2: string;
  temp: string;
  weight: string;
  height?: string;
  prescriptions: PrescriptionItem[];
  orderedInvestigations?: string[];
  followUpDate?: string;
  doctorNotes?: string;
  dietaryAdvice?: string[];
}

const COMMON_INVESTIGATIONS = [
  { id: 'inv-cbc', name: 'Complete Blood Count (CBC)', dept: 'LIS Hematology' },
  { id: 'inv-lft', name: 'Liver Function Test (LFT)', dept: 'LIS Biochemistry' },
  { id: 'inv-rft', name: 'Renal Function / Creatinine (RFT)', dept: 'LIS Biochemistry' },
  { id: 'inv-lipid', name: 'Lipid Profile (Cholesterol / Triglycerides)', dept: 'LIS Biochemistry' },
  { id: 'inv-hba1c', name: 'HbA1c & Fasting Blood Sugar', dept: 'LIS Biochemistry' },
  { id: 'inv-tropi', name: 'Troponin-I Rapid Quantitative', dept: 'LIS Cardiac' },
  { id: 'inv-ecg', name: '12-Lead Standard ECG', dept: 'Cardiology' },
  { id: 'inv-cxr', name: 'Digital Chest X-Ray (PA View)', dept: 'RIS Radiology' },
  { id: 'inv-echo', name: '2D Transthoracic Echocardiogram', dept: 'Cardiology / RIS' },
  { id: 'inv-usg', name: 'USG Whole Abdomen & Pelvis', dept: 'RIS Ultrasound' },
  { id: 'inv-ct', name: 'NCCT Brain Plain', dept: 'RIS CT Scan' },
  { id: 'inv-urine', name: 'Urine Routine & Microscopy', dept: 'LIS Clinical Path' },
];

const DIETARY_ADVICE_OPTIONS = [
  'Low Sodium (< 2g/day) Diet',
  'Diabetic Meal Plan (Carb Control)',
  'High Dietary Fiber & Hydration',
  'Low Saturated Fat / Heart Healthy',
  'Adequate Fluid Intake (2.5L/day)',
  'Restrict Caffeine / Stimulants',
  'Bed Rest for 48 Hours',
  'Regular Morning Brisk Walk (30 mins)'
];

const INITIAL_OPD_QUEUE: OpdPatientRecord[] = [
  {
    token: 'OPD-101',
    name: 'Rajesh Kumar',
    initials: 'RK',
    mrn: 'SNHC-2024-00001',
    age: '48',
    gender: 'Male',
    bloodGroup: 'B+ve',
    phone: '+91 98765 43210',
    emergencyContact: '+91 98765 43210',
    allergies: 'Penicillin',
    reason: 'Cardiology Follow-up',
    status: 'In-Consult',
    chiefComplaints: 'Severe chest heaviness, mild breathlessness on exertion for 2 days',
    diagnosis: 'Angina Pectoris (Probable ACS) - ICD-10: I20.9',
    bpSystolic: '140',
    bpDiastolic: '90',
    pulse: '84',
    spO2: '98',
    temp: '98.6',
    weight: '72',
    prescriptions: [
      {
        id: '1',
        medicineName: 'Tab. Sorbitrate (Isosorbide Dinitrate)',
        dosage: '5 mg',
        frequency: 'SOS (Sublingual)',
        duration: '5 days',
        instruction: 'Place under tongue during acute chest discomfort'
      },
      {
        id: '2',
        medicineName: 'Tab. Ecosprin (Aspirin)',
        dosage: '75 mg',
        frequency: '0 - 1 - 0 (After Lunch)',
        duration: '30 days',
        instruction: 'Take after meals with plenty of water'
      },
      {
        id: '3',
        medicineName: 'Tab. Atorvastatin',
        dosage: '40 mg',
        frequency: '0 - 0 - 1 (At Bedtime)',
        duration: '30 days',
        instruction: 'Take at night after food'
      }
    ]
  },
  {
    token: 'OPD-102',
    name: 'Lakshmi Narayanan',
    initials: 'LN',
    mrn: 'SNHC-2024-00002',
    age: '62',
    gender: 'Female',
    bloodGroup: 'O+ve',
    phone: '+91 98410 88219',
    emergencyContact: '+91 98410 88219',
    allergies: 'None Known',
    reason: 'High Blood Pressure Check',
    status: 'Waiting',
    chiefComplaints: 'Persistent morning occipital headaches and mild dizziness for 1 week',
    diagnosis: 'Essential Hypertension (Stage 2) - ICD-10: I10',
    bpSystolic: '162',
    bpDiastolic: '98',
    pulse: '76',
    spO2: '99',
    temp: '98.4',
    weight: '64',
    prescriptions: [
      {
        id: '102-1',
        medicineName: 'Tab. Telmisartan',
        dosage: '40 mg',
        frequency: '1 - 0 - 0 (Morning)',
        duration: '30 days',
        instruction: 'Take before breakfast with water'
      },
      {
        id: '102-2',
        medicineName: 'Tab. Amlodipine',
        dosage: '5 mg',
        frequency: '0 - 0 - 1 (Night)',
        duration: '30 days',
        instruction: 'Take at night after food'
      }
    ]
  },
  {
    token: 'OPD-103',
    name: 'Anitha Sundaram',
    initials: 'AS',
    mrn: 'SNHC-2024-00003',
    age: '35',
    gender: 'Female',
    bloodGroup: 'A+ve',
    phone: '+91 97910 33418',
    emergencyContact: '+91 97910 33418',
    allergies: 'Sulfa Drugs',
    reason: 'Routine Health Screening',
    status: 'Waiting',
    chiefComplaints: 'General fatigue, mild lethargy, executive health screening checkup',
    diagnosis: 'Mild Microcytic Hypochromic Anemia - ICD-10: D50.9',
    bpSystolic: '118',
    bpDiastolic: '76',
    pulse: '72',
    spO2: '99',
    temp: '98.6',
    weight: '58',
    prescriptions: [
      {
        id: '103-1',
        medicineName: 'Tab. Autrin (Ferrous Fumarate + Folic Acid)',
        dosage: '1 Tab',
        frequency: '0 - 1 - 0 (After Lunch)',
        duration: '30 days',
        instruction: 'Take after food with citrus juice'
      },
      {
        id: '103-2',
        medicineName: 'Tab. Vitamin D3',
        dosage: '60,000 IU',
        frequency: 'Weekly Once',
        duration: '8 weeks',
        instruction: 'Take after milk'
      }
    ]
  },
  {
    token: 'OPD-104',
    name: 'Muthusamy Velu',
    initials: 'MV',
    mrn: 'SNHC-2024-00004',
    age: '54',
    gender: 'Male',
    bloodGroup: 'B+ve',
    phone: '+91 94440 19283',
    emergencyContact: '+91 94440 19283',
    allergies: 'None',
    reason: 'Diabetic Foot Review',
    status: 'Waiting',
    chiefComplaints: 'Bilateral sole numbness, pins and needles sensation, elevated morning fasting sugar',
    diagnosis: 'Type 2 Diabetes Mellitus with Peripheral Neuropathy - ICD-10: E11.4',
    bpSystolic: '134',
    bpDiastolic: '84',
    pulse: '80',
    spO2: '97',
    temp: '98.8',
    weight: '81',
    prescriptions: [
      {
        id: '104-1',
        medicineName: 'Tab. Metformin Hydrochloride',
        dosage: '500 mg',
        frequency: '1 - 0 - 1 (Morning & Night)',
        duration: '30 days',
        instruction: 'Take with or immediately after meals'
      },
      {
        id: '104-2',
        medicineName: 'Tab. Pregabalin',
        dosage: '75 mg',
        frequency: '0 - 0 - 1 (Night)',
        duration: '15 days',
        instruction: 'Take at bedtime for neuropathic relief'
      }
    ]
  }
];

export const OpdConsultationDesk: React.FC = () => {
  const [queue, setQueue] = useState<OpdPatientRecord[]>(() => {
    const saved = localStorage.getItem('hospital_opd_queue');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_OPD_QUEUE;
  });

  const [selectedToken, setSelectedToken] = useState<string>('OPD-101');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isDoctorPhotoModalOpen, setIsDoctorPhotoModalOpen] = useState(false);

  // New Walk-in Patient State
  const [newWalkIn, setNewWalkIn] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+ve',
    reason: '',
    phone: '',
    allergies: 'None',
    height: '170',
    weight: '68'
  });

  const [customInvestigation, setCustomInvestigation] = useState('');

  // Current active patient
  const activePatient = queue.find(p => p.token === selectedToken) || queue[0];

  // Prescription Form State
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '1 Tab',
    frequency: '1 - 0 - 1',
    duration: '5 days',
    instruction: 'After Food'
  });

  // Persist queue to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hospital_opd_queue', JSON.stringify(queue));
    } catch (e) {
      console.error(e);
    }
  }, [queue]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Update Active Patient Fields
  const updateActivePatient = (fields: Partial<OpdPatientRecord>) => {
    setQueue(prev =>
      prev.map(p => (p.token === activePatient.token ? { ...p, ...fields } : p))
    );
  };

  // BMI Calculation
  const getBmiDetails = (weightKg: string, heightCm?: string) => {
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm || '170') / 100;
    if (!w || !h || h <= 0) return { bmi: '--', status: 'Pending', badgeColor: 'text-slate-600 bg-slate-100' };
    const val = (w / (h * h)).toFixed(1);
    const num = parseFloat(val);
    let status = 'Normal Weight';
    let badgeColor = 'text-emerald-700 bg-emerald-50 border border-emerald-200';
    if (num < 18.5) {
      status = 'Underweight';
      badgeColor = 'text-blue-700 bg-blue-50 border border-blue-200';
    } else if (num >= 25 && num < 30) {
      status = 'Overweight';
      badgeColor = 'text-blue-800 bg-blue-100 border border-blue-300';
    } else if (num >= 30) {
      status = 'Obese';
      badgeColor = 'text-slate-800 bg-slate-200 border border-slate-300';
    }
    return { bmi: val, status, badgeColor };
  };

  const toggleInvestigation = (testName: string) => {
    const current = activePatient.orderedInvestigations || [];
    const exists = current.includes(testName);
    const updated = exists ? current.filter(t => t !== testName) : [...current, testName];
    updateActivePatient({ orderedInvestigations: updated });
  };

  const handleAddCustomInvestigation = () => {
    if (!customInvestigation.trim()) return;
    const current = activePatient.orderedInvestigations || [];
    if (!current.includes(customInvestigation.trim())) {
      updateActivePatient({ orderedInvestigations: [...current, customInvestigation.trim()] });
    }
    setCustomInvestigation('');
  };

  const handleDispatchInvestigations = () => {
    const count = (activePatient.orderedInvestigations || []).length;
    if (count === 0) {
      showToast('Please select at least one laboratory or radiology test to dispatch.');
      return;
    }
    showToast(`✓ Order of ${count} investigation(s) dispatched to LIS Pathology & RIS PACS worklist!`);
  };

  const setFollowUpDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const iso = d.toISOString().split('T')[0];
    updateActivePatient({ followUpDate: iso });
    showToast(`Follow-up appointment scheduled for ${iso} (+${days} days)`);
  };

  const toggleDietaryAdvice = (advice: string) => {
    const current = activePatient.dietaryAdvice || [];
    const exists = current.includes(advice);
    const updated = exists ? current.filter(a => a !== advice) : [...current, advice];
    updateActivePatient({ dietaryAdvice: updated });
  };

  const handleAddMedicine = () => {
    if (!newMed.name.trim()) return;
    const newRx: PrescriptionItem = {
      id: Date.now().toString(),
      medicineName: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency,
      duration: newMed.duration,
      instruction: newMed.instruction
    };
    updateActivePatient({
      prescriptions: [...activePatient.prescriptions, newRx]
    });
    setNewMed({ name: '', dosage: '1 Tab', frequency: '1 - 0 - 1', duration: '5 days', instruction: 'After Food' });
  };

  const handleRemoveMedicine = (id: string) => {
    updateActivePatient({
      prescriptions: activePatient.prescriptions.filter(rx => rx.id !== id)
    });
  };

  // Finalize consultation & advance queue
  const handleSaveConsultation = () => {
    // 1. Mark active patient Completed
    const nextQueue = queue.map(p => {
      if (p.token === activePatient.token) {
        return { ...p, status: 'Completed' as const };
      }
      return p;
    });

    // 2. Find next waiting patient and set to In-Consult
    const nextWaiting = nextQueue.find(p => p.token !== activePatient.token && p.status === 'Waiting');
    if (nextWaiting) {
      const advancedQueue = nextQueue.map(p =>
        p.token === nextWaiting.token ? { ...p, status: 'In-Consult' as const } : p
      );
      setQueue(advancedQueue);
      setSelectedToken(nextWaiting.token);
      showToast(`Consultation for ${activePatient.name} completed! Next: ${nextWaiting.name}`);
    } else {
      setQueue(nextQueue);
      showToast(`Consultation for ${activePatient.name} completed! Queue cleared.`);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  // Add Walk-in Patient to Queue
  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalkIn.name.trim()) return;

    const initials = newWalkIn.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const tokenNum = 100 + queue.length + 1;
    const newRecord: OpdPatientRecord = {
      token: `OPD-${tokenNum}`,
      name: newWalkIn.name.trim(),
      initials: initials || 'PT',
      mrn: `SNHC-2024-000${tokenNum}`,
      age: newWalkIn.age || '30',
      gender: newWalkIn.gender,
      bloodGroup: newWalkIn.bloodGroup,
      phone: newWalkIn.phone || '+91 90000 00000',
      emergencyContact: newWalkIn.phone || '+91 90000 00000',
      allergies: newWalkIn.allergies || 'None',
      reason: newWalkIn.reason || 'General Consultation',
      status: 'Waiting',
      chiefComplaints: newWalkIn.reason || 'General medical review',
      diagnosis: 'Under Clinical Evaluation',
      bpSystolic: '120',
      bpDiastolic: '80',
      pulse: '72',
      spO2: '98',
      temp: '98.4',
      weight: newWalkIn.weight || '65',
      height: newWalkIn.height || '170',
      prescriptions: []
    };

    setQueue([...queue, newRecord]);
    setIsAddPatientModalOpen(false);
    setNewWalkIn({
      name: '',
      age: '',
      gender: 'Male',
      bloodGroup: 'O+ve',
      reason: '',
      phone: '',
      allergies: 'None',
      height: '170',
      weight: '68'
    });
    showToast(`Added walk-in patient ${newRecord.name} (${newRecord.token}) to queue.`);
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="card-radial-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5 font-jakarta">
            <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-800">
              <Stethoscope className="w-6 h-6" />
            </span>
            OPD Doctor Consultation Desk
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Dr. Arun Kumar, MD, DM (Cardiology) • Room: 204 • Main Clinical Block
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddPatientModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            + Walk-in Intake
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-2.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-2xl text-xs font-bold flex items-center gap-2 border border-blue-200 dark:border-blue-800 transition-colors shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            Share Rx
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Rx
          </button>
          <button
            onClick={handleSaveConsultation}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95"
          >
            <FileCheck className="w-4 h-4" />
            Sign &amp; Finalize Consultation
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          Clinical consultation notes and electronic prescription (Rx) successfully saved and synced to the patient's EMR record.
        </div>
      )}

      {/* Main Grid: Left Queue, Right Consultation Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Today's OPD Queue */}
        <div className="card-radial-surface lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Today's OPD Queue
            </h2>
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-[11px] font-bold">
              {queue.filter(p => p.status !== 'Completed').length} Waiting
            </span>
          </div>

          <div className="space-y-2">
            {queue.map((p) => (
              <div
                key={p.token}
                onClick={() => setSelectedToken(p.token)}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                  selectedToken === p.token
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 shadow-sm'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    {p.token}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === 'Completed'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        : p.status === 'In-Consult'
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    {p.status === 'Completed' ? '✓ Completed' : p.status}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 mt-2">
                  <img
                    src={getPatientPhoto(p)}
                    alt={p.name}
                    className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-2xs"
                  />
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate flex-1">{p.name}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  <span>{p.age} / {p.gender}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium truncate ml-1">{p.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Patient Consultation */}
        <div className="lg:col-span-3 space-y-6">
          {/* Patient Card & Vitals */}
          <div className="card-radial-surface bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-6 transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div
                  onClick={() => setIsDoctorPhotoModalOpen(true)}
                  className="relative group cursor-pointer flex-shrink-0"
                  title="Click to inspect patient photo and verify identity"
                >
                  <img
                    src={getPatientPhoto(activePatient)}
                    alt={activePatient.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 dark:border-emerald-600 shadow-md group-hover:scale-105 group-hover:ring-4 group-hover:ring-emerald-400/20 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-600 text-white rounded-full shadow-xs">
                    <Eye className="w-3 h-3" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-slate-900 dark:text-white text-base">
                      {activePatient.name}
                    </h3>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-semibold">
                      {activePatient.mrn}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-md text-[10px] font-bold">
                      {activePatient.token}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsDoctorPhotoModalOpen(true)}
                      className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 transition cursor-pointer"
                      title="Click to check patient photo"
                    >
                      <Camera className="w-3 h-3" />
                      Check Photo
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Age: {activePatient.age} • {activePatient.gender} • Blood Group: {activePatient.bloodGroup} • Emergency: {activePatient.emergencyContact}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-3 py-1.5 rounded-xl font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                Allergies: {activePatient.allergies}
              </div>
            </div>

            {/* Vitals Input Row */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Patient Vitals & Biometrics
                </h4>
                {(() => {
                  const b = getBmiDetails(activePatient.weight, activePatient.height);
                  return (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">BMI:</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${b.badgeColor}`}>
                        {b.bmi} kg/m² • {b.status}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">BP (Sys/Dia)</span>
                  <div className="flex items-center gap-1 mt-1 font-bold text-slate-800 dark:text-white text-sm">
                    <input
                      type="text"
                      value={activePatient.bpSystolic}
                      onChange={(e) => updateActivePatient({ bpSystolic: e.target.value })}
                      className="w-10 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-1 text-center"
                    />
                    /
                    <input
                      type="text"
                      value={activePatient.bpDiastolic}
                      onChange={(e) => updateActivePatient({ bpDiastolic: e.target.value })}
                      className="w-10 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-1 text-center"
                    />
                    <span className="text-[10px] text-slate-400">mmHg</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Heart Rate</span>
                  <div className="flex items-center gap-1 mt-1 font-bold text-slate-800 dark:text-white text-sm">
                    <input
                      type="text"
                      value={activePatient.pulse}
                      onChange={(e) => updateActivePatient({ pulse: e.target.value })}
                      className="w-12 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-1 text-center"
                    />
                    <span className="text-[10px] text-slate-400">bpm</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">SpO2 Oxygen</span>
                  <div className="flex items-center gap-1 mt-1 font-bold text-slate-800 dark:text-white text-sm">
                    <input
                      type="text"
                      value={activePatient.spO2}
                      onChange={(e) => updateActivePatient({ spO2: e.target.value })}
                      className="w-12 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-1 text-center"
                    />
                    <span className="text-[10px] text-slate-400">%</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Temperature</span>
                  <div className="flex items-center gap-1 mt-1 font-bold text-slate-800 dark:text-white text-sm">
                    <input
                      type="text"
                      value={activePatient.temp}
                      onChange={(e) => updateActivePatient({ temp: e.target.value })}
                      className="w-12 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-1 text-center"
                    />
                    <span className="text-[10px] text-slate-400">°F</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Weight</span>
                  <div className="flex items-center gap-1 mt-1 font-bold text-slate-800 dark:text-white text-sm">
                    <input
                      type="text"
                      value={activePatient.weight}
                      onChange={(e) => updateActivePatient({ weight: e.target.value })}
                      className="w-12 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-1 text-center"
                    />
                    <span className="text-[10px] text-slate-400">kg</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Height</span>
                  <div className="flex items-center gap-1 mt-1 font-bold text-slate-800 dark:text-white text-sm">
                    <input
                      type="text"
                      value={activePatient.height || '170'}
                      onChange={(e) => updateActivePatient({ height: e.target.value })}
                      className="w-12 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-1 text-center"
                    />
                    <span className="text-[10px] text-slate-400">cm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Complaints & Diagnosis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Chief Complaints &amp; Clinical History
                </label>
                <textarea
                  rows={3}
                  value={activePatient.chiefComplaints}
                  onChange={(e) => updateActivePatient({ chiefComplaints: e.target.value })}
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Diagnosis &amp; ICD-10 Classification
                </label>
                <textarea
                  rows={3}
                  value={activePatient.diagnosis}
                  onChange={(e) => updateActivePatient({ diagnosis: e.target.value })}
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Diagnostic Investigation Orders (LIS Pathology & RIS Radiology) */}
          <div className="card-radial-surface bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4 transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Diagnostic Investigation Orders (LIS &amp; RIS Worklist)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Order lab blood panels and radiological scans directly dispatched to Pathology Lab &amp; PACS
                </p>
              </div>

              <button
                type="button"
                onClick={handleDispatchInvestigations}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Send className="w-4 h-4" />
                Dispatch to LIS / RIS ({activePatient.orderedInvestigations?.length || 0})
              </button>
            </div>

            {/* Quick Test Selection Chips */}
            <div>
              <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                Quick Requisition Catalog:
              </div>
              <div className="flex flex-wrap gap-2">
                {COMMON_INVESTIGATIONS.map(inv => {
                  const isSelected = activePatient.orderedInvestigations?.includes(inv.name);
                  return (
                    <button
                      key={inv.id}
                      type="button"
                      onClick={() => toggleInvestigation(inv.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${isSelected ? 'opacity-100 text-blue-600' : 'opacity-20'}`} />
                      {inv.name}
                      <span className="text-[10px] text-slate-400">({inv.dept.split(' ')[0]})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Investigation Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Type additional custom lab or imaging investigation..."
                value={customInvestigation}
                onChange={(e) => setCustomInvestigation(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomInvestigation(); } }}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddCustomInvestigation}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700"
              >
                + Add Investigation
              </button>
            </div>

            {/* Currently Ordered Chips Preview */}
            {activePatient.orderedInvestigations && activePatient.orderedInvestigations.length > 0 && (
              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/40">
                <div className="text-[11px] font-bold text-blue-900 dark:text-blue-300 mb-2">
                  Active Requisitions Ordered for {activePatient.name}:
                </div>
                <div className="flex flex-wrap gap-2">
                  {activePatient.orderedInvestigations.map((testName, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                    >
                      <FlaskConical className="w-3 h-3 text-blue-600" />
                      {testName}
                      <button
                        type="button"
                        onClick={() => toggleInvestigation(testName)}
                        className="text-slate-400 hover:text-rose-500 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Digital Prescription (Rx Builder) */}
          <div className="card-radial-surface bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-serif italic text-lg font-black">Rx</span>
                Digital Prescription Builder ({activePatient.name})
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {activePatient.prescriptions.length} medications prescribed
              </span>
            </div>

            {/* Table of Medicines */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    <th className="py-2.5 px-3 font-bold">Medication Name</th>
                    <th className="py-2.5 px-3 font-bold">Dosage</th>
                    <th className="py-2.5 px-3 font-bold">Frequency</th>
                    <th className="py-2.5 px-3 font-bold">Duration</th>
                    <th className="py-2.5 px-3 font-bold">Instructions</th>
                    <th className="py-2.5 px-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activePatient.prescriptions.map((rx) => (
                    <tr key={rx.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">{rx.medicineName}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{rx.dosage}</td>
                      <td className="py-3 px-3 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/30 rounded">
                        {rx.frequency}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{rx.duration}</td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 italic">{rx.instruction}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleRemoveMedicine(rx.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Remove medication"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {activePatient.prescriptions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-xs text-slate-400">
                        No medications prescribed yet for this consultation. Add medication below.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add Medicine Inline Form */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Add New Medication:</div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Medicine name (e.g. Tab. Metformin)"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="sm:col-span-2 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Dosage (500 mg)"
                  value={newMed.dosage}
                  onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  className="px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <select
                  value={newMed.frequency}
                  onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                  className="px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="1 - 0 - 1">1 - 0 - 1 (Morning &amp; Night)</option>
                  <option value="1 - 1 - 1">1 - 1 - 1 (TDS - Thrice Daily)</option>
                  <option value="1 - 0 - 0">1 - 0 - 0 (Morning Only)</option>
                  <option value="0 - 0 - 1">0 - 0 - 1 (Night Only)</option>
                  <option value="SOS">SOS (As Needed)</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Rx
                </button>
              </div>
            </div>
          </div>

          {/* Follow-up Consultation, Dietary & Clinical Advice */}
          <div className="card-radial-surface bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-5 transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Next Follow-up &amp; Discharge Advice ({activePatient.name})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Schedule next clinic review date, attach dietary regimen, and document patient home care guidance
                </p>
              </div>

              {activePatient.followUpDate && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  Next Review: {activePatient.followUpDate}
                </div>
              )}
            </div>

            {/* Quick Follow-up Scheduling */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Schedule Follow-up Visit:
              </label>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFollowUpDays(3)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 hover:border-emerald-300 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 transition"
                >
                  +3 Days
                </button>
                <button
                  type="button"
                  onClick={() => setFollowUpDays(7)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 hover:border-emerald-300 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 transition"
                >
                  +7 Days (1 Week)
                </button>
                <button
                  type="button"
                  onClick={() => setFollowUpDays(14)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 hover:border-emerald-300 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 transition"
                >
                  +14 Days (2 Weeks)
                </button>
                <button
                  type="button"
                  onClick={() => setFollowUpDays(30)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 hover:border-emerald-300 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 transition"
                >
                  +30 Days (1 Month)
                </button>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-slate-500 font-medium text-xs">Or pick date:</span>
                  <input
                    type="date"
                    value={activePatient.followUpDate || ''}
                    onChange={(e) => updateActivePatient({ followUpDate: e.target.value })}
                    className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Dietary & Lifestyle Regimen Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Dietary &amp; Activity Instructions:
              </label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_ADVICE_OPTIONS.map((advice, idx) => {
                  const isChecked = activePatient.dietaryAdvice?.includes(advice);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDietaryAdvice(advice)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition ${
                        isChecked
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${isChecked ? 'text-emerald-600 opacity-100' : 'opacity-20'}`} />
                      {advice}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Doctor's Special Clinical Instructions / Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Doctor's Special Clinical Remarks &amp; Home Care Instructions
              </label>
              <textarea
                rows={2}
                placeholder="e.g. S.O.S visit to ER if chest pain recurs or BP > 180 mmHg. Maintain blood pressure log daily."
                value={activePatient.doctorNotes || ''}
                onChange={(e) => updateActivePatient({ doctorNotes: e.target.value })}
                className="w-full text-xs p-3 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: ADD WALK-IN PATIENT */}
      {isAddPatientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Walk-in OPD Patient Intake</h3>
              </div>
              <button
                onClick={() => setIsAddPatientModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWalkIn} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Krishnan"
                  value={newWalkIn.name}
                  onChange={e => setNewWalkIn({ ...newWalkIn, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Age</label>
                  <input
                    type="number"
                    placeholder="42"
                    value={newWalkIn.age}
                    onChange={e => setNewWalkIn({ ...newWalkIn, age: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Gender</label>
                  <select
                    value={newWalkIn.gender}
                    onChange={e => setNewWalkIn({ ...newWalkIn, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Blood Group</label>
                  <select
                    value={newWalkIn.bloodGroup}
                    onChange={e => setNewWalkIn({ ...newWalkIn, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  >
                    <option value="O+ve">O Positive (O+ve)</option>
                    <option value="O-ve">O Negative (O-ve)</option>
                    <option value="A+ve">A Positive (A+ve)</option>
                    <option value="A-ve">A Negative (A-ve)</option>
                    <option value="B+ve">B Positive (B+ve)</option>
                    <option value="B-ve">B Negative (B-ve)</option>
                    <option value="AB+ve">AB Positive (AB+ve)</option>
                    <option value="AB-ve">AB Negative (AB-ve)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={newWalkIn.phone}
                    onChange={e => setNewWalkIn({ ...newWalkIn, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="170"
                    value={newWalkIn.height}
                    onChange={e => setNewWalkIn({ ...newWalkIn, height: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="68"
                    value={newWalkIn.weight}
                    onChange={e => setNewWalkIn({ ...newWalkIn, weight: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Visit Reason / Symptoms</label>
                <input
                  type="text"
                  placeholder="e.g. Fever, body pain for 3 days"
                  value={newWalkIn.reason}
                  onChange={e => setNewWalkIn({ ...newWalkIn, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddPatientModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-sm"
                >
                  Issue OPD Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal Share Modal for Prescription */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={`Electronic Prescription (Rx) - ${activePatient.name}`}
        summaryText={`PRESCRIPTION - SINDHU HEALTHCARE HOSPITAL\nPatient: ${activePatient.name} (${activePatient.mrn})\nDoctor: Dr. Arun Kumar, MD, DM (Cardiology)\nDiagnosis: ${activePatient.diagnosis}\nVitals: BP ${activePatient.bpSystolic}/${activePatient.bpDiastolic} mmHg | Pulse: ${activePatient.pulse} bpm | SpO2: ${activePatient.spO2}%\n\nMEDICATIONS:\n${activePatient.prescriptions.map((rx, idx) => `${idx + 1}. ${rx.medicineName} - ${rx.dosage} - ${rx.frequency} - ${rx.duration} (${rx.instruction})`).join('\n')}\n\nEmergency Helpline: +91 44 2833 4000`}
        csvData={activePatient.prescriptions.map((rx) => ({
          Medicine: rx.medicineName,
          Dosage: rx.dosage,
          Frequency: rx.frequency,
          Duration: rx.duration,
          Instructions: rx.instruction
        }))}
        csvFilename={`Prescription_${activePatient.name.replace(/\s+/g, '_')}_Rx.csv`}
      />

      {/* Doctor Patient Photo Modal */}
      <DoctorPatientPhotoModal
        isOpen={isDoctorPhotoModalOpen}
        onClose={() => setIsDoctorPhotoModalOpen(false)}
        patient={activePatient}
      />
    </div>
  );
};
