import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showSuccessAlert, showErrorAlert, showWarningAlert } from "../../utils/alerts";

function ForgotPasswordModal({ show, onClose }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const resp = await fetch(`${backendUrl}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await resp.json();
      setMsg(data.msg);
    } catch (err) {
      setMsg("Error al enviar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.3)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "#fff",
        padding: 30,
        borderRadius: 8,
        maxWidth: 400,
        width: "90%",
        boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <h2>Recuperar contraseña</h2>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Tu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
        {msg && <div className="alert alert-info mt-3" style={{ width: "100%" }}>{msg}</div>}
        <button className="btn btn-link mt-2" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

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
    <div>
      <ForgotPasswordModal show={showForgot} onClose={() => setShowForgot(false)} />
      <div className="header-section mb-5">
        <h1>Login</h1>
        <p>Inicia sesión o crea una cuenta en GuardianUrbano</p>
      </div>
      <div className="container">
        <div className="row justify-content-center mb-5 mt-5">
          <div className="col-md-6">
            <div className="card my-4">
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                  <div className="mb-5">
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
                  <div className="mb-5">
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
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => setShowForgot(true)}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                  <p><Link to="/terminos">Terminos y Condiciones</Link></p>
                </div>
              </div>
            </div>
            <div className="text-center mb-5">
              <p>¿No tienes una cuenta? <Link to="/signup">Registro</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};