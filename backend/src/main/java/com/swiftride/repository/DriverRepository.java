package com.swiftride.repository;

import com.swiftride.entity.Driver;
import com.swiftride.entity.DriverOnlineStatus;
import com.swiftride.entity.DriverVerificationStatus;
import com.swiftride.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByUser(User user);
    Optional<Driver> findByUserId(Long userId);
    Optional<Driver> findByLicenseNumber(String licenseNumber);
    Boolean existsByLicenseNumber(String licenseNumber);

    Page<Driver> findByVerificationStatus(DriverVerificationStatus status, Pageable pageable);
    List<Driver> findByVerificationStatusAndOnlineStatus(DriverVerificationStatus verificationStatus, DriverOnlineStatus onlineStatus);

    long countByVerificationStatus(DriverVerificationStatus status);
    long countByOnlineStatus(DriverOnlineStatus status);
    long countByVerificationStatusAndOnlineStatus(DriverVerificationStatus verificationStatus, DriverOnlineStatus onlineStatus);

    @Query("SELECT d FROM Driver d WHERE d.verificationStatus = :verificationStatus AND d.onlineStatus = :onlineStatus AND d.currentLatitude IS NOT NULL AND d.currentLongitude IS NOT NULL")
    List<Driver> findAvailableDriversWithLocation(
            @Param("verificationStatus") DriverVerificationStatus verificationStatus,
            @Param("onlineStatus") DriverOnlineStatus onlineStatus
    );

    @Query("SELECT d FROM Driver d WHERE d.verificationStatus = 'APPROVED' AND (d.onlineStatus = 'ONLINE' OR d.onlineStatus = 'BUSY') AND d.currentLatitude IS NOT NULL AND d.currentLongitude IS NOT NULL")
    List<Driver> findAllActiveDriversOnRoad();
}
