package com.swiftride.repository;

import com.swiftride.entity.DriverEarning;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface DriverEarningRepository extends JpaRepository<DriverEarning, Long> {

    Page<DriverEarning> findByDriverIdOrderByCreatedAtDesc(Long driverId, Pageable pageable);

    Optional<DriverEarning> findByRideId(Long rideId);

    @Query("SELECT COALESCE(SUM(e.driverEarning), 0.0) FROM DriverEarning e WHERE e.driver.id = :driverId")
    Double sumDriverEarningsByDriverId(@Param("driverId") Long driverId);

    @Query("SELECT COALESCE(SUM(e.driverEarning), 0.0) FROM DriverEarning e WHERE e.driver.id = :driverId AND e.createdAt >= :startDate")
    Double sumDriverEarningsByDriverIdAndCreatedAtAfter(@Param("driverId") Long driverId, @Param("startDate") LocalDateTime startDate);

    @Query("SELECT COALESCE(SUM(e.grossFare), 0.0) FROM DriverEarning e")
    Double sumGrossFareAll();

    @Query("SELECT COALESCE(SUM(e.driverEarning), 0.0) FROM DriverEarning e")
    Double sumDriverEarningsAll();

    @Query("SELECT COALESCE(SUM(e.platformFee), 0.0) FROM DriverEarning e")
    Double sumPlatformFeesAll();

    long countByDriverId(Long driverId);

    long countByDriverIdAndCreatedAtAfter(Long driverId, LocalDateTime startDate);
}
