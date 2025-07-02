import React, { useState } from "react";
import "./FormularioResenaMaquina.css";

// Popup de reseña de máquina, adaptado al estilo de tu sistema y 100% popup real
export default function FormularioResenaMaquina({
                                                    email,
                                                    nombreMaquina,
                                                    onResenaCreada,
                                                    onClose,
                                                }) {
    const [comentario, setComentario] = useState("");
    const [valoracion, setValoracion] = useState(5);
    const [mensaje, setMensaje] = useState("");
    const [enviando, setEnviando] = useState(false);

    // Permite cerrar haciendo click afuera del cuadro
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("review-popup-overlay")) {
            onClose && onClose();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setMensaje("");
        try {
            const response = await fetch(
                `http://localhost:8080/resena/maquina/crearResenia/${email}-${nombreMaquina}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ comentario, valoracion }),
                }
            );
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text);
            }
            setMensaje("¡Reseña enviada con éxito!");
            setComentario("");
            setValoracion(5);
            if (onResenaCreada) onResenaCreada();
            if (onClose) setTimeout(onClose, 1200);
        } catch (err) {
            setMensaje(err.message|| "No se pudo enviar la reseña");
        } finally {
            setEnviando(false);
        }
    };

    // Estrellas interactivas como el popup de referencia
    const StarRating = ({ value, onChange }) => {
        const [hover, setHover] = useState(0);
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= (hover || value) ? "filled" : ""}`}
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

    return (
        <div className="review-popup-overlay" onClick={handleOverlayClick}>
            <div className="review-popup-content" role="dialog" aria-modal="true">
                <h3 className="review-popup-title">
                    Dejar una reseña para&nbsp;
                    <span style={{ color: "#b30000" }}>{nombreMaquina}</span>
                </h3>
                <form className="review-form" onSubmit={handleSubmit} autoComplete="off">
                    <div className="review-form-group">
                        <label htmlFor="comentario">Comentario:</label>
                        <textarea
                            id="comentario"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            required
                            rows={3}
                            placeholder="Escribe tu opinión..."
                        />
                    </div>
                    <div className="review-form-group">
                        <label>Valoración:</label>
                        <StarRating value={valoracion} onChange={setValoracion} />
                    </div>
                    <div className="review-form-actions">
                        <button
                            type="submit"
                            className="button-primary"
                            disabled={enviando}
                        >
                            {enviando ? "Enviando..." : "Enviar Reseña"}
                        </button>
                        <button
                            type="button"
                            className="button-secondary"
                            onClick={onClose}
                            disabled={enviando}
                        >
                            Cancelar
                        </button>
                    </div>
                    {mensaje && <div className="review-message">{mensaje}</div>}
                </form>
            </div>
        </div>
    );
}