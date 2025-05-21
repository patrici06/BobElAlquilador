import axios from "axios";
const API_URL = "http://localhost:8080/auth/login";

export function login(dni, clave) {
    return axios.post(API_URL, { dni, clave });
}