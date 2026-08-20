package com.swiftride.controller;

import com.swiftride.dto.ApiResponse;
import com.swiftride.dto.request.DriverLocationUpdateDto;
import com.swiftride.dto.request.DriverStatusUpdateDto;
import com.swiftride.dto.response.DriverDto;
import com.swiftride.entity.User;
import com.swiftride.service.DriverService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/drivers")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Drivers", description = "Driver status, location telemetry, and profile management")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('DRIVER') or hasRole('ADMIN')")
    @Operation(summary = "Get driver profile for current user")
    public ResponseEntity<ApiResponse<DriverDto>> getDriverProfile(@AuthenticationPrincipal User user) {
        DriverDto driver = driverService.getDriverByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(driver));
    }

    @PutMapping("/status")
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Toggle driver availability (ONLINE / OFFLINE)")
    public ResponseEntity<ApiResponse<DriverDto>> updateStatus(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody DriverStatusUpdateDto dto
    ) {
        DriverDto updated = driverService.updateOnlineStatus(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Driver status updated", updated));
    }

    @PutMapping("/location")
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Update driver live GPS telemetry coordinates")
    public ResponseEntity<ApiResponse<DriverDto>> updateLocation(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody DriverLocationUpdateDto dto
    ) {
        DriverDto updated = driverService.updateLocation(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Location telemetry updated", updated));
    }
}
