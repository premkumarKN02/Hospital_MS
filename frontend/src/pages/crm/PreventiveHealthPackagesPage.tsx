import React, { useState, useEffect } from 'react';
import {
  PackageCheck,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Filter,
  Building2,
  Users,
  IndianRupee,
  Heart,
  Activity,
  X,
  Sparkles,
  Ticket
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { formatCurrency } from '../../utils/currencyService';

interface HealthPackage {
  id: string;
  packageCode: string;
  packageName: string;
  targetGroup: string;
  includedTests: string[];
  includedConsultations: string[];
  retailValue: number;
  packagePrice: number;
  activeSubscribersCount: number;
  isPopular: boolean;
  corporateMous: string[];
}

const INITIAL_PACKAGES: HealthPackage[] = [
  {
    id: 'PKG-01',
    packageCode: 'HCK-EXEC-01',
    packageName: 'Comprehensive Executive Health Profile',
    targetGroup: 'Working Professionals (30 - 55 yrs)',
    includedTests: ['Complete Blood Count (CBC)', 'Lipid Profile', 'HbA1c', 'Liver Function (LFT)', 'Renal Function (KFT)', 'Chest X-Ray', '12-Lead ECG', 'USG Abdomen & Pelvis'],
    includedConsultations: ['Chief Physician', 'Senior Cardiologist', 'Clinical Dietitian'],
    retailValue: 9800,
    packagePrice: 4999,
    activeSubscribersCount: 142,
    isPopular: true,
    corporateMous: ['Tata Consultancy Services (TCS)', 'Infosys Chennai', 'HCL Technologies']
  },
  {
    id: 'PKG-02',
    packageCode: 'HCK-CARD-02',
    packageName: 'Advanced Cardiac Wellness & TMT Screen',
    targetGroup: 'Adults with Hypertension / Family History',
    includedTests: ['Cardiac Troponin hs-cTnI', 'Lipid Comprehensive', 'Treadmill Stress Test (TMT)', '2D Echocardiogram', 'hs-CRP Inflammatory Marker'],
    includedConsultations: ['Chief Cardiologist Dr. Arunachalam', 'Lifestyle Counsellor'],
    retailValue: 12500,
    packagePrice: 6500,
    activeSubscribersCount: 88,
    isPopular: true,
    corporateMous: ['State Bank of India', 'L&T Construction']
  },
  {
    id: 'PKG-03',
    packageCode: 'HCK-WOMN-03',
    packageName: 'Well-Woman Comprehensive Screening',
    targetGroup: 'Women (All Age Groups)',
    includedTests: ['Liquid-Based Pap Smear', 'Digital Mammography', 'Thyroid Profile (FT3, FT4, TSH)', 'Vitamin D3 & B12', 'Bone Mineral Density (DEXA)'],
    includedConsultations: ['Senior Gynecologist', 'Breast Specialist'],
    retailValue: 11000,
    packagePrice: 5499,
    activeSubscribersCount: 64,
    isPopular: false,
    corporateMous: ['Standard Chartered Global', 'Cognizant']
  },
  {
    id: 'PKG-04',
    packageCode: 'HCK-DIAB-04',
    packageName: 'Diabetic Health & Organ Protection Plan',
    targetGroup: 'Type 1 & Type 2 Diabetes Patients',
    includedTests: ['Fasting & Post-Prandial Blood Sugar', 'HbA1c', 'Urine Microalbumin / Creatinine Ratio', 'Fundus Eye Screening', 'Biothesiometry Foot Screen'],
    includedConsultations: ['Diabetologist Dr. Sindhu', 'Diabetic Foot Specialist', 'Nutritionist'],
    retailValue: 7500,
    packagePrice: 3800,
    activeSubscribersCount: 105,
    isPopular: true,
    corporateMous: ['Tamil Nadu Petroproducts', 'Hyundai Motors']
  }
];

export const PreventiveHealthPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<HealthPackage[]>(() => {
    const saved = localStorage.getItem('hospital_health_packages_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PACKAGES;
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewPackageModalOpen, setIsNewPackageModalOpen] = useState(false);
  const [enrollingPackage, setEnrollingPackage] = useState<HealthPackage | null>(null);
  const [issuedVoucher, setIssuedVoucher] = useState<any | null>(null);

  // New Package Form
  const [newPkg, setNewPkg] = useState({
    packageCode: `HCK-SPEC-${Math.floor(10 + Math.random() * 90)}`,
    packageName: '',
    targetGroup: '',
    includedTests: 'Complete Hemogram, Lipid Profile, Blood Sugar, ECG',
    includedConsultations: 'General Physician, Dietitian',
    retailValue: 6000,
    packagePrice: 3499
  });

  // Patient Enrollment Form
  const [enrollPatient, setEnrollPatient] = useState({
    patientName: '',
    patientPhone: '',
    preferredDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    try {
      localStorage.setItem('hospital_health_packages_v1', JSON.stringify(packages));
    } catch (e) {
      console.error(e);
    }
  }, [packages]);

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkg.packageName.trim()) return;

    const created: HealthPackage = {
      id: `PKG-${Date.now()}`,
      packageCode: newPkg.packageCode,
      packageName: newPkg.packageName,
      targetGroup: newPkg.targetGroup || 'Adults & Senior Citizens',
      includedTests: newPkg.includedTests.split(',').map((s) => s.trim()),
      includedConsultations: newPkg.includedConsultations.split(',').map((s) => s.trim()),
      retailValue: Number(newPkg.retailValue),
      packagePrice: Number(newPkg.packagePrice),
      activeSubscribersCount: 1,
      isPopular: false,
      corporateMous: ['Hospital Walk-in Empanelment']
    };

    setPackages([created, ...packages]);
    setIsNewPackageModalOpen(false);
  };

  const handleEnrollPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollingPackage || !enrollPatient.patientName.trim()) return;

    // Increment subscriber count
    setPackages((prev) =>
      prev.map((p) =>
        p.id === enrollingPackage.id
          ? { ...p, activeSubscribersCount: p.activeSubscribersCount + 1 }
          : p
      )
    );

    const voucher = {
      voucherNo: `VCH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: enrollPatient.patientName,
      patientPhone: enrollPatient.patientPhone,
      package: enrollingPackage,
      date: enrollPatient.preferredDate
    };

    setIssuedVoucher(voucher);
    setEnrollingPackage(null);
    setEnrollPatient({ patientName: '', patientPhone: '', preferredDate: new Date().toISOString().split('T')[0] });
  };

  const filteredPackages = packages.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      p.packageName.toLowerCase().includes(q) ||
      p.packageCode.toLowerCase().includes(q) ||
      p.targetGroup.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 font-jakarta">
            <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
              <PackageCheck className="w-6 h-6" />
            </span>
            Preventive Health Checkup Packages Desk
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Standardized wellness plans, corporate corporate MOUs, package vouchers, and diagnostic bundling
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewPackageModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create Health Package
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl border border-slate-200 text-xs font-bold flex items-center gap-1.5"
            title="Print Tariff"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase">Active Packages</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{packages.length} Programs</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-sm">
          <span className="text-xs text-emerald-600 font-bold uppercase">Total Subscribed Patients</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {packages.reduce((sum, p) => sum + p.activeSubscribersCount, 0)} Patients
          </p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-blue-200/80 shadow-sm">
          <span className="text-xs text-blue-600 font-bold uppercase">Empanelled Corporates</span>
          <p className="text-2xl font-black text-blue-700 mt-1">12 Companies</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-purple-200/80 shadow-sm">
          <span className="text-xs text-purple-600 font-bold uppercase">Average Discount Value</span>
          <p className="text-2xl font-black text-purple-700 mt-1">45% Savings</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-96 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search health packages, tests, target group..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredPackages.map((pkg) => {
          const discountPct = Math.round(((pkg.retailValue - pkg.packagePrice) / pkg.retailValue) * 100);

          return (
            <div
              key={pkg.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {pkg.packageCode}
                      </span>
                      {pkg.isPopular && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" /> Popular Choice
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mt-1.5">{pkg.packageName}</h3>
                    <p className="text-xs text-slate-500 font-medium">{pkg.targetGroup}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 line-through">₹{pkg.retailValue.toLocaleString()}</span>
                    <div className="text-xl font-black text-emerald-700">₹{pkg.packagePrice.toLocaleString()}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                      {discountPct}% OFF
                    </span>
                  </div>
                </div>

                {/* Tests List */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase text-slate-400">Included Tests ({pkg.includedTests.length}):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.includedTests.map((t, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-50 border border-slate-100 text-slate-700 rounded-lg text-[11px] font-medium">
                        ✓ {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Consultations */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase text-slate-400">Doctor Consultations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.includedConsultations.map((c, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-[11px] font-semibold">
                        👨‍⚕️ {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  <strong>{pkg.activeSubscribersCount}</strong> enrolled patients
                </span>
                <button
                  onClick={() => setEnrollingPackage(pkg)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  Enroll Patient &amp; Voucher
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Enroll Patient in Package */}
      {enrollingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Ticket className="w-5 h-5" />
                </span>
                Issue Health Package Voucher
              </h3>
              <button onClick={() => setEnrollingPackage(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollPatient} className="space-y-3.5 text-xs">
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
                <span className="font-bold text-emerald-900 text-sm">{enrollingPackage.packageName}</span>
                <p className="text-emerald-700 font-bold">Package Fee: ₹{enrollingPackage.packagePrice.toLocaleString()}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meenakshi Raman"
                  value={enrollPatient.patientName}
                  onChange={(e) => setEnrollPatient({ ...enrollPatient, patientName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98400 12345"
                  value={enrollPatient.patientPhone}
                  onChange={(e) => setEnrollPatient({ ...enrollPatient, patientPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Checkup Date</label>
                <input
                  type="date"
                  required
                  value={enrollPatient.preferredDate}
                  onChange={(e) => setEnrollPatient({ ...enrollPatient, preferredDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEnrollingPackage(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/25 transition"
                >
                  Issue Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Issued Voucher Card */}
      {issuedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Voucher Generated Successfully
              </h3>
              <button onClick={() => setIssuedVoucher(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl space-y-3 text-xs">
              <div className="flex items-start justify-between border-b border-emerald-200 pb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase">Hospital Voucher #</span>
                  <p className="font-mono font-black text-emerald-950 text-sm">{issuedVoucher.voucherNo}</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full">
                  VALIDATED
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-emerald-800">PATIENT:</span>
                <p className="font-bold text-slate-900 text-sm">{issuedVoucher.patientName} ({issuedVoucher.patientPhone})</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-emerald-800">PACKAGE:</span>
                <p className="font-bold text-slate-900">{issuedVoucher.package.packageName}</p>
                <p className="text-emerald-800 font-bold mt-0.5">Amount Payable: ₹{issuedVoucher.package.packagePrice.toLocaleString()}</p>
              </div>

              <div className="pt-2 border-t border-emerald-200 text-[11px] text-slate-600">
                Present this digital voucher at the Hospital Wellness &amp; Phlebotomy Reception on <strong>{issuedVoucher.date}</strong> (Fasting 8-10 hours mandatory).
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Voucher
              </button>
              <button
                onClick={() => setIssuedVoucher(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
