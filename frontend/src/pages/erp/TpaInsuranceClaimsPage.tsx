import React, { useState, useEffect } from 'react';
import {
  FileCheck,
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
  FileText,
  DollarSign,
  X
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { formatCurrency } from '../../utils/currencyService';
import { enterpriseStore } from '../../services/enterpriseDataStore';

interface TpaClaim {
  id: string;
  claimNumber: string;
  patientName: string;
  mrn: string;
  ipdNumber: string;
  tpaName: string;
  insuranceCompany: string;
  policyNumber: string;
  sanctionedAmount: number;
  totalBilledAmount: number;
  preAuthStatus: 'APPROVED' | 'ENHANCEMENT_REQUESTED' | 'QUERY_RAISED' | 'REJECTED' | 'DISCHARGE_PENDING';
  admissionDate: string;
  diagnosis: string;
  tpaDeskOfficer: string;
}

export const TpaInsuranceClaimsPage: React.FC = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTpa, setSelectedTpa] = useState<string>('ALL');
  const [isNewClaimModalOpen, setIsNewClaimModalOpen] = useState(false);

  const [claims, setClaims] = useState<TpaClaim[]>(() => {
    const saved = localStorage.getItem('hospital_tpa_claims');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'CLM-01',
        claimNumber: 'PRE-2026-9041',
        patientName: 'Subramanian Natarajan',
        mrn: 'UHID-88204',
        ipdNumber: 'IPD-4012',
        tpaName: 'Medi Assist Healthcare TPA',
        insuranceCompany: 'Star Health & Allied Insurance',
        policyNumber: 'POL-STAR-881204',
        sanctionedAmount: 180000,
        totalBilledAmount: 220000,
        preAuthStatus: 'ENHANCEMENT_REQUESTED',
        admissionDate: '2026-10-05',
        diagnosis: 'Severe Coronary Artery Disease (CAD-TVD), Scheduled for CABG',
        tpaDeskOfficer: 'Executive Ramesh'
      },
      {
        id: 'CLM-02',
        claimNumber: 'PRE-2026-9042',
        patientName: 'Saraswathi Ammal',
        mrn: 'UHID-88220',
        ipdNumber: 'IPD-4018',
        tpaName: 'Vidal Health Insurance TPA',
        insuranceCompany: 'HDFC ERGO General Insurance',
        policyNumber: 'HDFC-HE-99214',
        sanctionedAmount: 250000,
        totalBilledAmount: 245000,
        preAuthStatus: 'APPROVED',
        admissionDate: '2026-10-06',
        diagnosis: 'Severe Osteoarthritis Bilateral Knee, Left TKR',
        tpaDeskOfficer: 'Executive Anitha'
      },
      {
        id: 'CLM-03',
        claimNumber: 'PRE-2026-9043',
        patientName: 'Karthik Narayanan',
        mrn: 'UHID-88214',
        ipdNumber: 'IPD-4022',
        tpaName: 'Paramount TPA Services',
        insuranceCompany: 'ICICI Lombard Health',
        policyNumber: 'ICICI-GIC-77401',
        sanctionedAmount: 75000,
        totalBilledAmount: 82000,
        preAuthStatus: 'QUERY_RAISED',
        admissionDate: '2026-10-07',
        diagnosis: 'Acute Calculous Cholecystitis, Lap Cholecystectomy',
        tpaDeskOfficer: 'Executive Ramesh'
      }
    ];
  });

  const [newClaim, setNewClaim] = useState({
    patientName: '',
    mrn: '',
    ipdNumber: 'IPD-4025',
    tpaName: 'Medi Assist Healthcare TPA',
    insuranceCompany: 'Star Health & Allied Insurance',
    policyNumber: '',
    sanctionedAmount: 100000,
    totalBilledAmount: 120000,
    diagnosis: ''
  });

  // Persist claims to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hospital_tpa_claims', JSON.stringify(claims));
    } catch (e) {
      console.error(e);
    }
  }, [claims]);

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const created: TpaClaim = {
      id: `CLM-0${claims.length + 4}`,
      claimNumber: `PRE-2026-${Math.floor(9040 + Math.random() * 100)}`,
      patientName: newClaim.patientName,
      mrn: newClaim.mrn || `UHID-${Math.floor(88000 + Math.random() * 1000)}`,
      ipdNumber: newClaim.ipdNumber,
      tpaName: newClaim.tpaName,
      insuranceCompany: newClaim.insuranceCompany,
      policyNumber: newClaim.policyNumber || 'POL-GEN-9901',
      sanctionedAmount: Number(newClaim.sanctionedAmount),
      totalBilledAmount: Number(newClaim.totalBilledAmount),
      preAuthStatus: 'APPROVED',
      admissionDate: new Date().toISOString().split('T')[0],
      diagnosis: newClaim.diagnosis,
      tpaDeskOfficer: 'Executive Desk'
    };

    enterpriseStore.submitTpaClaim({
      claimId: created.claimNumber,
      patientName: created.patientName,
      uhid: created.mrn,
      tpaName: created.tpaName,
      policyNumber: created.policyNumber,
      estimatedAmount: created.totalBilledAmount,
      sanctionedAmount: created.sanctionedAmount,
      status: 'PRE_AUTH_SUBMITTED',
      submissionDate: created.admissionDate,
      branchId: 'branch-chennai-greams'
    });

    setClaims([created, ...claims]);
    setIsNewClaimModalOpen(false);
  };

  const handleApproveClaim = (id: string) => {
    setClaims(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          preAuthStatus: 'APPROVED',
          sanctionedAmount: c.totalBilledAmount
        };
      }
      return c;
    }));
  };

  const filtered = claims.filter(c => {
    const matchTpa = selectedTpa === 'ALL' || c.tpaName.includes(selectedTpa);
    const matchSearch = c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.policyNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTpa && matchSearch;
  });

  const totalSanctioned = claims.reduce((acc, c) => acc + c.sanctionedAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="card-stylish p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <FileCheck className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Insurance, Cashless TPA &amp; Claims Management Desk
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              Empanelled TPA pre-authorizations, interim bed stay enhancements, query settlement, and cashless claim audits
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNewClaimModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Pre-Auth Claim
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-slate-500 uppercase">Active Inpatient Claims</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{claims.length} Claims</p>
          <p className="text-[11px] text-slate-500 mt-1">Cashless Hospital Network</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-emerald-500 uppercase">Total Pre-Auth Sanctioned</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(totalSanctioned)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Guaranteed by TPAs</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-amber-500 uppercase">Queries / Enhancements</span>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {claims.filter(c => c.preAuthStatus === 'QUERY_RAISED' || c.preAuthStatus === 'ENHANCEMENT_REQUESTED').length} Files
          </p>
          <p className="text-[11px] text-amber-500 mt-1">Medical records submitted</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-indigo-500 uppercase">Claim Settlement Ratio</span>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">97.8%</p>
          <p className="text-[11px] text-slate-500 mt-1">Zero-deduction audit rate</p>
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
            placeholder="Search patient, claim #, policy #, MRN..."
            className="input-stylish !pl-10 pr-3"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedTpa}
            onChange={(e) => setSelectedTpa(e.target.value)}
            className="select-stylish text-xs"
          >
            <option value="ALL">All Empanelled TPAs</option>
            <option value="Medi Assist">Medi Assist TPA</option>
            <option value="Vidal">Vidal Health TPA</option>
            <option value="Paramount">Paramount TPA</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="table-container-stylish">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 py-3">Claim # & Patient</th>
                <th className="px-4 py-3">TPA & Insurance Provider</th>
                <th className="px-4 py-3">Policy # & IPD File</th>
                <th className="px-4 py-3">Clinical Diagnosis</th>
                <th className="px-4 py-3">Sanctioned vs Billed</th>
                <th className="px-4 py-3">Pre-Auth Status</th>
                <th className="px-4 py-3 text-right">Desk Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 dark:text-white font-mono text-xs">{c.claimNumber}</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs mt-0.5">{c.patientName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.mrn}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-white text-xs">{c.tpaName}</div>
                    <div className="text-[11px] text-slate-500">{c.insuranceCompany}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-mono text-xs text-slate-800 dark:text-slate-200">{c.policyNumber}</div>
                    <span className="badge-slate text-[10px] mt-0.5">{c.ipdNumber}</span>
                  </td>

                  <td className="px-4 py-3 max-w-xs">
                    <div className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">{c.diagnosis}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Sanctioned: {formatCurrency(c.sanctionedAmount)}
                    </div>
                    <div className="text-xs text-slate-500">
                      Billed: {formatCurrency(c.totalBilledAmount)}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {c.preAuthStatus === 'APPROVED' ? (
                      <span className="badge-emerald">Pre-Auth Approved</span>
                    ) : c.preAuthStatus === 'ENHANCEMENT_REQUESTED' ? (
                      <span className="badge-amber">Enhancement Sent</span>
                    ) : (
                      <span className="badge-rose">TPA Query Raised</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {c.preAuthStatus !== 'APPROVED' && (
                        <button
                          onClick={() => handleApproveClaim(c.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors"
                        >
                          Approve Pre-Auth
                        </button>
                      )}
                      <button
                        onClick={() => window.print()}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 text-white rounded text-xs font-semibold"
                      >
                        Print Dossier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Claim Modal */}
      {isNewClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="card-stylish w-full max-w-md bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                Submit Cashless TPA Pre-Authorization Request
              </h3>
              <button onClick={() => setIsNewClaimModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClaim} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meera Sundar"
                  value={newClaim.patientName}
                  onChange={(e) => setNewClaim({ ...newClaim, patientName: e.target.value })}
                  className="input-stylish text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">TPA Partner</label>
                  <select
                    value={newClaim.tpaName}
                    onChange={(e) => setNewClaim({ ...newClaim, tpaName: e.target.value })}
                    className="input-stylish text-xs"
                  >
                    <option value="Medi Assist Healthcare TPA">Medi Assist Healthcare TPA</option>
                    <option value="Vidal Health Insurance TPA">Vidal Health Insurance TPA</option>
                    <option value="Paramount TPA Services">Paramount TPA Services</option>
                    <option value="Heritage Health TPA">Heritage Health TPA</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Insurance Company</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Star Health / HDFC Ergo"
                    value={newClaim.insuranceCompany}
                    onChange={(e) => setNewClaim({ ...newClaim, insuranceCompany: e.target.value })}
                    className="input-stylish text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Policy / Member ID</label>
                  <input
                    type="text"
                    required
                    placeholder="POL-123456"
                    value={newClaim.policyNumber}
                    onChange={(e) => setNewClaim({ ...newClaim, policyNumber: e.target.value })}
                    className="input-stylish text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Sanction (₹)</label>
                  <input
                    type="number"
                    value={newClaim.sanctionedAmount}
                    onChange={(e) => setNewClaim({ ...newClaim, sanctionedAmount: Number(e.target.value) })}
                    className="input-stylish text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Provisional Diagnosis</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Appendicitis with planned Lap Appendectomy"
                  value={newClaim.diagnosis}
                  onChange={(e) => setNewClaim({ ...newClaim, diagnosis: e.target.value })}
                  className="input-stylish text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewClaimModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Transmit Pre-Auth to TPA
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
        title="Insurance Cashless TPA Claims Summary"
        text={`Sindhu Hospital TPA Desk: ${claims.length} active inpatient claims, ${formatCurrency(totalSanctioned)} sanctioned.`}
        url={window.location.href}
      />
    </div>
  );
};
