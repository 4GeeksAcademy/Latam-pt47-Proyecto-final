import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showSuccessAlert, showErrorAlert, showWarningAlert } from "../../utils/alerts";

export const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            setLoading(false);
            return;
        }

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/singup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: formData.username,
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                showSuccessAlert("¡Bienvenido!", data.msg || "Inicio de sesión exitoso");
                navigate("/login");
            } else {
                setError(data.msg || "Error al registrarse");
            }
        } catch (error) {
            setError("Error en la conexión con el servidor");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="header-section">
                <h1>Registrate</h1>
                <p>Crea una cuenta e ingresa sesión en GuardianUrbano</p>
            </div>
            
            <div className="container">
            
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card my-4">
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Nombre de usuario</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Teléfono</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="d-grid">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? "Registrando..." : "Registro"}
                                    </button>
                                </div>
                            </form>
                            <div className="text-center mt-3">
                                <p><Link to="/terminos">Terminos y Condiciones</Link> </p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mb-4">
                        <p>¿Ya tienes una cuenta? <Link to="/login">Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
        </div>
        
    );
};