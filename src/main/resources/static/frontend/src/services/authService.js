import axios from "axios";

const API_BASE = "http://localhost:8080";

// Servicio de login
export function login(email, clave) {
    return axios.post(`${API_BASE}/auth/login`, { email, clave });
}

// Servicio de registro
export function register({ dni, nombre, apellido, email, telefono, clave }) {
    return axios.post(`${API_BASE}/register`, {
        dni,
        nombre,
        apellido,
        email,
        telefono,
        clave,
    });
}
export function registerEmpleado({dni, nombre, apellido, email}) {
    const token = localStorage.getItem("token");
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