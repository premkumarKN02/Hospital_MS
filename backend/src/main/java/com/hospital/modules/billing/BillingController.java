package com.hospital.modules.billing;

import com.hospital.modules.patient.PatientEntity;
import com.hospital.modules.patient.PatientRepository;
import com.hospital.modules.user.UserEntity;
import com.hospital.modules.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/erp/billing")
@RequiredArgsConstructor
public class BillingController {

    private final InvoiceRepository invoiceRepo;
    private final InvoiceItemRepository itemRepo;
    private final PaymentRepository paymentRepo;
    private final PatientRepository patientRepo;
    private final UserRepository userRepo;

    @GetMapping("/invoices")
    public ResponseEntity<List<InvoiceEntity>> getAllInvoices() {
        List<InvoiceEntity> list = invoiceRepo.findAllByOrderByCreatedAtDesc();
        if (list.isEmpty()) {
            list = seedDefaultInvoices();
        }

        Map<UUID, PatientEntity> patientMap = new HashMap<>();
        patientRepo.findAll().forEach(p -> patientMap.put(p.getId(), p));

        for (InvoiceEntity inv : list) {
            PatientEntity p = patientMap.get(inv.getPatientId());
            if (p != null) {
                inv.setPatientName(p.getFirstName() + " " + p.getLastName());
                inv.setPatientUhid(p.getPatientId());
            } else if (inv.getPatientName() == null) {
                inv.setPatientName("Hospital Patient");
                inv.setPatientUhid("UHID-2024-00101");
            }
        }

        return ResponseEntity.ok(list);
    }

    private List<InvoiceEntity> seedDefaultInvoices() {
        List<PatientEntity> existing = patientRepo.findAll();
        List<UserEntity> users = userRepo.findAll();
        if (existing.isEmpty() || users.isEmpty()) {
            return Collections.emptyList();
        }
        UUID defaultPatient = existing.get(0).getId();
        UUID defaultUser = users.get(0).getId();
        List<InvoiceEntity> seeded = new ArrayList<>();

        Object[][] defaults = {
            {"INV-2024-0801", new BigDecimal("1200.00"), new BigDecimal("0.00"), new BigDecimal("60.00"), new BigDecimal("1260.00"), new BigDecimal("1260.00"), "PAID"},
            {"INV-2024-0802", new BigDecimal("8500.00"), new BigDecimal("500.00"), new BigDecimal("400.00"), new BigDecimal("8400.00"), new BigDecimal("4000.00"), "PARTIALLY_PAID"},
            {"INV-2024-0803", new BigDecimal("2450.00"), new BigDecimal("0.00"), new BigDecimal("122.50"), new BigDecimal("2572.50"), new BigDecimal("0.00"), "PENDING"},
            {"INV-2024-0804", new BigDecimal("14800.00"), new BigDecimal("1000.00"), new BigDecimal("690.00"), new BigDecimal("14490.00"), new BigDecimal("14490.00"), "PAID"}
        };

        for (Object[] def : defaults) {
            InvoiceEntity inv = new InvoiceEntity();
            inv.setInvoiceNumber((String) def[0]);
            inv.setPatientId(defaultPatient);
            inv.setCreatedByUserId(defaultUser);
            inv.setSubtotal((BigDecimal) def[1]);
            inv.setDiscountAmount((BigDecimal) def[2]);
            inv.setTaxAmount((BigDecimal) def[3]);
            inv.setTotalAmount((BigDecimal) def[4]);
            inv.setPaidAmount((BigDecimal) def[5]);
            inv.setBalanceAmount(((BigDecimal) def[4]).subtract((BigDecimal) def[5]));
            inv.setPaymentStatus((String) def[6]);
            seeded.add(invoiceRepo.save(inv));
        }

        return seeded;
    }

    @PostMapping("/invoices")
    @Transactional
    public ResponseEntity<?> createInvoice(@RequestBody Map<String, Object> req) {
        String patientIdStr = (String) req.get("patientId");
        Number totalNum = (Number) req.get("totalAmount");
        Number subtotalNum = (Number) req.getOrDefault("subtotal", totalNum);

        if (patientIdStr == null || totalNum == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "patientId and totalAmount are required"));
        }

        InvoiceEntity inv = new InvoiceEntity();
        inv.setInvoiceNumber("INV-" + System.currentTimeMillis() % 10000000);
        inv.setPatientId(UUID.fromString(patientIdStr));
        inv.setSubtotal(new BigDecimal(subtotalNum.toString()));
        inv.setTotalAmount(new BigDecimal(totalNum.toString()));
        inv.setPaidAmount(BigDecimal.ZERO);
        inv.setBalanceAmount(inv.getTotalAmount());
        inv.setPaymentStatus("PENDING");
        List<UserEntity> users = userRepo.findAll();
        if (!users.isEmpty()) {
            inv.setCreatedByUserId(users.get(0).getId());
        }

        InvoiceEntity saved = invoiceRepo.save(inv);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/payments")
    @Transactional
    public ResponseEntity<?> recordPayment(@RequestBody Map<String, Object> req) {
        String invoiceIdStr = (String) req.get("invoiceId");
        Number amountNum = (Number) req.get("amount");
        String paymentMode = (String) req.getOrDefault("paymentMode", "CASH");

        if (invoiceIdStr == null || amountNum == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "invoiceId and amount are required"));
        }

        UUID invId = UUID.fromString(invoiceIdStr);
        Optional<InvoiceEntity> invOpt = invoiceRepo.findById(invId);
        if (invOpt.isEmpty()) return ResponseEntity.notFound().build();

        InvoiceEntity invoice = invOpt.get();
        BigDecimal payAmount = new BigDecimal(amountNum.toString());

        PaymentEntity payment = new PaymentEntity();
        payment.setInvoiceId(invId);
        payment.setReceiptNumber("REC-" + System.currentTimeMillis() % 10000000);
        payment.setAmount(payAmount);
        payment.setPaymentMode(paymentMode);
        payment.setIdempotencyKey(UUID.randomUUID().toString());
        paymentRepo.save(payment);

        invoice.setPaidAmount(invoice.getPaidAmount().add(payAmount));
        invoice.setBalanceAmount(invoice.getTotalAmount().subtract(invoice.getPaidAmount()));
        if (invoice.getBalanceAmount().compareTo(BigDecimal.ZERO) <= 0) {
            invoice.setBalanceAmount(BigDecimal.ZERO);
            invoice.setPaymentStatus("PAID");
        } else {
            invoice.setPaymentStatus("PARTIALLY_PAID");
        }
        invoiceRepo.save(invoice);

        return ResponseEntity.ok(Map.of(
            "receiptNumber", payment.getReceiptNumber(),
            "paymentStatus", invoice.getPaymentStatus(),
            "remainingBalance", invoice.getBalanceAmount()
        ));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getBillingStats() {
        List<InvoiceEntity> invoices = invoiceRepo.findAll();
        BigDecimal totalBilled = BigDecimal.ZERO;
        BigDecimal totalCollected = BigDecimal.ZERO;
        BigDecimal totalPending = BigDecimal.ZERO;

        for (InvoiceEntity inv : invoices) {
            totalBilled = totalBilled.add(inv.getTotalAmount());
            totalCollected = totalCollected.add(inv.getPaidAmount());
            totalPending = totalPending.add(inv.getBalanceAmount());
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBilled", totalBilled);
        stats.put("totalCollected", totalCollected);
        stats.put("totalPending", totalPending);
        stats.put("invoiceCount", invoices.size());
        return ResponseEntity.ok(stats);
    }
}
