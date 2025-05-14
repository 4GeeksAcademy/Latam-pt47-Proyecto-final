import React from "react"

function IncidentCard() {
   
    return(
        <div className="container incidentcard-height">
							<div className="row">
								<div className="col-4">
									<img src="https://images.unsplash.com/photo-1587387119725-9d6bac0f22fb?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG9yaXpvbnRhbHxlbnwwfHwwfHx8MA%3D%3D" className="incident-image" alt="" />

								</div>

								<div className="col-8">
									<h4> Crimen random</h4>
									<p>Tipo de crimen: Automolistico</p>
									<p> Descripción: Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempora ut rem cum sunt debitis blanditiis. Vel molestiae mollitia recusandae provident consequatur minima? Omnis similique illum ex beatae iure, quam dignissimos!</p>
									<div className="upvotes-downvotes">
										<p className="me-auto">Upvotes: <bold>1.2M</bold></p> 
										<button className="Incident-button"> <i class="fa-solid fa-angle-up"></i></button>
										<button className="Incident-button"><i class="fa-solid fa-ban "></i></button>
										</div>
										


									


								</div>

							</div>
						</div>
    )

}

export default IncidentCard