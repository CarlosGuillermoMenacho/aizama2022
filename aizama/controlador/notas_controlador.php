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
$_tipo_user = isset($_GET['usr'])&&!empty($_GET['usr'])?$_GET['usr']:"";
if (empty($_tipo_user)){
	echo "errorGET";
	exit();
}
if(!cliente_activo()){
	if ($_tipo_user=='doc') {
		echo "<script>location.href='../docentes.php';</script>";
	}
	if ($_tipo_user=='alu') {
		echo "<script>location.href='../usuario.php';</script>";
	}
	if ($_tipo_user=='adm') {
		echo "<script>location.href='../administracion.php';</script>"; 
	}
	if ($_tipo_user=='tut') {
		echo "<script>location.href='../familia.php';</script>"; 
	}
	exit();
}
switch ($_GET['op']) {
	case 'guardar_ser_decidir':
		$codprof = $_SESSION['app_user_id'];
		if(empty($codprof)){
			header('Location: ../docentes.php');
			exit();
		}
		$trimestre = $_SESSION['app_user_bimestre'];
		$gestion = date("Y");
		$codmat = isset($_POST['materia'])?$_POST['materia']:"";
		if(empty($codmat)){
			echo "errorParam";
			exit();
		}

		if($lista = json_decode($_POST['lista'],true)){
			require_once'../modelo/modelo_ser_decidir.php';
			$Ser_decidir = new SerDecidir($db);
			$fechareg = date("Y-m-d H:i:s");
			for ($i=0; $i < count($lista); $i++){
				$codalu = $lista[$i]['codigo'];
				$ser = $lista[$i]['ser'];
				$decidir = $lista[$i]['decidir'];
				$jus_ser = $lista[$i]['obs1'];
				$jus_dec = $lista[$i]['obs2'];
				if(!empty($ser)||!empty($decidir)){
				    $result = $Ser_decidir->save($gestion,$trimestre,$codalu,$codmat,$ser,$decidir,$fechareg,$codprof,$jus_ser,$jus_dec);
				}
				
			}		
			echo "ok";			
		}else{
			echo "errorJSON";
			exit();
		}


		break;
	case 'lista':
		$codprof = $_SESSION['app_user_id'];
		if(empty($codprof)){
			header('Location: docentes.php');
			exit();
		}
		$trimestre = $_SESSION['app_user_bimestre'];

		$codcur = isset($_POST['curso'])?$_POST['curso']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
		$codmat = isset($_POST['materia'])?$_POST['materia']:"";
		$gestion = date("Y");
		if(empty($codcur)||empty($codpar)||empty($codmat)){
			echo "errorParam";
			exit();
		}

		require_once'../modelo/modelo_curso.php';
		$curso = new Curso($db);
		$lista_alumnos = $curso->obtener_ListaAlumnos($codcur,$codpar);

		$lista = array();
		require_once'../modelo/modelo_ser_decidir.php';
		$Ser_decidir = new SerDecidir($db);
		foreach ($lista_alumnos as $fila) {
			$codalu = $fila['codalu'];
			$nombre = $fila['paterno'].' '.$fila['materno'].' '.$fila['nombres'];
			$notas = $Ser_decidir->get_ser_decidir($gestion,$trimestre,$codalu,$codmat);
			$ser = isset($notas['ser'])?$notas['ser']:"";
			$decidir = isset($notas['decidir'])?$notas['decidir']:"";
			$jus_ser = isset($notas['jus_ser'])?$notas['jus_ser']:"";
			$jus_dec = isset($notas['jus_dec'])?$notas['jus_dec']:"";
			$lista[] = array(
							"codigo"=>$codalu,
							"nombre"=>$nombre,
							"nota"=>$ser,
							"deci"=>$decidir,
							"obs_s"=>$jus_ser,
							"obs_d"=>$jus_dec
							);
		}
		echo json_encode($lista);


			break;	
	default:
		echo "ErrorOP";
		break;
}

?>

