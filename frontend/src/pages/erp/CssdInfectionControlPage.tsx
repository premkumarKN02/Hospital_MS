import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Filter,
  ShieldCheck,
  Building2,
  Trash2,
  X,
  Flame,
  Award,
  ArrowRight,
  Send
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';

interface AutoclaveBatch {
  id: string;
  cycleNumber: string;
  autoclaveUnit: string;
  trayDescription: string;
  packsCount: number;
  temperaturePressure: string;
  biologicalSporeTest: 'PASS_NEGATIVE' | 'TESTING_IN_PROGRESS';
  sterilizedAt: string;
  expiryDate: string;
  sterilityStatus: 'VALID_STERILE' | 'EXPIRING_SOON' | 'EXPIRED_REPROCESS' | 'ISSUED_TO_OT';
  responsibleTechnician: string;
  issuedTo?: string;
}

interface BmwLog {
  id: string;
  date: string;
  categoryColor: 'Yellow (Soiled / Anatomical)' | 'Red (Contaminated Plastics)' | 'White Translucent (Sharps)' | 'Blue (Glassware / Ampoules)';
  weightKg: number;
  departmentSource: string;
  barcodeBagNumber: string;
  handoverOfficer: string;
  cbwtfAgency: string;
}

const INITIAL_BATCHES: AutoclaveBatch[] = [
  {
    id: 'CSSD-01',
    cycleNumber: 'CYC-2026-104',
    autoclaveUnit: 'High-Vacuum Steam Sterilizer 1 (Tuttnauer)',
    trayDescription: 'Major Laparotomy Surgical Instrument Set (Tray 1 & 2)',
    packsCount: 8,
    temperaturePressure: '134°C @ 30.2 psi (Hold: 5 mins)',
    biologicalSporeTest: 'PASS_NEGATIVE',
    sterilizedAt: '2026-10-08 06:30 AM',
    expiryDate: '2026-10-15',
    sterilityStatus: 'VALID_STERILE',
    responsibleTechnician: 'Tech. Suresh (CSSD Certified)'
  },
  {
    id: 'CSSD-02',
    cycleNumber: 'CYC-2026-105',
    autoclaveUnit: 'Plasma Hydrogen Peroxide Sterilizer (STERRAD)',
    trayDescription: 'Flexible Video Bronchoscope & Laparoscopic Lenses',
    packsCount: 4,
    temperaturePressure: '55°C Low Temp Plasma (Hold: 45 mins)',
    biologicalSporeTest: 'PASS_NEGATIVE',
    sterilizedAt: '2026-10-08 08:15 AM',
    expiryDate: '2026-10-22',
    sterilityStatus: 'VALID_STERILE',
    responsibleTechnician: 'Tech. Preethi'
  },
  {
    id: 'CSSD-03',
    cycleNumber: 'CYC-2026-106',
    autoclaveUnit: 'High-Vacuum Steam Sterilizer 2',
    trayDescription: 'Orthopedic Power Drill & Saw Blades Set',
    packsCount: 6,
    temperaturePressure: '134°C @ 30.0 psi (Hold: 5 mins)',
    biologicalSporeTest: 'PASS_NEGATIVE',
    sterilizedAt: '2026-10-02 04:00 PM',
    expiryDate: '2026-10-09',
    sterilityStatus: 'EXPIRING_SOON',
    responsibleTechnician: 'Tech. Suresh'
  }
];

const INITIAL_WASTE_LOGS: BmwLog[] = [
  {
    id: 'BMW-01',
    date: '2026-10-08',
    categoryColor: 'Yellow (Soiled / Anatomical)',
    weightKg: 14.8,
    departmentSource: 'Operation Theatre Suites (OT 1-4)',
    barcodeBagNumber: 'BMW-YEL-8801',
    handoverOfficer: 'Nurse Supervisor Geetha',
    cbwtfAgency: 'GJ Multiclave Common Bio-Medical Facility'
  },
  {
    id: 'BMW-02',
    date: '2026-10-08',
    categoryColor: 'Red (Contaminated Plastics)',
    weightKg: 22.4,
    departmentSource: 'Intensive Critical Care Units (ICU)',
    barcodeBagNumber: 'BMW-RED-8802',
    handoverOfficer: 'Nurse Kavitha',
    cbwtfAgency: 'GJ Multiclave Common Bio-Medical Facility'
  },
  {
    id: 'BMW-03',
    date: '2026-10-08',
    categoryColor: 'White Translucent (Sharps)',
    weightKg: 4.2,
    departmentSource: 'Central Phlebotomy & Emergency Care',
    barcodeBagNumber: 'BMW-WHT-8803',
    handoverOfficer: 'Tech. Anand',
    cbwtfAgency: 'GJ Multiclave Common Bio-Medical Facility'
  }
];

