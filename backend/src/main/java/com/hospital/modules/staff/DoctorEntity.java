package com.hospital.modules.staff;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "doctors")
@Getter
@Setter
public class DoctorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "department_id")
    private UUID departmentId;

    @Column(name = "registration_no", length = 50)
    private String registrationNo;

    @Column(length = 100)
    private String specialization;

    @Column(length = 100)
    private String qualification;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(name = "consultation_fee_opd", columnDefinition = "numeric(10,2)")
    private java.math.BigDecimal consultationFeeOpd;

    @Column(name = "consultation_fee_review", columnDefinition = "numeric(10,2)")
    private java.math.BigDecimal consultationFeeReview;

    @Column(name = "is_available_for_opd")
    private Boolean availableForOpd = true;

    @Column(name = "is_active")
    private Boolean active = true;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;
}
