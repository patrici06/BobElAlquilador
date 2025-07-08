import React, { useState, useEffect } from 'react';

function MachineStateManagement({ machine, token, onStateUpdated }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');
    const [updateStatus, setUpdateStatus] = useState('');

    const machineStates = ["Disponible", "Mantenimiento", "Descompuesta"];
    // El estado actual: preferir estado_maquina, luego estado, sino vacío
    const machineEstado = machine.estadoMaquina || "";

    // Estado seleccionado: arranca vacío
    const [selectedState, setSelectedState] = useState("");

    // Cuando cambia el estado actual de la máquina, reseteá el select
    useEffect(() => {
        setSelectedState("");
    }, [machineEstado]);

    // Opciones de actualización: todas excepto el estado actual
    const updateStates = machineStates.filter(state => state !== machineEstado);

    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
    };

    const updateMachineState = async () => {
        // Si no eligió nada nuevo, no hagas nada
        if (!selectedState || selectedState === machineEstado) return;
        setIsUpdating(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/maquina/actualizarEstado/${encodeURIComponent(machine.nombre)}?nuevoEstado=${selectedState}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error al actualizar el estado');
            }

            setUpdateMessage(`${machine.nombre} actualizada con éxito`);
            setUpdateStatus('success');
            // Actualizar el objeto local (si hace falta)
            if ('estado' in machine) machine.estado = selectedState;
            if ('estado_maquina' in machine) machine.estado_maquina = selectedState;

            if (onStateUpdated) onStateUpdated();

        } catch (error) {
            setUpdateMessage(`Error: ${error.message}`);
            setUpdateStatus('error');
        } finally {
            setIsUpdating(false);
            setTimeout(() => {
                setUpdateMessage('');
                setUpdateStatus('');
            }, 3000);
        }
    };

    // Style customization
    const selectStyle = {
        width: '60%',
        padding: '10px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#f8f9fa',
        margin: '0 auto',
        display: 'block'
    };

    const buttonStyle = {
        width: '40%',
        padding: '10px 0',
        margin: '10px auto',
        fontSize: '15px',
        borderRadius: '4px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '500'
    };

    return (
        <div className="machine-state-management" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{ marginBottom: '8px', width: '100%', textAlign: 'center', fontWeight: 500 }}>
                Estado actual:&nbsp;
                <span style={{
                    color:
                        machineEstado === "Disponible" ? "#155724" :
                        machineEstado === "Mantenimiento" ? "#856404" :
                        machineEstado === "Descompuesta" ? "#721c24" :
                        "#333"
                }}>
                    {machineEstado || <span style={{ color: "#999" }}>Sin estado</span>}
                </span>
            </div>
            <div className="state-selector" style={{ marginBottom: '8px', width: '100%' }}>
                <select
                    value={selectedState}
                    onChange={handleStateChange}
                    style={selectStyle}
                    disabled={isUpdating}
                >
                    <option value="">Seleccionar nuevo estado...</option>
                    {updateStates.map(state => (
                        <option key={state} value={state}>
                            {state.replace('_', ' ')}
                        </option>
                    ))}
                </select>
            </div>

            <button
                className="button-primary"
                onClick={updateMachineState}
                disabled={isUpdating || !selectedState}
                style={buttonStyle}
            >
                {isUpdating ? 'Actualizando...' : 'Actualizar'}
            </button>

            {updateMessage && (
                <div
                    className={`update-message ${updateStatus}`}
                    style={{
                        width: '90%',
                        marginTop: '8px',
                        padding: '8px',
                        textAlign: 'center',
                        borderRadius: '4px',
                        fontSize: '14px',
                        color: updateStatus === 'error' ? '#721c24' :
                            updateStatus === 'success' ? '#155724' : '#856404',
                        backgroundColor: updateStatus === 'error' ? '#f8d7da' :
                            updateStatus === 'success' ? '#d4edda' : '#fff3cd'
                    }}
                >
                    {updateMessage}
                </div>
            )}
        </div>
    );
}

export default MachineStateManagement;