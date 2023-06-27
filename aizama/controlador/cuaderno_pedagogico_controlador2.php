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

    case 'get_cuaderno_doc':

        $codprof = $_SESSION['app_user_id'];

        if(!cliente_activo()||empty($codprof)){

            echo json_encode(array('status'=>"eSession"));

            exit();

        }

        

        $codcur = isset($_POST['codcur'])?$_POST['codcur']:"";

        $codpar = isset($_POST['codpar'])?$_POST['codpar']:"";

        $codmat = isset($_POST['codmat'])?$_POST['codmat']:"";

        

        if(empty($codcur)||empty($codpar)||empty($codmat)){

            echo "errorParam";

            exit();

        }

        

        $trimestre = $_SESSION['app_user_bimestre'];

        $gestion = date('Y');

        require_once'../modelo/modelo_cuaderno_pedagogico2.php';

        $cuaderno = new CuadernoPedagogico($db);

        $lista = $cuaderno->get_cuaderno_pedagogico($gestion,$trimestre,$codcur,$codpar,$codmat);

        echo json_encode(array("status"=>"ok","lista"=>$lista),JSON_UNESCAPED_UNICODE);



		break;

     case 'reg_asistencia_doc':
            $codprof = $_SESSION['app_user_id'];
            if(!cliente_activo()||empty($codprof)){
                echo json_encode(array('status'=>"eSession"));
                exit();
            }
            require_once'../modelo/modelo_profesor.php';
            require_once'../modelo/modelo_prof_cur_mat.php';
            $pcm = new Prof_cur_mat($db);
            $profesor = new Profesor($db);
            $nombre_profesor = $profesor->get_nombre($codprof);
            
            $codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
            $codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
            $codmat = isset($_POST['codmat'])?$_POST['codmat']:"";
        
            if(empty($codcur)||empty($codpar)||empty($codmat)){
                echo "errorParam";
                exit();
            }
            
            if($nombre_profesor == null){
                $nombre_profesor = $pcm->get_profesor($codcur,$codpar,$codmat,date("Y"));
            }
            $dias = array("L","M","M","J","V","S","D");
            $anio_escolaridad = "";
            if($codcur == 16||$codcur == 10)$anio_escolaridad = "SEXTO";
            if($codcur == 15||$codcur == 9)$anio_escolaridad = "QUINTO";
            if($codcur == 14||$codcur == 8)$anio_escolaridad = "CUARTO";
            if($codcur == 13||$codcur == 7)$anio_escolaridad = "TERCERO";
            if($codcur == 12||$codcur == 6)$anio_escolaridad = "SEGUNDO";
            if($codcur == 11||$codcur == 5)$anio_escolaridad = "PRIMERO";
            $nivel = $codcur > 10?"SECUNDARIA COMUNITARIA PRODUCTIVA":($codcur>4?"PRIMARIA COMUNITARIA VOCACIONAL":"INICIAL"); 
            $trimestre = $_SESSION['app_user_bimestre'];
            require_once'../modelo/modelo_asistencia_alumno.php';
            require_once'../modelo/modelo_curso.php';
            require_once'../modelo/modelo_materia.php';
            $mes = "";

            if($trimestre == 1)$mes = 'FEBRERO - MARZO - ABRIL';
            if($trimestre == 2)$mes = 'MAYO - JUNIO - JULIO';
            if($trimestre == 3)$mes = 'AGOSTO - SEPTIEMBRE - OCTUBRE';

            $materia = new Materia($db);
            $nombre_materia = $materia->get_nombre($codmat);
            $asis = new Asistencias($db);
            $result_asistencias = $asis->get_asistencias($trimestre,$codcur,$codpar,$codmat);

            $asistencias =array();
            while ($fila = $result_asistencias->fetch_object()) {
                $asistencias[] = $fila;
            }
            
            $curso = new Curso($db);

            $lista_alumnos = $curso->obtener_ListaAlumnos($codcur,$codpar);

            $result_lista_fechas = $asis->get_fechas($trimestre,$codcur,$codpar,$codmat);
            $lista_asistencias = array();
            $lista_codigos = array();
            foreach ($lista_alumnos as $alumno) {
                 $codalu = $alumno['codalu'];
                 $nombre = $alumno['paterno'].' '.$alumno['materno'].' '.$alumno['nombres'];
                 $lista_codigos[] = $codalu;
                 $lista_asistencias[$codalu] = array(
                                                    "codalu"=>$codalu,
                                                    "nombre"=>$nombre,
                                                    "asistencias"=>array(),
                                                    "atrasos"=>"",
                                                    "licencias"=>"",
                                                    "faltas"=>""
                                                    );   
            }
            $lista_fechas = array();
            while ($fila = $result_lista_fechas->fetch_object()) {
                $fecha = $fila->fecha;
                $lista_fechas[] = array("fecha"=>$fecha,"dia"=>$dias[date("N",strtotime($fecha))-1]);
                foreach ($lista_alumnos as $alumno) {
                    $codalu = $alumno['codalu'];
                    $lista_asistencias[$codalu]['asistencias'][] = asistio($codalu,$fecha,$asistencias);
                }
            }
            foreach ($lista_alumnos as $alumno) {
                $codalu = $alumno['codalu'];
                $lista_asistencias[$codalu]['atrasos'] = contarRegistros($codalu,$asistencias,"3");
                $lista_asistencias[$codalu]['licencias'] = contarRegistros($codalu,$asistencias,"2");
                $lista_asistencias[$codalu]['faltas'] = contarRegistros($codalu,$asistencias,"0");
            }

            echo json_encode(array(
                                    "status"=>"ok",
                                    "fechas"=>$lista_fechas,
                                    "asistencias"=>$lista_asistencias,
                                    "trimestre"=>$trimestre,
                                    "profesor"=>$nombre_profesor,
                                    "materia"=>$nombre_materia,
                                    "nivel"=>$nivel,
                                    "anio_escolaridad"=>$anio_escolaridad,
                                    "mes"=>$mes,
                                    "anio"=>date("Y"),
                                    "codigos"=>$lista_codigos
                                ));
            break;

default:

    echo "ErrorOP";

    break;



}
function contarRegistros($codalu,$asistencias,$reg){
    $cont = 0;
    for ($i=0; $i < count($asistencias); $i++) { 
        if($asistencias[$i]->codalu == $codalu && $asistencias[$i]->estado == $reg ){
            $cont++;
        }
    }
    return $cont;
}

function asistio($codalu,$fecha,$asistencias){
    for ($i=0; $i < count($asistencias); $i++) { 
        if($asistencias[$i]->codalu == $codalu && $asistencias[$i]->fecha == $fecha ){
            $estado = $asistencias[$i]->estado;
            if($estado == '0')return 'F';
            if($estado == '1')return 'P';
            if($estado == '2')return 'L';
            if($estado == '3')return 'R';
        }
    }
    return "";
}

?>