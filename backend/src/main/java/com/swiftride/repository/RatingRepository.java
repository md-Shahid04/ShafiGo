package com.swiftride.repository;

import com.swiftride.entity.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByRideId(Long rideId);

    Page<Rating> findByDriverIdOrderByCreatedAtDesc(Long driverId, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.driver.id = :driverId")
    Double findAverageRatingByDriverId(@Param("driverId") Long driverId);

    @Query("SELECT AVG(r.rating) FROM Rating r")
    Double findOverallAverageRating();
}
