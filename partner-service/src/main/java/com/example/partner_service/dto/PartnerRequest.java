package com.example.partner_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class PartnerRequest {
    private String name;
    private String company;
    private String phone;
    @Email
    private String email;
    private LocalDate signDate;
    private LocalDate expirationDate;

}
