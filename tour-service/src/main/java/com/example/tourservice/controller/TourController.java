package com.example.tourservice.controller;

import com.example.tourservice.dto.UpdateSchedule;
import com.example.tourservice.dto.ScheduleResponse;
import com.example.tourservice.dto.TourAddonResponse;
import com.example.tourservice.dto.TourResponse;
import com.example.tourservice.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;

    @GetMapping
    public ResponseEntity<List<TourResponse>> getTours(@RequestParam(required = false) String name) {
        return ResponseEntity.ok(tourService.getTours(name));
    }

    @GetMapping("/{id}/schedules")
    public ResponseEntity<List<ScheduleResponse>> getSchedules(@PathVariable Long id) {
        return ResponseEntity.ok(tourService.getSchedulesByTour(id));
    }

    @GetMapping("/{id}/services")
    public ResponseEntity<List<TourAddonResponse>> getServices(@PathVariable Long id) {
        return ResponseEntity.ok(tourService.getServicesByTour(id));
    }

    @PostMapping("/update")
    public ResponseEntity<Void> updateSchedule(@RequestBody UpdateSchedule request) {
        tourService.updateSchedule(request);
        return ResponseEntity.noContent().build();
    }
}
