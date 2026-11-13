-- ==============================================================================
-- HOSPITAL INTEGRATED OPERATING PLATFORM - V1 INITIAL RELATIONAL SCHEMA
-- ==============================================================================

-- 1. TENANTS & HOSPITALS
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    registration_no VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    contact_email VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    logo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE RESTRICT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(20) NOT NULL,
    emergency_phone VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hospital_id, code)
);

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    department_type VARCHAR(50) NOT NULL, -- CLINICAL, DIAGNOSTIC, ADMINISTRATIVE, SUPPORT
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(branch_id, code)
);

CREATE TABLE wards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    ward_type VARCHAR(50) NOT NULL, -- GENERAL, SEMI_PRIVATE, PRIVATE, ICU, EMERGENCY, POST_OP
    gender_restriction VARCHAR(20) DEFAULT 'NONE',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id UUID NOT NULL REFERENCES wards(id) ON DELETE RESTRICT,
    room_number VARCHAR(50) NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    daily_rate NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ward_id, room_number)
);

CREATE TABLE beds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    bed_number VARCHAR(50) NOT NULL,
    bed_status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE, OCCUPIED, RESERVED, CLEANING, MAINTENANCE, BLOCKED
    current_admission_id UUID,
    version BIGINT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(room_id, bed_number)
);

-- 2. IDENTITY, ROLES, PERMISSIONS & AUDITING
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL, -- STAFF, DOCTOR, PATIENT, ADMIN, SUPER_ADMIN
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, INVITED, PENDING_APPROVAL, APPROVED, ACTIVE, SUSPENDED, LOCKED, REJECTED, DEACTIVATED, TERMINATED
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    code VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    UNIQUE(hospital_id, code)
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY(role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id),
    department_id UUID REFERENCES departments(id),
    PRIMARY KEY(user_id, role_id)
);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(100) NOT NULL,
    user_agent TEXT NOT NULL,
    device_info VARCHAR(255),
    last_activity TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE
);

CREATE TABLE login_attempts (
    id BIGSERIAL PRIMARY KEY,
    identifier VARCHAR(150) NOT NULL,
    ip_address VARCHAR(100) NOT NULL,
    user_agent TEXT,
    status VARCHAR(50) NOT NULL,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    previous_state JSONB,
    new_state JSONB,
    ip_address VARCHAR(100),
    user_agent TEXT,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_name, entity_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- 3. PATIENTS & CAREGIVERS
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    patient_id_display VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    marital_status VARCHAR(50),
    primary_mobile VARCHAR(50) NOT NULL,
    alt_mobile VARCHAR(50),
    email VARCHAR(150),
    national_id_type VARCHAR(50),
    national_id_masked VARCHAR(50),
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(20) NOT NULL,
    emergency_contact_name VARCHAR(150) NOT NULL,
    emergency_contact_relation VARCHAR(50) NOT NULL,
    emergency_contact_phone VARCHAR(50) NOT NULL,
    allergies TEXT[],
    chronic_conditions TEXT[],
    is_merged BOOLEAN DEFAULT FALSE,
    merged_into_patient_id UUID REFERENCES patients(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_patients_mobile ON patients(primary_mobile);
CREATE INDEX idx_patients_name_dob ON patients(dob, first_name, last_name);

CREATE TABLE patient_portal_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    registered_via VARCHAR(50) DEFAULT 'SELF_WEB',
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE patient_merge_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_patient_id UUID NOT NULL REFERENCES patients(id),
    target_patient_id UUID NOT NULL REFERENCES patients(id),
    reason TEXT NOT NULL,
    approved_by_user_id UUID NOT NULL REFERENCES users(id),
    merged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    snapshot_data JSONB NOT NULL
);

CREATE TABLE patient_caregivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    caregiver_user_id UUID NOT NULL REFERENCES users(id),
    relationship VARCHAR(50) NOT NULL,
    permissions JSONB NOT NULL,
    consent_recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE patient_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    consent_type VARCHAR(100) NOT NULL,
    granted BOOLEAN NOT NULL DEFAULT TRUE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(100),
    signature_image_url VARCHAR(500)
);

