<?php 
session_start();
require 'includes/functions.php';
header("Content-Type: text/html;charset=utf-8");
/*if(!cliente_activo()){

    echo "eSession";

    exit();

}*/

if ($_GET) {

	switch ($_GET['op']) {

		case 'lad'://El director obtiene la lista de estudiantes	

			require 'includes/config.php';

			$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

			//Obteniendo todos lo alumnos

			$sql="select codigo,paterno,materno,nombres from alumno where estado='1' order by paterno,materno,nombres";

			$result=mysqli_query($db,$sql);

			$lista = array();

			while ($reg = $result->fetch_object()) {

				$lista[] = array(

								"codigo" => $reg->codigo,

								"nombre" => utf8_encode($reg->codigo .' '.$reg->paterno.' '.$reg->materno.' '.$reg->nombres)

								); 

			}

			if ($lista>0) {

				$resp = array("status"=>"ok","lista"=>$lista);

    			echo json_encode($resp);

			}else{

				$resp = array("status"=>"noData");

    			echo json_encode($resp);

			}

			break;

		
		case 'aluhab': //Obtener la lista de alumnos habilitados con todos sus datos
			require 'includes/config.php';
			$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
			$acento = mysqli_query($db,"SET NAMES 'utf8'");

			//Obteniendo todos los estudiantes habilitados
			$sql = "select a.codigo,a.paterno,a.materno,a.nombres,concat(a.paterno,' ',a.materno,' ',a.nombres) as nombre, 
					u.login,u.password,u.servernt,u.usrimple,u.bdesktop,concat(c.descrip,' - ',p.descrip)as curso,a.cod_cur,
					a.cod_par,a.cel1 
					from alumno a inner join usr u on 
					a.codigo = u.id_usr inner join cursos c on 
					a.cod_cur = c.codigo inner join paralelos p on 
					a.cod_par = p.cod_par and a.estado = 1 order by nombre asc";

			if (!$alumnos = mysqli_query($db,$sql)) {
				echo "errorSqlAlu";
				exit();
			}

			//Obteniendo la tabla alu_tut
			$sql = "select distinct alt.codigo,alt.cod_tut,alt.parentesco,concat(t.paterno,' ',t.materno,' ',t.nombres)as tutor,
					t.cel,t.ci 
					from alu_tut alt inner join tutor t on 
					alt.cod_tut=t.cod_tut and alt.estado = 1";
			if (!$alutut = mysqli_query($db,$sql)) {
				echo "errorSqlAlutut";
				exit();
			}
			$alu_tut = array();
			while ($row_alu_tut = $alutut->fetch_object()) {
				$alu_tut[] = array(
								"tutor"=>$row_alu_tut->cod_tut,
								"alumno"=>$row_alu_tut->codigo,
								"nombre"=>$row_alu_tut->tutor,
								"parentesco"=>$row_alu_tut->parentesco,
								"celular"=>$row_alu_tut->cel,
								"ci"=>$row_alu_tut->ci
									);
			}
			$lista = array();
			while ($row_alumno = $alumnos->fetch_object()) {
				$codalu = $row_alumno->codigo;
				$nombre = $row_alumno->nombre;
				$paterno = $row_alumno->paterno;
				$materno = $row_alumno->materno;
				$nombres = $row_alumno->nombres;
				$curso = $row_alumno->curso;
				$codcur = $row_alumno->cod_cur;
				$codpar = $row_alumno->cod_par;
				$usuario = $row_alumno->login;
				$clave = $row_alumno->password;
				$boletin = ($row_alumno->bdesktop=='VERDADERO')?'1':'0';
				$plataforma = ($row_alumno->servernt=='VERDADERO')?'1':'0';
				$evaluacion = ($row_alumno->usrimple=='VERDADERO')?'1':'0';
				$celular = $row_alumno->cel1;
				$tutor = obtenerTutor($alu_tut,$codalu);
				$lista[] = array(
								"codalu"=>$codalu,
								"nombre"=>$nombre,
								"paterno"=>$paterno,
								"materno"=>$materno,
								"nombres"=>$nombres,
								"curso"=>$curso,
								"codcur"=>$codcur,
								"codpar"=>$codpar,
								"usuario"=>$usuario,
								"clave"=>$clave,
								"boletin"=>$boletin,
								"plataforma"=>$plataforma,
								"evaluacion"=>$evaluacion,
								//"perfil"=>$perfil,
								"celular"=>$celular,
								"tutor"=>$tutor
								);


			}
			//Obteniendo la lista de tutores
			$sql = "select cod_tut,ci,cel,concat(paterno,' ',materno,' ',nombres) as nombre from tutor";
			if (!$sqlTutores = mysqli_query($db,$sql)) {
				echo "errorSqlTutores";
				exit();
			}
			$lista_tutores = array();
			while ($row_tutor = $sqlTutores->fetch_object()) {
				$lista_tutores[] = array(
										"codtut"=>$row_tutor->cod_tut,
										"celular"=>$row_tutor->cel,
										"cedula"=>$row_tutor->ci,
										"nombre"=>$row_tutor->nombre

										);
			}
			if (count($lista)>0) {
				$resp = array("status"=>"ok","lista"=>$lista,"tutores"=>$lista_tutores);
				echo json_encode($resp);
			}else{
				echo "noLista";
			}

			break;
		case 'sdalu'://Guardar o actualizar los datos de un estudiante
			if (!$data = json_decode(file_get_contents('php://input'), true)) {
				echo "errorJSON";
				exit();
			}			
			$codalu = $data['codalu'];
			$paterno = $data['paterno'];
			$materno = $data['materno'];
			$nombres = $data['nombres'];
			$codcur = $data['codcur'];
			$codpar = $data['codpar'];
			$usuario = $data['usuario'];
			$clave = $data['clave'];
			$boletin = $data['boletin']=='1'?'VERDADERO':'FALSO';
			$plataforma = $data['plataforma']=='1'?'VERDADERO':'FALSO';
			$evaluacion = $data['evaluacion']=='1'?'VERDADERO':'FALSO';
			$tutores = $data['tutores'];

			require 'includes/config.php';
			$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
			$acento = mysqli_query($db,"SET NAMES 'utf8'");

			//Validando que el alumno esté habilitado
			$sql = "select * 
					from alumno 
					where codigo = ".$codalu;
			if (!$result = mysqli_query($db,$sql)) {
				echo "errorSqlAlu";
				exit();
			}
			if (!$rowAlu = $result->fetch_object()) {
				echo "noAlu";//El código de alumno no existe...
				exit();
			}
			if ($rowAlu->estado==0) {
				echo "noHablitado"; //El estudiante no está habilitado
				exit();
			}
			$sql = "update alumno 
					set paterno='".$paterno."',
						materno='".$materno."',
						nombres='".$nombres."',
						codalu='".$usuario."',
						cod_cur=".$codcur.",
						cod_par=".$codpar." 
						where codigo=".$codalu;
			if (!$result=mysqli_query($db,$sql)) {
				echo "errorSqlUpdateAlu";
				exit();
			}

			$sql = "update usr 
					set nombre_usr='".$nombres.' '.$paterno.' '.$materno."',
						login='".$usuario."',
						password=".$clave."  
					where id_usr=".$codalu;

			if (!$result=mysqli_query($db,$sql)) {
				echo "errorSqlUpdateUsr";
				exit();
			}

			if (count($tutores)==0) {//Si no hay ningun tutor
				$sql = "update alu_tut set estado=0 where codigo=".$codalu;
				if (!$result = mysqli_query($db,$sql)) {
					echo "errorSqlTutReg";
					exit();
				}
				echo "ok";
				exit();
			}
			//obteniendo la lista de tutores asignados
			$sql = "select * from alu_tut where codigo=".$codalu;
			if (!$result = mysqli_query($db,$sql)) {
				echo "errorSqlTutReg";
				exit();
			}
			$lista_tutores_actuales = array();
			while ($row_tutor_actual = $result->fetch_object()) {
				$lista_tutores_actuales[] = array(
												"codtut"=>$row_tutor_actual->cod_tut,
												"nro"=>$row_tutor_actual->nro,
												"estado"=>$row_tutor_actual->estado
													);
			}

			for ($i=0; $i < count($tutores); $i++) {
				$codtut = $tutores[$i];
				if ($existe = existeTutor($codtut,$lista_tutores_actuales)) {
					if ($existe['estado']=='0') {
						$nro = $existe['nro'];
						$sql = "update alu_tut set estado = 1 where nro=".$nro;
						if (!$result = mysqli_query($db,$sql)) {
							echo "errorUpdateTutor";
							exit();
						}
					}
				}else{
					$sql = "insert into alu_tut(codigo,cod_tut,parentesco,estado) values(".$codalu.",".$codtut.",'tutor',1)";
					if (!$result = mysqli_query($db,$sql)) {
						echo "errorInsertTutor";
						exit();
					}

				}					
			}
			for ($i=0; $i < count($lista_tutores_actuales); $i++) { 
				$codtutAct = $lista_tutores_actuales[$i]['codtut'];
				if (!estaenLista($codtutAct,$tutores)) {
					$sql = "update alu_tut set estado = 0 where cod_tut=".$codtutAct;
					if (!$result = mysqli_query($db,$sql)) {
						echo "errorDeleteTutor";
						exit();
					}
				}
			}


			echo "ok";
			exit();
			
			break;
		case 'boletin':
		    if(!isset($_POST['codalu'])||empty($_POST['codalu'])||
		       !isset($_POST['estado'])){
		           echo "errorParam";
		           exit();
		       }
		    $codalu = $_POST['codalu'];
		    $estado = $_POST['estado'];
		    require 'includes/config.php';
			$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
			if($estado==0){
			    $sql = "update usr set bdesktop='FALSO' where id_usr = ".$codalu;
			    $result = mysqli_query($db,$sql);
			    echo "ok";
			}else{
			    $sql = "update usr set bdesktop='VERDADERO' where id_usr = ".$codalu;  
			    $result = mysqli_query($db,$sql);
			    echo "ok";
			}
		    break;
		    case 'plataforma':
		    if(!isset($_POST['codalu'])||empty($_POST['codalu'])||
		       !isset($_POST['estado'])){
		           echo "errorParam";
		           exit();
		       }
		    $codalu = $_POST['codalu'];
		    $estado = $_POST['estado'];
		    require 'includes/config.php';
			$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
			if($estado==0){
			    $sql = "update usr set servernt='FALSO' where id_usr = ".$codalu;
			    $result = mysqli_query($db,$sql);
			    echo "ok";
			}else{
			    $sql = "update usr set servernt='VERDADERO' where id_usr = ".$codalu;  
			    $result = mysqli_query($db,$sql);
			    echo "ok";
			}
		    break;
		    case 'examen':
		    if(!isset($_POST['codalu'])||empty($_POST['codalu'])||
		       !isset($_POST['estado'])){
		           echo "errorParam";
		           exit();
		    }
		    $codalu = $_POST['codalu'];
		    $estado = $_POST['estado'];
		    require 'includes/config.php';
			$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
			if($estado==0){
			    $sql = "update usr set usrimple='FALSO' where id_usr = ".$codalu;
			    $result = mysqli_query($db,$sql);
			    echo "ok";
			}else{
			    $sql = "update usr set usrimple='VERDADERO' where id_usr = ".$codalu;  
			    $result = mysqli_query($db,$sql);
			    echo "ok";
			}
		    break;
		default:

			echo "errorOP";

			break;

	}

}else{

	echo "errorGET";

}	
function existeTutor($codtut,$lista_tutores_actuales){
	$ex = false;
	for ($i=0; $i < count($lista_tutores_actuales); $i++) { 
		if ($lista_tutores_actuales[$i]['codtut']==$codtut) {
			$ex=$lista_tutores_actuales[$i];
		}
	}
	return $ex;
}
function estaenLista($codtutAct,$tutores){
	for ($i=0; $i < count($tutores); $i++) { 
		if ($tutores[$i]==$codtutAct) {
			return true;
		}
	}
	return false;
}
function obtenerTutor($alu_tut,$codalu){
	$tutores = array();
	for ($i=0; $i < count($alu_tut) ; $i++) { 
		if ($alu_tut[$i]['alumno']==$codalu) {
			$tutores[] = array(
							"codtut"=>$alu_tut[$i]['tutor'],
							"nombre"=>$alu_tut[$i]['nombre'],
							"cedula"=>$alu_tut[$i]['ci'],
							"celular"=>$alu_tut[$i]['celular']
								);

				
		}
	}
	return $tutores;
}

?>