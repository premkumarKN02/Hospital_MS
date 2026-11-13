-- ==============================================================================
-- HOSPITAL INTEGRATED OPERATING PLATFORM - V3 DEMO HOSPITAL SEED DATA
-- ==============================================================================

-- 1. HOSPITAL & BRANCHES
INSERT INTO hospitals (id, code, name, registration_no, address, contact_email, contact_phone, logo_url, is_active) VALUES
('55555555-0001-0000-0000-000000000001', 'SINDHU-MAIN', 'Sindhu Multispeciality Hospital & Research Center', 'TN-MED-REG-2024-8891', 'No. 14, 2nd Avenue, Anna Nagar East, Chennai - 600102, Tamil Nadu, India', 'contact@sindhuhospital.com', '+91 44 2626 5500', '/logo.png', TRUE);

INSERT INTO branches (id, hospital_id, code, name, address, city, state, pin_code, emergency_phone, is_active) VALUES
('55555555-0002-0000-0000-000000000001', '55555555-0001-0000-0000-000000000001', 'BRANCH-CHN', 'Main Campus - Anna Nagar', 'No. 14, 2nd Avenue, Anna Nagar East', 'Chennai', 'Tamil Nadu', '600102', '+91 44 2626 5599', TRUE),
('55555555-0002-0000-0000-000000000002', '55555555-0001-0000-0000-000000000001', 'BRANCH-MDU', 'South Branch - KK Nagar', '45, Lake View Road, KK Nagar', 'Madurai', 'Tamil Nadu', '625020', '+91 452 2588 599', TRUE),
('55555555-0002-0000-0000-000000000003', '55555555-0001-0000-0000-000000000001', 'BRANCH-CBE', 'Specialty Center - RS Puram', '88, Diwan Bahadur Road, RS Puram', 'Coimbatore', 'Tamil Nadu', '641002', '+91 422 2544 599', TRUE);

-- 2. DEPARTMENTS
INSERT INTO departments (id, branch_id, code, name, department_type, is_active) VALUES
('55555555-0003-0000-0000-000000000001', '55555555-0002-0000-0000-000000000001', 'CARDIOLOGY', 'Department of Cardiology & CCU', 'CLINICAL', TRUE),
('55555555-0003-0000-0000-000000000002', '55555555-0002-0000-0000-000000000001', 'GEN_MED', 'General & Internal Medicine', 'CLINICAL', TRUE),
('55555555-0003-0000-0000-000000000003', '55555555-0002-0000-0000-000000000001', 'PEDIATRICS', 'Pediatrics & Neonatology', 'CLINICAL', TRUE),
('55555555-0003-0000-0000-000000000004', '55555555-0002-0000-0000-000000000001', 'ORTHOPEDICS', 'Orthopedics & Joint Replacement', 'CLINICAL', TRUE),
('55555555-0003-0000-0000-000000000005', '55555555-0002-0000-0000-000000000001', 'EMERGENCY', '24x7 Emergency & Trauma Care', 'CLINICAL', TRUE),
('55555555-0003-0000-0000-000000000006', '55555555-0002-0000-0000-000000000001', 'PATHOLOGY', 'Central Diagnostic Laboratory (NABL Accredited)', 'DIAGNOSTIC', TRUE),
('55555555-0003-0000-0000-000000000007', '55555555-0002-0000-0000-000000000001', 'RADIOLOGY', 'Radiology & Advanced Imaging', 'DIAGNOSTIC', TRUE),
('55555555-0003-0000-0000-000000000008', '55555555-0002-0000-0000-000000000001', 'PHARMACY', '24x7 In-House Central Pharmacy', 'SUPPORT', TRUE),
('55555555-0003-0000-0000-000000000009', '55555555-0002-0000-0000-000000000001', 'QUALITY_ADMIN', 'Hospital Administration & Quality Directorate', 'ADMINISTRATIVE', TRUE);

-- 3. WARDS, ROOMS & BEDS
INSERT INTO wards (id, branch_id, department_id, name, ward_type, is_active) VALUES
('55555555-0004-0000-0000-000000000001', '55555555-0002-0000-0000-000000000001', '55555555-0003-0000-0000-000000000001', 'Intensive Coronary Care Unit (ICCU)', 'ICU', TRUE),
('55555555-0004-0000-0000-000000000002', '55555555-0002-0000-0000-000000000001', '55555555-0003-0000-0000-000000000002', 'General Medical Ward (Male)', 'GENERAL', TRUE),
('55555555-0004-0000-0000-000000000003', '55555555-0002-0000-0000-000000000001', '55555555-0003-0000-0000-000000000002', 'General Medical Ward (Female)', 'GENERAL', TRUE),
('55555555-0004-0000-0000-000000000004', '55555555-0002-0000-0000-000000000001', '55555555-0003-0000-0000-000000000002', 'Deluxe Private Suite Wing', 'PRIVATE', TRUE);

