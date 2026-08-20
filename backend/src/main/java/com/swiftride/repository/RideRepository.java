package com.swiftride.repository;

import com.swiftride.entity.Ride;
import com.swiftride.entity.RideStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Ride r WHERE r.id = :id")
    Optional<Ride> findByIdForUpdate(@Param("id") Long id);

    Optional<Ride> findFirstByRiderIdAndStatusInOrderByCreatedAtDesc(Long riderId, List<RideStatus> statuses);

    Optional<Ride> findFirstByDriverIdAndStatusInOrderByCreatedAtDesc(Long driverId, List<RideStatus> statuses);

    Page<Ride> findByRiderIdOrderByCreatedAtDesc(Long riderId, Pageable pageable);

    Page<Ride> findByDriverIdOrderByCreatedAtDesc(Long driverId, Pageable pageable);

    Page<Ride> findByStatusOrderByCreatedAtDesc(RideStatus status, Pageable pageable);

    List<Ride> findByStatusInOrderByCreatedAtDesc(List<RideStatus> statuses);

    long countByStatus(RideStatus status);

    long countByStatusIn(List<RideStatus> statuses);

    @Query("SELECT SUM(r.finalFare) FROM Ride r WHERE r.status = :status")
    Double sumFinalFareByStatus(@Param("status") RideStatus status);
}
