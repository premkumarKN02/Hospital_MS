package com.hospital.modules.public_api;

import com.hospital.modules.staff.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Public API endpoints accessible without authentication.
 * Used by the public-facing website pages.
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final DoctorRepository doctorRepository;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Hospital Unified Platform",
                "version", "1.0.0"
        ));
    }

    @GetMapping("/doctors")
    public ResponseEntity<?> getPublicDoctors() {
        return ResponseEntity.ok(doctorRepository.findByAvailableForOpdTrueAndActiveTrue());
    }

    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> submitContact(@RequestBody Map<String, String> body) {
        // In production: save to DB and send notification
        return ResponseEntity.ok(Map.of(
                "message", "Thank you! We will get back to you within 24 hours.",
                "status", "received"
        ));
    }

    @PostMapping("/appointment-request")
    public ResponseEntity<Map<String, String>> requestAppointment(@RequestBody Map<String, Object> body) {
        // In production: create appointment or send to CRM lead
        return ResponseEntity.ok(Map.of(
                "message", "Appointment request received. Our team will confirm shortly.",
                "status", "pending"
        ));
    }
}
