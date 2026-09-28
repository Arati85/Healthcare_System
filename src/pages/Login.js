import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { setCurrentUser } from "../services/auth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// One check per field: returns an error message, or "" when the entry is valid
const checkField = (name, value) => {
    if (name === "email") {
        const v = value.trim();
        if (!v) return "Email address is required.";
        if (!EMAIL_REGEX.test(v)) return "Please enter a valid email address (e.g. name@example.com).";
        return "";
    }
    if (name === "password") {
        if (!value) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters long.";
        return "";
    }
    return "";
};

function Login() {
    const [values, setValues] = useState({ email: "", password: "" });
    const [touched, setTouched] = useState({ email: false, password: false });
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Live status of each entry, derived from its current value
    const errors = {
        email: checkField("email", values.email),
        password: checkField("password", values.password)
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        setTouched((prev) => ({ ...prev, [name]: true })); // check as the user types
        setErrorMsg("");
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        // Show the check result for every entry, then stop if any failed
        setTouched({ email: true, password: true });
        if (errors.email || errors.password) return;

        setLoading(true);
        try {
            const response = await api.post("/users/login", {
                email: values.email.trim(),
                password: values.password.trim()
            });
            setCurrentUser(response.data);
            navigate("/dashboard");
        } catch (error) {
            setErrorMsg(
                error.response?.data?.message ||
                "Login failed. Please check email and password or ensure backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    // Green ✓ when valid, red ⚠ + message when invalid, nothing until touched
    const renderCheck = (name) => {
        if (!touched[name]) return null;
        if (errors[name]) {
            return (
                <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    ⚠️ {errors[name]}
                </span>
            );
        }
        return (
            <span style={{ color: "#16a34a", fontSize: "12px", marginTop: "4px", display: "block" }}>
                ✓ Looks good
            </span>
        );
    };

    const borderFor = (name) => {
        if (!touched[name]) return undefined;
        return errors[name] ? "#ef4444" : "#16a34a";
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />

            <main className="container" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
                <div className="card" style={{ maxWidth: "400px", width: "100%" }}>
                    <h2 style={{ fontSize: "20px", marginBottom: "6px", color: "#0f172a" }}>Sign In</h2>
                    <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
                        Enter your email and password to access your healthcare account.
                    </p>

                    {errorMsg && (
                        <div className="alert alert-danger" style={{ marginBottom: "16px" }}>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group" style={{ marginBottom: "16px" }}>
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="form-input"
                                placeholder="name@example.com"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                style={{ borderColor: borderFor("email") }}
                            />
                            {renderCheck("email")}
                        </div>

                        <div className="form-group" style={{ marginBottom: "20px" }}>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                style={{ borderColor: borderFor("password") }}
                            />
                            {renderCheck("password")}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: "100%", padding: "10px", marginTop: "4px" }}
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Login"}
                        </button>
                    </form>

                    <div style={{ textAlign: "center", marginTop: "20px", paddingTop: "14px", borderTop: "1px solid #e2e8f0", fontSize: "13px" }}>
                        Don't have an account? <Link to="/signup">Register here</Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Login;
