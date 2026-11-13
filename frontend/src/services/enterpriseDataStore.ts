/**
 * Enterprise Unified Reactive Data Store for Multinational Hospital Group
 * Manages persistent state across all 29 hospital modules with offline-first localStorage,
 * reactive pub/sub listeners, inter-branch logistics, automated PR replenishment, and batch quarantine.
 */

export interface MedicineBatchItem {
  id: string;
  itemCode: string;
  brandName: string;
  genericName: string;
  category: string;
  formulation: string;
  batchNumber: string;
  barcode: string;
  availableStock: number;
  minimumSafetyStock: number;
  reorderPoint: number;
  parLevel: number;
  expiryDate: string;
  storageCondition: 'COLD_CHAIN' | 'ROOM_TEMP' | 'CONTROLLED_VAULT';
  storageBay: string;
  tempCelsius?: number;
  unitPrice: number;
  dailyBurnRate: number;
  velocity: 'FAST' | 'MEDIUM' | 'SLOW';
  runwayDays: number;
  status: 'OPTIMAL' | 'REORDER_REQUIRED' | 'CRITICAL_STOCKOUT' | 'EXPIRED' | 'QUARANTINED';
  branchId: string;
  departmentDemands: {
    icu: number;
    ot: number;
    er: number;
    wards: number;
    opd: number;
  };
}

export interface InwardDeliveryGrn {
  id: string;
  grnNumber: string;
  poNumber: string;
  vendorName: string;
  deliveryDate: string;
  itemCode: string;
  brandName: string;
  batchNumber: string;
  expiryDate: string;
  orderedQty: number;
  receivedQty: number;
  discrepancyQty: number;
  storageBay: string;
  qcStatus: 'PASSED' | 'PENDING' | 'REJECTED';
  coldChainCompliant: boolean;
  transitTemp: string;
  inspectorName: string;
  branchId: string;
}

export interface InterBranchTransfer {
  id: string;
  transferOrderNo: string;
  sourceBranch: string;
  targetBranch: string;
  itemCode: string;
  medicineName: string;
  batchNumber: string;
  quantity: number;
  transitTemp: string;
  dispatchDate: string;
  status: 'DISPATCHED' | 'IN_TRANSIT' | 'RECEIVED' | 'QUARANTINED';
  carrierTracking: string;
  authorizedBy: string;
}

export interface SurgicalCase {
  id: string;
  theater: string;
  patientName: string;
  uhid: string;
  procedure: string;
  specialty: string;
  leadSurgeon: string;
  anesthesiologist: string;
  startTime: string;
  duration: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'PACU_RECOVERY' | 'COMPLETED' | 'CANCELLED';
  urgency: 'ELECTIVE' | 'URGENT' | 'EMERGENCY_CODE_YELLOW';
  whoChecklist: {
    signIn: boolean;
    timeOut: boolean;
    signOut: boolean;
  };
  pacuBed?: string;
  aldreteScore?: number;
  implantBatch?: string;
  branchId: string;
}

export interface PathologyLabOrder {
  id: string;
  sampleBarcode: string;
  patientName: string;
  uhid: string;
  testName: string;
  department: string;
  collectionTime: string;
  resultStatus: 'COLLECTED' | 'ANALYZING' | 'RESULT_READY' | 'AUTHORISED';
  isPanicAlert: boolean;
  parameters: Array<{
    name: string;
    value: string;
    normalRange: string;
    unit: string;
    isAbnormal: boolean;
    isCritical: boolean;
  }>;
  pathologist: string;
  branchId: string;
}

export interface RadiologyScan {
  id: string;
  modality: 'CT' | 'MRI' | 'X-RAY' | 'ULTRASOUND';
  modalityRoom: string;
  patientName: string;
  uhid: string;
  procedureName: string;
  slotTime: string;
  tatMinutes: number;
  status: 'SCHEDULED' | 'IMAGE_ACQUIRED' | 'DICTATED' | 'VERIFIED';
  urgentPriority: boolean;
  radiologist: string;
  branchId: string;
}

export interface BloodBankUnit {
  id: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  component: 'PRBC' | 'FFP' | 'PLATELETS' | 'CRYOPRECIPITATE';
  unitsAvailable: number;
  unitsReserved: number;
  storageTemp: string;
  coldChainOk: boolean;
  expiringInDays: number;
  branchId: string;
}

export interface EmergencyPatient {
  id: string;
  triageLevel: 'ESI-1' | 'ESI-2' | 'ESI-3' | 'ESI-4' | 'ESI-5';
  bayName: string;
  patientName: string;
  ageGender: string;
  chiefComplaint: string;
  vitals: string;
  arrivalTime: string;
  isMlc: boolean;
  status: 'RESUSCITATING' | 'CRITICAL_STABILIZING' | 'MONITORING' | 'TRANSFERRED_ICU' | 'DISCHARGED';
  branchId: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  department: string;
  orderDate: string;
  itemsCount: number;
  totalAmount: number;
  paymentTerms: string;
  approvalStatus: 'DRAFT' | 'PENDING_HOD' | 'APPROVED_CFO' | 'DISPATCHED' | 'RECEIVED';
  threeWayMatched: boolean;
  branchId: string;
}

