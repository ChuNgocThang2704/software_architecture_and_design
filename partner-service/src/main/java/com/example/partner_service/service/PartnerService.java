package com.example.partner_service.service;


import com.example.partner_service.entity.Partner;
import com.example.partner_service.exception.ConflictException;
import com.example.partner_service.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PartnerService {

    private final PartnerRepository partnerRepository;

    public Partner createPartner(Partner request) {
        log.info("PartnerService gọi db để lưu thông tin đối tác mới.");

        if (partnerRepository.existsByNameAndCompany(request.getName(), request.getCompany())) {
            throw new ConflictException("Đối tác đã tồn tại trong hệ thống");
        }

        return partnerRepository.save(request);
    }
}
