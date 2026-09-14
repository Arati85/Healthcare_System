import React, { useEffect, useState } from "react";
import { getVaccinationBookings } from "../services/vaccinationService";

function MyVaccinations() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);

            const data = await getVaccinationBookings();

            setBookings(data);
            setError("");

        } catch (err) {
            console.error(err);
            setError("Unable to load vaccination bookings.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatDateTime = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div style={styles.page}>

            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>My Vaccinations</h1>

                    <p style={styles.subtitle}>
                        View and manage your child's vaccination appointments
                    </p>
                </div>

                <button
                    style={styles.refreshButton}
                    onClick={loadBookings}
                >
                    ↻ Refresh
                </button>
            </div>

            {loading && (
                <div style={styles.message}>
                    Loading vaccination bookings...
                </div>
            )}

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            {!loading && !error && bookings.length === 0 && (
                <div style={styles.empty}>
                    <div style={styles.emptyIcon}>💉</div>

                    <h2>No Vaccination Bookings</h2>

                    <p>
                        You haven't booked any vaccination appointments yet.
                    </p>
                </div>
            )}

            {!loading && bookings.length > 0 && (

                <div style={styles.bookingGrid}>

                    {bookings.map((booking) => (

                        <div
                            key={booking.id}
                            style={styles.card}
                        >

                            <div style={styles.cardTop}>

                                <div style={styles.vaccineIcon}>
                                    💉
                                </div>

                                <div>
                                    <h2 style={styles.vaccineName}>
                                        {booking.vaccineName}
                                    </h2>

                                    <p style={styles.bookingId}>
                                        Booking ID: #{booking.id}
                                    </p>
                                </div>

                                <span style={styles.status}>
                                    {booking.status || "PENDING"}
                                </span>

                            </div>

                            <div style={styles.infoGrid}>

                                <div style={styles.info}>
                                    <span style={styles.label}>
                                        👶 Child
                                    </span>

                                    <strong>
                                        {booking.childName}
                                    </strong>
                                </div>

                                <div style={styles.info}>
                                    <span style={styles.label}>
                                        🎂 Date of Birth
                                    </span>

                                    <strong>
                                        {formatDate(booking.dateOfBirth)}
                                    </strong>
                                </div>

                                <div style={styles.info}>
                                    <span style={styles.label}>
                                        👨‍👩‍👧 Parent
                                    </span>

                                    <strong>
                                        {booking.parentName}
                                    </strong>
                                </div>

                                <div style={styles.info}>
                                    <span style={styles.label}>
                                        📱 Contact
                                    </span>

                                    <strong>
                                        {booking.contactNumber}
                                    </strong>
                                </div>

                                <div style={styles.info}>
                                    <span style={styles.label}>
                                        📅 Vaccination Date
                                    </span>

                                    <strong>
                                        {formatDate(booking.preferredDate)}
                                    </strong>
                                </div>

                                <div style={styles.info}>
                                    <span style={styles.label}>
                                        🕐 Booked On
                                    </span>

                                    <strong>
                                        {formatDateTime(booking.createdAt)}
                                    </strong>
                                </div>

                            </div>

                            <button
                                style={styles.detailsButton}
                                onClick={() => setSelectedBooking(booking)}
                            >
                                View Complete Details
                            </button>

                        </div>

                    ))}

                </div>

            )}

            {selectedBooking && (

                <div
                    style={styles.modalOverlay}
                    onClick={() => setSelectedBooking(null)}
                >

                    <div
                        style={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >

                        <button
                            style={styles.close}
                            onClick={() => setSelectedBooking(null)}
                        >
                            ×
                        </button>

                        <div style={styles.successIcon}>
                            ✓
                        </div>

                        <h1 style={styles.modalTitle}>
                            Vaccination Appointment
                        </h1>

                        <p style={styles.modalSubtitle}>
                            Booking successfully registered
                        </p>

                        <div style={styles.detailBox}>

                            <Detail
                                label="Booking ID"
                                value={`#${selectedBooking.id}`}
                            />

                            <Detail
                                label="Child Name"
                                value={selectedBooking.childName}
                            />

                            <Detail
                                label="Date of Birth"
                                value={formatDate(selectedBooking.dateOfBirth)}
                            />

                            <Detail
                                label="Parent / Guardian"
                                value={selectedBooking.parentName}
                            />

                            <Detail
                                label="Contact Number"
                                value={selectedBooking.contactNumber}
                            />

                            <Detail
                                label="Vaccine Required"
                                value={selectedBooking.vaccineName}
                            />

                            <Detail
                                label="Vaccination Date"
                                value={formatDate(selectedBooking.preferredDate)}
                            />

                            <Detail
                                label="Status"
                                value={selectedBooking.status || "PENDING"}
                            />

                            <Detail
                                label="Booked On"
                                value={formatDateTime(selectedBooking.createdAt)}
                            />

                        </div>

                        <button
                            style={styles.doneButton}
                            onClick={() => setSelectedBooking(null)}
                        >
                            Done
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}


function Detail({ label, value }) {

    return (
        <div style={styles.detailRow}>

            <span style={styles.detailLabel}>
                {label}
            </span>

            <strong style={styles.detailValue}>
                {value || "N/A"}
            </strong>

        </div>
    );
}


const styles = {

    page: {
        minHeight: "100vh",
        background: "#f5f8fc",
        padding: "50px",
        fontFamily: "Arial, sans-serif"
    },

    header: {
        maxWidth: "1200px",
        margin: "0 auto 35px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    title: {
        fontSize: "36px",
        margin: 0,
        color: "#172b4d"
    },

    subtitle: {
        color: "#667085",
        marginTop: "8px",
        fontSize: "16px"
    },

    refreshButton: {
        padding: "12px 20px",
        border: "none",
        borderRadius: "10px",
        background: "#2563eb",
        color: "white",
        fontSize: "15px",
        cursor: "pointer"
    },

    bookingGrid: {
        maxWidth: "1200px",
        margin: "auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
        gap: "25px"
    },

    card: {
        background: "white",
        borderRadius: "18px",
        padding: "25px",
        boxShadow: "0 5px 25px rgba(0,0,0,0.07)"
    },

    cardTop: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "25px"
    },

    vaccineIcon: {
        width: "55px",
        height: "55px",
        borderRadius: "14px",
        background: "#e8f1ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "28px"
    },

    vaccineName: {
        margin: 0,
        color: "#172b4d"
    },

    bookingId: {
        margin: "5px 0 0",
        color: "#8a94a6",
        fontSize: "13px"
    },

    status: {
        marginLeft: "auto",
        background: "#fff4d6",
        color: "#a66a00",
        padding: "7px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold"
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "18px",
        borderTop: "1px solid #edf0f5",
        paddingTop: "20px"
    },

    info: {
        display: "flex",
        flexDirection: "column",
        gap: "5px"
    },

    label: {
        fontSize: "12px",
        color: "#8a94a6"
    },

    detailsButton: {
        width: "100%",
        marginTop: "25px",
        padding: "13px",
        border: "none",
        borderRadius: "10px",
        background: "#172b4d",
        color: "white",
        fontSize: "15px",
        cursor: "pointer"
    },

    empty: {
        maxWidth: "600px",
        margin: "100px auto",
        background: "white",
        padding: "50px",
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "0 5px 25px rgba(0,0,0,0.06)"
    },

    emptyIcon: {
        fontSize: "55px"
    },

    message: {
        textAlign: "center",
        marginTop: "100px",
        fontSize: "18px"
    },

    error: {
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        background: "#fee2e2",
        color: "#991b1b",
        borderRadius: "10px",
        textAlign: "center"
    },

    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px"
    },

    modal: {
        width: "100%",
        maxWidth: "650px",
        background: "white",
        borderRadius: "22px",
        padding: "35px",
        position: "relative",
        maxHeight: "90vh",
        overflowY: "auto"
    },

    close: {
        position: "absolute",
        right: "20px",
        top: "15px",
        border: "none",
        background: "none",
        fontSize: "30px",
        cursor: "pointer",
        color: "#667085"
    },

    successIcon: {
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "#dcfce7",
        color: "#16a34a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
        margin: "0 auto 15px"
    },

    modalTitle: {
        textAlign: "center",
        margin: 0,
        color: "#172b4d"
    },

    modalSubtitle: {
        textAlign: "center",
        color: "#667085",
        marginBottom: "25px"
    },

    detailBox: {
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        overflow: "hidden"
    },

    detailRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "14px 18px",
        borderBottom: "1px solid #edf0f5",
        gap: "20px"
    },

    detailLabel: {
        color: "#667085"
    },

    detailValue: {
        color: "#172b4d",
        textAlign: "right"
    },

    doneButton: {
        width: "100%",
        marginTop: "25px",
        padding: "14px",
        border: "none",
        borderRadius: "10px",
        background: "#2563eb",
        color: "white",
        fontSize: "16px",
        cursor: "pointer"
    }
};

export default MyVaccinations;