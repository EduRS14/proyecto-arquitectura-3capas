document.addEventListener('DOMContentLoaded', async function() {
    const baseUrl = 'http://191.234.214.157:3000/';

    // Función para obtener y mostrar mensajes agrupados por remitente
    async function mostrarMensajesRecibidos() {
        try {
            // Obtener todos los usuarios
            const responseUsuarios = await fetch(`${baseUrl}usuarios`);
            const usuarios = await responseUsuarios.json();

            // Obtener todos los mensajes
            const responseMensajes = await fetch(`${baseUrl}mensajes-privados`);
            const mensajes = await responseMensajes.json();

            const mensajesContainer = document.getElementById('mensajes-container');

            // Agrupar mensajes por remitente
            const mensajesPorRemitente = mensajes.reduce((acc, mensaje) => {
                if (!acc[mensaje.id_usuario_envia]) {
                    acc[mensaje.id_usuario_envia] = [];
                }
                acc[mensaje.id_usuario_envia].push(mensaje);
                return acc;
            }, {});

            // Mostrar mensajes agrupados por remitente
            for (const [idRemitente, mensajes] of Object.entries(mensajesPorRemitente)) {
                const usuarioRemitente = usuarios.find(usuario => usuario._id === idRemitente);
                const nombreRemitente = usuarioRemitente ? usuarioRemitente.nombre_completo : 'Usuario desconocido';

                // Crear contenedor para el remitente
                const divRemitente = document.createElement('div');
                divRemitente.classList.add('remitente');
                divRemitente.innerHTML = `<h2>${nombreRemitente}</h2>`;
                
                // Crear lista para los mensajes de este remitente
                const ulMensajes = document.createElement('ul');
                ulMensajes.classList.add('mensajes-lista');

                // Agregar los mensajes a la lista
                mensajes.forEach(mensaje => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        ${mensaje.contenido} - ${formatearFecha(mensaje.fecha)}
                        <button class="editar-btn" data-id="${mensaje._id}">Editar</button>
                    `;
                    ulMensajes.appendChild(li);
                });

                divRemitente.appendChild(ulMensajes);
                mensajesContainer.appendChild(divRemitente);
            }

            // Añadir eventos a los botones de editar
            document.querySelectorAll('.editar-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const idMensaje = this.getAttribute('data-id');
                    editarMensaje(idMensaje);
                });
            });

        } catch (error) {
            console.error('Error al obtener los mensajes:', error);
        }
    }

    // Función para formatear la fecha
    function formatearFecha(fecha) {
        const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', opciones);
        return `Enviado el ${fechaFormateada}`;
    }

    // Función para manejar la edición de un mensaje
    async function editarMensaje(idMensaje) {
        const nuevoContenido = prompt('Introduce el nuevo contenido del mensaje:');
        if (nuevoContenido) {
            try {
                const response = await fetch(`${baseUrl}mensajes-privados/${idMensaje}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ contenido: nuevoContenido })
                });

                if (response.ok) {
                    alert('Mensaje editado correctamente');
                    window.location.reload(); // Recargar la página para mostrar los cambios
                } else {
                    alert('Error al editar el mensaje');
                }
            } catch (error) {
                console.error('Error al editar el mensaje:', error);
            }
        }
    }

    // Función para manejar el envío de un mensaje
    async function enviarMensaje(event) {
        event.preventDefault();

        const destinatario = document.getElementById('destinatario').value.trim();
        const contenido = document.getElementById('contenido').value.trim();

        if (destinatario && contenido) {
            try {
                const response = await fetch(`${baseUrl}mensajes-privados`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_usuario_envia: 'id_usuario_actual', // Reemplaza con el ID del usuario actual
                        id_usuario_recibe: destinatario,
                        contenido: contenido,
                        fecha: new Date().toISOString()
                    })
                });

                if (response.ok) {
                    alert('Mensaje enviado correctamente');
                    window.location.reload(); // Recargar la página para mostrar los cambios
                } else {
                    alert('Error al enviar el mensaje');
                }
            } catch (error) {
                console.error('Error al enviar el mensaje:', error);
            }
        }
    }

    // Manejar clic en el botón "Volver al Menú Principal"
    const volverMenuButton = document.getElementById('volver-menu');
    volverMenuButton.addEventListener('click', function() {
        window.location.href = 'index.html'; // Redireccionar al menú principal
    });

    // Manejar el envío del formulario de mensaje
    const formEnviarMensaje = document.getElementById('form-enviar-mensaje');
    formEnviarMensaje.addEventListener('submit', enviarMensaje);

    // Cargar los mensajes al cargar la página
    mostrarMensajesRecibidos();
});
