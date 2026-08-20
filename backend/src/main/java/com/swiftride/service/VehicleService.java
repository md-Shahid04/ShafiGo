package com.swiftride.service;

import com.swiftride.dto.request.VehicleRequest;
import com.swiftride.dto.response.VehicleDto;
import com.swiftride.entity.Driver;
import com.swiftride.entity.Vehicle;
import com.swiftride.exception.ConflictException;
import com.swiftride.exception.ResourceNotFoundException;
import com.swiftride.repository.DriverRepository;
import com.swiftride.repository.VehicleRepository;
import com.swiftride.util.EntityMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public VehicleService(VehicleRepository vehicleRepository, DriverRepository driverRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
    }

    @Transactional(readOnly = true)
    public List<VehicleDto> getVehiclesByDriverUser(Long userId) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found for user: " + userId));
        return vehicleRepository.findByDriverId(driver.getId()).stream()
                .map(EntityMapper::toVehicleDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public VehicleDto addVehicle(Long userId, VehicleRequest request) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found for user: " + userId));

        if (vehicleRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new ConflictException("Registration plate already exists: " + request.getRegistrationNumber());
        }

        List<Vehicle> existingVehicles = vehicleRepository.findByDriverId(driver.getId());
        boolean isFirst = existingVehicles.isEmpty();

        Vehicle vehicle = Vehicle.builder()
                .driver(driver)
                .vehicleType(request.getVehicleType())
                .brand(request.getBrand().trim())
                .model(request.getModel().trim())
                .color(request.getColor().trim())
                .registrationNumber(request.getRegistrationNumber().toUpperCase().trim())
                .year(request.getYear())
                .active(isFirst)
                .build();

        Vehicle saved = vehicleRepository.save(vehicle);
        return EntityMapper.toVehicleDto(saved);
    }

    @Transactional
    public VehicleDto setActiveVehicle(Long userId, Long vehicleId) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found for user: " + userId));

        List<Vehicle> vehicles = vehicleRepository.findByDriverId(driver.getId());
        Vehicle selected = vehicles.stream()
                .filter(v -> v.getId().equals(vehicleId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found or does not belong to driver"));

        for (Vehicle v : vehicles) {
            v.setActive(v.getId().equals(vehicleId));
            vehicleRepository.save(v);
        }

        return EntityMapper.toVehicleDto(selected);
    }
}
