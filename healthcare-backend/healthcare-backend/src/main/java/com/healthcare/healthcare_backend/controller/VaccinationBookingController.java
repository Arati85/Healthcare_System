package com.healthcare.healthcare_backend.controller;


import com.healthcare.healthcare_backend.entity.VaccinationBooking;
import com.healthcare.healthcare_backend.repository.VaccinationBookingRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/api/vaccinations")
@CrossOrigin(origins = "http://localhost:3000")
public class VaccinationBookingController {

    private final VaccinationBookingRepository repository;

    public VaccinationBookingController(
            VaccinationBookingRepository repository) {
        this.repository = repository;
    }

    // CREATE BOOKING
    @PostMapping
    public ResponseEntity<VaccinationBooking> createBooking(
            @RequestBody VaccinationBooking booking) {

        booking.setStatus("PENDING");

        VaccinationBooking savedBooking =
                repository.save(booking);

        return ResponseEntity.ok(savedBooking);
    }

    // GET ALL BOOKINGS
    @GetMapping
    public List<VaccinationBooking> getAllBookings() {
        return repository.findAll();
    }

    // GET ONE BOOKING
    @GetMapping("/{id}")
    public ResponseEntity<VaccinationBooking> getBooking(
            @PathVariable Long id) {

        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE BOOKING
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(
            @PathVariable Long id) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}