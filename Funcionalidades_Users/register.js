$(document).ready(function() {
    $('#registerForm').submit(function(event) {
        event.preventDefault(); // Prevenir el envío tradicional del formulario
        var registerData = {
            name: $('#registerName').val(),
            email: $('#registerEmail').val(),
            password: $('#registerPassword').val()
        };

        $.ajax({
            url: 'http://127.0.0.1:5000/api/users/register',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(registerData),
            success: function(response) {
                alert('Registro exitoso. Por favor, inicia sesión.');
                window.location.href = 'login.html'; // Redirigir a la página de login
            },
            error: function(xhr) {
                $('#errorContainer').html('<p style="color:red;">Error de registro: ' + xhr.responseText + '</p>');
            }
        });
    });
});
