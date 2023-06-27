<?php 
function getdialiteral ($fecha){
	$dias = ["Lunes","Martes","Miércoles","Juéves","Viernes","Sábado","Domingo"];
	return $dias[date("N",strtotime($fecha)) - 1];
}
function get_numero_dia($fecha){
	return date("N",strtotime($fecha));
}
function get_celulares($lista_tutor_alumno,$codalu){
	$celulares = [];
	foreach ($lista_tutor_alumno as $row) {
		if($row->codigo == $codalu)$celulares[] = $row->cel;
	}
	return $celulares;
}
function get_numero_de_semana($fecha){
	return date("W",strtotime($fecha));
}
function get_rows($rows){
	if(!$rows)return [];
	$response = [];
	while ($row = $rows->fetch_object()) {
		$response[] = $row;
	}
	return $response;
}
?>