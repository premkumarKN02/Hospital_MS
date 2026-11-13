package com.hospital.modules.hrms;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "leave_applications")
@Getter
@Setter
public class LeaveApplicationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "employee_id", nullable = true)
    private UUID employeeId;

    @Column(name = "employee_code", length = 50)
    private String employeeCode;

    public void setEmployeeId(Object val) {
        if (val == null) {
            this.employeeId = null;
            return;
        }
        String s = val.toString().trim();
        try {
            this.employeeId = UUID.fromString(s);
        } catch (Exception ex) {
            this.employeeCode = s;
        }
    }

    @Column(name = "leave_type", nullable = false, length = 50)
    private String leaveType; // CASUAL, SICK, PRIVILEGE, MATERNITY, EMERGENCY

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "reason", nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED

    @Column(name = "approved_by_user_id")
    private UUID approvedByUserId;

    @Transient
    private String employeeName;

    @Transient
    private String departmentName;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
