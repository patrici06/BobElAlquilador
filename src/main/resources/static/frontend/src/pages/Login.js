import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, verify2fa } from "../services/authService";
import styles from "./Login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // <-- Importa los íconos

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [step, setStep] = useState("login"); // "login" | "2fa"
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [pendingEmail, setPendingEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // <-- Estado para mostrar/ocultar clave
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) navigate("/");
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true); // desactiva el botón

        try {
            const response = await login(email, password);
            if (response.data.token) {
                sessionStorage.setItem("token", response.data.token);
                setSuccess("Inicio de sesión exitoso");
                // NO reactivamos el botón, redirigimos tras un delay
                setTimeout(() => navigate("/"), 1500);
            } else if (response.status === 206) {
                setStep("2fa");
                setPendingEmail(email);
                setSuccess("Código enviado a tu correo. Por favor ingresa el código recibido.");
                setError("");
                setLoading(false); // Reactivamos solo para 2fa
            } else {
                setError("Respuesta inesperada del servidor.");
                setLoading(false);
            }
        } catch (err) {
            setError(err.response?.data?.mensaje || "Error al iniciar sesión.");
            setLoading(false); // Reactivamos solo ante error
        }
    };

    const handle2faSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await verify2fa(pendingEmail, code);
            if (response.data.token) {
                sessionStorage.setItem("token", response.data.token);
                setSuccess("Inicio de sesión exitoso");
                // NO reactivamos el botón, redirigimos tras un delay
                setTimeout(() => navigate("/"), 1500);
            } else {
                setError("Código incorrecto o error de servidor.");
                setLoading(false);
            }
        } catch (err) {
            setError(err.response?.data?.mensaje || "Error al verificar código.");
            setLoading(false);
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
                                disabled={loading}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Clave</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className={styles.input}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Ingresa tu clave"
                                    disabled={loading}
                                />
                                <span
                                    className={styles.eyeIcon}
                                    onClick={() => setShowPassword(v => !v)}
                                    tabIndex={0}
                                    aria-label={showPassword ? "Ocultar clave" : "Mostrar clave"}
                                    style={{ userSelect: "none" }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        {error && renderFeedback(error, "error")}
                        {success && renderFeedback(success, "success")}
                        <button
                            type="submit"
                            className={styles.button}
                            disabled={loading}
                            tabIndex={loading ? -1 : 0}
                            style={loading ? { pointerEvents: "none", opacity: 0.7 } : {}}
                        >
                            {loading ? "Aguarde..." : "Iniciar Sesión"}
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
                                disabled={loading}
                            />
                        </div>
                        {error && renderFeedback(error, "error")}
                        {success && renderFeedback(success, "success")}
                        <button
                            type="submit"
                            className={styles.button}
                            disabled={loading}
                            tabIndex={loading ? -1 : 0}
                            style={loading ? { pointerEvents: "none", opacity: 0.7 } : {}}
                        >
                            {loading ? "Aguarde..." : "Verificar"}
                        </button>
                    </form>
                )}
            </main>
        </div>
    );
}

export default Login;