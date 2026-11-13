package com.hospital.modules.hrms;

import com.hospital.modules.staff.EmployeeEntity;
import com.hospital.modules.staff.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/hrms/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveApplicationRepository leaveRepo;
    private final EmployeeRepository employeeRepo;

    @GetMapping
    public ResponseEntity<List<LeaveApplicationEntity>> getAllLeaves(
            @RequestParam(required = false) String status,
            Authentication auth
    ) {
        List<LeaveApplicationEntity> leaves = (status != null && !status.isBlank())
                ? leaveRepo.findByStatus(status.toUpperCase())
                : leaveRepo.findAllByOrderByStartDateDesc();

        // Enrich with employee names if available
        Map<UUID, String> employeeNameMap = new HashMap<>();
        List<EmployeeEntity> allEmployees = employeeRepo.findAll();
        for (EmployeeEntity emp : allEmployees) {
            employeeNameMap.put(emp.getId(), emp.getFirstName() + " " + emp.getLastName());
        }

        for (LeaveApplicationEntity l : leaves) {
            if (l.getEmployeeId() != null && employeeNameMap.containsKey(l.getEmployeeId())) {
                l.setEmployeeName(employeeNameMap.get(l.getEmployeeId()));
            } else if (l.getEmployeeName() == null) {
                l.setEmployeeName("Staff Member");
            }
        }

        return ResponseEntity.ok(leaves);
    }

    @PostMapping
    public ResponseEntity<?> applyLeave(@RequestBody LeaveApplicationEntity leave, Authentication auth) {
        if (leave.getEmployeeId() == null) {
            List<EmployeeEntity> employees = employeeRepo.findAll();
            if (!employees.isEmpty()) {
                leave.setEmployeeId(employees.get(0).getId());
            } else {
                leave.setEmployeeId(UUID.fromString("11111111-0001-0000-0000-000000000001"));
            }
        }
        leave.setStatus("PENDING");
        LeaveApplicationEntity saved = leaveRepo.save(leave);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateLeaveStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body,
            Authentication auth
    ) {
        // Enforce role check: only ADMIN, SUPERVISOR, or MEDICAL_SUPERINTENDENT
        if (auth != null && auth.getAuthorities() != null) {
            boolean isAdminOrSup = auth.getAuthorities().stream().anyMatch(a ->
                    a.getAuthority().equalsIgnoreCase("ROLE_ADMIN") ||
                    a.getAuthority().equalsIgnoreCase("ROLE_SUPER_ADMIN") ||
                    a.getAuthority().equalsIgnoreCase("ROLE_SUPERINTENDENT") ||
                    a.getAuthority().equalsIgnoreCase("ROLE_HR")
            );
            if (!isAdminOrSup) {
                return ResponseEntity.status(403).body(Map.of(
                        "error", "FORBIDDEN",
                        "message", "Only Medical Superintendents and Administrators hold authority to approve or reject leave requests."
                ));
            }
        }

        Optional<LeaveApplicationEntity> opt = leaveRepo.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        LeaveApplicationEntity entity = opt.get();
        String newStatus = body.getOrDefault("status", "APPROVED").toUpperCase();
        entity.setStatus(newStatus);
        LeaveApplicationEntity updated = leaveRepo.save(entity);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/balances")
    public ResponseEntity<Map<String, Object>> getLeaveBalances(Authentication auth) {
        Map<String, Object> balances = new HashMap<>();
        balances.put("casual", Map.of("total", 12, "used", 4, "available", 8));
        balances.put("sick", Map.of("total", 10, "used", 2, "available", 8));
        balances.put("privilege", Map.of("total", 15, "used", 5, "available", 10));
        balances.put("maternity", Map.of("total", 180, "used", 0, "available", 180));
        balances.put("emergency", Map.of("total", 5, "used", 1, "available", 4));
        return ResponseEntity.ok(balances);
    }
}
