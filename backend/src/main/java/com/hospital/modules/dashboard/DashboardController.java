package com.hospital.modules.dashboard;

import com.hospital.modules.clinical.AppointmentRepository;
import com.hospital.modules.patient.PatientRepository;
import com.hospital.modules.staff.DoctorRepository;
import com.hospital.modules.staff.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final EmployeeRepository employeeRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'FRONT_DESK', 'FINANCE', 'QUALITY')")
    public ResponseEntity<Map<String, Object>> getStats() {
        LocalDate today = LocalDate.now();
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalPatients", patientRepository.count());
        stats.put("todayAppointments", appointmentRepository.countByAppointmentDateAndStatus(today, "SCHEDULED")
                + appointmentRepository.countByAppointmentDateAndStatus(today, "CONFIRMED")
                + appointmentRepository.countByAppointmentDateAndStatus(today, "CHECKED_IN"));
        stats.put("todayCompleted", appointmentRepository.countByAppointmentDateAndStatus(today, "COMPLETED"));
        stats.put("activeDoctors", doctorRepository.findByAvailableForOpdTrueAndActiveTrue().size());
        stats.put("totalStaff", employeeRepository.count());
        stats.put("pendingApprovals", employeeRepository.findByApprovalStatus("PENDING",
                org.springframework.data.domain.PageRequest.of(0, 1)).getTotalElements());
        stats.put("date", today.toString());
        return ResponseEntity.ok(stats);
    }
}
