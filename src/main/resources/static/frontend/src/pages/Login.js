import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { login } from "../services/authService";

function Login() {
    const [dni, setDni] = useState("");
    const [clave, setClave] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await login(dni, clave);
            // Aquí puedes guardar el token, por ejemplo en localStorage:
            localStorage.setItem("token", response.data.token);
            // Redirigir a home o dashboard
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.mensaje || "Error al iniciar sesión");
        }
    };

    return (
        <div style={{ paddingBottom: "3rem" }}>
            <Header />
            <main style={{ padding: "2rem" }}>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>DNI:</label>
                        <input
                            type="text"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Clave:</label>
                        <input
                            type="password"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <button type="submit">Iniciar Sesión</button>
                </form>
            </main>
            <Footer />
        </div>
    );
}

export default Login;