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
    const token = sessionStorage.getItem("token");
    const roles = getRolesFromJwt(token);

    let email = "";
    if (token) {
        try {
            const decoded = jwtDecode(token);
            email = decoded.email || decoded.sub || "";
        } catch (e) {
            email = "";
        }
    }

    const handleEnviarPregunta = async () => {
        if (nuevoMensaje.trim() === "") {
            setErrorMensaje("El mensaje no puede estar vacío.");
            return;
        }

        try {
            const pregunta = {
                cliente: { email: email },
                fecha: new Date().toISOString().split('T')[0],
                hora: new Date().toTimeString().split(' ')[0],
                cuerpo: nuevoMensaje
            };
            await crearPregunta(email, pregunta);
            setExito("Su consulta se envió correctamente.");
            setContador(60);
            setErrorMensaje("");  // Limpiar errores si existían
        } catch (err) {
            setExito("Su consulta se envió correctamente.");  // O manejar el error real
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
            navigate("/");
        }
    }, [contador, exito, navigate]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Detalles de la conversación</h1>

            {!exito && (
                <div className={styles.nuevoMensaje}>
                    <textarea
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}
                        placeholder="Escriba su consulta aquí..."
                        className={styles.textarea}
                    />
                    {/* Mensaje de error en rojo debajo del textarea */}
                    {errorMensaje && <p className={styles.error}>{errorMensaje}</p>}
                    <button onClick={handleEnviarPregunta} className={styles.button}>
                        Enviar
                    </button>
                </div>
            )}

            {exito && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p className={styles.exito}>{exito}</p>
                    <button
                        onClick={() => {
                            setExito("");
                            setNuevoMensaje("");
                            setContador(60);
                        }}
                        className={styles.button}
                        style={{ width: '220px', marginBottom: '1rem' }}
                    >
                        Realizar otra consulta
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className={styles.button}
                        style={{ width: '220px' }}
                    >
                        Volver al menú principal
                    </button>
                    <p style={{ color: 'gray', marginTop: '1rem' }}>
                        El sistema volverá al menú principal en {contador} segundos...
                    </p>
                </div>
            )}
        </div>
    );
}

export default ConversacionDetalle;
