-- ==============================================================================
-- HOSPITAL INTEGRATED OPERATING PLATFORM - V2 MASTER SEED DATA
-- ==============================================================================

-- 1. PERMISSIONS
INSERT INTO permissions (id, code, category, description) VALUES
('11111111-0001-0000-0000-000000000001', 'patient.view', 'PATIENT', 'View patient master demographics and contact information'),
('11111111-0001-0000-0000-000000000002', 'patient.create', 'PATIENT', 'Register new patients into the master index'),
('11111111-0001-0000-0000-000000000003', 'patient.update', 'PATIENT', 'Modify permitted patient demographic and contact fields'),
('11111111-0001-0000-0000-000000000004', 'patient.merge', 'PATIENT', 'Initiate and execute controlled duplicate patient merges'),

('11111111-0002-0000-0000-000000000001', 'appointment.view', 'APPOINTMENT', 'View appointment schedules and status'),
('11111111-0002-0000-0000-000000000002', 'appointment.create', 'APPOINTMENT', 'Book consultation appointments'),
('11111111-0002-0000-0000-000000000003', 'appointment.cancel', 'APPOINTMENT', 'Cancel or reschedule existing appointments'),
('11111111-0002-0000-0000-000000000004', 'appointment.checkin', 'APPOINTMENT', 'Check in patients and issue OPD queue tokens'),

('11111111-0003-0000-0000-000000000001', 'clinical.view', 'CLINICAL', 'Access patient clinical history, notes, and records'),
('11111111-0003-0000-0000-000000000002', 'clinical.create', 'CLINICAL', 'Create encounter notes, diagnoses, and examination findings'),
('11111111-0003-0000-0000-000000000003', 'clinical.sign', 'CLINICAL', 'Digitally sign and finalize clinical consultation encounters'),
('11111111-0003-0000-0000-000000000004', 'prescription.create', 'CLINICAL', 'Author digital prescriptions with medicine instructions'),

('11111111-0004-0000-0000-000000000001', 'inpatient.admit', 'INPATIENT', 'Process inpatient admissions and discharge workflows'),
('11111111-0004-0000-0000-000000000002', 'inpatient.beds', 'INPATIENT', 'Manage bed assignments, room transfers, and census'),
('11111111-0004-0000-0000-000000000003', 'nursing.chart', 'INPATIENT', 'Record nursing vitals, intake/output, and progress notes'),
('11111111-0004-0000-0000-000000000004', 'nursing.mar', 'INPATIENT', 'Execute and chart Medication Administration Record (MAR)'),

('11111111-0005-0000-0000-000000000001', 'lab.order', 'DIAGNOSTICS', 'Order laboratory diagnostic tests'),
('11111111-0005-0000-0000-000000000002', 'lab.collect', 'DIAGNOSTICS', 'Collect phlebotomy samples and generate barcodes'),
('11111111-0005-0000-0000-000000000003', 'lab.process', 'DIAGNOSTICS', 'Enter laboratory test results and flags'),
('11111111-0005-0000-0000-000000000004', 'lab.verify', 'DIAGNOSTICS', 'Verify, sign, and release finalized laboratory reports'),
('11111111-0005-0000-0000-000000000005', 'radiology.manage', 'DIAGNOSTICS', 'Schedule imaging and verify radiology reports'),

('11111111-0006-0000-0000-000000000001', 'pharmacy.dispense', 'PHARMACY', 'Dispense prescriptions and deduct batch inventory'),
('11111111-0006-0000-0000-000000000002', 'inventory.manage', 'PHARMACY', 'Manage medicine stock, batches, GRNs, and adjustments'),

('11111111-0007-0000-0000-000000000001', 'billing.view', 'FINANCE', 'View patient bills, tariffs, and payment status'),
('11111111-0007-0000-0000-000000000002', 'billing.create', 'FINANCE', 'Generate hospital invoices and debit notes'),
('11111111-0007-0000-0000-000000000003', 'payment.record', 'FINANCE', 'Collect and record payments and print official receipts'),
('11111111-0007-0000-0000-000000000004', 'finance.ledger', 'FINANCE', 'Access double-entry general ledger, journals, and reports'),
('11111111-0007-0000-0000-000000000005', 'insurance.claims', 'FINANCE', 'Manage TPA pre-authorization and insurance claim settlement'),

('11111111-0008-0000-0000-000000000001', 'employee.manage', 'HRMS', 'Maintain employee records, attendance, rosters, and leaves'),
('11111111-0008-0000-0000-000000000002', 'employee.approve', 'HRMS', 'Review and approve/reject new staff registration requests'),
('11111111-0008-0000-0000-000000000003', 'payroll.process', 'HRMS', 'Calculate, review, and finalize monthly payroll runs'),

('11111111-0009-0000-0000-000000000001', 'audit.view', 'QUALITY', 'View hospital quality audits, plans, and dashboards'),
('11111111-0009-0000-0000-000000000002', 'audit.execute', 'QUALITY', 'Conduct scheduled quality audits and log scoring/evidence'),
('11111111-0009-0000-0000-000000000003', 'capa.manage', 'QUALITY', 'Raise non-conformity findings, submit 5-Whys, and verify CAPA'),
('11111111-0009-0000-0000-000000000004', 'safety.incidents', 'QUALITY', 'Log and investigate clinical safety incidents and adverse events'),
('11111111-0009-0000-0000-000000000005', 'risk.manage', 'QUALITY', 'Maintain the enterprise 5x5 clinical and operational risk register'),

