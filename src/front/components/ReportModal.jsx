import React, { useState } from "react";
import { showSuccessAlert, showErrorAlert, showWarningAlert } from "../../utils/alerts";

const ReportModal = ({ isOpen, onClose, incident, token, backendUrl, setIncidentes }) => {
    const [reportType, setReportType] = useState("");
    const [description, setDescription] = useState("");

    const handleReport = async (e) => {
        e.preventDefault();
        if (!reportType || !description) {
            showWarningAlert("Campos incompletos", "Por favor, completa todos los campos antes de enviar.");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/report/${incident.id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ reportType, description }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || "Error desconocido");
            }

            const updatedData = await response.json();

            setIncidentes((prevIncidentes) =>
                prevIncidentes.map((inc) =>
                    inc.id === incident.id ?
                        { ...inc, num_reports: updatedData.num_reports } : inc
                )
            );

            showSuccessAlert("Reporte enviado", "Gracias por tu reporte. Se ha registrado correctamente.");

            onClose();
        } catch (error) {
            console.error("Error al enviar reporte:", error);
            showErrorAlert("Error", `Hubo un problema al reportar: ${error.message}`);
        }
    };

    if (!isOpen) return null;

    return (

        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Reportar: {incident?.titulo}</h3>
                <form onSubmit={handleReport}>
                    <label className="me-2">Tipo de Reporte:</label>
                    <select value={reportType} onChange={(e) => setReportType(e.target.value)} required>
                        <option value="">Seleccionar...</option>
                        <option value="contenido_inapropiado">Contenido Inapropiado</option>
                        <option value="informacion_falsa">Información Falsa</option>
                        <option value="incidente_irreleante">Incidente Irrelevante</option>
                        <option value="lenguaje_ofensivo">Lenguaje Ofensivo</option>
                        <option value="spam">Spam</option>
                    </select>

                    <label>Descripción:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>

                    <button type="submit" className="me-3">Enviar Reporte</button>
                    <button onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;