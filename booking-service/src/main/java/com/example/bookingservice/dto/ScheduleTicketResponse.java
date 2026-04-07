package com.example.bookingservice.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleTicketResponse {
    private Long id;
    private Long scheduleId;
    private Integer quantity;
    private String type;
    private String note;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
}
