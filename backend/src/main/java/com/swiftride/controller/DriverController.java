package com.swiftride.controller;

import com.swiftride.dto.ApiResponse;
import com.swiftride.dto.request.DriverLocationUpdateDto;
import com.swiftride.dto.request.DriverStatusUpdateDto;
import com.swiftride.dto.response.DriverDto;
import com.swiftride.dto.response.DriverEarningDto;
import com.swiftride.dto.response.DriverEarningsSummaryDto;
import com.swiftride.entity.User;
import com.swiftride.service.DriverEarningService;
import com.swiftride.service.DriverService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/drivers")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Drivers", description = "Driver status, location telemetry, and earnings management")
public class DriverController {

    private final DriverService driverService;
    private final DriverEarningService driverEarningService;

    public DriverController(DriverService driverService, DriverEarningService driverEarningService) {
        this.driverService = driverService;
        this.driverEarningService = driverEarningService;
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

    @PostMapping("/status/online")
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Set driver status to ONLINE")
    public ResponseEntity<ApiResponse<DriverDto>> setOnline(@AuthenticationPrincipal User user) {
        DriverStatusUpdateDto dto = new DriverStatusUpdateDto();
        dto.setOnlineStatus(com.swiftride.entity.DriverOnlineStatus.ONLINE);
        DriverDto updated = driverService.updateOnlineStatus(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("You are now online", updated));
    }

    @PostMapping("/status/offline")
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Set driver status to OFFLINE")
    public ResponseEntity<ApiResponse<DriverDto>> setOffline(@AuthenticationPrincipal User user) {
        DriverStatusUpdateDto dto = new DriverStatusUpdateDto();
        dto.setOnlineStatus(com.swiftride.entity.DriverOnlineStatus.OFFLINE);
        DriverDto updated = driverService.updateOnlineStatus(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("You are now offline", updated));
    }

    @GetMapping("/status")
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Get current driver availability status")
    public ResponseEntity<ApiResponse<DriverDto>> getStatus(@AuthenticationPrincipal User user) {
        DriverDto driver = driverService.getDriverByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(driver));
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

    @GetMapping("/earnings")
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Get driver live earnings summary (today, week, month, lifetime)")
    public ResponseEntity<ApiResponse<DriverEarningsSummaryDto>> getEarnings(@AuthenticationPrincipal User user) {
        DriverEarningsSummaryDto earnings = driverEarningService.getEarningsSummary(user.getId());
        return ResponseEntity.ok(ApiResponse.success(earnings));
    }

    @GetMapping("/earnings/history")
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Get paginated trip earnings history")
    public ResponseEntity<ApiResponse<Page<DriverEarningDto>>> getEarningsHistory(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<DriverEarningDto> history = driverEarningService.getEarningsHistory(
                user.getId(),
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
