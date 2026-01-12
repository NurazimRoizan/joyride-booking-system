package com.joyride.booking.controller;

import com.joyride.booking.dto.BookingRequest;
import com.joyride.booking.dto.BookingResponse;
import com.joyride.booking.model.Booking;
import com.joyride.booking.model.User;
import com.joyride.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {
    
    private final BookingService bookingService;
    
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BookingRequest request) {
        try {
            Booking booking = bookingService.createBooking(
                    user,
                    request.getBookingDateTime(),
                    request.getNotes()
            );
            return ResponseEntity.ok(convertToResponse(booking));
        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("Booking creation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal User user) {
        List<Booking> bookings = bookingService.getUserBookings(user.getId());
        List<BookingResponse> response = bookings.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        try {
            bookingService.cancelBooking(id, user.getId());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("Booking cancellation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/available-slots")
    public ResponseEntity<List<LocalDateTime>> getAvailableSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<LocalDateTime> slots = bookingService.getAvailableSlots(date);
        return ResponseEntity.ok(slots);
    }
    
    private BookingResponse convertToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingDateTime(booking.getBookingDateTime())
                .status(booking.getStatus().name())
                .notes(booking.getNotes())
                .username(booking.getUser().getUsername())
                .build();
    }
}