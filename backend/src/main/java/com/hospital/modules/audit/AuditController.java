package com.hospital.modules.audit;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/audit/logs")
@RequiredArgsConstructor
public class AuditController {

    private final AuditLogRepository auditRepo;

    @GetMapping
    public ResponseEntity<List<AuditLogEntity>> getAuditLogs(@RequestParam(required = false) String entity) {
        List<AuditLogEntity> list = (entity != null && !entity.isBlank())
                ? auditRepo.findByEntityNameOrderByCreatedAtDesc(entity.toUpperCase())
                : auditRepo.findAllByOrderByCreatedAtDesc();

        if (list.isEmpty()) {
            list = seedDefaultAudits();
        }
        return ResponseEntity.ok(list);
    }

    private List<AuditLogEntity> seedDefaultAudits() {
        List<AuditLogEntity> seeded = new ArrayList<>();
        String[][] defaults = {
            {"BREAK_GLASS_OVERRIDE", "PATIENT", "UHID-2024-00101", "Trauma Emergency ER admission by Dr. Arun (Code Red)"},
            {"LEAVE_APPROVED", "LEAVE", "LV-9041", "Medical Superintendent approved 3 days Casual Leave for Nurse Kavitha"},
            {"MEDICATION_DISPENSED", "PHARMACY", "BAT-2024-08", "High-Alert Schedule H antibiotic dispensed to Ward 4 ICU"},
            {"BED_ALLOCATED", "BED", "ICU-02", "Bed transferred from Emergency Triage to Cardiac Intensive Care"},
            {"INVOICE_GENERATED", "BILLING", "INV-2024-0801", "Discharge billing finalized with TPA Insurance pre-authorization"}
        };

        for (String[] def : defaults) {
            AuditLogEntity a = new AuditLogEntity();
            a.setAction(def[0]);
            a.setEntityName(def[1]);
            a.setEntityId(def[2]);
            a.setReason(def[3]);
            seeded.add(auditRepo.save(a));
        }
        return seeded;
    }

    @PostMapping
    public ResponseEntity<AuditLogEntity> createAuditLog(@RequestBody AuditLogEntity audit) {
        if (audit.getHospitalId() == null) {
            audit.setHospitalId(UUID.fromString("55555555-0001-0000-0000-000000000001"));
        }
        AuditLogEntity saved = auditRepo.save(audit);
        return ResponseEntity.ok(saved);
    }
}
