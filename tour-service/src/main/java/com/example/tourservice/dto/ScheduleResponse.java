package com.example.tourservice.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleResponse {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private String type;
    private BigDecimal adultPrice;
    private BigDecimal childPrice;
    private Integer quantity;
    private String note;
    private Long tourId;
    private String tourName;
}
