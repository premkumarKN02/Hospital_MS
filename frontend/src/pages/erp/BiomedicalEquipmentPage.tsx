import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Filter,
  Wrench,
  ShieldCheck,
  Building2,
  Activity,
  X,
  FileCheck
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { formatCurrency } from '../../utils/currencyService';

interface MedicalEquipment {
  id: string;
  assetTag: string;
  equipmentName: string;
  modelAndMake: string;
  department: 'ICU' | 'Operation Theatre' | 'Emergency Care' | 'Radiology' | 'Dialysis Unit' | 'Cardiac Cath Lab';
  serialNumber: string;
  purchaseDate: string;
  costValue: number;
  maintenanceType: 'Comprehensive AMC' | 'OEM Direct CMC' | 'In-House BioMed';
  vendorPartner: string;
  lastPpmDate: string;
  nextPpmDueDate: string;
  calibrationStatus: 'VALID_CERTIFIED' | 'PPM_DUE_SOON' | 'CALIBRATION_EXPIRED' | 'BREAKDOWN_DOWN';
  uptimePercentage: number;
  lastInspectionNotes?: string;
}

const INITIAL_EQUIPMENT: MedicalEquipment[] = [
  {
    id: 'BME-01',
    assetTag: 'BME-ICU-084',
    equipmentName: 'ICU Mechanical Ventilator (Servo-U)',
    modelAndMake: 'Getinge Maquet Servo-U High-End',
    department: 'ICU',
    serialNumber: 'SN-GQ-88102',
    purchaseDate: '2023-04-12',
    costValue: 1450000,
    maintenanceType: 'OEM Direct CMC',
    vendorPartner: 'Getinge Medical India',
    lastPpmDate: '2026-08-10',
    nextPpmDueDate: '2026-11-10',
    calibrationStatus: 'VALID_CERTIFIED',
    uptimePercentage: 99.8,
    lastInspectionNotes: 'Oxygen sensor calibrated, O-ring seals lubricated. Pressure sensor verified.'
  },
  {
    id: 'BME-02',
    assetTag: 'BME-OT-019',
    equipmentName: 'Anaesthesia Delivery Workstation',
    modelAndMake: 'Dräger Perseus A500',
    department: 'Operation Theatre',
    serialNumber: 'SN-DRG-99410',
    purchaseDate: '2022-11-20',
    costValue: 2200000,
    maintenanceType: 'Comprehensive AMC',
    vendorPartner: 'Dräger India Pvt Ltd',
    lastPpmDate: '2026-07-15',
    nextPpmDueDate: '2026-10-15',
    calibrationStatus: 'PPM_DUE_SOON',
    uptimePercentage: 99.4,
    lastInspectionNotes: 'Vaporizer interlocking test completed. Annual calibration due within 5 days.'
  },
  {
    id: 'BME-03',
    assetTag: 'BME-ER-003',
    equipmentName: 'Biphasic Defibrillator & Monitor',
    modelAndMake: 'Philips HeartStart MRx',
    department: 'Emergency Care',
    serialNumber: 'SN-PH-55109',
    purchaseDate: '2024-01-10',
    costValue: 580000,
    maintenanceType: 'OEM Direct CMC',
    vendorPartner: 'Philips Healthcare India',
    lastPpmDate: '2026-09-01',
    nextPpmDueDate: '2026-12-01',
    calibrationStatus: 'VALID_CERTIFIED',
    uptimePercentage: 100.0,
    lastInspectionNotes: 'Energy delivery test (200J/360J) matched 50-ohm test load. Battery backup 4.5 hours.'
  },
  {
    id: 'BME-04',
    assetTag: 'BME-RAD-001',
    equipmentName: '128-Slice Multi-Detector CT Scanner',
    modelAndMake: 'Siemens SOMATOM go.Top',
    department: 'Radiology',
    serialNumber: 'SN-SM-12004',
    purchaseDate: '2022-06-15',
    costValue: 38000000,
    maintenanceType: 'OEM Direct CMC',
    vendorPartner: 'Siemens Healthineers India',
    lastPpmDate: '2026-08-20',
    nextPpmDueDate: '2026-11-20',
    calibrationStatus: 'VALID_CERTIFIED',
    uptimePercentage: 99.6,
    lastInspectionNotes: 'Gantry rotation alignment checked. AERB QA test passed till 2028.'
  }
];

