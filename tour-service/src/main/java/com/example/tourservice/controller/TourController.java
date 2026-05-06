package com.example.tourservice.controller;

import com.example.tourservice.dto.UpdateSchedule;
import com.example.tourservice.entity.Schedule;
import com.example.tourservice.entity.Tour;
import com.example.tourservice.entity.TourAddon;
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
    public ResponseEntity<List<Tour>> getTours(@RequestParam(required = false) String name) {
        return ResponseEntity.ok(tourService.getTours(name));
    }

    @GetMapping("/{id}/schedules")
    public ResponseEntity<List<Schedule>> getSchedules(@PathVariable Long id) {
        return ResponseEntity.ok(tourService.getSchedulesByTour(id));
    }

    @GetMapping("/{id}/services")
    public ResponseEntity<List<TourAddon>> getServices(@PathVariable Long id) {
        return ResponseEntity.ok(tourService.getServicesByTour(id));
    }

    @PostMapping("/update")
    public ResponseEntity<Void> updateSchedule(@RequestBody UpdateSchedule request) {
        tourService.updateSchedule(request);
        return ResponseEntity.noContent().build();
    }
}
