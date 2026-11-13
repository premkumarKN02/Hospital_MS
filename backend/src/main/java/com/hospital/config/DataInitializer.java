package com.hospital.config;

import com.hospital.modules.clinical.AppointmentEntity;
import com.hospital.modules.clinical.AppointmentRepository;
import com.hospital.modules.patient.PatientEntity;
import com.hospital.modules.patient.PatientRepository;
import com.hospital.modules.user.UserEntity;
import com.hospital.modules.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Checking and initializing user account credentials and patient e-KYC data...");
        String encodedDefault = passwordEncoder.encode("password123");

        List<String> demoUsers = List.of(
                "admin", "dr.arun", "dr.sindhu", "nurse.kavitha",
                "reception", "lab.anand", "pharma.ravi", "quality.priya",
                "patient.rajesh"
        );

        for (String username : demoUsers) {
            userRepository.findByUsername(username).ifPresent(user -> {
                user.setPasswordHash(encodedDefault);
                user.setStatus("ACTIVE");
                userRepository.save(user);
                log.info("Initialized credentials for user: {}", username);
            });
        }

        // Initialize patient UHIDs, e-KYC and ABHA IDs
        List<PatientEntity> patients = patientRepository.findAll();
        int count = 1;
        for (PatientEntity p : patients) {
            boolean updated = false;
            if (p.getPatientId() == null || p.getPatientId().isBlank()) {
                p.setPatientId(String.format("SNHC-2024-%05d", count));
                updated = true;
            }
            if (p.getPhone() == null || p.getPhone().isBlank()) {
                p.setPhone("987654321" + count);
                updated = true;
            }
            if (p.getDateOfBirth() == null) {
                p.setDateOfBirth(LocalDate.of(1985 + (count * 2), (count % 12) + 1, 10 + count));
                updated = true;
            }
            if (p.getNationalId() == null || p.getNationalId().isBlank() || p.getNationalId().equals("XXXX-XXXX-XXXX")) {
                p.setNationalId("XXXX-XXXX-" + String.format("%04d", 4920 + count));
                updated = true;
            }
            if (p.getAbhaId() == null || p.getAbhaId().isBlank()) {
                p.setAbhaId(p.getPatientId().toLowerCase() + "@abdm");
                updated = true;
            }
            if (p.getKycStatus() == null || !p.getKycStatus().equals("VERIFIED")) {
                p.setKycStatus("VERIFIED");
                updated = true;
            }
            if (p.getConsentGiven() == null || !p.getConsentGiven()) {
                p.setConsentGiven(true);
                p.setConsentDate(LocalDate.now());
                updated = true;
            }
            if (updated) {
                patientRepository.save(p);
                log.info("Initialized e-KYC for patient {} -> UHID: {}, Aadhaar: {}", p.getFirstName(), p.getPatientId(), p.getNationalId());
            }
            count++;
        }

        // Ensure all appointments have proper fee, paid status, and patient association
        UUID rajeshPatientId = UUID.fromString("55555555-0011-0000-0000-000000000001");
        List<AppointmentEntity> appointments = appointmentRepository.findAll();
        for (AppointmentEntity a : appointments) {
            boolean updated = false;
            if (a.getConsultationFee() == null) {
                a.setConsultationFee(BigDecimal.valueOf(500.00));
                updated = true;
            }
            if (a.getPaid() == null) {
                a.setPaid(false);
                updated = true;
            }
            // Link patient portal bookings that had the previous fallback bug to Rajesh
            if ("PATIENT_PORTAL".equalsIgnoreCase(a.getBookingSource()) && a.getPatientId() != null
                    && !"55555555-0011-0000-0000-000000000002".equals(a.getPatientId().toString())) {
                if (!rajeshPatientId.equals(a.getPatientId())) {
                    a.setPatientId(rajeshPatientId);
                    updated = true;
                }
            }
            if (updated) {
                appointmentRepository.save(a);
            }
        }
        log.info("Synchronized and initialized {} clinical appointments.", appointments.size());
    }
}
