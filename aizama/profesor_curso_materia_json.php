<?php 
session_start();
require 'includes/functions.php';
if(!cliente_activo())
{
  	$respuesta = array("status"=>"eSession");
	echo json_encode($respuesta);
  exit();
}
if ($_GET) {
	switch ($_GET['op']) {
		case 'pcma'://Obteniendo todas las asignaciones de materias y cursos a los profesores
			if (isset($_POST['gestion'])&&!empty($_POST['gestion'])) {
				$administrador = $_SESSION['app_user_id'];
				$gestion = $_POST['gestion'];
				require 'includes/config.php';
				$db = mysqli_connect($servername, $username, $password, $database) 
												or die('Error al intentar conectar con el servidor.');
							
				$sql = "select * from personal where cod_per=".$administrador;

				$result = mysqli_query($db,$sql);

				if ($row=$result->fetch_object()) {
								
					$sql = "select * from prof_cur_mat where estado='activo' and gestion = ".$gestion;
					$result = mysqli_query($db,$sql);

					$lista = array();
					while ($row = $result->fetch_object()) {
						$lista[] = array(
										"codprof"=>$row->prof,
										"codcur"=>$row->codcur,
										"codpar"=>$row->codpar,
										"codmat"=>$row->codmat					
										);
					}
					if (count($lista)>0) {
						$respuesta = array(
											"status"=>"ok",
											"prof_cur_mat"=>$lista
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
			}else{
				$respuesta = array("status"=>"errorParam");
				echo json_encode($respuesta);
			}
			

			break;
		case 'spcma'://Actualiza o guarda las materias y cursos asignados a un profesor
			if (isset($_POST['gestion'])&&!empty($_POST['gestion'])&&
				isset($_POST['datos'])&&!empty($_POST['datos'])) {
				$administrador = $_SESSION['app_user_id'];
				$gestion = $_POST['gestion'];
				$datos = $_POST['datos'];
				require 'includes/config.php';
				$db = mysqli_connect($servername, $username, $password, $database) 
												or die('Error al intentar conectar con el servidor.');
							
				$sql = "select * from personal where cod_per=".$administrador;

				$result = mysqli_query($db,$sql);

				if ($row=$result->fetch_object()) {
					for ($i=0; $i < count($datos); $i++) { 
						$codprof = $datos[$i][0];
						$codcur = $datos[$i][1];
						$codpar = $datos[$i][2];
						$codmat = $datos[$i][3];
						$estado = $datos[$i][4];
						//Verificando si ya existe en la tabla prof_cur_mat
						$sql = "select id from prof_cur_mat where prof='".$codprof."' 
								and codcur=".$codcur." and codpar=".$codpar." and 
								codmat='".$codmat."' and gestion=".$gestion;
                        //echo $sql;
                        // exit();
						$result2 = mysqli_query($db,$sql);

						if ($row2=$result2->fetch_object()) {
							if ($estado == 1) {
								$sql = "update prof_cur_mat set estado='activo' where id=".$row2->id;
								$resulupdate = mysqli_query($db,$sql);
							}else{
								$sql = "update prof_cur_mat set estado='pasivo' where id=".$row2->id;
								$resulupdate = mysqli_query($db,$sql);
							}
						}else{
							if ($estado == 1 ) {
								$sql = "insert into prof_cur_mat(prof,codcur,codmat,estado,codpar,gestion) 
										values('".$codprof."',".$codcur.",'".$codmat."','activo',
										".$codpar.",".$gestion.")";
								$result3 = mysqli_query($db,$sql);
							}
						}

					}
					echo "ok";
				}else{
					echo "noPermitido";
				}
			}else{
				echo "errorParam";
			}
			break;		
		default:
			$respuesta = array("status"=>"errorOP");
			echo json_encode($respuesta);
			break;
	}
}else{
	$respuesta = array("status"=>"errorGet");
	echo json_encode($respuesta);	
}

?>