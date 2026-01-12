package com.joyride.booking.repository;

import com.joyride.booking.model.AdminAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdminAvailabilityRepository extends JpaRepository<AdminAvailability, Long> {
    Optional<AdminAvailability> findByAvailableDate(LocalDate date);
    List<AdminAvailability> findByAvailableDateBetween(LocalDate start, LocalDate end);
    boolean existsByAvailableDateAndIsAvailable(LocalDate date, boolean isAvailable);
}