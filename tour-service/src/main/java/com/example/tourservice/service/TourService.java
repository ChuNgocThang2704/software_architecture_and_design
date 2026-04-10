package com.example.tourservice.service;

import com.example.tourservice.dto.ReserveScheduleItemRequest;
import com.example.tourservice.dto.ReserveSchedulesRequest;
import com.example.tourservice.dto.ScheduleResponse;
import com.example.tourservice.dto.TourAddonResponse;
import com.example.tourservice.dto.TourResponse;
import com.example.tourservice.entity.Schedule;
import com.example.tourservice.entity.Tour;
import com.example.tourservice.entity.TourAddon;
import com.example.tourservice.exception.InsufficientSeatsException;
import com.example.tourservice.exception.NotFoundException;
import com.example.tourservice.repository.ScheduleRepository;
import com.example.tourservice.repository.TourAddonRepository;
import com.example.tourservice.repository.TourRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class TourService {

    private final TourRepository tourRepository;
    private final ScheduleRepository scheduleRepository;
    private final TourAddonRepository tourAddonRepository;

    public List<TourResponse> getTours(String name) {
        log.info("Tour-service dang goi database lay danh sach tour!");
        List<Tour> tours = (name != null && !name.isBlank())
                ? tourRepository.findByNameContainingIgnoreCase(name)
                : tourRepository.findAll();
        return tours.stream()
                .map(this::mapTour)
                .toList();
    }

    public TourResponse getTour(Long id) {
        log.info("Tour-service dang goi database lay thong tin tour!");
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tour khong ton tai"));
        return mapTour(tour);
    }

    public List<ScheduleResponse> getSchedulesByTour(Long tourId) {
        log.info("Tour-service dang goi database lay danh sach lich trinh cua tour!");
        if (!tourRepository.existsById(tourId)) {
            throw new NotFoundException("Tour khong ton tai");
        }
        return scheduleRepository.findByTourId(tourId).stream()
                .map(this::mapSchedule)
                .toList();
    }

    public List<TourAddonResponse> getServicesByTour(Long tourId) {
        log.info("Tour-service dang goi database lay danh sach dich vu!");
        if (!tourRepository.existsById(tourId)) {
            throw new NotFoundException("Tour khong ton tai");
        }
        return tourAddonRepository.findByTourId(tourId).stream()
                .map(this::mapAddon)
                .toList();
    }

    public ScheduleResponse getSchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new NotFoundException("Lich trinh khong ton tai"));
        return mapSchedule(schedule);
    }

    @Transactional
    public void reserveSchedules(Long tourId, ReserveSchedulesRequest request) {
        log.info("Booking-service goi kiem tra lich trinh theo tour!");
        if (!tourRepository.existsById(tourId)) {
            throw new NotFoundException("Tour khong ton tai");
        }

        for (ReserveScheduleItemRequest item : request.getItems()) {
            Schedule schedule = scheduleRepository.findByIdAndTourId(item.getScheduleId(), tourId)
                    .orElseThrow(() -> new NotFoundException("Khong co lich trinh trong tour nay"));

            if (schedule.getQuantity() < item.getQuantity()) {
                throw new InsufficientSeatsException("Khong con cho de dat ve");
            }

            schedule.setQuantity(schedule.getQuantity() - item.getQuantity());
        }
    }

    @Transactional
    public void reserveSchedules(ReserveSchedulesRequest request) {
        log.info("Booking-service goi kiem tra lich trinh theo schedule!");
        for (ReserveScheduleItemRequest item : request.getItems()) {
            Schedule schedule = scheduleRepository.findById(item.getScheduleId())
                    .orElseThrow(() -> new NotFoundException("Lich trinh khong ton tai"));

            if (schedule.getQuantity() < item.getQuantity()) {
                throw new InsufficientSeatsException("Khong con cho de dat ve");
            }

            schedule.setQuantity(schedule.getQuantity() - item.getQuantity());
        }
    }

    private TourResponse mapTour(Tour tour) {
        List<TourAddonResponse> services = tour.getTourServices().stream()
                .map(this::mapAddon)
                .toList();
        return TourResponse.builder()
                .id(tour.getId())
                .name(tour.getName())
                .destination(tour.getDestination())
                .type(tour.getType())
                .time(tour.getTime())
                .status(tour.getStatus())
                .note(tour.getNote())
                .services(services)
                .build();
    }

    private TourAddonResponse mapAddon(TourAddon addon) {
        return TourAddonResponse.builder()
                .id(addon.getId())
                .serviceId(addon.getService().getId())
                .partnerId(addon.getService().getPartnerId())
                .name(addon.getService().getName())
                .type(addon.getService().getType())
                .unit(addon.getService().getUnit())
                .price(addon.getPrice())
                .quantity(addon.getQuantity())
                .note(addon.getNote())
                .build();
    }

    private ScheduleResponse mapSchedule(Schedule schedule) {
        return ScheduleResponse.builder()
                .id(schedule.getId())
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .type(schedule.getType())
                .price(schedule.getPrice())
                .quantity(schedule.getQuantity())
                .note(schedule.getNote())
                .tourId(schedule.getTour().getId())
                .tourName(schedule.getTour().getName())
                .build();
    }
}
