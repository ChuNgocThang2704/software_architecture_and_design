package com.example.bookingservice.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponse {
    private Long id;
    private Long tourId;
    private Long userId;
    private Long customerId;
    private String tourName;
    private String customerName;
    private LocalDate datePayment;
    private String status;
    private String note;
    private BigDecimal total;
    private List<ScheduleTicketResponse> scheduleTickets;
}