INSERT INTO rooms (id, ward_id, room_number, room_type, daily_rate) VALUES
('55555555-0005-0000-0000-000000000001', '55555555-0004-0000-0000-000000000001', 'ICU-ROOM-A', 'ICU_BAY', 5000.00),
('55555555-0005-0000-0000-000000000002', '55555555-0004-0000-0000-000000000002', 'GWM-BAY-1', 'MULTI_BED', 800.00),
('55555555-0005-0000-0000-000000000003', '55555555-0004-0000-0000-000000000003', 'GWF-BAY-1', 'MULTI_BED', 800.00),
('55555555-0005-0000-0000-000000000004', '55555555-0004-0000-0000-000000000004', 'DELUXE-301', 'SINGLE_ROOM', 3500.00),
('55555555-0005-0000-0000-000000000005', '55555555-0004-0000-0000-000000000004', 'DELUXE-302', 'SINGLE_ROOM', 3500.00);

INSERT INTO beds (id, room_id, bed_number, bed_status) VALUES
('55555555-0006-0000-0000-000000000001', '55555555-0005-0000-0000-000000000001', 'ICU-BED-01', 'OCCUPIED'),
('55555555-0006-0000-0000-000000000002', '55555555-0005-0000-0000-000000000001', 'ICU-BED-02', 'AVAILABLE'),
('55555555-0006-0000-0000-000000000003', '55555555-0005-0000-0000-000000000002', 'GWM-BED-01', 'AVAILABLE'),
('55555555-0006-0000-0000-000000000004', '55555555-0005-0000-0000-000000000002', 'GWM-BED-02', 'AVAILABLE'),
('55555555-0006-0000-0000-000000000005', '55555555-0005-0000-0000-000000000003', 'GWF-BED-01', 'AVAILABLE'),
('55555555-0006-0000-0000-000000000006', '55555555-0005-0000-0000-000000000004', 'DLX-BED-301', 'AVAILABLE'),
('55555555-0006-0000-0000-000000000007', '55555555-0005-0000-0000-000000000005', 'DLX-BED-302', 'CLEANING');

-- 4. ROLES
INSERT INTO roles (id, hospital_id, code, name, description, is_system_role) VALUES
('55555555-0007-0000-0000-000000000001', '55555555-0001-0000-0000-000000000001', 'SUPER_ADMIN', 'Super Administrator', 'Complete system-wide access across all branches and modules', TRUE),
('55555555-0007-0000-0000-000000000002', '55555555-0001-0000-0000-000000000001', 'HOSPITAL_ADMIN', 'Hospital Administrator', 'Manages hospital employees, doctors, departments, and configuration', TRUE),
('55555555-0007-0000-0000-000000000003', '55555555-0001-0000-0000-000000000001', 'DOCTOR', 'Consulting Doctor', 'Manages patient consultations, EMR notes, prescriptions, and orders', TRUE),
('55555555-0007-0000-0000-000000000004', '55555555-0001-0000-0000-000000000001', 'NURSE', 'Staff Nurse', 'Manages ward census, nursing vitals, handover, and MAR charting', TRUE),
('55555555-0007-0000-0000-000000000005', '55555555-0001-0000-0000-000000000001', 'RECEPTIONIST', 'Front Desk Receptionist', 'Registers patients, books appointments, and checks in queue tokens', TRUE),
('55555555-0007-0000-0000-000000000006', '55555555-0001-0000-0000-000000000001', 'LAB_TECHNICIAN', 'Laboratory Technician', 'Processes laboratory specimens, logs values, and generates reports', TRUE),
('55555555-0007-0000-0000-000000000007', '55555555-0001-0000-0000-000000000001', 'PHARMACIST', 'Hospital Pharmacist', 'Dispenses medication, validates dosages, and maintains stock ledger', TRUE),
('55555555-0007-0000-0000-000000000008', '55555555-0001-0000-0000-000000000001', 'BILLING_STAFF', 'Billing & Cashier Executive', 'Generates tax invoices, records payments, and issues receipts', TRUE),
('55555555-0007-0000-0000-000000000009', '55555555-0001-0000-0000-000000000001', 'QUALITY_MANAGER', 'Quality & NABH Lead', 'Plans quality audits, manages non-conformity findings, and verifies CAPA', TRUE),
('55555555-0007-0000-0000-000000000010', '55555555-0001-0000-0000-000000000001', 'PATIENT', 'Registered Patient', 'Accesses personal appointments, timeline, prescriptions, and invoices', TRUE);

-- Link all permissions to SUPER_ADMIN & HOSPITAL_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT '55555555-0007-0000-0000-000000000001', id FROM permissions;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '55555555-0007-0000-0000-000000000002', id FROM permissions;

