import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getConversacionPorId, crearConversacion } from "../services/conversacionService";
import { getMensajesDeConversacion, crearMensaje } from "../services/mensajeService";
import { getRolesFromJwt } from "../utils/getUserRolesFromJwt";
import styles from "./ConversacionDetalle.module.css";

function ConversacionDetalle({ nueva }) {
    const { idConversacion } = useParams();
    const navigate = useNavigate();
    const [conversacion, setConversacion] = useState(null);
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const roles = getRolesFromJwt(token);
    const [conversacionId, setConversacionId] = useState(idConversacion);
    const [exito, setExito] = useState("");
    const [contador, setContador] = useState(60);
    const esCliente = roles.includes("ROLE_CLIENTE");
    const esEmpleado = roles.includes("ROLE_EMPLEADO");
    console.log("Roles:", roles);
    console.log("esCliente:", esCliente, "esEmpleado:", esEmpleado);



    useEffect(() => {
        const fetchData = async () => {
            try {
                if (nueva) {
                    // Crear conversación y redirigir al detalle
                    const email = JSON.parse(atob(token.split('.')[1])).email;
                    const convData = {
                        cliente: { email: email },  
                        fechaCreacion: new Date().toISOString()
                    };
                    const res = await crearConversacion(convData);
                    const newId = res.data.id_conversacion;
                    localStorage.setItem("conversacionActiva", "true");
                    setConversacion(res.data);             // guardo conversación creada
                    setConversacionId(newId);    
                    navigate(`/conversacion/${newId}`);
                } else {
                    const convRes = await getConversacionPorId(idConversacion);
                    const msjRes = await getMensajesDeConversacion(idConversacion);
                    setConversacion(convRes.data);
                    setMensajes(Array.isArray(msjRes.data) ? msjRes.data : []);  
                }
            } catch (err) {
                if (err?.response?.status !== 404) {  
                    setError(err?.response?.data?.mensaje || "Error al cargar la conversación.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [idConversacion, nueva, token, roles, navigate]);

     const yaRespondido = mensajes.some(m => m.rolEmisor === "EMPLEADO");

    const handleEnviarMensaje = async () => {
        if (nuevoMensaje.trim() === "") {
            setError("El mensaje no puede estar vacío.");
            return;
        }
        try {
            const mensajeObj = {
                contenido: nuevoMensaje,
                //rolEmisor: roles.includes("ROLE_CLIENTE") ? "CLIENTE" : "EMPLEADO"
                rolEmisor: esCliente ? "CLIENTE" : "EMPLEADO"
            };
            await crearMensaje(conversacionId, mensajeObj);
            const updatedMsgs = await getMensajesDeConversacion(conversacionId);
            setMensajes(Array.isArray(updatedMsgs.data) ? updatedMsgs.data : []);  
            setNuevoMensaje("");
            setError("");
            setExito(esCliente ? "Su consulta se envió correctamente." : "Respuesta enviada correctamente.");


            setContador(60);
            setTimeout(() => {
                localStorage.removeItem("conversacionActiva");
                window.location.href = '/';
            }, 60000);  // 60 segundos exactos

        } catch (err) {
            setError(err?.response?.data?.mensaje || "Error al enviar el mensaje.");
        }
    };

    // ------------- CONTADOR PARA REDIRIGIR A MENU PPAL AUTOMÁTICAMENTE -------------
    useEffect(() => {
        let interval;
        if (exito) {
            interval = setInterval(() => {
                setContador(prev => prev > 0 ? prev - 1 : 0);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [exito]);



    // ----------------------- RESPUESTA AL INGRESAR EL MENSAJE -----------------------
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Detalles de la conversación</h1>

            {loading && <p className={styles.loading}>Cargando...</p>}
            {/*{error && <p className={styles.error}>{error}</p>}*/}
            {exito && <p className={styles.exito}>{exito}</p>}


            {conversacion && (
                <div className={styles.info}>
                    <p><strong>ID:</strong> {conversacion.id_conversacion}</p>
                    <p><strong>Cliente:</strong> {conversacion.cliente?.nombre} ({conversacion.cliente?.email})</p>
                    <p><strong>Empleado:</strong> {conversacion.empleado?.nombre || "No asignado"} ({conversacion.empleado?.email || "-"})</p>
                    <p><strong>Fecha:</strong> {new Date(conversacion.fechaCreacion).toLocaleString()}</p>
                </div>
            )}

            <ul className={styles.mensajes}>
                {mensajes.map(m => (
                    <li key={m.id_mensaje} className={styles.mensaje}>
                        <strong>{m.rolEmisor}:</strong> <span className={styles.contenido}>{m.contenido}</span> 
                        <br/>
                        <small>{new Date(m.fechaEnvio).toLocaleString()}</small>
                    </li>
                ))}
            </ul>

            {token && conversacionId && !exito && esCliente &&(
                <div className={styles.nuevoMensaje}>
                    <textarea
                        value={nuevoMensaje}
                        onChange={e => setNuevoMensaje(e.target.value)}
                        placeholder="Escriba su consulta aquí..."
                        className={styles.textarea}
                    />
                    <button onClick={handleEnviarMensaje} className={styles.button}>
                        Enviar
                    </button>
                </div>
            )}

            {token && conversacionId && (esEmpleado && !yaRespondido) && (
                <div className={styles.nuevoMensaje}>
                    <textarea
                        value={nuevoMensaje}
                        onChange={e => setNuevoMensaje(e.target.value)}
                        placeholder="Escriba su respuesta aquí..."
                        className={styles.textarea}
                    />
                    <button onClick={handleEnviarMensaje} className={styles.button}>
                        Enviar
                    </button>
                </div>
            )}

            {/* Mostrar botones si se envió la consulta */}
            {exito && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
                    <button
                        
                        onClick={() => {
                            localStorage.removeItem("conversacionActiva");
                            window.location.href = '/'; 
                        }}
                        
                        style={{
                            padding: '0.6rem 1.2rem',
                            background: '#ac1010',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            //marginRight: '1rem',
                            width: '220px',
                            marginBottom: '1rem'
                        }}
                    >
                        Volver al Menú Principal
                    </button>

                    <button
                        onClick={() => {
                            setExito("");
                            setNuevoMensaje("");
                        }}
                        style={{
                            padding: '0.6rem 1.2rem',
                            background: '#ac1010',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            width: '220px'
                        }}
                    >
                        Realizar otra Consulta
                    </button>
                    <p style={{ color: 'gray', marginTop: '1rem' }}>
                        El sistema volverá al menú principal en {contador} segundos si no se selecciona una opción...
                    </p>
                </div>
            )}
        </div>        
    );
}

export default ConversacionDetalle;
