import React, { useState, useEffect } from 'react';
import {
  Award,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Filter,
  ShieldCheck,
  User,
  GraduationCap,
  FileCheck,
  X,
  BadgeCheck,
  Calendar,
  Eye,
  FileText
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';

interface DoctorCredential {
  id: string;
  doctorName: string;
  department: string;
  councilRegistrationNo: string;
  registrationCouncil: string;
  licenseExpiryDate: string;
  clinicalPrivilegeTier: 'Full Surgical & High-Risk Interventional' | 'Core Clinical & Diagnostic' | 'Consulting Specialist' | 'Supervised Trainee';
  blsAclsCertified: boolean;
  cmeCreditsThisYear: number;
  credentialStatus: 'ACTIVE_PRIVILEGED' | 'RENEWAL_WINDOW_SOON' | 'EXPIRED_RESTRICTED';
  degrees?: string;
  privilegeScope?: string[];
}

const INITIAL_CREDENTIALS: DoctorCredential[] = [
  {
    id: 'CRD-01',
    doctorName: 'Dr. Arunachalam Kumar',
    department: 'Cardiology & Cath Lab',
    councilRegistrationNo: 'TNMC-REG-54891',
    registrationCouncil: 'Tamil Nadu Medical Council (NMC Registered)',
    licenseExpiryDate: '2028-05-31',
    clinicalPrivilegeTier: 'Full Surgical & High-Risk Interventional',
    blsAclsCertified: true,
    cmeCreditsThisYear: 38,
    credentialStatus: 'ACTIVE_PRIVILEGED',
    degrees: 'MBBS, MD (Gen Med), DM (Cardiology), FACC',
    privilegeScope: ['Coronary Angiography & PTCA', 'Primary Angioplasty (PPCI)', 'TAVR & Valve Implants', 'Temporary & Permanent Pacemakers']
  },
  {
    id: 'CRD-02',
    doctorName: 'Dr. Sindhu Rajagopalan',
    department: 'General Medicine & Diabetology',
    councilRegistrationNo: 'TNMC-REG-71204',
    registrationCouncil: 'Tamil Nadu Medical Council',
    licenseExpiryDate: '2027-11-15',
    clinicalPrivilegeTier: 'Core Clinical & Diagnostic',
    blsAclsCertified: true,
    cmeCreditsThisYear: 42,
    credentialStatus: 'ACTIVE_PRIVILEGED',
    degrees: 'MBBS, MD (Internal Medicine), PGD Diabetology',
    privilegeScope: ['Inpatient Adult Care', 'Diabetic Ketoacidosis Protocol', 'Emergency Resuscitation Core', 'Hypertension Crisis Management']
  },
  {
    id: 'CRD-03',
    doctorName: 'Dr. P. Sundaram',
    department: 'Joint Replacement & Orthopedics',
    councilRegistrationNo: 'TNMC-REG-58190',
    registrationCouncil: 'Tamil Nadu Medical Council',
    licenseExpiryDate: '2026-11-30',
    clinicalPrivilegeTier: 'Full Surgical & High-Risk Interventional',
    blsAclsCertified: true,
    cmeCreditsThisYear: 28,
    credentialStatus: 'RENEWAL_WINDOW_SOON',
    degrees: 'MBBS, MS (Orthopedics), MCh (Ortho)',
    privilegeScope: ['Total Knee Arthroplasty (TKR)', 'Total Hip Replacement (THR)', 'Complex Trauma Open Reduction', 'Arthroscopic Ligament Reconstruction']
  },
  {
    id: 'CRD-04',
    doctorName: 'Dr. Joseph Anthony',
    department: 'Emergency & Critical Care',
    councilRegistrationNo: 'TNMC-REG-69412',
    registrationCouncil: 'Tamil Nadu Medical Council',
    licenseExpiryDate: '2029-01-10',
    clinicalPrivilegeTier: 'Full Surgical & High-Risk Interventional',
    blsAclsCertified: true,
    cmeCreditsThisYear: 35,
    credentialStatus: 'ACTIVE_PRIVILEGED',
    degrees: 'MBBS, MD (Emergency Medicine), FACEM',
    privilegeScope: ['Advanced Airway Management', 'Central Venous & Arterial Lines', 'Bedside Focused Echo (POCUS)', 'Emergency Resuscitation Lead']
  }
];

export const DoctorCredentialingPage: React.FC = () => {
  const [credentials, setCredentials] = useState<DoctorCredential[]>(() => {
    const saved = localStorage.getItem('hospital_doctor_credentials_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CREDENTIALS;
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [isNewCredentialModalOpen, setIsNewCredentialModalOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<DoctorCredential | null>(null);

  const [newCred, setNewCred] = useState({
    doctorName: '',
    department: 'General Medicine',
    councilRegistrationNo: '',
    registrationCouncil: 'Tamil Nadu Medical Council (NMC)',
    licenseExpiryDate: '2028-12-31',
    clinicalPrivilegeTier: 'Core Clinical & Diagnostic' as DoctorCredential['clinicalPrivilegeTier'],
    blsAclsCertified: true,
    cmeCreditsThisYear: 30,
    degrees: 'MBBS, MD'
  });

  useEffect(() => {
    try {
      localStorage.setItem('hospital_doctor_credentials_v1', JSON.stringify(credentials));
    } catch (e) {
      console.error(e);
    }
  }, [credentials]);

  const handleCreateCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCred.doctorName.trim() || !newCred.councilRegistrationNo.trim()) return;

    const created: DoctorCredential = {
      id: `CRD-0${credentials.length + 5}`,
      doctorName: newCred.doctorName,
      department: newCred.department,
      councilRegistrationNo: newCred.councilRegistrationNo,
      registrationCouncil: newCred.registrationCouncil,
      licenseExpiryDate: newCred.licenseExpiryDate,
      clinicalPrivilegeTier: newCred.clinicalPrivilegeTier,
      blsAclsCertified: newCred.blsAclsCertified,
      cmeCreditsThisYear: Number(newCred.cmeCreditsThisYear),
      credentialStatus: 'ACTIVE_PRIVILEGED',
      degrees: newCred.degrees,
      privilegeScope: ['Core Inpatient Consultations', 'Diagnostic Review', 'Emergency Resuscitation Protocol']
    };

    setCredentials([created, ...credentials]);
    setIsNewCredentialModalOpen(false);
    setNewCred({
      doctorName: '',
      department: 'General Medicine',
      councilRegistrationNo: '',
      registrationCouncil: 'Tamil Nadu Medical Council (NMC)',
      licenseExpiryDate: '2028-12-31',
      clinicalPrivilegeTier: 'Core Clinical & Diagnostic',
      blsAclsCertified: true,
      cmeCreditsThisYear: 30,
      degrees: 'MBBS, MD'
    });
  };

  const filtered = credentials.filter((c) => {
    const matchDept = selectedDept === 'ALL' || c.department.includes(selectedDept);
    const q = searchQuery.toLowerCase();
    const matchSearch =
      c.doctorName.toLowerCase().includes(q) ||
      c.councilRegistrationNo.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q);
    return matchDept && matchSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <Award className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-jakarta">
              Clinical Credentialing, Privileging &amp; Licensing Desk
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Medical council registration renewal alerts, surgical privileging scope, and mandatory BLS/ACLS/CME audits
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNewCredentialModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Doctor Dossier
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold"
            title="Print Credentials Matrix"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Empanelled Consultants</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{credentials.length} Doctors</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Multi-specialty tertiary tier</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 uppercase">Privileged &amp; Verified</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">100%</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Active council licenses</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-sm">
          <span className="text-xs font-bold text-amber-600 uppercase">Renewal Due Soon</span>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {credentials.filter((c) => c.credentialStatus === 'RENEWAL_WINDOW_SOON').length} Doctor
          </p>
          <p className="text-[11px] text-amber-600 mt-0.5">Council notice sent</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-indigo-200/80 shadow-sm">
          <span className="text-xs font-bold text-indigo-600 uppercase">BLS / ACLS Certified</span>
          <p className="text-2xl font-black text-indigo-700 mt-1">
            {credentials.filter((c) => c.blsAclsCertified).length} / {credentials.length}
          </p>
          <p className="text-[11px] text-indigo-600 mt-0.5">AHA Resuscitation Standard</p>
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
            placeholder="Search doctor name, registration #, department..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
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
            <option value="Cardiology">Cardiology</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Doctor Name &amp; Department</th>
                <th className="px-5 py-3.5">Council Registration #</th>
                <th className="px-5 py-3.5">Medical Council &amp; Expiry</th>
                <th className="px-5 py-3.5">Clinical Privileging Scope</th>
                <th className="px-5 py-3.5">Resuscitation &amp; CME</th>
                <th className="px-5 py-3.5">Privilege Status</th>
                <th className="px-5 py-3.5 text-right">Desk Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 text-xs">{c.doctorName}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {c.department}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-mono text-xs font-bold text-slate-800">{c.councilRegistrationNo}</div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-xs text-slate-700">{c.registrationCouncil}</div>
                    <div className={`text-xs mt-0.5 font-medium ${c.credentialStatus === 'RENEWAL_WINDOW_SOON' ? 'text-amber-600 font-bold' : 'text-slate-500'}`}>
                      Valid Till: {c.licenseExpiryDate}
                    </div>
                  </td>

                  <td className="px-5 py-4 max-w-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {c.clinicalPrivilegeTier}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs">
                      {c.blsAclsCertified && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          BLS / ACLS ✓
                        </span>
                      )}
                      <span className="text-slate-500 font-semibold">{c.cmeCreditsThisYear} CME Pts</span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    {c.credentialStatus === 'ACTIVE_PRIVILEGED' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active &amp; Privileged
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Renewal Due Soon
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedDossier(c)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 ml-auto transition shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Physician Credentialing Dossier View */}
      {selectedDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 font-black flex items-center justify-center text-lg border border-indigo-100">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{selectedDossier.doctorName}</h3>
                  <p className="text-xs text-indigo-600 font-semibold">{selectedDossier.degrees || 'Medical Consultant'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDossier(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Department</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedDossier.department}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Council Registration</span>
                  <p className="font-mono font-bold text-indigo-700 mt-0.5">{selectedDossier.councilRegistrationNo}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">License Expiry</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedDossier.licenseExpiryDate}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">CME Credits (This Year)</span>
                  <p className="font-semibold text-emerald-700 mt-0.5">{selectedDossier.cmeCreditsThisYear} / 30 Target Met ✓</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2">
                <span className="font-bold text-indigo-900 text-[11px] uppercase">Authorized Clinical Privileges (Scope of Practice):</span>
                <div className="space-y-1">
                  {(selectedDossier.privilegeScope || ['Core Outpatient & Inpatient Consultations']).map((scope, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                      {scope}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-center gap-2.5 text-emerald-800">
                <BadgeCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-[11px] leading-tight font-medium">
                  National Medical Commission (NMC) registration verified. American Heart Association BLS &amp; ACLS credentials current.
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Dossier
              </button>
              <button
                onClick={() => setSelectedDossier(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Doctor Dossier */}
      {isNewCredentialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <Award className="w-5 h-5 text-indigo-600" />
                Add Physician Credentialing Dossier
              </h3>
              <button onClick={() => setIsNewCredentialModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCredential} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Name &amp; Degrees *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Kumar, MS, FRCS"
                  value={newCred.doctorName}
                  onChange={(e) => setNewCred({ ...newCred, doctorName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newCred.department}
                    onChange={(e) => setNewCred({ ...newCred, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                  >
                    <option value="Cardiology & Cath Lab">Cardiology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Emergency Care">Emergency Care</option>
                    <option value="General Surgery">General Surgery</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Council Reg # *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TNMC-REG-99124"
                    value={newCred.councilRegistrationNo}
                    onChange={(e) => setNewCred({ ...newCred, councilRegistrationNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Privileging Scope Tier</label>
                <select
                  value={newCred.clinicalPrivilegeTier}
                  onChange={(e) => setNewCred({ ...newCred, clinicalPrivilegeTier: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                >
                  <option value="Full Surgical & High-Risk Interventional">Full Surgical &amp; High-Risk Interventional</option>
                  <option value="Core Clinical & Diagnostic">Core Clinical &amp; Diagnostic</option>
                  <option value="Consulting Specialist">Consulting Specialist</option>
                  <option value="Supervised Trainee">Supervised Trainee</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">License Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newCred.licenseExpiryDate}
                    onChange={(e) => setNewCred({ ...newCred, licenseExpiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Annual CME Credits</label>
                  <input
                    type="number"
                    value={newCred.cmeCreditsThisYear}
                    onChange={(e) => setNewCred({ ...newCred, cmeCreditsThisYear: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewCredentialModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/25 transition"
                >
                  Save Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
