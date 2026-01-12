package com.joyride.booking.repository;

import com.joyride.booking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    
    Optional<Booking> findByBookingDateTime(LocalDateTime dateTime);
    
    @Query("SELECT b FROM Booking b WHERE b.bookingDateTime >= :start AND b.bookingDateTime < :end AND b.status = 'CONFIRMED'")
    List<Booking> findBookingsByDateRange(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT b FROM Booking b WHERE DATE(b.bookingDateTime) = DATE(:date) AND b.status = 'CONFIRMED'")
    List<Booking> findConfirmedBookingsByDate(LocalDateTime date);
    
    boolean existsByBookingDateTimeAndStatus(LocalDateTime dateTime, Booking.BookingStatus status);
}