package com.hospital.modules.tracking;

import com.hospital.modules.tracking.dto.DoctorActivationRequest;
import com.hospital.modules.tracking.dto.DoctorPingRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/doctors/tracking")
@RequiredArgsConstructor
public class DoctorTrackingController {

    private final DoctorTrackingService trackingService;

    /**
     * Trigger live email activation to doctor's email
     */
    @PostMapping("/request-activation")
    public ResponseEntity<Map<String, Object>> requestActivation(@RequestBody DoctorActivationRequest req) {
        log.info("Requesting tracking activation for: {}", req.getDoctorEmail());
        Map<String, Object> res = trackingService.sendActivationEmail(req);
        return ResponseEntity.ok(res);
    }

    /**
     * Mobile portal checks token on link click
     */
    @GetMapping("/verify-token")
    public ResponseEntity<DoctorLocationEntity> verifyToken(@RequestParam String token) {
        return ResponseEntity.ok(trackingService.verifyToken(token));
    }

    /**
     * Doctor clicks "Grant GPS Permission" on mobile
     */
    @PostMapping("/grant-permission")
    public ResponseEntity<DoctorLocationEntity> grantPermission(@RequestParam String token) {
        return ResponseEntity.ok(trackingService.grantPermission(token));
    }

    /**
     * Doctor's mobile device streams GPS coordinates
     */
    @PostMapping("/ping")
    public ResponseEntity<DoctorLocationEntity> recordPing(@RequestBody DoctorPingRequest req) {
        return ResponseEntity.ok(trackingService.recordPing(req));
    }

    /**
     * Hospital Admin live radar map fetches all doctors
     */
    @GetMapping("/live")
    public ResponseEntity<List<DoctorLocationEntity>> getLiveDoctors() {
        return ResponseEntity.ok(trackingService.getAllLiveDoctors());
    }

    /**
     * Drill / Simulation: Advance doctor towards hospital
     */
    @PostMapping("/simulate-transit")
    public ResponseEntity<DoctorLocationEntity> simulateTransit(@RequestParam(defaultValue = "knpremkumar1@gmail.com") String email) {
        return ResponseEntity.ok(trackingService.simulateTransitStep(email));
    }

    /**
     * Dynamically relocate base hospital coordinates and relocate doctors around it
     */
    @PostMapping("/relocate-hub")
    public ResponseEntity<List<DoctorLocationEntity>> relocateHub(@RequestBody Map<String, Object> payload) {
        double lat = Double.parseDouble(payload.get("latitude").toString());
        double lng = Double.parseDouble(payload.get("longitude").toString());
        String name = payload.get("hospitalName") != null ? payload.get("hospitalName").toString() : "Regional Emergency Trauma Hub";
        log.info("API relocate-hub called: lat={}, lng={}, name={}", lat, lng, name);
        return ResponseEntity.ok(trackingService.relocateHubAndDoctors(lat, lng, name));
    }

    /**
     * Delete a specific tracked number or email
     */
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteDoctor(@RequestParam String email) {
        trackingService.deleteTracker(email);
        return ResponseEntity.ok(Map.of("success", true, "message", "Tracker removed for: " + email));
    }

    /**
     * Purge all demo/unverified locations
     */
    @PostMapping("/clear-demo")
    public ResponseEntity<Map<String, Object>> clearDemo() {
        trackingService.clearAllDemoTrackers();
        return ResponseEntity.ok(Map.of("success", true, "message", "All demo locations removed successfully."));
    }
}
