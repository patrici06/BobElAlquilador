import axios from "axios";

const API_BASE = "http://localhost:8080";

// Crear una nueva pregunta (iteracion)
export function crearPregunta(email, pregunta) {
    const token = sessionStorage.getItem("token"); // Usar sessionStorage, como tu Header
    return axios.post(`${API_BASE}/cliente/${email}/preguntas`, pregunta, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

// // Obtener todas las preguntas (iteraciones) del cliente
// export function obtenerPreguntasCliente(email) {
//     const token = sessionStorage.getItem("token");
//     return axios.get(`${API_BASE}/cliente/${email}/preguntas`, {
//         headers: { Authorization: `Bearer ${token}` }
//     });
// }

// // (opcional) Obtener conversaciones pendientes (si activas ese endpoint)
// export function obtenerConversacionesPendientes() {
//     const token = sessionStorage.getItem("token");
//     return axios.get(`${API_BASE}/cliente/pendientes`, {
//         headers: { Authorization: `Bearer ${token}` }
//     });
// }

export function obtenerTodasPreguntas() {
    const token = sessionStorage.getItem("token");
    return axios.get(`${API_BASE}/{email}/preguntas`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

