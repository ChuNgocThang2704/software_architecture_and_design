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

    @NotBlank
    private String name;

    @NotBlank
    private String company;

    @NotBlank
    private String phone;

    @NotBlank
    @Email
    private String email;

    @NotNull
    private LocalDate signDate;

    @NotNull
    @Future(message = "Expiration date must be in the future")
    private LocalDate expirationDate;

    @NotNull
    private Long userId;

}
