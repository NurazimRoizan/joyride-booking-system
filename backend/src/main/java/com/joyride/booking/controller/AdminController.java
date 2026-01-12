package com.joyride.booking.controller;

import com.joyride.booking.dto.BookingResponse;
import com.joyride.booking.model.AdminAvailability;
import com.joyride.booking.model.Booking;
import com.joyride.booking.repository.AdminAvailabilityRepository;
import com.joyride.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final AdminAvailabilityRepository availabilityRepository;
    private final BookingService bookingService;
    
    @PostMapping("/availability")
    public ResponseEntity<AdminAvailability> setAvailability(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam boolean isAvailable) {
        log.info("Setting availability for date: {} to {}", date, isAvailable);
        
        AdminAvailability availability = availabilityRepository
                .findByAvailableDate(date)
                .orElse(new AdminAvailability());
        
        availability.setAvailableDate(date);
        availability.setAvailable(isAvailable);
        
        AdminAvailability saved = availabilityRepository.save(availability);
        log.info("Availability set successfully for: {}", date);
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping("/availability")
    public ResponseEntity<List<AdminAvailability>> getAvailability(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<AdminAvailability> availability = availabilityRepository
                .findByAvailableDateBetween(startDate, endDate);
        return ResponseEntity.ok(availability);
    }
    
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getDailyBookings(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Booking> bookings = bookingService.getAllBookingsForDate(date);
        List<BookingResponse> response = bookings.stream()
                .map(booking -> BookingResponse.builder()
                        .id(booking.getId())
                        .bookingDateTime(booking.getBookingDateTime())
                        .status(booking.getStatus().name())
                        .notes(booking.getNotes())
                        .username(booking.getUser().getUsername())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}