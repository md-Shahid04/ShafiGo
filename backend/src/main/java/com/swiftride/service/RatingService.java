package com.swiftride.service;

import com.swiftride.dto.request.RatingRequest;
import com.swiftride.dto.response.RatingDto;
import com.swiftride.entity.*;
import com.swiftride.exception.BadRequestException;
import com.swiftride.exception.ConflictException;
import com.swiftride.exception.ResourceNotFoundException;
import com.swiftride.repository.DriverRepository;
import com.swiftride.repository.RatingRepository;
import com.swiftride.repository.RideRepository;
import com.swiftride.repository.UserRepository;
import com.swiftride.util.EntityMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;

    public RatingService(RatingRepository ratingRepository, RideRepository rideRepository, UserRepository userRepository, DriverRepository driverRepository) {
        this.ratingRepository = ratingRepository;
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
    }

    @Transactional
    public RatingDto rateRide(Long riderUserId, RatingRequest request) {
        User rider = userRepository.findById(riderUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Rider not found"));

        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));

        if (!ride.getRider().getId().equals(rider.getId())) {
            throw new BadRequestException("You can only rate rides booked by you");
        }

        if (ride.getStatus() != RideStatus.RIDE_COMPLETED) {
            throw new BadRequestException("Can only rate completed rides");
        }

        if (ratingRepository.findByRideId(ride.getId()).isPresent()) {
            throw new ConflictException("Ride has already been rated");
        }

        Driver driver = ride.getDriver();
        if (driver == null) {
            throw new BadRequestException("Ride does not have an assigned driver");
        }

        Rating rating = Rating.builder()
                .ride(ride)
                .rider(rider)
                .driver(driver)
                .rating(request.getRating())
                .comment(request.getComment() != null ? request.getComment().trim() : null)
                .build();

        Rating savedRating = ratingRepository.save(rating);

        Double avgRating = ratingRepository.findAverageRatingByDriverId(driver.getId());
        if (avgRating != null) {
            double rounded = BigDecimal.valueOf(avgRating).setScale(1, RoundingMode.HALF_UP).doubleValue();
            driver.setRating(rounded);
            driverRepository.save(driver);
        }

        return EntityMapper.toRatingDto(savedRating);
    }
}
