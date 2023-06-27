<?php 
header("Content-Type: application/json;charset=utf-8");
require 'includes/config.php';
if ($_GET) {
	switch ($_GET['op']) {
		case 'ggt'://Obteniendo los grupos(cursos) de chat del tutor
			if (isset($_POST['codtut'])&&!empty($_POST['codtut'])) {
				$codtut = $_POST['codtut'];
				//Verificando que el tutor esté habilitado
				$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
				$sql = "select count(*) as n from alu_tut where cod_tut=".$codtut." and estado = 1";
				
				$result = mysqli_query($db,$sql);
				$cantidad = $result->fetch_object();
				if ($cantidad->n > 0) {
					$sql = "select distinct c.codigo as codcur,p.cod_par as codpar, concat(c.descrip,' ',p.descrip) as nombre 
							from alu_tut at inner join alumno a on at.codigo = a.codigo and at.cod_tut = ".$codtut." 
							and at.estado = 1 inner join cursos c on a.cod_cur = c.codigo inner join paralelos p 
							on a.cod_par = p.cod_par";
							
					$result = mysqli_query($db,$sql);
					$lista = array();
					while ($row = $result->fetch_object()) {
							$fila = array(
											"codcur"=>$row->codcur,
											"codpar"=>$row->codpar,
											"nombre"=>$row->nombre
											);
							$lista[] = $fila; 
					}
					if (count($lista)>0) {
						$respuesta = array("status"=>"ok","lista"=>$lista);
						echo json_encode($respuesta);
					}else{
						$respuesta = array("status"=>"noGrupos");
						echo json_encode($respuesta);
					}	
				}else{
					$respuesta = array("status"=>"noHabilitado");
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

