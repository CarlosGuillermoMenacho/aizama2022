<?php 
header("Content-Type: application/json;charset=utf-8");
require 'includes/config.php';
require 'includes/functions.php';
$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

if (!empty($_POST['codigo'])&& isset($_POST['codigo'])&&!empty($_POST['cod_tut'])&& isset($_POST['cod_tut'])&&!empty($_POST['f_sol'])&& isset($_POST['f_sol'])&&!empty($_POST['hora'])&& isset($_POST['hora'])&&!empty($_POST['f_ini'])&& isset($_POST['f_ini'])&&!empty($_POST['f_fin'])&& isset($_POST['f_fin'])&&!empty($_POST['obs'])&& isset($_POST['obs'])){
	$codigo = $_POST['codigo'];
	$cod_tut = $_POST['cod_tut'];
	$f_sol = tratarFecha2(trim($_POST['f_sol']));
	$hora = $_POST['hora'];
	$f_ini = tratarFecha($_POST['f_ini']);
	$f_fin = tratarFecha($_POST['f_fin']);
	$obs = $_POST['obs'];

	$sql = "insert into licencias (codigo,cod_tut,f_solicitud,h_solicitud,f_ini,f_fin,obs,estado) values(".$codigo.",".$cod_tut.",'".$f_sol."','".$hora."','".$f_ini."','".$f_fin."','".$obs."',1)";

	if (mysqli_query($db,$sql)){
		$sql2 = "select * from licencias
						where codigo = ".$codigo." and cod_tut = ".$cod_tut." and f_solicitud = '".$f_sol."' and h_solicitud = '".$hora."' and 
							  f_ini = '".$f_ini."' and f_fin = '".$f_fin."' and estado=1";

		$consulta = mysqli_query($db,$sql2);
		if ($row2 = $consulta->fetch_object()) {
			$array = array(
									"status" => "ok",
									"mensaje" => "Grabado con exito...",
									"id" => $row2->id
									);
			echo json_encode($array);

		}else{
			$array = array(
									"status" => "invalid",
									"mensaje" => "NO se grabo la licencia solicitada"
									);
			echo json_encode($array);
		}

	}else{
		echo "negativo";
	}
}else{
	echo "paramError";
}
function tratarFecha($fecha){
    $cadena = explode("/",$fecha);
    $dia = $cadena[0];
    $mes = $cadena[1];
    $anio = $cadena[2];
    if($dia<10)$dia = '0'.$dia;
    if($mes<10)$mes = '0'.$mes;
    
    return $anio.'-'.$mes.'-'.$dia;
}
function tratarFecha2($fecha){
    $cadena = explode("-",$fecha);
    $dia = $cadena[0];
    $mes = $cadena[1];
    $anio = $cadena[2];
    if($dia<10)$dia = '0'.$dia;
    if($mes<10)$mes = '0'.$mes;
    
    return $anio.'-'.$mes.'-'.$dia;
}

?>