<?php 
header("Content-Type: application/json;charset=utf-8");
require 'includes/config.php';
require 'includes/functions.php';
$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
if ($_GET) {
	switch ($_GET['op']) {
		case 'est':
			if (isset($_POST['codigo'])&& !empty($_POST['codigo'])&&isset($_POST['clave'])&& !empty($_POST['clave'])&&
			    isset($_POST['token'])&& !empty($_POST['token'])){
				$codigo = $_POST['codigo'];
				$clave = $_POST['clave'];
				$token = $_POST['token'];

				$sql = "select concat(paterno , ' ' , materno,' ',nombres) as nombre ,curso 
						from alumno
						where estado=1 and codigo = ".$codigo." and 
							  clave = '".$clave."'";

				$consulta = mysqli_query($db,$sql);
				if ($row = $consulta->fetch_object()) {
					$array = array(
									"status" => "ok",
									"mensaje" => "Se ha habilitado...",
									"nombre" => utf8_encode($row->nombre),
									"curso" => utf8_encode($row->curso)
									);
					$sql = "select * from UserToken where UserId = '".$codigo."' and UserType = 2 and State = 1";
					$consulta = mysqli_query($db,$sql);
					$fecha = date("Y-m-d H:i:s");
					if($row = $consulta->fetch_object()){
					    $id = $row->Id;
					    
					    $sql = "update UserToken set FirebaseToken = ".$token.",UpdateAt='".$fecha."' where Id = ".$id;
					    $result = mysqli_query($db,$sql);
					}else{
					    $sql = "insert into UserToken(UserId,UserType,FirebaseToken,State,CreateAt) values('".$codigo."',2,'".$token."',1,'".$fecha."')";
					    $result = mysqli_query($db,$sql);
					}
					
					echo json_encode($array);

				}else{
					$array = array(
									"status" => "invalid",
									"mensaje" => "El usuario no existe..."
									);
					echo json_encode($array);
				}
			}else{
				echo "paramError";
			}
			break;
		case 'adm':
			if (!empty($_POST['codigo'])&& isset($_POST['codigo'])&&!empty($_POST['clave'])&& isset($_POST['clave'])){
				$codigo = $_POST['codigo'];
				$clave = $_POST['clave'];

				$sql = "select concat(apepro , ' ' , nompro) as nombre ,cargo 
						from personal
						where cod_per = ".$codigo." and 
							  clave = '".$clave."'";

				$consulta = mysqli_query($db,$sql);
				if ($row = $consulta->fetch_object()) {
					$array = array(
									"status" => "ok",
									"mensaje" => "Se ha habilitado...",
									"nombre" => utf8_encode($row->nombre),
									"cargo" => utf8_encode($row->cargo)
									);
					$sql = "select * from UserToken where UserId = '".$codigo."' and UserType = 5 and State = 1";
					$consulta = mysqli_query($db,$sql);
					$fecha = date("Y-m-d H:i:s");
					if($row = $consulta->fetch_object()){
					    $id = $row->Id;
					    
					    $sql = "update UserToken set FirebaseToken = ".$token.",UpdateAt='".$fecha."' where Id = ".$id;
					    $result = mysqli_query($db,$sql);
					}else{
					    $sql = "insert into UserToken(UserId,UserType,FirebaseToken,State,CreateAt) values('".$codigo."',5,'".$token."',1,'".$fecha."')";
					    $result = mysqli_query($db,$sql);
					}
					echo json_encode($array);

				}else{
					$array = array(
									"status" => "invalid",
									"mensaje" => "El usuario no existe..."
									);
					echo json_encode($array);
				}
			}else{
				echo "paramError";
			}
			break;
		case 'profesor':
			if (!empty($_POST['codigo'])&& isset($_POST['codigo'])&&!empty($_POST['clave'])&& isset($_POST['clave'])){
				$codigo = $_POST['codigo'];
				$clave = $_POST['clave'];

				$sql = "select concat(apepro , ' ' , nompro) as nombre 
						from profe
						where codprof = '".$codigo."' and 
							  clave = '".$clave."'";

				$consulta = mysqli_query($db,$sql);
				if ($row = $consulta->fetch_object()) {
					$array = array(
									"status" => "ok",
									"mensaje" => "Se ha habilitado...",
									"nombre" => utf8_encode($row->nombre)
									);
					$sql = "select * from UserToken where UserId = '".$codigo."' and UserType = 3 and State = 1";
					$consulta = mysqli_query($db,$sql);
					$fecha = date("Y-m-d H:i:s");
					if($row = $consulta->fetch_object()){
					    $id = $row->Id;
					    
					    $sql = "update UserToken set FirebaseToken = ".$token.",UpdateAt='".$fecha."' where Id = ".$id;
					    $result = mysqli_query($db,$sql);
					}else{
					    $sql = "insert into UserToken(UserId,UserType,FirebaseToken,State,CreateAt) values('".$codigo."',3,'".$token."',1,'".$fecha."')";
					    $result = mysqli_query($db,$sql);
					}
					echo json_encode($array);

				}else{
					$array = array(
									"status" => "invalid",
									"mensaje" => "El usuario no existe..."
									);
					echo json_encode($array);
				}
			}else{
				echo "paramError";
			}
			break;
		case 'tutor':
			if (!empty($_POST['cedula'])&& isset($_POST['cedula'])&&!empty($_POST['telefono'])&& isset($_POST['telefono'])){
				$cedula = $_POST['cedula'];
				$telefono = $_POST['telefono'];

				$sql = "select concat(paterno,' ',materno,' ',nombres) as nombre,cod_tut as codigo
						from tutor
						where ci LIKE '".$cedula."%' and 
							  cel = '".$telefono."'";

				$consulta = mysqli_query($db,$sql);

				if ($row = $consulta->fetch_object()) {
					$array = array(
									"status" => "ok",
									"mensaje" => "Se ha habilitado...",
									"nombre" => $row->nombre,
									"codigo" =>$row->codigo
									);
					$sql = "select * from UserToken where UserId = '".$row->codigo."' and UserType = 1 and State = 1";
					$consulta = mysqli_query($db,$sql);
					$fecha = date("Y-m-d H:i:s");
					if($row = $consulta->fetch_object()){
					    $id = $row->Id;
					    
					    $sql = "update UserToken set FirebaseToken = ".$token.",UpdateAt='".$fecha."' where Id = ".$id;
					    $result = mysqli_query($db,$sql);
					}else{
					    $sql = "insert into UserToken(UserId,UserType,FirebaseToken,State,CreateAt) values('".$row->codigo."',1,'".$token."',1,'".$fecha."')";
					    $result = mysqli_query($db,$sql);
					}
					echo json_encode($array);
				}else{
					$array = array(
									"status" => "invalid",
									"mensaje" => "El usuario no existe..."
									);
					echo json_encode($array);
				}
			}else{
				echo "paramError";
			}
			break;
			case 'alu':
				if (!empty($_POST['codigo'])&& isset($_POST['codigo'])&&!empty($_POST['clave'])&& isset($_POST['clave'])){
					$codigo = $_POST['codigo'];
					$clave = $_POST['clave'];

					$sql = "select id_user, nombre_usr
							from usr
							where login = '".$codigo."%' and 
								  password = '".$clave."'";

					$consulta = mysqli_query($db,$sql);

					if ($row = $consulta->fetch_object()) {
						$array = array(
										"status" => "ok",
										"mensaje" => "Se ha habilitado...",
										"codigo" => $row->id_user,
										"nombre" =>$row->nombre_usr
										);
						
						echo json_encode($array);
					}else{
						$array = array(
										"status" => "invalid",
										"mensaje" => "El usuario no existe..."
										);
						echo json_encode($array);
					}
				}else{
					echo "paramError";
				}
				break;
		default:
			echo "paramErrorSwitch";
			break;
	}
}else{
	echo "paramErrorGet";
}

?>