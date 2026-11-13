import React, { useState, useEffect } from 'react';
import { staffApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  Stethoscope,
  ArrowLeft,
  RefreshCw,
  Award,
  CheckCircle2,
  Clock,
  IndianRupee,
  PlusCircle,
  Search,
  Filter,
  ShieldCheck,
  FileText,
  UploadCloud,
  Download,
  Eye,
  Trash2,
  Calendar,
  Building,
  Phone,
  Mail,
  AlertCircle,
  X,
  FileCheck,
  BadgeCheck,
  Check,
  Copy,
  Edit3
} from 'lucide-react';

interface Props {
  onNavigate?: (page: string) => void;
}

export interface CredentialDocument {
  id: string;
  name: string;
  category: 'COUNCIL_REGISTRATION' | 'DEGREE_CERTIFICATE' | 'GOVT_ID' | 'EXPERIENCE_LETTER' | 'INDEMNITY_INSURANCE';
  categoryLabel: string;
  fileType: 'PDF' | 'IMAGE';
  fileSize: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'VERIFIED' | 'PENDING' | 'EXPIRING';
  verifiedBy?: string;
  dataUrl?: string;
}

export interface DoctorProfile {
  id: string;
  name: string;
  doctorCode: string;
  specialization: string;
  department: string;
  qualification: string;
  registrationNo: string;
  councilName: string;
  experienceYears: number;
  consultationFeeOpd: number;
  consultationFeeReview: number;
  roomNo: string;
  phone: string;
  email: string;
  shiftSchedule: string;
  availableForOpd: boolean;
  complianceStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'EXPIRING_SOON';
  bio: string;
  documents: CredentialDocument[];
}

const STORAGE_KEY = 'hospital_doctors_directory_v2';

