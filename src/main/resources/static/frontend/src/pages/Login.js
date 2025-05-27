import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, verify2fa } from "../services/authService";
import styles from "./Login.module.css";

/**
 * Este componente es compatible con 2FA vía email.
 * - Si el backend responde 206 (o similar), solicita el código 2FA.
 * - Si no, continúa el flujo normal.
 */
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [step, setStep] = useState("login"); // "login" | "2fa"
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [pendingEmail, setPendingEmail] = useState(""); // Guarda el email cuando está esperando 2FA
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
            // Si login exitoso y no requiere 2FA
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                setSuccess("Inicio de sesión exitoso");
                setTimeout(() => navigate("/"), 1500);
            } else {
                setError("Respuesta inesperada del servidor.");
            }
        } catch (err) {
            // Si status 206, requiere 2FA
            if (err.response?.status === 206) {
                setStep("2fa");
                setPendingEmail(email);
                setSuccess("Código enviado a tu correo. Por favor ingresa el código recibido.");
                setError("");
            } else {
                setError(err.response?.data?.mensaje || "Error al iniciar sesión.");
            }
        }
    };

    const handle2faSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const response = await verify2fa(pendingEmail, code);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                setSuccess("Inicio de sesión exitoso");
                setTimeout(() => navigate("/"), 1500);
            }
        } catch (err) {
            setError(err.response?.data?.mensaje);
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
                {step === "login" ? (
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
                ) : (
                    <form className={styles.form} onSubmit={handle2faSubmit} autoComplete="off">
                        <h1 className={styles.title}>Verificación en dos pasos</h1>
                        <div className={styles.inputGroup}>
                            <label htmlFor="code" className={styles.label}>Código enviado al correo</label>
                            <input
                                id="code"
                                type="text"
                                className={styles.input}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                placeholder="Ingresa el código de 6 dígitos"
                                autoFocus
                            />
                        </div>
                        {error && renderFeedback(error, "error")}
                        {success && renderFeedback(success, "success")}
                        <button type="submit" className={styles.button}>
                            Verificar
                        </button>
                    </form>
                )}
            </main>
        </div>
    );
}

export default Login;