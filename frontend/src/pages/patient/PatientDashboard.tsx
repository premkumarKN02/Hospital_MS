import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentApi, patientApi } from '../../lib/api';
import {
  Calendar,
  Clock,
  FileText,
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Link,
  Sparkles,
  QrCode,
  AlertCircle,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { KycBidirectionalLookup } from '../../components/patient/KycBidirectionalLookup';
import { PatientKycCardModal } from '../../components/patient/PatientKycCardModal';
import { AadhaarConnectivityCheckModal } from '../../components/patient/AadhaarConnectivityCheckModal';
import { UniversalEmailShareModal } from '../../components/common/UniversalEmailShareModal';

interface Props {
  onNavigate?: (page: string) => void;
}

const DOCTOR_MAP: Record<string, string> = {
  '55555555-0010-0000-0000-000000000001': 'Dr. Arunachalam Kumar (Cardiology)',
  '55555555-0010-0000-0000-000000000002': 'Dr. Sindhu Rajagopalan (General Medicine)',
};

export default function PatientDashboard({ onNavigate }: Props) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<any>(null);

  // Modals state
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [shareTab, setShareTab] = useState<'whatsapp' | 'email'>('whatsapp');
  const [selectedPatientForCard, setSelectedPatientForCard] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      let patientUUID: string | undefined = localStorage.getItem('patient_id') || undefined;
      const identifiersToTry = [user?.email, user?.phone, user?.username, 'patient.rajesh'].filter(Boolean) as string[];

      for (const idf of identifiersToTry) {
        try {
          const res = await patientApi.lookup(idf);
          if (res.data?.found && res.data?.id) {
            patientUUID = res.data.id;
            if (patientUUID) localStorage.setItem('patient_id', patientUUID);
            setPatientData(res.data);
            break;
          }
        } catch {
          // continue
        }
      }

      if (!patientUUID && (user?.username?.includes('rajesh') || user?.email?.includes('rajesh'))) {
        patientUUID = '55555555-0011-0000-0000-000000000001';
        localStorage.setItem('patient_id', patientUUID);
      }

      const params: any = { page: 0, size: 5 };
      if (patientUUID) {
        params.patientId = patientUUID;
      }
      const r = await appointmentApi.list(params);
      let list = r.data?.content || [];

      // Merge with local sync
      try {
        const localCached = JSON.parse(localStorage.getItem('patient_appointments_sync') || '[]');
        if (localCached.length > 0) {
          const ids = new Set(list.map((a: any) => a.id || a.appointmentNo));
          for (const item of localCached) {
            if (!ids.has(item.id || item.appointmentNo)) {
              list.unshift(item);
            }
          }
        }
      } catch {
        // ignore
      }

      list.sort(
        (a: any, b: any) =>
          new Date((b.appointmentDate || '') + 'T' + (b.appointmentTime || '00:00')).getTime() -
          new Date((a.appointmentDate || '') + 'T' + (a.appointmentTime || '00:00')).getTime()
      );

      setAppointments(list);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const handleSync = () => fetchDashboardData();
    window.addEventListener('appointment-updated', handleSync);
    return () => window.removeEventListener('appointment-updated', handleSync);
  }, [user]);

  const handleOpenCard = (p?: any) => {
    setSelectedPatientForCard(p || patientData || {
      patientId: 'SNHC-2024-00001',
      name: user?.fullName || 'Patient User',
      maskedAadhaar: 'XXXX-XXXX-4920',
      abhaId: 'snhc-2024-00001@abdm',
      bloodGroup: 'O+',
    });
    setIsCardModalOpen(true);
  };

  const handleSuccessLinked = (updatedPatient: any) => {
    setPatientData({
      ...updatedPatient,
      uhid: updatedPatient.patientId,
      name: `${updatedPatient.firstName || ''} ${updatedPatient.lastName || ''}`.trim(),
      maskedAadhaar: updatedPatient.nationalId,
      isKycLinked: true,
      kycStatus: 'VERIFIED',
    });
  };

  const isKycVerified = patientData?.isKycLinked || Boolean(patientData?.nationalId);
  const maskedAadhaarDisplay = patientData?.maskedAadhaar || patientData?.nationalId || 'Not Linked';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="page-header-glass p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/60 px-3 py-1 rounded-full w-fit mb-2 border border-teal-200/50 dark:border-teal-800/50 backdrop-blur-sm">
            <HeartPulse className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Patient Self-Service Portal &amp; e-KYC
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-jakarta">
            Welcome, {patientData?.name || (user?.fullName && user.fullName !== user.username ? user.fullName : (user?.username === 'patient.rajesh' ? 'Rajesh Kannan' : user?.fullName || 'Patient'))}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
            UHID: <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{patientData?.uhid || patientData?.patientId || 'SNHC-2024-00001'}</span> • Access your health records, Aadhaar connectivity, and digital appointments.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsLinkModalOpen(true)}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold transition shadow-xs flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Check Aadhaar Link
          </button>

          <button
            onClick={() => handleOpenCard()}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold transition shadow-xs flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Digital Health Card
          </button>

          <button
            onClick={() => {
              setShareTab('whatsapp');
              setIsEmailModalOpen(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            title="Share verified health dossier on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Dossier
          </button>

          <button
            onClick={() => {
              setShareTab('email');
              setIsEmailModalOpen(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            title="Share verified health dossier via SMTP Email"
          >
            <Mail className="w-4 h-4" />
            Email Dossier
          </button>
        </div>
      </div>

      {/* KYC & Aadhaar Status Banner Card */}
      <div className="card-stylish p-5 border-l-4 border-l-teal-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`p-3 rounded-2xl ${isKycVerified ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'}`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-jakarta">
                  {isKycVerified ? 'Aadhaar e-KYC Verified & Connected' : 'Aadhaar e-KYC Connection Pending'}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${isKycVerified ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'}`}>
                  {isKycVerified ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-amber-600" />}
                  {isKycVerified ? 'UIDAI CONNECTED' : 'ACTION RECOMMENDED'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Linked Masked ID: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{maskedAadhaarDisplay}</span> • ABHA Address: <span className="font-mono text-teal-600 dark:text-teal-400 font-semibold">{patientData?.abhaId || 'patient@abdm'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setIsLinkModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 transition flex items-center gap-1.5"
            >
              <Link className="w-3.5 h-3.5" />
              {isKycVerified ? 'Re-Verify / Update Link' : 'Link Aadhaar Now'}
            </button>
            <button
              onClick={() => handleOpenCard()}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 shadow-xs"
            >
              <QrCode className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              View Card
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Bidirectional Smart Lookup Engine */}
      <KycBidirectionalLookup
        onOpenCard={(p) => handleOpenCard(p)}
        onOpenLinkModal={() => setIsLinkModalOpen(true)}
      />

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate?.('book-appointment')}
          className="card-stylish p-5 text-left transition-all group hover:scale-[1.01]"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 border border-teal-500/20 shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="font-semibold text-sm text-slate-900 dark:text-white">Book New Appointment</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Schedule an in-person or telemedicine visit with specialists</p>
        </button>

        <button
          onClick={() => onNavigate?.('my-records')}
          className="card-stylish p-5 text-left transition-all group hover:scale-[1.01]"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 border border-indigo-500/20 shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <p className="font-semibold text-sm text-slate-900 dark:text-white">My Health Records</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Review diagnostic lab reports, vitals logs, and Rx history</p>
        </button>
      </div>

      {/* Recent Consultations List */}
      <div className="card-stylish overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
          <h2 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            My Recent Consultations
          </h2>
          <button
            onClick={() => onNavigate?.('my-appointments')}
            className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-white/40 dark:bg-slate-800/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-400">
            <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-xs font-medium">No previous consultations recorded</p>
            <button
              onClick={() => onNavigate?.('book-appointment')}
              className="mt-3 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl text-xs font-medium hover:opacity-90 transition-opacity shadow-sm"
            >
              Book your first consultation
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
            {appointments.map((appt: any) => (
              <div key={appt.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors">
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{appt.appointmentNo}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {appt.appointmentDate} at {appt.appointmentTime?.slice(0, 5)} • {DOCTOR_MAP[appt.doctorId] || appt.appointmentType}
                  </p>
                </div>
                <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg ${getStatusColor(appt.status)}`}>
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Smart Card Modal */}
      <PatientKycCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        patient={selectedPatientForCard || patientData}
      />

      {/* Aadhaar Connectivity Check & Link Modal */}
      <AadhaarConnectivityCheckModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        defaultUhid={patientData?.uhid || patientData?.patientId || ''}
        onSuccessLinked={handleSuccessLinked}
      />

      {/* Universal Share Modal (WhatsApp & Email) */}
      <UniversalEmailShareModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        initialTab={shareTab}
        defaultRecipientPhone={patientData?.phone || user?.phone || '9876543210'}
        defaultRecipientEmail={user?.email || 'krishnanp0211@gmail.com'}
        defaultRecipientName={user?.fullName || patientData?.name || 'Patient'}
        defaultSubject={`Sindhu Healthcare — Complete Health Dossier (${patientData?.uhid || 'SNHC-2024-00001'})`}
        dataType="PATIENT_HEALTH_DOSSIER"
        dataPayload={{
          uhid: patientData?.uhid || patientData?.patientId || 'SNHC-2024-00001',
          patientName: patientData?.name || user?.fullName || 'Patient User',
          phone: patientData?.phone || user?.phone || '9876543210',
          email: user?.email || 'krishnanp0211@gmail.com',
          bloodGroup: patientData?.bloodGroup || 'O+',
          gender: patientData?.gender || 'N/A',
          kycStatus: patientData?.kycStatus || 'VERIFIED',
          aadhaarLinked: isKycVerified ? 'Yes (UIDAI Verified)' : 'No',
          maskedAadhaar: maskedAadhaarDisplay,
          abhaAddress: patientData?.abhaId || 'snhc-2024-00001@abdm',
          recentAppointmentsCount: appointments.length,
          lastVerifiedAt: new Date().toLocaleString(),
        }}
      />
    </div>
  );
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    SCHEDULED: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    CONFIRMED: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    CHECKED_IN: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    COMPLETED: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800',
    CANCELLED: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
  };
  return map[status] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
}