export interface TpaInsuranceClaim {
  id: string;
  claimId: string;
  patientName: string;
  uhid: string;
  tpaName: string;
  policyNumber: string;
  estimatedAmount: number;
  sanctionedAmount: number;
  status: 'PRE_AUTH_SUBMITTED' | 'APPROVED' | 'ENHANCEMENT_PENDING' | 'QUERY_RAISED' | 'SETTLED' | 'REJECTED';
  submissionDate: string;
  branchId: string;
}

export interface SafetyIncident {
  id: string;
  incidentNumber: string;
  incidentType: 'MEDICATION_ERROR' | 'PATIENT_FALL' | 'NEEDLE_STICK' | 'SURGICAL_EVENT' | 'EQUIPMENT_FAIL' | 'SECURITY';
  severity: 'NEAR_MISS' | 'MINOR' | 'MODERATE' | 'SENTINEL_EVENT';
  location: string;
  description: string;
  reportDate: string;
  anonymous: boolean;
  reporterRole: string;
  status: 'INVESTIGATING' | 'RCA_IN_PROGRESS' | 'CAPA_SUBMITTED' | 'CLOSED';
  branchId: string;
}

export interface DoctorCredential {
  id: string;
  doctorName: string;
  specialty: string;
  registrationNumber: string;
  medicalCouncil: string;
  validUntil: string;
  privilegeTier: 'CORE_OPD' | 'MAJOR_SURGICAL' | 'COMPLEX_QUATERNARY';
  lifeSupportStatus: 'BLS_ACLS_CURRENT' | 'RECERTIFICATION_DUE' | 'EXPIRED';
  cmeHoursCompleted: number;
  isAuthorized: boolean;
  branchId: string;
}

export interface StatutoryLicenseItem {
  id: string;
  licenseName: string;
  authority: string;
  licenseNumber: string;
  validUntil: string;
  daysRemaining: number;
  status: 'VALID' | 'EXPIRING_SOON' | 'RENEWAL_SUBMITTED' | 'CRITICAL_EXPIRED';
  branchId: string;
}

// ─── Default Initial Seed Datasets ──────────────────────────────────────────

const INITIAL_MEDICINES: MedicineBatchItem[] = [
  {
    id: 'MED-01',
    itemCode: 'PH-INJ-001',
    brandName: 'Norad 4mg Ampoule',
    genericName: 'Norepinephrine Bitartrate 2mg/mL',
    category: 'Critical Care / Inotrope',
    formulation: '4mg / 2mL Ampoule',
    batchNumber: 'NB-2026-881',
    barcode: '890123400101',
    availableStock: 240,
    minimumSafetyStock: 100,
    reorderPoint: 150,
    parLevel: 400,
    expiryDate: '2027-08-31',
    storageCondition: 'ROOM_TEMP',
    storageBay: 'Bay A-02 / Shelf 1',
    tempCelsius: 22.4,
    unitPrice: 145,
    dailyBurnRate: 18,
    velocity: 'FAST',
    runwayDays: 13,
    status: 'OPTIMAL',
    branchId: 'branch-chennai-greams',
    departmentDemands: { icu: 110, ot: 45, er: 65, wards: 15, opd: 5 }
  },
  {
    id: 'MED-02',
    itemCode: 'PH-INJ-002',
    brandName: 'Humalog Mix 50/50 KwikPen',
    genericName: 'Insulin Lispro Protamine Susp 100 IU/mL',
    category: 'Endocrinology / Biologic',
    formulation: '3mL Prefilled Pen',
    batchNumber: 'HL-2026-402',
    barcode: '890123400102',
    availableStock: 48,
    minimumSafetyStock: 30,
    reorderPoint: 60,
    parLevel: 120,
    expiryDate: '2026-11-15',
    storageCondition: 'COLD_CHAIN',
    storageBay: 'Cold Room C-01 / Rack 2',
    tempCelsius: 4.2,
    unitPrice: 980,
    dailyBurnRate: 6,
    velocity: 'MEDIUM',
    runwayDays: 8,
    status: 'REORDER_REQUIRED',
    branchId: 'branch-chennai-greams',
    departmentDemands: { icu: 12, ot: 0, er: 4, wards: 22, opd: 10 }
  },
  {
    id: 'MED-03',
    itemCode: 'PH-INJ-003',
    brandName: 'Fentanyl Citrate 100mcg',
    genericName: 'Fentanyl Citrate 50mcg/mL',
    category: 'Schedule X / Opioid Analgesic',
    formulation: '2mL Ampoule',
    batchNumber: 'FN-2026-993',
    barcode: '890123400103',
    availableStock: 18,
    minimumSafetyStock: 25,
    reorderPoint: 35,
    parLevel: 80,
    expiryDate: '2027-04-30',
    storageCondition: 'CONTROLLED_VAULT',
    storageBay: 'Vault V-01 / Locker 3',
    tempCelsius: 21.0,
    unitPrice: 320,
    dailyBurnRate: 4,
    velocity: 'MEDIUM',
    runwayDays: 4,
    status: 'CRITICAL_STOCKOUT',
    branchId: 'branch-chennai-greams',
    departmentDemands: { icu: 6, ot: 10, er: 2, wards: 0, opd: 0 }
  },
  {
    id: 'MED-04',
    itemCode: 'PH-INJ-004',
    brandName: 'Meropenem 1g IV Vial',
    genericName: 'Meropenem Trihydrate 1000mg',
    category: 'Antibiotic / Carbapenem',
    formulation: '1g Lyophilized Vial',
    batchNumber: 'MP-2026-112',
    barcode: '890123400104',
    availableStock: 310,
    minimumSafetyStock: 120,
    reorderPoint: 180,
    parLevel: 500,
    expiryDate: '2027-12-31',
    storageCondition: 'ROOM_TEMP',
    storageBay: 'Bay B-01 / Shelf 4',
    tempCelsius: 23.1,
    unitPrice: 850,
    dailyBurnRate: 24,
    velocity: 'FAST',
    runwayDays: 12,
    status: 'OPTIMAL',
    branchId: 'branch-chennai-greams',
    departmentDemands: { icu: 140, ot: 30, er: 20, wards: 110, opd: 10 }
  },
  {
    id: 'MED-05',
    itemCode: 'PH-INJ-005',
    brandName: 'Alteplase 50mg (Actilyse)',
    genericName: 'Recombinant Tissue Plasminogen Activator',
    category: 'Thrombolytic / Stroke Emergency',
    formulation: '50mg Infusion Vial',
    batchNumber: 'AL-2026-074',
    barcode: '890123400105',
    availableStock: 6,
    minimumSafetyStock: 4,
    reorderPoint: 8,
    parLevel: 15,
    expiryDate: '2026-10-31',
    storageCondition: 'COLD_CHAIN',
    storageBay: 'Cold Room C-01 / Box 1',
    tempCelsius: 3.8,
    unitPrice: 38500,
    dailyBurnRate: 0.5,
    velocity: 'SLOW',
    runwayDays: 12,
    status: 'OPTIMAL',
    branchId: 'branch-chennai-greams',
    departmentDemands: { icu: 2, ot: 0, er: 4, wards: 0, opd: 0 }
  }
];