-- Doctor Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT '55555555-0007-0000-0000-000000000003', id FROM permissions
WHERE code IN ('patient.view', 'appointment.view', 'clinical.view', 'clinical.create', 'clinical.sign', 'prescription.create', 'lab.order', 'radiology.manage', 'inpatient.admit', 'safety.incidents');

-- Nurse Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT '55555555-0007-0000-0000-000000000004', id FROM permissions
WHERE code IN ('patient.view', 'inpatient.beds', 'nursing.chart', 'nursing.mar', 'clinical.view', 'lab.collect', 'safety.incidents');

-- Reception Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT '55555555-0007-0000-0000-000000000005', id FROM permissions
WHERE code IN ('patient.view', 'patient.create', 'patient.update', 'appointment.view', 'appointment.create', 'appointment.cancel', 'appointment.checkin', 'billing.view', 'billing.create', 'payment.record');

-- 5. USERS (BCrypt password hash for: 'password123' -> '$2a$10$wT5g8n7e2W3h5bV6j1k9mOu3lQeR7yZ2p0t1v4x6z8A0b2d4f6h8j')
-- We use standard BCrypt hash: $2a$10$wT5g8n7e2W3h5bV6j1k9mOu3lQeR7yZ2p0t1v4x6z8A0b2d4f6h8j
INSERT INTO users (id, hospital_id, username, email, phone, password_hash, user_type, status) VALUES
('55555555-0008-0000-0000-000000000001', '55555555-0001-0000-0000-000000000001', 'admin', 'admin@sindhuhospital.com', '+919444011111', '$2a$10$wT5g8n7e2W3h5bV6j1k9mOu3lQeR7yZ2p0t1v4x6z8A0b2d4f6h8j', 'ADMIN', 'ACTIVE'),
('55555555-0008-0000-0000-000000000002', '55555555-0001-0000-0000-000000000001', 'dr.arun', 'dr.arun@sindhuhospital.com', '+919444022222', '$2a$10$wT5g8n7e2W3h5bV6j1k9mOu3lQeR7yZ2p0t1v4x6z8A0b2d4f6h8j', 'DOCTOR', 'ACTIVE'),
('55555555-0008-0000-0000-000000000003', '55555555-0001-0000-0000-000000000001', 'dr.sindhu', 'dr.sindhu@sindhuhospital.com', '+919444033333', '$2a$10$wT5g8n7e2W3h5bV6j1k9mOu3lQeR7yZ2p0t1v4x6z8A0b2d4f6h8j', 'DOCTOR', 'ACTIVE'),
('55555555-0008-0000-0000-000000000004', '55555555-0001-0000-0000-000000000001', 'nurse.kavitha', 'nurse.kavitha@sindhuhospital.com', '+919444044444', '$2a$10$wT5g8n7e2W3h5bV6j1k9mOu3lQeR7yZ2p0t1v4x6z8A0b2d4f6h8j', 'STAFF', 'ACTIVE'),
('55555555-0008-0000-0000-000000000005', '55555555-0001-0000-0000-000000000001', 'reception', 'reception@sindhuhospital.com', '+919444055555', '$2a$10$wT5g8n7e2W3h5bV6j1k9mOu3lQeR7yZ2p0t1v4x6z8A0b2d4f6h8j', 'STAFF', 'ACTIVE'),
('55555555-0008-0000-0000-000000000006', '55555555-0001-0000-0000-000000000001', 'lab.anand', 'lab.anand@sindhuhospital.com', '+919444066666', '$2a$10$wT5g8n7e2W3h5bV6j1k9mOu3lQeR7yZ2p0t1v4x6z8A0b2d4f6h8j', 'STAFF', 'ACTIVE'),
('55555555-0008-0000-0000-000000000007', '55555555-0001-0000-0000-000000000001', 'pharma.ravi', 'pharma.ravi@sindhuhospital.com', '+919444077777', '$2a$10$wT5g8n7e2W3h5bV6j1k9mOu3lQeR7yZ2p0t1v4x6z8A0b2d4f6h8j', 'STAFF', 'ACTIVE'),
('55555555-0008-0000-0000-000000000008', '55555555-0001-0000-0000-000000000001', 'quality.priya', 'quality.priya@sindhuhospital.com', '+919444088888', '$2a$10$wT5g8n7e2W3h5bV6j1k9mOu3lQeR7yZ2p0t1v4x6z8A0b2d4f6h8j', 'STAFF', 'ACTIVE'),
('55555555-0008-0000-0000-000000000009', '55555555-0001-0000-0000-000000000001', 'patient.rajesh', 'patient.rajesh@gmail.com', '+919876543210', '$2a$10$wT5g8n7e2W3h5bV6j1k9mOu3lQeR7yZ2p0t1v4x6z8A0b2d4f6h8j', 'PATIENT', 'ACTIVE');

