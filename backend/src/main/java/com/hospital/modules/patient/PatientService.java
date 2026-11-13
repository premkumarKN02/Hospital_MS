package com.hospital.modules.patient;

import com.hospital.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public Page<PatientEntity> getAllPatients(String query, Pageable pageable) {
        if (query != null && !query.isBlank()) {
            return patientRepository.searchPatients(query.trim(), pageable);
        }
        return patientRepository.findAll(pageable);
    }

    public PatientEntity getPatientById(UUID id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
    }

    public PatientEntity getPatientByPatientId(String patientId) {
        return patientRepository.findByPatientId(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "patientId", patientId));
    }

    public Optional<PatientEntity> findPatientByPatientId(String patientId) {
        return patientRepository.findByPatientId(patientId);
    }

    public Optional<PatientEntity> findPatientByNationalId(String nationalId) {
        return patientRepository.findByNationalId(nationalId);
    }

    public Optional<PatientEntity> findPatientByAbhaId(String abhaId) {
        return patientRepository.findByAbhaId(abhaId);
    }

    public Optional<PatientEntity> lookupPatientSmart(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            return Optional.empty();
        }
        String clean = identifier.trim();
        String numericOnly = clean.replaceAll("[^0-9]", "");

        // 1. Check exact UHID / Patient ID
        Optional<PatientEntity> byPid = patientRepository.findByPatientId(clean);
        if (byPid.isPresent()) return byPid;

        // Also check if prefix is missing or uppercase
        if (!clean.toUpperCase().startsWith("SNHC-")) {
            Optional<PatientEntity> prefixedPid = patientRepository.findByPatientId("SNHC-" + clean);
            if (prefixedPid.isPresent()) return prefixedPid;
        }

        // 2. Check exact National ID / Aadhaar
        Optional<PatientEntity> byNid = patientRepository.findByNationalId(clean);
        if (byNid.isPresent()) return byNid;

        // 3. Check ABHA ID
        Optional<PatientEntity> byAbha = patientRepository.findByAbhaId(clean);
        if (byAbha.isPresent()) return byAbha;

        // 4. Check email (e.g. patient logged in with email)
        if (clean.contains("@")) {
            Optional<PatientEntity> byEmail = patientRepository.findByEmail(clean);
            if (byEmail.isPresent()) return byEmail;
        }

        // 5. If numeric and 12 digits (Aadhaar) or 4 digits
        if (numericOnly.length() >= 4) {
            String last4 = numericOnly.substring(numericOnly.length() - 4);
            List<PatientEntity> fuzzy = patientRepository.findByNationalIdFuzzy(last4, clean);
            if (!fuzzy.isEmpty()) {
                return Optional.of(fuzzy.get(0));
            }
        }

        // 6. If 10 digits (Phone)
        if (numericOnly.length() == 10) {
            List<PatientEntity> byPhone = patientRepository.findByPhone(numericOnly);
            if (!byPhone.isEmpty()) {
                return Optional.of(byPhone.get(0));
            }
        }

        // 7. Fallback: Search first match
        Page<PatientEntity> paged = patientRepository.searchPatients(clean, PageRequest.of(0, 1));
        if (paged.hasContent()) {
            return Optional.of(paged.getContent().get(0));
        }

        return Optional.empty();
    }

    @Transactional
    public PatientEntity createPatient(PatientEntity patient) {
        if (patient.getPatientId() == null || patient.getPatientId().isBlank()) {
            patient.setPatientId(generatePatientId());
        }
        return patientRepository.save(patient);
    }

    @Transactional
    public PatientEntity updatePatient(UUID id, PatientEntity updated) {
        PatientEntity existing = getPatientById(id);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setDateOfBirth(updated.getDateOfBirth());
        existing.setGender(updated.getGender());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setAddressLine1(updated.getAddressLine1());
        existing.setAddressLine2(updated.getAddressLine2());
        existing.setCity(updated.getCity());
        existing.setState(updated.getState());
        existing.setPostalCode(updated.getPostalCode());
        existing.setCountry(updated.getCountry());
        existing.setBloodGroup(updated.getBloodGroup());
        existing.setAllergyInfo(updated.getAllergyInfo());
        existing.setEmergencyContactName(updated.getEmergencyContactName());
        existing.setEmergencyContactPhone(updated.getEmergencyContactPhone());
        existing.setEmergencyContactRelation(updated.getEmergencyContactRelation());
        existing.setInsuranceProvider(updated.getInsuranceProvider());
        existing.setInsurancePolicyNo(updated.getInsurancePolicyNo());
        return patientRepository.save(existing);
    }

    @Transactional
    public void deactivatePatient(UUID id) {
        PatientEntity patient = getPatientById(id);
        patient.setActive(false);
        patientRepository.save(patient);
    }

    private String generatePatientId() {
        int year = java.time.Year.now().getValue();
        long count = patientRepository.count() + 1;
        return String.format("SNHC-%d-%05d", year, count);
    }
}
