import React, { useEffect, useState } from "react";
import "./MisAlquileres.css";

function MisAlquileres() {
    const [alquileres, setAlquileres] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            setError("No estás autenticado.");
            setLoading(false);
            return;
        }

        fetch("http://localhost:8080/api/alquileres/mis-alquileres", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || "Error al obtener alquileres.");
                }
                setAlquileres(data);
                setError("");
            })
            .catch((err) => {
                setError(err.message || "Error desconocido.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="container">
            <h2 className="title">Mis Alquileres</h2>

            {loading && <p className="loading">Cargando...</p>}

            {error && <p className="error">{error}</p>}

            {!loading && !error && alquileres.length === 0 && (
                <p className="noData">No tenés alquileres activos o pendientes.</p>
            )}

            {!loading && !error && alquileres.length > 0 && (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Máquina</th>
                            <th>Inicio</th>
                            <th>Fin</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alquileres.map((a) => (
                            <tr key={a.id}>
                                <td>{a.alquilerId?.nombre_maquina || "Desconocida"}</td>
                                <td>{new Date(a.alquilerId?.fechaInicio).toLocaleDateString()}</td>
                                <td>{new Date(a.alquilerId?.fechaFin).toLocaleDateString()}</td>
                                <td>{a.estado}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default MisAlquileres;
