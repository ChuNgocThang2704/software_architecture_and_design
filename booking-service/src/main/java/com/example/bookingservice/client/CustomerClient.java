package com.example.bookingservice.client;

import com.example.bookingservice.client.dto.CustomerResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "customer-service", url = "${services.customer.base-url:http://localhost:8082}")
public interface CustomerClient {

    @GetMapping("/api/customers/{id}")
    CustomerResponse getCustomerById(@PathVariable("id") Long id);
}
