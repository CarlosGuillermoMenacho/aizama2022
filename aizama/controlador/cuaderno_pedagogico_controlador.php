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

        require_once'../modelo/modelo_cuaderno_pedagogico.php';

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
            $dias = array("Lu","Ma","Mi","Ju","Vi","Sa","Do");
            $reg_asist = array("Falta","Presente","Licencia","Retraso");
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
            if($trimestre == 2)$mes = 'MAYO - JUNIO - AGOSTO - SEPTIEMBRE';
            if($trimestre == 3)$mes = 'SEPTIEMBRE - OCTUBRE - NOVIEMBRE';

            $materia = new Materia($db);
            $nombre_materia = $materia->get_nombre($codmat);
            $materias = $materia->getMaterias();
            
            $asis = new Asistencias($db);
            $result_asistencias = $asis->get_asistencias($trimestre,$codcur,$codpar,$codmat);
            $result_asistencias_diarias = $asis->get_registros($trimestre,$codcur,$codpar);

            $asistencias =array();
            $asistencias_diarias = array();
            while ($fila = $result_asistencias->fetch_object()) {
                $asistencias[] = $fila;
            }

            while ($fila = $result_asistencias_diarias->fetch_object()) {
                $asistencias_diarias[] = $fila;
            }
            
            $curso = new Curso($db);

            $lista_alumnos = $curso->obtener_ListaAlumnos($codcur,$codpar);

            $result_lista_fechas = $asis->get_fechas($trimestre,$codcur,$codpar,$codmat);
            $result_lista_fechas_diaria = $asis->get_fechas_all($trimestre,$codcur,$codpar);
            $lista_asistencias = array();
            $lista_asistencias_diaria = array();
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
                 $lista_asistencias_diaria[$codalu] = array(
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
            
            $lista_fechas_diaria = array();
            while ($fila = $result_lista_fechas_diaria->fetch_object()) {
                $fecha = $fila->fecha;
                $lista_fechas_diaria[] = array("fecha"=>$fecha,"dia"=>$dias[date("N",strtotime($fecha))-1]);
                foreach ($lista_alumnos as $alumno) {
                     $codalu = $alumno['codalu'];
                     $asistio = asistio_diaria($codalu,$fecha,$asistencias_diarias);
                     $datos_asistencias = []; 
                     if(!empty($asistio)){
                        $asis_char = $asistio[0];
                        $datos = $asistio[1];
                        foreach ($datos as $fila) {
                            $nom_materia = $materias[$fila->codmat]['nombre'];
                            $estado = $reg_asist[$fila->estado];
                            $datos_asistencias[] = [$nom_materia,$estado];
                        }
                        $asistio = [$asis_char,$datos_asistencias];
                        switch ($asis_char) {
                            case 'F':
                                $cont = $lista_asistencias_diaria[$codalu]['faltas'];
                                if(empty($cont)){
                                    $cont = 1;
                                }else{
                                    $cont++;
                                }
                                $lista_asistencias_diaria[$codalu]['faltas'] = $cont;
                                break;
                            case 'R':
                                $cont = $lista_asistencias_diaria[$codalu]['atrasos'];
                                if(empty($cont)){
                                    $cont = 1;
                                }else{
                                    $cont++;
                                }
                                $lista_asistencias_diaria[$codalu]['atrasos'] = $cont;
                                break;
                            case 'L':
                                $cont = $lista_asistencias_diaria[$codalu]['licencias'];
                                if(empty($cont)){
                                    $cont = 1;
                                }else{
                                    $cont++;
                                }
                                $lista_asistencias_diaria[$codalu]['licencias'] = $cont;
                                break;
                        }
                     }
                    $lista_asistencias_diaria[$codalu]['asistencias'][] = $asistio;
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
                                    "fechas_diarias"=>$lista_fechas_diaria,
                                    "asistencias"=>$lista_asistencias,
                                    "asistencias_diarias"=>$lista_asistencias_diaria,
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
function asistio_diaria($codalu,$fecha,$asistencias_diarias){
    $presente = "";
    $retrasado = "";
    $licencia = "";
    $falta = "";
    $datos = [];
    for ($i=0; $i < count($asistencias_diarias); $i++) { 
        if($asistencias_diarias[$i]->codalu == $codalu && $asistencias_diarias[$i]->fecha == $fecha){
            $estado = $asistencias_diarias[$i]->estado;
            if($estado == '0')$falta = 'F';
            if($estado == '1')$presente = 'P';
            if($estado == '2')$licencia = 'L';
            if($estado == '3')$retrasado = 'R';

            $datos[] = $asistencias_diarias[$i];
        }
    }

    if(!empty($presente))return [$presente,$datos];
    if(!empty($retrasado))return [$retrasado,$datos];
    if(!empty($licencia))return [$licencia,$datos];
    if(!empty($falta))return [$falta,$datos];
    return '';

}

?>