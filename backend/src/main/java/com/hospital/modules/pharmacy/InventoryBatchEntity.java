package com.hospital.modules.pharmacy;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "inventory_batches")
@Getter
@Setter
public class InventoryBatchEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "item_id", nullable = false)
    private UUID itemId;

    @Column(name = "branch_id")
    private UUID branchId = UUID.fromString("11111111-0001-0000-0000-000000000001");

    @Column(name = "batch_number", nullable = false, length = 100)
    private String batchNumber;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "cost_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal costPrice;

    @Column(name = "selling_mrp", precision = 10, scale = 2, nullable = false)
    private BigDecimal sellingMrp;

    @Column(name = "current_stock", nullable = false)
    private Integer currentStock = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Transient
    private String itemName;

    @Transient
    private String genericName;

    @Transient
    private String unitOfMeasure;
}
