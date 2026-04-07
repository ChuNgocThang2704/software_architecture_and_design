package com.example.bookingservice.client.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReserveScheduleItemRequest {
    private Long scheduleId;
    private Integer quantity;
}