package com.hospital.modules.email.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContactEmailRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String email;

    private String subject;

    @NotBlank(message = "Message cannot be empty")
    private String message;
}
