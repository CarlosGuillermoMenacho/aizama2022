<?php 
switch ($_GET['op']) {
	case 'get_pregunta_alu':
			$preguntas = isset($_POST["lista"])?json_decode($_POST["lista"]):[];
            require_once"../modelo/conexion.php";
            $db = Conectar::conexion();	
            require_once"../modelo/modelo_identificacion.php";
            $Preguntas_I = new Identificacion($db);
            $result = $Preguntas_I->get_preguntas();
            $banco = [];
            foreach ($result as $row) {
                $banco[] = $row;
            }
            
            if(count($preguntas) == count($banco)){
                echo json_encode(["status"=>"noPregunta"]);
                exit();
            }
            $preg = "";
            if(count($preguntas) == 0){
                $preg = $banco[0];
            }
            while ($preg == "") {
                $index = rand(1,count($banco));
                if(!in_array($index,$preguntas)){
                    $preg = $banco[$index - 1];
                }
            }
            
            echo json_encode(["status"=>"ok","pregunta"=>$preg]);        
		break;
    case 'evaluar':
        
        $preguntas = isset($_POST["preguntas"])?json_decode($_POST["preguntas"]):"";
        $respuestas = isset($_POST["respuestas"])?json_decode($_POST["respuestas"]):"";

        if(empty($preguntas) || empty($respuestas)){
            echo json_encode(["status" => "errorParam"]);
            exit();
        }
        for ($i=0; $i < count($preguntas); $i++) { 
            $nro = $preguntas[$i];
            switch ($nro) {
                case '1'://La pregunta es sobre su nombre completo
                    $respuesta = $respuestas[$i];
                    if(empty($respuesta)){
                        echo json_encode(["status"=>"noIde"]);
                        exit(); 
                    }
                    $array_name = explode(" ",$respuesta);
                    require_once"../modelo/conexion.php";
                    $db = Conectar::conexion();	
                    require_once"../modelo/modelo_Alumno.php";
                    $Alumno = new Alumno($db);
                    $result = $Alumno->get_alumnos();
                    $alumnos = [];
                    while ($row = $result->fetch_object()) {
                        $paterno = $row->paterno;
                        $materno = $row->materno;
                        $nombres = $row->nombres;
                        $alumnos[] = [$paterno,$materno,$nombres];
                    }
                    $match = [];
                    for ($i=0; $i < count($array_name); $i++) { 
                        for ($i=0; $i < count($alumnos); $i++) { 
                            $a = $array_name[$i];
                            
                        }
                    }
                    
                    break;
                
                default:
                    # code...
                    break;
            }
        }
        
        break;
	default:
		echo json_encode(array("status"=>"errorOP"));
		break;
}

?>