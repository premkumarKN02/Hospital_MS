package com.hospital.modules.clinical;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, UUID> {

    boolean existsByAppointmentNo(String appointmentNo);

    Page<AppointmentEntity> findByPatientId(UUID patientId, Pageable pageable);

    List<AppointmentEntity> findByDoctorIdAndAppointmentDate(UUID doctorId, LocalDate date);

    List<AppointmentEntity> findByAppointmentDateAndStatus(LocalDate date, String status);

    Page<AppointmentEntity> findByDoctorIdAndAppointmentDateGreaterThanEqual(
            UUID doctorId, LocalDate from, Pageable pageable);

    long countByAppointmentDateAndStatus(LocalDate date, String status);
}
