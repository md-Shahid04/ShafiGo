package com.swiftride.service;

import com.swiftride.dto.response.DriverEarningDto;
import com.swiftride.dto.response.DriverEarningsSummaryDto;
import com.swiftride.entity.Driver;
import com.swiftride.entity.DriverEarning;
import com.swiftride.entity.Ride;
import com.swiftride.exception.ResourceNotFoundException;
import com.swiftride.repository.DriverEarningRepository;
import com.swiftride.repository.DriverRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;

@Service
public class DriverEarningService {

    private static final double PLATFORM_FEE_PERCENTAGE = 0.15; // 15% Platform Commission

    private final DriverEarningRepository earningRepository;
    private final DriverRepository driverRepository;
    private final WebSocketEventPublisher eventPublisher;

    public DriverEarningService(DriverEarningRepository earningRepository, DriverRepository driverRepository, WebSocketEventPublisher eventPublisher) {
        this.earningRepository = earningRepository;
        this.driverRepository = driverRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public DriverEarning recordRideEarning(Ride ride) {
        if (ride == null || ride.getDriver() == null) {
            return null;
        }

        double grossFare = ride.getFinalFare() != null ? ride.getFinalFare() : ride.getEstimatedFare();
        double platformFee = round(grossFare * PLATFORM_FEE_PERCENTAGE);
        double netDriverEarning = round(grossFare - platformFee);

        DriverEarning earning = DriverEarning.builder()
                .driver(ride.getDriver())
                .ride(ride)
                .grossFare(round(grossFare))
                .platformFee(platformFee)
                .driverEarning(netDriverEarning)
                .distanceKm(ride.getDistanceKm())
                .durationMinutes(ride.getEstimatedDurationMinutes())
                .build();

        DriverEarning saved = earningRepository.save(earning);

        // Publish live earnings update to driver's personal topic
        Double todayTotal = earningRepository.sumDriverEarningsByDriverIdAndCreatedAtAfter(
                ride.getDriver().getId(),
                LocalDateTime.of(LocalDate.now(), LocalTime.MIN)
        );
        eventPublisher.publishDriverEarningsUpdated(ride.getDriver().getId(), saved, todayTotal);

        return saved;
    }

    @Transactional(readOnly = true)
    public DriverEarningsSummaryDto getEarningsSummary(Long driverUserId) {
        Driver driver = driverRepository.findByUserId(driverUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found for user: " + driverUserId));

        LocalDateTime startOfToday = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime startOfWeek = LocalDateTime.of(LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)), LocalTime.MIN);
        LocalDateTime startOfMonth = LocalDateTime.of(LocalDate.now().withDayOfMonth(1), LocalTime.MIN);

        Double todayEarnings = earningRepository.sumDriverEarningsByDriverIdAndCreatedAtAfter(driver.getId(), startOfToday);
        Double weeklyEarnings = earningRepository.sumDriverEarningsByDriverIdAndCreatedAtAfter(driver.getId(), startOfWeek);
        Double monthlyEarnings = earningRepository.sumDriverEarningsByDriverIdAndCreatedAtAfter(driver.getId(), startOfMonth);
        Double totalEarnings = earningRepository.sumDriverEarningsByDriverId(driver.getId());

        long completedTrips = earningRepository.countByDriverId(driver.getId());
        long todayTrips = earningRepository.countByDriverIdAndCreatedAtAfter(driver.getId(), startOfToday);

        double avgPerTrip = completedTrips > 0 ? (totalEarnings / completedTrips) : 0.0;
        long estimatedHours = (completedTrips * 25) / 60; // Estimated 25 mins per trip
        long remainingMins = (completedTrips * 25) % 60;
        String onlineHours = estimatedHours + "h " + remainingMins + "m";

        return DriverEarningsSummaryDto.builder()
                .todayEarnings(round(todayEarnings != null ? todayEarnings : 0.0))
                .weeklyEarnings(round(weeklyEarnings != null ? weeklyEarnings : 0.0))
                .monthlyEarnings(round(monthlyEarnings != null ? monthlyEarnings : 0.0))
                .totalEarnings(round(totalEarnings != null ? totalEarnings : 0.0))
                .completedTrips(completedTrips)
                .todayTrips(todayTrips)
                .onlineHours(onlineHours)
                .averageEarningsPerTrip(round(avgPerTrip))
                .build();
    }

    @Transactional(readOnly = true)
    public Page<DriverEarningDto> getEarningsHistory(Long driverUserId, Pageable pageable) {
        Driver driver = driverRepository.findByUserId(driverUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found for user: " + driverUserId));

        return earningRepository.findByDriverIdOrderByCreatedAtDesc(driver.getId(), pageable)
                .map(this::toDto);
    }

    private DriverEarningDto toDto(DriverEarning e) {
        return DriverEarningDto.builder()
                .id(e.getId())
                .rideId(e.getRide() != null ? e.getRide().getId() : null)
                .grossFare(e.getGrossFare())
                .platformFee(e.getPlatformFee())
                .driverEarning(e.getDriverEarning())
                .distanceKm(e.getDistanceKm())
                .durationMinutes(e.getDurationMinutes())
                .pickupAddress(e.getRide() != null ? e.getRide().getPickupAddress() : "Pickup Location")
                .destinationAddress(e.getRide() != null ? e.getRide().getDestinationAddress() : "Destination")
                .createdAt(e.getCreatedAt())
                .build();
    }

    private double round(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
