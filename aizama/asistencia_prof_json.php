<?php 
session_start();
require 'includes/functions.php';

if(!cliente_activo())
{
	$resp = array("status"=>"eSession");
  	echo json_encode($resp);
  	exit();
}

if ($_GET) {
	switch ($_GET['op']) {
		case 'lista'://Obtiene la lista de asistencia de los profesores dada una fecha
			if (isset($_POST['fecha'])&&!empty($_POST['fecha'])) {

				$fecha = $_POST['fecha'];
				$formatoFecha = formatodefecha($fecha);
				require 'includes/config.php';
				$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
				 //Obteniendo la lista de profesores
				$sql = "select codprof,concat(apepro,' ',nompro) as nombre from profe where estado='activo'";
				
				if ($result = mysqli_query($db,$sql)) {
					$listaProfesores = array();
					while ($row = $result->fetch_object()) {
						$listaProfesores[] = array(
													"codprof" => $row->codprof,
													"nombre" => $row->nombre
													);
					}

					if (count($listaProfesores)>0) {
						$registroES = array();
						for ($i=0; $i < count($listaProfesores); $i++) { 
							$codprof = $listaProfesores[$i]['codprof'];
							$nombre = $listaProfesores[$i]['nombre'];
							//Obteniendo el registro de entrada y salida de un profesor dada una fecha 
							$sql = "select hora,tipo from asistencias_prof where fecha='".$fecha."' and codprof='".$codprof."'";
						
							if ($result1 = mysqli_query($db,$sql)) {
								$horaIngreso = 'sin marcar';
								$horaSalida = 'sin marcar';
								if($row1 = $result1->fetch_object()){
									$horaIngreso = $row1->hora;
									if ($row1 = $result1->fetch_object()) {
										$horaSalida = $row1->hora;
									}
									$registroES[] = array(
														"codprof" => $codprof,
														"nombre" => utf8_encode($nombre),
														"ingreso" => $horaIngreso,
														"salida" => $horaSalida
														);
								}else{
									$registroES[] = array(
														"codprof" => $codprof,
														"nombre" => utf8_encode($nombre),
														"ingreso" => "sin marcar",
														"salida" => "sin marcar"
														);
								}
							}
						}
						if(count($registroES)>0){
							$resp = array("status"=>"ok","lista"=>$registroES,"dia"=>$formatoFecha);
		  					echo json_encode($resp);
						}else{
							$resp = array("status"=>"noAsistencias");
	  					echo json_encode($resp);
						}
					}else{
						$resp = array("status"=>"noProfes");
	  					echo json_encode($resp);
					}
				}else{
					$resp = array("status"=>"error");
	  				echo json_encode($resp);
				}
			}else{
				$resp = array("status"=>"errorParam");
			  	echo json_encode($resp);				
			}
			
			break;
		case 'glp'://Obtener registros de asistencias por busqueda de fecha y materia
			if (isset($_POST['codcur'])&&!empty($_POST['codcur'])&&
				isset($_POST['codpar'])&&!empty($_POST['codpar'])&&
				isset($_POST['fecha'])&&!empty($_POST['fecha'])) {
				
				$codcur = $_POST['codcur'];
				$codpar = $_POST['codpar'];
				$fecha = $_POST['fecha'];
				$codprof = $_SESSION['app_user_id'];
				//$codprof = 'D10';

				require 'includes/config.php';
				$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

				$fechaActual = date("Y-m-d");
				$horaActual = date("H:i:s");
				$gestion = date("Y");
				
				if ($fechaActual==$fecha||esmayor($fechaActual,$fecha)) {
					//Obteniendo todas las clases virtuales programadas en fecha actual hasta la hora actual
					$sql = "select m.descri ,cv.codmat,cv.id,cv.horaIni,cv.horaFin from claseVirtual cv inner join prof_cur_mat pcm on cv.codCur = pcm.codcur and 
							cv.codPar=pcm.codpar inner join materia m on m.codmat=cv.codMat and cv.codMat=pcm.codmat and pcm.estado='activo' and pcm.gestion=".$gestion." 
							and pcm.prof='".$codprof."' and cv.gestion = pcm.gestion and cv.estado = 1 and cv.fecha='".$fecha."' order by cv.horaFin desc";
				   
					$result = mysqli_query($db,$sql);
					$lista_clases = array();
					while ($row = $result->fetch_object()) {
						$lista_clases[]=array(
											"id"=>$row->id,
											"inicio"=>$row->horaIni,
											"fin"=>$row->horaFin,
											"codmat"=>$row->codmat,
											"nombre"=>utf8_encode($row->descri)
											);
					}


					if (count($lista_clases)>0) {
						//Obteniendo la lista de alumnos del curso
						$sql = "select codigo,concat(paterno,' ',materno,' ',nombres) as nombre from alumno where cod_par=".$codpar." and estado=1 and cod_cur=".$codcur;
						
						$result1 = mysqli_query($db,$sql);
						$lista_alumnos = array();

						$listas_de_asistencias = array();
						$lista_clase_actual = array();//Array que contendrá la clase que se esta realizando en este momento

						while ($row2 = $result1->fetch_object()) {
							$lista_alumnos[] = array(
												"codalu"=>$row2->codigo,
												"nombre"=>$row2->nombre
												);
						}

						if (count($lista_alumnos)>0) {
							for ($i=0; $i < count($lista_clases) ; $i++) { 
								$codclase = $lista_clases[$i]['id'];
								$inicio = $lista_clases[$i]['inicio'];
								$fin = $lista_clases[$i]['fin'];
								$codmat = $lista_clases[$i]['codmat'];
								$nombre = $lista_clases[$i]['nombre'];

								//Obteniendo los estudiantes con registro a esta clase
								$sql = "select codalu,estado from registro_asistencias where codclase=".$codclase;
								
								$result3 = mysqli_query($db,$sql);
								$listaRegistro = array();
								while ($row3 = $result3->fetch_object()) {
									$listaRegistro[]=array(
															"codalu"=>$row3->codalu,
															"estado"=>$row3->estado
															);
								}
								//Creando la lista de asistencia con todos los datos de asistencia
								$lista = array();
								for ($j=0; $j < count($lista_alumnos); $j++) { 
									$lista[]=array(
													"codalu"=>$lista_alumnos[$j]['codalu'],
													"nombre"=>utf8_encode($lista_alumnos[$j]['nombre']),
													"asistencia"=>obtenerEstado($listaRegistro,$lista_alumnos[$j]['codalu'])
													);					
								}
								
								
								if ($fechaActual==$fecha) {
								    
									//La clase se esta dando en este instante
									if (strtotime($horaActual)>=strtotime($inicio)&&
										strtotime($horaActual)<=strtotime($fin)) {
										$lista_clase_actual[]=array(
																	"codclase"=>$codclase,
																	"lista"=>$lista,
																	"estado"=>"1"
																	);
									
									}
									//La clase ya paso
									
									if (strtotime($horaActual)>strtotime($fin)) {
										$listas_de_asistencias[]=array(
																		"codclase"=>$codclase,
																		"lista"=>$lista,
																		"estado"=>"0"
																		);
									
									}
								}else{
									$listas_de_asistencias[]=array(
																	"codclase"=>$codclase,
																	"lista"=>$lista,
																	"estado"=>"0"
																	);
								}
								
							}
							//Preparando las listas de asistencias, ordenadas de acuerdo si hay una clase que se esté llevando a cabo
							$listas_final = array();
							if (count($lista_clase_actual)>0) {
								$listas_final[]=$lista_clase_actual[0];
								for ($i=0; $i < count($listas_de_asistencias); $i++) { 
									$listas_final[] = $listas_de_asistencias[$i];
								}
							}else{
								for ($i=0; $i < count($listas_de_asistencias); $i++) { 
									$listas_final[] = $listas_de_asistencias[$i];
								}
							}
							$lista_clases_final = array(); //Lista que tendrá las clases ordenando en la primera posición la clase que se esté llevando a cabo si la hubiese
							for ($i=0; $i < count($listas_final); $i++) { 
								$lista_clases_final[]=obtenerClase($listas_final[$i]['codclase'],$lista_clases);
							}

							$resp = array(
											"status"=>"ok",
											"clases"=>$lista_clases_final,
											"listas"=>$listas_final
										);

							echo json_encode($resp);


						}else{
							$resp = array("status"=>"noAlumnos");
	  						echo json_encode($resp);
						}
						
					}else{
						$resp = array("status"=>"noClases");
	  					echo json_encode($resp);
					}			# code...
				}else{
					$resp = array("status"=>"errorFecha");
				  	echo json_encode($resp);					
				}
				

			}else{
				$resp = array("status"=>"errorParam");
  				echo json_encode($resp);				
			}
			break;
			case 'asist':
				if (isset($_POST['tipo'])&&!empty($_POST['tipo'])) {
					$codprof = $_SESSION['app_user_id'];
					$tipo = $_POST['tipo'];   //TIPO de registro (2 SALIDA) (1 INGRESO)

					$fecha = date("Y-m-d");
					$hora = date("H:i:s");

					require 'includes/config.php';
					$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

					//Validando el registro
					if ($tipo == 1) {//se quiere registrar un ingreso
						$sql = "select count(*) as reg from asistencias_prof where codprof='".$codprof."' and estado = 1 and fecha='".$fecha."' and tipo ='E'";
						if($result = mysqli_query($db,$sql)){
							$row = $result->fetch_object();
							if ($row->reg == 0) {
								$sql = "insert into asistencias_prof(codprof,fecha,hora,estado,tipo) values('".$codprof."','".$fecha."','".$hora."',1,'E')";
								if ($resul = mysqli_query($db,$sql)) {
	  								echo "ok";
								}
							}else{
								echo "yaIngreso";
							}
						}else{
	  						echo "error";
						}
					}else if ($tipo == 2) {//El usuario quiere registrar una salida
						//Verificando que haya registrado un ingreso
						$sql = "select count(*) as reg from asistencias_prof where codprof='".$codprof."' and estado = 1 and fecha='".$fecha."' and tipo ='E'";
						if($result = mysqli_query($db,$sql)){
							$row = $result->fetch_object();
							if ($row->reg > 0) {//El profesor ha registrado su ingreso previamente
								//Validando que ya hubiese registrado la salida
								$sql = "select count(*) as reg from asistencias_prof where codprof='".$codprof."' and estado = 1 and fecha='".$fecha."' and tipo ='S'";
								if ($result2 = mysqli_query($db,$sql)) {
									$row2 = $result2->fetch_object();
									if ($row2->reg == 0) {
										$sql = "insert into asistencias_prof(codprof,fecha,hora,estado,tipo) values('".$codprof."','".$fecha."','".$hora."',1,'S')";
										if ($resul = mysqli_query($db,$sql)) {
			  								echo "ok";
										}else{
											echo "error";
										}
									}else{
										echo "yaRegistrado";
									}
								}else{
									echo "error";
								}
								
							}else{
								echo "noIngreso";
							}
						}else{
							echo "error";
						}
					}else{
						echo "errorTipo";
					}
				}else{
					echo "errorParam";				
				}
				break;
			case 'asist_adm':
				if (isset($_POST['tipo'])&&!empty($_POST['tipo'])&&
					isset($_POST['doc'])&&!empty($_POST['doc'])) {
					$codprof = $_POST['doc'];
					$tipo = $_POST['tipo'];   //TIPO de registro (2 SALIDA) (1 INGRESO)

					$fecha = date("Y-m-d");
					$hora = date("H:i:s");

					require 'includes/config.php';
					$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

					//Validando el registro
					if ($tipo == 1) {//se quiere registrar un ingreso
						$sql = "select count(*) as reg from asistencias_prof where codprof='".$codprof."' and estado = 1 and fecha='".$fecha."' and tipo ='E'";
						if($result = mysqli_query($db,$sql)){
							$row = $result->fetch_object();
							if ($row->reg == 0) {
								$sql = "insert into asistencias_prof(codprof,fecha,hora,estado,tipo) values('".$codprof."','".$fecha."','".$hora."',1,'E')";
								if ($resul = mysqli_query($db,$sql)) {
	  								echo "ok";
								}
							}else{
								echo "yaIngreso";
							}
						}else{
	  						echo "error";
						}
					}else if ($tipo == 2) {//El usuario quiere registrar una salida
						//Verificando que haya registrado un ingreso
						$sql = "select count(*) as reg from asistencias_prof where codprof='".$codprof."' and estado = 1 and fecha='".$fecha."' and tipo ='E'";
						if($result = mysqli_query($db,$sql)){
							$row = $result->fetch_object();
							if ($row->reg > 0) {//El profesor ha registrado su ingreso previamente
								//Validando que ya hubiese registrado la salida
								$sql = "select count(*) as reg from asistencias_prof where codprof='".$codprof."' and estado = 1 and fecha='".$fecha."' and tipo ='S'";
								if ($result2 = mysqli_query($db,$sql)) {
									$row2 = $result2->fetch_object();
									if ($row2->reg == 0) {
										$sql = "insert into asistencias_prof(codprof,fecha,hora,estado,tipo) values('".$codprof."','".$fecha."','".$hora."',1,'S')";
										if ($resul = mysqli_query($db,$sql)) {
			  								echo "ok";
										}else{
											echo "error";
										}
									}else{
										echo "yaRegistrado";
									}
								}else{
									echo "error";
								}
								
							}else{
								echo "noIngreso";
							}
						}else{
							echo "error";
						}
					}else{
						echo "errorTipo";
					}
				}else{
					echo "errorParam";				
				}
				break;
		default:
			$resp = array("status"=>"errorOP");
  			echo json_encode($resp);
			break;
	}
}else{
	$resp = array("status"=>"errorGET");
  	echo json_encode($resp);
}

