package com.example.partner_service.service;

import com.example.partner_service.client.UserFeignClient;
import com.example.partner_service.client.dto.UserResponse;
import com.example.partner_service.dto.PartnerRequest;
import com.example.partner_service.dto.PartnerResponse;
import com.example.partner_service.entity.Partner;
import com.example.partner_service.exception.BadRequestException;
import com.example.partner_service.exception.ConflictException;
import com.example.partner_service.repository.PartnerRepository;
import feign.FeignException;
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
    private final UserFeignClient userFeignClient;

    public PartnerResponse create(PartnerRequest request) {
        validateManagerRole(request.getUserId());
        log.info("Partner-service dang goi database luu thong tin doi tac!");
        if (partnerRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email nay da duoc su dung");
        }
        if (partnerRepository.existsByNameAndCompany(request.getName(), request.getCompany())) {
            throw new ConflictException("Doi tac da ton tai trong he thong");
        }

        Partner partner = new Partner();
        mapRequestToEntity(request, partner);
        return mapToResponse(partnerRepository.save(partner));
    }

    private void validateManagerRole(Long userId) {
        try {
            UserResponse user = userFeignClient.getUserById(userId);
            String role = user.getRole() == null ? "" : user.getRole().trim().toUpperCase();
            if (!"MANAGER".equals(role)) {
                throw new BadRequestException("Chi MANAGER moi duoc quan ly doi tac");
            }
        } catch (BadRequestException exception) {
            throw exception;
        } catch (FeignException exception) {
            throw new BadRequestException("Khong xac thuc duoc thong tin nguoi quan ly");
        }
    }

    private void mapRequestToEntity(PartnerRequest request, Partner partner) {
        partner.setName(request.getName());
        partner.setCompany(request.getCompany());
        partner.setPhone(request.getPhone());
        partner.setEmail(request.getEmail());
        partner.setSignDate(request.getSignDate());
        partner.setExpirationDate(request.getExpirationDate());
        partner.setUserId(request.getUserId());
    }

    private PartnerResponse mapToResponse(Partner partner) {
        return new PartnerResponse(
                partner.getId(),
                partner.getName(),
                partner.getCompany(),
                partner.getPhone(),
                partner.getEmail(),
                partner.getSignDate(),
                partner.getExpirationDate(),
                partner.getUserId()
        );
    }
}