const INITIAL_GRN_LIST: InwardDeliveryGrn[] = [
  {
    id: 'GRN-901',
    grnNumber: 'GRN-2026-00901',
    poNumber: 'PO-2026-8841',
    vendorName: 'Pfizer Biologics India Pvt Ltd',
    deliveryDate: '2026-10-09',
    itemCode: 'PH-INJ-002',
    brandName: 'Humalog Mix 50/50 KwikPen',
    batchNumber: 'HL-2026-402',
    expiryDate: '2026-11-15',
    orderedQty: 60,
    receivedQty: 60,
    discrepancyQty: 0,
    storageBay: 'Cold Room C-01 / Rack 2',
    qcStatus: 'PASSED',
    coldChainCompliant: true,
    transitTemp: '4.1°C',
    inspectorName: 'Dr. Shanthi QC',
    branchId: 'branch-chennai-greams'
  },
  {
    id: 'GRN-902',
    grnNumber: 'GRN-2026-00902',
    poNumber: 'PO-2026-8842',
    vendorName: 'Sun Pharma Distribution Ltd',
    deliveryDate: '2026-10-08',
    itemCode: 'PH-INJ-004',
    brandName: 'Meropenem 1g IV Vial',
    batchNumber: 'MP-2026-112',
    expiryDate: '2027-12-31',
    orderedQty: 200,
    receivedQty: 180,
    discrepancyQty: -20,
    storageBay: 'Bay B-01 / Shelf 4',
    qcStatus: 'PASSED',
    coldChainCompliant: true,
    transitTemp: '22.0°C',
    inspectorName: 'P. Anand B.Pharm',
    branchId: 'branch-chennai-greams'
  }
];

const INITIAL_TRANSFERS: InterBranchTransfer[] = [
  {
    id: 'IBTO-8921',
    transferOrderNo: 'IBTO-2026-8921',
    sourceBranch: 'Apollo Greams Main Campus (Chennai)',
    targetBranch: 'Dubai Healthcare City Hub (UAE)',
    itemCode: 'PH-INJ-005',
    medicineName: 'Alteplase 50mg (Actilyse)',
    batchNumber: 'AL-2026-074',
    quantity: 4,
    transitTemp: '3.6°C (Validated Cold-Chain Shipper)',
    dispatchDate: '2026-10-08',
    status: 'IN_TRANSIT',
    carrierTracking: 'EK-CARGO-778102',
    authorizedBy: 'Dr. K. Srinivasan (Group VP Pharmacy)'
  }
];

