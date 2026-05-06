package com.example.partner_service.controller;

import com.example.partner_service.entity.Partner;
import com.example.partner_service.service.PartnerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/partners")
@RequiredArgsConstructor
public class PartnerController {

    private final PartnerService partnerService;

    @PostMapping
    public ResponseEntity<Partner> createPartner(@Valid @RequestBody Partner request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(partnerService.createPartner(request));
    }
}