('11111111-0010-0000-0000-000000000001', 'crm.leads', 'CRM', 'Manage patient enquiries, callbacks, and campaigns'),
('11111111-0010-0000-0000-000000000002', 'crm.complaints', 'CRM', 'Track patient grievances with SLA timers and escalation'),
('11111111-0010-0000-0000-000000000003', 'communication.dispatch', 'CRM', 'Trigger multi-channel SMS, WhatsApp, and Email alerts'),

('11111111-0099-0000-0000-000000000001', 'admin.system', 'ADMIN', 'Super administrator access to configuration, sessions, and logs');

-- 2. QUALITY STANDARDS & CLAUSES (NABH 5TH EDITION)
INSERT INTO quality_standards (id, code, name, authority, is_active) VALUES
('22222222-0001-0000-0000-000000000001', 'NABH_5TH_ED', 'NABH Accreditation Standards for Hospitals (5th Edition)', 'National Accreditation Board for Hospitals & Healthcare Providers', TRUE),
('22222222-0002-0000-0000-000000000002', 'JCI_7TH_ED', 'Joint Commission International Standards (7th Edition)', 'Joint Commission International', TRUE);

INSERT INTO standard_clauses (id, standard_id, chapter_name, clause_number, clause_title, requirement_text) VALUES
('22222222-0010-0000-0000-000000000001', '22222222-0001-0000-0000-000000000001', 'Access, Assessment and Continuity of Care (AAC)', 'AAC.1', 'Patient Registration & Triage', 'The organization has a well-defined registration process and standard triage system for emergency patients.'),
('22222222-0010-0000-0000-000000000002', '22222222-0001-0000-0000-000000000001', 'Care of Patients (COP)', 'COP.3', 'Emergency Services & Resuscitation', 'Emergency services are guided by documented procedures and resuscitation equipment is available, maintained, and verified.'),
('22222222-0010-0000-0000-000000000003', '22222222-0001-0000-0000-000000000001', 'Management of Medication (MOM)', 'MOM.4', 'Medication Storage & Expiry Control', 'Medications are stored safely with strict temperature control, high-alert drug segregation, and verified expiry tracking.'),
('22222222-0010-0000-0000-000000000004', '22222222-0001-0000-0000-000000000001', 'Hospital Infection Control (HIC)', 'HIC.2', 'Hand Hygiene & Sterilization Traceability', 'Documented infection prevention procedures are implemented, including WHO hand hygiene compliance and CSSD pack traceability.'),
('22222222-0010-0000-0000-000000000005', '22222222-0001-0000-0000-000000000001', 'Continuous Quality Improvement (CQI)', 'CQI.3', 'Incident Reporting & CAPA System', 'The organization maintains a robust reporting mechanism for adverse events, near misses, sentinel events, and verified CAPA resolution.'),
('22222222-0010-0000-0000-000000000006', '22222222-0001-0000-0000-000000000001', 'Facility Management and Safety (FMS)', 'FMS.4', 'Biomedical Equipment Calibration & Downtime', 'Medical equipment is inspected, calibrated, and maintained with documented records and SLA-driven maintenance work orders.');

-- 3. ITEM CATEGORIES (PHARMACY & INVENTORY)
INSERT INTO item_categories (id, code, name) VALUES
('33333333-0001-0000-0000-000000000001', 'TABLETS', 'Oral Tablets & Capsules'),
('33333333-0002-0000-0000-000000000002', 'SYRUPS', 'Liquid Syrups & Suspensions'),
('33333333-0003-0000-0000-000000000003', 'INJECTIONS', 'Injectable Vials & Ampoules'),
('33333333-0004-0000-0000-000000000004', 'IV_FLUIDS', 'Intravenous Fluids & Infusions'),
('33333333-0005-0000-0000-000000000005', 'CONSUMABLES', 'Medical & Surgical Consumables');

-- 4. RADIOLOGY CATALOG
INSERT INTO radiology_catalog (id, modality, procedure_code, procedure_name, preparation_instructions, tariff_rate) VALUES
('44444444-0001-0000-0000-000000000001', 'X_RAY', 'RAD-XR-01', 'Chest X-Ray PA View', 'Remove all metallic objects and jewelry prior to examination.', 500.00),
('44444444-0002-0000-0000-000000000002', 'X_RAY', 'RAD-XR-02', 'X-Ray Knee Joint AP & Lateral', 'None required.', 750.00),
('44444444-0003-0000-0000-000000000003', 'ULTRASOUND', 'RAD-USG-01', 'Ultrasound Abdomen & Pelvis', 'Fasting for 4 hours; full urinary bladder required.', 1800.00),
('44444444-0004-0000-0000-000000000004', 'CT_SCAN', 'RAD-CT-01', 'CT Brain Plain', 'Remove hairpins and hearing aids.', 3500.00),
('44444444-0005-0000-0000-000000000005', 'MRI', 'RAD-MRI-01', 'MRI Lumbar Spine', 'Inform staff if patient has pacemaker or metallic implants.', 7500.00);
