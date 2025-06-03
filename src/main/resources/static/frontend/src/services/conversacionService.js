import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE = "http://localhost:8080/cliente";

// // Crear una nueva pregunta (iteracion)
// export function crearPregunta(nuevoMensaje, email) {
//     const token = sessionStorage.getItem("token"); 
//     return axios.post(
//         `${API_BASE}/${email}/preguntas`, nuevoMensaje, email, 
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         }
// ); 
// }



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

export function obtenerTodasPreguntas() {
    const token = sessionStorage.getItem("token");
    return axios.get(`${API_BASE}/{email}/preguntas`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

