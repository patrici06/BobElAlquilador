import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE = "http://localhost:8080/cliente";
const API_URL = "http://localhost:8080/empleado";
export function crearPregunta(mensaje) {
    const token = sessionStorage.getItem("token");
    let email = "";
    if (token) {
        try {
            const decoded = jwtDecode(token);
            email = decoded.email || decoded.sub || "";
        } catch (e) {
            email = "";
        }
    }
    return axios.post(`${API_BASE}/${email}/preguntas`, mensaje, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'text/plain'
        }
    });
}
const token = sessionStorage.getItem("token");

export function obtenerConsultasPendientes() {
    return axios.get(`${API_URL}/preguntas-sin-responder`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export function enviarRespuestaConsulta(preguntaId, respuesta) {
    // Obtener el token (y el email del empleado)
    const token = sessionStorage.getItem("token");
    let email = "";
    if (token) {
        try {
            const decoded = jwtDecode(token);
            email = decoded.email || decoded.sub || "";
        } catch (e) {
            email = "";
        }
    }

    // Verifica aquí con un console.log
    console.log("Enviando body:", { respuesta, email });

    // Enviá ambos campos en el body
    return axios.post(
        `${API_URL}/conversaciones/preguntas/${preguntaId}/respuesta`,
        { respuesta, email },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );
}
export function obtenerPreguntasCliente() {
    const token = sessionStorage.getItem("token");
    let email = "";
    if (token) {
        try {
            const decoded = jwtDecode(token);
            email = decoded.email || decoded.sub || "";
        } catch (e) {
            email = "";
        }
    }
    return axios.get(`${API_BASE}/${email}/preguntas`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export function enviarRespuesta(idConversacion, respuesta) {
    const token = sessionStorage.getItem("token");
    return axios.post(`${API_BASE}/conversaciones/${idConversacion}/respuesta`, respuesta, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'text/plain'
        }
    });
}