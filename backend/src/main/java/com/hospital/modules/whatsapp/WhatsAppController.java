package com.hospital.modules.whatsapp;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/whatsapp")
@RequiredArgsConstructor
public class WhatsAppController {

    private final WhatsAppService whatsAppService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> gaState = whatsAppService.getStateInstance();
        Map<String, Object> config = whatsAppService.getConfig();

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("enabled", whatsAppService.isEnabled());
        resp.put("activeProvider", "green-api");
        resp.put("stateInstance", gaState.getOrDefault("stateInstance", "authorized"));
        resp.put("idInstance", config.get("greenApiIdInstance"));
        resp.put("apiUrl", config.get("greenApiApiUrl"));
        resp.put("tokenMasked", config.get("greenApiTokenMasked"));
        resp.put("phone", "917871558651");

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getConfig() {
        return ResponseEntity.ok(whatsAppService.getConfig());
    }

    @PostMapping("/config")
    public ResponseEntity<Map<String, Object>> updateConfig(@RequestBody Map<String, String> body) {
        String instanceId = body.get("instanceId");
        String token = body.get("token");
        String apiUrl = body.get("apiUrl");

        if (instanceId != null && instanceId.startsWith("instance")) {
            whatsAppService.updateUltraMsgConfig(instanceId, token, apiUrl);
        } else {
            whatsAppService.updateGreenApiConfig(instanceId, token, apiUrl);
        }

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "WhatsApp credentials successfully updated in real-time.");
        res.put("config", whatsAppService.getConfig());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        String message = body.get("message");
        if (phone == null || phone.isBlank() || message == null || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Phone and message are required"));
        }
        Map<String, Object> res = whatsAppService.sendTextMessage(phone, message);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/send-file-url")
    public ResponseEntity<Map<String, Object>> sendFileByUrl(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        String urlFile = body.get("urlFile");
        String fileName = body.getOrDefault("fileName", "document.pdf");
        String caption = body.getOrDefault("caption", "Official document from Sindhu Hospital");
        if (phone == null || phone.isBlank() || urlFile == null || urlFile.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Phone and urlFile are required"));
        }
        Map<String, Object> res = whatsAppService.sendFileByUrl(phone, urlFile, fileName, caption);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/send-invoice")
    public ResponseEntity<Map<String, Object>> sendInvoice(@RequestBody Map<String, Object> body) {
        String phone = (String) body.get("phone");
        String invoiceNo = (String) body.get("invoiceNo");
        String patientName = (String) body.get("patientName");
        double amount = body.get("amount") != null ? Double.parseDouble(body.get("amount").toString()) : 0.0;
        String paymentMode = (String) body.getOrDefault("paymentMode", "UPI");
        String summary = (String) body.getOrDefault("summary", "");

        if (phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Recipient phone number is required"));
        }
        Map<String, Object> res = whatsAppService.sendInvoice(phone, invoiceNo, patientName, amount, paymentMode, summary);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> sendTestMessage(@RequestParam(required = false) String phone) {
        String targetPhone = (phone != null && !phone.isBlank()) ? phone : "917871558651";
        String testMessage = """
            🏥 *Sindhu Healthcare Integrated Hospital System*
            ━━━━━━━━━━━━━━━━━━━━━━━━━━
            ✅ *Official WhatsApp Gateway Integration Verified!*

            • Direct In-App Dispatch: *Active*
            • Recipient Target: *+%s*
            • Real-time Doctor Radar & OPD Alert Engine: *Operational*
            • Token Authentication: *Verified*

            ━━━━━━━━━━━━━━━━━━━━━━━━━━
            _Automated direct notification service_
            """.formatted(targetPhone);

        Map<String, Object> res = whatsAppService.sendTextMessage(targetPhone, testMessage);
        return ResponseEntity.ok(res);
    }
}
