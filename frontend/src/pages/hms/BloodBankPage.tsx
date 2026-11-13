import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Filter,
  ThermometerSnowflake,
  ShieldCheck,
  User,
  X,
  Heart
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { enterpriseStore } from '../../services/enterpriseDataStore';

interface BloodUnit {
  id: string;
  unitBagNumber: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  component: 'Packed Red Blood Cells (PRBC)' | 'Fresh Frozen Plasma (FFP)' | 'Platelet Concentrate' | 'Cryoprecipitate';
  donorId: string;
  collectionDate: string;
  expiryDate: string;
  storageBay: string;
  storageTemp: string;
  serologyStatus: 'TESTED_NEGATIVE' | 'TESTING_PENDING';
  reservationStatus: 'AVAILABLE' | 'RESERVED_FOR_SURGERY' | 'CROSS_MATCH_VERIFIED';
  reservedPatientMrn?: string;
}

export const BloodBankPage: React.FC = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [selectedComponent, setSelectedComponent] = useState<string>('ALL');
  const [isNewBagModalOpen, setIsNewBagModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cross-Match & Reservation Modal State
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [selectedUnitForReserve, setSelectedUnitForReserve] = useState<BloodUnit | null>(null);
  const [reserveForm, setReserveForm] = useState({
    patientUhid: 'UHID-88214',
    patientName: 'Karthik Narayanan',
    targetDept: 'OT 1 - Cardiothoracic Surgery',
    urgency: 'URGENT',
    crossmatchCompatible: true,
    transfusionOfficer: 'Dr. S. Varma (Blood Transfusion Officer)'
  });

  // Cold Chain OT Dispatch Modal State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedUnitForIssue, setSelectedUnitForIssue] = useState<BloodUnit | null>(null);
  const [issueForm, setIssueForm] = useState({
    transportTemp: '3.6°C',
    carrierBoxId: 'COLD-BOX-04',
    receivingNurse: 'Staff Nurse Deepa R. (OT Core)',
    transitBagSeal: 'SEAL-2026-992'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [units, setUnits] = useState<BloodUnit[]>(() => {
    const saved = localStorage.getItem('hospital_blood_bank_units');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
    {
      id: 'BB-01',
      unitBagNumber: 'BAG-2026-8801',
      bloodGroup: 'O+',
      component: 'Packed Red Blood Cells (PRBC)',
      donorId: 'DNR-5510',
      collectionDate: '2026-09-28',
      expiryDate: '2026-11-09',
      storageBay: 'Blood Refrigerator Bay 1',
      storageTemp: '3.8°C',
      serologyStatus: 'TESTED_NEGATIVE',
      reservationStatus: 'AVAILABLE'
    },
    {
      id: 'BB-02',
      unitBagNumber: 'BAG-2026-8802',
      bloodGroup: 'B+',
      component: 'Packed Red Blood Cells (PRBC)',
      donorId: 'DNR-5514',
      collectionDate: '2026-10-02',
      expiryDate: '2026-11-13',
      storageBay: 'Blood Refrigerator Bay 2',
      storageTemp: '4.1°C',
      serologyStatus: 'TESTED_NEGATIVE',
      reservationStatus: 'RESERVED_FOR_SURGERY',
      reservedPatientMrn: 'UHID-88214 (Karthik N. - OT 1)'
    },
    {
      id: 'BB-03',
      unitBagNumber: 'BAG-2026-8803',
      bloodGroup: 'A+',
      component: 'Fresh Frozen Plasma (FFP)',
      donorId: 'DNR-5520',
      collectionDate: '2026-08-15',
      expiryDate: '2027-08-15',
      storageBay: 'Deep Freezer Unit -30°C',
      storageTemp: '-31.2°C',
      serologyStatus: 'TESTED_NEGATIVE',
      reservationStatus: 'AVAILABLE'
    },
    {
      id: 'BB-04',
      unitBagNumber: 'BAG-2026-8804',
      bloodGroup: 'O-',
      component: 'Packed Red Blood Cells (PRBC)',
      donorId: 'DNR-5529 (Universal Donor)',
      collectionDate: '2026-10-01',
      expiryDate: '2026-11-12',
      storageBay: 'Emergency Trauma Reserve 1',
      storageTemp: '3.5°C',
      serologyStatus: 'TESTED_NEGATIVE',
      reservationStatus: 'AVAILABLE'
    },
    {
      id: 'BB-05',
      unitBagNumber: 'BAG-2026-8805',
      bloodGroup: 'AB+',
      component: 'Platelet Concentrate',
      donorId: 'DNR-5533',
      collectionDate: '2026-10-06',
      expiryDate: '2026-10-11', // 5-day lifespan
      storageBay: 'Platelet Agitator 22°C',
      storageTemp: '22.1°C',
      serologyStatus: 'TESTED_NEGATIVE',
      reservationStatus: 'CROSS_MATCH_VERIFIED',
      reservedPatientMrn: 'UHID-88235 (ICU Oncology)'
    }
  ];
  });

  const [newBag, setNewBag] = useState({
    unitBagNumber: `BAG-2026-${Math.floor(8810 + Math.random() * 100)}`,
    bloodGroup: 'O+' as const,
    component: 'Packed Red Blood Cells (PRBC)' as const,
    donorId: `DNR-${Math.floor(5550 + Math.random() * 100)}`,
    collectionDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 42 * 24 * 3600 * 1000).toISOString().split('T')[0],
    storageBay: 'Chamber 1'
  });

  // Persist blood units to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hospital_blood_bank_units', JSON.stringify(units));
    } catch (e) {
      console.error(e);
    }
  }, [units]);

  const handleAddBag = (e: React.FormEvent) => {
    e.preventDefault();
    const created: BloodUnit = {
      id: `BB-0${units.length + 6}`,
      unitBagNumber: newBag.unitBagNumber,
      bloodGroup: newBag.bloodGroup,
      component: newBag.component,
      donorId: newBag.donorId,
      collectionDate: newBag.collectionDate,
      expiryDate: newBag.expiryDate,
      storageBay: newBag.storageBay,
      storageTemp: newBag.component.includes('Plasma') ? '-30.5°C' : '4.0°C',
      serologyStatus: 'TESTED_NEGATIVE',
      reservationStatus: 'AVAILABLE'
    };

    setUnits([created, ...units]);
    setIsNewBagModalOpen(false);
  };

  const handleOpenReserveModal = (unit: BloodUnit) => {
    setSelectedUnitForReserve(unit);
    setIsReserveModalOpen(true);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitForReserve) return;
    
    enterpriseStore.reserveBloodUnits(
      selectedUnitForReserve.bloodGroup,
      selectedUnitForReserve.component.includes('PRBC') ? 'PRBC' : 'FFP',
      1
    );

    setUnits(prev => prev.map(u => {
      if (u.id === selectedUnitForReserve.id) {
        return {
          ...u,
          reservationStatus: 'RESERVED_FOR_SURGERY',
          reservedPatientMrn: `${reserveForm.patientUhid} (${reserveForm.patientName} - ${reserveForm.targetDept})`
        };
      }
      return u;
    }));

    showToast(`Blood unit ${selectedUnitForReserve.unitBagNumber} (${selectedUnitForReserve.bloodGroup}) successfully reserved for ${reserveForm.patientName}!`);
    setIsReserveModalOpen(false);
    setSelectedUnitForReserve(null);
  };

  const handleOpenIssueModal = (unit: BloodUnit) => {
    setSelectedUnitForIssue(unit);
    setIsIssueModalOpen(true);
  };

  const handleConfirmOtDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitForIssue) return;

    setUnits(prev => prev.map(u => {
      if (u.id === selectedUnitForIssue.id) {
        return {
          ...u,
          reservationStatus: 'CROSS_MATCH_VERIFIED',
          reservedPatientMrn: `Dispatched to OT: ${issueForm.receivingNurse} (Temp: ${issueForm.transportTemp})`
        };
      }
      return u;
    }));

    showToast(`Blood Bag ${selectedUnitForIssue.unitBagNumber} verified at ${issueForm.transportTemp} and safely dispatched to OT!`);
    setIsIssueModalOpen(false);
    setSelectedUnitForIssue(null);
  };

  const filtered = units.filter(u => {
    const matchGroup = selectedGroup === 'ALL' || u.bloodGroup === selectedGroup;
    const matchComp = selectedComponent === 'ALL' || u.component.includes(selectedComponent);
    const matchSearch = u.unitBagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.donorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.reservedPatientMrn && u.reservedPatientMrn.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchGroup && matchComp && matchSearch;
  });

  const oNegCount = units.filter(u => u.bloodGroup === 'O-').length;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="card-stylish p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-xl border border-blue-200 dark:border-blue-800">
            <Droplets className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Blood Bank &amp; Component Inventory Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              ABO/Rh inventory, cross-match reservations, serology infection screening, and cold-chain temperature surveillance
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNewBagModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Intake Blood Bag
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            title="Share Inventory"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            title="Print Stock"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Blood Units</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{units.length} Units</p>
          <p className="text-[11px] text-slate-500 mt-1">PRBC, FFP &amp; Platelets</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-rose-500 uppercase">O-ve Universal Donor</span>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{oNegCount} Units</p>
          <p className="text-[11px] text-rose-500 mt-1">Trauma ER Critical Reserve</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-blue-500 uppercase">Reserved For Surgery</span>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {units.filter(u => u.reservationStatus !== 'AVAILABLE').length} Bags
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Cross-matched for OT</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-emerald-500 uppercase">Cold Chain Health</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">Optimal</p>
          <p className="text-[11px] text-slate-500 mt-1">Chillers 2°C - 6°C verified</p>
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
            placeholder="Search bag #, donor ID, reserved patient..."
            className="input-stylish !pl-10 pr-3"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="select-stylish text-xs"
          >
            <option value="ALL">All Blood Groups</option>
            <option value="O+">O Positive (O+)</option>
            <option value="O-">O Negative (O-)</option>
            <option value="A+">A Positive (A+)</option>
            <option value="A-">A Negative (A-)</option>
            <option value="B+">B Positive (B+)</option>
            <option value="B-">B Negative (B-)</option>
            <option value="AB+">AB Positive (AB+)</option>
            <option value="AB-">AB Negative (AB-)</option>
          </select>

          <select
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
            className="select-stylish text-xs"
          >
            <option value="ALL">All Components</option>
            <option value="Packed Red Blood Cells">PRBC (Red Blood)</option>
            <option value="Fresh Frozen Plasma">FFP (Plasma)</option>
            <option value="Platelet">Platelet Concentrate</option>
            <option value="Cryoprecipitate">Cryoprecipitate</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="table-container-stylish">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 py-3">Bag # & Blood Group</th>
                <th className="px-4 py-3">Blood Component</th>
                <th className="px-4 py-3">Collection & Expiry</th>
                <th className="px-4 py-3">Storage Chamber & Temp</th>
                <th className="px-4 py-3">Infection Screening</th>
                <th className="px-4 py-3">Availability & Reservation</th>
                <th className="px-4 py-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold flex items-center justify-center text-xs border border-rose-300 dark:border-rose-800">
                        {u.bloodGroup}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white font-mono text-xs">{u.unitBagNumber}</div>
                        <div className="text-[11px] text-slate-400">Donor: {u.donorId}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{u.component}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="text-xs text-slate-600 dark:text-slate-300">Coll: {u.collectionDate}</div>
                    <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">Exp: {u.expiryDate}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200">
                      <ThermometerSnowflake className="w-3.5 h-3.5 text-sky-500" />
                      <span>{u.storageBay}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Sensor: {u.storageTemp}</div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="badge-emerald flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      HIV/HBV/HCV Negative
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {u.reservationStatus === 'AVAILABLE' ? (
                      <span className="badge-emerald">Available for Crossmatch</span>
                    ) : (
                      <div>
                        <span className="badge-blue">Reserved</span>
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                          {u.reservedPatientMrn}
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {u.reservationStatus === 'AVAILABLE' ? (
                      <button
                        onClick={() => handleOpenReserveModal(u)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors"
                      >
                        Cross Match &amp; Reserve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenIssueModal(u)}
                        className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold transition-colors"
                      >
                        Cold-Chain Issue
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intake Blood Bag Modal */}
      {isNewBagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="card-stylish w-full max-w-md bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Droplets className="w-5 h-5 text-rose-600" />
                Intake Blood Unit &amp; Register Component
              </h3>
              <button onClick={() => setIsNewBagModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBag} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                  <select
                    value={newBag.bloodGroup}
                    onChange={(e) => setNewBag({ ...newBag, bloodGroup: e.target.value as any })}
                    className="input-stylish text-xs font-bold"
                  >
                    <option value="O+">O Positive (O+)</option>
                    <option value="O-">O Negative (O-)</option>
                    <option value="A+">A Positive (A+)</option>
                    <option value="A-">A Negative (A-)</option>
                    <option value="B+">B Positive (B+)</option>
                    <option value="B-">B Negative (B-)</option>
                    <option value="AB+">AB Positive (AB+)</option>
                    <option value="AB-">AB Negative (AB-)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Component Type</label>
                  <select
                    value={newBag.component}
                    onChange={(e) => setNewBag({ ...newBag, component: e.target.value as any })}
                    className="input-stylish text-xs"
                  >
                    <option value="Packed Red Blood Cells (PRBC)">PRBC (Red Blood)</option>
                    <option value="Fresh Frozen Plasma (FFP)">FFP (Plasma)</option>
                    <option value="Platelet Concentrate">Platelet Concentrate</option>
                    <option value="Cryoprecipitate">Cryoprecipitate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Bag Barcode #</label>
                  <input
                    type="text"
                    required
                    value={newBag.unitBagNumber}
                    onChange={(e) => setNewBag({ ...newBag, unitBagNumber: e.target.value })}
                    className="input-stylish text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Donor ID</label>
                  <input
                    type="text"
                    required
                    value={newBag.donorId}
                    onChange={(e) => setNewBag({ ...newBag, donorId: e.target.value })}
                    className="input-stylish text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Collection Date</label>
                  <input
                    type="date"
                    value={newBag.collectionDate}
                    onChange={(e) => setNewBag({ ...newBag, collectionDate: e.target.value })}
                    className="input-stylish text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newBag.expiryDate}
                    onChange={(e) => setNewBag({ ...newBag, expiryDate: e.target.value })}
                    className="input-stylish text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Storage Chamber</label>
                <input
                  type="text"
                  value={newBag.storageBay}
                  onChange={(e) => setNewBag({ ...newBag, storageBay: e.target.value })}
                  className="input-stylish text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewBagModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Verify &amp; Store in Cold Chain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Cross-Match & Reservation Modal */}
      {isReserveModalOpen && selectedUnitForReserve && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="card-stylish w-full max-w-lg bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600" />
                Cross-Match &amp; Reserve Unit for Patient
              </h3>
              <button onClick={() => setIsReserveModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-rose-700 dark:text-rose-300 font-mono text-sm">{selectedUnitForReserve.unitBagNumber}</span>
                <span className="ml-2 font-bold px-2 py-0.5 bg-rose-600 text-white rounded text-[11px]">{selectedUnitForReserve.bloodGroup}</span>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">{selectedUnitForReserve.component}</p>
              </div>
              <div className="text-right text-[11px] text-slate-500">
                <span>Storage: {selectedUnitForReserve.storageBay}</span>
                <p className="font-medium text-emerald-600">Temp: {selectedUnitForReserve.storageTemp}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmReservation} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Patient UHID</label>
                  <input
                    type="text"
                    required
                    value={reserveForm.patientUhid}
                    onChange={(e) => setReserveForm({ ...reserveForm, patientUhid: e.target.value })}
                    className="input-stylish text-xs font-mono"
                    placeholder="UHID-88214"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={reserveForm.patientName}
                    onChange={(e) => setReserveForm({ ...reserveForm, patientName: e.target.value })}
                    className="input-stylish text-xs"
                    placeholder="Patient Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Destination Ward / OT</label>
                  <select
                    value={reserveForm.targetDept}
                    onChange={(e) => setReserveForm({ ...reserveForm, targetDept: e.target.value })}
                    className="select-stylish text-xs"
                  >
                    <option value="OT 1 - Cardiothoracic Surgery">OT 1 - Cardiothoracic Surgery</option>
                    <option value="OT 2 - Orthopedic & Trauma">OT 2 - Orthopedic & Trauma</option>
                    <option value="OT 3 - Neurosurgery">OT 3 - Neurosurgery</option>
                    <option value="OT 4 - Emergency Obstetrics">OT 4 - Emergency Obstetrics</option>
                    <option value="Emergency Trauma Resus (Bay 1)">Emergency Trauma Resus (Bay 1)</option>
                    <option value="Medical ICU (MICU)">Medical ICU (MICU)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Urgency Priority</label>
                  <select
                    value={reserveForm.urgency}
                    onChange={(e) => setReserveForm({ ...reserveForm, urgency: e.target.value })}
                    className="select-stylish text-xs font-semibold"
                  >
                    <option value="URGENT">Urgent (Within 1 Hour)</option>
                    <option value="STAT_EMERGENCY">STAT Emergency (Immediate)</option>
                    <option value="ELECTIVE_SURGERY">Elective Surgery (Next Day)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Authorizing Transfusion Officer</label>
                <input
                  type="text"
                  required
                  value={reserveForm.transfusionOfficer}
                  onChange={(e) => setReserveForm({ ...reserveForm, transfusionOfficer: e.target.value })}
                  className="input-stylish text-xs"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="crossmatchCheck"
                  checked={reserveForm.crossmatchCompatible}
                  onChange={(e) => setReserveForm({ ...reserveForm, crossmatchCompatible: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                  required
                />
                <label htmlFor="crossmatchCheck" className="text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer">
                  <span className="font-semibold text-slate-900 dark:text-white">Major Serology Cross-Match Verified:</span> Donor erythrocyte and patient serum sample tested negative for agglutination/hemolysis.
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReserveModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Lock &amp; Reserve Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cold Chain OT Issue / Dispatch Modal */}
      {isIssueModalOpen && selectedUnitForIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="card-stylish w-full max-w-lg bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ThermometerSnowflake className="w-5 h-5 text-sky-600" />
                Cold-Chain OT Dispatch &amp; Handover
              </h3>
              <button onClick={() => setIsIssueModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 rounded-lg flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-sky-700 dark:text-sky-300 font-mono text-sm">{selectedUnitForIssue.unitBagNumber}</span>
                <span className="ml-2 font-bold px-2 py-0.5 bg-sky-600 text-white rounded text-[11px]">{selectedUnitForIssue.bloodGroup}</span>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">{selectedUnitForIssue.reservedPatientMrn || 'Reserved for surgical suite'}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmOtDispatch} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Transit Carrier Box ID</label>
                  <input
                    type="text"
                    required
                    value={issueForm.carrierBoxId}
                    onChange={(e) => setIssueForm({ ...issueForm, carrierBoxId: e.target.value })}
                    className="input-stylish text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Cold Box Sensor Temp</label>
                  <input
                    type="text"
                    required
                    value={issueForm.transportTemp}
                    onChange={(e) => setIssueForm({ ...issueForm, transportTemp: e.target.value })}
                    className="input-stylish text-xs font-semibold text-indigo-600"
                    placeholder="2.0°C - 6.0°C"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Security Seal Barcode</label>
                  <input
                    type="text"
                    required
                    value={issueForm.transitBagSeal}
                    onChange={(e) => setIssueForm({ ...issueForm, transitBagSeal: e.target.value })}
                    className="input-stylish text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Receiving OT Nurse / Staff</label>
                  <input
                    type="text"
                    required
                    value={issueForm.receivingNurse}
                    onChange={(e) => setIssueForm({ ...issueForm, receivingNurse: e.target.value })}
                    className="input-stylish text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>NABH 30-Minute Transfusion Rule:</strong> Unit must be initiated into patient transfusion within 30 minutes of departure from the Blood Bank cold chain.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Confirm Dispatch &amp; Print Transfusion Slip
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
        title="Blood Bank Daily Component Reserve"
        text={`Hospital Blood Bank: ${units.length} total units, ${oNegCount} O-negative emergency units.`}
        url={window.location.href}
      />
    </div>
  );
};
