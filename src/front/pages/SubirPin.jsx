import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const SubirPin = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tipo, setTipo] = useState("");
    const [imagen, setImagen] = useState(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = sessionStorage.getItem("token");
            if (!token) {
                alert("Necesitas iniciar sesión para subir un pin.");
                navigate("/login");
                return;
            }

            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${backendUrl}/private`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("user");
                    alert("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error de autenticación:", error);
                alert("Hubo un problema de conexión. Por favor, intente nuevamente.");
                navigate("/login");
            }
        };

        checkAuthentication();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
            navigate("/login");
            return;
        }

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const formData = new FormData();
            formData.append('titulo', titulo);
            formData.append('descripcion', descripcion);
            formData.append('tipo', tipo);
            
            if (imagen) {
                formData.append('imagen', imagen);
            }

            const response = await fetch(`${backendUrl}/subir-pin`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert("Reporte enviado exitosamente");
                setTitulo("");
                setDescripcion("");
                setTipo("");
                setImagen(null);
            } else {
                alert(data.msg || "Error al enviar el reporte");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un problema al enviar el reporte");
        }
    };

    if (!isAuthenticated) {
        return null; 
    }

    return (
        <div className="subir-pin">
            <header className="header-section text-center py-4">
                <h1 className="text-white">Subir Pin</h1> 
                <p className="text-white">No dejes que la inseguridad pase desapercibida.</p>
            </header>

            <div className="container subir-pin-container">
                <div className="mapa-container">
                    <img src="https://st3.depositphotos.com/1825463/32084/i/1600/depositphotos_320847274-stock-photo-city-map-pin-pointers-rendering.jpg" alt="Mapa estático" className="mapa-img" />
                </div>

                <form className="form-container" onSubmit={handleSubmit}>
                    <div className="input-container">
                      <p><strong>Marca tu incidente en la plataforma.</strong></p>
                      <label htmlFor="titulo">
                        Título del Incidente:
                      </label>
                      <input 
                         id="titulo"
                         type="text" 
                         value={titulo} 
                         onChange={(e) => setTitulo(e.target.value)} 
                         required 
                      />
                    </div>
                    
                    <div className="textarea-container">
                        <label htmlFor="descripcion">
                         Descripción:
                        </label>
                        <textarea
                            id="descripcion"
                            value={descripcion} 
                            onChange={(e) => setDescripcion(e.target.value)} 
                            required 
                        />
                    </div>

                    <label>Tipo de Incidente:</label>
                    <div className="checkbox-group">
                        <label>
                            <input 
                                type="radio" 
                                name="tipo" 
                                value="Automovilístico" 
                                onChange={(e) => setTipo(e.target.value)}
                                required
                            /> Automovilístico
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="tipo" 
                                value="Ciclístico" 
                                onChange={(e) => setTipo(e.target.value)}
                            /> Ciclístico
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="tipo" 
                                value="Peatón" 
                                onChange={(e) => setTipo(e.target.value)}
                            /> Peatón
                        </label>
                    </div>

                    <label>
                        Subir imagen (opcional):
                        <input 
                            type="file" 
                            onChange={(e) => setImagen(e.target.files[0])} 
                        />
                    </label>

                    <button type="submit" className="btn btn-primary btn-block">Subir Reporte</button>
                </form>
            </div>
        </div>
    );
};