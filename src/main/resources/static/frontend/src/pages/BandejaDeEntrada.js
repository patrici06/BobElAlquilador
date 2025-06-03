// /*import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { obtenerTodasPreguntas } from "../services/conversacionService";
// import styles from "./BandejaDeEntrada.module.css";

// function BandejaDeEntrada() {
//     const [consultas, setConsultas] = useState([]);
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [responderId, setResponderId] = useState(null);  // ID de consulta a responder
//     const [respuesta, setRespuesta] = useState("");         // Contenido de respuesta
//     const navigate = useNavigate();
//     const [respuestaEnviada, setRespuestaEnviada] = useState(false);


//     /*useEffect(() => {
//         /* DESCOMENTAR ESTO CUANDO FUNCIONE LA BASE DE DATOS!!!! 
//         const fetchConsultas = async () => {
//             try {
//                 const res = await obtenerTodasPreguntas();
//                 setConsultas(Array.isArray(res.data) ? res.data : []);
//                 setError("");
//             } catch (err) {
//                 setError("Error al cargar consultas pendientes.");
//                 setConsultas([]);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         const fetchConsultas = async () => {
//         try {
//             const res = await obtenerTodasPreguntas();
//             setConsultas(Array.isArray(res.data) ? res.data : []);
//             setError("");
//         } catch (err) {
//             console.log("Error real:", err);
//             //setError("Error al cargar consultas pendientes.");
//             // Simulación de datos:
//             setError("");
//             setConsultas([
//                 {
//                     id_conversacion: 1,
//                     cliente: { email: "cliente1@demo.com" },
//                     pregunta: { cuerpo: "¿Cómo puedo alquilar una máquina?" }
//                 },
//                 {
//                     id_conversacion: 2,
//                     cliente: { email: "cliente2@demo.com" },
//                     pregunta: { cuerpo: "Necesito ayuda con mi alquiler." }
//                 }
//             ]);
//         } finally {
//             setLoading(false);
//         }
//     };


//         fetchConsultas();
//     }, []);

//     const handleVerDetalle = (idConversacion) => {
//         navigate(`/conversacion/${idConversacion}`);
//     };

//     const handleResponder = (idConversacion) => {
//         setResponderId(idConversacion);
//     };

//     const handleEnviarRespuesta = (idConversacion) => {
//         console.log("Enviando respuesta para", idConversacion, ":", respuesta);
//         // aca hacer que en la bd se guarde la rta
        
//         // Simular que la consulta fue respondida, eliminándola de la lista
//         setConsultas(prevConsultas => prevConsultas.filter(c => c.id_conversacion !== idConversacion));

//         // Mostrar mensaje verde
//         setRespuestaEnviada(true);

//         // Limpiar campo y cerrar panel
//         setRespuesta("");
//         setResponderId(null);

//         // Ocultar mensaje después de unos segundos
//         setTimeout(() => setRespuestaEnviada(false), 4000);
//     };

    
//     return (
//         <div className={styles.container}>
//             <h1 className={styles.title}>Bandeja de entrada</h1>
//             {respuestaEnviada && (
//             <p style={{ color: "green", fontWeight: "bold" }}>Respuesta enviada correctamente.</p>
//             )}



//             {loading && <p className={styles.loading}>Cargando consultas...</p>}
//             {error && <p className={styles.error}>{error}</p>}

//             {!loading && !error && consultas.length === 0 && (
//                 <p className={styles.empty}>No hay consultas pendientes.</p>
//             )}

//             {!loading && !error && consultas.length > 0 && (
//                 <ul className={styles.list}>
//                     {consultas.map((consulta, index) => (
//                         <li key={index} className={styles.item}>
//                             <p><strong>ID:</strong> {consulta.id_conversacion}</p>
//                             <p><strong>Cliente:</strong> {consulta.cliente?.email}</p>
//                             <p><strong>Consulta:</strong> {consulta.pregunta?.cuerpo}</p>
//                             <button
//                                 onClick={() => handleVerDetalle(consulta.id_conversacion)}
//                                 className={styles.button}
//                             >
//                                 Ver detalle
//                             </button>
//                             <button
//                                 onClick={() => handleResponder(consulta.id_conversacion)}
//                                 className={styles.button}
//                             >
//                                 Responder Consulta
//                             </button>

//                             {responderId === consulta.id_conversacion && (
//                                 <div className={styles.responder}>
//                                     <textarea
//                                         value={respuesta}
//                                         onChange={(e) => setRespuesta(e.target.value)}
//                                         placeholder="Escribe tu respuesta aquí..."
//                                     />
//                                     <button
//                                         onClick={() => handleEnviarRespuesta(consulta.id_conversacion)}
//                                         className={styles.button}
//                                     >
//                                         Enviar Respuesta
//                                     </button>
//                                 </div>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// }

// export default BandejaDeEntrada;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearPregunta } from "../services/conversacionService"; // Asegúrate de que esté bien importado
import styles from "./ConversacionDetalle.module.css"; // O usa tu propio estilo

function CrearConsulta() {
    const [mensaje, setMensaje] = useState("");
    const [exito, setExito] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleEnviarConsulta = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setError("Debes estar autenticado para enviar una consulta.");
            return;
        }

        // Decodificar email desde el token
        let email = "";
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            email = decoded.email || decoded.sub || "";
        } catch (err) {
            setError("Error al decodificar el token.");
            return;
        }

        if (!mensaje.trim()) {
            setError("El mensaje no puede estar vacío.");
            return;
        }

        try {
            await crearPregunta(mensaje, email);
            setExito("Consulta enviada correctamente.");
            setMensaje("");
            setError("");
            setTimeout(() => navigate("/"), 4000); // Redirige al home después de 4 segundos
        } catch (err) {
            setError("Error al enviar la consulta.");
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Nueva Consulta</h1>
            {exito && <p style={{ color: "green" }}>{exito}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe tu consulta aquí..."
                className={styles.textarea}
            />
            <button onClick={handleEnviarConsulta} className={styles.button}>
                Enviar Consulta
            </button>
        </div>
    );
}

export default CrearConsulta;
