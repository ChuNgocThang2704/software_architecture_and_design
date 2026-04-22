package com.example.bookingservice.client.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateScheduleDetail {
    private Long scheduleId;
    private Integer quantity;
}