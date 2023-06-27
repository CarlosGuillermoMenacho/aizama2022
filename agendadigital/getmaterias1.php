<?php 
header("Content-Type: application/json;charset=utf-8");
require 'includes/config.php';
require 'includes/functions.php';
$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
if ($_POST) {
	if (isset($_POST['codigo'])&&!empty($_POST['codigo'])) {
		$codAlu = $_POST['codigo'];

		$sql = "select m.codmat, m.descri from alumno a inner join cur_mat cm on a.cod_cur=cm.cod_cur and a.cod_par=cm.cod_par inner join materia m on cm.cod_mat=m.codmat and a.estado = 1 and a.codigo =".$codAlu;
		$result = mysqli_query($db,$sql);

		$materias = array();
		while ($row = $result->fetch_object()) {
			$materias[]=array($row->codmat,$row->descri);
		}

		$respuesta = array(
							"status" => "ok",
							"materias" => $materias
							);

		echo json_encode($respuesta);
	}else{
		echo "paramError";
	}
}else{
	echo "errorPOST";
}
?>