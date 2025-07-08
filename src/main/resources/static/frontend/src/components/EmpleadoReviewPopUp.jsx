import React, { useState, useEffect } from "react";
import "../pages/MisAlquileres.css"; // Reutiliza el CSS existente

const StarRating = ({ value, onChange }) => {
    const [hover, setHover] = useState(0);
    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
                <span
                    key={star}
                    className={`star ${(star <= (hover || value)) ? "filled" : ""}`}
                    onClick={() => onChange(star)}
                    onMouseOver={() => setHover(star)}
                    onFocus={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Valorar con ${star} estrella${star > 1 ? "s" : ""}`}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

const EmpleadoReviewPopup = ({
                                 open,
                                 alquilerParaResenia,
                                 emailEmpleado,
                                 onClose,
                                 onReviewSubmitted
                             }) => {
    // Parametrizamos el dni del cliente, permitiendo que el usuario lo modifique si está vacío
    const [dniCliente, setDniCliente] = useState("");
    const [comentario, setComentario] = useState("");
    const [valoracion, setValoracion] = useState(5);
    const [mensaje, setMensaje] = useState("");
    const [enviando, setEnviando] = useState(false);

    // Cargar el dni del cliente al abrir el popup (si está disponible en alquilerParaResenia)
    useEffect(() => {
        if (open) {
            setDniCliente(alquilerParaResenia?.persona?.dni || "");
            setComentario("");
            setValoracion(5);
            setMensaje("");
            setEnviando(false);
        }
    }, [open, alquilerParaResenia]);

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setEnviando(true);

        const endpoint = 'http://localhost:8080/mis-alquileres/resenia';

        const resenaPayload = {
            dniCliente,
            emailEmpleado,
            comentario,
            valoracion
        };

        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resenaPayload)
        })
            .then(response => {
                if (!response.ok) throw new Error("No se pudo enviar la reseña");
                return response.json();
            })
            .then(() => {
                setMensaje("¡Reseña enviada con éxito!");
                if (onReviewSubmitted) onReviewSubmitted();
                setTimeout(() => {
                    setMensaje("");
                    onClose();
                }, 1500);
            })
            .catch(error => {
                setMensaje("Error enviando la reseña: " + error.message);
            })
            .finally(() => setEnviando(false));
    };

    return (
        <div className="review-popup-overlay">
            <div className="review-popup-content">
                <h3 className="review-popup-title">Reseña de Servicio</h3>
                <form onSubmit={handleSubmit} className="review-form">
                    <div className="review-form-group">
                        <label>DNI del cliente:</label>
                        <input
                            type="number"
                            value={dniCliente}
                            onChange={e => setDniCliente(e.target.value)}
                            required
                            disabled={!!alquilerParaResenia?.persona?.dni}
                        />
                    </div>
                    <div className="review-form-group">
                        <label>Email del empleado:</label>
                        <input
                            type="email"
                            value={emailEmpleado}
                            disabled
                        />
                    </div>
                    <div className="review-form-group">
                        <label>Comentario:</label>
                        <textarea
                            value={comentario}
                            onChange={e => setComentario(e.target.value)}
                            required
                            rows={3}
                        />
                    </div>
                    <div className="review-form-group">
                        <label>Valoración:</label>
                        <StarRating value={valoracion} onChange={setValoracion} />
                    </div>
                    <div className="review-form-actions">
                        <button type="submit" className="button-primary" disabled={enviando}>
                            {enviando ? "Enviando..." : "Enviar reseña"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="button-secondary"
                            style={{ marginLeft: "10px" }}
                            disabled={enviando}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
                {mensaje && <p className="review-message">{mensaje}</p>}
            </div>
        </div>
    );
};

export default EmpleadoReviewPopup;