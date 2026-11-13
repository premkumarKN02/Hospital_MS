package com.hospital.modules.patient;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "patients")
@Getter
@Setter
public class PatientEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "patient_id", unique = true, length = 20)
    private String patientId; // e.g. SNHC-2024-00001

    @Column(name = "first_name", nullable = false, length = 60)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 60)
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 10)
    private String gender;

    @Column(length = 15)
    private String phone;

    @Column(length = 120)
    private String email;

    @Column(name = "address_line1")
    private String addressLine1;

    @Column(name = "address_line2")
    private String addressLine2;

    @Column(length = 60)
    private String city;

    @Column(length = 60)
    private String state;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(length = 60)
    private String country;

    @Column(name = "blood_group", length = 5)
    private String bloodGroup;

    @Column(name = "allergy_info", columnDefinition = "TEXT")
    private String allergyInfo;

    @Column(name = "emergency_contact_name", length = 100)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 15)
    private String emergencyContactPhone;

    @Column(name = "emergency_contact_relation", length = 50)
    private String emergencyContactRelation;

    @Column(name = "insurance_provider", length = 100)
    private String insuranceProvider;

    @Column(name = "insurance_policy_no", length = 50)
    private String insurancePolicyNo;

    @Column(name = "national_id", length = 30)
    private String nationalId;

    @Column(name = "abha_id", length = 60)
    private String abhaId;

    @Column(name = "kyc_status", length = 30)
    private String kycStatus = "VERIFIED";

    @Column(name = "is_active")
    private Boolean active = true;

    @Column(name = "consent_given")
    private Boolean consentGiven = false;

    @Column(name = "consent_date")
    private LocalDate consentDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "registered_by")
    private UUID registeredBy;
}
