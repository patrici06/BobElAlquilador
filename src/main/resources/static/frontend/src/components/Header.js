import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRolTexto } from "../utils/authUtils";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import { jwtDecode } from "jwt-decode";
import styles from "./Header.module.css"; // Nueva hoja de estilos para responsividad

function Header() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
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

    const [hoveredBtn, setHoveredBtn] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    // Renderiza los botones según el rol y sesión
    const renderButtons = () => {
        if (!token) {
            return (
                <>
                    <button
                        onClick={() => { setMenuOpen(false); navigate("/login"); }}
                        className={styles.button}
                        onMouseEnter={() => setHoveredBtn("login")}
                        onMouseLeave={() => setHoveredBtn("")}
                        data-hovered={hoveredBtn === "login"}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => { setMenuOpen(false); navigate("/register"); }}
                        className={styles.button}
                        onMouseEnter={() => setHoveredBtn("register")}
                        onMouseLeave={() => setHoveredBtn("")}
                        data-hovered={hoveredBtn === "register"}
                    >
                        Registrarse
                    </button>
                </>
            );
        }

        return (
            <>
                <button
                    onClick={() => { setMenuOpen(false); navigate(`/perfil/${email}`); }}
                    className={styles.button}
                    onMouseEnter={() => setHoveredBtn("perfil")}
                    onMouseLeave={() => setHoveredBtn("")}
                    data-hovered={hoveredBtn === "perfil"}
                >
                    Mi Perfil
                </button>
                {rawRoles.includes("ROLE_PROPIETARIO") && (
                    <>
                        <button
                            onClick={() => { setMenuOpen(false); navigate("/register/empleado"); }}
                            className={styles.button}
                            onMouseEnter={() => setHoveredBtn("registerEmpleado")}
                            onMouseLeave={() => setHoveredBtn("")}
                            data-hovered={hoveredBtn === "registerEmpleado"}
                        >
                            Registrar Empleado
                        </button>
                        <button
                            onClick={() => { setMenuOpen(false); navigate("/propietario/subirMaquina"); }}
                            className={styles.button}
                            onMouseEnter={() => setHoveredBtn("/propietario/subirMaquina")}
                            onMouseLeave={() => setHoveredBtn("")}
                            data-hovered={hoveredBtn === "/propietario/subirMaquina"}
                        >
                            Subir Maquina
                        </button>
                        <button
                            onClick={() => { setMenuOpen(false); navigate("/alquilar"); }}
                            className={styles.button}
                            onMouseEnter={() => setHoveredBtn("Ver Maquinas")}
                            onMouseLeave={() => setHoveredBtn("")}
                            data-hovered={hoveredBtn === "Ver Maquinas"}
                        >
                            Ver Maquinas
                        </button>
                    </>
                )}
                {rawRoles.includes("ROLE_CLIENTE") && (
                    <>
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                navigate("/alquilar");
                            }}
                            className={styles.button}
                            onMouseEnter={() => setHoveredBtn("alquilar")}
                            onMouseLeave={() => setHoveredBtn("")}
                            data-hovered={hoveredBtn === "alquilar"}
                        >
                            Alquilar Maquina
                        </button>

                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                navigate("/mis-alquileres");
                            }}
                            className={styles.button}
                            onMouseEnter={() => setHoveredBtn("mis-alquileres")}
                            onMouseLeave={() => setHoveredBtn("")}
                            data-hovered={hoveredBtn === "mis-alquileres"}
                        >
                            Mis Alquileres
                        </button>
                    </>
                )}
                <button
                    onClick={() => {
                        sessionStorage.removeItem("token");
                        setMenuOpen(false);
                        navigate("/");
                    }}
                    className={styles.button}
                    onMouseEnter={() => setHoveredBtn("logout")}
                    onMouseLeave={() => setHoveredBtn("")}
                    data-hovered={hoveredBtn === "logout"}
                >
                    Cerrar sesión
                </button>
            </>
        );
    };

    // Renderizado principal
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <img
                    src="/Completo.png"
                    alt="BobElAlquilador"
                    className={styles.logo}
                    onClick={() => { setMenuOpen(false); navigate("/"); }}
                />
                {token && (
                    <span className={styles.roles}>
                        {rawRoles.length > 0
                            ? rawRoles.map(getRolTexto).join(", ")
                            : "Sin rol"}
                    </span>
                )}
            </div>

            {/* Botón de menú hamburguesa para mobile */}
            <button
                className={styles.hamburger}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Abrir menú"
            >
                <span />
                <span />
                <span />
            </button>

            {/* Navegación (responsive) */}
            <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
                {renderButtons()}
            </nav>

            {/* Cierra el menú al hacer click fuera en mobile */}
            {menuOpen && (
                <div
                    className={styles.backdrop}
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </header>
    );
}

export default Header;