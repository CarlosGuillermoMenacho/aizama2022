<?php 
// archivo a eliminar
        /*require '../modelo/modelo_relacion_em.php';
        $relacion = new pregunta_relacion();
        $lista=$relacion->update_relacion(4,6,7,1,'D40');
        echo json_encode($lista);
        */
//-------------------------------//
        session_start();
        header("Content-type:text/html;charset=utf-8");
        header('Access-Conotrol-Allow-Origin: *');
        header("Access-Control-Allow-Credentials: true");
        header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 1000');
        header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
        require '../includes/functions.php';
        require_once'../modelo/conexion.php';
		$db = Conectar::conexion();
        $_tipo_user = isset($_GET['usr'])&&!empty($_GET['usr'])?$_GET['usr']:"";
        /*if (empty($_tipo_user)){
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
            exit();
        }*/
        switch ($_GET['op']) {
            case 'cantidad_relacion':
                $codpre = isset ($_POST["codpre"])?$_POST["codpre"]:"";
				if (empty($codpre)) {
					echo "ErrorParam";
					exit();
				}
				require('../modelo/modelo_relacion_em.php');
				$relacion= new pregunta_relacion($db);
				if ($relacion->cantidad_relacion($codpre)) {
                     echo "Ok";
				}else{
					echo "Error";
				}
                break;

            case 'guardar_relacion'://1
                $codpre = isset ($_POST["codpre"])?$_POST["codpre"]:"";
				$relacion1 = isset ($_POST["relacion1"])?$_POST["relacion1"]:"";
				$relacion2 = isset ($_POST["relacion2"])?$_POST["relacion2"]:"";
				$op_correcto= isset ($_POST["op_correcto"])?$_POST["op_correcto"]:"";
				$codprof=$_SESSION['app_user_id'];
				
                if (empty($codpre)||empty($relacion1)||empty($relacion2)||empty($op_correcto))
                {
					echo "ErrorParam";
					exit();
				}

				require('../modelo/modelo_relacion_em.php');
				$relacion= new pregunta_relacion($db);
                    if ($relacion->guardar_relacion($codpre, $relacion1, $relacion2,$op_correcto, $codprof)) 
                    {
                        echo "Ok";
                    }else{
                        echo "Error";
                    }
                break;
            case 'obtener_nro':
                $id = isset ($_POST["id"])?$_POST["id"]:"";
				if (empty($id)) {
					echo "ErrorParam";
					exit();
				}
				require('../modelo/modelo_relacion_em.php');
				$relacion= new pregunta_relacion($db);
				if ($relacion->obtener_nro($id)) {
                     echo "Ok";
				}else{
					echo "Error";
				}
                break;
        
            case 'delete_relacion':
                $id = isset ($_POST["id"])?$_POST["id"]:"";
                $codpre = isset ($_POST["codpre"])?$_POST["codpre"]:"";
                $nro = isset ($_POST["nro"])?$_POST["nro"]:"";
				if (empty($id)||empty($codpre)||empty($nro)) {
					echo "ErrorParam";
					exit();
				}
                $codprof=$_SESSION['app_user_id'];
				require('../modelo/modelo_relacion_em.php');
				$relacion= new pregunta_relacion($db);
                    if ($relacion->delete_relacion($id, $codpre, $nro, $codprof)) {
                        echo "Ok";
                    }else{
                        echo "Error";
                    }
                break;

            case 'obtener_relacion':
                $codpre = isset ($_POST["codpre"])?$_POST["codpre"]:"";
				if (empty($codpre)) {
					echo "ErrorParam";
					exit();
				}
				require('../modelo/modelo_relacion_em.php');
				$relacion= new pregunta_relacion($db);
				if ($relacion->obtener_relacion($codpre)) {
                     echo "Ok";
				}else{
					echo "Error";
				}
                break;

            case 'update_relacion':
                $id = isset ($_POST["id"])?$_POST["id"]:"";
                $relacion1 = isset ($_POST["relacion1"])?$_POST["relacion1"]:"";
                $relacion2 = isset ($_POST["relacion2"])?$_POST["relacion2"]:"";
                $op_correcto = isset ($_POST["op_correcto"])?$_POST["op_correcto"]:"";
                
				if (empty($id)||empty($relacion1)||empty($relacion2)||empty($op_correcto)) {
					echo "ErrorParam";
					exit();
				}
                $codprof=$_SESSION['app_user_id'];
				require('../modelo/modelo_relacion_em.php');
				$relacion= new pregunta_relacion($db);
				if ($relacion->update_relacion($id,$relacion1,$relacion2,$op_correcto,$codprof)) {
                     echo "Ok";
				}else{
					echo "Error";
				}
                break;

            case 'get_relacion':
                $id = isset ($_POST["id"])?$_POST["id"]:"";
				if (empty($id)) {
					echo "ErrorParam";
					exit();
				}
				require('../modelo/modelo_relacion_em.php');
				$relacion= new pregunta_relacion($db);
				if ($relacion->get_relacion($id)) {
                     echo "Ok";
				}else{
					echo "Error";
				}
                break;

            default:
                echo "ErrorOp";
                break;
        }

?>


