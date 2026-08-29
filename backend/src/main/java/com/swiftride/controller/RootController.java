package com.swiftride.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@Tag(name = "Health & System", description = "Root and health check endpoints")
public class RootController {

    @GetMapping("/")
    @Operation(summary = "Root health check", description = "Public health check endpoint confirming backend service status")
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "ShafiGo Backend",
                "version", "1.0.0",
                "message", "ShafiGo API is running successfully",
                "docs", "/swagger-ui/index.html"
        ));
    }

    @GetMapping("/api/health")
    @Operation(summary = "API health check", description = "Standard health status for monitoring and uptime checkers")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "ShafiGo Backend"
        ));
    }
}
