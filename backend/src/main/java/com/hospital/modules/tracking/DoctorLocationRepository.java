package com.hospital.modules.tracking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DoctorLocationRepository extends JpaRepository<DoctorLocationEntity, UUID> {
    Optional<DoctorLocationEntity> findByDoctorEmail(String doctorEmail);
    Optional<DoctorLocationEntity> findByActivationToken(String activationToken);
    Optional<DoctorLocationEntity> findByPhone(String phone);
    List<DoctorLocationEntity> findAllByOrderByLastPingAtDesc();
}