-- Link User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
('55555555-0008-0000-0000-000000000001', '55555555-0007-0000-0000-000000000002'), -- Admin
('55555555-0008-0000-0000-000000000002', '55555555-0007-0000-0000-000000000003'), -- Dr. Arun (Cardiology)
('55555555-0008-0000-0000-000000000003', '55555555-0007-0000-0000-000000000003'), -- Dr. Sindhu (Gen Med)
('55555555-0008-0000-0000-000000000004', '55555555-0007-0000-0000-000000000004'), -- Nurse Kavitha
('55555555-0008-0000-0000-000000000005', '55555555-0007-0000-0000-000000000005'), -- Receptionist
('55555555-0008-0000-0000-000000000006', '55555555-0007-0000-0000-000000000006'), -- Lab Tech
('55555555-0008-0000-0000-000000000007', '55555555-0007-0000-0000-000000000007'), -- Pharmacist
('55555555-0008-0000-0000-000000000008', '55555555-0007-0000-0000-000000000009'), -- Quality Lead
('55555555-0008-0000-0000-000000000009', '55555555-0007-0000-0000-000000000010'); -- Patient Rajesh

-- 6. EMPLOYEES & DOCTORS
INSERT INTO employees (id, hospital_id, user_id, employee_id_display, first_name, last_name, designation, department_id, branch_id, joining_date, mobile, official_email) VALUES
('55555555-0009-0000-0000-000000000001', '55555555-0001-0000-0000-000000000001', '55555555-0008-0000-0000-000000000001', 'EMP-000001', 'Venkatesh', 'Ramanathan', 'Chief Operating Officer & Administrator', '55555555-0003-0000-0000-000000000009', '55555555-0002-0000-0000-000000000001', '2020-01-01', '+919444011111', 'admin@sindhuhospital.com'),
('55555555-0009-0000-0000-000000000002', '55555555-0001-0000-0000-000000000001', '55555555-0008-0000-0000-000000000002', 'EMP-000002', 'Arun', 'Kumar', 'Senior Consultant Cardiologist', '55555555-0003-0000-0000-000000000001', '55555555-0002-0000-0000-000000000001', '2021-03-15', '+919444022222', 'dr.arun@sindhuhospital.com'),
('55555555-0009-0000-0000-000000000003', '55555555-0001-0000-0000-000000000001', '55555555-0008-0000-0000-000000000003', 'EMP-000003', 'Sindhu', 'Rajagopalan', 'Head of Internal & Family Medicine', '55555555-0003-0000-0000-000000000002', '55555555-0002-0000-0000-000000000001', '2019-06-01', '+919444033333', 'dr.sindhu@sindhuhospital.com'),
('55555555-0009-0000-0000-000000000004', '55555555-0001-0000-0000-000000000001', '55555555-0008-0000-0000-000000000004', 'EMP-000004', 'Kavitha', 'Selvam', 'Senior Staff Nurse (ICU Lead)', '55555555-0003-0000-0000-000000000001', '55555555-0002-0000-0000-000000000001', '2022-02-10', '+919444044444', 'nurse.kavitha@sindhuhospital.com'),
('55555555-0009-0000-0000-000000000005', '55555555-0001-0000-0000-000000000001', '55555555-0008-0000-0000-000000000005', 'EMP-000005', 'Suresh', 'Babu', 'Front Office Executive', '55555555-0003-0000-0000-000000000009', '55555555-0002-0000-0000-000000000001', '2023-05-15', '+919444055555', 'reception@sindhuhospital.com'),
('55555555-0009-0000-0000-000000000006', '55555555-0001-0000-0000-000000000001', '55555555-0008-0000-0000-000000000006', 'EMP-000006', 'Anand', 'Krishnan', 'Senior Medical Lab Technologist', '55555555-0003-0000-0000-000000000006', '55555555-0002-0000-0000-000000000001', '2022-09-01', '+919444066666', 'lab.anand@sindhuhospital.com'),
('55555555-0009-0000-0000-000000000007', '55555555-0001-0000-0000-000000000001', '55555555-0008-0000-0000-000000000007', 'EMP-000007', 'Ravi', 'Shankar', 'Chief Pharmacist', '55555555-0003-0000-0000-000000000008', '55555555-0002-0000-0000-000000000001', '2021-11-20', '+919444077777', 'pharma.ravi@sindhuhospital.com'),
('55555555-0009-0000-0000-000000000008', '55555555-0001-0000-0000-000000000001', '55555555-0008-0000-0000-000000000008', 'EMP-000008', 'Priya', 'Darshini', 'Head of Quality & Accreditation (NABH)', '55555555-0003-0000-0000-000000000009', '55555555-0002-0000-0000-000000000001', '2021-01-15', '+919444088888', 'quality.priya@sindhuhospital.com');

