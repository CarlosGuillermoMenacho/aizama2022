<?php 
header("Content-Type: application/json;charset=utf-8");
require 'includes/config.php';
require 'includes/functions.php';
$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
$acento = mysqli_query($db,"SET NAMES 'utf8'");
			if (!empty($_POST['cod_cur']) && isset($_POST['cod_cur']) && !empty($_POST['cod_par']) && isset($_POST['cod_par']) && !empty($_POST['gestion']) && isset($_POST['gestion'])){
				$cod_cur = intval($_POST['cod_cur']);
				$cod_par = intval($_POST['cod_par']);
				$gestion = intval($_POST['gestion']);
				$utiles=array();

						
				$sql3 = "SELECT l.cod_cur,l.cod_par,l.cod_mat,m.descri,l.descrip FROM lista_utiles l, materia m where l.cod_cur=".$cod_cur." and l.cod_par=".$cod_par." and l.gestion=".$gestion." and l.cod_mat=m.codmat";
			//	$sql3 = "SELECT l.cod_cur,l.cod_par,l.cod_mat,m.descri,l.descrip FROM lista_utiles l, materia m where l.cod_cur=3 and l.cod_par=3 and l.gestion=2020 and l.cod_mat=m.codmat";
				$consulta3 = mysqli_query($db,$sql3);
				while ($row3 = $consulta3->fetch_object()) {
					$utiles[] = array(
							"cod_cur"=>($row3->cod_cur),
							"cod_par"=>($row3->cod_par),
							"cod_mat"=>utf8_encode(trim($row3->cod_mat)),
							"materia"=>utf8_encode(trim($row3->descri)),
							"descrip"=>trim($row3->descrip)
					);
				}
	
					$array = array(
								"status" => "ok",
								"mensaje" => "Lista de utiles cargada...",
								"utiles" => $utiles
								);
					echo json_encode($array);
			}else{
				$array = array(
								"status" => "invalid",
								"mensaje" => "Parametro incorrecto..."
								);
				echo json_encode($array);
			}

?>