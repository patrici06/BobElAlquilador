import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();

    return (
        <header style={{ padding: "1rem", background: "#282c34", color: "#fff", display: "flex", justifyContent: "space-between" }}>
            <h2>Mi App</h2>
            <div>
                <button onClick={() => navigate("/login")} style={{ marginRight: "1rem" }}>
                    Login
                </button>
                <button onClick={() => navigate("/register")}>
                    Register
                </button>
            </div>
        </header>
    );
}

export default Header;