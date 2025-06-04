import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE = "http://localhost:8080/cliente";

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
    return axios.get(`${API_BASE}/preguntas-sin-responder`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export function enviarRespuestaConsulta(idConversacion, idPregunta, respuesta) {
    return axios.post(
        `${API_BASE}/conversaciones/${idConversacion}/preguntas/${idPregunta}/respuesta`,
        respuesta,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'text/plain'
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