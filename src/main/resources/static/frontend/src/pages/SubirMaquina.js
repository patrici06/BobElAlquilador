import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { subirMaquina } from "../services/authService";

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
            await subirMaquina(formData);
            setSuccess("Máquina registrada exitosamente. Redirigiendo...");
            setTimeout(() => navigate("/"), 1800);
        } catch (err) {
            if (err?.response?.status === 403) {
                setError("No tienes permisos para registrar máquinas.");
            } else {
                setError(err?.response?.data?.mensaje);
            }
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

                    {[
                        { name: "nombre_maquina", label: "Nombre de la máquina", type: "text", required: true },
                        { name: "ubicacion", label: "Ubicación", type: "text", required: true },
                        { name: "fecha_ingreso", label: "Fecha de ingreso", type: "date", required: true },
                        { name: "fotoUrl", label: "Foto (URL)", type: "text", required: false },
                        { name: "descripcion", label: "Descripción", type: "text", required: false },
                        { name: "tipo", label: "Tipo de máquina", type: "text", required: false },
                        { name: "precio_dia", label: "Precio por día", type: "number", required: true },
                    ].map(({ name, label, type, required }) => (
                        <div key={name}>
                            <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                required={required}
                                placeholder={label}
                                style={inputStyle}
                            />
                        </div>
                    ))}

                    {error && (
                        <div style={{
                            color: "#ee5253", background: "#ffeaea", borderRadius: "5px",
                            padding: "0.7rem", textAlign: "center", fontWeight: 500, fontSize: "1rem"
                        }}>{error}</div>
                    )}

                    {success && (
                        <div style={{
                            color: "#10ac84", background: "#e6fffa", borderRadius: "5px",
                            padding: "0.7rem", textAlign: "center", fontWeight: 500, fontSize: "1rem"
                        }}>{success}</div>
                    )}

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
