<?php 
header("Content-Type: application/json;charset=utf-8");
require 'includes/config.php';
require 'includes/functions.php';
$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

if (!empty($_POST['materia'])&& isset($_POST['materia']) && !empty($_POST['nombre_prof'])&& isset($_POST['nombre_prof']) && !empty($_POST['fecha'])&& isset($_POST['fecha']) && !empty($_POST['hora'])&& isset($_POST['hora']) && !empty($_POST['msg'])&& isset($_POST['msg']) && !empty($_POST['codcur'])&& isset($_POST['codcur']) && !empty($_POST['codpar'])&& isset($_POST['codpar']) && !empty($_POST['codmat'])&& isset($_POST['codmat']) && !empty($_POST['codalu'])&& isset($_POST['codalu']) && !empty($_POST['codobs'])&& isset($_POST['codobs']) && !empty($_POST['codprof'])&& isset($_POST['codprof'])){
	$materia = $_POST['materia'];
	$nombre_prof = $_POST['nombre_prof'];
	$c_envia = $materia." ".$nombre_prof;
	$fecha = $_POST['fecha'];
	$hora = $_POST['hora'];
	$msg = $_POST['msg'];
	$codcur = $_POST['codcur'];
	$codpar = $_POST['codpar'];
	$codmat = $_POST['codmat'];
	$codalu = $_POST['codalu'];
	$codobs = $_POST['codobs'];
	$codprof = $_POST['codprof'];
	
	$sql2="insert into agenda (codcur,codpar,codmat,codalu,cod_obs,codprof,fecha,hora) values(".$codcur.",".$codpar.",'".$codmat."',".$codalu.",".$codobs.",'".$codprof."','".$fecha."','".$hora."')";
	if (mysqli_query($db,$sql2)){
		$sql3="select max(id) as id from agenda";
		$consulta3 = mysqli_query($db,$sql3);
		if ($row3 = $consulta3->fetch_object()) {
			$sql = "insert into chat (c_envia,c_recibe,fecha_e,hora_e,msg,estado,idagenda,codprof,agenda) values('".$c_envia."','".$codalu."','".$fecha."','".$hora."','".$msg."',1,".$row3->id.",'".$codprof."',0)";

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
			echo "negativo2";
		}
	}else{
		echo "negativo3";
	}
}else{
	echo "paramError";
}


?>