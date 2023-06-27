<?php 
header("Content-Type: application/json;charset=utf-8");
require 'includes/config.php';
require 'includes/functions.php';
$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
$acento = mysqli_query($db,"SET NAMES 'utf8'");
if ($_POST) {
	if (isset($_POST['codigo'])&&!empty($_POST['codigo'])) {
		
		$codigo = $_POST['codigo'];
		$gestion = date("Y");
	
		$sql = "select c.codigo,pcm.codpar, concat(c.descrip,' ',p.descrip) as curso from prof_cur_mat pcm inner join cursos c on pcm.codcur = c.codigo inner join paralelos p on pcm.codpar = p.cod_par and pcm.estado ='activo' and pcm.gestion = ".$gestion." and p.estado = 1 and pcm.prof='".$codigo."'";
		$result = mysqli_query($db,$sql);

		$cursos = array();

		while ($row = $result->fetch_object()) {
			$cursos[]=array($row->codigo,$row->codpar,$row->curso);
		}

		$sql = "select distinct m.codmat,m.descri from prof_cur_mat pcm inner join materia m on pcm.codmat = m.codmat and m.estado = 1 and pcm.estado = 'activo' and pcm.prof='".$codigo."'";
		$result = mysqli_query($db,$sql);

		$materias = array();

		while ($row = $result->fetch_object()) {
			$materias[]=array($row->codmat,utf8_encode($row->descri));
		}

		$listas = array();

		for ($i=0; $i < count($cursos); $i++) { 
			$codcur = $cursos[$i][0];
			$codpar = $cursos[$i][1];
			
			$sql = "select codigo,concat(paterno,' ',materno,' ',nombres) as nombre from alumno where estado = 1 and cod_par=".$codpar." and cod_cur=".$codcur;
			$result = mysqli_query($db,$sql);
			$lista = array();
			while ($row = $result->fetch_object()) {
			$lista[]=array($row->codigo,$row->nombre);
			}
			if (count($lista)>0) {
				$listas[]=$lista;
			}
			

		}
		$respuesta = array(
						"status" => "ok",
						"cursos" => $cursos,
						"materias" => $materias,
						"listas" => $listas
							);
		echo json_encode($respuesta);
	}else{
		echo "paramError";
	}
}else{
	echo "postParamError";
}
?>