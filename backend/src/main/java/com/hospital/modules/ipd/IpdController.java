package com.hospital.modules.ipd;

import com.hospital.modules.patient.PatientEntity;
import com.hospital.modules.patient.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/hms/ipd")
@RequiredArgsConstructor
public class IpdController {

    private final BedRepository bedRepo;
    private final AdmissionRepository admissionRepo;
    private final PatientRepository patientRepo;

    @GetMapping("/beds")
    public ResponseEntity<List<BedEntity>> getAllBeds() {
        List<BedEntity> beds = bedRepo.findAll();
        if (beds.isEmpty()) {
            // Seed a standard initial set of beds if table is currently empty
            beds = seedDefaultBeds();
        }

        // Attach patient details if occupied
        for (BedEntity b : beds) {
            if ("OCCUPIED".equalsIgnoreCase(b.getBedStatus()) && b.getCurrentAdmissionId() != null) {
                admissionRepo.findById(b.getCurrentAdmissionId()).ifPresent(adm -> {
                    patientRepo.findById(adm.getPatientId()).ifPresent(p -> {
                        b.setPatientName(p.getFirstName() + " " + p.getLastName());
                        b.setPatientUhid(p.getPatientId());
                    });
                });
            }
        }

        return ResponseEntity.ok(beds);
    }

    private List<BedEntity> seedDefaultBeds() {
        List<BedEntity> defaultBeds = new ArrayList<>();
        String[][] bedConfigs = {
            {"ICU-01", "ICU", "Intensive Care Unit", "OCCUPIED"},
            {"ICU-02", "ICU", "Intensive Care Unit", "OCCUPIED"},
            {"ICU-03", "ICU", "Intensive Care Unit", "AVAILABLE"},
            {"ER-01", "EMERGENCY", "Emergency Ward", "OCCUPIED"},
            {"ER-02", "EMERGENCY", "Emergency Ward", "AVAILABLE"},
            {"GEN-101", "GENERAL", "General Ward A", "AVAILABLE"},
            {"GEN-102", "GENERAL", "General Ward A", "OCCUPIED"},
            {"GEN-103", "GENERAL", "General Ward A", "CLEANING"},
            {"PVT-201", "PRIVATE", "Executive Deluxe", "AVAILABLE"},
            {"PVT-202", "PRIVATE", "Executive Deluxe", "OCCUPIED"},
            {"POST-301", "POST_OP", "Surgical Post-Op", "AVAILABLE"},
            {"POST-302", "POST_OP", "Surgical Post-Op", "OCCUPIED"}
        };

        UUID dummyRoom = UUID.fromString("66666666-0001-0000-0000-000000000001");
        for (String[] cfg : bedConfigs) {
            BedEntity b = new BedEntity();
            b.setRoomId(dummyRoom);
            b.setBedNumber(cfg[0]);
            b.setWardType(cfg[1]);
            b.setWardName(cfg[2]);
            b.setBedStatus(cfg[3]);
            defaultBeds.add(bedRepo.save(b));
        }
        return defaultBeds;
    }

    @PostMapping("/admissions")
    @Transactional
    public ResponseEntity<?> admitPatient(@RequestBody Map<String, Object> req) {
        String bedIdStr = (String) req.get("bedId");
        String patientIdStr = (String) req.get("patientId");
        String diagnosis = (String) req.getOrDefault("diagnosis", "Observation & Inpatient Care");
        String admissionType = (String) req.getOrDefault("admissionType", "ELECTIVE");

        if (bedIdStr == null || patientIdStr == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "bedId and patientId are required"));
        }

        UUID bedId = UUID.fromString(bedIdStr);
        UUID patientId = UUID.fromString(patientIdStr);

        Optional<BedEntity> bedOpt = bedRepo.findById(bedId);
        if (bedOpt.isEmpty()) return ResponseEntity.notFound().build();

        BedEntity bed = bedOpt.get();
        if ("OCCUPIED".equalsIgnoreCase(bed.getBedStatus())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bed is already occupied"));
        }

        AdmissionEntity adm = new AdmissionEntity();
        adm.setAdmissionNo("ADM-" + System.currentTimeMillis() % 1000000);
        adm.setBedId(bedId);
        adm.setPatientId(patientId);
        adm.setPrimaryDoctorId(UUID.fromString("22222222-0001-0000-0000-000000000001"));
        adm.setDepartmentId(UUID.fromString("33333333-0001-0000-0000-000000000001"));
        adm.setAdmissionType(admissionType);
        adm.setInitialDiagnosis(diagnosis);
        adm.setAdmissionStatus("ADMITTED");
        AdmissionEntity savedAdm = admissionRepo.save(adm);

        bed.setBedStatus("OCCUPIED");
        bed.setCurrentAdmissionId(savedAdm.getId());
        bedRepo.save(bed);

        return ResponseEntity.ok(savedAdm);
    }

    @PostMapping("/discharge")
    @Transactional
    public ResponseEntity<?> dischargePatient(@RequestBody Map<String, String> req) {
        String bedIdStr = req.get("bedId");
        if (bedIdStr == null) return ResponseEntity.badRequest().body(Map.of("error", "bedId is required"));

        UUID bedId = UUID.fromString(bedIdStr);
        Optional<BedEntity> bedOpt = bedRepo.findById(bedId);
        if (bedOpt.isEmpty()) return ResponseEntity.notFound().build();

        BedEntity bed = bedOpt.get();
        if (bed.getCurrentAdmissionId() != null) {
            admissionRepo.findById(bed.getCurrentAdmissionId()).ifPresent(adm -> {
                adm.setAdmissionStatus("DISCHARGED");
                adm.setDischargeDate(LocalDateTime.now());
                admissionRepo.save(adm);
            });
        }

        bed.setBedStatus("CLEANING"); // Enforce sanitary turnover protocol before available
        bed.setCurrentAdmissionId(null);
        bedRepo.save(bed);

        return ResponseEntity.ok(Map.of("message", "Patient discharged successfully. Bed transitioned to CLEANING."));
    }

    @GetMapping("/census")
    public ResponseEntity<Map<String, Object>> getIpdCensus() {
        List<BedEntity> beds = bedRepo.findAll();
        int total = beds.isEmpty() ? 12 : beds.size();
        long occupied = beds.stream().filter(b -> "OCCUPIED".equalsIgnoreCase(b.getBedStatus())).count();
        long available = beds.stream().filter(b -> "AVAILABLE".equalsIgnoreCase(b.getBedStatus())).count();
        long cleaning = beds.stream().filter(b -> "CLEANING".equalsIgnoreCase(b.getBedStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBeds", total);
        stats.put("occupiedBeds", occupied);
        stats.put("availableBeds", available);
        stats.put("cleaningBeds", cleaning);
        stats.put("occupancyRate", total > 0 ? Math.round(((double) occupied / total) * 100) : 0);
        return ResponseEntity.ok(stats);
    }
}
