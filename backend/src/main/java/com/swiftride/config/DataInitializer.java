package com.swiftride.config;

import com.swiftride.entity.Role;
import com.swiftride.entity.User;
import com.swiftride.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // 1. Ensure Primary Platform Administrator (shafiyashaikt@gmail.com) exists (Idempotent - never overwrites password)
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

        // 2. Ensure fallback admin@swiftride.com exists (Idempotent)
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
    }
}
