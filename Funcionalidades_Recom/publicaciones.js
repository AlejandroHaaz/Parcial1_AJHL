$(document).ready(function() {
    // Verificar si el usuario está autenticado
    if (!localStorage.getItem('token')) {
        window.location.href = '../Usuarios/login.html'; // Redirigir a la página de login si no está autenticado
        return;
    }

    // Cargar publicaciones existentes al cargar la página
    loadPosts();

    // Manejar el envío del formulario de nuevas publicaciones
    $('#publishForms').submit(function(event) {
        event.preventDefault();
        var postData = {
            titulo: $('#exampleInputTitulo').val(),
            fecha_inicio: $('#exampleInputDate1').val(),
            fecha_final: $('#exampleInputDate2').val(),
            descripcion: $('#exampleDescription').val()
        };

        $.ajax({
            url: 'http://127.0.0.1:5000/api/tareas',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(postData),
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function(response) {
                $('#publishForms')[0].reset(); // Limpiar el formulario
                var postHtml = createPostHtml(response);
                $('#postsContainer').prepend(postHtml); // Agregar la nueva publicación al inicio del contenedor
                alert('Publicación realizada con éxito'); // Mostrar mensaje de éxito
            },
            error: function(xhr) {
                alert('Error al publicar: ' + xhr.responseText);
            }
        });
    });

    // Manejar clic en el botón de editar
    $(document).on('click', '.edit-post', function() {
        var postId = $(this).data('id');
        // Obtener los datos de la publicación actual
        var postCard = $('#post-' + postId);
        var titulo = postCard.find('.card-title').text();
        var fechaInicio = postCard.find('.fecha-inicio').data('date');
        var fechaFinal = postCard.find('.fecha-final').data('date');
        var descripcion = postCard.find('.card-text.descripcion').text();

        // Llenar el formulario con los datos de la publicación actual
        $('#exampleInputTitulo').val(titulo);
        $('#exampleInputDate1').val(fechaInicio);
        $('#exampleInputDate2').val(fechaFinal);
        $('#exampleDescription').val(descripcion);

        // Cambiar el texto del botón de enviar a "Actualizar"
        $('#submitBtn').text('Actualizar');

        // Cambiar el manejador de envío del formulario
        $('#publishForms').off('submit').submit(function(event) {
            event.preventDefault();
            var updatedPostData = {
                titulo: $('#exampleInputTitulo').val(),
                fecha_inicio: $('#exampleInputDate1').val(),
                fecha_final: $('#exampleInputDate2').val(),
                descripcion: $('#exampleDescription').val()
            };

            $.ajax({
                url: 'http://127.0.0.1:5000/api/tareas/' + postId,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(updatedPostData),
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                success: function(response) {
                    // Actualizar la publicación en el DOM
                    var updatedPostHtml = createPostHtml(response);
                    postCard.replaceWith(updatedPostHtml);
                    alert('Publicación actualizada con éxito');
                    $('#publishForms')[0].reset();
                    $('#submitBtn').text('Enviar');
                    // Restablecer el manejador de envío del formulario
                    $('#publishForms').off('submit').submit(function(event) {
                        event.preventDefault();
                        var postData = {
                            titulo: $('#exampleInputTitulo').val(),
                            fecha_inicio: $('#exampleInputDate1').val(),
                            fecha_final: $('#exampleInputDate2').val(),
                            descripcion: $('#exampleDescription').val()
                        };

                        $.ajax({
                            url: 'http://127.0.0.1:5000/api/tareas',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(postData),
                            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                            success: function(response) {
                                $('#publishForms')[0].reset(); // Limpiar el formulario
                                var postHtml = createPostHtml(response);
                                $('#postsContainer').prepend(postHtml); // Agregar la nueva publicación al inicio del contenedor
                                alert('Publicación realizada con éxito'); // Mostrar mensaje de éxito
                            },
                            error: function(xhr) {
                                alert('Error al publicar: ' + xhr.responseText);
                            }
                        });
                    });
                },
                error: function(xhr) {
                    alert('Error al actualizar la publicación: ' + xhr.responseText);
                }
            });
        });
    });
});

function createPostHtml(post) {
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
                <div class="card-footer">
                    <button class="btn btn-primary btn-sm edit-post" data-id="${post._id}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-post" data-id="${post._id}">Eliminar</button>
                </div>
            </div>
        </div>
    `;
}

function loadPosts() {
    $.ajax({
        url: 'http://127.0.0.1:5000/api/tareas',
        type: 'GET',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        success: function(posts) {
            $('#postsContainer').empty(); // Limpiar contenedor de posts
            posts.forEach(function(post) {
                var postHtml = createPostHtml(post);
                $('#postsContainer').append(postHtml);
            });
        },
        error: function() {
            alert('Error al cargar las publicaciones');
        }
    });
}

// Añadir event listener para botones de eliminar
$(document).on('click', '.delete-post', function() {
    var postId = $(this).data('id');
    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
        $.ajax({
            url: 'http://127.0.0.1:5000/api/tareas/' + postId,
            type: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function() {
                loadPosts(); // Recargar las publicaciones
                alert('Publicación eliminada con éxito'); // Mostrar mensaje de éxito
            },
            error: function() {
                alert('Error al eliminar la publicación');
            }
        });
    }
});
