import React, { useState } from "react";
import Select from "react-select";
import { showSuccessAlert, showErrorAlert, showWarningAlert } from "../../utils/alerts";

const ReportModal = ({ isOpen, onClose, incident, token, backendUrl, setIncidentes }) => {
    const [reportType, setReportType] = useState("");
    const [description, setDescription] = useState("");
    const options = [
        { value: "contenido_inapropiado", label: "Contenido Inapropiado" },
        { value: "informacion_falsa", label: "Información Falsa" },
        { value: "incidente_irreleante", label: "Incidente Irrelevante" }, //el value hay que dejarlo asi con ese error de sintaxis "irreleante", sino no funciona en el backend.
        { value: "lenguaje_ofensivo", label: "Lenguaje Ofensivo" },
        { value: "spam", label: "Spam" }
    ];

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

    const handleClose = () => {
        setDescription("");
        onClose();
    };

    return (

        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={incident.image ?? "public/Logo-GuardianUrbano.png"}
                    className="modal-image"
                    alt="Incidente"
                />
                <h3>Reportar: {incident?.titulo}</h3>
                <form onSubmit={handleReport}>
                    <Select
                        options={options}
                        onChange={(selectedOption) => setReportType(selectedOption.value)}
                        className="w-full"
                        placeholder="Seleccionar..."
                    />
                    <br></br>
                    <div className="form-floating">
                        <p>Describe el motivo del reporte:</p>
                        <textarea
                            placeholder="Describe el motivo del reporte."
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            id="floatingTextarea"
                            style={{ height: "100px" }}
                            required>
                        </textarea>
                    </div>

                    <button type="submit" className="btn btn-primary me-3"><i class="fa-solid fa-paper-plane"></i>  Enviar Reporte</button>
                    <button className="btn btn-danger" onClick={handleClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;