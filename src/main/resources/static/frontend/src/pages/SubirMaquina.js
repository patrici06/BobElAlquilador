import React, { useState } from "react";
import axios from "axios";

function SubirMaquinaForm() {
  const [formData, setFormData] = useState({
    nombre_maquina: "",
    ubicacion: "",
    fecha_ingreso: "",
    fotoUrl: "",
    descripcion: "",
    tipo: "",
    precio_dia: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/maquinas/subir", null, {
        params: formData
      });
      alert("Máquina registrada exitosamente");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Error al subir la máquina");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre_maquina" placeholder="Nombre" onChange={handleChange} required />
      <input name="ubicacion" placeholder="Ubicación" onChange={handleChange} required />
      <input type="date" name="fecha_ingreso" onChange={handleChange} required />
      <input name="fotoUrl" placeholder="Foto URL" onChange={handleChange} />
      <input name="descripcion" placeholder="Descripción" onChange={handleChange} />
      <input name="tipo" placeholder="Tipo" onChange={handleChange} />
      <input type="number" name="precio_dia" placeholder="Precio por día" onChange={handleChange} required />
      <button type="submit">Subir Máquina</button>
    </form>
  );
}

export default SubirMaquinaForm;