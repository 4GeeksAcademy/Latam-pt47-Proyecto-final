import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showSuccessAlert, showErrorAlert, showWarningAlert } from "../../utils/alerts";

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        sessionStorage.setItem("token", data.token);
        
        try {
          const userResponse = await fetch(`${backendUrl}/api/private`, {
            method: "GET",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${data.token}`
            }
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            sessionStorage.setItem("user", JSON.stringify({
              email: formData.email,
              ...userData
            }));
          }
        } catch (userError) {
          console.error("Error al obtener datos del usuario:", userError);
          sessionStorage.setItem("user", JSON.stringify({ email: formData.email }));
        }
        
        showSuccessAlert("¡Bienvenido!", data.msg || "Inicio de sesión exitoso");
        navigate("/");
      } else {
        setError(data.msg || "Credenciales incorrectas");
      }
    } catch (error) {
      setError("Error en la conexión con el servidor");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header-section">
        <h1>Login</h1>
        <p>Inicia sesión o crea una cuenta en GuardianUrbano</p>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card my-4">
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </button>
                </div>
              </form>
              <div className="text-center mt-3">
                <p><Link to="/terminos">Terminos y Condiciones</Link></p>
              </div>
            </div>
          </div>
          <div className="text-center mb-4">
            <p>¿No tienes una cuenta? <Link to="/signup">Registro</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};