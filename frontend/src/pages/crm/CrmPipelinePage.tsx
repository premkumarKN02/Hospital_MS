import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Tag,
  ArrowRight,
  ArrowLeft,
  Filter,
  Search,
  MessageSquare,
  Trash2,
  CalendarCheck,
  X,
  Clock,
  Printer
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: 'Website' | 'Helpline' | 'Walk-in' | 'Doctor Referral' | 'Camp';
  treatmentInterest: string;
  stage: 'NEW' | 'FOLLOWUP' | 'SCHEDULED' | 'CONVERTED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assignedTo: string;
  createdAt: string;
  followUpNote?: string;
}

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Vijayakumar Sundaram',
    phone: '+91 94441 23456',
    email: 'vijay.s@gmail.com',
    source: 'Website',
    treatmentInterest: 'Cardiology Executive Checkup & CT Angio',
    stage: 'NEW',
    priority: 'HIGH',
    assignedTo: 'CRM Executive Priya',
    createdAt: '2026-10-06',
    followUpNote: 'Requested callback after 4 PM regarding cardiac checkup package'
  },
  {
    id: 'lead-2',
    name: 'Saranya Krishnan',
    phone: '+91 98840 98765',
    email: 'saranya.k@yahoo.com',
    source: 'Helpline',
    treatmentInterest: 'Robotic Knee Replacement Consultation',
    stage: 'FOLLOWUP',
    priority: 'HIGH',
    assignedTo: 'CRM Executive Suresh',
    createdAt: '2026-10-05',
    followUpNote: 'Shared cashless insurance empanelment details and room tariff'
  },
  {
    id: 'lead-3',
    name: 'Mohammed Rizwan',
    phone: '+91 97910 11223',
    email: 'rizwan.m@gmail.com',
    source: 'Doctor Referral',
    treatmentInterest: 'Comprehensive Diabetic Foot & Neuropathy Care',
    stage: 'SCHEDULED',
    priority: 'MEDIUM',
    assignedTo: 'CRM Lead Anand',
    createdAt: '2026-10-04',
    followUpNote: 'Scheduled consult with Dr. Sindhu for tomorrow morning'
  },
  {
    id: 'lead-4',
    name: 'Karpagam Thirumalai',
    phone: '+91 93610 55443',
    email: 'karpagam.t@outlook.com',
    source: 'Walk-in',
    treatmentInterest: 'Maternity & Antenatal Care Package Registration',
    stage: 'CONVERTED',
    priority: 'MEDIUM',
    assignedTo: 'CRM Executive Priya',
    createdAt: '2026-10-03',
    followUpNote: 'Enrolled in 9-Month Premium Maternity Plan, advance deposited'
  }
];

