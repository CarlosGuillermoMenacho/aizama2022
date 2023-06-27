<?php 
session_start();
include_once'../includes/functions.php';
if(!cliente_activo()){
	echo json_encode(array("status"=>"eSession"));
	exit();
}
switch ($_GET['op']) {
	case 'get_cv'://Obtiene las clases en vivos de los cursos que pasa clases el profesor
		$codusr = $_SESSION["app_user_id"];
		if (empty($codusr)) {
			echo json_encode(array("status"=>"eSession"));
			exit();
		}
		require_once"../modelo/conexion.php";
		require_once"../modelo/modelo_profesor.php";
		require_once"../modelo/modelo_clase_virtual.php";
		require_once"../modelo/modelo_curso.php";
		require_once"../modelo/modelo_paralelo.php";
		$db = Conectar::conexion();
		$Profesor = new Profesor($db);
		$Curso = new Curso($db);
		$Paralelo = new Paralelo($db);
		$cursos = $Curso->getCursosIndex();
		$paralelos = $Paralelo->getParalelosIndex();
		$gestion = date("Y");
		$result = $Profesor->get_cursos_prof($gestion,$codusr);
		$listaCursos = [];
		while ($row = $result->fetch_object()) {
			$listaCursos[] = [
				"codcur"=>$row->codcur,
				"codpar"=>$row->codpar
			];
		}
		$CV = new ClaseVirtual($db);
		$result = $CV->get_clases_en_vivo();
		$lista_de_CV = [];
		while ($row = $result->fetch_object()) {
			$lista_de_CV[] = $row;
		}

		if(count($listaCursos) == 0){
			echo json_encode(["status"=>"noCursos"]);
			exit();
		}
		$response = [];
		foreach ($listaCursos as $curso) {
			$codcur = $curso["codcur"];
			$codpar = $curso["codpar"];
			$link = "No tiene clase en vivo";
			$estado = 0;
			for ($i=0; $i < count($lista_de_CV); $i++) { 
				if($lista_de_CV[$i]->codCur == $codcur && $lista_de_CV[$i]->codPar){
					$link = $lista_de_CV[$i]->link;
					$estado = 1;			
				}
			}
			$response[] = [
						"curso"=>$cursos[$codcur]['nombre']." - ".$paralelos[$codpar],
						"link"=>$link,
						"estado"=>$estado
					];
		}
		echo json_encode(["status"=>"ok","data"=>$response]);
		break;
	case 'gcvp'://Obtiene las clases virtuales de un profesor de un curso
		$codusr = $_SESSION["app_user_id"];
		if (empty($codusr)) {
			echo json_encode(array("status"=>"eSession"));
			exit();
		}
		$trimestre = $_SESSION["app_user_bimestre"];
		if (empty($trimestre)) {
			echo json_encode(array("status"=>"errorTrimestre"));
			exit();
		}
		$codcur = isset($_POST["codcur"])?$_POST['codcur']?"";
		$codpar = isset($_POST["codpar"])?$_POST['codpar']?"";
		if (empty($codcur)||empty($codpar)) {
			echo json_encode(array("status"=>"errorParam"));
			exit();
		}
		$gestion = date("Y");
		require_once"../modelo/conexion.php";
		require_once"../modelo/modelo_clase_virtual.php";
		$db = Conectar::conexion();
		$CV = new ClaseVirtual($db);
		$result = $CV->get_clases_virtuales_cursos_prof($gestion,$trimestre,$codcur,$codpar,$codusr);
		$response = [];
		while ($row = $result->fetch_object()) {
			$response[] = [
				"id"=>$row->id,
				"codmat"=>$row->codMat,
				"descripcion"=>$row->descripcion,
				"fecha"=>$row->fecha,
				"horai"=>substr($row->horaIni, 0,5),
				"horaf"=>substr($row->horaFin, 0,5),
				"link"=>$row->link
			];
		}
		echo json_encode(["status"=>"ok","data"=>$response]);

		break;
	default:
		echo json_encode(array("status"=>"errorOP"));
		break;
}
?>