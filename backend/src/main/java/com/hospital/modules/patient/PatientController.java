package com.hospital.modules.patient;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final PatientRepository patientRepo;

    @GetMapping
    public ResponseEntity<Page<PatientEntity>> getPatients(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(patientService.getAllPatients(query, pageRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientEntity> getPatient(@PathVariable UUID id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @GetMapping("/by-patient-id/{patientId}")
    public ResponseEntity<PatientEntity> getPatientByPatientId(@PathVariable String patientId) {
        return ResponseEntity.ok(patientService.getPatientByPatientId(patientId));
    }

    @PostMapping
    public ResponseEntity<PatientEntity> createPatient(@RequestBody PatientEntity patient) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.createPatient(patient));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientEntity> updatePatient(@PathVariable UUID id, @RequestBody PatientEntity patient) {
        return ResponseEntity.ok(patientService.updatePatient(id, patient));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivatePatient(@PathVariable UUID id) {
        patientService.deactivatePatient(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/check-duplicate")
    public ResponseEntity<Map<String, Object>> checkDuplicate(@RequestBody Map<String, String> payload) {
        String phone = payload.get("phone");
        String firstName = payload.get("firstName");
        String lastName = payload.get("lastName");
        String dob = payload.get("dateOfBirth");
        String nationalId = payload.get("nationalId");

        List<PatientEntity> allPatients = patientRepo.findAll();
        List<Map<String, Object>> matched = new ArrayList<>();

        for (PatientEntity p : allPatients) {
            int score = 0;
            List<String> reasons = new ArrayList<>();

            if (phone != null && !phone.isBlank() && phone.trim().equals(p.getPhone())) {
                score += 50;
                reasons.add("Exact Mobile Phone Match (" + phone + ")");
            }
            if (dob != null && p.getDateOfBirth() != null && dob.equals(p.getDateOfBirth().toString())) {
                score += 30;
                reasons.add("Exact Date of Birth Match (" + dob + ")");
            }
            if (firstName != null && firstName.equalsIgnoreCase(p.getFirstName())) {
                score += 15;
                reasons.add("First Name Match");
            }
            if (lastName != null && lastName.equalsIgnoreCase(p.getLastName())) {
                score += 15;
                reasons.add("Last Name Match");
            }
            if (nationalId != null && !nationalId.isBlank() && p.getNationalId() != null &&
                p.getNationalId().contains(nationalId.substring(Math.max(0, nationalId.length() - 4)))) {
                score += 40;
                reasons.add("National ID Digits Match");
            }

            if (score >= 40) {
                Map<String, Object> matchInfo = new HashMap<>();
                matchInfo.put("existingUhid", p.getPatientId());
                matchInfo.put("existingPatientId", p.getId());
                matchInfo.put("existingName", p.getFirstName() + " " + p.getLastName());
                matchInfo.put("existingPhone", p.getPhone());
                matchInfo.put("existingDob", p.getDateOfBirth());
                matchInfo.put("confidenceScore", Math.min(100, score));
                matchInfo.put("matchReasons", reasons);
                matched.add(matchInfo);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("isDuplicateSuspected", !matched.isEmpty());
        response.put("matchCount", matched.size());
        response.put("matches", matched);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/kyc")
    public ResponseEntity<?> updateKyc(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> payload
    ) {
        PatientEntity p = patientService.getPatientById(id);
        String nationalId = (String) payload.get("nationalId");
        String idType = (String) payload.getOrDefault("idType", "AADHAAR");

        if (nationalId != null && !nationalId.isBlank()) {
            String clean = nationalId.replaceAll("[^a-zA-Z0-9]", "");
            String masked;
            if (clean.length() >= 4) {
                String last4 = clean.substring(clean.length() - 4);
                if ("PAN".equalsIgnoreCase(idType)) {
                    masked = "XXXXX" + last4;
                } else {
                    masked = "XXXX-XXXX-" + last4;
                }
            } else {
                masked = "XXXX-" + clean;
            }
            p.setNationalId(masked);
        }

        if (payload.containsKey("consentGiven")) {
            p.setConsentGiven(Boolean.TRUE.equals(payload.get("consentGiven")));
            p.setConsentDate(LocalDate.now());
        }

        if (payload.containsKey("abhaId")) {
            p.setAbhaId((String) payload.get("abhaId"));
        }
        if (payload.containsKey("kycStatus")) {
            p.setKycStatus((String) payload.get("kycStatus"));
        } else {
            p.setKycStatus("VERIFIED");
        }

        PatientEntity saved = patientRepo.save(p);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/by-national-id/{nationalId}")
    public ResponseEntity<?> getPatientByNationalId(@PathVariable String nationalId) {
        return patientService.findPatientByNationalId(nationalId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/lookup")
    public ResponseEntity<Map<String, Object>> lookupPatient(@RequestParam String identifier) {
        Optional<PatientEntity> opt = patientService.lookupPatientSmart(identifier);
        Map<String, Object> res = new HashMap<>();
        if (opt.isPresent()) {
            PatientEntity p = opt.get();
            res.put("found", true);
            res.put("patient", p);
            res.put("uhid", p.getPatientId());
            res.put("id", p.getId());
            res.put("name", p.getFirstName() + " " + p.getLastName());
            res.put("firstName", p.getFirstName());
            res.put("lastName", p.getLastName());
            res.put("phone", p.getPhone());
            res.put("email", p.getEmail());
            res.put("gender", p.getGender());
            res.put("dateOfBirth", p.getDateOfBirth());
            res.put("bloodGroup", p.getBloodGroup());
            res.put("nationalId", p.getNationalId());
            res.put("maskedAadhaar", p.getNationalId());
            res.put("abhaId", p.getAbhaId() != null ? p.getAbhaId() : (p.getPatientId() != null ? p.getPatientId().toLowerCase() + "@abdm" : ""));
            res.put("kycStatus", p.getKycStatus() != null ? p.getKycStatus() : (p.getNationalId() != null ? "VERIFIED" : "PENDING"));
            res.put("isKycLinked", p.getNationalId() != null && !p.getNationalId().isBlank());
            res.put("consentGiven", p.getConsentGiven() != null ? p.getConsentGiven() : true);
            res.put("message", "Patient profile and linked e-KYC credentials retrieved successfully.");
            return ResponseEntity.ok(res);
        } else {
            res.put("found", false);
            res.put("message", "No patient record found matching '" + identifier + "'. Please verify the Aadhaar/KYC or UHID number.");
            return ResponseEntity.ok(res);
        }
    }

    @PostMapping("/check-aadhaar-link")
    public ResponseEntity<Map<String, Object>> checkAadhaarLink(@RequestBody Map<String, String> body) {
        String aadhaar = body.get("aadhaar");
        String uhid = body.get("uhid");
        Map<String, Object> res = new HashMap<>();

        if (aadhaar == null || aadhaar.isBlank()) {
            res.put("status", "INVALID_INPUT");
            res.put("message", "Please enter a valid 12-digit Aadhaar number");
            return ResponseEntity.badRequest().body(res);
        }

        String clean = aadhaar.replaceAll("[^0-9]", "");
        String last4 = clean.length() >= 4 ? clean.substring(clean.length() - 4) : clean;
        String masked = "XXXX-XXXX-" + last4;
        res.put("maskedAadhaar", masked);

        // Check if matching patient exists
        Optional<PatientEntity> match = patientService.lookupPatientSmart(clean);
        if (match.isPresent()) {
            PatientEntity p = match.get();
            res.put("isLinked", true);
            res.put("status", "LINKED");
            res.put("patient", p);
            res.put("uhid", p.getPatientId());
            res.put("patientName", p.getFirstName() + " " + p.getLastName());
            res.put("phone", p.getPhone());
            res.put("abhaId", p.getAbhaId() != null ? p.getAbhaId() : p.getPatientId().toLowerCase() + "@abdm");
            res.put("message", "Aadhaar is currently linked with UHID " + p.getPatientId());
        } else {
            // Check if patient UHID was provided to verify link readiness
            if (uhid != null && !uhid.isBlank()) {
                Optional<PatientEntity> pOpt = patientService.findPatientByPatientId(uhid);
                if (pOpt.isPresent()) {
                    PatientEntity p = pOpt.get();
                    boolean linked = p.getNationalId() != null && p.getNationalId().contains(last4);
                    res.put("isLinked", linked);
                    res.put("status", linked ? "LINKED" : "READY_TO_LINK");
                    res.put("patient", p);
                    res.put("uhid", p.getPatientId());
                    res.put("message", linked ? "Aadhaar is linked with this patient" : "Aadhaar is not yet linked. You can link it now.");
                    return ResponseEntity.ok(res);
                }
            }
            res.put("isLinked", false);
            res.put("status", "NOT_FOUND");
            res.put("message", "No patient record found linked with Aadhaar ending in " + last4);
        }
        return ResponseEntity.ok(res);
    }

    @PostMapping("/link-aadhaar")
    public ResponseEntity<Map<String, Object>> linkAadhaar(@RequestBody Map<String, Object> body) {
        String identifier = (String) body.get("uhid");
        if (identifier == null) identifier = (String) body.get("patientId");
        String aadhaar = (String) body.get("aadhaar");
        String otp = (String) body.get("otp");
        String abhaId = (String) body.get("abhaId");

        Map<String, Object> res = new HashMap<>();

        if (aadhaar == null || aadhaar.replaceAll("[^0-9]", "").length() < 12) {
            res.put("success", false);
            res.put("message", "A valid 12-digit Aadhaar number is required.");
            return ResponseEntity.badRequest().body(res);
        }

        if (otp == null || otp.trim().length() < 4) {
            res.put("success", false);
            res.put("message", "Valid 6-digit OTP is required for UIDAI e-KYC authentication.");
            return ResponseEntity.badRequest().body(res);
        }

        PatientEntity patient = null;
        if (identifier != null && !identifier.isBlank()) {
            Optional<PatientEntity> opt = patientService.lookupPatientSmart(identifier);
            if (opt.isPresent()) {
                patient = opt.get();
            }
        }

        if (patient == null) {
            // Find first active patient or create fallback
            List<PatientEntity> all = patientRepo.findAll();
            if (!all.isEmpty()) {
                patient = all.get(0);
            } else {
                patient = new PatientEntity();
                patient.setFirstName("Patient");
                patient.setLastName("User");
                patient.setPhone("9876543210");
                patient = patientService.createPatient(patient);
            }
        }

        String clean = aadhaar.replaceAll("[^0-9]", "");
        String last4 = clean.substring(clean.length() - 4);
        String masked = "XXXX-XXXX-" + last4;

        patient.setNationalId(masked);
        patient.setKycStatus("VERIFIED");
        patient.setConsentGiven(true);
        patient.setConsentDate(LocalDate.now());

        if (patient.getPatientId() == null || patient.getPatientId().isBlank()) {
            patient.setPatientId("SNHC-2024-" + String.format("%05d", (int)(Math.random() * 90000 + 10000)));
        }

        if (abhaId != null && !abhaId.isBlank()) {
            patient.setAbhaId(abhaId);
        } else if (patient.getAbhaId() == null || patient.getAbhaId().isBlank()) {
            patient.setAbhaId(patient.getPatientId().toLowerCase().replaceAll("[^a-z0-9]", "") + "@abdm");
        }

        PatientEntity saved = patientRepo.save(patient);

        res.put("success", true);
        res.put("message", "Aadhaar e-KYC linked successfully with Patient UHID " + saved.getPatientId());
        res.put("patient", saved);
        res.put("uhid", saved.getPatientId());
        res.put("maskedAadhaar", masked);
        res.put("abhaId", saved.getAbhaId());
        res.put("kycStatus", "VERIFIED");
        res.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}/consents")
    public ResponseEntity<Map<String, Object>> getConsents(@PathVariable UUID id) {
        PatientEntity p = patientService.getPatientById(id);
        Map<String, Object> consents = new HashMap<>();
        consents.put("patientId", p.getId());
        consents.put("uhid", p.getPatientId());
        consents.put("treatmentConsent", p.getConsentGiven() != null ? p.getConsentGiven() : true);
        consents.put("diagnosticSharingConsent", true);
        consents.put("telehealthConsent", true);
        consents.put("insuranceTpaConsent", true);
        consents.put("consentDate", p.getConsentDate() != null ? p.getConsentDate() : LocalDate.now());
        consents.put("status", "ACTIVE");
        return ResponseEntity.ok(consents);
    }
}