export const CssdInfectionControlPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CSSD_STERILIZATION' | 'BMW_WASTE_LOG'>('CSSD_STERILIZATION');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNewCycleModalOpen, setIsNewCycleModalOpen] = useState(false);
  const [isNewWasteModalOpen, setIsNewWasteModalOpen] = useState(false);
  const [issuingBatch, setIssuingBatch] = useState<AutoclaveBatch | null>(null);
  const [targetOt, setTargetOt] = useState('OT 1 (General & GI Suite)');

  const [batches, setBatches] = useState<AutoclaveBatch[]>(() => {
    const saved = localStorage.getItem('hospital_cssd_batches_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BATCHES;
  });

  const [wasteLogs, setWasteLogs] = useState<BmwLog[]>(() => {
    const saved = localStorage.getItem('hospital_bmw_waste_logs_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_WASTE_LOGS;
  });

  // Form State
  const [newBatch, setNewBatch] = useState({
    cycleNumber: `CYC-2026-${Math.floor(100 + Math.random() * 900)}`,
    autoclaveUnit: 'High-Vacuum Steam Sterilizer 1',
    trayDescription: '',
    packsCount: 6,
    temperaturePressure: '134°C @ 30.2 psi (Hold: 5 mins)'
  });

  const [newWaste, setNewWaste] = useState({
    categoryColor: 'Yellow (Soiled / Anatomical)' as BmwLog['categoryColor'],
    weightKg: 10.5,
    departmentSource: 'Operation Theatre',
    barcodeBagNumber: `BMW-TAG-${Math.floor(8800 + Math.random() * 900)}`
  });

  useEffect(() => {
    try {
      localStorage.setItem('hospital_cssd_batches_v1', JSON.stringify(batches));
      localStorage.setItem('hospital_bmw_waste_logs_v1', JSON.stringify(wasteLogs));
    } catch (e) {
      console.error(e);
    }
  }, [batches, wasteLogs]);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatch.trayDescription.trim()) return;

    const created: AutoclaveBatch = {
      id: `CSSD-${Date.now()}`,
      cycleNumber: newBatch.cycleNumber,
      autoclaveUnit: newBatch.autoclaveUnit,
      trayDescription: newBatch.trayDescription,
      packsCount: Number(newBatch.packsCount),
      temperaturePressure: newBatch.temperaturePressure,
      biologicalSporeTest: 'PASS_NEGATIVE',
      sterilizedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiryDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
      sterilityStatus: 'VALID_STERILE',
      responsibleTechnician: 'Tech. Suresh (CSSD Certified)'
    };

    setBatches([created, ...batches]);
    setIsNewCycleModalOpen(false);
  };

  const handleCreateWaste = (e: React.FormEvent) => {
    e.preventDefault();
    const created: BmwLog = {
      id: `BMW-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      categoryColor: newWaste.categoryColor,
      weightKg: Number(newWaste.weightKg),
      departmentSource: newWaste.departmentSource,
      barcodeBagNumber: newWaste.barcodeBagNumber,
      handoverOfficer: 'Authorized Ward Supervisor',
      cbwtfAgency: 'GJ Multiclave Common Bio-Medical Facility'
    };

    setWasteLogs([created, ...wasteLogs]);
    setIsNewWasteModalOpen(false);
  };

  const handleExecuteIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issuingBatch) return;

    setBatches((prev) =>
      prev.map((b) =>
        b.id === issuingBatch.id
          ? {
              ...b,
              sterilityStatus: 'ISSUED_TO_OT',
              issuedTo: targetOt
            }
          : b
      )
    );
    setIssuingBatch(null);
  };

  const totalSterilePacks = batches.reduce((sum, b) => sum + b.packsCount, 0);
  const totalWasteKg = wasteLogs.reduce((sum, w) => sum + w.weightKg, 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <Sparkles className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-jakarta">
              CSSD Sterilization &amp; Bio-Medical Waste (BMW) Desk
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Autoclave Bowie-Dick &amp; biological spore tests, sterile surgical tray tracking, and barcoded CBMWTF waste disposal
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {activeTab === 'CSSD_STERILIZATION' ? (
            <button
              onClick={() => setIsNewCycleModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Log Sterilization Cycle
            </button>
          ) : (
            <button
              onClick={() => setIsNewWasteModalOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Log Barcoded Waste Bag
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold"
            title="Print Register"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Sterilized Instrument Trays</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalSterilePacks} Sealed Packs</p>
          <p className="text-[11px] text-slate-500 mt-0.5">100% biological indicator pass</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 uppercase">Biological Spore Test</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">G. Stearothermophilus Negative</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">NABH &amp; CDC Standard</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-sm">
          <span className="text-xs font-bold text-amber-600 uppercase">Daily BMW Waste Disposed</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{totalWasteKg.toFixed(1)} Kg</p>
          <p className="text-[11px] text-amber-600 mt-0.5">Barcoded CBMWTF manifests</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-blue-200/80 shadow-sm">
          <span className="text-xs font-bold text-blue-600 uppercase">Hospital Infection Rate (HAI)</span>
          <p className="text-2xl font-black text-blue-700 mt-1">0.12% Safe</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Benchmark &lt; 1.0%</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('CSSD_STERILIZATION')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'CSSD_STERILIZATION'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          CSSD Sterilization Cycles &amp; Autoclaves ({batches.length})
        </button>
        <button
          onClick={() => setActiveTab('BMW_WASTE_LOG')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'BMW_WASTE_LOG'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          Bio-Medical Waste (BMW) Barcode Manifest ({wasteLogs.length})
        </button>
      </div>

      {/* TAB 1: CSSD STERILIZATION */}
      {activeTab === 'CSSD_STERILIZATION' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Cycle # &amp; Autoclave</th>
                  <th className="px-5 py-3.5">Instrument Tray &amp; Packs</th>
                  <th className="px-5 py-3.5">Temp &amp; Pressure Hold</th>
                  <th className="px-5 py-3.5">Spore Biological Test</th>
                  <th className="px-5 py-3.5">Sterility Expiry</th>
                  <th className="px-5 py-3.5">Sterility Status</th>
                  <th className="px-5 py-3.5 text-right">Desk Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div className="font-mono font-bold text-slate-900 text-xs">{b.cycleNumber}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{b.autoclaveUnit}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 text-xs">{b.trayDescription}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{b.packsCount} Sealed Sterile Packs</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-mono text-xs font-bold text-slate-800">{b.temperaturePressure}</div>
                      <div className="text-[10px] text-slate-400">Class 5 Chemical Strip Pass</div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-max">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        G. Stearothermophilus Pass
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-xs text-slate-700">Sterilized: {b.sterilizedAt}</div>
                      <div className="text-xs text-slate-500 mt-0.5 font-medium">Valid Till: {b.expiryDate}</div>
                    </td>

                    <td className="px-5 py-4">
                      {b.sterilityStatus === 'ISSUED_TO_OT' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          Issued ({b.issuedTo})
                        </span>
                      ) : b.sterilityStatus === 'EXPIRING_SOON' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                          Expiring Soon
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Sterile &amp; Ready
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      {b.sterilityStatus !== 'ISSUED_TO_OT' ? (
                        <button
                          onClick={() => setIssuingBatch(b)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition shadow-sm"
                        >
                          Issue to OT
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold">Dispatched ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BIO-MEDICAL WASTE LOG */}
      {activeTab === 'BMW_WASTE_LOG' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Date &amp; Barcode Tag</th>
                  <th className="px-5 py-3.5">Color Category</th>
                  <th className="px-5 py-3.5">Hospital Department Source</th>
                  <th className="px-5 py-3.5">Net Weighed Quantity</th>
                  <th className="px-5 py-3.5">Authorized Officer</th>
                  <th className="px-5 py-3.5 text-right">Disposal Agency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wasteLogs.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div className="font-mono font-bold text-slate-900 text-xs">{w.barcodeBagNumber}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{w.date}</div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          w.categoryColor.includes('Yellow')
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : w.categoryColor.includes('Red')
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : w.categoryColor.includes('White')
                            ? 'bg-slate-100 text-slate-900 border border-slate-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}
                      >
                        {w.categoryColor}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800 text-xs">{w.departmentSource}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-mono font-bold text-slate-900 text-xs">{w.weightKg} Kg</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-xs text-slate-700">{w.handoverOfficer}</div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        GPS Vehicle Manifested ✓
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Issue Batch to OT */}
      {issuingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <Send className="w-5 h-5 text-emerald-600" />
                Issue Sterile Instrument Tray to OT
              </h3>
              <button onClick={() => setIssuingBatch(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteIssue} className="space-y-3.5 text-xs">
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
                <span className="font-bold text-emerald-900 text-sm">{issuingBatch.trayDescription}</span>
                <p className="text-emerald-800 font-mono">Cycle #{issuingBatch.cycleNumber} · {issuingBatch.packsCount} Sealed Packs</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Operation Theatre Suite *</label>
                <select
                  value={targetOt}
                  onChange={(e) => setTargetOt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="OT 1 (General & GI Surgery Suite)">OT 1 (General &amp; GI Surgery Suite)</option>
                  <option value="OT 2 (Orthopedics & Joint Suite)">OT 2 (Orthopedics &amp; Joint Suite)</option>
                  <option value="OT 3 (Cardiac Surgery Suite)">OT 3 (Cardiac Surgery Suite)</option>
                  <option value="OT 4 (Emergency Trauma Suite)">OT 4 (Emergency Trauma Suite)</option>
                  <option value="Cardiac Cath Lab">Cardiac Cath Lab</option>
                  <option value="Minor Procedure Daycare">Minor Procedure Daycare</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIssuingBatch(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/25 transition"
                >
                  Confirm Issue &amp; Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Sterilization Cycle */}
      {isNewCycleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Log Sterilization Cycle
              </h3>
              <button onClick={() => setIsNewCycleModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cycle Number *</label>
                  <input
                    type="text"
                    required
                    value={newBatch.cycleNumber}
                    onChange={(e) => setNewBatch({ ...newBatch, cycleNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Packs Count</label>
                  <input
                    type="number"
                    value={newBatch.packsCount}
                    onChange={(e) => setNewBatch({ ...newBatch, packsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instrument Tray Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Major Vascular Surgery Clamp Set"
                  value={newBatch.trayDescription}
                  onChange={(e) => setNewBatch({ ...newBatch, trayDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sterilizer Equipment</label>
                <select
                  value={newBatch.autoclaveUnit}
                  onChange={(e) => setNewBatch({ ...newBatch, autoclaveUnit: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                >
                  <option value="High-Vacuum Steam Sterilizer 1">High-Vacuum Steam Sterilizer 1</option>
                  <option value="High-Vacuum Steam Sterilizer 2">High-Vacuum Steam Sterilizer 2</option>
                  <option value="Plasma Hydrogen Peroxide Sterilizer (STERRAD)">Plasma Hydrogen Peroxide Sterilizer (STERRAD)</option>
                  <option value="Ethylene Oxide (ETO) Sterilizer">Ethylene Oxide (ETO) Sterilizer</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewCycleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/25 transition"
                >
                  Save Sterilization Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Waste Bag */}
      {isNewWasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <Trash2 className="w-5 h-5 text-rose-600" />
                Log Bio-Medical Waste Bag
              </h3>
              <button onClick={() => setIsNewWasteModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWaste} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Barcode Bag Tag *</label>
                  <input
                    type="text"
                    required
                    value={newWaste.barcodeBagNumber}
                    onChange={(e) => setNewWaste({ ...newWaste, barcodeBagNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weight (Kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newWaste.weightKg}
                    onChange={(e) => setNewWaste({ ...newWaste, weightKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">BMW Waste Category Color</label>
                <select
                  value={newWaste.categoryColor}
                  onChange={(e) => setNewWaste({ ...newWaste, categoryColor: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none cursor-pointer"
                >
                  <option value="Yellow (Soiled / Anatomical)">Yellow (Soiled / Anatomical / Infected)</option>
                  <option value="Red (Contaminated Plastics)">Red (Contaminated Tubing &amp; Bottles)</option>
                  <option value="White Translucent (Sharps)">White Translucent (Needles &amp; Sharps)</option>
                  <option value="Blue (Glassware / Ampoules)">Blue (Glass Vials &amp; Ampoules)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hospital Department Source</label>
                <select
                  value={newWaste.departmentSource}
                  onChange={(e) => setNewWaste({ ...newWaste, departmentSource: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                >
                  <option value="Operation Theatre Suites (OT 1-4)">Operation Theatre Suites (OT 1-4)</option>
                  <option value="Intensive Critical Care Units (ICU)">Intensive Critical Care Units (ICU)</option>
                  <option value="Emergency Care & Triage">Emergency Care &amp; Triage</option>
                  <option value="Pathology Lab & Blood Bank">Pathology Lab &amp; Blood Bank</option>
                  <option value="General Inpatient Wards">General Inpatient Wards</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewWasteModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md shadow-rose-600/25 transition"
                >
                  Log Waste Manifest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
