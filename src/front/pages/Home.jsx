import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import IncidentCard from "../components/IncidentCard.jsx";
import Jumbotron from "../components/Jumbotron.jsx";


import {
	MapContainer,
	TileLayer,
	useMap,
	Marker,
	
} from 'react-leaflet'

import {Icon} from "leaflet"

import 'leaflet/dist/leaflet.css';


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

	  
const markers = [
    {position: [4.60971, -74.08175]},
    {position: [4.61071, -74.08175]},
    {position: [4.61171, -74.08175]},]

	const customIcon = new L.Icon({
			iconUrl: "dist/Logo-GuardianUrbano.png",
			iconSize: new L.Point(28, 38),
			iconAnchor:  [10, 35]})

	return (

		<div>

			<Jumbotron/>

			<div className="mapsection">
				
					<div className="container ">
						<div className="row" style ={{maxHeight: "475px"}}>
							<div class="col h-100">
								<h1> Peligro cercano</h1>
								<div className="mb-3" >
									<button type="button" class="btn btn-secondary b-tipo-accidente me-3">Tipo de Accidente</button>
									<button type="button" class="btn btn-dark me-3"> Automovilistico</button>
									<button type="button" class="btn btn-dark me-3">Peatón</button>
									<button type="button" class="btn btn-dark me-3">Cilismo</button>
									<button type="button" class="btn btn-dark">Otro...</button>
								</div>

								<div className="overflow-y-scroll Incident-cards">
									<IncidentCard/>
									
									
									
									
								</div>

							</div>

							<div class="col">
								<MapContainer center={[4.60971, -74.08175]} zoom ={13}  style={{ height: "100%", width: "100%" , borderRadius: "5%" }} >
									<TileLayer

									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

									/>

									{
										markers.map((marker, index) => {
											return (
												<Marker key={index} position={marker.position} icon = {customIcon} />
											)	

										})
									}


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
						<br/>



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
						 <br/>
						 <h4> NUMERO DE EMERGENCIA: 911</h4>
						 <br/>
						 <p> En los momentos más oscuros, cuando el miedo paraliza y cada segundo duele, existe una línea que no solo conecta con ayuda… conecta con esperanza. El número de emergencia no es solo una cifra: es el puente entre el caos y la calma, entre la tragedia y la oportunidad de sobrevivir. Tenerlo presente y saber usarlo no es solo una medida de prevención, es un acto de amor, de responsabilidad y de humanidad. Porque cuando la vida está en juego, una llamada puede cambiarlo todo.</p>
						</div>
						

					  </div>

					  <div class="col-5"> 
						 <img src="https://assets.cdn.filesafe.space/pOUHT87c9QESlEwIaJkr/media/68194476b308e71ba5066261.jpeg" alt=""  className="numberimage1"/>
					  </div>

                     </div>
      
                </div>



			</div>
		</div>



	);
}; 