const INITIAL_SURGERIES: SurgicalCase[] = [
  {
    id: 'OT-C1',
    theater: 'OT 1 (Cardiothoracic Suite)',
    patientName: 'Subramanian R',
    uhid: 'UHID-2026-081',
    procedure: 'Off-Pump Coronary Artery Bypass (OPCAB)',
    specialty: 'Cardiovascular Surgery',
    leadSurgeon: 'Dr. C. Muralidharan',
    anesthesiologist: 'Dr. S. K. Gupta',
    startTime: '08:30 AM',
    duration: '4h 30m',
    status: 'IN_PROGRESS',
    urgency: 'URGENT',
    whoChecklist: { signIn: true, timeOut: true, signOut: false },
    pacuBed: 'PACU-02',
    aldreteScore: 8,
    implantBatch: 'CABG-GRAFT-491',
    branchId: 'branch-chennai-greams'
  },
  {
    id: 'OT-C2',
    theater: 'OT 3 (Orthopedics / Robotic)',
    patientName: 'Meenakshi Sundaram',
    uhid: 'UHID-2026-104',
    procedure: 'Robotic-Assisted Total Knee Arthroplasty',
    specialty: 'Orthopedics & Joint Replacement',
    leadSurgeon: 'Dr. Rajesh Venkat',
    anesthesiologist: 'Dr. V. Meera',
    startTime: '11:00 AM',
    duration: '2h 15m',
    status: 'SCHEDULED',
    urgency: 'ELECTIVE',
    whoChecklist: { signIn: true, timeOut: false, signOut: false },
    implantBatch: 'ZIMMER-TKA-8812',
    branchId: 'branch-chennai-greams'
  }
];

const INITIAL_LAB_ORDERS: PathologyLabOrder[] = [
  {
    id: 'LAB-501',
    sampleBarcode: 'BC-990142',
    patientName: 'Subramanian R',
    uhid: 'UHID-2026-081',
    testName: 'Arterial Blood Gas (ABG) & Serum Electrolytes',
    department: 'Biochemistry / Critical Care',
    collectionTime: '07:45 AM',
    resultStatus: 'RESULT_READY',
    isPanicAlert: true,
    parameters: [
      { name: 'Potassium (K+)', value: '6.4', normalRange: '3.5 - 5.1', unit: 'mEq/L', isAbnormal: true, isCritical: true },
      { name: 'pH', value: '7.28', normalRange: '7.35 - 7.45', unit: '', isAbnormal: true, isCritical: false },
      { name: 'pO2', value: '88', normalRange: '80 - 100', unit: 'mmHg', isAbnormal: false, isCritical: false }
    ],
    pathologist: 'Dr. Ananya MD (Path)',
    branchId: 'branch-chennai-greams'
  }
];

const INITIAL_BLOOD_UNITS: BloodBankUnit[] = [
  { id: 'BB-1', bloodGroup: 'O+', component: 'PRBC', unitsAvailable: 34, unitsReserved: 8, storageTemp: '4.1°C', coldChainOk: true, expiringInDays: 14, branchId: 'branch-chennai-greams' },
  { id: 'BB-2', bloodGroup: 'O-', component: 'PRBC', unitsAvailable: 8, unitsReserved: 4, storageTemp: '4.0°C', coldChainOk: true, expiringInDays: 9, branchId: 'branch-chennai-greams' },
  { id: 'BB-3', bloodGroup: 'A+', component: 'PRBC', unitsAvailable: 22, unitsReserved: 6, storageTemp: '4.2°C', coldChainOk: true, expiringInDays: 18, branchId: 'branch-chennai-greams' },
  { id: 'BB-4', bloodGroup: 'B+', component: 'PRBC', unitsAvailable: 28, unitsReserved: 4, storageTemp: '4.1°C', coldChainOk: true, expiringInDays: 21, branchId: 'branch-chennai-greams' },
  { id: 'BB-5', bloodGroup: 'AB+', component: 'PRBC', unitsAvailable: 12, unitsReserved: 2, storageTemp: '3.9°C', coldChainOk: true, expiringInDays: 12, branchId: 'branch-chennai-greams' },
  { id: 'BB-6', bloodGroup: 'O+', component: 'PLATELETS', unitsAvailable: 15, unitsReserved: 5, storageTemp: '22.0°C (Agitator)', coldChainOk: true, expiringInDays: 3, branchId: 'branch-chennai-greams' },
  { id: 'BB-7', bloodGroup: 'A+', component: 'FFP', unitsAvailable: 40, unitsReserved: 6, storageTemp: '-32.0°C (Deep Freeze)', coldChainOk: true, expiringInDays: 180, branchId: 'branch-chennai-greams' }
];

const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'PO-8841',
    poNumber: 'PO-2026-8841',
    vendorName: 'Pfizer Biologics India Pvt Ltd',
    department: 'Pharmacy',
    orderDate: '2026-10-05',
    itemsCount: 3,
    totalAmount: 185000,
    paymentTerms: 'Net 30 Days',
    approvalStatus: 'RECEIVED',
    threeWayMatched: true,
    branchId: 'branch-chennai-greams'
  },
  {
    id: 'PO-8842',
    poNumber: 'PO-2026-8842',
    vendorName: 'Sun Pharma Distribution Ltd',
    department: 'Pharmacy',
    orderDate: '2026-10-06',
    itemsCount: 5,
    totalAmount: 240000,
    paymentTerms: 'Net 45 Days',
    approvalStatus: 'RECEIVED',
    threeWayMatched: true,
    branchId: 'branch-chennai-greams'
  },
  {
    id: 'PO-8843',
    poNumber: 'PO-2026-8843',
    vendorName: 'Medtronic Biomedical Systems',
    department: 'Cardiology / OT',
    orderDate: '2026-10-08',
    itemsCount: 2,
    totalAmount: 650000,
    paymentTerms: 'Net 60 Days',
    approvalStatus: 'APPROVED_CFO',
    threeWayMatched: false,
    branchId: 'branch-chennai-greams'
  }
];

