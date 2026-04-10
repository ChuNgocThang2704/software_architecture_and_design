package com.example.bookingservice.client;

import com.example.bookingservice.client.dto.ReserveSchedulesRequest;
import com.example.bookingservice.client.dto.ScheduleResponse;
import com.example.bookingservice.client.dto.TourResponse;
import lombok.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "tour-feign-client", url = "${services.tour.base-url}")
public interface TourFeignClient {

    @PostMapping("/api/tours/{id}/reserve")
    void reserveSchedules(@PathVariable("id") Long id, @RequestBody ReserveSchedulesRequest request);

    @GetMapping("/api/tours/{id}")
    TourResponse getTourById(@PathVariable("id") Long id);

    @GetMapping("/api/tours/schedules/{id}")
    ScheduleResponse getScheduleById(@PathVariable("id") Long id);
}
