package com.example.bookingservice.service;

import com.example.bookingservice.client.CustomerClient;
import com.example.bookingservice.client.TourClient;
import com.example.bookingservice.client.dto.UpdateScheduleDetail;
import com.example.bookingservice.client.dto.UpdateSchedule;
import com.example.bookingservice.dto.CreateTicketRequest;
import com.example.bookingservice.client.dto.CustomerResponse;
import com.example.bookingservice.dto.ScheduleTicketRequest;
import com.example.bookingservice.dto.ScheduleTicketResponse;
import com.example.bookingservice.dto.TicketResponse;
import com.example.bookingservice.entity.ScheduleTicket;
import com.example.bookingservice.entity.Ticket;
import com.example.bookingservice.exception.BadRequestException;
import com.example.bookingservice.exception.NotFoundException;
import com.example.bookingservice.repository.TicketRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TourClient tourClient;
    private final CustomerClient customerClient;

    public TicketResponse createTicket(CreateTicketRequest request) {
        log.info("TicketService tiến hành xử lý luồng đặt vé mới.");
        validateCustomer(request.getCustomerId());
        
        UpdateSchedule updateScheduleReq = new UpdateSchedule();
        updateScheduleReq.setTourId(request.getTourId());
        List<UpdateScheduleDetail> details = new java.util.ArrayList<>();
        for (ScheduleTicketRequest itemReq : request.getScheduleTickets()) {
            UpdateScheduleDetail detail = new UpdateScheduleDetail();
            detail.setScheduleId(itemReq.getScheduleId());
            detail.setQuantity(itemReq.getQuantity());
            details.add(detail);
        }
        updateScheduleReq.setItems(details);
        updateSchedule(updateScheduleReq);

        Ticket ticket = new Ticket();
        ticket.setUserId(request.getUserId());
        ticket.setCustomerId(request.getCustomerId());
        ticket.setDatePayment(request.getDatePayment());
        ticket.setStatus(request.getStatus() == null || request.getStatus().isBlank() ? "PENDING" : request.getStatus());
        ticket.setNote(request.getNote());
        
        for (ScheduleTicketRequest item : request.getScheduleTickets()) {
            ScheduleTicket scheduleTicket = new ScheduleTicket();
            scheduleTicket.setTicket(ticket);
            scheduleTicket.setScheduleId(item.getScheduleId());
            scheduleTicket.setQuantity(item.getQuantity());
            scheduleTicket.setType(item.getType());
            scheduleTicket.setNote(item.getNote());
            ticket.getScheduleTickets().add(scheduleTicket);
        }

        ticket.setTotal(request.getTotal() != null ? request.getTotal() : BigDecimal.ZERO);
        Ticket savedTicket = ticketRepository.save(ticket);
        return mapTicket(savedTicket);
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicket(Long id) {
        log.info("TicketService gọi db để lấy thông tin chi tiết vé.");
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Vé không tồn tại"));
        return mapTicket(ticket);
    }

    private void validateCustomer(Long customerId) {
        log.info("TicketService gọi CustomerService để xác thực thông tin khách hàng");
        try {
            customerClient.getCustomerById(customerId);
        } catch (FeignException e) {
            throw new BadRequestException("Thông tin khách hàng bị lỗi");
        }
    }

    private void updateSchedule(UpdateSchedule request) {
        log.info("TicketService gọi TourService để cập nhật số lượng chỗ lịch trình của tour");
        try {
            tourClient.updateSchedule(request);
        } catch (FeignException exception) {
            if (exception.status() == 404) {
                throw new NotFoundException("Tour hoặc lịch trình không tồn tại");
            }
            if (exception.status() == 409) {
                throw new BadRequestException("Lịch trình đã đầy");
            }
            throw new BadRequestException("Không thể đặt vé lúc này");
        }
    }

    private TicketResponse mapTicket(Ticket ticket) {
        String customerName = "";
        try {
            CustomerResponse customer = customerClient.getCustomerById(ticket.getCustomerId());
            customerName = customer.getName();
        } catch (Exception ignored) {
        }

        List<ScheduleTicketResponse> items = ticket.getScheduleTickets().stream()
                .map(item -> {
                     return ScheduleTicketResponse.builder()
                            .id(item.getId())
                            .scheduleId(item.getScheduleId())
                            .quantity(item.getQuantity())
                            .type(item.getType())
                            .note(item.getNote())
                            .build();
                })
                .toList();

        return TicketResponse.builder()
                .id(ticket.getId())
                .userId(ticket.getUserId())
                .customerId(ticket.getCustomerId())
                .datePayment(ticket.getDatePayment())
                .customerName(customerName)
                .status(ticket.getStatus())
                .note(ticket.getNote())
                .total(ticket.getTotal())
                .scheduleTickets(items)
                .build();
    }
}
