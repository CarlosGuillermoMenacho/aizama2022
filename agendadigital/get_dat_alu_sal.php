<?php 

header("Content-Type: application/json;charset=utf-8");
require 'includes/config.php';
require 'includes/functions.php';
$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

if (!empty($_POST['codigo']) && isset($_POST['codigo']) && !empty($_POST['dia_s']) && isset($_POST['dia_s']) && !empty($_POST['tipo']) && isset($_POST['tipo'])){
	$codigo = intval($_POST['codigo']);
	$dia_s = $_POST['dia_s'];
	$tipo = intval($_POST['tipo']);

			
	$sql3 = "SELECT codigo,concat(paterno,' ',materno,' ',nombres ) as nombre,cod_cur,cod_par FROM alumno where codigo=".$codigo;
	$consulta3 = mysqli_query($db,$sql3);
	
	if ($row3 = $consulta3->fetch_object()) {
		
		switch ($dia_s){
			case "L":
				$sql4 = "select id,lu_i as ing,lu_f as sal from hor_ent_salida where cod_cur=".$row3->cod_cur." and cod_par=".$row3->cod_par." and hor_tip=".$tipo;
				break;
			case "M":
				$sql4 = "select id,ma_i as ing,ma_f as sal from hor_ent_salida where cod_cur=".$row3->cod_cur." and cod_par=".$row3->cod_par." and hor_tip=".$tipo;
				break;
			case "X":
				$sql4 = "select id,mi_i as ing,mi_f as sal from hor_ent_salida where cod_cur=".$row3->cod_cur." and cod_par=".$row3->cod_par." and hor_tip=".$tipo;
				break;
			case "J":
				$sql4 = "select id,ju_i as ing,ju_f as sal from hor_ent_salida where cod_cur=".$row3->cod_cur." and cod_par=".$row3->cod_par." and hor_tip=".$tipo;
				break;
			case "V":
				$sql4 = "select id,vi_i as ing,vi_f as sal from hor_ent_salida where cod_cur=".$row3->cod_cur." and cod_par=".$row3->cod_par." and hor_tip=".$tipo;
				break;
			case "S":
				$sql4 = "select id,sa_i as ing,sa_f as sal from hor_ent_salida where cod_cur=".$row3->cod_cur." and cod_par=".$row3->cod_par." and hor_tip=".$tipo;
				break;
			case "D":
				$sql4 = "select id,do_i as ing,do_f as sal from hor_ent_salida where cod_cur=".$row3->cod_cur." and cod_par=".$row3->cod_par." and hor_tip=".$tipo;
				break;
		}
		
		$consulta4 = mysqli_query($db,$sql4);
		if ($row4 = $consulta4->fetch_object()) {
			$array = array(
						"status" => "ok",
						"mensaje" => "alumno cargado...",
						"codigo"=>($row3->codigo),
						"nombre"=>(($row3->nombre)),
						"cod_cur"=>(($row3->cod_cur)),
						"cod_par"=>(($row3->cod_par)),
						"hora_ing"=>(($row4->ing)),
						"hora_sal"=>(($row4->sal))
						);
			echo json_encode($array);
		}else{
			$array = array(
						"status" => "invalid",
						"mensaje" => "No se encontro el alumno..."
						);
			echo json_encode($array);
		}
		
	}else{
		$array = array(
					"status" => "invalid",
					"mensaje" => "No se encontro el alumno..."
					);
		echo json_encode($array);
	}
		
}else{
	$array = array(
					"status" => "invalid",
					"mensaje" => "Parametro incorrecto..."
					);
	echo json_encode($array);
}

?>