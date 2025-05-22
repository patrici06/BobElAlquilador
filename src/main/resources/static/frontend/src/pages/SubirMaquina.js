import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { subirMaquina } from "../services/authService";
import { getUserRoles } from "../utils/authUtils";

function SubirMaquina() {
    const [nombreMaquina, setNombreMaquina] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [fechaIngreso, setFechaIngreso] = useState("");
    const [fotoUrl, setFotoUrl] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tipo, setTipo] = useState("");
    const [precioDia, setPrecioDia] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const rawRoles = localStorage.getItem("rol");
    const roles = getUserRoles(rawRoles);

    // Solo permitir acceso a propietarios
    if (!roles.includes("ROLE_PROPIETARIO")) {
        return (
            <div style={{
                padding: "3rem",
                background: "#f5f6fa",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <div style={{
                    background: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 4px 32px 0 rgba(0,0,0,0.08)",
                    padding: "2.5rem 2rem",
                    minWidth: "350px",
                    textAlign: "center"
                }}>
                    <h2 style={{ color: "#ee5253", marginBottom: "1rem" }}>
                        403: Permiso denegado
                    </h2>
                    <p style={{ color: "#222f3e" }}>No tienes permisos para acceder a esta página.</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            await subirMaquina({
                nombreMaquina,
                ubicacion,
                fechaIngreso,
                fotoUrl,
                descripcion,
                tipo,
                precioDia
            });
            setSuccess("Máquina registrada exitosamente. Redirigiendo...");
            setTimeout(() => navigate("/"), 1800);
        } catch (err) {
            if (err?.response?.status === 403) {
                setError("No tienes permisos para registrar máquinas.");
            } else {
                setError(err?.response?.data?.mensaje || "Error al registrar máquina.");
            }
            setSubmitting(false);
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
                    style={{
                        background: "#fff", padding: "2.5rem 2rem", borderRadius: "12px",
                        boxShadow: "0 4px 32px 0 rgba(0,0,0,0.08)", minWidth: "350px", display: "flex",
                        flexDirection: "column", gap: "1.2rem"
                    }}
                    onSubmit={handleSubmit}
                    autoComplete="off"
                >
                    <h1 style={{ textAlign: "center", color: "#222f3e", marginBottom: "0.5rem" }}>
                        Subir Máquina
                    </h1>
                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Nombre de la máquina</label>
                        <input
                            style={inputStyle}
                            type="text"
                            value={nombreMaquina}
                            onChange={e => setNombreMaquina(e.target.value)}
                            required
                            placeholder="Nombre de la máquina"
                        />
                    </div>
                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Ubicación</label>
                        <input
                            style={inputStyle}
                            type="text"
                            value={ubicacion}
                            onChange={e => setUbicacion(e.target.value)}
                            required
                            placeholder="Ubicación"
                        />
                    </div>
                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Fecha de ingreso</label>
                        <input
                            style={inputStyle}
                            type="date"
                            value={fechaIngreso}
                            onChange={e => setFechaIngreso(e.target.value)}
                            required
                            placeholder="Fecha de ingreso"
                        />
                    </div>
                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Foto (URL)</label>
                        <input
                            style={inputStyle}
                            type="text"
                            value={fotoUrl}
                            onChange={e => setFotoUrl(e.target.value)}
                            placeholder="Foto (URL)"
                        />
                    </div>
                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Descripción</label>
                        <input
                            style={inputStyle}
                            type="text"
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                            placeholder="Descripción"
                        />
                    </div>
                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Tipo de máquina</label>
                        <input
                            style={inputStyle}
                            type="text"
                            value={tipo}
                            onChange={e => setTipo(e.target.value)}
                            placeholder="Tipo de máquina"
                        />
                    </div>
                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Precio por día</label>
                        <input
                            style={inputStyle}
                            type="number"
                            value={precioDia}
                            onChange={e => setPrecioDia(e.target.value)}
                            required
                            placeholder="Precio por día"
                        />
                    </div>
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
                        disabled={submitting}
                        style={{
                            width: "100%",
                            padding: "0.8rem",
                            background: submitting ? "#bdbdbd" : "#10ac84",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            cursor: submitting ? "not-allowed" : "pointer",
                            marginTop: "0.7rem"
                        }}
                    >
                        {submitting ? "Registrando..." : "Subir Máquina"}
                    </button>
                </form>
            </main>
        </div>
    );
}

export default SubirMaquina;