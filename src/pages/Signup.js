import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Every data point of every entry is its own live check.
const RULES = {
    name: [
        { id: "filled", label: "Name entered", test: (v) => v.length > 0 },
        { id: "len", label: "2 to 50 characters", test: (v) => v.length >= 2 && v.length <= 50 },
        { id: "chars", label: "Only letters, spaces, . ' and -  (no numbers)", test: (v) => v.length > 0 && /^[a-zA-Z\s.'-]+$/.test(v) }
    ],
    email: [
        { id: "local", label: "Has text before the @", test: (v) => /^[^\s@]+@/.test(v) },
        { id: "at", label: "Contains one @ symbol", test: (v) => (v.match(/@/g) || []).length === 1 },
        { id: "domain", label: "Has a domain after the @ (e.g. hospital)", test: (v) => /@[a-zA-Z0-9]/.test(v) },
        { id: "tld", label: "Ends with a valid extension (e.g. .com)", test: (v) => /\.[a-zA-Z]{2,}$/.test(v) },
        { id: "chars", label: "Uses only valid characters, no spaces", test: (v) => v.length > 0 && /^[a-zA-Z0-9._%+@-]+$/.test(v) }
    ],
    password: [
        { id: "filled", label: "Password entered", test: (v) => v.length > 0 },
        { id: "len", label: "At least 6 characters", test: (v) => v.length >= 6 }
    ],
    phone: [
        { id: "filled", label: "Phone number entered", test: (v) => v.length > 0 },
        { id: "len", label: "Exactly 10 digits", test: (v) => v.length === 10 }
    ],
    qualification: [
        { id: "filled", label: "Qualification entered", test: (v) => v.length > 0 },
        { id: "len", label: "At least 2 characters", test: (v) => v.length >= 2 }
    ],
    experience: [
        { id: "filled", label: "Experience entered", test: (v) => v.length > 0 },
        { id: "whole", label: "A whole number", test: (v) => /^\d+$/.test(v) },
        { id: "range", label: "Between 1 and 60 years", test: (v) => /^\d+$/.test(v) && Number(v) >= 1 && Number(v) <= 60 }
    ],
    consultationFee: [
        { id: "filled", label: "Fee entered", test: (v) => v.length > 0 },
        { id: "min", label: "At least ₹100", test: (v) => v !== "" && !isNaN(Number(v)) && Number(v) >= 100 }
    ]
};

const COMMON_FIELDS = ["name", "email", "password", "phone"];
const DOCTOR_FIELDS = ["qualification", "experience", "consultationFee"];

// Value each field is checked against (same trimming as on submit)
const prep = (value) => String(value ?? "").trim();
const runChecks = (name, value) => RULES[name].map((r) => ({ ...r, passed: r.test(prep(value)) }));

// Live checklist under an input
function Checklist({ checks, focused, visited }) {
    return (
        <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0, fontSize: "12px" }} aria-live="polite">
            {checks.map((c) => {
                let color = "#94a3b8"; // pending
                let icon = "○";
                if (c.passed) {
                    color = "#16a34a";
                    icon = "✓";
                } else if (visited && !focused) {
                    color = "#ef4444";
                    icon = "✗";
                }
                return (
                    <li key={c.id} style={{ color, marginBottom: "3px", display: "flex", gap: "6px" }}>
                        <span style={{ width: "12px", textAlign: "center" }}>{icon}</span>
                        <span>{c.label}</span>
                    </li>
                );
            })}
        </ul>
    );
}

