import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerEmpleado } from "../services/authService";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import styles from "./RegisterEmpleado.module.css";

export default function RegisterEmpleado() {
    // Usa sessionStorage o localStorage, según corresponda a tu app
    const token = sessionStorage.getItem("token");
    const roles = getRolesFromJwt(token);

    // Estados controlados por input
    const [dni, setDni] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [birthDate, setBirthDate] = useState(""); // Nuevo estado para la fecha de nacimiento
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    if (!roles.includes("ROLE_PROPIETARIO")) {
        return (
            <div className={styles.deniedContainer}>
                <div className={styles.deniedBox}>
                    <h2 className={styles.deniedTitle}>403: Permiso denegado</h2>
                    <p className={styles.deniedText}>No tienes permisos para acceder a esta página.</p>
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
            await registerEmpleado({
                dni,
                nombre: firstName,
                apellido: lastName,
                email,
                fechaNacimiento: birthDate, // Agregada fecha de nacimiento al payload
            });
            setSuccess("Empleado registrado exitosamente. Redirigiendo...");
            setTimeout(() => navigate("/"), 1800);
        } catch (err) {
            if (err?.response?.status === 403) {
                setError("No tienes permisos para registrar empleados.");
            } else {
                setError(err?.response?.data?.mensaje || "Error en el registro");
            }
            setSubmitting(false);
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
                    <h1 className={styles.title}>Registrar Empleado</h1>
                    <div className={styles.inputGroup}>
                        <label htmlFor="dni" className={styles.label}>DNI</label>
                        <input
                            id="dni"
                            name="dni"
                            type="text"
                            className={styles.input}
                            value={dni}
                            onChange={e => setDni(e.target.value.replace(/\D/g, ""))}
                            required
                            placeholder="Ingresa el DNI"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="firstName" className={styles.label}>Nombre</label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            className={styles.input}
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                            placeholder="Ingresa el nombre"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="lastName" className={styles.label}>Apellido</label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            className={styles.input}
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                            placeholder="Ingresa el apellido"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className={styles.input}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="Ingresa el email"
                            autoComplete="new-email"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="birthDate" className={styles.label}>Fecha de Nacimiento</label>
                        <input
                            id="birthDate"
                            name="birthDate"
                            type="date"
                            className={styles.input}
                            value={birthDate}
                            onChange={e => setBirthDate(e.target.value)}
                            required
                            placeholder="Fecha de nacimiento"
                        />
                    </div>
                    {error && renderFeedback(error, "error")}
                    {success && renderFeedback(success, "success")}
                    <button
                        type="submit"
                        disabled={submitting}
                        className={styles.button}
                    >
                        {submitting ? "Registrando..." : "Registrar Empleado"}
                    </button>
                </form>
            </main>
        </div>
    );
}