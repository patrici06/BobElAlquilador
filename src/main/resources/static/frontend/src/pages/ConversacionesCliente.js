import React, { useEffect, useState } from "react";
import { obtenerPreguntasCliente, crearPregunta } from "../services/conversacionService";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import { jwtDecode } from "jwt-decode";

function ConversacionesCliente() {
    const [preguntas, setPreguntas] = useState([]);
    const [nuevaPregunta, setNuevaPregunta] = useState("");
    const token = sessionStorage.getItem("token");

    // Extraer email desde el JWT
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
        obtenerPreguntasCliente(email)
            .then(res => setPreguntas(res.data))
            .catch(err => console.error("Error al obtener preguntas:", err));
    }, [email]);

    const handleEnviarPregunta = () => {
        const pregunta = {
            cliente: { email: email },
            fecha: new Date().toISOString().split('T')[0],  // yyyy-MM-dd
            hora: new Date().toTimeString().split(' ')[0],  // HH:mm:ss
            cuerpo: nuevaPregunta
        };
        crearPregunta(email, pregunta)
            .then(res => {
                setPreguntas([...preguntas, res.data]);
                setNuevaPregunta("");
            })
            .catch(err => console.error("Error al crear pregunta:", err));
    };

    return (
        <div>
            <h2>Mis Preguntas</h2>
            <ul>
                {preguntas.map((iteracion, index) => (
                    <li key={index}>
                        <strong>{iteracion.pregunta.cuerpo}</strong> - {iteracion.pregunta.fecha} {iteracion.pregunta.hora}
                    </li>
                ))}
            </ul>
            <textarea
                value={nuevaPregunta}
                onChange={(e) => setNuevaPregunta(e.target.value)}
                placeholder="Escribe tu pregunta..."
            />
            <button onClick={handleEnviarPregunta}>Enviar</button>
        </div>
    );
}

export default ConversacionesCliente;
