import React, { useEffect, useState } from "react";
import "./EmpleadosResenas.css";

export default function EmpleadosResenas() {
    const [resenas, setResenas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/propietario/empleados-resenas", {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token") || ""}`,
                "Content-Type": "application/json"
            }
        })
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || "Error al obtener datos.");
                }
                return res.json();
            })
            .then(data => setResenas(data))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="resenas-container">
            <h2 className="resenas-title">Reseñas de Empleados</h2>
            {loading && <p>Cargando...</p>}
            {error && <p className="resenas-error">{error}</p>}
            {!loading && !error && resenas.length === 0 && (
                <p>No hay reseñas registradas.</p>
            )}
            {!loading && !error && resenas.length > 0 && (
                <div className="table-scroll">
                    <table className="resenas-table">
                        <thead>
                        <tr>
                            <th>Empleado (Email)</th>
                            <th>Empleado (Nombre)</th>
                            <th>Cliente (DNI)</th>
                            <th>Cliente (Nombre)</th>
                            <th>Valoración</th>
                            <th>Comentario</th>
                        </tr>
                        </thead>
                        <tbody>
                        {resenas.map((r) => (
                            <tr key={r.id}>
                                <td>{r.empleado?.email}</td>
                                <td>{r.empleado?.nombre} {r.empleado?.apellido}</td>
                                <td>{r.cliente?.dni}</td>
                                <td>{r.cliente?.nombre} {r.cliente?.apellido}</td>
                                <td>
                                    <span className="star">{'★'.repeat(r.valoracion)}</span>
                                    <span style={{marginLeft: 4}}>({r.valoracion})</span>
                                </td>
                                <td style={{maxWidth: 200, whiteSpace: 'pre-line'}}>{r.comentario}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}