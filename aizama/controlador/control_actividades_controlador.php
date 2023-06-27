<?php 
session_start();
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

switch ($_GET['op']) {
	case 'control_actividades'://Controla todos los profesores que no han tenido ninguna actividad en la plataforma
		$fecha = isset($_GET['fecha'])?$_GET['fecha']:"";
		$dias = isset($_GET['dias'])?$_GET['dias']:"";
		if(empty($fecha)||empty($dias)){
			echo json_encode(array("status"=>"errorParam"));
			exit();
		}
		require_once'../modelo/conexion.php';
		$db = Conectar::conexion();
		//Obteniendo la lista de profesores activos
		require_once'../modelo/modelo_profesor.php';
		$Profesor = new Profesor($db);
		require_once'../modelo/modelo_actividad.php';
		$Actividad = new Actividad($db);
		$result = $Profesor->get_profesores();
		$lista_profesores = [];
		while ($fetch = $result->fetch_object()) {
			$lista_profesores[] = $fetch;
		}
		$fecha_anterior = date("Y-m-d",strtotime("-$dias day",strtotime($fecha)));
		$res = [];
		foreach ($lista_profesores as $profesor) {
			$codprof = $profesor->CODPROF;
			$nombre = "$profesor->APEPRO $profesor->NOMPRO";
			if(!$Actividad->tiene_actividad($codprof,$fecha_anterior,$fecha)){
				$res[] = ["codprof"=>$codprof,"nombre"=>$nombre];
			}
		}
		echo json_encode(["status"=>"ok","data"=>$res]);
		break;
}
?>