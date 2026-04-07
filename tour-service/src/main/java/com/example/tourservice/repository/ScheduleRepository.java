package com.example.tourservice.repository;

import com.example.tourservice.entity.Schedule;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findByTourId(Long tourId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Schedule> findByIdAndTourId(Long id, Long tourId);
}
