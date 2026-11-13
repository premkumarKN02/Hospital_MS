import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Filter,
  Truck,
  Building2,
  FileText,
  DollarSign,
  X,
  Layers
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { formatCurrency } from '../../utils/currencyService';
import { enterpriseStore } from '../../services/enterpriseDataStore';

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  category: 'Pharmaceuticals' | 'Surgical Consumables' | 'Biomedical Spares' | 'Lab Reagents' | 'General Hospital Supplies';
  itemsSummary: string;
  totalValue: number;
  orderDate: string;
  expectedDelivery: string;
  approvalStatus: 'APPROVED_ISSUED' | 'PENDING_COO_APPROVAL' | 'GRN_RECEIVED_MATCHED' | 'CANCELLED';
  threeWayMatch: {
    poApproved: boolean;
    grnVerified: boolean;
    invoiceAudited: boolean;
  };
  paymentTerms: string;
}

export const ProcurementPoPage: React.FC = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isNewPoModalOpen, setIsNewPoModalOpen] = useState(false);

  const [orders, setOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('hospital_purchase_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
    {
      id: 'PO-01',
      poNumber: 'PO-2026-4401',
      vendorName: 'Baxter Healthcare India Pvt Ltd',
      category: 'Pharmaceuticals',
      itemsSummary: 'IV Normal Saline 0.9% 500ml (1,200 Units), Ringer Lactate (800 Units)',
      totalValue: 54000,
      orderDate: '2026-10-01',
      expectedDelivery: '2026-10-04',
      approvalStatus: 'GRN_RECEIVED_MATCHED',
      threeWayMatch: { poApproved: true, grnVerified: true, invoiceAudited: true },
      paymentTerms: 'Net 30 Days Credit'
    },
    {
      id: 'PO-02',
      poNumber: 'PO-2026-4402',
      vendorName: 'Johnson & Johnson Medical India',
      category: 'Surgical Consumables',
      itemsSummary: 'Prolene 3-0 Sutures, Ethicon Laparoscopic Endoloops, Hem-o-lok Clips',
      totalValue: 128500,
      orderDate: '2026-10-04',
      expectedDelivery: '2026-10-10',
      approvalStatus: 'APPROVED_ISSUED',
      threeWayMatch: { poApproved: true, grnVerified: false, invoiceAudited: false },
      paymentTerms: 'Net 45 Days Credit'
    },
    {
      id: 'PO-03',
      poNumber: 'PO-2026-4403',
      vendorName: 'Roche Diagnostics India',
      category: 'Lab Reagents',
      itemsSummary: 'Cobas hs-Troponin I Reagent Kits, Elecsys Diluent Packs',
      totalValue: 92000,
      orderDate: '2026-10-06',
      expectedDelivery: '2026-10-12',
      approvalStatus: 'PENDING_COO_APPROVAL',
      threeWayMatch: { poApproved: false, grnVerified: false, invoiceAudited: false },
      paymentTerms: 'Net 15 Days Credit'
    }
  ];
  });

  const [newPo, setNewPo] = useState({
    poNumber: `PO-2026-${Math.floor(4410 + Math.random() * 100)}`,
    vendorName: '',
    category: 'Pharmaceuticals' as const,
    itemsSummary: '',
    totalValue: 50000,
    paymentTerms: 'Net 30 Days Credit'
  });

  // Persist purchase orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hospital_purchase_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    const created: PurchaseOrder = {
      id: `PO-0${orders.length + 4}`,
      poNumber: newPo.poNumber,
      vendorName: newPo.vendorName,
      category: newPo.category,
      itemsSummary: newPo.itemsSummary,
      totalValue: Number(newPo.totalValue),
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
      approvalStatus: 'APPROVED_ISSUED',
      threeWayMatch: { poApproved: true, grnVerified: false, invoiceAudited: false },
      paymentTerms: newPo.paymentTerms
    };

    enterpriseStore.createPurchaseOrder({
      poNumber: created.poNumber,
      vendorName: created.vendorName,
      department: created.category,
      orderDate: created.orderDate,
      itemsCount: 1,
      totalAmount: created.totalValue,
      paymentTerms: created.paymentTerms,
      approvalStatus: 'DRAFT',
      threeWayMatched: false,
      branchId: 'branch-chennai-greams'
    });

    setOrders([created, ...orders]);
    setIsNewPoModalOpen(false);
  };

  const handleApprovePo = (id: string) => {
    enterpriseStore.approvePo(id);
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        return {
          ...o,
          approvalStatus: 'APPROVED_ISSUED',
          threeWayMatch: { ...o.threeWayMatch, poApproved: true }
        };
      }
      return o;
    }));
  };

  const handleReceiveGrn = (id: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        return {
          ...o,
          approvalStatus: 'GRN_RECEIVED_MATCHED',
          threeWayMatch: { poApproved: true, grnVerified: true, invoiceAudited: true }
        };
      }
      return o;
    }));
  };

  const filtered = orders.filter(o => {
    const matchCat = selectedCategory === 'ALL' || o.category === selectedCategory;
    const matchSearch = o.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPoValue = orders.reduce((acc, o) => acc + o.totalValue, 0);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="card-stylish p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <ShoppingCart className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Procurement, Purchase Orders (PO) &amp; Vendor Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              Multi-tier PO approvals, 3-way matching (PO vs GRN vs Invoice), vendor credit cycles, and supply chain governance
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNewPoModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Raise Purchase Order
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Procurement Volume</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(totalPoValue)}</p>
          <p className="text-[11px] text-slate-500 mt-1">{orders.length} Active PO commitments</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-emerald-500 uppercase">3-Way Matched (Verified)</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {orders.filter(o => o.approvalStatus === 'GRN_RECEIVED_MATCHED').length} Orders
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Ready for finance disbursement</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-amber-500 uppercase">Pending Leadership Sign-off</span>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {orders.filter(o => o.approvalStatus === 'PENDING_COO_APPROVAL').length} Orders
          </p>
          <p className="text-[11px] text-amber-500 mt-1">&gt;₹50,000 threshold check</p>
        </div>
        <div className="stat-card-stylish">
          <span className="text-xs font-semibold text-indigo-500 uppercase">Active Vendor Partners</span>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">48 Empanelled</p>
          <p className="text-[11px] text-slate-500 mt-1">Pharma, implants &amp; reagents</p>
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
            placeholder="Search vendor, PO #, item descriptions..."
            className="input-stylish !pl-10 pr-3"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select-stylish text-xs"
          >
            <option value="ALL">All Procurement Categories</option>
            <option value="Pharmaceuticals">Pharmaceuticals</option>
            <option value="Surgical Consumables">Surgical Consumables</option>
            <option value="Biomedical Spares">Biomedical Spares</option>
            <option value="Lab Reagents">Lab Reagents</option>
            <option value="General Hospital Supplies">General Supplies</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="table-container-stylish">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 py-3">PO Number & Date</th>
                <th className="px-4 py-3">Vendor / Supplier</th>
                <th className="px-4 py-3">Category & Line Items</th>
                <th className="px-4 py-3">Order Value & Terms</th>
                <th className="px-4 py-3">3-Way Audit Match</th>
                <th className="px-4 py-3">PO Status</th>
                <th className="px-4 py-3 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 dark:text-white font-mono text-xs">{o.poNumber}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{o.orderDate}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-white text-xs">{o.vendorName}</div>
                    <div className="text-[11px] text-emerald-600 font-medium">GSP Certified Supplier</div>
                  </td>

                  <td className="px-4 py-3 max-w-xs">
                    <span className="badge-slate text-[10px]">{o.category}</span>
                    <div className="text-xs text-slate-700 dark:text-slate-300 line-clamp-1 mt-1">
                      {o.itemsSummary}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">{formatCurrency(o.totalValue)}</div>
                    <div className="text-[11px] text-slate-400">{o.paymentTerms}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className={`px-1.5 py-0.5 rounded font-mono ${o.threeWayMatch.poApproved ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60' : 'bg-slate-100 text-slate-400'}`}>
                        PO ✓
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-mono ${o.threeWayMatch.grnVerified ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60' : 'bg-slate-100 text-slate-400'}`}>
                        GRN {o.threeWayMatch.grnVerified ? '✓' : '...'}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-mono ${o.threeWayMatch.invoiceAudited ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60' : 'bg-slate-100 text-slate-400'}`}>
                        INV {o.threeWayMatch.invoiceAudited ? '✓' : '...'}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {o.approvalStatus === 'GRN_RECEIVED_MATCHED' ? (
                      <span className="badge-emerald">Matched &amp; Closed</span>
                    ) : o.approvalStatus === 'APPROVED_ISSUED' ? (
                      <span className="badge-blue">Issued to Vendor</span>
                    ) : (
                      <span className="badge-amber">Leadership Sign-off</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {o.approvalStatus === 'PENDING_COO_APPROVAL' && (
                        <button
                          onClick={() => handleApprovePo(o.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors"
                        >
                          Approve PO
                        </button>
                      )}
                      {o.approvalStatus === 'APPROVED_ISSUED' && (
                        <button
                          onClick={() => handleReceiveGrn(o.id)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold transition-colors"
                        >
                          Receive GRN
                        </button>
                      )}
                      <button
                        onClick={() => window.print()}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 text-white rounded text-xs font-semibold"
                      >
                        Print PO
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New PO Modal */}
      {isNewPoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="card-stylish w-full max-w-md bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-600" />
                Generate Enterprise Purchase Order (PO)
              </h3>
              <button onClick={() => setIsNewPoModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePo} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">PO Number</label>
                  <input
                    type="text"
                    required
                    value={newPo.poNumber}
                    onChange={(e) => setNewPo({ ...newPo, poNumber: e.target.value })}
                    className="input-stylish text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newPo.category}
                    onChange={(e) => setNewPo({ ...newPo, category: e.target.value as any })}
                    className="input-stylish text-xs"
                  >
                    <option value="Pharmaceuticals">Pharmaceuticals</option>
                    <option value="Surgical Consumables">Surgical Consumables</option>
                    <option value="Biomedical Spares">Biomedical Spares</option>
                    <option value="Lab Reagents">Lab Reagents</option>
                    <option value="General Hospital Supplies">General Supplies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Vendor / Supplier Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cipla Ltd / Baxter Healthcare"
                  value={newPo.vendorName}
                  onChange={(e) => setNewPo({ ...newPo, vendorName: e.target.value })}
                  className="input-stylish text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Items Description &amp; Quantity</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Inj. Meropenem 1g (500 Vials), Tab. Ecosprin 75mg (2,000 Strips)"
                  value={newPo.itemsSummary}
                  onChange={(e) => setNewPo({ ...newPo, itemsSummary: e.target.value })}
                  className="input-stylish text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Total PO Value (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPo.totalValue}
                    onChange={(e) => setNewPo({ ...newPo, totalValue: Number(e.target.value) })}
                    className="input-stylish text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Payment Credit Terms</label>
                  <input
                    type="text"
                    value={newPo.paymentTerms}
                    onChange={(e) => setNewPo({ ...newPo, paymentTerms: e.target.value })}
                    className="input-stylish text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewPoModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Authorize &amp; Issue PO
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
        title="Procurement & Purchase Order Summary"
        text={`Sindhu Hospital Procurement: ${orders.length} active purchase orders, total commitment ${formatCurrency(totalPoValue)}.`}
        url={window.location.href}
      />
    </div>
  );
};
