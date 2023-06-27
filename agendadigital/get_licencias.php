<?php 
header("Content-Type: application/json;charset=utf-8");
require 'includes/config.php';
require 'includes/functions.php';
$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

			if (!empty($_POST['cod_tut'])&& isset($_POST['cod_tut']) && !empty($_POST['cod_alu'])&& isset($_POST['cod_alu'])){
				$cod_tut = intval($_POST['cod_tut']);
				$cod_alu = intval($_POST['cod_alu']);
				$licencias=array();

						
				$sql3 = "SELECT * FROM licencias where codigo=".$cod_alu." and cod_tut=".$cod_tut;
				$consulta3 = mysqli_query($db,$sql3);
				while ($row3 = $consulta3->fetch_object()) {
					$licencias[] = array(
							"id"=>($row3->id),
							"codigo"=>($row3->codigo),
							"cod_tut"=>(($row3->cod_tut)),
							"f_solicitud"=>(($row3->f_solicitud)),
							"h_solicitud"=>utf8_encode(trim($row3->h_solicitud)),
							"f_ini"=>(($row3->f_ini)),
							"f_fin"=>(($row3->f_fin)),
							"obs"=>utf8_encode(trim($row3->obs)),
							"estado"=>($row3->estado)
					);
				}
										
					
					
					
				$array = array(
								"status" => "ok",
								"mensaje" => "Licencias cargadas...",
								"licencias" => $licencias
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