<?php
date_default_timezone_set('America/La_Paz');
function cliente_activo(){
  if (!isset($_SESSION["app_user_active"]) || ($_SESSION["app_user_active"]!=true))
    return false;
  else{
    $fechaGuardada = $_SESSION["app_user_access"]; 
    $ahora = date("Y-n-j H:i:s"); 
    $tiempo_transcurrido = (strtotime($ahora)-strtotime($fechaGuardada)); 
    if($tiempo_transcurrido >= 18000) { #---5horas = 18000
	  $_SESSION["app_user_active"] = false;
	  return false;
    }
    else{ 
      $_SESSION["app_user_access"] = $ahora; 
	  return true;
    } 
  }
}

function getMes($fecha){
  list($yyyy, $mm, $dd) = explode('-', $fecha);
  return $mm;
}

function getAno($fecha){
  list($yyyy, $mm, $dd) = explode('-', $fecha);
  return $yyyy;
}

function getFechaBoli($fecha){
  list($yyyy, $mm, $dd) = explode('-', $fecha);
  return $dd.'/'.$mm.'/'.$yyyy;
}

function getFechaInglesa($fecha){
  list($yyyy, $mm, $dd) = explode('-', $fecha);
  return $mm.'/'.$dd.'/'.$yyyy;
}
function connectDB() {
    require 'config.php';
    $connectDB = new mysqli($servername, $username, $password, $database);
    if (!$connectDB) {
      echo 'Error al conectar a la base de datos';
      exit;
    } 
    return $connectDB;
}

  function connectDBGlobal() {
    require 'config2.php';
    $connectDB = new mysqli($servername, $username, $password, $database);
    if (!$connectDB) {
      echo 'Error al conectar a la base de datos';
      exit;
    } 
    return $connectDB;
  }

  function verificarParametros($parametros) {
    $existeParametros = true;
    if ($parametros) {
      foreach ($parametros as $parametro ) {
        if ( isset($_POST[$parametro]) ) {
          if ( $_POST[$parametro] !== "0" && empty($_POST[$parametro]) ) {
            $existeParametros = false;
            return;
          }
        } else {
          $existeParametros = false;
          return;
        }
      }
    }
    return $existeParametros;
  }

?>