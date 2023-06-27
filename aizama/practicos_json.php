<?php  
session_start();
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
require 'includes/functions.php';
/*if(!cliente_activo())
{
  $respuesta = array("status"=>"eSession");
                echo json_encode($respuesta);
  exit();
}*/
if ($_GET) {
  switch ($_GET['op']) {
      case 'getPracticos': //Se obtiene los practicos de un estudiante
              $codAlu = $_SESSION['app_user_id'];//Codigo de estudiante
              require 'includes/config.php';
              $db = mysqli_connect($servername, $username, $password, $database) 
                      or die('Error al intentar conectar con el servidor.');
              $acento = mysqli_query($db,"SET NAMES 'utf8'");
              //Validando que el usuario sea alumno
              $sql = "select * from alumno where codigo=".$codAlu." and estado = 1";
              
              if($result = mysqli_query($db,$sql)){
                  
              }else{
                  $resp = array("status"=>"errorSql");
                  echo json_encode($resp);
                  exit();
              }

              if ($row = $result->fetch_object()) {
                $gestion = date("Y");
                $trimestre = $_SESSION['app_user_bimestre'];
                $codCur = $row->cod_cur;
                $codPar = $row->cod_par;

                //Obtneiendo la lista de materias que esta asignadas al curso
                $sql = "select cm.cod_mat,m.descri from cur_mat cm inner join materia m on cm.cod_mat=m.codmat and 
                    cm.cod_cur = ".$codCur." and cm.cod_par = ".$codPar." and cm.estado = 1";
                $result = mysqli_query($db,$sql);

                $materias = array();
                $practicos = array();
                
                while ($row = $result->fetch_object()) {
                    $codmat = $row->cod_mat;
                    $nombre = $row->descri;//Nombre de la materia
                  
                    
                  
                    $sql = "select * from cuestionarios where bimestre=".$trimestre." and 
                    cod_cur = ".$codCur." and cod_par = ".$codPar. " and cod_mat='".$row->cod_mat."' and estado=1 order by cod_cuest asc";

                  
                    if($result1 = mysqli_query($db,$sql)){
                         $cont = 0;
                        while($row1 = $result1->fetch_object()){
                            $idpractico = $row1->cod_cuest;
                            $descripcion = $row1->descrip;
                            
                            //Verificando que el practico ha sido presentado por el estudiante
                            $sql = "select * 
                                    from practico_alumno 
                                    where codpractico=".$idpractico." and estado > 0 and codalumno=".$codAlu;

                            $editable="0";
                            $nota="sin nota";
                            $fecha = "";
                            $hora = "";
                            $pdf = "#";
                            $presentado = "0";
                            $fechalimite = fechaPres($row1->fecha,$row1->hora);
                            $fechareg = $row1->fechaReg;
                            $observacion = "";

                            if($resulPractico = mysqli_query($db,$sql)){
                                if($rowPractico = $resulPractico->fetch_object()){
                                    $editable = $rowPractico->editable;
                                    $nota = $rowPractico->nota;
                                    $fecha = empty($rowPractico->archivo)?"":$rowPractico->fecha;
                                    $pdf = empty($rowPractico->archivo)?"#":$rowPractico->archivo;
                                    $hora = empty($rowPractico->archivo)?"":substr($rowPractico->hora, 0,5);
                                    $observacion = $rowPractico->observacion;
                                    $presentado = "1";
                                }
                            }else{
                                $respuesta = array("status"=>"errorSql");
                                echo json_encode($respuesta);
                                exit();
                            }
                            
                            
                            
                            $sql = "select * from preg_cuest where cod_cuest=".$idpractico." and estado=1 order by n_preg asc";
                            
                            if($result2 = mysqli_query($db,$sql)){
                                
                                $preguntas = array();
                                while($rowpreg = $result2->fetch_object()){
                                    $pregunta = $rowpreg->pregunta;
                                    $enlace = "";
                                    $ext="";
                                    if(!empty(trim($rowpreg->imgDir))){
                                        $enlace = $rowpreg->imgDir;
                                        $array = explode('.', $enlace);
                                        $ext = end($array); 
                                    }
                                    
                                    
                                    $preguntas[] = array("pregunta"=>$pregunta,"enlace"=>$enlace,"extension"=>$ext);
                                }
                                $practicos[]=array(
                                                    "id"=>$idpractico,
                                                    "codmat"=>$codmat,
                                                    "descripcion"=>$descripcion,
                                                    "editable"=>$editable,
                                                    "presentado"=>$presentado,
                                                    "nota"=>$nota,
                                                    "fecha"=>$fecha,
                                                    "hora"=>$hora,
                                                    "fechareg"=>formatoFecha($fechareg),
                                                    "pdf"=>$pdf,
                                                    "fechalimite"=>$fechalimite,
                                                    "preguntas"=>$preguntas,
                                                    "observacion"=>$observacion,
                                                    "fechaPresentacion"=>formatoFecha($fecha.' '.$hora)
                                                    );
                                
                            }else{
                                $resp = array("status"=>"errorSql");
                                echo $resp;
                                exit();
                            }
                            
                            $cont++; 
                        }
                        $img = "";
                        switch ($row->cod_mat) {
                            case 'P1': $img = "images/lenguaje.svg"; break;
                                case 'P2': $img = "images/mateticas.svg"; break;
                                case 'P3': $img = "images/ciencias-naturales.svg"; break;
                                case 'P4': $img = "images/ciencias-sociales.svg"; break;
                                case 'P5': $img = "images/natacion.svg"; break;
                                case 'P6': $img = "images/valores.svg"; break;
                                case 'P7': $img = "images/ingles.svg"; break;
                                case 'P9': $img = "images/musica.svg"; break;
                                case 'P10': $img = "images/artes-plasticas.svg"; break;
                                case 'P11': $img = "images/educacion-fisica.svg"; break;
                                case 'P14': $img = "images/guarani.svg"; break;
                                case 'P15': $img = "images/computacion.svg"; break;
                                case 'P16': $img = "images/tecnicas-estudio.svg"; break;
                                case 'P17': $img = "images/ortografia.svg"; break;
                                case 'S1': $img = "images/mateticas.svg"; break;
                                case 'S2': $img = "images/lenguaje.svg"; break;
                                case 'S3': $img = "images/filosofia.svg"; break;
                                case 'S4': $img = "images/psicologia.svg"; break;
                                case 'S5': $img = "images/ciencias-naturales.svg"; break;
                                case 'S6': $img = "images/fisica.svg"; break;
                                case 'S7': $img = "images/quimica.svg"; break;
                                case 'S8': $img = "images/ciencias-sociales.svg"; break;
                                case 'S9': $img = "images/computacion.svg"; break;
                                case 'S10': $img = "images/biologia.svg"; break;
                                case 'S11': $img = "images/civica.svg"; break;
                                case 'S12': $img = "images/ingles.svg"; break;
                                case 'S13': $img = "images/educacion-fisica.svg"; break;
                                case 'S14': $img = "images/musica.svg"; break;
                                case 'S15': $img = "images/artes-plasticas.svg"; break;
                                case 'S16': $img = "images/valores.svg"; break;
                                case 'S17': $img = "images/computacion.svg"; break;
                                case 'S18': $img = "images/guarani.svg"; break;
                                case 'S19': $img = "images/natacion.svg"; break;
                                case 'S20': $img = "images/geografica.svg"; break;
                                case 'S21': $img = "images/historia.svg"; break;
                                case 'S22': $img = "images/ortografia.svg"; break;
                                case 'I1': $img = "images/valores.svg"; break;
                                case 'I2': $img = "images/geografica.svg"; break;
                                case 'I3': $img = "images/ciencias-naturales.svg"; break;
                                case 'I4': $img = "images/filosofia.svg"; break;
                                default:
                                  # code...
                                break;
                        }
                        $materias[] = array(
                            "codmat"=>$row->cod_mat,
                            "nombre"=>utf8_encode($row->descri),
                            "practicos"=>$cont,
                            "img" => $img
                            );
                    }else{
                        $resp = array("status"=>"errorSql");
                        echo $resp;
                        exit();
                    }
                }

                if (count($materias)>0) {
                  $respuesta = array(
                            "status" => "ok",
                            "materias" => $materias,
                            "practicos" => $practicos
                            );
                  echo json_encode($respuesta);
                }else{
                  $respuesta = array("status"=>"noMaterias");
                            echo json_encode($respuesta);
                }                   
             }else{
                $respuesta = array("status"=>"noPermitido");
                echo json_encode($respuesta);
             }
              break;
              case 'sp'://cuando el estudiante sube su practico
                    if (isset($_POST['idpractico'])&&!empty($_POST['idpractico'])&&
                        isset($_POST['tipo'])&&!empty($_POST['tipo'])) {
                        $codpractico = $_POST['idpractico'];
                        $codalu = $_SESSION['app_user_id'];
                        $tipo = trim($_POST['tipo']);// 1 es ARCHIVO 2 es ENLACE
                        require 'includes/config.php';
                        $db = mysqli_connect($servername, $username, $password, $database) 
                                or die('Error al intentar conectar con el servidor.');
                        $acento = mysqli_query($db,"SET NAMES 'utf8'");
                        $fechaActual = date("Y-m-d");
                        $horaActual = date("H:i:s");
                        $fechaActual22 = date("Y-m-d");
                        $horaActual22 = date("H:i:s");
                        
                        
                        if(empty($codalu)){
                            header("Location: usuario.php");
                            exit();
                        }
                        
                        if ($tipo=='1'){
                            if (!file_exists($_FILES['file']['tmp_name'])||
                                            !is_uploaded_file($_FILES['file']['tmp_name'])) {
                                            echo "noFile";
                                            exit();
                            }
                            if($_FILES['file']['size']>10485760) {
                                echo "errorSize";
                                exit();
                            }
                        }
                        //Validando la fecha limite de presentación
                        $sql = "select * 
                                from cuestionarios 
                                where cod_cuest=".$codpractico." and estado = 1";
                        if (!$result = mysqli_query($db,$sql)) {
                            echo "errorSql";
                            exit();
                        }
                        if ($row = $result->fetch_object()) {
                            $fecha = $row->fecha;
                            $hora = $row->hora;
                            $fhactual = strtotime(date("Y-m-d H:i:s"));
                            $limite = strtotime($fecha.' '.$hora);
                            $limit = $row->limite;
                            if($limit == 0){
                                if ($fhactual>$limite) {
                                    echo "errorLimite";
                                    exit();
                                }
                            }
                            
                        }else{

                            echo "noPractico";
                            exit();
                        }
                        //Verificando que el estudiante ha presentado el práctico
                        $sql = "select * 
                                from practico_alumno 
                                where codpractico=".$codpractico." and codalumno=".$codalu." and estado > 0";
      
                        if (!$result = mysqli_query($db,$sql)) {

                            echo "errorSql";
                            exit();
                        }
                        if ($rowExiste = $result->fetch_object()) {//El alumno ya presentó el práctico
                            $editable = $rowExiste->editable;
                            $estado = $rowExiste->estado;
                            $file = $rowExiste->archivo;
                            $idpres = $rowExiste->id;
                            if($estado == '1'){

                                if ($editable=='1') {
                                    if ($tipo == '1') {
                                        if (isset($_FILES['file'])&&!empty($_FILES['file'])) {

                                                $ext=explode(".",$_FILES['file']["name"]);
                                                $nombreFile = $codalu.'-'.$codpractico.'-'.$fechaActual.'-'.generateFileName();
                                            //  echo "si hay";
                                                if ($_FILES['file']['type']=="application/pdf") {
                                                    $filename=$nombreFile.'.'.end($ext);

                                                    move_uploaded_file($_FILES['file']["tmp_name"],"practicos/".$filename);
                                                    $sql = "update practico_alumno set archivo='practicos/".$filename."', fecha='".$fechaActual22."',hora='".$horaActual22."'
                                                            where id=".$idpres;

                                                    if ($result2 = mysqli_query($db,$sql)) {

                                                        if(esFile($file))unlink($file);

                                                        echo "ok";
                                                        exit();
                                                    }else{
     
                                                        echo "errorSQL";
                                                        exit();
                                                    }
                                                }else{
     
                                                    echo "errorFile";
                                                    exit();
                                                }
                                            
                                        }else{

                                            echo "errorFile";
                                            exit();
                                        }
                                    }
                                    
                                    if ($tipo == '2') {
                                        
                                            if (isset($_POST['enlace'])&&!empty($_POST['enlace'])) {
                                                $enlace = $_POST['enlace'];
                                                if (!validarEnlace($enlace)) {
                                                    echo "errorEnlace";
                                                    exit();
                                                }
                                                $sql = "update practico_alumno set archivo='".$enlace."', fecha='".$fechaActual22."',hora='".$horaActual22."'
                                                        where id=".$idpres;
                                                    if ($result2 = mysqli_query($db,$sql)) {

                                                        if(esFile($file))unlink($file);
                                                        echo "ok";
                                                        exit();
                                                    }else{
                                                        echo "errorSQL";
                                                        exit();
                                                    }
                                            }else{
                                                echo "errorParam";
                                                exit();
                                            }
         
                                    }
                                }else{
                                    echo "noEdit";
                                    exit();
                                }
                            }
                            if($estado == '2'){
                                if ($tipo == '1') {
                                    if (isset($_FILES['file'])&&!empty($_FILES['file'])) {
                                            $ext=explode(".",$_FILES['file']["name"]);
                                            $nombreFile = $codalu.'-'.$codpractico.'-'.$fechaActual.'-'.generateFileName();
                                        //  echo "si hay";
                                            if ($_FILES['file']['type']=="application/pdf") {
                                                $filename=$nombreFile.'.'.end($ext);
                                                move_uploaded_file($_FILES['file']["tmp_name"],"practicos/".$filename);
                                                $sql = "update practico_alumno set archivo='practicos/".$filename."', fecha='".$fechaActual22."',hora='".$horaActual22."', estado = 1 
                                                        where id=".$idpres;
                                                if ($result2 = mysqli_query($db,$sql)) {
                                                    if(esFile($file))unlink($file);
                                                    echo "ok";
                                                    exit();
                                                }else{
                                                    echo "errorSQL";
                                                    exit();
                                                }
                                            }else{
                                                echo "errorFile";
                                                exit();
                                            }                
                                    }else{
                                        echo "errorFile";
                                        exit();
                                    }
                                }
                                if ($tipo == '2') {
                                    if (isset($_POST['enlace'])&&!empty($_POST['enlace'])) {
                                        $enlace = $_POST['enlace'];
                                        if (!validarEnlace($enlace)) {
                                            echo "errorEnlace";
                                            exit();
                                        }
                                        $sql = "update practico_alumno set archivo='".$enlace."', fecha='".$fechaActual22."',hora='".$horaActual22."',estado = 1 
                                                where id=".$idpres;
                                        if ($result2 = mysqli_query($db,$sql)) {
                                            if(esFile($file))unlink($file);
                                                echo "ok";
                                                exit();
                                        }else{
                                            echo "errorSQL";
                                            exit();
                                        }
                                    }else{
                                        echo "errorParam";
                                        exit();
                                    }
         
                                }
                            }
                        }
                        if ($tipo == '1') {
                            if (isset($_FILES['file'])&&!empty($_FILES['file'])) {
                                if (!file_exists($_FILES['file']['tmp_name'])||
                                    !is_uploaded_file($_FILES['file']['tmp_name'])) {
                                    
                                }else{
                                    $ext=explode(".",$_FILES['file']["name"]);
                                    $nombreFile = $codalu.'-'.$codpractico.'-'.$fecha.'-'.generateFileName();
                                //  echo "si hay";
                                    if ($_FILES['file']['type']=="application/pdf") {
                                        $filename=$nombreFile.'.'. end($ext);
                                        move_uploaded_file($_FILES['file']["tmp_name"],"practicos/".$filename);
                                        $sql = "insert into practico_alumno(codpractico,codalumno,archivo,fecha,hora,estado,nota,editable)
                                                    values(".$codpractico.",".$codalu.",'practicos/".$filename."','".$fechaActual22."',
                                                    '".$horaActual22."',1,'',1)";
                                        if ($result2 = mysqli_query($db,$sql)) {
                                            echo "ok";
                                            exit();
                                        }else{
                                            echo "errorSQL";
                                            exit();
                                        }
                                    }else{
                                        echo "errorFile";
                                        exit();
                                    }
                                }
                            }else{
                                echo "errorFile";
                                exit();
                            }
                        }
                        if ($tipo == '2') {
                            if (!isset($_POST['enlace'])&&empty($_POST['enlace'])) {
                                echo "errorParam";
                                exit();
                            }
                            $enlace = $_POST['enlace'];
                            if (!validarEnlace($enlace)) {
                                 echo "errorEnlace";
                                 exit();
                            }
                            $sql = "insert into practico_alumno(codpractico,codalumno,archivo,fecha,hora,estado,nota,editable)
                                                    values(".$codpractico.",".$codalu.",'".$enlace."','".$fechaActual22."',
                                                    '".$horaActual22."',1,'',1)";
                                        if ($result2 = mysqli_query($db,$sql)) {
                                            echo "ok";
                                            exit();
                                        }else{
                                            echo "errorSQL";
                                            exit();
                                        }
                        }
                        
                    }else{
                        echo "errorParam";
                    }
                break;
                /*case 'sp'://cuando el estudiante sube su practico
                    if (isset($_POST['idpractico'])&&!empty($_POST['idpractico'])) {
                        $codpractico = $_POST['idpractico'];
                        $codalu = $_SESSION['app_user_id'];
                        if(empty($codalu)){
                            $respuesta = array("status"=>"eSession");
                            echo json_encode($respuesta);
                            exit();
                        }
                        require 'includes/config.php';
                        $db = mysqli_connect($servername, $username, $password, $database) 
                                or die('Error al intentar conectar con el servidor.');

                        $fecha = date("Y-m-d");
                        $hora = date("H:i:s");
                        //Validando la fecha limite de presentación
                        $sql = "select * 
                                from cuestionarios 
                                where cod_cuest=".$codpractico." and estado = 1";
                        if (!$result = mysqli_query($db,$sql)) {
                            echo "errorSql";
                            exit();
                        }
                        if ($row = $result->fetch_object()) {
                            $fecha = $row->fecha;
                            $horaPresentacion = $row->hora;
                            $fhactual = strtotime(date("Y-m-d H:i:s"));
                            $limite = strtotime($fecha.' '.$horaPresentacion);
                            /*if ($fhactual>$limite) {
                                echo "errorLimite";
                                exit();
                            }
                        }else{
                            echo "noPractico";
                            exit();
                        }
                        //Verificando que el estudiante ha presentado el práctico
                        $sql = "select * 
                                from practico_alumno 
                                where codpractico=".$codpractico." and codalumno=".$codalu." and estado = 1";
                        if (!$result = mysqli_query($db,$sql)) {
                            echo "errorSql";
                            exit();
                        }
                        if ($rowExiste = $result->fetch_object()) {//El alumno ya presentó el práctico
                            $editable = $rowExiste->editable;
                            $file = $rowExiste->archivo;
                            $idpres = $rowExiste->id;

                            if ($editable==1) {
                                if (isset($_FILES['file'])&&!empty($_FILES['file'])) {

                                    if (!file_exists($_FILES['file']['tmp_name'])||
                                        !is_uploaded_file($_FILES['file']['tmp_name'])) {
                                    
                                    }else{

                                        $ext=explode(".",$_FILES['file']["name"]);
                                        $nombreFile = $codalu.'-'.$codpractico.'-'.$fecha.'-'.generateFileName();
                                    //  echo "si hay";
                                        if ($_FILES['file']['type']=="application/pdf") {
                                            $filename=$nombreFile.'.'. end($ext);

                                            move_uploaded_file($_FILES['file']["tmp_name"],"practicos/".$filename);
                                            $sql = "update practico_alumno set archivo='practicos/".$filename."', fecha='".$fecha."',hora='".$hora."'
                                                    where id=".$idpres;
                                                        //echo $sql;
                                                        //exit();
                                            if ($result2 = mysqli_query($db,$sql)) {

                                                unlink($file);
                                                echo "ok";
                                                exit();
                                            }else{
                                                echo "errorSQL";
                                                exit();
                                            }
                                        }else{
                                            echo "errorFile";
                                            exit();
                                        }
                                    }
                                }else{
                                    echo "errorFile";
                                    exit();
                                }
                            }else{
                                echo "noEdit";
                                exit();
                            }
                        }

                        if (isset($_FILES['file'])&&!empty($_FILES['file'])) {
                            if (!file_exists($_FILES['file']['tmp_name'])||
                                !is_uploaded_file($_FILES['file']['tmp_name'])) {
                            
                            }else{
                                $ext=explode(".",$_FILES['file']["name"]);
                                $nombreFile = $codalu.'-'.$codpractico.'-'.$fecha.'-'.strtotime($hora);
                            //  echo "si hay";
                                if ($_FILES['file']['type']=="application/pdf") {
                                    $filename=$nombreFile.'.'. end($ext);
                                    move_uploaded_file($_FILES['file']["tmp_name"],"practicos/".$filename);
                                    $sql = "insert into practico_alumno(codpractico,codalumno,archivo,fecha,hora,estado,nota,editable)
                                                values(".$codpractico.",".$codalu.",'practicos/".$filename."','".$fecha."',
                                                '".$hora."',1,'',1)";
                                                //echo $sql;
                                                //exit();
                                    if ($result2 = mysqli_query($db,$sql)) {
                                        echo "ok";
                                        exit();
                                    }else{
                                        echo "errorSQL";
                                        exit();
                                    }
                                }else{
                                    echo "errorFile";
                                    exit();
                                }
                            }
                        }else{
                            echo "errorFile";
                        }


                    }else{
                        echo "errorParam";
                    }
                break;*/
                case 'pracpres'://Retorna la lista de practicos presentados para ser revisados por el profesor

                    if (isset($_POST['codcur'])&&!empty($_POST['codcur'])&&
                        isset($_POST['codpar'])&&!empty($_POST['codpar'])&&
                        isset($_POST['codmat'])&&!empty($_POST['codmat'])&&
                        isset($_POST['codpractico'])&&!empty($_POST['codpractico'])) {
                        
                        $codprof = $_SESSION['app_user_id'];
                        if(!cliente_activo()){
                            echo "<script>location.href = 'docentes.php'</script>";
                            exit();
                        }
                        $trimestre = $_SESSION['app_user_bimestre'];
                        $gestion = date("Y");

                        $codcur = $_POST['codcur'];
                        $codpar = $_POST['codpar'];
                        $codmat = $_POST['codmat'];
                        $codpractico = $_POST['codpractico'];

                        require 'includes/config.php';
                        $db = mysqli_connect($servername, $username, $password, $database) 
                                or die('Error al intentar conectar con el servidor.');
                        //$acento = mysqli_query($db,"SET NAMES 'utf8'");
                        //Obteniendo la lista de alumnos
                        $sql = "select codigo,concat(paterno,' ',materno,' ',nombres) as nombre 
                                from alumno
                                where cod_cur=".$codcur." and cod_par=".$codpar." and estado=1 order by nombre";

                        $listaAlumnos = array(); //Contiene la lista de alumnos del curso
                        $listaPractPresentados = array();
                        if ($sqlAlum = mysqli_query($db,$sql)) {
                            while ($rowAlumno = $sqlAlum->fetch_object()) {
                                $listaAlumnos[] = array(
                                                    "codalu"=>$rowAlumno->codigo,
                                                    "nombre"=>utf8_encode($rowAlumno->nombre)
                                                        );
                            }
                            if (count($listaAlumnos)>0) {//Hay alumnos registrados en el curso
                                //Obteniendo la lista de estudiantes que presentaron el practico
                                $sql = "select pa.id,pa.codalumno,pa.archivo,pa.nota,pa.fecha,pa.hora,pa.editable,pa.estado, pa.observacion,pa.fechaCalif  
                                        from practico_alumno pa  inner join cuestionarios c on 
                                        c.cod_cuest = pa.codpractico and c.estado=1 and pa.codpractico=".$codpractico." and pa.estado>0";
                                

                                if ($sqlPrac = mysqli_query($db,$sql)) {
                                    while ($rowPrac = $sqlPrac->fetch_object()) {
                                        
                                        $listaPractPresentados[] = array(
                                                                        "id"=>$rowPrac->id,
                                                                        "codalu"=>$rowPrac->codalumno,
                                                                        "pdf"=>$rowPrac->archivo,
                                                                        "editable"=>$rowPrac->editable,
                                                                        "estado"=>$rowPrac->estado,
                                                                        "fecha"=>$rowPrac->fecha,
                                                                        "hora"=>$rowPrac->hora,
                                                                        "nota"=>$rowPrac->nota,
                                                                        "observacion"=>$rowPrac->observacion,
                                                                        "fechacalif"=>$rowPrac->fechaCalif
                                                                        );
                                    }
                                    
                                    
                                    for ($i=0; $i < count($listaAlumnos); $i++) { 
                                        $reg = presentoPdf($listaAlumnos[$i]['codalu'],$listaPractPresentados);
                                        $nota1 = "";
                                        $fechaCalif = $reg['fechacalif'];
                                        if( strlen($fechaCalif)>0){
                                            $nota1 = $reg['nota'];
                                        }
                                        $lista[] = array(
                                                        "id"=>$reg['id'],
                                                        "codalu"=>$listaAlumnos[$i]['codalu'],
                                                        "nombre"=>$listaAlumnos[$i]['nombre'],
                                                        "pdf"=>utf8_encode($reg['pdf']),
                                                        "hora"=>$reg['hora'],
                                                        "fecha"=>$reg['fecha'],
                                                        "editable"=>$reg['editable'],
                                                        "estado"=>$reg['estado'],
                                                        "nota"=>$nota1,
                                                        "observacion"=>utf8_encode($reg['observacion']),
                                                        "fechaCalif"=>$reg['fechacalif']
                                                        );
                                    }

                                    
                                    $resp = array("status"=>"ok","lista"=>$lista);
                                    echo json_encode($resp);
                                }else{
                                    $resp = array("status"=>"errorSql1");
                                    echo json_encode($resp);
                                }
                            }else{
                                $resp = array("status"=>"noAlumnos");
                                echo json_encode($resp);
                            }
                        }else{
                            $resp = array("status"=>"errorSql2");
                            echo json_encode($resp);
                        }

                    }else{
                        $resp = array("status"=>"errorParam");
                        echo json_encode($resp);
                    }               
                    break;
                    case 'gpp'://Obtener la lista de practicos de un profesor
                        $codprof = $_SESSION['app_user_id'];
                        $trimestre = $_SESSION['app_user_bimestre'];
                        $gestion = date("Y");
                        
                        require 'includes/config.php';
                        $db = mysqli_connect($servername, $username, $password, $database) 
                                or die('Error al intentar conectar con el servidor.');
                        $acento = mysqli_query($db,"SET NAMES 'utf8'");
                        //Obteniendo la lista de practicos
                        $sql = "select c.cod_cuest,c.cod_cur,c.cod_par,c.cod_mat,c.descrip,c.fecha,c.hora, c.nota
                                from prof_cur_mat pcm inner join cuestionarios c on 
                                pcm.prof='".$codprof."' and pcm.codcur=c.cod_cur and pcm.codpar=c.cod_par and pcm.codmat=c.cod_mat 
                                and pcm.estado='activo' and pcm.gestion=".$gestion." and c.bimestre=".$trimestre." and c.estado=1";

                        if($sqlprac = mysqli_query($db,$sql)){
                            $lista = array();
                            while ($rowPrac = $sqlprac->fetch_object()) {
                                $lista[]=array(
                                                "id"=>$rowPrac->cod_cuest,
                                                "codcur"=>$rowPrac->cod_cur,
                                                "codpar"=>$rowPrac->cod_par,
                                                "codmat"=>$rowPrac->cod_mat,
                                                "fecha"=>$rowPrac->fecha,
                                                "hora"=>$rowPrac->hora,
                                                "fechalimite"=>fechaPres($rowPrac->fecha,$rowPrac->hora),
                                                "descripcion"=>$rowPrac->descrip,
                                                "nota"=>$rowPrac->nota
                                                );
                            }
                            if (count($lista)>0) {
                                $respuesta = array("status"=>"ok","lista"=>$lista);
                                echo json_encode($respuesta);
                            }else{
                                $respuesta = array("status"=>"noPracticos");
                                echo json_encode($respuesta);
                            }
                        }else{
                            $respuesta = array("status"=>"errorSql");
                            echo json_encode($respuesta);
                        }
                    break;
                    case 'gppadjunto'://Obtener la lista de practicos de un profesor con archivos adjuntos
                        $codprof = $_SESSION['app_user_id'];
                        $trimestre = $_SESSION['app_user_bimestre'];
                        $gestion = date("Y");
                        require_once'tipo_indicador.php';
                        require 'includes/config.php';
                        $db = mysqli_connect($servername, $username, $password, $database) 
                                or die('Error al intentar conectar con el servidor.');
                        $acento = mysqli_query($db,"SET NAMES 'utf8'");
                        //Obteniendo la lista de practicos
                        $sql = "select c.cod_cuest,c.cod_cur,c.cod_par,c.cod_mat,c.descrip,c.fecha,c.hora,c.nota,c.limite 
                                from prof_cur_mat pcm inner join cuestionarios c on 
                                pcm.prof='".$codprof."' and pcm.codcur=c.cod_cur and pcm.codpar=c.cod_par and pcm.codmat=c.cod_mat 
                                and pcm.estado='activo' and pcm.gestion=".$gestion." and c.bimestre=".$trimestre." and c.estado=1 order by c.cod_cuest asc";
                        
                        if($sqlprac = mysqli_query($db,$sql)){
                            $lista = array();
                            $preguntas = array();
                            while ($rowPrac = $sqlprac->fetch_object()) {
                                $sql = "SELECT * FROM indicador WHERE codigo = ".$rowPrac->cod_cuest." AND tipo = ".PRACTICO_DIGITAL." AND estado = 1";
                                $result_inidcador = mysqli_query($db,$sql);
                                $indicador = "";
                                if($row_indicador = $result_inidcador->fetch_object()){
                                    $indicador = $row_indicador->indicador;
                                }
                                $lista[]=array(
                                                "id"=>$rowPrac->cod_cuest,
                                                "codcur"=>$rowPrac->cod_cur,
                                                "codpar"=>$rowPrac->cod_par,
                                                "codmat"=>$rowPrac->cod_mat,
                                                "fecha"=>$rowPrac->fecha,
                                                "hora"=>substr($rowPrac->hora, 0,5),
                                                "fechalimite"=>fechaPres($rowPrac->fecha,$rowPrac->hora),
                                                "descripcion"=>$rowPrac->descrip,
                                                "nota"=>$rowPrac->nota,
                                                "limite"=>$rowPrac->limite,
                                                "indicador" => $indicador
                                                
                                                );
                                //Obteniendo las preguntas del practico
                                $sql = "select pregunta,imgDir  
                                        from preg_cuest 
                                        where cod_cuest=".$rowPrac->cod_cuest." and estado = 1";
                                if ($resluPreg = mysqli_query($db,$sql)) {
                                    while ($rowpreg = $resluPreg->fetch_object()) {
                                        $estado = '1';
                                        if (empty($rowpreg->imgDir)) {
                                           $estado = '0';
                                        }
                                        $preguntas[] = array(
                                                            "codpractico"=>$rowPrac->cod_cuest,
                                                            "estadoarchivo"=>$estado,
                                                            "pregunta"=>$rowpreg->pregunta,
                                                            "archivo"=>$rowpreg->imgDir
                                                            );
                                    }
                                }else{
                                    $respuesta = array("status"=>"errorSQL1");
                                    echo json_encode($respuesta);
                                }
                            }
                            if (count($lista)>0) {
                                $respuesta = array("status"=>"ok","practicos"=>$lista,"preguntas"=>$preguntas);
                                echo json_encode($respuesta);
                            }else{
                                $respuesta = array("status"=>"noPracticos");
                                echo json_encode($respuesta);
                            }
                        }else{
                            $respuesta = array("status"=>"errorSql");
                            echo json_encode($respuesta);
                        }
                    break;
                    case 'califprac': //el preofesor asigna una nota al practico de un estudiante
                        if (isset($_POST['id'])&&!empty($_POST['id'])&&
                            isset($_POST['nota'])&&!empty($_POST['nota'])&&
                            isset($_POST['observacion'])) {
                            
                            $codprof = $_SESSION['app_user_id'];
                            $codpresentacion = $_POST['id'];
                            $nota = $_POST['nota'];
                            $observacion = $_POST['observacion'];
                            $fechaCalif = date("Y-m-d H:i:s");

                            require 'includes/config.php';
                            $db = mysqli_connect($servername, $username, $password, $database) 
                                or die('Error al intentar conectar con el servidor.');
                            //Validando que el profesor pueda asignar la nota
                            $sql = "select pa.id 
                                    from practico_alumno pa inner join cuestionarios c on 
                                    pa.id=".$codpresentacion." and pa.codpractico=c.cod_cuest and pa.estado=1 inner join 
                                    prof_cur_mat pcm on c.cod_cur=pcm.codcur and c.cod_par=pcm.codpar and 
                                    c.cod_mat = pcm.codmat and pcm.estado='activo' and pcm.prof='".$codprof."'";
                            
                            if ($result = mysqli_query($db,$sql)) {
                                if ($row1 = $result->fetch_object()) {
                                    if($nota>=0 && $nota<=100){
                                        $sql = "update practico_alumno set nota=".$nota.",editable = 0,observacion='".$observacion."',fechaCalif = '".$fechaCalif."',codprof = '".$codprof."' where id=".$codpresentacion;
                                        if ($result1 = mysqli_query($db,$sql)) {
                                            echo "ok";
                                        }else{
                                            echo "errorSql";
                                        }
                                    }else{
                                        echo "errorNota";
                                    }
                                    
                                }else{
                                    echo "noPermitido";
                                }
                            }else{
                                echo "errorSql";
                            }

                        }else{
                            echo "errorParam";
                        }
                        # code...
                        break;
                case 'califpracnopres':
                    $codprof = $_SESSION['app_user_id'];

                    if(empty($codprof)){
                        echo "eSession";
                        exit();
                    }

                    $codpractico = isset($_POST['id'])?$_POST['id']:"";
                    $codalu = isset($_POST['codalu'])?$_POST['codalu']:"";
                    $nota = isset($_POST['nota'])?$_POST['nota']:"";
                    $observacion = isset($_POST['observacion'])?$_POST['observacion']:"";

                    $fechaCalif = date('Y-m-d H:i:s');

                    if(empty($codpractico)||empty($codalu)||empty($nota)){
                        echo "errorParam";
                        exit();
                    }
                    require 'includes/config.php';
                    $db = mysqli_connect($servername, $username, $password, $database) 
                    or die('Error al intentar conectar con el servidor.');

                    $acento = mysqli_query($db,"SET NAMES 'utf8'");

                    $sql = "SELECT * FROM practico_alumno WHERE codpractico = ".$codpractico." AND codalumno = ".$codalu." AND estado = 2";

                    $result = mysqli_query($db,$sql);

                    if($fila = $result->fetch_object()){
                        $id = $fila->id;
                        $sql = "UPDATE practico_alumno SET nota = ".$nota.", observacion = '".$observacion."', fechaCalif = '".$fechaCalif."', codprof = '".$codprof."' WHERE id = ".$id;
                        if($result = mysqli_query($db,$sql)){
                            echo "ok";
                        }else{
                            echo "errorSql1";
                            exit();
                        }

                    }else{
                        $sql = "INSERT INTO practico_alumno(codpractico,codalumno,estado,nota,observacion,fechaCalif,codprof) 
                                VALUES(".$codpractico.",".$codalu.",2,".$nota.",'".$observacion."','".$fechaCalif."','".$codprof."')";
                        if($result = mysqli_query($db,$sql)){
                            echo "ok";
                        }else{
                            echo "errorSql2";
                            exit();
                        }

                    }


                    break;
                case 'hpa'://Habilitar la edicion de un práctico web del alumno
                    require 'includes/config.php';
                    $db = mysqli_connect($servername, $username, $password, $database) 
                    or die('Error al intentar conectar con el servidor.');

                    if (!isset($_POST['idpracticoPres'])&&empty($_POST['idpracticoPres'])) {
                        echo "errorParam";
                        exit();
                    }

                    $idpracticoPres = $_POST['idpracticoPres'];
                    $codprof = $_SESSION['app_user_id'];
                    $gestion = date("Y");

                    //Validando que el profesor pueda habilitar la edicion
                    $sql = "select * 
                            from practico_alumno pwa inner join cuestionarios pw on 
                            pwa.codpractico = pw.cod_cuest and pwa.estado > 0 and pw.estado = 1 
                            inner join prof_cur_mat pcm on pw.cod_cur = pcm.codcur and pw.cod_par = pcm.codpar and 
                            pcm.prof = '".$codprof."' and pw.cod_mat = pcm.codmat and pcm.estado = 'activo' and pcm.gestion=".$gestion." and pwa.id=".$idpracticoPres;

                    if (!$result = mysqli_query($db,$sql)) {
                        echo "errorSQL";
                        exit();
                    }
                    if ($row = $result->fetch_object()) {
                        //Habilitar la edicion
                        $sql = "update practico_alumno set editable = 1 where id = ".$idpracticoPres;
                        if (!$result = mysqli_query($db,$sql)) {
                            echo "errorSQL";
                            exit();
                        }
                        echo "ok";
                        exit();
                    }else{
                        echo "noPermitido";
                        exit();
                    }
                    
                    break;
                case 'dpa'://Deshabilitar la edicion de un práctico web del alumno
                    require 'includes/config.php';
                    $db = mysqli_connect($servername, $username, $password, $database) 
                    or die('Error al intentar conectar con el servidor.');

                    if (!isset($_POST['idpracticoPres'])&&empty($_POST['idpracticoPres'])) {
                        echo "errorParam";
                        exit();
                    }

                    $idpracticoPres = $_POST['idpracticoPres'];
                    $codprof = $_SESSION['app_user_id'];
                    $gestion = date("Y");

                    //Validando que el profesor pueda deshabilitar la edicion
                    $sql = "select * 
                            from practico_alumno pwa inner join cuestionarios pw on 
                            pwa.codpractico = pw.cod_cuest and pwa.estado > 0 and pw.estado = 1 
                            inner join prof_cur_mat pcm on pw.cod_cur = pcm.codcur and pw.cod_par = pcm.codpar and 
                            pw.cod_mat = pcm.codmat and pcm.estado = 'activo' and pcm.gestion=".$gestion." and 
                            pcm.prof='".$codprof."' and pwa.id=".$idpracticoPres;

                    if (!$result = mysqli_query($db,$sql)) {
                        echo "errorSQL";
                        exit();
                    }
                    if ($row = $result->fetch_object()) {
                        //Habilitar la edicion
                        $sql = "update practico_alumno set editable = 0 where id = ".$idpracticoPres;
                        if (!$result = mysqli_query($db,$sql)) {
                            echo "errorSQL";
                            exit();
                        }
                        echo "ok";
                        exit();
                    }else{
                        echo "noPermitido";
                        exit();
                    }
                    
                    break;
                        case 'savepractdocument'://Guardar practicos con archivos adjuntos por parte del profesor
                        if (isset($_POST['codcur'])&&!empty($_POST['codcur'])&&
                            isset($_POST['codpar'])&&!empty($_POST['codpar'])&&
                            isset($_POST['codmat'])&&!empty($_POST['codmat'])&&
                            isset($_POST['fecha'])&&!empty($_POST['fecha'])&&
                            isset($_POST['hora'])&&!empty($_POST['hora'])&&
                            isset($_POST['descripcion'])&&!empty($_POST['descripcion'])&&
                            isset($_POST['npreg'])&&!empty($_POST['npreg'])&&
                            isset($_POST['codpractico'])&&isset($_POST['nota'])&&
                            !empty($_POST['nota'])) {
                            
                            $codcur = $_POST['codcur'];
                            $codpar = $_POST['codpar'];
                            $codmat = $_POST['codmat'];
                            $codpractico = $_POST['codpractico'];
                            $descripcion = $_POST['descripcion'];
                            $nota = $_POST['nota'];
                            $npreg = $_POST['npreg'];//Numero de preguntas que tiene el practico
                            $gestion = date("Y");
                            $trimestre = $_SESSION['app_user_bimestre'];
                            $codprof = $_SESSION['app_user_id'];
                            $fecha = $_POST['fecha'];
                            $hora = $_POST['hora'];
                            $fechaReg = date("Y-m-d H:i:s");
                            $arrayPreg = array();
                            $arraySrc = array();
                            
                            require 'includes/config.php';
                            $db = mysqli_connect($servername, $username, $password, $database) 
                                or die('Error al intentar conectar con el servidor.');
                            
                            $acento = mysqli_query($db,"SET NAMES 'utf8'");
                            if ($npreg>0) {
                                for ($i=0; $i < $npreg; $i++) { 
                                    if (isset($_POST['preg'.($i+1)])&&!empty($_POST['preg'.($i+1)])&&
                                        isset($_POST['src'.($i+1)])) {
                                        $arrayPreg[]=$_POST['preg'.($i+1)];
                                        $arraySrc[]=$_POST['src'.($i+1)];
                                    }else{
                                        echo "errorPreguntas";
                                        exit();
                                    }
                                }

                                if ($npreg!=count($arrayPreg)&&$npreg!=count($arraySrc)) {//La cantidad de preguntas mediante post debe ser igual
                                    echo "errorPreguntas";      //al numero de preguntas dadas en $npreg
                                    exit();
                                }
                                //echo $npreg.'  :  '.count($arrayPreg);

                                if(empty($codpractico)){
                                    $sql = "select insertpracticoadj(".$trimestre.",".$gestion.",".$codcur.",
                                        ".$codpar.",'".$codmat."','".$descripcion."','".$codprof."','".$fecha."','".$hora."','".$fechaReg."',1,".$nota.") as id";

                                    if ($result = mysqli_query($db,$sql)) {
                                        $id = $result->fetch_object();
                                        for ($i=0; $i < count($arrayPreg); $i++) {

                                            $filename="";
                                            if (!isset($_POST['file'.($i+1)])) {
                                                if (!file_exists($_FILES['file'.($i+1)]['tmp_name'])||
                                                !is_uploaded_file($_FILES['file'.($i+1)]['tmp_name'])) {

                                                }else{
                                                
                                                    if ($_FILES['file'.($i+1)]['type']=="image/jpg"||
                                                        $_FILES['file'.($i+1)]['type']=="image/jpeg"||
                                                        $_FILES['file'.($i+1)]['type']=="image/png"||
                                                        $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.wordprocessingml.document"||
                                                        $_FILES['file'.($i+1)]['type']=="application/msword"||
                                                        $_FILES['file'.($i+1)]['type']=="application/vnd.ms-powerpoint"||
                                                        $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.presentationml.presentation"||
                                                        $_FILES['file'.($i+1)]['type']=="application/vnd.ms-excel"||
                                                        $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"||
                                                        $_FILES['file'.($i+1)]['type']=="application/pdf") {
                                                        $ext=explode(".",$_FILES["file".($i+1)]["name"]);
                                                        $nonmbreFile = $codcur.'-'.$codpar.'-'.$codmat.'-'.$fecha.'-'.strtotime($hora).generateFileName();
                                                        $filename="resources/".$nonmbreFile.'.'. end($ext);
                                                        move_uploaded_file($_FILES["file".($i+1)]["tmp_name"],$filename);
                                                    }else{
                                                        echo "errorFileType";
                                                        exit();
                                                    }
                                                }
                                            }
                                            

                                            $sql = "insert into preg_cuest(cod_cuest,n_preg,pregunta,imgDir,estado)
                                                    values(".$id->id.",".($i+1).",'".$arrayPreg[$i]."','".$filename."',1)";
                                            if(!$result1 = mysqli_query($db,$sql)){
                                                echo "errorSQL1";
                                                exit();
                                            }

                                        }
                                        echo "ok";

                                    }else{
                                        echo "errorSql2";
                                    }
                                }else{

                                    //Validando que el prcatico sea editable no tiene que haber ninguna presentación de este practico
                                    $sql = "select * 
                                            from practico_alumno 
                                            where codpractico = ".$codpractico." and estado = 1";
                                    $edit = 0;
                                    if(!$result = mysqli_query($db,$sql)){
                                        echo "errorSqlVERIFEDIT";
                                    }
                                    if ($rowPR = $result->fetch_object()) {
                                        $edit = 0;
                                    }
                                    //Validando que el practico exista y que le pertenezca al curso y materia del profesor
                                    $sql = "select * 
                                            from prof_cur_mat pcm inner join cuestionarios pw on 
                                            pcm.gestion=pw.gestion and pw.bimestre=".$trimestre." and pcm.codcur=pw.cod_cur and 
                                            pcm.codpar=pw.cod_par and pcm.codmat=pw.cod_mat and pcm.estado='activo' and pw.estado=1 and 
                                            pcm.prof='".$codprof."' and pcm.gestion=".$gestion." and pw.cod_cuest=".$codpractico;


                                    
                                    if ($resulPractico = mysqli_query($db,$sql)) {
                                        if ($row = $resulPractico->fetch_object()) {
                                            //Actualizando practico
                                            if ($edit == 1) {
                                                $sql = "update cuestionarios set fecha='".$fecha."',hora = '".$hora."',nota = ".$nota." where cod_cuest=".$codpractico." and estado = 1";
                                            }else{
                                                $sql = "update cuestionarios set descrip='".$descripcion."',fecha = '".$fecha."',hora='".$hora."',nota = ".$nota." where cod_cuest=".$codpractico." and estado = 1";
                                            }
                                            
                                            if (!$resultUP = mysqli_query($db,$sql)) {
                                                echo "errorSQL3";
                                                exit();
                                            }
                                            /*if ($edit == 0) {
                                                echo "editFecha";
                                                exit();
                                            }*/
                                        }else{
                                            echo "noPermitido";
                                            exit();
                                        }
                                    }else{
                                        echo "errorSql4";
                                        exit();
                                    }
                                    //Si hay un error en el codigo anterior el servidor detiene el proceso de guardado y ya no ejecuta las instrucciones de abajo

                                    //Obteniendo la cantidad de preguntas que tiene el practico
                                    $sql = "select count(*) as npreg from preg_cuest where cod_cuest=".$codpractico." and estado=1";
                                    if ($result2 = mysqli_query($db,$sql)) {
                                        $rowpreg = $result2->fetch_object();

                                        if ($rowpreg->npreg==0) {
                                            
                                            for ($i=0; $i < count($arrayPreg); $i++) { 
                                                $filename="";
                                                if (!isset($_POST['file'.($i+1)])) {
                                                    if (!file_exists($_FILES['file'.($i+1)]['tmp_name'])||
                                                    !is_uploaded_file($_FILES['file'.($i+1)]['tmp_name'])) {

                                                    }else{
                                                    
                                                        if ($_FILES['file'.($i+1)]['type']=="image/jpg"||
                                                            $_FILES['file'.($i+1)]['type']=="image/jpeg"||
                                                            $_FILES['file'.($i+1)]['type']=="image/png"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.wordprocessingml.document"||
                                                            $_FILES['file'.($i+1)]['type']=="application/msword"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.ms-powerpoint"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.presentationml.presentation"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.ms-excel"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"||
                                                            $_FILES['file'.($i+1)]['type']=="application/pdf") {
                                                            $ext=explode(".",$_FILES["file".($i+1)]["name"]);
                                                            $nonmbreFile = $codcur.'-'.$codpar.'-'.$codmat.'-'.$fecha.'-'.strtotime($hora).generateFileName();
                                                            $filename="resources/".$nonmbreFile.'.'. end($ext);
                                                            move_uploaded_file($_FILES["file".($i+1)]["tmp_name"],$filename);
                                                        }else{
                                                            echo "errorFileType";
                                                            exit();
                                                        }
                                                    }
                                                }
                                                $sql = "insert into preg_cuest(cod_cuest,n_preg,pregunta,imgDir,estado)
                                                    values(".$codpractico.",".($i+1).",'".$arrayPreg[$i]."','".$filename."',1)";
                                                if(!$result1 = mysqli_query($db,$sql)){
                                                  echo "errorSQL5";
                                                  exit();
                                                }
                                            }
                                            echo "ok";
                                            exit();
                                        }
                                    
                                        if ($rowpreg->npreg==$npreg) {
                                            
                                            for ($i=0; $i < count($arrayPreg); $i++) { 
                                                $filename="";
                                                if (!isset($_POST['file'.($i+1)])) {
                                                    if (!file_exists($_FILES['file'.($i+1)]['tmp_name'])||
                                                    !is_uploaded_file($_FILES['file'.($i+1)]['tmp_name'])) {

                                                    }else{
                                                    
                                                        if ($_FILES['file'.($i+1)]['type']=="image/jpg"||
                                                            $_FILES['file'.($i+1)]['type']=="image/jpeg"||
                                                            $_FILES['file'.($i+1)]['type']=="image/png"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.wordprocessingml.document"||
                                                            $_FILES['file'.($i+1)]['type']=="application/msword"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.ms-powerpoint"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.presentationml.presentation"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.ms-excel"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"||
                                                            $_FILES['file'.($i+1)]['type']=="application/pdf") {
                                                            $ext=explode(".",$_FILES["file".($i+1)]["name"]);
                                                            $nonmbreFile = $codcur.'-'.$codpar.'-'.$codmat.'-'.$fecha.'-'.strtotime($hora).generateFileName();
                                                            $filename="resources/".$nonmbreFile.'.'. end($ext);
                                                            move_uploaded_file($_FILES["file".($i+1)]["tmp_name"],$filename);
                                                        }else{
                                                            echo "errorFileType";
                                                            exit();
                                                        }
                                                    }
                                                }
                                                if (empty($filename)&&empty($arraySrc[$i])) {

                                                    $sql = "update preg_cuest set pregunta='".$arrayPreg[$i]."', imgDir=''  
                                                        where cod_cuest=".$codpractico." and n_preg=".($i+1)." and estado=1";
                                                        
                                                }
                                                if (empty($filename)) {
                                                    $sql = "update preg_cuest set pregunta='".$arrayPreg[$i]."', imgDir='".$arraySrc[$i]."'   
                                                        where cod_cuest=".$codpractico." and n_preg=".($i+1)." and estado=1";
                                                }else{
                                                    $sql = "update preg_cuest set pregunta='".$arrayPreg[$i]."',imgDir='".$filename."' 
                                                        where cod_cuest=".$codpractico." and n_preg=".($i+1)." and estado=1";

                                                }
                                                
                                                     
                                                if(!$result1 = mysqli_query($db,$sql)){
                                                    echo "errorSQL6";
                                                    exit();
                                                }
                                            }
                                            echo "ok";
                                            exit();
                                        }

                                        if ($rowpreg->npreg>$npreg) {
                      
                                            for ($i=0; $i < count($arrayPreg); $i++) { 
                                                $filename="";
                                                if (!isset($_POST['file'.($i+1)])) {
                                                    if (!file_exists($_FILES['file'.($i+1)]['tmp_name'])||
                                                    !is_uploaded_file($_FILES['file'.($i+1)]['tmp_name'])) {

                                                    }else{
                                                    
                                                        if ($_FILES['file'.($i+1)]['type']=="image/jpg"||
                                                            $_FILES['file'.($i+1)]['type']=="image/jpeg"||
                                                            $_FILES['file'.($i+1)]['type']=="image/png"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.wordprocessingml.document"||
                                                            $_FILES['file'.($i+1)]['type']=="application/msword"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.ms-powerpoint"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.presentationml.presentation"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.ms-excel"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"||
                                                            $_FILES['file'.($i+1)]['type']=="application/pdf") {
                                                            $ext=explode(".",$_FILES["file".($i+1)]["name"]);
                                                            $nonmbreFile = $codcur.'-'.$codpar.'-'.$codmat.'-'.$fecha.'-'.strtotime($hora).generateFileName();
                                                            $filename="resources/".$nonmbreFile.'.'. end($ext);
                                                            move_uploaded_file($_FILES["file".($i+1)]["tmp_name"],$filename);
                                                        }else{
                                                            echo "errorFileType";
                                                            exit();
                                                        }
                                                    }
                                                }

                                                if (empty($filename)&&empty($arraySrc[$i])) {
                                                    $sql = "update preg_cuest set pregunta='".$arrayPreg[$i]."', imgDir=''  
                                                        where cod_cuest=".$codpractico." and n_preg=".($i+1)." and estado=1";
                                                        
                                                }
                                                if (empty($filename)) {
                                                    $sql = "update preg_cuest set pregunta='".$arrayPreg[$i]."', imgDir='".$arraySrc[$i]."'   
                                                        where cod_cuest=".$codpractico." and n_preg=".($i+1)." and estado=1";
                                                }else{
                                                    $sql = "update preg_cuest set pregunta='".$arrayPreg[$i]."',imgDir='".$filename."' 
                                                        where cod_cuest=".$codpractico." and n_preg=".($i+1)." and estado=1";

                                                }
                                                
                                                if(!$result1 = mysqli_query($db,$sql)){
                                                    echo "errorSQL6";
                                                    exit();
                                                }
                                            }
                                            //Deshabilitando las preguntas que han sobrado
                                            $sql = "update preg_cuest set estado=0 where cod_cuest=".$codpractico." and n_preg>".$npreg." and estado=1";
                                            if ($resulPregfal = mysqli_query($db,$sql)) {
                                                echo "ok";
                                                exit();
                                            }else{
                                                echo "errorSQL7";
                                                exit();
                                            }
                                            
                                        }
                                        if ($rowpreg->npreg<$npreg) {
                           
                                            for ($i=0; $i < count($arrayPreg); $i++) { 

                                                if ($i<$rowpreg->npreg) {
                                                    $filename="";
                                                if (!isset($_POST['file'.($i+1)])) {
                                                    if (!file_exists($_FILES['file'.($i+1)]['tmp_name'])||
                                                    !is_uploaded_file($_FILES['file'.($i+1)]['tmp_name'])) {

                                                    }else{
                                                    
                                                        if ($_FILES['file'.($i+1)]['type']=="image/jpg"||
                                                            $_FILES['file'.($i+1)]['type']=="image/jpeg"||
                                                            $_FILES['file'.($i+1)]['type']=="image/png"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.wordprocessingml.document"||
                                                            $_FILES['file'.($i+1)]['type']=="application/msword"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.ms-powerpoint"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.presentationml.presentation"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.ms-excel"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"||
                                                            $_FILES['file'.($i+1)]['type']=="application/pdf") {
                                                            $ext=explode(".",$_FILES["file".($i+1)]["name"]);
                                                            $nonmbreFile = $codcur.'-'.$codpar.'-'.$codmat.'-'.$fecha.'-'.strtotime($hora).generateFileName();
                                                            $filename="resources/".$nonmbreFile.'.'. end($ext);
                                                            move_uploaded_file($_FILES["file".($i+1)]["tmp_name"],$filename);
                                                        }else{
                                                            echo "errorFileType";
                                                            exit();
                                                        }
                                                    }
                                                }
                                                    if (empty($filename)&&empty($arraySrc[$i])) {
                                                    $sql = "update preg_cuest set pregunta='".$arrayPreg[$i]."', imgDir=''  
                                                        where cod_cuest=".$codpractico." and n_preg=".($i+1)." and estado=1";
                                                        
                                                }
                                                if (empty($filename)) {
                                                    $sql = "update preg_cuest set pregunta='".$arrayPreg[$i]."', imgDir='".$arraySrc[$i]."'   
                                                        where cod_cuest=".$codpractico." and n_preg=".($i+1)." and estado=1";
                                                }else{
                                                    $sql = "update preg_cuest set pregunta='".$arrayPreg[$i]."',imgDir='".$filename."' 
                                                        where cod_cuest=".$codpractico." and n_preg=".($i+1)." and estado=1";

                                                }
                                            
                                                    if(!$result1 = mysqli_query($db,$sql)){
                                                        echo "errorSQL8";
                                                        exit();
                                                    }
                                                }else{
                                                     $filename="";
                                                if (!isset($_POST['file'.($i+1)])) {
                                                    if (!file_exists($_FILES['file'.($i+1)]['tmp_name'])||
                                                    !is_uploaded_file($_FILES['file'.($i+1)]['tmp_name'])) {

                                                    }else{
                                                    
                                                        if ($_FILES['file'.($i+1)]['type']=="image/jpg"||
                                                            $_FILES['file'.($i+1)]['type']=="image/jpeg"||
                                                            $_FILES['file'.($i+1)]['type']=="image/png"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.wordprocessingml.document"||
                                                            $_FILES['file'.($i+1)]['type']=="application/msword"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.ms-powerpoint"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.presentationml.presentation"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.ms-excel"||
                                                            $_FILES['file'.($i+1)]['type']=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"||
                                                            $_FILES['file'.($i+1)]['type']=="application/pdf") {
                                                            $ext=explode(".",$_FILES["file".($i+1)]["name"]);
                                                            $nonmbreFile = $codcur.'-'.$codpar.'-'.$codmat.'-'.$fecha.'-'.strtotime($hora).generateFileName();
                                                            $filename="resources/".$nonmbreFile.'.'. end($ext);
                                                            move_uploaded_file($_FILES["file".($i+1)]["tmp_name"],$filename);
                                                        }else{
                                                            echo "errorFileType";
                                                            exit();
                                                        }
                                                    }
                                                }
                                                    $sql = "insert into preg_cuest(cod_cuest,n_preg,pregunta,imgDir,estado)
                                                    values(".$codpractico.",".($i+1).",'".$arrayPreg[$i]."','".$filename."',1)";
                                                    if(!$result1 = mysqli_query($db,$sql)){
                                                        echo "errorSQL9";
                                                        exit();
                                                    }
                                                }
                                                
                                            }
                                            echo "ok";
                                            exit();
    
                                        }


                                    }else{
                                        echo "errorSQL10";
                                    }
                                }
                                


                            }else{
                                echo "errorPreguntas";
                            }
                            

                        }else{
                            echo "errorParam";
                        }
                        
                        break;
                        case 'getpracticosweb'://Se obtiene la lista de practicos web de un profesor

                            $codprof = $_SESSION['app_user_id'];
                            $trimestre = $_SESSION['app_user_bimestre'];
                            $gestion = date("Y");

                            require 'includes/config.php';
                            $db = mysqli_connect($servername, $username, $password, $database) 
                                or die('Error al intentar conectar con el servidor.');
                            $acento = mysqli_query($db,"SET NAMES 'utf8'");
                            //Obteniendo la lista de practicos web del profesor
                            $lista = array();

                            $sql = "select pw.id,pw.codcur,pw.codpar,pw.codmat,pw.descripcion 
                                    from prof_cur_mat pcm inner join practicos_web pw on 
                                    pcm.gestion=pw.gestion and pcm.codcur=pw.codcur and pcm.codpar=pw.codpar and 
                                    pcm.codmat=pw.codmat and pcm.prof='".$codprof."' and pcm.estado='activo' and 
                                    pw.gestion=".$gestion." and pw.trimestre=".$trimestre." and pw.estado=1";
                                    
                            

                            if ($result = mysqli_query($db,$sql)) {
                                while ($row = $result->fetch_object()) {
                                    $lista[] = array(
                                                    "id"=>$row->id,
                                                    "codcur"=>$row->codcur,
                                                    "codpar"=>$row->codpar,
                                                    "codmat"=>$row->codmat,
                                                    "descripcion"=>$row->descripcion
                                                    );
                                }
                                if (count($lista)>0) {
                                    $resp = array("status"=>"ok","lista"=>$lista);
                                    echo json_encode($resp);
                                }else{
                                    $resp = array("status"=>"noPracticos");
                                    echo json_encode($resp);
                                }
                            }else{
                                $resp = array("status"=>"errorSql");
                                echo json_encode($resp);
                            }
                            
                            break;
                        case 'getpracweb'://Obtener las preguntas de un practico web por parte del profesor
                                if (isset($_POST['codpractico'])&&!empty($_POST['codpractico'])) {
                                    $codpractico = $_POST['codpractico'];
                                    $codprof = $_SESSION['app_user_id'];
                                    $trimestre = $_SESSION['app_user_bimestre'];
                                    $gestion = date("Y");

                                    require 'includes/config.php';
                                    $db = mysqli_connect($servername, $username, $password, $database) 
                                        or die('Error al intentar conectar con el servidor.');
                                    $acento = mysqli_query($db,"SET NAMES 'utf8'");
                                    //Validando que el profesor tenga permiso para obtener el practico
                                    $sql = "select pw.descripcion 
                                            from practicos_web pw inner join prof_cur_mat pcm on 
                                            pw.id=".$codpractico." and pw.gestion = ".$gestion." and 
                                            pw.trimestre=".$trimestre." and pw.gestion=pcm.gestion and 
                                            pw.codcur=pcm.codcur and pw.codpar=pcm.codpar and 
                                            pw.codmat=pcm.codmat and pw.estado=1 and pcm.estado='activo' and 
                                            pcm.prof='".$codprof."'";

                                    if ($result = mysqli_query($db,$sql)) {
                                        if ($rowPracWeb = $result->fetch_object()) {
                                            $descripcion = $rowPracWeb->descripcion;
                                            //Obteniendo las preguntas del practico
                                            $sql = "select npreg, pregunta 
                                            from pregunta_pract_web 
                                            where codpractweb=".$codpractico." and estado=1 order by npreg asc";
                                        
                                            if ($sqlPreg = mysqli_query($db,$sql)) {
                                                $preguntas = array();
                                                while ($rowpreg = $sqlPreg->fetch_object()) {
                                                    $preguntas[] = array(
                                                                        "npreg"=>$rowpreg->npreg,
                                                                        "pregunta"=>$rowpreg->pregunta
                                                                        );
                                                }
                                                $resp = array("status"=>"ok",
                                                              "codpractico"=>$codpractico,
                                                              "descripcion"=>$descripcion,
                                                              "preguntas"=>$preguntas);
                                                echo json_encode($resp);
                                            }else{
                                                $resp = array("status"=>"errorSql");
                                                echo json_encode($resp);
                                            }
                                        }else{
                                            $resp = array("status"=>"noPermitido");
                                            echo json_encode($resp);
                                        }
                                    }else{
                                        $resp = array("status"=>"errorSql");
                                        echo json_encode($resp);
                                    }
                                }else{
                                    $resp = array("status"=>"errorParam");
                                    echo json_encode($resp);
                                }
                                break;
                                case 'dpw': //Eliminar un practico web

                                    if(isset($_POST['codpractico'])&&!empty($_POST['codpractico'])){
                                        $codpractico = $_POST['codpractico'];
                                        $codprof = $_SESSION['app_user_id'];
                                        $trimestre = $_SESSION['app_user_bimestre'];
                                        $gestion = date("Y");

                                        require 'includes/config.php';
                                        $db = mysqli_connect($servername, $username, $password, $database) 
                                            or die('Error al intentar conectar con el servidor.');

                                        //Validando que el profesor tenga permiso para eliminar el practico
                                        $sql = "select pw.id 
                                                from practicos_web pw inner join prof_cur_mat pcm on 
                                                pw.id=".$codpractico." and pw.gestion = ".$gestion." and 
                                                pw.trimestre=".$trimestre." and pw.gestion=pcm.gestion and 
                                                pw.codcur=pcm.codcur and pw.codpar=pcm.codpar and 
                                                pw.codmat=pcm.codmat and pw.estado=1 and pcm.estado='activo' and 
                                                pcm.prof='".$codprof."'";

                                        if ($result = mysqli_query($db,$sql)) {
                                            if ($rowPracWeb = $result->fetch_object()) {
                                                $sql = "update practicos_web set estado=0 where id=".$codpractico;
                                                if ($result1 = mysqli_query($db,$sql)) {
                                                    echo "ok";
                                                }else{
                                                    echo "errorSQL";
                                                }
                                            }else{
                                                echo "noPermitido";
                                            }
                                        }else{
                                            echo "errorSQL";
                                        }
                                    }else{
                                        echo "errorParam";
                                    }
                                    break;
                                    case 'deletepa': //Eliminar un practico con archivo adjunto

                                    if(isset($_POST['codpractico'])&&!empty($_POST['codpractico'])){
                                        $codpractico = $_POST['codpractico'];
                                        $codprof = $_SESSION['app_user_id'];
                                        $trimestre = $_SESSION['app_user_bimestre'];
                                        $gestion = date("Y");

                                        require 'includes/config.php';
                                        $db = mysqli_connect($servername, $username, $password, $database) 
                                            or die('Error al intentar conectar con el servidor.');

                                        //Validando que el profesor tenga permiso para eliminar el practico
                                        $sql = "select pw.cod_cuest 
                                                from cuestionarios pw inner join prof_cur_mat pcm on 
                                                pw.cod_cuest=".$codpractico." and pw.gestion = ".$gestion." and 
                                                pw.bimestre=".$trimestre." and pw.gestion=pcm.gestion and 
                                                pw.cod_cur=pcm.codcur and pw.cod_par=pcm.codpar and 
                                                pw.cod_mat=pcm.codmat and pw.estado=1 and pcm.estado='activo' and 
                                                pcm.prof='".$codprof."'";

                                        if ($result = mysqli_query($db,$sql)) {
                                            if ($rowPracWeb = $result->fetch_object()) {
                                                $sql = "update cuestionarios set estado=0 where cod_cuest=".$codpractico;
                                                if ($result1 = mysqli_query($db,$sql)) {
                                                    echo "ok";
                                                }else{
                                                    echo "errorSQL";
                                                }
                                            }else{
                                                echo "noPermitido";
                                            }
                                        }else{
                                            echo "errorSQL";
                                        }
                                    }else{
                                        echo "errorParam";
                                    }
                                    break;
                                    case 'getpracwebalu'://obtener los practicos web de un alumno
                                        $codalu = $_SESSION['app_user_id'];
                                        $gestion = date("Y");
                                        $trimestre = $_SESSION['app_user_bimestre'];

                                        require 'includes/config.php';
                                        $db = mysqli_connect($servername, $username, $password, $database) 
                                            or die('Error al intentar conectar con el servidor.');

                                        //Obteniendo el curso al que pertenece el estudiante
                                        $sql = "select a.cod_cur,a.cod_par,concat(c.descrip,' - ',p.descrip) as curso  
                                                from alumno a inner join cursos c on
                                                a.cod_cur = c.codigo inner join paralelos p on 
                                                a.cod_par=p.cod_par and a.codigo = ".$codalu." and a.estado = 1";
                                        $codcur = "";
                                        $codpar = "";
                                        $curso = "";
                                        if ($resultCurso = mysqli_query($db,$sql)) {
                                            if ($rowCurso = $resultCurso->fetch_object()) {
                                                $codcur = $rowCurso->cod_cur;
                                                $codpar = $rowCurso->cod_par;
                                                $curso = $rowCurso->curso;
                                            }else{
                                                $resp = array("status"=>"noPermitido");
                                                echo json_encode($resp);
                                                exit();
                                            }
                                        }else{
                                            $resp = array("status"=>"errorSql");
                                            echo json_encode($resp);
                                            exit();
                                        }
                                        //Obteniendo la lista de materias del estudiante
                                        $sql = "select m.codmat,m.descri 
                                                from alumno a inner join cur_mat cm on 
                                                a.cod_cur = cm.cod_cur and a.cod_par = cm.cod_par 
                                                inner join materia m on cm.cod_mat = m.codmat and cm.estado = 1 and 
                                                a.estado = 1  and m.estado = 1 and a.codigo=".$codalu;

                                        if ($resultMaterias = mysqli_query($db,$sql)) {
                                            $listamaterias = array();
                                            while ($rowMaterias = $resultMaterias->fetch_object()) {
                                                //Obteniendo todos los practicos de un curso
                                                $sql = "select id,codmat,descripcion 
                                                        from practicos_web 
                                                        where gestion=".$gestion." and trimestre=".$trimestre." and 
                                                        codcur=".$codcur." and codpar=".$codpar." and estado = 1";
                                                $listaPracticos = array();
                                                if ($resultPracticos = mysqli_query($db,$sql)) {
                                                    while ($rowPracticos = $resultPracticos->fetch_object()) {
                                                        $id = $rowPracticos->id;
                                            
                                                        $codmat = $rowPracticos->codmat;
                                                        $descripcion = $rowPracticos->descripcion;
                                                        //Obteninedo las preguntas del practico
                                                        $sql = "select npreg,pregunta  
                                                                from pregunta_pract_web 
                                                                where codpractweb=".$id." and estado=1 order by npreg asc";
                                                                
                                                        $Lista_preguntas = array();
                                                        if($resPreguntas = mysqli_query($db,$sql)){
                                                            while ($rowpreg = $resPreguntas->fetch_object()) {
                                                                $Lista_preguntas[] = array(
                                                                                            "npreg"=>$rowpreg->npreg,
                                                                                            "pregunta"=>$rowpreg->pregunta);
                                                            }
                                                        }else{
                                                            $resp = array("status"=>"errorSql");
                                                            echo json_encode($resp);
                                                            exit();
                                                        }
                                                        //Validando si el estudiante ya respondi贸 las preguntas del practico
                                                        $sql1 = "select npreg,respuesta   
                                                                 from resp_pract_web 
                                                                 where practweb=".$id." and estado=1 order by npreg";
                                                        $estadodepreactico = "0";
                                                        $respuestas = array();
                                                        if($sqlRespuestas = mysqli_query($db,$sql1)){
                                                            while($rowpreg = $sqlRespuestas->fetch_object()){
                                                               $respuestas[]=array(
                                                                                    "npreg"=>$rowpreg->npreg,
                                                                                    "respuesta"=>$rowpreg->respuesta
                                                                                    ); 
                                                            }
                                                            if(count($respuestas)>0){
                                                                $estadodepreactico = "1";
                                                            }
                                                        }else{
                                                            $resp = array("status"=>"errorSql");
                                                            echo json_encode($resp);
                                                            exit();
                                                        }
                                                        $listaPracticos[] = array(
                                                                                "id"=>$id,
                                                                                "codmat"=>$codmat,
                                                                                "descripcion"=>$descripcion,
                                                                                "preguntas"=>$Lista_preguntas,
                                                                                "estado"=>$estadodepreactico,
                                                                                "respuestas"=>$respuestas
                                                                                  );
                                                    }

                                                }else{
                                                    $resp = array("status"=>"errorSql");
                                                    echo json_encode($resp);
                                                    exit();
                                                }
                                                $codmat = $rowMaterias->codmat;
                                                $img = "";
                                                switch ($codmat) {
                                                    case 'P1': $img = "images/lenguaje.svg"; break;
                                                    case 'P2': $img = "images/mateticas.svg"; break;
                                                    case 'P3': $img = "images/ciencias-naturales.svg"; break;
                                                    case 'P4': $img = "images/ciencias-sociales.svg"; break;
                                                    case 'P5': $img = "images/natacion.svg"; break;
                                                    case 'P6': $img = "images/valores.svg"; break;
                                                    case 'P7': $img = "images/ingles.svg"; break;
                                                    case 'P9': $img = "images/musica.svg"; break;
                                                    case 'P10': $img = "images/artes-plasticas.svg"; break;
                                                    case 'P11': $img = "images/educacion-fisica.svg"; break;
                                                    case 'P14': $img = "images/guarani.svg"; break;
                                                    case 'P15': $img = "images/computacion.svg"; break;
                                                    case 'P16': $img = "images/tecnicas-estudio.svg"; break;
                                                    case 'P17': $img = "images/ortografia.svg"; break;
                                                    case 'S1': $img = "images/mateticas.svg"; break;
                                                    case 'S2': $img = "images/lenguaje.svg"; break;
                                                    case 'S3': $img = "images/filosofia.svg"; break;
                                                    case 'S4': $img = "images/psicologia.svg"; break;
                                                    case 'S5': $img = "images/ciencias-naturales.svg"; break;
                                                    case 'S6': $img = "images/fisica.svg"; break;
                                                    case 'S7': $img = "images/quimica.svg"; break;
                                                    case 'S8': $img = "images/ciencias-sociales.svg"; break;
                                                    case 'S9': $img = "images/computacion.svg"; break;
                                                    case 'S10': $img = "images/biologia.svg"; break;
                                                    case 'S11': $img = "images/civica.svg"; break;
                                                    case 'S12': $img = "images/ingles.svg"; break;
                                                    case 'S13': $img = "images/educacion-fisica.svg"; break;
                                                    case 'S14': $img = "images/musica.svg"; break;
                                                    case 'S15': $img = "images/artes-plasticas.svg"; break;
                                                    case 'S16': $img = "images/valores.svg"; break;
                                                    case 'S17': $img = "images/computacion.svg"; break;
                                                    case 'S18': $img = "images/guarani.svg"; break;
                                                    case 'S19': $img = "images/natacion.svg"; break;
                                                    case 'S20': $img = "images/geografica.svg"; break;
                                                    case 'S21': $img = "images/historia.svg"; break;
                                                    case 'S22': $img = "images/ortografia.svg"; break;
                                                    case 'I1': $img = "images/valores.svg"; break;
                                                    case 'I2': $img = "images/geografica.svg"; break;
                                                    case 'I3': $img = "images/ciencias-naturales.svg"; break;
                                                    case 'I4': $img = "images/filosofia.svg"; break;
                                                    default:
                                                        # code...
                                                        break;
                                                }
                                                $npracticos = contarPracticosWeb($codmat,$listaPracticos);
                                                $listamaterias[] = array(
                                                                        "codmat"=>$codmat,
                                                                        "nombre"=>$rowMaterias->descri,
                                                                        "img"=>$img,
                                                                        "npract"=>$npracticos
                                                                        );
                                            }
                                            if (count($listamaterias)) {//Si el estudiante tiene materias asignadas a su curso
                                                $resp = array("status"=>"ok",
                                                              "materias"=>$listamaterias,
                                                              "practicos"=>$listaPracticos,
                                                              "curso"=>$curso);
                                                echo json_encode($resp);
                                            }else{
                                                $resp = array("status"=>"noMaterias");
                                                echo json_encode($resp);
                                            }
                                        }else{
                                            $resp = array("status"=>"errorSql");
                                            echo json_encode($resp);
                                        }
                                        
                                    break;
                                    case 'gpadm'://Obtener los prácticos de una materia de un curso
                                        if (!isset($_POST['codcur'])&&empty($_POST['codcur'])&&
                                            !isset($_POST['codpar'])&&empty($_POST['codpar'])&&
                                            !isset($_POST['codmat'])&&empty($_POST['codmat'])) {
                                            echo "errorParam";
                                        }
                                        require 'includes/config.php';
                                        $db = mysqli_connect($servername, $username, $password, $database) 
                                            or die('Error al intentar conectar con el servidor.');
                                        $acento = mysqli_query($db,"SET NAMES 'utf8'");
                                            
                                        $codcur = $_POST['codcur'];
                                        $codpar = $_POST['codpar'];
                                        $codmat = $_POST['codmat'];

                                        $trimestre = $_SESSION['app_user_bimestre'];
                                        //$trimestre = 1;
                                        $gestion = date("Y");

                                        //Obteniendo los cuestionarios del curso
                                        $sql = "select c.cod_cuest,concat(p.apepro,' ',p.nompro) as profe, c.descrip,c.fecha,c.hora,c.fechaReg 
                                                from cuestionarios c inner join profe p on 
                                                c.codprof = p.codprof and c.gestion = ".$gestion." and 
                                                c.bimestre = ".$trimestre." and c.cod_cur = ".$codcur." and 
                                                c.cod_par = ".$codpar." and c.cod_mat = '".$codmat."' and c.estado = 1";

                                        if (!$result = mysqli_query($db,$sql)) {
                                            echo "errorSql1";
                                        }
                                        $lista = array();
                                        while ($row = $result->fetch_object()) {
                                            $lista[] = array(
                                                            "codpractico"=>$row->cod_cuest,
                                                            "profesor"=>$row->profe,
                                                            "descripcion"=>$row->descrip,
                                                            "fechalimite"=>fechaPres($row->fecha,$row->hora),
                                                            "fecharegistro"=>$row->fechaReg
                                                            );
                                        }
                                        //Obteniendo la lista de alumnos
                                        $alumnos = array();
                                        $sql = "select codigo, concat(paterno,' ',materno,' ',nombres) as nombre 
                                                from alumno 
                                                where cod_cur = ".$codcur." and cod_par = ".$codpar." and estado = 1 order by nombre asc";
                                        if (!$result = mysqli_query($db,$sql)) {
                                            echo "errorSqlListaAlumnos";
                                            exit();
                                        }
                                        while ($row = $result->fetch_object()) {
                                            $alumnos[] = array(
                                                                "codalu"=>$row->codigo,
                                                                "nombre"=>$row->nombre
                                                                );
                                        }

                                        //obteniendo las preguntas de los prácticos
                                        $preguntas = array();
                                        $presentaciones = array();
                                        for ($i=0; $i < count($lista); $i++) { 
                                            $codigoPractico = $lista[$i]['codpractico'];
                                            $sql = "select pregunta,imgDir 
                                                    from preg_cuest 
                                                    where cod_cuest = ".$codigoPractico." and estado = 1 order by n_preg";
                                                    
                                            if (!$result = mysqli_query($db,$sql)) {
                                                echo "errorSqlPreg";
                                                exit();
                                            }
                                            $listaPre = array();
                                            while ($row = $result->fetch_object()) {
                                                $listaPre[] = array(
                                                                    "pregunta"=>$row->pregunta,
                                                                    "archivo"=>$row->imgDir,
                                                                    "extension"=>extension($row->imgDir)
                                                                    );
                                            }
                                            $preguntas[$codigoPractico] = $listaPre;
                                            //obteniendo la lista todos los que presentaron el práctico
                                            $sql = "select codalumno,archivo,fecha,hora,nota  
                                                    from practico_alumno 
                                                    where codpractico = ".$codigoPractico." and estado = 1";
                                            if (!$result = mysqli_query($db,$sql)) {
                                                echo "errorSqlPresentaciones";
                                                exit();
                                            }
                                            $presentaron = array();
                                            while ($row = $result->fetch_object()) {
                                                $presentaron[] = array(
                                                                        "codalu"=>$row->codalumno,
                                                                        "archivo"=>$row->archivo,
                                                                        "fecha"=>$row->fecha,
                                                                        "hora"=>$row->hora,
                                                                        "nota"=>$row->nota
                                                                        );
                                            }
                                            $tabla = array();
                                            for ($j=0; $j < count($alumnos); $j++) { 
                                                $codalu = $alumnos[$j]['codalu'];
                                                $nombre = $alumnos[$j]['nombre'];
                                                $tabla[] = presento($presentaron,$codalu,$nombre);
                                            }
                                            $presentaciones[$codigoPractico] = $tabla;

                                        }
                                        if (count($lista)==0) {
                                            $resp = array("status"=>"noPracticos");
                                            echo json_encode($resp);
                                            exit();
                                        }
                                            $resp = array("status"=>"ok",
                                                          "lista"=>$lista,
                                                          "preguntas"=>$preguntas,
                                                          "presentaciones"=>$presentaciones);
                                            echo json_encode($resp);
                                            exit();
                                    break;
                                    case 'limitar_practico':
                                        $codpractico = $_POST['codprac'];
                                        require 'includes/config.php';
                                        $db = mysqli_connect($servername, $username, $password, $database) 
                                            or die('Error al intentar conectar con el servidor.');
                                        $sql = "update cuestionarios set limite = 0 where cod_cuest = ".$codpractico;
                                        //echo $sql;
                                        $result = mysqli_query($db,$sql);
                                        echo "ok";
                                        
                                        break;
                                    case 'liberar_practico':
                                        $codpractico = $_POST['codprac'];
                                        require 'includes/config.php';
                                        $db = mysqli_connect($servername, $username, $password, $database) 
                                            or die('Error al intentar conectar con el servidor.');
                                        $sql = "update cuestionarios set limite = 1 where cod_cuest = ".$codpractico;
                                        $result = mysqli_query($db,$sql);
                                        echo "ok";
                                        
                                        break;
            }
}else{
    $respuesta = array("status"=>"errorGet");
    echo json_encode($respuesta);
}
function formatoFecha($fecha){
    if($fecha=='0000-00-00 00:00:00' || $fecha==" ")return "";
    $hora = substr($fecha, 11,5);
    $time = strtotime($fecha);
    $mes = date("n",$time);
    $dia = date("N",$time);
    $dias = array("","lunes","martes","miércoles","jueves","viernes","sábado","domingo");
    $meses = array("","enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre");
    return $dias[$dia].", ".date("d",$time)." de ".$meses[$mes]." de ".date("Y",$time)." a horas ".$hora;
}
function presentoPdf($codalu,$listaPre){
    for ($i=0; $i < count($listaPre) ; $i++) { 
        if ($listaPre[$i]['codalu']==$codalu) {
            return array("id"=>$listaPre[$i]['id'],"pdf"=>$listaPre[$i]['pdf'],"nota"=>$listaPre[$i]['nota'],"fecha"=>$listaPre[$i]['fecha'],"hora"=>$listaPre[$i]['hora'],"estado"=>$listaPre[$i]['estado'],"editable"=>$listaPre[$i]['editable'],"observacion"=>$listaPre[$i]['observacion'],"fechacalif"=>$listaPre[$i]['fechacalif']);
        }
    }
    return array("id"=>"","pdf"=>"","nota"=>"","fecha"=>"","hora"=>"","estado"=>"0","editable"=>"","observacion"=>"","fechacalif"=>"");
}
function contarPracticosWeb($codmat,$practicosWeb){
    $cont = 0;
    for ($i=0; $i < count($practicosWeb); $i++) { 
        if($practicosWeb[$i]['codmat']==$codmat){
            $cont++;
        }
    }
    return $cont;
}

