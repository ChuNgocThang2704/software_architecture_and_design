package com.example.tourservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbltravelservice")
@Getter
@Setter
@NoArgsConstructor
public class TravelService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String unit;

    @Column
    private String note;

    @Column(name = "tblPartnerid", nullable = false)
    private Long partnerId;

    @OneToMany(mappedBy = "service")
    private List<TourAddon> tourAddons = new ArrayList<>();

}
