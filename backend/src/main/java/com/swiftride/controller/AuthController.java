package com.swiftride.controller;

import com.swiftride.dto.ApiResponse;
import com.swiftride.dto.request.DriverRegisterRequest;
import com.swiftride.dto.request.LoginRequest;
import com.swiftride.dto.request.RegisterRequest;
import com.swiftride.dto.response.AuthResponse;
import com.swiftride.dto.response.UserDto;
import com.swiftride.entity.User;
import com.swiftride.service.AuthService;
import com.swiftride.util.EntityMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user registration, authentication, and session retrieval")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register as a rider")
    public ResponseEntity<ApiResponse<AuthResponse>> registerRider(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.registerRider(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Rider account created successfully", response));
    }

    @PostMapping("/driver-register")
    @Operation(summary = "Register as a driver with vehicle information")
    public ResponseEntity<ApiResponse<AuthResponse>> registerDriver(@Valid @RequestBody DriverRegisterRequest request) {
        AuthResponse response = authService.registerDriver(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Driver application submitted successfully", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Log in with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user details")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(EntityMapper.toUserDto(user)));
    }
}