export const CrmPipelinePage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('hospital_crm_leads_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_LEADS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);

  // Form State
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'Helpline' as Lead['source'],
    treatmentInterest: 'Cardiology Checkup',
    priority: 'HIGH' as Lead['priority'],
    assignedTo: 'CRM Executive Priya',
    followUpNote: ''
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hospital_crm_leads_v1', JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }, [leads]);

  const stages: { key: Lead['stage']; title: string; color: string; bgBadge: string }[] = [
    { key: 'NEW', title: 'New Inquiries', color: 'border-blue-200 bg-blue-50/30', bgBadge: 'bg-blue-100 text-blue-800' },
    { key: 'FOLLOWUP', title: 'In Counseling / Follow-up', color: 'border-amber-200 bg-amber-50/30', bgBadge: 'bg-amber-100 text-amber-800' },
    { key: 'SCHEDULED', title: 'Scheduled Consults', color: 'border-purple-200 bg-purple-50/30', bgBadge: 'bg-purple-100 text-purple-800' },
    { key: 'CONVERTED', title: 'Converted Inpatients / OPD', color: 'border-emerald-200 bg-emerald-50/30', bgBadge: 'bg-emerald-100 text-emerald-800' }
  ];

  const handleMoveStage = (leadId: string, targetStage: Lead['stage']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: targetStage } : l))
    );
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name.trim() || !newLead.phone.trim()) return;

    const created: Lead = {
      id: `lead-${Date.now()}`,
      name: newLead.name,
      phone: newLead.phone,
      email: newLead.email,
      source: newLead.source,
      treatmentInterest: newLead.treatmentInterest,
      stage: 'NEW',
      priority: newLead.priority,
      assignedTo: newLead.assignedTo,
      createdAt: new Date().toISOString().split('T')[0],
      followUpNote: newLead.followUpNote
    };

    setLeads([created, ...leads]);
    setIsNewLeadModalOpen(false);
    setNewLead({
      name: '',
      phone: '',
      email: '',
      source: 'Helpline',
      treatmentInterest: 'Cardiology Checkup',
      priority: 'HIGH',
      assignedTo: 'CRM Executive Priya',
      followUpNote: ''
    });
  };

  const handleConfirmConversion = () => {
    if (!convertingLead) return;
    setLeads((prev) =>
      prev.map((l) =>
        l.id === convertingLead.id
          ? { ...l, stage: 'CONVERTED', followUpNote: (l.followUpNote ? l.followUpNote + ' | ' : '') + 'Converted to confirmed appointment' }
          : l
      )
    );
    setConvertingLead(null);
  };

  const totalLeadsCount = leads.length;
  const convertedCount = leads.filter((l) => l.stage === 'CONVERTED').length;
  const conversionRate = totalLeadsCount > 0 ? Math.round((convertedCount / totalLeadsCount) * 100) : 0;

  const filteredLeads = leads.filter((l) => {
    const matchSource = sourceFilter === 'ALL' || l.source === sourceFilter;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !searchQuery ||
      l.name.toLowerCase().includes(q) ||
      l.phone.toLowerCase().includes(q) ||
      l.treatmentInterest.toLowerCase().includes(q) ||
      l.assignedTo.toLowerCase().includes(q);
    return matchSource && matchQuery;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 font-jakarta">
            <span className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
              <Users className="w-6 h-6" />
            </span>
            Patient CRM &amp; Inquiry Pipeline Desk
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            End-to-end inquiry intake, care counseling follow-ups, lead stages and clinical conversions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewLeadModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add New Lead
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold border border-slate-200 flex items-center gap-1.5"
            title="Print Leads Pipeline"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Inquiries</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalLeadsCount}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-sm">
          <span className="text-xs text-amber-600 font-bold uppercase">In Follow-Up</span>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {leads.filter((l) => l.stage === 'FOLLOWUP').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-purple-200/80 shadow-sm">
          <span className="text-xs text-purple-600 font-bold uppercase">Scheduled Visits</span>
          <p className="text-2xl font-black text-purple-700 mt-1">
            {leads.filter((l) => l.stage === 'SCHEDULED').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-sm">
          <span className="text-xs text-emerald-600 font-bold uppercase">Conversion Rate</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{conversionRate}%</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries by patient, phone, interest..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Sources</option>
            <option value="Website">Website Form</option>
            <option value="Helpline">Helpline Call</option>
            <option value="Walk-in">Walk-in Inquiry</option>
            <option value="Doctor Referral">Doctor Referral</option>
            <option value="Camp">Outreach Medical Camp</option>
          </select>
        </div>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {stages.map((stg) => {
          const stageLeads = filteredLeads.filter((l) => l.stage === stg.key);

          return (
            <div
              key={stg.key}
              className={`rounded-3xl border p-4 space-y-3 bg-white shadow-sm ${stg.color}`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  {stg.title}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${stg.bgBadge}`}>
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[300px]">
                {stageLeads.length === 0 ? (
                  <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-200/80 rounded-2xl text-[11px] text-slate-400 font-medium">
                    No leads in this stage
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft-sm hover:shadow-md transition-all space-y-2.5 relative group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                              lead.priority === 'HIGH'
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {lead.priority} PRIORITY
                          </span>
                          <h4 className="font-bold text-slate-900 text-xs mt-1.5">{lead.name}</h4>
                        </div>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 rounded transition"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {lead.phone}
                        </div>
                        <div className="flex items-center gap-1.5 text-blue-700 font-semibold bg-blue-50/60 p-1.5 rounded-lg border border-blue-100">
                          <Tag className="w-3 h-3 text-blue-500 flex-shrink-0" />
                          <span className="line-clamp-1">{lead.treatmentInterest}</span>
                        </div>
                        {lead.followUpNote && (
                          <div className="text-[10px] text-slate-600 italic bg-slate-50 p-1.5 rounded-lg">
                            "{lead.followUpNote}"
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>Lead: {lead.source}</span>
                        <span>{lead.assignedTo.split(' ')[2] || lead.assignedTo}</span>
                      </div>

                      {/* Stage Progression Buttons */}
                      <div className="pt-2 flex items-center justify-between gap-1 border-t border-slate-100">
                        {stg.key !== 'NEW' && (
                          <button
                            onClick={() => {
                              const order: Lead['stage'][] = ['NEW', 'FOLLOWUP', 'SCHEDULED', 'CONVERTED'];
                              const idx = order.indexOf(stg.key);
                              if (idx > 0) handleMoveStage(lead.id, order[idx - 1]);
                            }}
                            className="px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-0.5"
                            title="Move Backward"
                          >
                            <ArrowLeft className="w-3 h-3" /> Back
                          </button>
                        )}
                        {stg.key !== 'CONVERTED' ? (
                          <button
                            onClick={() => {
                              const order: Lead['stage'][] = ['NEW', 'FOLLOWUP', 'SCHEDULED', 'CONVERTED'];
                              const idx = order.indexOf(stg.key);
                              if (idx < order.length - 1) handleMoveStage(lead.id, order[idx + 1]);
                            }}
                            className="ml-auto px-2.5 py-1 text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg flex items-center gap-1 transition"
                          >
                            Advance <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 ml-auto flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Converted
                          </span>
                        )}

                        {stg.key === 'SCHEDULED' && (
                          <button
                            onClick={() => setConvertingLead(lead)}
                            className="px-2 py-1 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 shadow-sm"
                            title="Book Confirmed Consultation"
                          >
                            <CalendarCheck className="w-3 h-3" /> Convert
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add New Lead */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Users className="w-5 h-5" />
                </span>
                Capture Patient Inquiry Lead
              </h3>
              <button
                onClick={() => setIsNewLeadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anandha Kumar"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98400 12345"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inquiry Source</label>
                  <select
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                  >
                    <option value="Helpline">Helpline Call</option>
                    <option value="Website">Website Portal</option>
                    <option value="Walk-in">Walk-in Reception</option>
                    <option value="Doctor Referral">Doctor Referral</option>
                    <option value="Camp">Outreach Medical Camp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Treatment / Specialty Interest</label>
                <input
                  type="text"
                  placeholder="e.g. Cardiology Angioplasty / Knee Replacement / Health Checkup"
                  value={newLead.treatmentInterest}
                  onChange={(e) => setNewLead({ ...newLead, treatmentInterest: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newLead.priority}
                    onChange={(e) => setNewLead({ ...newLead, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                  >
                    <option value="HIGH">High (Urgent callback)</option>
                    <option value="MEDIUM">Medium (General)</option>
                    <option value="LOW">Low (Long term)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Counselor Assigned</label>
                  <select
                    value={newLead.assignedTo}
                    onChange={(e) => setNewLead({ ...newLead, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
                  >
                    <option value="CRM Executive Priya">CRM Executive Priya</option>
                    <option value="CRM Executive Suresh">CRM Executive Suresh</option>
                    <option value="CRM Lead Anand">CRM Lead Anand</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Counselor Follow-up Notes</label>
                <textarea
                  rows={2}
                  placeholder="Patient requirements, preferred time for callback, insurance query..."
                  value={newLead.followUpNote}
                  onChange={(e) => setNewLead({ ...newLead, followUpNote: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewLeadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/25 transition"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Convert Lead to Patient Appointment */}
      {convertingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 font-jakarta">
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CalendarCheck className="w-5 h-5" />
                </span>
                Convert Inquiry to Appointment
              </h3>
              <button
                onClick={() => setConvertingLead(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 text-sm">{convertingLead.name}</span>
                <p className="text-slate-500 font-medium">{convertingLead.phone} · {convertingLead.treatmentInterest}</p>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Confirming conversion will mark this lead as <strong className="text-emerald-700">Converted</strong> and enroll the patient into the hospital master directory for outpatient consultation.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConvertingLead(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmConversion}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/25 transition text-xs"
              >
                Confirm Conversion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
