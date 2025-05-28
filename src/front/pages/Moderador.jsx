import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export const Moderador = () => {
    const [reportes, setReportes] = useState([]);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log("Backend URL:", backendUrl);
    

  

    useEffect(() => {
        const userData = sessionStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;

        if (!user || !user.is_admin) {
            navigate("/"); // Redirigir a la página principal si no es admin
        }
    }, []);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const token = sessionStorage.getItem("token");
                const response = await fetch(`${backendUrl}/api/admin`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error("Error al cargar reportes");

                const data = await response.json();
                setReportes(data.reported_incidents);
            } catch (error) {
                console.error("Error en la obtención de reportes:", error);
            }
        };
        fetchReports();
    }, [backendUrl]);

    const eliminarReporte = async (id) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${backendUrl}/api/delete-incident/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Error al eliminar reporte");

            setReportes(reportes.filter(reporte => reporte.id !== id));
        } catch (error) {
            console.error("Error al eliminar reporte:", error);
        }
    };

    const banearUsuario = async (userId) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${backendUrl}/api/ban-user/${userId}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Error al banear usuario");
        } catch (error) {
            console.error("Error al banear usuario:", error);
        }
    };

    return (
        <div className="moderador-container">
            <header className="header-section admin">
                <h1>Panel de Moderador</h1>
            </header>

            <div className="publicaciones-container">
                <h2>Reportes de usuarios</h2>

                {reportes.map((incident) => (
                    <div key={incident.id} className="incidente-box">
                        <div className="incidente-info">
                            <h3>{incident.type}</h3>
                            <img src={incident.image ? incident.image : "/dist/Logo-GuardianUrbano.png"}
                                className="card-img-top"
                                alt="Reporte"
                            />
                            <p><strong>Descripción:</strong> {incident.description}</p>
                            <p><strong>Ubicación:</strong> Lat: {incident.latitud}, Lng: {incident.longitud}</p>
                            <p><strong>Usuario que creó:</strong> {incident.username || "Desconocido"}</p>
                            <p><strong>Likes:</strong> {incident.num_likes}</p>
                            <p><strong>Reportes:</strong> {incident.num_reports}</p>

                            <div className="botones">
                                <button className="btn btn-ban" onClick={() => banearUsuario(incident.user_id)}>🚫 Banear Usuario</button>
                                <button className="btn btn-delete" onClick={() => eliminarReporte(incident.id)}>🗑️ Borrar Publicación</button>
                            </div>

                            <div className="reportes-box">
                                <h4>Detalles de Reportes</h4>
                                <ul>
                                    {incident.reports.map((report) => (
                                        <li key={report.id}>
                                            <p><strong>Usuario:</strong> {report.user}</p>
                                            <p><strong>Motivo:</strong> {report.type}</p>
                                            <p><strong>Descripción:</strong> {report.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default Moderador;