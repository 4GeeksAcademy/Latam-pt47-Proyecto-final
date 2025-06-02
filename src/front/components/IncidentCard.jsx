import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReportModal from "./ReportModal";
import { showSuccessAlert, showErrorAlert, showWarningAlert } from "../../utils/alerts";

function IncidentCard() {
	const [incidentes, setIncidentes] = useState([]);
	const [selectedIncident, setSelectedIncident] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const token = sessionStorage.getItem("token");

	useEffect(() => {
		const fetchIncidents = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/all-incidents`);
				if (!response.ok) {
					throw new Error(`Error ${response.status}: ${response.statusText}`);
				}
				const data = await response.json();
				console.log("API Response:", data);

				if (!Array.isArray(data.results)) {
					throw new Error("La API no devolvió un array.");
				}

				setIncidentes(data.results);
			} catch (error) {
				console.error("Error al obtener incidentes:", error);
			}
		};

		fetchIncidents();
	}, [backendUrl]);

	const handleLike = async (incidentId) => {
		if (!token) {
			navigate("/login");
			return;
		}

		try {
			const response = await fetch(`${backendUrl}/api/like/${incidentId}`, {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				}
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.msg || "Error desconocido");
			}
			const updatedData = await response.json();

			setIncidentes((prevIncidentes) =>
				prevIncidentes.map((inc) =>
					inc.id === incidentId ? { ...inc, num_likes: updatedData.num_likes } : inc
				)
			);
			showSuccessAlert("Like agregado correctamente!", "Gracias tu Like se ha registrado correctamente.");
		} catch (error) {
			console.error("Error al dar like:", error);
			showErrorAlert("Error", `Hubo un problema al agregar el Like: ${error.message}`);
		}
	};

	const handleReportClick = (incident) => {
		if (!token) {
			navigate("/login");
			return;
		}

		if (!incident) {
			console.error("Error: Incidente no encontrado.");
			return;
		}
		setSelectedIncident(incident);
		setIsModalOpen(true);
	};

	return (
		<div className="container incidentcard-height">
			{incidentes.map((incident) => (
				<div key={incident.id} className="incident-card">
					<img src={incident.image ?? <i className="fa-regular fa-image"></i>}
						className="incident-image"
						alt="Incidente"
					/>
					<div className="incident-info">
						<h4> {incident.titulo}</h4>
						<p>Tipo de crimen: {incident.type}</p>
						<p> Descripción: {incident.description}</p>
						<p>Usuario: {incident.username}</p>
						<div className="incident-stats">
							<p><i className="fa-solid fa-check"></i> Likes: {incident.num_likes}</p>
							<p><i className="fa-regular fa-flag"></i> Reportes: {incident.num_reports}</p>
						</div>

						<div className="upvotes-downvotes">
							<p className="me-auto"></p>
							<button className="Incident-button" onClick={() => handleLike(incident.id)}> <i className="fa-solid fa-check"></i></button>
							<button className="Incident-button" onClick={() => handleReportClick(incident)}><i className="fa-regular fa-flag"></i></button>
						</div>
					</div>
				</div>
			))}
			<ReportModal isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				incident={selectedIncident} token={token}
				backendUrl={backendUrl}
				setIncidentes={setIncidentes}
			/>
		</div>
	)
}

export default IncidentCard