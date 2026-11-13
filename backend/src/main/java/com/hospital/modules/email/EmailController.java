package com.hospital.modules.email;

import com.hospital.modules.email.dto.ContactEmailRequest;
import com.hospital.modules.email.dto.ShareDataEmailRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @Value("${spring.mail.host:smtp.gmail.com}")
    private String smtpHost;

    @Value("${spring.mail.port:587}")
    private int smtpPort;

    @Value("${spring.mail.username:krishnanp0211@gmail.com}")
    private String smtpUsername;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("active", true);
        status.put("host", smtpHost);
        status.put("port", smtpPort);
        status.put("sender", smtpUsername);
        status.put("protocol", "smtp");
        status.put("starttlsEnabled", true);
        status.put("authEnabled", true);
        status.put("sslEnabled", true);
        return ResponseEntity.ok(status);
    }

    @PostMapping("/contact")
    public ResponseEntity<Map<String, Object>> sendContactInquiry(@Valid @RequestBody ContactEmailRequest request) {
        return ResponseEntity.ok(emailService.handleContactInquiry(request));
    }

    @PostMapping("/share-data")
    public ResponseEntity<Map<String, Object>> shareData(@Valid @RequestBody ShareDataEmailRequest request) {
        return ResponseEntity.ok(emailService.shareDataViaEmail(request));
    }

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendGenericEmail(@RequestBody Map<String, String> payload) {
        String to = payload.get("to");
        String subject = payload.getOrDefault("subject", "Message from Sindhu Healthcare");
        String message = payload.get("message");
        boolean isHtml = "true".equalsIgnoreCase(payload.get("isHtml"));

        if (to == null || to.isBlank() || message == null || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Recipient email ('to') and 'message' are required"));
        }

        if (isHtml) {
            emailService.sendHtmlEmail(to, subject, message, smtpUsername);
        } else {
            emailService.sendSimpleEmail(to, subject, message);
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "to", to,
                "message", "Email successfully transmitted via SMTP"
        ));
    }
}
