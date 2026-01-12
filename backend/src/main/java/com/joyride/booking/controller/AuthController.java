package com.joyride.booking.controller;

import com.joyride.booking.dto.AuthResponse;
import com.joyride.booking.dto.LoginRequest;
import com.joyride.booking.dto.RegisterRequest;
import com.joyride.booking.model.Role;
import com.joyride.booking.model.User;
import com.joyride.booking.repository.UserRepository;
import com.joyride.booking.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration attempt for username: {}", request.getUsername());
        
        if (userRepository.existsByUsername(request.getUsername())) {
            log.warn("Registration failed - username exists: {}", request.getUsername());
            return ResponseEntity.badRequest().build();
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed - email exists: {}", request.getEmail());
            return ResponseEntity.badRequest().build();
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(Role.USER);
        
        userRepository.save(user);
        log.info("User registered successfully: {}", user.getUsername());
        
        String jwtToken = jwtService.generateToken(user);
        
        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build());
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login attempt for username: {}", request.getUsername());
        
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow();
            
            String jwtToken = jwtService.generateToken(user);
            log.info("User logged in successfully: {}", user.getUsername());
            
            return ResponseEntity.ok(AuthResponse.builder()
                    .token(jwtToken)
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .build());
        } catch (Exception e) {
            log.error("Login failed for username: {}", request.getUsername());
            return ResponseEntity.status(401).build();
        }
    }
}