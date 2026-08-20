package com.swiftride.repository;

import com.swiftride.entity.RideLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RideLocationRepository extends JpaRepository<RideLocation, Long> {
    List<RideLocation> findByRideIdOrderByTimestampAsc(Long rideId);
    List<RideLocation> findTop20ByRideIdOrderByTimestampDesc(Long rideId);
}
