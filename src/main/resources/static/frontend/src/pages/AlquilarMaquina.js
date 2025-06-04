import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AlquilarMaquina.css';
import { jwtDecode } from "jwt-decode";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import MachineAvailability from './VerMaquina';

// === FUNCIÓN UTILITARIA PARA CONSTRUIR EL SRC DE LA IMAGEN ===
function getMachineImageSrc(fotoUrl) {
    if (!fotoUrl) return 'https://via.placeholder.com/300x200?text=Sin+Imagen';
    if (fotoUrl.startsWith('http') || fotoUrl.startsWith('data:')) return fotoUrl;
    // Si es relativa, prepend el host del backend
    return `http://localhost:8080${fotoUrl.startsWith('/') ? '' : '/'}${fotoUrl}`;
}

function AlquilarMaquina() {
    // --- Filtros de tipo y marca ---
    const [tipos, setTipos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [selectedTipo, setSelectedTipo] = useState('');
    const [selectedMarca, setSelectedMarca] = useState('');
    // ---
    const [machines, setMachines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [view, setView] = useState('list');
    const [inicio, setInicio] = useState(null);
    const [fin, setFin] = useState(null);
    const [error, setError] = useState('');
    const [diasOcupados, setDiasOcupados] = useState([]);
    const clienteDni = sessionStorage.getItem('dni');
    const token = sessionStorage.getItem("token");
    const rawRoles = React.useMemo(() => getRolesFromJwt(token), [token]);

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

    // 1) Cargo la lista de máquinas
    useEffect(() => {
        const endpoint = rawRoles.includes("ROLE_PROPIETARIO")
            ? 'http://localhost:8080/api/maquinas'
            : 'http://localhost:8080/api/maquinas/disponibles';

        fetch(endpoint)
            .then(res => res.json())
            .then(data => setMachines(data))
            .catch(console.error);
    }, [token]);

    // 1.1) Cargar tipos y marcas para los filtros
    useEffect(() => {
        fetch("http://localhost:8080/api/tipos")
            .then(res => res.json())
            .then(data => setTipos(data))
            .catch(() => setTipos([]));
        fetch("http://localhost:8080/api/marcas")
            .then(res => res.json())
            .then(data => setMarcas(data))
            .catch(() => setMarcas([]));
    }, []);

    // 2) Cuando cambio a la vista "processing", disparo el timeout para pasar a "payment"
    useEffect(() => {
        if (view === 'processing') {
            const timeout = setTimeout(() => {
                setView('payment');
            }, 2500);
            return () => clearTimeout(timeout);
        }
    }, [view]);

    const handleReserveClick = (machine) => {
        setSelectedMachine(machine);
        setError('');
        setInicio(null);
        setFin(null);
        setView('reserve');
    };

    const handleEliminarMaquina = async (nombre) => {
        if (window.confirm(`¿Estás seguro de eliminar la máquina "${nombre}"?`)) {
            try {
                const response = await fetch(`http://localhost:8080/maquina/eliminar/${encodeURIComponent(nombre)}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Máquina eliminada con éxito');
                    setMachines((prev) => prev.filter((m) => m.nombre !== nombre));
                } else {
                    const error = await response.json();
                    alert('Error al eliminar: ' + (error.mensaje || 'Error desconocido'));
                }
            } catch (error) {
                alert('Error al eliminar: ' + error.message);
            }
        }
    };

    const handleViewAvailabilityClick = (machine) => {
        setSelectedMachine(machine);
        setError('');
        setInicio(null);
        setFin(null);
        setView('availability');
    };

    const marcarDiasOcupados = (date) => {
        return diasOcupados.some(d => d.toDateString() === date.toDateString())
            ? 'dia-ocupado'
            : undefined;
    };

    // --- Filtrado teniendo en cuenta que una máquina puede tener múltiples tipos (Set)
    const filteredMachines = machines.filter(machine => {
        const nombre = (machine.nombre || '').toLowerCase();
        const descripcion = (machine.descripcion || '').toLowerCase();
        const term = searchTerm.toLowerCase();

        // Filtrado de tipo: si se seleccionó un tipo, la máquina debe tenerlo en su set
        let tipoMatch = true;
        if (selectedTipo) {
            const tipoArray = Array.isArray(machine.tipo) ? machine.tipo : [];
            tipoMatch = tipoArray.some(t => String(t.id) === String(selectedTipo));
        }

        let marcaMatch = true;
        if (selectedMarca) {
            if (typeof machine.marca === "object" && machine.marca !== null) {
                marcaMatch = String(machine.marca.id) === String(selectedMarca);
            } else {
                marcaMatch = String(machine.marca) === String(selectedMarca);
            }
        }

        // Texto search
        const searchMatch = nombre.includes(term) || descripcion.includes(term);

        return tipoMatch && marcaMatch && searchMatch;
    });

    return (
        <div className="container">
            {view === 'list' && (
                <>
                    <h1>Máquinas Disponibles</h1>
                    <div className="search-bar-container" style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o descripción..."
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
                                <option
                                    key={tipo.id}
                                    value={tipo.id}
                                >
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
                                <option
                                    key={marca.id}
                                    value={marca.id}
                                >
                                    {marca.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="cards-container">
                        {filteredMachines.length === 0 ? (
                            <div style={{ margin: '2em auto', color: '#555' }}>No se encontro una maquina bajo esas caracteristicas.</div>
                        ) : (
                            filteredMachines.map(machine => (
                                <div className="card" key={machine.nombre}>
                                    <img
                                        src={getMachineImageSrc(machine.fotoUrl)}
                                        alt={machine.nombre}
                                        loading="lazy"
                                    />
                                    <div className="card-title">{machine.nombre}</div>
                                    <div className="card-type">
                                        {Array.isArray(machine.tipo) && machine.tipo.length > 0
                                            ? machine.tipo.map(t => t.nombreTipo || t.nombre).join(', ')
                                            : 'Sin tipo'}
                                    </div>
                                    {rawRoles.includes("ROLE_PROPIETARIO") && (
                                        <div className="card-status">Estado: {machine.estado}</div>
                                    )}
                                    {rawRoles.includes("ROLE_CLIENTE") && (
                                        <button
                                            className="button-primary"
                                            onClick={() => handleReserveClick(machine)}
                                        >
                                            Alquilar
                                        </button>
                                    )}
                                    {rawRoles.includes("ROLE_PROPIETARIO") && (
                                        <>
                                            <button
                                                className="button-secondary"
                                                onClick={() => handleViewAvailabilityClick(machine)}
                                            >
                                                Ver Disponibilidad
                                            </button>

                                            {machine.estado !== "Eliminado" && (
                                                <button
                                                    className="button-secondary"
                                                    onClick={() => handleEliminarMaquina(machine.nombre)}
                                                >
                                                    Eliminar
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
            {view === 'availability' && selectedMachine && (
                <MachineAvailability
                    machine={selectedMachine}
                    onClose={() => setView('list')}
                    onReserveSuccess={() => setView('processing')}
                    readonly={true}
                />
            )}
            {view === 'reserve' && selectedMachine && (
                <MachineAvailability
                    machine={selectedMachine}
                    onClose={() => setView('list')}
                    onReserveSuccess={() => setView('processing')}
                    readonly={false}
                />
            )}
            {view === 'processing' && (
                <div className="processing-section">
                    <h1>Procesando Pago...</h1>
                    <div className="spinner"></div>
                </div>
            )}
            {view === 'payment' && (
                <div className="payment-section">
                    <h1>✅ Pago Exitoso</h1>
                    <p>Alquiler Realizado con Exito</p>
                    <button className="button-primary" onClick={() => setView('list')}>
                        Volver al Inicio
                    </button>
                </div>
            )}
        </div>
    );
}

export default AlquilarMaquina;