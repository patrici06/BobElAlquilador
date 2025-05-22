import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { perfil, actualizarPerfil } from "../services/authService";
import { getUserRoles } from "../utils/authUtils";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function PerfilUsuario() {
    const { email } = useParams();
    const rawRoles = localStorage.getItem("rol");
    const roles = getUserRoles(rawRoles);

    const [usuario, setUsuario] = useState(null);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setLoading(true);
        perfil({ email })
            .then(res => {
                setUsuario(res.data);
                setEditData(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("No se pudo cargar el usuario.");
                setLoading(false);
            });
    }, [email]);

    useEffect(() => {
        if (editando) setEditData(prev => ({ ...prev, clave: "" }));
    }, [editando]);

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setSuccess("");
        const dataToSend = { email, ...editData };
        if (!dataToSend.clave) delete dataToSend.clave;
        try {
            const resp = await actualizarPerfil(dataToSend);
            setUsuario(resp.data);
            setSuccess("Datos actualizados correctamente.");
            setEditando(false);
        } catch (err) {
            setError(err?.response?.data?.mensaje || "Error al actualizar usuario.");
        }
        setSubmitting(false);
    };

    if (loading) return <div>Cargando datos...</div>;
    if (!usuario) return <div>No se encontró el usuario.</div>;

    return (
        <div
            style={{
                maxWidth: "400px",
                margin: "2rem auto",
                background: "#232323",
                borderRadius: "12px",
                boxShadow: "0 4px 32px 0 rgba(0,0,0,0.08)",
                padding: "2.5rem 2rem"
            }}
        >
            <style>{`
                input::placeholder {
                    text-align: center;
                }
            `}</style>
            <h2 style={{ textAlign: "center", color: "#e7e4d8" }}>Perfil de Usuario</h2>
            {success && <div style={{
                color: "#10ac84",
                background: "#e6fffa",
                borderRadius: "5px",
                padding: "0.7rem",
                textAlign: "center",
                fontWeight: 500,
                fontSize: "1rem",
                width: "100%",
                marginBottom: "1rem"
            }}>
                {success}
            </div>}
            {!editando ? (
                <div style={{ textAlign: "center" }}>
                    <p><strong>Nombre:</strong> {usuario.nombre}</p>
                    <p><strong>Apellido:</strong> {usuario.apellido}</p>
                    <p><strong>Email:</strong> {usuario.email}</p>
                    <p><strong>DNI:</strong> {usuario.dni}</p>
                    {roles.includes("ROLE_CLIENTE") && (
                        <p>
                            <strong>Teléfono:</strong>{" "}
                            {usuario.telefono || (
                                <span style={{ color: "#999" }}>No registrado</span>
                            )}
                        </p>
                    )}
                    <button
                        style={{
                            width: "100%",
                            padding: "0.8rem",
                            background: "#10ac84",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            cursor: "pointer",
                            marginTop: "0.7rem"
                        }}
                        onClick={() => setEditando(true)}
                    >
                        Editar datos
                    </button>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.2rem",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    {/* Nombre */}
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <label style={{ width: "100%", textAlign: "center", color: "#e7e4d8" }}>Nombre</label>
                        <input
                            name="nombre"
                            value={editData.nombre || ""}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                maxWidth: "350px",
                                padding: "0.7rem",
                                borderRadius: "6px",
                                border: "1px solid #6ee7b7",
                                background: "#363636",
                                color: "#fafafa",
                                fontWeight: 500,
                                textAlign: "center",
                                outline: "none"
                            }}
                            required
                        />
                    </div>
                    {/* Apellido */}
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <label style={{ width: "100%", textAlign: "center", color: "#e7e4d8" }}>Apellido</label>
                        <input
                            name="apellido"
                            value={editData.apellido || ""}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                maxWidth: "350px",
                                padding: "0.7rem",
                                borderRadius: "6px",
                                border: "1px solid #6ee7b7",
                                background: "#363636",
                                color: "#fafafa",
                                fontWeight: 500,
                                textAlign: "center",
                                outline: "none"
                            }}
                            required
                        />
                    </div>
                    {/* Email */}
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <label style={{ width: "100%", textAlign: "center", color: "#e7e4d8" }}>Email</label>
                        <input
                            name="email"
                            value={editData.email || ""}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                maxWidth: "350px",
                                padding: "0.7rem",
                                borderRadius: "6px",
                                border: "1px solid #6ee7b7",
                                background: "#363636",
                                color: "#fafafa",
                                fontWeight: 500,
                                textAlign: "center",
                                outline: "none"
                            }}
                            required
                            type="email"
                        />
                    </div>
                    {/* DNI */}
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <label style={{ width: "100%", textAlign: "center", color: "#e7e4d8" }}>DNI</label>
                        <input
                            name="dni"
                            value={editData.dni || ""}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                maxWidth: "350px",
                                padding: "0.7rem",
                                borderRadius: "6px",
                                border: "1px solid #6ee7b7",
                                background: "#363636",
                                color: "#fafafa",
                                fontWeight: 500,
                                textAlign: "center",
                                outline: "none"
                            }}
                            required
                        />
                    </div>
                    {/* Teléfono */}
                    {roles.includes("ROLE_CLIENTE") && (
                        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <label style={{ width: "100%", textAlign: "center", color: "#e7e4d8" }}>Teléfono</label>
                            <input
                                name="telefono"
                                value={editData.telefono || ""}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    maxWidth: "350px",
                                    padding: "0.7rem",
                                    borderRadius: "6px",
                                    border: "1px solid #6ee7b7",
                                    background: "#363636",
                                    color: "#fafafa",
                                    fontWeight: 500,
                                    textAlign: "center",
                                    outline: "none"
                                }}
                                required
                                type="tel"
                                pattern="[0-9+()\- ]*"
                                placeholder="Ej: 11 1234-5678"
                            />
                        </div>
                    )}
                    {/* Nueva clave */}
                    <div style={{width: "100%",display: "flex",flexDirection: "column",alignItems: "center",position: "relative"}}>
                        <label style={{ width: "100%", textAlign: "center", color: "#e7e4d8" }}>
                            Nueva clave
                        </label>
                        <div style={{
                            position: "relative",
                            width: "100%",
                            maxWidth: "350px",
                            display: "flex",
                            alignItems: "center",
                        }}>
                            <input
                                name="clave"
                                type={showPassword ? "text" : "password"}
                                value={editData.clave || ""}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    padding: "0.7rem 2.4rem 0.7rem 0.7rem",
                                    borderRadius: "6px",
                                    border: "1px solid #6ee7b7",
                                    background: "#363636",
                                    color: "#fafafa",
                                    fontWeight: 500,
                                    textAlign: "center",
                                    outline: "none"
                                }}
                                placeholder="Deja vacío para no cambiar"
                                autoComplete="new-password"
                            />
                            <span
                                style={{
                                    position: "absolute",
                                    right: "0.7rem",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#bfbfbf"
                                }}
                                onClick={() => setShowPassword((v) => !v)}
                                tabIndex={0}
                                aria-label={showPassword ? "Ocultar clave" : "Mostrar clave"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    {/* Mensajes */}
                    {error && <div style={{
                        color: "#ee5253", background: "#ffeaea", borderRadius: "5px",
                        padding: "0.7rem", textAlign: "center", fontWeight: 500, fontSize: "1rem", width: "100%"
                    }}>{error}</div>}
                    {/* Botones */}
                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            width: "100%",
                            maxWidth: "350px",
                            padding: "0.8rem",
                            background: submitting ? "#bdbdbd" : "#10ac84",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            cursor: submitting ? "not-allowed" : "pointer",
                            marginTop: "0.7rem"
                        }}
                    >
                        {submitting ? "Guardando..." : "Guardar cambios"}
                    </button>
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={() => { setEditando(false); setError(""); setSuccess(""); setEditData(usuario); }}
                        style={{
                            width: "100%",
                            maxWidth: "350px",
                            padding: "0.8rem",
                            background: "#ee5253",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            cursor: submitting ? "not-allowed" : "pointer",
                            marginTop: "0.7rem"
                        }}
                    >
                        Cancelar
                    </button>
                </form>
            )}
        </div>
    );
}

export default PerfilUsuario;