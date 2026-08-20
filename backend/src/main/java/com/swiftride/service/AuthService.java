package com.swiftride.service;

import com.swiftride.config.JwtService;
import com.swiftride.dto.request.DriverRegisterRequest;
import com.swiftride.dto.request.LoginRequest;
import com.swiftride.dto.request.RegisterRequest;
import com.swiftride.dto.response.AuthResponse;
import com.swiftride.entity.*;
import com.swiftride.exception.BadRequestException;
import com.swiftride.exception.ConflictException;
import com.swiftride.exception.ResourceNotFoundException;
import com.swiftride.repository.DriverRepository;
import com.swiftride.repository.UserRepository;
import com.swiftride.repository.VehicleRepository;
import com.swiftride.util.EntityMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            DriverRepository driverRepository,
            VehicleRepository vehicleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse registerRider(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail().toLowerCase().trim())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_RIDER)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return AuthResponse.builder()
                .token(token)
                .user(EntityMapper.toUserDto(savedUser))
                .build();
    }

    @Transactional
    public AuthResponse registerDriver(DriverRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already registered: " + request.getEmail());
        }
        if (driverRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new ConflictException("License number already registered: " + request.getLicenseNumber());
        }
        if (vehicleRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new ConflictException("Vehicle registration plate already exists: " + request.getRegistrationNumber());
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail().toLowerCase().trim())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_DRIVER)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        Driver driver = Driver.builder()
                .user(savedUser)
                .licenseNumber(request.getLicenseNumber().toUpperCase().trim())
                .verificationStatus(DriverVerificationStatus.PENDING)
                .onlineStatus(DriverOnlineStatus.OFFLINE)
                .rating(5.0)
                .totalRides(0)
                .build();

        Driver savedDriver = driverRepository.save(driver);

        Vehicle vehicle = Vehicle.builder()
                .driver(savedDriver)
                .vehicleType(request.getVehicleType())
                .brand(request.getBrand())
                .model(request.getModel())
                .color(request.getColor())
                .registrationNumber(request.getRegistrationNumber().toUpperCase().trim())
                .year(request.getYear())
                .active(true)
                .build();

        vehicleRepository.save(vehicle);
        savedDriver.getVehicles().add(vehicle);

        String token = jwtService.generateToken(savedUser);

        return AuthResponse.builder()
                .token(token)
                .user(EntityMapper.toUserDto(savedUser))
                .driver(EntityMapper.toDriverDto(savedDriver))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase().trim(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new BadRequestException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getActive()) {
            throw new BadRequestException("Account has been deactivated. Please contact support.");
        }

        String token = jwtService.generateToken(user);
        Driver driver = null;
        if (user.getRole() == Role.ROLE_DRIVER) {
            driver = driverRepository.findByUserId(user.getId()).orElse(null);
        }

        return AuthResponse.builder()
                .token(token)
                .user(EntityMapper.toUserDto(user))
                .driver(driver != null ? EntityMapper.toDriverDto(driver) : null)
                .build();
    }
}