INSERT INTO doctors (id, employee_id, doctor_id_display, specialization, qualifications, council_reg_no, experience_years, consultation_fee, bio) VALUES
('55555555-0010-0000-0000-000000000001', '55555555-0009-0000-0000-000000000002', 'DOC-000001', 'Interventional Cardiology', 'MBBS, MD (Gen Med), DM (Cardiology), FACC', 'TNMC-REG-54891', 16, 800.00, 'Specialist in interventional cardiology, coronary angioplasty, and cardiac rehabilitation with 16+ years experience.'),
('55555555-0010-0000-0000-000000000002', '55555555-0009-0000-0000-000000000003', 'DOC-000002', 'Internal & Family Medicine', 'MBBS, MD (Internal Medicine), FACP', 'TNMC-REG-61204', 18, 600.00, 'Expert in chronic lifestyle diseases, diabetes mellitus, preventive health checkups, and geriatric care.');

-- Doctor Weekly Schedules
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, max_patients_per_slot, branch_id) VALUES
('55555555-0010-0000-0000-000000000001', 1, '09:00:00', '13:00:00', 15, 1, '55555555-0002-0000-0000-000000000001'),
('55555555-0010-0000-0000-000000000001', 2, '09:00:00', '13:00:00', 15, 1, '55555555-0002-0000-0000-000000000001'),
('55555555-0010-0000-0000-000000000001', 3, '09:00:00', '13:00:00', 15, 1, '55555555-0002-0000-0000-000000000001'),
('55555555-0010-0000-0000-000000000001', 4, '09:00:00', '13:00:00', 15, 1, '55555555-0002-0000-0000-000000000001'),
('55555555-0010-0000-0000-000000000001', 5, '09:00:00', '13:00:00', 15, 1, '55555555-0002-0000-0000-000000000001'),
('55555555-0010-0000-0000-000000000001', 6, '09:00:00', '13:00:00', 15, 1, '55555555-0002-0000-0000-000000000001'),

('55555555-0010-0000-0000-000000000002', 1, '10:00:00', '14:00:00', 15, 1, '55555555-0002-0000-0000-000000000001'),
('55555555-0010-0000-0000-000000000002', 2, '10:00:00', '14:00:00', 15, 1, '55555555-0002-0000-0000-000000000001'),
('55555555-0010-0000-0000-000000000002', 3, '10:00:00', '14:00:00', 15, 1, '55555555-0002-0000-0000-000000000001'),
('55555555-0010-0000-0000-000000000002', 4, '10:00:00', '14:00:00', 15, 1, '55555555-0002-0000-0000-000000000001'),
('55555555-0010-0000-0000-000000000002', 5, '10:00:00', '14:00:00', 15, 1, '55555555-0002-0000-0000-000000000001'),
('55555555-0010-0000-0000-000000000002', 6, '10:00:00', '14:00:00', 15, 1, '55555555-0002-0000-0000-000000000001');

-- 7. PATIENTS & PORTAL ACCOUNTS
INSERT INTO patients (id, hospital_id, patient_id_display, first_name, last_name, dob, gender, blood_group, primary_mobile, email, address_line1, city, state, pin_code, emergency_contact_name, emergency_contact_relation, emergency_contact_phone, allergies, chronic_conditions) VALUES
('55555555-0011-0000-0000-000000000001', '55555555-0001-0000-0000-000000000001', 'PAT-2026-000001', 'Rajesh', 'Kannan', '1984-06-15', 'MALE', 'O+', '+919876543210', 'patient.rajesh@gmail.com', 'Flat 4B, Emerald Heights, Shanthi Colony, Anna Nagar', 'Chennai', 'Tamil Nadu', '600040', 'Deepa Rajesh', 'SPOUSE', '+919876543219', ARRAY['Penicillin'], ARRAY['Hypertension', 'Type 2 Diabetes']),
('55555555-0011-0000-0000-000000000002', '55555555-0001-0000-0000-000000000001', 'PAT-2026-000002', 'Meenakshi', 'Sundaram', '1961-02-28', 'FEMALE', 'B+', '+919876543211', 'meenakshi.s@gmail.com', 'No. 18, Mettu Street, Villivakkam', 'Chennai', 'Tamil Nadu', '600049', 'Sundaram K', 'SPOUSE', '+919876543218', ARRAY['Sulfa Drugs'], ARRAY['Ischemic Heart Disease', 'Osteoarthritis']),
('55555555-0011-0000-0000-000000000003', '55555555-0001-0000-0000-000000000001', 'PAT-2026-000003', 'Vijayalakshmi', 'Subramanian', '1997-11-12', 'FEMALE', 'A+', '+919876543212', 'vijaya.subramanian@gmail.com', '12, Nehru Nagar, Kilpauk', 'Chennai', 'Tamil Nadu', '600010', 'Subramanian S', 'FATHER', '+919876543217', ARRAY[]::TEXT[], ARRAY[]::TEXT[]);

INSERT INTO patient_portal_accounts (patient_id, user_id, is_active, registered_via) VALUES
('55555555-0011-0000-0000-000000000001', '55555555-0008-0000-0000-000000000009', TRUE, 'SELF_WEB');

