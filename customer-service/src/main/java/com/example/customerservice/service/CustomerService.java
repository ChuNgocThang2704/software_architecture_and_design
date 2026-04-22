package com.example.customerservice.service;

import com.example.customerservice.dto.CreateCustomerRequest;
import com.example.customerservice.dto.CustomerResponse;
import com.example.customerservice.entity.Customer;
import com.example.customerservice.exception.ConflictException;
import com.example.customerservice.exception.NotFoundException;
import com.example.customerservice.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<CustomerResponse> getCustomers(String name) {
        log.info("CustomerService gọi db lấy danh sách khách hàng.");
        List<Customer> customers;
        if (name != null && !name.isBlank()) {
            customers = customerRepository.findByNameContainingIgnoreCase(name);
        } else {
            customers = customerRepository.findAll();
        }
        return customers.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CustomerResponse getCustomerById(Long id) {
        log.info("CustomerService được gọi từ BookingService để lấy thông tin chi tiết khách hàng.");
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy khách hàng"));
        return mapToResponse(customer);
    }

    @Transactional
    public CustomerResponse createCustomer(CreateCustomerRequest request) {
        log.info("CustomerService gọi db lưu thông tin khách hàng mới.");
        if (customerRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ConflictException("Email này đã được sử dụng");
        }

        Customer newCustomer = Customer.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();
        Customer savedCustomer = customerRepository.save(newCustomer);
        return mapToResponse(savedCustomer);
    }

    private CustomerResponse mapToResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .build();
    }
}
