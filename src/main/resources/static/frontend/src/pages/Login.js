import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import styles from "./Login.module.css";

/**
 * Componente de login clásico (sin 2FA).
 */
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) navigate("/");
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const response = await login(email, password);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                setSuccess("Inicio de sesión exitoso");
                setTimeout(() => navigate("/"), 1500);
            } else {
                setError("Respuesta inesperada del servidor.");
            }
        } catch (err) {
            setError(err?.response?.data?.mensaje || "Error al iniciar sesión.");
        }
    };

    const renderFeedback = (msg, type) => (
        <div
            className={type === "error" ? styles.errorMsg : styles.successMsg}
            role="alert"
            aria-live="assertive"
        >
            {msg}
        </div>
    );

    return (
        <div className={styles.container}>
            <main className={styles.centeredMain}>
                <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
                    <h1 className={styles.title}>Iniciar Sesión</h1>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Correo</label>
                        <input
                            id="email"
                            type="email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Ingresa tu correo"
                            autoFocus
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Clave</label>
                        <input
                            id="password"
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Ingresa tu clave"
                        />
                    </div>
                    {error && renderFeedback(error, "error")}
                    {success && renderFeedback(success, "success")}
                    <button type="submit" className={styles.button}>
                        Iniciar Sesión
                    </button>
                </form>
            </main>
        </div>
    );
}

export default Login;