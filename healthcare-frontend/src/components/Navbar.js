import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, logout } from "../services/auth";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getCurrentUser();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header style={styles.header}>
            <div className="container" style={styles.navContainer}>

                {/* Brand */}
                <Link to="/" style={styles.brand}>
                    <strong>Healthcare Portal</strong>
                </Link>

                {/* Navigation Links */}
                <nav style={styles.navLinks}>

                    <Link
                        to="/"
                        style={{
                            ...styles.link,
                            fontWeight:
                                location.pathname === "/" ? "600" : "400"
                        }}
                    >
                        Home
                    </Link>

                    <Link
                        to="/departments"
                        style={{
                            ...styles.link,
                            fontWeight:
                                location.pathname === "/departments"
                                    ? "600"
                                    : "400"
                        }}
                    >
                        Departments
                    </Link>

                    <Link
                        to="/doctors"
                        style={{
                            ...styles.link,
                            fontWeight:
                                location.pathname === "/doctors"
                                    ? "600"
                                    : "400"
                        }}
                    >
                        Doctors
                    </Link>

                    {/* Child Vaccination */}
                    <Link
                        to="/vaccination"
                        style={{
                            ...styles.link,
                            fontWeight:
                                location.pathname === "/vaccination"
                                    ? "600"
                                    : "400"
                        }}
                    >
                        Child Vaccination
                    </Link>

                    {/* My Vaccinations */}
                    <Link
                        to="/my-vaccinations"
                        style={{
                            ...styles.link,
                            fontWeight:
                                location.pathname === "/my-vaccinations"
                                    ? "600"
                                    : "400",
                            color:
                                location.pathname === "/my-vaccinations"
                                    ? "#0284c7"
                                    : "#475569"
                        }}
                    >
                        My Vaccinations
                    </Link>

                    {/* Dashboard */}
                    {user && (
                        <Link
                            to="/dashboard"
                            style={{
                                ...styles.link,
                                fontWeight: "bold",
                                color: "#0284c7"
                            }}
                        >
                            Dashboard
                        </Link>
                    )}

                </nav>

                {/* User Section */}
                <div>
                    {user ? (

                        <div style={styles.userInfo}>

                            <span>
                                {user.name || user.email}

                                <span className="badge badge-role">
                                    {user.role}
                                </span>
                            </span>

                            <button
                                onClick={handleLogout}
                                className="btn btn-outline btn-sm"
                                style={{ marginLeft: "10px" }}
                            >
                                Logout
                            </button>

                        </div>

                    ) : (

                        <div
                            style={{
                                display: "flex",
                                gap: "8px"
                            }}
                        >
                            <Link
                                to="/login"
                                className="btn btn-outline btn-sm"
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="btn btn-primary btn-sm"
                            >
                                Register
                            </Link>
                        </div>

                    )}
                </div>

            </div>
        </header>
    );
}

const styles = {

    header: {
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "12px 0",
        position: "sticky",
        top: 0,
        zIndex: 100
    },

    navContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px"
    },

    brand: {
        fontSize: "18px",
        color: "#0f172a",
        textDecoration: "none"
    },

    navLinks: {
        display: "flex",
        gap: "20px"
    },

    link: {
        color: "#475569",
        fontSize: "14px",
        textDecoration: "none"
    },

    userInfo: {
        fontSize: "13px",
        display: "flex",
        alignItems: "center"
    }

};

export default Navbar;