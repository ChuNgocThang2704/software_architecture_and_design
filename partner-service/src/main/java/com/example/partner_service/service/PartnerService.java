package com.example.partner_service.service;

import com.example.partner_service.dto.PartnerRequest;
import com.example.partner_service.dto.PartnerResponse;
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

    public PartnerResponse create(PartnerRequest request) {
        log.info("Partner-service đang gọi database lưu thông tin đối tác!");
        if (partnerRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email này đã được xử dụng");
        }
        if (partnerRepository.existsByNameAndCompany(request.getName(), request.getCompany())) {
            throw new ConflictException("Đối tác đã tồn tại trong hệ thống");
        }

        Partner partner = new Partner();
        mapRequestToEntity(request, partner);
        return mapToResponse(partnerRepository.save(partner));
    }

    private void mapRequestToEntity(PartnerRequest request, Partner partner) {
        partner.setName(request.getName());
        partner.setCompany(request.getCompany());
        partner.setPhone(request.getPhone());
        partner.setEmail(request.getEmail());
        partner.setSignDate(request.getSignDate());
        partner.setExpirationDate(request.getExpirationDate());
    }

    private PartnerResponse mapToResponse(Partner partner) {
        return new PartnerResponse(
                partner.getId(),
                partner.getName(),
                partner.getCompany(),
                partner.getPhone(),
                partner.getEmail(),
                partner.getSignDate(),
                partner.getExpirationDate()
        );
    }
}
