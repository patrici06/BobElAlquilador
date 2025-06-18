import React, { useState } from "react";
import { buscarAlquileresPorDni } from "../services/alquilerService";

const BuscarAlquilerDni = () => {
  const [dni, setDni] = useState("");
  const [alquileres, setAlquileres] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAlquileres([]);
    setLoading(true);
    try {
      const data = await buscarAlquileresPorDni(dni);
      setAlquileres(data);
      if (data.length === 0) setError("No hay alquileres asociados a ese DNI.");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Buscar Alquileres por DNI</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          placeholder="Ingrese DNI"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Buscando..." : "Buscar Alquileres"}
        </button>
      </form>
      {error && <div style={{ color: "red", marginTop: "1em" }}>{error}</div>}
      {alquileres.length > 0 && (
        <div>
          <h3>Alquileres encontrados:</h3>
          <ul>
            {alquileres.map((alq, idx) => (
              <li key={idx}>
                <b>Máquina:</b> {alq.maquina?.nombreMaquina || "N/A"} |{" "}
                <b>Fecha inicio:</b> {alq.alquilerId?.fechaInicio} |{" "}
                <b>Fecha fin:</b> {alq.alquilerId?.fechaFin}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BuscarAlquilerDni;
