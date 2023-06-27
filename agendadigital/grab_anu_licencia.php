<?php 
header("Content-Type: application/json;charset=utf-8");
require 'includes/config.php';
require 'includes/functions.php';
$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

if (!empty($_POST['codigo'])&& isset($_POST['codigo'])){
	$codigo = $_POST['codigo'];

	$sql = "update licencias set estado=2 where id=".$codigo;

	if (mysqli_query($db,$sql)){
		$array = array(
									"status" => "ok",
									"mensaje" => "Anulado con exito...",
									);
		echo json_encode($array);

	}else{
		$array = array(
									"status" => "invalid",
									"mensaje" => "NO se grabo la anulacion de licencia solicitada"
									);
		echo json_encode($array);
	}

}else{
	echo "paramError";
}


?>