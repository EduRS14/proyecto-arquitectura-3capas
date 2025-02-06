document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = 'http://191.234.214.157:3000/';
  
    // Función para buscar un usuario por nombre desde index.html
    async function buscarUsuario(nombreUsuario) {
      try {
        const response = await fetch(`${baseUrl}usuarios`);
        const usuarios = await response.json();
        const usuarioEncontrado = usuarios.find(usuario => usuario.nombre_completo.toLowerCase() === nombreUsuario.toLowerCase());
  
        if (usuarioEncontrado) {
          // Redireccionar a la página de usuario con sus publicaciones y comentarios
          window.location.href = `usuario.html?id=${usuarioEncontrado._id}`;
        } else {
          alert('Usuario no encontrado');
        }
      } catch (error) {
        console.error('Error al buscar usuario:', error);
      }
    }
  
    // Manejar la búsqueda de usuario desde index.html
    const formBuscarUsuario = document.getElementById('form-buscar-usuario');
    formBuscarUsuario.addEventListener('submit', function(event) {
      event.preventDefault();
      const nombreUsuario = document.getElementById('nombre-usuario').value.trim();
      if (nombreUsuario) {
        buscarUsuario(nombreUsuario);
      }
    });
  });
  