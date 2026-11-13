package com.hospital.modules.tracking;

import com.hospital.modules.email.EmailService;
import com.hospital.modules.tracking.dto.DoctorActivationRequest;
import com.hospital.modules.tracking.dto.DoctorPingRequest;
import com.hospital.modules.whatsapp.WhatsAppService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorTrackingService {

    private final DoctorLocationRepository repository;
    private final EmailService emailService;
    private final WhatsAppService whatsAppService;

    // Dynamic Hospital Headquarters (Default: Bhavani Operations HQ, Erode District, TN)
    private volatile double currentHospitalLat = 11.4428;
    private volatile double currentHospitalLng = 77.7011;
    private volatile String currentHospitalName = "Sindhu Bhavani Operations HQ";

    public static final double HOSPITAL_LAT = 11.4428;
    public static final double HOSPITAL_LNG = 77.7011;
    public static final String HOSPITAL_NAME = "Sindhu Bhavani Operations HQ";

    public double getCurrentHospitalLat() { return currentHospitalLat; }
    public double getCurrentHospitalLng() { return currentHospitalLng; }
    public String getCurrentHospitalName() { return currentHospitalName; }

    /**
     * Relocate hospital base hub dynamically to user's real physical coordinates
     * without generating any dummy doctors
     */
    @Transactional
    public List<DoctorLocationEntity> relocateHubAndDoctors(double baseLat, double baseLng, String baseName) {
        this.currentHospitalLat = baseLat;
        this.currentHospitalLng = baseLng;
        if (baseName != null && !baseName.isBlank()) {
            this.currentHospitalName = baseName;
        }

        log.info("Relocating hospital base hub to ({}, {}) - {}", baseLat, baseLng, currentHospitalName);
        List<DoctorLocationEntity> list = repository.findAll();
        for (DoctorLocationEntity doc : list) {
            if (doc.getLatitude() != null && doc.getLongitude() != null) {
                double distance = calculateDistanceKm(doc.getLatitude(), doc.getLongitude(), currentHospitalLat, currentHospitalLng);
                doc.setDistanceToHospitalKm(Math.round(distance * 100.0) / 100.0);
                doc.setEtaMinutes(calculateEtaMinutes(distance, doc.getSpeedKmh() != null ? doc.getSpeedKmh() : 0.0));
                repository.save(doc);
            }
        }
        return getAllLiveDoctors();
    }

    /**
     * Send live email with activation / permission link to doctor
     */
    @Transactional
    public Map<String, Object> sendActivationEmail(DoctorActivationRequest req) {
        String rawPhone = req.getPhone() != null ? req.getPhone().trim() : "";
        String cleanPhone = rawPhone.replaceAll("[^0-9+]", "");
        String email = req.getDoctorEmail() != null ? req.getDoctorEmail().trim() : "";

        if (email.isBlank() && !cleanPhone.isBlank()) {
            String digitsOnly = cleanPhone.replaceAll("[^0-9]", "");
            email = "mobile_" + digitsOnly + "@bhavani.radar";
        } else if (email.isBlank()) {
            throw new IllegalArgumentException("Please provide a phone number or email address to generate live tracking.");
        }

        String origin = req.getOriginUrl() != null && !req.getOriginUrl().isBlank()
                ? req.getOriginUrl().replaceAll("/+$", "")
                : "http://localhost:5175";

        DoctorLocationEntity doc = repository.findByDoctorEmail(email)
                .or(() -> !cleanPhone.isBlank() ? repository.findByPhone(cleanPhone) : Optional.empty())
                .orElse(new DoctorLocationEntity());

        doc.setDoctorEmail(email);
        if (req.getDoctorName() != null && !req.getDoctorName().isBlank()) {
            doc.setDoctorName(req.getDoctorName());
        } else if (doc.getDoctorName() == null) {
            doc.setDoctorName(!cleanPhone.isBlank() ? "Mobile User (" + cleanPhone + ")" : "Doctor (" + email + ")");
        }
        if (req.getSpecialization() != null && !req.getSpecialization().isBlank()) {
            doc.setSpecialization(req.getSpecialization());
        } else if (doc.getSpecialization() == null) {
            doc.setSpecialization("Field / Operations Staff");
        }
        if (!cleanPhone.isBlank()) {
            doc.setPhone(cleanPhone);
        }

        String token = UUID.randomUUID().toString();
        doc.setActivationToken(token);
        doc.setInvitationSentAt(LocalDateTime.now());
        if (doc.getStatus() == null) {
            doc.setStatus("ON_CALL_STANDBY");
        }
        repository.save(doc);

        String activationLink = origin + "/doctor/mobile-tracker?token=" + token + "&email=" + email + (!cleanPhone.isBlank() ? "&phone=" + cleanPhone : "");
        String sentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));

        String subject = "[URGENT ON-CALL RADAR] Live GPS Tracking Activation Request — " + doc.getDoctorName();
        String htmlBody = String.format("""
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="margin:0; padding:0; background:#f1f5f9; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              <div style="max-width:600px; margin:24px auto; background:#ffffff; border-radius:18px; border:1px solid #cbd5e1; overflow:hidden; box-shadow:0 10px 25px -5px rgba(0,0,0,0.06);">
                
                <!-- Hospital Header -->
                <div style="background:linear-gradient(135deg, #1e3a8a, #0284c7); padding:28px 24px; color:#ffffff; text-align:center;">
                  <div style="display:inline-block; padding:6px 14px; background:rgba(255,255,255,0.18); border-radius:30px; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:10px;">
                    🚨 EMERGENCY & ON-CALL COMMAND CENTER
                  </div>
                  <h1 style="margin:0; font-size:22px; font-weight:800; letter-spacing:-0.5px;">SINDHU HEALTHCARE HOSPITAL</h1>
                  <p style="margin:6px 0 0; font-size:14px; opacity:0.9;">Chennai Tertiary Medical City & Trauma Network</p>
                </div>

                <!-- Body Card -->
                <div style="padding:28px 24px; color:#1e293b;">
                  <h2 style="margin:0 0 12px; font-size:18px; color:#0f172a;">Hello %s,</h2>
                  <p style="margin:0 0 18px; font-size:14px; line-height:1.6; color:#475569;">
                    The hospital emergency triage desk has requested your <strong>Live Geolocation Radar Activation</strong> for active On-Call and emergency polytrauma duty.
                  </p>

                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px; margin-bottom:24px;">
                    <table style="width:100%%; font-size:13px; border-collapse:collapse;">
                      <tr>
                        <td style="color:#64748b; padding:4px 0; width:130px;">Specialist:</td>
                        <td style="color:#0f172a; font-weight:700; padding:4px 0;">%s</td>
                      </tr>
                      <tr>
                        <td style="color:#64748b; padding:4px 0;">Specialization:</td>
                        <td style="color:#0284c7; font-weight:700; padding:4px 0;">%s</td>
                      </tr>
                      <tr>
                        <td style="color:#64748b; padding:4px 0;">Target Campus:</td>
                        <td style="color:#0f172a; font-weight:600; padding:4px 0;">%s</td>
                      </tr>
                      <tr>
                        <td style="color:#64748b; padding:4px 0;">Time Issued:</td>
                        <td style="color:#64748b; padding:4px 0;">%s</td>
                      </tr>
                    </table>
                  </div>

                  <!-- Direct Activation CTA Button -->
                  <div style="text-align:center; margin:30px 0;">
                    <a href="%s" style="display:inline-block; background:linear-gradient(135deg, #0284c7, #2563eb); color:#ffffff; font-weight:700; font-size:15px; padding:14px 32px; border-radius:12px; text-decoration:none; box-shadow:0 6px 20px -2px rgba(37,99,235,0.35);">
                      📱 Authorize GPS &amp; Open Live Radar
                    </a>
                  </div>

                  <p style="font-size:12px; color:#64748b; line-height:1.5; text-align:center; margin-top:20px;">
                    🔒 <strong>Privacy Assurance:</strong> GPS telemetry is encrypted and only activated when you explicitly toggle your On-Call status. No persistent tracking occurs during off-duty hours.
                  </p>

                  <div style="margin-top:24px; padding-top:16px; border-top:1px solid #e2e8f0; font-size:11px; color:#94a3b8; word-break:break-all;">
                    Or copy and paste this link into your mobile browser:<br>
                    <a href="%s" style="color:#0284c7;">%s</a>
                  </div>
                </div>

                <!-- Footer -->
                <div style="background:#f8fafc; padding:16px 24px; text-align:center; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0;">
                  Sindhu Healthcare Systems • Automated Emergency Dispatch • 24/7 Hotline: +91 44 2836 7000
                </div>
              </div>
            </body>
            </html>
            """,
                doc.getDoctorName(),
                doc.getDoctorName(),
                doc.getSpecialization() != null ? doc.getSpecialization() : "Emergency Specialist",
                HOSPITAL_NAME,
                sentTime,
                activationLink,
                activationLink,
                activationLink
        );

        boolean emailDispatched = false;
        String errorMessage = null;
        try {
            emailService.sendHtmlEmail(email, subject, htmlBody, null);
            emailDispatched = true;
            log.info("GPS activation email successfully sent to: {}", email);
        } catch (Exception e) {
            log.warn("SMTP send failed or simulated for {}: {}", email, e.getMessage());
            errorMessage = e.getMessage();
        }

        // Automated WhatsApp Message Dispatch via Green-API
        boolean whatsappDispatched = false;
        String whatsappMessageId = null;
        if (!cleanPhone.isBlank()) {
            String waMessage = String.format("""
                🚨 *SINDHU HEALTHCARE HOSPITAL - LIVE GPS RADAR*
                ━━━━━━━━━━━━━━━━━━━━━━━━━━
                Hello *%s*,
                
                The Emergency Command Desk at Bhavani Operations HQ has requested your *Live Geolocation Tracking* for active monitoring.
                
                👉 *Tap this link to open the tracker and grant location access:*
                %s
                
                ━━━━━━━━━━━━━━━━━━━━━━━━━━
                _Sent via Sindhu Hospital Operations WhatsApp (+91 78715 58651)_
                """,
                doc.getDoctorName(),
                activationLink
            );

            try {
                Map<String, Object> waResult = whatsAppService.sendTextMessage(cleanPhone, waMessage);
                if (Boolean.TRUE.equals(waResult.get("success"))) {
                    whatsappDispatched = true;
                    whatsappMessageId = (String) waResult.get("idMessage");
                    log.info("Live tracking invite dispatched via Green-API WhatsApp to {}: {}", cleanPhone, whatsappMessageId);
                }
            } catch (Exception ex) {
                log.warn("WhatsApp dispatch warning for {}: {}", cleanPhone, ex.getMessage());
            }
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("email", email);
        resp.put("phone", doc.getPhone());
        resp.put("doctorName", doc.getDoctorName());
        resp.put("activationToken", token);
        resp.put("activationLink", activationLink);
        resp.put("emailDispatched", emailDispatched);
        resp.put("whatsappDispatched", whatsappDispatched);
        if (whatsappMessageId != null) {
            resp.put("whatsappMessageId", whatsappMessageId);
        }
        if (errorMessage != null) {
            resp.put("emailWarning", errorMessage);
        }
        return resp;
    }

    /**
     * Verify token from link
     */
    public DoctorLocationEntity verifyToken(String token) {
        return repository.findByActivationToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired tracking activation token."));
    }

    /**
     * Doctor clicks "Grant Permission"
     */
    @Transactional
    public DoctorLocationEntity grantPermission(String token) {
        DoctorLocationEntity doc = verifyToken(token);
        doc.setPermissionGranted(true);
        doc.setPermissionGrantedAt(LocalDateTime.now());
        doc.setStatus("ON_CALL_STANDBY");
        return repository.save(doc);
    }

    /**
     * Mobile phone streams GPS ping
     */
    @Transactional
    public DoctorLocationEntity recordPing(DoctorPingRequest req) {
        DoctorLocationEntity doc = null;
        if (req.getActivationToken() != null && !req.getActivationToken().isBlank()) {
            doc = repository.findByActivationToken(req.getActivationToken()).orElse(null);
        }
        if (doc == null && req.getDoctorEmail() != null && !req.getDoctorEmail().isBlank()) {
            doc = repository.findByDoctorEmail(req.getDoctorEmail()).orElse(null);
        }
        if (doc == null && req.getPhone() != null && !req.getPhone().isBlank()) {
            String clean = req.getPhone().replaceAll("[^0-9+]", "");
            doc = repository.findByPhone(clean).orElse(null);
        }
        if (doc == null) {
            String email = req.getDoctorEmail() != null && !req.getDoctorEmail().isBlank()
                    ? req.getDoctorEmail().trim()
                    : (req.getPhone() != null ? "mobile_" + req.getPhone().replaceAll("[^0-9]", "") + "@bhavani.radar" : null);
            if (email == null) {
                throw new IllegalArgumentException("Must provide doctorEmail, activationToken, or phone.");
            }
            doc = new DoctorLocationEntity();
            doc.setDoctorEmail(email);
            if (email.contains("admin")) {
                doc.setDoctorName("Admin Command Workstation (This Laptop)");
                doc.setSpecialization("Operations Director");
            } else {
                doc.setDoctorName("Mobile Device (" + (req.getPhone() != null ? req.getPhone() : email) + ")");
                doc.setSpecialization("Field / Operations Staff");
            }
            if (req.getPhone() != null) doc.setPhone(req.getPhone());
            if (req.getActivationToken() != null) doc.setActivationToken(req.getActivationToken());
        }

        doc.setPermissionGranted(true);
        if (doc.getPermissionGrantedAt() == null) {
            doc.setPermissionGrantedAt(LocalDateTime.now());
        }
        doc.setLatitude(req.getLatitude());
        doc.setLongitude(req.getLongitude());
        doc.setAccuracyMeters(req.getAccuracyMeters() != null ? req.getAccuracyMeters() : 10.0);
        doc.setSpeedKmh(req.getSpeedKmh() != null ? req.getSpeedKmh() : 0.0);
        if (req.getBatteryLevel() != null) {
            doc.setBatteryLevel(req.getBatteryLevel());
        }
        doc.setLastPingAt(LocalDateTime.now());

        // Distance & ETA
        double distKm = calculateDistanceKm(req.getLatitude(), req.getLongitude(), currentHospitalLat, currentHospitalLng);
        doc.setDistanceToHospitalKm(Math.round(distKm * 100.0) / 100.0);
        doc.setEtaMinutes(calculateEtaMinutes(distKm, doc.getSpeedKmh()));

        if (distKm <= 0.25) {
            doc.setStatus("AT_CAMPUS");
        } else if (doc.getSpeedKmh() > 5.0) {
            doc.setStatus("IN_TRANSIT_TO_HOSPITAL");
        } else {
            doc.setStatus("ACTIVE_STREAMING");
        }

        return repository.save(doc);
    }

    /**
     * Retrieve all active on-call doctors / personnel for admin map
     * Only returns real records; no dummy data is generated.
     */
    public List<DoctorLocationEntity> getAllLiveDoctors() {
        return repository.findAllByOrderByLastPingAtDesc();
    }

    /**
     * Delete a specific tracked number or email
     */
    @Transactional
    public void deleteTracker(String email) {
        if (email == null || email.isBlank()) return;
        repository.findByDoctorEmail(email).ifPresent(repository::delete);
    }

    /**
     * Clean all dummy/seeded demo locations, keeping only real entries
     */
    @Transactional
    public void clearAllDemoTrackers() {
        log.info("Purging all demo / unverified locations...");
        repository.findAll().forEach(doc -> {
            String email = doc.getDoctorEmail() != null ? doc.getDoctorEmail().toLowerCase() : "";
            String name = doc.getDoctorName() != null ? doc.getDoctorName().toLowerCase() : "";
            if (email.contains("sindhuhospital.org") && !email.contains("prem")
                || email.contains("mobile_919840")
                || name.contains("vijayalakshmi")
                || name.contains("rajesh kannan")
                || name.contains("meenakshi sundaram")) {
                repository.delete(doc);
            }
        });
    }

    /**
     * Simulate a doctor moving towards hospital (for demo/training drills)
     */
    @Transactional
    public DoctorLocationEntity simulateTransitStep(String email) {
        DoctorLocationEntity doc = repository.findByDoctorEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found: " + email));

        if (doc.getLatitude() == null || doc.getLongitude() == null) {
            doc.setLatitude(currentHospitalLat + 0.008);
            doc.setLongitude(currentHospitalLng + 0.006);
        }

        // Interpolate 25% closer towards active Hospital Base
        double currentLat = doc.getLatitude();
        double currentLng = doc.getLongitude();
        double newLat = currentLat + (currentHospitalLat - currentLat) * 0.25;
        double newLng = currentLng + (currentHospitalLng - currentLng) * 0.25;

        doc.setLatitude(newLat);
        doc.setLongitude(newLng);
        doc.setSpeedKmh(42.0); // Driving speed
        doc.setLastPingAt(LocalDateTime.now());

        double distKm = calculateDistanceKm(newLat, newLng, currentHospitalLat, currentHospitalLng);
        doc.setDistanceToHospitalKm(Math.round(distKm * 100.0) / 100.0);
        doc.setEtaMinutes(calculateEtaMinutes(distKm, 42.0));

        if (distKm <= 0.25) {
            doc.setStatus("AT_CAMPUS");
            doc.setSpeedKmh(0.0);
        } else {
            doc.setStatus("IN_TRANSIT_TO_HOSPITAL");
        }

        return repository.save(doc);
    }

    /**
     * Haversine formula distance in kilometers
     */
    public static double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in KM
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * ETA in minutes based on distance and speed (or default 25 km/h urban traffic)
     */
    public static int calculateEtaMinutes(double distKm, double speedKmh) {
        if (distKm <= 0.25) {
            return 0;
        }
        double effectiveSpeed = (speedKmh > 10.0) ? speedKmh : 24.0;
        double travelHours = distKm / effectiveSpeed;
        return (int) Math.max(2, Math.round(travelHours * 60.0) + 2); // 2 min response buffer
    }
}
