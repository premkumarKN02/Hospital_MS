package com.hospital.modules.clinical;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "appointments")
@Getter
@Setter
public class AppointmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "hospital_id")
    private UUID hospitalId = UUID.fromString("55555555-0001-0000-0000-000000000001");

    @Column(name = "branch_id")
    private UUID branchId = UUID.fromString("55555555-0002-0000-0000-000000000001");

    @Column(name = "department_id")
    private UUID departmentId = UUID.fromString("55555555-0003-0000-0000-000000000001");

    @Column(name = "appointment_no", unique = true, length = 50)
    private String appointmentNo;

    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @Column(name = "doctor_id", nullable = false)
    private UUID doctorId;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "slot_start_time", nullable = false)
    private LocalTime appointmentTime = LocalTime.of(10, 0);

    @Column(name = "slot_end_time")
    private LocalTime slotEndTime = LocalTime.of(10, 30);

    @Column(name = "appointment_type", length = 50)
    private String appointmentType = "FIRST_VISIT";

    @Column(name = "booking_source", length = 50)
    private String bookingSource = "PATIENT_PORTAL";

    @Column(length = 50)
    private String status = "REQUESTED";

    @Column(name = "notes", columnDefinition = "TEXT")
    private String visitReason;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Persisted fee and payment status
    @Column(name = "consultation_fee", precision = 10, scale = 2)
    private BigDecimal consultationFee = BigDecimal.valueOf(500.00);

    @Column(name = "paid")
    private Boolean paid = Boolean.FALSE;

    public Boolean getPaid() {
        return this.paid != null ? this.paid : Boolean.FALSE;
    }

    public boolean isPaid() {
        return Boolean.TRUE.equals(this.paid);
    }

    public BigDecimal getConsultationFee() {
        return this.consultationFee != null ? this.consultationFee : BigDecimal.valueOf(500.00);
    }
}
