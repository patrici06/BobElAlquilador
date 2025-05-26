import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { subirMaquina } from "../services/authService";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import styles from "./SubirMaquina.module.css";

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

    // Obtener roles del token JWT
    const token = localStorage.getItem("token");
    const roles = getRolesFromJwt(token);

    // Solo permitir acceso a propietarios
    if (!roles.includes("ROLE_PROPIETARIO")) {
        return (
            <div className={styles.deniedContainer}>
                <div className={styles.deniedBox}>
                    <h2 className={styles.deniedTitle}>
                        403: Permiso denegado
                    </h2>
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

    const renderFeedback = (msg, type) => (
        <div
            className={type === "error" ? styles.errorMsg : styles.successMsg}
            role="alert"
            aria-live="assertive"
        >
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
                            required = false,
                            autoComplete,
                            min,
                            step
                        }) => (
        <div className={styles.inputGroup}>
            <label htmlFor={id} className={styles.label}>{label}</label>
            <input
                id={id}
                type={type}
                className={styles.input}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                autoComplete={autoComplete}
                min={min}
                step={step}
            />
        </div>
    );

    return (
        <div className={styles.container}>
            <main className={styles.centeredMain}>
                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                    autoComplete="off"
                >
                    <h1 className={styles.title}>Subir Máquina</h1>
                    <InputGroup
                        label="Nombre de la máquina"
                        id="nombreMaquina"
                        type="text"
                        value={nombreMaquina}
                        onChange={e => setNombreMaquina(e.target.value)}
                        required
                        placeholder="Nombre de la máquina"
                    />
                    <InputGroup
                        label="Ubicación"
                        id="ubicacion"
                        type="text"
                        value={ubicacion}
                        onChange={e => setUbicacion(e.target.value)}
                        required
                        placeholder="Ubicación"
                    />
                    <InputGroup
                        label="Fecha de ingreso"
                        id="fechaIngreso"
                        type="date"
                        value={fechaIngreso}
                        onChange={e => setFechaIngreso(e.target.value)}
                        required
                        placeholder="Fecha de ingreso"
                    />
                    <InputGroup
                        label="Foto (URL)"
                        id="fotoUrl"
                        type="text"
                        value={fotoUrl}
                        onChange={e => setFotoUrl(e.target.value)}
                        placeholder="Foto (URL)"
                    />
                    <InputGroup
                        label="Descripción"
                        id="descripcion"
                        type="text"
                        value={descripcion}
                        onChange={e => setDescripcion(e.target.value)}
                        placeholder="Descripción"
                    />
                    <InputGroup
                        label="Tipo de máquina"
                        id="tipo"
                        type="text"
                        value={tipo}
                        onChange={e => setTipo(e.target.value)}
                        placeholder="Tipo de máquina"
                    />
                    <InputGroup
                        label="Precio por día"
                        id="precioDia"
                        type="number"
                        value={precioDia}
                        onChange={e => setPrecioDia(e.target.value)}
                        required
                        placeholder="Precio por día"
                        min="0"
                        step="0.01"
                    />
                    {error && renderFeedback(error, "error")}
                    {success && renderFeedback(success, "success")}
                    <button
                        type="submit"
                        disabled={submitting}
                        className={styles.button}
                    >
                        {submitting ? "Registrando..." : "Subir Máquina"}
                    </button>
                </form>
            </main>
        </div>
    );
}

export default SubirMaquina;