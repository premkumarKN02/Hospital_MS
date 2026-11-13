package com.hospital.modules.patient;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PatientRepository extends JpaRepository<PatientEntity, UUID> {

    Optional<PatientEntity> findByPatientId(String patientId);

    boolean existsByPatientId(String patientId);

    @Query("SELECT p FROM PatientEntity p WHERE " +
           "LOWER(p.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "p.phone LIKE CONCAT('%', :query, '%') OR " +
           "p.patientId LIKE CONCAT('%', :query, '%') OR " +
           "p.nationalId LIKE CONCAT('%', :query, '%') OR " +
           "p.abhaId LIKE CONCAT('%', :query, '%')")
    Page<PatientEntity> searchPatients(String query, Pageable pageable);

    @Query("SELECT p FROM PatientEntity p WHERE p.phone = :phone AND p.active = true")
    List<PatientEntity> findByPhone(String phone);

    Optional<PatientEntity> findByNationalId(String nationalId);

    Optional<PatientEntity> findByAbhaId(String abhaId);

    Optional<PatientEntity> findByEmail(String email);

    @Query("SELECT p FROM PatientEntity p WHERE p.nationalId LIKE CONCAT('%', :lastDigits) OR p.nationalId = :exactId")
    List<PatientEntity> findByNationalIdFuzzy(String lastDigits, String exactId);
}
