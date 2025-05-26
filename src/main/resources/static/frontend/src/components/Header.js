import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRolTexto } from "../utils/authUtils";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import { jwtDecode } from "jwt-decode";

function Header() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const rawRoles = getRolesFromJwt(token);

    // Extraer el email del JWT si existe
    let email = "";
    if (token) {
        try {
            const decoded = jwtDecode(token);
            email = decoded.email || decoded.sub || "";
        } catch (e) {
            email = "";
        }
    }

    const baseBtn = {
        padding: "0.6rem 1.2rem",
        background: "#ac1010",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        fontWeight: 600,
        fontSize: "1rem",
        cursor: "pointer",
        marginRight: "0.7rem",
        transition: "background 0.2s"
    };
    const hoverBtn = { background: "rgba(255,255,255,0.47)" };
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
                {/* Imagen clickeable que redirige a la raíz */}
                <img
                    src="/Completo.png"
                    alt="BobElAlquilador"
                    style={{ height: "40px", marginRight: "1rem", cursor: "pointer" }}
                    onClick={() => navigate("/")}
                />
                {token && (
                    <>
                        <button
                            onClick={() => navigate(`/perfil/${email}`)}
                            style={hoveredBtn === "perfil"
                                ? { ...baseBtn, ...hoverBtn }
                                : baseBtn}
                            onMouseEnter={() => setHoveredBtn("perfil")}
                            onMouseLeave={() => setHoveredBtn("")}
                        >
                            Mi Perfil
                        </button>
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
                            {rawRoles.length > 0
                                ? rawRoles.map(getRolTexto).join(", ")
                                : "Sin rol"}
                        </span>
                    </>
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
                        {rawRoles.includes("ROLE_PROPIETARIO") && (
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
                                    onClick={() => navigate("/propietario/subirMaquina")}
                                    style={hoveredBtn === "/propietario/subirMaquina"
                                        ? { ...baseBtn, ...hoverBtn }
                                        : baseBtn}
                                    onMouseEnter={() => setHoveredBtn("/propietario/subirMaquina")}
                                    onMouseLeave={() => setHoveredBtn("")}
                                >
                                    Subir Maquina
                                </button>
                            </>
                        )}
                        {/* Aquí puedes agregar funcionalidades propias de empleado si lo deseas */}
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