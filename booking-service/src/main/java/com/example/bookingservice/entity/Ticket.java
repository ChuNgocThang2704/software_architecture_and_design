package com.example.bookingservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tblticket")
@Getter
@Setter
@NoArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tblUserid", nullable = false)
    private Long userId;

    @Column(name = "tblCustomerid", nullable = false)
    private Long customerId;

    @Column(name = "datePayment", nullable = false)
    private LocalDate datePayment;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(length = 500)
    private String note;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ScheduleTicket> scheduleTickets = new ArrayList<>();
}
