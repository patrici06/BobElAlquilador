import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import { jwtDecode } from "jwt-decode";
import { crearPregunta } from "../services/conversacionService";
import styles from "./ConversacionDetalle.module.css";

function ConversacionDetalle() {
    const navigate = useNavigate();
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [exito, setExito] = useState("");
    const [errorMensaje, setErrorMensaje] = useState("");
    const [contador, setContador] = useState(60);
    const [enviando, setEnviando] = useState(false);
    const token = sessionStorage.getItem("token");

    // Extraer email desde el JWT
    let email = "";
    if (token) {
        try {
            const decoded = jwtDecode(token);
            email = decoded.email || decoded.sub || "";
        } catch (e) {
            console.error("Error decodificando token:", e);
            email = "";
        }
    }

    const handleEnviarPregunta = async () => {
        if (!nuevoMensaje.trim()) {
            setErrorMensaje("El mensaje no puede estar vacío.");
            return;
        }

        if (!email) {
            setErrorMensaje("No se pudo obtener el email del usuario.");
            return;
        }

        setEnviando(true);
        setErrorMensaje("");

        try {
            await crearPregunta(email, nuevoMensaje.trim());
            setExito("¡Su consulta se envió correctamente! Un empleado la responderá pronto.");
            setContador(60);
            setNuevoMensaje("");
            setErrorMensaje("");
        } catch (err) {
            console.error("Error al enviar pregunta:", err);
            setErrorMensaje(err.response?.data?.mensaje || "Error al enviar la consulta. Por favor, intente nuevamente.");
        } finally {
            setEnviando(false);
        }
    };

    useEffect(() => {
        if (!exito) return;

        const interval = setInterval(() => {
            setContador((prev) => prev > 0 ? prev - 1 : 0);
        }, 1000);

        return () => clearInterval(interval);
    }, [exito]);

    useEffect(() => {
        if (contador === 0 && exito) {
            navigate("/consultas");
        }
    }, [contador, exito, navigate]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Nueva Consulta</h1>

            {!exito ? (
                <div className={styles.nuevoMensaje}>
                    <textarea
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}
                        placeholder="Escriba su consulta aquí..."
                        className={styles.textarea}
                        disabled={enviando}
                    />
                    {errorMensaje && <p className={styles.error}>{errorMensaje}</p>}
                    <button 
                        onClick={handleEnviarPregunta} 
                        className={styles.button}
                        disabled={enviando || !nuevoMensaje.trim()}
                    >
                        {enviando ? "Enviando..." : "Enviar Consulta"}
                    </button>
                </div>
            ) : (
                <div className={styles.exitoContainer}>
                    <p className={styles.exito}>{exito}</p>
                    <button
                        onClick={() => {
                            setExito("");
                            setNuevoMensaje("");
                            setContador(60);
                        }}
                        className={styles.button}
                    >
                        Realizar otra consulta
                    </button>
                    <button
                        onClick={() => navigate("/consultas")}
                        className={styles.button}
                    >
                        Ver mis consultas
                    </button>
                    <p className={styles.contador}>
                        Redirigiendo a mis consultas en {contador} segundos...
                    </p>
                </div>
            )}
        </div>
    );
}

export default ConversacionDetalle;
