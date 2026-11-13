package com.hospital.modules.billing;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
@Getter
@Setter
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "invoice_id", nullable = false)
    private UUID invoiceId;

    @Column(name = "receipt_number", unique = true, nullable = false, length = 50)
    private String receiptNumber;

    @Column(name = "amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "payment_mode", nullable = false, length = 50)
    private String paymentMode; // CASH, CARD, UPI, WIRE_TRANSFER, INSURANCE

    @Column(name = "transaction_reference", length = 150)
    private String transactionReference;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "SUCCESS";

    @Column(name = "collected_by_user_id", nullable = false)
    private UUID collectedByUserId = UUID.fromString("11111111-0001-0000-0000-000000000001");

    @CreationTimestamp
    @Column(name = "paid_at")
    private LocalDateTime paidAt = LocalDateTime.now();

    @Column(name = "idempotency_key", unique = true, nullable = false, length = 100)
    private String idempotencyKey;
}
