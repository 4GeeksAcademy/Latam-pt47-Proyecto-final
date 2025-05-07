import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Signup = () => {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [telefono, setTelefono] = useState("");
    const [ciudad, setCiudad] = useState("");

    const handleSignup = async (e) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        e.preventDefault();

        // Validación de la contraseña
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await fetch(backendUrl + "signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, email, password, telefono, ciudad }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message || "Registro exitoso");
                window.location.href = "/login";
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Error en la solicitud. Por favor, inténtelo de nuevo más tarde.");
            console.error("Error en la solicitud:", error);
        }
    };

    return (
        <div className="container">
            <div className="header-section text-center py-4">
                <h1 className="text-white">Regístrate</h1>
                <p className="text-white">Crea una cuenta o ingresa sesión en GuardianUrbano</p>
            </div>
            <form onSubmit={handleSignup}>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Correo electrónico:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar contraseña:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="telefono">Teléfono:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ciudad">Ciudad:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="ciudad"
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        required
                    />
                </div>
                <div class="d-grid gap-2">
                <button type="button" className="btn btn-primary btn-block">
                    Registrarse
                </button>
                </div>
            </form>
            <p className="text-center mt-3">
                Si ya estás registrado, ir a <Link to="/login">Login</Link>
            </p>
        </div>
    );
};