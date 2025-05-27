import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    MapContainer,
    TileLayer,
    useMap,
    Marker,
    useMapEvents,
} from 'react-leaflet'
import L from "leaflet"
import { Icon } from "leaflet"
import 'leaflet/dist/leaflet.css';




export const SubirPin = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthMessage, setShowAuthMessage] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tipo, setTipo] = useState("");
    const [imagen, setImagen] = useState(null);
    

    const customIcon = new L.Icon({
        iconUrl: "public/Logo-GuardianUrbano.png",
        iconSize: new L.Point(28, 38),
        iconAnchor: [10, 35]
    })


    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setShowAuthMessage(true);
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2000);
            return;
        }

        const checkAuthentication = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${backendUrl}/api/private`, {
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
                    setShowAuthMessage(true);
                    setTimeout(() => {
                        navigate("/login", { replace: true });
                    }, 2000);
                }
            } catch (error) {
                console.error("Error de autenticación:", error);
                setShowAuthMessage(true);
                setTimeout(() => {
                    navigate("/login", { replace: true });
                }, 2000);
            }
        };

        checkAuthentication();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('file', imagen);
        formData.append('upload_preset', 'cocorroquias');

        fetch("https://api.cloudinary.com/v1_1/dl3evwwwr/image/upload", { method: "POST", body: formData })

            .then((res) => res.json())

            .then(async(datacloud) => {
                

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
                        formData.append('imagen', datacloud.url);
                    }

                    const response = await fetch(`${backendUrl}/api/subir-pin`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
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
                        console.log(data.msg || "Error al enviar el reporte");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    alert("Hubo un problema al enviar el reporte");
                }

            })

            .catch()


    };

    if (showAuthMessage) {
        return (
            <div className="alert alert-warning text-center mt-5">
                Debes estar logueado para subir un pin. Redirigiendo al login...
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }


    function LocationMarker() {
        const [position, setPosition] = useState(null);

        useMapEvents({
            click(e) {
                const coords = e.latlng;
                setPosition(coords);
                console.log('Clicked at:', coords);

            },
        });

        return position === null ? null : (
            <Marker position={position} icon={customIcon} />
        );
    }

    function LocationMover() {
        const [Hoverposition, setHoverPosition] = useState(null);

        useMapEvents({
            mousemove(e) {
                const coords = e.latlng;
                setHoverPosition(coords)


            },
        });

        return Hoverposition === null ? null : (
            <Marker position={Hoverposition} icon={customIcon} />
        );
    }












    return (
        <div className="subir-pin">
            <header className="header-section text-center py-4">
                <h1 className="text-white">Subir Pin</h1>
                <p className="text-white">No dejes que la inseguridad pase desapercibida.</p>
            </header>

            <div className="container subir-pin-container">
                <div className="mapa-container">
                    <MapContainer center={[4.60971, -74.08175]} zoom={13} style={{ height: 538, width: 638 }} >
                        <TileLayer

                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"


                        />

                        <LocationMarker />
                        <LocationMover />


                    </MapContainer>
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

                    <button type="submit" className="btn btn-primary btn-block" onClick={() => {




                    }}>Subir Reporte </button>
                </form>
            </div>
        </div>
    );
};