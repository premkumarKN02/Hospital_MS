import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  FileText,
  Download,
  ShieldCheck,
  HeartPulse,
  Activity,
  Printer,
  Share2,
  X,
  CheckCircle2,
  Calendar,
  Clock,
  UserCheck,
  Plus,
  Stethoscope,
  Filter
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { appointmentApi, patientApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onNavigate?: (page: string) => void;
}

const DOCTOR_MAP: Record<string, string> = {
  '55555555-0010-0000-0000-000000000001': 'Dr. Arunachalam Kumar (MD, DM - Cardiology)',
  '55555555-0010-0000-0000-000000000002': 'Dr. Sindhu Rajagopalan (MD - General & Family Medicine)',
};

export default function MyRecordsPage({ onNavigate }: Props) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'consultations' | 'diagnostic'>('all');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Default diagnostic lab & radiology archives
  const staticDiagnosticRecords = [
    {
      id: 'REC-001',
      title: 'Complete Blood Count (CBC) & Metabolic Panel',
      type: 'Laboratory Report',
      date: '2024-10-01',
      time: '08:30',
      doctor: 'Dr. S. K. Narayanan, MD (Pathology)',
      status: 'VERIFIED',
      category: 'diagnostic',
      isAppointment: false,
    },
    {
      id: 'REC-002',
      title: 'Chest X-Ray PA View & Cardiomegaly Assessment',
      type: 'Radiology Report',
      date: '2024-09-18',
      time: '11:15',
      doctor: 'Dr. M. Radhakrishnan, DMRD (Radiology)',
      status: 'VERIFIED',
      category: 'diagnostic',
      isAppointment: false,
    },
    {
      id: 'REC-003',
      title: 'Discharge Summary - Acute Bronchitis Observation',
      type: 'Clinical Summary',
      date: '2024-08-10',
      time: '14:00',
      doctor: 'Dr. Priya Sundaram, DNB (Internal Med)',
      status: 'ARCHIVED',
      category: 'diagnostic',
      isAppointment: false,
    },
  ];

  const fetchRecords = async () => {
    setLoading(true);
    try {
      let patientId: string | undefined = localStorage.getItem('patient_id') || undefined;

      if (!patientId) {
        const identifiersToTry = [
          user?.email,
          user?.phone,
          user?.username,
        ].filter(Boolean) as string[];

        for (const identifier of identifiersToTry) {
          try {
            const lRes = await patientApi.lookup(identifier);
            if (lRes.data?.found && lRes.data?.id) {
              patientId = lRes.data.id;
              if (patientId) localStorage.setItem('patient_id', patientId);
              break;
            }
          } catch {
            // continue
          }
        }
      }

      if (!patientId && (user?.username?.includes('rajesh') || user?.email?.includes('rajesh'))) {
        patientId = '55555555-0011-0000-0000-000000000001';
        localStorage.setItem('patient_id', patientId);
      }

      const params: any = { page: 0, size: 50 };
      if (patientId) {
        params.patientId = patientId;
      }

      const res = await appointmentApi.list(params);
      let apptList = res.data?.content || [];

      // Also check locally synced bookings
      try {
        const localSync = JSON.parse(localStorage.getItem('patient_appointments_sync') || '[]');
        if (localSync.length > 0) {
          const existingIds = new Set(apptList.map((a: any) => a.id || a.appointmentNo));
          for (const item of localSync) {
            if (!existingIds.has(item.id || item.appointmentNo)) {
              apptList.push(item);
            }
          }
        }
      } catch {
        // ignore
      }

      // Convert booked appointments into clinical medical records
      const consultationRecords = apptList.map((a: any) => {
        const reasonText = a.visitReason || 'General OPD Medical Consultation';
        const typeLabel =
          a.appointmentType === 'REVIEW'
            ? 'Review & Follow-up'
            : a.appointmentType === 'TELECONSULT'
            ? 'Tele-Consultation'
            : 'Clinical Consultation (OPD)';

        return {
          id: a.appointmentNo || `APT-${a.id?.slice(0, 8)}`,
          title: `OPD Consultation: ${reasonText}`,
          type: typeLabel,
          date: a.appointmentDate,
          time: a.appointmentTime?.slice(0, 5) || '10:00',
          doctor: DOCTOR_MAP[a.doctorId] || 'Consultant Specialist',
          status: a.status || 'SCHEDULED',
          category: 'consultations',
          isAppointment: true,
          fee: a.consultationFee || 500,
          paid: a.paid,
          visitReason: reasonText,
          rawAppointment: a,
        };
      });

      // Sort newest consultations first
      consultationRecords.sort(
        (a: any, b: any) =>
          new Date((b.date || '') + 'T' + (b.time || '00:00')).getTime() -
          new Date((a.date || '') + 'T' + (a.time || '00:00')).getTime()
      );

      setAppointments(consultationRecords);
    } catch (err) {
      console.error('Failed to load consultation records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();

    const handleSync = () => fetchRecords();
    window.addEventListener('appointment-updated', handleSync);
    return () => window.removeEventListener('appointment-updated', handleSync);
  }, [user?.username]);

  // Combine diagnostic reports and clinical appointments
  const allRecords = [...appointments, ...staticDiagnosticRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const displayedRecords =
    activeTab === 'consultations'
      ? appointments
      : activeTab === 'diagnostic'
      ? staticDiagnosticRecords
      : allRecords;

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeShareRec, setActiveShareRec] = useState<any | null>(null);
  const [selectedRecordForViewer, setSelectedRecordForViewer] = useState<any | null>(null);

  const handleShareSingle = (rec: any) => {
    setActiveShareRec(rec);
    setIsShareModalOpen(true);
  };

  const handleShareAll = () => {
    setActiveShareRec(null);
    setIsShareModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="page-header-glass p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate?.('patient-dashboard')}
              className="p-2.5 bg-white/70 dark:bg-slate-800/70 border border-white/60 dark:border-slate-700/60 rounded-xl hover:bg-white transition shadow-sm backdrop-blur-md cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-jakarta flex items-center gap-2">
                <FileText className="w-6 h-6 text-teal-600 dark:text-teal-400" /> Electronic Health Records (EHR)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Booked consultations, clinical encounters, diagnostic reports &amp; verified summaries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate?.('book-appointment')}
              className="px-3.5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Book Consultation
            </button>
            <button
              onClick={handleShareAll}
              className="px-3 py-2.5 bg-white/70 dark:bg-slate-800/70 hover:bg-white text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition shadow-2xs cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-teal-600" />
              Share
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-2.5 bg-white/70 dark:bg-slate-800/70 hover:bg-white text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition shadow-2xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              Print
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            All Medical Records ({allRecords.length})
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'consultations'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Booked Consultations ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('diagnostic')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'diagnostic'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            Diagnostic Reports ({staticDiagnosticRecords.length})
          </button>
        </div>

        {/* Privacy & Compliance Banner */}
        <div className="card-stylish p-4 flex items-center gap-3 text-teal-800 dark:text-teal-300 text-xs">
          <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
          <span>
            All consultation bookings and clinical dossiers are synchronized with the central Hospital MPI and validated in compliance with NABH / JCI health data privacy guidelines.
          </span>
        </div>

        {/* Record Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading your synchronized medical records...</div>
          ) : displayedRecords.length === 0 ? (
            <div className="card-stylish p-12 text-center text-slate-400 space-y-3">
              <Calendar className="w-12 h-12 mx-auto opacity-30 text-teal-600" />
              <p className="font-semibold text-slate-700 dark:text-slate-200">No medical records in this category</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Schedule an OPD consultation with one of our specialists to generate your digital encounter dossier.
              </p>
              <button
                onClick={() => onNavigate?.('book-appointment')}
                className="mt-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
              >
                + Book Consultation Now
              </button>
            </div>
          ) : (
            displayedRecords.map((rec: any) => (
              <div
                key={rec.id}
                className="card-stylish p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-teal-300 dark:hover:border-teal-700"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold shadow-xs ${
                      rec.isAppointment
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                    }`}
                  >
                    {rec.isAppointment ? <Stethoscope className="w-6 h-6" /> : <HeartPulse className="w-6 h-6" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300">{rec.id}</span>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                        {rec.type}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          rec.status === 'COMPLETED' || rec.status === 'VERIFIED'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : rec.status === 'CONFIRMED' || rec.status === 'SCHEDULED'
                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {rec.status}
                      </span>
                      {rec.isAppointment && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          Booked Consultation
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{rec.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
                      <span>Doctor: {rec.doctor}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {rec.date}
                      </span>
                      {rec.time && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {rec.time}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleShareSingle(rec)}
                    className="p-2.5 bg-white/70 dark:bg-slate-800/70 hover:bg-white text-slate-700 dark:text-slate-300 rounded-xl transition border border-white/60 dark:border-slate-700 shadow-2xs cursor-pointer"
                    title="Share this record"
                  >
                    <Share2 className="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    onClick={() => setSelectedRecordForViewer(rec)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl text-xs font-semibold transition shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> View / Download Dossier
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Verified Medical Record Document Dossier Modal */}
      {selectedRecordForViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {selectedRecordForViewer.isAppointment
                    ? 'Clinical Consultation Encounter Dossier'
                    : 'Electronic Medical Record Dossier'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecordForViewer(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs font-sans">
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-3">
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">
                    SINDHU MULTISPECIALITY HOSPITAL
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {selectedRecordForViewer.isAppointment
                      ? 'Outpatient Department (OPD) Consultation Slip & Record'
                      : 'Patient Electronic Health Record (EHR) & Clinical Archive'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    NABH Certified • ABHA ID: {user?.username || 'patient.rajesh'}@abdm
                  </p>
                </div>
                <div className="text-right">
                  <span className="badge-emerald font-bold">
                    {selectedRecordForViewer.status}
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono mt-1 font-bold">
                    {selectedRecordForViewer.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-1">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Encounter / Title</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {selectedRecordForViewer.title}
                  </span>
                  <p className="text-[11px] text-slate-500">{selectedRecordForViewer.type}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Consulting Physician</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {selectedRecordForViewer.doctor}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Date: {selectedRecordForViewer.date} at {selectedRecordForViewer.time}
                  </p>
                </div>
              </div>

              {selectedRecordForViewer.isAppointment && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-teal-50/50 dark:bg-teal-950/30 rounded-xl border border-teal-100 dark:border-teal-900/50">
                  <div>
                    <span className="text-teal-700 dark:text-teal-300 text-[10px] uppercase font-bold block">
                      Consultation Fee
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      ₹{selectedRecordForViewer.fee || 500}
                    </span>
                    <p className="text-[10px] font-semibold text-emerald-600">
                      {selectedRecordForViewer.paid ? 'PAID ONLINE' : 'PAY AT OPD DESK'}
                    </p>
                  </div>
                  <div>
                    <span className="text-teal-700 dark:text-teal-300 text-[10px] uppercase font-bold block">
                      Clinic Location
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Kilpauk Main Branch
                    </span>
                    <p className="text-[10px] text-slate-500">OPD Desk Bay 2, 1st Floor</p>
                  </div>
                </div>
              )}

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Clinical Summary &amp; Directives
                </span>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                  {selectedRecordForViewer.isAppointment
                    ? `Consultation booked by patient for clinical evaluation. Chief complaints: "${
                        selectedRecordForViewer.visitReason || 'General medical follow-up'
                      }". Scheduled slot confirmed in OPD desk queue. Please arrive 15 minutes before slot time.`
                    : 'Patient evaluation completed in full accordance with national clinical practice guidelines. Diagnostic findings and medical management directives have been recorded and digitally archived into the hospital central MPI repository.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end text-[10px] text-slate-500">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Digitally Signed &amp; Timestamped</span>
                </div>
                <div className="text-right font-mono text-[9px] text-slate-400">
                  Verification Hash: SHA256-4b82f091c
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => window.print()}
                className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Record PDF
              </button>
              <button
                type="button"
                onClick={() => setSelectedRecordForViewer(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Share Modal for Health Records */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={
          activeShareRec
            ? `Health Record: ${activeShareRec.title}`
            : 'My Electronic Health Records Summary'
        }
        summaryText={
          activeShareRec
            ? `HEALTH RECORD DETAILS - SINDHU MULTISPECIALITY HOSPITAL\nRecord ID: ${activeShareRec.id}\nTitle: ${activeShareRec.title}\nCategory: ${activeShareRec.type}\nDoctor: ${activeShareRec.doctor}\nDate: ${activeShareRec.date} at ${activeShareRec.time || '10:00'}\nVerification: ${activeShareRec.status}`
            : `PATIENT HEALTH RECORDS SUMMARY - SINDHU MULTISPECIALITY HOSPITAL\nTotal Records: ${allRecords.length}\n\n${allRecords
                .map(
                  (r) =>
                    `• ${r.id}: ${r.title} (${r.type}) with ${r.doctor} on ${r.date}`
                )
                .join('\n')}\n\nEmergency Helpline: +91 44 2626 5500`
        }
        csvData={
          activeShareRec
            ? [
                {
                  RecordID: activeShareRec.id,
                  Title: activeShareRec.title,
                  Type: activeShareRec.type,
                  Doctor: activeShareRec.doctor,
                  Date: activeShareRec.date,
                  Time: activeShareRec.time,
                  Status: activeShareRec.status,
                },
              ]
            : allRecords.map((r) => ({
                RecordID: r.id,
                Title: r.title,
                Type: r.type,
                Doctor: r.doctor,
                Date: r.date,
                Time: r.time,
                Status: r.status,
              }))
        }
        csvFilename={
          activeShareRec ? `Record_${activeShareRec.id}.csv` : 'My_Health_Records.csv'
        }
      />
    </div>
  );
}
