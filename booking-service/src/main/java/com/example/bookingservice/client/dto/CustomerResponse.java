package com.example.bookingservice.client.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
}
