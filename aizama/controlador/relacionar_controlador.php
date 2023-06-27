<?php 
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
        case 'cantidad_relacion':
            $codpreg = isset($_POST["codpreg"])? $_POST["codpreg"]:"";
            if (empty($codpreg)) {
                echo "ErrorParam";
                exit();
            }
            require '../modelo/modelo_relacionar_em.php';
            $relacionar = new relacionar_pregunta($db);
            if( $relacionar->cantidad_relacion($codpreg)){
                echo "Ok";
            }else{
                echo "error";
            }
            break;

        case 'obtener_nro':
            $idrelacion = isset($_POST["idrelacion"])? $_POST["idrelacion"]:"";
            if (empty($idrelacion)) {
                echo "ErrorParam";
                exit();
            }
            require '../modelo/modelo_relacionar_em.php';
            $relacionar = new relacionar_pregunta($db);
            if( $relacionar->obtener_nro($idrelacion)){
                echo "Ok";
            }else{
                echo "error";
            }
            break;

        case 'delete_relacion':
            $idrelacion = isset($_POST["idrelacion"])? $_POST["idrelacion"]:"";
            $codpreg = isset ($_POST["codpreg"])? $_POST["codpreg"]:"";
            $nro = isset ($_POST["nro"])? $_POST["nro"]:"";
            if (empty($idrelacion)||empty($codpreg)||empty($nro)) 
            {   echo "ErrorParam";
                exit();
            }
            $fechaReg = date("Y-m-d H:i:s"); 
            $codprof = $_SESSION['app_user_id'];
            require '../modelo/modelo_relacionar_em.php';
            $relacionar = new relacionar_pregunta($db);
            if( $relacionar->delete_relacion($idrelacion,$codpreg, $nro, $codprof))
            {
                echo "ok";
            }else{
                echo "error";
            }
            break;

        case 'obtener_relacion':
            $codpreg = isset($_POST["codpreg"])? $_POST["codpreg"]:"";
            if (empty($codpreg)) {
                echo "ErrorParam";
                exit();
            }
            require '../modelo/modelo_relacionar_em.php';
            $relacionar = new relacionar_pregunta($db);
            if ($relacionar->obtener_relaciones($codpreg)) {
                echo "Ok";
            }else{
                echo"Error";
            }
            break;
        // guardar(actualizar la respuesta del alumno)(vista alumno)
        case 'save_respuesta_relacion':
            $id = isset($_POST['id'])?$_POST['id']:"";
            $idaem = isset($_POST['idaem'])?$_POST['idaem']:"";
            $correcto = isset($_POST['correcto'])?$_POST['correcto']:"";

            if (empty($idaem)||empty($id)||empty($correcto)) {
                echo "errorParam";
                exit();
            } 

            $fechaActual = date("Y-m-d H:i:s");
            //Validando que la evaluacion esta en proceso
            require '../modelo/modelo_em_alumno.php';
            require '../modelo/em_alumno_pregunta_relacion.php';
            $pregunta_relacion = new alumno_pregunta_rel($db);
            $em_alumno = new em_alumno($db);
            $id_preg =$pregunta_relacion->get_idpregunta($id);
            //$cant =$pregunta_relacion->cantidad_em_relacion($id_preg);
            $detalle = $em_alumno->get_detalle_em_alumno($idaem);
                if (!empty($detalle)) {
                    foreach ($detalle as $det) {
                        $proceso = $det['proceso'];
                    }
                    if ($proceso==0) {
                        echo "finalizado";
                        exit();
                    }else{
                        if($pregunta_relacion->update_respuesta_rel( $correcto, $id)){
                            echo "ok";
                            exit();  
                        }
                        
                    }
                }else{
                    echo "noProc";
                    exit();
                }

            break;    
        default:
            echo "ErrorOp";
            break;
    }
?>   
   
   
   
