import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { perfil, actualizarPerfil } from "../services/authService";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./PerfilUsuario.module.css";

function PerfilUsuario() {
    const { email } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const roles = getRolesFromJwt(token);

    const [user, setUser] = useState(null);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        setLoading(true);
        perfil({ email })
            .then((res) => {
                setUser(res.data);
                setEditData(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("No se pudo cargar el usuario.");
                setLoading(false);
            });
    }, [email]);

    useEffect(() => {
        if (editing) {
            setEditData((prev) => ({ ...prev, clave: "" }));
            setConfirmPassword("");
        }
    }, [editing]);

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setEditData({ ...editData, clave: e.target.value });
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setSuccess("");

        if (editData.clave && editData.clave !== confirmPassword) {
            setError("La nueva clave y la confirmación no coinciden.");
            setSubmitting(false);
            return;
        }

        const dataToSend = {
            email: user.email,
            nombre: editData.nombre,
            apellido: editData.apellido,
            ...(roles.includes("ROLE_CLIENTE") && { telefono: editData.telefono }),
        };
        if (editData.clave) dataToSend.clave = editData.clave;

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

    const InputGroup = ({
                            label,
                            id,
                            type,
                            name,
                            value,
                            onChange,
                            placeholder,
                            autoComplete,
                            readOnly = false,
                            required = false,
                            disabled = false,
                            children,
                            pattern,
                        }) => (
        <div className={styles.inputGroup}>
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            <div className={styles.inputWrapper}>
                <input
                    id={id}
                    name={name}
                    type={type}
                    className={styles.input}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    readOnly={readOnly}
                    required={required}
                    disabled={disabled}
                    pattern={pattern}
                />
                {children}
            </div>
        </div>
    );

    const formatFechaNacimiento = (fecha) => {
        if (!fecha) return "";
        try {
            const d = new Date(fecha);
            return d.toLocaleDateString();
        } catch {
            return "";
        }
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
                            <InputGroup
                                label="Nombre"
                                id="nombre"
                                name="nombre"
                                type="text"
                                value={editData.nombre || ""}
                                onChange={handleChange}
                                placeholder="Nombre"
                                required
                            />
                            <InputGroup
                                label="Apellido"
                                id="apellido"
                                name="apellido"
                                type="text"
                                value={editData.apellido || ""}
                                onChange={handleChange}
                                placeholder="Apellido"
                                required
                            />
                            <InputGroup
                                label="Email"
                                id="email"
                                name="email"
                                type="email"
                                value={editData.email || ""}
                                readOnly
                            />
                            <InputGroup
                                label="DNI"
                                id="dni"
                                name="dni"
                                type="text"
                                value={editData.dni || ""}
                                readOnly
                            />
                            {/* LA FECHA DE NACIMIENTO NO SE INCLUYE EN EDICIÓN */}
                            {roles.includes("ROLE_CLIENTE") && (
                                <InputGroup
                                    label="Teléfono"
                                    id="telefono"
                                    name="telefono"
                                    type="tel"
                                    value={editData.telefono || ""}
                                    onChange={handleChange}
                                    placeholder="Ej: 11 1234-5678"
                                    required
                                    pattern="[0-9+()\- ]*"
                                />
                            )}
                            <InputGroup
                                label="Nueva clave"
                                id="clave"
                                name="clave"
                                type={showPassword ? "text" : "password"}
                                value={editData.clave || ""}
                                onChange={handlePasswordChange}
                                placeholder="Deja vacío para no cambiar"
                                autoComplete="new-password"
                            >
                                <span
                                    className={styles.eyeIcon}
                                    onClick={() => setShowPassword((v) => !v)}
                                    tabIndex={0}
                                    aria-label={showPassword ? "Ocultar clave" : "Mostrar clave"}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </InputGroup>
                            <InputGroup
                                label="Confirmar nueva clave"
                                id="confirmClave"
                                name="confirmClave"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                placeholder="Repite la nueva clave"
                                autoComplete="new-password"
                            >
                                <span
                                    className={styles.eyeIcon}
                                    onClick={() => setShowConfirmPassword((v) => !v)}
                                    tabIndex={0}
                                    aria-label={showConfirmPassword ? "Ocultar clave" : "Mostrar clave"}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </InputGroup>
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
                                    setEditData(user);
                                    setConfirmPassword("");
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

export default PerfilUsuario;