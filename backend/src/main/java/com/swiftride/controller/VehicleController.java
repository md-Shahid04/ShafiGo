package com.swiftride.controller;

import com.swiftride.dto.ApiResponse;
import com.swiftride.dto.request.VehicleRequest;
import com.swiftride.dto.response.VehicleDto;
import com.swiftride.entity.User;
import com.swiftride.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Vehicles", description = "Vehicle fleet and active vehicle switching")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Get all registered vehicles for current driver")
    public ResponseEntity<ApiResponse<List<VehicleDto>>> getVehicles(@AuthenticationPrincipal User user) {
        List<VehicleDto> vehicles = vehicleService.getVehiclesByDriverUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success(vehicles));
    }

    @PostMapping
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Register a new vehicle")
    public ResponseEntity<ApiResponse<VehicleDto>> addVehicle(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody VehicleRequest request
    ) {
        VehicleDto created = vehicleService.addVehicle(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Vehicle added successfully", created));
    }

    @PutMapping("/{id}/active")
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(summary = "Set active vehicle for the driver")
    public ResponseEntity<ApiResponse<VehicleDto>> setActiveVehicle(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        VehicleDto active = vehicleService.setActiveVehicle(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Active vehicle changed", active));
    }
}
