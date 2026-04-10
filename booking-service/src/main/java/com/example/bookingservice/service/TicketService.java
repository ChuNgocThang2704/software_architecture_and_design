package com.example.bookingservice.service;

import com.example.bookingservice.client.CustomerFeignClient;
import com.example.bookingservice.client.TourFeignClient;
import com.example.bookingservice.client.dto.ReserveScheduleItemRequest;
import com.example.bookingservice.client.dto.ReserveSchedulesRequest;
import com.example.bookingservice.client.dto.ScheduleResponse;
import com.example.bookingservice.dto.CreateTicketRequest;
import com.example.bookingservice.dto.CustomerResponse;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TourFeignClient tourFeignClient;
    private final CustomerFeignClient customerFeignClient;

    public TicketResponse createTicket(CreateTicketRequest request) {
        validateCustomer(request.getCustomerId());
        reserveSchedules(request);

        Ticket ticket = new Ticket();
        ticket.setUserId(request.getUserId());
        ticket.setCustomerId(request.getCustomerId());
        ticket.setDatePayment(request.getDatePayment());
        ticket.setStatus(request.getStatus() == null || request.getStatus().isBlank() ? "PENDING" : request.getStatus());
        ticket.setNote(request.getNote());

        Map<Long, ScheduleResponse> scheduleCache = new HashMap<>();
        BigDecimal total = BigDecimal.ZERO;

        for (ScheduleTicketRequest item : request.getScheduleTickets()) {
            ScheduleResponse schedule = getScheduleOrThrow(item.getScheduleId());
            if (!schedule.getTourId().equals(request.getTourId())) {
                throw new BadRequestException("Lich trinh khong thuoc tour da chon");
            }
            scheduleCache.put(schedule.getId(), schedule);

            BigDecimal unitPrice = resolveUnitPrice(schedule, item.getType());

            ScheduleTicket scheduleTicket = new ScheduleTicket();
            scheduleTicket.setTicket(ticket);
            scheduleTicket.setScheduleId(item.getScheduleId());
            scheduleTicket.setQuantity(item.getQuantity());
            scheduleTicket.setType(item.getType());
            scheduleTicket.setNote(item.getNote());
            scheduleTicket.setUnitPrice(unitPrice);
            ticket.getScheduleTickets().add(scheduleTicket);

            total = total.add(unitPrice.multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        ticket.setTotal(total);
        Ticket savedTicket = ticketRepository.save(ticket);
        return mapTicket(savedTicket, scheduleCache);
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ve khong ton tai"));
        return mapTicket(ticket, new HashMap<>());
    }

    private void validateCustomer(Long customerId) {
        try {
            customerFeignClient.getCustomerById(customerId);
        } catch (FeignException e) {
            throw new BadRequestException("Thong tin khach hang bi loi");
        }
    }

    private void reserveSchedules(CreateTicketRequest request) {
        try {
            ReserveSchedulesRequest reserveRequest = new ReserveSchedulesRequest(
                    request.getScheduleTickets().stream()
                            .map(item -> new ReserveScheduleItemRequest(item.getScheduleId(), item.getQuantity()))
                            .toList()
            );
            tourFeignClient.reserveSchedules(request.getTourId(), reserveRequest);
        } catch (FeignException exception) {
            if (exception.status() == 404) {
                throw new NotFoundException("Tour hoac lich trinh khong ton tai");
            }
            if (exception.status() == 409) {
                throw new BadRequestException("Lich trinh da day");
            }
            throw new BadRequestException("Khong the dat ve luc nay");
        }
    }

    private TicketResponse mapTicket(Ticket ticket, Map<Long, ScheduleResponse> scheduleCache) {
        String customerName = "";
        try {
            CustomerResponse customer = customerFeignClient.getCustomerById(ticket.getCustomerId());
            customerName = customer.getName();
        } catch (Exception ignored) {
        }

        String tourName = "";
        List<ScheduleTicketResponse> items = ticket.getScheduleTickets().stream()
                .map(item -> {
                    ScheduleResponse schedule = scheduleCache.computeIfAbsent(item.getScheduleId(), this::getScheduleQuietly);
                    return ScheduleTicketResponse.builder()
                            .id(item.getId())
                            .scheduleId(item.getScheduleId())
                            .scheduleType(schedule != null ? schedule.getType() : null)
                            .startDate(schedule != null ? schedule.getStartDate() : null)
                            .endDate(schedule != null ? schedule.getEndDate() : null)
                            .quantity(item.getQuantity())
                            .type(item.getType())
                            .note(item.getNote())
                            .unitPrice(item.getUnitPrice())
                            .lineTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                            .build();
                })
                .toList();

        ScheduleResponse firstSchedule = ticket.getScheduleTickets().isEmpty()
                ? null
                : scheduleCache.computeIfAbsent(ticket.getScheduleTickets().get(0).getScheduleId(), this::getScheduleQuietly);
        if (firstSchedule != null) {
            tourName = firstSchedule.getTourName();
        }

        return TicketResponse.builder()
                .id(ticket.getId())
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

    private ScheduleResponse getScheduleOrThrow(Long scheduleId) {
        try {
            return tourFeignClient.getScheduleById(scheduleId);
        } catch (FeignException e) {
            throw new NotFoundException("Lich trinh khong ton tai");
        }
    }

    private ScheduleResponse getScheduleQuietly(Long scheduleId) {
        try {
            return tourFeignClient.getScheduleById(scheduleId);
        } catch (Exception ignored) {
            return null;
        }
    }

    private BigDecimal resolveUnitPrice(ScheduleResponse schedule, String ticketType) {
        String normalizedType = ticketType == null ? "" : ticketType.trim().toUpperCase();
        return switch (normalizedType) {
            case "CHILD" -> schedule.getChildPrice();
            case "ADULT" -> schedule.getAdultPrice();
            default -> throw new BadRequestException("Loai ve khong hop le");
        };
    }
}
