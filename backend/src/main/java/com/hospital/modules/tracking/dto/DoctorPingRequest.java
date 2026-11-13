package com.hospital.modules.tracking.dto;

import lombok.Data;

@Data
public class DoctorPingRequest {
    private String doctorEmail;
    private String activationToken;
    private String phone;
    private Double latitude;
    private Double longitude;
    private Double accuracyMeters;
    private Double speedKmh;
    private Integer batteryLevel;
}
