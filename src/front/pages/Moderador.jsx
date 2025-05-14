import React from 'react';


export const Moderador = () => {

   
    const [publicaciones, setPublicaciones] = React.useState([]); // Estado para almacenar las publicaciones

    // traer todos los posts de la base de datos
    const obtenerPublicaciones = async () => {
    try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/publicaciones`, {
            method: 'GET',
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Error al obtener publicaciones.");
            return [];
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return [];
    }
};
    // funcion de banear usuario
    const banearUsuario = async (userId) => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/ban-user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                console.log("Usuario baneado exitosamente.");
            } else {
                const data = await response.json();
                alert(`Error: ${data.msg}`);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };
    // funcion de borrar publicacion
    const borrarPublicacion = async (postId) => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/publicaciones/${postId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                console.log("Publicación borrada exitosamente.");
            } else {
                console.error("Error al borrar publicación.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };
    // Llamar a la función para obtener publicaciones al cargar el componente
    React.useEffect(() => {
        const fetchPublicaciones = async () => {
            const data = await obtenerPublicaciones();
            setPublicaciones(data);
        };
        fetchPublicaciones();
    }
    , []); // El array vacío asegura que se ejecute solo una vez al montar el componente
    


    return (
        <div className="moderador-container">
            <header className="header-section admin">
                <h1>Panel de ADMIN</h1>
            </header>


            <div className="moderador-content">

                <div className="publicaciones-container">
                    <h2>Publicaciones de usuarios</h2>
                    {publicaciones.map((post) => (
                        <div key={post.id} className="publicacion">
                         <div className="publicacion-info">
                            <p><strong>Usuario:</strong> {post.user_name}</p>
                            <p><strong>Descripción:</strong> {post.description}</p>
                            {post.image && <img src={post.image} alt="Reporte" />}
                            <p><strong>Tipo:</strong> {post.type}</p>
                            <p><strong>Longitud:</strong> {post.longitud}</p>
                            <p><strong>Latitud:</strong> {post.latitud}</p>
                            <p><strong>Likes:</strong> {post.likes_count}</p>
                            <p><strong>Reportes:</strong> {post.reports_count}</p>
                            <p><strong>Usuario ID:</strong> {post.user_id}</p>
                         </div>
                        
                         <div className="acciones-publicacion">
                            <button className="btn-ban me-2" onClick={() => banearUsuario(post.user_id)}>🚫 Banear Usuario</button>
                            <button className="btn-delete" onclick ={() => borrarPublicacion(post.id)}>🗑️ Borrar Publicación</button>
                         </div>
                        </div>
                    ))}
                </div>



            </div>
        </div>
    );
};

export default Moderador;

  {/*
    const publicaciones = [
        {
            id: 1,
            usuario: 'Usuario1',
            description: 'Descripción de la publicación 1',
            image: 'https://picsum.photos/200',
            longitud: '-34.6037',
            latitud: '-58.3816',
            type: 'peaton',
            user_id: 1,
            user_name: 'Usuario1',
            likes_count: 10,
            reports_count: 2,
        },
        {
            id: 2,
            usuario: 'Usuario2',
            description: 'Descripción de la publicación 2',
            image: 'https://picsum.photos/200',
            longitud: '-34.6037',
            latitud: '-58.3816',
            type: 'peaton',
            user_id: 2,
            user_name: 'Usuario2',
            likes_count: 5,
            reports_count: 1,
        },
        {
            id: 3,
            usuario: 'Usuario3',
            description: 'Descripción de la publicación 3',
            image: 'https://picsum.photos/200',
            longitud: '-34.6037',
            latitud: '-58.3816',
            type: 'peaton',
            user_id: 3,
            user_name: 'Usuario3',
            likes_count: 8,
            reports_count: 0,
        },
    ]; 
    */}