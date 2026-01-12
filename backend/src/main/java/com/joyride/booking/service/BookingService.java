package com.joyride.booking.service;

import com.joyride.booking.model.Booking;
import com.joyride.booking.model.User;
import com.joyride.booking.repository.AdminAvailabilityRepository;
import com.joyride.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final AdminAvailabilityRepository availabilityRepository;
    
    private static final LocalTime MORNING_START = LocalTime.of(6, 0);
    private static final LocalTime MORNING_END = LocalTime.of(7, 30);
    private static final LocalTime EVENING_START = LocalTime.of(17, 0);
    private static final LocalTime EVENING_END = LocalTime.of(18, 30);
    private static final int SLOT_DURATION = 20;
    
    @Transactional
    public Booking createBooking(User user, LocalDateTime bookingDateTime, String notes) {
        log.info("Creating booking for user: {} at {}", user.getUsername(), bookingDateTime);
        
        validateBookingDateTime(bookingDateTime);
        
        if (isSlotBooked(bookingDateTime)) {
            log.warn("Slot already booked: {}", bookingDateTime);
            throw new IllegalStateException("This time slot is already booked");
        }
        
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setBookingDateTime(bookingDateTime);
        booking.setNotes(notes);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        
        Booking saved = bookingRepository.save(booking);
        log.info("Booking created successfully: {}", saved.getId());
        return saved;
    }
    
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
    
    @Transactional
    public void cancelBooking(Long bookingId, Long userId) {
        log.info("Cancelling booking: {} for user: {}", bookingId, userId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        
        if (!booking.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You can only cancel your own bookings");
        }
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepository.save(booking);
        log.info("Booking cancelled successfully: {}", bookingId);
    }
    
    public List<LocalDateTime> getAvailableSlots(LocalDate date) {
        if (!isAdminAvailable(date)) {
            log.info("Admin not available on: {}", date);
            return new ArrayList<>();
        }
        
        List<LocalDateTime> allSlots = generateDailySlots(date);
        List<Booking> bookedSlots = bookingRepository.findConfirmedBookingsByDate(date.atStartOfDay());
        
        bookedSlots.forEach(booking -> allSlots.remove(booking.getBookingDateTime()));
        
        LocalDateTime now = LocalDateTime.now();
        allSlots.removeIf(slot -> slot.isBefore(now));
        
        return allSlots;
    }
    
    private List<LocalDateTime> generateDailySlots(LocalDate date) {
        List<LocalDateTime> slots = new ArrayList<>();
        
        LocalTime morningSlot = MORNING_START;
        while (morningSlot.isBefore(MORNING_END)) {
            slots.add(LocalDateTime.of(date, morningSlot));
            morningSlot = morningSlot.plusMinutes(SLOT_DURATION);
        }
        
        LocalTime eveningSlot = EVENING_START;
        while (eveningSlot.isBefore(EVENING_END)) {
            slots.add(LocalDateTime.of(date, eveningSlot));
            eveningSlot = eveningSlot.plusMinutes(SLOT_DURATION);
        }
        
        return slots;
    }
    
    private boolean isAdminAvailable(LocalDate date) {
        return availabilityRepository.existsByAvailableDateAndIsAvailable(date, true);
    }
    
    private boolean isSlotBooked(LocalDateTime dateTime) {
        return bookingRepository.existsByBookingDateTimeAndStatus(dateTime, Booking.BookingStatus.CONFIRMED);
    }
    
    private void validateBookingDateTime(LocalDateTime dateTime) {
        LocalTime time = dateTime.toLocalTime();
        LocalDate date = dateTime.toLocalDate();
        
        if (!isAdminAvailable(date)) {
            throw new IllegalArgumentException("Admin is not available on this date");
        }
        
        boolean isInMorningWindow = !time.isBefore(MORNING_START) && time.isBefore(MORNING_END);
        boolean isInEveningWindow = !time.isBefore(EVENING_START) && time.isBefore(EVENING_END);
        
        if (!isInMorningWindow && !isInEveningWindow) {
            throw new IllegalArgumentException("Booking time must be within operating hours");
        }
        
        if (time.getMinute() % SLOT_DURATION != 0 || time.getSecond() != 0) {
            throw new IllegalArgumentException("Invalid time slot. Slots must be at 20-minute intervals");
        }
        
        if (dateTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Cannot book slots in the past");
        }
    }
    
    public List<Booking> getAllBookingsForDate(LocalDate date) {
        return bookingRepository.findConfirmedBookingsByDate(date.atStartOfDay());
    }
}