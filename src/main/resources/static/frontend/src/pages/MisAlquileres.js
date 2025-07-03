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
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState(""); // 'success' o 'error'

    const [view, setView] = useState('list');
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [selectedAlquiler, setSelectedAlquiler] = useState(null);

    const [showReviewPopup, setShowReviewPopup] = useState(false);
    const [alquilerParaResenia, setAlquilerParaResenia] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [alquilerAEliminar, setAlquilerAEliminar] = useState(null);

    const [tab, setTab] = useState('alquileres'); // 'alquileres' o 'reservas'

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

    // Solo mostrar filtros si es propietario o empleado
    const esAdmin = rawRoles.includes("ROLE_PROPIETARIO") || rawRoles.includes("ROLE_EMPLEADO");
    const esCliente = rawRoles.includes("ROLE_CLIENTE");

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

    // Nueva función para abrir el modal
    const abrirModalCancelar = (alquiler) => {
        setAlquilerAEliminar(alquiler);
        setModalOpen(true);
    };
    // Nueva función para cerrar el modal
    const cerrarModalCancelar = () => {
        setAlquilerAEliminar(null);
        setModalOpen(false);
    };
    // Nueva función para confirmar la cancelación
    const confirmarCancelarAlquiler = async () => {
        if (!alquilerAEliminar) return;
        setMensaje("");
        setTipoMensaje("");
        try {
            const a = alquilerAEliminar;
            const url = `http://localhost:8080/api/alquileres/cancelar-cliente/${a.alquilerId.nombre_maquina}?inicio=${a.alquilerId.fechaInicio}&fin=${a.alquilerId.fechaFin}`;
            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.mensaje || "Error al cancelar el alquiler.");
            setAlquileres((prev) => prev.filter((al) => al.alquilerId.nombre_maquina !== a.alquilerId.nombre_maquina || al.alquilerId.fechaInicio !== a.alquilerId.fechaInicio || al.alquilerId.fechaFin !== a.alquilerId.fechaFin));
            setMensaje(`${data.mensaje}. Porcentaje de reintegro: ${data.porcentajeReintegro}%`);
            setTipoMensaje("success");
        } catch (err) {
            setMensaje(err.message);
            setTipoMensaje("error");
        } finally {
            cerrarModalCancelar();
        }
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
                {/* Pestañas SOLO para cliente */}
                {esCliente && (
                    <div style={{ display: 'flex', gap: '1em', marginBottom: '1.5em', justifyContent: 'center' }}>
                        <button
                            className={tab === 'alquileres' ? 'button-primary' : 'button-secondary'}
                            style={{ minWidth: 140 }}
                            onClick={() => setTab('alquileres')}
                        >
                            Mis alquileres
                        </button>
                        <button
                            className={tab === 'reservas' ? 'button-primary' : 'button-secondary'}
                            style={{ minWidth: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => setTab('reservas')}
                        >
                            Pendientes
                        </button>
                    </div>
                )}
                {/* Título dinámico según la pestaña SOLO para cliente */}
                {esCliente && <h2 className="title">{tab === 'alquileres' ? 'Mis Alquileres' : 'Mis Reservas'}</h2>}
                {/* Para admin, mostrar el título original */}
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

                {mensaje && (
                    <div className={tipoMensaje === "success" ? "mensaje-exito" : "mensaje-error"} style={{marginBottom: "1rem"}}>
                        <div>
                            {tipoMensaje === "success" ? (
                                <>
                                    <strong>¡Cancelación realizada con éxito!</strong><br />
                                    <span style={{fontWeight: 500}}>Porcentaje de reintegro:&nbsp;
                                        <span style={{color: '#007e33', fontWeight: 700, fontSize: '1.1em'}}>
                                            {mensaje.split('Porcentaje de reintegro:')[1]}
                                        </span>
                                    </span>
                                    <br />
                                    <span style={{fontWeight: 400, color: '#007e33'}}>Se ha enviado un mail confirmando la cancelación.</span>
                                </>
                            ) : (
                                <>{mensaje}</>
                            )}
                        </div>
                    </div>
                )}

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
                            {/* Columna para el botón de cancelar */}
                            {rawRoles.includes("ROLE_CLIENTE") && <th></th>}
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
                        {alquileresFiltrados.map((a) => {
                            const hoy = new Date();
                            const [anio, mes, dia] = a.alquilerId?.fechaInicio.split("-").map(Number);
                            const inicioAlquiler = new Date(anio, mes - 1, dia);
                            inicioAlquiler.setHours(0,0,0,0);
                            const puedeCancelarCliente = rawRoles.includes("ROLE_CLIENTE") && hoy < inicioAlquiler && a.estadoAlquiler === "Pendiente";
                            return (
                                <tr key={a.id}
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
                                                        handleEliminarAlquiler(a);
                                                    }}
                                                >
                                                    Cancelar Alquiler
                                                </button>
                                            </td>
                                        </>
                                    )}
                                    {/* Botón solo para cliente y solo si puede cancelar */}
                                    {rawRoles.includes("ROLE_CLIENTE") && (
                                        <td>
                                            {puedeCancelarCliente && (
                                                <button
                                                    className="button-primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        abrirModalCancelar(a);
                                                    }}
                                                >
                                                    Cancelar Alquiler
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}

                {/* Modal de confirmación */}
                {modalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{padding: 0, borderRadius: '12px', boxShadow: '0 4px 24px rgba(179,0,0,0.10)'}}>
                            <div className="mensaje-error" style={{margin: 0, borderRadius: '12px 12px 0 0', borderLeft: 'none', borderTop: '6px solid #e53935', fontSize: '1.15rem', justifyContent: 'center', textAlign: 'center'}}>
                                <div>
                                    <strong>¿Estás seguro de que querés cancelar este alquiler?</strong>
                                    <div style={{fontWeight: 400, fontSize: '1rem', marginTop: '0.5em'}}>Esta acción no se puede deshacer.</div>
                                    {alquilerAEliminar && (alquilerAEliminar.porcentajeReintegro || (alquilerAEliminar.maquina && alquilerAEliminar.maquina.porcentajeReembolso)) && (
                                        <>
                                            <div style={{marginTop: '1em', color: '#b00', fontWeight: 600}}>
                                                Porcentaje de cancelación: {alquilerAEliminar.porcentajeReintegro ? alquilerAEliminar.porcentajeReintegro + '%' : (alquilerAEliminar.maquina.porcentajeReembolso + '%')}
                                            </div>
                                            <div style={{marginTop: '0.5em', color: '#b00', fontWeight: 600}}>
                                                Monto a reintegrar: {
                                                    (() => {
                                                        const precio = alquilerAEliminar.precioTotal;
                                                        const porcentaje = alquilerAEliminar.porcentajeReintegro ?? (alquilerAEliminar.maquina ? alquilerAEliminar.maquina.porcentajeReembolso : 0);
                                                        if (precio && porcentaje) {
                                                            const monto = precio * porcentaje / 100;
                                                            return monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
                                                        }
                                                        return '-';
                                                    })()
                                                }
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div style={{marginTop: '1.5em', display: 'flex', justifyContent: 'center', gap: '1em', padding: '0 0 1.5em 0'}}>
                                <button className="button-primary" onClick={confirmarCancelarAlquiler}>Sí, cancelar</button>
                                <button className="button-secondary" onClick={cerrarModalCancelar}>No, volver</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return null;
}

export default MisAlquileres;