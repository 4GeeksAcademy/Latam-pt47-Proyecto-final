import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className="navbar">
            {/* Icono Logo GuardianUrbano */}
            <div className="navbar-logo">
                <img src="/public/Logo-GuardianUrbano.png" alt="Logo" />
            </div>

            
            <div className="navbar-links">
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Registro</Link>
                <Link to="/subir-pin">Subir Pin</Link>
                <Link to="/terminos">Términos y Condiciones</Link>
            </div>
        </nav>
    );
};