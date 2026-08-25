package com.swiftride.service;

import com.swiftride.dto.response.AdminDashboardStatsDto;
import com.swiftride.dto.response.DriverDto;
import com.swiftride.dto.response.RideDto;
import com.swiftride.dto.response.UserDto;
import com.swiftride.entity.*;
import com.swiftride.exception.ResourceNotFoundException;
import com.swiftride.repository.*;
import com.swiftride.util.EntityMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final DriverEarningRepository driverEarningRepository;
    private final RideRepository rideRepository;
    private final RatingRepository ratingRepository;
    private final WebSocketEventPublisher eventPublisher;

    public AdminService(
            UserRepository userRepository,
            DriverRepository driverRepository,
            DriverEarningRepository driverEarningRepository,
            RideRepository rideRepository,
            RatingRepository ratingRepository,
            WebSocketEventPublisher eventPublisher
    ) {
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.driverEarningRepository = driverEarningRepository;
        this.rideRepository = rideRepository;
        this.ratingRepository = ratingRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public AdminDashboardStatsDto getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalRiders = userRepository.countByRole(Role.ROLE_RIDER);
        long totalDrivers = driverRepository.count();
        long totalApprovedDrivers = driverRepository.countByVerificationStatus(DriverVerificationStatus.APPROVED);
        long activeDrivers = driverRepository.countByVerificationStatusAndOnlineStatus(DriverVerificationStatus.APPROVED, DriverOnlineStatus.ONLINE);
        long onlineDrivers = driverRepository.countByOnlineStatus(DriverOnlineStatus.ONLINE);
        long busyDrivers = driverRepository.countByOnlineStatus(DriverOnlineStatus.BUSY);
        long pendingApprovals = driverRepository.countByVerificationStatus(DriverVerificationStatus.PENDING);
        long activeRides = rideRepository.countByStatusIn(List.of(
                RideStatus.SEARCHING_DRIVER, RideStatus.DRIVER_ACCEPTED,
                RideStatus.DRIVER_ARRIVING, RideStatus.DRIVER_ARRIVED, RideStatus.RIDE_STARTED
        ));
        long completedRides = rideRepository.countByStatus(RideStatus.RIDE_COMPLETED);
        long cancelledRides = rideRepository.countByStatus(RideStatus.CANCELLED);

        Double totalRevenue = rideRepository.sumFinalFareByStatus(RideStatus.RIDE_COMPLETED);
        if (totalRevenue == null) totalRevenue = 0.0;

        Double driverEarnings = driverEarningRepository.sumDriverEarningsAll();
        if (driverEarnings == null || driverEarnings == 0.0) {
            driverEarnings = totalRevenue * 0.85;
        }

        Double platformCommission = driverEarningRepository.sumPlatformFeesAll();
        if (platformCommission == null || platformCommission == 0.0) {
            platformCommission = totalRevenue * 0.15;
        }

        Double avgRating = ratingRepository.findOverallAverageRating();
        if (avgRating == null) avgRating = 5.0;

        return AdminDashboardStatsDto.builder()
                .totalUsers(totalUsers)
                .totalRiders(totalRiders)
                .totalDrivers(totalDrivers)
                .totalApprovedDrivers(totalApprovedDrivers)
                .activeDrivers(activeDrivers)
                .onlineDrivers(onlineDrivers)
                .busyDrivers(busyDrivers)
                .pendingDriverApprovals(pendingApprovals)
                .activeRides(activeRides)
                .activeTrips(activeRides)
                .completedRides(completedRides)
                .completedTrips(completedRides)
                .cancelledRides(cancelledRides)
                .grossRevenue(BigDecimal.valueOf(totalRevenue).setScale(2, RoundingMode.HALF_UP).doubleValue())
                .driverEarnings(BigDecimal.valueOf(driverEarnings).setScale(2, RoundingMode.HALF_UP).doubleValue())
                .platformCommission(BigDecimal.valueOf(platformCommission).setScale(2, RoundingMode.HALF_UP).doubleValue())
                .totalRevenue(BigDecimal.valueOf(totalRevenue).setScale(2, RoundingMode.HALF_UP).doubleValue())
                .totalRevenueEstimated(BigDecimal.valueOf(totalRevenue).setScale(2, RoundingMode.HALF_UP).doubleValue())
                .averageRating(BigDecimal.valueOf(avgRating).setScale(1, RoundingMode.HALF_UP).doubleValue())
                .build();
    }

    @Transactional(readOnly = true)
    public Page<UserDto> getAllUsers(Role role, Pageable pageable) {
        if (role != null) {
            return userRepository.findByRole(role, pageable).map(EntityMapper::toUserDto);
        }
        return userRepository.findAll(pageable).map(EntityMapper::toUserDto);
    }

    @Transactional
    public UserDto toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setActive(!user.getActive());
        User updated = userRepository.save(user);
        return EntityMapper.toUserDto(updated);
    }

    @Transactional(readOnly = true)
    public Page<DriverDto> getAllDrivers(DriverVerificationStatus status, Pageable pageable) {
        if (status != null) {
            return driverRepository.findByVerificationStatus(status, pageable).map(EntityMapper::toDriverDto);
        }
        return driverRepository.findAll(pageable).map(EntityMapper::toDriverDto);
    }

    @Transactional
    public DriverDto verifyDriver(Long driverId, DriverVerificationStatus status) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));
        driver.setVerificationStatus(status);
        if (status != DriverVerificationStatus.APPROVED || driver.getOnlineStatus() != DriverOnlineStatus.BUSY) {
            driver.setOnlineStatus(DriverOnlineStatus.OFFLINE);
        }
        Driver updated = driverRepository.save(driver);

        // Broadcast to Driver & Admin
        eventPublisher.publishDriverVerificationUpdated(updated);
        eventPublisher.publishDriverStatusChanged(updated);

        return EntityMapper.toDriverDto(updated);
    }

    @Transactional(readOnly = true)
    public Page<RideDto> getAllRides(RideStatus status, Pageable pageable) {
        if (status != null) {
            return rideRepository.findByStatusOrderByCreatedAtDesc(status, pageable).map(EntityMapper::toRideDto);
        }
        return rideRepository.findAll(pageable).map(EntityMapper::toRideDto);
    }

    @Transactional(readOnly = true)
    public List<RideDto> getActiveRides() {
        return rideRepository.findByStatusInOrderByCreatedAtDesc(List.of(
                RideStatus.SEARCHING_DRIVER, RideStatus.DRIVER_ACCEPTED,
                RideStatus.DRIVER_ARRIVING, RideStatus.DRIVER_ARRIVED,
                RideStatus.RIDE_STARTED
        )).stream().map(EntityMapper::toRideDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DriverDto> getOnlineDrivers() {
        return driverRepository.findByVerificationStatusAndOnlineStatus(
                DriverVerificationStatus.APPROVED,
                DriverOnlineStatus.ONLINE
        ).stream().map(EntityMapper::toDriverDto).collect(Collectors.toList());
    }
}
