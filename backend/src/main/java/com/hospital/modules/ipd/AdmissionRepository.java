package com.hospital.modules.ipd;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdmissionRepository extends JpaRepository<AdmissionEntity, UUID> {
    Optional<AdmissionEntity> findByAdmissionNo(String admissionNo);
    List<AdmissionEntity> findByPatientId(UUID patientId);
    List<AdmissionEntity> findByAdmissionStatus(String admissionStatus);
}