function Signup() {
    const [role, setRole] = useState("PATIENT");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        // Patient fields
        gender: "Male",
        bloodGroup: "B+",
        medicalHistory: "",
        // Doctor fields
        specialization: "Internal Medicine",
        qualification: "MBBS, MD",
        experience: 15,
        consultationFee: 1000,
        availability: "Available",
        shift: "Day",
        workingHours: 8
    });

    const [focused, setFocused] = useState("");
    const [visited, setVisited] = useState({});
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fields that apply to the selected role
    const activeFields = role === "DOCTOR" ? [...COMMON_FIELDS, ...DOCTOR_FIELDS] : COMMON_FIELDS;

    const checks = {};
    activeFields.forEach((f) => {
        checks[f] = runChecks(f, formData[f]);
    });

    const fieldValid = (f) => checks[f].every((c) => c.passed);
    const allValid = activeFields.every(fieldValid);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrorMsg("");
        if (name === "phone") {
            setFormData({ ...formData, phone: value.replace(/\D/g, "").slice(0, 10) });
            return;
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleFocus = (e) => setFocused(e.target.name);
    const handleBlur = (e) => {
        const { name } = e.target;
        setFocused("");
        setVisited((prev) => ({ ...prev, [name]: true }));
    };

    const borderFor = (f) => {
        const hasValue = prep(formData[f]).length > 0;
        if (!hasValue && !visited[f]) return undefined;
        if (fieldValid(f)) return "#16a34a";
        return visited[f] && focused !== f ? "#ef4444" : undefined;
    };

    // Shows while focused, once typed in, or after the field was left / submit pressed
    const renderChecklist = (f) => {
        const show = focused === f || prep(formData[f]).length > 0 || visited[f];
        if (!show) return null;
        return <Checklist checks={checks[f]} focused={focused === f} visited={!!visited[f]} />;
    };

    // Props shared by every checked input
    const inputProps = (f) => ({
        name: f,
        className: "form-input",
        value: formData[f],
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        style: { borderColor: borderFor(f) }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        // Reveal the check result of every entry, then stop if any failed
        const allVisited = {};
        activeFields.forEach((f) => (allVisited[f] = true));
        setVisited((prev) => ({ ...prev, ...allVisited }));

        if (!allValid) {
            setErrorMsg("Please fix the highlighted checks below before registering.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password.trim(),
                phone: formData.phone.trim(),
                role: role
            };

            if (role === "DOCTOR") {
                payload.specialization = formData.specialization;
                payload.qualification = formData.qualification.trim();
                payload.experience = Number(formData.experience) || 10;
                payload.consultationFee = Number(formData.consultationFee) || 1000;
                payload.availability = formData.availability;
                payload.shift = formData.shift;
                payload.workingHours = Number(formData.workingHours) || 8;
            } else {
                payload.gender = formData.gender;
                payload.bloodGroup = formData.bloodGroup;
                payload.medicalHistory = formData.medicalHistory || "Routine Health Checkup";
            }

            await api.post("/users", payload);

            setSuccessMsg("Account created successfully! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error) {
            setErrorMsg(
                error.response?.data?.message ||
                "Error creating account. Please check your details and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />

            <main className="container" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "30px 16px" }}>
                <div className="card" style={{ maxWidth: "560px", width: "100%" }}>
                    <h2 style={{ fontSize: "20px", marginBottom: "6px", color: "#0f172a" }}>Register Account</h2>
                    <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
                        Choose whether you are registering as a Patient or a Doctor.
                    </p>

                    {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
                    {successMsg && <div className="alert alert-success">{successMsg}</div>}

                    {/* Role Selector */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
                        <button
                            type="button"
                            className={`btn ${role === "PATIENT" ? "btn-primary" : "btn-outline"}`}
                            style={{ flex: 1 }}
                            onClick={() => setRole("PATIENT")}
                        >
                            Register as Patient
                        </button>
                        <button
                            type="button"
                            className={`btn ${role === "DOCTOR" ? "btn-primary" : "btn-outline"}`}
                            style={{ flex: 1 }}
                            onClick={() => setRole("DOCTOR")}
                        >
                            Register as Doctor
                        </button>
                    </div>

                    {/* noValidate stops the browser's own popup so our live checks are the only ones */}
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Common Account Fields */}
                        <div className="form-group">
                            <label htmlFor="name">Full Name *</label>
                            <input
                                id="name"
                                type="text"
                                placeholder={role === "DOCTOR" ? "e.g. Dr. Bhavna Chaudhry" : "e.g. Rahul Sharma"}
                                autoComplete="name"
                                {...inputProps("name")}
                            />
                            {renderChecklist("name")}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address *</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@hospital.com"
                                autoComplete="email"
                                {...inputProps("email")}
                            />
                            {renderChecklist("email")}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password *</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                autoComplete="new-password"
                                {...inputProps("password")}
                            />
                            {renderChecklist("password")}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number * (10 Digits)</label>
                            <input
                                id="phone"
                                type="tel"
                                placeholder="e.g. 9876543210"
                                maxLength="10"
                                inputMode="numeric"
                                autoComplete="tel"
                                {...inputProps("phone")}
                            />
                            {renderChecklist("phone")}
                        </div>

                        {/* DOCTOR SPECIFIC FIELDS */}
                        {role === "DOCTOR" && (
                            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "6px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
                                <h4 style={{ fontSize: "14px", color: "#0f172a", marginBottom: "10px" }}>Doctor Details</h4>

                                <div className="form-group">
                                    <label>Medical Specialization *</label>
                                    <select
                                        name="specialization"
                                        className="form-select"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                    >
                                        <option value="Cardiology & Cardiac Sciences">Cardiology & Cardiac Sciences</option>
                                        <option value="Obstetrics & Gynaecology">Obstetrics & Gynaecology</option>
                                        <option value="Orthopaedics & Joint Replacement">Orthopaedics & Joint Replacement</option>
                                        <option value="Internal Medicine">Internal Medicine (General Medicine)</option>
                                        <option value="ENT (Ear Nose Throat)">ENT (Ear Nose Throat)</option>
                                        <option value="Nephrology & Kidney Transplant">Nephrology & Kidney Transplant</option>
                                        <option value="Medical Oncology & Cancer Care">Medical Oncology & Cancer Care</option>
                                        <option value="Pediatrics">Pediatrics</option>
                                        <option value="Dermatology">Dermatology</option>
                                        <option value="General Physician">General Physician</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="qualification">Qualification *</label>
                                    <input
                                        id="qualification"
                                        type="text"
                                        placeholder="e.g. MBBS, MD, MS, DM"
                                        {...inputProps("qualification")}
                                    />
                                    {renderChecklist("qualification")}
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Shift Timing *</label>
                                        <select
                                            name="shift"
                                            className="form-select"
                                            value={formData.shift}
                                            onChange={handleChange}
                                        >
                                            <option value="Day">Day Shift (9 AM - 5 PM)</option>
                                            <option value="Night">Night Shift (6 PM - 2 AM)</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Daily Working Hours</label>
                                        <select
                                            name="workingHours"
                                            className="form-select"
                                            value={formData.workingHours}
                                            onChange={handleChange}
                                        >
                                            <option value="4">4 Hours / Day</option>
                                            <option value="6">6 Hours / Day</option>
                                            <option value="8">8 Hours / Day (Full-Time)</option>
                                            <option value="10">10 Hours / Day</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                    <div className="form-group">
                                        <label htmlFor="experience">Experience (Years)</label>
                                        <input
                                            id="experience"
                                            type="number"
                                            min="1"
                                            {...inputProps("experience")}
                                        />
                                        {renderChecklist("experience")}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="consultationFee">Consultation Fee (₹ INR)</label>
                                        <input
                                            id="consultationFee"
                                            type="number"
                                            min="100"
                                            step="50"
                                            {...inputProps("consultationFee")}
                                        />
                                        {renderChecklist("consultationFee")}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PATIENT SPECIFIC FIELDS */}
                        {role === "PATIENT" && (
                            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "6px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
                                <h4 style={{ fontSize: "14px", color: "#0f172a", marginBottom: "10px" }}>Patient Health Information</h4>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <select
                                            name="gender"
                                            className="form-select"
                                            value={formData.gender}
                                            onChange={handleChange}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Blood Group</label>
                                        <select
                                            name="bloodGroup"
                                            className="form-select"
                                            value={formData.bloodGroup}
                                            onChange={handleChange}
                                        >
                                            <option value="B+">B+</option>
                                            <option value="O+">O+</option>
                                            <option value="A+">A+</option>
                                            <option value="AB+">AB+</option>
                                            <option value="B-">B-</option>
                                            <option value="O-">O-</option>
                                            <option value="A-">A-</option>
                                            <option value="AB-">AB-</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Medical Notes / History (Optional)</label>
                                    <input
                                        type="text"
                                        name="medicalHistory"
                                        className="form-input"
                                        placeholder="e.g. Hypertension, Diabetes checkup, Allergy"
                                        value={formData.medicalHistory}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "10px" }} disabled={loading}>
                            {loading ? "Registering..." : `Register as ${role === "DOCTOR" ? "Doctor" : "Patient"}`}
                        </button>
                    </form>

                    <div style={{ textAlign: "center", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #e2e8f0", fontSize: "13px" }}>
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Signup;
