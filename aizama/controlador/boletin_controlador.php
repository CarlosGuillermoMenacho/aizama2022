<?php 
session_start();
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
require '../includes/functions.php';
require_once'../modelo/conexion.php';
$db = Conectar::conexion();
switch ($_GET['op']) {
	case 'generar_boletines_tutor'://El profesor que es tutor del curso genera los boletines del curso que es tutor
		$codprof = $_SESSION['app_user_id'];
		if(!cliente_activo()||empty($codprof)){
			echo "eSession";
			exit();
		}
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";

		if (empty($codcur)||empty($codpar)) {
			echo "errorParam";
			exit();
		}



		break;
	case 'generar_notas':
		$codprof = $_SESSION['app_user_id'];
		if(!cliente_activo()||empty($codprof)){
			echo "eSession";
			exit();
		}
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";

		if (empty($codcur)||empty($codpar)) {
			echo "errorParam";
			exit();
		}
		//Verificando que sea tutor del curso
		require_once'../modelo/modelo_tutor_de_curso.php';
		$tutor = new Tutor_de_Aula($db);
		$gestion = date("Y");
		if(!$tutor->es_tutor($gestion,$codcur,$codpar)){
			echo "noTutor";
			exit();
		}
		require_once'../modelo/modelo_materia.php';
		$materia = new Materia($db);

		$materias = $materia->materiasCurso($codcur,$codpar);
		$trimestre = $_SESSION['app_user_bimestre'];

		require_once'../modelo/modelo_cuaderno_pedagogico.php';
		require_once'../modelo/modelo_notas_trimestrales.php';
		$MNT = new NotasTrimestrales($db);
		$CP = new CuadernoPedagogico($db);
		foreach ($materias as $codmat) {
			$RES = $CP->get_cuaderno_pedagogico($gestion,$trimestre,$codcur,$codpar,$codmat);
			$lista_notas = $RES['lista_notas'];
			foreach ($lista_notas as $fila) {
				$codalu = $fila['codalu'];
				$nota = $fila['nota_final'];
				$nota = $nota>40?$nota:40;
				$MNT->save($codalu,$codmat,$trimestre,$nota,$codprof);
			}
		}

		echo "ok";
		break;
	case 'get_notas_to_centralizador':
		/*$codprof = $_SESSION['app_user_id'];
		if(!cliente_activo()||empty($codprof)){
			echo "eSession";
			exit();
		}*/
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";

		if (empty($codcur)||empty($codpar)) {
			echo "errorParam";
			exit();
		}
		//Verificando que sea tutor del curso
		// require_once'../modelo/modelo_tutor_de_curso.php';
		// $tutor = new Tutor_de_Aula($db);
		// $gestion = date("Y");
		// if(!$tutor->es_tutor($gestion,$codcur,$codpar)){
		// 	echo "noTutor";
		// 	exit();
		// }
		$gestion = date("Y");
		require_once'../modelo/modelo_materia.php';
		$materia = new Materia($db);

		$materias = $materia->getMateriasCurso($codcur,$codpar);
		$trimestre = $_SESSION['app_user_bimestre'];
		//$trimestre = 3;
		require_once'../modelo/modelo_cuaderno_pedagogico.php';
		$CP = new CuadernoPedagogico($db);
		$rows = [];
		$header = [];
		$bandera = 0;
		$index = 0;
		foreach ($materias as $materia) {
			$header[] = $materia['nombre'];
			$RES = $CP->get_cuaderno_pedagogico($gestion,$trimestre,$codcur,$codpar,$materia['codmat']);
			$lista_notas = $RES['lista_notas'];
			foreach ($lista_notas as $fila) {
				$codalu = $fila['codalu'];
				$nota = $fila['nota_final'];
				$nombre = $fila['nombre'];
				if($bandera == 0){
					$rows[] = [$index+1,$nombre,$nota];
				}else{
					$rows[$index][] = $nota;
				}
				$index++;

			}
			$index = 0;
			$bandera = 1;
		}

		echo json_encode(["status"=>"ok","header"=>$header,"row"=>$rows]);
		break;
	case 'get_notas_to_centralizador_alu':
		$codprof = $_SESSION['app_user_id'];
		if(!cliente_activo()||empty($codprof)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}

		$codalu = isset($_POST["codalu"])?$_POST["codalu"]:"";
		if(empty($codalu)){
			echo json_encode(array("status"=>"paramError"));	
			exit();		
		}
		require '../modelo/modelo_Alumno.php';
		require '../modelo/modelo_curso.php';
		require '../modelo/modelo_paralelo.php';
		require_once'../modelo/conexion.php';
		$db = Conectar::conexion();
		$alumno = new Alumno($db);
		$Curso = new Curso($db);
		$Paralelo = new Paralelo($db);
		$datosAlumno = $alumno->getDatosAlumno($codalu);
		$codcur = $datosAlumno["codcur"];
		$codpar = $datosAlumno["codpar"];
		$cursos = $Curso->getCursosIndex();
		$paralelos = $Paralelo->getParalelosIndex();
		$dA = [
			"foto"=>$datosAlumno["foto"],
			"nombre"=>$datosAlumno["nombre"],
			"codalu"=>$codalu,
			"curso"=>$cursos[$codcur]["nombre"]." - ".$paralelos[$codpar]
		];
		$gestion = date("Y");
		require_once'../modelo/modelo_materia.php';
		$materia = new Materia($db);

		$materias = $materia->getMateriasCurso($codcur,$codpar);
		// $trimestre = $_SESSION['app_user_bimestre'];
		$trimestre = 1;
		require_once'../modelo/modelo_cuaderno_pedagogico.php';
		$CP = new CuadernoPedagogico($db);
		$rows = [];
		$NotasTrimestrales = [];
		$header = [];
		foreach ($materias as $materia) {
			$header[] = $materia['nombre'];
			$RES = $CP->get_cuaderno_pedagogico_alumno($gestion,$trimestre,$codcur,$codpar,$materia['codmat'],$codalu);
			$lista_notas = $RES['lista_notas'];
			foreach ($lista_notas as $fila) {
				$nota = $fila['nota_final'];
				$rows[] = $nota;
			}
		}
		$NotasTrimestrales[] = $rows;
		$rows = [];
		$trimestre = 2;
		foreach ($materias as $materia) {
			$RES = $CP->get_cuaderno_pedagogico_alumno($gestion,$trimestre,$codcur,$codpar,$materia['codmat'],$codalu);
			$lista_notas = $RES['lista_notas'];
			foreach ($lista_notas as $fila) {
				$nota = $fila['nota_final'];
				$rows[] = $nota;
			}
		}
		$NotasTrimestrales[] = $rows;
		$rows = [];
		$trimestre = 3;
		foreach ($materias as $materia) {
			$RES = $CP->get_cuaderno_pedagogico_alumno($gestion,$trimestre,$codcur,$codpar,$materia['codmat'],$codalu);
			$lista_notas = $RES['lista_notas'];
			foreach ($lista_notas as $fila) {
				$nota = $fila['nota_final'];
				$rows[] = $nota;
			}
		}
		$NotasTrimestrales[] = $rows;
		echo json_encode(["status"=>"ok","header"=>$header,"row"=>$NotasTrimestrales,"alumno"=>$dA]);
		break;
	default:
		// code...
		break;
}
?>