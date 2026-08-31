package com.swiftride.config;

import com.swiftride.entity.*;
import com.swiftride.repository.DriverRepository;
import com.swiftride.repository.UserRepository;
import com.swiftride.repository.VehicleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            DriverRepository driverRepository,
            VehicleRepository vehicleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // 1. Ensure Primary Platform Administrator (shafiyashaikt@gmail.com) exists
        userRepository.findByEmail("shafiyashaikt@gmail.com").ifPresentOrElse(
                existingAdmin -> log.info("Primary admin account verified: shafiyashaikt@gmail.com"),
                () -> {
                    User shafiAdmin = User.builder()
                            .firstName("Shafi")
                            .lastName("Shaik")
                            .email("shafiyashaikt@gmail.com")
                            .phone("+91-98888-77777")
                            .password(passwordEncoder.encode("Shafi@123"))
                            .role(Role.ROLE_ADMIN)
                            .active(true)
                            .build();
                    userRepository.save(shafiAdmin);
                    log.info("Created initial primary admin account: shafiyashaikt@gmail.com");
                }
        );

        // 2. Ensure fallback admin@swiftride.com exists
        userRepository.findByEmail("admin@swiftride.com").ifPresentOrElse(
                admin -> {},
                () -> {
                    User admin = User.builder()
                            .firstName("SwiftRide")
                            .lastName("Admin")
                            .email("admin@swiftride.com")
                            .phone("+91-80-25001234")
                            .password(passwordEncoder.encode("Admin@12345"))
                            .role(Role.ROLE_ADMIN)
                            .active(true)
                            .build();
                    userRepository.save(admin);
                    log.info("Created fallback admin account: admin@swiftride.com");
                }
        );

        // 3. Ensure Demo Rider (rider1@swiftride.com) exists for 1-click login
        userRepository.findByEmail("rider1@swiftride.com").ifPresentOrElse(
                rider -> {},
                () -> {
                    User rider = User.builder()
                            .firstName("Rahul")
                            .lastName("Sharma")
                            .email("rider1@swiftride.com")
                            .phone("+91-98765-43210")
                            .password(passwordEncoder.encode("Rider@12345"))
                            .role(Role.ROLE_RIDER)
                            .active(true)
                            .build();
                    userRepository.save(rider);
                    log.info("Created initial demo rider: rider1@swiftride.com");
                }
        );

        // 4. Ensure Demo Driver (driver1@swiftride.com) exists for 1-click login & immediate matching
        userRepository.findByEmail("driver1@swiftride.com").ifPresentOrElse(
                driverUser -> {},
                () -> {
                    User driverUser = User.builder()
                            .firstName("Amit")
                            .lastName("Patel")
                            .email("driver1@swiftride.com")
                            .phone("+91-99800-11223")
                            .password(passwordEncoder.encode("Driver@12345"))
                            .role(Role.ROLE_DRIVER)
                            .active(true)
                            .build();
                    User savedUser = userRepository.save(driverUser);

                    Driver driver = Driver.builder()
                            .user(savedUser)
                            .licenseNumber("KA-04-20180012345")
                            .verificationStatus(DriverVerificationStatus.APPROVED)
                            .onlineStatus(DriverOnlineStatus.ONLINE)
                            .currentLatitude(12.9352)
                            .currentLongitude(77.6245)
                            .lastLocationUpdate(LocalDateTime.now())
                            .rating(4.9)
                            .totalRides(142)
                            .build();
                    Driver savedDriver = driverRepository.save(driver);

                    Vehicle vehicle = Vehicle.builder()
                            .driver(savedDriver)
                            .vehicleType(VehicleType.SEDAN)
                            .brand("Maruti Suzuki")
                            .model("Dzire ZXi")
                            .color("Pearl White")
                            .registrationNumber("KA-01-MJ-8821")
                            .year(2023)
                            .active(true)
                            .build();
                    vehicleRepository.save(vehicle);
                    log.info("Created initial demo driver: driver1@swiftride.com with active vehicle");
                }
        );
    }
}
