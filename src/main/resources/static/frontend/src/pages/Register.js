import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./Register.module.css";

function Register() {
    const [dni, setDni] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await register({
                dni, nombre: firstName, apellido: lastName, email, telefono: phone, clave: password, fechaNacimiento: birthDate
            });
            setSuccess(response.data.mensaje);
            localStorage.setItem("token", response.data.token);
            setTimeout(() => navigate("/"), 1800);
        } catch (err) {
            setError(err?.response?.data?.mensaje || "Error al registrarse");
        }
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

    const InputGroup = ({ label, id, type, value, onChange, placeholder, required = true, autoComplete, children }) => (
        <div className={styles.inputGroup}>
            <label htmlFor={id} className={styles.label}>{label}</label>
            <div className={styles.inputWrapper}>
                <input
                    id={id}
                    type={type}
                    className={styles.input}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                />
                {children}
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <main className={styles.centeredMain}>
                <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
                    <h1 className={styles.title}>Registro</h1>
                    <div className={styles.grid}>
                        <InputGroup
                            label="DNI"
                            id="dni"
                            type="text"
                            value={dni}
                            onChange={e => setDni(e.target.value)}
                            placeholder="DNI"
                        />
                        <InputGroup
                            label="Nombre"
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            placeholder="Nombre"
                        />
                        <InputGroup
                            label="Apellido"
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            placeholder="Apellido"
                        />
                        <InputGroup
                            label="Email"
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                        <InputGroup
                            label="Teléfono"
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="Teléfono"
                        />
                        <InputGroup
                            label="Nacimiento"
                            id="birthDate"
                            type="date"
                            value={birthDate}
                            onChange={e => setBirthDate(e.target.value)}
                            placeholder="Fecha de nacimiento"
                        />
                        <InputGroup
                            label="Clave"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Clave"
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
                            label="Repetir Clave"
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Repetir clave"
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
                    </div>
                    {error && renderFeedback(error, "error")}
                    {success && renderFeedback(success, "success")}
                    <button type="submit" className={styles.button}>
                        Registrarse
                    </button>
                </form>
            </main>
        </div>
    );
}

export default Register;