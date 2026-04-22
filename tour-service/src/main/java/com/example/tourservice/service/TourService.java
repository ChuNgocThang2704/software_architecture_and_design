package com.example.tourservice.service;

import com.example.tourservice.dto.UpdateScheduleDetail;
import com.example.tourservice.dto.UpdateSchedule;
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

import java.util.ArrayList;
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
        log.info("TourService gọi db lấy danh sách tour.");
        List<Tour> tours = (name != null && !name.isBlank())
                ? tourRepository.findByNameContainingIgnoreCase(name)
                : tourRepository.findAll();
        return tours.stream()
                .map(this::mapTour)
                .toList();
    }

    public List<ScheduleResponse> getSchedulesByTour(Long tourId) {
        log.info("TourService gọi db lấy danh sách lịch trình của tour.");
        if (!tourRepository.existsById(tourId)) {
            throw new NotFoundException("Tour không tồn tại");
        }
        return scheduleRepository.findByTourId(tourId).stream()
                .map(this::mapSchedule)
                .toList();
    }

    public List<TourAddonResponse> getServicesByTour(Long tourId) {
        log.info("TourService gọi db lấy danh sách dịch vụ đi kèm của tour.");
        if (!tourRepository.existsById(tourId)) {
            throw new NotFoundException("Tour không tồn tại");
        }
        return tourAddonRepository.findByTourId(tourId).stream()
                .map(this::mapAddon)
                .toList();
    }


    @Transactional
    public void updateSchedule(UpdateSchedule request) {
        log.info("TourService được gọi từ BookingService cập nhật chỗ trống lịch trình theo tour.");
        if (!tourRepository.existsById(request.getTourId())) {
            throw new NotFoundException("Tour không tồn tại");
        }

        List<Schedule> schedulesToUpdate = new ArrayList<>();
        for (UpdateScheduleDetail item : request.getItems()) {
            Schedule schedule = scheduleRepository.findByIdAndTourId(item.getScheduleId(), request.getTourId())
                    .orElseThrow(() -> new NotFoundException("Không có lịch trình trong tour này"));

            if (schedule.getQuantity() < item.getQuantity()) {
                throw new InsufficientSeatsException("Không còn chỗ để đặt vé");
            }

            schedule.setQuantity(schedule.getQuantity() - item.getQuantity());
            schedulesToUpdate.add(schedule);
        }
        
        scheduleRepository.saveAll(schedulesToUpdate);
    }

    private TourResponse mapTour(Tour tour) {
        return TourResponse.builder()
                .id(tour.getId())
                .name(tour.getName())
                .destination(tour.getDestination())
                .type(tour.getType())
                .time(tour.getTime())
                .status(tour.getStatus())
                .note(tour.getNote())
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
                .adultPrice(schedule.getAdultPrice())
                .childPrice(schedule.getChildPrice())
                .quantity(schedule.getQuantity())
                .note(schedule.getNote())
                .tourId(schedule.getTour().getId())
                .tourName(schedule.getTour().getName())
                .build();
    }
}
