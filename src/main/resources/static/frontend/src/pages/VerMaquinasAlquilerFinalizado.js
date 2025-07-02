import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AlquilarMaquina.css';
import { jwtDecode } from "jwt-decode";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import FormularioResenaMaquina from "../components/FormularioResenaMaquina";
import ListaResenasMaquina from "../components/ListaResenasMaquina";

// === FUNCIÓN UTILITARIA PARA CONSTRUIR EL SRC DE LA IMAGEN ===
function getMachineImageSrc(fotoUrl) {
    if (!fotoUrl) return 'https://via.placeholder.com/300x200?text=Sin+Imagen';
    if (fotoUrl.startsWith('http') || fotoUrl.startsWith('data:')) return fotoUrl;
    // Si es relativa, prepend el host del backend
    return `http://localhost:8080${fotoUrl.startsWith('/') ? '' : '/'}${fotoUrl}`;
}

export default function VerMaquinasAlquilerFinalizado({
                                                          machine,
                                                          onClose,
                                                          alquiler, // El objeto de alquiler para obtener fechas y usuario
                                                          readonly = true // Forzamos sólo visualización, NO reservas
                                                      }) {
    const [diasOcupados, setDiasOcupados] = useState([]);
    const [showResenaPopup, setShowResenaPopup] = useState(false);
    const [showListaResenas, setShowListaResenas] = useState(false);
    const [mensajeServidor, setMensajeServidor] = useState(""); // NUEVO: para mostrar respuesta del servidor

    const token = sessionStorage.getItem("token");
    const rawRoles = React.useMemo(() => getRolesFromJwt(token), [token]);

    // Extraer el email del usuario (cliente) del JWT
    let email = "";
    if (token) {
        try {
            const decoded = jwtDecode(token);
            email = decoded.email || decoded.sub || "";
        } catch (e) {
            email = "";
        }
    }

    useEffect(() => {
        if (!machine) return;
        // Traer días ocupados
        fetch(`http://localhost:8080/api/alquileres/ocupadas?maquina=${encodeURIComponent(machine.nombre)}`)
            .then(res => res.json())
            .then(data => {
                const ocupados = [];
                data.forEach(({ inicio, fin }) => {
                    const [y1, m1, d1] = inicio.split('-').map(Number);
                    const [y2, m2, d2] = fin.split('-').map(Number);
                    let curr = new Date(y1, m1 - 1, d1);
                    const last = new Date(y2, m2 - 1, d2);
                    while (curr <= last) {
                        ocupados.push(new Date(curr));
                        curr.setDate(curr.getDate() + 1);
                    }
                });
                setDiasOcupados(ocupados);
            })
            .catch(console.error);
    }, [machine]);

    // Para marcar días ocupados en el calendario
    const marcarDiasOcupados = date =>
        diasOcupados.some(d => d.toDateString() === date.toDateString())
            ? 'dia-ocupado'
            : undefined;

    // Determinar si mostrar botón "Dejar Reseña"
    const puedeReseniar = rawRoles.includes("ROLE_CLIENTE") && alquiler?.estadoAlquiler?.trim().toUpperCase() === "FINALIZADO";

    // Maneja la respuesta del servidor al crear reseña
    const handleResenaCreada = (respuesta) => {
        setShowResenaPopup(false);
        if (typeof respuesta === "string") {
            setMensajeServidor(respuesta);
        } else if (respuesta && respuesta.mensaje) {
            setMensajeServidor(respuesta.mensaje);
        } else {
            setMensajeServidor("¡Reseña enviada con éxito!");
        }
        // Oculta el mensaje después de unos segundos si quieres:
        setTimeout(() => setMensajeServidor(""), 4000);
    };

    return (
        <div className="reserve-section">
            <h1>Detalles de la Máquina</h1>

            <div className="reserve-content">
                {/* Calendario */}
                <div className="calendar-container">
                    <DatePicker
                        selected={null}
                        excludeDates={diasOcupados}
                        dayClassName={marcarDiasOcupados}
                        inline
                        minDate={new Date()}
                        dateFormat="yyyy-MM-dd"
                        calendarClassName="big-calendar"
                    />
                    <button
                        className="button-secondary"
                        onClick={onClose}
                        style={{ marginTop: '10px' }}
                    >
                        Volver
                    </button>
                </div>

                {/* Detalle de la máquina */}
                <div className="machine-info">
                    <h2>Detalles de la Máquina</h2>
                    <img
                        src={getMachineImageSrc(machine.fotoUrl)}
                        alt={machine.nombre}
                        loading="lazy"
                        className="machine-photo"
                    />
                    <p>
                        <strong>Nombre:</strong> {machine.nombre}
                    </p>
                    <p>
                        <strong>Tipo:</strong>{' '}
                        {Array.isArray(machine.tipo) && machine.tipo.length > 0
                            ? machine.tipo.map(t => t.nombreTipo || t.nombre).join(', ')
                            : 'Sin tipo'}
                    </p>
                    <p>
                        <strong>Precio por día:</strong> ${machine.precioDia || 'No disponible'}
                    </p>
                    <p>
                        <strong>Descripción:</strong> {machine.descripcion || 'No disponible'}
                    </p>

                    {/* Botones de reseña solo para cliente y alquiler finalizado */}
                    {puedeReseniar && (
                        <div style={{ marginTop: 16 }}>
                            <button
                                className="button-secondary"
                                onClick={() => setShowResenaPopup(true)}
                                style={{ marginRight: 8 }}
                            >
                                Dejar Reseña
                            </button>
                            <button
                                className="button-secondary"
                                onClick={() => setShowListaResenas(true)}
                            >
                                Ver Reseñas
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* Mensaje de servidor, visible sobre el fondo, centrado */}
            {mensajeServidor && (
                <div
                    style={{
                        position: "fixed",
                        top: "24px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#ffe5e5",
                        color: "#b30000",
                        border: "2px solid #b30000",
                        borderRadius: "10px",
                        padding: "1rem 2rem",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        zIndex: 2001,
                        boxShadow: "0 2px 8px rgba(179,0,0,0.16)"
                    }}
                >
                    {mensajeServidor}
                </div>
            )}
            {/* Popup para dejar reseña */}
            {showResenaPopup && (
                <FormularioResenaMaquina
                    email={email}
                    nombreMaquina={machine.nombre}
                    onClose={() => setShowResenaPopup(false)}
                    onResenaCreada={handleResenaCreada}
                />
            )}
            {/* Popup para ver reseñas */}
            {showListaResenas && (
                <ListaResenasMaquina
                    nombreMaquina={machine.nombre}
                    visible={showListaResenas}
                    onClose={() => setShowListaResenas(false)}
                />
            )}
        </div>
    );
}