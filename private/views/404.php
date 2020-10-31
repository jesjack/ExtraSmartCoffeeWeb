<?php require 'layouts/head.php'; ?>
<!-- 404 Error Text -->
<div class="text-center">
  <div class="error mx-auto" data-text="<?= $status ?>"><?= $status ?></div>
  <p class="lead text-gray-800 mb-5"><?= $error ?></p>
  <pre><p class="text-gray-500 mb-0 text-left"><?= $stack ?></p></pre>
  <a href="/">&larr; Regresar a la página principal</a>
</div>
<?php require 'layouts/foot.php'; ?>