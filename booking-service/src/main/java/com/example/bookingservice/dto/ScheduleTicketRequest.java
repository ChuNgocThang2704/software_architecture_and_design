package com.example.bookingservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleTicketRequest {

    @NotNull
    private Long scheduleId;

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotBlank
    private String type;

    private String note;
}
