import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    // Validar token al cargar el componente
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const response = await login(correo, clave);
            localStorage.setItem("token", response.data.token);
            setSuccess("Inicio de sesión exitoso");
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.mensaje);
        }
    };

    return (
        <div style={{ paddingBottom: "3rem", background: "#f5f6fa", minHeight: "100vh" }}>
            <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", background: "#f5f6fa" }}>
                <form
                    style={{
                        background: "#fff", padding: "2.5rem 2rem", borderRadius: "12px",
                        boxShadow: "0 4px 32px 0 rgba(0,0,0,0.08)", minWidth: "350px", display: "flex",
                        flexDirection: "column", gap: "1.2rem"
                    }}
                    onSubmit={handleSubmit}
                    autoComplete="off"
                >
                    <h1 style={{ textAlign: "center", color: "#222f3e", marginBottom: "0.5rem" }}>Iniciar Sesión</h1>
                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Correo</label>
                        <input
                            style={{
                                width: "100%", padding: "0.7rem", border: "1px solid #c8d6e5", borderRadius: "6px",
                                outline: "none", fontSize: "1rem", background: "#f8fafc"
                            }}
                            type="text"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                            placeholder="Ingresa tu Correo"
                        />
                    </div>
                    <div>
                        <label style={{ fontWeight: 500, marginBottom: "0.35rem", color: "#222f3e" }}>Clave</label>
                        <input
                            style={{
                                width: "100%", padding: "0.7rem", border: "1px solid #c8d6e5", borderRadius: "6px",
                                outline: "none", fontSize: "1rem", background: "#f8fafc"
                            }}
                            type="password"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                            required
                            placeholder="Ingresa tu clave"
                        />
                    </div>
                    {error && <div style={{ color: "#ee5253", background: "#ffeaea", borderRadius: "5px", padding: "0.7rem", textAlign: "center", fontWeight: 500, fontSize: "1rem" }}>{error}</div>}
                    {success && <div style={{ color: "#10ac84", background: "#e6fffa", borderRadius: "5px", padding: "0.7rem", textAlign: "center", fontWeight: 500, fontSize: "1rem" }}>{success}</div>}
                    <button
                        type="submit"
                        style={{
                            width: "100%", padding: "0.8rem", background: "#10ac84", color: "#fff", border: "none",
                            borderRadius: "6px", fontWeight: 600, fontSize: "1.1rem", cursor: "pointer", marginTop: "0.7rem"
                        }}
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </main>
        </div>
    );
}

export default Login;