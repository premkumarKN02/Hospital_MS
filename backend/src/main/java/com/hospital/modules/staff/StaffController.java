package com.hospital.modules.staff;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final EmployeeRepository employeeRepository;
    private final DoctorRepository doctorRepository;

    @GetMapping("/employees")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<Page<EmployeeEntity>> getEmployees(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            Pageable pageable
    ) {
        if (query != null && !query.isBlank()) {
            return ResponseEntity.ok(employeeRepository.search(query, pageable));
        }
        if (status != null) {
            return ResponseEntity.ok(employeeRepository.findByApprovalStatus(status.toUpperCase(), pageable));
        }
        return ResponseEntity.ok(employeeRepository.findAll(pageable));
    }

    @GetMapping("/employees/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<EmployeeEntity> getEmployee(@PathVariable UUID id) {
        return ResponseEntity.ok(
                employeeRepository.findById(id)
                        .orElseThrow(() -> new com.hospital.exception.ResourceNotFoundException("Employee", "id", id))
        );
    }

    @PostMapping("/employees")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeEntity> createEmployee(@RequestBody EmployeeEntity employee) {
        return ResponseEntity.ok(employeeRepository.save(employee));
    }

    @PatchMapping("/employees/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeEntity> approveEmployee(@PathVariable UUID id) {
        EmployeeEntity emp = employeeRepository.findById(id)
                .orElseThrow(() -> new com.hospital.exception.ResourceNotFoundException("Employee", "id", id));
        emp.setApprovalStatus("APPROVED");
        emp.setActive(true);
        return ResponseEntity.ok(employeeRepository.save(emp));
    }

    @PatchMapping("/employees/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeEntity> rejectEmployee(@PathVariable UUID id) {
        EmployeeEntity emp = employeeRepository.findById(id)
                .orElseThrow(() -> new com.hospital.exception.ResourceNotFoundException("Employee", "id", id));
        emp.setApprovalStatus("REJECTED");
        emp.setActive(false);
        return ResponseEntity.ok(employeeRepository.save(emp));
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorEntity>> getDoctors(
            @RequestParam(required = false) UUID departmentId,
            @RequestParam(required = false) Boolean opdOnly
    ) {
        if (departmentId != null) {
            return ResponseEntity.ok(doctorRepository.findByDepartmentIdAndActiveTrue(departmentId));
        }
        if (Boolean.TRUE.equals(opdOnly)) {
            return ResponseEntity.ok(doctorRepository.findByAvailableForOpdTrueAndActiveTrue());
        }
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<DoctorEntity> getDoctor(@PathVariable UUID id) {
        return ResponseEntity.ok(
                doctorRepository.findById(id)
                        .orElseThrow(() -> new com.hospital.exception.ResourceNotFoundException("Doctor", "id", id))
        );
    }

    @PostMapping("/doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DoctorEntity> createDoctor(@RequestBody DoctorEntity doctor) {
        return ResponseEntity.ok(doctorRepository.save(doctor));
    }
}