-- 4. STAFF & DOCTORS
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id),
    employee_id_display VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    designation VARCHAR(150) NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    reporting_manager_id UUID REFERENCES employees(id),
    joining_date DATE NOT NULL,
    employment_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    official_email VARCHAR(150),
    mobile VARCHAR(50) NOT NULL,
    work_location VARCHAR(100),
    professional_license_number VARCHAR(100),
    license_expiry_date DATE,
    credentials_status VARCHAR(50) DEFAULT 'VERIFIED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE staff_registration_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    applicant_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    mobile VARCHAR(50) NOT NULL,
    requested_role_id UUID NOT NULL REFERENCES roles(id),
    requested_department_id UUID NOT NULL REFERENCES departments(id),
    requested_branch_id UUID NOT NULL REFERENCES branches(id),
    qualifications TEXT NOT NULL,
    resume_file_url VARCHAR(500),
    id_proof_url VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_ADMIN_APPROVAL',
    admin_notes TEXT,
    reviewed_by_user_id UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID UNIQUE NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    doctor_id_display VARCHAR(50) UNIQUE NOT NULL,
    specialization VARCHAR(150) NOT NULL,
    qualifications VARCHAR(255) NOT NULL,
    council_reg_no VARCHAR(100) NOT NULL,
    experience_years INT NOT NULL DEFAULT 0,
    consultation_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    opd_room_id UUID REFERENCES rooms(id),
    bio TEXT,
    is_available_for_teleconsult BOOLEAN DEFAULT TRUE
);

CREATE TABLE doctor_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK(day_of_week BETWEEN 1 AND 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INT NOT NULL DEFAULT 15,
    max_patients_per_slot INT NOT NULL DEFAULT 1,
    branch_id UUID NOT NULL REFERENCES branches(id)
);

-- 5. APPOINTMENTS, QUEUES & CLINICAL EMR
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    appointment_no VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    appointment_date DATE NOT NULL,
    slot_start_time TIME NOT NULL,
    slot_end_time TIME NOT NULL,
    appointment_type VARCHAR(50) NOT NULL, -- FIRST_VISIT, FOLLOW_UP, EMERGENCY, TELECONSULT
    booking_source VARCHAR(50) NOT NULL, -- PUBLIC_WEB, PATIENT_PORTAL, RECEPTION, DOCTOR
    status VARCHAR(50) NOT NULL DEFAULT 'REQUESTED',
    cancellation_reason TEXT,
    notes TEXT,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX idx_slot_collision ON appointments(doctor_id, appointment_date, slot_start_time) WHERE status NOT IN ('CANCELLED', 'RESCHEDULED');

CREATE TABLE opd_queues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    appointment_id UUID UNIQUE NOT NULL REFERENCES appointments(id),
    token_number INT NOT NULL,
    queue_status VARCHAR(50) NOT NULL DEFAULT 'WAITING',
    checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    consultation_started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE encounters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    appointment_id UUID REFERENCES appointments(id),
    encounter_type VARCHAR(50) NOT NULL, -- OPD, IPD, EMERGENCY
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    encounter_status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS'
);

CREATE TABLE clinical_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID UNIQUE NOT NULL REFERENCES encounters(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    chief_complaints JSONB NOT NULL,
    examination_findings TEXT,
    clinical_assessment TEXT NOT NULL,
    treatment_plan TEXT NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE,
    signature_hash VARCHAR(255),
    is_amended BOOLEAN DEFAULT FALSE,
    amendment_reason TEXT
);

CREATE TABLE symptoms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id),
    symptom_name VARCHAR(150) NOT NULL,
    severity VARCHAR(50),
    duration VARCHAR(50),
    notes TEXT
);

CREATE TABLE diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id),
    icd10_code VARCHAR(20) NOT NULL,
    diagnosis_title VARCHAR(255) NOT NULL,
    diagnosis_type VARCHAR(50) NOT NULL DEFAULT 'FINAL',
    notes TEXT
);

CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    prescription_no VARCHAR(50) UNIQUE NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    general_instructions TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ISSUED'
);

CREATE TABLE prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL,
    medicine_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    route VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    duration_days INT NOT NULL,
    quantity INT NOT NULL,
    instructions TEXT,
    food_relation VARCHAR(50) NOT NULL
);

