<?php
session_start();
if ($_SESSION['app_user_nivel']=='portero'){
    require 'header_por.php';
}else{
    require 'header_adm.php';
}
?>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" integrity="sha512-nMNlpuaDPrqlEls3IX/Q56H36qvBASwb3ipuo3MxeWbsQB1881ox0cRv7UPTgBlriqoynt35KjEwgGUeUXIPnw==" crossorigin="anonymous" /> 
<link rel="stylesheet" href="css/registro_ingresos.css?v=<?php echo rand();?>">
<body>
  <form action="" method="post" enctype="multipart/form-data" name="fGrabar" target="wPDFframe" id="fGrabar">
    <div class="container-box">
      <div class="container">
        <h1 class="text-center uppercase">Registro de Salida</h1>
        <div class="motivo" style="margin-bottom:20px">
              <label>Nombre o c&oacute;digo:</label>
              <select id="select-alu">
                  <option value="">-- Seleccionar alumno --</option>
              </select>
        </div>
        <div class="motivo" style="margin-bottom:20px">
            <label>Info:</label>
            <input id="input-curso" type="text"  readonly size="30">
            
        </div>
        <div class="motivo" style="margin-bottom:20px">
            <label>Codigo:</label>
            <input id="input-codigo" type="text"  readonly>
        </div>
        <div class="div-btnGrabar">
          <input type="button" class="btn" id="btngrabar" value="grabar">
        </div>
        <div class="motivo" style="margin-bottom:20px">
            <label>Detalles:</label>
            <input type="text" id="info_text" readonly/>
        </div>
      </div>
    </div>
  </form>
</body>
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/registro_salidas.js?v=<?php echo(rand());?> "></script> 
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js" integrity="sha512-2ImtlRlf2VVmiGZsjm9bEyhjGW4dU7B6TNwh/hx/iSByxNENtj3WVE6o/9Lj4TJeVXPi4bnOIMXFIJJAeufa0A==" crossorigin="anonymous"></script>
</html>