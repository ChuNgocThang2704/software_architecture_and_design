package com.example.tourservice.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReserveSchedulesRequest {

    @NotEmpty
    @Valid
    private List<ReserveScheduleItemRequest> items;
}
