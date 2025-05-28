import axios from "axios";

const API_BASE = "http://localhost:8080";

// Servicio de login
export function login(email, clave) {
    return axios.post(`${API_BASE}/auth/login`, { email, clave });
}
// Servicio de 2FA
export function verify2fa(email, code) {
    // Asume endpoint POST /api/2fa/verify
    return axios.post(`${API_BASE}/auth/2fa/verify`, { email, code });
}

// Servicio subir maquina
export function subirMaquina(maquinaObj) {
    const token = sessionStorage.getItem("token");
    return axios.post(
        `${API_BASE}/propietario/subirMaquina`,
        maquinaObj,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}
//Servicio para ver la info de perfil
export function perfil({ email }) {
    const token = sessionStorage.getItem("token");
    return axios.get(`${API_BASE}/perfil/${email}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
//Servicio para actualizar la información
export function actualizarPerfil(data) {
    const token = sessionStorage.getItem("token");
    // data debe contener el campo email
    return axios.post(`${API_BASE}/perfil/${data.email}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
// Servicio de registro
export function register({ dni, nombre, apellido, email, telefono, clave, fechaNacimiento }) {
    return axios.post(`${API_BASE}/register`, {
        dni,
        nombre,
        apellido,
        email,
        telefono,
        clave,
        fechaNacimiento
    });
}
export function registerEmpleado({dni, nombre, apellido, email}) {
    const token = sessionStorage.getItem("token");
    return axios.post(
        `${API_BASE}/register/empleado`,
        { dni, nombre, apellido, email },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}