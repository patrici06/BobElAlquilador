import React, { useState, useEffect } from "react";
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
    const [tipos, setTipos] = useState([]); // Todos los tipos traídos de la API
    const [tiposSeleccionados, setTiposSeleccionados] = useState([]); // IDs seleccionados
    const [marcas, setMarcas] = useState([]); // Todas las marcas traídas de la API
    const [marcaSeleccionada, setMarcaSeleccionada] = useState(""); // ID seleccionado
    const [precioDia, setPrecioDia] = useState("");
    const [porcentajeReembolso, setPorcentajeReembolso] = useState(""); // Nuevo campo
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const roles = getRolesFromJwt(token);

    // Cargar marcas y tipos desde la API al montar el componente
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const headers = {
            Authorization: `Bearer ${token}`
        };

        fetch("http://localhost:8080/api/tipos", { headers })
            .then(res => {
                if (!res.ok) throw new Error("No autorizado");
                return res.json();
            })
            .then(data => setTipos(data))
            .catch(() => setTipos([]));

        fetch("http://localhost:8080/api/marcas", { headers })
            .then(res => {
                if (!res.ok) throw new Error("No autorizado");
                return res.json();
            })
            .then(data => setMarcas(data))
            .catch(() => setMarcas([]));
    }, [token]);

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

    const handleTipoChange = (e) => {
        const id = e.target.value;
        setTiposSeleccionados(prev =>
            prev.includes(id)
                ? prev.filter(t => t !== id)
                : [...prev, id]
        );
    };

    const handleMarcaChange = (e) => {
        setMarcaSeleccionada(e.target.value);
    };

    const handlePorcentajeReembolsoChange = (e) => {
        // Solo permite números del 0 al 100, con decimales
        const val = e.target.value;
        if (val === "" || (/^\d{0,3}([.,]\d{0,2})?$/.test(val) && val <= 100)) {
            setPorcentajeReembolso(val);
        }
    };

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

            // Marcas: solo una
            formData.append("marcaId", marcaSeleccionada);

            // Tipos: varios, enviar como lista de ids
            tiposSeleccionados.forEach(id => formData.append("tiposIds", id));

            formData.append("precioDia", precioDia);

            // Nuevo campo: porcentaje de reembolso (como double)
            formData.append("porcentajeReembolso", porcentajeReembolso);

            await subirMaquina(formData);
            setSuccess("Máquina registrada exitosamente. Redirigiendo...");
            setTimeout(() => navigate("/"), 1800);
        } catch (err) {
            if (err?.response?.status === 403) {
                setError("No tienes permisos para registrar máquinas.");
            } else {
                setError(err?.response?.data?.mensaje || "Error al registrar máquina");
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

                    {/* Selector de marca: ahora dropdown */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="marcaDropdown" className={styles.label}>Marca</label>
                        <select
                            id="marcaDropdown"
                            className={styles.input}
                            value={marcaSeleccionada}
                            onChange={handleMarcaChange}
                            required
                        >
                            <option value="" disabled>Selecciona una marca</option>
                            {marcas.length === 0
                                ? <option value="">Cargando marcas...</option>
                                : marcas.map(marca => (
                                    <option key={marca.id} value={marca.id}>
                                        {marca.nombre}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Selector de tipos de máquina (checkboxes) */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Tipos de máquina</label>
                        <div>
                            {tipos.length === 0
                                ? <span>Cargando tipos...</span>
                                : tipos.map(tipo => (
                                    <label key={tipo.id} style={{ marginRight: 15 }}>
                                        <input
                                            type="checkbox"
                                            value={tipo.id}
                                            checked={tiposSeleccionados.includes(String(tipo.id))}
                                            onChange={handleTipoChange}
                                        />
                                        {tipo.nombreTipo}
                                    </label>
                                ))
                            }
                        </div>
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

                    {/* Nuevo campo: porcentaje de reembolso */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="porcentajeReembolso" className={styles.label}>Porcentaje de reintegro (%)</label>
                        <input
                            id="porcentajeReembolso"
                            type="number"
                            className={styles.input}
                            value={porcentajeReembolso}
                            onChange={handlePorcentajeReembolsoChange}
                            required
                            placeholder="Porcentaje de reintegro"
                            min="0"
                            max="100"
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