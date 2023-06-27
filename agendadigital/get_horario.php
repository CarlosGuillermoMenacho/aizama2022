<?php 
header("Content-Type: application/json;charset=utf-8");
require 'includes/config.php';
require 'includes/functions.php';
$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

			if (!empty($_POST['cod_cur'])&& isset($_POST['cod_cur']) && !empty($_POST['cod_par'])&& isset($_POST['cod_par'])){
				$cod_cur = intval($_POST['cod_cur']);
				$cod_par = intval($_POST['cod_par']);
				$horario=array();

						
				$sql3 = "SELECT * FROM horario where cod_cur=".$cod_cur." and cod_par=".$cod_par;
				$consulta3 = mysqli_query($db,$sql3);
				if ($row3 = $consulta3->fetch_object()) {
					$horario = array(
							"cod_cur"=>($row3->cod_cur),
							"cod_par"=>($row3->cod_par),
							"imagen"=>utf8_encode(trim($row3->img_base64))

					);	
					$array = array(
								"status" => "ok",
								"mensaje" => "Horario cargado...",
								"horario" => $horario
								);
					echo json_encode($array);
				}else{
				$array = array(
								"status" => "invalid",
								"mensaje" => "Curso o Paralelo no se encuentra en la tabla horario..."
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