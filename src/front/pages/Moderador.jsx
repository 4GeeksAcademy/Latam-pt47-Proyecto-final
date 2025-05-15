import React, { useState, useEffect } from 'react';

export const Moderador = () => {
    //  Reportes de ejemplo para pruebas
    const [reportes, setReportes] = useState([
        {
            id: 1,
            user_name: "UsuarioEjemplo1",
            description: "Reporte de ejemplo 1",
            image: "https://via.placeholder.com/150",
            type: "ciclista",
            longitud: -58.3816,
            latitud: -34.6037,
            likes_count: 5,
            reports_count: 3,
            user_id: 101,
        },
        {
            id: 2,
            user_name: "UsuarioEjemplo2",
            description: "Reporte de ejemplo 2",
            image: "https://via.placeholder.com/150",
            type: "peaton",
            longitud: -58.3889,
            latitud: -34.6058,
            likes_count: 10,
            reports_count: 7,
            user_id: 102,
        }
    ]);

    // Funciones de prueba para acciones en reportes
    const banearUsuario = async (userId) => {
        console.log(`Usuario ${userId} baneado (simulación)`);
    };

    const borrarReporte = async (reportId) => {
        console.log(`Reporte ${reportId} eliminado (simulación)`);
        setReportes(reportes.filter((r) => r.id !== reportId));
    };

    return (
        <div className="moderador-container">
            <header className="header-section admin">
                <h1>Panel de Moderador (Pruebas)</h1>
            </header>

            <div className="publicaciones-container">
                <h2>Reportes de usuarios</h2>
                {reportes.map((report) => (
                    <div key={report.id} className="publicacion">
                        <div className="publicacion-info">
                            <p><strong>Usuario:</strong> {report.user_name}</p>
                            <p><strong>Descripción:</strong> {report.description}</p>
                            {report.image && <img src={report.image} alt="Reporte" />}
                            <p><strong>Tipo:</strong> {report.type}</p>
                            <p><strong>Longitud:</strong> {report.longitud}</p>
                            <p><strong>Latitud:</strong> {report.latitud}</p>
                            <p><strong>Likes:</strong> {report.likes_count}</p>
                            <p><strong>Reportes:</strong> {report.reports_count}</p>
                            <p><strong>Usuario ID:</strong> {report.user_id}</p>
                        </div>

                        <div className="acciones-publicacion">
                            <button className="btn-ban me-2" onClick={() => banearUsuario(report.user_id)}>🚫 Banear Usuario</button>
                            <button className="btn-delete" onClick={() => borrarReporte(report.id)}>🗑️ Borrar Reporte</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Moderador;