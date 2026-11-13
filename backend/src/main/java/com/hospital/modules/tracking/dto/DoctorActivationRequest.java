package com.hospital.modules.tracking.dto;

import lombok.Data;

@Data
public class DoctorActivationRequest {
    private String doctorEmail;
    private String doctorName;
    private String specialization;
    private String phone;
    private String originUrl; // e.g. http://localhost:5175
}
