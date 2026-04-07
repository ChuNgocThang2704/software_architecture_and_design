package com.example.bookingservice.service;

import com.example.bookingservice.client.CustomerFeignClient;
import com.example.bookingservice.client.TourFeignClient;
import com.example.bookingservice.client.dto.ReserveScheduleItemRequest;
import com.example.bookingservice.client.dto.ReserveSchedulesRequest;
import com.example.bookingservice.client.dto.TourResponse;
import com.example.bookingservice.dto.*;
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
    private final TourFeignClient tourFeignClient;
    private final CustomerFeignClient customerFeignClient;

    public TicketResponse createTicket(CreateTicketRequest request) {
        try {
            log.info("Booking-service bắt đầu gọi đến customer-service để kiểm tra khách hàng!");
            customerFeignClient.getCustomerById(request.getCustomerId());
            log.info("Booking-service kết thúc gọi đến customer-service để kiểm tra khách hàng!");
        } catch (FeignException e) {
            throw new BadRequestException("Thông tin khách hàng bị lỗi");
        }

        try {
            var reserveRequest = new ReserveSchedulesRequest(
                    request.getScheduleTickets().stream()
                            .map(item -> new ReserveScheduleItemRequest(item.getScheduleId(), item.getQuantity()))
                            .toList()
            );
            log.info("Booking-service bắt đầu gọi đến tour-service để kiểm tra số lượng lịch trình!");
            tourFeignClient.reserveSchedules(request.getTourId(),    reserveRequest);
            log.info("Booking-service kết thúc gọi đến tour-service để kiểm tra số lượng lịch trình!");
        } catch (FeignException exception) {
            int status = exception.status();
            if (status == 404) {
                throw new NotFoundException("Tour hoặc lịch trình không tồn tại");
            }
            if (status == 409) {
                throw new BadRequestException("Lịch trình đã đầy");
            }
            throw new BadRequestException("Không thể đặt vé lúc này");
        }
        log.info("Booking-service đang tạo vé");
        Ticket ticket = new Ticket();
        ticket.setTourId(request.getTourId());
        ticket.setUserId(request.getUserId());
        ticket.setCustomerId(request.getCustomerId());
        ticket.setDatePayment(request.getDatePayment());
        ticket.setStatus(request.getStatus() == null || request.getStatus().isBlank() ? "PENDING" : request.getStatus());
        ticket.setNote(request.getNote());

        BigDecimal total = BigDecimal.ZERO;
        for (ScheduleTicketRequest item : request.getScheduleTickets()) {
            ScheduleTicket scheduleTicket = new ScheduleTicket();
            scheduleTicket.setTicket(ticket);
            scheduleTicket.setScheduleId(item.getScheduleId());
            scheduleTicket.setQuantity(item.getQuantity());
            scheduleTicket.setType(item.getType());
            scheduleTicket.setNote(item.getNote());
            scheduleTicket.setUnitPrice(item.getUnitPrice());
            ticket.getScheduleTickets().add(scheduleTicket);

            total = total.add(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        ticket.setTotal(total);

        return mapTicket(ticketRepository.save(ticket));
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicket(Long id) {
        log.info("Booking-service đang gọi database lấy thông tin vé!");
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Vé không"));
        return mapTicket(ticket);
    }

    private TicketResponse mapTicket(Ticket ticket) {
        String customerName = "";
        try {
            CustomerResponse customer = customerFeignClient.getCustomerById(ticket.getCustomerId());
            customerName = customer.getName();
        } catch (Exception e) {
        }
        String tourName = "";

        try {
            TourResponse tour = tourFeignClient.getTourById(ticket.getTourId());
            tourName = tour.getName();
        } catch (Exception e) {
        }
        List<ScheduleTicketResponse> items = ticket.getScheduleTickets().stream()
                .map(item -> ScheduleTicketResponse.builder()
                        .id(item.getId())
                        .scheduleId(item.getScheduleId())
                        .quantity(item.getQuantity())
                        .type(item.getType())
                        .note(item.getNote())
                        .unitPrice(item.getUnitPrice())
                        .lineTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .toList();

        return TicketResponse.builder()
                .id(ticket.getId())
                .tourId(ticket.getTourId())
                .userId(ticket.getUserId())
                .customerId(ticket.getCustomerId())
                .datePayment(ticket.getDatePayment())
                .customerName(customerName)
                .tourName(tourName)
                .status(ticket.getStatus())
                .note(ticket.getNote())
                .total(ticket.getTotal())
                .scheduleTickets(items)
                .build();
    }
}
