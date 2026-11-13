import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Heart,
  TrendingUp,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Smile,
  Frown,
  Meh,
  Printer,
  Share2,
  Search,
  Filter,
  X,
  AlertCircle
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { useAuth } from '../../context/AuthContext';

interface FeedbackItem {
  id: string;
  patientName: string;
  patientId: string;
  rating: number;
  department: string;
  doctorName?: string;
  comments: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  date: string;
  isResolved?: boolean;
  resolutionNote?: string;
}

const INITIAL_FEEDBACKS: FeedbackItem[] = [
  {
    id: 'fb-1',
    patientName: 'K. Sangeetha',
    patientId: 'UHID-88201',
    rating: 5,
    department: 'Cardiology',
    doctorName: 'Dr. Arunachalam Kumar',
    comments: "Exceptional clinical care! Dr. Arun Kumar explained my father's cardiac stent procedure with immense patience. The ICU nursing team was exceptionally compassionate.",
    sentiment: 'POSITIVE',
    date: '2026-10-08',
    isResolved: true
  },
  {
    id: 'fb-2',
    patientName: 'V. Murugesan',
    patientId: 'UHID-88209',
    rating: 3,
    department: 'General Medicine',
    doctorName: 'Dr. Sindhu Rajagopalan',
    comments: 'Very thorough diagnosis by Dr. Sindhu. However, there was a 25-minute wait at the pharmacy counter during peak evening discharge hours. Recommend opening an express billing desk.',
    sentiment: 'NEUTRAL',
    date: '2026-10-07',
    isResolved: false
  },
  {
    id: 'fb-3',
    patientName: 'D. Priyadharshini',
    patientId: 'UHID-88224',
    rating: 5,
    department: 'Emergency & Critical Care',
    doctorName: 'Dr. Joseph',
    comments: 'The emergency triage team attended to my mother within 90 seconds of arrival. Rapid ECG and timely stabilization saved precious minutes. Truly world-class infrastructure.',
    sentiment: 'POSITIVE',
    date: '2026-10-06',
    isResolved: true
  },
  {
    id: 'fb-4',
    patientName: 'G. Sundaram',
    patientId: 'UHID-88235',
    rating: 2,
    department: 'Orthopedics',
    doctorName: 'Dr. P. Sundaram',
    comments: 'Doctor is brilliant, but digital X-ray upload took 40 minutes to reflect in the consultant chamber. Please streamline RIS to OPD sync.',
    sentiment: 'NEGATIVE',
    date: '2026-10-05',
    isResolved: false
  }
];

