<?php
session_start();
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
require 'includes/functions.php';
$_tipo_user = isset($_GET['usr'])&&!empty($_GET['usr'])?$_GET['usr']:"";
if (empty($_tipo_user)){
	echo "errorGET";
	exit();
}
/*if(!cliente_activo()){
	if ($_tipo_user=='doc') {
		header("Location: docentes.php");
	}
	if ($_tipo_user=='alu') {
		header("Location: usuario.php");
	}
	if ($_tipo_user=='adm') {
		header("Location: administracion.php");
	}
	exit();
}*/
if (isset($_GET['op'])&&!empty($_GET['op'])) {
	switch ($_GET['op']) {
		case 'save_evaluacion':
			$fechaini = isset($_POST['fechaini'])?$_POST['fechaini']:"";
			$fechafin = isset($_POST['fechafin'])?$_POST['fechafin']:"";
			$horaini = isset($_POST['horaini'])?$_POST['horaini']:"";
			$horafin = isset($_POST['horafin'])?$_POST['horafin']:"";
			$duracion = isset($_POST['duracion'])?$_POST['duracion']:"";
			$descripcion = isset($_POST['descripcion'])?$_POST['descripcion']:"";
			$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
			$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
			$codmat = isset($_POST['codmat'])?$_POST['codmat']:"";
			$preguntas = isset($_POST['preguntas'])?$_POST['preguntas']:"";
			$nota = isset($_POST['nota'])?$_POST['nota']:"";

			if(empty($fechaini)||empty($fechafin)||
			   empty($horafin)||empty($horaini)||
			   empty($duracion)||empty($descripcion)||
			   empty($codcur)||empty($codpar)||
			   empty($codmat)||empty($preguntas)|| empty($nota)){
				echo "errorParam";
				exit();
			}
			$fecha_inicio = $fechaini.' '.$horaini;
			$fecha_fin = $fechafin.' '.$horafin;
			if(strtotime($fecha_fin)<=strtotime($fecha_inicio)){
				echo "errorTime";
				exit();
			}
			$trimestre = $_SESSION['app_user_bimestre'];
			$codprof = $_SESSION['app_user_id'];
			$gestion = date("Y");
			$fechaReg = date("Y-m-d H:i:s");

			require 'includes/config.php';
			$db = mysqli_connect($servername, $username, $password, $database) 
				  or die('Error al intentar conectar con el servidor.');

		    $acento = mysqli_query($db,"SET NAMES 'utf8'");
		    $sql = "select count(*) as total 
		            from evaluacion_escrita 
		            where estado = 1 and gestion = ".$gestion." and 
		                  trimestre = ".$trimestre." and codcur = ".$codcur." and 
		                  codpar = ".$codpar." and codmat = '".$codmat."'";
		    $result = mysqli_query($db,$sql);
		    $row = $result->fetch_object();
		    $total = $row->total;
		    $total++;
		    $sql = "insert into evaluacion_escrita(gestion,trimestre,codcur,codpar,codmat,
		    									   nro,preguntas,codprof,fecha_inicio,fecha_fin,tiempo,
		    									   descripcion,fechaReg,completo,estado,nota) 
		    		values(".$gestion.",".$trimestre.",".$codcur.",".$codpar.",'".$codmat."',".$total.",".$preguntas.",
		    		'".$codprof."','".$fecha_inicio."','".$fecha_fin."',".$duracion.",'".$descripcion."','".$fechaReg."',0,1,".$nota.")";
		    //echo $sql;

		    $result = mysqli_query($db,$sql);
		    echo "ok";

			break;
		case 'update_evaluacion':
			$fechaini = isset($_POST['fechaini'])?$_POST['fechaini']:"";
			$fechafin = isset($_POST['fechafin'])?$_POST['fechafin']:"";
			$horaini = isset($_POST['horaini'])?$_POST['horaini']:"";
			$horafin = isset($_POST['horafin'])?$_POST['horafin']:"";
			$duracion = isset($_POST['duracion'])?$_POST['duracion']:"";
			$descripcion = isset($_POST['descripcion'])?$_POST['descripcion']:"";
			$preguntas = isset($_POST['preguntas'])?$_POST['preguntas']:"";
			$codeva = isset($_POST['codeva'])?$_POST['codeva']:"";
			$nota = isset($_POST['nota'])?$_POST['nota']:"";

			if(empty($fechaini)||empty($fechafin)||
			   empty($horafin)||empty($horaini)||
			   empty($duracion)||empty($descripcion)||
			   empty($preguntas)||empty($codeva)||empty($nota)){
				echo "errorParam";
				exit();
			}
			$fecha_inicio = $fechaini.' '.$horaini;
			$fecha_fin = $fechafin.' '.$horafin;
			if(strtotime($fecha_fin)<=strtotime($fecha_inicio)){
				echo "errorTime";
				exit();
			}
			require 'includes/config.php';
			$db = mysqli_connect($servername, $username, $password, $database) 
				  or die('Error al intentar conectar con el servidor.');

		    $acento = mysqli_query($db,"SET NAMES 'utf8'");
		    $codprof = $_SESSION['app_user_id'];
		    $fechaReg = date("Y-m-d H:i:s");
		    $sql = "select count(*) as total 
		    		from pregunta_eval_escrito 
		    		where estado = 1 and codeva = ".$codeva;

		    $result = mysqli_query($db,$sql);
		    $row = $result->fetch_object();
		    $total = $row->total;
		    $completo = 0;
		    if($total >= $preguntas)$completo = 1;
		    $sql = "update evaluacion_escrita set preguntas = ".$preguntas.",
		    									  codprof = '".$codprof."',
		    									  fecha_inicio = '".$fecha_inicio."',
		    									  fecha_fin = '".$fecha_fin."',
		    									  tiempo = ".$duracion.",
		    									  descripcion = '".$descripcion."',
		    									  fechaReg = '".$fechaReg."',
		    									  nota = ".$nota.",
		    									  completo = ".$completo." 
		    		where id = ".$codeva;
		    $result = mysqli_query($db,$sql);
		    echo "ok";

			break;
		case 'delete_evaluacion':
			$codeva = isset($_POST['codeva'])?$_POST['codeva']:"";
			if(empty($codeva)){
				echo "errorParam";
				exit();
			}
			require 'includes/config.php';
			$db = mysqli_connect($servername, $username, $password, $database) 
				  or die('Error al intentar conectar con el servidor.');

		    $acento = mysqli_query($db,"SET NAMES 'utf8'");

		    $sql = "update evaluacion_escrita set estado = 0 where id = ".$codeva;
		    $result = mysqli_query($db,$sql);
		    echo "ok";
			break;
		case 'get_evaluacion': //Obtener todas las evaluaciones de un curso de una materia
			$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
			$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
			$codmat = isset($_POST['codmat'])?$_POST['codmat']:"";

			if(empty($codcur) || empty($codpar) || empty($codmat)){
				echo "errorParam";
				exit();
			}
			$trimestre = $_SESSION['app_user_bimestre'];
			$gestion = date('Y');

			require 'includes/config.php';
			require_once'tipo_indicador.php';
			$db = mysqli_connect($servername, $username, $password, $database) 
				  or die('Error al intentar conectar con el servidor.');

		    $acento = mysqli_query($db,"SET NAMES 'utf8'");

		    $sql = "select * 
		    		from evaluacion_escrita 
		    		where estado = 1 and gestion = ".$gestion." and 
		    			  trimestre = ".$trimestre." and codcur = ".$codcur." and 
		    			  codpar = ".$codpar." and codmat = '".$codmat."'";
		    $result = mysqli_query($db,$sql);
		    $lista = array();
		    while ($row = $result->fetch_object()) {
		        $sql = "SELECT * FROM indicador WHERE codigo = ".$row->id." AND tipo = ".EVALUACION_ESCRITA." AND estado = 1";
                $result_inidcador = mysqli_query($db,$sql);
                $indicador = "";
                if($row_indicador = $result_inidcador->fetch_object()){
                    $indicador = $row_indicador->indicador;
                }
		    	$lista[] = array(
		    					"id" => $row->id,
		    					"nro" => $row->nro,
		    					"preguntas" => $row->preguntas,
		    					"fechai" => $row->fecha_inicio,
		    					"fechaf" => $row->fecha_fin,
		    					"tiempo" => $row->tiempo,
		    					"descripcion" => $row->descripcion,
		    					"nota" => $row->nota,
		    					"indicador"=>$indicador
		    					); 
		    }
		    //Obteniendo todas las preguntas de las evaluaciones con imagen
		    $sql = "select pee.id as idPreg,pee.codeva,pee.nro,pee.pregunta,iee.id as idImg,iee.link  
		    		from evaluacion_escrita ee inner join pregunta_eval_escrito pee on 
		    		ee.id = pee.codeva inner join imagen_eval_escrita iee on 
		    		pee.id = iee.codpreg and ee.estado = 1 and 
		    		pee.estado = 1 and iee.estado = 1 and 
		    		ee.codcur = ".$codcur." and ee.codpar = ".$codpar." and 
		    		ee.codmat = '".$codmat."'";

		    $result = mysqli_query($db,$sql);
		    $preguntas = array();
		    while ($row = $result->fetch_object()) {
		    	$preguntas[] = array(
		    						"idPreg"=>$row->idPreg,
		    						"codeva"=>$row->codeva,
		    						"nro"=>$row->nro,
		    						"pregunta"=>$row->pregunta,
		    						"idImg"=>$row->idImg,
		    						"link"=>$row->link
		    						);
		    }
		    //Obteniendo todas las preguntas sin imagen
		    $sql = "select pee.id,pee.nro,pee.pregunta,pee.codeva  
		    		from evaluacion_escrita ee inner join pregunta_eval_escrito pee on 
		    		ee.id = pee.codeva and pee.id NOT IN(select codpreg from imagen_eval_escrita where estado = 1) and 
		    		ee.estado = 1 and pee.estado = 1 and ee.codcur = ".$codcur." and 
		    		ee.codpar = ".$codpar." and ee.codmat = '".$codmat."'";
		    $result = mysqli_query($db,$sql);
		    while ($row = $result->fetch_object()) {
		    	$preguntas[] = array(
		    						"idPreg"=>$row->id,
		    						"codeva"=>$row->codeva,
		    						"nro"=>$row->nro,
		    						"pregunta"=>$row->pregunta,
		    						"idImg"=>"",
		    						"link"=>""
									);
		    }
		    echo json_encode(array("status" => "ok", "lista" => $lista,"preguntas"=>$preguntas));
			break;
		case 'guardarPregunta'://Se agregará una pregunta al examen escrito
			$codeva = isset($_POST['codeva'])?$_POST['codeva']:"";
			$pregunta = isset($_POST['pregunta'])?$_POST['pregunta']:"";
			
			if (empty($codeva) || empty($pregunta)) {
				echo "errorParam";
				exit();
			}
			require 'includes/config.php';
			$db = mysqli_connect($servername, $username, $password, $database) 
				  or die('Error al intentar conectar con el servidor.');

		    $acento = mysqli_query($db,"SET NAMES 'utf8'");

		    $sql = "select count(*) as total 
		    		from pregunta_eval_escrito 
		    		where estado = 1 and codeva = ".$codeva;

		    $result = mysqli_query($db,$sql);
		    $row = $result->fetch_object();
		    $total = $row->total;
		    $total++;
		    $codprof = $_SESSION['app_user_id'];
		    $fecha = date("Y-m-d H:i:s");

		    $sql = "select * from evaluacion_escrita where id = ".$codeva;
		    $result = mysqli_query($db,$sql);
		    $row = $result->fetch_object();
		    $nPreg = $row->preguntas;
		    if($total==$nPreg){
		    	$sql = "update evaluacion_escrita set completo = 1 where id = ".$codeva;
		    	$result = mysqli_query($db,$sql);
		    }

		    $sql = "select insertar_pregunta(".$codeva.",".$total.",'".$pregunta."','".$fecha."','".$codprof."',1) as idPreg";
			
			$result = mysqli_query($db,$sql);
			$row = $result->fetch_object();
			$idPreg = $row->idPreg;


			if (file_exists($_FILES['file']['tmp_name'])||
                is_uploaded_file($_FILES['file']['tmp_name'])) {
                $ext=explode(".",$_FILES['file']["name"]);
                $nombreFile = $idPreg."-".generateFileName();
                if ($_FILES['file']['type']=="image/jpg" || $_FILES['file']['type']=="image/jpeg" ||
                	$_FILES['file']['type']=="image/png") {
                    $filename=$nombreFile.'.'. end($ext);
                    move_uploaded_file($_FILES['file']["tmp_name"],"imgResources/".$filename);
                    $sql = "insert into imagen_eval_escrita(codpreg,link,fechareg,codprof,estado) 
                    		values(".$idPreg.",'".$filename."','".$fecha."','".$codprof."',1)";
                    $result = mysqli_query($db,$sql);
                    echo "ok";
                    exit();    
                }else{
                    echo "errorFile";
                    exit();
                }                
            }

            echo "ok";
                                			

			break;
		case 'get_eval_alu'://obtener las evaluaciones de un estudiante
			$codalu = $_SESSION['app_user_id'];

			require 'includes/config.php';

            $db = mysqli_connect($servername, $username, $password, $database) 

                      or die('Error al intentar conectar con el servidor.');
            $acento = mysqli_query($db,"SET NAMES 'utf8'");
            //Validando que el usuario sea alumno

            $sql = "select * from alumno where codigo=".$codalu." and estado = 1";

              

            if(!$result = mysqli_query($db,$sql)){

                $resp = array("status"=>"errorSql1");

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


                if(!$result = mysqli_query($db,$sql)){

                	$resp = array("status"=>"errorSql2");

               		echo json_encode($resp);

                	exit();

                }


                $materias = array();

                $evaluaciones = array();



                while ($row = $result->fetch_object()) {

                    $codmat = $row->cod_mat;

                    $nombre = $row->descri;//Nombre de la materia

                  	$count=0;

                    //Obtener la lista de evaluaciones

                    $sql = "select * from evaluacion_escrita 

                    		where trimestre=".$trimestre." and codcur = ".$codCur." and 

                    		codpar = ".$codPar. " and codmat='".$row->cod_mat."' and 

                    		estado=1 and gestion=".$gestion." and completo = 1";
                    		



                   	if ($resultEva = mysqli_query($db,$sql)) {

                   		while ($rowEva = $resultEva->fetch_object()) {

                   			//Validando si el estudiante ya realizó el exámen

                   			$codeva = $rowEva->id;

                   			$sql = "select * 
                   					from evaluacion_proceso 
                   					where estado = 1 and codeva = ".$codeva." and 
                   					codalu = ".$codalu;



                   			$nota='sin nota';

                   			$estado = "0";
                   			$proceso = "0";

                   			if ($resultNota = mysqli_query($db,$sql)) {

                   				if($rowNota = $resultNota->fetch_object()){


                   					if ($rowNota->proceso=='0') {

                   						$nota = $rowNota->nota;

                   						$estado = "1";

                   					}else{
                   						$proceso = 1;
                   					}

                   				}else{
                   					$proceso = 2;
                   				}

                   			}else{

                   				$resp = array("status"=>"errorSql4");

			               		echo json_encode($resp);

			                	exit();

                   			}
                        $fechaActual = date("Y-m-d H:i:s");
                        if ((strtotime($fechaActual)<strtotime($rowEva->fecha_inicio) ||
                            strtotime($fechaActual)>=strtotime($rowEva->fecha_fin))&&$proceso=='2') {
                         $estado = "2";
                        }

                   			$evaluaciones[] = array(

                   									"codeva"=>$codeva,

                   									"codmat"=>$rowEva->codmat,

                   									"descripcion"=>$rowEva->descripcion,

                   									"nota"=>$nota,
                                    				"nro"=>$rowEva->nro,
                   									"estado"=>$estado,

                   									"detalle"=>detalle($rowEva->fecha_inicio,$rowEva->fecha_fin)

                   									);

                   			$count++;

                   		}

                   	}else{

                   		$resp = array("status"=>"errorSql3");

	               		echo json_encode($resp);

	                	exit();

                   	}

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

                   	$materias[] = array(

                   						"codmat"=>$codmat,

                   						"nombre"=>utf8_encode($nombre),

                   						"img"=>$img,

                   						"n_eva"=>$count

                   						);

                }

                if (count($materias)>0) {

                	$resp = array("status"=>"ok","materias"=>$materias,"evaluaciones"=>$evaluaciones);

                	echo json_encode($resp);

                }else{

                	$resp = array("status"=>"noMaterias");

                	echo json_encode($resp);

                }



                  

            }else{

            	$resp = array("status"=>"noPermitido");

                echo json_encode($resp);

            }
			break;
		case 'get_eval_proceso':
			$codalu = $_SESSION['app_user_id'];
			if(empty($codalu)){
			    echo "eSession";
			    exit();
			}
			$fechaActual = date("Y-m-d H:i:s");
			require 'includes/config.php';
            $db = mysqli_connect($servername, $username, $password, $database) 
                  or die('Error al intentar conectar con el servidor.');

            //Validando si el estudiante ya tiene una evaluación en proceso
            $sql = "select * 
            		from evaluacion_proceso 
            		where codalu = ".$codalu." and estado = 1 and 
            		proceso = 1";
            $result = mysqli_query($db,$sql);
            if($row = $result->fetch_object()){
            	$codeva = $row->codeva;
            	$idProce = $row->id;
            	$fechafin = $row->fecha_fin;
            	if(strtotime($fechaActual)<strtotime($fechafin)){
            		echo $codeva;
            		exit();
            	}else{
            		$sql = "update evaluacion_proceso set proceso = 0 where id = ".$idProce;
            		$result = mysqli_query($db,$sql);
            		echo "sinproceso";
            		exit();
            	}
            	
            	
            }else{
            	echo "sinproceso";
            	exit();
            }
			break;
		case 'init_eval':
			$fechaActual = date("Y-m-d H:i:s");
			$id = isset($_POST['id'])?$_POST['id']:"";

			if(empty($id)){
				echo "errorParam";
				exit();
			}
			$codalu = $_SESSION['app_user_id'];
			require 'includes/config.php';
            $db = mysqli_connect($servername, $username, $password, $database) 
                  or die('Error al intentar conectar con el servidor.');

            //Validando la evaluación
            $sql = "select * 
            		from evaluacion_escrita 
            		where completo = 1 and estado = 1 and id = ".$id;
            $result = mysqli_query($db,$sql);
            if($row = $result->fetch_object()){
            	$fi = $row->fecha_inicio;
            	$ff = $row->fecha_fin;
            	$time = $row->tiempo;
            	$preguntas = $row->preguntas;

            	if (strtotime($fechaActual)>= strtotime($fi)&&
            		strtotime($fechaActual)<strtotime($ff)) {
            		//Validando que la evaluación no está en proceso
            		$sql = "select * 
            				from evaluacion_proceso 
            				where estado = 1 and 
            				codalu = ".$codalu." and codeva = ".$id;
            		$result = mysqli_query($db,$sql);
            		if($row = $result->fetch_object()){
            			$proceso = $row->proceso;
            			if($proceso == '1'){
            				echo "inProcces";
            				exit();
            			}
            			if($proceso == '0'){
            				echo "evalFinalized";
            				exit();
            			}
            		}else{
            			//Obteniendo la cantidad de preguntas del examen
            			$sql = "select count(*) as total 
            					from pregunta_eval_escrito 
            					where estado = 1 and codeva = ".$id;
            			$result = mysqli_query($db,$sql);
            			$row = $result->fetch_object();
            			$total = $row->total;
            			//Generando las preguntas aleatoriamente
            			$npreg = 0;
            			$preg_seleccionadas = array();
            			while($npreg<$preguntas){
            				$n = rand(1,$total);
            				if(!in_array($n, $preg_seleccionadas)){
            					$preg_seleccionadas[] = $n;
            					$npreg++;
            				}
            			}

            			foreach($preg_seleccionadas as $n){
            				$sql = "select * 
            						from pregunta_eval_escrito 
            						where estado = 1 and nro = ".$n." and 
            						codeva = ".$id;
            				$result = mysqli_query($db,$sql);
            				$row = $result->fetch_object();
            				$idPreg = $row->id;
            				$sql = "insert into resp_eval_escrita(codalu,codpreg,fecha,estado)
            						values(".$codalu.",".$idPreg.",'".$fechaActual."',1)";
            				$result = mysqli_query($db,$sql);
            			}
            			$fechaFin = strtotime('+'.$time.' minute',strtotime($fechaActual));
            			$ffin = date("Y-m-d H:i:s",$fechaFin);
            			$sql = "insert into evaluacion_proceso(codalu,codeva,fecha_inicio,fecha_fin,proceso,estado) 
            					values(".$codalu.",".$id.",'".$fechaActual."','".$ffin."',1,1)";

            			$result = mysqli_query($db,$sql);


            			echo "ok";
            		}
            	}else{
            		echo "expired";
            		exit();
            	}
            }else{
            	echo "NoEval";
            	exit();
            }
			break;
		case 'getEvalInProccess':
			$fechaActual = date("Y-m-d H:i:s");
			$codalu = $_SESSION['app_user_id'];
			if(empty($codalu)){
			    echo json_encode(array("status"=>"eSession"));
			    exit();
			}
			require 'includes/config.php';
            $db = mysqli_connect($servername, $username, $password, $database) 
                  or die('Error al intentar conectar con el servidor.');
            $acento = mysqli_query($db,"SET NAMES 'utf8'");
            
            //Obteniendo la evaluacion en proceso
            $sql = "select ep.id,ep.codeva,ep.fecha_inicio,ep.fecha_fin,ee.descripcion,ee.nro,ee.tiempo,m.descri 
            		from evaluacion_proceso ep inner join evaluacion_escrita ee on 
            		ep.codeva = ee.id inner join materia m on 
            		ee.codmat = m.codmat and ep.estado = 1 and ep.proceso = 1 and 
            		ee.estado = 1 and ep.codalu = ".$codalu;
            $result = mysqli_query($db,$sql);
            if($row = $result->fetch_object()){
            	$id = $row->id;
            	$codeva = $row->codeva;
            	$fechaini = $row->fecha_inicio;//Hora de entrada al examen
            	$fechafin = $row->fecha_fin; //Hora de finalización del examen
            	$descripcion = $row->descripcion;
            	$nro = $row->nro;
            	$tiempo = $row->tiempo;
            	$materia = $row->descri;

            	//Validando que aun se pueda realizar el examen
            	if(strtotime($fechaActual)>=strtotime($fechaini)&&
            	   strtotime($fechaActual)<strtotime($fechafin)){
            	   	$tiempo_restante = strtotime($fechafin) - strtotime($fechaActual);
            		//Obteniendo preguntas de la evaluacion
            		$sql = "select ree.respuesta,pee.pregunta,ree.id as idResp,pee.id as idPreg  
            				from pregunta_eval_escrito pee inner join resp_eval_escrita ree on   
            				ree.codpreg = pee.id and pee.estado = 1 and 
            				ree.estado = 1 and pee.codeva = ".$codeva." and 
            				ree.codalu = ".$codalu;

            		$result = mysqli_query($db,$sql);
            		$lista_de_preguntas = array();
            		while ($row = $result->fetch_object()) {
            			$lista_de_preguntas[] = array(
            										"idPreg" => $row->idPreg,
            										"idResp" => $row->idResp,
            										"pregunta" => $row->pregunta,
            										"respuesta" => $row->respuesta
            											);
            		}
            		//Obteniendo las imagenes de las preguntas
            		$sql = "select * from imagen_eval_escrita where codpreg in (
            																	select pee.id as idPreg  
													            				from pregunta_eval_escrito pee inner join resp_eval_escrita ree on   
													            				ree.codpreg = pee.id and pee.estado = 1 and 
													            				ree.estado = 1 and pee.codeva = ".$codeva." and 
													            				ree.codalu = ".$codalu."
            																	) and estado = 1";
            		$result = mysqli_query($db,$sql);
            		$lista_de_imagenes = array();
            		while ($row = $result->fetch_object()) {
            			$lista_de_imagenes[] = array(
            										"idPreg" => $row->codpreg,
            										"link" =>$row->link
            										);
            		}
            		$info = array(
            						"idProc" => $id,
            						"codeva" => $codeva,
            						"horaIni" => $fechaini,
            						"horaFin" => $fechafin,
            						"descripcion" => $descripcion,
            						"nroEval" => $nro,
            						"tiempo" => $tiempo,
            						"materia" => $materia,
            						"resto"=> $tiempo_restante
            					);

            		echo json_encode(array(
            								"status"=>"ok",
            								"preguntas"=>$lista_de_preguntas,
            								"imagenes"=>$lista_de_imagenes,
            								"info"=>$info
            							));


            	}else{
            		$sql = "update evaluacion_proceso set proceso = 0 where id = ".$id;
            		$result = mysqli_query($db,$sql);
            		echo json_encode(array("status"=>"evalFinalized"));//Ya pasó el tiempo para resolvel el examen
            		exit();
            	}

            }else{
            	echo json_encode(array("status"=>"noEval"));
            	exit();
            }      
			break;
		case 'save_resp':
			$id = isset($_POST['idResp'])?$_POST['idResp']:"";
			$idProc = isset($_POST['idProc'])?$_POST['idProc']:"";
			$respuesta = isset($_POST['respuesta'])?$_POST['respuesta']:"";

			if(empty($id)||empty($respuesta))exit();

			$fechaActual = date("Y-m-d H:i:s");

			require 'includes/config.php';
            $db = mysqli_connect($servername, $username, $password, $database) 
                  or die('Error al intentar conectar con el servidor.');
            $acento = mysqli_query($db,"SET NAMES 'utf8'");
            //Validando que la evaluación está en proceso
            $sql = "select * 
            		from evaluacion_proceso 
            		where estado = 1 and id = ".$idProc;
            $result = mysqli_query($db,$sql);
            if($row = $result->fetch_object()){
            	$proceso = $row->proceso;
            	if ($proceso=="0") {
            		echo "finalizado";
            		exit();
            	}
            }else{
            	echo "noProc";
            	exit();
            }
            $sql = "update resp_eval_escrita set respuesta = '".$respuesta."',fecha = '".$fechaActual."'
            		where id = ".$id;
            $result = mysqli_query($db,$sql);

            exit();

			break;
		case 'finalizarEvaluacion':
			$id = isset($_POST['id'])?$_POST['id']:"";

			if(empty($id)){
				echo "errorParam";
				exit();
			}

			require 'includes/config.php';
            $db = mysqli_connect($servername, $username, $password, $database) 
                  or die('Error al intentar conectar con el servidor.');
            $acento = mysqli_query($db,"SET NAMES 'utf8'");

            $sql = "update evaluacion_proceso set proceso = 0
            		where id = ".$id;
            $result = mysqli_query($db,$sql);

            echo "ok";

            exit();
			break;
		case 'ver_evaluacion'://El alumno quiere revisar las respuestas de su examen
			$fechaActual = date("Y-m-d H:i:s");
			$codalu = $_SESSION['app_user_id'];
			$codeva = isset($_POST['id'])?$_POST['id']:"";

			if (empty($codeva)) {
				echo "errorParam";
				exit();
			}
			require 'includes/config.php';
            $db = mysqli_connect($servername, $username, $password, $database) 
                  or die('Error al intentar conectar con el servidor.');
            $acento = mysqli_query($db,"SET NAMES 'utf8'");
            
            //Obteniendo la evaluacion en proceso
            $sql = "select ep.id,ep.codeva,ep.fecha_inicio,ep.fecha_fin,ee.descripcion,ee.nro,ee.tiempo,m.descri 
            		from evaluacion_proceso ep inner join evaluacion_escrita ee on 
            		ep.codeva = ee.id inner join materia m on 
            		ee.codmat = m.codmat and ep.estado = 1 and  
            		ee.estado = 1 and ep.codalu = ".$codalu." and 
            		ep.codeva = ".$codeva;
            $result = mysqli_query($db,$sql);
            if($row = $result->fetch_object()){
            	$id = $row->id;
            	$codeva = $row->codeva;
            	$fechaini = $row->fecha_inicio;//Hora de entrada al examen
            	$fechafin = $row->fecha_fin; //Hora de finalización del examen
            	$descripcion = $row->descripcion;
            	$nro = $row->nro;
            	$tiempo = $row->tiempo;
            	$materia = $row->descri;

            	$tiempo_restante = strtotime($fechafin) - strtotime($fechaActual);
            		//Obteniendo preguntas de la evaluacion
            	$sql = "select ree.respuesta,pee.pregunta,ree.id as idResp,pee.id as idPreg,ree.nota   
            			from pregunta_eval_escrito pee inner join resp_eval_escrita ree on   
            			ree.codpreg = pee.id and pee.estado = 1 and 
            			ree.estado = 1 and pee.codeva = ".$codeva." and 
            			ree.codalu = ".$codalu;

            	$result = mysqli_query($db,$sql);
            	$lista_de_preguntas = array();
            	while ($row = $result->fetch_object()) {
            		$lista_de_preguntas[] = array(
            									"idPreg" => $row->idPreg,
            									"idResp" => $row->idResp,
            									"pregunta" => $row->pregunta,
            									"respuesta" => $row->respuesta,
            									"nota" => $row->nota
            										);
            	}
            	//Obteniendo las imagenes de las preguntas
            	$sql = "select * from imagen_eval_escrita where codpreg in (
            																select pee.id as idPreg  
												            				from pregunta_eval_escrito pee inner join resp_eval_escrita ree on   
												            				ree.codpreg = pee.id and pee.estado = 1 and 
												            				ree.estado = 1 and pee.codeva = ".$codeva." and 
												            				ree.codalu = ".$codalu."
            																) and estado = 1";
            	$result = mysqli_query($db,$sql);
            	$lista_de_imagenes = array();
            	while ($row = $result->fetch_object()) {
            		$lista_de_imagenes[] = array(
            									"idPreg" => $row->codpreg,
            									"link" =>$row->link
            									);
            	}
            	//Obtneniendo las observaciones de las respuestas
            	$sql = "select pee.id, oee.observacion 
            			from observacion_resp_eval_escrita oee inner join resp_eval_escrita ree on 
            			oee.id_resp = ree.id inner join pregunta_eval_escrito pee on 
            			ree.codpreg = pee.id and oee.estado = 1 and ree.estado = 1 and 
            			pee.estado = 1 and ree.codalu = ".$codalu." and pee.codeva = ".$codeva;
            	$result = mysqli_query($db,$sql);
            	$observaciones = array();
            	while ($row = $result->fetch_object()) {
            		$observaciones[] = array(
            								"codpreg" => $row->id,
            								"observacion" => $row->observacion
            								);
            	}
            	$info = array(
            					"idProc" => $id,
            					"codeva" => $codeva,
            					"horaIni" => $fechaini,
            					"horaFin" => $fechafin,
            					"descripcion" => $descripcion,
            					"nroEval" => $nro,
            					"tiempo" => $tiempo,
            					"materia" => $materia,
            					"resto"=> $tiempo_restante
            				);
            		echo json_encode(array(
           								"status"=>"ok",
           								"preguntas"=>$lista_de_preguntas,
           								"imagenes"=>$lista_de_imagenes,
           								"info"=>$info,
           								"observaciones"=>$observaciones
           							));
            }else{
           	echo json_encode(array("status"=>"noEval"));
           	exit();
           }      
			break;
		case 'obtener_calificaciones'://Obtener las calificaciones de los alumnos de un examen y las respuestas
			$codeva = isset($_POST['codeva'])?$_POST['codeva']:"";

			if (empty($codeva)) {
				echo "errorParam";
				exit();
			}

			require 'includes/config.php';
	        $db = mysqli_connect($servername, $username, $password, $database) 
	              or die('Error al intentar conectar con el servidor.');
	        $acento = mysqli_query($db,"SET NAMES 'utf8'");

	        

			break;
		case 'get_list_alumn'://Se obtiene la lista de alumnos y sus calificaciones
			$codeva = isset($_POST['codeva'])?$_POST['codeva']:"";
			if(empty($codeva)){
				echo "errorParam";
				exit();
			}
			require 'includes/config.php';
	        $db = mysqli_connect($servername, $username, $password, $database) 
	              or die('Error al intentar conectar con el servidor.');
	        $acento = mysqli_query($db,"SET NAMES 'utf8'");

	        $sql = "select * 
	        		from evaluacion_escrita 
	        		where id = ".$codeva." and estado = 1";

	        $result = mysqli_query($db,$sql);

	        if($row = $result->fetch_object()){
	        	$codcur = $row->codcur;
	        	$codpar = $row->codpar;
	        	$sql = "select codigo,concat(paterno,' ',materno,' ',nombres) as nombre 
	        			from alumno 
	        			where estado = 1 and cod_cur = ".$codcur." and cod_par = ".$codpar." 
	        			order by nombre asc" ;
	        	$result = mysqli_query($db,$sql);
	        	$lista_alumnos = array();
	        	while ($row = $result->fetch_object()) {
	        		$lista_alumnos[] = array(
	        								"codalu" => $row->codigo,
	        								"nombre" => $row->nombre
	        								);
	        	}

	        	$sql = "select ep.codalu,ep.nota,ep.calificado  
	        			from evaluacion_proceso ep inner join evaluacion_escrita ee on 
	        			ep.codeva = ee.id and ep.proceso = 0 and ee.estado = 1 and ep.estado = 1 and ee.id = ".$codeva;

	        	$result = mysqli_query($db,$sql);
	        	$lista_de_notas = array();
	        	while ($row = $result->fetch_object()) {
	        		$lista_de_notas[] = array(
	        								"codalu" => $row->codalu,
	        								"nota" => $row->nota,
	        								"calificado" => $row->calificado
	        								);
	        	}

	        	echo json_encode(array(
	        							"status" => "ok",
	        							"lista" => $lista_alumnos,
	        							"notas" => $lista_de_notas
	        							));
	        	exit();
	        	

	        }else{
	        	echo "noEval";
	        	exit();
	        }
			break;
		case 'respuesta-alumno':
			$codalu=isset($_POST['codalu'])? $_POST['codalu']:'';
			$codeva=isset($_POST['codeva'])? $_POST['codeva']:'';
			if (empty($codalu)||empty($codeva)) {
				echo "errorParam";
				exit();
			}
			require 'includes/config.php';
	        $db = mysqli_connect($servername, $username, $password, $database) 
	              or die('Error al intentar conectar con el servidor.');
	        $acento = mysqli_query($db,"SET NAMES 'utf8'");
	        $sql="select ree.id as id_resp,pee.pregunta,ree.nota,ree.respuesta,pee.id as idpreg
	        	from resp_eval_escrita ree inner join pregunta_eval_escrito pee on ree.codpreg=pee.id and 
	        	ree.codalu=".$codalu." and pee.codeva=".$codeva." and ree.estado=1 and pee.estado=1";
	        	$result=mysqli_query($db,$sql);
	        	$respuestas=array();
	        	while ($row=$result->fetch_object()) {
	        		$respuestas[]=array( 
	        							"idresp"=>$row->id_resp, 
	        						 	"pregunta"=>$row->pregunta,
	        						 	"nota"=>$row->nota,
	        						 	"respuesta"=>$row->respuesta,
	        						 	"idpreg"=>$row->idpreg);
	        	}
	        $sql="select iee.codpreg,iee.link
	        	from resp_eval_escrita ree inner join pregunta_eval_escrito pee on ree.codpreg=pee.id 
	        	inner join imagen_eval_escrita iee on iee.codpreg=pee.id and ree.codalu=".$codalu." and pee.codeva=".$codeva."
	        	and ree.estado=1 and pee.estado=1 and iee.estado=1";
	           	$result=mysqli_query($db,$sql);
	        	$imagenes=array();
	        	while ($row=$result->fetch_object()) {
	        		$imagenes[]=array( 
	        							"codpreg"=>$row->codpreg, 
	        						 	"link"=>$row->link);
	        	}
	        $sql="select oree.id_resp, oree.observacion
	        	from resp_eval_escrita ree inner join pregunta_eval_escrito pee on ree.codpreg=pee.id inner join observacion_resp_eval_escrita oree on oree.id_resp=ree.id and ree.codalu=".$codalu." and pee.codeva=".$codeva." and ree.estado=1 and pee.estado=1 and oree.estado=1";
	         	$result=mysqli_query($db,$sql);
	        	$observaciones=array();
	        	while ($row=$result->fetch_object()) {
	        		$observaciones[]=array( 
	        							"id_resp"=>$row->id_resp, 
	        						 	"observacion"=>$row->observacion);
	        	}
	        	echo json_encode(array("status"=>"ok","respuestas"=>$respuestas,"imagenes"=>$imagenes,"observaciones"=>$observaciones));

			break;
		case 'cra':
				$codalu=isset($_POST["codalu"])? $_POST["codalu"]:"";
				$idresp=isset($_POST["idresp"])? $_POST['idresp']:"";
				$nota=isset($_POST["nota"])?$_POST["nota"]:"0";
				$obs=isset($_POST["obs"])?$_POST["obs"]:"";
				if (empty($codalu)||empty($idresp)){
					echo "errorParam";
					exit();
				}
				$codprof=$_SESSION["app_user_id"];
				$fechaActual=date("Y-m-d H:i:s");
				require 'includes/config.php';
        		$db = mysqli_connect($servername, $username, $password, $database) 
              	or die('Error al intentar conectar con el servidor.');
        		$acento = mysqli_query($db,"SET NAMES 'utf8'");
        		$sql="update resp_eval_escrita set nota='".$nota."' ,fechaCalif='".$fechaActual."' , codprof='".$codprof."',calificado = 1 where id=".$idresp;
        		$result=mysqli_query($db,$sql);
				
				//Obteniendo el codigo de la evaluacion
				$sql = "select pee.codeva,pee.id  
						from resp_eval_escrita ree inner join pregunta_eval_escrito pee on 
						ree.codpreg = pee.id and ree.id = ".$idresp;

				$result = mysqli_query($db,$sql);

				$row = $result->fetch_object();

				$codeva = $row->codeva;

				//Sumar las notas de la evaluacion

				$sql = "select sum(ree.nota) as nota 
						from resp_eval_escrita ree inner join pregunta_eval_escrito pee on 
						ree.codpreg = pee.id and pee.codeva = ".$codeva." and ree.codalu = ".$codalu;


				$result = mysqli_query($db,$sql);

				$row = $result->fetch_object();

				$nota = $row->nota;
				//Obteniendo los datos de la evaluacion
				$sql = "select * from evaluacion_escrita where id = ".$codeva;

				$result = mysqli_query($db,$sql);
				$row = $result->fetch_object();
				$nPreg = $row->preguntas;


				//Validando que todas las respuestas esten calificadas
				$sql = "select count(*) as resp_no_calificadas  
						from resp_eval_escrita ree inner join pregunta_eval_escrito pee on 
						ree.codpreg = pee.id and ree.calificado = 0 and pee.codeva = ".$codeva." and ree.codalu =".$codalu;

				$result = mysqli_query($db,$sql);

				$row = $result->fetch_object();
				$respuestas_no_calificadas = $row->resp_no_calificadas;
				$calif = 0;
				if($respuestas_no_calificadas == 0){
					$calif = 1;
				}
				$sql = "update evaluacion_proceso set nota = ".$nota." ,calificado = ".$calif.", proceso = 0  
						where codalu = ".$codalu." and codeva = ".$codeva." and estado = 1";

				
				$result = mysqli_query($db,$sql);

        		if (!empty($obs)){
        			$sql="select * from observacion_resp_eval_escrita where id_resp=".$idresp. " and estado=1";
        			$result=mysqli_query($db,$sql);
        			if($row=$result->fetch_object()){
        				$sql="update observacion_resp_eval_escrita set observacion='".$obs."' ,fecha='".$fechaActual."',codprof='".$codprof."'";
        				$result=mysqli_query($db,$sql);
        				echo "ok";
        				exit();

        			}else{
        				$sql="insert into observacion_resp_eval_escrita (id_resp,observacion,fecha,codprof,estado) values(".$idresp.",'".$obs."','".$fechaActual."','".$codprof."',1)";
        				$result=mysqli_query($db,$sql);
        				echo "ok";
        				exit();
        			}
        		}else{
        			echo "ok";
        		}
			 	// code...
			 	break;
		case 'calificar_presencial':
			$codprof=$_SESSION["app_user_id"];
			if(!cliente_activo()||empty($codprof)){
				echo "eSession";
				exit();
			}

			$codalu = isset($_POST["codalu"])? $_POST["codalu"]:"";
			$codeva = isset($_POST["codeva"])? $_POST["codeva"]:"";
			$nota = isset($_POST["nota"])? $_POST["nota"]:"";

			if (empty($codalu)||empty($codeva)||empty($nota)){
					echo "errorParam";
					exit();
			}

			require'modelo/modelo_evaluacion_escrita.php';
			require'modelo/conexion.php';
			$db = Conectar::conexion();
			$eval_escrita = new EvaluacionEscrita($db);

			echo $eval_escrita->save_calificacion($codalu,$codeva,$nota);

			break;
		case 'delete_pregunta':
			$codpreg=isset($_POST["codpreg"])? $_POST["codpreg"]:"";
			if (empty($codpreg)){
					echo "errorParam";
					exit();
			}
			require 'includes/config.php';
        	$db = mysqli_connect($servername, $username, $password, $database) 
              	  or die('Error al intentar conectar con el servidor.');
        	$acento = mysqli_query($db,"SET NAMES 'utf8'");

        	//Obteniendo el código de evaluación al que pertenece la pregunta

        	$sql = "select * from pregunta_eval_escrito where id = ".$codpreg;

        	$result = mysqli_query($db,$sql);

        	$row = $result->fetch_object();

        	$codeva = $row->codeva;
        	$nro = $row->nro;

        	$sql = "update pregunta_eval_escrito set estado = 0 where id = ".$codpreg;

        	$result = mysqli_query($db,$sql);

        	//Actualizando el número de pregunta

        	$sql = "update pregunta_eval_escrito set nro = nro - 1 where codeva = ".$codeva." and 
        			nro > ".$nro." and estado = 1";
        	$result = mysqli_query($db,$sql);

        	echo "ok";
			
			break;
		case 'delete_imagen':
			$idImagen=isset($_POST["idImagen"])? $_POST["idImagen"]:"";
			if (empty($idImagen)){
					echo "errorParam";
					exit();
			}
			require 'includes/config.php';
        	$db = mysqli_connect($servername, $username, $password, $database) 
              	  or die('Error al intentar conectar con el servidor.');
        	$acento = mysqli_query($db,"SET NAMES 'utf8'");

        	$sql = "update imagen_eval_escrita set estado = 0 where id = ".$idImagen;
        	$result = mysqli_query($db,$sql);
        	echo "ok";
			break;
		case 'update_pregunta':
			$codpreg=isset($_POST["codpreg"])? $_POST["codpreg"]:"";
			$pregunta = isset($_POST['pregunta'])?$_POST['pregunta']:"";
			if (empty($codpreg)){
					echo "errorParam";
					exit();
			}
			require 'includes/config.php';
        	$db = mysqli_connect($servername, $username, $password, $database) 
              	  or die('Error al intentar conectar con el servidor.');
        	$acento = mysqli_query($db,"SET NAMES 'utf8'");

        	$codprof = $_SESSION['app_user_id'];
		    $fecha = date("Y-m-d H:i:s");

		    $sql = "update pregunta_eval_escrito set pregunta = '".$pregunta."',
		    									 fecha = '".$fecha."',
		    									 codprof = '".$codprof."' 
		    		where id = ".$codpreg;

		    $result = mysqli_query($db,$sql);

		    if (file_exists($_FILES['file']['tmp_name'])||
                is_uploaded_file($_FILES['file']['tmp_name'])) {
                $ext=explode(".",$_FILES['file']["name"]);
                $nombreFile = $codpreg."-".generateFileName();
                if ($_FILES['file']['type']=="image/jpg" || $_FILES['file']['type']=="image/jpeg" ||
                	$_FILES['file']['type']=="image/png") {
                    $filename=$nombreFile.'.'. end($ext);
                    move_uploaded_file($_FILES['file']["tmp_name"],"imgResources/".$filename);
                    
                    //Verificando si hay imagen previa
                    $sql = "select * from imagen_eval_escrita where estado = 1 and codpreg = ".$codpreg;
                    $result = mysqli_query($db,$sql);

                    if($row = $result->fetch_object()){
                    	$id_imagen = $row->id;
                    	$link = $row->link;
                    	unlink("imgResources/".$link);
                    	$sql = "update imagen_eval_escrita set link = '".$filename."' where id = ".$id_imagen;
                    	$result = mysqli_query($db,$sql);
                    	echo "ok";
                    	exit();
                    }else{
                    	$sql = "insert into imagen_eval_escrita(codpreg,link,fechareg,codprof,estado) 
                    			values(".$codpreg.",'".$filename."','".$fecha."','".$codprof."',1)";
                    	$result = mysqli_query($db,$sql);
                    	echo "ok";
                    	exit();
                    }
                    exit();    
                }else{
                    echo "errorFile";
                    exit();
                }                
            }
            echo "ok";

			break;
		default:
			echo "errorOP";
			break;
	}
}else{
	echo "errorOP";
	exit();
}
function generateFileName()
{
$chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789_";
$name = "";
for($i=0; $i<6; $i++)
$name.= $chars[rand(0,strlen($chars) - 1)];
return $name;
}
function mismoMes($f_inicio,$f_fin){
  $anioi = date("Y",strtotime($f_inicio));
  $mesi = date("m",strtotime($f_inicio));
  $aniof = date("Y",strtotime($f_inicio));
  $mesf = date("m",strtotime($f_fin));
  return $anioi==$aniof&&$mesi==$mesf;
}
function detalle($f_ini,$f_f){
  $f_inicio = substr($f_ini,0,10);
  $horai = substr($f_ini,11,8);

  $f_fin = substr($f_f,0,10);
  $horaf = substr($f_f,11,8);
  $diai = substr($f_inicio,8,2);
  $diaf = substr($f_fin,8,2);
  
  if (strtotime($f_f)<strtotime(date("Y-m-d H:i:s"))) {
    if ($f_inicio==$f_fin) {
      return "La evaluación estubo habilitada el día ".formatodefecha($f_inicio)." desde las ".substr($horai, 0,5)." hrs. hasta las ".substr($horaf, 0,5)." hrs.";
    }
    if(mismoMes($f_inicio,$f_fin)){
      return "La evaluación estubo habilitada desde las ".substr($horai, 0,5)." hrs. del día ".getndia($f_inicio)." ".$diai." hasta las ".substr($horaf, 0,5)." hrs. del día ".getndia($f_fin)." ".$diaf." de ".getnmes($f_inicio);
    }
    return "La evaluación estubo habilitada desde las ".substr($horai, 0,5)." hrs. del día ".formatodefecha($f_inicio)." hasta las ".substr($horaf, 0,5)." hrs. del día ".formatodefecha($f_fin); 
  }

  if ($f_inicio==$f_fin) {
    return "Evaluación disponible desde el día ".formatodefecha($f_inicio)." desde las ".substr($horai, 0,5)." hrs. hasta las ".substr($horaf, 0,5)." hrs.";
  }
  if(mismoMes($f_inicio,$f_fin)){
      return "Evaluación disponible desde las ".substr($horai, 0,5)." hrs. del día ".getndia($f_inicio)." ".$diai." hasta las ".substr($horaf, 0,5)." hrs. del día ".getndia($f_fin)." ".$diaf." de ".getnmes($f_inicio);
    }
    return "Evaluación disponible desde las ".substr($horai, 0,5)." hrs. del día ".formatodefecha($f_inicio)." hasta las ".substr($horaf, 0,5)." hrs. del día ".formatodefecha($f_fin); 
}
function getndia($f_inicio){
  return getnombreDia(deleteCero(date('N',strtotime($f_inicio))));
}
function getnmes($f_inicio){
  return getnombreMes(deleteCero(date('m',strtotime($f_inicio))));
}
function getnombreMes($mes){
  $meses = array("enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre");
  return $meses[$mes-1];
}

function getnombreDia($dia){
  $dias = array("Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo");
  return $dias[$dia-1];
}

function formatodefecha($fecha){
    $time = strtotime($fecha);
    $numbDia = date("N",$time);
    
  $nombreDia = getnombreDia($numbDia);
  
    $numbMes = date("n",$time);
    
  $nombreMes = getnombreMes($numbMes);
  $anio = substr($fecha, 0,4);
  $dia = deleteCero(substr($fecha, 8,2));

  return $nombreDia.', '.$dia.' de '.$nombreMes.' de '.$anio;
  
}
function deleteCero($string){

  if (substr($string, 0,1)=='0') {
    return substr($string, 1,1);
  }else{
    return $string;
  }
}
?>