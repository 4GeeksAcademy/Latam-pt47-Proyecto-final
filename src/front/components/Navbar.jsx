import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    
    // Verificar si hay un token al cargar el componente y cuando cambia la ruta
    useEffect(() => {
        const checkAuthStatus = () => {
            const token = sessionStorage.getItem("token");
            setIsAuthenticated(!!token);
            
            // Comprobar si el usuario es administrador
            try {
                const userData = sessionStorage.getItem("user");
                if (userData) {
                    const user = JSON.parse(userData);
                    setIsAdmin(user.is_admin === true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
                setIsAdmin(false);
            }
        };
        
        // Verificar estado de autenticación
        checkAuthStatus();
        
        // Agregar event listener para storage changes
        window.addEventListener('storage', checkAuthStatus);
        
        // Cleanup del event listener
        return () => {
            window.removeEventListener('storage', checkAuthStatus);
        };
    }, [location.pathname]); // Re-ejecutar cuando la ruta cambie
    
    // Función para cerrar sesión
    const handleLogout = () => {
        // Eliminar token y datos de usuario del sessionStorage
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        // Actualizar el estado
        setIsAuthenticated(false);
        setIsAdmin(false);
        // Redirigir a la página principal
        navigate("/");
    };

    return (
        <nav className="navbar">
            {/* Icono Logo GuardianUrbano */}
            <div className="navbar-logo">
                <img src="/public/Logo-GuardianUrbano.png" alt="Logo" />
            </div>

            <div className="navbar-links">
                <Link to="/">Home</Link>
                
                {/* Mostrar opciones según estado de autenticación */}
                {isAuthenticated ? (
                    <>
                        <Link to="/subirpin">Subir Pin</Link>
                        <Link to="/terminos">Términos y Condiciones</Link>
                        
                        {/* Mostrar enlace Admin solo si el usuario es administrador */}
                        {isAdmin && (
                            <Link to="/moderador">Admin</Link>
                        )}

                        <button 
                            onClick={handleLogout} 
                            className="btn btn-outline-danger"
                        >
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Registro</Link>
                        <Link to="/subirpin">Subir Pin</Link>
                        <Link to="/terminos">Términos y Condiciones</Link>
                    </>
                )}
            </div>
        </nav>
    );
};