-- 8. APPOINTMENTS & REAL QUEUE
INSERT INTO appointments (id, hospital_id, branch_id, appointment_no, patient_id, doctor_id, department_id, appointment_date, slot_start_time, slot_end_time, appointment_type, booking_source, status, notes) VALUES
('55555555-0012-0000-0000-000000000001', '55555555-0001-0000-0000-000000000001', '55555555-0002-0000-0000-000000000001', 'APT-2026-000001', '55555555-0011-0000-0000-000000000001', '55555555-0010-0000-0000-000000000001', '55555555-0003-0000-0000-000000000001', CURRENT_DATE, '09:30:00', '09:45:00', 'FIRST_VISIT', 'PATIENT_PORTAL', 'CHECKED_IN', 'Chest discomfort and shortness of breath during morning walks.'),
('55555555-0012-0000-0000-000000000002', '55555555-0001-0000-0000-000000000001', '55555555-0002-0000-0000-000000000001', 'APT-2026-000002', '55555555-0011-0000-0000-000000000003', '55555555-0010-0000-0000-000000000002', '55555555-0003-0000-0000-000000000002', CURRENT_DATE, '10:30:00', '10:45:00', 'FIRST_VISIT', 'PUBLIC_WEB', 'CONFIRMED', 'Persistent dry cough and low grade evening fever for 5 days.');

INSERT INTO opd_queues (branch_id, department_id, doctor_id, appointment_id, token_number, queue_status) VALUES
('55555555-0002-0000-0000-000000000001', '55555555-0003-0000-0000-000000000001', '55555555-0010-0000-0000-000000000001', '55555555-0012-0000-0000-000000000001', 1, 'WAITING');

-- 9. ADMISSION (MEENAKSHI SUNDARAM IN ICU-BED-01)
INSERT INTO admissions (id, hospital_id, admission_no, patient_id, primary_doctor_id, department_id, admission_type, bed_id, initial_diagnosis, admission_status) VALUES
('55555555-0013-0000-0000-000000000001', '55555555-0001-0000-0000-000000000001', 'ADM-2026-000001', '55555555-0011-0000-0000-000000000002', '55555555-0010-0000-0000-000000000001', '55555555-0003-0000-0000-000000000001', 'EMERGENCY', '55555555-0006-0000-0000-000000000001', 'Acute Coronary Syndrome - NSTEMI with moderate pulmonary edema', 'ADMITTED');

UPDATE beds SET current_admission_id = '55555555-0013-0000-0000-000000000001' WHERE id = '55555555-0006-0000-0000-000000000001';

-- Nursing Vitals for admitted patient
INSERT INTO nursing_vitals (admission_id, patient_id, recorded_by_nurse_id, temperature, systolic_bp, diastolic_bp, pulse, respiratory_rate, spo2, blood_sugar, notes) VALUES
('55555555-0013-0000-0000-000000000001', '55555555-0011-0000-0000-000000000002', '55555555-0009-0000-0000-000000000004', 98.6, 138, 88, 84, 18, 97, 142, 'Patient stable on 2L O2 nasal prongs. Chest pain resolved after sublingual NTG.');

-- 10. LAB CATALOG
INSERT INTO lab_test_catalog (hospital_id, test_code, test_name, category, sample_type, normal_range_male, normal_range_female, unit, turnaround_hours, tariff_rate) VALUES
('55555555-0001-0000-0000-000000000001', 'LAB-CBC', 'Complete Blood Count (CBC with ESR)', 'HEMATOLOGY', 'WHOLE_BLOOD', 'Hb: 13.0-17.0 g/dL', 'Hb: 12.0-15.0 g/dL', 'g/dL', 2, 450.00),
('55555555-0001-0000-0000-000000000001', 'LAB-LIPID', 'Comprehensive Lipid Profile', 'BIOCHEMISTRY', 'SERUM', 'Chol: < 200 mg/dL', 'Chol: < 200 mg/dL', 'mg/dL', 4, 850.00),
('55555555-0001-0000-0000-000000000001', 'LAB-HBA1C', 'Glycated Hemoglobin (HbA1c)', 'BIOCHEMISTRY', 'WHOLE_BLOOD', '< 5.7 %', '< 5.7 %', '%', 3, 600.00),
('55555555-0001-0000-0000-000000000001', 'LAB-LFT', 'Liver Function Test (LFT)', 'BIOCHEMISTRY', 'SERUM', 'Bilirubin: 0.2-1.2 mg/dL', 'Bilirubin: 0.2-1.2 mg/dL', 'mg/dL', 4, 900.00),
('55555555-0001-0000-0000-000000000001', 'LAB-RFT', 'Renal Function Test (RFT & Electrolytes)', 'BIOCHEMISTRY', 'SERUM', 'Creat: 0.7-1.3 mg/dL', 'Creat: 0.6-1.1 mg/dL', 'mg/dL', 4, 750.00),
('55555555-0001-0000-0000-000000000001', 'LAB-TROP-I', 'High Sensitivity Troponin I', 'BIOCHEMISTRY', 'SERUM', '< 0.04 ng/mL', '< 0.04 ng/mL', 'ng/mL', 1, 1400.00);

