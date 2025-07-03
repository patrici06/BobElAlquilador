import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AlquilarMaquina.css'
import { jwtDecode } from "jwt-decode";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import { crearPreferenciaMP } from "../utils/crearPreferenciaMP";
import ListaResenasMaquina from '../components/ListaResenasMaquina'; // Importa tu componente de reseñas

// === FUNCIÓN UTILITARIA PARA CONSTRUIR EL SRC DE LA IMAGEN ===
function getMachineImageSrc(fotoUrl) {
    if (!fotoUrl) return 'https://via.placeholder.com/300x200?text=Sin+Imagen';
    if (fotoUrl.startsWith('http') || fotoUrl.startsWith('data:')) return fotoUrl;
    // Si es relativa, prepend el host del backend
    return `http://localhost:8080${fotoUrl.startsWith('/') ? '' : '/'}${fotoUrl}`;
}

export default function MachineAvailability({ machine, onClose, onReserveSuccess, readonly = false }) {
    const [diasOcupados, setDiasOcupados] = useState([]);
    const [inicio, setInicio] = useState(null);
    const [fin, setFin] = useState(null);
    const [error, setError] = useState('');
    const [view, setView] = useState('form');
    const token = sessionStorage.getItem("token");
    const raw = React.useMemo(() => getRolesFromJwt(token), [token]);
    const [showResenas, setShowResenas] = useState(false); // Estado para mostrar/ocultar reseñas

    // Extraer el email del JWT si existe
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

        // 1) Traer días ocupados
        fetch(`http://localhost:8080/api/alquileres/ocupadas?maquina=${encodeURIComponent(machine.nombre)}`)
            .then(res => res.json())
            .then(data => {
                // data = [{inicio: "2025-06-01", fin: "2025-06-05"}, ...]
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

    // 2) Función para marcar cada día ocupado en el calendario
    const marcarDiasOcupados = date =>
        diasOcupados.some(d => d.toDateString() === date.toDateString())
            ? 'dia-ocupado'
            : undefined;

    if (!machine) {
        return null;
    }

    const handlePagoYRedireccion = async () => {
        console.log("Iniciando proceso de pago");
        setError('');
        if (!inicio || !fin) {
            setError('Por favor selecciona ambas fechas.');
            return;
        }
        if (!email) {
            setError('No se pudo obtener el email del usuario.');
            return;
        }

        try {
            const inicioStr = inicio.toISOString().slice(0, 10);
            const finStr = fin.toISOString().slice(0, 10);
            const dniCliente = sessionStorage.getItem("dni");
            const msPorDia = 1000 * 60 * 60 * 24;
            const dias = Math.ceil((fin - inicio) / msPorDia) + 1;
            const precioTotal = machine.precioDia * dias;

            const initPoint = await crearPreferenciaMP({
                id: machine.id,
                nombre: machine.nombre,
                descripcion: machine.descripcion,
                imagenUrl: machine.fotoUrl,
                precio: precioTotal || 10000, // Usa precio por día
                inicio: inicioStr,
                fin: finStr,
                dniCliente
            });

            localStorage.setItem("pagoPendiente", "true");
            localStorage.setItem("inicio", inicioStr);
            localStorage.setItem("fin", finStr);
            localStorage.setItem("nombreMaquina", machine.nombre);

            // Redirigir al checkout de MP
            console.log("Redirigiendo a:", initPoint);
            window.location.href = initPoint;

        } catch (err) {
            console.error(err);
            setError("No se pudo iniciar el pago: " + err.message);
        }
    };

    return (
        <div className="reserve-section">
            {/* Título con el nombre de la máquina */}
            {raw.includes("ROLE_CLIENTE") ? (
                <h1>Reservar: {machine.nombre}</h1>
            ) : (
                <h1>Disponibilidad: {machine.nombre}</h1>
            )}

            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

            <div className="reserve-content">
                <div className="calendar-container">

                    {raw.includes("ROLE_CLIENTE") && !readonly ? (
                        <>
                            <label>Fecha Inicio:</label>
                            <DatePicker
                                selected={inicio}
                                onChange={date => setInicio(date)}
                                excludeDates={diasOcupados}
                                dayClassName={marcarDiasOcupados}
                                selectsStart
                                startDate={inicio}
                                endDate={fin}
                                minDate={new Date()}
                                dateFormat="yyyy-MM-dd"
                                calendarClassName="big-calendar"
                            />
                            <br />

                            <label>Fecha Fin:</label>
                            <DatePicker
                                selected={fin}
                                onChange={date => setFin(date)}
                                excludeDates={diasOcupados}
                                dayClassName={marcarDiasOcupados}
                                selectsEnd
                                startDate={inicio}
                                endDate={fin}
                                minDate={inicio || new Date()}
                                dateFormat="yyyy-MM-dd"
                                calendarClassName="big-calendar"
                            />
                            <br />

                            <button className="button-primary" onClick={handlePagoYRedireccion}>
                                Realizar Reserva
                            </button>
                        </>
                    ) : (
                        <DatePicker
                            selected={null}
                            excludeDates={diasOcupados}
                            dayClassName={marcarDiasOcupados}
                            inline
                            minDate={new Date()}
                            dateFormat="yyyy-MM-dd"
                            calendarClassName="big-calendar"
                        />
                    )}

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
                        <strong>Precio por día:</strong> $
                        {machine.precioDia || 'No disponible'}
                    </p>
                    <p>
                        <strong>Descripción:</strong>{' '}
                        {machine.descripcion || 'No disponible'}
                    </p>
                </div>
            </div>

            {/* Botón para mostrar/ocultar reseñas */}
            <div style={{ marginTop: "32px", textAlign: "center" }}>
                <button
                    className="button-secondary"
                    onClick={() => setShowResenas(prev => !prev)}
                    style={{ marginBottom: "8px" }}
                >
                    {showResenas ? "Ocultar reseñas" : "Ver reseñas"}
                </button>
                {showResenas && (
                    <div>
                        <h2 style={{marginBottom: 0}}>Reseñas</h2>
                        <ListaResenasMaquina
                            nombreMaquina={machine.nombre}
                            visible={true}
                            onClose={() => setShowResenas(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}