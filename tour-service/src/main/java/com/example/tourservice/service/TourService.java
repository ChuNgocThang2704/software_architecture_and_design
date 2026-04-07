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
        log.info("Tour-service đang gọi database lấy danh sách tour!");
        List<Tour> tours;
        if (name != null && !name.isBlank()) {
            tours = tourRepository.findByNameContainingIgnoreCase(name);
        } else {
            tours = tourRepository.findAll();
        }
        return tours.stream()
                .map(this::mapTour)
                .toList();
    }

    public TourResponse getTour(Long id) {
        log.info("Tour-service đang gọi database lấy thông tin tour!");
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tour không tồn tại"));
        return mapTour(tour);
    }

    public List<ScheduleResponse> getSchedulesByTour(Long tourId) {
        log.info("Tour-service đang gọi database lấy danh sách lịch trình của tour!");
        if (!tourRepository.existsById(tourId)) {
            throw new NotFoundException("Tour không tồn tại");
        }
        return scheduleRepository.findByTourId(tourId).stream()
                .map(this::mapSchedule)
                .toList();
    }

    public List<TourAddonResponse> getServicesByTour(Long tourId) {
        log.info("Tour-service đang gọi database lấy danh sách dịch vụ!");
        if (!tourRepository.existsById(tourId)) {
            throw new NotFoundException("Tour không tồn tại");
        }
        return tourAddonRepository.findByTourId(tourId).stream()
                .map(this::mapAddon)
                .toList();
    }

    @Transactional
    public void reserveSchedules(Long tourId, ReserveSchedulesRequest request) {
        log.info("Booking-service gọi kiểm tra lịch trình!");
        if (!tourRepository.existsById(tourId)) {
            throw new NotFoundException("Tour không tồn tại");
        }

        for (ReserveScheduleItemRequest item : request.getItems()) {
            Schedule schedule = scheduleRepository.findByIdAndTourId(item.getScheduleId(), tourId)
                    .orElseThrow(() -> new NotFoundException(
                            "Không có lịch trình trong tour này"));

            if (schedule.getQuantity() < item.getQuantity()) {
                throw new InsufficientSeatsException(
                        "Không còn chỗ để đặt vé");
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
                .build();
    }
}
