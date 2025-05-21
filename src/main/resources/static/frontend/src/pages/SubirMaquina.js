import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SubirMaquina() {
    const [formData, setFormData] = useState({
        nombre_maquina: "",
        ubicacion: "",
        fecha_ingreso: "",
        fotoUrl: "",
        descripcion: "",
        tipo: "",
        precio_dia: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const response = await axios.post("http://localhost:8080/api/maquinas/subir", null, {
                params: formData
            });
            setSuccess("Máquina registrada exitosamente. Redirigiendo...");
            setTimeout(() => navigate("/"), 1800);
        } catch (err) {
            console.error(err);
            setError("Error al subir la máquina");
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "0.7rem",
        border: "1px solid #c8d6e5",
        borderRadius: "6px",
        outline: "none",
        fontSize: "1rem",
        background: "#f8fafc"
    };

    return (
        <div style={{ paddingBottom: "3rem", background: "#f5f6fa", minHeight: "100vh" }}>
            <main style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                minHeight: "80vh", background: "#f5f6fa"
            }}>
                <form
                    onSubmit={handleSubmit}
                    style={{
                        background: "#fff", padding: "2.5rem 2rem", borderRadius: "12px",
                        boxShadow: "0 4px 32px 0 rgba(0,0,0,0.08)", minWidth: "350px", display: "flex",
                        flexDirection: "column", gap: "1.2rem"
                    }}
                    autoComplete="off"
                >
                    <h1 style={{ textAlign: "center", color: "#222f3e", marginBottom: "0.5rem" }}>
                        Subir Máquina
                    </h1>

                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Nombre</label>
                        <input
                            name="nombre_maquina"
                            placeholder="Nombre de la máquina"
                            value={formData.nombre_maquina}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Ubicación</label>
                        <input
                            name="ubicacion"
                            placeholder="Ubicación"
                            value={formData.ubicacion}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Fecha de ingreso</label>
                        <input
                            type="date"
                            name="fecha_ingreso"
                            value={formData.fecha_ingreso}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Foto (URL)</label>
                        <input
                            name="fotoUrl"
                            placeholder="https://example.com/imagen.jpg"
                            value={formData.fotoUrl}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Descripción</label>
                        <input
                            name="descripcion"
                            placeholder="Descripción"
                            value={formData.descripcion}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Tipo</label>
                        <input
                            name="tipo"
                            placeholder="Tipo de máquina"
                            value={formData.tipo}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Precio por día</label>
                        <input
                            type="number"
                            name="precio_dia"
                            placeholder="Precio por día"
                            value={formData.precio_dia}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {error && <div style={{
                        color: "#ee5253", background: "#ffeaea", borderRadius: "5px",
                        padding: "0.7rem", textAlign: "center", fontWeight: 500, fontSize: "1rem"
                    }}>{error}</div>}

                    {success && <div style={{
                        color: "#10ac84", background: "#e6fffa", borderRadius: "5px",
                        padding: "0.7rem", textAlign: "center", fontWeight: 500, fontSize: "1rem"
                    }}>{success}</div>}

                    <button
                        type="submit"
                        style={{
                            width: "100%", padding: "0.8rem", background: "#10ac84", color: "#fff", border: "none",
                            borderRadius: "6px", fontWeight: 600, fontSize: "1.1rem", cursor: "pointer", marginTop: "0.7rem"
                        }}
                    >
                        Subir Máquina
                    </button>
                </form>
            </main>
        </div>
    );
}

export default SubirMaquina;