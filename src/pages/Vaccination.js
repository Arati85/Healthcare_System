
import React, { useState } from "react";
import { bookVaccination } from "../services/vaccinationService";

function Vaccination() {

    const [search, setSearch] = useState("");
    const [ageFilter, setAgeFilter] = useState("All");
    const [selectedVaccine, setSelectedVaccine] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const vaccines = [
        {
            name: "BCG",
            age: "At Birth",
            category: "Birth",
            dose: "Single Dose",
            description: "Protects children against tuberculosis.",
            availability: "Available",
            icon: "💉"
        },
        {
            name: "Hepatitis B",
            age: "At Birth",
            category: "Birth",
            dose: "1st Dose",
            description: "Helps protect against Hepatitis B infection.",
            availability: "Available",
            icon: "🧬"
        },
        {
            name: "Polio (OPV)",
            age: "Birth - 5 Years",
            category: "0-5 Years",
            dose: "Multiple Doses",
            description: "Protects children against poliovirus.",
            availability: "Available",
            icon: "💉"
        },
        {
            name: "DPT",
            age: "6 Weeks+",
            category: "6 Weeks+",
            dose: "Multiple Doses",
            description: "Protection against diphtheria, pertussis and tetanus.",
            availability: "Available",
            icon: "🛡️"
        },
        {
            name: "MMR",
            age: "9 - 12 Months",
            category: "9-12 Months",
            dose: "1st Dose",
            description: "Protects against measles, mumps and rubella.",
            availability: "Available",
            icon: "🧒"
        },
        {
            name: "Rotavirus",
            age: "6 Weeks+",
            category: "6 Weeks+",
            dose: "Multiple Doses",
            description: "Helps protect against rotavirus infection.",
            availability: "Limited",
            icon: "💊"
        }
    ];

    const filteredVaccines = vaccines.filter((vaccine) => {

        const matchesSearch =
            vaccine.name
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesAge =
            ageFilter === "All" ||
            vaccine.category === ageFilter;

        return matchesSearch && matchesAge;
    });

 const handleBooking = async (e) => {

    e.preventDefault();

    try {

        const bookingData = {
            childName: e.target.childName.value,

            dateOfBirth: e.target.dateOfBirth.value,

            parentName: e.target.parentName.value,

            contactNumber: e.target.contactNumber.value,

            vaccineName: selectedVaccine.name,

            preferredDate: e.target.preferredDate.value
        };

        console.log("Sending booking:", bookingData);

        const result = await bookVaccination(bookingData);

        console.log("Booking saved:", result);

        setSelectedVaccine(null);

        setBookingSuccess(true);

        setTimeout(() => {
            setBookingSuccess(false);
        }, 4000);

    } catch (error) {

        console.error(error);

        alert(
            "Unable to book vaccination. Please try again."
        );
    }
};

    return (

        <div className="vaccination-page">

            {/* HERO SECTION */}

            <section className="vaccination-hero">

                <div className="hero-content">

                    <span className="hero-badge">
                        👶 CHILD HEALTHCARE
                    </span>

                    <h1>
                        Protect Your Child's
                        <span> Future Today</span>
                    </h1>

                    <p>
                        Keep your child protected with timely
                        vaccinations from our trusted healthcare
                        professionals.
                    </p>

                    <div className="hero-buttons">

                        <button
                            className="hero-book-btn"
                            onClick={() => setSelectedVaccine({
                                name: "Vaccination Appointment"
                            })}
                        >
                            📅 Book Vaccination
                        </button>

                        <button
                            className="hero-outline-btn"
                            onClick={() =>
                                document
                                    .getElementById("vaccines")
                                    .scrollIntoView({
                                        behavior: "smooth"
                                    })
                            }
                        >
                            View Vaccines ↓
                        </button>

                    </div>

                    <div className="hero-stats">

                        <div>
                            <strong>20+</strong>
                            <span>Vaccines</span>
                        </div>

                        <div>
                            <strong>10K+</strong>
                            <span>Children Protected</span>
                        </div>

                        <div>
                            <strong>24/7</strong>
                            <span>Healthcare Support</span>
                        </div>

                    </div>

                </div>

                <div className="hero-image">

                    <div className="baby-circle">
                        👶
                    </div>

                    <div className="floating-card card-one">
                        💉
                        <div>
                            <strong>Vaccination</strong>
                            <small>Stay Protected</small>
                        </div>
                    </div>

                    <div className="floating-card card-two">
                        ✓
                        <div>
                            <strong>Safe & Trusted</strong>
                            <small>Professional Care</small>
                        </div>
                    </div>

                </div>

            </section>


            {/* INFORMATION CARDS */}

            <section className="info-section">

                <div className="info-card">
                    <div className="info-icon">💉</div>

                    <div>
                        <h3>Complete Protection</h3>
                        <p>
                            Recommended vaccines for different
                            stages of childhood.
                        </p>
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-icon">👨‍⚕️</div>

                    <div>
                        <h3>Expert Healthcare</h3>
                        <p>
                            Vaccinations administered by trained
                            healthcare professionals.
                        </p>
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-icon">📅</div>

                    <div>
                        <h3>Easy Scheduling</h3>
                        <p>
                            Book your child's vaccination appointment
                            in just a few clicks.
                        </p>
                    </div>
                </div>

            </section>


            {/* VACCINE SECTION */}

            <section
                className="vaccines-section"
                id="vaccines"
            >

                <div className="section-heading">

                    <div>

                        <span className="section-label">
                            OUR SERVICES
                        </span>

                        <h2>Available Vaccines</h2>

                        <p>
                            Find the right vaccination for your
                            child's age.
                        </p>

                    </div>

                    <div className="vaccine-count">
                        {filteredVaccines.length} Vaccines
                    </div>

                </div>


                {/* SEARCH + FILTER */}

                <div className="filters">

                    <div className="search-box">

                        🔍

                        <input
                            type="text"
                            placeholder="Search vaccine..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    <div className="filter-buttons">

                        {[
                            "All",
                            "Birth",
                            "0-5 Years",
                            "6 Weeks+",
                            "9-12 Months"
                        ].map((filter) => (

                            <button
                                key={filter}
                                className={
                                    ageFilter === filter
                                        ? "filter-active"
                                        : ""
                                }
                                onClick={() =>
                                    setAgeFilter(filter)
                                }
                            >
                                {filter}
                            </button>

                        ))}

                    </div>

                </div>


                {/* CARDS */}

                <div className="vaccine-grid">

                    {filteredVaccines.map((vaccine) => (

                        <div
                            className="vaccine-card"
                            key={vaccine.name}
                        >

                            <div className="card-top">

                                <div className="vaccine-icon">
                                    {vaccine.icon}
                                </div>

                                <span
                                    className={
                                        vaccine.availability ===
                                        "Available"
                                            ? "available"
                                            : "limited"
                                    }
                                >
                                    ● {vaccine.availability}
                                </span>

                            </div>


                            <h3>{vaccine.name}</h3>

                            <p className="description">
                                {vaccine.description}
                            </p>


                            <div className="vaccine-details">

                                <div>
                                    <span>Recommended Age</span>
                                    <strong>{vaccine.age}</strong>
                                </div>

                                <div>
                                    <span>Dose</span>
                                    <strong>{vaccine.dose}</strong>
                                </div>

                            </div>


                            <button
                                className="schedule-btn"
                                onClick={() =>
                                    setSelectedVaccine(vaccine)
                                }
                            >
                                Schedule Vaccine →
                            </button>

                        </div>

                    ))}

                </div>


                {filteredVaccines.length === 0 && (

                    <div className="no-vaccine">
                        😕
                        <h3>No vaccine found</h3>
                        <p>
                            Try searching for another vaccine.
                        </p>
                    </div>

                )}

            </section>


            {/* VACCINATION SCHEDULE */}

            <section className="schedule-section">

                <div className="section-heading center">

                    <span className="section-label">
                        VACCINATION PLAN
                    </span>

                    <h2>Child Vaccination Schedule</h2>

                    <p>
                        Keep track of important vaccination stages.
                    </p>

                </div>


                <div className="timeline">

                    <div className="timeline-item">

                        <div className="timeline-number">1</div>

                        <div>
                            <span>AT BIRTH</span>
                            <h3>BCG + Hepatitis B + Polio</h3>
                            <p>
                                Initial protection begins from birth.
                            </p>
                        </div>

                    </div>


                    <div className="timeline-item">

                        <div className="timeline-number">2</div>

                        <div>
                            <span>6 WEEKS</span>
                            <h3>DPT + Polio + Rotavirus</h3>
                            <p>
                                Continue primary vaccination doses.
                            </p>
                        </div>

                    </div>


                    <div className="timeline-item">

                        <div className="timeline-number">3</div>

                        <div>
                            <span>9 - 12 MONTHS</span>
                            <h3>MMR Vaccination</h3>
                            <p>
                                Protection against measles,
                                mumps and rubella.
                            </p>
                        </div>

                    </div>

                </div>

            </section>


            {/* BOOKING MODAL */}

            {selectedVaccine && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setSelectedVaccine(null)
                    }
                >

                    <div
                        className="booking-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="close-modal"
                            onClick={() =>
                                setSelectedVaccine(null)
                            }
                        >
                            ×
                        </button>

                        <div className="modal-icon">
                            💉
                        </div>

                        <h2>Book Vaccination</h2>

                        <p>
                            {selectedVaccine.name}
                        </p>

<form onSubmit={handleBooking}>

    <label>
        Child's Name
    </label>

    <input
        type="text"
        name="childName"
        placeholder="Enter child's name"
        required
    />


    <label>
        Child's Date of Birth
    </label>

    <input
        type="date"
        name="dateOfBirth"
        required
    />


    <label>
        Parent / Guardian Name
    </label>

    <input
        type="text"
        name="parentName"
        placeholder="Enter parent name"
        required
    />


    <label>
        Preferred Date
    </label>

    <input
        type="date"
        name="preferredDate"
        required
    />


    <label>
        Contact Number
    </label>

    <input
        type="tel"
        name="contactNumber"
        placeholder="Enter phone number"
        required
    />


    <button
        type="submit"
        className="confirm-btn"
    >
        Confirm Appointment
    </button>

</form>

                    </div>

                </div>

            )}


            {/* SUCCESS MESSAGE */}

            {bookingSuccess && (

                <div className="success-message">

                    <div className="success-icon">
                        ✓
                    </div>

                    <div>
                        <strong>
                            Appointment Request Submitted!
                        </strong>

                        <p>
                            Our healthcare team will contact you
                            shortly.
                        </p>
                    </div>

                </div>

            )}

        </div>
    );
}

export default Vaccination;