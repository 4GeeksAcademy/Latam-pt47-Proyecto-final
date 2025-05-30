import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import IncidentCard from "../components/IncidentCard.jsx";
import Jumbotron from "../components/Jumbotron.jsx";
import { useNavigate } from "react-router-dom";
import ReportModal from "../components/ReportModal.jsx";
import { showSuccessAlert, showErrorAlert, showWarningAlert } from "../../utils/alerts";


import {
	MapContainer,
	TileLayer,
	useMap,
	Marker,

} from 'react-leaflet'

import { Icon } from "leaflet"

import 'leaflet/dist/leaflet.css';
import { use } from "react";


export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])


	const [isactive, setIsactive] = useState(null)
	const [mapcenter, setmapcenter] = useState([4.60971, -74.08175])
	
	useEffect(()=> {})

	const createCustomIcon = (marker) => {
		return L.divIcon({
			className: 'custom-marker',
			html: `<div class="marker-image ${isactive === marker.id ? 'pinactive' : ''}"></div>`,
			iconSize: [37, 47],
			iconAnchor: [14, 38],
		});
	};

	function MapCenterUpdater({ center }) {
		const map = useMap();

		
			if (center) {
				map.flyTo(center, map.getZoom(), { duration: 1.5 });
			}
		

		return null;
	}


	//////////////////////////////////////////////////////////////////////////////////////////Prueba///////////////////////////////////////
	const [incidentes, setIncidentes] = useState([]);
	const [selectedIncident, setSelectedIncident] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const token = sessionStorage.getItem("token");
	const [filterby, setFilterby] = useState(["automovilistico", 'ciclista', 'peaton'])
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

		<div>

			<Jumbotron />

			<div className="mapsection ">

				<div className="container ps-0 pe-0 main">
					<div className="row fullfitall" >
						<div class="col h-100">
							<h1> Peligro cercano</h1>
							<div className="mb-3" >
								<button type="button" class="btn btn-secondary b-tipo-accidente me-3">Tipo de Accidente</button>
								<button type="button" class="btn btn-dark me-3" onClick={() => setFilterby(["automovilistico"])}> <i class="fa-solid fa-car"></i></button>
								<button type="button" class="btn btn-dark me-3" onClick={() => { setFilterby(['peaton']) }}><i class="fa-solid fa-person-walking" ></i></button>
								<button type="button" class="btn btn-dark me-3" onClick={() => { setFilterby(['ciclista']) }}><i class="fa-solid fa-bicycle"></i></button>
								<button type="button" class="btn btn-dark me-3" onClick={() => { setFilterby(['automovilistico', "peaton", "ciclista"]) }}>Limpiar Filtros </button>

							</div>

							<div className="overflow-y-scroll Incident-cards">

								<div className="container incidentcard-height">
									{
										incidentes.filter(incident => filterby.includes(incident.type))
											.map((incident) => (
												<div key={incident.id}
													onClick={() => {
														setIsactive(incident.id)
														setmapcenter([incident.latitud,incident.longitud])
														
													}}


													className={`incident-card incident-${incident.id} ${isactive === incident.id ? 'activediv' : ''}`
													}>
													<img
														src={incident.image ? incident.image : "https://static-00.iconduck.com/assets.00/no-image-icon-2048x2048-2t5cx953.png"}
														className="incident-image me-3"
														alt="Incidente"
													/>
													<div className="info">
														<div>
															<h4> {incident.titulo}</h4>
															<p> Tipo de crimen:  {incident.type}  </p>
															<p> {incident.description}</p>
															<p>Reportado por:  <strong> {incident.username || "Desconocido"} </strong></p>

														</div>


														<div className="upvotes-downvotes">
															<p><i className="fa-solid fa-check"></i> <strong>Likes: {incident.num_likes}</strong></p>

															<p className="me-auto"></p>

															<button className="Incident-button me-2" onClick={() => handleLike(incident.id)}> <i className="fa-solid fa-check"></i></button>
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





							</div>

						</div>

						<div class="col">
							<MapContainer center={[4.60971, -74.08175]} zoom={13} style={{ height: "100%", width: "100%", borderRadius: "5%" }} >
								<TileLayer

									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

								/>

								

								{
									incidentes.filter((marker => filterby.includes(marker.type)))
										.map((marker) => {
											return (
												<Marker key={marker.id} position={[marker.latitud, marker.longitud]} icon={createCustomIcon(marker)}

													eventHandlers={{
														click: () => {
															
			                                                
															const container = document.querySelector('.Incident-cards'); // your scrollable parent
															const target = document.querySelector(`.incident-${marker.id}`);
															setmapcenter([marker.latitud,marker.longitud])

															if (container && target) {
																const containerTop = container.getBoundingClientRect().top;
																const targetTop = target.getBoundingClientRect().top;

																const offset = targetTop - containerTop - 300; // scroll 50px above the target
																container.scrollTo({ top: container.scrollTop + offset, behavior: 'smooth' });
																setIsactive(marker.id)

															}
														}
													}}



												/>
											)

										})
								}

                             <MapCenterUpdater center={mapcenter} />
							</MapContainer>
						</div>


					</div>



				</div>


			</div>

			<div className="Card_Section mb-5">
				<div className="Card_Center pt-5 pb-5">

					<div className="text-center">
						<p className="SubTitle_Cards">Marcá el peligro. Protegé a otros.</p>

						<h1 className="Title_Cards">la seguridad es calidad de vida</h1>
						<br />



					</div>

					<div class="container p-0 fullheightcard">
						<div class="row row-cols-3 fullheightcard">
							<div class="col  ">
								<div className="card-section ">
									<div className="card-bodycenter">
										<h3 className="card-titlebody">Robos Armados, una Amenaza Persistente</h3>
										<p className="card-titlebody"> aproximadamente el 70% de los homicidios en la región de latinoamerica fueron perpetrados con armas de fuego en 2021, en comparación con el 47% a nivel mundial</p>
									</div>


								</div>

							</div>
							<div class="col">
								<div className="card-section cardimage1">


								</div>
							</div>
							<div class="col">
								<div className="card-section ">
									<div className="card-bodycenter">
										<h3 className="card-titlebody">Cuidado con el trafico</h3>
										<p className="card-titlebody">En latino america se registran aproximadamente 110,000 muertes y más de 5 millones de lesiones anualmente debido a accidentes viales</p>
									</div>

								</div>
							</div>
							<div class="col">
								<div className="card-section cardimage2 ">

								</div>
							</div>
							<div class="col">
								<div className="card-section ">
									<div className="card-bodycenter">
										<h3 className="card-titlebody">Recuerda Tu eres esencial en nuestra lucha por un mejor futuro en futuro más seguro</h3>
									</div>


								</div>
							</div>
							<div class="col">
								<div className="card-section cardimage3">

								</div>
							</div>
						</div>
					</div>

				</div>


			</div>

			<div className="numbersection">
				<div class="container mt-5 ">
					<div class="row">
						<div class="col-7 numbertext-container">
							<div className="subnumbertext-container">

								<h1> Un Segundo Puede Salvar una Vida: El Poder de Marcar un Número</h1>
								<br />
								<h4> NUMERO DE EMERGENCIA: 911</h4>
								<br />
								<p> En los momentos más oscuros, cuando el miedo paraliza y cada segundo duele, existe una línea que no solo conecta con ayuda… conecta con esperanza. El número de emergencia no es solo una cifra: es el puente entre el caos y la calma, entre la tragedia y la oportunidad de sobrevivir. Tenerlo presente y saber usarlo no es solo una medida de prevención, es un acto de amor, de responsabilidad y de humanidad. Porque cuando la vida está en juego, una llamada puede cambiarlo todo.</p>
							</div>


						</div>

						<div class="col-5">
							<img src="https://assets.cdn.filesafe.space/pOUHT87c9QESlEwIaJkr/media/68194476b308e71ba5066261.jpeg" alt="" className="numberimage1" />
						</div>

					</div>

				</div>



			</div>
		</div>



	);
}; 