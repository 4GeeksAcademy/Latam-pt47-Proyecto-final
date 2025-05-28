import React from 'react';
import { Link } from 'react-router-dom';

export const Terminosycondiciones = () => {
    const terminos = [
    {
        titulo: "1. Objeto de la Plataforma",
        descripcion: "Guardian Urbano es una plataforma digital creada para fomentar la participación ciudadana en la prevención del delito y la mejora de la seguridad urbana. Permite a los usuarios reportar hechos delictivos, situaciones sospechosas o eventos que representen un riesgo para la comunidad. Estos reportes pueden incluir texto, imágenes y otros formatos multimedia, y se visualizan en un mapa interactivo para alertar a los vecinos de la zona. La finalidad es promover una red de colaboración ciudadana, brindando herramientas para que las personas estén informadas y tomen decisiones más seguras."
    },
    {
        titulo: "2. Uso Responsable",
        descripcion: "Al utilizar Guardian Urbano, el usuario asume el compromiso de actuar con responsabilidad, ética y respeto hacia los demás. Se requiere que la información compartida sea verídica, basada en hechos presenciados directamente o en fuentes confiables. Queda prohibido realizar denuncias falsas, difamatorias o sin fundamentos claros, ya que esto podría afectar injustamente a personas inocentes. Además, no se permite compartir datos personales de terceros sin su autorización expresa, ni publicar imágenes violentas o explícitas sin justificación clara y una advertencia previa. Los usuarios deben recordar que cada reporte puede tener un impacto en la comunidad, por lo que se espera actuar con prudencia y consideración hacia los involucrados."
    },
    {
        titulo: "3. Moderación y Eliminación de Contenido",
        descripcion: "Guardian Urbano se reserva el derecho de revisar todos los contenidos antes o después de su publicación, para asegurar que cumplan con los Términos de Uso y las leyes aplicables. La plataforma puede, a su entera discreción, editar, rechazar o eliminar cualquier contenido que considere inapropiado, falso, ofensivo o que infrinja derechos de terceros. Aunque se promueve la libre expresión, la prioridad es garantizar un espacio seguro, respetuoso y útil para todos los usuarios. Guardian Urbano no está obligado a publicar todos los reportes enviados y se reserva la facultad de limitar la visibilidad de ciertos contenidos cuando sea necesario para preservar la calidad del servicio."
    },
    {
        titulo: "4. Responsabilidad del Contenido",
        descripcion: "Cada usuario es completamente responsable del contenido que publica en la plataforma. Guardian Urbano no interviene en la redacción ni verificación de los reportes, por lo que no puede garantizar su veracidad, precisión o integridad. La plataforma actúa como intermediaria tecnológica y no asume responsabilidad legal por las consecuencias derivadas del uso de la información publicada por terceros. Es importante que los usuarios analicen críticamente los reportes antes de actuar sobre ellos, y comprendan que Guardian Urbano no sustituye a las autoridades ni a los canales oficiales de denuncia."
    },
    {
        titulo: "5. Derechos de Autor y Uso de Imágenes",
        descripcion: "El usuario que suba contenido a Guardian Urbano, ya sea texto, imágenes, videos u otros formatos, declara ser el autor o contar con los derechos necesarios para su publicación. Al hacerlo, otorga a la plataforma una licencia no exclusiva, gratuita, transferible y mundial para almacenar, mostrar, distribuir y reproducir dicho contenido con fines informativos y de seguridad ciudadana. Esta licencia es necesaria para el funcionamiento de la plataforma, pero no limita los derechos del autor sobre su obra. Guardian Urbano se compromete a respetar estos derechos y a no utilizar el contenido con fines comerciales sin previo consentimiento del usuario."
    },
    {
        titulo: "6. Privacidad",
        descripcion: "La privacidad de nuestros usuarios es una prioridad para Guardian Urbano. No recopilamos ni compartimos información personal sin consentimiento explícito, a menos que sea requerido por orden judicial o autoridad competente. La plataforma cuenta con políticas de seguridad para proteger los datos almacenados y evitar accesos no autorizados. Los reportes pueden realizarse de forma anónima si así lo desea el usuario, aunque se recomienda proporcionar información de contacto para posibles aclaraciones. Para conocer en detalle cómo se gestionan los datos personales, te invitamos a revisar nuestra Política de Privacidad disponible en el sitio web."
    },
    {
        titulo: "7. Prohibiciones",
        descripcion: "Queda estrictamente prohibido utilizar Guardian Urbano con fines distintos a los establecidos en estos términos. Esto incluye, pero no se limita a: promover intereses políticos, realizar campañas comerciales, publicitar servicios o productos, acosar, amenazar o difamar a otros usuarios o personas mencionadas en los reportes. Asimismo, está vetado el uso de lenguaje ofensivo, contenido discriminatorio por razones de raza, género, religión, nacionalidad, orientación sexual o cualquier otro tipo de discurso de odio. Las violaciones a estas normas pueden conllevar la suspensión o eliminación definitiva de la cuenta del infractor."
    },
    {
        titulo: "8. Cambios en los Términos",
        descripcion: "Guardian Urbano puede modificar estos Términos de Uso en cualquier momento para adaptarse a cambios legales, técnicos o en el funcionamiento del servicio. Cuando se realicen cambios significativos, se notificará a los usuarios a través de medios visibles en la plataforma. El uso continuado de la plataforma después de dicha notificación se considerará como aceptación de los nuevos términos. Por ello, se recomienda revisar periódicamente esta sección para mantenerse informado de cualquier actualización."
    },
    {
        titulo: "9. Legislación Aplicable",
        descripcion: "Los presentes Términos se interpretan y rigen de acuerdo con la legislación del país en el que se encuentra registrada la plataforma Guardian Urbano. En caso de conflicto o disputa relacionada con el uso del sitio, las partes se someterán a los tribunales competentes conforme a la jurisdicción correspondiente. Al utilizar la plataforma, el usuario acepta expresamente esta normativa y las implicaciones legales que ello conlleva."
    },
    {
        titulo: "10. Contacto",
        descripcion: "Para cualquier duda, sugerencia, denuncia de uso indebido o reporte técnico relacionado con la plataforma, los usuarios pueden comunicarse con el equipo de Guardian Urbano a través del correo electrónico oficial: contacto@guardianurbano.com. Atenderemos cada mensaje con seriedad y en el menor tiempo posible, buscando siempre mejorar la experiencia del usuario y garantizar el cumplimiento de estos Términos de Uso."
    }
];;

    return (
        <div className="terminos-page">
            <div className="container mt-0 mb-0 pt-2 pb-2 termino">
                <header className="header-section terminos text-center py-4">
                    <h1 className="text-white">Términos y Condiciones</h1>
                    <p className="text-white">La seguridad de la Ciudad es nuestra prioridad</p>
                </header>

                <section className=" mt-3">
                    <p>Bienvenido a <strong>Guardian Urbano</strong>, una plataforma comunitaria cuyo objetivo es compartir alertas, reportes ciudadanos e imágenes sobre hechos delictivos ocurridos en zonas urbanas. Al acceder y usar este sitio web, aceptas los siguientes Términos y Condiciones. Si no estás de acuerdo con alguno de ellos, por favor no utilices la plataforma.</p>

                    {terminos.map((termino, index) => (
                        <article key={index} className="termino-section" >
                            <h2 aria-label={`Sección ${termino.titulo}`}>{termino.titulo}</h2>
                            <p>{termino.descripcion}</p>
                        </article>
                    ))}
                </section>
            </div>
        </div>
    );
};

