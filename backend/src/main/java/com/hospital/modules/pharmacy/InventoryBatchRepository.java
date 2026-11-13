package com.hospital.modules.pharmacy;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryBatchRepository extends JpaRepository<InventoryBatchEntity, UUID> {
    List<InventoryBatchEntity> findByItemId(UUID itemId);
    Optional<InventoryBatchEntity> findByItemIdAndBatchNumber(UUID itemId, String batchNumber);
    List<InventoryBatchEntity> findByExpiryDateBefore(LocalDate date);
}
