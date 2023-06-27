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
		case 'cp'://Se obtienen los cursos que tiene asignado el profesor
			$codprof = $_SESSION['app_user_id'];
			$gestioActual = date("Y");

			require 'includes/config.php';
			$db = mysqli_connect($servername, $username, $password, $database) 
								or die('Error al intentar conectar con el servidor.');
			
			$sql = "select distinct pcm.codcur,pcm.codpar,concat(c.descrip,' - ',p.descrip)as curso
					,c.cod_niv from prof_cur_mat pcm inner join cursos c on pcm.codcur=c.codigo 
					inner join paralelos p on pcm.codpar=p.cod_par inner join profe pf on 
					pcm.prof=pf.codprof and pcm.prof='".$codprof."' 
					and pcm.estado='activo' and pcm.gestion=".$gestioActual." and 
					p.estado=1 and pf.estado='activo'";

			$result = mysqli_query($db,$sql);
			$listaCursos = array();
			while ($row = $result->fetch_object()) {
				$listaCursos[] = array(
										"codcur"=>$row->codcur,
										"codpar"=>$row->codpar,
										"codniv"=>$row->cod_niv,
										"nombre"=>utf8_encode($row->curso)
										);
			}
			if (count($listaCursos)>0) {
				$respuesta = array(
									"status"=>"ok",
									"cursos"=>$listaCursos
									);
				echo json_encode($respuesta);
			}else{
				$respuesta = array("status"=>"noAsigando");
				echo json_encode($respuesta);//No tiene cursos asignados
			}
			break;
			
		case 'admcurprof': 
		    $codprof = $_GET['codigoDocente'];
			$gestioActual = date("Y");

			require 'includes/config.php';
			$db = mysqli_connect($servername, $username, $password, $database) 
								or die('Error al intentar conectar con el servidor.');
			
			$sql = "select distinct pcm.codcur,pcm.codpar,concat(c.descrip,' - ',p.descrip)as curso
					,c.cod_niv from prof_cur_mat pcm inner join cursos c on pcm.codcur=c.codigo 
					inner join paralelos p on pcm.codpar=p.cod_par inner join profe pf on 
					pcm.prof=pf.codprof and pcm.prof='".$codprof."' 
					and pcm.estado='activo' and pcm.gestion=".$gestioActual." and 
					p.estado=1 and pf.estado='activo'";

			$result = mysqli_query($db,$sql);
			$listaCursos = array();
			while ($row = $result->fetch_object()) {
				$listaCursos[] = array(
										"codcur"=>$row->codcur,
										"codpar"=>$row->codpar,
										"codniv"=>$row->cod_niv,
										"nombre"=>utf8_encode($row->curso)
										);
			}
			if (count($listaCursos)>0) {
				$respuesta = array(
									"status"=>"ok",
									"cursos"=>$listaCursos
									);
				echo json_encode($respuesta);
			}else{
				$respuesta = array("status"=>"noAsigando");
				echo json_encode($respuesta);//No tiene cursos asignados
			}
			break;
			
			
		case 'ca'://Se obtendrán todos los elementos de la tabla cursos
			$administrador = $_SESSION['app_user_id'];
			
			require 'includes/config.php';
			$db = mysqli_connect($servername, $username, $password, $database) 
								or die('Error al intentar conectar con el servidor.');
			
			$sql = "select * from personal where cod_per=".$administrador;

			$result = mysqli_query($db,$sql);

			if ($row=$result->fetch_object()) {
				
				$sql = "select * from cursos";
				$result = mysqli_query($db,$sql);

				$cursos = array();
				while ($row = $result->fetch_object()) {
					$cursos[] = array(
										"codcur"=>$row->codigo,
										"nombre"=>utf8_encode($row->descrip),
										"nivel"=>$row->cod_niv
										);
				}
				if (count($cursos)>0) {
					$respuesta = array(
										"status"=>"ok",
										"niveles"=>$cursos
									);

					echo json_encode($respuesta);
				}else{
					$respuesta = array("status"=>"noCursos");
					echo json_encode($respuesta);
				}
			}else{
				$respuesta = array("status"=>"noPermitido");
				echo json_encode($respuesta);
			}
			break;
		default:
			echo "errorOP";
			break;
	}
}else{
	$respuesta = array("status"=>"errorGet");
				echo json_encode($respuesta);
}
?>