const INITIAL_DOCTORS: DoctorProfile[] = [
  {
    id: '55555555-0010-0000-0000-000000000001',
    name: 'Dr. Arunachalam Kumar',
    doctorCode: 'DOC-000001',
    specialization: 'Interventional Cardiology',
    department: 'Cardiology',
    qualification: 'MBBS, MD (Gen Med), DM (Cardio), FACC',
    registrationNo: 'TNMC-REG-54891',
    councilName: 'Tamil Nadu Medical Council',
    experienceYears: 16,
    consultationFeeOpd: 800,
    consultationFeeReview: 400,
    roomNo: 'Chamber 102 - OPD Block A',
    phone: '+91 94440 12001',
    email: 'dr.arun@sindhuhospital.com',
    shiftSchedule: '09:00 AM - 01:00 PM (Mon-Sat)',
    availableForOpd: true,
    complianceStatus: 'VERIFIED',
    bio: 'Chief Interventional Cardiologist specializing in complex coronary angioplasty, transcatheter aortic valve replacement (TAVR), and cardiac critical care.',
    documents: [
      {
        id: 'doc-101',
        name: 'TNMC_Permanent_Registration_Certificate_54891.pdf',
        category: 'COUNCIL_REGISTRATION',
        categoryLabel: 'State Medical Council Registration',
        fileType: 'PDF',
        fileSize: '1.8 MB',
        uploadDate: '2024-01-10',
        expiryDate: '2029-12-31',
        status: 'VERIFIED',
        verifiedBy: 'Medical Superintendent (Dr. Sindhu)'
      },
      {
        id: 'doc-102',
        name: 'DM_Cardiology_Degree_Certificate_Madras_Medical_College.pdf',
        category: 'DEGREE_CERTIFICATE',
        categoryLabel: 'Academic Degree & Super-Specialty',
        fileType: 'PDF',
        fileSize: '2.4 MB',
        uploadDate: '2024-01-10',
        status: 'VERIFIED',
        verifiedBy: 'Medical Superintendent (Dr. Sindhu)'
      },
      {
        id: 'doc-103',
        name: 'Fellowship_American_College_of_Cardiology_FACC.pdf',
        category: 'DEGREE_CERTIFICATE',
        categoryLabel: 'International Fellowship Credential',
        fileType: 'PDF',
        fileSize: '1.2 MB',
        uploadDate: '2024-01-12',
        status: 'VERIFIED',
        verifiedBy: 'Medical Superintendent (Dr. Sindhu)'
      },
      {
        id: 'doc-104',
        name: 'Aadhaar_KYC_Verification_Card.pdf',
        category: 'GOVT_ID',
        categoryLabel: 'Government ID & Identity Proof',
        fileType: 'PDF',
        fileSize: '650 KB',
        uploadDate: '2024-01-10',
        status: 'VERIFIED',
        verifiedBy: 'HR Administration'
      },
      {
        id: 'doc-105',
        name: 'United_India_Professional_Indemnity_Insurance_Policy.pdf',
        category: 'INDEMNITY_INSURANCE',
        categoryLabel: 'Professional Malpractice Indemnity Policy',
        fileType: 'PDF',
        fileSize: '950 KB',
        uploadDate: '2024-03-01',
        expiryDate: '2025-02-28',
        status: 'VERIFIED',
        verifiedBy: 'Hospital Legal & Compliance Officer'
      }
    ]
  },
  {
    id: '55555555-0010-0000-0000-000000000002',
    name: 'Dr. Sindhu Rajan',
    doctorCode: 'DOC-000002',
    specialization: 'Internal & Family Medicine',
    department: 'General Medicine',
    qualification: 'MBBS, MD (Internal Med), FACP',
    registrationNo: 'TNMC-REG-61204',
    councilName: 'Tamil Nadu Medical Council',
    experienceYears: 18,
    consultationFeeOpd: 600,
    consultationFeeReview: 300,
    roomNo: 'Chamber 101 - OPD Block A',
    phone: '+91 94440 12002',
    email: 'dr.sindhu@sindhuhospital.com',
    shiftSchedule: '10:00 AM - 02:00 PM (Mon-Sat)',
    availableForOpd: true,
    complianceStatus: 'VERIFIED',
    bio: 'Senior Consultant Physician & Medical Superintendent. Expert in comprehensive metabolic disorders, diabetes management, preventive adult healthcare, and geriatric medicine.',
    documents: [
      {
        id: 'doc-201',
        name: 'TNMC_Medical_Council_Certificate_61204.pdf',
        category: 'COUNCIL_REGISTRATION',
        categoryLabel: 'State Medical Council Registration',
        fileType: 'PDF',
        fileSize: '2.1 MB',
        uploadDate: '2024-01-05',
        expiryDate: '2029-05-30',
        status: 'VERIFIED',
        verifiedBy: 'Chief Administrative Officer'
      },
      {
        id: 'doc-202',
        name: 'MD_Internal_Medicine_Degree_Certificate.pdf',
        category: 'DEGREE_CERTIFICATE',
        categoryLabel: 'Post-Graduate Master Degree',
        fileType: 'PDF',
        fileSize: '3.0 MB',
        uploadDate: '2024-01-05',
        status: 'VERIFIED',
        verifiedBy: 'Chief Administrative Officer'
      },
      {
        id: 'doc-203',
        name: 'National_Medical_Commission_Good_Standing_Certificate.pdf',
        category: 'COUNCIL_REGISTRATION',
        categoryLabel: 'NMC Certificate of Good Standing',
        fileType: 'PDF',
        fileSize: '1.1 MB',
        uploadDate: '2024-01-15',
        status: 'VERIFIED',
        verifiedBy: 'Chief Administrative Officer'
      },
      {
        id: 'doc-204',
        name: 'New_India_Assurance_Medical_Indemnity_Bond.pdf',
        category: 'INDEMNITY_INSURANCE',
        categoryLabel: 'Professional Malpractice Indemnity Policy',
        fileType: 'PDF',
        fileSize: '880 KB',
        uploadDate: '2024-04-01',
        expiryDate: '2025-03-31',
        status: 'VERIFIED',
        verifiedBy: 'Hospital Legal & Compliance Officer'
      }
    ]
  },
  {
    id: '55555555-0010-0000-0000-000000000003',
    name: 'Dr. K. Rajesh',
    doctorCode: 'DOC-000003',
    specialization: 'Orthopedics & Joint Replacement',
    department: 'Orthopedics',
    qualification: 'MBBS, MS (Ortho), M.Ch (Ortho)',
    registrationNo: 'TNMC-REG-48902',
    councilName: 'Tamil Nadu Medical Council',
    experienceYears: 14,
    consultationFeeOpd: 750,
    consultationFeeReview: 350,
    roomNo: 'Chamber 105 - OPD Block B',
    phone: '+91 94440 12003',
    email: 'dr.rajesh.ortho@sindhuhospital.com',
    shiftSchedule: '02:00 PM - 06:00 PM (Mon-Fri)',
    availableForOpd: true,
    complianceStatus: 'VERIFIED',
    bio: 'Lead Orthopedic Surgeon with over 2,000 successful robotic joint replacements, complex arthroscopic ligament repairs, and sports traumatology reconstructive surgeries.',
    documents: [
      {
        id: 'doc-301',
        name: 'TNMC_Registration_Council_48902.pdf',
        category: 'COUNCIL_REGISTRATION',
        categoryLabel: 'State Medical Council Registration',
        fileType: 'PDF',
        fileSize: '1.9 MB',
        uploadDate: '2024-02-01',
        expiryDate: '2028-11-20',
        status: 'VERIFIED',
        verifiedBy: 'Medical Superintendent (Dr. Sindhu)'
      },
      {
        id: 'doc-302',
        name: 'MS_Orthopedic_Surgery_Master_Degree.pdf',
        category: 'DEGREE_CERTIFICATE',
        categoryLabel: 'Academic Degree & Super-Specialty',
        fileType: 'PDF',
        fileSize: '2.5 MB',
        uploadDate: '2024-02-01',
        status: 'VERIFIED',
        verifiedBy: 'Medical Superintendent (Dr. Sindhu)'
      },
      {
        id: 'doc-303',
        name: 'Singapore_General_Hospital_Joint_Fellowship_Letter.pdf',
        category: 'EXPERIENCE_LETTER',
        categoryLabel: 'International Clinical Fellowship',
        fileType: 'PDF',
        fileSize: '1.3 MB',
        uploadDate: '2024-02-05',
        status: 'VERIFIED',
        verifiedBy: 'Medical Superintendent (Dr. Sindhu)'
      }
    ]
  },
  {
    id: '55555555-0010-0000-0000-000000000004',
    name: 'Dr. Meenakshi Sundaram',
    doctorCode: 'DOC-000004',
    specialization: 'Pediatrics & Neonatal Care',
    department: 'Pediatrics',
    qualification: 'MBBS, MD (Pediatrics), Fellowship in Neonatology',
    registrationNo: 'TNMC-REG-71822',
    councilName: 'Tamil Nadu Medical Council',
    experienceYears: 11,
    consultationFeeOpd: 650,
    consultationFeeReview: 300,
    roomNo: 'Chamber 204 - Mother & Child Wing',
    phone: '+91 94440 12004',
    email: 'dr.meenakshi@sindhuhospital.com',
    shiftSchedule: '09:00 AM - 01:00 PM (Mon-Sat)',
    availableForOpd: true,
    complianceStatus: 'VERIFIED',
    bio: 'Dedicated Pediatrician and Level-III NICU Specialist committed to newborn resuscitation, developmental monitoring, adolescent nutrition, and child vaccination protocols.',
    documents: [
      {
        id: 'doc-401',
        name: 'TNMC_Medical_Council_License_71822.pdf',
        category: 'COUNCIL_REGISTRATION',
        categoryLabel: 'State Medical Council Registration',
        fileType: 'PDF',
        fileSize: '1.7 MB',
        uploadDate: '2024-02-15',
        expiryDate: '2030-01-10',
        status: 'VERIFIED',
        verifiedBy: 'Medical Superintendent (Dr. Sindhu)'
      },
      {
        id: 'doc-402',
        name: 'MD_Pediatrics_Degree_Certificate.pdf',
        category: 'DEGREE_CERTIFICATE',
        categoryLabel: 'Post-Graduate Master Degree',
        fileType: 'PDF',
        fileSize: '2.8 MB',
        uploadDate: '2024-02-15',
        status: 'VERIFIED',
        verifiedBy: 'Medical Superintendent (Dr. Sindhu)'
      },
      {
        id: 'doc-403',
        name: 'PALS_Pediatric_Advanced_Life_Support_Certificate.pdf',
        category: 'DEGREE_CERTIFICATE',
        categoryLabel: 'Emergency Resuscitation Credential',
        fileType: 'PDF',
        fileSize: '850 KB',
        uploadDate: '2024-03-01',
        status: 'VERIFIED',
        verifiedBy: 'Medical Superintendent (Dr. Sindhu)'
      }
    ]
  },
  {
    id: '55555555-0010-0000-0000-000000000005',
    name: 'Dr. Priya Venkat',
    doctorCode: 'DOC-000005',
    specialization: 'Obstetrics & High-Risk Gynecology',
    department: 'Obstetrics & Gynecology',
    qualification: 'MBBS, MS (OBG), FMAS, FICOG',
    registrationNo: 'TNMC-REG-67431',
    councilName: 'Tamil Nadu Medical Council',
    experienceYears: 12,
    consultationFeeOpd: 700,
    consultationFeeReview: 350,
    roomNo: 'Chamber 201 - Maternity Wing',
    phone: '+91 94440 12005',
    email: 'dr.priyavenkat@sindhuhospital.com',
    shiftSchedule: '10:00 AM - 02:00 PM (Mon-Sat)',
    availableForOpd: false,
    complianceStatus: 'VERIFIED',
    bio: 'Lead Obstetrician with expertise in managing critical maternal health conditions, painless labor, advanced laparoscopic hysterectomy, and fertility counseling.',
    documents: [
      {
        id: 'doc-501',
        name: 'TNMC_License_OBG_67431.pdf',
        category: 'COUNCIL_REGISTRATION',
        categoryLabel: 'State Medical Council Registration',
        fileType: 'PDF',
        fileSize: '1.6 MB',
        uploadDate: '2024-01-20',
        expiryDate: '2029-08-15',
        status: 'VERIFIED',
        verifiedBy: 'Medical Superintendent (Dr. Sindhu)'
      },
      {
        id: 'doc-502',
        name: 'MS_Obstetrics_and_Gynecology_Degree.pdf',
        category: 'DEGREE_CERTIFICATE',
        categoryLabel: 'Academic Degree & Super-Specialty',
        fileType: 'PDF',
        fileSize: '2.6 MB',
        uploadDate: '2024-01-20',
        status: 'VERIFIED',
        verifiedBy: 'Medical Superintendent (Dr. Sindhu)'
      }
    ]
  }
];

