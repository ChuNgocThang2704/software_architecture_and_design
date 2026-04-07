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
@Table(name = "tours")
@Getter
@Setter
@NoArgsConstructor
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 150)
    private String destination;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(nullable = false)
    private Integer time;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(length = 500)
    private String note;

    @OneToMany(mappedBy = "tour")
    private List<Schedule> schedules = new ArrayList<>();

    @OneToMany(mappedBy = "tour")
    private List<TourAddon> tourServices = new ArrayList<>();

}
