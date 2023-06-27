<?php 
function filtrar($phone){
	$telefono = substr($phone,3);
	require_once"modelo/modelo_tutor.php";
	require_once"modelo/conexion.php";
	$db = Conectar::conexion();
	$Tutor = new Tutor($db);
	$result = $Tutor->get_curso_tutor($telefono);
	$cursos = [];
	while ($row = $result->fetch_object()) {
		$cursos[] = $row; 	
	} 
	for ($i=0; $i < count($cursos); $i++) { 
		if($cursos[$i]=="CURSO DE PRUEBA SEXTO SECUNDARIA"){
			return true;
		}
	}
	return false;
}
?>