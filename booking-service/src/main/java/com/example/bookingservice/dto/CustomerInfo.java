package com.example.bookingservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerInfo {
    private String name;
    private String email;
    private String phone;
    private String address;
}
