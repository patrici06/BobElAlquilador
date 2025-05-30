import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { perfil, actualizarPerfil } from "../services/authService";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./PerfilUsuario.module.css";

export default function PerfilUsuario() {
    const { email } = useParams();
    const token = localStorage.getItem("token");
    const roles = getRolesFromJwt(token);

    // Estados controlados por input, igual que en Register
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [dni, setDni] = useState("");
    const [telefono, setTelefono] = useState("");
    const [clave, setClave] = useState("");
    const [confirmClave, setConfirmClave] = useState("");
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Carga inicial
    useEffect(() => {
        setLoading(true);
        perfil({ email })
            .then((res) => {
                setUser(res.data);
                setNombre(res.data.nombre || "");
                setApellido(res.data.apellido || "");
                setUserEmail(res.data.email || "");
                setDni(res.data.dni || "");
                setTelefono(res.data.telefono || "");
                setClave("");
                setConfirmClave("");
                setLoading(false);
            })
            .catch(() => {
                setError("No se pudo cargar el usuario.");
                setLoading(false);
            });
    }, [email]);

    useEffect(() => {
        if (editing && user) {
            setNombre(user.nombre || "");
            setApellido(user.apellido || "");
            setUserEmail(user.email || "");
            setDni(user.dni || "");
            setTelefono(user.telefono || "");
            setClave("");
            setConfirmClave("");
        }
    }, [editing, user]);

    // Solo números para teléfono
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setTelefono(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setSuccess("");
        if (clave && clave !== confirmClave) {
            setError("La nueva clave y la confirmación no coinciden.");
            setSubmitting(false);
            return;
        }

        const dataToSend = {
            email: user.email,
            nombre,
            apellido,
            ...(roles.includes("ROLE_CLIENTE") && { telefono }),
        };
        if (clave) dataToSend.clave = clave;

        try {
            const resp = await actualizarPerfil(dataToSend);
            setUser(resp.data);
            setSuccess("Datos actualizados correctamente.");
            setEditing(false);
        } catch (err) {
            setError(err?.response?.data?.mensaje || "Error al actualizar usuario.");
        }
        setSubmitting(false);
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

    // ¡SOLUCIÓN! Formatear fecha sin usar new Date para evitar problemas de zona horaria
    const formatFechaNacimiento = (fecha) => {
        if (!fecha) return "";
        // Espera formato "YYYY-MM-DD"
        const [a, m, d] = fecha.split("-");
        return `${d}/${m}/${a}`;
    };

    if (loading) return <div className={styles.loading}>Cargando datos...</div>;
    if (!user) return <div className={styles.loading}>No se encontró el usuario.</div>;

    return (
        <div className={styles.container}>
            <main className={styles.centeredMain}>
                <section className={styles.profileBox}>
                    <h2 className={styles.title}>Perfil de Usuario</h2>
                    {success && renderFeedback(success, "success")}
                    {!editing ? (
                        <div className={styles.profileData}>
                            <p>
                                <strong>Nombre:</strong> {user.nombre}
                            </p>
                            <p>
                                <strong>Apellido:</strong> {user.apellido}
                            </p>
                            <p>
                                <strong>Email:</strong> {user.email}
                            </p>
                            <p>
                                <strong>DNI:</strong> {user.dni}
                            </p>
                            {user.fechaNacimiento && (
                                <p>
                                    <strong>Fecha de nacimiento:</strong>{" "}
                                    {formatFechaNacimiento(user.fechaNacimiento)}
                                </p>
                            )}
                            {roles.includes("ROLE_CLIENTE") && (
                                <p>
                                    <strong>Teléfono:</strong>{" "}
                                    {user.telefono || <span className={styles.textMuted}>No registrado</span>}
                                </p>
                            )}
                            <button
                                className={styles.button}
                                onClick={() => setEditing(true)}
                            >
                                Editar datos
                            </button>
                        </div>
                    ) : (
                        <form
                            className={styles.form}
                            onSubmit={handleSubmit}
                            autoComplete="off"
                        >
                            <div className={styles.inputGroup}>
                                <label htmlFor="nombre" className={styles.label}>Nombre</label>
                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    className={styles.input}
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                    required
                                    placeholder="Nombre"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="apellido" className={styles.label}>Apellido</label>
                                <input
                                    id="apellido"
                                    name="apellido"
                                    type="text"
                                    className={styles.input}
                                    value={apellido}
                                    onChange={e => setApellido(e.target.value)}
                                    required
                                    placeholder="Apellido"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email" className={styles.label}>Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className={styles.input}
                                    value={userEmail}
                                    readOnly
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="dni" className={styles.label}>DNI</label>
                                <input
                                    id="dni"
                                    name="dni"
                                    type="text"
                                    className={styles.input}
                                    value={dni}
                                    readOnly
                                />
                            </div>
                            {roles.includes("ROLE_CLIENTE") && (
                                <div className={styles.inputGroup}>
                                    <label htmlFor="telefono" className={styles.label}>Teléfono</label>
                                    <input
                                        id="telefono"
                                        name="telefono"
                                        type="text"
                                        className={styles.input}
                                        value={telefono}
                                        onChange={handlePhoneChange}
                                        placeholder="Ej: solo números"
                                        required
                                    />
                                </div>
                            )}
                            <div className={styles.inputGroup}>
                                <label htmlFor="clave" className={styles.label}>Nueva clave</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        id="clave"
                                        name="clave"
                                        type={showPassword ? "text" : "password"}
                                        className={styles.input}
                                        value={clave}
                                        onChange={e => setClave(e.target.value)}
                                        placeholder="Deja vacío para no cambiar"
                                        autoComplete="new-password"
                                    />
                                    <span
                                        className={styles.eyeIcon}
                                        onClick={() => setShowPassword(v => !v)}
                                        tabIndex={0}
                                        aria-label={showPassword ? "Ocultar clave" : "Mostrar clave"}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="confirmClave" className={styles.label}>Confirmar nueva clave</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        id="confirmClave"
                                        name="confirmClave"
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={styles.input}
                                        value={confirmClave}
                                        onChange={e => setConfirmClave(e.target.value)}
                                        placeholder="Repite la nueva clave"
                                        autoComplete="new-password"
                                    />
                                    <span
                                        className={styles.eyeIcon}
                                        onClick={() => setShowConfirmPassword(v => !v)}
                                        tabIndex={0}
                                        aria-label={showConfirmPassword ? "Ocultar clave" : "Mostrar clave"}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>
                            {error && renderFeedback(error, "error")}
                            <button
                                type="submit"
                                className={styles.button}
                                disabled={submitting}
                            >
                                {submitting ? "Guardando..." : "Guardar cambios"}
                            </button>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                disabled={submitting}
                                onClick={() => {
                                    setEditing(false);
                                    setError("");
                                    setSuccess("");
                                    setNombre(user.nombre || "");
                                    setApellido(user.apellido || "");
                                    setUserEmail(user.email || "");
                                    setDni(user.dni || "");
                                    setTelefono(user.telefono || "");
                                    setClave("");
                                    setConfirmClave("");
                                }}
                            >
                                Cancelar
                            </button>
                        </form>
                    )}
                </section>
            </main>
        </div>
    );
}