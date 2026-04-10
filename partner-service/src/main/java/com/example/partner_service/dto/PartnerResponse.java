package com.example.partner_service.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartnerResponse {
    private Long id;
    private String name;
    private String company;
    private String phone;
    private String email;
    private LocalDate signDate;
    private LocalDate expirationDate;
    private Long userId;
}
