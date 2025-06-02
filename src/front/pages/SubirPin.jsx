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
import { jwtDecode } from "jwt-decode";
import { showSuccessAlert, showErrorAlert, showWarningAlert } from "../../utils/alerts";




export const SubirPin = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthMessage, setShowAuthMessage] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tipo, setTipo] = useState("");
    const [imagen, setImagen] = useState(null);
    const [position, setPosition] = useState(null)
    const [imgurl, setImgurl] = useState(null)
    const [userdata, setUserdata] = useState(null)

    const customIcon = new L.Icon({
        iconUrl: "public/Logo-GuardianUrbano.png",
        iconSize: new L.Point(28, 38),
        iconAnchor: [10, 35]
    })

    function LocationMarker() {


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

            mouseout() {
                setHoverPosition(null)
            }
        });

        return Hoverposition === null ? null : (
            <Marker position={Hoverposition} icon={customIcon} />
        );
    }


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
                    setUserdata(jwtDecode(token))
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

            .then(async (datacloud) => {
                setImgurl(datacloud.url)
                console.log(imgurl)


                const token = sessionStorage.getItem("token");
                if (!token) {
                    showWarningAlert("Su sesión ha expirado.", "Por favor, inicie sesión nuevamente.");
                    navigate("/login");
                    return;
                }

                try {
                    const backendUrl = import.meta.env.VITE_BACKEND_URL;
                    const jsonpayload = {
                        "titulo": titulo,
                        "longitud": position.lng,
                        "latitud": position.lat,
                        "type": tipo,
                        "description": descripcion,
                        "image": datacloud.url ?? null
                    }



                    const response = await fetch(`${backendUrl}/api/subir-pin`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"

                        },
                        body: JSON.stringify(jsonpayload)
                    });

                    const data = await response.json();

                    if (response.ok) {
                        showSuccessAlert("Incidente Creado", "El Incidente ha sido enviado correctamente.");
                        setTimeout(() => {
                            navigate("/");
                        }, 2000);
                        setTitulo("");
                        setDescripcion("");
                        setTipo("");
                        setImagen(null);
                    } else {
                        console.log(data.msg || stringify(jsonpayload));
                    }
                } catch (error) {
                    console.error("Error:", error);
                    showErrorAlert("Error", "Hubo un problema al enviar el reporte.");
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















    return (
        <div className="subir-pin  ">
            <header className="header-section text-center py-4">
                <h1 className="text-white">Subir Pin</h1>
                <p className="text-white">No dejes que la inseguridad pase desapercibida.</p>
            </header>

            <div className="container subir-pin-container mt-5 mb-5">
                <div className="mapa-container">
                    <MapContainer center={[4.60971, -74.08175]} zoom={13} style={{ height: "83vh", width: "100%", borderRadius: "5%" }} >
                        <TileLayer

                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"


                        />

                        <LocationMarker />
                        <LocationMover />


                    </MapContainer>
                </div>

                <form className="form-container mt-4" onSubmit={handleSubmit}>
                    <div className="input-container">
                        <h3><strong>Marca tu incidente en la plataforma.</strong></h3>
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
                        <button type="button" className={`selectortipo ${tipo === "automovilistico" ? "active" : ""}`} onClick={(() => {
                            setTipo("automovilistico")
                        })}>
                            <i class="fa-solid fa-car simbol "></i>
                            Automovilistico


                        </button>

                        <button type="button" className={`selectortipo ${tipo === "ciclista" ? "active" : ""}`} onClick={() => {
                            setTipo("ciclista")
                        }}>
                            <i class="fa-solid fa-bicycle simbol"></i>
                             Ciclista/Moto

                        </button>

                        <button type="button" className={`selectortipo ${tipo === "peaton" ? "active" : ""}`} onClick={() => {
                            setTipo("peaton")
                        }}>
                            <i class="fa-solid fa-person-walking simbol me-auto" ></i>
                            Peaton/Otro..

                        </button>
                    </div>

                    <label>
                        <div>Subir imagen (opcional):
                            <div className='uploadfile'>
                                <i class="fa-solid fa-upload"></i>
                            </div>

                            <p>File: {imagen ? imagen.name : "Ningún archivo seleccionado"}</p>
                        </div>

                        <input className='fileinput'
                            type="file"
                            onChange={(e) => setImagen(e.target.files[0])

                            }
                        />
                    </label>

                    <button type="submit" className="btn btn-primary btn-block" onClick={() => {






                    }}>Subir Reporte </button>


                </form>
            </div>
        </div>
    );
};