const INITIAL_TPA_CLAIMS: TpaInsuranceClaim[] = [
  {
    id: 'CLM-101',
    claimId: 'TPA-STAR-90412',
    patientName: 'Subramanian R',
    uhid: 'UHID-2026-081',
    tpaName: 'Star Health & Allied Insurance',
    policyNumber: 'P-992140129',
    estimatedAmount: 380000,
    sanctionedAmount: 350000,
    status: 'APPROVED',
    submissionDate: '2026-10-07',
    branchId: 'branch-chennai-greams'
  },
  {
    id: 'CLM-102',
    claimId: 'TPA-MEDI-77192',
    patientName: 'Meenakshi Sundaram',
    uhid: 'UHID-2026-104',
    tpaName: 'Medi Assist Insurance TPA',
    policyNumber: 'MA-0041294',
    estimatedAmount: 240000,
    sanctionedAmount: 200000,
    status: 'PRE_AUTH_SUBMITTED',
    submissionDate: '2026-10-08',
    branchId: 'branch-chennai-greams'
  }
];

const INITIAL_INCIDENTS: SafetyIncident[] = [
  {
    id: 'INC-201',
    incidentNumber: 'INC-2026-0042',
    incidentType: 'MEDICATION_ERROR',
    severity: 'NEAR_MISS',
    location: 'ICU Bed 14',
    description: 'Nurse intercepted look-alike sound-alike vial (Norad vs Dobutrex) prior to administration during shift handover.',
    reportDate: '2026-10-08',
    anonymous: false,
    reporterRole: 'ICU Senior Staff Nurse',
    status: 'CAPA_SUBMITTED',
    branchId: 'branch-chennai-greams'
  }
];

const INITIAL_CREDENTIALS: DoctorCredential[] = [
  {
    id: 'DOC-CR-01',
    doctorName: 'Dr. C. Muralidharan MS, MCh',
    specialty: 'Cardiothoracic Surgery',
    registrationNumber: 'TN-MC-44192',
    medicalCouncil: 'Tamil Nadu Medical Council (NMC)',
    validUntil: '2028-12-31',
    privilegeTier: 'COMPLEX_QUATERNARY',
    lifeSupportStatus: 'BLS_ACLS_CURRENT',
    cmeHoursCompleted: 45,
    isAuthorized: true,
    branchId: 'branch-chennai-greams'
  },
  {
    id: 'DOC-CR-02',
    doctorName: 'Dr. Rajesh Venkat MS (Ortho)',
    specialty: 'Orthopedics & Joint Replacement',
    registrationNumber: 'TN-MC-58291',
    medicalCouncil: 'Tamil Nadu Medical Council (NMC)',
    validUntil: '2027-06-30',
    privilegeTier: 'MAJOR_SURGICAL',
    lifeSupportStatus: 'BLS_ACLS_CURRENT',
    cmeHoursCompleted: 38,
    isAuthorized: true,
    branchId: 'branch-chennai-greams'
  }
];

const INITIAL_LICENSES: StatutoryLicenseItem[] = [
  { id: 'LIC-01', licenseName: 'AERB CT / Cath Lab Radiation Safety Approval', authority: 'Atomic Energy Regulatory Board (AERB)', licenseNumber: 'AERB/MD/TN/2024/091', validUntil: '2028-09-30', daysRemaining: 721, status: 'VALID', branchId: 'branch-chennai-greams' },
  { id: 'LIC-02', licenseName: 'Fire Safety Clearance NOC', authority: 'State Fire & Rescue Services Dept', licenseNumber: 'DFRS/NOC/CHN/2025/11', validUntil: '2027-03-31', daysRemaining: 173, status: 'VALID', branchId: 'branch-chennai-greams' },
  { id: 'LIC-03', licenseName: 'Bio-Medical Waste (BMW) Facility Authorization', authority: 'State Pollution Control Board', licenseNumber: 'TNPCB/BMW/EXP/2026', validUntil: '2026-11-15', daysRemaining: 37, status: 'EXPIRING_SOON', branchId: 'branch-chennai-greams' },
  { id: 'LIC-04', licenseName: 'Pharmacy Retail & Hospital Dispensing License (Form 20/21)', authority: 'Drugs Control Administration', licenseNumber: 'DCA/TN/PH/9924-R', validUntil: '2027-12-31', daysRemaining: 448, status: 'VALID', branchId: 'branch-chennai-greams' }
];

// ─── Storage Keys ───────────────────────────────────────────────────────────
const STORAGE_PREFIX = 'hospital_platform_v2_';

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
  } catch (err) {
    console.error(`Failed to store key: ${key}`, err);
  }
}

