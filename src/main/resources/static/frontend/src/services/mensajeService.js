import axios from "axios";

const API_BASE = "http://localhost:8080";


export function getMensajesDeConversacion(idConversacion) {
    const token = localStorage.getItem("token");
    return axios.get(`${API_BASE}/mensaje/conversacion/${idConversacion}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export function crearMensaje(idConversacion, mensajeData) {
    const token = localStorage.getItem("token");
    return axios.post(`${API_BASE}/mensaje/crear/${idConversacion}`, mensajeData, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export function borrarMensaje(idMensaje) {
    const token = localStorage.getItem("token");
    return axios.delete(`${API_BASE}/mensaje/borrar/${idMensaje}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

