<?php 
header("Content-Type: application/json;charset=utf-8");
require 'includes/config.php';
if ($_GET) {
	switch ($_GET['op']) {
		case 'gct'://obtener todos los contactos(profesores) para el tutor
			if (isset($_POST['codtut'])&&!empty($_POST['codtut'])) {
				$codtut = $_POST['codtut'];
				$gestion = date("Y");
				//Obteniendo los profesores de los alumnos
				$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
				$sql = "select distinct p.codprof,concat(p.apepro,' ',p.nompro)as nombre from alu_tut at inner join alumno a on at.codigo=a.codigo and at.estado=1 and at.cod_tut=".$codtut." 
						inner join prof_cur_mat pcm on a.cod_cur=pcm.codcur and a.cod_par=pcm.codpar and pcm.gestion=".$gestion." 
						and pcm.estado='activo' inner join profe p on pcm.prof = p.codprof" ;
                
				$result = mysqli_query($db,$sql);

				$listaProfesores = array();
				$lista = array();
				while ($row = $result->fetch_object()) {
					$listaProfesores[] = array(
												"codprof"=>$row->codprof,
												"nombre"=>$row->nombre
											);
				}
				
				if (count($listaProfesores)>0) {
					for ($i=0; $i < count($listaProfesores) ; $i++) { 
						$codpro = $listaProfesores[$i]["codprof"];

						$sql = "select a.codigo as codalu,concat(a.paterno,' ',a.materno,' ',a.nombres) as alumno,m.descri 
								from prof_cur_mat pcm inner join alumno a on pcm.codcur=a.cod_cur and pcm.prof='".$codpro."' 
								and pcm.codpar=a.cod_par and pcm.estado='activo' and pcm.gestion=".$gestion." 
								inner join materia m on pcm.codmat = m.codmat and m.estado=1 inner join alu_tut at on a.codigo=at.codigo 
								and at.cod_tut=".$codtut." and at.estado=1 order by a.codigo";

						$result1 = mysqli_query($db,$sql);
						$alu = 0;
						$info = "Es profesor de :";
						$nombalu;
						while($row1=$result1->fetch_object()){
							if ($alu==0) {
								$alu = $row1->codalu;
								$info .= $row1->descri;
								$nombalu = $row1->alumno;
							}else{
								if ($alu==$row1->codalu) {
									$info .= ", ".$row1->descri;
								}else{
									$info .= " de ".$nombalu;
									$info .= '\nEs profesor de :'.$row1->descri;
									$alu = $row1->codalu;
								}
							}
						}
						$info .= " de ".$nombalu;

						$lista[]=array(
										"codpro"=>$codpro,
										"nombre"=>$listaProfesores[$i]['nombre'],
										"info"=>$info
										);
					}
					if (count($lista)>0) {
						$respuesta = array("status"=>"ok","contactos"=>$lista);
						echo json_encode($respuesta);
					}else{
						$respuesta = array("status"=>"noContactos");
						echo json_encode($respuesta);
					}
				}else{		
					$respuesta = array("status"=>"noContactos");
					echo json_encode($respuesta);
				}
				
				

			}else{
				$respuesta = array("status"=>"paramError");
				echo json_encode($respuesta);
			}
			break;
		
		default:
			echo "errorOP";
			break;
	}
}else{
	echo "errorGET";
}
?>