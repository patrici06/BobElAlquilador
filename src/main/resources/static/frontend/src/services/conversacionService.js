import axios from "axios";

const API_BASE = "http://localhost:8080";

export function getConversacionesCliente(email) {
    const token = localStorage.getItem("token");
    return axios.get(`${API_BASE}/conversacion/cliente/${email}`, {     // endpoint definido en el back
        headers: { Authorization: `Bearer ${token}` }                   // indica que el cliente esta autenticado
    });
}

export function getConversacionesEmpleado(email) {
    const token = localStorage.getItem("token");
    return axios.get(`${API_BASE}/conversacion/empleado/${email}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export function getConversacionPorId(idConversacion) {
    const token = localStorage.getItem("token");
    return axios.get(`${API_BASE}/conversacion/${idConversacion}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export function crearConversacion(conversacionData) {
    const token = localStorage.getItem("token");
    return axios.post(`${API_BASE}/conversacion/crear`, conversacionData, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export function borrarConversacion(idConversacion) {
    const token = localStorage.getItem("token");
    return axios.delete(`${API_BASE}/conversacion/borrar/${idConversacion}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export function getConversacionesPendientesEmpleado() {
    
    const token = localStorage.getItem("token");
    console.log("Token que se usa para autenticación:", token);

    return axios.get(`${API_BASE}/conversacion/pendientes`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

