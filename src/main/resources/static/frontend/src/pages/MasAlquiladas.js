import React, { useState } from "react";
import "./MisAlquileres.css";
import { obtenerMaquinasMasAlquiladas } from "../services/alquilerService";
import { useNavigate } from "react-router-dom";

function MasAlquiladas() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [resultado, setResultado] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Ejecuta solo al presionar el botón Buscar
  const handleBuscar = async (e) => {
    e.preventDefault();
    setMensaje("");
    setResultado([]);
    if (!fechaInicio || !fechaFin) {
      setMensaje("Debes seleccionar ambas fechas.");
      return;
    }
    setLoading(true);
    try {
      const res = await obtenerMaquinasMasAlquiladas(fechaInicio, fechaFin);
      if (typeof res === "string") {
        setMensaje(res);
      } else {
        setResultado(res);
        if (res.length === 0)
          setMensaje("No se encontraron alquileres de máquinas en ese período de fechas.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.mensaje) {
        setMensaje(err.response.data.mensaje);
      } else if (err.message && err.message.includes('Unexpected token')) {
        setMensaje("Error de conexión o respuesta inválida del servidor. Verifica que el backend esté corriendo y la URL sea correcta.");
      } else {
        setMensaje(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container">
        <h2 className="title">Máquinas más alquiladas</h2>
        <form className="filters" style={{marginBottom: "1rem"}} onSubmit={handleBuscar}>
          <label>
            Fecha inicio:
            <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} required />
          </label>
          <label>
            Fecha fin:
            <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} required />
          </label>
          <button type="submit" className="button-primary" style={{marginLeft: 12}}>Buscar</button>
        </form>
        {loading && <p className="loading">Cargando...</p>}
        {mensaje && <p className="error">{mensaje}</p>}
        {!loading && !mensaje && resultado.length === 0 && (
            <p className="noData">No hay datos para mostrar.</p>
        )}
        {resultado.length > 0 && (
            <table className="table">
              <thead>
              <tr>
                <th>Máquina</th>
                <th>Cantidad de alquileres</th>
              </tr>
              </thead>
              <tbody>
              {resultado.map((m, i) => (
                  <tr key={i}>
                    <td style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={() => navigate('/alquilar', { state: { nombreMaquina: m.nombreMaquina } })}>{m.nombreMaquina}</td>
                    <td>{m.cantidad}</td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}
      </div>
  );
}

export default MasAlquiladas;