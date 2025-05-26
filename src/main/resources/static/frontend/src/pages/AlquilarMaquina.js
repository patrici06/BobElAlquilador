import React, { useState, useEffect } from 'react';

function AlquilarMaquina() {
    const [view, setView] = useState('list'); // 'list', 'reserve', 'payment'
    const [machines, setMachines] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [inicio, setInicio] = useState('');
    const [fin, setFin] = useState('');
    const [error, setError] = useState('');

    // Assume clienteDni stored in localStorage after login
    const clienteDni = localStorage.getItem('dni');

    useEffect(() => {
        // Fetch machines from API
        fetch('http://localhost:8080/api/maquinas')
            .then(res => res.json())
            .then(data => setMachines(data))
            .catch(err => console.error(err));
    }, []);

    const handleReserveClick = machine => {
        setSelectedMachine(machine);
        setError('');
        setView('reserve');
    };

    const handleSubmit = () => {
        if (!inicio || !fin) {
            setError('Por favor selecciona ambas fechas.');
            return;
        }
        const url = new URL('/api/alquileres/reservar', window.location.origin);
        url.searchParams.append('clienteDni', clienteDni);
        url.searchParams.append('maquina', selectedMachine.nombre_maquina);
        url.searchParams.append('fechaInicio', inicio);
        url.searchParams.append('fechaFin', fin);

        fetch(url, {
            method: 'POST'
        })
            .then(res => {
                if (!res.ok) throw new Error('Error en la reserva');
                return res.json();
            })
            .then(() => setView('payment'))
            .catch(err => setError(err.message));
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', color: 'red', backgroundColor: 'white', minHeight: '100vh', padding: '20px' }}>
            {view === 'list' && (
                <div>
                    <h1>Máquinas Disponibles</h1>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {machines.map(m => (
                            <li key={m.nombre_maquina} style={{ margin: '10px 0', border: '1px solid red', padding: '10px', borderRadius: '5px' }}>
                                <strong>{m.nombre_maquina}</strong> - {m.tipo}
                                <button
                                    style={{ marginLeft: '20px', backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                                    onClick={() => handleReserveClick(m)}
                                >
                                    Alquilar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {view === 'reserve' && selectedMachine && (
                <div>
                    <h1>Reservar: {selectedMachine.nombre_maquina}</h1>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            Fecha Inicio:{' '}
                            <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} />
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            Fecha Fin:{' '}
                            <input type="date" value={fin} onChange={e => setFin(e.target.value)} />
                        </label>
                    </div>
                    <button
                        style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
                        onClick={handleSubmit}
                    >
                        Confirmar Reserva
                    </button>
                    <button
                        style={{ marginLeft: '10px', backgroundColor: 'white', color: 'red', border: '1px solid red', padding: '10px 20px', cursor: 'pointer' }}
                        onClick={() => setView('list')}
                    >
                        Volver
                    </button>
                </div>
            )}

            {view === 'payment' && (
                <div>
                    <h1>Pago Exitoso</h1>
                    <p>Se ha reservado tu máquina correctamente.</p>
                    <button
                        style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
                        onClick={() => setView('list')}
                    >
                        Volver al Inicio
                    </button>
                </div>
            )}
        </div>
    );
}

export default AlquilarMaquina;
