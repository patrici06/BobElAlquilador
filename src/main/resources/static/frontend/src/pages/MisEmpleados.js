import React, { useEffect, useState } from "react";
import "./EmpleadosValoracion.css";

function StarRating({ value, max = 5 }) {
    const filledStars = Math.round(value);
    return (
        <span>
            {Array.from({ length: max }).map((_, i) =>
                i < filledStars ? (
                    <span key={i} style={{ color: "#ac1010", fontSize: "1.5em" }}>★</span>
                ) : (
                    <span key={i} style={{ color: "#ccc", fontSize: "1.5em" }}>☆</span>
                )
            )}
        </span>
    );
}

export default function MisEmpleados() {
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/propietario/empleados-valoracion", {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token") || ""}`,
                "Content-Type": "application/json"
            }
        })
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || "Error al obtener valoraciones.");
                }
                return res.json();
            })
            .then(data => setEmpleados(data))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="empleados-valoracion-container">
            <h2 style={{ marginBottom: "1em" }}>Ranking de Empleados por Valoración</h2>
            {loading && <p>Cargando...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && empleados.length === 0 && (
                <p>No hay empleados con valoraciones.</p>
            )}
            {!loading && !error && empleados.length > 0 && (
                <table className="empleados-valoracion-table">
                    <thead>
                    <tr>
                        <th>Empleado (Email)</th>
                        <th>Promedio</th>
                    </tr>
                    </thead>
                    <tbody>
                    {empleados.map(({ email, promedio }, idx) => (
                        <tr key={email}>
                            <td>{email}</td>
                            <td>
                                <StarRating value={promedio} />
                                <span style={{ marginLeft: 8, color: "#222", fontWeight: 500 }}>
                                        {Number(promedio).toFixed(2)}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}