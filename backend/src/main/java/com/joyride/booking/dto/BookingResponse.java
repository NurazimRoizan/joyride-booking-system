package com.joyride.booking.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponse {
    private Long id;
    private LocalDateTime bookingDateTime;
    private String status;
    private String notes;
    private String username;
}