-- 6. INPATIENT, NURSING & SURGERIES
CREATE TABLE admissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    admission_no VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID NOT NULL REFERENCES patients(id),
    primary_doctor_id UUID NOT NULL REFERENCES doctors(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    admission_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    admission_type VARCHAR(50) NOT NULL,
    bed_id UUID NOT NULL REFERENCES beds(id),
    initial_diagnosis TEXT NOT NULL,
    admission_status VARCHAR(50) NOT NULL DEFAULT 'ADMITTED',
    discharge_date TIMESTAMP WITH TIME ZONE,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE bed_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_id UUID NOT NULL REFERENCES admissions(id),
    from_bed_id UUID NOT NULL REFERENCES beds(id),
    to_bed_id UUID NOT NULL REFERENCES beds(id),
    transfer_reason TEXT NOT NULL,
    requested_by_user_id UUID NOT NULL REFERENCES users(id),
    approved_by_user_id UUID NOT NULL REFERENCES users(id),
    transferred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nursing_vitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_id UUID NOT NULL REFERENCES admissions(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    recorded_by_nurse_id UUID NOT NULL REFERENCES employees(id),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    temperature NUMERIC(4,1) NOT NULL,
    systolic_bp INT NOT NULL,
    diastolic_bp INT NOT NULL,
    pulse INT NOT NULL,
    respiratory_rate INT NOT NULL,
    spo2 INT NOT NULL,
    blood_sugar INT,
    notes TEXT
);

CREATE TABLE nursing_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_id UUID NOT NULL REFERENCES admissions(id),
    recorded_by_nurse_id UUID NOT NULL REFERENCES employees(id),
    note_type VARCHAR(50) NOT NULL,
    note_text TEXT NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medication_administrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_id UUID NOT NULL REFERENCES admissions(id),
    prescription_item_id UUID NOT NULL REFERENCES prescription_items(id),
    administered_by_nurse_id UUID NOT NULL REFERENCES employees(id),
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    administered_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL,
    reason TEXT
);

CREATE TABLE surgeries_ot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    ot_room_id UUID NOT NULL REFERENCES rooms(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    lead_surgeon_id UUID NOT NULL REFERENCES doctors(id),
    anesthetist_id UUID NOT NULL REFERENCES doctors(id),
    procedure_name VARCHAR(255) NOT NULL,
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_start TIMESTAMP WITH TIME ZONE,
    actual_end TIMESTAMP WITH TIME ZONE,
    pre_op_checklist JSONB NOT NULL,
    surgery_status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    implants_used JSONB,
    post_op_notes TEXT
);

CREATE TABLE discharge_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_id UUID UNIQUE NOT NULL REFERENCES admissions(id),
    prepared_by_doctor_id UUID NOT NULL REFERENCES doctors(id),
    final_diagnosis TEXT NOT NULL,
    treatment_summary TEXT NOT NULL,
    discharge_condition VARCHAR(100) NOT NULL,
    medication_advice TEXT NOT NULL,
    follow_up_instructions TEXT NOT NULL,
    follow_up_date DATE,
    signed_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 7. DIAGNOSTICS (LAB & RADIOLOGY)
CREATE TABLE lab_test_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    test_code VARCHAR(50) NOT NULL,
    test_name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sample_type VARCHAR(100) NOT NULL,
    normal_range_male VARCHAR(100),
    normal_range_female VARCHAR(100),
    unit VARCHAR(50),
    turnaround_hours INT NOT NULL DEFAULT 4,
    tariff_rate NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(hospital_id, test_code)
);

CREATE TABLE lab_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID REFERENCES encounters(id),
    admission_id UUID REFERENCES admissions(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    ordering_doctor_id UUID NOT NULL REFERENCES doctors(id),
    order_no VARCHAR(50) UNIQUE NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'ROUTINE',
    order_status VARCHAR(50) NOT NULL DEFAULT 'PLACED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lab_samples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_order_id UUID NOT NULL REFERENCES lab_orders(id) ON DELETE CASCADE,
    barcode VARCHAR(100) UNIQUE NOT NULL,
    sample_type VARCHAR(100) NOT NULL,
    collected_by_technician_id UUID NOT NULL REFERENCES employees(id),
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sample_status VARCHAR(50) NOT NULL DEFAULT 'COLLECTED'
);

