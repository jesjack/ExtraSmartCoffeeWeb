<?php include 'layouts/head.php' ?>
<!-- <?php include 'functions/frase.php' ?> -->
<!-- Page Heading -->
<div class="d-sm-flex align-items-center justify-content-between mb-4">
  <h1 class="h3 mb-0 text-gray-800">ExtraSmartCoffee</h1>
  <!-- <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-download fa-sm text-white-50"></i> Generate Report
  </a> -->
</div>
<div class="row row-cols-1 row-cols-xl-2">
  <div class="card border-0 border-left-dark shadow col">
    <h5 class="mx-3 mt-3">Frase del día</h5>
    <?php
    # Version 1.2 by davidmartindel  (http://es.wikiquote.org/wiki/Usuario_Discusión:Davidmartindel) under GPL license
    $semana = date("D");
    $semanaArray = array( "Mon" => "lunes", "Tue" => "martes", "Wed" => "miércoles", "Thu" => "jueves", "Fri" => "viernes", "Sat" => "sábado", "Sun" => "domingo", ); 
    $title=urlencode(sprintf('{{Plantilla:Frase-%s}}', $semanaArray[$semana]));
    $sock = fopen("http://es.wikiquote.org/w/api.php?action=parse&format=php&text=$title","r");
    if (!$sock) {
      echo "$errstr ($errno)<br/>\n"; ##Error si no ha sido posible
    } else {
      # Hacemos la peticion al servidor
      $array__ = unserialize(stream_get_contents($sock));
      $texto_final=$array__["parse"]["text"]["*"];
        
      $texto_final=utf8_decode( $texto_final);
      $texto_final=str_replace ('/wiki/', 'http://es.wikiquote.org/wiki/' ,$texto_final );
      $texto_final=str_replace ('a href=', 'a target="_blank" href=' ,$texto_final );
      $texto_final=str_replace ('/w/index.php?title=', 'http://es.wikiquote.org/w/index.php?title=', $texto_final);
        
      #mostramos en pantalla la frase
      echo utf8_encode($texto_final);           
    }
    ?>
    <script>
      $(document).ready(() => { 
        $('#toc').css({ 'background-color': 'transparent' });
        $('[style="text-align:center; font-weight: bold; color: #090960;]').addClass('text-dark');
        $('[bgcolor="#F4F4F5"]').css({ 'background-color': 'transparent' });
        $($('[id="toc"]')[1].childNodes[0].childNodes[0]).addClass('rounded');
      });
    </script>
  </div>
</div>



<?php include 'layouts/foot.php' ?>