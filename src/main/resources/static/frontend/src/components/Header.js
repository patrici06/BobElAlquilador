import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const rawRoles = localStorage.getItem("rol");

    function parseRoles(str) {
        if (!str) return [];
        return str
            .replace(/\[|\]/g, '')
            .split(',')
            .map(r => r.trim());
    }

    const roles = parseRoles(rawRoles);

    let rolTexto = null;
    if (roles.includes("ROLE_PROPIETARIO")) {
        rolTexto = "Propietario";
    } else if (roles.includes("ROLE_EMPLEADO")) {
        rolTexto = "Empleado";
    } else if (roles.includes("ROLE_CLIENTE")) {
        rolTexto = "Sesión Activa";
    }

    // Estilos para los botones
    const baseBtn = {
        padding: "0.6rem 1.2rem",
        background: "#10ac84",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontWeight: 600,
        fontSize: "1rem",
        cursor: "pointer",
        marginRight: "0.7rem",
        transition: "background 0.2s"
    };
    const hoverBtn = {
        background: "#098e6b"
    };

    // Estado para hover botón
    const [hoveredBtn, setHoveredBtn] = useState("");

    return (
        <header
            style={{
                padding: "1rem",
                background: "#282c34",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
                <h2 style={{ margin: 0, marginRight: "1rem" }}>BobElAlquilador</h2>
                {rolTexto && (
                    <span
                        style={{
                            background: "#ac1010",
                            color: "#ffffff",
                            borderRadius: "5px",
                            padding: "0.3rem 0.8rem",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            marginLeft: "0.5rem"
                        }}
                    >
                        {rolTexto}
                    </span>
                )}
            </div>
            <div>
                {!token && (
                    <>
                        <button
                            onClick={() => navigate("/login")}
                            style={hoveredBtn === "login"
                                ? { ...baseBtn, ...hoverBtn }
                                : baseBtn}
                            onMouseEnter={() => setHoveredBtn("login")}
                            onMouseLeave={() => setHoveredBtn("")}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            style={hoveredBtn === "register"
                                ? { ...baseBtn, ...hoverBtn }
                                : baseBtn}
                            onMouseEnter={() => setHoveredBtn("register")}
                            onMouseLeave={() => setHoveredBtn("")}
                        >
                            Registrarse
                        </button>
                    </>
                )}
                {token && (
                    <>
                        {roles.includes("ROLE_PROPIETARIO") && (
                            <>
                                <button
                                    onClick={() => navigate("/register/empleado")}
                                    style={hoveredBtn === "registerEmpleado"
                                        ? { ...baseBtn, ...hoverBtn }
                                        : baseBtn}
                                    onMouseEnter={() => setHoveredBtn("registerEmpleado")}
                                    onMouseLeave={() => setHoveredBtn("")}
                                >
                                    Registrar Empleado
                                </button>
                                <button
                                    onClick={() => navigate("/subir-maquina")}
                                    style={hoveredBtn === "subir-maquina"
                                        ? { ...baseBtn, ...hoverBtn }
                                        : baseBtn}
                                    onMouseEnter={() => setHoveredBtn("subir-maquina")}
                                    onMouseLeave={() => setHoveredBtn("")}
                                >
                                    Subir Maquina
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("rol");
                                navigate("/");
                            }}
                            style={hoveredBtn === "logout"
                                ? { ...baseBtn, ...hoverBtn, marginRight: 0 }
                                : { ...baseBtn, marginRight: 0 }}
                            onMouseEnter={() => setHoveredBtn("logout")}
                            onMouseLeave={() => setHoveredBtn("")}
                        >
                            Cerrar sesión
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;