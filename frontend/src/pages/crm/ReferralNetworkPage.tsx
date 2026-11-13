import React, { useState, useEffect } from 'react';
import {
  Network,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Filter,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  X,
  Award,
  ArrowRight
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';

interface ReferralDoctor {
  id: string;
  doctorName: string;
  specialization: string;
  clinicHospitalName: string;
  locationArea: string;
  phone: string;
  email: string;
  totalPatientsReferred: number;
  activeInpatientsCount: number;
  lastReferralDate: string;
  relationshipTier: 'PLATINUM_PARTNER' | 'GOLD_PARTNER' | 'ASSOCIATE';
  dischargeSummaryReturned: boolean;
}

const INITIAL_REFERRAL_DOCTORS: ReferralDoctor[] = [
  {
    id: 'REF-01',
    doctorName: 'Dr. K. Balaji, MBBS, MD',
    specialization: 'Consultant Physician & Family Medicine',
    clinicHospitalName: 'Balaji Family Health Clinic',
    locationArea: 'T. Nagar, Chennai',
    phone: '+91 98401 22310',
    email: 'dr.balaji@clinic.com',
    totalPatientsReferred: 48,
    activeInpatientsCount: 3,
    lastReferralDate: '2026-10-08',
    relationshipTier: 'PLATINUM_PARTNER',
    dischargeSummaryReturned: true
  },
  {
    id: 'REF-02',
    doctorName: 'Dr. Sunitha V., MBBS, DGO',
    specialization: 'Obstetrics & Primary Gynecology',
    clinicHospitalName: 'Mother & Child Care Center',
    locationArea: 'Anna Nagar, Chennai',
    phone: '+91 98412 88714',
    email: 'dr.sunitha@care.org',
    totalPatientsReferred: 32,
    activeInpatientsCount: 2,
    lastReferralDate: '2026-10-06',
    relationshipTier: 'GOLD_PARTNER',
    dischargeSummaryReturned: true
  },
  {
    id: 'REF-03',
    doctorName: 'Dr. M. S. Raghavan, MBBS, DNB',
    specialization: 'General Practice & Diabetology',
    clinicHospitalName: 'Sri Raghavan Diabetes Clinic',
    locationArea: 'Velachery, Chennai',
    phone: '+91 98403 66109',
    email: 'dr.raghavan@diabcare.in',
    totalPatientsReferred: 64,
    activeInpatientsCount: 4,
    lastReferralDate: '2026-10-07',
    relationshipTier: 'PLATINUM_PARTNER',
    dischargeSummaryReturned: true
  },
  {
    id: 'REF-04',
    doctorName: 'Dr. Priya S., MBBS, DCH',
    specialization: 'Pediatric Care & Neonatology',
    clinicHospitalName: 'Little Stars Children Clinic',
    locationArea: 'Tambaram, Chennai',
    phone: '+91 98400 33445',
    email: 'dr.priya@littlestars.in',
    totalPatientsReferred: 21,
    activeInpatientsCount: 1,
    lastReferralDate: '2026-10-04',
    relationshipTier: 'ASSOCIATE',
    dischargeSummaryReturned: true
  }
];

export const ReferralNetworkPage: React.FC = () => {
  const [doctors, setDoctors] = useState<ReferralDoctor[]>(() => {
    const saved = localStorage.getItem('hospital_referral_doctors_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REFERRAL_DOCTORS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [isNewDoctorModalOpen, setIsNewDoctorModalOpen] = useState(false);
  const [loggingReferralDoc, setLoggingReferralDoc] = useState<ReferralDoctor | null>(null);

  // New Doctor Form State
  const [newDoc, setNewDoc] = useState({
    doctorName: '',
    specialization: 'Family Medicine & General Practice',
    clinicHospitalName: '',
    locationArea: 'Chennai Central',
    phone: '',
    email: '',
    relationshipTier: 'ASSOCIATE' as ReferralDoctor['relationshipTier']
  });

  // Log Referral Form State
  const [newReferralCase, setNewReferralCase] = useState({
    patientName: '',
    diagnosis: 'Acute Coronary Syndrome evaluation',
    targetDepartment: 'Cardiology'
  });

  useEffect(() => {
    try {
      localStorage.setItem('hospital_referral_doctors_v1', JSON.stringify(doctors));
    } catch (e) {
      console.error(e);
    }
  }, [doctors]);

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.doctorName.trim() || !newDoc.clinicHospitalName.trim()) return;

    const created: ReferralDoctor = {
      id: `REF-${Date.now()}`,
      doctorName: newDoc.doctorName,
      specialization: newDoc.specialization,
      clinicHospitalName: newDoc.clinicHospitalName,
      locationArea: newDoc.locationArea,
      phone: newDoc.phone || '+91 98400 00000',
      email: newDoc.email || 'doctor@clinic.com',
      totalPatientsReferred: 0,
      activeInpatientsCount: 0,
      lastReferralDate: new Date().toISOString().split('T')[0],
      relationshipTier: newDoc.relationshipTier,
      dischargeSummaryReturned: true
    };

    setDoctors([created, ...doctors]);
    setIsNewDoctorModalOpen(false);
    setNewDoc({
      doctorName: '',
      specialization: 'Family Medicine & General Practice',
      clinicHospitalName: '',
      locationArea: 'Chennai Central',
      phone: '',
      email: '',
      relationshipTier: 'ASSOCIATE'
    });
  };

  const handleLogReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggingReferralDoc || !newReferralCase.patientName.trim()) return;

    setDoctors((prev) =>
      prev.map((d) =>
        d.id === loggingReferralDoc.id
          ? {
              ...d,
              totalPatientsReferred: d.totalPatientsReferred + 1,
              activeInpatientsCount: d.activeInpatientsCount + 1,
              lastReferralDate: new Date().toISOString().split('T')[0]
            }
          : d
      )
    );

    setLoggingReferralDoc(null);
    setNewReferralCase({ patientName: '', diagnosis: 'Acute Coronary Syndrome evaluation', targetDepartment: 'Cardiology' });
  };

  const totalReferrals = doctors.reduce((acc, d) => acc + d.totalPatientsReferred, 0);
  const activeInpatients = doctors.reduce((acc, d) => acc + d.activeInpatientsCount, 0);

  const filteredDoctors = doctors.filter((d) => {
    const matchTier = selectedTier === 'ALL' || d.relationshipTier === selectedTier;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !searchQuery ||
      d.doctorName.toLowerCase().includes(q) ||
      d.specialization.toLowerCase().includes(q) ||
      d.clinicHospitalName.toLowerCase().includes(q) ||
      d.locationArea.toLowerCase().includes(q);
    return matchTier && matchQuery;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 font-jakarta">
            <span className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
              <Network className="w-6 h-6" />
            </span>
            External Doctor Referral &amp; Clinic Liaison Network
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Empanelled neighborhood general practitioners, primary clinics, bi-directional discharge continuity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewDoctorModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Empanel Referring Doctor
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl border border-slate-200 text-xs font-bold flex items-center gap-1.5"
            title="Print Network Directory"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase">Empanelled Doctors</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{doctors.length} Physicians</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-blue-200/80 shadow-sm">
          <span className="text-xs text-blue-600 font-bold uppercase">Total Patient Inward Referrals</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{totalReferrals} Patients</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-sm">
          <span className="text-xs text-amber-600 font-bold uppercase">Active Inpatients Today</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{activeInpatients} Beds</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-sm">
          <span className="text-xs text-emerald-600 font-bold uppercase">Discharge Loop Return</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">100% Shared</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor, clinic name, area, specialty..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Partnership Tiers</option>
            <option value="PLATINUM_PARTNER">Platinum Partner (50+ referrals)</option>
            <option value="GOLD_PARTNER">Gold Partner (25+ referrals)</option>
            <option value="ASSOCIATE">Associate Clinic</option>
          </select>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Doctor &amp; Specialization</th>
                <th className="px-5 py-3.5">Clinic Name &amp; Area</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Partnership Tier</th>
                <th className="px-5 py-3.5">Referral Volume</th>
                <th className="px-5 py-3.5 text-right">Desk Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 text-xs">{doc.doctorName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{doc.specialization}</div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-800 text-xs flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {doc.clinicHospitalName}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {doc.locationArea}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-[11px] text-slate-700 font-medium">
                      <Phone className="w-3 h-3 text-slate-400" /> {doc.phone}
                    </div>
                    {doc.email && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <Mail className="w-3 h-3" /> {doc.email}
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    {doc.relationshipTier === 'PLATINUM_PARTNER' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1 w-max">
                        <Award className="w-3 h-3 text-purple-600" /> Platinum Partner
                      </span>
                    ) : doc.relationshipTier === 'GOLD_PARTNER' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-max">
                        ★ Gold Partner
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Associate
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 text-xs">{doc.totalPatientsReferred} Total Patients</div>
                    <div className="text-[11px] text-amber-600 font-semibold mt-0.5">
                      {doc.activeInpatientsCount} Inpatient(s) admitted
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setLoggingReferralDoc(doc)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      Log Inward Patient
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Empanel Doctor */}
      {isNewDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Network className="w-5 h-5" />
                </span>
                Empanel Referring Physician
              </h3>
              <button onClick={() => setIsNewDoctorModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Name &amp; Degrees *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. K. Murugan, MBBS, MD"
                  value={newDoc.doctorName}
                  onChange={(e) => setNewDoc({ ...newDoc, doctorName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diabetology & Family Med"
                    value={newDoc.specialization}
                    onChange={(e) => setNewDoc({ ...newDoc, specialization: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Partnership Tier</label>
                  <select
                    value={newDoc.relationshipTier}
                    onChange={(e) => setNewDoc({ ...newDoc, relationshipTier: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                  >
                    <option value="PLATINUM_PARTNER">Platinum Partner</option>
                    <option value="GOLD_PARTNER">Gold Partner</option>
                    <option value="ASSOCIATE">Associate Clinic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinic / Nursing Home Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Murugan Clinic & Diagnostic Center"
                  value={newDoc.clinicHospitalName}
                  onChange={(e) => setNewDoc({ ...newDoc, clinicHospitalName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Area / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Adyar, Chennai"
                    value={newDoc.locationArea}
                    onChange={(e) => setNewDoc({ ...newDoc, locationArea: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98400 12345"
                    value={newDoc.phone}
                    onChange={(e) => setNewDoc({ ...newDoc, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewDoctorModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/25 transition"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Inward Referral Patient */}
      {loggingReferralDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <User className="w-5 h-5" />
                </span>
                Log Inward Patient Referral
              </h3>
              <button onClick={() => setLoggingReferralDoc(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogReferral} className="space-y-3.5 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-0.5">
                <span className="font-bold text-blue-900">Referring Consultant:</span>
                <p className="text-blue-800 font-semibold">{loggingReferralDoc.doctorName} ({loggingReferralDoc.clinicHospitalName})</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Referred Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. Ramanathan"
                  value={newReferralCase.patientName}
                  onChange={(e) => setNewReferralCase({ ...newReferralCase, patientName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Provisional Clinical Diagnosis *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coronary Angiogram recommended / Joint replacement"
                  value={newReferralCase.diagnosis}
                  onChange={(e) => setNewReferralCase({ ...newReferralCase, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Receiving Department</label>
                <select
                  value={newReferralCase.targetDepartment}
                  onChange={(e) => setNewReferralCase({ ...newReferralCase, targetDepartment: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                >
                  <option value="Cardiology">Cardiology &amp; Cath Lab</option>
                  <option value="Orthopedics">Orthopedics &amp; Joint Replacement</option>
                  <option value="General Surgery">General &amp; GI Surgery</option>
                  <option value="ICU">Critical Care / ICU</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setLoggingReferralDoc(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/25 transition"
                >
                  Admit Referral Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
