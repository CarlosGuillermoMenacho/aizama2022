<?php 
header("Content-Type: application/json;charset=utf-8");
require 'includes/config.php';
require 'includes/functions.php';
$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

if (!empty($_POST['codigo'])&& isset($_POST['codigo']) && !empty($_POST['fecha'])&& isset($_POST['fecha']) && !empty($_POST['hora'])&& isset($_POST['hora']) && !empty($_POST['tipo'])&& isset($_POST['tipo']) && !empty($_POST['usr'])&& isset($_POST['usr']) && !empty($_POST['agenda'])&& isset($_POST['agenda']) && !empty($_POST['nube'])&& isset($_POST['nube'])){
	$codigo = $_POST['codigo'];
	$fecha = $_POST['fecha'];
	$hora = $_POST['hora'];
	$tipo = $_POST['tipo'];
	$hora_ing = $_POST['hora_ing'];
	$hora_sal = $_POST['hora_sal'];
	$usr = $_POST['usr'];
	$agenda = $_POST['agenda'];
	$nube = $_POST['nube'];

	$sql = "insert into asistencia (codigo,fecha,hora,tipo,hora_fija,usr,estado,agenda,nube) values(".$codigo.",'".$fecha."','".$hora."','".$tipo."','".$hora_sal."',".$usr.",1,".$agenda.",".$nube.")";

	if (mysqli_query($db,$sql)){
		
			$array = array(
						"status" => "ok",
						"mensaje" => "Grabado con exito..."
			);
			echo json_encode($array);

	}else{
		echo "negativo";
	}
}else{
	echo "paramError";
}


?>