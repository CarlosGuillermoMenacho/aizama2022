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
	exit();
}
    
switch ($_GET['op']) {
	case 'guardar_observacion_notaC':
        $tipos=isset($_POST["tip"])? $_POST["tip"]:"";
        $idaem = isset($_POST["idaem"])? $_POST["idaem"]:"";
        $notafinal = isset ($_POST["notaFinal"])? $_POST["notaFinal"]:"";
        if ( empty($tipos)){
            echo "errorParam1";
            exit();
        }
        require('../modelo/em_alum_preg_observacion.php');
        require('../modelo/modelo_em_alumno_preguntas.php');
        require('../modelo/modelo_em_alumno.php');
        $alumno = new em_alumno($db);
        $alumno_preg = new alumno_pregunta($db);
        $observacion = new alumno_observacion($db);
        $idesc;
        $notaesc;
        $idrel;
        $notarel;
       // $sumanf=0;
        //echo json_encode($tipos);
            foreach ($tipos as $tipo) {
                if ($tipo==1) {
                    $idsesc = isset($_POST["idpregEsc"])? $_POST["idpregEsc"]:"";
                    $notasesc = isset($_POST["notaPregEsc"])? $_POST["notaPregEsc"]:"";
                    $observaciones = isset($_POST["observacion"])? $_POST["observacion"]:"";
                    $notasPreg = isset($_POST["notasPreg"])? $_POST["notasPreg"]:"";
                    
                    if (empty($idsesc)|| empty($notasesc)){
                        echo "errorParam2";
                        exit();
                    }

                    $ie=0;
                    foreach($observaciones as $obs){
                        $idesc = isset($_POST["idpregEsc"][$ie])? $_POST["idpregEsc"][$ie]:"";
                        $notaesc =isset($_POST["notaPregEsc"][$ie])? $_POST["notaPregEsc"][$ie]:"";
                        $notaPreg = isset($_POST["notasPreg"][$ie])? $_POST["notasPreg"][$ie]:"";
                        if ($notaesc=="") {
                            echo "errorNota";
                            exit();
                        }
                        
                        if($notaesc > $notaPreg){
                            echo "NotaMayor2";
                            exit();
                        }
                        if ($obs!="") { 
                            $fechaReg = date("Y-m-d H:i:s"); 
                            $codprof =  $_SESSION['app_user_id'];
                            $estado = 1;
                            $cant = $observacion->get_cant_observaciones($idesc);
                            if ( $cant <=0) {
                                $observacion->save_detalle_observacion($idesc, $obs, $codprof, $fechaReg, $estado);
                                $alumno_preg->update_notaC($idesc, $notaesc);
                            }else{
                                $observacion->update_observacion($idesc, $obs);
                                $alumno_preg->update_notaC($idesc, $notaesc);
                            }      
                        } else{
                            $alumno_preg->update_notaC($idesc, $notaesc);
                        }
                        $ie++;    
                    }
                         
                }
                if ($tipo==2) {
                    $idsSel = isset($_POST["idpregSel"])? $_POST["idpregSel"]:"";
                    $notasSel = isset($_POST["notapregSel"])? $_POST["notapregSel"]:"";
                    if (empty($idsSel)|| empty($notasSel)){
                        echo "errorParam3";
                        exit();
                    }   
                    //echo json_encode($notasSel);
                    $is=0;
                    foreach($idsSel as $idSel){
                        $notaSel = isset($_POST["notapregSel"][$is])? $_POST["notapregSel"][$is]:"";  

                        $alumno_preg->update_notaC($idSel, $notaSel);
                        $is++;       
                    }
                }
                if ($tipo==3) {
                    $idsvf = isset($_POST["idpregvf"])? $_POST["idpregvf"]:"";
                    $notasvf = isset($_POST["notapregvf"])? $_POST["notapregvf"]:"";
                    if (empty($idsvf)|| empty($notasvf)){
                        echo "errorParam3";
                        exit();
                    }   
                    $i=0;
                    foreach($idsvf as $idvf){
                        $notavf = isset($_POST["notapregvf"][$i])? $_POST["notapregvf"][$i]:"";  
                        $alumno_preg->update_notaC($idvf, $notavf);
                        $i++;        
                    }
                   
                }
           // echo "tipo4", $tipos[$index];
                if ($tipo==4) {
                    $idsrel = isset($_POST["idpregRel"])? $_POST["idpregRel"]:"";
                    $notasrel = isset($_POST["notapregRel"])? $_POST["notapregRel"]:"";
                    $notasRelacion= isset($_POST["notasRelacion"])? $_POST["notasRelacion"]:"";
                    if (empty($idsrel)|| empty($notasrel)){
                     echo "errorParam3";
                        exit();
                    }   
                    $i=0;
                    foreach($idsrel as $idrel){
                        $notarel = isset($_POST["notapregRel"][$i])? $_POST["notapregRel"][$i]:""; 
                        $notaRelacion = isset($_POST["notasRelacion"][$i])? $_POST["notasRelacion"][$i]:"";
                        if ($notarel=="") {
                            echo "errorNota";
                            exit();
                        } 
                        if($notarel > $notaRelacion){
                            echo "NotaMayor1";
                            exit();
                        }
                        $alumno_preg->update_notaC($idrel, $notarel);
                        $i++;       
                    }
                    
                }
        }
           
            if($alumno->update_notafinal($idaem,$notafinal)){
                echo "Ok";
            }

           
        break;
    default:
        # code...
        break;
}
?>