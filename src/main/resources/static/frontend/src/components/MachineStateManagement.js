import React, { useState } from 'react';

function MachineStateManagement({ machine, token }) {
    const [selectedState, setSelectedState] = useState(machine.estado);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');
    const [updateStatus, setUpdateStatus] = useState('');

    const machineStates = ["Disponible", "Mantenimiento", "Descompuesta"];

    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
    };

    const updateMachineState = async () => {

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

            setUpdateMessage(`${machine.nombre} actualizada con exito`);
            setUpdateStatus('success');
            // Update the machine object to reflect the new state
            machine.estado = selectedState;

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
        width: '60%',          // Adjust width (90% of container)
        padding: '10px',       // Increase padding for height
        fontSize: '14px',      // Adjust font size
        borderRadius: '4px',   // Round corners
        border: '1px solid #ccc', // Border style
        backgroundColor: '#f8f9fa', // Light background
        margin: '0 auto',      // Center the dropdown
        display: 'block'       // Block display
    };

    const buttonStyle = {
        width: '40%',          // Match dropdown width
        padding: '10px 0',     // Vertical padding
        margin: '10px auto',   // Center and add space around
        fontSize: '15px',      // Text size
        borderRadius: '4px',   // Round corners
        backgroundColor: '#dc3545', // Red color like in your image
        color: 'white',        // Text color
        border: 'none',        // Remove border
        cursor: 'pointer',     // Hand cursor on hover
        fontWeight: '500'      // Semi-bold text
    };

    return (
        <div className="machine-state-management" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div className="state-selector" style={{ marginBottom: '8px', width: '100%' }}>
                <select
                    value={selectedState}
                    onChange={handleStateChange}
                    style={selectStyle}
                    disabled={isUpdating}
                >
                    {machineStates.map(state => (
                        <option key={state} value={state}>
                            {state.replace('_', ' ')}
                        </option>
                    ))}
                </select>
            </div>

            <button
                className="button-primary"
                onClick={updateMachineState}
                disabled={isUpdating}
                style={buttonStyle}
            >
                {isUpdating ? 'Actualizando...' : 'Actualizar'}
            </button>

            {updateMessage && (
                <div
                    className={`update-message ${updateStatus}`}
                    style={{
                        width: '90%',       // Match width of other elements
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