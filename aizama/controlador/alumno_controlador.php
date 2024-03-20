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
		case 'getNombreCurso'://Obtener nombre del curso y paralelo de un alumno-evaluaciones_mixta_alu.js
				$codcur=isset($_POST['codcur'])?$_POST['codcur']:"";
				$codpar=isset($_POST['codpar'])?$_POST['codpar']:"";
				if(empty($codcur)||empty($codpar)){
					echo "errorParam";
					exit();
				}
				$year = date("Y");
				require '../modelo/modelo_curso.php';
				require '../modelo/modelo_paralelo.php';
				require_once'../modelo/conexion.php';
				$db = Conectar::conexion();
					$curso = new Curso($db);
					$paralelo = new Paralelo($db);
					$nombreCurso = $curso->getNombreCurso($codcur)." - ".$paralelo->getNombreParalelo($codpar);
					$respuesta = array("status"=>"ok","curso"=>$nombreCurso);
					echo json_encode($respuesta);
				break;
		case 'obtener_materias':
				$gestion= date("Y");
				$trimestre=$_SESSION['app_user_bimestre'];
				$codcur=isset($_POST['codcur'])?$_POST['codcur']:"";
				$codpar=isset($_POST['codpar'])?$_POST['codpar']:"";
				require '../modelo/modelo_evaluacion_mixta.php';
				require '../modelo/modelo_Alumno.php';
				require_once'../modelo/conexion.php';
				$db = Conectar::conexion();
				$Evaluacion = new Evaluacion_mixta($db);			
				$alumno =  new Alumno($db);
				$listaMaterias=$alumno->obtener_materias($codcur,$codpar);
				$result = array();
				foreach ($listaMaterias as $materia) {
					$result[]=array(
						"cod_cur" => $materia['cod_cur'],
						"cod_par" =>$materia['cod_par'],
						"cod_mat" => $materia['cod_mat'],
						"imagen" => $materia ['imagen'],
						"cant_eva"=>$Evaluacion->cant_evaluaciones_materia($codcur, $codpar,$materia['cod_mat'],$trimestre,$gestion),
						"descri"=>$materia['descri']
					);
				}
				echo json_encode(array("status"=>"ok","Materias"=> $result));
				break;
		case 'get_datos_alu':
				$codalu = $_SESSION['app_user_id'];	
				if(empty($codalu)){
					echo "errorParam";
					exit();
				}
				require '../modelo/modelo_Alumno.php';
				require_once'../modelo/conexion.php';
				$db = Conectar::conexion();
				$alumno=new Alumno($db);
				$listaAlumno=$alumno->getDatosAlumno($codalu);
				
				echo json_encode(array("status"=>"ok","lista_alumno"=>$listaAlumno));
			break;
		case 'get_all':
		    if(!cliente_activo()||empty($_SESSION['app_user_id'])){
		        echo json_encode(array("status"=>"eSession"));
		        exit();
		    }
		    
		    require '../modelo/modelo_Alumno.php';
		    require '../modelo/modelo_curso.php';
			require '../modelo/modelo_paralelo.php';
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			
			$alumno = new Alumno($db);
			
			$curso = new Curso($db);
			$cursos = $curso->getCursosIndex();
			
			$paralelo = new Paralelo($db);
			$paralelos = $paralelo->getParalelosIndex();
			
			
			$result = $alumno->get_all();
			$lista = array();
			while($fila = $result->fetch_object()){
			    $lista[] = array(
			                    "nombre"=>$fila->codigo." ".$fila->paterno." ".$fila->materno." ".$fila->nombres,
			                    "codalu"=>$fila->codigo,
			                    "codcur"=>$fila->cod_cur,
			                    "codpar"=>$fila->cod_par,
			                    "curso"=>$cursos[$fila->cod_cur]['nombre']." - ".$paralelos[$fila->cod_par],
			                    "name"=>$fila->paterno." ".$fila->materno." ".$fila->nombres,
			                    "foto"=>$fila->fotoperfil
			                    );
			}
			echo json_encode(array("status"=>"ok","lista"=>$lista));
		    break;
		case 'change_grade':
			$codusr = $_SESSION['app_user_id'];
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));	
				exit();
						
			}
			$codalu = isset($_POST["codalu"])?$_POST["codalu"]:"";
			$codcur = isset($_POST["codcur"])?$_POST["codcur"]:"";
			$codpar = isset($_POST["codpar"])?$_POST["codpar"]:"";
			if(empty($codalu)||empty($codcur)||empty($codpar)){
				echo json_encode(array("status"=>"errorParam"));	
				exit();
			}
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			require_once"../modelo/modelo_Alumno.php";
			$Alumno = new Alumno($db);
			$Alumno->set_surso($codalu,$codcur,$codpar);
			echo json_encode(["status"=>"ok"]);
			break;
		case 'get_datos_alumno':
			$codusr = $_SESSION['app_user_id'];
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));	
				exit();		
			}
			$codalu = isset($_POST["codalu"])?$_POST["codalu"]:"";
			if(empty($codalu)){
				echo json_encode(array("status"=>"errorParam"));	
				exit();
			}
			require '../modelo/modelo_Alumno.php';
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$Alumno=new Alumno($db);
			$result=$Alumno->get_alumno($codalu);
			if($row = $result->fetch_object()){
				$datosAlumno = [
					"aporte"=>$row->aporte,
					"boletin"=>$row->bdesktop,
					"contacto"=>$row->cel1,
					"codcur"=>$row->cod_cur,
					"codpar"=>$row->cod_par,
					"cuota"=>$row->cuota,
					"fotoperfil"=>$row->fotoperfil,
					"gestion"=>$row->impresora,
					"usuario"=>$row->login,
					"materno"=>$row->materno,
					"nacimiento"=>$row->nacido,
					"ncuotas"=>$row->ncuotas,
					"nombres"=>$row->nombres,
					"clave"=>$row->password,
					"paterno"=>$row->paterno,
					"plataforma"=>$row->servernt,
					"evaluacion"=>$row->usrimple
				];

				$result = $Alumno->get_data_tutores($codalu);
				$tutores = [];
				while ($row = $result->fetch_object()) {
					$tutores[] = $row;
				}
				echo json_encode(array("status"=>"ok","data"=>["datos_alu"=>$datosAlumno,"tutores"=>$tutores]));
			}else{
				echo json_encode(array("status"=>"noData"));
			}	
			break;
		case 'update_data_alumno':
			$codusr = $_SESSION['app_user_id'];
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));	
				exit();		
			}
			$codalu = isset($_POST["codalu"])?$_POST["codalu"]:"";
			$paterno = isset($_POST["paterno"])?$_POST["paterno"]:"";
			$materno = isset($_POST["materno"])?$_POST["materno"]:"";
			$nombres = isset($_POST["nombres"])?$_POST["nombres"]:"";
			$usuario = isset($_POST["usuario"])?$_POST["usuario"]:"";
			$clave = isset($_POST["clave"])?$_POST["clave"]:"";
			$gestion = isset($_POST["gestion"])?$_POST["gestion"]:"";
			$codcur = isset($_POST["codcur"])?$_POST["codcur"]:"";
			$codpar = isset($_POST["codpar"])?$_POST["codpar"]:"";
			if(empty($codalu)||empty($paterno)||empty($materno)||
			   empty($nombres)||empty($usuario)||empty($clave)||
			   empty($gestion)||empty($codcur)||empty($codpar)){
				echo json_encode(array("status"=>"errorParam"));	
				exit();
			}
			require '../modelo/modelo_Alumno.php';
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$Alumno=new Alumno($db);
			$Alumno->update($codalu,$paterno,$materno,$nombres,$usuario,$clave,$gestion,$codcur,$codpar);
			echo json_encode(array("status"=>"ok"));	
			break;
		case 'set_Boletin':
			$codusr = $_SESSION['app_user_id'];
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));	
				exit();		
			}
			$estado = isset($_POST["estado"])?$_POST["estado"]:"";
			$codalu = isset($_POST["codalu"])?$_POST["codalu"]:"";
			if(empty($estado)||empty($codalu)){
				echo json_encode(array("status"=>"errorParam"));	
				exit();
			}
			require '../modelo/modelo_Alumno.php';
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$Alumno=new Alumno($db);
			$Alumno->set_boletin_access($codalu,$estado);
			echo json_encode(array("status"=>"ok"));
			break;
		case 'set_Evaluacion':
			$codusr = $_SESSION['app_user_id'];
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));	
				exit();		
			}
			$estado = isset($_POST["estado"])?$_POST["estado"]:"";
			$codalu = isset($_POST["codalu"])?$_POST["codalu"]:"";
			if(empty($estado)||empty($codalu)){
				echo json_encode(array("status"=>"errorParam"));	
				exit();
			}
			require '../modelo/modelo_Alumno.php';
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$Alumno=new Alumno($db);
			$Alumno->set_evaluacion_access($codalu,$estado);
			echo json_encode(array("status"=>"ok"));
			break;
		case 'set_Plataforma':
			$codusr = $_SESSION['app_user_id'];
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));	
				exit();		
			}
			$estado = isset($_POST["estado"])?$_POST["estado"]:"";
			$codalu = isset($_POST["codalu"])?$_POST["codalu"]:"";
			if(empty($estado)||empty($codalu)){
				echo json_encode(array("status"=>"errorParam"));	
				exit();
			}
			require '../modelo/modelo_Alumno.php';
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$Alumno=new Alumno($db);
			$Alumno->set_plataforma_access($codalu,$estado);
			echo json_encode(array("status"=>"ok"));
			break;
		case 'delete_tutor':
			$codusr = $_SESSION['app_user_id'];
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));	
				exit();		
			}
			$codtut = isset($_POST["codtut"])?$_POST["codtut"]:"";
			$codalu = isset($_POST["codalu"])?$_POST["codalu"]:"";
			if(empty($codtut)||empty($codalu)){
				echo json_encode(array("status"=>"errorParam"));	
				exit();
			}
			require '../modelo/modelo_Alumno.php';
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$Alumno=new Alumno($db);
			$Alumno->delete_tutor($codalu,$codtut);
			$result = $Alumno->get_data_tutores($codalu);
			$tutores = [];
			while ($row = $result->fetch_object()) {
				$tutores[] = $row;
			}
			echo json_encode(["status"=>"ok","data"=>$tutores]);
			break;
		case 'asignar_tutor':
			$codusr = $_SESSION['app_user_id'];
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));	
				exit();		
			}
			$codtut = isset($_POST["codtut"])?$_POST["codtut"]:"";
			$codalu = isset($_POST["codalu"])?$_POST["codalu"]:"";
			if(empty($codtut)||empty($codalu)){
				echo json_encode(array("status"=>"errorParam"));	
				exit();
			}
			require '../modelo/modelo_Alumno.php';
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$Alumno=new Alumno($db);
			$Alumno->asignar_tutor($codalu,$codtut);
			$result = $Alumno->get_data_tutores($codalu);
			$tutores = [];
			while ($row = $result->fetch_object()) {
				$tutores[] = $row;
			}
			echo json_encode(["status"=>"ok","data"=>$tutores]);
			break;
		case 'get_access_all':
		    if(!cliente_activo()||empty($_SESSION['app_user_id'])){
		        echo json_encode(array("status"=>"eSession"));
		        exit();
		    }
		    require '../modelo/modelo_Alumno.php';
		    require '../modelo/modelo_curso.php';
			require '../modelo/modelo_paralelo.php';
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			
			$alumno = new Alumno($db);
			
			$curso = new Curso($db);
			$cursos = $curso->getCursosIndex();
			
			$paralelo = new Paralelo($db);
			$paralelos = $paralelo->getParalelosIndex();
			
			
			$result = $alumno->get_access_all();
			$lista = array();
			while($fila = $result->fetch_object()){
			    $lista[] = array(
			                    "nombre"=>$fila->paterno." ".$fila->materno." ".$fila->nombres,
			                    "codalu"=>$fila->codigo,
			                    "codcur"=>$fila->cod_cur,
			                    "codpar"=>$fila->cod_par,
			                    "curso"=>$cursos[$fila->cod_cur]['nombre']." - ".$paralelos[$fila->cod_par],
			                    "plataforma"=>$fila->servernt,
			                    "boletin"=>$fila->bdesktop,
			                    "evaluacion"=>$fila->usrimple
			                    );
			}
			echo json_encode(array("status"=>"ok","lista"=>$lista));
		    break;
		case 'foto_perfil':
			$codusr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));	
				exit();		
			}
			$codalu = isset($_POST["codalu"])?$_POST["codalu"]:"";
			if(empty($codalu)){
				echo json_encode(array("status"=>"paramError"));	
				exit();		
			}
			if (file_exists($_FILES["imagen"]['tmp_name'])&&is_uploaded_file($_FILES["imagen"]['tmp_name'])) 
				{
					$ext=explode(".",$_FILES["imagen"]["name"]);
					if ($_FILES["imagen"]['type']=="image/jpg"||$_FILES["imagen"]['type']=="image/jpeg"||$_FILES["imagen"]['type']=="image/png") 
					{
						
						$fichero="../fotoperfil/";
						$nombreArchivo=$codalu."_".strtotime(date("Y-m-d H:i:s")).'.'.end($ext);								
						$dato = move_uploaded_file($_FILES["imagen"]["tmp_name"],$fichero.$nombreArchivo);
						require_once'../modelo/conexion.php';
						require_once'../modelo/modelo_Alumno.php';
						$db = Conectar::conexion();
						$alumno = new Alumno($db); 
						$alumno->set_foto_perfil($codalu,"fotoperfil/".$nombreArchivo);
						echo json_encode(["status"=>"ok","img"=>"fotoperfil/".$nombreArchivo]);
					}else{
						echo "errorFile";
						exit();
					}
				}

			break;
		case 'get_kardex_all':
			if(!cliente_activo()||empty($_SESSION['app_user_id'])){
		        echo json_encode(array("status"=>"eSession"));
		        exit();
		    }
		    
		    require '../modelo/modelo_Alumno.php';
		    require '../modelo/modelo_kardex.php';
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			
			$alumno = new Alumno($db);
			$Kardex = new Kardex($db);	
			$gestion = date("Y");
			$result = $alumno->get_all();
			$lista = array();
			while($fila = $result->fetch_object()){
				$codalu = $fila->codigo;
				$result_kardex = $Kardex->get_kardex($codalu,$gestion);
				$kardex = [];
				while ($row_kardex = $result_kardex->fetch_object()) {
					$kardex[] = $row_kardex;
				}
			    $lista[] = array(
			                    "codalu"=>$codalu,
			                    "kardex"=>$kardex
			                    );
			}
			echo json_encode(array("status"=>"ok","lista"=>$lista));
			break;
		case 'get_deshabilitados':
			$codusr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));	
				exit();		
			}
			require '../modelo/modelo_Alumno.php';
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$Alumno = new Alumno($db);
			$result = $Alumno->get_dehabilitados();
			$lista = [];
			while ($row = $result->fetch_object()) {
				$lista[] = [
					"codalu" => $row->codigo,
					"nombre" => "$row->paterno $row->materno $row->nombres"
				];
			}
			echo json_encode(array("status"=>"ok","lista"=>$lista));
			break;
		case 'habilitar':
			$codusr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));	
				exit();		
			}
			require '../modelo/modelo_Alumno.php';
			require_once'../modelo/conexion.php';
			$codalu = isset($_POST["codalu"])?$_POST["codalu"]:"";
			$codcur = isset($_POST["codcur"])?$_POST["codcur"]:"";
			$codpar = isset($_POST["codpar"])?$_POST["codpar"]:"";
			if(empty($codalu)||empty($codcur)||empty($codpar)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}
			$db = Conectar::conexion();
			$Alumno = new Alumno($db);
			$Alumno->habilitar($codalu,$codcur,$codpar);
			if(isset($_POST["plataforma"])){
				$Alumno->set_plataforma_access($codalu,"VERDADERO");
			}
			if(isset($_POST["evaluacion"])){
				$Alumno->set_evaluacion_access($codalu,"VERDADERO");
			}
			if(isset($_POST["boletin"])){
				$Alumno->set_boletin_access($codalu,"VERDADERO");
			}
			echo json_encode(["status"=>"ok"]);
			break;
	}
}else{
	echo "errorGET";
}
?>