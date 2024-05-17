$(document).ready(function() {
    // Cargar publicaciones públicas al cargar la página
    loadPublicPosts();
});

function createPublicPostHtml(post) {
    return `
        <div class="col-md-4 mb-4" id="post-${post._id}">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${post.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Publicado por: ${post.nombreUsuario}</h6>
                    <p class="card-text descripcion">${post.descripcion}</p>
                    <p class="card-text fecha-inicio" data-date="${post.fecha_inicio}"><small class="text-muted">Inicio: ${new Date(post.fecha_inicio).toLocaleDateString()}</small></p>
                    <p class="card-text fecha-final" data-date="${post.fecha_final}"><small class="text-muted">Fin: ${new Date(post.fecha_final).toLocaleDateString()}</small></p>
                </div>
            </div>
        </div>
    `;
}

function loadPublicPosts() {
    $.ajax({
        url: 'http://127.0.0.1:5000/api/tareas/publicas',
        type: 'GET',
        success: function(posts) {
            $('#postsContainer').empty(); // Limpiar contenedor de posts
            posts.forEach(function(post) {
                var postHtml = createPublicPostHtml(post);
                $('#postsContainer').append(postHtml);
            });
        },
        error: function() {
            alert('Error al cargar las publicaciones');
        }
    });
}
