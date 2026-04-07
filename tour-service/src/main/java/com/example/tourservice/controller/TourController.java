package com.example.tourservice.controller;

import com.example.tourservice.dto.ReserveSchedulesRequest;
import com.example.tourservice.dto.ScheduleResponse;
import com.example.tourservice.dto.TourAddonResponse;
import com.example.tourservice.dto.TourResponse;
import com.example.tourservice.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.NO_CONTENT;

@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;

    @GetMapping
    public List<TourResponse> getTours(@RequestParam(required = false) String name) {
        return tourService.getTours(name);
    }

    @GetMapping("/{id}")
    public TourResponse getTour(@PathVariable Long id) {
        return tourService.getTour(id);
    }

    @GetMapping("/{id}/schedules")
    public List<ScheduleResponse> getSchedules(@PathVariable Long id) {
        return tourService.getSchedulesByTour(id);
    }

    @GetMapping("/{id}/services")
    public List<TourAddonResponse> getServices(@PathVariable Long id) {
        return tourService.getServicesByTour(id);
    }

    @PostMapping("/{id}/reserve")
    @ResponseStatus(NO_CONTENT)
    public void reserveSchedules(@PathVariable Long id, @RequestBody ReserveSchedulesRequest request) {
        tourService.reserveSchedules(id, request);
    }
}
