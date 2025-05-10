import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SubirPin = () => {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tipo, setTipo] = useState("");
    const [imagen, setImagen] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ titulo, descripcion, tipo, imagen });
        alert("Reporte enviado.");
    };

    return (
        <div className="subir-pin">
            {/* Header con estilo del Login */}
            <header className="header-section text-center py-4">
                <h1 className="text-white">Subir Pin</h1> 
                <p className="text-white">No dejes que la inseguridad pase desapercibida.</p>
            </header>

            <div className="container subir-pin-container">
                {/* Imagen estática del mapa */}
                <div className="mapa-container">
                    <img src="https://st3.depositphotos.com/1825463/32084/i/1600/depositphotos_320847274-stock-photo-city-map-pin-pointers-rendering.jpg" alt="Mapa estático" className="mapa-img" />
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

                    <button type="submit" className="btn btn-primary btn-block">Subir Reporte</button>
                </form>
            </div>
        </div>
    );
};

export default SubirPin;