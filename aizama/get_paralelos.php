<?php
  session_start();
  require 'includes/functions.php';
  require 'includes/config.php';
  $db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
  $sql = "SELECT cod_par, descrip FROM paralelos WHERE estado=1";
  $result = mysqli_query($db, $sql);
  $paralelo = [];
  while($row = $result->fetch_object()) {
    $paralelo[] = array(
          "codigo"=>$row->cod_par,
          "nombre"=>$row->descrip					
          );
    }
  if (count($paralelo)>0) {
    $respuesta = array(
              "status"=>"ok",
              "paralelos"=>$paralelo
            );
    echo json_encode($respuesta);
  }else{
    $respuesta = array("status"=>"noData");
    echo json_encode($respuesta);
  }