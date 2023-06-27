<?php 

session_start();

header("Content-Type: text/html;charset=utf-8");

header('Access-Control-Allow-Origin: *'); 

header("Access-Control-Allow-Credentials: true");

header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

header('Access-Control-Max-Age: 1000');

header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

require '../includes/functions.php';

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

    case 'save':

        $codprof = $_SESSION['app_user_id'];

        if(empty($codprof)){

            echo "<script>location.href='../docentes.php';</script>";

            exit();

        }

        $codcur = isset($_POST['codcur'])?$_POST['codcur']:"";

        $codpar = isset($_POST['codpar'])?$_POST['codpar']:"";

        $codmat = isset($_POST['codmat'])?$_POST['codmat']:"";

        $file = isset($_POST['file'])?$_POST['file']:"";

        if(empty($codcur)||empty($codpar)||empty($codmat)){

            echo "errorParam";

            exit();

        }

        $trimestre = $_SESSION['app_user_bimestre'];

        $gestion = date("Y");

        $fechareg = date("Y-m-d H:i:s");

        $filename = "";

        if (!file_exists($_FILES[$file]['tmp_name'])||!is_uploaded_file($_FILES[$file]['tmp_name'])) {

    		$filename = "NoFile";

    	}else{

			$ext=explode(".",$_FILES[$file]["name"]);

			if ($_FILES[$file]['type']=="application/pdf") {

			    $filename=round(microtime(true)).'.'. end($ext);

			    move_uploaded_file($_FILES[$file]["tmp_name"],"../autoevaluaciones/".$filename);

		    }else{

		        echo "errorFileType";

		        exit();

		    }

    		

    	}
    	require_once('../modelo/modelo_autoevaluacion.php');
        require_once'../modelo/conexion.php';
        $db = Conectar::conexion();

		$autoEval = new Autoevaluacion($db);

		$result = $autoEval->save($gestion,$trimestre,$codcur,$codpar,$codmat,$filename,$fechareg,$codprof);

		if($result){

			echo "ok";

			exit();

		}else{

			echo "error";

			exit();

		}

        

    break;

case 'set_visible':

    $codprof = $_SESSION['app_user_id'];

    if(empty($codprof)){

        echo "<script>location.href='../docentes.php';</script>";

        exit();

    }

    $codcur = isset($_POST['codcur'])?$_POST['codcur']:"";

    $codpar = isset($_POST['codpar'])?$_POST['codpar']:"";

    $codmat = isset($_POST['codmat'])?$_POST['codmat']:"";

    $visible = isset($_POST['visible'])?$_POST['visible']:"";

    if(empty($codcur)||empty($codpar)||empty($codmat)){

        echo "errorParam";

        exit();

    }

    $gestion = date("Y");

    $trimestre = $_SESSION['app_user_bimestre'];

    require_once'../modelo/modelo_autoevaluacion.php';
    require_once'../modelo/conexion.php';
    $db = Conectar::conexion();

    $autoEval = new Autoevaluacion($db);

    $id = $autoEval->existeRegistro($gestion,$trimestre,$codcur,$codpar,$codmat);

    $v = 0;

    if($visible=="true")$v=1;

    if($id){

        $result = $autoEval->set_visible($id,$v);

        echo "ok";

        exit();

    }

    echo "noEval";

    break;

