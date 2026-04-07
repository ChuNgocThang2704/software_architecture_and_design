package com.example.tourservice.repository;

import com.example.tourservice.entity.TourAddon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourAddonRepository extends JpaRepository<TourAddon, Long> {

    List<TourAddon> findByTourId(Long tourId);
}
