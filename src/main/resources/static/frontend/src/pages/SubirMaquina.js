import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { subirMaquina } from "../services/authService";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import styles from "./SubirMaquina.module.css";

function SubirMaquina() {
    const [nombreMaquina, setNombreMaquina] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [fechaIngreso, setFechaIngreso] = useState("");
    const [foto, setFoto] = useState(null);
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
            const formData = new FormData();
            formData.append("nombreMaquina", nombreMaquina);
            formData.append("ubicacion", ubicacion);
            formData.append("fechaIngreso", fechaIngreso);
            if (foto) formData.append("foto", foto);
            formData.append("descripcion", descripcion);
            formData.append("tipo", tipo);
            formData.append("precioDia", precioDia);

            await subirMaquina(formData);
            setSuccess("Máquina registrada exitosamente. Redirigiendo...");
            setTimeout(() => navigate("/"), 1800);
        } catch (err) {
            if (err?.response?.status === 403) {
                setError("No tienes permisos para registrar máquinas.");
            } else {
                setError(err?.response?.data?.mensaje);
            }
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <main className={styles.centeredMain}>
                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    encType="multipart/form-data"
                >
                    <h1 className={styles.title}>Subir Máquina</h1>
                    <div className={styles.inputGroup}>
                        <label htmlFor="nombreMaquina" className={styles.label}>Nombre de la máquina</label>
                        <input
                            id="nombreMaquina"
                            type="text"
                            className={styles.input}
                            value={nombreMaquina}
                            onChange={e => setNombreMaquina(e.target.value)}
                            required
                            placeholder="Nombre de la máquina"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="ubicacion" className={styles.label}>Ubicación</label>
                        <input
                            id="ubicacion"
                            type="text"
                            className={styles.input}
                            value={ubicacion}
                            onChange={e => setUbicacion(e.target.value)}
                            required
                            placeholder="Ubicación"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="fechaIngreso" className={styles.label}>Fecha de ingreso</label>
                        <input
                            id="fechaIngreso"
                            type="date"
                            className={styles.input}
                            value={fechaIngreso}
                            onChange={e => setFechaIngreso(e.target.value)}
                            required
                            placeholder="Fecha de ingreso"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="foto" className={styles.label}>Foto</label>
                        <input
                            id="foto"
                            type="file"
                            className={styles.input}
                            onChange={e => setFoto(e.target.files[0])}
                            accept="image/*"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="descripcion" className={styles.label}>Descripción</label>
                        <input
                            id="descripcion"
                            type="text"
                            className={styles.input}
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                            placeholder="Descripción"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="tipo" className={styles.label}>Tipo de máquina</label>
                        <input
                            id="tipo"
                            type="text"
                            className={styles.input}
                            value={tipo}
                            onChange={e => setTipo(e.target.value)}
                            placeholder="Tipo de máquina"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="precioDia" className={styles.label}>Precio por día</label>
                        <input
                            id="precioDia"
                            type="number"
                            className={styles.input}
                            value={precioDia}
                            onChange={e => setPrecioDia(e.target.value)}
                            required
                            placeholder="Precio por día"
                            min="0"
                            step="0.01"
                        />
                    </div>
                    {error && <div className={styles.errorMsg}>{error}</div>}
                    {success && <div className={styles.successMsg}>{success}</div>}
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