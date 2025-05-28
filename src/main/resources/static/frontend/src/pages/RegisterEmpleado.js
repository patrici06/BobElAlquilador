import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerEmpleado } from "../services/authService";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import styles from "./RegisterEmpleado.module.css";

function RegisterEmpleado() {
    const [dni, setDni] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    // Obtener roles del token JWT (si el usuario cambia, se actualiza al refrescar la página)
    const token = sessionStorage.getItem("token");
    const roles = getRolesFromJwt(token); // Siempre será un array

    // Solo permitir acceso a propietarios
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
        <div className={type === "error" ? styles.errorMsg : styles.successMsg} role="alert" aria-live="assertive">
            {msg}
        </div>
    );

    const InputGroup = ({
                            label,
                            id,
                            type,
                            value,
                            onChange,
                            placeholder,
                            required = true,
                            autoComplete,
                        }) => (
        <div className={styles.inputGroup}>
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            <input
                id={id}
                type={type}
                className={styles.input}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                autoComplete={autoComplete}
            />
        </div>
    );

    return (
        <div className={styles.container}>
            <main className={styles.centeredMain}>
                <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
                    <h1 className={styles.title}>Registrar Empleado</h1>
                    <InputGroup
                        label="DNI"
                        id="dni"
                        type="text"
                        value={dni}
                        onChange={e => setDni(e.target.value)}
                        placeholder="Ingresa el DNI"
                    />
                    <InputGroup
                        label="Nombre"
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        placeholder="Ingresa el nombre"
                    />
                    <InputGroup
                        label="Apellido"
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        placeholder="Ingresa el apellido"
                    />
                    <InputGroup
                        label="Email"
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Ingresa el email"
                        autoComplete="new-email"
                    />
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

export default RegisterEmpleado;