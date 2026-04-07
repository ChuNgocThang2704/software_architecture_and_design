package com.example.bookingservice.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTicketRequest {

    @NotNull
    private Long tourId;

    @NotNull
    private Long userId;

    @NotNull
    private Long customerId;

    @NotNull
    private LocalDate datePayment;

    private String status;

    private String note;

    @NotEmpty
    @Valid
    private List<ScheduleTicketRequest> scheduleTickets;
}
