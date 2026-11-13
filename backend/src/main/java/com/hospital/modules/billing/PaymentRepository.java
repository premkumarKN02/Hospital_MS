package com.hospital.modules.billing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, UUID> {
    List<PaymentEntity> findByInvoiceId(UUID invoiceId);
    Optional<PaymentEntity> findByReceiptNumber(String receiptNumber);
}