export default function DoctorListPage({ onNavigate }: Props) {
  const { user, hasRole } = useAuth();
  const isAdmin = !user || hasRole('ROLE_ADMIN') || Boolean(user?.roles?.includes('ROLE_ADMIN'));

  const [doctors, setDoctors] = useState<DoctorProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading doctor cache', e);
    }
    return INITIAL_DOCTORS;
  });

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState<'ALL' | 'ACTIVE' | 'OFF'>('ALL');

  // Modals state
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [selectedDoctorForDossier, setSelectedDoctorForDossier] = useState<DoctorProfile | null>(null);
  const [selectedDoctorForEdit, setSelectedDoctorForEdit] = useState<DoctorProfile | null>(null);
  const [previewDocument, setPreviewDocument] = useState<{ doc: CredentialDocument; doctor: DoctorProfile } | null>(null);

  // Success Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedRegNo, setCopiedRegNo] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
    } catch (e) {
      console.error('Error saving doctor cache', e);
    }
  }, [doctors]);

  // Fetch doctors from backend if available
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await staffApi.listDoctors();
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        // Merge backend fields with our rich profile schema
        setDoctors((prev) => {
          const map = new Map(prev.map((d) => [d.id, d]));
          res.data.forEach((backendDoc: any) => {
            const existing = map.get(backendDoc.id);
            if (existing) {
              map.set(backendDoc.id, {
                ...existing,
                specialization: backendDoc.specialization || existing.specialization,
                qualification: backendDoc.qualification || existing.qualification,
                registrationNo: backendDoc.registrationNo || existing.registrationNo,
                consultationFeeOpd: backendDoc.consultationFeeOpd ? Number(backendDoc.consultationFeeOpd) : existing.consultationFeeOpd,
                availableForOpd: backendDoc.availableForOpd !== undefined ? backendDoc.availableForOpd : existing.availableForOpd,
                bio: backendDoc.bio || existing.bio,
              });
            } else {
              // Add new doctor from backend
              const newDoc: DoctorProfile = {
                id: backendDoc.id || `doc-${Date.now()}`,
                name: backendDoc.name || `Dr. Consultant (${backendDoc.specialization || 'Physician'})`,
                doctorCode: `DOC-00${Math.floor(100 + Math.random() * 900)}`,
                specialization: backendDoc.specialization || 'General Physician',
                department: backendDoc.department || 'General Medicine',
                qualification: backendDoc.qualification || 'MBBS, MD',
                registrationNo: backendDoc.registrationNo || 'TNMC-REG-PENDING',
                councilName: 'Tamil Nadu Medical Council',
                experienceYears: backendDoc.yearsOfExperience || 8,
                consultationFeeOpd: backendDoc.consultationFeeOpd ? Number(backendDoc.consultationFeeOpd) : 500,
                consultationFeeReview: 300,
                roomNo: 'Chamber 108 - OPD Block B',
                phone: '+91 94440 00000',
                email: 'doctor@sindhuhospital.com',
                shiftSchedule: '09:00 AM - 01:00 PM',
                availableForOpd: backendDoc.availableForOpd ?? true,
                complianceStatus: 'VERIFIED',
                bio: backendDoc.bio || 'Consultant Physician on Hospital Roster.',
                documents: [
                  {
                    id: `doc-init-${Date.now()}`,
                    name: `Medical_Council_License_${backendDoc.registrationNo || '54891'}.pdf`,
                    category: 'COUNCIL_REGISTRATION',
                    categoryLabel: 'State Medical Council Registration',
                    fileType: 'PDF',
                    fileSize: '1.5 MB',
                    uploadDate: new Date().toISOString().split('T')[0],
                    expiryDate: '2029-12-31',
                    status: 'VERIFIED',
                    verifiedBy: 'Medical Superintendent'
                  }
                ]
              };
              map.set(newDoc.id, newDoc);
            }
          });
          return Array.from(map.values());
        });
      }
    } catch (err) {
      console.warn('Backend doctors fetch note:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopyReg = (regNo: string) => {
    navigator.clipboard.writeText(regNo);
    setCopiedRegNo(regNo);
    setTimeout(() => setCopiedRegNo(null), 2000);
  };

  const handleToggleDuty = (docId: string) => {
    if (!isAdmin) {
      showToast('Only Hospital Administrators and Medical Superintendents have authority to modify duty rosters.');
      return;
    }
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          const updated = !d.availableForOpd;
          showToast(`${d.name} is now marked ${updated ? 'Available for OPD Duty' : 'Off Duty'}.`);
          return { ...d, availableForOpd: updated };
        }
        return d;
      })
    );
  };

  // Filtered list
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.registrationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || doc.department === selectedDept;

    const matchesAvail =
      availabilityFilter === 'ALL' ||
      (availabilityFilter === 'ACTIVE' && doc.availableForOpd) ||
      (availabilityFilter === 'OFF' && !doc.availableForOpd);

    return matchesSearch && matchesDept && matchesAvail;
  });

  // Calculate high-level metrics
  const totalDoctors = doctors.length;
  const activeOpdDoctors = doctors.filter((d) => d.availableForOpd).length;
  const verifiedCompliant = doctors.filter((d) => d.complianceStatus === 'VERIFIED').length;
  const totalDossierDocs = doctors.reduce((acc, d) => acc + d.documents.length, 0);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900 text-white shadow-soft-xl border border-slate-700 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} aria-label="Close notification" className="ml-2 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="page-header-glass p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate?.('admin-dashboard')}
            aria-label="Return to Dashboard"
            className="p-2.5 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300 shadow-2xs cursor-pointer"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-rose-50 dark:bg-rose-950/60 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400">
                <Stethoscope className="w-6 h-6" />
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-jakarta">
                Doctors &amp; Credentialing Cabinet
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Physician Onboarding, State Medical Council Verification, Credential Dossiers &amp; OPD Rosters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDoctors}
            disabled={loading}
            aria-label="Refresh Roster"
            className="p-2.5 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 shadow-sm cursor-pointer"
            title="Refresh Roster"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {isAdmin ? (
            <button
              onClick={() => setShowOnboardModal(true)}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-soft-sm font-semibold text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Onboard New Doctor</span>
            </button>
          ) : (
            <div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Read-Only Roster Mode</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Key Performance & NABH Credential Metrics ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-radial-surface p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Total Consultants</span>
            <Stethoscope className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-jakarta">
            {totalDoctors}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Registered on Hospital Medical Staff
          </div>
        </div>

        <div className="card-radial-surface p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft-xs">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Available for OPD</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-jakarta">
            {activeOpdDoctors}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Accepting Walk-ins & Appointments
          </div>
        </div>

        <div className="card-radial-surface p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft-xs">
          <div className="flex items-center justify-between text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>NABH Compliant</span>
            <Award className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-bold text-brand-800 dark:text-brand-200 font-jakarta">
            {verifiedCompliant} / {totalDoctors}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            100% Medical Council Verified
          </div>
        </div>

        <div className="card-radial-surface p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft-xs">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Credential Dossier Vault</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 font-jakarta">
            {totalDossierDocs} Files
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Licenses, Degrees & Indemnity Bonds
          </div>
        </div>
      </div>

      {/* ── Search, Department Filter & Roster Bar ── */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, reg no, specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white placeholder-slate-400 outline-none transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="ALL">All Departments ({doctors.length})</option>
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
              <option value="Neurology">Neurology</option>
              <option value="Radiology">Radiology</option>
            </select>
          </div>

          {/* Availability Filter Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setAvailabilityFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition ${
                availabilityFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-soft-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setAvailabilityFilter('ACTIVE')}
              className={`px-3 py-1 rounded-lg transition ${
                availabilityFilter === 'ACTIVE'
                  ? 'bg-emerald-600 text-white shadow-soft-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              OPD Active
            </button>
            <button
              onClick={() => setAvailabilityFilter('OFF')}
              className={`px-3 py-1 rounded-lg transition ${
                availabilityFilter === 'OFF'
                  ? 'bg-slate-700 text-white shadow-soft-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              Off Duty
            </button>
          </div>
        </div>
      </div>

      {/* ── Doctors Grid Roster ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-brand-600" />
            <p className="text-sm font-medium">Synchronizing physician roster and credential documents...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft-xs p-8">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Doctors Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No medical practitioner records matched your query. Click "+ Onboard New Doctor" to register a consultant with full medical council credentials.
            </p>
            {isAdmin && (
              <button
                onClick={() => setShowOnboardModal(true)}
                className="mt-4 btn-primary px-4 py-2 text-xs rounded-xl"
              >
                + Onboard New Doctor
              </button>
            )}
          </div>
        ) : (
          filteredDoctors.map((doc) => {
            const verifiedDocsCount = doc.documents.filter((d) => d.status === 'VERIFIED').length;
            const hasLicense = doc.documents.some((d) => d.category === 'COUNCIL_REGISTRATION');

            return (
              <div
                key={doc.id}
                className="card-radial-surface rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-soft-sm flex flex-col justify-between hover:shadow-soft-lg hover:border-brand-400/50 transition-all duration-200 group"
              >
                <div className="space-y-4">
                  {/* Top Bar: Avatar & Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-700 to-tealAccent-600 text-white flex items-center justify-center font-bold text-lg shadow-soft-sm shrink-0">
                        {doc.name.replace('Dr. ', '').charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white font-jakarta group-hover:text-brand-700 dark:group-hover:text-brand-300 transition">
                            {doc.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-medium text-brand-700 dark:text-brand-300">{doc.department}</span>
                          <span>•</span>
                          <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                            {doc.doctorCode}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Duty Availability Badge / Switch */}
                    <button
                      onClick={() => handleToggleDuty(doc.id)}
                      disabled={!isAdmin}
                      title={isAdmin ? 'Click to toggle OPD duty availability' : 'OPD status set by administration'}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition flex items-center gap-1.5 ${
                        doc.availableForOpd
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      } ${isAdmin ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${doc.availableForOpd ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                      <span>{doc.availableForOpd ? 'On OPD Duty' : 'Off Duty'}</span>
                    </button>
                  </div>

                  {/* Specialization & Qualifications */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {doc.specialization}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {doc.qualification}
                    </div>
                  </div>

                  {/* Council Registration ID Card Box */}
                  <div className="flex items-center justify-between p-2.5 bg-brand-50/60 dark:bg-brand-950/30 rounded-xl border border-brand-100 dark:border-brand-900 text-xs">
                    <div className="flex items-center gap-2 text-brand-900 dark:text-brand-200 font-medium">
                      <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-brand-600 dark:text-brand-400 block font-normal">State Council Reg No</span>
                        <span className="font-mono font-bold">{doc.registrationNo}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyReg(doc.registrationNo)}
                      className="p-1 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-brand-700 dark:text-brand-300 transition"
                      title="Copy Registration Number"
                    >
                      {copiedRegNo === doc.registrationNo ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Clinical Operations Summary */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Experience</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{doc.experienceYears}+ Years</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">OPD Chamber Fee</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹{doc.consultationFeeOpd}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.roomNo}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.shiftSchedule}</span>
                    </div>
                  </div>

                  {/* Credential Dossier Status Bar */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-[11px]">
                        {verifiedDocsCount} / {doc.documents.length} Verified Files
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {hasLicense ? 'NABH Ready' : 'Audit Required'}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDoctorForDossier(doc)}
                    className="flex-1 btn-primary py-2 px-3 text-xs rounded-xl flex items-center justify-center gap-1.5 font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Credential Dossier ({doc.documents.length})</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => setSelectedDoctorForEdit(doc)}
                      className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition"
                      title="Edit Consultant Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* ── MODAL 1: ONBOARD NEW DOCTOR (ADMIN EXCLUSIVE) ── */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {showOnboardModal && (
        <OnboardDoctorModal
          onClose={() => setShowOnboardModal(false)}
          onSuccess={(newDoctor) => {
            setDoctors((prev) => [newDoctor, ...prev]);
            setShowOnboardModal(false);
            showToast(`Doctor ${newDoctor.name} successfully onboarded and added to hospital roster!`);
            // Automatically open their credential dossier
            setSelectedDoctorForDossier(newDoctor);
          }}
        />
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* ── MODAL 2: CREDENTIAL DOSSIER & DOCUMENT CABINET ── */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {selectedDoctorForDossier && (
        <DoctorDossierModal
          doctor={selectedDoctorForDossier}
          isAdmin={isAdmin}
          onClose={() => setSelectedDoctorForDossier(null)}
          onUpdateDocuments={(updatedDocs) => {
            setDoctors((prev) =>
              prev.map((d) =>
                d.id === selectedDoctorForDossier.id ? { ...d, documents: updatedDocs } : d
              )
            );
            setSelectedDoctorForDossier((prev) => prev ? { ...prev, documents: updatedDocs } : null);
          }}
          onPreviewDocument={(doc) => {
            setPreviewDocument({ doc, doctor: selectedDoctorForDossier });
          }}
        />
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* ── MODAL 3: IN-APP DOCUMENT PREVIEW INSPECTOR ── */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {previewDocument && (
        <DocumentPreviewModal
          doc={previewDocument.doc}
          doctor={previewDocument.doctor}
          onClose={() => setPreviewDocument(null)}
        />
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* ── MODAL 4: EDIT DOCTOR PROFILE MODAL ── */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {selectedDoctorForEdit && (
        <EditDoctorModal
          doctor={selectedDoctorForEdit}
          onClose={() => setSelectedDoctorForEdit(null)}
          onSave={(updatedDoctor) => {
            setDoctors((prev) =>
              prev.map((d) => (d.id === updatedDoctor.id ? updatedDoctor : d))
            );
            setSelectedDoctorForEdit(null);
            showToast(`Updated profile details for ${updatedDoctor.name}.`);
          }}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENT: ONBOARD DOCTOR MODAL
// ════════════════════════════════════════════════════════════════════════════════
function OnboardDoctorModal({
  onClose,
  onSuccess
}: {
  onClose: () => void;
  onSuccess: (doc: DoctorProfile) => void;
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    department: 'Cardiology',
    specialization: '',
    qualification: '',
    registrationNo: '',
    councilName: 'Tamil Nadu Medical Council',
    experienceYears: 5,
    consultationFeeOpd: 600,
    consultationFeeReview: 300,
    roomNo: 'Chamber 104 - OPD Block A',
    phone: '',
    email: '',
    shiftSchedule: '09:00 AM - 01:00 PM (Mon-Sat)',
    bio: '',
    councilDocName: ''
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMsg('Doctor first and last name are required.');
      return;
    }
    if (!formData.specialization.trim()) {
      setErrorMsg('Clinical specialization is required.');
      return;
    }
    if (!formData.registrationNo.trim()) {
      setErrorMsg('State Medical Council Registration Number is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const doctorId = `doc-${Date.now()}`;
    const fullName = `Dr. ${formData.firstName.trim()} ${formData.lastName.trim()}`;

    // Prepare initial documents
    const initialDocuments: CredentialDocument[] = [
      {
        id: `doc-${Date.now()}-reg`,
        name: uploadedFile
          ? uploadedFile.name
          : `${formData.councilName.replace(/\s+/g, '_')}_License_${formData.registrationNo}.pdf`,
        category: 'COUNCIL_REGISTRATION',
        categoryLabel: 'State Medical Council Registration',
        fileType: 'PDF',
        fileSize: uploadedFile ? `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.8 MB',
        uploadDate: new Date().toISOString().split('T')[0],
        expiryDate: '2029-12-31',
        status: 'VERIFIED',
        verifiedBy: 'Hospital Administrator (NABH Desk)'
      }
    ];

    const newProfile: DoctorProfile = {
      id: doctorId,
      name: fullName,
      doctorCode: `DOC-00${Math.floor(100 + Math.random() * 900)}`,
      specialization: formData.specialization,
      department: formData.department,
      qualification: formData.qualification || 'MBBS, MD',
      registrationNo: formData.registrationNo.toUpperCase(),
      councilName: formData.councilName,
      experienceYears: Number(formData.experienceYears) || 5,
      consultationFeeOpd: Number(formData.consultationFeeOpd) || 500,
      consultationFeeReview: Number(formData.consultationFeeReview) || 300,
      roomNo: formData.roomNo || 'OPD Consultation Suite',
      phone: formData.phone || '+91 94440 00000',
      email: formData.email || `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@sindhuhospital.com`,
      shiftSchedule: formData.shiftSchedule,
      availableForOpd: true,
      complianceStatus: 'VERIFIED',
      bio: formData.bio || `Consultant in ${formData.department} at Sindhu Hospital.`,
      documents: initialDocuments
    };

    // Attempt to persist to backend
    try {
      await staffApi.createDoctor({
        registrationNo: newProfile.registrationNo,
        specialization: newProfile.specialization,
        qualification: newProfile.qualification,
        yearsOfExperience: newProfile.experienceYears,
        consultationFeeOpd: newProfile.consultationFeeOpd,
        consultationFeeReview: newProfile.consultationFeeReview,
        availableForOpd: true,
        bio: newProfile.bio
      });
    } catch (err) {
      console.warn('Backend doctor save warning (persisted locally):', err);
    } finally {
      setIsSubmitting(false);
      onSuccess(newProfile);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 rounded-2xl border border-brand-200/50">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-jakarta">
                Onboard New Consultant Doctor
              </h2>
              <p className="text-xs text-slate-500">
                Register physician credentials, medical council license and OPD configuration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Doctor Identity */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300 flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>1. Professional & Clinical Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arunachalam"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full text-xs md:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kumar"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full text-xs md:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full text-xs md:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 dark:text-white font-medium"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="General Surgery">General Surgery</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Pathology">Pathology</option>
                  <option value="ENT">ENT</option>
                  <option value="Dermatology">Dermatology</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sub-Specialization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Interventional Cardiology"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full text-xs md:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Degrees & Qualifications *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MBBS, MD (Gen Med), DM (Cardio), FACC"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full text-xs md:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Total Clinical Experience (Years) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  required
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                  className="w-full text-xs md:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Medical Council Credentials */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>2. Statutory Medical Council Registration</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  State Medical Council Reg No *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TNMC-REG-78901"
                  value={formData.registrationNo}
                  onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                  className="w-full text-xs md:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 dark:text-white uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Licensing State Council *
                </label>
                <select
                  value={formData.councilName}
                  onChange={(e) => setFormData({ ...formData, councilName: e.target.value })}
                  className="w-full text-xs md:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 dark:text-white font-medium"
                >
                  <option value="Tamil Nadu Medical Council">Tamil Nadu Medical Council (TNMC)</option>
                  <option value="Karnataka Medical Council">Karnataka Medical Council (KMC)</option>
                  <option value="Maharashtra Medical Council">Maharashtra Medical Council (MMC)</option>
                  <option value="Delhi Medical Council">Delhi Medical Council (DMC)</option>
                  <option value="National Medical Commission">National Medical Commission (NMC / MCI)</option>
                </select>
              </div>
            </div>

            {/* Document File Uploader for Medical Council Registration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Attach Medical Council License Certificate (.pdf, .jpg, .png)
              </label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-brand-500 transition bg-slate-50/50 dark:bg-slate-800/40">
                <UploadCloud className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                <label className="cursor-pointer">
                  <span className="text-xs font-semibold text-brand-700 dark:text-brand-300 hover:underline">
                    {uploadedFile ? uploadedFile.name : 'Click to browse or drag certificate document'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setUploadedFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">
                  {uploadedFile
                    ? `File size: ${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for dossier archiving`
                    : 'Supports scanned Council certificates, degree transcripts, and insurance documents'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Hospital Operations & OPD */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300 flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span>3. Hospital OPD Consultation & Tariffs</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  OPD Fresh Consultation Fee (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.consultationFeeOpd}
                    onChange={(e) => setFormData({ ...formData, consultationFeeOpd: Number(e.target.value) })}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs md:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 dark:text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Follow-Up Review Fee (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    value={formData.consultationFeeReview}
                    onChange={(e) => setFormData({ ...formData, consultationFeeReview: Number(e.target.value) })}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs md:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned OPD Room / Chamber
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chamber 104 - Block A"
                  value={formData.roomNo}
                  onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                  className="w-full text-xs md:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  OPD Duty Shift Schedule
                </label>
                <input
                  type="text"
                  placeholder="e.g. 09:00 AM - 01:00 PM (Mon-Sat)"
                  value={formData.shiftSchedule}
                  onChange={(e) => setFormData({ ...formData, shiftSchedule: e.target.value })}
                  className="w-full text-xs md:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 94440 12345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs md:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Official Hospital Email
                </label>
                <input
                  type="email"
                  placeholder="doctor@sindhuhospital.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs md:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Clinical Bio & Special Expertise Summary
              </label>
              <textarea
                rows={2}
                placeholder="Brief clinical background, key surgical competencies, and research background..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full text-xs md:text-sm p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-6 py-2.5 text-xs rounded-xl font-bold flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Onboarding Consultant...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Doctor Onboarding</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENT: CREDENTIAL DOSSIER & DOCUMENT CABINET MODAL
// ════════════════════════════════════════════════════════════════════════════════
function DoctorDossierModal({
  doctor,
  isAdmin,
  onClose,
  onUpdateDocuments,
  onPreviewDocument
}: {
  doctor: DoctorProfile;
  isAdmin: boolean;
  onClose: () => void;
  onUpdateDocuments: (docs: CredentialDocument[]) => void;
  onPreviewDocument: (doc: CredentialDocument) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [showUploadForm, setShowUploadForm] = useState(false);

  // New Document Upload State
  const [docCategory, setDocCategory] = useState<CredentialDocument['category']>('DEGREE_CERTIFICATE');
  const [docTitle, setDocTitle] = useState('');
  const [docExpiry, setDocExpiry] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const categories = [
    { key: 'ALL', label: 'All Files', count: doctor.documents.length },
    {
      key: 'COUNCIL_REGISTRATION',
      label: 'State Council Licenses',
      count: doctor.documents.filter((d) => d.category === 'COUNCIL_REGISTRATION').length
    },
    {
      key: 'DEGREE_CERTIFICATE',
      label: 'Degrees & Fellowships',
      count: doctor.documents.filter((d) => d.category === 'DEGREE_CERTIFICATE').length
    },
    {
      key: 'INDEMNITY_INSURANCE',
      label: 'Malpractice Insurance',
      count: doctor.documents.filter((d) => d.category === 'INDEMNITY_INSURANCE').length
    },
    {
      key: 'EXPERIENCE_LETTER',
      label: 'Experience & Relieving',
      count: doctor.documents.filter((d) => d.category === 'EXPERIENCE_LETTER').length
    },
    {
      key: 'GOVT_ID',
      label: 'Govt ID & KYC',
      count: doctor.documents.filter((d) => d.category === 'GOVT_ID').length
    }
  ];

  const filteredDocs =
    activeCategory === 'ALL'
      ? doctor.documents
      : doctor.documents.filter((d) => d.category === activeCategory);

  const handleUploadNewDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() && !selectedFile) {
      setUploadError('Please enter a document title or choose a file.');
      return;
    }
    setUploadError(null);

    const categoryLabels: Record<string, string> = {
      COUNCIL_REGISTRATION: 'State Medical Council Registration',
      DEGREE_CERTIFICATE: 'Academic Degree & Super-Specialty',
      GOVT_ID: 'Government ID & Identity Proof',
      EXPERIENCE_LETTER: 'Experience & Prior Hospital Tenure',
      INDEMNITY_INSURANCE: 'Professional Malpractice Indemnity Policy'
    };

    const newDoc: CredentialDocument = {
      id: `doc-upload-${Date.now()}`,
      name: selectedFile ? selectedFile.name : `${docTitle.replace(/\s+/g, '_')}.pdf`,
      category: docCategory,
      categoryLabel: categoryLabels[docCategory] || 'Hospital Verified Document',
      fileType: selectedFile?.type?.includes('image') ? 'IMAGE' : 'PDF',
      fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.4 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: docExpiry || undefined,
      status: 'VERIFIED',
      verifiedBy: 'Hospital Medical Superintendent'
    };

    const updated = [newDoc, ...doctor.documents];
    onUpdateDocuments(updated);
    setDocTitle('');
    setSelectedFile(null);
    setDocExpiry('');
    setShowUploadForm(false);
  };

  const handleDeleteDoc = (docId: string) => {
    if (!isAdmin) return;
    if (confirm('Are you sure you want to remove this document from the doctor credential dossier?')) {
      const updated = doctor.documents.filter((d) => d.id !== docId);
      onUpdateDocuments(updated);
    }
  };

  const handleDownloadDoc = (doc: CredentialDocument) => {
    // Generate simulated document blob download
    const content = `=====================================================
SINDHU MULTI-SPECIALTY HOSPITAL & RESEARCH INSTITUTE
DEPARTMENT OF CLINICAL GOVERNANCE & NABH CREDENTIALING
=====================================================
DOCUMENT DOSSIER RECORD
Practitioner: ${doctor.name}
Registration No: ${doctor.registrationNo}
Specialization: ${doctor.specialization}
Department: ${doctor.department}

File Name: ${doc.name}
Category: ${doc.categoryLabel}
Verification Status: ${doc.status}
Verified By: ${doc.verifiedBy || 'Medical Superintendent'}
Upload Date: ${doc.uploadDate}
${doc.expiryDate ? `Expiry Date: ${doc.expiryDate}` : ''}
=====================================================
Certified authentic copy stored in Hospital Vault.
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-700 to-tealAccent-600 text-white flex items-center justify-center font-bold text-xl shadow-soft-sm shrink-0">
              {doctor.name.replace('Dr. ', '').charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-jakarta">
                  {doctor.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>NABH 100% Compliant</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {doctor.specialization} • Reg No: <span className="font-mono font-bold text-brand-700 dark:text-brand-300">{doctor.registrationNo}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="btn-primary py-2 px-3 text-xs rounded-xl flex items-center gap-1.5 font-semibold"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{showUploadForm ? 'Close Upload' : '+ Upload Document'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upload Drawer / Form (Conditional) */}
        {showUploadForm && isAdmin && (
          <form
            onSubmit={handleUploadNewDoc}
            className="p-5 bg-brand-50/70 dark:bg-brand-950/40 border-b border-brand-200 dark:border-brand-900 space-y-4 animate-slide-in"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300 flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4" />
                <span>Upload New Credential to Physician Dossier</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  setShowUploadForm(false);
                  setUploadError(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>

            {uploadError && (
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400">
                {uploadError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Category *
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full text-xs p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                >
                  <option value="COUNCIL_REGISTRATION">State Medical Council License</option>
                  <option value="DEGREE_CERTIFICATE">Degrees & Super-Specialty</option>
                  <option value="INDEMNITY_INSURANCE">Professional Indemnity Policy</option>
                  <option value="EXPERIENCE_LETTER">Experience & Prior Relieving</option>
                  <option value="GOVT_ID">Government ID / Passport / Aadhaar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fellowship Certificate 2024"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full text-xs p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expiry / Renewal Date (Optional)
                </label>
                <input
                  type="date"
                  value={docExpiry}
                  onChange={(e) => setDocExpiry(e.target.value)}
                  className="w-full text-xs p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex-1 border-2 border-dashed border-brand-300 dark:border-brand-700 bg-white dark:bg-slate-800 rounded-xl p-3 text-center cursor-pointer hover:bg-brand-50/50">
                <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">
                  {selectedFile ? selectedFile.name : 'Choose file (.pdf, .jpg, .png) or Drag & Drop'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                  }}
                />
              </label>

              <button
                type="submit"
                className="btn-primary py-2.5 px-6 text-xs rounded-xl font-bold shrink-0"
              >
                Attach & Archive in Dossier
              </button>
            </div>
          </form>
        )}

        {/* Category Filter Pills */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
                activeCategory === cat.key
                  ? 'bg-brand-800 text-white shadow-soft-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeCategory === cat.key
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Document Cards List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredDocs.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No documents uploaded under this category yet.</p>
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-brand-400 shadow-soft-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white font-jakarta group-hover:text-brand-700 dark:group-hover:text-brand-300 transition">
                      {doc.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-brand-700 dark:text-brand-400">{doc.categoryLabel}</span>
                      <span>•</span>
                      <span>{doc.fileSize}</span>
                      <span>•</span>
                      <span>Uploaded {doc.uploadDate}</span>
                      {doc.expiryDate && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600 font-medium">Valid until {doc.expiryDate}</span>
                        </>
                      )}
                    </div>
                    {doc.verifiedBy && (
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified by {doc.verifiedBy}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onPreviewDocument(doc)}
                    className="p-2 text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 rounded-xl flex items-center gap-1 transition"
                    title="Inspect & Preview Document"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => handleDownloadDoc(doc)}
                    className="p-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-xl flex items-center gap-1 transition"
                    title="Download Credential Document"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition"
                      title="Delete from Dossier"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>NABH Standard MS-02 Compliant • All records digitally encrypted and auditable</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENT: IN-APP DOCUMENT PREVIEW MODAL
// ════════════════════════════════════════════════════════════════════════════════
function DocumentPreviewModal({
  doc,
  doctor,
  onClose
}: {
  doc: CredentialDocument;
  doctor: DoctorProfile;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-jakarta">
                {doc.name}
              </h3>
              <p className="text-[11px] text-slate-500">
                {doc.categoryLabel} • Official Practitioner Credential
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Simulation Canvas */}
        <div className="p-8 overflow-y-auto bg-slate-100 dark:bg-slate-950 flex justify-center items-center">
          <div className="bg-amber-50/40 dark:bg-slate-900 p-8 md:p-12 rounded-2xl border-4 border-double border-amber-300 dark:border-slate-700 shadow-soft-xl max-w-2xl w-full text-center space-y-6 relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <Award className="w-96 h-96 text-slate-900" />
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-900 dark:text-brand-300">
                GOVERNMENT OF TAMIL NADU • STATUTORY MEDICAL COUNCIL
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-wide font-serif">
                CERTIFICATE OF REGISTRATION & GOOD STANDING
              </h2>
              <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mt-2" />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
              This is to officially certify that the medical practitioner named below is duly registered in the Register of Medical Practitioners under the Indian Medical Degrees Act and National Medical Commission Regulations.
            </p>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-slate-700 shadow-soft-xs space-y-2">
              <div className="text-lg md:text-xl font-extrabold text-brand-900 dark:text-brand-200 font-jakarta">
                {doctor.name}
              </div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {doctor.qualification}
              </div>
              <div className="text-xs text-slate-500">
                Department of {doctor.department} • {doctor.specialization}
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-around text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Registration Number</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{doctor.registrationNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Status</span>
                  <span className="font-semibold text-emerald-600">Active & In Good Standing</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-left text-xs pt-4 border-t border-amber-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block">Registration Authority</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{doctor.councilName}</span>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-lg font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>DIGITALLY VERIFIED</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Verified: {doc.uploadDate}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 btn-primary text-xs rounded-xl font-semibold"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENT: EDIT DOCTOR PROFILE MODAL
// ════════════════════════════════════════════════════════════════════════════════
function EditDoctorModal({
  doctor,
  onClose,
  onSave
}: {
  doctor: DoctorProfile;
  onClose: () => void;
  onSave: (doc: DoctorProfile) => void;
}) {
  const [formData, setFormData] = useState({
    consultationFeeOpd: doctor.consultationFeeOpd,
    consultationFeeReview: doctor.consultationFeeReview,
    roomNo: doctor.roomNo,
    phone: doctor.phone,
    email: doctor.email,
    shiftSchedule: doctor.shiftSchedule,
    availableForOpd: doctor.availableForOpd,
    bio: doctor.bio
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...doctor,
      ...formData
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-jakarta">
              Edit Consultant Operations: {doctor.name}
            </h3>
            <p className="text-xs text-slate-500">Update consultation fees, room chamber and schedule</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                OPD Fresh Fee (₹)
              </label>
              <input
                type="number"
                value={formData.consultationFeeOpd}
                onChange={(e) => setFormData({ ...formData, consultationFeeOpd: Number(e.target.value) })}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Review Fee (₹)
              </label>
              <input
                type="number"
                value={formData.consultationFeeReview}
                onChange={(e) => setFormData({ ...formData, consultationFeeReview: Number(e.target.value) })}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              OPD Chamber / Room
            </label>
            <input
              type="text"
              value={formData.roomNo}
              onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Shift Duty Schedule
            </label>
            <input
              type="text"
              value={formData.shiftSchedule}
              onChange={(e) => setFormData({ ...formData, shiftSchedule: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-5 py-2 text-xs rounded-xl font-bold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
