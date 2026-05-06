package com.example.bookingservice.service;

import com.example.bookingservice.client.CustomerClient;
import com.example.bookingservice.client.TourClient;
import com.example.bookingservice.client.dto.CustomerResponse;
import com.example.bookingservice.client.dto.UpdateScheduleDetail;
import com.example.bookingservice.client.dto.UpdateSchedule;
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

    public Ticket createTicket(Long tourId, Ticket request) {
        log.info("TicketService tiến hành đặt vé mới.");
        validateCustomer(request.getCustomerId());
        
        UpdateSchedule updateScheduleReq = new UpdateSchedule();
        updateScheduleReq.setTourId(tourId);
        List<UpdateScheduleDetail> details = new java.util.ArrayList<>();
        for (ScheduleTicket itemReq : request.getScheduleTickets()) {
            UpdateScheduleDetail detail = new UpdateScheduleDetail();
            detail.setScheduleId(itemReq.getScheduleId());
            detail.setQuantity(itemReq.getQuantity());
            details.add(detail);
        }
        updateScheduleReq.setItems(details);
        updateSchedule(updateScheduleReq);

        request.setStatus(request.getStatus() == null || request.getStatus().isBlank() ? "PENDING" : request.getStatus());
        if (request.getTotal() == null) {
            request.setTotal(BigDecimal.ZERO);
        }
        for (ScheduleTicket st : request.getScheduleTickets()) {
            st.setTicket(request);
        }

        Ticket savedTicket = ticketRepository.save(request);
        return savedTicket;
    }

    @Transactional(readOnly = true)
    public Ticket getTicket(Long id) {
        log.info("TicketService gọi db để lấy thông tin chi tiết vé.");
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Vé không tồn tại"));
        return ticket;
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

}
