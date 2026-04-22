package com.example.tourservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateScheduleDetail {

    @NotNull
    private Long scheduleId;

    @NotNull
    private Integer quantity;
}
