$(document).ready(function() {
    $('#loginForm').submit(function(event) {
        event.preventDefault();
        var loginData = {
            email: $('#loginEmail').val(),
            password: $('#loginPassword').val()
        };

        $.ajax({
            url: 'http://127.0.0.1:5000/api/users/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(loginData),
            success: function(response) {
                localStorage.setItem('token', response.token); // Guardar el token
                window.location.href = '../Recomendaciones/publicaciones.html'; // Redirigir a la página de publicaciones
            },
            error: function(xhr) {
                $('#errorContainer').html('<p style="color:red;">Error de login: ' + xhr.responseText + '</p>')
            }
        });
    });
});
