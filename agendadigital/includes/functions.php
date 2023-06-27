<?php
date_default_timezone_set('America/La_Paz');
function cliente_activo(){
  if (!isset($_SESSION["app_user_active"]) || ($_SESSION["app_user_active"]!=true))
    return false;
  else{
    $fechaGuardada = $_SESSION["app_user_access"]; 
    $ahora = date("Y-n-j H:i:s"); 
    $tiempo_transcurrido = (strtotime($ahora)-strtotime($fechaGuardada)); 
    if($tiempo_transcurrido >= 7200) { #---2horas = 7200
	  $_SESSION["app_user_active"] = false;
	  return false;
    } 
    else{ 
      $_SESSION["app_user_access"] = $ahora; 
	  return true;
    } 
  }
}
function limpiarCadena($str)
  {
    global $conexion;
    $str=mysqli_real_escape_string($conexion,trim($str));
    return htmlspecialchars($str);
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
?>