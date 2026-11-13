package com.hospital.modules.pharmacy;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "inventory_items")
@Getter
@Setter
public class InventoryItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "hospital_id", nullable = false)
    private UUID hospitalId = UUID.fromString("55555555-0001-0000-0000-000000000001");

    @Column(name = "category_id")
    private UUID categoryId = UUID.fromString("44444444-0001-0000-0000-000000000001");

    @Column(name = "item_code", nullable = false, length = 50)
    private String itemCode;

    @Column(name = "item_name", nullable = false, length = 200)
    private String itemName;

    @Column(name = "generic_name", length = 200)
    private String genericName;

    @Column(name = "unit_of_measure", nullable = false, length = 50)
    private String unitOfMeasure = "TABLET";

    @Column(name = "min_stock_alert", nullable = false)
    private Integer minStockAlert = 10;

    @Column(name = "reorder_quantity", nullable = false)
    private Integer reorderQuantity = 50;

    @Column(name = "requires_prescription")
    private Boolean requiresPrescription = true;

    @Column(name = "is_hazardous")
    private Boolean isHazardous = false;
}
