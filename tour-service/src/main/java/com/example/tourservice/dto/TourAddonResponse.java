package com.example.tourservice.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourAddonResponse {
    private Long id;
    private Long serviceId;
    private Long partnerId;
    private String name;
    private String type;
    private String unit;
    private BigDecimal price;
    private Integer quantity;
    private String note;
}