function generateFileName()
{
$chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789_";
$name = "";
for($i=0; $i<6; $i++)
$name.= $chars[rand(0,strlen($chars)-1)];
return $name;
}
function fechaPres($fecha,$hora){
    $Y = substr($fecha, 0,4);
    $m = substr($fecha, 5,2);
    $d = substr($fecha, 8,2);
    $h = substr($hora, 0,5);
    return "Hasta las ".$h." hrs. del ".$d."/".$m."/".$Y;
}
function extension($file){
    if (empty($file)) {
        return "";
    }
    $ext = explode('.', $file);
    return $ext[count($ext)-1];
}
function presento($presentaron,$codalu,$nombre){
    for ($i=0; $i < count($presentaron) ; $i++) { 
        if ($presentaron[$i]['codalu']==$codalu) {

            return array("nombre"=>$nombre,
                         "archivo"=>$presentaron[$i]['archivo'],
                         "fecha"=>$presentaron[$i]['fecha'],
                         "hora"=>$presentaron[$i]['hora'],
                         "nota"=>$presentaron[$i]['nota']);
            
        }
    }
   return array("nombre"=>$nombre,
                         "archivo"=>"",
                         "fecha"=>"",
                         "hora"=>"",
                         "nota"=>"");
}
function validarEnlace($enlace){
    if($enlace == "https://www.aizama.net/aizama/practicos_secundaria1.php"){return false;}
    if($enlace == "http://www.aizama.net/aizama/practicos_secundaria1.php"){return false;}
    $http = substr($enlace, 0,4);
    return $http == "http";
}
function esFile($file){
    $resources = substr($file, 0,10);
    return $resources=="practicos/";
}
?>