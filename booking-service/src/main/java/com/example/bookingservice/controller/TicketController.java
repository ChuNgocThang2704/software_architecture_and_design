package com.example.bookingservice.controller;

import com.example.bookingservice.entity.Ticket;
import com.example.bookingservice.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestParam Long tourId, @RequestBody Ticket request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.createTicket(tourId, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicket(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicket(id));
    }
}
