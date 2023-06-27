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
    // obtiene todas las preguntas de un alumno (vista docente)
    case 'get_preg_alum':
        $idaem = isset($_POST['idaem'])?$_POST['idaem']:"";
        if (empty($idaem)) {
            echo json_encode(array("status"=>"errorParam"));
            exit();
        } 
        require '../modelo/modelo_em_alumno_preguntas.php';
        require '../modelo/em_alumno_preg_escrito.php';
        require '../modelo/em_alumno_pregunta_img.php';
        require '../modelo/em_alumno_preg_vf.php';
        require '../modelo/em_alumno_pregunta_relacion.php';
        require '../modelo/em_alumno_preg_opciones.php';
        require '../modelo/em_alumno_preg_op_correcta.php';
        require '../modelo/em_alum_preg_observacion.php';

        $pregunta_escrita = new alumno_preg_escrito($db);
        $alumno_preg = new alumno_pregunta($db);
        $alumno_preg_img = new alumno_pregunta_img($db);
        $pregunta_vf = new alumno_preg_vf($db);
        $pregunta_relacion = new alumno_pregunta_rel($db);
        $alumno_preg_op = new alumno_pregunta_opciones($db);
        $pregunta_opcorrecta = new alumno_preg_opcorrecta($db);
        $alumno_observacion = new alumno_observacion($db);
        $lista_preguntas = $alumno_preg->get_preg_Eval($idaem);
        
        $result = array();
            foreach ($lista_preguntas as $pregunta) {
                switch ($pregunta['tipo']) {
                    case '1':
                         $result[] = array(
                                "id" =>$pregunta ['id'],
                                "idaem" => $pregunta['idaem'],
                                "tipo" =>$pregunta['tipo'],
                                "pregunta" => $pregunta['pregunta'],
                                "notapreg" => $pregunta['notapreg'],
                                "notaC" => $pregunta['notaC'],
                                "respuesta"=> $pregunta_escrita->get_respuesta($pregunta['id']),
                                "img"=> $alumno_preg_img->obtener_link($pregunta['id']),
                                "observacion" => $alumno_observacion->get_observacion($pregunta['id'])
                     );
                        break;
                    case '2':
                        $result[] = array(
                            "id" =>$pregunta ['id'],
                            "idaem" => $pregunta['idaem'],
                            "tipo" =>$pregunta['tipo'],
                            "pregunta" => $pregunta['pregunta'],
                            "notapreg" => $pregunta['notapreg'],
                            "notaC" => $pregunta['notaC'],
                            "img"=> $alumno_preg_img->obtener_link($pregunta['id']),
                            "opciones"=>$alumno_preg_op->get_detalle_preg_opciones($pregunta['id']),
                            "op_correcta"=> $pregunta_opcorrecta->get_oporrecta($pregunta['id']),
                            "op_correcta_alum"=>$pregunta_opcorrecta->get_oporrecta_alum($pregunta['id'])
                        );
                        break;
                    case '3':
                        $result[] = array(
                            "id" =>$pregunta ['id'],
                            "idaem" => $pregunta['idaem'],
                            "tipo" =>$pregunta['tipo'],
                            "pregunta" => $pregunta['pregunta'],
                            "notapreg" => $pregunta['notapreg'],
                            "notaC" => $pregunta['notaC'],
                            "img"=> $alumno_preg_img->obtener_link($pregunta['id']),
                            "vf"=>$pregunta_vf->get_respuesta_doc_vf($pregunta['id']),
                            "vf_alumno"=>$pregunta_vf->get_respuesta_alum_vf($pregunta['id'])
                        );
                        break;
                    case '4':
                        $result[] = array(
                            "id" =>$pregunta ['id'],
                            "idaem" => $pregunta['idaem'],
                            "tipo" =>$pregunta['tipo'],
                            "pregunta" => $pregunta['pregunta'],
                            "notapreg" => $pregunta['notapreg'],
                            "notaC" => $pregunta['notaC'],
                            "relacion"=> $pregunta_relacion-> get_detalle_pregunta_relacion($pregunta ['id'])
                        );
                        break;
                    default:
                        # code...
                        break;
                }
               
            }
        
        echo json_encode(array("status"=>"ok","lista"=>$result));
        break;
    // obtiene la lista de preguntas de un alumno (vista alumno)\
    case 'get_preg_eval_alum':
        $codalu = $_SESSION['app_user_id'];
        $idaem = isset($_POST['idaem'])?$_POST['idaem']:"";
        if (empty($idaem)) {
            echo "errorParam";
            exit();
        } 
        
        require '../modelo/modelo_em_alumno_preguntas.php';
        require '../modelo/em_alumno_preg_escrito.php';
        require '../modelo/em_alumno_pregunta_img.php';
        require '../modelo/em_alumno_preg_vf.php';
        require '../modelo/em_alumno_pregunta_relacion.php';
        require '../modelo/em_alumno_preg_opciones.php';
        require '../modelo/em_alumno_preg_op_correcta.php';
        require '../modelo/em_alum_preg_observacion.php';
        require '../modelo/modelo_em_alumno.php';
        $alumno =  new em_alumno($db);
        $observacion = new alumno_observacion($db);
        $pregunta_escrita = new alumno_preg_escrito($db);
        $alumno_preg = new alumno_pregunta($db);
        $alumno_preg_img = new alumno_pregunta_img($db);
        $pregunta_vf = new alumno_preg_vf($db);
        $pregunta_relacion = new alumno_pregunta_rel($db);
        $alumno_preg_op = new alumno_pregunta_opciones($db);
        $pregunta_opcorrecta = new alumno_preg_opcorrecta($db);
        $lista_preguntas = $alumno_preg->get_preg_Eval($idaem);
        $notafinal=$alumno->obtener_notafinal($idaem);
        $proceso=$alumno->obtener_proceso($idaem);
        $result = array();
            foreach ($lista_preguntas as $pregunta) {
                switch ($pregunta['tipo']) {
                   
                    case '1':
                         $result[] = array(
                                "id" =>$pregunta ['id'],
                                "idaem" => $pregunta['idaem'],
                                "tipo" =>$pregunta['tipo'],
                                "pregunta" => $pregunta['pregunta'],
                                "notapreg" => $pregunta['notapreg'],
                                "notaC"=>$pregunta['notaC'],
                                "respuesta"=> $pregunta_escrita->get_respuesta($pregunta['id']),
                                "observacion"=>$observacion->get_campo_observacion($pregunta['id']),
                                "img"=> $alumno_preg_img->obtener_link($pregunta['id'])
                     );
                        break;
                    case '2':
                        $result[] = array(
                            "id" =>$pregunta ['id'],
                            "idaem" => $pregunta['idaem'],
                            "tipo" =>$pregunta['tipo'],
                            "pregunta" => $pregunta['pregunta'],
                            "notapreg" => $pregunta['notapreg'],
                            "notaC"=>$pregunta['notaC'],
                            "img"=> $alumno_preg_img->obtener_link($pregunta['id']),
                            "opciones"=>$alumno_preg_op->get_detalle_preg_opciones($pregunta['id']),
                            "op_correcta_alum"=>$pregunta_opcorrecta->get_oporrecta_alum($pregunta['id'])
                        );
                        break;
                    case '3':
                        $result[] = array(
                            "id" =>$pregunta ['id'],
                            "idaem" => $pregunta['idaem'],
                            "tipo" =>$pregunta['tipo'],
                            "pregunta" => $pregunta['pregunta'],
                            "notapreg" => $pregunta['notapreg'],
                            "notaC"=>$pregunta['notaC'],
                            "img"=> $alumno_preg_img->obtener_link($pregunta['id']),
                            "vf_alumno"=>$pregunta_vf->get_respuesta_alum_vf($pregunta['id'])
                        );
                        break;
                    case '4':
                        $result[] = array(
                            "id" =>$pregunta ['id'],
                            "idaem" => $pregunta['idaem'],
                            "tipo" =>$pregunta['tipo'],
                            "pregunta" => $pregunta['pregunta'],
                            "notapreg" => $pregunta['notapreg'],
                            "notaC"=>$pregunta['notaC'],
                            "relacion"=> $pregunta_relacion-> get_detalle_pregunta_relacion($pregunta ['id'])
                        );
                        break;
                    default:
                       
                        break;
                }
               
            }
        
        echo json_encode(array("status"=>"ok","notafinal"=>$notafinal,"proceso"=>$proceso,"lista"=>$result));
        break;


    default:
        # code...
        break;
}


?>