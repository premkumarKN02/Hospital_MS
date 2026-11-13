import React, { useState, useEffect } from 'react';
import {
  Scan,
  Search,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Filter,
  FileText,
  Activity,
  ShieldCheck,
  X,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  SunMedium,
  RotateCw
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';

interface RadiologyExam {
  id: string;
  accessionNumber: string;
  patientName: string;
  mrn: string;
  modality: 'CT Scan' | '1.5T / 3T MRI' | 'Digital X-Ray' | 'Ultrasound (USG)' | 'Mammography';
  procedureName: string;
  bodyRegion: string;
  orderingPhysician: string;
  radiologist: string;
  status: 'SCHEDULED' | 'IMAGE_ACQUIRED' | 'DICTATION_IN_PROGRESS' | 'REPORT_APPROVED';
  priority: 'ROUTINE' | 'URGENT' | 'STAT_TRAUMA';
  findingSummary?: string;
  scheduledTime: string;
  sliceCount?: number;
}

const INITIAL_EXAMS: RadiologyExam[] = [
  {
    id: 'RIS-01',
    accessionNumber: 'ACC-8801-CT',
    patientName: 'Subramanian Natarajan',
    mrn: 'UHID-88204',
    modality: 'CT Scan',
    procedureName: 'NCCT Head (Plain Brain CT)',
    bodyRegion: 'Head & Brain',
    orderingPhysician: 'Dr. Joseph (Emergency Department)',
    radiologist: 'Dr. S. Mohan (Senior Radiologist)',
    status: 'REPORT_APPROVED',
    priority: 'STAT_TRAUMA',
    findingSummary: 'No acute intracranial hemorrhage or territorial infarct. Ventricles and basal cisterns are prominent, symmetrical and normal for age. Calvarium is intact.',
    scheduledTime: '08:15 AM',
    sliceCount: 160
  },
  {
    id: 'RIS-02',
    accessionNumber: 'ACC-8802-MRI',
    patientName: 'Kavitha Balakrishnan',
    mrn: 'UHID-88212',
    modality: '1.5T / 3T MRI',
    procedureName: 'MRI Lumbar Spine with Whole Spine Screen',
    bodyRegion: 'Spine & Musculoskeletal',
    orderingPhysician: 'Dr. P. Sundaram (Orthopedics)',
    radiologist: 'Dr. Priya V. (Musculoskeletal Radiologist)',
    status: 'DICTATION_IN_PROGRESS',
    priority: 'ROUTINE',
    findingSummary: 'L4-L5 broad-based posterior disc bulge with mild bilateral neural foramen narrowing. No cauda equina compression.',
    scheduledTime: '10:00 AM',
    sliceCount: 240
  },
  {
    id: 'RIS-03',
    accessionNumber: 'ACC-8803-XR',
    patientName: 'Dhanalakshmi Rajan',
    mrn: 'UHID-88228',
    modality: 'Digital X-Ray',
    procedureName: 'Chest X-Ray PA View (High Resolution)',
    bodyRegion: 'Thorax / Chest',
    orderingPhysician: 'Dr. Sindhu Rajagopalan (General Medicine)',
    radiologist: 'Dr. S. Mohan',
    status: 'IMAGE_ACQUIRED',
    priority: 'ROUTINE',
    findingSummary: 'Images uploaded to PACS server. Clear lung parenchyma, normal cardiothoracic ratio (CTR 0.48).',
    scheduledTime: '11:30 AM',
    sliceCount: 2
  },
  {
    id: 'RIS-04',
    accessionNumber: 'ACC-8804-USG',
    patientName: 'Sanjay Deshmukh',
    mrn: 'UHID-88239',
    modality: 'Ultrasound (USG)',
    procedureName: 'USG Whole Abdomen & Pelvis',
    bodyRegion: 'Abdomen',
    orderingPhysician: 'Dr. Arunachalam Kumar (Cardiology / GI)',
    radiologist: 'Dr. Priya V.',
    status: 'SCHEDULED',
    priority: 'URGENT',
    scheduledTime: '01:00 PM',
    sliceCount: 24
  }
];

export const RisRadiologyPage: React.FC = () => {
  const [exams, setExams] = useState<RadiologyExam[]>(() => {
    const saved = localStorage.getItem('hospital_ris_exams_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_EXAMS;
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('ALL');
  const [isNewExamModalOpen, setIsNewExamModalOpen] = useState(false);

  // PACS Viewer Modal
  const [viewingPacsExam, setViewingPacsExam] = useState<RadiologyExam | null>(null);
  const [pacsBrightness, setPacsBrightness] = useState(100);
  const [pacsContrast, setPacsContrast] = useState(100);
  const [pacsZoom, setPacsZoom] = useState(1);
  const [pacsInvert, setPacsInvert] = useState(false);

  // Diagnostic Report Modal
  const [viewingReportExam, setViewingReportExam] = useState<RadiologyExam | null>(null);

  // New Exam Form
  const [newExam, setNewExam] = useState({
    patientName: '',
    mrn: '',
    modality: 'CT Scan' as RadiologyExam['modality'],
    procedureName: 'NCCT Head / Brain',
    bodyRegion: 'Head & Brain',
    orderingPhysician: 'Dr. Joseph Anthony',
    radiologist: 'Dr. S. Mohan',
    priority: 'ROUTINE' as RadiologyExam['priority'],
    scheduledTime: '02:00 PM'
  });

  useEffect(() => {
    try {
      localStorage.setItem('hospital_ris_exams_v1', JSON.stringify(exams));
    } catch (e) {
      console.error(e);
    }
  }, [exams]);

  const handleSignReport = (id: string) => {
    setExams((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: 'REPORT_APPROVED',
              findingSummary: e.findingSummary || 'Diagnostic scan evaluated and validated by Chief Radiologist.'
            }
          : e
      )
    );
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExam.patientName.trim()) return;

    const created: RadiologyExam = {
      id: `RIS-${Date.now()}`,
      accessionNumber: `ACC-${Math.floor(8810 + Math.random() * 900)}-${newExam.modality.substring(0, 2).toUpperCase()}`,
      patientName: newExam.patientName,
      mrn: newExam.mrn || `UHID-${Math.floor(88200 + Math.random() * 900)}`,
      modality: newExam.modality,
      procedureName: newExam.procedureName,
      bodyRegion: newExam.bodyRegion,
      orderingPhysician: newExam.orderingPhysician,
      radiologist: newExam.radiologist,
      status: 'IMAGE_ACQUIRED',
      priority: newExam.priority,
      findingSummary: 'Scan acquired in imaging gantry. Ready for radiologist review.',
      scheduledTime: newExam.scheduledTime,
      sliceCount: 64
    };

    setExams([created, ...exams]);
    setIsNewExamModalOpen(false);
  };

  const filtered = exams.filter((e) => {
    const matchModality = selectedModality === 'ALL' || e.modality.includes(selectedModality);
    const q = searchQuery.toLowerCase();
    const matchSearch =
      e.patientName.toLowerCase().includes(q) ||
      e.mrn.toLowerCase().includes(q) ||
      e.accessionNumber.toLowerCase().includes(q) ||
      e.procedureName.toLowerCase().includes(q);
    return matchModality && matchSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <Scan className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-jakarta">
              Radiology Information System (RIS) &amp; Web PACS
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Digital DICOM image archive, multi-slice CT/MRI study accessions, and radiologist reporting desk
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNewExamModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Book Radiology Study
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold"
            title="Print Worklist"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Studies Today</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{exams.length} Accessions</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 uppercase">Reports Signed</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {exams.filter((e) => e.status === 'REPORT_APPROVED').length} Studies
          </p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-rose-200/80 shadow-sm">
          <span className="text-xs font-bold text-rose-600 uppercase">STAT Trauma Urgency</span>
          <p className="text-2xl font-black text-rose-700 mt-1">
            {exams.filter((e) => e.priority === 'STAT_TRAUMA').length} Priority
          </p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-sky-200/80 shadow-sm">
          <span className="text-xs font-bold text-sky-600 uppercase">PACS Archival</span>
          <p className="text-2xl font-black text-sky-700 mt-1">100% DICOM 3.0</p>
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
            placeholder="Search patient, accession #, MRN..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedModality}
            onChange={(e) => setSelectedModality(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Modalities</option>
            <option value="CT">CT Scan</option>
            <option value="MRI">1.5T / 3T MRI</option>
            <option value="X-Ray">Digital X-Ray</option>
            <option value="USG">Ultrasound (USG)</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Accession &amp; Modality</th>
                <th className="px-5 py-3.5">Patient &amp; MRN</th>
                <th className="px-5 py-3.5">Procedure &amp; Region</th>
                <th className="px-5 py-3.5">Priority</th>
                <th className="px-5 py-3.5">Diagnostic Findings</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Desk Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-4">
                    <div className="font-mono font-bold text-blue-700 text-xs">{e.accessionNumber}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {e.modality}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 text-xs">{e.patientName}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{e.mrn}</div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-800 text-xs">{e.procedureName}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Region: {e.bodyRegion}</div>
                  </td>

                  <td className="px-5 py-4">
                    {e.priority === 'STAT_TRAUMA' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                        STAT Trauma
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {e.priority}
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 max-w-xs">
                    <div className="text-xs text-slate-600 line-clamp-2">
                      {e.findingSummary || 'Images in processing buffer...'}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        e.status === 'REPORT_APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : e.status === 'DICTATION_IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}
                    >
                      {e.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      <button
                        onClick={() => {
                          setViewingPacsExam(e);
                          setPacsBrightness(100);
                          setPacsContrast(100);
                          setPacsZoom(1);
                          setPacsInvert(false);
                        }}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                        title="Open DICOM PACS Viewer"
                      >
                        <ExternalLink className="w-3 h-3" /> PACS
                      </button>

                      {e.status !== 'REPORT_APPROVED' ? (
                        <button
                          onClick={() => handleSignReport(e.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm"
                        >
                          Sign Report
                        </button>
                      ) : (
                        <button
                          onClick={() => setViewingReportExam(e)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold"
                        >
                          Report PDF
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Interactive DICOM PACS Viewer */}
      {viewingPacsExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
            {/* PACS Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-600 text-white font-mono font-bold text-[10px] rounded">
                    DICOM PACS 3.0
                  </span>
                  <span className="text-slate-400 text-xs font-mono">{viewingPacsExam.accessionNumber}</span>
                </div>
                <h3 className="font-bold text-white text-base mt-0.5">
                  {viewingPacsExam.patientName} ({viewingPacsExam.mrn}) — {viewingPacsExam.procedureName}
                </h3>
              </div>

              {/* Controls Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPacsZoom((prev) => Math.min(prev + 0.25, 2.5))}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPacsZoom((prev) => Math.max(prev - 0.25, 0.75))}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPacsInvert(!pacsInvert)}
                  className={`p-2 rounded-xl text-slate-300 ${pacsInvert ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700'}`}
                  title="Invert Monochromatic LUT"
                >
                  <Sliders className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setPacsBrightness(100);
                    setPacsContrast(100);
                    setPacsZoom(1);
                    setPacsInvert(false);
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300"
                  title="Reset DICOM Window"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewingPacsExam(null)}
                  className="p-2 bg-rose-950/80 text-rose-400 hover:bg-rose-900 rounded-xl ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated Medical Imaging Canvas */}
            <div className="flex-1 bg-black rounded-2xl overflow-hidden relative flex items-center justify-center min-h-[380px] border border-slate-800">
              <div
                className="transition-all duration-150 flex flex-col items-center justify-center text-center p-6"
                style={{
                  transform: `scale(${pacsZoom})`,
                  filter: `brightness(${pacsBrightness}%) contrast(${pacsContrast}%) ${pacsInvert ? 'invert(1)' : ''}`
                }}
              >
                {/* SVG High-Contrast Medical Scan Simulation */}
                <svg width="280" height="280" viewBox="0 0 280 280" className="opacity-90">
                  <circle cx="140" cy="140" r="130" fill="#0d1117" stroke="#30363d" strokeWidth="3" />
                  <ellipse cx="140" cy="140" rx="90" ry="110" fill="#161b22" stroke="#484f58" strokeWidth="2" />
                  <path d="M 100 100 Q 140 140 100 180" fill="none" stroke="#8b949e" strokeWidth="4" />
                  <path d="M 180 100 Q 140 140 180 180" fill="none" stroke="#8b949e" strokeWidth="4" />
                  <ellipse cx="140" cy="140" rx="30" ry="50" fill="#21262d" stroke="#58a6ff" strokeWidth="1.5" />
                  <circle cx="140" cy="95" r="14" fill="#30363d" />
                  <circle cx="140" cy="185" r="14" fill="#30363d" />
                </svg>

                <div className="absolute top-4 left-4 text-left font-mono text-[11px] text-emerald-400 space-y-0.5">
                  <div>STUDY: {viewingPacsExam.modality}</div>
                  <div>WL: 40 / WW: 350 (Soft Tissue)</div>
                  <div>FOV: 240mm · MATRIX: 512x512</div>
                  <div>SLICES: {viewingPacsExam.sliceCount || 160}</div>
                </div>

                <div className="absolute top-4 right-4 text-right font-mono text-[11px] text-slate-400 space-y-0.5">
                  <div>HOSPITAL: Sindhu Health Care</div>
                  <div>R: Right Lateral</div>
                  <div>KVp: 120 · mA: 280</div>
                </div>
              </div>
            </div>

            {/* Findings Text in PACS Footer */}
            <div className="p-3 bg-slate-800/80 rounded-2xl text-xs space-y-1 flex-shrink-0">
              <span className="font-bold text-slate-300 uppercase text-[10px]">Attending Radiologist Impression:</span>
              <p className="text-slate-200">
                {viewingPacsExam.findingSummary || 'Study under live reading queue.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Diagnostic Report Printable View */}
      {viewingReportExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">OFFICIAL RADIOLOGY DOSSIER</span>
                <h3 className="font-black text-slate-900 text-lg font-jakarta">Sindhu Health Diagnostic Imaging</h3>
              </div>
              <button onClick={() => setViewingReportExam(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Patient Name</span>
                  <p className="font-bold text-slate-900 text-sm">{viewingReportExam.patientName}</p>
                  <p className="text-slate-500 font-mono">{viewingReportExam.mrn}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Accession #</span>
                  <p className="font-mono font-bold text-blue-700">{viewingReportExam.accessionNumber}</p>
                  <p className="text-slate-500">{viewingReportExam.modality}</p>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 uppercase text-[10px]">Procedure Evaluated</span>
                <p className="text-slate-900 font-bold mt-0.5">{viewingReportExam.procedureName} ({viewingReportExam.bodyRegion})</p>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-1">
                <span className="font-bold text-blue-900 text-[11px] uppercase">Final Radiologic Impression:</span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {viewingReportExam.findingSummary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Verified by: <strong>{viewingReportExam.radiologist}</strong></span>
                <span className="text-emerald-700 font-bold">Electronically Signed ✓</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Report PDF
              </button>
              <button
                onClick={() => setViewingReportExam(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Book Radiology Study */}
      {isNewExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <Scan className="w-5 h-5 text-blue-600" />
                Schedule Radiology Exam
              </h3>
              <button onClick={() => setIsNewExamModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. Ramanathan"
                  value={newExam.patientName}
                  onChange={(e) => setNewExam({ ...newExam, patientName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Modality</label>
                  <select
                    value={newExam.modality}
                    onChange={(e) => setNewExam({ ...newExam, modality: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                  >
                    <option value="CT Scan">CT Scan (128-Slice)</option>
                    <option value="1.5T / 3T MRI">1.5T / 3T MRI</option>
                    <option value="Digital X-Ray">Digital X-Ray</option>
                    <option value="Ultrasound (USG)">Ultrasound (USG)</option>
                    <option value="Mammography">Digital Mammography</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newExam.priority}
                    onChange={(e) => setNewExam({ ...newExam, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                  >
                    <option value="ROUTINE">Routine Outpatient</option>
                    <option value="URGENT">Urgent Inpatient</option>
                    <option value="STAT_TRAUMA">STAT Trauma Crash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Procedure Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HRCT Chest / Contrast Abdomen"
                  value={newExam.procedureName}
                  onChange={(e) => setNewExam({ ...newExam, procedureName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewExamModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/25 transition"
                >
                  Generate Accession
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
