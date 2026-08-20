package com.swiftride.controller;

import com.swiftride.dto.ApiResponse;
import com.swiftride.dto.request.RideBookingRequest;
import com.swiftride.dto.request.RideCancelRequest;
import com.swiftride.dto.request.RideEstimateRequest;
import com.swiftride.dto.response.RideDto;
import com.swiftride.dto.response.RideEstimateResponse;
import com.swiftride.entity.User;
import com.swiftride.service.PricingService;
import com.swiftride.service.RideService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rides")
@Tag(name = "Rides", description = "Ride booking, estimation, matching, and lifecycle progression")
public class RideController {

    private final RideService rideService;
    private final PricingService pricingService;

    public RideController(RideService rideService, PricingService pricingService) {
        this.rideService = rideService;
        this.pricingService = pricingService;
    }

    @PostMapping("/estimate")
    @Operation(summary = "Calculate distance, duration, and fare estimates across all vehicle tiers")
    public ResponseEntity<ApiResponse<RideEstimateResponse>> estimateRide(
            @Valid @RequestBody RideEstimateRequest request
    ) {
        RideEstimateResponse estimate = pricingService.calculateEstimate(
                request.getPickupLatitude(), request.getPickupLongitude(),
                request.getDestinationLatitude(), request.getDestinationLongitude()
        );
        return ResponseEntity.ok(ApiResponse.success(estimate));
    }

    @PostMapping
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasRole('RIDER')")
    @Operation(summary = "Request a new ride")
    public ResponseEntity<ApiResponse<RideDto>> requestRide(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody RideBookingRequest request
    ) {
        RideDto ride = rideService.requestRide(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Ride requested successfully. Searching for nearby drivers.", ride));
    }

    @PostMapping("/{id}/accept")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Driver accepts a ride request (Concurrency-safe lock)")
    public ResponseEntity<ApiResponse<RideDto>> acceptRide(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        RideDto ride = rideService.acceptRide(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Ride accepted successfully", ride));
    }

    @PostMapping("/{id}/arriving")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Driver marks status as arriving at pickup location")
    public ResponseEntity<ApiResponse<RideDto>> driverArriving(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        RideDto ride = rideService.markDriverArriving(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Status updated to DRIVER_ARRIVING", ride));
    }

    @PostMapping("/{id}/arrive")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Driver marks arrival at pickup location")
    public ResponseEntity<ApiResponse<RideDto>> driverArrived(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        RideDto ride = rideService.markDriverArrived(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Status updated to DRIVER_ARRIVED", ride));
    }

    @PostMapping("/{id}/start")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Driver starts the ride with rider on-board")
    public ResponseEntity<ApiResponse<RideDto>> startRide(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        RideDto ride = rideService.startRide(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Ride started", ride));
    }

    @PostMapping("/{id}/complete")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Driver completes the ride at destination")
    public ResponseEntity<ApiResponse<RideDto>> completeRide(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        RideDto ride = rideService.completeRide(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Ride completed successfully", ride));
    }

    @PostMapping("/{id}/cancel")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Cancel a ride request")
    public ResponseEntity<ApiResponse<RideDto>> cancelRide(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody(required = false) RideCancelRequest request
    ) {
        RideDto ride = rideService.cancelRide(user.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Ride cancelled", ride));
    }

    @GetMapping("/active/rider")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasRole('RIDER')")
    @Operation(summary = "Get current active ride for logged in rider")
    public ResponseEntity<ApiResponse<RideDto>> getActiveRiderRide(@AuthenticationPrincipal User user) {
        RideDto ride = rideService.getActiveRideForRider(user.getId());
        return ResponseEntity.ok(ApiResponse.success(ride));
    }

    @GetMapping("/active/driver")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Get current active ride for logged in driver")
    public ResponseEntity<ApiResponse<RideDto>> getActiveDriverRide(@AuthenticationPrincipal User user) {
        RideDto ride = rideService.getActiveRideForDriver(user.getId());
        return ResponseEntity.ok(ApiResponse.success(ride));
    }

    @GetMapping("/history/rider")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasRole('RIDER')")
    @Operation(summary = "Get paginated ride history for rider")
    public ResponseEntity<ApiResponse<Page<RideDto>>> getRiderHistory(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<RideDto> history = rideService.getRiderRideHistory(
                user.getId(),
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/history/driver")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Get paginated ride history for driver")
    public ResponseEntity<ApiResponse<Page<RideDto>>> getDriverHistory(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<RideDto> history = rideService.getDriverRideHistory(
                user.getId(),
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Get ride details by ID")
    public ResponseEntity<ApiResponse<RideDto>> getRideById(@PathVariable Long id) {
        RideDto ride = rideService.getRideById(id);
        return ResponseEntity.ok(ApiResponse.success(ride));
    }
}
