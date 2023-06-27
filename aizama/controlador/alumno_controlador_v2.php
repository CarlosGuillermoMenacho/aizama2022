<?php 
session_start();
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
require '../includes/functions.php';
$_tipo_user = isset($_GET['usr'])&&!empty($_GET['usr'])?$_GET['usr']:"";
if (empty($_tipo_user)){
	echo "errorGET";
	exit();
}
/*if(!cliente_activo()){
	if ($_tipo_user=='doc') {
		header("Location: ../docentes.php");
	}
	if ($_tipo_user=='alu') {
		header("Location: ../usuario.php");
	}
	if ($_tipo_user=='adm') {
		header("Location: ../administracion.php");
	}
	exit();
}*/
if ($_GET) {
	switch ($_GET['op']){

		case 'getAlumnoNombreCurso'://Obtener todas las fechas de un mes
			
			$codalu = isset($_POST['codalu'])?$_POST['codalu']:"";
			if(empty($codalu)||!is_numeric($codalu)){
				echo "errorParam";
				exit();
			}
			$year = date("Y");
			require '../modelo/modelo_Alumno.php';
			require '../modelo/modelo_curso.php';
			require '../modelo/modelo_paralelo.php';
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$alumno = new Alumno($db);
			$resultado = $alumno->getDatosAlumno($codalu);
			if(count($resultado)>0){
				$nombre = $resultado['nombre'];
				$codcur = $resultado['codcur'];
				$codpar = $resultado['codpar'];
				$curso = new Curso($db);
				$paralelo = new Paralelo($db);
				$nombreCurso = $curso->getNombreCurso($codcur)." - ".$paralelo->getNombreParalelo($codpar);
				$respuesta = array("status"=>"ok","nombre"=>$nombre,"curso"=>$nombreCurso);
				echo json_encode($respuesta);
			}else{
				echo json_encode(array("status"=>"noData"));
			}

			break;
		case 'get_all':
		    if(!cliente_activo()||empty($_SESSION['app_user_id'])){
		        echo json_encode(array("status"=>"eSession"));
		        exit();
		    }
		    
		    require '../modelo/modelo_Alumno.php';
		    require '../modelo/modelo_curso.php';
			require '../modelo/modelo_paralelo.php';
			require '../modelo/modelo_tutor.php';
			require '../modelo/modelo_hora_entrada.php';
			require_once'../modelo/conexion.php';
			require_once"funciones.php";
			$db = Conectar::conexion();
			
			$hora_entrada = new HoraEntrada($db);
			$alumno = new Alumno($db);
			
			$curso = new Curso($db);
			$cursos = $curso->getCursosIndex();
			
			$paralelo = new Paralelo($db);
			$paralelos = $paralelo->getParalelosIndex();
			$Tutor = new Tutor($db);
			$result = $Tutor->get_all_tutores_alu();
			$lista_tutor_alumno = [];
			while ($fetch = $result->fetch_object()) {
				$lista_tutor_alumno[] = $fetch;
			}
			$result5 = $hora_entrada->getDatos();
			$result = $alumno->get_all();
			$lista = array();
			$lista5 = array();
			while ($fila5 = $result5->fetch_object()){
			    $lista5[] = $fila5;
			}

			while($fila = $result->fetch_object()){
			    $lista[] = array(
			                    "nombre"=>$fila->codigo." ".$fila->paterno." ".$fila->materno." ".$fila->nombres,
			                    "solo_nombre"=>$fila->paterno." ".$fila->materno." ".$fila->nombres,
			                    "codalu"=>$fila->codigo,
			                    "codcur"=>$fila->cod_cur,
			                    "codpar"=>$fila->cod_par,
			                    "curso"=>$cursos[$fila->cod_cur]['nombre']." - ".$paralelos[$fila->cod_par],
			                    "type"=>"s",
			                    "cel"=> get_celulares($lista_tutor_alumno,$fila->codigo)

			                    );
			}
			require_once'../modelo/modelo_profesor.php';
			$Profesor = new Profesor($db);
			$result = $Profesor->get_profesores();
			$lista_prof = [];
			while ($fetch = $result->fetch_object()) {
				$lista_prof[] = [
					"codalu" => $fetch->CODPROF,
					"nombre"=>$fetch->CODPROF." ".$fetch->APEPRO." ".$fetch->NOMPRO,
					"solo_nombre"=>$fetch->APEPRO." ".$fetch->NOMPRO,
					"cel"=>$fetch->CELPRO,
					"curso"=>"Profesor",
					"type"=>"d"
				];
			}
			echo json_encode(array("status"=>"ok","lista"=>$lista,"lista5"=>$lista5,"prof"=>$lista_prof));
		    break;
	}
}else{
	echo "errorGET";
}
?>