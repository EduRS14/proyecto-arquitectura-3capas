document.addEventListener('DOMContentLoaded', async function() {
    const baseUrl = 'http://191.234.214.157:3000/';

    // Función para obtener y mostrar notificaciones por categoría
    async function mostrarNotificacionesPorCategoria() {
        try {
            // Obtener todas las categorías de notificaciones
            const responseCategorias = await fetch(`${baseUrl}categoria-notificaciones`);
            const categorias = await responseCategorias.json();

            // Obtener todas las notificaciones
            const responseNotificaciones = await fetch(`${baseUrl}notificaciones`);
            const notificaciones = await responseNotificaciones.json();

            const categoriasContainer = document.getElementById('categorias-container');

            // Mostrar notificaciones agrupadas por categoría
            categorias.forEach(categoria => {
                // Crear contenedor para la categoría
                const divCategoria = document.createElement('div');
                divCategoria.classList.add('categoria');
                divCategoria.innerHTML = `<h2>${categoria.nombre}</h2>`;
                
                // Crear lista para las notificaciones de esta categoría
                const ulNotificaciones = document.createElement('ul');
                ulNotificaciones.classList.add('notificaciones-lista');

                // Filtrar y agregar las notificaciones de esta categoría
                const notificacionesCategoria = notificaciones.filter(notificacion => notificacion.id_tipo_categoria === categoria._id);
                notificacionesCategoria.forEach(notificacion => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        ${notificacion.contenido} - ${formatearFecha(notificacion.fecha)}
                        <button class="eliminar-btn" data-id="${notificacion._id}">Eliminar</button>
                    `;
                    ulNotificaciones.appendChild(li);
                });

                divCategoria.appendChild(ulNotificaciones);
                categoriasContainer.appendChild(divCategoria);
            });

            // Agregar eventos de clic a los botones de eliminar
            const botonesEliminar = document.querySelectorAll('.eliminar-btn');
            botonesEliminar.forEach(boton => {
                boton.addEventListener('click', async function() {
                    const notificacionId = this.dataset.id;
                    await eliminarNotificacion(notificacionId);
                });
            });

        } catch (error) {
            console.error('Error al obtener notificaciones y categorías:', error);
        }
    }

    // Función para eliminar una notificación
    async function eliminarNotificacion(notificacionId) {
        try {
            const response = await fetch(`${baseUrl}notificaciones/${notificacionId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Notificación eliminada exitosamente');
                // Recargar la página para actualizar la lista de notificaciones
                window.location.reload();
            } else {
                alert('Error al eliminar la notificación');
            }
        } catch (error) {
            console.error('Error al eliminar la notificación:', error);
        }
    }

    // Función para formatear la fecha
    function formatearFecha(fecha) {
        const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', opciones);
        return `Fecha: ${fechaFormateada}`;
    }

    // Manejar clic en el botón "Volver al Menú Principal"
    const volverMenuButton = document.getElementById('volver-menu');
    volverMenuButton.addEventListener('click', function() {
        window.location.href = 'index.html'; // Redireccionar al menú principal
    });

    // Llamar a la función para mostrar las notificaciones por categoría
    mostrarNotificacionesPorCategoria();
});
