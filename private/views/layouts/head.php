<?php
	
	$current_hour = getdate()['hours'];
	$day = $current_hour > 7 && $current_hour < 19;

  $_GET = json_decode(json_encode($_GET), true);
  $_POST = json_decode(json_encode($_POST), true);

?>
<!DOCTYPE html>
<html lang="es">

<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">

  <title>ExtraSmartCoffee</title>

  <!-- Custom fonts for this template-->
  <link href="/vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

  <!-- Custom styles for this template-->
  <link href="/css/sb-admin-2.min.css" rel="stylesheet">

  <link rel="icon" type="image/png" href="/images/ExtraSmartCoffeeW.png">
  <script src="/vendor/jquery/jquery.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>

</head>

<body id="page-top">

  <!-- Page Wrapper -->
  <div id="wrapper">

    <!-- Sidebar -->
    <ul class="navbar-nav <?= $day ? 'bg-light sidebar-light' : 'bg-gradient-dark sidebar-dark' ?> sidebar accordion" id="accordionSidebar">

      <!-- Sidebar - Brand -->
      <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/">
        <div class="sidebar-brand-icon">
          <!-- <i class="fas fa-laugh-wink"></i> -->
          <img src="/images/ExtraSmartCoffee<?= $day ? '' : 'W' ?>.png" alt="ESC" style="
            max-width: 60px;
          ">
        </div>
        <div class="sidebar-brand-text mx-3">ESC</div>
      </a>

      <!-- Divider -->
      <hr class="sidebar-divider my-0">

      <!-- Nav Item - Página principal -->
      <li class="nav-item <?= $nav == 'index' ? 'active' : '' ?>">
        <a class="nav-link" href="/">
          <i class="fas fa-home"></i>
          <span>Página principal</span></a>
      </li>

      <?php 
      if(isset($servers) && count($servers) > 0) { ?>
        <!-- Divider -->
        <hr class="sidebar-divider">

        <!-- Heading -->
        <div class="sidebar-heading">
          Minecraft
        </div>

        <!-- Nav Item - Pages Collapse Menu -->
        <li class="nav-item <?= $nav == 'm_server' ? 'active' : '' ?>">
          <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
            <i class="fas fa-server"></i>
            <span>Servidores</span>
          </a>
          <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
            <div class="bg-white py-2 collapse-inner rounded">
              <?php
              if(!isset($user)) { ?>
                <h6 class="collapse-header">Tienes que iniciar sesión.</h6>
              <?php } else { ?>
                <h6 class="collapse-header">Servidóres</h6>
                <?php
                  foreach ($servers as $server) { ?>
                    <a class="collapse-item" href="/minecraft/@/<?= $server ?>"><?= $server ?></a>
                  <?php }
                ?>
              <?php }
              ?>
            </div>
          </div>
        </li>

        <!-- Nav Item - Archivos Collapse Menu -->
        <li class="nav-item <?= $nav == 'm_archive' ? 'active' : '' ?>">
          <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilities" aria-expanded="true" aria-controls="collapseUtilities">
            <i class="fas fa-folder"></i>
            <span>Archivos</span>
          </a>
          <div id="collapseUtilities" class="collapse" aria-labelledby="headingUtilities" data-parent="#accordionSidebar">
            <div class="bg-white py-2 collapse-inner rounded">
              <?php
              if(!isset($user)) { ?>
                <h6 class="collapse-header">Tienes que iniciar sesión.</h6>
              <?php } else { ?>
                <h6 class="collapse-header">Servidóres</h6>
                <?php
                  foreach ($servers as $server) { ?>
                    <a class="collapse-item" href="/minecraft/@/<?= $server ?>"><?= $server ?></a>
                  <?php }
                ?>
              <?php }
              ?>
            </div>
          </div>
        </li>
      <?php }
      ?>

      <!-- Divider -->
      <hr class="sidebar-divider">

      <!-- Heading -->
      <div class="sidebar-heading">
        Utilidádes
      </div>

      <!-- Nav Item - Archivos -->
      <li class="nav-item <?= $nav == 'archive' ? 'active' : '' ?>">
        <a class="nav-link" href="/file">
          <i class="fas fa-folder"></i>
          <span>Archivos</span></a>
      </li>

      <!-- Nav Item - Sesión Collapse Menu -->
      <!-- <li class="nav-item">
        <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseSesion" aria-expanded="true" aria-controls="collapseSesion">
          <i class="fas fa-user"></i>
          <span>Sesión</span>
        </a>
        <div id="collapseSesion" class="collapse" aria-labelledby="headingUtilities" data-parent="#accordionSidebar">
          <div class="bg-white py-2 collapse-inner rounded">
            <h6 class="collapse-header">Sesión:</h6>
            <a class="collapse-item" href="utilities-color.html">Iniciar sesión</a>
            <a class="collapse-item" href="utilities-border.html">Registrarse</a>
          </div>
        </div>
      </li> -->

      <!-- Divider -->
      <hr class="sidebar-divider d-none d-md-block">

      <!-- Sidebar Toggler (Sidebar) -->
      <div class="text-center d-none d-md-inline">
        <button class="rounded-circle border-0" id="sidebarToggle"></button>
      </div>

    </ul>
    <!-- End of Sidebar -->

    <!-- Content Wrapper -->
    <div id="content-wrapper" class="d-flex flex-column">

      <!-- Main Content -->
      <div id="content">

        <!-- Topbar -->
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

          <!-- Sidebar Toggle (Topbar) -->
          <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
            <i class="fa fa-bars"></i>
          </button>

          <!-- Topbar Search -->
          <form class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
            <div class="input-group">
              <input type="text" class="form-control bg-light border-0 small" placeholder="Buscar" aria-label="Search" aria-describedby="basic-addon2">
              <div class="input-group-append">
                <button class="btn btn-dark" type="button">
                  <i class="fas fa-search fa-sm"></i>
                </button>
              </div>
            </div>
          </form>

          <!-- Topbar Navbar -->
          <ul class="navbar-nav ml-auto">

            <!-- Nav Item - Search Dropdown (Visible Only XS) -->
            <li class="nav-item dropdown no-arrow d-sm-none">
              <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-search fa-fw"></i>
              </a>
              <!-- Dropdown - Messages -->
              <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
                <form class="form-inline mr-auto w-100 navbar-search">
                  <div class="input-group">
                    <input type="text" class="form-control bg-light border-0 small" placeholder="Buscar" aria-label="Search" aria-describedby="basic-addon2">
                    <div class="input-group-append">
                      <button class="btn btn-dark" type="button">
                        <i class="fas fa-search fa-sm"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </li>

            <div class="topbar-divider d-none d-sm-block"></div>

            <script>
            	function is() {
            		$.ajax({
            			url: '/sesion/iniciar',
            			success: res => {
            				$('#j-content').html(res);
            			}
            		});
            	} function rg() {
            		$.ajax({
            			url: '/sesion/crear',
            			success: res => {
            				$('#j-content').html(res);
            			}
            		});
            	}
            </script>

            <?php 
            if(isset($user)) { ?>
              <!-- Nav Item - User Information -->
              <li class="nav-item dropdown no-arrow">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span class="mr-2 d-none d-lg-inline text-gray-600 small"><?= $user ?></span>
                  <img class="img-profile rounded-circle" src="https://source.unsplash.com/QAB-WJcbgJk/60x60">
                </a>
                <!-- Dropdown - User Information -->
                <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                  <a class="dropdown-item" href="#">
                    <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                    Profile
                  </a>
                  <a class="dropdown-item" href="#">
                    <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                    Settings
                  </a>
                  <a class="dropdown-item" href="#">
                    <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                    Activity Log
                  </a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                    <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                    Cerrar sesión
                  </a>
                </div>
              </li>

              <!-- Logout Modal-->
              <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">¿Listo para salir?</h5>
                      <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                    <div class="modal-body">Selecciona "Cerrar sesión" si estás seguro de lo que haces.</div>
                    <div class="modal-footer">
                      <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                      <a class="btn btn-primary" href="/sesion/cerrar">Cerrar sesión</a>
                    </div>
                  </div>
                </div>
              </div>
            <?php } else { ?>
              <!-- Nav Item - Iniciar sesión -->
              <li class="nav-item">
                <a class="nav-link" onclick="is();" role="button">
                  <span class="mr-2 d-lg-inline text-gray-600 small">Iniciar sesión</span>
                  <!-- <img class="img-profile rounded-circle" src="https://source.unsplash.com/QAB-WJcbgJk/60x60"> -->
                </a>
              </li>

              <!-- Nav Item - Registrarse -->
              <li class="nav-item">
                <a class="nav-link" onclick="rg();" role="button">
                  <span class="mr-2 d-lg-inline text-gray-600 small">Registrarse</span>
                  <!-- <img class="img-profile rounded-circle" src="https://source.unsplash.com/QAB-WJcbgJk/60x60"> -->
                </a>
              </li>
            <?php }
            ?>

          </ul>

        </nav>
        <!-- End of Topbar -->

        <!-- Begin Page Content -->
        <div class="container-fluid" id="j-content">
          <?php 

            if(isset($_GET['error']) && $_GET['error'] == 'pass') { ?>
              <script>
                $(document).ready(() => {

                  is();
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Parece que tu usuario o contraseña son incorrectos.'
                  });

                });

              </script>
            <?php }

          ?>