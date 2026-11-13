import React, { useState, useEffect } from 'react';
import {
  Pill,
  Search,
  Plus,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  Package,
  Layers,
  Filter,
  Printer,
  Share2,
  Truck,
  TrendingUp,
  ThermometerSnowflake,
  ShieldCheck,
  Building2,
  Clock,
  ChevronDown,
  X,
  FileText,
  AlertOctagon,
  Plane,
  Globe2,
  Boxes,
  BarChart3,
  Warehouse,
  Gauge,
  SlidersHorizontal,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { pharmacyApi } from '../../lib/api';
import { formatCurrency } from '../../utils/currencyService';
import { enterpriseStore, InterBranchTransfer } from '../../services/enterpriseDataStore';

export interface MedicineItem {
  id: string;
  itemCode: string;
  medicineName: string;
  genericName: string;
  category: 'Cardiac' | 'Antibiotic' | 'Analgesic' | 'IV Fluids' | 'Antidiabetic' | 'Emergency / Critical' | 'Anesthesia';
  batchNo: string;
  expiryDate: string;
  stockQty: number;
  reorderLevel: number;
  unitPrice: number;
  mrp: number;
  manufacturer: string;
  storageCondition: 'Cold Chain (2°C - 8°C)' | 'Room Temp (15°C - 25°C)' | 'Controlled Vault (Double Lock)' | 'Deep Freeze (-20°C)' | 'Protect from Light';
  temperature: string;
  dailySalesRate: number; // units sold per day
  daysOfStockLeft: number;
  allocatedDepartments: string[]; // ICU, OT, ER, General Ward, OPD
  shipmentStatus: 'Arrived & Stored' | 'In-Transit' | 'Under Quality Inspection' | 'Awaiting Delivery' | 'Quarantined / Recalled';
  lastDeliveredQty: number;
  lastDeliveryDate: string;
  isQuarantined?: boolean;
}

export interface InwardShipment {
  id: string;
  poNumber: string;
  supplier: string;
  medicineName: string;
  batchNumber: string;
  orderedQty: number;
  receivedQty: number;
  arrivedDate: string;
  status: 'DELIVERED_VERIFIED' | 'IN_TRANSIT' | 'QC_PENDING' | 'REJECTED';
  invoiceAmount: number;
  storageBay: string;
}

export const PharmacyInventoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STOCK_LEDGER' | 'INWARD_SHIPMENTS' | 'SALES_VELOCITY' | 'DEPT_REQUIREMENTS' | 'INTER_BRANCH_TRANSFERS'>('STOCK_LEDGER');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStorage, setSelectedStorage] = useState<string>('ALL');
  const [selectedZone, setSelectedZone] = useState<'ALL' | 'ZONE_A' | 'ZONE_B' | 'ZONE_C' | 'ZONE_D'>('ALL');
  const [chartInterval, setChartInterval] = useState<'7D' | '30D' | 'QUARTER'>('7D');

  // Modals
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockAction, setStockAction] = useState<'IN' | 'OUT'>('IN');
  const [selectedStockId, setSelectedStockId] = useState<string>('1');
  const [actionQuantity, setActionQuantity] = useState<number>(100);
  const [actionDept, setActionDept] = useState<string>('ICU');

  // Add Medicine Modal
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [newMed, setNewMed] = useState({
    medicineName: '',
    genericName: '',
    category: 'Antibiotic' as const,
    batchNo: '',
    expiryDate: '',
    stockQty: 200,
    reorderLevel: 50,
    unitPrice: 45,
    mrp: 65,
    manufacturer: '',
    storageCondition: 'Room Temp (15°C - 25°C)' as const,
    allocatedDepartments: ['OPD', 'General Ward']
  });

  // Inward Shipments Modal
  const [isReceiveShipmentOpen, setIsReceiveShipmentOpen] = useState(false);
  const [newShipment, setNewShipment] = useState({
    poNumber: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
    supplier: 'Apollo Pharma Distributors',
    medicineName: '',
    batchNumber: `BT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    orderedQty: 500,
    receivedQty: 500,
    arrivedDate: new Date().toISOString().split('T')[0],
    storageBay: 'Bay B-14 (Cold Storage)'
  });

  // Emergency Batch Quarantine State
  const [isQuarantineModalOpen, setIsQuarantineModalOpen] = useState(false);
  const [quarantineBatchNo, setQuarantineBatchNo] = useState('');
  const [quarantineReason, setQuarantineReason] = useState('Suspected cold-chain thermal excursion during inter-campus air transit');
  const [quarantineSuccessMsg, setQuarantineSuccessMsg] = useState('');

  // Inter-Branch Stock Transfer (IBST) State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transfers, setTransfers] = useState<InterBranchTransfer[]>(() => enterpriseStore.getTransfers());
  const [newTransfer, setNewTransfer] = useState({
    sourceBranch: 'Apollo Greams Main Campus (Chennai)',
    targetBranch: 'Dubai Healthcare City Hub (UAE)',
    itemCode: 'MED-1002',
    medicineName: 'Inj. Human Actrapid 100IU/ml',
    batchNumber: 'BT-2024-91',
    quantity: 50,
    transitTemp: '4.0°C (Cold-Chain Shipper with USB Datalogger)',
    carrierTracking: 'EK-CARGO-98124',
    authorizedBy: 'Dr. K. Srinivasan (Group VP Pharmacy)'
  });

  const [stocks, setStocks] = useState<MedicineItem[]>([
    {
      id: '1',
      itemCode: 'MED-1001',
      medicineName: 'Tab. Sorbitrate 5mg',
      genericName: 'Isosorbide Dinitrate',
      category: 'Cardiac',
      batchNo: 'BT-2024-88',
      expiryDate: '2027-05-31',
      stockQty: 840,
      reorderLevel: 200,
      unitPrice: 32.5,
      mrp: 45.0,
      manufacturer: 'Abbott Healthcare',
      storageCondition: 'Room Temp (15°C - 25°C)',
      temperature: '22.4°C',
      dailySalesRate: 42,
      daysOfStockLeft: 20,
      allocatedDepartments: ['ER', 'ICU', 'Cardiology OPD'],
      shipmentStatus: 'Arrived & Stored',
      lastDeliveredQty: 500,
      lastDeliveryDate: '2026-10-01'
    },
    {
      id: '2',
      itemCode: 'MED-1002',
      medicineName: 'Inj. Human Actrapid 100IU/ml',
      genericName: 'Regular Soluble Insulin',
      category: 'Antidiabetic',
      batchNo: 'BT-2024-91',
      expiryDate: '2027-02-15',
      stockQty: 75,
      reorderLevel: 150,
      unitPrice: 195.0,
      mrp: 240.0,
      manufacturer: 'Novo Nordisk',
      storageCondition: 'Cold Chain (2°C - 8°C)',
      temperature: '4.2°C',
      dailySalesRate: 15,
      daysOfStockLeft: 5,
      allocatedDepartments: ['ICU', 'Endocrinology OPD', 'Wards'],
      shipmentStatus: 'Under Quality Inspection',
      lastDeliveredQty: 100,
      lastDeliveryDate: '2026-10-07'
    },
    {
      id: '3',
      itemCode: 'MED-1003',
      medicineName: 'Inj. Meropenem 1g',
      genericName: 'Meropenem Trihydrate',
      category: 'Antibiotic',
      batchNo: 'BT-2024-104',
      expiryDate: '2027-01-31',
      stockQty: 320,
      reorderLevel: 100,
      unitPrice: 480.0,
      mrp: 650.0,
      manufacturer: 'Cipla Critical Care',
      storageCondition: 'Protect from Light',
      temperature: '21.0°C',
      dailySalesRate: 28,
      daysOfStockLeft: 11,
      allocatedDepartments: ['ICU', 'OT Suite', 'Emergency'],
      shipmentStatus: 'Arrived & Stored',
      lastDeliveredQty: 400,
      lastDeliveryDate: '2026-09-28'
    },
    {
      id: '4',
      itemCode: 'MED-1004',
      medicineName: 'Inj. Fentanyl 50mcg/ml',
      genericName: 'Fentanyl Citrate',
      category: 'Anesthesia',
      batchNo: 'BT-VAULT-12',
      expiryDate: '2026-12-31',
      stockQty: 45,
      reorderLevel: 50,
      unitPrice: 85.0,
      mrp: 120.0,
      manufacturer: 'Neon Laboratories',
      storageCondition: 'Controlled Vault (Double Lock)',
      temperature: '20.0°C',
      dailySalesRate: 6,
      daysOfStockLeft: 7,
      allocatedDepartments: ['OT Suite', 'ICU'],
      shipmentStatus: 'Arrived & Stored',
      lastDeliveredQty: 60,
      lastDeliveryDate: '2026-09-15'
    },
    {
      id: '5',
      itemCode: 'MED-1005',
      medicineName: 'IV Normal Saline 0.9% 500ml',
      genericName: 'Sodium Chloride 0.9% w/v',
      category: 'IV Fluids',
      batchNo: 'BT-2024-502',
      expiryDate: '2028-06-30',
      stockQty: 1850,
      reorderLevel: 400,
      unitPrice: 18.0,
      mrp: 28.0,
      manufacturer: 'Baxter India',
      storageCondition: 'Room Temp (15°C - 25°C)',
      temperature: '23.1°C',
      dailySalesRate: 140,
      daysOfStockLeft: 13,
      allocatedDepartments: ['ER', 'OT Suite', 'ICU', 'General Ward', 'Dialysis'],
      shipmentStatus: 'Arrived & Stored',
      lastDeliveredQty: 1200,
      lastDeliveryDate: '2026-10-04'
    },
    {
      id: '6',
      itemCode: 'MED-1006',
      medicineName: 'Inj. Noradrenaline 2mg/2ml',
      genericName: 'Norepinephrine Bitartrate',
      category: 'Emergency / Critical',
      batchNo: 'BT-2024-610',
      expiryDate: '2026-11-20', // Near expiry
      stockQty: 60,
      reorderLevel: 80,
      unitPrice: 65.0,
      mrp: 95.0,
      manufacturer: 'Samarth Life Sciences',
      storageCondition: 'Protect from Light',
      temperature: '21.5°C',
      dailySalesRate: 12,
      daysOfStockLeft: 5,
      allocatedDepartments: ['ER', 'ICU', 'Cardiac Cath Lab'],
      shipmentStatus: 'In-Transit',
      lastDeliveredQty: 100,
      lastDeliveryDate: '2026-08-10'
    }
  ]);

  const [shipments, setShipments] = useState<InwardShipment[]>([
    {
      id: 'SH-01',
      poNumber: 'PO-9842',
      supplier: 'Baxter India Logistics',
      medicineName: 'IV Normal Saline 0.9% 500ml',
      batchNumber: 'BT-2024-502',
      orderedQty: 1200,
      receivedQty: 1200,
      arrivedDate: '2026-10-04',
      status: 'DELIVERED_VERIFIED',
      invoiceAmount: 21600,
      storageBay: 'Warehouse Central Rack A-4'
    },
    {
      id: 'SH-02',
      poNumber: 'PO-9850',
      supplier: 'Novo Nordisk India Supply',
      medicineName: 'Inj. Human Actrapid 100IU/ml',
      batchNumber: 'BT-2024-91',
      orderedQty: 100,
      receivedQty: 100,
      arrivedDate: '2026-10-07',
      status: 'QC_PENDING',
      invoiceAmount: 19500,
      storageBay: 'Cold Room Chiller 2 (2°C-8°C)'
    },
    {
      id: 'SH-03',
      poNumber: 'PO-9865',
      supplier: 'Samarth Life Sciences Hub',
      medicineName: 'Inj. Noradrenaline 2mg/2ml',
      batchNumber: 'BT-2024-650',
      orderedQty: 200,
      receivedQty: 0,
      arrivedDate: 'Expected Today (ETA 14:00)',
      status: 'IN_TRANSIT',
      invoiceAmount: 13000,
      storageBay: 'Emergency Reserve Bay C-1'
    }
  ]);

  // Persist stocks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hospital_pharmacy_stocks', JSON.stringify(stocks));
    } catch (e) {
      console.error(e);
    }
  }, [stocks]);

  // Persist shipments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hospital_pharmacy_shipments', JSON.stringify(shipments));
    } catch (e) {
      console.error(e);
    }
  }, [shipments]);

  // Sync transfers from enterpriseStore
  useEffect(() => {
    const unsub = enterpriseStore.subscribe(() => {
      setTransfers(enterpriseStore.getTransfers());
    });
    return unsub;
  }, []);

  // Load from backend if available
  useEffect(() => {
    pharmacyApi.getInventory().then((res) => {
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        // preserve rich attributes while keeping backend sync
      }
    }).catch(console.error);
  }, []);

  const filteredStocks = stocks.filter((s) => {
    const matchCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchStorage = selectedStorage === 'ALL' || s.storageCondition.includes(selectedStorage);
    const matchZone =
      selectedZone === 'ALL'
        ? true
        : selectedZone === 'ZONE_A'
        ? s.storageCondition.includes('Cold')
        : selectedZone === 'ZONE_B'
        ? s.storageCondition.includes('Room')
        : selectedZone === 'ZONE_C'
        ? s.storageCondition.includes('Vault') || s.storageCondition.includes('Freeze') || s.storageCondition.includes('Light')
        : s.allocatedDepartments.includes('ER') || s.allocatedDepartments.includes('OT');
    const matchSearch =
      s.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.batchNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.itemCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchStorage && matchZone && matchSearch;
  });

  const lowStockCount = stocks.filter((s) => s.stockQty <= s.reorderLevel).length;
  const coldChainCount = stocks.filter((s) => s.storageCondition.includes('Cold Chain')).length;
  const criticalShortageCount = stocks.filter((s) => s.daysOfStockLeft <= 5).length;
  const totalStockUnits = stocks.reduce((acc, curr) => acc + curr.stockQty, 0);

  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (stockAction === 'OUT') {
      pharmacyApi.dispense(selectedStockId, Number(actionQuantity)).catch(console.error);
    } else {
      pharmacyApi.stockIn(selectedStockId, Number(actionQuantity)).catch(console.error);
    }

    setStocks((prev) =>
      prev.map((s) => {
        if (s.id === selectedStockId) {
          const newQty =
            stockAction === 'IN'
              ? s.stockQty + Number(actionQuantity)
              : Math.max(0, s.stockQty - Number(actionQuantity));
          return {
            ...s,
            stockQty: newQty,
            daysOfStockLeft: Math.max(1, Math.round(newQty / (s.dailySalesRate || 1)))
          };
        }
        return s;
      })
    );
    setIsStockModalOpen(false);
  };

  const handleAddNewMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    const createdItem: MedicineItem = {
      id: String(stocks.length + 1),
      itemCode: `MED-${1000 + stocks.length + 1}`,
      medicineName: newMed.medicineName,
      genericName: newMed.genericName,
      category: newMed.category,
      batchNo: newMed.batchNo || `BT-${new Date().getFullYear()}-01`,
      expiryDate: newMed.expiryDate || '2027-12-31',
      stockQty: Number(newMed.stockQty),
      reorderLevel: Number(newMed.reorderLevel),
      unitPrice: Number(newMed.unitPrice),
      mrp: Number(newMed.mrp),
      manufacturer: newMed.manufacturer || 'General Pharmaceutical Formulary',
      storageCondition: newMed.storageCondition,
      temperature: newMed.storageCondition.includes('Cold') ? '4.0°C' : '22.0°C',
      dailySalesRate: 10,
      daysOfStockLeft: Math.round(Number(newMed.stockQty) / 10),
      allocatedDepartments: newMed.allocatedDepartments,
      shipmentStatus: 'Arrived & Stored',
      lastDeliveredQty: Number(newMed.stockQty),
      lastDeliveryDate: new Date().toISOString().split('T')[0]
    };

    setStocks([createdItem, ...stocks]);
    setIsAddMedicineOpen(false);
  };

  const handleReceiveShipment = (e: React.FormEvent) => {
    e.preventDefault();
    const createdShipment: InwardShipment = {
      id: `SH-0${shipments.length + 1}`,
      poNumber: newShipment.poNumber,
      supplier: newShipment.supplier,
      medicineName: newShipment.medicineName || 'Essential Medicine Formulation',
      batchNumber: newShipment.batchNumber,
      orderedQty: Number(newShipment.orderedQty),
      receivedQty: Number(newShipment.receivedQty),
      arrivedDate: newShipment.arrivedDate,
      status: 'DELIVERED_VERIFIED',
      invoiceAmount: Number(newShipment.receivedQty) * 45,
      storageBay: newShipment.storageBay
    };

    setShipments([createdShipment, ...shipments]);
    setIsReceiveShipmentOpen(false);
  };

  const handleQuarantineBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quarantineBatchNo.trim()) return;

    enterpriseStore.quarantineBatch(quarantineBatchNo.trim(), quarantineReason);

    setStocks((prev) =>
      prev.map((s) => {
        if (s.batchNo.toLowerCase() === quarantineBatchNo.toLowerCase().trim()) {
          return {
            ...s,
            shipmentStatus: 'Quarantined / Recalled',
            isQuarantined: true
          };
        }
        return s;
      })
    );

    setQuarantineSuccessMsg(`Batch #${quarantineBatchNo} has been immediately QUARANTINED across all hospital bays.`);
    setTimeout(() => {
      setIsQuarantineModalOpen(false);
      setQuarantineSuccessMsg('');
      setQuarantineBatchNo('');
    }, 2000);
  };

  const handleDispatchTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    enterpriseStore.createInterBranchTransfer(newTransfer);

    // Deduct stock in current ledger if matching item exists
    setStocks((prev) =>
      prev.map((s) => {
        if (s.itemCode === newTransfer.itemCode || s.batchNo === newTransfer.batchNumber) {
          const newQty = Math.max(0, s.stockQty - Number(newTransfer.quantity));
          return {
            ...s,
            stockQty: newQty,
            daysOfStockLeft: Math.max(1, Math.round(newQty / (s.dailySalesRate || 1)))
          };
        }
        return s;
      })
    );

    setIsTransferModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans overflow-x-hidden w-full">
      {/* ── Level 1: Behance WMS Facility Context & Capacity Bar ── */}
      <div className="card-stylish p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-600 to-cyan-700 flex items-center justify-center text-white shadow-md shadow-teal-500/20 flex-shrink-0">
              <Warehouse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  WMS Hub 01 • Central Logistics Bay
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live IoT Calibrated
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
                Central Medical Logistics & Warehouse Management System
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                Multi-zone storage bay telemetry, automated GRN inflow, cold-chain excursion surveillance, and dispatch velocity
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsReceiveShipmentOpen(true)}
              className="btn-primary text-xs flex items-center gap-1.5 shadow-md"
            >
              <Truck className="w-4 h-4" />
              Inward Stock (GRN)
            </button>
            <button
              onClick={() => setIsAddMedicineOpen(true)}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-500" />
              New Batch SKU
            </button>
            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="px-3.5 py-2.5 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-sky-200 dark:border-sky-800 transition-colors"
            >
              <Plane className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Transfer (IBST)
            </button>
            <button
              onClick={() => setIsQuarantineModalOpen(true)}
              className="px-3.5 py-2.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-rose-200 dark:border-rose-800 transition-colors"
            >
              <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              Recall Batch
            </button>
            <button
              onClick={() => {
                setStockAction('IN');
                setIsStockModalOpen(true);
              }}
              className="px-3.5 py-2.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/20 transition-all"
            >
              <ArrowDownLeft className="w-4 h-4" />
              Stock In
            </button>
            <button
              onClick={() => {
                setStockAction('OUT');
                setIsStockModalOpen(true);
              }}
              className="px-3.5 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
              Dispense
            </button>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
              title="Share Formulary"
              aria-label="Share Formulary"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.print()}
              className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Print Formulary Sheet"
              aria-label="Print Formulary Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Storage Bay Utilization Multi-Segment Gauge */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Warehouse Bay Capacity Utilization: 340 / 400 Active Storage Bays (85.0% Full)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" /> Zone A (Cold Vault): 92%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-teal-500" /> Zone B (Pharma Racks): 78%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Zone C (Bulk Pallets): 85%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Free Space: 15% (60 Bays)
              </span>
            </div>
          </div>
          {/* Segmented Progress Bar */}
          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
            <div style={{ width: '25%' }} className="h-full bg-sky-500" title="Zone A: Cold Vault (92%)" />
            <div style={{ width: '35%' }} className="h-full bg-teal-500" title="Zone B: Pharma Racks (78%)" />
            <div style={{ width: '25%' }} className="h-full bg-indigo-500" title="Zone C: Bulk Pallets (85%)" />
            <div style={{ width: '15%' }} className="h-full bg-slate-300 dark:bg-slate-700" title="Available Capacity: 15%" />
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('STOCK_LEDGER')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'STOCK_LEDGER'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Live Stock & Formulary Ledger ({stocks.length})
          </button>
          <button
            onClick={() => setActiveTab('INWARD_SHIPMENTS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'INWARD_SHIPMENTS'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Inward Stock Deliveries ({shipments.length})
          </button>
          <button
            onClick={() => setActiveTab('SALES_VELOCITY')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'SALES_VELOCITY'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Sales & Dispensing Velocity
          </button>
          <button
            onClick={() => setActiveTab('DEPT_REQUIREMENTS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'DEPT_REQUIREMENTS'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Department Requirements & Wards
          </button>
          <button
            onClick={() => setActiveTab('INTER_BRANCH_TRANSFERS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'INTER_BRANCH_TRANSFERS'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            Inter-Branch Logistics (IBST) ({transfers.length})
          </button>
        </div>
      </div>

      {/* ── Level 2: Behance 4-KPI Metric Cards with SVG Sparklines ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="wms-metric-card bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total On-Hand Inventory</span>
            <span className="wms-badge-active flex items-center gap-1">
              <ArrowUp className="w-3 h-3 text-emerald-500" /> +14.2% Inflow
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
              {totalStockUnits.toLocaleString()}
            </p>
            <span className="text-xs text-slate-500 font-medium">Units</span>
          </div>
          {/* SVG Sparkline */}
          <div className="mt-3 h-8 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 25" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparklineGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0 20 Q 20 10, 40 16 T 70 8 T 100 4 L 100 25 L 0 25 Z" fill="url(#sparklineGrad1)" />
              <path d="M 0 20 Q 20 10, 40 16 T 70 8 T 100 4" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-between">
            <span>{stocks.length} Formulary SKUs</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">4 Global Vaults</span>
          </p>
        </div>

        {/* KPI 2 */}
        <div className="wms-metric-card bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Inward Shipments (GRN)</span>
            <span className="wms-badge-transit flex items-center gap-1">
              <Truck className="w-3 h-3 text-sky-500" /> Active Dock
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
              {shipments.length * 42}
            </p>
            <span className="text-xs text-slate-500 font-medium">Deliveries / Mo</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden flex">
            <div style={{ width: '73%' }} className="bg-emerald-500 h-full" title="Received (73%)" />
            <div style={{ width: '27%' }} className="bg-sky-500 h-full" title="In-Transit (27%)" />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 flex items-center justify-between">
            <span>94 Received &amp; Verified</span>
            <span className="font-semibold text-sky-600 dark:text-sky-400">34 In Transit</span>
          </p>
        </div>

        {/* KPI 3 */}
        <div className="wms-metric-card bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Picking &amp; Dispensing Rate</span>
            <span className="wms-badge-active flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> 99.4% SLA
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
              1,420
            </p>
            <span className="text-xs text-slate-500 font-medium">Units / Day</span>
          </div>
          {/* SVG Sparkline */}
          <div className="mt-3 h-8 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 25" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparklineGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0 18 Q 25 22, 50 12 T 80 15 T 100 6 L 100 25 L 0 25 Z" fill="url(#sparklineGrad2)" />
              <path d="M 0 18 Q 25 22, 50 12 T 80 15 T 100 6" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-between">
            <span>Fast: 65% • Med: 25%</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">0 Stockout Backlogs</span>
          </p>
        </div>

        {/* KPI 4 */}
        <div className="wms-metric-card bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cold-Chain Surveillance</span>
            <span className="wms-badge-alert flex items-center gap-1">
              <ThermometerSnowflake className="w-3 h-3 text-indigo-500" /> 2°C - 8°C
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums tracking-tight">
              4.1°C
            </p>
            <span className="text-xs text-slate-500 font-medium">Vault Mean</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden flex">
            <div style={{ width: '85%' }} className="bg-indigo-500 h-full" title="Optimal Range" />
            <div style={{ width: '15%' }} className="bg-slate-300 dark:bg-slate-700 h-full" />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 flex items-center justify-between">
            <span>{coldChainCount} Refrigerated SKUs</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">0 Excursions</span>
          </p>
        </div>
      </div>

      {/* ── Level 3: Behance Storage Zone Heatmap & Throughput Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Storage Zone Heatmap Selector (7 cols) */}
        <div className="lg:col-span-7 card-stylish p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                Warehouse Storage Zones &amp; Bay Heatmap
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Click any zone below to filter the live inventory ledger by rack bay allocation
              </p>
            </div>
            {selectedZone !== 'ALL' && (
              <button
                onClick={() => setSelectedZone('ALL')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-800 transition-colors"
              >
                Clear Zone Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Zone A */}
            <div
              onClick={() => setSelectedZone(selectedZone === 'ZONE_A' ? 'ALL' : 'ZONE_A')}
              className={`wms-zone-card ${
                selectedZone === 'ZONE_A'
                  ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/50 dark:bg-sky-950/30'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                  <ThermometerSnowflake className="w-3.5 h-3.5" /> Zone A • Cold Vault
                </span>
                <span className="text-[11px] font-bold text-sky-600 bg-sky-100 dark:bg-sky-900/60 px-2 py-0.5 rounded-full">
                  92% Full
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bays A-01 to A-08 • Temp: 4.1°C • Biologics, Vaccines &amp; Insulin
              </p>
              <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div style={{ width: '92%' }} className="bg-sky-500 h-full" />
              </div>
            </div>

            {/* Zone B */}
            <div
              onClick={() => setSelectedZone(selectedZone === 'ZONE_B' ? 'ALL' : 'ZONE_B')}
              className={`wms-zone-card ${
                selectedZone === 'ZONE_B'
                  ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/50 dark:bg-teal-950/30'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> Zone B • High-Density Racks
                </span>
                <span className="text-[11px] font-bold text-teal-600 bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 rounded-full">
                  78% Full
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bays B-01 to B-12 • Room Temp 22.0°C • Antibiotics &amp; Oral Solids
              </p>
              <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div style={{ width: '78%' }} className="bg-teal-500 h-full" />
              </div>
            </div>

            {/* Zone C */}
            <div
              onClick={() => setSelectedZone(selectedZone === 'ZONE_C' ? 'ALL' : 'ZONE_C')}
              className={`wms-zone-card ${
                selectedZone === 'ZONE_C'
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/30'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                  <Boxes className="w-3.5 h-3.5" /> Zone C • Bulk Consumables
                </span>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-full">
                  85% Full
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bays C-01 to C-10 • Standard Storage • IV Fluids, Syringes &amp; Pallets
              </p>
              <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div style={{ width: '85%' }} className="bg-indigo-500 h-full" />
              </div>
            </div>

            {/* Zone D */}
            <div
              onClick={() => setSelectedZone(selectedZone === 'ZONE_D' ? 'ALL' : 'ZONE_D')}
              className={`wms-zone-card ${
                selectedZone === 'ZONE_D'
                  ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/50 dark:bg-amber-950/30'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> Zone D • Fast-Pick Cross-Dock
                </span>
                <span className="text-[11px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                  64% Full
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bays D-01 to D-06 • Rapid Dispatch • Emergency Crash Trays &amp; OT Packs
              </p>
              <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div style={{ width: '64%' }} className="bg-amber-500 h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Inbound vs Outbound Velocity Chart (5 cols) */}
        <div className="lg:col-span-5 card-stylish p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                Throughput Flow Velocity
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Inbound receipts vs. Outbound unit fulfillment
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
              {(['7D', '30D', 'QUARTER'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setChartInterval(t)}
                  className={`px-2 py-1 rounded-md transition-all ${
                    chartInterval === t
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Dual-Bar Chart */}
          <div className="h-40 w-full flex items-end justify-between gap-2 pt-2 px-2">
            {[
              { day: 'Mon', in: 85, out: 65 },
              { day: 'Tue', in: 60, out: 75 },
              { day: 'Wed', in: 95, out: 80 },
              { day: 'Thu', in: 70, out: 90 },
              { day: 'Fri', in: 100, out: 85 },
              { day: 'Sat', in: 45, out: 55 },
              { day: 'Sun', in: 30, out: 40 }
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 h-32">
                  <div
                    style={{ height: `${col.in}%` }}
                    className="w-2.5 sm:w-3.5 bg-sky-500 rounded-t-sm group-hover:brightness-110 transition-all"
                    title={`Inbound: ${col.in * 20} units`}
                  />
                  <div
                    style={{ height: `${col.out}%` }}
                    className="w-2.5 sm:w-3.5 bg-emerald-500 rounded-t-sm group-hover:brightness-110 transition-all"
                    title={`Outbound: ${col.out * 20} units`}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                  {col.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-sky-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" /> Inbound (+14.8k)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Outbound (11.2k)
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              Net Surplus: +3,550
            </span>
          </div>
        </div>
      </div>

      {/* TAB 1: LIVE STOCK & FORMULARY LEDGER */}
      {activeTab === 'STOCK_LEDGER' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="card-stylish p-4 flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900">
            <div className="relative w-full md:w-96 flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicine name, generic molecule, batch #, item code..."
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
                <option value="ALL">All Categories</option>
                <option value="Cardiac">Cardiac</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Analgesic">Analgesic</option>
                <option value="IV Fluids">IV Fluids</option>
                <option value="Antidiabetic">Antidiabetic</option>
                <option value="Emergency / Critical">Emergency / Critical</option>
                <option value="Anesthesia">Anesthesia</option>
              </select>

              <select
                value={selectedStorage}
                onChange={(e) => setSelectedStorage(e.target.value)}
                className="select-stylish text-xs"
              >
                <option value="ALL">All Storage Conditions</option>
                <option value="Cold Chain">Cold Chain (2°C-8°C)</option>
                <option value="Room Temp">Room Temp (15°C-25°C)</option>
                <option value="Vault">Controlled Vault</option>
                <option value="Light">Protect from Light</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="table-container-stylish">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-4 py-3">Medicine & Generic Molecule</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Batch & Expiry</th>
                    <th className="px-4 py-3">Storage Condition</th>
                    <th className="px-4 py-3">Current Stock</th>
                    <th className="px-4 py-3">Velocity & Runway</th>
                    <th className="px-4 py-3">Pricing (Cost / MRP)</th>
                    <th className="px-4 py-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStocks.map((item) => {
                    const isLow = item.stockQty <= item.reorderLevel;
                    const isNearExpiry = new Date(item.expiryDate).getTime() - new Date().getTime() < 60 * 24 * 3600 * 1000;

                    return (
                      <tr key={item.id} className={`transition-colors ${item.isQuarantined ? 'bg-rose-50/60 dark:bg-rose-950/30' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'}`}>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {item.medicineName}
                            {item.isQuarantined && (
                              <span className="badge-rose text-[9px] py-0 px-1 font-bold animate-pulse">
                                RECALL QUARANTINE
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{item.genericName}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Code: {item.itemCode} · Mfr: {item.manufacturer}</div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="badge-slate">{item.category}</span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">{item.batchNo}</div>
                          <div className={`text-xs mt-0.5 font-medium ${isNearExpiry ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-500'}`}>
                            Exp: {item.expiryDate}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {item.storageCondition.includes('Cold') ? (
                              <span className="badge-indigo">
                                <ThermometerSnowflake className="w-3 h-3" />
                                {item.storageCondition}
                              </span>
                            ) : item.storageCondition.includes('Vault') ? (
                              <span className="badge-rose">
                                <ShieldCheck className="w-3 h-3" />
                                {item.storageCondition}
                              </span>
                            ) : (
                              <span className="badge-slate">{item.storageCondition}</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Sensor: {item.temperature}</div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">{item.stockQty}</span>
                            {isLow && (
                              <span className="badge-rose text-[10px] py-0 px-1.5">Reorder</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">Min: {item.reorderLevel} units</div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                            {item.dailySalesRate} units / day
                          </div>
                          <div className={`text-xs font-semibold ${item.daysOfStockLeft <= 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {item.daysOfStockLeft} days runway
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="text-xs text-slate-900 dark:text-white font-medium">{formatCurrency(item.unitPrice)} (Cost)</div>
                          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{formatCurrency(item.mrp)} (MRP)</div>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedStockId(item.id);
                                setStockAction('IN');
                                setIsStockModalOpen(true);
                              }}
                              disabled={item.isQuarantined}
                              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                                item.isQuarantined
                                  ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                                  : 'bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300'
                              }`}
                            >
                              + Stock
                            </button>
                            <button
                              onClick={() => {
                                if (item.isQuarantined) return;
                                setSelectedStockId(item.id);
                                setStockAction('OUT');
                                setIsStockModalOpen(true);
                              }}
                              disabled={item.isQuarantined}
                              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                                item.isQuarantined
                                  ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {item.isQuarantined ? 'Locked' : 'Dispense'}
                            </button>
                            {!item.isQuarantined && (
                              <button
                                onClick={() => {
                                  setQuarantineBatchNo(item.batchNo);
                                  setIsQuarantineModalOpen(true);
                                }}
                                title="Emergency Batch Recall"
                                className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              >
                                <AlertOctagon className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INWARD SHIPMENTS & STOCK DELIVERIES */}
      {activeTab === 'INWARD_SHIPMENTS' && (
        <div className="space-y-4">
          <div className="card-stylish p-4 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                Goods Inward Receipts & Delivery Inflow (GRN)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect stock delivery arrivals, ordered vs received quantity verification, and warehouse storage bays
              </p>
            </div>
            <button
              onClick={() => setIsReceiveShipmentOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Log Inward Shipment
            </button>
          </div>

          <div className="table-container-stylish">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3">PO Number & Date</th>
                  <th className="px-4 py-3">Medicine & Formulation</th>
                  <th className="px-4 py-3">Supplier Distributor</th>
                  <th className="px-4 py-3">Ordered vs Received</th>
                  <th className="px-4 py-3">Storage Bay Assigned</th>
                  <th className="px-4 py-3">Inward Status</th>
                  <th className="px-4 py-3 text-right">Invoice Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 dark:text-white font-mono">{shipment.poNumber}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{shipment.arrivedDate}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{shipment.medicineName}</div>
                      <div className="text-xs text-slate-500 font-mono">Lot: {shipment.batchNumber}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium text-slate-800 dark:text-slate-200">{shipment.supplier}</div>
                      <div className="text-[11px] text-emerald-600">Verified GSP Compliance</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {shipment.receivedQty} / {shipment.orderedQty} units
                      </div>
                      <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (shipment.receivedQty / (shipment.orderedQty || 1)) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge-slate text-[11px]">{shipment.storageBay}</span>
                    </td>
                    <td className="px-4 py-3">
                      {shipment.status === 'DELIVERED_VERIFIED' ? (
                        <span className="badge-emerald">Arrived & Verified</span>
                      ) : shipment.status === 'QC_PENDING' ? (
                        <span className="badge-amber">QC Inspection</span>
                      ) : (
                        <span className="badge-blue">In-Transit Truck</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-bold text-slate-900 dark:text-white">{formatCurrency(shipment.invoiceAmount)}</div>
                      <div className="text-[11px] text-slate-400">Net Payable</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SALES & DISPENSING VELOCITY ANALYTICS */}
      {activeTab === 'SALES_VELOCITY' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat-card-stylish">
              <span className="text-xs font-semibold text-slate-500 uppercase">Top Fast-Moving Formulations</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">IV Normal Saline 0.9%</p>
              <p className="text-xs text-emerald-600 mt-1">140 units dispensed/day</p>
            </div>
            <div className="stat-card-stylish">
              <span className="text-xs font-semibold text-slate-500 uppercase">Stock Run-out Warning (&le; 7 Days)</span>
              <p className="text-xl font-bold text-rose-600 mt-1">2 Urgent Formulations</p>
              <p className="text-xs text-rose-500 mt-1">Insulin Actrapid & Noradrenaline</p>
            </div>
            <div className="stat-card-stylish">
              <span className="text-xs font-semibold text-slate-500 uppercase">Est. Monthly Pharmacy Outflow</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(1450000)}</p>
              <p className="text-xs text-slate-400 mt-1">Average inpatient & OPD demand</p>
            </div>
          </div>

          <div className="table-container-stylish">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3">Medicine Item</th>
                  <th className="px-4 py-3">Daily Burn Rate</th>
                  <th className="px-4 py-3">Current Balance</th>
                  <th className="px-4 py-3">Projected Stockout Date</th>
                  <th className="px-4 py-3">Movement Classification</th>
                  <th className="px-4 py-3 text-right">Replenishment Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stocks.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{s.medicineName}</div>
                      <div className="text-xs text-slate-400">{s.category}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                      {s.dailySalesRate} units / day
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {s.stockQty} units
                    </td>
                    <td className="px-4 py-3">
                      <div className={`font-semibold ${s.daysOfStockLeft <= 5 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
                        In {s.daysOfStockLeft} Days
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {s.dailySalesRate > 30 ? (
                        <span className="badge-emerald">Fast-Moving (High Demand)</span>
                      ) : s.dailySalesRate > 10 ? (
                        <span className="badge-blue">Normal Velocity</span>
                      ) : (
                        <span className="badge-slate">Slow-Moving / Critical Reserve</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {s.daysOfStockLeft <= 5 ? (
                        <span className="badge-rose">Immediate PO Required</span>
                      ) : (
                        <span className="badge-emerald">Adequate Reserve</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DEPARTMENT REQUIREMENTS & WARDS */}
      {activeTab === 'DEPT_REQUIREMENTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { dept: 'Intensive Care Unit (ICU)', count: 4, items: ['Inj. Human Actrapid', 'Inj. Meropenem 1g', 'Tab. Sorbitrate 5mg', 'IV Normal Saline 0.9%'], status: 'Active Stocking' },
            { dept: 'Operation Theatre (OT Suite)', count: 3, items: ['Inj. Fentanyl 50mcg/ml', 'Inj. Meropenem 1g', 'IV Normal Saline 0.9%'], status: 'Narcotic Lockbox Monitored' },
            { dept: 'Emergency Room (ER Trauma Bay)', count: 3, items: ['Inj. Noradrenaline 2mg', 'Tab. Sorbitrate 5mg', 'IV Normal Saline 0.9%'], status: 'Crash Cart Ready' },
            { dept: 'Inpatient General Wards', count: 2, items: ['IV Normal Saline 0.9%', 'Inj. Human Actrapid'], status: 'Routine Ward Supply' },
            { dept: 'Cardiology OPD Desk', count: 1, items: ['Tab. Sorbitrate 5mg'], status: 'Outpatient Formulary' },
            { dept: 'Dialysis & Renal Unit', count: 1, items: ['IV Normal Saline 0.9%'], status: 'Routine Supply' }
          ].map((d, idx) => (
            <div key={idx} className="card-stylish p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    {d.dept}
                  </h3>
                  <span className="badge-slate text-[11px]">{d.count} Formulations</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{d.status}</p>

                <div className="mt-3.5 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Allocated Drugs:</span>
                  {d.items.map((it, i) => (
                    <div key={i} className="text-xs py-1 px-2.5 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium flex items-center justify-between">
                      <span>{it}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setActionDept(d.dept);
                    setStockAction('OUT');
                    setIsStockModalOpen(true);
                  }}
                  className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Dispense to {d.dept.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: INTER-BRANCH LOGISTICS & MULTINATIONAL SUPPLY CHAIN (IBST) */}
      {activeTab === 'INTER_BRANCH_TRANSFERS' && (
        <div className="space-y-4">
          <div className="card-stylish p-4 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-sky-600" />
                Multinational Inter-Branch Stock Transfers (IBST)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Group Purchasing Organization (GPO) cross-border supply chain between Chennai, Dubai, Singapore &amp; London campuses
              </p>
            </div>
            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plane className="w-4 h-4" />
              Dispatch Transfer Order
            </button>
          </div>

          {/* Campus Hub Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Chennai Greams Campus</span>
                <span className="badge-emerald text-[10px]">Primary Hub</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Central GPO Warehouse · JCI Accredited</p>
              <div className="mt-2 text-xs font-semibold text-emerald-600">Stock Availability: 99.2%</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Dubai Healthcare City</span>
                <span className="badge-sky text-[10px]">UAE Regional Hub</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">DHA Licensed · Direct Air Corridor</p>
              <div className="mt-2 text-xs font-semibold text-sky-600">In-Transit Shipments: {transfers.filter(t => t.targetBranch.includes('Dubai')).length}</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Singapore Novena Centre</span>
                <span className="badge-indigo text-[10px]">APAC Hub</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">HSA Compliant · Cold-Chain Validated</p>
              <div className="mt-2 text-xs font-semibold text-indigo-600">Active Cold-Chain: 100% Ok</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">London Harley St Clinic</span>
                <span className="badge-purple text-[10px]">UK Gateway</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">CQC / MHRA Registered · Critical Stock</p>
              <div className="mt-2 text-xs font-semibold text-purple-600">Specialty Formulations: 18</div>
            </div>
          </div>

          {/* Transfers Table */}
          <div className="table-container-stylish">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3">Transfer Order</th>
                  <th className="px-4 py-3">Route (Origin &rarr; Destination)</th>
                  <th className="px-4 py-3">Drug &amp; Batch</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Transit Cold-Chain</th>
                  <th className="px-4 py-3">Air Cargo / Carrier</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transfers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">{t.transferOrderNo}</div>
                      <div className="text-[10px] text-slate-400">{t.dispatchDate}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                        <span>{t.sourceBranch.split(' ')[0]}</span>
                        <span className="text-slate-400">&rarr;</span>
                        <span className="text-sky-600 dark:text-sky-400 font-bold">{t.targetBranch.split(' ')[0]}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{t.targetBranch}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-white text-xs">{t.medicineName}</div>
                      <div className="text-[10px] font-mono text-slate-500">Batch: {t.batchNumber} · SKU: {t.itemCode}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white text-xs">
                      {t.quantity} Units
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge-indigo text-[10px]">
                        <ThermometerSnowflake className="w-3 h-3" />
                        {t.transitTemp}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs text-slate-700 dark:text-slate-300 font-medium">{t.carrierTracking}</div>
                      <div className="text-[10px] text-emerald-600 font-medium">GPS / Beacon Live</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        t.status === 'RECEIVED'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : t.status === 'QUARANTINED'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {t.authorizedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: STOCK IN / DISPENSE MODAL */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="card-stylish w-full max-w-md bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {stockAction === 'IN' ? (
                  <>
                    <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                    Stock Inward Adjustment
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    Dispense Medicine to Ward / OPD
                  </>
                )}
              </h3>
              <button onClick={() => setIsStockModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStock} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Formulation</label>
                <select
                  value={selectedStockId}
                  onChange={(e) => setSelectedStockId(e.target.value)}
                  className="input-stylish text-xs"
                >
                  {stocks.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.medicineName} ({s.batchNo}) — Current Stock: {s.stockQty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Quantity (Units)</label>
                <input
                  type="number"
                  min="1"
                  value={actionQuantity}
                  onChange={(e) => setActionQuantity(Number(e.target.value))}
                  className="input-stylish text-xs"
                  required
                />
              </div>

              {stockAction === 'OUT' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Dispensing Destination</label>
                  <select
                    value={actionDept}
                    onChange={(e) => setActionDept(e.target.value)}
                    className="input-stylish text-xs"
                  >
                    <option value="ICU">Intensive Care Unit (ICU)</option>
                    <option value="OT Suite">Operation Theatre (OT Suite)</option>
                    <option value="ER Trauma">Emergency Room (ER)</option>
                    <option value="General Ward">General Ward Bed Dispensary</option>
                    <option value="OPD Counter">OPD Pharmacy Counter</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={stockAction === 'IN' ? 'btn-primary text-xs' : 'px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold'}
                >
                  Confirm {stockAction === 'IN' ? 'Inward Entry' : 'Dispensing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER NEW MEDICINE FORM */}
      {isAddMedicineOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="card-stylish w-full max-w-lg bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Register New Medicine in Formulary
              </h3>
              <button onClick={() => setIsAddMedicineOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewMedicine} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Brand Name / Dosage Form</label>
                  <input
                    type="text"
                    placeholder="e.g. Tab. Dolo 650mg"
                    value={newMed.medicineName}
                    onChange={(e) => setNewMed({ ...newMed, medicineName: e.target.value })}
                    className="input-stylish text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Active Generic Molecule</label>
                  <input
                    type="text"
                    placeholder="e.g. Paracetamol"
                    value={newMed.genericName}
                    onChange={(e) => setNewMed({ ...newMed, genericName: e.target.value })}
                    className="input-stylish text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Therapeutic Category</label>
                  <select
                    value={newMed.category}
                    onChange={(e) => setNewMed({ ...newMed, category: e.target.value as any })}
                    className="input-stylish text-xs"
                  >
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Cardiac">Cardiac</option>
                    <option value="Analgesic">Analgesic</option>
                    <option value="IV Fluids">IV Fluids</option>
                    <option value="Antidiabetic">Antidiabetic</option>
                    <option value="Emergency / Critical">Emergency / Critical</option>
                    <option value="Anesthesia">Anesthesia</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Storage Condition</label>
                  <select
                    value={newMed.storageCondition}
                    onChange={(e) => setNewMed({ ...newMed, storageCondition: e.target.value as any })}
                    className="input-stylish text-xs"
                  >
                    <option value="Room Temp (15°C - 25°C)">Room Temp (15°C - 25°C)</option>
                    <option value="Cold Chain (2°C - 8°C)">Cold Chain (2°C - 8°C)</option>
                    <option value="Controlled Vault (Double Lock)">Controlled Vault (Double Lock)</option>
                    <option value="Deep Freeze (-20°C)">Deep Freeze (-20°C)</option>
                    <option value="Protect from Light">Protect from Light</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Batch Number</label>
                  <input
                    type="text"
                    placeholder="BT-2026-01"
                    value={newMed.batchNo}
                    onChange={(e) => setNewMed({ ...newMed, batchNo: e.target.value })}
                    className="input-stylish text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newMed.expiryDate}
                    onChange={(e) => setNewMed({ ...newMed, expiryDate: e.target.value })}
                    className="input-stylish text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newMed.stockQty}
                    onChange={(e) => setNewMed({ ...newMed, stockQty: Number(e.target.value) })}
                    className="input-stylish text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Reorder Alert Level</label>
                  <input
                    type="number"
                    min="1"
                    value={newMed.reorderLevel}
                    onChange={(e) => setNewMed({ ...newMed, reorderLevel: Number(e.target.value) })}
                    className="input-stylish text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit Cost Price (₹)</label>
                  <input
                    type="number"
                    value={newMed.unitPrice}
                    onChange={(e) => setNewMed({ ...newMed, unitPrice: Number(e.target.value) })}
                    className="input-stylish text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Selling MRP (₹)</label>
                  <input
                    type="number"
                    value={newMed.mrp}
                    onChange={(e) => setNewMed({ ...newMed, mrp: Number(e.target.value) })}
                    className="input-stylish text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Manufacturer</label>
                <input
                  type="text"
                  placeholder="e.g. Sun Pharma / Cipla / GSK"
                  value={newMed.manufacturer}
                  onChange={(e) => setNewMed({ ...newMed, manufacturer: e.target.value })}
                  className="input-stylish text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMedicineOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Register into Formulary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INWARD STOCK RECEIPT (GRN) */}
      {isReceiveShipmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="card-stylish w-full max-w-md bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                Receive Inward Stock / GRN
              </h3>
              <button onClick={() => setIsReceiveShipmentOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReceiveShipment} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Purchase Order (PO #)</label>
                  <input
                    type="text"
                    value={newShipment.poNumber}
                    onChange={(e) => setNewShipment({ ...newShipment, poNumber: e.target.value })}
                    className="input-stylish text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={newShipment.batchNumber}
                    onChange={(e) => setNewShipment({ ...newShipment, batchNumber: e.target.value })}
                    className="input-stylish text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Medicine Formulation</label>
                <input
                  type="text"
                  placeholder="e.g. Inj. Meropenem 1g"
                  value={newShipment.medicineName}
                  onChange={(e) => setNewShipment({ ...newShipment, medicineName: e.target.value })}
                  className="input-stylish text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Supplier Distributor</label>
                <input
                  type="text"
                  value={newShipment.supplier}
                  onChange={(e) => setNewShipment({ ...newShipment, supplier: e.target.value })}
                  className="input-stylish text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Quantity Received</label>
                  <input
                    type="number"
                    min="1"
                    value={newShipment.receivedQty}
                    onChange={(e) => setNewShipment({ ...newShipment, receivedQty: Number(e.target.value) })}
                    className="input-stylish text-xs font-bold text-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Storage Bay Assigned</label>
                  <input
                    type="text"
                    value={newShipment.storageBay}
                    onChange={(e) => setNewShipment({ ...newShipment, storageBay: e.target.value })}
                    className="input-stylish text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReceiveShipmentOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                >
                  Verify &amp; Accept Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EMERGENCY BATCH RECALL & QUARANTINE */}
      {isQuarantineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="card-stylish w-full max-w-md bg-white dark:bg-slate-900 p-6 border border-rose-300 dark:border-rose-900/60 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-950/60 pb-3">
              <h3 className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                Emergency Batch Recall / Quarantine
              </h3>
              <button onClick={() => setIsQuarantineModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {quarantineSuccessMsg ? (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-3">
                <AlertOctagon className="w-6 h-6 flex-shrink-0 text-rose-600" />
                <span>{quarantineSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleQuarantineBatch} className="space-y-3.5 text-xs">
                <p className="text-slate-600 dark:text-slate-400">
                  Executing an immediate global recall locks dispensing across all ICUs, OTs, and OPDs and files an immediate Sentinel Event report.
                </p>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Batch Number to Recall</label>
                  <input
                    type="text"
                    placeholder="e.g. BT-2024-91 or HL-2026-402"
                    value={quarantineBatchNo}
                    onChange={(e) => setQuarantineBatchNo(e.target.value)}
                    className="input-stylish text-xs font-mono font-bold text-rose-600"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinical / Quality Reason</label>
                  <textarea
                    rows={3}
                    value={quarantineReason}
                    onChange={(e) => setQuarantineReason(e.target.value)}
                    className="input-stylish text-xs"
                    required
                  />
                </div>

                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
                  <span>Regulatory action: All inventory bays will be frozen, and notifications dispatched to the Pharmacovigilance committee.</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsQuarantineModalOpen(false)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
                  >
                    <AlertOctagon className="w-4 h-4" />
                    Lock &amp; Quarantine Batch
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: DISPATCH INTER-BRANCH STOCK TRANSFER */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="card-stylish w-full max-w-lg bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plane className="w-5 h-5 text-sky-600" />
                Dispatch Inter-Branch Stock Transfer (IBST)
              </h3>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDispatchTransfer} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Source Campus</label>
                  <select
                    value={newTransfer.sourceBranch}
                    onChange={(e) => setNewTransfer({ ...newTransfer, sourceBranch: e.target.value })}
                    className="input-stylish text-xs"
                  >
                    <option value="Apollo Greams Main Campus (Chennai)">Apollo Greams Main Campus (Chennai)</option>
                    <option value="Dubai Healthcare City Hub (UAE)">Dubai Healthcare City Hub (UAE)</option>
                    <option value="Singapore Novena Specialist Centre">Singapore Novena Specialist Centre</option>
                    <option value="London Harley St Clinic (UK)">London Harley St Clinic (UK)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Campus</label>
                  <select
                    value={newTransfer.targetBranch}
                    onChange={(e) => setNewTransfer({ ...newTransfer, targetBranch: e.target.value })}
                    className="input-stylish text-xs"
                  >
                    <option value="Dubai Healthcare City Hub (UAE)">Dubai Healthcare City Hub (UAE)</option>
                    <option value="Apollo Greams Main Campus (Chennai)">Apollo Greams Main Campus (Chennai)</option>
                    <option value="Singapore Novena Specialist Centre">Singapore Novena Specialist Centre</option>
                    <option value="London Harley St Clinic (UK)">London Harley St Clinic (UK)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Medicine Name</label>
                  <input
                    type="text"
                    value={newTransfer.medicineName}
                    onChange={(e) => setNewTransfer({ ...newTransfer, medicineName: e.target.value })}
                    className="input-stylish text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={newTransfer.batchNumber}
                    onChange={(e) => setNewTransfer({ ...newTransfer, batchNumber: e.target.value })}
                    className="input-stylish text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Transfer Quantity (Units)</label>
                  <input
                    type="number"
                    min="1"
                    value={newTransfer.quantity}
                    onChange={(e) => setNewTransfer({ ...newTransfer, quantity: Number(e.target.value) })}
                    className="input-stylish text-xs font-bold text-sky-600"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Transit Temperature Packaging</label>
                  <input
                    type="text"
                    value={newTransfer.transitTemp}
                    onChange={(e) => setNewTransfer({ ...newTransfer, transitTemp: e.target.value })}
                    className="input-stylish text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Air Waybill / Carrier Tracking</label>
                  <input
                    type="text"
                    value={newTransfer.carrierTracking}
                    onChange={(e) => setNewTransfer({ ...newTransfer, carrierTracking: e.target.value })}
                    className="input-stylish text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Authorizing VP / Clinical Lead</label>
                  <input
                    type="text"
                    value={newTransfer.authorizedBy}
                    onChange={(e) => setNewTransfer({ ...newTransfer, authorizedBy: e.target.value })}
                    className="input-stylish text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
                >
                  <Plane className="w-4 h-4" />
                  Issue Transfer &amp; Air Bill
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
        title="Pharmacy Inventory & Stock Ledger"
        text={`Sindhu Hospital Central Pharmacy Formulary: ${stocks.length} formulations, ${totalStockUnits.toLocaleString()} units in stock, ${coldChainCount} cold-chain lines.`}
        url={window.location.href}
      />
    </div>
  );
};
