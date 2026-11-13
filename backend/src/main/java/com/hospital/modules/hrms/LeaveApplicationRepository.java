package com.hospital.modules.hrms;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LeaveApplicationRepository extends JpaRepository<LeaveApplicationEntity, UUID> {
    List<LeaveApplicationEntity> findByEmployeeId(UUID employeeId);
    List<LeaveApplicationEntity> findByStatus(String status);
    List<LeaveApplicationEntity> findAllByOrderByStartDateDesc();
}
