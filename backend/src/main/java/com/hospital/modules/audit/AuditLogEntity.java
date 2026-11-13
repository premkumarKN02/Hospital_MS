package com.hospital.modules.audit;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
public class AuditLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hospital_id", nullable = false)
    private UUID hospitalId = UUID.fromString("55555555-0001-0000-0000-000000000001");

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "action", nullable = false, length = 100)
    private String action; // BREAK_GLASS_OVERRIDE, PATIENT_VIEW, LEAVE_APPROVED, MEDICATION_DISPENSED, BED_TRANSFER

    @Column(name = "entity_name", nullable = false, length = 100)
    private String entityName;

    @Column(name = "entity_id", nullable = false, length = 100)
    private String entityId;

    @Column(name = "ip_address", length = 100)
    private String ipAddress = "127.0.0.1";

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent = "HospitalOS-Enterprise-Client";

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Transient
    private String performedBy = "System Administrator";
}
