import axios from "axios";
export async function obtenerMaquinasMasAlquiladas(fechaInicio, fechaFin) {
    const token = sessionStorage.getItem("token");
  
    const res = await axios.get(`http://localhost:8080/api/alquileres/mas-alquiladas`, {
        params: { fechaInicio, fechaFin },
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"       
        }
    });
    return res.data;
}