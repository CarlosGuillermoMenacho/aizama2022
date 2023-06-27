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
	    
	    echo "eSession";
	    exit();
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
	function generateFileName()
	{
		$chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789_";
		$name = "";
		for($i=0; $i<3; $i++)
		$name.= $chars[rand(0,strlen($chars) - 1)];
		return $name;
	}
	switch ($_GET['op']) {
			case 'crearPregunta':
				$codeva = isset($_POST["codeva"])? $_POST["codeva"]:"";
				$tipo = isset($_POST["tipo"])? $_POST["tipo"]:"";
				if ( empty($codeva) || empty($tipo)){
					echo "errorParam";
					exit();
				}
				$fechaReg = date("Y-m-d H:i:s"); 
				$codprof = $_SESSION['app_user_id'];
				require('../modelo/modelo_pregunta_em.php');
				$preguntas = new pregunta_mixta($db);
				if( $preguntas->crear_preguntas($codeva, $fechaReg, $codprof, $tipo)){
					echo "Ok";
				}else{
					echo "error";
				}
				break;

			case 'guardar_pregunta_nota'://guarda la pregunta y la nota 
				$codpreg = isset($_POST["codpreg"])? $_POST["codpreg"]:"";
				$pregunta = isset($_POST["pregunta"])? $_POST["pregunta"]:"";
				$nota = isset($_POST["nota"])? $_POST["nota"]:"";
				if ( empty($codpreg) || empty($pregunta)||empty($nota)){
					echo "errorParam";
					exit();
				}
				$fechaReg = date("Y-m-d H:i:s"); 
				$codprof = $_SESSION['app_user_id'];
				require('../modelo/modelo_pregunta_em.php');
				$preguntas = new pregunta_mixta($db);
				if( $preguntas->guardar_pregunta_nota($codpreg, $pregunta, $nota)){
					echo "Ok";
				}else{
					echo "error";
				}
				break;	

			case 'guardar_detalle_pregunta':// en proceso... guarda pregunta, nota,imagen
				$codeva = isset ($_POST["codeva"])? $_POST["codeva"]:"";
				$pregunta = isset ($_POST["pregunta"])? $_POST["pregunta"]:"";
				$nota = isset ($_POST["nota"])? $_POST["nota"]:"";
				$tipo = isset ($_POST["tipo"])? $_POST["tipo"]:"";
				if ( empty($codeva) || empty($pregunta)||empty($nota)||empty($tipo)){
					echo "errorParam";
					exit();
				}
				$fechaReg = date("Y-m-d H:i:s"); 
				$codprof = $_SESSION['app_user_id'];
				$nombreArchivo="";
				require('../modelo/modelo_pregunta_em.php');
				$preguntas = new pregunta_mixta($db);
				$codpreg = $preguntas->guardar_detalle_pregunta($codeva, $pregunta, $nota, $codprof, $tipo);
				if (file_exists($_FILES["imagen"]['tmp_name'])&&is_uploaded_file($_FILES["imagen"]['tmp_name'])) 
				{
					$ext=explode(".",$_FILES["imagen"]["name"]);
					if ($_FILES["imagen"]['type']=="image/jpg"||$_FILES["imagen"]['type']=="image/jpeg"||$_FILES["imagen"]['type']=="image/png") 
					{
						$fechaNueva= str_replace(":","-",$fechaReg);
						$fechaNueva= str_replace(" ","-",$fechaNueva);
						$fichero=$_SERVER['DOCUMENT_ROOT']."/aizama/resources/";
						$nombreArchivo=$codprof.'-'.$codpreg.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);								
						$dato = move_uploaded_file($_FILES["imagen"]["tmp_name"],$fichero.$nombreArchivo);
						require("../modelo/modelo_imagen_em.php");
						$imagenes= new imagen_mixta($db);
						$imagenes->guardar_imagen($codpreg,$nombreArchivo, $codprof);
						/*if ($imagenes->guardar_imagen($codpreg,$nombreArchivo, $codprof))
						{
							echo "ok";
						}else{
							echo "ErrorAlGuardarImagen";
						}*/
						}else{
						echo "errorFile";
						exit();
					}
				}
					switch ($tipo) {
						case '2':
							$Opciones = isset ($_POST["opcion"])? $_POST["opcion"]:"";
							$nro = isset ($_POST["checkoption"])? $_POST["checkoption"]:"";
						
							if ( empty($Opciones) || empty($nro)){
								echo "errorParam";
								exit();
							}
							require('../modelo/modelo_opcion_correcta_em.php');
							require('../modelo/modelo_opcion_em.php');
							$opcion = new opcion_correcta($db);
							$opciones = new opciones_pregunta_seleccion($db);
							if( $opciones->guardar_opcion($codpreg, $Opciones, $codprof)&& $opcion->guardar_opcion_correcta($codpreg, $nro)){
								echo "ok";
								exit();
							}
								echo "error";
							break;

						case '3':
							$correcto = isset ($_POST["resultado"])? $_POST["resultado"]:"";
							if ( empty($correcto)){
								echo "errorParam guardar:case 3";
								exit();
							}
							require ('../modelo/modelo_verdadero_falso.php');
							$vf = new verdadero_falso($db);
							if ($vf->guardar_respuesta($codpreg, $correcto, $codprof)){
								echo "ok";
								exit();
							}
								echo  "error";
								exit();
							break;

						case '4':
							$tipoC1 = isset ($_POST["tipoC1"])? $_POST["tipoC1"]:"";
							$tipoC2 = isset ($_POST["tipoC2"])? $_POST["tipoC2"]:"";
							$op_correcto = isset ($_POST["correcto"])? $_POST["correcto"]:"";
							
							if ( empty($tipoC1) ||empty($tipoC2) || empty($op_correcto)){
								echo "errorParam";
								exit();
							}
							require("../modelo/modelo_relacionar_em.php");
							$relacionar= new relacionar_pregunta($db);
							$index=0;
							$tipo1;
							$tipo2;
							foreach ($op_correcto as $correcto){								
								if ($tipoC1[$index]==1) {
									if (file_exists($_FILES["imagen1"]['tmp_name'][$index])&&is_uploaded_file($_FILES["imagen1"]['tmp_name'][$index])) 
									{ 
										$ext=explode(".",$_FILES["imagen1"]["name"][$index]);
										if ($_FILES["imagen1"]['type'][$index]=="image/jpg"||$_FILES["imagen1"]['type'][$index]=="image/jpeg"||$_FILES["imagen1"]['type'][$index]=="image/png") 
										{
											$fechaNueva= str_replace(":","-",$fechaReg);
											$fechaNueva= str_replace(" ","-",$fechaNueva);
											$fichero=$_SERVER['DOCUMENT_ROOT']."/aizama/resources/";
											$c1=$codprof.'-'.$codpreg.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);	
											$tipo1=1;							
											$dato = move_uploaded_file($_FILES["imagen1"]["tmp_name"][$index],$fichero.$c1);
										}else{
											echo "errorFile";
											exit();
										}
									}
								} elseif ($tipoC1[$index]==2 ) {
									$c1 = isset ($_POST["campo1"][$index])? $_POST["campo1"][$index]:"";
									$tipo1=2;
										if ( empty($c1)){	
											echo "errorParam";		
											exit();
										}
								}
								if ($tipoC2[$index]==2) {
									$c2 = isset ($_POST["campo2"][$index])? $_POST["campo2"][$index]:"";
									$tipo2=2;
									if ( empty($c2)){	
										echo "errorParam";		
										exit();
									}
								} elseif($tipoC2[$index]==1) {
									if (file_exists($_FILES["imagen2"]['tmp_name'][$index])&&is_uploaded_file($_FILES["imagen2"]['tmp_name'][$index])) 
									{ 
										$ext=explode(".",$_FILES["imagen2"]["name"][$index]);
										if ($_FILES["imagen2"]['type'][$index]=="image/jpg"||$_FILES["imagen2"]['type'][$index]=="image/jpeg"||$_FILES["imagen2"]['type'][$index]=="image/png") 
										{
											$fechaNueva= str_replace(":","-",$fechaReg);
											$fechaNueva= str_replace(" ","-",$fechaNueva);
											$fichero=$_SERVER['DOCUMENT_ROOT']."/aizama/resources/";
											$c2=$codprof.'-'.$codpreg.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);								
											$tipo2=1;
											$dato = move_uploaded_file($_FILES["imagen2"]["tmp_name"][$index],$fichero.$c2);		
										}else{
											echo "errorTypeFile";
											exit();
										}
									}else{
										echo "errorFile";
										exit();
									}
								}
								$relacionar->guardar_relacion($codpreg, $c1, $tipo1, $correcto, $c2, $tipo2, $codprof);
								$index++;
								$c1="";
								$c2="";
								$tipo1="";
								$tipo2="";
							}
								echo "ok";	
							exit();
							break;
						default:
							# code...
							break;
					}
					echo "ok";
					exit();
				break;

			case 'get_pregunta':
				$codpreg = isset ($_POST["codpreg"])? $_POST["codpreg"]:"";
				if ( empty($codpreg) ){	
					echo "errorParam";		
					exit();
				}
				require('../modelo/modelo_pregunta_em.php');
				$preguntas = new pregunta_mixta($db);
				if( $preguntas->get_pregunta($codpreg)){
					echo "Ok";
				}else{
					echo "error";
				}	
				break;

			case 'get_nota':
				$codpreg = isset ($_POST["codpreg"])? $_POST["codpreg"]:"";
				if ( empty($codpreg) ){	
					echo "errorParam";		
					exit();
				}
				require('../modelo/modelo_pregunta_em.php');
				$preguntas = new pregunta_mixta($db);
				if( $preguntas->get_nota($codpreg)){
					echo "Ok";
				}else{
					echo "error";
				}	
				break;

			case 'get_preguntas_profesor':
				$codprof = $_SESSION['app_user_id'];
				require('../modelo/modelo_pregunta_em.php');
				$preguntas = new pregunta_mixta($db);
				if( $preguntas->get_preguntas_profesor($codprof)){
					echo "Ok";
				}else{
					echo "error";
				}	
				break;

			case 'get_detalle_de_pregunta':
				$codpreg = isset ($_POST["codpreg"])? $_POST["codpreg"]:"";
				$tipo = isset ($_POST["tipo"])? $_POST["tipo"]:"";
				if ( empty($codpreg)){	
					echo "errorParam";		
					exit();
				}
				require('../modelo/modelo_pregunta_em.php');
				require ('../modelo/modelo_imagen_em.php');
				require ('../modelo/modelo_opcion_em.php');
				require ('../modelo/modelo_opcion_correcta_em.php');
				require ('../modelo/modelo_verdadero_falso.php');
				require ('../modelo/modelo_relacionar_em.php');
				$pregunta_mixta = new pregunta_mixta($db);
				$imagenes = new imagen_mixta($db);
				$opciones = new opciones_pregunta_seleccion($db);
				$opcion = new opcion_correcta($db);
				$vf = new verdadero_falso($db);
				$relacionar = new relacionar_pregunta($db);
				$pregunta= $pregunta_mixta->get_detalle_de_pregunta($codpreg,$tipo);
				$result = array();
					$imagen="";
					$codimg="";
					if($fila=$imagenes->get_imagen($pregunta['codpreg'])->fetch_object()){
						$imagen = $fila->em_i_link;
						$codimg = $fila->em_i_id;
					}
					switch ($tipo) {
						case '1':
							$result[] = array(	
								"codpreg"=>$pregunta['codpreg'],
								"codeva"=>$pregunta['codeva'],
								"pregunta"=>$pregunta['pregunta'],
								"imagen"=>$imagen,
								"codimg"=>$codimg,
								"nota"=>$pregunta['nota'],
								"tipo"=>$pregunta['tipo'],
								"fechaReg"=>$pregunta['fechaReg'],
								"codprof"=>$pregunta['codprof'],
								"estado"=>$pregunta['estado']
								);
							break;
						case '2':
							$lista_opciones = $opciones->obtener_opcion($codpreg);
							$opcion_correcta = $opcion->obtener_opcion_correcta($codpreg);
							$result[] = array(	
								"codpreg"=>$pregunta['codpreg'],
								"codeva"=>$pregunta['codeva'],
								"pregunta"=>$pregunta['pregunta'],
								"imagen"=>$imagen,
								"codimg"=>$codimg,
								"nota"=>$pregunta['nota'],
								"tipo"=>$pregunta['tipo'],
								"fechaReg"=>$pregunta['fechaReg'],
								"codprof"=>$pregunta['codprof'],
								"estado"=>$pregunta['estado'],
								"opciones"=>$lista_opciones,
								"op_correcta"=>$opcion_correcta
								);
							break;
						case '3':
							$id_vf = $vf->obtener_id_verdadero_falso($codpreg);
							$v_f = $vf->obtener_verdadero_falso($codpreg);
							$result[] = array(	
								"codpreg"=>$pregunta['codpreg'],
								"codeva"=>$pregunta['codeva'],
								"pregunta"=>$pregunta['pregunta'],
								"imagen"=>$imagen,
								"codimg"=>$codimg,
								"nota"=>$pregunta['nota'],
								"tipo"=>$pregunta['tipo'],
								"fechaReg"=>$pregunta['fechaReg'],
								"codprof"=>$pregunta['codprof'],
								"estado"=>$pregunta['estado'],
								"v_f"=>$v_f,
								"id_vf" => $id_vf
								);						
							break;
						case '4':
							$lista_relaciones=$relacionar->obtener_relaciones($codpreg);
							$result[] = array(
								"codpreg"=>$pregunta['codpreg'],
								"codeva"=>$pregunta['codeva'],
								"pregunta"=>$pregunta['pregunta'],
								"nota"=>$pregunta['nota'],
								"tipo"=>$pregunta['tipo'],
								"fechaReg"=>$pregunta['fechaReg'],
								"codprof"=>$pregunta['codprof'],
								"estado"=>$pregunta['estado'],
								"relaciones"=>$lista_relaciones
							);
						default:
							# code...
							break;
					}
				echo json_encode(array ("status"=>"ok","lista"=>$result));
				break;
				
			case 'Update_Pregunta':
				$codpreg = isset ($_POST["codpreg"])? $_POST["codpreg"]:"";
				$pregunta = isset ($_POST["pregunta"])? $_POST["pregunta"]:"";
				if ( empty($codpreg) || empty($pregunta)){	
					echo "errorParam";
					exit();
				}
				$fechaReg = date("Y-m-d H:i:s"); 
				$codprof = $_SESSION['app_user_id'];
				require('../modelo/modelo_pregunta_em.php');
				$preguntas = new pregunta_mixta($db);

				if( $preguntas->update_pregunta($codpreg, $pregunta,$codprof)){
					echo "ok";
				}else{
					echo "error";
				}
				break;		

			case 'update_nota':
				$codpreg = isset ($_POST["codpreg"])? $_POST["codpreg"]:"";
				$nota = isset ($_POST["nota"])? $_POST["nota"]:"";
				if ( empty($codpreg) || empty($nota)){	
					echo "errorParam";
					exit();
				}
				$fechaReg = date("Y-m-d H:i:s"); 
				$codprof = $_SESSION['app_user_id'];
				
				require('../modelo/modelo_pregunta_em.php');
				$preguntas = new pregunta_mixta($db);
				
				if( $preguntas->update_nota ($codpreg, $nota, $codprof)){
					echo "Ok";
				}else{
					echo "error";
				}
				break;

			case 'update_detalle_pregunta':
				$codpreg = isset ($_POST["codpreg"])? $_POST["codpreg"]:"";
				$codeva = isset ($_POST["codeva"])? $_POST["codeva"]:"";
				$pregunta = isset ($_POST["pregunta"])? $_POST["pregunta"]:"";
				$nota = isset ($_POST["nota"])? $_POST["nota"]:"";
				$tipo = isset ($_POST["tipo"])? $_POST["tipo"]:"";
				if ( empty($codpreg) || empty($pregunta)|| empty($nota)|| empty($tipo)){	
					echo "errorParam ";
					exit();
				}
				$fechaReg = date("Y-m-d H:i:s"); 
				$codprof = $_SESSION['app_user_id'];
				$nombreArchivo="";
				require("../modelo/modelo_imagen_em.php");
				$imagenes = new imagen_mixta($db);
				
				if (file_exists($_FILES["imagen"]['tmp_name']) &&is_uploaded_file($_FILES["imagen"]['tmp_name']))
				{  
					$ext = explode(".",$_FILES["imagen"]["name"]);

					if ($_FILES["imagen"]['type']=="image/jpg"||$_FILES["imagen"]['type']=="image/jpeg"||$_FILES["imagen"]['type']=="image/png")
					{
						$fechaNueva= str_replace(":","-",$fechaReg);
						$fechaNueva= str_replace(" ","-",$fechaNueva);
						$fichero=$_SERVER['DOCUMENT_ROOT']."/aizama/resources/";
						$nombreArchivo = $codprof.'-'.$codpreg.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);

						$dato = move_uploaded_file($_FILES["imagen"]["tmp_name"],$fichero.$nombreArchivo);
						
						$imagen =$imagenes->get_imagen($codpreg);
						if ( $fila = $imagen->fetch_object()){
							$codimg = $fila->em_i_id;
							$link = $fila->em_i_link;	
							 if (file_exists('../resources/'.$link)) unlink('../resources/'.$link);
							$imagenes->update_imagen($codimg, $nombreArchivo, $codprof);		
						}else{
							$imagenes->guardar_imagen($codpreg, $nombreArchivo, $codprof);					
						}
					}else{
						echo "no hay imagen de tipo jpg,jpeg...";
					}
				}
				switch ($tipo) { 
					case '2':
						$Opciones = isset ($_POST["opcion"])? $_POST["opcion"]:"";
						$nro = isset ($_POST["checkoption"])? $_POST["checkoption"]:"";
						if ( empty($Opciones)||empty($nro)){
							echo "errorParam";
							exit();
						}
						require('../modelo/modelo_opcion_correcta_em.php');
						require('../modelo/modelo_opcion_em.php');
						$opcion = new opcion_correcta($db);
						$opciones = new opciones_pregunta_seleccion($db);
						$idcorrecto = $opcion->obtener_idopcion_correcta($codpreg);
						$idopcion = $opciones->obtener_id_opcion($codpreg);
						$opcion->editar_opcion_correcta($idcorrecto, $nro);
						$indice=0;
						if (count($idopcion)==count($Opciones)){
							foreach ($Opciones as $fila){
								$id_op=$idopcion[$indice]->em_o_id;
								//echo json_encode($idopcion[$indice]->em_o_id);
								$opciones->editar_opcion($id_op,$fila,$codprof);
								$indice++;
							}
						}
						if (count($idopcion) > count($Opciones)){
							foreach ($Opciones as $fila){
								$id_op=$idopcion[$indice]->em_o_id;
								$opciones->editar_opcion($id_op,$fila,$codprof);
								$indice++;
							}
							for ($i=$indice; $i < count($idopcion) ; $i++) { 
								$id_op=$idopcion[$i]->em_o_id;
								$num=$idopcion[$i]->em_o_nro;
								$opciones->eliminar_opcion($id_op,$codpreg, $num, $codprof);
							}
						}
						if (count($idopcion) < count($Opciones)){
							foreach ($idopcion as $fila){
								$id_op=$idopcion[$indice]->em_o_id;
								$op = $idopcion[$indice]->em_o_opcion;
								$opciones->editar_opcion($id_op, $op, $codprof);
								$indice++;
							}
							
							for ($i=$indice; $i <count($Opciones) ; $i++) {		
								$op=$Opciones[$i];
								$opciones->guardar_una_opcion($codpreg, $op, $codprof);
							}
						}
						break;

					case '3':
						$correcto = isset ($_POST["resultado"])? $_POST["resultado"]:"";
						$id_vf = isset ($_POST["id_vf"])? $_POST["id_vf"]:"";
						
						if ( empty($correcto)||empty($id_vf)){
							echo "errorParam";
							exit();
						}
						
						require('../modelo/modelo_verdadero_falso.php');
						$vf = new verdadero_falso($db);
						$vf->editar_verdadero_falso($correcto, $id_vf);
						break;

					case '4':
						$tipoC1 = isset ($_POST["tipoC1"])? $_POST["tipoC1"]:"";
						$tipoC2 = isset ($_POST["tipoC2"])? $_POST["tipoC2"]:"";
						$op_correcto = isset ($_POST["correcto"])? $_POST["correcto"]:"";
						if ( empty($tipoC1) ||empty($tipoC2) || empty($op_correcto)){
							echo "errorParam";
							exit();
						}
						require("../modelo/modelo_relacionar_em.php");
						$relacionar = new relacionar_pregunta($db);
						$idrelacion = $relacionar->obtener_id_relacion($codpreg);
						$index=0;
						if(count($idrelacion)==count($op_correcto)){
							foreach ($op_correcto as $correcto) {
								$id_rel=$idrelacion[$index]->id;//1	
															
								if ($tipoC1[$index]==1) {
									if (file_exists($_FILES["imagen1"]['tmp_name'][$index]) && is_uploaded_file($_FILES["imagen1"]['tmp_name'][$index])) 
									{  
										$ext=explode(".",$_FILES["imagen1"]["name"][$index]);
										if ($_FILES["imagen1"]['type'][$index]=="image/jpg"||$_FILES["imagen1"]['type'][$index]=="image/jpeg"||$_FILES["imagen1"]['type'][$index]=="image/png") 
										{
											$fechaNueva= str_replace(":","-",$fechaReg);
											$fechaNueva= str_replace(" ","-",$fechaNueva);
											$fichero=$_SERVER['DOCUMENT_ROOT']."/aizama/resources/";
											$c1=$codprof.'-'.$codpreg.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);	
											$tipo1=1;							
											$dato = move_uploaded_file($_FILES["imagen1"]["tmp_name"][$index],$fichero.$c1);
										}else{
											echo "errorTypeFile";
											exit();
										}
									}else{
										$tipo1=1;
										$c1=$idrelacion[$index]->campo1;
									}

								} elseif ($tipoC1[$index]==2 ) {
									$c1 = isset ($_POST["campo1"][$index])? $_POST["campo1"][$index]:"";
									$tipo1=2;
										if ( empty($c1)){	
											echo "errorParam";		
											exit();
										}
								}
								if($tipoC2[$index]==1) {
									if (file_exists($_FILES["imagen2"]['tmp_name'][$index])&&is_uploaded_file($_FILES["imagen2"]['tmp_name'][$index])) 
									{ 
										$ext=explode(".",$_FILES["imagen2"]["name"][$index]);
										if ($_FILES["imagen2"]['type'][$index]=="image/jpg"||$_FILES["imagen2"]['type'][$index]=="image/jpeg"||$_FILES["imagen2"]['type'][$index]=="image/png") 
										{
											$fechaNueva= str_replace(":","-",$fechaReg);
											$fechaNueva= str_replace(" ","-",$fechaNueva);
											$fichero=$_SERVER['DOCUMENT_ROOT']."/aizama/resources/";
											$c2=$codprof.'-'.$codpreg.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);								
											$tipo2=1;
											$dato = move_uploaded_file($_FILES["imagen2"]["tmp_name"][$index],$fichero.$c2);		
										}else{
											echo "errorTypeFile";
											exit();
										}
									}else{
										$tipo2=1;
										$c2=$idrelacion[$index]->campo2;
									}
								}elseif ($tipoC2[$index]==2) {
									$c2 = isset ($_POST["campo2"][$index])? $_POST["campo2"][$index]:"";
									$tipo2=2;
									if ( empty($c2)){	
										echo "errorParam";		
										exit();
									}
								}
								$relacionar->update_relacion($id_rel,$c1,$tipo1,$correcto, $c2, $tipo2,$codprof);
								$index++;
								$c1="";
								$c2="";
								$tipo1="";
								$tipo2="";
							}
						}
						if (count($idrelacion) > count($op_correcto)){
						
							foreach ($op_correcto as $correcto){
								$id_rel=$idrelacion[$index]->id;
								if ($tipoC1[$index]==1) {
									if (file_exists($_FILES["imagen1"]['tmp_name'][$index])&&is_uploaded_file($_FILES["imagen1"]['tmp_name'][$index])) 
									{ 
										$ext=explode(".",$_FILES["imagen1"]["name"][$index]);
										if ($_FILES["imagen1"]['type'][$index]=="image/jpg"||$_FILES["imagen1"]['type'][$index]=="image/jpeg"||$_FILES["imagen1"]['type'][$index]=="image/png") 
										{
											$fechaNueva= str_replace(":","-",$fechaReg);
											$fechaNueva= str_replace(" ","-",$fechaNueva);
											$fichero=$_SERVER['DOCUMENT_ROOT']."/aizama/resources/";
											$c1=$codprof.'-'.$codpreg.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);	
											$tipo1=1;							
											$dato = move_uploaded_file($_FILES["imagen1"]["tmp_name"][$index],$fichero.$c1);
										}else{
											echo "errorFile3";
											exit();
										}
									}else{
										$tipo1=1;
										$c1=$idrelacion[$index]->campo1;
									}
								} elseif ($tipoC1[$index]==2 ) {
									$c1 = isset ($_POST["campo1"][$index])? $_POST["campo1"][$index]:"";
									$tipo1=2;
										if ( empty($c1)){	
											echo "errorParam";		
											exit();
										}
								}
								if ($tipoC2[$index]==2) {
									$c2 = isset ($_POST["campo2"][$index])? $_POST["campo2"][$index]:"";
									$tipo2=2;
									if ( empty($c2)){	
										echo "errorParam";		
										exit();
									}
								} elseif($tipoC2[$index]==1) {
									if (file_exists($_FILES["imagen2"]['tmp_name'][$index])&&is_uploaded_file($_FILES["imagen2"]['tmp_name'][$index])) 
									{ 
										$ext=explode(".",$_FILES["imagen2"]["name"][$index]);
										if ($_FILES["imagen2"]['type'][$index]=="image/jpg"||$_FILES["imagen2"]['type'][$index]=="image/jpeg"||$_FILES["imagen2"]['type'][$index]=="image/png") 
										{
											$fechaNueva= str_replace(":","-",$fechaReg);
											$fechaNueva= str_replace(" ","-",$fechaNueva);
											$fichero=$_SERVER['DOCUMENT_ROOT']."/aizama/resources/";
											$c2=$codprof.'-'.$codpreg.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);								
											$tipo2=1;
											$dato = move_uploaded_file($_FILES["imagen2"]["tmp_name"][$index],$fichero.$c2);		
										}else{
											echo "errorTypeFile";
											exit();
										}
									}else{
										$tipo2=1;
										$c2=$idrelacion[$index]->campo2;
									}
								}
								$relacionar->update_relacion($id_rel,$c1,$tipo1,$correcto, $c2, $tipo2,$codprof);
								$index++;
								$c1="";
								$c2="";
								$tipo1="";
								$tipo2="";	
							}
							for ($i=$index; $i < count($idrelacion) ; $i++) { 
								$id_rel=$idrelacion[$i]->id;
								$num=$idrelacion[$i]->nro;
								$relacionar->delete_relacion($id_rel, $codpreg, $num, $codprof);
							}
						}
						if (count($idrelacion) < count($op_correcto)){
							foreach ($idrelacion as $relacion){
								$id_rel=$idrelacion[$index]->id;
								$correcto=$idrelacion[$index]->op_correcto;
								if ($tipoC1[$index]==1) {
									if (file_exists($_FILES["imagen1"]['tmp_name'][$index])&&is_uploaded_file($_FILES["imagen1"]['tmp_name'][$index])) 
									{ 
										$ext=explode(".",$_FILES["imagen1"]["name"][$index]);
										if ($_FILES["imagen1"]['type'][$index]=="image/jpg"||$_FILES["imagen1"]['type'][$index]=="image/jpeg"||$_FILES["imagen1"]['type'][$index]=="image/png") 
										{
											$fechaNueva= str_replace(":","-",$fechaReg);
											$fechaNueva= str_replace(" ","-",$fechaNueva);
											$fichero=$_SERVER['DOCUMENT_ROOT']."/aizama/resources/";
											$c1=$codprof.'-'.$codpreg.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);	
											$tipo1=1;							
											$dato = move_uploaded_file($_FILES["imagen1"]["tmp_name"][$index],$fichero.$c1);
										}else{
											echo "errorTypeFile";
											exit();
										}
									}else{
										$tipo1=1;
										$c1=$idrelacion[$index]->campo1;
									}
								} elseif ($tipoC1[$index]==2 ) {
									$c1 = isset ($_POST["campo1"][$index])? $_POST["campo1"][$index]:"";
									$tipo1=2;
										if ( empty($c1)){	
											echo "errorParam";		
											exit();
										}
								}
								if($tipoC2[$index]==1) {
									if (file_exists($_FILES["imagen2"]['tmp_name'][$index])&&is_uploaded_file($_FILES["imagen2"]['tmp_name'][$index])) 
									{ 
										$ext=explode(".",$_FILES["imagen2"]["name"][$index]);
										if ($_FILES["imagen2"]['type'][$index]=="image/jpg"||$_FILES["imagen2"]['type'][$index]=="image/jpeg"||$_FILES["imagen2"]['type'][$index]=="image/png") 
										{
											$fechaNueva= str_replace(":","-",$fechaReg);
											$fechaNueva= str_replace(" ","-",$fechaNueva);
											$fichero=$_SERVER['DOCUMENT_ROOT']."/aizama/resources/";
											$c2=$codprof.'-'.$codpreg.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);								
											$tipo2=1;
											$dato = move_uploaded_file($_FILES["imagen2"]["tmp_name"][$index],$fichero.$c2);		
										}else{
											echo "errorTypeFile";
											exit();
										}
									}else{
										$tipo2=1;
										$c2=$idrelacion[$index]->campo2;
									}
									
								}elseif ($tipoC2[$index]==2) {
									$c2 = isset ($_POST["campo2"][$index])? $_POST["campo2"][$index]:"";
									$tipo2=2;
									if ( empty($c2)){	
										echo "errorParam";		
										exit();
									}
								}
								$relacionar->update_relacion($id_rel,$c1,$tipo1,$correcto, $c2, $tipo2,$codprof);
								$index++;
								$c1="";
								$c2="";
								$tipo1="";
								$tipo2="";
							}
							for ($i=$index; $i <count($op_correcto) ; $i++) {				
								$op=$op_correcto[$i];
								if ($tipoC1[$index]==1) {
									if (file_exists($_FILES["imagen1"]['tmp_name'][$index])&&is_uploaded_file($_FILES["imagen1"]['tmp_name'][$index])) 
									{ 
										$ext=explode(".",$_FILES["imagen1"]["name"][$index]);
										if ($_FILES["imagen1"]['type'][$index]=="image/jpg"||$_FILES["imagen1"]['type'][$index]=="image/jpeg"||$_FILES["imagen1"]['type'][$index]=="image/png") 
										{
											$fechaNueva= str_replace(":","-",$fechaReg);
											$fechaNueva= str_replace(" ","-",$fechaNueva);
											$fichero=$_SERVER['DOCUMENT_ROOT']."/aizama/resources/";
											$c1=$codprof.'-'.$codpreg.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);	
											$tipo1=1;							
											$dato = move_uploaded_file($_FILES["imagen1"]["tmp_name"][$index],$fichero.$c1);
										}else{
											echo "errorTypeFile";
											exit();
										}
									}else{
										$tipo1=1;
										$c1=$idrelacion[$index]->campo1;
									}
								} elseif ($tipoC1[$index]==2 ) {
									$c1 = isset ($_POST["campo1"][$index])? $_POST["campo1"][$index]:"";
									$tipo1=2;
										if ( empty($c1)){	
											echo "errorParam";		
											exit();
										}
								}
								if ($tipoC2[$index]==2) {
									$c2 = isset ($_POST["campo2"][$index])? $_POST["campo2"][$index]:"";
									$tipo2=2;
									if ( empty($c2)){	
										echo "errorParam";		
										exit();
									}
								} elseif($tipoC2[$index]==1) {
									if (file_exists($_FILES["imagen2"]['tmp_name'][$index])&&is_uploaded_file($_FILES["imagen2"]['tmp_name'][$index])) 
									{ 
										$ext=explode(".",$_FILES["imagen2"]["name"][$index]);
										if ($_FILES["imagen2"]['type'][$index]=="image/jpg"||$_FILES["imagen2"]['type'][$index]=="image/jpeg"||$_FILES["imagen2"]['type'][$index]=="image/png") 
										{
											$fechaNueva= str_replace(":","-",$fechaReg);
											$fechaNueva= str_replace(" ","-",$fechaNueva);
											$fichero=$_SERVER['DOCUMENT_ROOT']."/aizama/resources/";
											$c2=$codprof.'-'.$codpreg.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);								
											$tipo2=1;
											$dato = move_uploaded_file($_FILES["imagen2"]["tmp_name"][$index],$fichero.$c2);		
										}else{
											echo "errorTypeFile";
											exit();
										}
									}else{
										$tipo2=1;
										$c2=$idrelacion[$index]->campo2;
									}
								}
								$relacionar->guardar_relacion($codpreg, $c1, $tipo1, $op, $c2, $tipo2, $codprof);
								$index++;
								$c1="";
								$c2="";
								$tipo1="";
								$tipo2="";
							}
						}
						break;
					default:
						# code...
						break;
				}
				require('../modelo/modelo_pregunta_em.php');
				$preguntas = new pregunta_mixta($db);
					if( $preguntas->update_detalle_de_pregunta($codpreg, $codeva,$pregunta ,$nota,$codprof,$tipo)){
						echo "ok";
						exit();
					}
					echo "error";
				break;

			case 'delete_pregunta':
					$codpreg = isset ($_POST["codpreg"])? $_POST["codpreg"]:"";
					if ( empty($codpreg) ){	
						echo "errorParam";		
						exit();
					}
					$fechaReg = date("Y-m-d H:i:s"); 
					$codprof = $_SESSION['app_user_id'];
					
					require('../modelo/modelo_pregunta_em.php');
					require_once("../modelo/modelo_evaluacion_mixta.php");
					$preguntas = new pregunta_mixta($db);
					$evaluaciones = new Evaluacion_mixta($db);
					$codeva = $preguntas->get_codeva($codpreg);
					if( $preguntas->delete_pregunta($codpreg, $codprof)){
						if ($evaluaciones->decremetar_banco($codeva)) {
							echo "Ok";
						}			
					}else{
						echo "error";
					}
				break;		

			case 'get_preguntas':
				$codeva = isset ($_POST["codeva"])? $_POST["codeva"]:"";
				if ( empty($codeva) ){	
					echo "errorParam";		
					exit();
				}
				require('../modelo/modelo_pregunta_em.php');
				$preguntas = new pregunta_mixta($db);
				if( $preguntas->get_preguntas($codeva)){
					echo "Ok";
				}else{
					echo "error";
				}
				break;
				
			case 'get_preguntas-tipo-imagen':
				$codeva = isset ($_POST["codeva"])? $_POST["codeva"]:"";
				if (empty($codeva)) {
					echo "errorParam";
					exit();
				}
				require('../modelo/modelo_pregunta_em.php');
				require('../modelo/modelo_tipo_imagen_pregunta.php');
				$preguntas = new pregunta_mixta($db);
				$tipo = new tipo_imagen($db);

				$preguntas = $preguntas->get_preguntas($codeva);
				$listapreguntas= array();
				foreach($preguntas as $preguntas){
						$listapreguntas[] = array(	
										"codpreg"=>$preguntas['codpreg'],
										"codeva"=>$preguntas['codeva'],
										"pregunta"=>$preguntas['pregunta'],
										"nota"=>$preguntas['nota'],
										"tipo"=>$preguntas['tipo'],
										"imagen"=>$tipo->get_imagen($preguntas['tipo']),
										"fechaReg"=>$preguntas['fechaReg'],
										"codprof"=>$preguntas['codprof'],
										"estado"=>$preguntas['estado'],
										);
									}				
				echo json_encode(array("status"=>"ok","lista"=>$listapreguntas));
				break;

			case 'delete_preguntas_Evaluacion':
				$codeva = isset ($_POST["codeva"])? $_POST["codeva"]:"";
				if ( empty($codeva) ){	
					echo "errorParam";		
					exit();
				}
				$fechaReg = date("Y-m-d H:i:s"); 
				$codprof = $_SESSION['app_user_id'];
				require('../modelo/modelo_pregunta_em.php');
				$preguntas = new pregunta_mixta($db);
				if( $preguntas->delete_preguntas_Evaluacion($codeva,$codprof)){
					echo "Ok";
				}else{
					echo "error";
				}
				break;
		default:
			echo "ErrorOP";
			break;
	}
?>