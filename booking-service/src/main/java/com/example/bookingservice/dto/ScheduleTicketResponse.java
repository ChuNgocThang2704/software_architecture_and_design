package com.example.bookingservice.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleTicketResponse {
    private Long id;
    private Long scheduleId;
    private String scheduleType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer quantity;
    private String type;
    private String note;
}