export const PatientFeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const isPatient = user?.roles?.some(r => r.toUpperCase().includes('PATIENT')) || user?.username?.startsWith('patient');

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
    const saved = localStorage.getItem('hospital_patient_feedbacks_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_FEEDBACKS;
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedSentiment, setSelectedSentiment] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resolvingItem, setResolvingItem] = useState<FeedbackItem | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  // New Feedback Form
  const defaultPatientName = user?.username === 'patient.rajesh' ? 'Rajesh Kannan' : (user?.fullName && user.fullName !== user.username ? user.fullName : '');
  const [newName, setNewName] = useState(defaultPatientName);
  const [newDept, setNewDept] = useState('Cardiology');
  const [newDoctor, setNewDoctor] = useState('Dr. Arunachalam Kumar');
  const [newRating, setNewRating] = useState(5);
  const [newComments, setNewComments] = useState('');

  const handleOpenReviewModal = () => {
    if (!newName && defaultPatientName) {
      setNewName(defaultPatientName);
    }
    setIsModalOpen(true);
  };

  useEffect(() => {
    try {
      localStorage.setItem('hospital_patient_feedbacks_v1', JSON.stringify(feedbacks));
    } catch (e) {
      console.error(e);
    }
  }, [feedbacks]);

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComments.trim()) return;

    const item: FeedbackItem = {
      id: `fb-${Date.now()}`,
      patientName: newName,
      patientId: isPatient ? 'UHID-88202' : `UHID-${Math.floor(88200 + Math.random() * 900)}`,
      rating: newRating,
      department: newDept,
      doctorName: newDoctor,
      comments: newComments,
      sentiment: newRating >= 4 ? 'POSITIVE' : newRating === 3 ? 'NEUTRAL' : 'NEGATIVE',
      date: new Date().toISOString().split('T')[0],
      isResolved: newRating >= 4
    };

    setFeedbacks([item, ...feedbacks]);
    setIsModalOpen(false);
    setNewName('');
    setNewComments('');
  };

  const handleSaveResolution = () => {
    if (!resolvingItem || !resolutionText.trim()) return;

    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === resolvingItem.id
          ? { ...f, isResolved: true, resolutionNote: resolutionText }
          : f
      )
    );
    setResolvingItem(null);
    setResolutionText('');
  };

  const totalReviews = feedbacks.length;
  const avgRating = totalReviews > 0 ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalReviews).toFixed(1) : '5.0';
  const npsScore = totalReviews > 0 ? Math.round(((feedbacks.filter(f => f.rating >= 4).length - feedbacks.filter(f => f.rating <= 2).length) / totalReviews) * 100) : 100;
  const pendingResolutions = feedbacks.filter((f) => !f.isResolved).length;

  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchDept = selectedDept === 'ALL' || f.department.toLowerCase().includes(selectedDept.toLowerCase());
    const matchSent = selectedSentiment === 'ALL' || f.sentiment === selectedSentiment;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !searchQuery ||
      f.patientName.toLowerCase().includes(q) ||
      f.comments.toLowerCase().includes(q) ||
      (f.doctorName && f.doctorName.toLowerCase().includes(q));
    return matchDept && matchSent && matchQuery;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 font-jakarta">
            <span className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
              <Star className="w-6 h-6 fill-amber-500" />
            </span>
            Patient Experience &amp; NPS Feedback Desk
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time outpatient reviews, hospital Net Promoter Score (NPS), and clinical grievance resolution
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenReviewModal}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Log Patient Review
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl border border-slate-200 text-xs font-bold flex items-center gap-1.5"
            title="Print Feedback Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase">Average Rating</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{avgRating}</span>
            <div className="flex text-amber-500 text-xs">
              {'★'.repeat(Math.round(Number(avgRating)))}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-sm">
          <span className="text-xs text-emerald-600 font-bold uppercase">Net Promoter Score (NPS)</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">+{npsScore}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-blue-200/80 shadow-sm">
          <span className="text-xs text-blue-600 font-bold uppercase">Total Patient Reviews</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{totalReviews} Verified</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-200/80 shadow-sm">
          <span className="text-xs text-rose-600 font-bold uppercase">Open CAPA Grievances</span>
          <p className="text-2xl font-black text-rose-700 mt-1">
            {pendingResolutions} Pending
          </p>
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
            placeholder="Search patient, review feedback, doctor..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-amber-500 focus:bg-white"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Emergency">Emergency</option>
            <option value="Orthopedics">Orthopedics</option>
          </select>

          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Sentiments</option>
            <option value="POSITIVE">Positive (4-5 Stars)</option>
            <option value="NEUTRAL">Neutral (3 Stars)</option>
            <option value="NEGATIVE">Negative (1-2 Stars)</option>
          </select>
        </div>
      </div>

      {/* Feedback Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
            <Star className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-500" />
            <p className="text-base font-semibold text-slate-700">No reviews found matching your filter</p>
          </div>
        ) : (
          filteredFeedbacks.map((f) => (
            <div
              key={f.id}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{f.patientName}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">{f.patientId} · {f.date}</span>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-black text-amber-700 text-xs">{f.rating}.0</span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  "{f.comments}"
                </div>

                {f.doctorName && (
                  <div className="mt-2 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="text-slate-400 font-normal">Consultant:</span> {f.doctorName}
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
                      {f.department}
                    </span>
                  </div>
                )}

                {f.resolutionNote && (
                  <div className="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 space-y-0.5">
                    <span className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Admin Action Taken (CAPA):
                    </span>
                    <p className="italic">"{f.resolutionNote}"</p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                {f.isResolved ? (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolution Completed
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5" /> Action Needed
                  </span>
                )}

                {!f.isResolved && !isPatient && (
                  <button
                    onClick={() => {
                      setResolvingItem(f);
                      setResolutionText('');
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Resolve Grievance
                  </button>
                )}
                {!f.isResolved && isPatient && (
                  <span className="text-[10px] text-slate-400 italic">
                    Quality Team Review in Progress
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Log Review */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Star className="w-5 h-5 fill-amber-500" />
                </span>
                Record Patient Review
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFeedback} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anandha Kumar"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Emergency Care">Emergency Care</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Star Rating (1 - 5)</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-amber-600 outline-none cursor-pointer"
                  >
                    <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                    <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Neutral / Average)</option>
                    <option value={2}>★★☆☆☆ (2 Stars - Needs Improvement)</option>
                    <option value={1}>★☆☆☆☆ (1 Star - Poor Service)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attending Doctor / Staff</label>
                <select
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                >
                  <option value="Dr. Arunachalam Kumar">Dr. Arunachalam Kumar</option>
                  <option value="Dr. Sindhu Rajagopalan">Dr. Sindhu Rajagopalan</option>
                  <option value="Dr. P. Sundaram">Dr. P. Sundaram</option>
                  <option value="Dr. Joseph">Dr. Joseph</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Feedback Comments *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe patient experience, compliments, or specific bottlenecks..."
                  value={newComments}
                  onChange={(e) => setNewComments(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-md shadow-amber-500/25 transition"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Resolve Grievance */}
      {resolvingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                Resolve Patient Grievance (CAPA)
              </h3>
              <button onClick={() => setResolvingItem(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900">{resolvingItem.patientName}</span>
                <p className="text-slate-600 italic">"{resolvingItem.comments}"</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Administrative Corrective Action Notes *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Contacted patient via phone, opened express counter 3 at pharmacy, apologized for delay..."
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setResolvingItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveResolution}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/25 transition text-xs"
              >
                Mark Resolved &amp; Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
