<?php 
session_start();
require 'includes/functions.php';

if(!cliente_activo())
{
  	echo "eSession";
  	exit();
}
if ($_GET) {
	switch ($_GET['op']) {
		case 'spwp'://Guardar practicos web por parte del profesor
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
                            $fecha = $_POST['fecha'];
                            $hora = $_POST['hora'];
                            $codpractico = $_POST['codpractico'];
                            $descripcion = $_POST['descripcion'];
                            $npreg = $_POST['npreg'];//Numero de preguntas que tiene el practico
                            $gestion = date("Y");
                            $trimestre = $_SESSION['app_user_bimestre'];
                            $codprof = $_SESSION['app_user_id'];
                            $fechaReg = date("Y-m-d H:i:s");
                            $nota = $_POST['nota'];
  
                            $arrayPreg = array();
                            
                            require 'includes/config.php';
                            $db = mysqli_connect($servername, $username, $password, $database) 
                                or die('Error al intentar conectar con el servidor.');

                            //Validando que el usuario sea profesor
                            $sql = "select * 
                            		from profe 
                            		where codprof='".$codprof."' and estado='activo'";
                            if ($result = mysqli_query($db,$sql)) {
                            	if (!$row = $result->fetch_object()) {
                            		echo "noPermitido";
                            		exit();
                            	}
                            }else{
                            	echo "errorSqlProf";
                            	exit();
                            }
                            if ($npreg>0) {
                                for ($i=0; $i < $npreg; $i++) { 
                                    if (isset($_POST['preg'.($i+1)])&&!empty($_POST['preg'.($i+1)])) {
                                        $arrayPreg[]=$_POST['preg'.($i+1)];
                                    }else{
                                        echo "errorPreguntas";
                                        exit();
                                    }
                                }

                                if ($npreg!=count($arrayPreg)) {//La cantidad de preguntas mediante post debe ser igual
                                    echo "errorPreguntas";      //al numero de preguntas dadas en $npreg
                                    exit();
                                }
                                //echo $npreg.'  :  '.count($arrayPreg);

                                if(empty($codpractico)){
                                    $sql = "select insertpracticoweb(".$gestion.",".$trimestre.",".$codcur.",
                                        ".$codpar.",'".$codmat."','".$descripcion."','".$codprof."','".$fecha."','".$hora."',1,'".$fechaReg."',".$nota.") as id";
                                    
                                    
                                    if ($result = mysqli_query($db,$sql)) {
                                        $id = $result->fetch_object();
                                        for ($i=0; $i < count($arrayPreg); $i++) { 
                                            $sql = "insert into pregunta_pract_web(codpractweb,npreg,pregunta,codprof,fecha,hora,estado)
                                                    values(".$id->id.",".($i+1).",'".$arrayPreg[$i]."','".$codprof."','".$fecha."','".$hora."',1)";
                                            if(!$result1 = mysqli_query($db,$sql)){
                                                echo "errorSQL";
                                                exit();
                                            }
                                        }
                                        echo "ok";

                                    }else{
                                        echo "errorSql";
                                    }
                                }else{
                                    //Validando que el practico exista y que le pertenezca al curso y materia del profesor
                                    $sql = "select * 
                                            from prof_cur_mat pcm inner join practicos_web pw on 
                                            pcm.gestion=pw.gestion and pw.trimestre=".$trimestre." and pcm.codcur=pw.codcur and 
                                            pcm.codpar=pw.codpar and pcm.codmat=pw.codmat and pcm.estado='activo' and pw.estado=1 and 
                                            pcm.prof='".$codprof."' and pcm.gestion=".$gestion." and pw.id=".$codpractico;
                                    
                                    if ($resulPractico = mysqli_query($db,$sql)) {
                                        if ($row = $resulPractico->fetch_object()) {
                                        	//Verificando que ningun estudiante hubiese realizado el practico
                                        	$sql = "select * 
                                        			from practicos_web_alumno 
                                        			where codpractweb=".$codpractico." and estado = 1";
                                        	if (!$resultVPWA = mysqli_query($db,$sql)) {
                                                echo "errorSQLPWA";
                                                exit();
                                            }
                                            if($rowPWA = $resultVPWA->fetch_object()){
                                            	echo "noEdit"; //El profesor ya no puede editar el práctico
                                                exit();
                                            } 
                                            //Actualizando practico
                                            $sql = "update practicos_web set descripcion='".$descripcion."',fecha='".$fecha."',hora='".$hora."',nota=".$nota." where id=".$codpractico;
                                            if (!$resultUP = mysqli_query($db,$sql)) {
                                                echo "errorSQL";
                                                exit();
                                            }
                                        }else{
                                            echo "noPermitido";
                                            exit();
                                        }
                                    }else{
                                        echo "errorSql";
                                        exit();
                                    }
                                    //Si hay un error en el codigo anterior el servidor detiene el proceso de guardado y ya no ejecuta las instrucciones de abajo

                                    //Obteniendo la cantidad de preguntas que tiene el practico
                                    $sql = "select count(*) as npreg from pregunta_pract_web where codpractweb=".$codpractico." and estado=1";
                                    if ($result2 = mysqli_query($db,$sql)) {
                                        $rowpreg = $result2->fetch_object();

                                        if ($rowpreg->npreg==0) {
                              
                                            for ($i=0; $i < count($arrayPreg); $i++) { 
                                                $sql = "insert into pregunta_pract_web(codpractweb,npreg,pregunta,codprof,fecha,hora,estado)
                                                    values(".$codpractico.",".($i+1).",'".$arrayPreg[$i]."','".$codprof."','".$fecha."','".$hora."',1)";
                                                if(!$result1 = mysqli_query($db,$sql)){
                                                  echo "errorSQL";
                                                  exit();
                                                }
                                            }
                                            echo "ok";
                                            exit();
                                        }
                                    
                                        if ($rowpreg->npreg==$npreg) {
                                      
                                            for ($i=0; $i < count($arrayPreg); $i++) { 
                                                
                                                $sql = "update pregunta_pract_web set pregunta='".$arrayPreg[$i]."',codprof='".$codprof."',
                                                        fecha='".$fecha."',hora='".$hora."' where codpractweb=".$codpractico." and npreg=".($i+1)." and estado=1";
                                                     
                                                if(!$result1 = mysqli_query($db,$sql)){
                                                    echo "errorSQL";
                                                    exit();
                                                }
                                            }
                                            echo "ok";
                                            exit();
                                        }

                                        if ($rowpreg->npreg>$npreg) {
                      
                                            for ($i=0; $i < count($arrayPreg); $i++) { 
                                                $sql = "update pregunta_pract_web set pregunta='".$arrayPreg[$i]."',codprof='".$codprof."',
                                                        fecha='".$fecha."',hora='".$hora."' where codpractweb=".$codpractico." and npreg=".($i+1)." and estado=1";
                                                if(!$result1 = mysqli_query($db,$sql)){
                                                    echo "errorSQL";
                                                    exit();
                                                }
                                            }
                                            //Deshabilitando las preguntas que han sobrado
                                            $sql = "update pregunta_pract_web set estado=0 where codpractweb=".$codpractico." and npreg>".$npreg." and estado=1";
                                            if ($resulPregfal = mysqli_query($db,$sql)) {
                                                echo "ok";
                                                exit();
                                            }else{
                                                echo "errorSQL";
                                                exit();
                                            }
                                            
                                        }
                                        if ($rowpreg->npreg<$npreg) {
                           
                                            for ($i=0; $i < count($arrayPreg); $i++) { 

                                                if ($i<$rowpreg->npreg) {
                                                    $sql = "update pregunta_pract_web set pregunta='".$arrayPreg[$i]."',codprof='".$codprof."',
                                                        fecha='".$fecha."',hora='".$hora."' where codpractweb=".$codpractico." and npreg=".($i+1)." and estado=1";
                                                    if(!$result1 = mysqli_query($db,$sql)){
                                                        echo "errorSQL";
                                                        exit();
                                                    }
                                                }else{
                                                    $sql = "insert into pregunta_pract_web(codpractweb,npreg,pregunta,codprof,fecha,hora,estado)
                                                    values(".$codpractico.",".($i+1).",'".$arrayPreg[$i]."','".$codprof."','".$fecha."','".$hora."',1)";
                                                    if(!$result1 = mysqli_query($db,$sql)){
                                                        echo "errorSQL1";
                                                        exit();
                                                    }
                                                }
                                                
                                            }
                                            echo "ok";
                                            exit();
    
                                        }

                                    }else{
                                        echo "errorSQL";
                                    }
                                }

                            }else{
                                echo "errorPreguntas";
                            }

                        }else{
                            echo "errorParam";
                        }
                        
                        break;
        case 'gpwp'://Obtener los prácticos web de un profesor
        	$codprof = $_SESSION['app_user_id'];

        	require 'includes/config.php';
            $db = mysqli_connect($servername, $username, $password, $database) 
                or die('Error al intentar conectar con el servidor.');

            //Validando que el usuario sea profesor.
            $sql = "select * 
                    from profe 
                    where codprof='".$codprof."' and estado='activo'";
            
            if ($result = mysqli_query($db,$sql)) {
                if (!$row = $result->fetch_object()) {
                    echo "noPermitido";
                    exit();
                }
            }else{
                echo "errorSqlProf";
                exit();
            }
            
        	$gestion = date("Y");
        	$trimestre = $_SESSION['app_user_bimestre'];
        	//Obteniendo todos lo prácticos del curso asignados a las materias que pasa el profesor en ese curso
        	$practicos = array();
        	$sql = "select pw.id,pw.codmat,pw.descripcion,pw.codcur,pw.codpar,pw.fecha,pw.hora, pw.nota  
        			from prof_cur_mat pcm inner join practicos_web pw on 
        			pcm.codcur=pw.codcur and pcm.codpar=pw.codpar and pcm.codmat=pw.codmat and 
        			pcm.gestion=pw.gestion and pcm.estado = 'activo' and pw.estado=1 and 
        			pcm.prof='".$codprof."' and pcm.gestion=".$gestion." and pw.trimestre=".$trimestre;
        	if (!$resulPractico = mysqli_query($db,$sql)) {
        		$resp = array("status"=>"errorSqlPract");
        		echo json_encode($resp);
        		exit();
        	}

        	while ($rowPract = $resulPractico->fetch_object()) {
        		$practicos[] = array(
        						"id"=>$rowPract->id,
        						"codcur"=>$rowPract->codcur,
        						"codpar"=>$rowPract->codpar,
        						"codmat"=>$rowPract->codmat,
        						"fecha"=>$rowPract->fecha,
        						"fechalimite"=>fechaPres($rowPract->fecha,$rowPract->hora),
        						"hora"=>substr($rowPract->hora,0,5),
        						"descripcion"=>utf8_encode($rowPract->descripcion),
        						"nota"=>$rowPract->nota
        						);
        	}
        	$preguntas = array();
        	for ($i=0; $i < count($practicos); $i++) { 
        		$codpract=$practicos[$i]['id'];
        		//Obteniendo las preguntas del práctico
        		$sql = "select * 
        				from pregunta_pract_web 
        				where codpractweb=".$codpract." and estado=1 order by npreg asc";
        		
        		if (!$resultPreg = mysqli_query($db,$sql)) {
        			$resp = array("status"=>"errorSqlPreg");
	        		echo json_encode($resp);
	        		exit();
        		}

        		while ($rowpreg = $resultPreg->fetch_object()) {
        			$preguntas[] = array(
        								"codpractico"=>$codpract,
        								"npreg"=>$rowpreg->npreg,
        								"pregunta"=>$rowpreg->pregunta
        								);
        		}
        	}
        	if (count($practicos)>0) {
        		$resp = array(
        					"status"=>"ok",
        					"practicos"=>$practicos,
        					"preguntas"=>$preguntas
        					);
	        	echo json_encode($resp);
        	}else{
        		$resp = array("status"=>"noPracticos");
	        	echo json_encode($resp);
        	}

        	break;
        case 'dpwp'://Eliminar un práctico web sólo el profesor puede hacerlo
        	
        	if (!isset($_POST['codpractico'])&&empty($_POST['codpractico'])) {
        		echo "errorParam";
        		exit();
        	}

        	$codpractico = $_POST['codpractico'];
        	$codprof = $_SESSION['app_user_id'];
        	$gestion = date("Y");

        	require 'includes/config.php';
            $db = mysqli_connect($servername, $username, $password, $database) 
                or die('Error al intentar conectar con el servidor.');

            //Validando que el usuario tenga permiso para eliminar el práctico
            $sql = "select * 
            		from prof_cur_mat pcm inner join practicos_web pw on 
            		pcm.codcur = pw.codcur and pcm.codpar=pw.codpar and pcm.codmat = pw.codmat and 
            		pcm.gestion = pw.gestion and pcm.estado = 'activo' and 
            		pw.estado = 1 and pcm.prof='".$codprof."' and pw.id=".$codpractico." and 
            		pcm.gestion = ".$gestion;
                    

            if (!$resultPract = mysqli_query($db,$sql)) {
        			
	        		echo "errorSqlPract";
	        		exit();
        	}

        	if ($rowPract = $resultPract->fetch_object()) {
        		//Eliminando el práctico
        		$sql = "update practicos_web set estado = 0 where id=".$codpractico;
        		if (!$resultDelete = mysqli_query($db,$sql)) {
	        		echo "errorSqlDelete";
	        		exit();
        		}
        		$sql = "update practicos_web_alumno set estado = 0 where codpractweb=".$codpractico;
        		if (!$resultDelete = mysqli_query($db,$sql)) {
	        		echo "errorSqlPWA";
	        		exit();
        		}
        		$sql = "update resp_pract_web set estado = 0 where practweb=".$codpractico;
        		if (!$resultDelete = mysqli_query($db,$sql)) {
	        		echo "errorSqlRPWA";
	        		exit();
        		}
        		echo "ok";
        	}else{
	        	echo "noPermitido";
	        	exit();
        	}

        	break;
        case 'gpwa'://Obtener los prácticos de un estudiante
        	
        	$codalu = $_SESSION['app_user_id'];

        	require 'includes/config.php';
            $db = mysqli_connect($servername, $username, $password, $database) 
                or die('Error al intentar conectar con el servidor.');

        	//Validando que el usuario sea un estudiante habilitado
            $sql = "select cod_cur,cod_par 
            		from alumno 
            		where codigo = ".$codalu." and estado = 1";
            if (!$resultAlu = mysqli_query($db,$sql)) {
            	$resp = array("status"=>"errorSqlAlumo");
            	echo json_encode($resp);
            	exit();
            }
            if (!$rowAlu = $resultAlu->fetch_object()) {
            	$resp = array("status"=>"noPermitido");
            	echo json_encode($resp);
            	exit();
            }
            //-------------------------------------------------------------------
            $codcur = $rowAlu->cod_cur;
            $codpar = $rowAlu->cod_par;

            //Obteniendo el nombre del curso del estudiante
            $sql = "select concat(c.descrip,' - ',p.descrip) as nombre 
            		from cursos c , paralelos p 
            		where c.codigo=".$codcur." and p.cod_par=".$codpar;
            $nombreCurso = "";
            if ($nombCur = mysqli_query($db,$sql)) {
            	if ($rowNC = $nombCur->fetch_object()) {
            		$nombreCurso = $rowNC->nombre;
            	}
            }else{
            	$resp = array("status"=>"errorSqlNC");
            	echo json_decode($resp);
            	exit();
            }
            $gestion = date("Y");
            $trimestre = $_SESSION['app_user_bimestre'];

            $sql = "select cm.cod_mat,m.descri 
            		from cur_mat cm inner join materia m on 
            		cm.cod_mat=m.codmat and cm.cod_cur = ".$codcur." and 
            		cm.cod_par = ".$codpar." and cm.estado = 1";

            if (!$resultMate= mysqli_query($db,$sql)) {
            	$resp = array("status"=>"errorSqlMaterias");
            	echo json_encode($resp);
            	exit();
            }

            $materias = array();
            $practicos = array(); 
            $preguntas = array();
            $respuestas = array();
            while ($rowMate = $resultMate->fetch_object()) {
            	$codmat = $rowMate->cod_mat;
                $nombre = utf8_encode($rowMate->descri);//Nombre de la materia
                //Obteniendo los prácticos de la materia
                $sql = "select * 
                		from practicos_web 
                		where trimestre=".$trimestre." and codcur = ".$codcur." and 
                		codpar = ".$codpar. " and codmat='".$codmat."' and estado=1";

                if (!$resultPracticos= mysqli_query($db,$sql)) {
            		$resp = array("status"=>"errorSqlPracticos");
            		echo json_encode($resp);
            		exit();
            	}
            	$cont = 0;
            	while ($rowPrac = $resultPracticos->fetch_object()) {
            		$idpractico = $rowPrac->id;
                    $descripcion = $rowPrac->descripcion;
                    $presentado = "0";
            		$editable = "1";
            		$fecha = $rowPrac->fecha;
            		$hora = $rowPrac->hora;
            		$presentacion = fechaPres($fecha,$hora);
            		$nota = "sin nota";
            		//Verificando que el estudiante ha presentado el parctico
            		$sql = "select * 
            		 		from practicos_web_alumno 
            		 		where codpractweb=".$idpractico." and estado = 1 and 
            		 		codalumno=".$codalu;

            		if (!$resultpwa= mysqli_query($db,$sql)) {
            			$resp = array("status"=>"errorSqlPWA");
            			echo json_encode($resp);
            			exit();
            		}

            		if ($rowRPW = $resultpwa->fetch_object()) {//El estudiante ha realizado el práctico
            			$presentado = "1";
            			$editable = $rowRPW->editable;
            			$nota = $rowRPW->nota;
            			//Obteniendo las respuestas del practico
            			$sql = "select rpw.npreg,rpw.respuesta,ppw.pregunta 
            					from pregunta_pract_web ppw inner join resp_pract_web rpw on 
            					ppw.codpractweb = rpw.practweb and ppw.npreg = rpw.npreg and 
            					ppw.estado = rpw.estado and ppw.estado = 1 and rpw.codalu=".$codalu." and 
            					ppw.codpractweb=".$idpractico;

            			if (!$resultResp= mysqli_query($db,$sql)) {
            				$resp = array("status"=>"errorSqlRESP");
            				echo json_encode($resp);
            				exit();
            			}	

            			while ($rowResp = $resultResp->fetch_object()) {
            				$respuestas[] = array(
            									"codpractico"=>$idpractico,
            									"npreg"=>$rowResp->npreg,
            									"respuesta"=>$rowResp->respuesta
            									);
            				$preguntas[] = array(
            									"codpractico"=>$idpractico,
            									"npreg"=>$rowResp->npreg,
            									"pregunta"=>$rowResp->pregunta
            									);
            			}
            		}else{
            			//Obteniendo las preguntas del práctico
            			$sql = "select * 
            					from pregunta_pract_web 
            					where codpractweb=".$idpractico." and estado = 1 order by npreg asc";
            			if (!$resultPreg= mysqli_query($db,$sql)) {
            				$resp = array("status"=>"errorSqlPreg");
            				echo json_encode($resp);
            				exit();
            			}	
            			while ($rowpreg = $resultPreg->fetch_object()) {
            				$preguntas[] = array(
            									"codpractico"=>$idpractico,
            									"npreg"=>$rowpreg->npreg,
            									"pregunta"=>$rowpreg->pregunta
            									);
            			}
            		}
            		$practicos[] = array(
            							"idpractico"=>$idpractico,
            							"codmat"=>$codmat,
            							"descripcion"=>$descripcion,
            							"curso"=>$nombreCurso,
            							"materia"=>$nombre,
            							"presentacion"=>$presentacion,
            							"estado"=>$presentado,
            							"editable"=>$editable,
            							"nota"=>$nota
            							);
            		$cont++;
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
                            "nombre"=>$nombre,
                            "practicos"=>$cont,
                            "img" => $img
                            );            	

            }
            if (count($materias)>0) {
                  $respuesta = array(
                            "status" => "ok",
                            "materias" => $materias,
                            "practicos" => $practicos,
                            "preguntas"=>$preguntas,
                            "respuestas"=>$respuestas
                            );
                  echo json_encode($respuesta);
                }else{
                  $respuesta = array("status"=>"noMaterias");
                            echo json_encode($respuesta);
                }	
        	break;
        case 'spwa'://Guardar el práctico web del alumno
        	$codalu = $_SESSION['app_user_id'];

        	require 'includes/config.php';
            $db = mysqli_connect($servername, $username, $password, $database) 
                or die('Error al intentar conectar con el servidor.');
        	
        	//Validando que el usuario sea alumno habilitado
            $sql = "select cod_cur,cod_par 
            		from alumno 
            		where codigo = ".$codalu." and estado = 1";
            if (!$resultAlu = mysqli_query($db,$sql)) {
            	echo "errorSqlAlumo";
            	exit();
            }
            if (!$rowAlu = $resultAlu->fetch_object()) {
            	echo "noPermitido";
            	exit();
            }

            if (!isset($_POST['codpractico'])&&empty($_POST['codpractico'])&&
        		!isset($_POST['nresp'])&&empty($_POST['nresp'])) {
            	echo "errorParam";
            	exit();
            }
            $codpractico = $_POST['codpractico'];
            $nresp = $_POST['nresp'];
            //Validando si el practico le pertenece al estudiante
            $sql = "select count(*) as npreg,pw.hora,pw.fecha 
            		from alumno a inner join practicos_web pw on 
            		a.cod_cur = pw.codcur and a.cod_par = pw.codpar and a.estado = pw.estado and 
            		a.codigo=".$codalu." and pw.id=".$codpractico." inner join pregunta_pract_web ppw on 
            		pw.id = ppw.codpractweb and pw.estado = 1";

            if (!$resultpreguntas = mysqli_query($db,$sql)) {
            	echo "errorSqlNpreg";
            	exit();
            }
        	
        	$nPreguntas = $resultpreguntas->fetch_object();
        	$numeroPreguntas = $nPreguntas->npreg;
        	$fechaPresentacion = $nPreguntas->fecha;
        	$horaPresentacion = $nPreguntas->hora;
        	
        	if ($numeroPreguntas > 0 ) {
        		$respuestas = array();
        		if (!fechaLimite($fechaPresentacion,$horaPresentacion)) {
        			echo "errorLimite";
        			exit();
        		}
        		//Verificando que el estudiante ya guardó anteriormente el práctico
        		$sql = "select * 
        				from practicos_web_alumno 
        				where codpractweb = ".$codpractico." and codalumno = ".$codalu." and 
        				estado = 1";
        		if (!$resultPracPres = mysqli_query($db,$sql)) {
			        echo "errorSqlPracPres";
			        exit();
			    }
			    for ($i=0; $i < $nresp; $i++) { 
			    	if (isset($_POST['resp'.($i+1)])) {
			    		$respuestas[] = $_POST['resp'.($i+1)];
			    	}else{
			    		echo "errorResp";
			    		exit();
			    	}
			    }
			    if (count($respuestas)!=$nresp) {//se verifica que la cantidad de preguntas que tiene el práctico
        			echo "errorNResp";				//sea igual al número de respuestas que envió el usuario
        			exit();
        		}
			    $fecha = date("Y-m-d");
			    $hora = date("H:i:s");
			    if ($rowPractPres = $resultPracPres->fetch_object()) {//Si hay práctico
			            	if ($rowPractPres->editable == 0) {
			            		echo "noEdit";
			            		exit();
			            	}
			            	for ($i=0; $i < count($respuestas); $i++) { 
			            		
			            		$sql = "update resp_pract_web 
			            				set respuesta='".$respuestas[$i]."' ,
			            					fecha='".$fecha."' ,
			            					hora='".$hora."' 
			            				where practweb=".$codpractico." and 
			            				codalu=".$codalu." and estado = 1 and npreg=".($i+1);
			            		if (!$resultResp = mysqli_query($db,$sql)) {
					            	echo "errorSqlUpdateResp";
					            	exit();
					            }
			            	}
			            	echo "ok";
			            	exit();
			            }else{
			            	$sql = "insert into practicos_web_alumno(codpractweb,codalumno,fecha,hora,editable,estado)
			            			values(".$codpractico.",".$codalu.",'".$fecha."','".$hora."',1,1)";
			            	if (!$resultPWA = mysqli_query($db,$sql)) {
					            echo "errorSqlPWA";
					            exit();
					        }
			            	for ($i=0; $i < count($respuestas); $i++) { 
			            		
			            		$sql = "insert into resp_pract_web(practweb,npreg,respuesta,codalu,fecha,hora,estado)
			            				values(".$codpractico.",".($i+1).",'".$respuestas[$i]."',".$codalu.",'".$fecha."','".$hora."',1)";
			            		if (!$resultRPWA = mysqli_query($db,$sql)) {
					            	echo "errorSqlRPWA";
					            	exit();
					            }

			            	}
                            $sql = "update practicos_web set editable = 0 where id=".$codpractico;
                            if (!$resultPWA = mysqli_query($db,$sql)) {
                                echo "errorSqlUPP";
                                exit();
                            }
			            	echo "ok";
			            }
        	}else{
            	echo "noPermitido";
            	exit();
        	}
        	break;
        	case 'rpw'://Obtener la lista de prácticos web realizado por los estudiantes

        		require 'includes/config.php';
            	$db = mysqli_connect($servername, $username, $password, $database) 
                	or die('Error al intentar conectar con el servidor.');

        		$codprof = $_SESSION['app_user_id'];
        		//Validando que el ususario sea profesor
        		$sql = "select * from profe where codprof='".$codprof."' and estado = 'activo'";
        		if (!$result = mysqli_query($db,$sql)) {
					$resp = array("status"=>"errorSqlPROF");
        			echo json_encode($resp);
        			exit();
				}
				if(!$rowVP = $result->fetch_object()){
					$resp = array("status"=>"noPermitido");//No es profesor
        			echo json_encode($resp);
        			exit();
				}

        		if (!isset($_POST['codpractico'])&&empty($_POST['codpractico'])) {
        			$resp = array("status"=>"errorParam");
        			echo json_encode($resp);
        			exit();
        		}
        		
        		$codpractico = $_POST['codpractico'];
        		
        		//Validando que el práctico le esté asignado al profesor
                $sql = "select pw.codcur,pw.codpar 
                		from prof_cur_mat pcm inner join practicos_web pw on 
                		pcm.codcur = pw.codcur and pcm.codpar = pw.codpar and 
                		pcm.estado='activo' and pcm.gestion = pw.gestion and 
                		pw.estado = 1 and pcm.codmat = pw.codmat and pcm.prof='".$codprof."' and 
                		pw.id=".$codpractico;

                if (!$result = mysqli_query($db,$sql)) {
					$resp = array("status"=>"errorSqlVP");
        			echo json_encode($resp);
        			exit();
				}
				if(!$rowVP = $result->fetch_object()){//El práctico no está asignado al profesor
					$resp = array("status"=>"noPermitido");
        			echo json_encode($resp);
        			exit();
				}
				$codcur = $rowVP->codcur;
				$codpar = $rowVP->codpar;
				//Obteniendo la lista de alumnos
				$sql = "select codigo,concat(paterno,' ',materno,' ',nombres) as nombre 
                        from alumno
                        where cod_cur=".$codcur." and cod_par=".$codpar." and estado=1 order by nombre";
                if (!$resultAlumn = mysqli_query($db,$sql)) {
					$resp = array("status"=>"errorSqlLA");
        			echo json_encode($resp);
        			exit();
				}
				$listaAlumnos = array(); //Contiene la lista de alumnos del curso
                $listaPractPresentados = array();
                while ($rowAlumno = $resultAlumn->fetch_object()) {
                    
                    $listaAlumnos[] = array(
                                            "codalu"=>$rowAlumno->codigo,
                                            "nombre"=>$rowAlumno->nombre
                                            );
                }
                if (count($listaAlumnos)>0) {//Hay alumnos registrados en el curso
                                			 //Obteniendo la lista de estudiantes que presentaron el practico
                	//Obteniendo la lista de estudiantes que presentaron el practico
                    $sql = "select pa.id,pa.codalumno,pa.fecha,pa.hora,pa.nota,pa.editable,pa.estado 
                            from practicos_web_alumno pa  inner join practicos_web c on 
                            c.id = pa.codpractweb and c.estado=pa.estado and pa.estado = 1 and 
                            pa.codpractweb=".$codpractico;
                    if (!$resultAlumnPres = mysqli_query($db,$sql)) {
						$resp = array("status"=>"errorSqlAPRES");
	        			echo json_encode($resp);
	        			exit();
					}
					while ($pracPres = $resultAlumnPres->fetch_object()) {
						$listaPractPresentados[] = array(
														"idpracticoPres"=>$pracPres->id,												
                                                        "codalu"=>$pracPres->codalumno,
                                                        "editable"=>$pracPres->editable,
                                                     	"fecha"=>$pracPres->fecha,
                                                     	"hora"=>$pracPres->hora,                        
                                                     	"nota"=>$pracPres->nota,
                                                     	"estado"=>$pracPres->estado
														);
					}
					$lista = array();
					for ($i=0; $i < count($listaAlumnos); $i++) { 
                        $reg = presentoPdf($listaAlumnos[$i]['codalu'],$listaPractPresentados);
                                        
                        $lista[] = array(                                   
                                        "codalu"=>$listaAlumnos[$i]['codalu'],
                                        "nombre"=>utf8_encode($listaAlumnos[$i]['nombre']),
                                        "idpracticopres"=>$reg['id'],
                                        "estado"=>$reg['estado'],
                                        "hora"=>$reg['hora'],
                                        "fecha"=>$reg['fecha'],
                                        "editable"=>$reg['editable'],
                                        "nota"=>$reg['nota']
                                        );
                    }

                    $resp = array("status"=>"ok","lista"=>$lista);
        			echo json_encode($resp);
        			exit();
                }else{
                	$resp = array("status"=>"noAlumnos");
        			echo json_encode($resp);
        			exit();
                }


        		break;
        	case 'grpwa'://Obtener las respuestas de un practico web del estudiante
        		
        		if (!isset($_POST['codalu'])&&empty($_POST['codalu'])&&
        			!isset($_POST['codpractico'])&&empty($_POST['codpractico'])) {
        			$resp = array("status"=>"errorParam");
        			echo json_encode($resp);
        			exit();	
        		}

        		$codalu = $_POST['codalu'];
        		$codpractico = $_POST['codpractico'];
        		$codprof = $_SESSION['app_user_id'];
        		$gestion = date("Y");

				require 'includes/config.php';
            	$db = mysqli_connect($servername, $username, $password, $database) 
                	or die('Error al intentar conectar con el servidor.');

                //Que el el practico es del estudiante y es profesor del estudiante
                $sql = "select pwa.id,a.codigo,concat(a.paterno,' ',a.materno,' ',a.nombres)as alumno,
                		concat(c.descrip,' - ',p.descrip)as curso,m.descri as materia,pwa.nota,
                		ppw.npreg, ppw.pregunta,rpw.respuesta 
                		from alumno a inner join practicos_web_alumno pwa on 
                		a.codigo = pwa.codalumno and a.estado = 1 and pwa.estado = 1 
                		inner join practicos_web pw on pwa.codpractweb = pw.id and pw.estado = 1 
                		inner join prof_cur_mat pcm on pw.codcur = pcm.codcur and pw.codpar = pcm.codpar and 
                		pw.codmat = pcm.codmat and pcm.prof='".$codprof."' and pcm.gestion = ".$gestion." and 
                		pcm.estado = 'activo' inner join resp_pract_web rpw on pw.id = rpw.practweb and 
                		rpw.estado = 1 inner join pregunta_pract_web ppw on pw.id = ppw.codpractweb and 
                		ppw.estado = 1 inner join cursos c on pw.codcur = c.codigo inner join paralelos p on 
                		pw.codpar = p.cod_par inner join materia m on pw.codmat = m.codmat and rpw.npreg = ppw.npreg and 
                		a.codigo = ".$codalu." and pw.id = ".$codpractico." and rpw.codalu=".$codalu;
                
                
                if (!$result = mysqli_query($db,$sql)) {
						$resp = array("status"=>"errorSql");
	        			echo json_encode($resp);
	        			exit();
				}
				$codpresentacion = "";
				$alumno = "";
				$curso = "";
				$materia = "";
				$nota = "";
				$preguntas = array();
				$respuestas = array();
				while ($row = $result->fetch_object()) {
					$codpresentacion = $row->id;
					$alumno = $row->alumno;
					$curso = $row->curso;
					$materia = $row->materia;
					$nota = $row->nota;
					$preguntas[] = $row->pregunta;
					$respuestas[] = $row->respuesta;
				}
				if (count($preguntas>0)) {
					$resp = array(
									"status"=>"ok",
									"codpresentacion"=>$codpresentacion,
									"alumno"=>utf8_encode($alumno),
									"curso"=>$curso,
									"materia"=>utf8_encode($materia),
									"nota"=>$nota,
									"preguntas"=>$preguntas,
									"respuestas"=>$respuestas);
	        		echo json_encode($resp);
	        		exit();
				}else{
					$resp = array("status"=>"noPractico");
	        		echo json_encode($resp);
	        		exit();
				}
        		break;
        		case 'hpwa'://Habilitar la edicion de un práctico web del alumno
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
                			from practicos_web_alumno pwa inner join practicos_web pw on 
                			pwa.codpractweb = pw.id and pwa.estado = 1 and pw.estado = 1 
                			inner join prof_cur_mat pcm on pw.codcur = pcm.codcur and pw.codpar = pcm.codpar and 
                			pw.codmat = pcm.codmat and pcm.estado = 'activo' and pcm.gestion=".$gestion." and 
                			pcm.prof='".$codprof."' and pwa.id=".$idpracticoPres;

                	if (!$result = mysqli_query($db,$sql)) {
	        			echo "errorSQL";
	        			exit();
					}
					if ($row = $result->fetch_object()) {
						//Habilitar la edicion
						$sql = "update practicos_web_alumno set editable = 1 where id = ".$idpracticoPres;
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
        			case 'dpwa'://Deshabilitar la edicion de un práctico web del alumno
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
                			from practicos_web_alumno pwa inner join practicos_web pw on 
                			pwa.codpractweb = pw.id and pwa.estado = 1 and pw.estado = 1 
                			inner join prof_cur_mat pcm on pw.codcur = pcm.codcur and pw.codpar = pcm.codpar and 
                			pw.codmat = pcm.codmat and pcm.estado = 'activo' and pcm.gestion=".$gestion." and 
                			pcm.prof='".$codprof."' and pwa.id=".$idpracticoPres;

                	if (!$result = mysqli_query($db,$sql)) {
	        			echo "errorSQL";
	        			exit();
					}
					if ($row = $result->fetch_object()) {
						//Habilitar la edicion
						$sql = "update practicos_web_alumno set editable = 0 where id = ".$idpracticoPres;
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
        			case 'cpwa'://Calificar el practico web de un alumno
        				if (!isset($_POST['idpracticopres'])&&empty($_POST['idpracticopres'])&&
        					!isset($_POST['nota'])&&empty($_POST['nota'])) {
        					echo "errorParam";
        					exit();
        				}
        				require 'includes/config.php';
            			$db = mysqli_connect($servername, $username, $password, $database) 
                		or die('Error al intentar conectar con el servidor.');

        				$codprof = $_SESSION['app_user_id'];
        				$idpracticopres = $_POST['idpracticopres'];
        				$nota = $_POST['nota'];
        				$gestion = date("Y");

        				//Validando que el profesor pueda calificar el practico
                		$sql = "select * 
                			from practicos_web_alumno pwa inner join practicos_web pw on 
                			pwa.codpractweb = pw.id and pwa.estado = 1 and pw.estado = 1 
                			inner join prof_cur_mat pcm on pw.codcur = pcm.codcur and pw.codpar = pcm.codpar and 
                			pw.codmat = pcm.codmat and pcm.estado = 'activo' and pcm.gestion=".$gestion." and 
                			pcm.prof='".$codprof."' and pwa.id = ".$idpracticopres;


                		if (!$result = mysqli_query($db,$sql)) {
	        				echo "errorSQL";
	        				exit();
						}

						if ($nota<0 && $nota > 100) {
							echo "errorNota";
							exit();
						}
						if ($row = $result->fetch_object()) {
							//Habilitar la edicion
							$sql = "update practicos_web_alumno set nota = ".$nota.",editable = 0 where id = ".$idpracticopres;
							
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
		default:
			echo "errorOP";
			break;
	}
}else{
	echo "errorGET";
}
function horaCorta($hora){
	return substr($hora, 0,5)." Hrs.";
}
function fechaLimite($fecha,$hora){

	$limite = $fecha.' '.$hora;
	$datetime = strtotime($limite);
	$horaActual = strtotime(date("Y-m-d H:i:s"));
	return $datetime >= $horaActual;
}
function fechaPres($fecha,$hora){
	$Y = substr($fecha, 0,4);
	$m = substr($fecha, 5,2);
	$d = substr($fecha, 8,2);
	$h = substr($hora, 0,5);
	return "Hasta las ".$h." hrs. del ".$d."/".$m."/".$Y;
}
function presentoPdf($codalu,$listaPre){
    for ($i=0; $i < count($listaPre) ; $i++) { 
        if ($listaPre[$i]['codalu']==$codalu) {
            return array(
            			 "id"=>$listaPre[$i]['idpracticoPres'],
            			 "nota"=>$listaPre[$i]['nota'],
            			 "fecha"=>$listaPre[$i]['fecha'],
            			 "hora"=>$listaPre[$i]['hora'],
            			 "editable"=>$listaPre[$i]['editable'],
            			 "estado"=>$listaPre[$i]['estado']);
        }
    }
    return array("id"=>"","estado"=>"0","editable"=>"","nota"=>"sin nota","hora"=>"","fecha"=>"");
}
?>