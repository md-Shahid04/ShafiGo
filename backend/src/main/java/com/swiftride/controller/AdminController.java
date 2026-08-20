package com.swiftride.controller;

import com.swiftride.dto.ApiResponse;
import com.swiftride.dto.response.AdminDashboardStatsDto;
import com.swiftride.dto.response.DriverDto;
import com.swiftride.dto.response.RideDto;
import com.swiftride.dto.response.UserDto;
import com.swiftride.entity.DriverVerificationStatus;
import com.swiftride.entity.RideStatus;
import com.swiftride.entity.Role;
import com.swiftride.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Administration dashboard, user management, and driver verification")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get platform-wide dashboard statistics and metrics")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDto>> getDashboardStats() {
        AdminDashboardStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/users")
    @Operation(summary = "Get paginated user list with optional role filtering")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getAllUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<UserDto> users = adminService.getAllUsers(role, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/users/{id}/toggle-status")
    @Operation(summary = "Activate or deactivate a user account")
    public ResponseEntity<ApiResponse<UserDto>> toggleUserStatus(@PathVariable Long id) {
        UserDto updated = adminService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User status changed", updated));
    }

    @GetMapping("/drivers")
    @Operation(summary = "Get paginated driver list with optional verification status filtering")
    public ResponseEntity<ApiResponse<Page<DriverDto>>> getAllDrivers(
            @RequestParam(required = false) DriverVerificationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<DriverDto> drivers = adminService.getAllDrivers(status, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success(drivers));
    }

    @PutMapping("/drivers/{id}/verify")
    @Operation(summary = "Approve or reject a driver application")
    public ResponseEntity<ApiResponse<DriverDto>> verifyDriver(
            @PathVariable Long id,
            @RequestParam DriverVerificationStatus status
    ) {
        DriverDto updated = adminService.verifyDriver(id, status);
        return ResponseEntity.ok(ApiResponse.success("Driver verification status updated to " + status, updated));
    }

    @GetMapping("/rides")
    @Operation(summary = "Get paginated ride history across the entire platform")
    public ResponseEntity<ApiResponse<Page<RideDto>>> getAllRides(
            @RequestParam(required = false) RideStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<RideDto> rides = adminService.getAllRides(status, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success(rides));
    }

    @GetMapping("/rides/active")
    @Operation(summary = "Get all currently active ongoing rides on the road")
    public ResponseEntity<ApiResponse<List<RideDto>>> getActiveRides() {
        List<RideDto> activeRides = adminService.getActiveRides();
        return ResponseEntity.ok(ApiResponse.success(activeRides));
    }
}