// ─── Universal Reactive Store Class ─────────────────────────────────────────

type StoreListener = () => void;

class EnterpriseDataStore {
  private listeners: Set<StoreListener> = new Set();

  public subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error(err);
      }
    });
  }

  // 1. Pharmacy Medicines & Stock Ledger
  public getMedicines(): MedicineBatchItem[] {
    return getStored<MedicineBatchItem[]>('medicines', INITIAL_MEDICINES);
  }

  public dispenseMedicine(id: string, qty: number, department: string): boolean {
    const list = this.getMedicines();
    const item = list.find((m) => m.id === id);
    if (!item) return false;
    if (item.status === 'QUARANTINED') {
      alert(`Cannot dispense: Batch ${item.batchNumber} is QUARANTINED due to quality hold!`);
      return false;
    }
    item.availableStock = Math.max(0, item.availableStock - qty);
    item.runwayDays = Math.max(0, Math.round(item.availableStock / (item.dailyBurnRate || 1)));
    if (item.availableStock <= item.minimumSafetyStock) {
      item.status = 'CRITICAL_STOCKOUT';
    } else if (item.availableStock <= item.reorderPoint) {
      item.status = 'REORDER_REQUIRED';
    } else {
      item.status = 'OPTIMAL';
    }
    setStored('medicines', list);
    this.notify();
    this.checkAndGenerateAutomatedPr(item);
    return true;
  }

  public receiveInwardBatch(batch: {
    itemCode: string;
    brandName: string;
    genericName: string;
    category: string;
    formulation: string;
    batchNumber: string;
    quantity: number;
    expiryDate: string;
    storageCondition: 'COLD_CHAIN' | 'ROOM_TEMP' | 'CONTROLLED_VAULT';
    storageBay: string;
    unitPrice: number;
  }) {
    const list = this.getMedicines();
    const existing = list.find((m) => m.itemCode === batch.itemCode && m.batchNumber === batch.batchNumber);
    if (existing) {
      existing.availableStock += Number(batch.quantity);
      existing.expiryDate = batch.expiryDate;
      existing.storageBay = batch.storageBay;
      existing.runwayDays = Math.round(existing.availableStock / (existing.dailyBurnRate || 1));
      if (existing.availableStock > existing.reorderPoint) existing.status = 'OPTIMAL';
    } else {
      const newItem: MedicineBatchItem = {
        id: `MED-${Date.now().toString().slice(-4)}`,
        itemCode: batch.itemCode,
        brandName: batch.brandName,
        genericName: batch.genericName,
        category: batch.category || 'General Therapeutics',
        formulation: batch.formulation || 'Oral Solid / Vial',
        batchNumber: batch.batchNumber,
        barcode: `890${Date.now().toString().slice(-9)}`,
        availableStock: Number(batch.quantity),
        minimumSafetyStock: Math.round(Number(batch.quantity) * 0.2),
        reorderPoint: Math.round(Number(batch.quantity) * 0.4),
        parLevel: Math.round(Number(batch.quantity) * 1.5),
        expiryDate: batch.expiryDate,
        storageCondition: batch.storageCondition,
        storageBay: batch.storageBay,
        tempCelsius: batch.storageCondition === 'COLD_CHAIN' ? 4.1 : 22.0,
        unitPrice: Number(batch.unitPrice) || 100,
        dailyBurnRate: 10,
        velocity: 'MEDIUM',
        runwayDays: Math.round(Number(batch.quantity) / 10),
        status: 'OPTIMAL',
        branchId: 'branch-chennai-greams',
        departmentDemands: { icu: 10, ot: 5, er: 5, wards: 10, opd: 5 }
      };
      list.unshift(newItem);
    }
    setStored('medicines', list);
    this.notify();
  }

  // 1-Click Global Batch Quarantine (Emergency Quality Recall)
  public quarantineBatch(batchNumber: string, reason: string): boolean {
    const list = this.getMedicines();
    let affected = 0;
    list.forEach((m) => {
      if (m.batchNumber.toLowerCase() === batchNumber.toLowerCase().trim()) {
        m.status = 'QUARANTINED';
        affected++;
      }
    });
    if (affected > 0) {
      setStored('medicines', list);
      // Automatically log safety incident
      this.logSafetyIncident({
        incidentType: 'MEDICATION_ERROR',
        severity: 'SENTINEL_EVENT',
        location: 'Central Pharmacy / Global Recall',
        description: `Emergency Batch Quarantine invoked for Batch #${batchNumber}. Reason: ${reason}. Units locked across all hospital units.`
      });
      this.notify();
      return true;
    }
    return false;
  }

  // Inter-Branch Stock Transfers (Greams -> Dubai, etc.)
  public getTransfers(): InterBranchTransfer[] {
    return getStored<InterBranchTransfer[]>('transfers', INITIAL_TRANSFERS);
  }

  public createInterBranchTransfer(data: {
    sourceBranch: string;
    targetBranch: string;
    itemCode: string;
    medicineName: string;
    batchNumber: string;
    quantity: number;
    transitTemp: string;
    carrierTracking: string;
    authorizedBy: string;
  }) {
    const list = this.getTransfers();
    const newTransfer: InterBranchTransfer = {
      id: `IBTO-${Date.now().toString().slice(-4)}`,
      transferOrderNo: `IBTO-2026-${Date.now().toString().slice(-4)}`,
      sourceBranch: data.sourceBranch,
      targetBranch: data.targetBranch,
      itemCode: data.itemCode,
      medicineName: data.medicineName,
      batchNumber: data.batchNumber,
      quantity: Number(data.quantity),
      transitTemp: data.transitTemp || '4.0°C (Cold Chain Shipper)',
      dispatchDate: new Date().toISOString().split('T')[0],
      status: 'DISPATCHED',
      carrierTracking: data.carrierTracking || 'GPO-EXPRESS-AIR',
      authorizedBy: data.authorizedBy || 'Medical Superintendent'
    };
    list.unshift(newTransfer);
    setStored('transfers', list);

    // Deduct stock from source branch
    const medicines = this.getMedicines();
    const med = medicines.find((m) => m.itemCode === data.itemCode && m.batchNumber === data.batchNumber);
    if (med) {
      med.availableStock = Math.max(0, med.availableStock - Number(data.quantity));
      setStored('medicines', medicines);
    }
    this.notify();
  }

  // Automated Purchase Requisition on Reorder Breach
  private checkAndGenerateAutomatedPr(item: MedicineBatchItem) {
    if (item.availableStock <= item.reorderPoint) {
      const pos = this.getPurchaseOrders();
      const existingDraft = pos.find((p) => p.department === 'Pharmacy' && p.approvalStatus === 'DRAFT');
      if (!existingDraft) {
        const autoPo: PurchaseOrder = {
          id: `PO-AUTO-${Date.now().toString().slice(-4)}`,
          poNumber: `PO-AUTO-${Date.now().toString().slice(-4)}`,
          vendorName: 'Consolidated GPO Pharma Distributor',
          department: 'Pharmacy',
          orderDate: new Date().toISOString().split('T')[0],
          itemsCount: 1,
          totalAmount: (item.parLevel - item.availableStock) * item.unitPrice,
          paymentTerms: 'Net 30 Days (GPO Discounted)',
          approvalStatus: 'DRAFT',
          threeWayMatched: false,
          branchId: 'branch-chennai-greams'
        };
        pos.unshift(autoPo);
        setStored('purchase_orders', pos);
        this.notify();
      }
    }
  }

  // 2. Inward Deliveries (GRN)
  public getGrns(): InwardDeliveryGrn[] {
    return getStored<InwardDeliveryGrn[]>('grns', INITIAL_GRN_LIST);
  }

  public recordGrnReceipt(data: Omit<InwardDeliveryGrn, 'id'>) {
    const list = this.getGrns();
    const newGrn: InwardDeliveryGrn = {
      ...data,
      id: `GRN-${Date.now().toString().slice(-4)}`
    };
    list.unshift(newGrn);
    setStored('grns', list);

    // Update live medicine stock
    this.receiveInwardBatch({
      itemCode: data.itemCode,
      brandName: data.brandName,
      genericName: data.brandName,
      category: 'Therapeutics',
      formulation: 'Unit Package',
      batchNumber: data.batchNumber,
      quantity: data.receivedQty,
      expiryDate: data.expiryDate,
      storageCondition: data.coldChainCompliant ? 'COLD_CHAIN' : 'ROOM_TEMP',
      storageBay: data.storageBay,
      unitPrice: 250
    });
    this.notify();
  }

  // 3. Surgical Cases (OT)
  public getSurgeries(): SurgicalCase[] {
    return getStored<SurgicalCase[]>('surgeries', INITIAL_SURGERIES);
  }

  public bookSurgery(data: Omit<SurgicalCase, 'id'>) {
    const list = this.getSurgeries();
    const newSurgery: SurgicalCase = {
      ...data,
      id: `OT-C${Date.now().toString().slice(-4)}`
    };
    list.unshift(newSurgery);
    setStored('surgeries', list);
    this.notify();
  }

  public updateSurgeryStatus(id: string, status: SurgicalCase['status'], pacuScore?: number) {
    const list = this.getSurgeries();
    const item = list.find((s) => s.id === id);
    if (item) {
      item.status = status;
      if (pacuScore !== undefined) item.aldreteScore = pacuScore;
      setStored('surgeries', list);
      this.notify();
    }
  }

  // 4. Pathology Lab Orders (LIS)
  public getLabOrders(): PathologyLabOrder[] {
    return getStored<PathologyLabOrder[]>('lab_orders', INITIAL_LAB_ORDERS);
  }

  public createLabOrder(order: Omit<PathologyLabOrder, 'id'>) {
    const list = this.getLabOrders();
    const newOrder: PathologyLabOrder = {
      ...order,
      id: `LAB-ORD-${Date.now().toString().slice(-4)}`
    };
    list.unshift(newOrder);
    setStored('lab_orders', list);
    this.notify();
  }

  public logLabResult(orderId: string, paramIndex: number, value: string, isPanic: boolean) {
    const list = this.getLabOrders();
    const order = list.find((o) => o.id === orderId);
    if (order && order.parameters[paramIndex]) {
      order.parameters[paramIndex].value = value;
      order.parameters[paramIndex].isCritical = isPanic;
      if (isPanic) order.isPanicAlert = true;
      order.resultStatus = 'RESULT_READY';
      setStored('lab_orders', list);
      this.notify();
    }
  }

  public signOffPathology(orderId: string, pathologistName: string) {
    const list = this.getLabOrders();
    const order = list.find((o) => o.id === orderId);
    if (order) {
      order.resultStatus = 'AUTHORISED';
      order.pathologist = pathologistName;
      setStored('lab_orders', list);
      this.notify();
    }
  }

  // 5. Blood Bank Inventory
  public getBloodUnits(): BloodBankUnit[] {
    return getStored<BloodBankUnit[]>('blood_units', INITIAL_BLOOD_UNITS);
  }

  public reserveBloodUnits(bloodGroup: string, component: string, qty: number): boolean {
    const list = this.getBloodUnits();
    const item = list.find((b) => b.bloodGroup === bloodGroup && b.component === component);
    if (item && item.unitsAvailable >= qty) {
      item.unitsAvailable -= qty;
      item.unitsReserved += qty;
      setStored('blood_units', list);
      this.notify();
      return true;
    }
    return false;
  }

  // 6. Procurement & Purchase Orders
  public getPurchaseOrders(): PurchaseOrder[] {
    return getStored<PurchaseOrder[]>('purchase_orders', INITIAL_PURCHASE_ORDERS);
  }

  public createPurchaseOrder(po: Omit<PurchaseOrder, 'id'>) {
    const list = this.getPurchaseOrders();
    const newPo: PurchaseOrder = {
      ...po,
      id: `PO-${Date.now().toString().slice(-4)}`
    };
    list.unshift(newPo);
    setStored('purchase_orders', list);
    this.notify();
  }

  public approvePo(poId: string) {
    const list = this.getPurchaseOrders();
    const item = list.find((p) => p.id === poId);
    if (item) {
      item.approvalStatus = 'APPROVED_CFO';
      setStored('purchase_orders', list);
      this.notify();
    }
  }

  // 7. TPA Insurance Claims
  public getTpaClaims(): TpaInsuranceClaim[] {
    return getStored<TpaInsuranceClaim[]>('tpa_claims', INITIAL_TPA_CLAIMS);
  }

  public submitTpaClaim(claim: Omit<TpaInsuranceClaim, 'id'>) {
    const list = this.getTpaClaims();
    const newClaim: TpaInsuranceClaim = {
      ...claim,
      id: `CLM-${Date.now().toString().slice(-4)}`
    };
    list.unshift(newClaim);
    setStored('tpa_claims', list);
    this.notify();
  }

  // 8. Patient Safety Incidents & CAPA
  public getIncidents(): SafetyIncident[] {
    return getStored<SafetyIncident[]>('incidents', INITIAL_INCIDENTS);
  }

  public logSafetyIncident(incident: Partial<SafetyIncident>) {
    const list = this.getIncidents();
    const newIncident: SafetyIncident = {
      id: `INC-${Date.now().toString().slice(-4)}`,
      incidentNumber: `INC-2026-${Date.now().toString().slice(-4)}`,
      incidentType: incident.incidentType || 'MEDICATION_ERROR',
      severity: incident.severity || 'MINOR',
      location: incident.location || 'Hospital Ward',
      description: incident.description || 'Routine safety log',
      reportDate: new Date().toISOString().split('T')[0],
      anonymous: incident.anonymous || false,
      reporterRole: incident.reporterRole || 'Healthcare Personnel',
      status: 'INVESTIGATING',
      branchId: 'branch-chennai-greams'
    };
    list.unshift(newIncident);
    setStored('incidents', list);
    this.notify();
  }

  // 9. Doctor Credentialing
  public getDoctorCredentials(): DoctorCredential[] {
    return getStored<DoctorCredential[]>('doctor_credentials', INITIAL_CREDENTIALS);
  }

  public verifyCredential(id: string, privilegeTier: DoctorCredential['privilegeTier']) {
    const list = this.getDoctorCredentials();
    const item = list.find((d) => d.id === id);
    if (item) {
      item.isAuthorized = true;
      item.privilegeTier = privilegeTier;
      setStored('doctor_credentials', list);
      this.notify();
    }
  }

  // 10. Statutory Compliance Licenses
  public getLicenses(): StatutoryLicenseItem[] {
    return getStored<StatutoryLicenseItem[]>('statutory_licenses', INITIAL_LICENSES);
  }

  public renewLicense(id: string, newExpiryDate: string) {
    const list = this.getLicenses();
    const item = list.find((l) => l.id === id);
    if (item) {
      item.validUntil = newExpiryDate;
      item.status = 'VALID';
      item.daysRemaining = 365;
      setStored('statutory_licenses', list);
      this.notify();
    }
  }
}

export const enterpriseStore = new EnterpriseDataStore();
