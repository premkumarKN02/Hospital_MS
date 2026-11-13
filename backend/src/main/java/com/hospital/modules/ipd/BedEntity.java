package com.hospital.modules.ipd;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "beds")
@Getter
@Setter
public class BedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "room_id", nullable = false)
    private UUID roomId;

    @Column(name = "bed_number", nullable = false, length = 50)
    private String bedNumber;

    @Column(name = "bed_status", nullable = false, length = 50)
    private String bedStatus = "AVAILABLE"; // AVAILABLE, OCCUPIED, RESERVED, CLEANING, MAINTENANCE, BLOCKED

    @Column(name = "current_admission_id")
    private UUID currentAdmissionId;

    @Column(name = "version")
    private Long version = 0L;

    @Column(name = "is_active")
    private Boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Transient
    private String roomNumber;

    @Transient
    private String wardName;

    @Transient
    private String wardType; // ICU, GENERAL, PRIVATE, EMERGENCY

    @Transient
    private String patientName;

    @Transient
    private String patientUhid;
}
