document.addEventListener('DOMContentLoaded', async function() {
    const baseUrl = 'http://localhost:3000/';
  
    // Función para obtener y mostrar publicaciones y comentarios de un usuario
    async function mostrarPublicacionesYComentarios(idUsuario) {
      try {
        // Obtenenemos el nombre completo del usuario
        const responseUsuario = await fetch(`${baseUrl}usuarios/${idUsuario}`);
        const usuario = await responseUsuario.json();
  
        // Mostramos el nombre del usuario
        const nombreUsuarioElement = document.getElementById('nombre-usuario');
        nombreUsuarioElement.textContent = `Publicaciones de ${usuario.nombre_completo}`;
        nombreUsuarioElement.classList.add('usuario');
  
        // Obtenemos publicaciones del usuario
        const responsePublicaciones = await fetch(`${baseUrl}publicaciones`);
        const publicaciones = await responsePublicaciones.json();
  
        // Obtenemos los comentarios
        const responseComentarios = await fetch(`${baseUrl}comentarios`);
        const comentarios = await responseComentarios.json();
  
        // Mostramos cada publicación con sus comentarios
        const publicacionesUsuario = publicaciones.filter(publicacion => publicacion.id_usuario === idUsuario);
        const publicacionesContainer = document.getElementById('publicaciones-container');
  
        // Limpiamos el contenedor antes de agregar nuevas publicaciones
        publicacionesContainer.innerHTML = '';
  
        publicacionesUsuario.forEach(publicacion => {
          // Obtenenemos los comentarios de la publicación
          const comentariosPublicacion = comentarios.filter(comentario => comentario.id_publicacion === publicacion._id);
          const comentariosCount = comentariosPublicacion.length; // Conteo de comentarios
  
          // Creamos un elemento para la publicación
          const divPublicacion = document.createElement('div');
          divPublicacion.classList.add('publicacion');
          divPublicacion.innerHTML = `
            <h5 style="margin-top:30px; margin-bottom:10px;">${publicacion.contenido}</h5>
            <img src="https://www.posicionamiento-web.site/wp-content/uploads/2018/03/publicacion-en-rrss-exitosa.png" 
            class="img-fluid" alt="Imagen de la publicación" width="500">
            <h6 style="margin-top:10px; margin-bottom:50px;">Likes: ${publicacion.likes} - Comentarios: ${comentariosCount}</h6>
            <h5 style="margin-bottom:30px;">Comentarios:</h5>
            <ul class="comentarios-lista" style="max-width:500px;" id="comentarios-${publicacion._id}">
              <!-- Aquí se mostrarán los comentarios -->
            </ul>
            <h5 style="margin-top:20px; margin-bottom:10px;">Escribe un comentario:</h5>
            <form style="max-width:500px; height: auto;" class="form-comentario" id="form-comentario-${publicacion._id}">
              <input type="text" id="comentario-${publicacion._id}" placeholder="Escribe un comentario...">
              <button type="submit">Comentar</button>
            </form>
          `;
  
          // Mostrar comentarios de la publicación
          const comentariosLista = divPublicacion.querySelector(`#comentarios-${publicacion._id}`);
          comentariosPublicacion.forEach(comentario => {
            const li = document.createElement('li');
            li.textContent = `${comentario.comentario} - ${formatearFecha(comentario.fecha)}`;
            comentariosLista.appendChild(li);
            li.classList.add('lista');
          });
  
          // Agregar evento para manejar el envío de comentarios
          const formComentario = divPublicacion.querySelector(`#form-comentario-${publicacion._id}`);
          formComentario.addEventListener('submit', async function(event) {
            event.preventDefault();
            const comentarioInput = document.getElementById(`comentario-${publicacion._id}`);
            const contenido = comentarioInput.value.trim();
  
            if (contenido === '') {
              return;
            }
  
            try {
              const response = await fetch(`${baseUrl}comentarios`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  id_publicacion: publicacion._id,
                  id_usuario: idUsuario,
                  comentario: contenido,
                  fecha: new Date().toISOString()
                })
              });
  
              if (response.ok) {
                comentarioInput.value = '';
                const nuevoComentario = await response.json();
                const li = document.createElement('li');
                li.textContent = `${nuevoComentario.comentario} - ${formatearFecha(nuevoComentario.fecha)}`;
                comentariosLista.appendChild(li);
                li.classList.add('lista');
              } else {
                throw new Error('Error al enviar comentario');
              }
            } catch (error) {
              console.error('Error al enviar comentario:', error);
            }
          });
  
          // Agregar la publicación al contenedor
          publicacionesContainer.appendChild(divPublicacion);
        });
      } catch (error) {
        console.error('Error al obtener publicaciones y comentarios:', error);
      }
    }
  
    // Función para formatear la fecha
    function formatearFecha(fecha) {
      const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', opciones);
      return `Comentario hecho el ${fechaFormateada}`;
    }
  
    // Verificar si estamos en la página de usuario y obtener su ID desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idUsuario = urlParams.get('id');
    if (idUsuario) {
      mostrarPublicacionesYComentarios(idUsuario);
    }
  
    // Manejar clic en el botón "Volver al Menú Principal"
    const volverMenuButton = document.getElementById('volver-menu');
    volverMenuButton.addEventListener('click', function() {
      window.location.href = 'index.html'; // Redireccionar al menú principal
    });
  });
  