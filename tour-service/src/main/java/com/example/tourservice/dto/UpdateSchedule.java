package com.example.tourservice.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateSchedule {
    private Long tourId;
    private List<UpdateScheduleDetail> items;
}