CREATE TABLE lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_order_id UUID NOT NULL REFERENCES lab_orders(id),
    test_id UUID NOT NULL REFERENCES lab_test_catalog(id),
    observed_value VARCHAR(100) NOT NULL,
    is_abnormal BOOLEAN DEFAULT FALSE,
    is_critical BOOLEAN DEFAULT FALSE,
    critical_alert_sent BOOLEAN DEFAULT FALSE,
    technician_notes TEXT,
    entered_by_id UUID NOT NULL REFERENCES employees(id),
    entered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_by_pathologist_id UUID REFERENCES doctors(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    report_pdf_url VARCHAR(500)
);

CREATE TABLE radiology_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    modality VARCHAR(50) NOT NULL,
    procedure_code VARCHAR(50) NOT NULL,
    procedure_name VARCHAR(200) NOT NULL,
    preparation_instructions TEXT,
    tariff_rate NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    UNIQUE(modality, procedure_code)
);

CREATE TABLE radiology_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID REFERENCES encounters(id),
    admission_id UUID REFERENCES admissions(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    procedure_id UUID NOT NULL REFERENCES radiology_catalog(id),
    order_status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED'
);

CREATE TABLE radiology_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID UNIQUE NOT NULL REFERENCES radiology_orders(id),
    radiologist_id UUID NOT NULL REFERENCES doctors(id),
    findings TEXT NOT NULL,
    impression TEXT NOT NULL,
    image_urls TEXT[],
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    report_pdf_url VARCHAR(500)
);

-- 8. PHARMACY & INVENTORY
CREATE TABLE item_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL
);

CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    category_id UUID NOT NULL REFERENCES item_categories(id),
    item_code VARCHAR(50) NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200),
    unit_of_measure VARCHAR(50) NOT NULL,
    min_stock_alert INT NOT NULL DEFAULT 10,
    reorder_quantity INT NOT NULL DEFAULT 50,
    requires_prescription BOOLEAN DEFAULT TRUE,
    is_hazardous BOOLEAN DEFAULT FALSE,
    UNIQUE(hospital_id, item_code)
);

CREATE TABLE inventory_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES inventory_items(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    batch_number VARCHAR(100) NOT NULL,
    expiry_date DATE NOT NULL,
    cost_price NUMERIC(10,2) NOT NULL,
    selling_mrp NUMERIC(10,2) NOT NULL,
    current_stock INT NOT NULL DEFAULT 0 CHECK(current_stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, branch_id, batch_number)
);

CREATE TABLE stock_ledger (
    id BIGSERIAL PRIMARY KEY,
    batch_id UUID NOT NULL REFERENCES inventory_batches(id),
    movement_type VARCHAR(50) NOT NULL,
    quantity_change INT NOT NULL,
    balance_after INT NOT NULL,
    reference_doc_type VARCHAR(50) NOT NULL,
    reference_doc_id VARCHAR(100) NOT NULL,
    performed_by_user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    vendor_name VARCHAR(200) NOT NULL,
    gstin VARCHAR(50) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    payment_terms_days INT DEFAULT 30
);

CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    order_date DATE NOT NULL,
    expected_delivery_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ISSUED',
    total_tax NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    approved_by_user_id UUID NOT NULL REFERENCES users(id)
);

CREATE TABLE goods_receipt_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id),
    grn_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_number VARCHAR(100) NOT NULL,
    received_date DATE NOT NULL,
    inspected_by_user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'ACCEPTED'
);

