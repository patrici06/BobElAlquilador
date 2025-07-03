import React, { useEffect, useState } from "react";
import "./MisAlquileres.css";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import MachineAvailability from "./VerMaquina";
import VerMaquinasAlquilerFinalizado from "./VerMaquinasAlquilerFinalizado";
import { jwtDecode } from "jwt-decode";

function MisAlquileres() {
    const [alquileres, setAlquileres] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("todos"); // "todos" | "pendientes"
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState(""); // 'success' o 'error'
    const [view, setView] = useState('list');
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [selectedAlquiler, setSelectedAlquiler] = useState(null);
    const [showReviewPopup, setShowReviewPopup] = useState(false);
    const [alquilerParaResenia, setAlquilerParaResenia] = useState(null);

    const token = sessionStorage.getItem("token");
    const rawRoles = React.useMemo(() => getRolesFromJwt(token), [token]);
    const esAdmin = rawRoles.includes("ROLE_PROPIETARIO") || rawRoles.includes("ROLE_EMPLEADO");
    const esCliente = rawRoles.includes("ROLE_CLIENTE");

    // Obtener email del empleado desde el token JWT
    let email = "";
    if (token) {
        try {
            const decoded = jwtDecode(token);
            email = decoded.email || decoded.sub || "";
        } catch (e) { }
    }

    // SOLO UNA LISTA: siempre traigo todos los alquileres del usuario (no reservas aparte)
    useEffect(() => {
        if (!token) {
            setError("No estás autenticado.");
            setLoading(false);
            return;
        }

        // Siempre traigo los alquileres del usuario (pueden ser reservas y alquileres, según backend).
        const endpoint =
            esAdmin
                ? "http://localhost:8080/api/alquileres/todos-los-alquileres"
                : "http://localhost:8080/api/alquileres/mis-alquileres";

        fetch(endpoint, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    if (!res.ok) throw new Error(data.message || "Error al obtener alquileres.");
                    // Filtrar alquileres por el id compuesto para evitar repetidos
                    const uniques = {};
                    data.forEach(alq => {
                        const key = [
                            alq.alquilerId?.nombre_maquina,
                            alq.alquilerId?.fechaInicio,
                            alq.alquilerId?.fechaFin
                        ].join("_");
                        uniques[key] = alq; // sobrescribe repetidos
                    });
                    setAlquileres(Object.values(uniques));
                    setError("");
                } catch (e) {
                    throw new Error(text || "Error desconocido al obtener alquileres.");
                }
            })
            .catch((err) => setError(err.message || "Error desconocido."))
            .finally(() => setLoading(false));
    }, [token, esAdmin]);

    // FILTRADO POR BOTÓN (todos | pendientes)
    const alquileresFiltrados = alquileres.filter(a => {
        if (filtro === "pendientes") {
            return String(a.estadoAlquiler || "").toLowerCase() === "pendiente";
        }
        return true;
    });

    // VISTAS: ver detalle de alquiler y alquiler finalizado
    const handleAlquilerClick = (alquiler) => {
        setSelectedMachine(alquiler.maquina);
        setSelectedAlquiler(alquiler);
        if (alquiler.estadoAlquiler?.trim().toUpperCase() === "FINALIZADO") {
            setView('alquilerFinalizadoVista');
        } else {
            setView('alquilerVista');
        }
    };

    // Aquí sigue tu lógica de devolución, cancelación, etc. (no repetido aquí por brevedad...)

    // Review popup (igual que tu código)
    const ReviewPopup = () => { /* ... igual ... */ return null; /* omitir para brevedad */ };

    // VISTAS
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
    if (view === 'alquilerFinalizadoVista' && selectedMachine && selectedAlquiler) {
        return (
            <VerMaquinasAlquilerFinalizado
                machine={selectedMachine}
                alquiler={selectedAlquiler}
                onClose={() => setView('list')}
                readonly={true}
            />
        );
    }

    // LISTADO ÚNICO CON FILTRO POR BOTÓN ("Mis alquileres" y "Pendientes")
    return (
        <div className="container">
            {showReviewPopup && <ReviewPopup />}
            {/* Botones para filtrar */}
            <div style={{ display: 'flex', gap: '1em', marginBottom: '1.5em', justifyContent: 'center' }}>
                <button
                    className={filtro === 'todos' ? 'button-primary' : 'button-secondary'}
                    style={{ minWidth: 140 }}
                    onClick={() => setFiltro('todos')}
                >
                    Mis alquileres
                </button>
                <button
                    className={filtro === 'pendientes' ? 'button-primary' : 'button-secondary'}
                    style={{ minWidth: 140 }}
                    onClick={() => setFiltro('pendientes')}
                >
                    Pendientes
                </button>
            </div>
            <h2 className="title">
                {filtro === "todos" ? "Mis Alquileres" : "Pendientes"}
            </h2>
            {loading && <p className="loading">Cargando...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && alquileresFiltrados.length === 0 && (
                <p className="noData">
                    {filtro === "todos"
                        ? "No tienes alquileres registrados."
                        : "No tienes alquileres pendientes."}
                </p>
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
                                <th>Acciones</th>
                            </>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {alquileresFiltrados.map((a) => (
                        <tr key={`${a.alquilerId?.nombre_maquina}_${a.alquilerId?.fechaInicio}_${a.alquilerId?.fechaFin}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleAlquilerClick(a)}
                        >
                            <td>{a.alquilerId?.nombre_maquina || "Desconocida"}</td>
                            <td>{new Date(a.alquilerId?.fechaInicio + "T00:00:00").toLocaleDateString()}</td>
                            <td>{new Date(a.alquilerId?.fechaFin + "T00:00:00").toLocaleDateString()}</td>
                            <td>{a.estadoAlquiler}</td>
                            <td>
                                {a.precioTotal?.toLocaleString("es-AR", {
                                    style: "currency",
                                    currency: "ARS",
                                })}
                            </td>
                            {esAdmin && (
                                <>
                                    <td>{a.persona?.nombre || "-"}</td>
                                    <td>{a.persona?.dni || "-"}</td>
                                    <td>{a.persona?.email || "-"}</td>
                                    <td>
                                        {/* Acciones (cancelar, registrar retiro, devolución) aquí si aplica */}
                                    </td>
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

export default MisAlquileres;