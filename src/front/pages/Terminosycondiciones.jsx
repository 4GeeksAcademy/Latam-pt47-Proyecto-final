import React from 'react';
import { Link } from 'react-router-dom';

export const Terminosycondiciones = () => {
    const terminos = [
        {
            titulo: "1. Objeto de la Plataforma",
            descripcion: "Guardian Urbano permite a los usuarios reportar hechos delictivos, sospechosos o de inseguridad ciudadana mediante texto, imágenes u otros formatos, con el fin de alertar a la comunidad."
        },
        {
            titulo: "2. Uso Responsable",
            descripcion: "Al utilizar Guardian Urbano, el usuario se compromete a: Subir únicamente información verídica, de buena fe y que haya presenciado directamente o tenga fundamentos razonables para reportar. No hacer denuncias falsas, difamatorias, ni acusaciones sin pruebas. No compartir contenido que incluya datos personales de otras personas sin su consentimiento. No publicar imágenes extremadamente gráficas o violentas sin justificación clara y aviso previo. Respetar la dignidad de las personas involucradas en los reportes."
        },
        {
            titulo: "3. Moderación y Eliminación de Contenido",
            descripcion: "Guardian Urbano se reserva el derecho de revisar, modificar, eliminar o rechazar cualquier contenido que infrinja estos Términos o las leyes vigentes. No se garantiza la publicación de todos los reportes enviados."
        },
        {
            titulo: "4. Responsabilidad del Contenido",
            descripcion: "Todo el contenido publicado por los usuarios es de su exclusiva responsabilidad. Guardian Urbano no garantiza la veracidad, exactitud ni integridad de los reportes publicados y no se hace responsable por daños derivados de su uso."
        },
        {
            titulo: "5. Derechos de Autor y Uso de Imágenes",
            descripcion: "El usuario declara tener los derechos sobre las imágenes y textos que sube. Al compartir contenido en la plataforma, otorga a Guardian Urbano una licencia no exclusiva, gratuita y mundial para mostrar, distribuir y reproducir dicho contenido con fines informativos y de seguridad ciudadana"
        },
        {
            titulo: "6. Privacidad",
            descripcion: "Guardian Urbano respeta tu privacidad. No compartimos tu información personal sin consentimiento, salvo requerimiento legal. Para más detalles, consulta nuestra Política de Privacidad."
        },
        {
            titulo: "7. Prohibiciones",
            descripcion: "Está prohibido usar la plataforma para: Fines políticos, comerciales o partidistas. Acosar, amenazar o difamar a otros usuarios. Difundir contenido discriminatorio, racista, xenófobo, sexista o que promueva el odio."
        },
        {
            titulo: "8. Cambios en los terminos",
            descripcion: "Guardian Urbano se reserva el derecho de modificar estos Términos en cualquier momento. Te notificaremos de los cambios relevantes y el uso continuado de la plataforma implicará tu aceptación de los nuevos términos."
        },
        {
            titulo: "9. Legislación Aplicable",
            descripcion: "Estos Términos se rigen por las leyes del país en el que se encuentra registrada la plataforma. Cualquier controversia será resuelta por los tribunales competentes."
        },
        {
            titulo: "10. Contacto",
            descripcion: "Para consultas, denuncias de uso indebido o reportes técnicos, puedes escribirnos a nuestro correo electrónico: contacto@guardianurbano.com "
        }
    ];

    return (
        <div className="terminos-page">
            <div className="container">
                <header className="header-section terminos text-center py-4">
                    <h1 className="text-white">Términos y Condiciones</h1>
                    <p className="text-white">La seguridad de la Ciudad es nuestra prioridad</p>
                </header>

                <section className="text-center mt-3">
                    <p>Bienvenido a <strong>Guardian Urbano</strong>, una plataforma comunitaria cuyo objetivo es compartir alertas, reportes ciudadanos e imágenes sobre hechos delictivos ocurridos en zonas urbanas. Al acceder y usar este sitio web, aceptas los siguientes Términos y Condiciones. Si no estás de acuerdo con alguno de ellos, por favor no utilices la plataforma.</p>

                    {terminos.map((termino, index) => (
                        <article key={index} className="termino-section">
                            <h2 aria-label={`Sección ${termino.titulo}`}>{termino.titulo}</h2>
                            <p>{termino.descripcion}</p>
                        </article>
                    ))}
                </section>
            </div>
        </div>
    );
};

