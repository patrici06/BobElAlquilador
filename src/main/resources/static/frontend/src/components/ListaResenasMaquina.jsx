import React, { useEffect, useState } from "react";
import './ListaResenasMaquina.css';
import { jwtDecode } from "jwt-decode";

function formatearFecha(fechaStr) {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    if (isNaN(fecha)) return fechaStr;
    return fecha.toLocaleDateString("es-AR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function ListaResenasMaquina({ nombreMaquina, visible, onClose }) {
    const [resenas, setResenas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eliminandoId, setEliminandoId] = useState(null);
    const [email, setEmail] = useState("");

    // Obtener el email del usuario logueado desde el token JWT en sessionStorage
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        let email = "";
        if (token) {
            try {
                const decoded = jwtDecode(token);
                email = decoded.email || decoded.sub || "";
            } catch (e) {
                email = "";
            }
        }
        setEmail(email);
    }, []);

    useEffect(() => {
        if (!visible) return;
        setLoading(true);
        fetch(
            `http://localhost:8080/resena/maquina/search?nombreMaquina=${encodeURIComponent(nombreMaquina)}`
        )
            .then((res) => res.json())
            .then((data) => setResenas(data))
            .catch(() => setResenas([]))
            .finally(() => setLoading(false));
    }, [nombreMaquina, visible]);

    // Función para eliminar reseña
    const eliminarResena = async (id) => {
        if (!window.confirm("¿Está seguro de que desea eliminar esta reseña?")) return;
        setEliminandoId(id);
        try {
            const res = await fetch(`http://localhost:8080/resena/maquina/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                // El backend retorna el mensaje como texto plano
                const msg = await res.text();
                alert(msg || "Reseña eliminada correctamente, puede dejar una nueva si desea");
                setResenas(resenas.filter(r => r.id_resena !== id));
            } else {
                // Si hubo error, intenta obtener el mensaje de error en formato JSON
                const data = await res.json();
                alert(data.mensaje || "Error al eliminar la reseña");
            }
        } catch (e) {
            alert("Error de conexión al eliminar la reseña");
        } finally {
            setEliminandoId(null);
        }
    };

    if (!visible) return null;

    return (
        <div className="lista-resenas-container">
            <button onClick={onClose} style={{ float: 'right', marginBottom: 8 }}>Cerrar</button>
            <h3>Reseñas para {nombreMaquina}</h3>
            {loading ? (
                <p>Cargando reseñas...</p>
            ) : resenas.length === 0 ? (
                <p>No hay reseñas para esta máquina.</p>
            ) : (
                <ul>
                    {resenas.map((res) => {
                        // El email puede estar en res.persona.email o res.cliente.email
                        const emailAutor = res.persona?.email || res.cliente?.email;
                        const puedeEliminar = email && emailAutor && email === emailAutor;
                        return (
                            <li key={res.id_resena || Math.random()}>
                                <strong>{res.valoracion}★</strong> {res.comentario}
                                <small>
                                    {' - '}
                                    {res.persona?.nombre || res.cliente?.nombre}
                                    {res.fechaCreacion && (
                                        <span style={{ marginLeft: 8, color: "#888", fontStyle: "normal" }}>
                                            ({formatearFecha(res.fechaCreacion)})
                                        </span>
                                    )}
                                </small>
                                {puedeEliminar && (
                                    <button
                                        className="eliminar-resena-btn"
                                        onClick={() => eliminarResena(res.id_resena)}
                                        disabled={eliminandoId === res.id_resena}
                                        style={{
                                            marginLeft: 16,
                                            background: "#fff0f0",
                                            color: "#b30000",
                                            border: "1px solid #e63946",
                                            borderRadius: 6,
                                            padding: "4px 12px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {eliminandoId === res.id_resena ? "Eliminando..." : "Eliminar"}
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}