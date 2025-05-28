import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRolTexto } from "../utils/authUtils";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const rawRoles = getRolesFromJwt(token);
    const tieneConversacion = localStorage.getItem("conversacionActiva") === "true";
    const location = useLocation();

    // Determinar el rol principal (priorizar EMPLEADO sobre CLIENTE)
    let rolPrincipal = "";
    if (rawRoles.includes("ROLE_EMPLEADO")) {
        rolPrincipal = "ROLE_EMPLEADO";
    } else if (rawRoles.includes("ROLE_CLIENTE")) {
        rolPrincipal = "ROLE_CLIENTE";
    } else if (rawRoles.includes("ROLE_PROPIETARIO")) {
        rolPrincipal = "ROLE_PROPIETARIO";
    }

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

    useEffect(() => {
        if (window.location.pathname === "/") {
            localStorage.removeItem("conversacionActiva");
        }
    }, []);
    
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
                            {rolPrincipal ? getRolTexto(rolPrincipal) : "Sin rol"}
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
                                ? {...baseBtn, ...hoverBtn}
                                : baseBtn}
                            onMouseEnter={() => setHoveredBtn("login")}
                            onMouseLeave={() => setHoveredBtn("")}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            style={hoveredBtn === "register"
                                ? {...baseBtn, ...hoverBtn}
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
                        {/*------------------------ PROPIETARIO ------------------------*/}  
                        {rolPrincipal === "ROLE_PROPIETARIO" && (
                            <>
                                <button
                                    onClick={() => navigate("/register/empleado")}
                                    style={hoveredBtn === "registerEmpleado"
                                        ? {...baseBtn, ...hoverBtn}
                                        : baseBtn}
                                    onMouseEnter={() => setHoveredBtn("registerEmpleado")}
                                    onMouseLeave={() => setHoveredBtn("")}
                                >
                                    Registrar Empleado
                                </button>
                                <button
                                    onClick={() => navigate("/propietario/subirMaquina")}
                                    style={hoveredBtn === "/propietario/subirMaquina"
                                        ? {...baseBtn, ...hoverBtn}
                                        : baseBtn}
                                    onMouseEnter={() => setHoveredBtn("/propietario/subirMaquina")}
                                    onMouseLeave={() => setHoveredBtn("")}
                                >
                                    Subir Maquina
                                </button>
                                <button
                                    onClick={() => navigate("/alquilar")}
                                    style={hoveredBtn === "Ver Maquinas"
                                        ? {...baseBtn, ...hoverBtn}
                                        : baseBtn}
                                    onMouseEnter={() => setHoveredBtn("Ver Maquinas")}
                                    onMouseLeave={() => setHoveredBtn("")}
                                >
                                    Ver Maquinas
                                </button>
                            </>
                        )}

                        {/*------------------------ CLIENTE ------------------------*/}  
                        {rolPrincipal === "ROLE_CLIENTE" && (
                            <>
                                <button
                                    onClick={() => navigate("/alquilar")}
                                    style={hoveredBtn === "alquilar"
                                        ? {...baseBtn, ...hoverBtn}
                                        : baseBtn}
                                    onMouseEnter={() => setHoveredBtn("alquilar")}
                                    onMouseLeave={() => setHoveredBtn("")}
                                >
                                    Alquilar Maquina
                                </button>
                                {!tieneConversacion && (
                                    <button
                                        onClick={() => navigate('/nuevaConversacion')}
                                        style={hoveredBtn === "iniciarConversacion"
                                            ? {...baseBtn, ...hoverBtn}
                                            : baseBtn}
                                        onMouseEnter={() => setHoveredBtn("iniciarConversacion")}
                                        onMouseLeave={() => setHoveredBtn("")}
                                    >
                                        Consultar
                                    </button>
                                )}
                            </>
                        )}

                        {/*------------------------ EMPLEADO ------------------------*/}  
                        {rolPrincipal === "ROLE_EMPLEADO" && (
                            <button
                                onClick={() => navigate('/consultasPendientes')}
                                style={hoveredBtn === "verConsultas"
                                    ? {...baseBtn, ...hoverBtn}
                                    : baseBtn}
                                onMouseEnter={() => setHoveredBtn("verConsultas")}
                                onMouseLeave={() => setHoveredBtn("")}
                            >
                                Bandeja de entrada
                            </button>
                        )}

                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("rol");
                                navigate("/");
                            }}
                            style={hoveredBtn === "logout"
                                ? {...baseBtn, ...hoverBtn, marginRight: 0}
                                : {...baseBtn, marginRight: 0}}
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
