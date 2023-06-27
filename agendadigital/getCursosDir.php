<?php 
header("Content-Type: application/json;charset=utf-8");
require 'includes/config.php';
require 'includes/functions.php';
$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

$sql = "select codigo,descrip from cursos";
$result = mysqli_query($db,$sql);
$cursos = array();
while ($row = $result->fetch_object()) {
	$cursos[]=array($row->codigo,1,utf8_encode($row->descrip));
}

$listas = array(); 
for ($i=0; $i < count($cursos); $i++) { 
	$sql = "select codigo,concat(paterno,' ',materno,' ',nombres) as nombre, cod_par from alumno where cod_cur=".$cursos[$i][0];
	$result = mysqli_query($db,$sql);
	$lista = array();
	while ( $row = $result->fetch_object()) {
		$lista[] = array($cursos[$i][0],$row->cod_par,$row->codigo,utf8_encode($row->nombre));
	}
	$listas[] = $lista;
}

$respuesta = array(
				"status" => "ok",
				"cursos" => $cursos,
				"listas" => $listas
					);

echo json_encode($respuesta);

?>
