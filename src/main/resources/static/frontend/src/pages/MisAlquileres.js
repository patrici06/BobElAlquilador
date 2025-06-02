import React, { useEffect, useState } from "react";
import "./MisAlquileres.css";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import MachineAvailability from "./VerMaquina";

function MisAlquileres() {
    const [alquileres, setAlquileres] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [estadoFiltro, setEstadoFiltro] = useState("todos");
    const [busquedaCliente, setBusquedaCliente] = useState("");

    const [view, setView] = useState('list');
    const [selectedMachine, setSelectedMachine] = useState(null);

    const token = sessionStorage.getItem("token");
    const rawRoles = React.useMemo(() => getRolesFromJwt(token), [token]);

    useEffect(() => {
        if (!token) {
            setError("No estás autenticado.");
            setLoading(false);
            return;
        }

        const endpoint =
            rawRoles.includes("ROLE_PROPIETARIO") || rawRoles.includes("ROLE_EMPLEADO")
                ? "http://localhost:8080/api/alquileres/todos-los-alquileres"
                : "http://localhost:8080/api/alquileres/mis-alquileres";

        fetch(endpoint, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    if (!res.ok) {
                        throw new Error(data.message || "Error al obtener alquileres.");
                    }
                    setAlquileres(data);
                    setError("");
                } catch (e) {
                    // No es JSON válido, puede ser texto plano o HTML con error
                    throw new Error(text || "Error desconocido al obtener alquileres.");
                }
            })
            .catch((err) => {
                setError(err.message || "Error desconocido.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token]);

    // Filtrado de alquileres basado en estado y búsqueda (dni o email)
    const alquileresFiltrados = alquileres.filter((a) => {
        // filtro estado
        if (estadoFiltro !== "todos" && a.estadoAlquiler.toLowerCase() !== estadoFiltro.toLowerCase()) return false;

        // filtro búsqueda cliente (dni o email)
        if (busquedaCliente.trim() !== "") {
            const busq = busquedaCliente.toLowerCase();
            const dni = a.persona?.dni?.toLowerCase() || "";
            const email = a.persona?.email?.toLowerCase() || "";
            if (!dni.includes(busq) && !email.includes(busq)) return false;
        }

        return true;
    });

    // Solo mostrar filtros si es propietario o empleado
    const esAdmin = rawRoles.includes("ROLE_PROPIETARIO") || rawRoles.includes("ROLE_EMPLEADO");

    // Maneja el click en un alquiler: setea la máquina y cambia vista
    const handleAlquilerClick = (alquiler) => {
        console.log(alquiler);
        setSelectedMachine(alquiler.maquina); // Ajusta según cómo pases la máquina
        setView('alquilerVista');
    };

    // Si estás en la vista de alquilerVista, renderiza VerMaquina
    if (view === 'alquilerVista' && selectedMachine) {
        return (
            <MachineAvailability
                machine={selectedMachine}
                onClose={() => setView('list')}
                onReserveSuccess={() => setView('processing')}
                readonly={true}
            />
        );
    }

    if (view === 'list') {
        return (
            <div className="container">
                {esAdmin && <h2 className="title">Alquileres</h2>}
                {rawRoles.includes("ROLE_CLIENTE") && <h2 className="title">Mis Alquileres</h2>}

                {esAdmin && (
                    <div className="filters" style={{marginBottom: "1rem"}}>
                        <label>
                            Estado:
                            <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
                                <option value="todos">Todos</option>
                                <option value="PENDIENTE">Pendiente</option>
                                <option value="ACTIVO">Activo</option>
                                <option value="FINALIZADO">Finalizado</option>
                                <option value="CANCELADO">Cancelado</option>
                                {/* Agrega más estados si tu backend tiene otros */}
                            </select>
                        </label>

                        <label style={{marginLeft: "1rem"}}>
                            Buscar cliente (DNI o Email):
                            <input
                                type="text"
                                value={busquedaCliente}
                                onChange={(e) => setBusquedaCliente(e.target.value)}
                                placeholder="Escribe DNI o Email"
                            />
                        </label>
                    </div>
                )}

                {loading && <p className="loading">Cargando...</p>}

                {error && <p className="error">{error}</p>}

                {!loading && !error && alquileresFiltrados.length === 0 && (
                    <p className="noData">No hay alquileres activos o pendientes.</p>
                )}

                {!loading && !error && alquileresFiltrados.length > 0 && (
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Máquina</th>
                            <th>Inicio</th>
                            <th>Fin</th>
                            <th>Estado</th>
                            <th>Precio</th>
                            {esAdmin && (
                                <>
                                    <th>Nombre</th>
                                    <th>Dni</th>
                                    <th>Email</th>
                                </>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {alquileresFiltrados.map((a) => (
                            <tr key={a.id}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleAlquilerClick(a)}
                            >
                                <td>{a.alquilerId?.nombre_maquina || "Desconocida"}</td>
                                <td>{new Date(a.alquilerId?.fechaInicio).toLocaleDateString()}</td>
                                <td>{new Date(a.alquilerId?.fechaFin).toLocaleDateString()}</td>
                                <td>{a.estadoAlquiler}</td>
                                <td>
                                    {a.precioTotal.toLocaleString("es-AR", {
                                        style: "currency",
                                        currency: "ARS",
                                    })}
                                </td>
                                {esAdmin && (
                                    <>
                                        <td>{a.persona?.nombre || "-"}</td>
                                        <td>{a.persona?.dni || "-"}</td>
                                        <td>{a.persona?.email || "-"}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }
}

export default MisAlquileres;
