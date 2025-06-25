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
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState(""); // 'success' o 'error'

    const [view, setView] = useState('list');
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [alquilerAEliminar, setAlquilerAEliminar] = useState(null);

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
        // Filtrar eliminados/cancelados involuntarios
        if (a.estadoAlquiler === "CanceladoInvoluntario" || (a.estado && a.estado.toLowerCase() === "eliminado")) return false;
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

    const handleEliminarAlquiler = (alquiler) => {
        const { nombre_maquina, fechaInicio, fechaFin } = alquiler.alquilerId;

        // Reglas de negocio: sólo cancelar si HOY es anterior a fecha de inicio
        const hoy = new Date();
        // Limpiamos la hora para comparar sólo fechas
        const [anio, mes, dia] = fechaInicio.split("-").map(Number);
        const inicioAlquiler = new Date(anio, mes - 1, dia);
        inicioAlquiler.setHours(0,0,0,0);

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
                // Eliminamos del estado
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
                                <option value="Cancelado">Cancelado</option>
                                <option value="CanceladoInvoluntario">Cancelado Involuntario</option>
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
                                </>
                            ) : (
                                <>{mensaje}</>
                            )}
                        </div>
                    </div>
                )}

                {!loading && !error && alquileresFiltrados.length === 0 && (
                    <p className="noData">No hay alquileres registrados</p>
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
                            {/* Columna para el botón de cancelar */}
                            {rawRoles.includes("ROLE_CLIENTE") && <th></th>}
                        </tr>
                        </thead>
                        <tbody>
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
}

export default MisAlquileres;
