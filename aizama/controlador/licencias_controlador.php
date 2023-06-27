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

        header("Location: ../familia.php");

    }

	exit();

}

switch ($_GET['op']) {

    case 'guardar_licencia':

        $codalu = isset($_POST['codalu'])?($_POST['codalu']):"";

		$codtut = $_SESSION['app_user_id'];

		$f_ini = isset($_POST['f_ini'])?$_POST['f_ini']:"";

		$f_fin = isset($_POST['f_fin'])?$_POST['f_fin']:"";

		$obs = isset($_POST['obs'])?$_POST['obs']:"";

		

     

        if(empty($codalu)||empty($codtut)||empty($f_ini)||empty($f_fin)||empty($obs)){

            echo "errorParam:)";

            exit();

        }

        require '../modelo/modelo_licencias.php';

        $licencia=new Licencia($db);

        

        $f_solicitud= date("Y-m-d");

        $h_solicitud = date("H:i:s");

        

        if($f_ini<$f_solicitud){

            echo "errorFecha";

            exit();

        }



        $lista_licencia=$licencia->get_licencias($codalu);

        $nfi=strtotime($f_ini);

        $nff=strtotime($f_fin);

        if( $nfi>$nff ){

			echo "errorHora1";

			exit();

		}

        $index=0;

        foreach ($lista_licencia as $lic) {

            $fi=strtotime($lista_licencia[$index]['f_ini']);

            $ff=strtotime($lista_licencia[$index]['f_fin']);

            if (!(($nfi>$ff && $nfi<=$nff)||($nfi < $fi && $nfi<=$nff)) ) {

                echo "errorHora2";

                exit();

            }

          $index++;  

        }

        

        if($licencia->guardar_licencia($codalu, $codtut, $f_solicitud, $h_solicitud, $f_ini, $f_fin, $obs)){

			echo "ok";

			exit();

		}

			echo "error";

		break;

    

        case'get_licencias':

            $codalu = isset($_POST['codalu'])?$_POST['codalu']:"";

     

            if (empty($codalu)) {

                echo "errorParam";

                exit();

            } 

            require '../modelo/modelo_licencias.php';

            $licencia=new Licencia($db);

            $listalicencias=$licencia->get_licencias ($codalu);

            $result=array();

            foreach ($listalicencias as $lic){

                $result[]=array(

                    "id"=>$lic['id'],

                    "codalu"=> $lic['codalu'],

                    "codtut"=>$lic['cod_tut'],

                    "f_solicitud"=>$lic['f_solicitud'],

                    "h_solicitud"=> $lic['h_solicitud'],

                    "f_ini"=>$lic['f_ini'],

                    "f_fin"=>$lic['f_fin'],

                    "obs"=> $lic['obs'],

                    "estado"=>$lic['estado']

                );

            }

            echo json_encode(array("status"=>"ok","lista_licencia"=>$result));

            

            break;

            case 'Update_licencias':

				$id = isset ($_POST["id"])? $_POST["id"]:"";

                $f_ini = isset($_POST['f_ini'])?$_POST['f_ini']:"";

                $f_fin = isset($_POST['f_fin'])?$_POST['f_fin']:"";

                $obs = isset($_POST['obs'])?$_POST['obs']:"";

                $codalu = isset($_POST['codalu'])?$_POST['codalu']:"";

                

                if(empty($id)||empty($f_ini)||empty($f_fin)||empty($obs)){

                    echo "errorParam";

                    exit();

                }

                require('../modelo/modelo_licencias.php');

				$licencia = new Licencia($db);

				$f_solicitud = date("Y-m-d"); 

				$h_solicitud = date("H:i:s"); 

                if($f_ini<$f_solicitud){

                    echo "errorFecha";

                    exit();

                }

                $lista_licencia=$licencia->get_licencias($codalu);

                $nfi=strtotime($f_ini);

                $nff=strtotime($f_fin);

                if( $nfi>$nff ){

                    echo "errorHora1";

                    exit();

                }

               

                foreach ($lista_licencia as $lic) {

                    $fi=strtotime($lic['f_ini']);

                    $ff=strtotime($lic['f_fin']);

                    $nid=$lic['id'];

                        if ($nid!=$id&&!(($nfi>$ff && $nfi<=$nff)||($nff < $fi && $nfi<=$nff)) ) {  

                            //echo $nfi.' - '.$nff."  -  ".$fi.'  -  '.$ff;

                            echo "errorHora2";

                            exit();

                        }

                }

				

				if( $licencia->update_licencias($id,$f_solicitud, $h_solicitud, $f_ini, $f_fin, $obs)){

					echo "ok";

				}else{

					echo "error";

				}

			break;

            

            case 'delete_licencias':

                $id = isset ($_POST["id"])? $_POST["id"]:"";

                if ( empty($id) ){	

                    echo "errorParam";		

                    exit();

                }

                require('../modelo/modelo_licencias.php');

				$licencia = new Licencia($db);

                if( $licencia->delete_licencia($id))

                {

                    echo "Ok";			

                }else{

                    echo "error";

                }

            break;

            

            case'get_licencia_id':

                $id = isset($_POST['id'])?$_POST['id']:"";

                

                if (empty($id)) {

                    echo "errorParam";

                    exit();

                } 

                require '../modelo/modelo_licencias.php';

                $licencia=new Licencia($db);

                $listalicencias=$licencia->get_licencia_id ($id);

                $result=array();

                foreach ($listalicencias as $lic){

                    $result[]=array(

                        "id"=>$lic['id'],

                        "codalu"=> $lic['codalu'],

                        "codtut"=>$lic['cod_tut'],

                        "f_solicitud"=>$lic['f_solicitud'],

                        "h_solicitud"=> $lic['h_solicitud'],

                        "f_ini"=>$lic['f_ini'],

                        "f_fin"=>$lic['f_fin'],

                        "obs"=> $lic['obs'],

                        "estado"=>$lic['estado']

                    );

                }

                echo json_encode(array("status"=>"ok","licencia"=>$result));

                

                break;

    

default:

    echo "ErrorOP";

    break;



}



?>