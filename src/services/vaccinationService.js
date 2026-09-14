const API_URL = "http://localhost:8081/api/vaccinations";

export const bookVaccination = async (bookingData) => {

    const response = await fetch(API_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
        throw new Error("Failed to book vaccination");
    }

    return await response.json();
};


export const getVaccinationBookings = async () => {

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return await response.json();
};