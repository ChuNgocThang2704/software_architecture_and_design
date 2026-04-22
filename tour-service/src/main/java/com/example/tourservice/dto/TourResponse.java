package com.example.tourservice.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourResponse {
    private Long id;
    private String name;
    private String destination;
    private String type;
    private Integer time;
    private String status;
    private String note;
}
