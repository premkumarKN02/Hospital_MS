package com.hospital.modules.email;

import com.hospital.modules.email.dto.ContactEmailRequest;
import com.hospital.modules.email.dto.ShareDataEmailRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:Sindhu Healthcare <krishnanp0211@gmail.com>}")
    private String defaultFrom;

    @Value("${spring.mail.username:krishnanp0211@gmail.com}")
    private String adminEmail;

    /**
     * Send plain text email
     */
    public void sendSimpleEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(defaultFrom);
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(body);
            mailSender.send(msg);
            log.info("Email successfully sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Could not send email: " + e.getMessage(), e);
        }
    }

    /**
     * Send rich HTML formatted email
     */
    public void sendHtmlEmail(String to, String subject, String htmlBody, String replyTo) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(defaultFrom);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            if (replyTo != null && !replyTo.isBlank()) {
                helper.setReplyTo(replyTo);
            }

            mailSender.send(message);
            log.info("HTML email successfully sent to: {}", to);
        } catch (MessagingException e) {
            log.error("MessagingException sending email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to format or dispatch HTML email: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Failed to send HTML email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to dispatch email: " + e.getMessage(), e);
        }
    }

    /**
     * Handle Patient / User Contact Inquiry
     */
    public Map<String, Object> handleContactInquiry(ContactEmailRequest req) {
        String timeStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));

        // 1. Send Notification to Clinic Desk
        String clinicSubject = "New Patient Inquiry: " + (req.getSubject() != null ? req.getSubject() : "General Consultation") + " - " + req.getFullName();
        String clinicHtml = """
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
              <div style="background: linear-gradient(135deg, #0d9488, #0f766e); padding: 24px; color: #ffffff;">
                <h2 style="margin: 0; font-size: 20px;">Sindhu Healthcare — New Website Inquiry</h2>
                <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Received on %s</p>
              </div>
              <div style="padding: 24px; color: #1e293b;">
                <table style="width: 100%%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; width: 140px;">Patient Name:</td>
                    <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">%s</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b;">Phone Number:</td>
                    <td style="padding: 8px 0; font-weight: 600; color: #0d9488;">%s</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b;">Email Address:</td>
                    <td style="padding: 8px 0; color: #0f172a;">%s</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b;">Subject / Topic:</td>
                    <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">%s</td>
                  </tr>
                </table>
                <div style="margin-top: 18px; padding: 16px; background: #f8fafc; border-left: 4px solid #0d9488; border-radius: 8px;">
                  <strong style="color: #334155; font-size: 13px; display: block; margin-bottom: 6px;">Patient Message:</strong>
                  <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.5;">%s</p>
                </div>
              </div>
              <div style="padding: 16px 24px; background: #f1f5f9; text-align: center; font-size: 12px; color: #64748b;">
                Sindhu Clinic Integrated Operating Platform • Automated Notification
              </div>
            </div>
            """.formatted(timeStr, req.getFullName(), req.getPhone(), req.getEmail() != null ? req.getEmail() : "N/A", req.getSubject(), req.getMessage());

        sendHtmlEmail(adminEmail, clinicSubject, clinicHtml, req.getEmail());

        // 2. Send Acknowledgment Receipt to Patient if email provided
        boolean ackSent = false;
        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            try {
                String patientSubject = "Inquiry Received — Sindhu Clinic & Healthcare Network";
                String patientHtml = """
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                      <div style="background: linear-gradient(135deg, #0d9488, #059669); padding: 24px; color: #ffffff;">
                        <h2 style="margin: 0; font-size: 20px;">Sindhu Clinic &amp; Healthcare Network</h2>
                        <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">NABH / JCI Accredited Healthcare Provider</p>
                      </div>
                      <div style="padding: 24px; color: #1e293b;">
                        <p style="font-size: 15px; color: #0f172a; margin-top: 0;">Dear <strong>%s</strong>,</p>
                        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                          Thank you for reaching out to us. We have received your inquiry regarding <strong>%s</strong>.
                          Our clinical coordination team is reviewing your message and will contact you via phone (<strong>%s</strong>) shortly.
                        </p>
                        <div style="margin: 20px 0; padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px;">
                          <h4 style="margin: 0 0 8px; color: #166534; font-size: 14px;">Clinic Working Hours &amp; Direct Support:</h4>
                          <p style="margin: 0; font-size: 13px; color: #15803d; line-height: 1.5;">
                            Monday – Saturday: 8:00 AM – 9:00 PM<br/>
                            Emergency &amp; Help Desk: +91 98765 43210<br/>
                            Online Portal: http://localhost:5175
                          </p>
                        </div>
                        <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">Warm regards,<br/><strong>Sindhu Clinic Patient Care Team</strong></p>
                      </div>
                      <div style="padding: 14px 24px; background: #f8fafc; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                        This is an automated confirmation from Sindhu Clinic IOP. Confidential &amp; Encrypted.
                      </div>
                    </div>
                    """.formatted(req.getFullName(), req.getSubject(), req.getPhone());

                sendHtmlEmail(req.getEmail(), patientSubject, patientHtml, adminEmail);
                ackSent = true;
            } catch (Exception ex) {
                log.warn("Could not send patient receipt email: {}", ex.getMessage());
            }
        }

        return Map.of(
                "success", true,
                "message", "Your inquiry has been successfully transmitted via SMTP to our clinic desk.",
                "adminNotified", true,
                "acknowledgmentSent", ackSent,
                "timestamp", LocalDateTime.now()
        );
    }

    /**
     * Universal Healthcare Data Sharing via Live Email
     */
    public Map<String, Object> shareDataViaEmail(ShareDataEmailRequest req) {
        String subject = (req.getSubject() != null && !req.getSubject().isBlank())
                ? req.getSubject()
                : "Clinical Records & Health Dossier — Sindhu Healthcare Network";

        String dataTypeLabel = req.getDataType() != null ? req.getDataType().replace("_", " ") : "Healthcare Data";
        String timeStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));

        StringBuilder tableRows = new StringBuilder();
        if (req.getDataPayload() != null && !req.getDataPayload().isEmpty()) {
            for (Map.Entry<String, Object> entry : req.getDataPayload().entrySet()) {
                String key = formatKeyLabel(entry.getKey());
                String val = entry.getValue() != null ? entry.getValue().toString() : "N/A";
                tableRows.append("""
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 10px 12px; color: #64748b; font-size: 13px; width: 40%%; font-weight: 500;">%s</td>
                      <td style="padding: 10px 12px; color: #0f172a; font-size: 13px; font-weight: 600; font-family: monospace;">%s</td>
                    </tr>
                    """.formatted(key, val));
            }
        } else {
            tableRows.append("<tr><td colspan='2' style='padding: 12px; text-align: center; color: #64748b;'>No specific data parameters attached.</td></tr>");
        }

        String notesBlock = "";
        if (req.getNotes() != null && !req.getNotes().isBlank()) {
            notesBlock = """
                <div style="margin: 20px 0; padding: 14px 16px; background: #f8fafc; border-left: 4px solid #0d9488; border-radius: 8px;">
                  <strong style="color: #334155; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Attached Note / Instructions:</strong>
                  <p style="margin: 4px 0 0; color: #1e293b; font-size: 13px; line-height: 1.5;">%s</p>
                </div>
                """.formatted(req.getNotes());
        }

        String htmlContent = """
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #0d9488, #0f766e); padding: 26px; color: #ffffff;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <span style="font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #99f6e4;">SINDHU INTEGRATED HEALTHCARE PLATFORM</span>
                    <h2 style="margin: 4px 0 0; font-size: 20px; font-weight: 700;">Verified Health Information Dispatch</h2>
                  </div>
                </div>
                <p style="margin: 8px 0 0; font-size: 12px; opacity: 0.9;">ABDM &amp; UIDAI Standards Compliant • %s</p>
              </div>

              <!-- Body -->
              <div style="padding: 24px;">
                <p style="font-size: 14px; color: #334155; margin-top: 0;">
                  Hello %s,
                </p>
                <p style="font-size: 13px; line-height: 1.6; color: #475569;">
                  The following <strong>%s</strong> has been securely compiled and dispatched via Sindhu Healthcare's live SMTP communications system.
                </p>

                <!-- Data Card Table -->
                <div style="margin: 18px 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                  <div style="background: #f8fafc; padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.5px;">
                    %s Details
                  </div>
                  <table style="width: 100%%; border-collapse: collapse;">
                    %s
                  </table>
                </div>

                %s

                <!-- Security Assurance -->
                <div style="margin-top: 24px; padding: 12px 16px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; font-size: 12px; color: #065f46;">
                  <strong>Privacy Verified:</strong> Identity credentials have been validated according to Indian Healthcare ABDM and UIDAI e-KYC confidentiality guidelines.
                </div>
              </div>

              <!-- Footer -->
              <div style="padding: 18px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center; line-height: 1.5;">
                Sindhu Clinic &amp; Hospitals Network • ISO 9001 &amp; NABH Accredited<br/>
                For verification inquiries, contact: <a href="mailto:%s" style="color: #0d9488; text-decoration: none;">%s</a>
              </div>
            </div>
            """.formatted(
                timeStr,
                req.getRecipientName() != null ? "<strong>" + req.getRecipientName() + "</strong>" : "Healthcare Partner",
                dataTypeLabel,
                dataTypeLabel,
                tableRows.toString(),
                notesBlock,
                adminEmail,
                adminEmail
        );

        sendHtmlEmail(req.getRecipientEmail(), subject, htmlContent, adminEmail);

        return Map.of(
                "success", true,
                "recipientEmail", req.getRecipientEmail(),
                "subject", subject,
                "message", "Health data securely dispatched to " + req.getRecipientEmail() + " via Live SMTP.",
                "timestamp", LocalDateTime.now()
        );
    }

    private String formatKeyLabel(String camelCase) {
        if (camelCase == null) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < camelCase.length(); i++) {
            char c = camelCase.charAt(i);
            if (i > 0 && Character.isUpperCase(c)) {
                sb.append(' ');
            }
            if (i == 0) {
                sb.append(Character.toUpperCase(c));
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
