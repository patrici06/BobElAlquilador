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
    const [filtro, setFiltro] = useState("todos");
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");
    const [view, setView] = useState('list');
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [selectedAlquiler, setSelectedAlquiler] = useState(null);
    const [showReviewPopup, setShowReviewPopup] = useState(false);
    const [alquilerParaResenia, setAlquilerParaResenia] = useState(null);
    const [tipos, setTipos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [selectedTipo, setSelectedTipo] = useState('');
    const [selectedMarca, setSelectedMarca] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [alquilerAEliminar, setAlquilerAEliminar] = useState(null);

    const token = sessionStorage.getItem("token");
    const rawRoles = React.useMemo(() => getRolesFromJwt(token), [token]);
    const esAdmin = rawRoles.includes("ROLE_PROPIETARIO") || rawRoles.includes("ROLE_EMPLEADO");
    const esCliente = rawRoles.includes("ROLE_CLIENTE");

    let email = "";
    if (token) {
        try {
            const decoded = jwtDecode(token);
            email = decoded.email || decoded.sub || "";
        } catch (e) { }
    }

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        fetch("http://localhost:8080/api/tipos", { headers })
            .then(res => res.ok ? res.json() : [])
            .then(setTipos)
            .catch(() => setTipos([]));

        fetch("http://localhost:8080/api/marcas", { headers })
            .then(res => res.ok ? res.json() : [])
            .then(setMarcas)
            .catch(() => setMarcas([]));
    }, []);

    useEffect(() => {
        if (!token) {
            setError("No estás autenticado.");
            setLoading(false);
            return;
        }

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
                    const uniques = {};
                    data.forEach(alq => {
                        const key = [
                            alq.alquilerId?.nombre_maquina,
                            alq.alquilerId?.fechaInicio,
                            alq.alquilerId?.fechaFin
                        ].join("_");
                        uniques[key] = alq;
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

    const alquileresFiltrados = alquileres.filter(a => {
        if (filtro === "pendientes" && String(a.estadoAlquiler || "").toLowerCase() !== "pendiente") return false;

        let tipoMatch = true, marcaMatch = true, searchMatch = true;
        const m = a.maquina || {};
        if (selectedTipo) {
            const tipoArray = Array.isArray(m.tipo) ? m.tipo : [];
            tipoMatch = tipoArray.some(t => String(t.id) === String(selectedTipo));
        }
        if (selectedMarca) {
            if (typeof m.marca === "object" && m.marca !== null) {
                marcaMatch = String(m.marca.id) === String(selectedMarca);
            } else {
                marcaMatch = String(m.marca) === String(selectedMarca);
            }
        }
        const term = searchTerm.trim().toLowerCase();
        if (term !== "") {
            const nombre = (m.nombre || '').toLowerCase();
            const descripcion = (m.descripcion || '').toLowerCase();
            const dniAlquiler = String(a.persona?.dni || "").toLowerCase();
            searchMatch =
                nombre.includes(term) ||
                descripcion.includes(term) ||
                dniAlquiler.includes(term);
        }

        return tipoMatch && marcaMatch && searchMatch;
    });

    const handleAlquilerClick = (alquiler) => {
        setSelectedMachine(alquiler.maquina);
        setSelectedAlquiler(alquiler);
        if (alquiler.estadoAlquiler?.trim().toUpperCase() === "FINALIZADO") {
            setView('alquilerFinalizadoVista');
        } else {
            setView('alquilerVista');
        }
    };

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
        if (String(alquiler.estadoAlquiler || "").toLowerCase() !== "pendiente") {
            alert("Solo se pueden cancelar alquileres en estado pendiente.");
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

        const { nombre_maquina, fechaInicio, fechaFin } = alquiler.alquilerId;

        fetch("http://localhost:8080/api/alquileres/registrar-retiro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                nombreMaquina: nombre_maquina,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
            }),
        })
            .then(async (res) => {
                const mensaje = await res.text();
                if (!res.ok) throw new Error(mensaje);
                alert(mensaje);
            })
            .catch((err) => {
                alert("Error al registrar el retiro: " + err.message);
            });
    };

    const abrirModalCancelar = (alquiler) => {
        setAlquilerAEliminar(alquiler);
        setModalOpen(true);
    };

    const cerrarModalCancelar = () => {
        setAlquilerAEliminar(null);
        setModalOpen(false);
    };

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

    const ReviewPopup = () => { return null; };

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

    return (
        <div className="container">
            {showReviewPopup && <ReviewPopup />}
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
            <div className="search-bar-container">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    style={{ flex: 2 }}
                />
                <select
                    value={selectedTipo}
                    onChange={e => setSelectedTipo(e.target.value)}
                    className="search-select"
                    style={{ flex: 1 }}
                >
                    <option value="">Todos los Tipos</option>
                    {tipos.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>
                            {tipo.nombreTipo || tipo.nombre}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedMarca}
                    onChange={e => setSelectedMarca(e.target.value)}
                    className="search-select"
                    style={{ flex: 1 }}
                >
                    <option value="">Todas las Marcas</option>
                    {marcas.map(marca => (
                        <option key={marca.id} value={marca.id}>
                            {marca.nombre}
                        </option>
                    ))}
                </select>
            </div>
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
                        {esCliente && <th></th>}
                    </tr>
                    </thead>
                    <tbody>
                    {alquileresFiltrados.map((a) => {
                        let puedeCancelarCliente = false;
                        if (esCliente && a.alquilerId && a.estadoAlquiler) {
                            const hoy = new Date();
                            const [anio, mes, dia] = a.alquilerId.fechaInicio.split("-").map(Number);
                            const inicioAlquiler = new Date(anio, mes - 1, dia);
                            inicioAlquiler.setHours(0,0,0,0);
                            puedeCancelarCliente = hoy < inicioAlquiler && String(a.estadoAlquiler).toLowerCase() === "pendiente";
                        }
                        let puedeRegistrarRetiro = false;
                        if (a.alquilerId && a.estadoAlquiler) {
                            // Solo mostrar si es pendiente y fecha actual >= fecha inicio
                            if (String(a.estadoAlquiler).toLowerCase() === "pendiente") {
                                const hoy = new Date();
                                const [anio, mes, dia] = a.alquilerId.fechaInicio.split("-").map(Number);
                                const inicioAlquiler = new Date(anio, mes - 1, dia);
                                inicioAlquiler.setHours(0,0,0,0);
                                hoy.setHours(0,0,0,0);
                                puedeRegistrarRetiro = hoy >= inicioAlquiler;
                            }
                        }
                        let accionesAdmin = [];
                        if (esAdmin) {
                            if (String(a.estadoAlquiler || "").toLowerCase() === "pendiente") {
                                accionesAdmin.push("cancelar");
                                if (puedeRegistrarRetiro) accionesAdmin.push("retiro");
                            }
                            if (String(a.estadoAlquiler || "").toLowerCase() === "activo") {
                                accionesAdmin.push("devolucion");
                            }
                        }
                        return (
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
                                            {accionesAdmin.length === 0 ? (
                                                <span>-</span>
                                            ) : (
                                                <>
                                                    {accionesAdmin.includes("cancelar") && (
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
                                                    )}
                                                    {accionesAdmin.includes("retiro") && (
                                                        <button
                                                            className="button-secondary"
                                                            onClick={(e) => handleRegistrarRetiro(a, e)}
                                                            style={{ marginRight: "8px" }}
                                                        >
                                                            Registrar Retiro
                                                        </button>
                                                    )}
                                                    {accionesAdmin.includes("devolucion") && (
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
                                                </>
                                            )}
                                        </td>
                                    </>
                                )}
                                {esCliente && (
                                    <td>
                                        {puedeCancelarCliente && (
                                            <button
                                                className="button-primary"
                                                onClick={e => {
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

export default MisAlquileres;