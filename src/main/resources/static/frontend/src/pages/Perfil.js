import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { perfil, actualizarPerfil } from "../services/authService";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./PerfilUsuario.module.css";

export default function PerfilUsuario() {
    const { email } = useParams();
    const token = sessionStorage.getItem("token");
    const roles = getRolesFromJwt(token);

    // Estados controlados por input
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [dni, setDni] = useState("");
    const [telefono, setTelefono] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState(""); // NUEVO
    const [claveAnterior, setClaveAnterior] = useState("");
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
    const [showOldPassword, setShowOldPassword] = useState(false);

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
                setFechaNacimiento(res.data.fechaNacimiento || ""); // NUEVO
                setClave("");
                setConfirmClave("");
                setClaveAnterior("");
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
            setFechaNacimiento(user.fechaNacimiento || ""); // NUEVO
            setClave("");
            setConfirmClave("");
            setClaveAnterior("");
        }
    }, [editing, user]);

    // Solo números para teléfono
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setTelefono(value);
    };

    // Fecha en formato YYYY-MM-DD para el input type="date"
    const toInputDate = (fecha) => {
        if (!fecha) return "";
        // Si ya está en formato YYYY-MM-DD, retorna tal cual
        if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
        // Caso contrario, intenta parsear
        const [a, m, d] = fecha.split("-");
        if (a && m && d) return `${a.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        return "";
    };

    // Mostrar fecha en formato DD/MM/YYYY
    const formatFechaNacimiento = (fecha) => {
        if (!fecha) return "";
        const [a, m, d] = fecha.split("-");
        if (a && m && d) return `${d}/${m}/${a}`;
        return fecha;
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
        // Verifica que se ingrese la clave anterior si se quiere cambiar la clave
        if (clave && !claveAnterior) {
            setError("Debes ingresar la clave anterior para cambiar la contraseña.");
            setSubmitting(false);
            return;
        }
        const dataToSend = {
            email: user.email,
            nombre,
            apellido,
            fechaNacimiento, // NUEVO
            ...(roles.includes("ROLE_CLIENTE") && { telefono }),
            ...(clave && { clave }),
            ...(clave && { claveAnterior }),
        };

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
                            <p><strong>Nombre:</strong> {user.nombre}</p>
                            <p><strong>Apellido:</strong> {user.apellido}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>DNI:</strong> {user.dni}</p>
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

                            {/* Fecha de nacimiento */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="fechaNacimiento" className={styles.label}>Fecha de nacimiento</label>
                                <input
                                    id="fechaNacimiento"
                                    name="fechaNacimiento"
                                    type="date"
                                    className={styles.input}
                                    value={toInputDate(fechaNacimiento)}
                                    onChange={e => setFechaNacimiento(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Clave anterior */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="claveAnterior" className={styles.label}>Clave anterior</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        id="claveAnterior"
                                        name="claveAnterior"
                                        type={showOldPassword ? "text" : "password"}
                                        className={styles.input}
                                        value={claveAnterior}
                                        onChange={e => setClaveAnterior(e.target.value)}
                                        placeholder="Ingresa la clave anterior"
                                        autoComplete="current-password"
                                    />
                                    <span
                                        className={styles.eyeIcon}
                                        onClick={() => setShowOldPassword(v => !v)}
                                        tabIndex={0}
                                        aria-label={showOldPassword ? "Ocultar clave" : "Mostrar clave"}
                                    >
                                        {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>

                            {/* Nueva clave */}
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

                            {/* Confirmar nueva clave */}
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
                                    setFechaNacimiento(user.fechaNacimiento || "");
                                    setClave("");
                                    setConfirmClave("");
                                    setClaveAnterior("");
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