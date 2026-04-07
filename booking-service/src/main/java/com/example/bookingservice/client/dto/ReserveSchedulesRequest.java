package com.example.bookingservice.client.dto;

import com.example.bookingservice.client.TourFeignClient;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReserveSchedulesRequest {
    private List<ReserveScheduleItemRequest> items;
}