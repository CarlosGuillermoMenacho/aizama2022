<?php 
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
require '../includes/functions.php';
require_once'../modelo/conexion.php';
$db = Conectar::conexion();
$codcur = isset($_POST['curso'])?$_POST['curso']:"";
if(empty($codcur)){
	echo "errorParam";
	exit();
}
$gestion = date("Y");
require_once'../modelo/modelo_lista_utiles.php';
require_once'../modelo/modelo_materia.php';
require_once'../modelo/modelo_curso.php';
$curso = new Curso($db);
$materia = new Materia($db);
$materias = $materia->getMaterias();
$Lista_Utiles = new Lista_utiles($db);
$lista_utiles = $Lista_Utiles->get_lista($codcur,$gestion);
$lista = array();
foreach ($lista_utiles as $fila) {
	$lista[] = array(
					"id"=>$fila["id"],
					"cod_par"=>$fila["cod_par"],
					"codmat"=>$fila["codmat"],
					"lista"=>str_replace("\r\n", "<br>", rtrim($fila["lista"]))
					);
}
if(!empty($lista)){
	echo json_encode(array("status"=>"ok","listas"=>$lista,"materias"=>$materias,"curso"=>$curso->getNombreCurso($codcur)));
}else{
	echo json_encode(array("status"=>"noData"));
}
?>