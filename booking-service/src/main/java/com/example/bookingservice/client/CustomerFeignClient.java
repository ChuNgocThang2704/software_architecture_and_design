package com.example.bookingservice.client;

import com.example.bookingservice.dto.CustomerInfo;
import com.example.bookingservice.dto.CustomerResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "customer-service", url = "${services.customer.base-url:http://localhost:8082}")
public interface CustomerFeignClient {

    @GetMapping("/api/customers/{id}")
    CustomerResponse getCustomerById(@PathVariable("id") Long id);
}
