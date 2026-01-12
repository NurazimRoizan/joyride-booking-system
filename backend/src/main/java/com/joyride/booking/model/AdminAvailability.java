package com.joyride.booking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "admin_availability", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"available_date"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminAvailability {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "available_date", nullable = false)
    private LocalDate availableDate;
    
    @Column(nullable = false)
    private boolean isAvailable = true;
    
    private String notes;
}