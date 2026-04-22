package com.example.bookingservice.client;

import com.example.bookingservice.client.dto.UpdateSchedule;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "tour-feign-client", url = "${services.tour.base-url}")
public interface TourClient {

    @PostMapping("/api/tours/update")
    void updateSchedule(@RequestBody UpdateSchedule request);
}
