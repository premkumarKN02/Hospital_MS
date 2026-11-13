package com.hospital.modules.staff;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "employees")
@Getter
@Setter
public class EmployeeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "employee_code", unique = true, length = 20)
    private String employeeCode;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "department_id")
    private UUID departmentId;

    @Column(name = "branch_id")
    private UUID branchId;

    @Column(name = "first_name", nullable = false, length = 60)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 60)
    private String lastName;

    @Column(length = 80)
    private String designation;

    @Column(name = "employment_type", length = 20)
    private String employmentType; // FULL_TIME, PART_TIME, CONTRACT, VISITING

    @Column(name = "join_date")
    private LocalDate joinDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "base_salary", precision = 12, scale = 2)
    private BigDecimal baseSalary;

    @Column(length = 15)
    private String phone;

    @Column(length = 120)
    private String email;

    @Column(name = "is_active")
    private Boolean active = true;

    @Column(name = "approval_status", length = 20)
    private String approvalStatus = "PENDING"; // PENDING, APPROVED, REJECTED

    @Column(name = "approved_by")
    private UUID approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
