package com.hospital.modules.clinical;

import com.hospital.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'FRONT_DESK', 'PATIENT')")
    public ResponseEntity<Page<AppointmentEntity>> getAppointments(
            @RequestParam(required = false) UUID patientId,
            @RequestParam(required = false) UUID doctorId,
            @RequestParam(required = false) String date,
            Pageable pageable
    ) {
        if (patientId != null) {
            return ResponseEntity.ok(appointmentRepository.findByPatientId(patientId, pageable));
        }
        if (doctorId != null && date != null) {
            LocalDate localDate = LocalDate.parse(date);
            return ResponseEntity.ok(
                    appointmentRepository.findByDoctorIdAndAppointmentDateGreaterThanEqual(doctorId, localDate, pageable)
            );
        }
        return ResponseEntity.ok(appointmentRepository.findAll(pageable));
    }

    @GetMapping("/today")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'FRONT_DESK')")
    public ResponseEntity<List<AppointmentEntity>> getTodaysAppointments(
            @RequestParam(required = false) String status
    ) {
        LocalDate today = LocalDate.now();
        if (status != null) {
            return ResponseEntity.ok(appointmentRepository.findByAppointmentDateAndStatus(today, status.toUpperCase()));
        }
        return ResponseEntity.ok(
                appointmentRepository.findByAppointmentDateAndStatus(today, "SCHEDULED")
        );
    }

    @GetMapping("/booked-slots")
    public ResponseEntity<List<String>> getBookedSlots(
            @RequestParam UUID doctorId,
            @RequestParam String date
    ) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            List<AppointmentEntity> list = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, localDate);
            List<String> bookedTimes = list.stream()
                    .filter(a -> a.getAppointmentTime() != null &&
                            !"CANCELLED".equalsIgnoreCase(a.getStatus()) &&
                            !"RESCHEDULED".equalsIgnoreCase(a.getStatus()))
                    .map(a -> a.getAppointmentTime().toString())
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(bookedTimes);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'FRONT_DESK', 'PATIENT')")
    public ResponseEntity<AppointmentEntity> getAppointment(@PathVariable UUID id) {
        return ResponseEntity.ok(appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'FRONT_DESK', 'PATIENT')")
    public ResponseEntity<AppointmentEntity> createAppointment(@RequestBody AppointmentEntity appointment) {
        if (appointment.getHospitalId() == null) {
            appointment.setHospitalId(UUID.fromString("55555555-0001-0000-0000-000000000001"));
        }
        if (appointment.getBranchId() == null) {
            appointment.setBranchId(UUID.fromString("55555555-0002-0000-0000-000000000001"));
        }
        if (appointment.getDepartmentId() == null) {
            appointment.setDepartmentId(UUID.fromString("55555555-0003-0000-0000-000000000001"));
        }
        if (appointment.getConsultationFee() == null) {
            appointment.setConsultationFee(java.math.BigDecimal.valueOf(500.00));
        }
        if (appointment.getPaid() == null) {
            appointment.setPaid(false);
        }
        if (appointment.getStatus() == null || appointment.getStatus().isBlank()) {
            appointment.setStatus("SCHEDULED");
        }
        if (appointment.getBookingSource() == null || appointment.getBookingSource().isBlank()) {
            appointment.setBookingSource("PATIENT_PORTAL");
        }

        // Validate time slot collision
        if (appointment.getDoctorId() != null && appointment.getAppointmentDate() != null && appointment.getAppointmentTime() != null) {
            List<AppointmentEntity> existing = appointmentRepository.findByDoctorIdAndAppointmentDate(
                    appointment.getDoctorId(), appointment.getAppointmentDate()
            );
            boolean isColliding = existing.stream().anyMatch(e ->
                    e.getAppointmentTime() != null &&
                    e.getAppointmentTime().equals(appointment.getAppointmentTime()) &&
                    !"CANCELLED".equalsIgnoreCase(e.getStatus()) &&
                    !"RESCHEDULED".equalsIgnoreCase(e.getStatus())
            );
            if (isColliding) {
                throw new com.hospital.exception.BusinessException(
                        "SLOT_ALREADY_BOOKED",
                        "The time slot " + appointment.getAppointmentTime() + " on " + appointment.getAppointmentDate() +
                                " is already booked for this specialist. Please choose another time slot."
                );
            }
        }

        // Collision-proof unique appointment number generation
        String apptNo;
        long seq = appointmentRepository.count() + 1;
        do {
            apptNo = String.format("APT-%d-%05d", LocalDate.now().getYear(), seq++);
        } while (appointmentRepository.existsByAppointmentNo(apptNo));
        appointment.setAppointmentNo(apptNo);

        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentRepository.save(appointment));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'FRONT_DESK')")
    public ResponseEntity<AppointmentEntity> updateStatus(
            @PathVariable UUID id,
            @RequestParam String status
    ) {
        AppointmentEntity appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        appt.setStatus(status.toUpperCase());
        return ResponseEntity.ok(appointmentRepository.save(appt));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'FRONT_DESK')")
    public ResponseEntity<Void> cancelAppointment(
            @PathVariable UUID id,
            @RequestParam(required = false) String reason
    ) {
        AppointmentEntity appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        appt.setStatus("CANCELLED");
        appt.setCancellationReason(reason);
        appointmentRepository.save(appt);
        return ResponseEntity.noContent().build();
    }
}
