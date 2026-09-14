package com.healthcare.healthcare_backend.repository;


import  com.healthcare.healthcare_backend.entity.VaccinationBooking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VaccinationBookingRepository
        extends JpaRepository<VaccinationBooking, Long> {
}