-- 11. PHARMACY ITEMS & BATCHES
INSERT INTO inventory_items (id, hospital_id, category_id, item_code, item_name, generic_name, unit_of_measure, min_stock_alert, reorder_quantity) VALUES
('55555555-0010-0000-0000-000000000001', '55555555-0001-0000-0000-000000000001', '33333333-0001-0000-0000-000000000001', 'MED-PCM-650', 'Dolo 650mg Tablet', 'Paracetamol 650mg', 'STRIP', 50, 200),
('55555555-0010-0000-0000-000000000002', '55555555-0001-0000-0000-000000000001', '33333333-0001-0000-0000-000000000001', 'MED-ATOR-20', 'Atorva 20mg Tablet', 'Atorvastatin Calcium 20mg', 'STRIP', 30, 100),
('55555555-0010-0000-0000-000000000003', '55555555-0001-0000-0000-000000000001', '33333333-0001-0000-0000-000000000001', 'MED-MET-500', 'Glycomet 500mg Tablet', 'Metformin Hydrochloride 500mg', 'STRIP', 40, 150),
('55555555-0010-0000-0000-000000000004', '55555555-0001-0000-0000-000000000001', '33333333-0001-0000-0000-000000000001', 'MED-PAN-40', 'Pan 40mg Tablet', 'Pantoprazole Sodium 40mg', 'STRIP', 50, 200);

INSERT INTO inventory_batches (item_id, branch_id, batch_number, expiry_date, cost_price, selling_mrp, current_stock) VALUES
('55555555-0010-0000-0000-000000000001', '55555555-0002-0000-0000-000000000001', 'B-PCM-24A', '2027-08-31', 18.50, 32.00, 340),
('55555555-0010-0000-0000-000000000002', '55555555-0002-0000-0000-000000000001', 'B-ATR-24K', '2027-11-30', 95.00, 150.00, 120),
('55555555-0010-0000-0000-000000000003', '55555555-0002-0000-0000-000000000001', 'B-MET-24D', '2026-12-31', 22.00, 42.00, 195),
('55555555-0010-0000-0000-000000000004', '55555555-0002-0000-0000-000000000001', 'B-PAN-25B', '2028-02-28', 55.00, 95.00, 210);

-- 12. CHART OF ACCOUNTS (DOUBLE-ENTRY ACCOUNTING)
INSERT INTO chart_of_accounts (hospital_id, account_code, account_name, account_type, current_balance) VALUES
('55555555-0001-0000-0000-000000000001', '1010', 'Cash on Hand (Main Hospital Cashier)', 'ASSET', 45200.00),
('55555555-0001-0000-0000-000000000001', '1020', 'HDFC Bank - Hospital Operating Account', 'ASSET', 845000.00),
('55555555-0001-0000-0000-000000000001', '1110', 'Accounts Receivable (Patient Outstanding)', 'ASSET', 125000.00),
('55555555-0001-0000-0000-000000000001', '1210', 'Pharmacy Medicine Inventory Asset', 'ASSET', 312000.00),
('55555555-0001-0000-0000-000000000001', '4010', 'Outpatient Consultation Revenue', 'REVENUE', 248000.00),
('55555555-0001-0000-0000-000000000001', '4020', 'Inpatient Bed & Room Charges Revenue', 'REVENUE', 580000.00),
('55555555-0001-0000-0000-000000000001', '4030', 'Laboratory & Diagnostic Revenue', 'REVENUE', 195000.00),
('55555555-0001-0000-0000-000000000001', '4040', 'Pharmacy Medicine Sales Revenue', 'REVENUE', 420000.00);

-- 13. NABH QUALITY AUDIT & ACTIVE CAPA
INSERT INTO audit_templates (id, hospital_id, standard_id, template_name, version_number) VALUES
('55555555-0020-0000-0000-000000000001', '55555555-0001-0000-0000-000000000001', '22222222-0001-0000-0000-000000000001', 'Quarterly Clinical & Medication Safety Audit', 1);

INSERT INTO audit_template_questions (id, template_id, clause_id, question_text, compliance_criteria, weightage) VALUES
('55555555-0021-0000-0000-000000000001', '55555555-0020-0000-0000-000000000001', '22222222-0010-0000-0000-000000000003', 'Are high-alert medications segregated with distinct LASA (Look-Alike Sound-Alike) labeling?', 'Visual verification of pharmacy racks & emergency crash carts.', 5),
('55555555-0021-0000-0000-000000000002', '55555555-0020-0000-0000-000000000001', '22222222-0010-0000-0000-000000000004', 'Is WHO 5-Moments Hand Hygiene compliance documented and verified in ICU?', 'Check ICU nursing logs and sanitizer dispensers.', 4);

