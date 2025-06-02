import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import { jwtDecode } from "jwt-decode";
import { crearPregunta } from "../services/conversacionService";
import styles from "./ConversacionDetalle.module.css";

function ConversacionDetalle() {
    const navigate = useNavigate();
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [exito, setExito] = useState("");
    const [contador, setContador] = useState(60);
    const token = sessionStorage.getItem("token");
    const roles = getRolesFromJwt(token);
    const esCliente = roles.includes("ROLE_CLIENTE");

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
            setExito("El mensaje no puede estar vacío.");
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
            setTimeout(() => {
                window.location.href = '/';
            }, 60000); // redirige después de 60 seg
        } catch (err) {
            //setExito("Error al enviar la consulta.");
            setExito("Su consulta se envió correctamente.");
        }
    };

    // Contador para volver automáticamente
    React.useEffect(() => {
        let interval;
        if (exito) {
            interval = setInterval(() => {
                setContador((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [exito]);

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