function obtenerClase($codclase,$array){
	for ($i=0; $i < count($array); $i++) { 
		if ($array[$i]['id']==$codclase) {
			return $array[$i];
		}
	}
}

function obtenerEstado($array,$codalu){
	for ($i=0; $i < count($array) ; $i++) { 
		if ($array[$i]['codalu']==$codalu) {
			return $array[$i]['estado'];
		}
	}
	return 'sinregistro';
}
function esta($elemeto,$array){
	for ($i=0; $i < count($array); $i++) { 
		if ($array[$i]['codalu']==$elemeto) {
			return true;
		}
	}
	return false;
}
function esmayor($fecha1,$fecha2){
	$anio1 = substr($fecha1, 0,4);
	$anio2 = substr($fecha2, 0,4);
	if ($anio1>$anio2) {
		return true;
	}
	if ($anio1<$anio2) {
		return false;
	}
	
	$mes1 = deleteCero(substr($fecha1, 5,2));
	$mes2 = deleteCero(substr($fecha2, 5,2));

	if ($mes1>$mes2) {
		return true;
	}
	if ($mes1<$mes2) {
		return false;
	}

	$dia1 = deleteCero(substr($fecha1, 8,2));
	$dia2 = deleteCero(substr($fecha2, 8,2));

	if ($dia1>$dia2) {
		return true;
	}
	if ($dia1<$dia2) {
		return false;
	}


}
function deleteCero($string){

	if (substr($string, 0,1)=='0') {
		return substr($string, 1,1);
	}else{
		return $string;
	}
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


?>