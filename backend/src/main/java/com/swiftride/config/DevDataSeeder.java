package com.swiftride.config;

import com.swiftride.entity.*;
import com.swiftride.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@Profile("dev")
@Order(2)
public class DevDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DevDataSeeder.class);

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final RideRepository rideRepository;
    private final RatingRepository ratingRepository;
    private final PasswordEncoder passwordEncoder;

    public DevDataSeeder(
            UserRepository userRepository,
            DriverRepository driverRepository,
            VehicleRepository vehicleRepository,
            RideRepository rideRepository,
            RatingRepository ratingRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
        this.rideRepository = rideRepository;
        this.ratingRepository = ratingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 2) {
            log.info("Development database already contains sample seed data.");
            return;
        }

        log.info("Seeding initial SwiftRide development sample users, drivers, and trips (Bengaluru)...");

        // 1. Seed Riders in Bengaluru
        User rider1 = User.builder()
                .firstName("Rahul")
                .lastName("Sharma")
                .email("rider1@swiftride.com")
                .phone("+91-98765-43210")
                .password(passwordEncoder.encode("Rider@12345"))
                .role(Role.ROLE_RIDER)
                .active(true)
                .build();
        userRepository.save(rider1);

        User rider2 = User.builder()
                .firstName("Priya")
                .lastName("Nair")
                .email("rider2@swiftride.com")
                .phone("+91-98450-98765")
                .password(passwordEncoder.encode("Rider@12345"))
                .role(Role.ROLE_RIDER)
                .active(true)
                .build();
        userRepository.save(rider2);

        // 2. Seed Driver 1 (SwiftGo - Sedan) - Amit Patel in Koramangala
        User driverUser1 = User.builder()
                .firstName("Amit")
                .lastName("Patel")
                .email("driver1@swiftride.com")
                .phone("+91-99800-11223")
                .password(passwordEncoder.encode("Driver@12345"))
                .role(Role.ROLE_DRIVER)
                .active(true)
                .build();
        userRepository.save(driverUser1);

        Driver driver1 = Driver.builder()
                .user(driverUser1)
                .licenseNumber("KA-04-20180012345")
                .verificationStatus(DriverVerificationStatus.APPROVED)
                .onlineStatus(DriverOnlineStatus.ONLINE)
                .currentLatitude(12.9352) // Koramangala 5th Block
                .currentLongitude(77.6245)
                .rating(4.9)
                .totalRides(142)
                .build();
        driverRepository.save(driver1);

        Vehicle vehicle1 = Vehicle.builder()
                .driver(driver1)
                .vehicleType(VehicleType.SEDAN)
                .brand("Maruti Suzuki")
                .model("Dzire ZXi")
                .color("Pearl White")
                .registrationNumber("KA-01-MJ-8821")
                .year(2023)
                .active(true)
                .build();
        vehicleRepository.save(vehicle1);

        // 3. Seed Driver 2 (SwiftPremier - SUV) - Vikram Singh in Indiranagar
        User driverUser2 = User.builder()
                .firstName("Vikram")
                .lastName("Singh")
                .email("driver2@swiftride.com")
                .phone("+91-97411-44556")
                .password(passwordEncoder.encode("Driver@12345"))
                .role(Role.ROLE_DRIVER)
                .active(true)
                .build();
        userRepository.save(driverUser2);

        Driver driver2 = Driver.builder()
                .user(driverUser2)
                .licenseNumber("KA-03-20190067890")
                .verificationStatus(DriverVerificationStatus.APPROVED)
                .onlineStatus(DriverOnlineStatus.ONLINE)
                .currentLatitude(12.9784) // Indiranagar 100ft Rd
                .currentLongitude(77.6408)
                .rating(4.95)
                .totalRides(210)
                .build();
        driverRepository.save(driver2);

        Vehicle vehicle2 = Vehicle.builder()
                .driver(driver2)
                .vehicleType(VehicleType.SUV)
                .brand("Toyota")
                .model("Innova Crysta")
                .color("Super White")
                .registrationNumber("KA-03-AB-4190")
                .year(2024)
                .active(true)
                .build();
        vehicleRepository.save(vehicle2);

        // 4. Seed Driver 3 (SwiftMoto - Bike) - Karthik Rao in MG Road
        User driverUser3 = User.builder()
                .firstName("Karthik")
                .lastName("Rao")
                .email("driver3@swiftride.com")
                .phone("+91-96322-77889")
                .password(passwordEncoder.encode("Driver@12345"))
                .role(Role.ROLE_DRIVER)
                .active(true)
                .build();
        userRepository.save(driverUser3);

        Driver driver3 = Driver.builder()
                .user(driverUser3)
                .licenseNumber("KA-05-20210043210")
                .verificationStatus(DriverVerificationStatus.APPROVED)
                .onlineStatus(DriverOnlineStatus.ONLINE)
                .currentLatitude(12.9756) // MG Road
                .currentLongitude(77.6097)
                .rating(4.85)
                .totalRides(95)
                .build();
        driverRepository.save(driver3);

        Vehicle vehicle3 = Vehicle.builder()
                .driver(driver3)
                .vehicleType(VehicleType.BIKE)
                .brand("Honda")
                .model("Activa 6G")
                .color("Matte Axis Grey")
                .registrationNumber("KA-05-MT-9022")
                .year(2023)
                .active(true)
                .build();
        vehicleRepository.save(vehicle3);

        // 5. Seed Driver 4 (Pending Approval) - Suresh Kumar in HSR Layout
        User driverUser4 = User.builder()
                .firstName("Suresh")
                .lastName("Kumar")
                .email("driver4@swiftride.com")
                .phone("+91-95133-99001")
                .password(passwordEncoder.encode("Driver@12345"))
                .role(Role.ROLE_DRIVER)
                .active(true)
                .build();
        userRepository.save(driverUser4);

        Driver driver4 = Driver.builder()
                .user(driverUser4)
                .licenseNumber("KA-51-20220098765")
                .verificationStatus(DriverVerificationStatus.PENDING)
                .onlineStatus(DriverOnlineStatus.OFFLINE)
                .currentLatitude(12.9121) // HSR Layout Sector 1
                .currentLongitude(77.6446)
                .rating(5.0)
                .totalRides(0)
                .build();
        driverRepository.save(driver4);

        Vehicle vehicle4 = Vehicle.builder()
                .driver(driver4)
                .vehicleType(VehicleType.SEDAN)
                .brand("Hyundai")
                .model("Aura SX")
                .color("Typhoon Silver")
                .registrationNumber("KA-51-EX-5544")
                .year(2023)
                .active(true)
                .build();
        vehicleRepository.save(vehicle4);

        // 6. Seed Past Completed Ride in Bengaluru
        Ride pastRide = Ride.builder()
                .rider(rider1)
                .driver(driver1)
                .vehicle(vehicle1)
                .vehicleType(VehicleType.SEDAN)
                .pickupAddress("Koramangala 5th Block, Bengaluru")
                .pickupLatitude(12.9352)
                .pickupLongitude(77.6245)
                .destinationAddress("Kempegowda Intl Airport (BLR), Devanahalli")
                .destinationLatitude(13.1986)
                .destinationLongitude(77.7066)
                .distanceKm(38.5)
                .estimatedDurationMinutes(55)
                .estimatedFare(684.00)
                .finalFare(684.00)
                .status(RideStatus.RIDE_COMPLETED)
                .requestedAt(LocalDateTime.now().minusHours(4))
                .acceptedAt(LocalDateTime.now().minusHours(3).minusMinutes(58))
                .arrivedAt(LocalDateTime.now().minusHours(3).minusMinutes(50))
                .startedAt(LocalDateTime.now().minusHours(3).minusMinutes(48))
                .completedAt(LocalDateTime.now().minusHours(2).minusMinutes(50))
                .build();
        rideRepository.save(pastRide);

        Rating rating = Rating.builder()
                .ride(pastRide)
                .rider(rider1)
                .driver(driver1)
                .rating(5)
                .comment("Excellent driver! Smooth ride to Bengaluru airport.")
                .build();
        ratingRepository.save(rating);

        pastRide.setRating(rating);
        rideRepository.save(pastRide);

        log.info("SwiftRide development initial seeding completed successfully.");
    }
}