INSERT INTO quality_audits (id, hospital_id, template_id, audit_code, title, department_id, lead_auditor_id, scheduled_date, status, overall_score) VALUES
('55555555-0022-0000-0000-000000000001', '55555555-0001-0000-0000-000000000001', '55555555-0020-0000-0000-000000000001', 'AUD-2026-Q3-01', 'Q3 Clinical Medication & Infection Control Audit', '55555555-0003-0000-0000-000000000008', '55555555-0009-0000-0000-000000000008', CURRENT_DATE, 'IN_PROGRESS', 85.50);

INSERT INTO audit_findings (id, audit_id, clause_id, finding_code, severity, description, department_head_id, due_date, status) VALUES
('55555555-0023-0000-0000-000000000001', '55555555-0022-0000-0000-000000000001', '22222222-0010-0000-0000-000000000003', 'FND-2026-001', 'CRITICAL', 'Two LASA ampoules (Dopamine vs Dobutamine) stored in adjacent trays without neon warning tags in Main Pharmacy.', '55555555-0009-0000-0000-000000000007', CURRENT_DATE + INTERVAL '7 days', 'CAPA_SUBMITTED');

INSERT INTO capa_actions (id, finding_id, root_cause_analysis, corrective_action, preventive_action, action_owner_id, target_completion_date, status) VALUES
('55555555-0024-0000-0000-000000000001', '55555555-0023-0000-0000-000000000001', '5-Whys Analysis: New dispensary intern restocked crash-cart bins without cross-checking the LASA color-coded visual guide.', 'Segregated Dopamine and Dobutamine trays immediately with high-contrast fluorescent red dividers.', 'Implemented mandatory barcode scan verification prior to bin placement and re-trained all 8 pharmacy dispensary technicians.', '55555555-0009-0000-0000-000000000007', CURRENT_DATE + INTERVAL '5 days', 'IMPLEMENTED');

-- 14. ENTERPRISE 5x5 RISK REGISTER
INSERT INTO risk_registers (hospital_id, risk_code, risk_category, description, likelihood, severity, current_controls, mitigation_plan, risk_owner_id, review_date) VALUES
('55555555-0001-0000-0000-000000000001', 'RSK-CLIN-01', 'CLINICAL', 'High-alert medication dispensing error during peak emergency hours', 2, 4, 'Dual nursing sign-off required for IV narcotics', 'Introduce automated barcode scanning at bed-side MAR station', '55555555-0009-0000-0000-000000000008', CURRENT_DATE + INTERVAL '30 days'),
('55555555-0001-0000-0000-000000000001', 'RSK-OPER-02', 'OPERATIONAL', 'Central oxygen supply manifold pressure drop during monsoon power outages', 1, 5, 'Dual automated diesel generators and 48-hr liquid oxygen reserve tank', 'Daily biomedical pressure telemetry logging and weekly switchover drill', '55555555-0009-0000-0000-000000000001', CURRENT_DATE + INTERVAL '15 days');

-- 15. COMMUNICATION TEMPLATES (ENGLISH & TAMIL)
INSERT INTO communication_templates (hospital_id, template_code, channel, language, template_subject, template_body) VALUES
('55555555-0001-0000-0000-000000000001', 'APPT_CONFIRM', 'SMS', 'en', 'Appointment Confirmed', 'Dear {{patient_name}}, your appointment with {{doctor_name}} is confirmed for {{appointment_date}} at {{slot_time}}. Token: #{{token_number}}. - Sindhu Hospital'),
('55555555-0001-0000-0000-000000000001', 'APPT_CONFIRM', 'SMS', 'ta', 'சந்திப்பு உறுதி செய்யப்பட்டது', 'அன்புள்ள {{patient_name}}, {{doctor_name}} உடனான உங்கள் மருத்துவ சந்திப்பு {{appointment_date}} அன்று {{slot_time}} மணிக்கு உறுதி செய்யப்பட்டுள்ளது. டோக்கன் எண்: #{{token_number}}. - சிந்து மருத்துவமனை'),
('55555555-0001-0000-0000-000000000001', 'LAB_READY', 'WHATSAPP', 'en', 'Lab Report Ready', 'Dear {{patient_name}}, your laboratory test report for {{test_name}} is now verified and available on your Patient Portal. Download at {{portal_link}}.'),
('55555555-0001-0000-0000-000000000001', 'LAB_READY', 'WHATSAPP', 'ta', 'பரிசோதனை அறிக்கை தயார்', 'அன்புள்ள {{patient_name}}, தங்களின் {{test_name}} ஆய்வக அறிக்கை சரிபார்க்கப்பட்டு தயார் நிலையில் உள்ளது. உங்கள் நோயாளி தளத்தில் தரவிறக்கம் செய்யலாம்: {{portal_link}}.');
