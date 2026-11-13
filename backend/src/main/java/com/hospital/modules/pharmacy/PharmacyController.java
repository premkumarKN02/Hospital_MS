package com.hospital.modules.pharmacy;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/erp/pharmacy")
@RequiredArgsConstructor
public class PharmacyController {

    private final InventoryItemRepository itemRepo;
    private final InventoryBatchRepository batchRepo;

    @GetMapping("/inventory")
    public ResponseEntity<List<InventoryBatchEntity>> getInventory() {
        List<InventoryBatchEntity> batches = batchRepo.findAll();
        if (batches.isEmpty()) {
            batches = seedDefaultPharmacy();
        }

        Map<UUID, InventoryItemEntity> itemMap = new HashMap<>();
        itemRepo.findAll().forEach(item -> itemMap.put(item.getId(), item));

        for (InventoryBatchEntity b : batches) {
            InventoryItemEntity item = itemMap.get(b.getItemId());
            if (item != null) {
                b.setItemName(item.getItemName());
                b.setGenericName(item.getGenericName());
                b.setUnitOfMeasure(item.getUnitOfMeasure());
            }
        }
        return ResponseEntity.ok(batches);
    }

    private List<InventoryBatchEntity> seedDefaultPharmacy() {
        List<InventoryBatchEntity> seeded = new ArrayList<>();
        Object[][] defaults = {
            {"MED-001", "Paracetamol 650mg", "Acetaminophen", "TAB", 100, 200, "BAT-2024-08", LocalDate.now().plusMonths(18), new BigDecimal("1.20"), new BigDecimal("3.50"), 850},
            {"MED-002", "Amoxicillin 500mg", "Amoxicillin Trihydrate", "CAP", 50, 150, "BAT-2024-11", LocalDate.now().plusMonths(12), new BigDecimal("4.50"), new BigDecimal("9.00"), 420},
            {"MED-003", "Metformin 500mg SR", "Metformin Hydrochloride", "TAB", 80, 200, "BAT-2024-03", LocalDate.now().plusMonths(24), new BigDecimal("2.10"), new BigDecimal("5.50"), 1200},
            {"MED-004", "Atorvastatin 10mg", "Atorvastatin Calcium", "TAB", 40, 100, "BAT-2024-01", LocalDate.now().plusMonths(14), new BigDecimal("6.00"), new BigDecimal("14.00"), 310},
            {"MED-005", "Pantoprazole 40mg", "Pantoprazole Sodium", "TAB", 60, 150, "BAT-2024-05", LocalDate.now().plusDays(25), new BigDecimal("3.80"), new BigDecimal("8.50"), 180}, // Near expiry
            {"MED-006", "Azithromycin 500mg", "Azithromycin Dihydrate", "TAB", 30, 80, "BAT-2024-09", LocalDate.now().plusMonths(16), new BigDecimal("12.00"), new BigDecimal("28.00"), 240},
            {"MED-007", "Ceftriaxone 1g Inj", "Ceftriaxone Sodium", "VIAL", 20, 50, "BAT-2024-02", LocalDate.now().plusMonths(8), new BigDecimal("35.00"), new BigDecimal("85.00"), 95},
            {"MED-008", "Insulin Glargine 100IU", "Recombinant Human Insulin", "PEN", 10, 30, "BAT-2024-10", LocalDate.now().plusMonths(10), new BigDecimal("280.00"), new BigDecimal("590.00"), 42}
        };

        for (Object[] def : defaults) {
            InventoryItemEntity item = new InventoryItemEntity();
            item.setItemCode((String) def[0]);
            item.setItemName((String) def[1]);
            item.setGenericName((String) def[2]);
            item.setUnitOfMeasure((String) def[3]);
            item.setMinStockAlert((Integer) def[4]);
            item.setReorderQuantity((Integer) def[5]);
            InventoryItemEntity savedItem = itemRepo.save(item);

            InventoryBatchEntity batch = new InventoryBatchEntity();
            batch.setItemId(savedItem.getId());
            batch.setBatchNumber((String) def[6]);
            batch.setExpiryDate((LocalDate) def[7]);
            batch.setCostPrice((BigDecimal) def[8]);
            batch.setSellingMrp((BigDecimal) def[9]);
            batch.setCurrentStock((Integer) def[10]);
            batch.setItemName(savedItem.getItemName());
            batch.setGenericName(savedItem.getGenericName());
            batch.setUnitOfMeasure(savedItem.getUnitOfMeasure());
            seeded.add(batchRepo.save(batch));
        }

        return seeded;
    }

    @PostMapping("/dispense")
    @Transactional
    public ResponseEntity<?> dispenseMedication(@RequestBody Map<String, Object> req) {
        String batchIdStr = (String) req.get("batchId");
        Number qtyNum = (Number) req.get("quantity");
        int qty = qtyNum != null ? qtyNum.intValue() : 1;

        if (batchIdStr == null) return ResponseEntity.badRequest().body(Map.of("error", "batchId is required"));

        UUID batchId = UUID.fromString(batchIdStr);
        Optional<InventoryBatchEntity> opt = batchRepo.findById(batchId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        InventoryBatchEntity batch = opt.get();
        if (batch.getCurrentStock() < qty) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "INSUFFICIENT_STOCK",
                "message", "Available stock is " + batch.getCurrentStock() + ", cannot dispense " + qty
            ));
        }

        batch.setCurrentStock(batch.getCurrentStock() - qty);
        InventoryBatchEntity updated = batchRepo.save(batch);

        return ResponseEntity.ok(Map.of(
            "message", "Medication dispensed successfully",
            "batchNumber", updated.getBatchNumber(),
            "remainingStock", updated.getCurrentStock()
        ));
    }

    @PostMapping("/stock-in")
    @Transactional
    public ResponseEntity<?> recordStockIn(@RequestBody Map<String, Object> req) {
        String batchIdStr = (String) req.get("batchId");
        Number qtyNum = (Number) req.get("quantity");
        int qty = qtyNum != null ? qtyNum.intValue() : 0;

        if (batchIdStr == null || qty <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Valid batchId and positive quantity required"));
        }

        UUID batchId = UUID.fromString(batchIdStr);
        Optional<InventoryBatchEntity> opt = batchRepo.findById(batchId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        InventoryBatchEntity batch = opt.get();
        batch.setCurrentStock(batch.getCurrentStock() + qty);
        InventoryBatchEntity updated = batchRepo.save(batch);

        return ResponseEntity.ok(Map.of(
            "message", "Stock received and catalogued into batch ledger",
            "currentStock", updated.getCurrentStock()
        ));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPharmacyStats() {
        List<InventoryBatchEntity> batches = batchRepo.findAll();
        LocalDate now = LocalDate.now();
        LocalDate nearExpiryDate = now.plusDays(60);

        long nearExpiryCount = batches.stream().filter(b -> b.getExpiryDate().isBefore(nearExpiryDate)).count();
        long lowStockCount = batches.stream().filter(b -> b.getCurrentStock() < 100).count();

        BigDecimal totalValue = BigDecimal.ZERO;
        for (InventoryBatchEntity b : batches) {
            totalValue = totalValue.add(b.getSellingMrp().multiply(new BigDecimal(b.getCurrentStock())));
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBatches", batches.size());
        stats.put("totalStockUnits", batches.stream().mapToInt(InventoryBatchEntity::getCurrentStock).sum());
        stats.put("totalInventoryValue", totalValue);
        stats.put("nearExpiryCount", nearExpiryCount);
        stats.put("lowStockCount", lowStockCount);

        return ResponseEntity.ok(stats);
    }
}
