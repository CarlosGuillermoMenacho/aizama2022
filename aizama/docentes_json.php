<?php 
session_start();
require 'includes/functions.php';
if(!cliente_activo())
{
  echo 'eSession';
  exit();
}
$administrador = $_SESSION['app_user_id'];
			
require 'includes/config.php';
$db = mysqli_connect($servername, $username, $password, $database) 
								or die('Error al intentar conectar con el servidor.');
			
$sql = "select * from personal where cod_per=".$administrador;
$result = mysqli_query($db,$sql);

if ($row=$result->fetch_object()) {
				
	$sql = "select codprof,concat(apepro,' ',nompro) as nombre from profe where estado = 'Activo'";
	$result = mysqli_query($db,$sql);

	$lista = array();
	while ($row = $result->fetch_object()) {
		$lista[] = array(
						"codigo"=>$row->codprof,
						"nombre"=>utf8_encode($row->nombre)					
						);
	}
	if (count($lista)>0) {
		$respuesta = array(
							"status"=>"ok",
							"docentes"=>$lista
						);


		echo json_encode($respuesta);
	}else{
		$respuesta = array("status"=>"noData");
		echo json_encode($respuesta);
	}
}else{
	$respuesta = array("status"=>"noPermitido");
	echo json_encode($respuesta);
}
?>