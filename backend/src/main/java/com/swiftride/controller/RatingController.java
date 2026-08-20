package com.swiftride.controller;

import com.swiftride.dto.ApiResponse;
import com.swiftride.dto.request.RatingRequest;
import com.swiftride.dto.response.RatingDto;
import com.swiftride.entity.User;
import com.swiftride.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Ratings", description = "Ride ratings and feedback")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    @PreAuthorize("hasRole('RIDER')")
    @Operation(summary = "Submit a rating for a completed ride")
    public ResponseEntity<ApiResponse<RatingDto>> submitRating(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody RatingRequest request
    ) {
        RatingDto rating = ratingService.rateRide(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thank you for your rating!", rating));
    }
}
