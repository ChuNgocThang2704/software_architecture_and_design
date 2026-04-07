package com.example.partner_service.repository;

import com.example.partner_service.entity.Partner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
    boolean existsByNameAndCompany(String name,String company);

    boolean existsByEmail(String email);
}
