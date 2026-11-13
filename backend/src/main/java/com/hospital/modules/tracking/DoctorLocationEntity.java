package com.hospital.modules.tracking;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "doctor_locations")
@Getter
@Setter
public class DoctorLocationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "doctor_email", nullable = false, unique = true, length = 120)
    private String doctorEmail;

    @Column(name = "doctor_name", nullable = false, length = 100)
    private String doctorName;

    @Column(name = "employee_code", length = 30)
    private String employeeCode;

    @Column(name = "specialization", length = 100)
    private String specialization;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "accuracy_meters")
    private Double accuracyMeters;

    @Column(name = "speed_kmh")
    private Double speedKmh;

    @Column(name = "battery_level")
    private Integer batteryLevel;

    @Column(name = "status", length = 40)
    private String status; // ACTIVE_STREAMING, ON_CALL_STANDBY, IN_TRANSIT_TO_HOSPITAL, AT_CAMPUS, OFFLINE

    @Column(name = "distance_to_hospital_km")
    private Double distanceToHospitalKm;

    @Column(name = "eta_minutes")
    private Integer etaMinutes;

    @Column(name = "activation_token", length = 100)
    private String activationToken;

    @Column(name = "permission_granted")
    private Boolean permissionGranted = false;

    @Column(name = "permission_granted_at")
    private LocalDateTime permissionGrantedAt;

    @Column(name = "last_ping_at")
    private LocalDateTime lastPingAt;

    @Column(name = "invitation_sent_at")
    private LocalDateTime invitationSentAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
