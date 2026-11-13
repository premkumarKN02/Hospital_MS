import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Filter,
  FileText,
  User,
  ShieldCheck,
  X,
  QrCode
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { formatCurrency } from '../../utils/currencyService';
import { enterpriseStore } from '../../services/enterpriseDataStore';

interface LabOrder {
  id: string;
  orderNumber: string;
  patientName: string;
  mrn: string;
  testName: string;
  department: 'Biochemistry' | 'Hematology' | 'Microbiology' | 'Serology' | 'Clinical Pathology';
  specimenType: 'Blood (EDTA)' | 'Serum' | 'Plasma' | 'Urine' | 'CSF';
  barcode: string;
  orderedByDoctor: string;
  status: 'COLLECTION_PENDING' | 'ANALYSIS_IN_PROGRESS' | 'CRITICAL_REVIEW' | 'AUTHORIZED_PUBLISHED';
  resultValue?: string;
  referenceRange: string;
  isPanicValue: boolean;
  tatTimeMins: number;
}

export const LisLaboratoryPage: React.FC = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedOrderForReport, setSelectedOrderForReport] = useState<LabOrder | null>(null);

  const [orders, setOrders] = useState<LabOrder[]>(() => {
    const saved = localStorage.getItem('hospital_lis_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
    {
      id: 'LAB-01',
      orderNumber: 'ORD-9901',
      patientName: 'Rajesh Ramanathan',
      mrn: 'UHID-88210',
      testName: 'Complete Blood Count (CBC + Automated Diff)',
      department: 'Hematology',
      specimenType: 'Blood (EDTA)',
      barcode: 'BC-9901-EDTA',
      orderedByDoctor: 'Dr. K. Sindhu (General Medicine)',
      status: 'AUTHORIZED_PUBLISHED',
      resultValue: 'Hb: 13.8 g/dL, WBC: 7,400 /mcL, Plt: 2.4L',
      referenceRange: 'Hb: 13.0-17.0, WBC: 4,000-11,000',
      isPanicValue: false,
      tatTimeMins: 45
    },
    {
      id: 'LAB-02',
      orderNumber: 'ORD-9902',
      patientName: 'Meenakshi Sundaram',
      mrn: 'UHID-88219',
      testName: 'Serum Potassium (K+ Electrolyte)',
      department: 'Biochemistry',
      specimenType: 'Serum',
      barcode: 'BC-9902-SRM',
      orderedByDoctor: 'Dr. R. Arun (ICU Intensivist)',
      status: 'CRITICAL_REVIEW',
      resultValue: 'Potassium: 6.8 mEq/L (CRITICAL HIGH)',
      referenceRange: '3.5 - 5.1 mEq/L',
      isPanicValue: true,
      tatTimeMins: 20
    },
    {
      id: 'LAB-03',
      orderNumber: 'ORD-9903',
      patientName: 'Anand Chandrasekar',
      mrn: 'UHID-88225',
      testName: 'Cardiac Troponin-I High Sensitivity (hs-cTnI)',
      department: 'Biochemistry',
      specimenType: 'Plasma',
      barcode: 'BC-9903-PLS',
      orderedByDoctor: 'Dr. Joseph (Emergency Care)',
      status: 'ANALYSIS_IN_PROGRESS',
      resultValue: 'Testing in Roche Cobas Analyzer...',
      referenceRange: '< 0.04 ng/mL',
      isPanicValue: false,
      tatTimeMins: 15
    },
    {
      id: 'LAB-04',
      orderNumber: 'ORD-9904',
      patientName: 'Fatima Begum',
      mrn: 'UHID-88231',
      testName: 'Blood Culture & Antimicrobial Sensitivity',
      department: 'Microbiology',
      specimenType: 'Blood (EDTA)',
      barcode: 'BC-9904-BC',
      orderedByDoctor: 'Dr. R. Arun (Infectious Diseases)',
      status: 'COLLECTION_PENDING',
      resultValue: 'Sample collection awaited in Ward 3B',
      referenceRange: 'Sterile at 48 hours',
      isPanicValue: false,
      tatTimeMins: 120
    }
  ];
  });

  const [newOrder, setNewOrder] = useState({
    patientName: '',
    mrn: '',
    testName: '',
    department: 'Biochemistry' as const,
    specimenType: 'Blood (EDTA)' as const,
    orderedByDoctor: ''
  });

  // Persist lab orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hospital_lis_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const created: LabOrder = {
      id: `LAB-0${orders.length + 5}`,
      orderNumber: `ORD-${Math.floor(9900 + Math.random() * 100)}`,
      patientName: newOrder.patientName,
      mrn: newOrder.mrn || `UHID-${Math.floor(88000 + Math.random() * 1000)}`,
      testName: newOrder.testName,
      department: newOrder.department,
      specimenType: newOrder.specimenType,
      barcode: `BC-${Math.floor(9900 + Math.random() * 100)}-GEN`,
      orderedByDoctor: newOrder.orderedByDoctor || 'Consultant Physician on Duty',
      status: 'COLLECTION_PENDING',
      referenceRange: 'Standard Diagnostic Reference',
      isPanicValue: false,
      tatTimeMins: 60
    };

    enterpriseStore.createLabOrder({
      sampleBarcode: created.barcode,
      patientName: created.patientName,
      uhid: created.mrn,
      testName: created.testName,
      department: created.department,
      collectionTime: new Date().toISOString(),
      resultStatus: 'COLLECTED',
      isPanicAlert: false,
      parameters: [
        {
          name: created.testName,
          value: 'Pending Analysis',
          normalRange: created.referenceRange,
          unit: 'std',
          isAbnormal: false,
          isCritical: false
        }
      ],
      pathologist: 'Dr. Meera Consultant Pathologist',
      branchId: 'branch-chennai-greams'
    });

    setOrders([created, ...orders]);
    setIsNewOrderModalOpen(false);
  };

  const handleAuthorize = (id: string) => {
    enterpriseStore.signOffPathology(id, 'Dr. Meera Consultant Pathologist');
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'AUTHORIZED_PUBLISHED' } : o));
  };

  const filtered = orders.filter(o => {
    const matchDept = selectedDept === 'ALL' || o.department === selectedDept;
    const matchSearch = o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.barcode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  const panicCount = orders.filter(o => o.isPanicValue).length;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="card-stylish p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-xl border border-blue-200 dark:border-blue-800">
            <FlaskConical className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Laboratory Information System (LIS) &amp; Pathology Desk
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              Specimen accessioning, analyzer worklist integration, critical value panic alerts, and pathologist authorizations
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Lab Order
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            title="Share Worklist"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            title="Print Worklist"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-slate-500 uppercase">Today's Tests</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{orders.length} Samples</p>
          <p className="text-[11px] text-slate-500 mt-1">NABL Accredited Standard</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-rose-500 uppercase">Critical Panic Alerts</span>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{panicCount} Critical</p>
          <p className="text-[11px] text-rose-500 mt-1">Doctor notified immediately</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-blue-500 uppercase">In Analyzer</span>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {orders.filter(o => o.status === 'ANALYSIS_IN_PROGRESS').length} Samples
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Biochemistry &amp; Hematology</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-emerald-500 uppercase">Authorized &amp; Released</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {orders.filter(o => o.status === 'AUTHORIZED_PUBLISHED').length} Reports
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Dispatched to EMR</p>
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
            placeholder="Search test name, patient, barcode, order #..."
            className="input-stylish !pl-10 pr-3"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="select-stylish text-xs"
          >
            <option value="ALL">All Diagnostic Departments</option>
            <option value="Biochemistry">Biochemistry</option>
            <option value="Hematology">Hematology</option>
            <option value="Microbiology">Microbiology</option>
            <option value="Serology">Serology</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="table-container-stylish">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 py-3">Order # & Barcode</th>
                <th className="px-4 py-3">Patient & MRN</th>
                <th className="px-4 py-3">Test Name & Dept</th>
                <th className="px-4 py-3">Specimen Tube</th>
                <th className="px-4 py-3">Result Values & Range</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Pathologist Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 dark:text-white font-mono text-xs">{o.orderNumber}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono mt-0.5">
                      <QrCode className="w-3 h-3 text-blue-500" />
                      {o.barcode}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{o.patientName}</div>
                    <div className="text-xs text-slate-500 font-mono">{o.mrn}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{o.testName}</div>
                    <span className="badge-slate text-[11px] mt-0.5">{o.department}</span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300">{o.specimenType}</div>
                    <div className="text-[11px] text-slate-400">Req: {o.orderedByDoctor.split('(')[0]}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className={`text-xs font-medium ${o.isPanicValue ? 'text-rose-600 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>
                      {o.resultValue}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Ref: {o.referenceRange}</div>
                  </td>

                  <td className="px-4 py-3">
                    {o.isPanicValue ? (
                      <span className="badge-rose flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Critical Panic Alert
                      </span>
                    ) : o.status === 'AUTHORIZED_PUBLISHED' ? (
                      <span className="badge-emerald">Authorized</span>
                    ) : o.status === 'ANALYSIS_IN_PROGRESS' ? (
                      <span className="badge-blue">Analyzing</span>
                    ) : (
                      <span className="badge-amber">Sample Pending</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {o.status !== 'AUTHORIZED_PUBLISHED' ? (
                        <button
                          onClick={() => handleAuthorize(o.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors"
                        >
                          Authorize &amp; Sign
                        </button>
                      ) : null}
                      <button
                        onClick={() => setSelectedOrderForReport(o)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium transition-colors"
                      >
                        View Report
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Lab Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="card-stylish w-full max-w-md bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-blue-600" />
                Place Diagnostic Laboratory Order
              </h3>
              <button onClick={() => setIsNewOrderModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Krishnan"
                  value={newOrder.patientName}
                  onChange={(e) => setNewOrder({ ...newOrder, patientName: e.target.value })}
                  className="input-stylish text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Test Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lipid Profile / Liver Function Test"
                  value={newOrder.testName}
                  onChange={(e) => setNewOrder({ ...newOrder, testName: e.target.value })}
                  className="input-stylish text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={newOrder.department}
                    onChange={(e) => setNewOrder({ ...newOrder, department: e.target.value as any })}
                    className="input-stylish text-xs"
                  >
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Serology">Serology</option>
                    <option value="Clinical Pathology">Clinical Pathology</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Specimen Tube</label>
                  <select
                    value={newOrder.specimenType}
                    onChange={(e) => setNewOrder({ ...newOrder, specimenType: e.target.value as any })}
                    className="input-stylish text-xs"
                  >
                    <option value="Blood (EDTA)">Blood (EDTA)</option>
                    <option value="Serum">Serum</option>
                    <option value="Plasma">Plasma</option>
                    <option value="Urine">Urine</option>
                    <option value="CSF">CSF</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ordering Physician</label>
                <input
                  type="text"
                  placeholder="Dr. K. Sindhu"
                  value={newOrder.orderedByDoctor}
                  onChange={(e) => setNewOrder({ ...newOrder, orderedByDoctor: e.target.value })}
                  className="input-stylish text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Generate Barcode &amp; Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Laboratory Diagnostic Report Modal */}
      {selectedOrderForReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Pathology Diagnostic Laboratory Report
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForReport(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Report Canvas */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs font-sans">
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-3">
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">
                    SINDHU HEALTHCARE HOSPITAL • CENTRAL PATHOLOGY
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    NABL Accredited Medical Testing Laboratory (ISO 15189:2022)
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    NABL Cert: MC-4109 • Barcode: {selectedOrderForReport.barcode}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedOrderForReport.status === 'AUTHORIZED_PUBLISHED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : selectedOrderForReport.isPanicValue
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {selectedOrderForReport.status === 'AUTHORIZED_PUBLISHED'
                      ? 'VERIFIED & RELEASED'
                      : selectedOrderForReport.isPanicValue
                      ? 'CRITICAL ALERT'
                      : 'IN PROCESS'}
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    Order: {selectedOrderForReport.orderNumber}
                  </p>
                </div>
              </div>

              {/* Patient Demographics */}
              <div className="grid grid-cols-2 gap-3 py-1">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient Name</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {selectedOrderForReport.patientName}
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono">{selectedOrderForReport.mrn}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Referring Doctor</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {selectedOrderForReport.orderedByDoctor}
                  </span>
                  <p className="text-[10px] text-slate-500">{selectedOrderForReport.department}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Specimen Matrix</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {selectedOrderForReport.specimenType}
                  </span>
                  <p className="text-[10px] text-slate-500">Vacutainer Barcoded Tube</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Analytical Turnaround</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {selectedOrderForReport.tatTimeMins} mins TAT
                  </span>
                  <p className="text-[10px] text-slate-500">Automated Beckman Coulter AU5800</p>
                </div>
              </div>

              {/* Test Results Table */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 text-[10px] uppercase">
                      <th className="py-1">Diagnostic Investigation</th>
                      <th className="py-1">Observed Value</th>
                      <th className="py-1">Reference Range</th>
                      <th className="py-1 text-right">Interpretation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-2 font-bold text-slate-900 dark:text-white">
                        {selectedOrderForReport.testName}
                      </td>
                      <td className="py-2 font-black text-slate-900 dark:text-white">
                        {selectedOrderForReport.resultValue || 'Analysis pending'}
                      </td>
                      <td className="py-2 font-mono text-slate-600 dark:text-slate-400">
                        {selectedOrderForReport.referenceRange}
                      </td>
                      <td className="py-2 text-right">
                        {selectedOrderForReport.isPanicValue ? (
                          <span className="badge-rose animate-pulse font-bold">CRITICAL HIGH</span>
                        ) : (
                          <span className="badge-emerald font-bold">NORMAL</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pathologist Authentication Stamp */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end text-[10px] text-slate-500">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Dr. S. Anand, MD (Pathology)</p>
                  <p>Senior Consultant Pathologist &amp; Lab Director</p>
                  <p className="text-[9px] text-emerald-600 font-mono mt-0.5">Digitally Authenticated (SHA-256)</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[9px] text-slate-400">Sample UID: {selectedOrderForReport.id}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => window.print()}
                className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Diagnostic PDF
              </button>
              <div className="flex items-center gap-2">
                {selectedOrderForReport.status !== 'AUTHORIZED_PUBLISHED' && (
                  <button
                    onClick={() => {
                      handleAuthorize(selectedOrderForReport.id);
                      setSelectedOrderForReport({
                        ...selectedOrderForReport,
                        status: 'AUTHORIZED_PUBLISHED'
                      });
                    }}
                    className="px-3 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-sm"
                  >
                    Authorize &amp; Sign
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedOrderForReport(null)}
                  className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Pathology Laboratory Daily Worklist"
        text={`Hospital LIS: ${orders.length} diagnostic orders processed, ${panicCount} critical panic values alerted.`}
        url={window.location.href}
      />
    </div>
  );
};
