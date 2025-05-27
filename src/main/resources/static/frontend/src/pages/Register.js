import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.css";

export default function Register() {
    const [dni, setDni] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    // Solo permite números en DNI y teléfono
    const handleDniChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setDni(value);
    };
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setPhone(value);
    };

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
                dni,
                nombre: firstName,
                apellido: lastName,
                email,
                telefono: phone,
                clave: password,
                fechaNacimiento: birthDate,
            });
            setSuccess(response.data.mensaje);
            localStorage.setItem("token", response.data.token);
            setTimeout(() => navigate("/"), 1800);
        } catch (err) {
            setError(err?.response?.data?.mensaje || "Error al registrarse");
        }
    };

    return (
        <div className="container">
            <main className="centeredMain">
                <form className="form" onSubmit={handleSubmit} autoComplete="off">
                    <h1 className="title">Registro</h1>
                    <div className="grid">
                        <div className="inputGroup">
                            <label htmlFor="dni" className="label">DNI</label>
                            <input
                                id="dni"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="input"
                                value={dni}
                                onChange={handleDniChange}
                                required
                                placeholder="DNI"
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="firstName" className="label">Nombre</label>
                            <input
                                id="firstName"
                                type="text"
                                className="input"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                required
                                placeholder="Nombre"
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="lastName" className="label">Apellido</label>
                            <input
                                id="lastName"
                                type="text"
                                className="input"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                required
                                placeholder="Apellido"
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="email" className="label">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="input"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="Email"
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="phone" className="label">Teléfono</label>
                            <input
                                id="phone"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="input"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="Teléfono"
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="birthDate" className="label">Nacimiento</label>
                            <input
                                id="birthDate"
                                type="date"
                                className="input"
                                value={birthDate}
                                onChange={e => setBirthDate(e.target.value)}
                                placeholder="Fecha de nacimiento"
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="password" className="label">Clave</label>
                            <div className="inputWrapper">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="input"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    placeholder="Clave"
                                    autoComplete="new-password"
                                />
                                <span
                                    className="eyeIcon"
                                    onClick={() => setShowPassword(v => !v)}
                                    tabIndex={0}
                                    aria-label={showPassword ? "Ocultar clave" : "Mostrar clave"}
                                    style={{ userSelect: "none" }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="confirmPassword" className="label">Repetir Clave</label>
                            <div className="inputWrapper">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="input"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="Repetir clave"
                                    autoComplete="new-password"
                                />
                                <span
                                    className="eyeIcon"
                                    onClick={() => setShowConfirmPassword(v => !v)}
                                    tabIndex={0}
                                    aria-label={showConfirmPassword ? "Ocultar clave" : "Mostrar clave"}
                                    style={{ userSelect: "none" }}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                    </div>
                    {error && <div className="errorMsg" role="alert" aria-live="assertive">{error}</div>}
                    {success && <div className="successMsg" role="alert" aria-live="assertive">{success}</div>}
                    <button type="submit" className="button">Registrarse</button>
                </form>
            </main>
        </div>
    );
}