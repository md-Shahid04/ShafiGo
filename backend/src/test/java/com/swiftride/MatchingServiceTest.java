package com.swiftride;

import com.swiftride.entity.*;
import com.swiftride.repository.DriverRepository;
import com.swiftride.service.MatchingService;
import com.swiftride.service.WebSocketEventPublisher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MatchingServiceTest {

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private WebSocketEventPublisher eventPublisher;

    @InjectMocks
    private MatchingService matchingService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(matchingService, "searchRadiusKm", 5.0);
        ReflectionTestUtils.setField(matchingService, "locationFreshnessSeconds", 300L);
    }

    @Test
    @DisplayName("Should find nearby drivers within search radius matching vehicle tier")
    void testFindNearbyDriversWithinRadius() {
        Driver closeDriver = Driver.builder()
                .id(1L)
                .verificationStatus(DriverVerificationStatus.APPROVED)
                .onlineStatus(DriverOnlineStatus.ONLINE)
                .currentLatitude(40.7128 + 0.01) // ~1.1km
                .currentLongitude(-74.0060)
                .build();
        Vehicle v1 = Vehicle.builder().vehicleType(VehicleType.SEDAN).active(true).build();
        closeDriver.getVehicles().add(v1);

        Driver farDriver = Driver.builder()
                .id(2L)
                .verificationStatus(DriverVerificationStatus.APPROVED)
                .onlineStatus(DriverOnlineStatus.ONLINE)
                .currentLatitude(40.7128 + 0.2) // ~22km
                .currentLongitude(-74.0060)
                .build();
        Vehicle v2 = Vehicle.builder().vehicleType(VehicleType.SEDAN).active(true).build();
        farDriver.getVehicles().add(v2);

        when(driverRepository.findByVerificationStatusAndOnlineStatus(
                DriverVerificationStatus.APPROVED,
                DriverOnlineStatus.ONLINE
        )).thenReturn(List.of(closeDriver, farDriver));

        List<Driver> result = matchingService.findNearbyDrivers(40.7128, -74.0060, VehicleType.SEDAN);

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
    }
}
