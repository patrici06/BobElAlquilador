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
    const [estadoFiltro, setEstadoFiltro] = useState("todos");
    const [busquedaCliente, setBusquedaCliente] = useState("");
    const [view, setView] = useState('list');
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [selectedAlquiler, setSelectedAlquiler] = useState(null);

    const [showReviewPopup, setShowReviewPopup] = useState(false);
    const [alquilerParaResenia, setAlquilerParaResenia] = useState(null);

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
                    throw new Error(text || "Error desconocido al obtener alquileres.");
                }
            })
            .catch((err) => {
                setError(err.message || "Error desconocido.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token, rawRoles]); // rawRoles agregado como dependencia

    const alquileresFiltrados = alquileres.filter((a) => {
        if (estadoFiltro !== "todos" && a.estadoAlquiler.toLowerCase() !== estadoFiltro.toLowerCase()) return false;
        if (busquedaCliente.trim() !== "") {
            const busq = busquedaCliente.toLowerCase();
            const dni = a.persona?.dni?.toLowerCase() || "";
            const email = a.persona?.email?.toLowerCase() || "";
            if (!dni.includes(busq) && !email.includes(busq)) return false;
        }
        return true;
    });

    const esAdmin = rawRoles.includes("ROLE_PROPIETARIO") || rawRoles.includes("ROLE_EMPLEADO");

    // Cambiado: ahora se selecciona también el alquiler, y redirige según estado
    const handleAlquilerClick = (alquiler) => {
        setSelectedMachine(alquiler.maquina);
        setSelectedAlquiler(alquiler);
        if (alquiler.estadoAlquiler?.trim().toUpperCase() === "FINALIZADO") {
            setView('alquilerFinalizadoVista');
        } else {
            setView('alquilerVista');
        }
    };

    const handleRegistrarDevolucion = (alquiler, e) => {
        e.stopPropagation();

        const { nombre_maquina, fechaInicio, fechaFin } = alquiler.alquilerId;
        const url = `http://localhost:8080/api/alquileres/registrar-devolucion/${nombre_maquina}?inicio=${fechaInicio}&fin=${fechaFin}`;
        fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText || "Error al registrar devolución");
                }
                setAlquileres(prevAlquileres =>
                    prevAlquileres.map(a => {
                        if (a.alquilerId.nombre_maquina === nombre_maquina &&
                            a.alquilerId.fechaInicio === fechaInicio &&
                            a.alquilerId.fechaFin === fechaFin) {
                            return { ...a, estadoAlquiler: "Finalizado" };
                        }
                        return a;
                    })
                );
                setAlquilerParaResenia(alquiler);
                setShowReviewPopup(true);
            })
            .catch((err) => {
                alert('Error al registrar la devolución: ' + err.message);
            });
    }

    const handleRegistrarRetiro = (alquiler, e) => {
        e.stopPropagation();
        alert("Funcionalidad de registrar retiro no implementada aún.");
    }

    const handleEliminarAlquiler = (alquiler, e) => {
        e.stopPropagation();
        const { nombre_maquina, fechaInicio, fechaFin } = alquiler.alquilerId;
        const hoy = new Date();
        const [anio, mes, dia] = fechaInicio.split("-").map(Number);
        const inicioAlquiler = new Date(anio, mes - 1, dia);
        inicioAlquiler.setHours(0, 0, 0, 0);
        if (hoy >= inicioAlquiler) {
            alert("No se puede cancelar el alquiler debido a que se encuentra en curso");
            return;
        }
        const confirmacion = window.confirm("¿Estás seguro de que querés eliminar este alquiler?");
        if (!confirmacion) return;
        const url = `http://localhost:8080/api/alquileres/eliminar/${nombre_maquina}?inicio=${fechaInicio}&fin=${fechaFin}`;
        fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al eliminar el alquiler.");
                setAlquileres((prev) =>
                    prev.filter(
                        (a) =>
                            !(
                                a.alquilerId.nombre_maquina === nombre_maquina &&
                                a.alquilerId.fechaInicio === fechaInicio &&
                                a.alquilerId.fechaFin === fechaFin
                            )
                    )
                );
                alert("Reserva cancelada");
            })
            .catch((err) => {
                alert("No se pudo eliminar el alquiler: " + err.message);
            });
    };

    // Obtener email del empleado desde el token JWT
    let email = "";
    if (token) {
        try {
            const decoded = jwtDecode(token);
            email = decoded.email || decoded.sub || "";
        } catch (e) {
            console.error("Error decodificando token:", e);
        }
    }

    // --- Formulario integrado en el popup ---
    const ReviewPopup = () => {
        const persona = alquilerParaResenia?.persona || {};
        const emailEmpleado = email || "";
        const [dniCliente, setDniCliente] = useState(persona.dni || "");
        const [comentario, setComentario] = useState("");
        const [valoracion, setValoracion] = useState(5);
        const [mensaje, setMensaje] = useState("");
        const [enviando, setEnviando] = useState(false);

        const handleSubmit = (e) => {
            e.preventDefault();
            setEnviando(true);

            const endpoint = 'http://localhost:8080/mis-alquileres/resenia';

            const resenaPayload = {
                dniCliente: dniCliente,
                emailEmpleado: emailEmpleado,
                comentario: comentario,
                valoracion: valoracion
            };

            fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resenaPayload)
            })
                .then(response => {
                    if (!response.ok) throw new Error("No se pudo enviar la reseña");
                    return response.json();
                })
                .then(data => {
                    setMensaje("¡Reseña enviada con éxito!");
                    setTimeout(() => {
                        setShowReviewPopup(false);
                        setAlquilerParaResenia(null);
                    }, 1500);
                })
                .catch(error => {
                    setMensaje("Error enviando la reseña: " + error.message);
                })
                .finally(() => setEnviando(false));
        };

        // Componente de estrellas
        const StarRating = ({ value, onChange }) => {
            const [hover, setHover] = useState(0);
            return (
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                        <span
                            key={star}
                            className={`star ${(star <= (hover || value)) ? "filled" : ""}`}
                            onClick={() => onChange(star)}
                            onMouseOver={() => setHover(star)}
                            onFocus={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            tabIndex={0}
                            role="button"
                            aria-label={`Valorar con ${star} estrella${star > 1 ? "s" : ""}`}
                        >
                            ★
                        </span>
                    ))}
                </div>
            );
        };

        return (
            <div className="review-popup-overlay">
                <div className="review-popup-content">
                    <h3 className="review-popup-title">Reseña de Servicio</h3>
                    <form onSubmit={handleSubmit} className="review-form">
                        <div className="review-form-group">
                            <label>DNI del cliente:</label>
                            <input
                                type="number"
                                value={dniCliente}
                                onChange={(e) => setDniCliente(e.target.value)}
                                required
                                disabled={!!persona.dni}
                            />
                        </div>
                        <div className="review-form-group">
                            <label>Email del empleado:</label>
                            <input
                                type="email"
                                value={emailEmpleado}
                                disabled
                            />
                        </div>
                        <div className="review-form-group">
                            <label>Comentario:</label>
                            <textarea
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                required
                                rows={3}
                            />
                        </div>
                        <div className="review-form-group">
                            <label>Valoración:</label>
                            <StarRating value={valoracion} onChange={setValoracion} />
                        </div>
                        <div className="review-form-actions">
                            <button type="submit" className="button-primary" disabled={enviando}>
                                {enviando ? "Enviando..." : "Enviar reseña"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowReviewPopup(false);
                                    setAlquilerParaResenia(null);
                                }}
                                className="button-secondary"
                                style={{ marginLeft: "10px" }}
                                disabled={enviando}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                    {mensaje && <p className="review-message">{mensaje}</p>}
                </div>
            </div>
        );
    };

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

    if (view === 'list') {
        return (
            <div className="container">
                {showReviewPopup && <ReviewPopup />}
                {esAdmin && <h2 className="title">Alquileres</h2>}
                {rawRoles.includes("ROLE_CLIENTE") && <h2 className="title">Mis Alquileres</h2>}

                {esAdmin && (
                    <div className="filters" style={{ marginBottom: "1rem" }}>
                        <label>
                            Estado:
                            <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
                                <option value="todos">Todos</option>
                                <option value="PENDIENTE">Pendiente</option>
                                <option value="ACTIVO">Activo</option>
                                <option value="FINALIZADO">Finalizado</option>
                                <option value="Cancelado">Cancelado</option>
                                <option value="CanceladoInvoluntario">Cancelado Involuntario</option>
                            </select>
                        </label>

                        <label style={{ marginLeft: "1rem" }}>
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
                    <p className="noData">No hay alquileres.</p>
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
                                        <td>
                                            <button
                                                className="button-primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEliminarAlquiler(a, e);
                                                }}
                                                style={{ marginRight: "8px" }}
                                            >
                                                Cancelar Alquiler
                                            </button>
                                            {a.estadoAlquiler.toLocaleUpperCase() === "PENDIENTE" && (
                                                <button
                                                    className="button-secondary"
                                                    onClick={(e) => handleRegistrarRetiro(a, e)}
                                                    style={{ marginRight: "8px" }}
                                                >
                                                    Registrar Retiro
                                                </button>
                                            )}
                                            {a.estadoAlquiler.toLocaleUpperCase() === "ACTIVO" && (
                                                <button
                                                    className="button-primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRegistrarDevolucion(a, e);
                                                    }}
                                                >
                                                    Registrar Devolución
                                                </button>
                                            )}
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

    return null;
}

export default MisAlquileres;