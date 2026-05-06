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
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "tbltour")
@Getter
@Setter
@NoArgsConstructor
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Integer time;

    @Column(nullable = false)
    private String status;

    @Column(length = 500)
    private String note;

    @JsonIgnore
    @OneToMany(mappedBy = "tour")
    private List<Schedule> schedules = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "tour")
    private List<TourAddon> tourServices = new ArrayList<>();

}
