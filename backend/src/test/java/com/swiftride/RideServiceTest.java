package com.swiftride;

import com.swiftride.dto.request.RideBookingRequest;
import com.swiftride.dto.response.RideDto;
import com.swiftride.entity.*;
import com.swiftride.exception.BadRequestException;
import com.swiftride.repository.DriverRepository;
import com.swiftride.repository.RideRepository;
import com.swiftride.repository.UserRepository;
import com.swiftride.service.MatchingService;
import com.swiftride.service.PricingService;
import com.swiftride.service.RideService;
import com.swiftride.service.WebSocketEventPublisher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RideServiceTest {

    @Mock
    private RideRepository rideRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private PricingService pricingService;

    @Mock
    private MatchingService matchingService;

    @Mock
    private WebSocketEventPublisher eventPublisher;

    @InjectMocks
    private RideService rideService;

    private User rider;
    private User driverUser;
    private Driver driver;
    private Vehicle vehicle;

    @BeforeEach
    void setUp() {
        rider = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .role(Role.ROLE_RIDER)
                .active(true)
                .build();

        driverUser = User.builder()
                .id(2L)
                .firstName("Mike")
                .lastName("Smith")
                .email("mike@example.com")
                .role(Role.ROLE_DRIVER)
                .active(true)
                .build();

        driver = Driver.builder()
                .id(10L)
                .user(driverUser)
                .verificationStatus(DriverVerificationStatus.APPROVED)
                .onlineStatus(DriverOnlineStatus.ONLINE)
                .rating(5.0)
                .totalRides(0)
                .build();

        vehicle = Vehicle.builder()
                .id(100L)
                .driver(driver)
                .vehicleType(VehicleType.SEDAN)
                .brand("Toyota")
                .model("Camry")
                .registrationNumber("TEST-123")
                .active(true)
                .build();

        driver.getVehicles().add(vehicle);
    }

    @Test
    @DisplayName("Should successfully create a ride request when no active ride exists")
    void testRequestRideSuccess() {
        RideBookingRequest request = new RideBookingRequest();
        request.setPickupAddress("Pickup Location");
        request.setPickupLatitude(40.7128);
        request.setPickupLongitude(-74.0060);
        request.setDestinationAddress("Destination Location");
        request.setDestinationLatitude(40.7580);
        request.setDestinationLongitude(-73.9855);
        request.setVehicleType(VehicleType.SEDAN);

        when(userRepository.findById(1L)).thenReturn(Optional.of(rider));
        when(rideRepository.findFirstByRiderIdAndStatusInOrderByCreatedAtDesc(eq(1L), anyList()))
                .thenReturn(Optional.empty());

        com.swiftride.dto.response.RideEstimateResponse mockEstimate = com.swiftride.dto.response.RideEstimateResponse.builder()
                .distanceKm(5.0)
                .estimatedDurationMinutes(15)
                .estimatedFares(java.util.Map.of(VehicleType.SEDAN, 15.50))
                .build();
        when(pricingService.calculateEstimate(anyDouble(), anyDouble(), anyDouble(), anyDouble()))
                .thenReturn(mockEstimate);

        Ride mockSavedRide = Ride.builder()
                .id(50L)
                .rider(rider)
                .vehicleType(VehicleType.SEDAN)
                .pickupAddress(request.getPickupAddress())
                .pickupLatitude(request.getPickupLatitude())
                .pickupLongitude(request.getPickupLongitude())
                .destinationAddress(request.getDestinationAddress())
                .destinationLatitude(request.getDestinationLatitude())
                .destinationLongitude(request.getDestinationLongitude())
                .distanceKm(5.0)
                .estimatedDurationMinutes(15)
                .estimatedFare(15.50)
                .status(RideStatus.SEARCHING_DRIVER)
                .build();

        when(rideRepository.save(any(Ride.class))).thenReturn(mockSavedRide);

        RideDto result = rideService.requestRide(1L, request);

        assertNotNull(result);
        assertEquals(50L, result.getId());
        assertEquals(RideStatus.SEARCHING_DRIVER, result.getStatus());
        verify(matchingService, times(1)).dispatchRideToNearbyDrivers(any(Ride.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException if rider already has an active ongoing ride")
    void testRequestRideThrowsWhenActiveRideExists() {
        RideBookingRequest request = new RideBookingRequest();
        request.setPickupLatitude(40.7128);
        request.setPickupLongitude(-74.0060);
        request.setDestinationLatitude(40.7580);
        request.setDestinationLongitude(-73.9855);
        request.setVehicleType(VehicleType.SEDAN);

        when(userRepository.findById(1L)).thenReturn(Optional.of(rider));
        when(rideRepository.findFirstByRiderIdAndStatusInOrderByCreatedAtDesc(eq(1L), anyList()))
                .thenReturn(Optional.of(new Ride()));

        assertThrows(BadRequestException.class, () -> rideService.requestRide(1L, request));
    }

    @Test
    @DisplayName("Driver can accept a ride in SEARCHING_DRIVER state")
    void testAcceptRideSuccess() {
        Ride pendingRide = Ride.builder()
                .id(50L)
                .rider(rider)
                .status(RideStatus.SEARCHING_DRIVER)
                .build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(driverUser));
        when(driverRepository.findByUserId(2L)).thenReturn(Optional.of(driver));
        when(rideRepository.findByIdForUpdate(50L)).thenReturn(Optional.of(pendingRide));
        when(rideRepository.save(any(Ride.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RideDto result = rideService.acceptRide(2L, 50L);

        assertNotNull(result);
        assertEquals(RideStatus.DRIVER_ACCEPTED, result.getStatus());
        assertEquals(DriverOnlineStatus.BUSY, driver.getOnlineStatus());
        verify(eventPublisher, times(1)).publishRideAccepted(any(Ride.class));
    }
}
