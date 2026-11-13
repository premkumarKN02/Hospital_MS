package com.hospital.modules.email.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Map;

@Data
public class ShareDataEmailRequest {
    @NotBlank(message = "Recipient email is required")
    @Email(message = "Valid email address required")
    private String recipientEmail;

    private String recipientName;

    private String subject;

    private String notes;

    // Type of data being shared: "PATIENT_RECORD", "KYC_CARD", "APPOINTMENT", "INVOICE", "GENERAL"
    private String dataType;

    // The data payload (key-value pairs)
    private Map<String, Object> dataPayload;
}
