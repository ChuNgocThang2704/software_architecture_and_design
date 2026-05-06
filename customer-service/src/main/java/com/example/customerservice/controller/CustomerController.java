package com.example.customerservice.controller;


import com.example.customerservice.dto.CustomerResponse;
import com.example.customerservice.entity.Customer;
import com.example.customerservice.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<Customer>> getCustomers(@RequestParam(required = false) String name) {
        return ResponseEntity.ok(customerService.getCustomers(name));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerService.createCustomer(request));
    }
}
