package com.hospital.modules.staff;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeEntity, UUID> {
    Optional<EmployeeEntity> findByEmployeeCode(String code);
    Optional<EmployeeEntity> findByUserId(UUID userId);
    Page<EmployeeEntity> findByApprovalStatus(String status, Pageable pageable);

    @Query("SELECT e FROM EmployeeEntity e WHERE " +
           "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "e.employeeCode LIKE CONCAT('%', :q, '%')")
    Page<EmployeeEntity> search(String q, Pageable pageable);
}
