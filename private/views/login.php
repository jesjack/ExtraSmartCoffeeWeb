<!-- Outer Row -->
<div class="row justify-content-center">

  <div class="col-xl-10 col-lg-12 col-md-9">

    <div class="card o-hidden border-0 shadow-lg my-5">
      <div class="card-body p-0">
        <!-- Nested Row within Card Body -->
        <div class="row">
          <div class="col-lg-6 d-none d-lg-block bg-login-image" style="
            background-image: url('https://picsum.photos/600/800');
            filter: grayscale(100%);
          "></div>
          <div class="col-lg-6">
            <div class="p-5">
              <div class="text-center">
                <h1 class="h4 text-gray-900 mb-4">Iniciar sesión</h1>
              </div>
              <form class="user" action="/sesion" method="post">
                <input type="hidden" hidden value="logear" name="operacion">
                <div class="form-group">
                  <input name="usuario" type="text" class="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Nombre de usuario">
                </div>
                <div class="form-group">
                  <input name="pass" type="password" class="form-control form-control-user" id="exampleInputPassword" placeholder="Contraseña">
                </div>
                <button type="submit" class="btn btn-dark btn-user btn-block">
                  Iniciar sesión
                </button>
              </form>
              <hr>
              <div class="text-center">
                <a class="small" onclick="rg();" role="button">Crear una cuenta</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

</div>