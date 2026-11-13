package com.hospital.modules.billing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<InvoiceEntity, UUID> {
    Optional<InvoiceEntity> findByInvoiceNumber(String invoiceNumber);
    List<InvoiceEntity> findByPatientId(UUID patientId);
    List<InvoiceEntity> findAllByOrderByCreatedAtDesc();
}
