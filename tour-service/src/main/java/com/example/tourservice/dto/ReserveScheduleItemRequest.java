package com.example.tourservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReserveScheduleItemRequest {

    @NotNull
    private Long scheduleId;

    @NotNull
    @Min(1)
    private Integer quantity;
}
