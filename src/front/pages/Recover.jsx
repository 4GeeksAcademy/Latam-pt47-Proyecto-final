import React, { useState } from "react";

const Recover = () => {
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    // Obtener el token de la URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);
        setLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const resp = await fetch(`${backendUrl}/api/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, new_password: password }),
            });
            const data = await resp.json();
            setMsg(data.msg);
        } catch (err) {
            setMsg("Error al cambiar la contraseña.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) return <p>Token inválido</p>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card my-4">
                        <div className="card-body">
                            <h2 className="mb-4">Restablecer contraseña</h2>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="password"
                                    className="form-control mb-3"
                                    placeholder="Nueva contraseña"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? "Cambiando..." : "Cambiar contraseña"}
                                </button>
                            </form>
                            {msg && <div className="alert alert-info mt-3">{msg}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recover;