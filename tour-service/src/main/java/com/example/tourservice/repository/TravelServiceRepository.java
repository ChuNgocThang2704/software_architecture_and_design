package com.example.tourservice.repository;

import com.example.tourservice.entity.TravelService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelServiceRepository extends JpaRepository<TravelService, Long> {
}
