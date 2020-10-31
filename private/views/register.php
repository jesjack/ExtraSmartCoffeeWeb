<div class="card o-hidden border-0 shadow-lg my-5">
  <div class="card-body p-0">
    <!-- Nested Row within Card Body -->
    <div class="row">
      <div class="col-lg-5 d-none d-lg-block bg-register-image" style="
        background-image: url('https://picsum.photos/600/800');
        filter: grayscale(100%);
      "></div>
      <div class="col-lg-7">
        <div class="p-5">
          <div class="text-center">
            <h1 class="h4 text-gray-900 mb-4">Registrarse</h1>
          </div>
          <form class="user" action="/sesion" method="post" id="registerForm">
            <input type="hidden" hidden value="registrar" name="operacion" id="op">
            <div class="form-group">
              <input name="usuario" type="text" class="form-control form-control-user" id="user" placeholder="Nombre de usuario">
            </div>
            <div class="form-group">
              <input name="correo" type="email" class="form-control form-control-user" id="mail" placeholder="Correo electrónico">
            </div>
            <div class="form-group row">
              <div class="col-sm-6 mb-3 mb-sm-0">
                <input name="pass" type="password" class="form-control form-control-user" id="pass" placeholder="Contraseña">
              </div>
              <div class="col-sm-6">
                <input type="password" class="form-control form-control-user" id="rpass" placeholder="Repita contraseña">
              </div>
            </div>
            <button type="submit" class="btn btn-dark btn-user btn-block">
              Crear cuenta
            </button>
          </form>

          <script>

            $('#registerForm').submit(evt => {

              evt.preventDefault();

              var user = $('#user').val();
              var mail = $('#mail').val();
              var pass = $('#pass').val();
              var rpass = $('#rpass').val();

              if(
                $('#user').hasClass('is-valid') &&
                $('#mail').hasClass('is-valid') &&
                $('#pass').hasClass('is-valid') &&
                $('#rpass').hasClass('is-valid')
              ) {

                Swal.fire({
                  // position: 'top-end',
                  icon: 'success',
                  title: 'Solicitud enviada.',
                  showConfirmButton: false
                  // timer: 1500
                });

                $.ajax({
                  url: '/sesion',
                  method: 'POST',
                  data: {
                    'operacion': 'registrar',
                    'usuario': user,
                    'correo': mail,
                    'pass': pass
                  },
                  success: res => {
                    $('#result').html(res);
                  }
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Hay algún error con tus datos'
                });
              }

            });

            clearInterval(validInterval);

            var validInterval = setInterval(() => {
              var user = $('#user').val();
              var mail = $('#mail').val();
              var pass = $('#pass').val();
              var rpass = $('#rpass').val();

              if(user == '') {
                $('#user').removeClass('is-invalid');
                $('#user').removeClass('is-valid');
              } else if(/^[a-zA-Z0-9_]*$/g.test(user)) {
                $('#user').removeClass('is-invalid');
                $('#user').addClass('is-valid');
              } else {
                $('#user').removeClass('is-valid');
                $('#user').addClass('is-invalid');
              }

              if(mail == '') {
                $('#mail').removeClass('is-invalid');
                $('#mail').removeClass('is-valid');
              } else if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(mail)) {
                $('#mail').removeClass('is-invalid');
                $('#mail').addClass('is-valid');
              } else {
                $('#mail').removeClass('is-valid');
                $('#mail').addClass('is-invalid');
              }

              if(pass === '') {
                $('#pass').removeClass('is-valid');
                $('#pass').addClass('is-invalid');
              } else {
                $('#pass').removeClass('is-invalid');
                $('#pass').addClass('is-valid');
              }

              if(pass !== rpass) {
                $('#rpass').removeClass('is-valid');
                $('#rpass').addClass('is-invalid');
              } else {
                $('#rpass').removeClass('is-invalid');
                $('#rpass').addClass('is-valid');
              }
            }, 1);

          </script>

          <div class="text-center">
            <a class="small" onclick="is();" role="button">Iniciar sesión</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div id="result"></div>