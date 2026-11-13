import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Filter,
  FileText,
  Building2,
  Award,
  ExternalLink,
  X,
  Check,
  Download,
  AlertCircle
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { enterpriseStore } from '../../services/enterpriseDataStore';

interface StatutoryLicense {
  id: string;
  licenseName: string;
  regulatoryAuthority: string;
  licenseNumber: string;
  issueDate: string;
  expiryDate: string;
  renewalLeadDays: number;
  status: 'ACTIVE_VALID' | 'RENEWAL_IN_PROGRESS' | 'EXPIRING_URGENT';
  mandateChapter: 'Statutory Legal' | 'NABH 5th Edition' | 'JCI International' | 'Radiation Safety (AERB)';
  designatedOfficer: string;
}

interface AccreditationChapter {
  code: string;
  name: string;
  standardsCount: number;
  compliancePercentage: number;
  auditStatus: 'AUDIT_PASSED' | 'CAPA_IN_PROGRESS';
  checklistItems: {
    id: string;
    objectiveElement: string;
    isCompliant: boolean;
  }[];
}

export const StatutoryCompliancePage: React.FC = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'STATUTORY_LICENSES' | 'NABH_CHAPTERS'>('STATUTORY_LICENSES');

  // Modals
  const [isAddLicenseOpen, setIsAddLicenseOpen] = useState(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [selectedChapterForChecklist, setSelectedChapterForChecklist] = useState<AccreditationChapter | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // State: Licenses
  const [licenses, setLicenses] = useState<StatutoryLicense[]>(() => {
    const saved = localStorage.getItem('hospital_statutory_licenses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'LIC-01',
        licenseName: 'Atomic Energy Regulatory Board (AERB) Radiation License',
        regulatoryAuthority: 'AERB Government of India',
        licenseNumber: 'AERB-MED-XR-CT-99120',
        issueDate: '2023-08-15',
        expiryDate: '2028-08-14',
        renewalLeadDays: 680,
        status: 'ACTIVE_VALID',
        mandateChapter: 'Radiation Safety (AERB)',
        designatedOfficer: 'Radiological Safety Officer (RSO) Dr. Mohan'
      },
      {
        id: 'LIC-02',
        licenseName: 'Pharmacy Allopathic Drug Retail & Wholesale (Form 20B & 21B)',
        regulatoryAuthority: 'State Drugs Control Administration',
        licenseNumber: 'TN-DRUG-20B-21B-44091',
        issueDate: '2022-12-01',
        expiryDate: '2027-11-30',
        renewalLeadDays: 415,
        status: 'ACTIVE_VALID',
        mandateChapter: 'Statutory Legal',
        designatedOfficer: 'Chief Pharmacist Ravi Kumar'
      },
      {
        id: 'LIC-03',
        licenseName: 'Fire Safety Certificate & No Objection Certificate (NOC)',
        regulatoryAuthority: 'Tamil Nadu Fire & Rescue Services',
        licenseNumber: 'TNFRS-NOC-HOSP-2025-081',
        issueDate: '2025-11-10',
        expiryDate: '2026-11-09',
        renewalLeadDays: 30,
        status: 'EXPIRING_URGENT',
        mandateChapter: 'Statutory Legal',
        designatedOfficer: 'Facility Safety Director Sundar'
      },
      {
        id: 'LIC-04',
        licenseName: 'Bio-Medical Waste Management Authorization (BMW Rule 10)',
        regulatoryAuthority: 'State Pollution Control Board (TNPCB)',
        licenseNumber: 'TNPCB-BMW-AUTH-99014',
        issueDate: '2024-04-01',
        expiryDate: '2027-03-31',
        renewalLeadDays: 175,
        status: 'ACTIVE_VALID',
        mandateChapter: 'Statutory Legal',
        designatedOfficer: 'Infection Control Committee Lead'
      },
      {
        id: 'LIC-05',
        licenseName: 'Clinical Establishments (Registration & Regulation) Act',
        regulatoryAuthority: 'Directorate of Medical & Rural Health Services (DMS)',
        licenseNumber: 'CEA-TN-TERTIARY-501',
        issueDate: '2022-01-01',
        expiryDate: '2027-01-01',
        renewalLeadDays: 85,
        status: 'ACTIVE_VALID',
        mandateChapter: 'Statutory Legal',
        designatedOfficer: 'Medical Superintendent Dr. K. Sindhu'
      }
    ];
  });

  // State: Accreditation Chapters
  const [chapters, setChapters] = useState<AccreditationChapter[]>(() => {
    const saved = localStorage.getItem('hospital_nabh_chapters');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        code: 'AAC',
        name: 'Access, Assessment & Continuity of Care',
        standardsCount: 24,
        compliancePercentage: 98.5,
        auditStatus: 'AUDIT_PASSED',
        checklistItems: [
          { id: 'AAC.1', objectiveElement: 'Defined registration, admission and transfer protocol', isCompliant: true },
          { id: 'AAC.2', objectiveElement: 'Uniform initial patient assessment by qualified doctors within 4 hours', isCompliant: true },
          { id: 'AAC.3', objectiveElement: 'Laboratory and imaging diagnostic services conform to statutory norms', isCompliant: true },
          { id: 'AAC.4', objectiveElement: 'Discharge process is planned with written home care instructions', isCompliant: true }
        ]
      },
      {
        code: 'COP',
        name: 'Care of Patients (ICU, OT, Code Blue)',
        standardsCount: 32,
        compliancePercentage: 99.1,
        auditStatus: 'AUDIT_PASSED',
        checklistItems: [
          { id: 'COP.1', objectiveElement: 'Uniform care delivered across all beds, ICUs, and surgical wards', isCompliant: true },
          { id: 'COP.2', objectiveElement: 'Resuscitation protocols and Code Blue drills validated monthly', isCompliant: true },
          { id: 'COP.3', objectiveElement: 'Safe blood and blood products transfusion protocols enforced', isCompliant: true },
          { id: 'COP.4', objectiveElement: 'High-dependency ICU patient care conforms to nurse:patient 1:1 ratio', isCompliant: true }
        ]
      },
      {
        code: 'MOM',
        name: 'Management of Medication (LASA, High-Risk)',
        standardsCount: 22,
        compliancePercentage: 97.8,
        auditStatus: 'AUDIT_PASSED',
        checklistItems: [
          { id: 'MOM.1', objectiveElement: 'Look-Alike Sound-Alike (LASA) drugs physically segregated with visual tall-man tags', isCompliant: true },
          { id: 'MOM.2', objectiveElement: 'High-alert concentrated electrolytes stored under double-lock in wards', isCompliant: true },
          { id: 'MOM.3', objectiveElement: 'Emergency crash cart drugs inspected & sealed every 24 hours', isCompliant: true },
          { id: 'MOM.4', objectiveElement: 'Adverse Drug Reaction (ADR) reporting linked with PvPI national registry', isCompliant: true }
        ]
      },
      {
        code: 'PRE',
        name: 'Patient Rights and Education & Informed Consent',
        standardsCount: 18,
        compliancePercentage: 100.0,
        auditStatus: 'AUDIT_PASSED',
        checklistItems: [
          { id: 'PRE.1', objectiveElement: 'Charter of patient rights displayed in English and regional languages', isCompliant: true },
          { id: 'PRE.2', objectiveElement: 'Informed bilingual written consent taken prior to surgery and blood transfusion', isCompliant: true },
          { id: 'PRE.3', objectiveElement: 'Patient grievance redressal committee functional with 48h SLA', isCompliant: true }
        ]
      },
      {
        code: 'HIC',
        name: 'Hospital Infection Control (CSSD, Hand Hygiene)',
        standardsCount: 28,
        compliancePercentage: 98.9,
        auditStatus: 'AUDIT_PASSED',
        checklistItems: [
          { id: 'HIC.1', objectiveElement: 'Comprehensive infection prevention program guided by multidisciplinary ICC', isCompliant: true },
          { id: 'HIC.2', objectiveElement: 'CSSD autoclave physical, chemical Class 5, and biological spore indicators verified', isCompliant: true },
          { id: 'HIC.3', objectiveElement: 'WHO 5 moments hand hygiene compliance audited above 92%', isCompliant: true },
          { id: 'HIC.4', objectiveElement: 'Biomedical waste segregation strictly according to 4-color coded bins', isCompliant: true }
        ]
      },
      {
        code: 'FMS',
        name: 'Facility Management and Safety (Fire, MGPS, Gas)',
        standardsCount: 26,
        compliancePercentage: 96.2,
        auditStatus: 'CAPA_IN_PROGRESS',
        checklistItems: [
          { id: 'FMS.1', objectiveElement: 'Fire safety equipment, smoke detectors and hydrant nozzles certified', isCompliant: true },
          { id: 'FMS.2', objectiveElement: 'Medical gas pipeline system (MGPS) vacuum & oxygen plant alarms calibrated', isCompliant: true },
          { id: 'FMS.3', objectiveElement: 'Hazardous materials and chemical spill kits deployed in lab and pathology', isCompliant: false },
          { id: 'FMS.4', objectiveElement: 'Emergency mock evacuation drill conducted semi-annually with fire department', isCompliant: true }
        ]
      },
      {
        code: 'HRM',
        name: 'Human Resource Management & Staff Credentialing',
        standardsCount: 20,
        compliancePercentage: 99.4,
        auditStatus: 'AUDIT_PASSED',
        checklistItems: [
          { id: 'HRM.1', objectiveElement: 'All consultant doctors credentialed with valid State Medical Council registrations', isCompliant: true },
          { id: 'HRM.2', objectiveElement: 'Staff orientation and annual BLS/ACLS resuscitation training verified', isCompliant: true },
          { id: 'HRM.3', objectiveElement: 'Annual staff health checks including Hepatitis B antibody titers completed', isCompliant: true }
        ]
      }
    ];
  });

  // Add License Form State
  const [newLicName, setNewLicName] = useState('');
  const [newLicAuth, setNewLicAuth] = useState('');
  const [newLicNumber, setNewLicNumber] = useState('');
  const [newLicIssue, setNewLicIssue] = useState('');
  const [newLicExpiry, setNewLicExpiry] = useState('');
  const [newLicOfficer, setNewLicOfficer] = useState('');
  const [newLicMandate, setNewLicMandate] = useState<StatutoryLicense['mandateChapter']>('Statutory Legal');

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hospital_statutory_licenses', JSON.stringify(licenses));
    } catch (e) {
      console.error(e);
    }
  }, [licenses]);

  useEffect(() => {
    try {
      localStorage.setItem('hospital_nabh_chapters', JSON.stringify(chapters));
    } catch (e) {
      console.error(e);
    }
  }, [chapters]);

  // Handle Add License
  const handleAddLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLicName.trim() || !newLicAuth.trim() || !newLicNumber.trim()) return;

    const expiryDateObj = new Date(newLicExpiry);
    const today = new Date();
    const diffDays = Math.ceil((expiryDateObj.getTime() - today.getTime()) / (1000 * 3600 * 24));
    const status: StatutoryLicense['status'] = diffDays <= 45 ? 'EXPIRING_URGENT' : 'ACTIVE_VALID';

    const newLic: StatutoryLicense = {
      id: `LIC-${String(licenses.length + 1).padStart(2, '0')}`,
      licenseName: newLicName.trim(),
      regulatoryAuthority: newLicAuth.trim(),
      licenseNumber: newLicNumber.trim(),
      issueDate: newLicIssue || new Date().toISOString().split('T')[0],
      expiryDate: newLicExpiry || '2028-12-31',
      renewalLeadDays: Math.max(0, diffDays),
      status,
      mandateChapter: newLicMandate,
      designatedOfficer: newLicOfficer.trim() || 'Medical Superintendent'
    };

    setLicenses([...licenses, newLic]);
    setIsAddLicenseOpen(false);
    setNewLicName('');
    setNewLicAuth('');
    setNewLicNumber('');
    setNewLicIssue('');
    setNewLicExpiry('');
    setNewLicOfficer('');
    showToast(`Registered statutory license: ${newLic.licenseName}`);
  };

  // Handle License Renewal
  const handleRenewLicense = (id: string) => {
    const newExpiry = new Date(Date.now() + 3 * 365 * 24 * 3600 * 1000).toISOString().split('T')[0];
    enterpriseStore.renewLicense(id, newExpiry);
    setLicenses(prev =>
      prev.map(l => {
        if (l.id === id) {
          return {
            ...l,
            expiryDate: newExpiry,
            status: 'ACTIVE_VALID',
            renewalLeadDays: 1095
          };
        }
        return l;
      })
    );
    showToast('Operating license renewed for 3 years!');
  };

  // Toggle Checklist Item
  const handleToggleChecklistItem = (chapterCode: string, itemId: string) => {
    setChapters(prev =>
      prev.map(ch => {
        if (ch.code === chapterCode) {
          const updatedItems = ch.checklistItems.map(item =>
            item.id === itemId ? { ...item, isCompliant: !item.isCompliant } : item
          );
          const compliantCount = updatedItems.filter(i => i.isCompliant).length;
          const newPct = parseFloat(((compliantCount / updatedItems.length) * 100).toFixed(1));
          const newStatus = newPct >= 95 ? 'AUDIT_PASSED' : 'CAPA_IN_PROGRESS';
          const updatedChapter = {
            ...ch,
            compliancePercentage: newPct,
            auditStatus: newStatus as any,
            checklistItems: updatedItems
          };
          if (selectedChapterForChecklist && selectedChapterForChecklist.code === chapterCode) {
            setSelectedChapterForChecklist(updatedChapter);
          }
          return updatedChapter;
        }
        return ch;
      })
    );
  };

  const overallNabhScore = (chapters.reduce((acc, c) => acc + c.compliancePercentage, 0) / chapters.length).toFixed(1);

  const filteredLicenses = licenses.filter(l => {
    const matchesSearch =
      l.licenseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.regulatoryAuthority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.designatedOfficer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="card-stylish p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Hospital Statutory Compliance &amp; Accreditation Readiness
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              AERB radiation, fire NOC, pollution control, drug sales licenses, and NABH 5th Edition standards matrix
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsDossierModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <Award className="w-4 h-4" />
            Generate NABH Dossier
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
            title="Share compliance report"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
            title="Print report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-slate-500 uppercase">NABH 5th Edition Score</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{overallNabhScore}%</p>
          <p className="text-[11px] text-emerald-600 mt-1">Full Accreditation Grade</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-slate-500 uppercase">Statutory Licenses Active</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{licenses.length} Permits</p>
          <p className="text-[11px] text-slate-500 mt-1">100% legal operating mandates</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-rose-500 uppercase">Renewal Required (&lt;45d)</span>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {licenses.filter(l => l.status === 'EXPIRING_URGENT').length} Permit
          </p>
          <p className="text-[11px] text-rose-500 mt-1">
            {licenses.some(l => l.status === 'EXPIRING_URGENT') ? 'Renewal Due' : 'All Clear'}
          </p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-indigo-500 uppercase">Radiation Safety (AERB)</span>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">Certified</p>
          <p className="text-[11px] text-slate-500 mt-1">QA tests passed till 2028</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('STATUTORY_LICENSES')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'STATUTORY_LICENSES'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Statutory Operating Licenses &amp; Permits ({licenses.length})
        </button>
        <button
          onClick={() => setActiveTab('NABH_CHAPTERS')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'NABH_CHAPTERS'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          NABH 5th Edition Chapters Matrix ({chapters.length})
        </button>
      </div>

      {/* TAB 1: STATUTORY LICENSES */}
      {activeTab === 'STATUTORY_LICENSES' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search license, authority or registration..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE_VALID">Active & Compliant</option>
                <option value="EXPIRING_URGENT">Renewal Due (&lt;45d)</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddLicenseOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Statutory Permit
            </button>
          </div>

          <div className="table-container-stylish">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-4 py-3">License Name &amp; Authority</th>
                    <th className="px-4 py-3">Registration Number</th>
                    <th className="px-4 py-3">Valid From &amp; To</th>
                    <th className="px-4 py-3">Designated Hospital Lead</th>
                    <th className="px-4 py-3">Renewal Urgency</th>
                    <th className="px-4 py-3 text-right">Inspection Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredLicenses.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">{l.licenseName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{l.regulatoryAuthority}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{l.licenseNumber}</div>
                        <span className="badge-slate text-[10px] mt-0.5">{l.mandateChapter}</span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-xs text-slate-700 dark:text-slate-300">Issued: {l.issueDate}</div>
                        <div
                          className={`text-xs font-semibold mt-0.5 ${
                            l.status === 'EXPIRING_URGENT' ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          Expiry: {l.expiryDate}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-xs text-slate-800 dark:text-slate-200">{l.designatedOfficer}</div>
                      </td>

                      <td className="px-4 py-3">
                        {l.status === 'EXPIRING_URGENT' ? (
                          <span className="badge-rose animate-pulse">Renewal Due in {l.renewalLeadDays} Days!</span>
                        ) : (
                          <span className="badge-emerald">Active &amp; Compliant</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {l.status === 'EXPIRING_URGENT' && (
                            <button
                              onClick={() => handleRenewLicense(l.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors shadow-xs"
                            >
                              Renew License
                            </button>
                          )}
                          <button
                            onClick={() => window.print()}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold"
                          >
                            View Permit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredLicenses.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-xs text-slate-400">
                        No statutory permits found matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NABH 5TH EDITION CHAPTERS */}
      {activeTab === 'NABH_CHAPTERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chapters.map((ch, i) => (
            <div
              key={i}
              className="card-stylish p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="badge-indigo font-bold">{ch.code}</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {ch.compliancePercentage}% Compliant
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{ch.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{ch.standardsCount} Objective Elements Audited</p>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${ch.compliancePercentage}%` }} />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className={ch.auditStatus === 'AUDIT_PASSED' ? 'badge-emerald text-[11px]' : 'badge-amber text-[11px]'}>
                  {ch.auditStatus === 'AUDIT_PASSED' ? 'Assessor Audit Passed' : 'CAPA Under Implementation'}
                </span>
                <button
                  onClick={() => setSelectedChapterForChecklist(ch)}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                >
                  View Checklist &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: ADD STATUTORY LICENSE */}
      {isAddLicenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Register Statutory Permit</h3>
              </div>
              <button
                onClick={() => setIsAddLicenseOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLicense} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  License / Certificate Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lift Safety Inspection Certificate"
                  value={newLicName}
                  onChange={e => setNewLicName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Regulatory Authority
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical Inspectorate Department"
                  value={newLicAuth}
                  onChange={e => setNewLicAuth(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Registration / Permit No.
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="EID-LIFT-2026-99"
                    value={newLicNumber}
                    onChange={e => setNewLicNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Mandate Chapter
                  </label>
                  <select
                    value={newLicMandate}
                    onChange={e => setNewLicMandate(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  >
                    <option value="Statutory Legal">Statutory Legal</option>
                    <option value="Radiation Safety (AERB)">Radiation Safety (AERB)</option>
                    <option value="NABH 5th Edition">NABH 5th Edition</option>
                    <option value="JCI International">JCI International</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newLicIssue}
                    onChange={e => setNewLicIssue(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newLicExpiry}
                    onChange={e => setNewLicExpiry(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Designated Hospital Officer
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chief Biomedical Engineer / Facility Lead"
                  value={newLicOfficer}
                  onChange={e => setNewLicOfficer(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddLicenseOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-sm"
                >
                  Save Permit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: NABH PRINCIPAL ASSESSOR DOSSIER */}
      {isDossierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  NABH 5th Edition Principal Assessor Accreditation Dossier
                </h3>
              </div>
              <button
                onClick={() => setIsDossierModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Content */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs font-sans">
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-4">
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white tracking-tight">
                    SINDHU HEALTHCARE HOSPITAL &amp; RESEARCH INSTITUTE
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Tertiary Care Multi-Specialty Hospital (350 Beds)
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    NABH Ref: TN-NABH-HOSP-2026-902 • Quality Council of India
                  </p>
                </div>
                <div className="text-right">
                  <span className="badge-emerald font-bold">100% AUDIT READY</span>
                  <p className="text-[10px] text-slate-400 mt-1">Generated: {new Date().toLocaleDateString('en-GB')}</p>
                </div>
              </div>

              {/* Assessment Metrics */}
              <div className="grid grid-cols-3 gap-3 py-1">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Accreditation Grade</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{overallNabhScore}%</span>
                  <p className="text-[10px] text-slate-500">Full 3-Year Cycle</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Statutory Mandates</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">{licenses.length} Verified</span>
                  <p className="text-[10px] text-slate-500">AERB, Fire, Pollution, CEA</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Chapters Audited</span>
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{chapters.length} Modules</span>
                  <p className="text-[10px] text-slate-500">170 Objective Elements</p>
                </div>
              </div>

              {/* Chapter Compliance Summary */}
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white mb-2">NABH 5th Edition Chapter Performance:</h5>
                <div className="space-y-1.5">
                  {chapters.map(ch => (
                    <div
                      key={ch.code}
                      className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{ch.code}</span>
                        <span className="text-slate-600 dark:text-slate-400 truncate max-w-[280px]">{ch.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{ch.compliancePercentage}%</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            ch.auditStatus === 'AUDIT_PASSED'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {ch.auditStatus === 'AUDIT_PASSED' ? 'PASSED' : 'CAPA OPEN'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sign-off */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end text-[10px] text-slate-500">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Dr. K. Sindhu, MD, DNB</p>
                  <p>Medical Superintendent &amp; Quality Chair</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 dark:text-slate-200">NABH Principal Assessor Team</p>
                  <p>Quality Council of India (QCI) Accreditation Board</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => window.print()}
                className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Dossier PDF
              </button>
              <button
                type="button"
                onClick={() => setIsDossierModalOpen(false)}
                className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: NABH CHAPTER CHECKLIST & SELF-ASSESSMENT */}
      {selectedChapterForChecklist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="badge-indigo font-bold">{selectedChapterForChecklist.code}</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Objective Elements Checklist
                </h3>
              </div>
              <button
                onClick={() => setSelectedChapterForChecklist(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {selectedChapterForChecklist.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit each core objective standard. Toggle compliance checkboxes to update self-assessment score.
              </p>
            </div>

            <div className="space-y-2">
              {selectedChapterForChecklist.checklistItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklistItem(selectedChapterForChecklist.code, item.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    item.isCompliant
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                      item.isCompliant ? 'bg-emerald-600 text-white' : 'border border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {item.isCompliant && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200 block">
                      {item.id}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                      {item.objectiveElement}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500">
                Chapter Compliance:{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {selectedChapterForChecklist.compliancePercentage}%
                </strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedChapterForChecklist(null)}
                className="px-4 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition"
              >
                Save &amp; Close Checklist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Hospital Accreditation & Statutory Compliance"
        text={`Hospital Legal Governance: ${licenses.length} statutory permits verified, NABH 5th edition compliance score ${overallNabhScore}%.`}
        url={window.location.href}
      />
    </div>
  );
};
