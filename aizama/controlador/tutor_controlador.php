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

		header("Location: ../docentes.php");

	}

	if ($_tipo_user=='alu') {

		header("Location: ../usuario.php");

	}

	if ($_tipo_user=='adm') {

		header("Location: ../administracion.php");

	}

    if ($_tipo_user=='tut') {

        header("location: ../familia.php");

    }

	exit();

}

switch ($_GET['op']) {

    case 'get_alumnos':

        $codtut = $_SESSION['app_user_id'];

        

        if(empty($codtut)){

            echo json_encode(array("status"=>"eSession"));

            exit();

        }

        require '../modelo/modelo_tutor.php';

        $tutor=new Tutor($db);

        $listaAlumnos=$tutor->get_alumnoss($codtut);

        echo json_encode(array("status"=>"ok","lista_alumnos"=>$listaAlumnos));

    break;

    case 'get_tutores':
        $codusr = $_SESSION['app_user_id'];
        if(empty($codusr)){
            echo json_encode(array("status"=>"eSession"));  
            exit();     
        } 
        require '../modelo/modelo_tutor.php';
        require_once'../modelo/conexion.php';
        $db = Conectar::conexion();
        $Tutor=new Tutor($db);
        $result = $Tutor->get_all();
        $tutores = [];
        while ($row = $result->fetch_object()) {
            $tutores[] = [
                "contacto"=>$row->cel,
                "cedula"=>$row->ci,
                "codtut"=>$row->cod_tut,
                "direccion"=>$row->direccion,
                "nacimiento"=>$row->f_nacido,
                "materno"=>$row->materno,
                "nombres"=>$row->nombres,
                "paterno"=>$row->paterno
            ];
        }
        echo json_encode(array("status"=>"ok","data"=>$tutores));
        break;    

default:

    echo "ErrorOP";

    break;



}



?>