export const BiomedicalEquipmentPage: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<MedicalEquipment[]>(() => {
    const saved = localStorage.getItem('hospital_biomedical_equipment_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_EQUIPMENT;
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [isNewAssetModalOpen, setIsNewAssetModalOpen] = useState(false);
  const [loggingPpmAsset, setLoggingPpmAsset] = useState<MedicalEquipment | null>(null);

  // New Asset Form State
  const [newAsset, setNewAsset] = useState({
    assetTag: `BME-${Math.floor(100 + Math.random() * 900)}`,
    equipmentName: '',
    modelAndMake: '',
    department: 'ICU' as MedicalEquipment['department'],
    serialNumber: '',
    costValue: 500000,
    maintenanceType: 'OEM Direct CMC' as MedicalEquipment['maintenanceType'],
    vendorPartner: ''
  });

  // Log PPM Form State
  const [ppmNotes, setPpmNotes] = useState('Routine 90-day preventive calibration and electrical safety audit completed.');
  const [ppmNextDate, setPpmNextDate] = useState(
    new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );

  useEffect(() => {
    try {
      localStorage.setItem('hospital_biomedical_equipment_v1', JSON.stringify(equipmentList));
    } catch (e) {
      console.error(e);
    }
  }, [equipmentList]);

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.equipmentName.trim()) return;

    const created: MedicalEquipment = {
      id: `BME-${Date.now()}`,
      assetTag: newAsset.assetTag,
      equipmentName: newAsset.equipmentName,
      modelAndMake: newAsset.modelAndMake,
      department: newAsset.department,
      serialNumber: newAsset.serialNumber || `SN-${Math.floor(10000 + Math.random() * 90000)}`,
      purchaseDate: new Date().toISOString().split('T')[0],
      costValue: Number(newAsset.costValue),
      maintenanceType: newAsset.maintenanceType,
      vendorPartner: newAsset.vendorPartner || 'Authorized OEM Support',
      lastPpmDate: new Date().toISOString().split('T')[0],
      nextPpmDueDate: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().split('T')[0],
      calibrationStatus: 'VALID_CERTIFIED',
      uptimePercentage: 100.0,
      lastInspectionNotes: 'Initial commissioning and electrical safety testing verified.'
    };

    setEquipmentList([created, ...equipmentList]);
    setIsNewAssetModalOpen(false);
  };

  const handleSavePpm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggingPpmAsset) return;

    const todayStr = new Date().toISOString().split('T')[0];
    setEquipmentList((prev) =>
      prev.map((eq) =>
        eq.id === loggingPpmAsset.id
          ? {
              ...eq,
              lastPpmDate: todayStr,
              nextPpmDueDate: ppmNextDate,
              calibrationStatus: 'VALID_CERTIFIED',
              uptimePercentage: 100.0,
              lastInspectionNotes: ppmNotes
            }
          : eq
      )
    );
    setLoggingPpmAsset(null);
  };

  const totalCapitalAssets = equipmentList.length;
  const totalCapexValue = equipmentList.reduce((acc, eq) => acc + eq.costValue, 0);
  const dueCount = equipmentList.filter((eq) => eq.calibrationStatus === 'PPM_DUE_SOON').length;
  const averageUptime = (equipmentList.reduce((acc, eq) => acc + eq.uptimePercentage, 0) / totalCapitalAssets).toFixed(1);

  const filtered = equipmentList.filter((eq) => {
    const matchDept = selectedDept === 'ALL' || eq.department === selectedDept;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      eq.equipmentName.toLowerCase().includes(q) ||
      eq.assetTag.toLowerCase().includes(q) ||
      eq.modelAndMake.toLowerCase().includes(q) ||
      eq.vendorPartner.toLowerCase().includes(q);
    return matchDept && matchSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <Cpu className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-jakarta">
              Biomedical Engineering &amp; Asset Maintenance Desk
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Capital medical devices, Preventive Planned Maintenance (PPM), calibration logs, and uptime records
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNewAssetModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Register Device Asset
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold"
            title="Print Asset Registry"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Capital Equipment</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalCapitalAssets} Devices</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Valuation: {formatCurrency(totalCapexValue)}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 uppercase">Average Machine Uptime</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{averageUptime}%</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Zero critical ventilator failure</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-sm">
          <span className="text-xs font-bold text-amber-600 uppercase">PPM Calibration Due Soon</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{dueCount} Devices</p>
          <p className="text-[11px] text-amber-600 mt-0.5">OEM engineers notified</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-indigo-200/80 shadow-sm">
          <span className="text-xs font-bold text-indigo-600 uppercase">AMC / CMC Coverage</span>
          <p className="text-2xl font-black text-indigo-700 mt-1">100% Empanelled</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Annual contracts active</p>
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
            placeholder="Search equipment, asset tag, vendor..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Clinical Departments</option>
            <option value="ICU">ICU</option>
            <option value="Operation Theatre">Operation Theatre</option>
            <option value="Emergency Care">Emergency Care</option>
            <option value="Radiology">Radiology</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Asset Tag &amp; Make</th>
                <th className="px-5 py-3.5">Department &amp; Valuation</th>
                <th className="px-5 py-3.5">Maintenance Contract</th>
                <th className="px-5 py-3.5">PPM Window &amp; Due Date</th>
                <th className="px-5 py-3.5">Uptime Rating</th>
                <th className="px-5 py-3.5 text-right">Biomed Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((eq) => (
                <tr key={eq.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 text-xs">{eq.equipmentName}</div>
                    <div className="font-mono text-[11px] text-blue-700 mt-0.5">{eq.assetTag}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{eq.modelAndMake}</div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {eq.department}
                    </span>
                    <div className="text-xs font-bold text-slate-900 mt-1">{formatCurrency(eq.costValue)}</div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {eq.maintenanceType}
                    </span>
                    <div className="text-[11px] text-slate-500 mt-1">{eq.vendorPartner}</div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-xs font-semibold text-slate-800">Next: {eq.nextPpmDueDate}</div>
                    {eq.calibrationStatus === 'PPM_DUE_SOON' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 mt-1 inline-block animate-pulse">
                        PPM Due This Week
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1 inline-block">
                        Calibrated &amp; Certified
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-xs font-bold text-emerald-600">{eq.uptimePercentage}% Uptime</div>
                    <div className="text-[10px] text-slate-400">NABH Safe Standard</div>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => {
                        setLoggingPpmAsset(eq);
                        setPpmNotes(eq.lastInspectionNotes || 'Preventive maintenance checkup completed.');
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 ml-auto transition shadow-sm"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Log PPM
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log PPM Maintenance */}
      {loggingPpmAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <Wrench className="w-5 h-5 text-blue-600" />
                Log PPM Maintenance &amp; Calibration
              </h3>
              <button onClick={() => setLoggingPpmAsset(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePpm} className="space-y-3.5 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-0.5">
                <span className="font-bold text-blue-900 text-sm">{loggingPpmAsset.equipmentName}</span>
                <p className="text-blue-700 font-mono">{loggingPpmAsset.assetTag} · {loggingPpmAsset.department}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preventive Service Notes &amp; Measurements *</label>
                <textarea
                  rows={3}
                  required
                  value={ppmNotes}
                  onChange={(e) => setPpmNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Next PPM Due Date (90 Days Forward)</label>
                <input
                  type="date"
                  required
                  value={ppmNextDate}
                  onChange={(e) => setPpmNextDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setLoggingPpmAsset(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/25 transition"
                >
                  Record Calibration Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register Device Asset */}
      {isNewAssetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <Cpu className="w-5 h-5 text-blue-600" />
                Register Capital Medical Device
              </h3>
              <button onClick={() => setIsNewAssetModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Asset Tag *</label>
                  <input
                    type="text"
                    required
                    value={newAsset.assetTag}
                    onChange={(e) => setNewAsset({ ...newAsset, assetTag: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newAsset.department}
                    onChange={(e) => setNewAsset({ ...newAsset, department: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                  >
                    <option value="ICU">ICU</option>
                    <option value="Operation Theatre">Operation Theatre</option>
                    <option value="Emergency Care">Emergency Care</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Cardiac Cath Lab">Cardiac Cath Lab</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Equipment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-Flow Nasal Cannula (Optiflow)"
                  value={newAsset.equipmentName}
                  onChange={(e) => setNewAsset({ ...newAsset, equipmentName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Make &amp; Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Fisher & Paykel Airvo 2"
                    value={newAsset.modelAndMake}
                    onChange={(e) => setNewAsset({ ...newAsset, modelAndMake: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cost Valuation (INR)</label>
                  <input
                    type="number"
                    value={newAsset.costValue}
                    onChange={(e) => setNewAsset({ ...newAsset, costValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Maintenance Type</label>
                  <select
                    value={newAsset.maintenanceType}
                    onChange={(e) => setNewAsset({ ...newAsset, maintenanceType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                  >
                    <option value="OEM Direct CMC">OEM Direct CMC</option>
                    <option value="Comprehensive AMC">Comprehensive AMC</option>
                    <option value="In-House BioMed">In-House BioMed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vendor Partner</label>
                  <input
                    type="text"
                    placeholder="e.g. Fisher & Paykel India"
                    value={newAsset.vendorPartner}
                    onChange={(e) => setNewAsset({ ...newAsset, vendorPartner: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewAssetModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/25 transition"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