case 'get_autoevaluaciones':

    $codprof = $_SESSION['app_user_id'];

    if(empty($codprof)){

        echo "<script>location.href='../docentes.php';</script>";

        exit();

    }

    require_once'../modelo/modelo_prof_cur_mat.php';

    require_once'../modelo/modelo_autoevaluacion.php';
    require_once'../modelo/conexion.php';
    $db = Conectar::conexion();

    $autoEval = new Autoevaluacion($db);

    $pcm = new Prof_cur_mat($db);

    

    $trimestre = $_SESSION['app_user_bimestre'];

    $gestion = date("Y");

    $result = $pcm->get_registros($codprof,$gestion);

    $lista = array();

    while($fila = $result->fetch_object()){

        $codcur = $fila->codcur;

        $codpar = $fila->codpar;

        $codmat = $fila->codmat;

        $data = $autoEval->get_auto_evaluacion($gestion,$trimestre,$codcur,$codpar,$codmat);

        if(!empty($data))$lista[] = $data;

    }

    echo json_encode(array("status"=>"ok","lista"=>$lista));

    break;

    case 'get_autoevaluacion_alu':

        $codalu = $_SESSION['app_user_id'];

        if(empty($codalu)){

            echo json_encode(array("status"=>"eSession"));

            exit();

        }

        $trimestre = $_SESSION['app_user_bimestre'];

        $gestion = date("Y");

        

        require_once'../modelo/modelo_Alumno.php';
        require_once'../modelo/conexion.php';
        $db = Conectar::conexion();
        $Alumno = new Alumno($db);

        $datos = $Alumno->getDatosAlumno($codalu);

        $codcur = $datos['codcur'];

        $codpar = $datos['codpar'];

        

        require_once'../modelo/modelo_autoevaluacion.php';

        $Auto_Eval = new Autoevaluacion($db);

        $result = $Auto_Eval->get_autoevaluaciones_alu($gestion,$trimestre,$codcur,$codpar);

        

        require_once'../modelo/modelo_materia.php';

        $Materia = new Materia($db);

        $materias = $Materia->getMaterias();

        $lista = array();

        while($fila = $result->fetch_object()){

            $lista[] = array(

                            "codmat"=>$fila->codmat,

                            "nombre"=>$materias[$fila->codmat],

                            "file"=>$fila->file

                            ); 

        }

        echo json_encode(array("status"=>"ok","lista"=>$lista));

        break;

    case 'get_autoevaluaciones_alu':

        

        $codalu = $_SESSION['app_user_id'];

        if(empty($codalu)){

            echo json_encode(array("status"=>"eSession"));

            exit();

        }

        require_once'../modelo/modelo_Alumno.php';
        require_once'../modelo/conexion.php';
        $db = Conectar::conexion();
        $alumno = new Alumno($db);

        $datos_alumno = $alumno->getDatosAlumno($codalu);

        

        $codcur = $datos_alumno['codcur'];

        $codpar = $datos_alumno['codpar'];

        $gestion = date("Y");

        $trimestre = $_SESSION['app_user_bimestre'];

        

        require_once'../modelo/modelo_autoevaluacion.php';

        

        $auto_evaluacion = new Autoevaluacion($db);

        $autoevaluaciones = $auto_evaluacion->get_autoevaluaciones_alu($gestion,$trimestre,$codcur,$codpar);

        

        require_once'../modelo/modelo_materia.php';

        $materia = new Materia($db);

        $materias = $materia->getMaterias();

        require_once'../modelo/modelo_autoevalaucion_alumno.php';

        $ser_decidir = new Autoevaluacion_alumno($db);

        $lista = array();

        foreach($autoevaluaciones as $fila){

            

            $alu_autoevaluacion = $ser_decidir->get_registro($codalu,$fila['id']);

            $calificado = 0;

            $ser = "";

            $decidir = "";

            if($row = $alu_autoevaluacion->fetch_object()){

                $calificado = 1;

                $ser = $row->ser;

                $decidir = $row->decidir;

            }

            $lista[] = array(

                            "cod_autoevaluacion" => $fila['id'],

                            "materia" => $materias[$fila['codmat']]['nombre'],

                            "calificado" => $calificado,

                            "ser" => $ser,

                            "decidir" => $decidir,

                            "file"=>"autoevaluaciones/".$fila['file']

                            );

        }

        echo json_encode(array("status"=>"ok","lista"=>$lista));

        

        break;

    case 'calificar':

        $codalu = $_SESSION['app_user_id'];

        if(empty($codalu)){

            echo json_encode(array("status"=>"eSession"));

            exit();

        }

        

        $codeva = isset($_POST['codeva'])?$_POST['codeva']:"";

        $ser = isset($_POST['ser'])?$_POST['ser']:"";

        $decidir = isset($_POST['decidir'])?$_POST['decidir']:"";

        

        if(empty($codeva)||empty($ser)||empty($decidir)){

            echo "errorParam";

            exit(); 

        }

        

        $int_ser = is_int($ser)?$ser:"";

        $int_decidir = is_int($decidir)?$decidir:"";

        

        if(empty($ser)||empty($decidir)){

            echo "errorTypeNotas";

            exit(); 

        }

        

        if($ser < 1 || $ser > 5 || $decidir < 1 || $decidir > 5){

            echo "errorLimiteNota";

            exit();

        }

        

        require_once'../modelo/modelo_autoevalaucion_alumno.php';
        require_once'../modelo/conexion.php';
        $db = Conectar::conexion();
        $eval_alumno = new Autoevaluacion_alumno($db);

        

        $result = $eval_alumno->get_registro($codalu,$codeva);

        if($fila = $result->fetch_object()){

            echo "existeRegistro";

            exit();

        }else{

            $fechareg = date("Y-m-d H:i:s");

            $result = $eval_alumno->save($codalu,$codeva,$ser,$decidir,$fechareg);

            echo "ok";

        }

        break;

    case 'get_lista_autoevaluaciones':

        $codprof = $_SESSION['app_user_id'];



        if(empty($codprof)){



            echo json_encode(array("status"=>"eSession"));



            exit();



        }





        $codeva = isset($_POST['codeva'])?$_POST['codeva']:"";



        if (empty($codeva)) {

            echo "errorParam";

            exit();

        }



        require_once'../modelo/modelo_autoevaluacion.php';
        require_once'../modelo/conexion.php';
        $db = Conectar::conexion();
        $Evaluacion = new Autoevaluacion($db);



        $auto_evaluacion = $Evaluacion->getAutoevaluacion($codeva);



        if(!$fila = $auto_evaluacion->fetch_object()){

            echo "noEval";

            exit();

        }

        $codcur = $fila->codcur;

        $codpar = $fila->codpar;



        require_once'../modelo/modelo_curso.php';

        $curso = new Curso($db);



        $lista_alumnos = $curso->getListaAlumnos($codcur,$codpar);

        require_once'../modelo/modelo_autoevalaucion_alumno.php';

        $auto_eval_alumno = new Autoevaluacion_alumno($db);

        $lista = array();

        foreach ($lista_alumnos as $alumno) {

            $codalu = $alumno['codigo'];

            $nombre = $alumno['paterno'].' '.$alumno['materno'].' '.$alumno['nombres'];

            $result = $auto_eval_alumno->get_registro($codalu,$codeva);

            if($fila = $result->fetch_object()){

                $lista[] = array(

                                "codalu"=>$codalu,

                                "nombre"=>$nombre,

                                "ser"=>$fila->ser,

                                "decidir"=>$fila->decidir

                                );

            }else{

                $lista[] = array(

                                "codalu"=>$codalu,

                                "nombre"=>$nombre,

                                "ser"=>"",

                                "decidir"=>""

                                );

            }





        }



        echo json_encode(array("status"=>"ok","lista"=>$lista));



        break;

    case 'actualizar':

        $codprof = $_SESSION['app_user_id'];

        if(empty($codprof)){

            echo json_encode(array("status"=>"eSession"));

            exit();

        }

        $lista = isset($_POST['lista'])?$_POST['lista']:"";

        $codeva = isset($_POST['codeva'])?$_POST['codeva']:"";

        $fechareg = date('Y-m-d H:i:s');

        if(empty($lista) || empty($codeva)){

            echo "errorParam";

            exit();

        }

        $codeva = $codeva + 0;

        if(!$array = json_decode($_POST['lista'])){

            echo "errorLista";

            exit();

        }

        require_once'../modelo/modelo_autoevalaucion_alumno.php';
        require_once'../modelo/conexion.php';
        $db = Conectar::conexion();
        $auto_eval_alumno = new Autoevaluacion_alumno($db);

        foreach ($array as $fila) {

            if($fila->ser_ac>5){

                echo "errorNota";

                exit();

            }

            if($fila->decidir_ac>5){

                echo "errorNota";

                exit();

            }

        }

        foreach ($array as $fila) {

            $ser = $fila->ser;

            $ser_ac = $fila->ser_ac;

            $decidir = $fila->decidir;

            $decidir_ac = $fila->decidir_ac;

            $codalu = $fila->codalu;

            if($ser != $ser_ac ){

                $result = $auto_eval_alumno->get_registro($codalu,$codeva);

                if($fila = $result->fetch_object()){

                    $auto_eval_alumno->set_ser($codalu,$codeva,$ser_ac,$fechareg);

                }else{

                    $auto_eval_alumno->save($codalu,$codeva,$ser_ac,$decidir_ac,$fechareg);

                }

            }

            if($decidir != $decidir_ac){

                $result = $auto_eval_alumno->get_registro($codalu,$codeva);

                if($fila = $result->fetch_object()){

                    $auto_eval_alumno->set_decidir($codalu,$codeva,$decidir_ac,$fechareg);

                }

            }

        }

        echo "ok";

        // code...

        break;

default:

    echo "ErrorOP";

    break;



}



?>