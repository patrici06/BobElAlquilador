import React, { useEffect, useState } from "react";

// Componente para la fila de cada empleado
function EmpleadoRow({ email, nombre, cantidad }) {
    return (
        <tr>
            <td>{email}</td>
            <td>{nombre}</td>
            <td style={{ textAlign: "center" }}>{cantidad}</td>
        </tr>
    );
}

export default function EmpleadosCantidadAlquileres() {
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/propietario/empleados-cantidad-alquileres-efectuado", {
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
            .then(data => setEmpleados(data))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={{
            maxWidth: 700,
            margin: "2em auto",
            background: "#ffffff",
            borderRadius: 12,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            padding: "2em"
        }}>
            <h2 style={{ marginBottom: "1em" }}>Cantidad de Alquileres por Empleado</h2>
            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: "#b00", fontWeight: "bold" }}>{error}</p>}
            {!loading && !error && empleados.length === 0 && (
                <p>No hay empleados con alquileres efectuados.</p>
            )}
            {!loading && !error && empleados.length > 0 && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th style={{ textAlign: "left", padding: "0.75em 1em", background: "#f9fafb" }}>Email</th>
                        <th style={{ textAlign: "left", padding: "0.75em 1em", background: "#f9fafb" }}>Nombre</th>
                        <th style={{ textAlign: "center", padding: "0.75em 1em", background: "#f9fafb" }}>Cantidad de alquileres</th>
                    </tr>
                    </thead>
                    <tbody>
                    {empleados.map((empleado, idx) => (
                        <EmpleadoRow
                            key={empleado.email || idx}
                            email={empleado.email}
                            nombre={empleado.nombre}
                            cantidad={empleado.cantAlquileres}
                        />
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}