package com.hospital.modules.ipd;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "admissions")
@Getter
@Setter
public class AdmissionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "hospital_id", nullable = false)
    private UUID hospitalId = UUID.fromString("55555555-0001-0000-0000-000000000001");

    @Column(name = "admission_no", unique = true, nullable = false, length = 50)
    private String admissionNo;

    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @Column(name = "primary_doctor_id", nullable = false)
    private UUID primaryDoctorId;

    @Column(name = "department_id", nullable = false)
    private UUID departmentId;

    @Column(name = "bed_id", nullable = false)
    private UUID bedId;

    @CreationTimestamp
    @Column(name = "admission_date")
    private LocalDateTime admissionDate = LocalDateTime.now();

    @Column(name = "admission_type", nullable = false, length = 50)
    private String admissionType = "ELECTIVE"; // EMERGENCY, ELECTIVE, DAY_CARE

    @Column(name = "initial_diagnosis", nullable = false, columnDefinition = "TEXT")
    private String initialDiagnosis;

    @Column(name = "admission_status", nullable = false, length = 50)
    private String admissionStatus = "ADMITTED"; // ADMITTED, DISCHARGED

    @Column(name = "discharge_date")
    private LocalDateTime dischargeDate;

    @Column(name = "version")
    private Long version = 0L;
}
