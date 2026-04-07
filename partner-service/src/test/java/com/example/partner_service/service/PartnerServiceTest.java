package com.example.partner_service.service;

import com.example.partner_service.dto.PartnerRequest;
import com.example.partner_service.dto.PartnerResponse;
import com.example.partner_service.entity.Partner;
import com.example.partner_service.exception.BadRequestException;
import com.example.partner_service.exception.NotFoundException;
import com.example.partner_service.repository.PartnerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PartnerServiceTest {

    @Mock
    private PartnerRepository partnerRepository;

    @InjectMocks
    private PartnerService partnerService;

    @Test
    void shouldCreatePartner() {
        PartnerRequest request = buildRequest("partner1@example.com");
        Partner savedPartner = new Partner();
        savedPartner.setId(1L);
        savedPartner.setName(request.getName());
        savedPartner.setCompany(request.getCompany());
        savedPartner.setPhone(request.getPhone());
        savedPartner.setEmail(request.getEmail());
        savedPartner.setSignDate(request.getSignDate());
        savedPartner.setExpirationDate(request.getExpirationDate());

        when(partnerRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(partnerRepository.save(any(Partner.class))).thenReturn(savedPartner);

        PartnerResponse response = partnerService.create(request);

        assertEquals(1L, response.getId());
        assertEquals("partner1@example.com", response.getEmail());

        ArgumentCaptor<Partner> captor = ArgumentCaptor.forClass(Partner.class);
        verify(partnerRepository).save(captor.capture());
        assertEquals("Travel Partner", captor.getValue().getName());
    }

    @Test
    void shouldUpdatePartner() {
        Long partnerId = 10L;
        Partner existingPartner = new Partner();
        existingPartner.setId(partnerId);
        existingPartner.setEmail("old@example.com");

        PartnerRequest request = buildRequest("new@example.com");

        when(partnerRepository.findById(partnerId)).thenReturn(Optional.of(existingPartner));
        when(partnerRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(partnerRepository.save(any(Partner.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PartnerResponse response = partnerService.update(partnerId, request);

        assertEquals("new@example.com", response.getEmail());
        assertEquals("Travel Partner", response.getName());
    }

    @Test
    void shouldDeletePartner() {
        Long partnerId = 12L;
        Partner existingPartner = new Partner();
        existingPartner.setId(partnerId);

        when(partnerRepository.findById(partnerId)).thenReturn(Optional.of(existingPartner));

        partnerService.delete(partnerId);

        verify(partnerRepository).delete(existingPartner);
    }

    @Test
    void shouldRejectDuplicateEmail() {
        PartnerRequest request = buildRequest("duplicate@example.com");
        Partner existingPartner = new Partner();
        existingPartner.setId(99L);
        existingPartner.setEmail(request.getEmail());

        when(partnerRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(existingPartner));

        assertThrows(BadRequestException.class, () -> partnerService.create(request));
        verify(partnerRepository, never()).save(any(Partner.class));
    }

    @Test
    void shouldRejectMissingPartnerOnDelete() {
        when(partnerRepository.findById(eq(404L))).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> partnerService.delete(404L));
    }

    private PartnerRequest buildRequest(String email) {
        PartnerRequest request = new PartnerRequest();
        request.setName("Travel Partner");
        request.setCompany("Tour Company");
        request.setPhone("+84987654321");
        request.setEmail(email);
        request.setSignDate(LocalDate.of(2026, 3, 25));
        request.setExpirationDate(LocalDate.of(2026, 12, 31));
        return request;
    }
}
