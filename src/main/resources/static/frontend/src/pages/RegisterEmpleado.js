import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerEmpleado } from "../services/authService";

function RegisterEmpleado() {
    const [dni, setDni] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await registerEmpleado({ dni, nombre, apellido, email });
            setSuccess("Empleado registrado exitosamente. Redirigiendo...");
            setTimeout(() => navigate("/"), 1800);
        } catch (err) {
            setError(err?.response?.data?.mensaje || "Error en el registro");
        }
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
                    <h1 style={{ textAlign: "center", color: "#222f3e", marginBottom: "0.5rem" }}>Registrar Empleado</h1>
                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>DNI</label>
                        <input
                            style={{
                                width: "100%", padding: "0.7rem", border: "1px solid #c8d6e5", borderRadius: "6px",
                                outline: "none", fontSize: "1rem", background: "#f8fafc"
                            }}
                            type="text"
                            value={dni}
                            onChange={e => setDni(e.target.value)}
                            required
                            placeholder="Ingresa el DNI"
                        />
                    </div>
                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Nombre</label>
                        <input
                            style={{
                                width: "100%", padding: "0.7rem", border: "1px solid #c8d6e5", borderRadius: "6px",
                                outline: "none", fontSize: "1rem", background: "#f8fafc"
                            }}
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            required
                            placeholder="Ingresa el nombre"
                        />
                    </div>
                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Apellido</label>
                        <input
                            style={{
                                width: "100%", padding: "0.7rem", border: "1px solid #c8d6e5", borderRadius: "6px",
                                outline: "none", fontSize: "1rem", background: "#f8fafc"
                            }}
                            type="text"
                            value={apellido}
                            onChange={e => setApellido(e.target.value)}
                            required
                            placeholder="Ingresa el apellido"
                        />
                    </div>
                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Email</label>
                        <input
                            style={{
                                width: "100%", padding: "0.7rem", border: "1px solid #c8d6e5", borderRadius: "6px",
                                outline: "none", fontSize: "1rem", background: "#f8fafc"
                            }}
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="Ingresa el email"
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
                        Registrar Empleado
                    </button>
                </form>
            </main>
        </div>
    );
}

export default RegisterEmpleado;