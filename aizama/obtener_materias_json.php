<?php 
session_start();
require 'includes/functions.php';
if(!cliente_activo())
{
  echo 'eSession';
  exit();
}
if ($_GET) {
	switch ($_GET['op']) {
		case 'getmatprof'://Obtner todas las materias asignadas
			$codprof = $_SESSION['app_user_id'];
			//$codprof = 'D51';
			require 'includes/config.php';
			$db = mysqli_connect($servername, $username, $password, $database) 
								or die('Error al intentar conectar con el servidor.');

			$gestioActual = date("Y");

			$sql = "select pcm.codcur,pcm.codpar,pcm.codmat,m.descri from prof_cur_mat pcm inner join 
					materia m on pcm.codmat=m.codmat inner join cursos c on pcm.codcur=c.codigo and pcm.prof='".$codprof."' and pcm.estado='activo' 
					and pcm.gestion=".$gestioActual;

			$result = mysqli_query($db,$sql);

			$listaMaterias = array();
			while ($row=$result->fetch_object()) {
				$listaMaterias[]=array(
										"codcur"=>$row->codcur,
										"codpar"=>$row->codpar,
										"codmat"=>$row->codmat,
										"nombre"=>utf8_encode($row->descri)
									);
			}
			if (count($listaMaterias)>0) {
				$respuesta = array(
									"status"=>"ok",
									"materias"=>$listaMaterias
									);
				echo json_encode($respuesta);
			}else{
				$respuesta = array("status"=>"noMaterias");
				echo json_encode($respuesta);
			}
			break;
			
		case 'admgetmatprof'://Obtner todas las materias asignadas del profesor seleccionado
			$codprof = $_GET['codigoDocente'];
			require 'includes/config.php';
			$db = mysqli_connect($servername, $username, $password, $database) 
								or die('Error al intentar conectar con el servidor.');

			$gestioActual = date("Y");

			$sql = "select pcm.codcur,pcm.codpar,pcm.codmat,m.descri from prof_cur_mat pcm inner join 
					materia m on pcm.codmat=m.codmat inner join cursos c on pcm.codcur=c.codigo and pcm.prof='".$codprof."' and pcm.estado='activo' 
					and pcm.gestion=".$gestioActual;

			$result = mysqli_query($db,$sql);

			$listaMaterias = array();
			while ($row=$result->fetch_object()) {
				$listaMaterias[]=array(
										"codcur"=>$row->codcur,
										"codpar"=>$row->codpar,
										"codmat"=>$row->codmat,
										"nombre"=>utf8_encode($row->descri)
									);
			}
			if (count($listaMaterias)>0) {
				$respuesta = array(
									"status"=>"ok",
									"materias"=>$listaMaterias
									);
				echo json_encode($respuesta);
			}else{
				$respuesta = array("status"=>"noMaterias");
				echo json_encode($respuesta);
			}
			break;
		
		case 'ma':
			$administrador = $_SESSION['app_user_id'];
			
			require 'includes/config.php';
			$db = mysqli_connect($servername, $username, $password, $database) 
								or die('Error al intentar conectar con el servidor.');
			
			$sql = "select * from personal where cod_per=".$administrador;

			$result = mysqli_query($db,$sql);

			if ($row=$result->fetch_object()) {
				
				$sql = "select * from materia where estado = 1";
				$result1 = mysqli_query($db,$sql);
                
				$materias = array();
				while ($row1 = $result1->fetch_object()) {
					$img='';
					switch ($row1->CODMAT) {
						case 'P1': $img = "images/lenguaje.svg"; break;
						case 'P2': $img = "images/mateticas.svg"; break;
						case 'P3': $img = "images/ciencias-naturales.svg"; break;
						case 'P4': $img = "images/ciencias-sociales.svg"; break;
						case 'P5': $img = "images/natacion.svg"; break;
						case 'P6': $img = "images/valores.svg"; break;
						case 'P7': $img = "images/ingles.svg"; break;
						case 'P9': $img = "images/musica.svg"; break;
						case 'P10': $img = "images/artes-plasticas.svg"; break;
						case 'P11': $img = "images/educacion-fisica.svg"; break;
						case 'P14': $img = "images/guarani.svg"; break;
						case 'P15': $img = "images/computacion.svg"; break;
						case 'P16': $img = "images/tecnicas-estudio.svg"; break;
						case 'P17': $img = "images/ortografia.svg"; break;
						case 'S1': $img = "images/mateticas.svg"; break;
						case 'S2': $img = "images/lenguaje.svg"; break;
						case 'S3': $img = "images/filosofia.svg"; break;
						case 'S4': $img = "images/psicologia.svg"; break;
						case 'S5': $img = "images/ciencias-naturales.svg"; break;
						case 'S6': $img = "images/fisica.svg"; break;
						case 'S7': $img = "images/quimica.svg"; break;
						case 'S8': $img = "images/ciencias-sociales.svg"; break;
						case 'S9': $img = "images/computacion.svg"; break;
						case 'S10': $img = "images/biologia.svg"; break;
						case 'S11': $img = "images/civica.svg"; break;
						case 'S12': $img = "images/ingles.svg"; break;
						case 'S13': $img = "images/educacion-fisica.svg"; break;
						case 'S14': $img = "images/musica.svg"; break;
						case 'S15': $img = "images/artes-plasticas.svg"; break;
						case 'S16': $img = "images/valores.svg"; break;
						case 'S17': $img = "images/computacion.svg"; break;
						case 'S18': $img = "images/guarani.svg"; break;
						case 'S19': $img = "images/natacion.svg"; break;
						case 'S20': $img = "images/geografica.svg"; break;
						case 'S21': $img = "images/historia.svg"; break;
						case 'S22': $img = "images/ortografia.svg"; break;
						case 'I1': $img = "images/valores.svg"; break;
						case 'I2': $img = "images/geografica.svg"; break;
						case 'I3': $img = "images/ciencias-naturales.svg"; break;
						case 'I4': $img = "images/filosofia.svg"; break;
					}
					$materias[] = array(
									"codmat"=>$row1->CODMAT,
									"nombre"=>utf8_encode($row1->DESCRI),
									"nivel"=>$row1->cod_niv,
									"img"=>$img					
									);
				}
				if (count($materias)>0) {
					$respuesta = array(
										"status"=>"ok",
										"materias"=>$materias
										);

					echo json_encode($respuesta);
				}else{
					$respuesta = array("status"=>"noMaterias");
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