CREATE TABLE pharmacy_dispensings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL REFERENCES prescriptions(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    pharmacist_id UUID NOT NULL REFERENCES employees(id),
    total_amount NUMERIC(12,2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PAID',
    dispensed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. BILLING & FINANCE
CREATE TABLE service_tariffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    service_code VARCHAR(50) NOT NULL,
    service_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    standard_rate NUMERIC(12,2) NOT NULL,
    tax_percentage NUMERIC(5,2) DEFAULT 0.00,
    UNIQUE(hospital_id, service_code)
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID NOT NULL REFERENCES patients(id),
    encounter_id UUID REFERENCES encounters(id),
    admission_id UUID REFERENCES admissions(id),
    subtotal NUMERIC(12,2) NOT NULL,
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12,2) NOT NULL,
    paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    balance_amount NUMERIC(12,2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_by_user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL,
    reference_id VARCHAR(100),
    description VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12,2) NOT NULL,
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    total_price NUMERIC(12,2) NOT NULL
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    payment_mode VARCHAR(50) NOT NULL,
    transaction_reference VARCHAR(150),
    payment_gateway_order_id VARCHAR(150),
    payment_gateway_payment_id VARCHAR(150),
    status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
    collected_by_user_id UUID NOT NULL REFERENCES users(id),
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    idempotency_key VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    account_code VARCHAR(50) NOT NULL,
    account_name VARCHAR(150) NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    current_balance NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    UNIQUE(hospital_id, account_code)
);

CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    entry_date DATE NOT NULL,
    reference_type VARCHAR(50) NOT NULL,
    reference_id VARCHAR(100) NOT NULL,
    narration TEXT NOT NULL,
    created_by_user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE journal_entry_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES chart_of_accounts(id),
    debit_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    credit_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00
);

CREATE TABLE insurance_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_id UUID NOT NULL REFERENCES admissions(id),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    tpa_provider_name VARCHAR(150) NOT NULL,
    policy_number VARCHAR(100) NOT NULL,
    pre_auth_amount NUMERIC(12,2) NOT NULL,
    claimed_amount NUMERIC(12,2) NOT NULL,
    approved_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    claim_status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    remarks TEXT
);

-- 10. HRMS & PAYROLL
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

CREATE TABLE employee_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    attendance_date DATE NOT NULL,
    clock_in TIMESTAMP WITH TIME ZONE,
    clock_out TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'PRESENT',
    shift_id UUID REFERENCES shifts(id),
    UNIQUE(employee_id, attendance_date)
);

CREATE TABLE staff_rosters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    shift_id UUID NOT NULL REFERENCES shifts(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    roster_date DATE NOT NULL,
    UNIQUE(employee_id, roster_date)
);

CREATE TABLE leave_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    approved_by_user_id UUID REFERENCES users(id)
);

CREATE TABLE payroll_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    month INT NOT NULL CHECK(month BETWEEN 1 AND 12),
    year INT NOT NULL,
    total_gross NUMERIC(14,2) NOT NULL,
    total_deductions NUMERIC(14,2) NOT NULL,
    total_net NUMERIC(14,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    finalized_by_user_id UUID REFERENCES users(id),
    finalized_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(hospital_id, month, year)
);

CREATE TABLE payslips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_run_id UUID NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id),
    basic_salary NUMERIC(12,2) NOT NULL,
    hra NUMERIC(12,2) NOT NULL,
    allowances NUMERIC(12,2) NOT NULL,
    pf_deduction NUMERIC(12,2) NOT NULL,
    tax_deduction NUMERIC(12,2) NOT NULL,
    net_pay NUMERIC(12,2) NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE
);

-- 11. QUALITY, AUDIT, CAPA & SAFETY
CREATE TABLE quality_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    authority VARCHAR(150) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE standard_clauses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    standard_id UUID NOT NULL REFERENCES quality_standards(id) ON DELETE CASCADE,
    chapter_name VARCHAR(200) NOT NULL,
    clause_number VARCHAR(50) NOT NULL,
    clause_title VARCHAR(255) NOT NULL,
    requirement_text TEXT NOT NULL,
    UNIQUE(standard_id, clause_number)
);

CREATE TABLE audit_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    standard_id UUID NOT NULL REFERENCES quality_standards(id),
    template_name VARCHAR(255) NOT NULL,
    target_department_id UUID REFERENCES departments(id),
    version_number INT NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE audit_template_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES audit_templates(id) ON DELETE CASCADE,
    clause_id UUID NOT NULL REFERENCES standard_clauses(id),
    question_text TEXT NOT NULL,
    compliance_criteria TEXT NOT NULL,
    weightage INT NOT NULL DEFAULT 1,
    is_mandatory BOOLEAN DEFAULT TRUE
);

CREATE TABLE quality_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    template_id UUID NOT NULL REFERENCES audit_templates(id),
    audit_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    lead_auditor_id UUID NOT NULL REFERENCES employees(id),
    scheduled_date DATE NOT NULL,
    completion_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    overall_score NUMERIC(5,2)
);

