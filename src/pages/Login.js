import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { setCurrentUser } from "../services/auth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Every data point of every entry is its own live check.
const RULES = {
    email: [
        { id: "local", label: "Has text before the @", test: (v) => /^[^\s@]+@/.test(v) },
        { id: "at", label: "Contains one @ symbol", test: (v) => (v.match(/@/g) || []).length === 1 },
        { id: "domain", label: "Has a domain after the @ (e.g. example)", test: (v) => /@[a-zA-Z0-9-]+(\.|$)/.test(v) && /@[a-zA-Z0-9]/.test(v) },
        { id: "tld", label: "Ends with a valid extension (e.g. .com)", test: (v) => /\.[a-zA-Z]{2,}$/.test(v) },
        { id: "chars", label: "Uses only valid characters, no spaces", test: (v) => v.length > 0 && /^[a-zA-Z0-9._%+@-]+$/.test(v) }
    ],
    password: [
        { id: "filled", label: "Password entered", test: (v) => v.length > 0 },
        { id: "len", label: "At least 6 characters", test: (v) => v.length >= 6 }
    ]
};

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Value each field is checked against (email is trimmed, as on submit)
const prep = (name, value) => (name === "email" ? value.trim() : value);

const runChecks = (name, value) =>
    RULES[name].map((r) => ({ ...r, passed: r.test(prep(name, value)) }));

function Login() {
    const [values, setValues] = useState({ email: "", password: "" });
    const [focused, setFocused] = useState("");
    const [visited, setVisited] = useState({ email: false, password: false });
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const checks = {
        email: runChecks("email", values.email),
        password: runChecks("password", values.password)
    };

    const fieldValid = (name) => {
        const allRules = checks[name].every((c) => c.passed);
        return name === "email" ? allRules && EMAIL_REGEX.test(values.email.trim()) : allRules;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrorMsg("");
    };

    const handleFocus = (e) => setFocused(e.target.name);

    const handleBlur = (e) => {
        const { name } = e.target;
        setFocused("");
        setVisited((prev) => ({ ...prev, [name]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setVisited({ email: true, password: true });
        if (!fieldValid("email") || !fieldValid("password")) return;

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

    // Live checklist: shows while typing/focused, and after leaving if anything is unmet
    const renderChecklist = (name) => {
        const hasValue = values[name].length > 0;
        const show = focused === name || hasValue || visited[name];
        if (!show) return null;

        return (
            <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0, fontSize: "12px" }} aria-live="polite">
                {checks[name].map((c) => {
                    let color = "#94a3b8"; // pending
                    let icon = "○";
                    if (c.passed) {
                        color = "#16a34a";
                        icon = "✓";
                    } else if (visited[name] && focused !== name) {
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
    };

    const borderFor = (name) => {
        if (!values[name] && !visited[name]) return undefined;
        if (fieldValid(name)) return "#16a34a";
        return visited[name] && focused !== name ? "#ef4444" : undefined;
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
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                autoComplete="email"
                                style={{ borderColor: borderFor("email") }}
                            />
                            {renderChecklist("email")}
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
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                autoComplete="current-password"
                                style={{ borderColor: borderFor("password") }}
                            />
                            {renderChecklist("password")}
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
