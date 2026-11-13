import React, { useState, useEffect } from 'react';
import {
  Bed,
  CheckCircle,
  AlertCircle,
  Clock,
  UserPlus,
  ArrowRightLeft,
  LogOut,
  Filter,
  Building,
  RefreshCw,
  CheckCircle2,
  Printer,
  Share2,
  Search,
  X,
  Activity
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { ipdApi } from '../../lib/api';
import { formatCurrency } from '../../utils/currencyService';

interface BedItem {
  id: string;
  bedNumber: string;
  wardName: string;
  roomNumber: string;
  bedType: 'ICU' | 'GENERAL' | 'PRIVATE';
  status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'RESERVED';
  patientName?: string;
  patientId?: string;
  admissionDate?: string;
  attendingDoctor?: string;
  dailyRate: number;
}

const DEFAULT_BEDS: BedItem[] = [
  {
    id: '1',
    bedNumber: 'ICU-BED-01',
    wardName: 'Intensive Coronary Care Unit (ICCU)',
    roomNumber: 'ICU-ROOM-A',
    bedType: 'ICU',
    status: 'OCCUPIED',
    patientName: 'K. Ramachandran',
    patientId: 'SNHC-2024-00088',
    admissionDate: '2026-10-04',
    attendingDoctor: 'Dr. Arun Kumar',
    dailyRate: 5000
  },
  {
    id: '2',
    bedNumber: 'ICU-BED-02',
    wardName: 'Intensive Coronary Care Unit (ICCU)',
    roomNumber: 'ICU-ROOM-A',
    bedType: 'ICU',
    status: 'AVAILABLE',
    dailyRate: 5000
  },
  {
    id: '3',
    bedNumber: 'ICU-BED-03',
    wardName: 'Medical Intensive Care Unit (MICU)',
    roomNumber: 'MICU-BAY-1',
    bedType: 'ICU',
    status: 'OCCUPIED',
    patientName: 'S. Balakrishnan',
    patientId: 'SNHC-2024-00109',
    admissionDate: '2026-10-06',
    attendingDoctor: 'Dr. K. Sindhu',
    dailyRate: 5500
  },
  {
    id: '4',
    bedNumber: 'ICU-BED-04',
    wardName: 'Medical Intensive Care Unit (MICU)',
    roomNumber: 'MICU-BAY-1',
    bedType: 'ICU',
    status: 'AVAILABLE',
    dailyRate: 5500
  },
  {
    id: '5',
    bedNumber: 'GWM-BED-01',
    wardName: 'General Medical Ward (Male)',
    roomNumber: 'GWM-BAY-1',
    bedType: 'GENERAL',
    status: 'OCCUPIED',
    patientName: 'M. Selvaraj',
    patientId: 'SNHC-2024-00102',
    admissionDate: '2026-10-05',
    attendingDoctor: 'Dr. Sindhu Rajagopalan',
    dailyRate: 800
  },
  {
    id: '6',
    bedNumber: 'GWM-BED-02',
    wardName: 'General Medical Ward (Male)',
    roomNumber: 'GWM-BAY-1',
    bedType: 'GENERAL',
    status: 'AVAILABLE',
    dailyRate: 800
  },
  {
    id: '7',
    bedNumber: 'GWM-BED-03',
    wardName: 'General Medical Ward (Male)',
    roomNumber: 'GWM-BAY-2',
    bedType: 'GENERAL',
    status: 'OCCUPIED',
    patientName: 'K. Murugan',
    patientId: 'SNHC-2024-00114',
    admissionDate: '2026-10-07',
    attendingDoctor: 'Dr. Arun Kumar',
    dailyRate: 800
  },
  {
    id: '8',
    bedNumber: 'GWM-BED-04',
    wardName: 'General Medical Ward (Male)',
    roomNumber: 'GWM-BAY-2',
    bedType: 'GENERAL',
    status: 'AVAILABLE',
    dailyRate: 800
  },
  {
    id: '9',
    bedNumber: 'GWF-BED-01',
    wardName: 'General Medical Ward (Female)',
    roomNumber: 'GWF-BAY-1',
    bedType: 'GENERAL',
    status: 'AVAILABLE',
    dailyRate: 800
  },
  {
    id: '10',
    bedNumber: 'GWF-BED-02',
    wardName: 'General Medical Ward (Female)',
    roomNumber: 'GWF-BAY-1',
    bedType: 'GENERAL',
    status: 'OCCUPIED',
    patientName: 'Kamala Kannan',
    patientId: 'SNHC-2024-00118',
    admissionDate: '2026-10-06',
    attendingDoctor: 'Dr. P. Sundaram',
    dailyRate: 800
  },
  {
    id: '11',
    bedNumber: 'GWF-BED-03',
    wardName: 'General Medical Ward (Female)',
    roomNumber: 'GWF-BAY-2',
    bedType: 'GENERAL',
    status: 'AVAILABLE',
    dailyRate: 800
  },
  {
    id: '12',
    bedNumber: 'GWF-BED-04',
    wardName: 'General Medical Ward (Female)',
    roomNumber: 'GWF-BAY-2',
    bedType: 'GENERAL',
    status: 'CLEANING',
    dailyRate: 800
  },
  {
    id: '13',
    bedNumber: 'DLX-BED-301',
    wardName: 'Deluxe Private Suite Wing',
    roomNumber: 'DELUXE-301',
    bedType: 'PRIVATE',
    status: 'OCCUPIED',
    patientName: 'P. Meenakshi Sundaram',
    patientId: 'SNHC-2024-00095',
    admissionDate: '2026-10-03',
    attendingDoctor: 'Dr. Arun Kumar',
    dailyRate: 3500
  },
  {
    id: '14',
    bedNumber: 'DLX-BED-302',
    wardName: 'Deluxe Private Suite Wing',
    roomNumber: 'DELUXE-302',
    bedType: 'PRIVATE',
    status: 'CLEANING',
    dailyRate: 3500
  },
  {
    id: '15',
    bedNumber: 'DLX-BED-303',
    wardName: 'Deluxe Private Suite Wing',
    roomNumber: 'DELUXE-303',
    bedType: 'PRIVATE',
    status: 'AVAILABLE',
    dailyRate: 3500
  },
  {
    id: '16',
    bedNumber: 'DLX-BED-304',
    wardName: 'Deluxe Private Suite Wing',
    roomNumber: 'DELUXE-304',
    bedType: 'PRIVATE',
    status: 'AVAILABLE',
    dailyRate: 3500
  }
];

export const IpdBedMatrixPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ICU' | 'GENERAL' | 'PRIVATE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBed, setSelectedBed] = useState<BedItem | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [targetBedId, setTargetBedId] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [admitPatientName, setAdmitPatientName] = useState('');
  const [admitPatientId, setAdmitPatientId] = useState('');
  const [admitDoctor, setAdmitDoctor] = useState('Dr. Arun Kumar');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bed state with localStorage persistence
  const [beds, setBeds] = useState<BedItem[]>(() => {
    const saved = localStorage.getItem('hospital_ipd_beds');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_BEDS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('hospital_ipd_beds', JSON.stringify(beds));
    } catch (e) {
      console.error(e);
    }
  }, [beds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBedClick = (bed: BedItem) => {
    setSelectedBed(bed);
    setIsActionModalOpen(true);
  };

  const handleAdmit = () => {
    if (!selectedBed || !admitPatientName.trim()) return;

    const patientId = admitPatientId.trim() || 'SNHC-IPD-' + Math.floor(10000 + Math.random() * 90000);
    const updatedBeds = beds.map(b =>
      b.id === selectedBed.id
        ? {
            ...b,
            status: 'OCCUPIED' as const,
            patientName: admitPatientName.trim(),
            patientId,
            admissionDate: new Date().toISOString().split('T')[0],
            attendingDoctor: admitDoctor
          }
        : b
    );

    setBeds(updatedBeds);
    setIsActionModalOpen(false);
    setAdmitPatientName('');
    setAdmitPatientId('');
    showToast(`Patient ${admitPatientName} admitted to ${selectedBed.bedNumber}.`);
  };

  const handleDischarge = () => {
    if (!selectedBed) return;

    const dischargedName = selectedBed.patientName || 'Patient';
    const updatedBeds = beds.map(b =>
      b.id === selectedBed.id
        ? {
            ...b,
            status: 'CLEANING' as const,
            patientName: undefined,
            patientId: undefined,
            admissionDate: undefined,
            attendingDoctor: undefined
          }
        : b
    );

    setBeds(updatedBeds);
    setIsActionModalOpen(false);
    showToast(`${dischargedName} discharged. ${selectedBed.bedNumber} marked for sanitization.`);
  };

  const handleMarkCleaned = () => {
    if (!selectedBed) return;

    const updatedBeds = beds.map(b =>
      b.id === selectedBed.id ? { ...b, status: 'AVAILABLE' as const } : b
    );

    setBeds(updatedBeds);
    setIsActionModalOpen(false);
    showToast(`${selectedBed.bedNumber} sanitized & ready for new admissions.`);
  };

  const handleTransferBed = () => {
    if (!selectedBed || !targetBedId) return;

    const targetBed = beds.find(b => b.id === targetBedId);
    if (!targetBed || targetBed.status !== 'AVAILABLE') return;

    const patientName = selectedBed.patientName;
    const patientId = selectedBed.patientId;
    const admissionDate = selectedBed.admissionDate;
    const attendingDoctor = selectedBed.attendingDoctor;

    const updatedBeds = beds.map(b => {
      if (b.id === targetBedId) {
        return {
          ...b,
          status: 'OCCUPIED' as const,
          patientName,
          patientId,
          admissionDate,
          attendingDoctor
        };
      }
      if (b.id === selectedBed.id) {
        return {
          ...b,
          status: 'CLEANING' as const,
          patientName: undefined,
          patientId: undefined,
          admissionDate: undefined,
          attendingDoctor: undefined
        };
      }
      return b;
    });

    setBeds(updatedBeds);
    setIsTransferModalOpen(false);
    setIsActionModalOpen(false);
    setTargetBedId('');
    showToast(`Transferred ${patientName} from ${selectedBed.bedNumber} to ${targetBed.bedNumber}.`);
  };

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status === 'OCCUPIED').length;
  const availableBeds = beds.filter((b) => b.status === 'AVAILABLE').length;
  const cleaningBeds = beds.filter((b) => b.status === 'CLEANING').length;

  const availableDestinationBeds = beds.filter(b => b.status === 'AVAILABLE');

  const filteredBeds = beds.filter(b => {
    const matchesFilter = selectedFilter === 'ALL' || b.bedType === selectedFilter;
    const matchesSearch =
      b.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.wardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.patientName && b.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.patientId && b.patientId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans animate-fade-in overflow-x-hidden w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="card-radial-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5 font-jakarta">
            <span className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-2xl border border-blue-100 dark:border-blue-800">
              <Bed className="w-6 h-6" />
            </span>
            IPD Inpatient Wards &amp; Live Bed Matrix
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Real-time census across ICCU, MICU, General Medical Wards, and Deluxe Private Suites
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Share & Print Buttons */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            aria-label="Share Census"
            className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-2xl text-xs font-bold flex items-center gap-2 border border-blue-200 dark:border-blue-800 transition-colors shadow-sm cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            Share Census
          </button>
          <button
            onClick={() => window.print()}
            aria-label="Print Census Report"
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Census
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-radial-surface bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-black">
            {totalBeds}
          </div>
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-300 font-bold uppercase">Total Beds</span>
            <p className="text-lg font-black text-slate-900 dark:text-white">{totalBeds} Beds</p>
          </div>
        </div>

        <div className="card-radial-surface bg-white dark:bg-slate-900 p-5 rounded-3xl border border-rose-100 dark:border-rose-950/60 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black">
            {occupiedBeds}
          </div>
          <div>
            <span className="text-xs text-rose-500 font-bold uppercase">Occupied (Admitted)</span>
            <p className="text-lg font-black text-slate-900 dark:text-white">{occupiedBeds} Beds</p>
          </div>
        </div>

        <div className="card-radial-surface bg-white dark:bg-slate-900 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-950/60 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
            {availableBeds}
          </div>
          <div>
            <span className="text-xs text-emerald-500 font-bold uppercase">Available Ready</span>
            <p className="text-lg font-black text-slate-900 dark:text-white">{availableBeds} Beds</p>
          </div>
        </div>

        <div className="card-radial-surface bg-white dark:bg-slate-900 p-5 rounded-3xl border border-sky-100 dark:border-sky-950/60 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-black">
            {cleaningBeds}
          </div>
          <div>
            <span className="text-xs text-sky-600 dark:text-sky-400 font-bold uppercase">Terminal Sanitization</span>
            <p className="text-lg font-black text-slate-900 dark:text-white">{cleaningBeds} Beds</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bed number, patient name, or ward..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700">
          {(['ALL', 'ICU', 'GENERAL', 'PRIVATE'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === filter
                  ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {filter === 'ALL' ? 'All Wards' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Bed Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => (
          <div
            key={bed.id}
            onClick={() => handleBedClick(bed)}
            className={`card-radial-surface p-5 rounded-3xl border transition-all cursor-pointer hover:shadow-md relative overflow-hidden ${
              bed.status === 'AVAILABLE'
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                : bed.status === 'OCCUPIED'
                ? 'bg-blue-50/30 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/60'
                : 'bg-sky-50/40 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800/60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-black text-slate-700 dark:text-slate-200">
                  {bed.bedNumber}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[150px]">
                  {bed.wardName}
                </p>
              </div>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  bed.status === 'AVAILABLE'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : bed.status === 'OCCUPIED'
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    : 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                }`}
              >
                {bed.status}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-1.5">
              {bed.status === 'OCCUPIED' ? (
                <>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {bed.patientName}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {bed.patientId} • Dr. {bed.attendingDoctor?.split(' ').pop()}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Admitted: {bed.admissionDate}</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                      <Activity className="w-3 h-3" />
                      Stable
                    </span>
                  </div>
                </>
              ) : bed.status === 'AVAILABLE' ? (
                <div className="flex items-center justify-between py-1">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Ready for Intake
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    + Admit
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between py-1">
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Sanitizing &amp; UV
                  </p>
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                    Mark Done
                  </span>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-semibold text-slate-600 dark:text-slate-300">{bed.bedType}</span>
              <span>{formatCurrency(bed.dailyRate)}/day</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bed Action Modal */}
      {isActionModalOpen && selectedBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {selectedBed.bedNumber} ({selectedBed.wardName})
                </h3>
              </div>
              <button
                onClick={() => setIsActionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedBed.status === 'AVAILABLE' ? (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600 dark:text-slate-400">
                  Assign and admit an inpatient to this vacant bed:
                </p>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={admitPatientName}
                    onChange={(e) => setAdmitPatientName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Attending Consultant Doctor</label>
                  <select
                    value={admitDoctor}
                    onChange={(e) => setAdmitDoctor(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Dr. Arun Kumar">Dr. Arun Kumar (Cardiology)</option>
                    <option value="Dr. Sindhu Rajagopalan">Dr. Sindhu Rajagopalan (Medicine)</option>
                    <option value="Dr. P. Sundaram">Dr. P. Sundaram (Orthopedics)</option>
                    <option value="Dr. Joseph">Dr. Joseph (Emergency)</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleAdmit}
                    disabled={!admitPatientName.trim()}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-md"
                  >
                    Confirm Admission
                  </button>
                  <button
                    onClick={() => setIsActionModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : selectedBed.status === 'OCCUPIED' ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200">Current Patient: {selectedBed.patientName}</p>
                  <p className="text-slate-500 dark:text-slate-400">MRN: {selectedBed.patientId}</p>
                  <p className="text-slate-500 dark:text-slate-400">Admitted: {selectedBed.admissionDate}</p>
                  <p className="text-slate-500 dark:text-slate-400">Attending: {selectedBed.attendingDoctor}</p>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => setIsTransferModalOpen(true)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    Transfer Patient to Another Bed
                  </button>
                  <button
                    onClick={handleDischarge}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Discharge &amp; Mark for Sanitization
                  </button>
                  <button
                    onClick={() => setIsActionModalOpen(false)}
                    className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600 dark:text-slate-400">
                  Has this bed finished terminal cleaning, UV disinfection, and linen exchange?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleMarkCleaned}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md"
                  >
                    Mark Ready for Admission
                  </button>
                  <button
                    onClick={() => setIsActionModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bed Transfer Modal */}
      {isTransferModalOpen && selectedBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Transfer Patient Bed
                </h3>
              </div>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs space-y-1">
              <p className="font-bold text-slate-800 dark:text-slate-200">Patient: {selectedBed.patientName}</p>
              <p className="text-slate-500">From: {selectedBed.bedNumber} ({selectedBed.wardName})</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Destination Vacant Bed *
                </label>
                <select
                  value={targetBedId}
                  onChange={(e) => setTargetBedId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  <option value="">-- Choose Vacant Bed --</option>
                  {availableDestinationBeds.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.bedNumber} - {b.wardName} ({b.bedType} - {formatCurrency(b.dailyRate)}/day)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleTransferBed}
                  disabled={!targetBedId}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-md"
                >
                  Confirm Bed Transfer
                </button>
                <button
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Universal Share Modal for Bed Census */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Inpatient Ward Bed Census & Live Matrix"
        summaryText={`HOSPITAL INPATIENT BED CENSUS REPORT\nTotal Beds: ${totalBeds} | Occupied: ${occupiedBeds} | Available: ${availableBeds} | Sanitizing: ${cleaningBeds}\n\nLive Bed Status:\n${beds.map(b => `• ${b.bedNumber} (${b.bedType}) - ${b.status} ${b.patientName ? `[${b.patientName}]` : ''}`).join('\n')}\n\nGenerated from Sarvam Hospital Management Suite`}
        csvData={beds.map(b => ({
          BedNumber: b.bedNumber,
          Ward: b.wardName,
          Room: b.roomNumber,
          Type: b.bedType,
          Status: b.status,
          Patient: b.patientName || 'None',
          PatientID: b.patientId || 'N/A',
          AdmissionDate: b.admissionDate || 'N/A',
          Doctor: b.attendingDoctor || 'N/A',
          DailyRate: `₹${b.dailyRate}`
        }))}
        csvFilename="Hospital_Bed_Matrix_Census.csv"
      />
    </div>
  );
};