CREATE TABLE audit_question_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES quality_audits(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES audit_template_questions(id),
    score VARCHAR(50) NOT NULL,
    auditor_comments TEXT,
    evidence_file_url VARCHAR(500)
);

CREATE TABLE audit_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES quality_audits(id),
    clause_id UUID NOT NULL REFERENCES standard_clauses(id),
    finding_code VARCHAR(50) UNIQUE NOT NULL,
    severity VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    department_head_id UUID NOT NULL REFERENCES employees(id),
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN'
);

CREATE TABLE capa_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    finding_id UUID UNIQUE NOT NULL REFERENCES audit_findings(id),
    root_cause_analysis TEXT NOT NULL,
    corrective_action TEXT NOT NULL,
    preventive_action TEXT NOT NULL,
    action_owner_id UUID NOT NULL REFERENCES employees(id),
    target_completion_date DATE NOT NULL,
    actual_completion_date DATE,
    implementation_evidence_url VARCHAR(500),
    quality_verifier_id UUID REFERENCES employees(id),
    verification_notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PROPOSED',
    effectiveness_check_date DATE,
    re_audit_required BOOLEAN DEFAULT FALSE
);

CREATE TABLE safety_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    incident_code VARCHAR(50) UNIQUE NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    date_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reported_by_user_id UUID NOT NULL REFERENCES users(id),
    patient_id UUID REFERENCES patients(id),
    severity_level VARCHAR(50) NOT NULL,
    immediate_action_taken TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'REPORTED'
);

CREATE TABLE risk_registers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    risk_code VARCHAR(50) UNIQUE NOT NULL,
    risk_category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    likelihood INT NOT NULL CHECK(likelihood BETWEEN 1 AND 5),
    severity INT NOT NULL CHECK(severity BETWEEN 1 AND 5),
    risk_score INT GENERATED ALWAYS AS (likelihood * severity) STORED,
    current_controls TEXT NOT NULL,
    mitigation_plan TEXT NOT NULL,
    risk_owner_id UUID NOT NULL REFERENCES employees(id),
    review_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE'
);

-- 12. CRM, COMMUNICATIONS & AI
CREATE TABLE crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    patient_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    source VARCHAR(50) NOT NULL,
    department_id UUID REFERENCES departments(id),
    status VARCHAR(50) NOT NULL DEFAULT 'NEW',
    assigned_to_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crm_complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    complaint_no VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID NOT NULL REFERENCES patients(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    sla_due_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_escalated BOOLEAN DEFAULT FALSE,
    assigned_staff_id UUID REFERENCES employees(id),
    resolution_text TEXT,
    patient_accepted_resolution BOOLEAN,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN'
);

CREATE TABLE crm_patient_feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID REFERENCES doctors(id),
    appointment_id UUID REFERENCES appointments(id),
    overall_rating INT NOT NULL CHECK(overall_rating BETWEEN 1 AND 5),
    consultation_rating INT CHECK(consultation_rating BETWEEN 1 AND 5),
    wait_time_rating INT CHECK(wait_time_rating BETWEEN 1 AND 5),
    cleanliness_rating INT CHECK(cleanliness_rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE communication_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    template_code VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    template_subject VARCHAR(255),
    template_body TEXT NOT NULL,
    dlt_template_id VARCHAR(100),
    is_approved BOOLEAN DEFAULT TRUE,
    UNIQUE(hospital_id, template_code, channel, language)
);

CREATE TABLE communication_logs (
    id BIGSERIAL PRIMARY KEY,
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    recipient_phone VARCHAR(50),
    recipient_email VARCHAR(150),
    recipient_patient_id UUID REFERENCES patients(id),
    recipient_staff_id UUID REFERENCES employees(id),
    channel VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    message_body TEXT NOT NULL,
    provider_message_id VARCHAR(150),
    delivery_status VARCHAR(50) NOT NULL DEFAULT 'QUEUED',
    error_reason TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_assistant_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    session_id VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_assistant_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_assistant_conversations(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL,
    message_text TEXT NOT NULL,
    voice_transcription TEXT,
    proposed_action_payload JSONB,
    executed_action_status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
