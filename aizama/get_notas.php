<?php
session_start();
require 'includes/functions.php';
if(!cliente_activo()){
  echo 'eSession';
  exit();
}
if (isset($_GET['op'])) {
	switch ($_GET['op']) {
		//listamos las notas de los alumnos de un curso en una materia
		case 'lista':
			if (isset($_POST['curso'])&&!empty($_POST['curso'])&&isset($_POST['codpar'])&&!empty($_POST['codpar'])&&isset($_POST['materia'])&&!empty($_POST['materia'])){//existen las variables y no estan vacias
				
				require 'includes/config.php';
				$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

				$codCurso = $_POST['curso'];//obtnenmos el codigo de curso
				$codMateria = $_POST['materia'];//obtenemos el codigo de la materia
				$bimestre = $_SESSION['app_user_bimestre'];
				$codpar = $_POST['codpar'];

				//Obtenemos la lista de estudiantes
				$sql="select codigo,paterno,materno,nombres as nombre
					  from alumno where estado=1 and cod_cur = '".$codCurso."' and cod_par = ".$codpar."
					  order by paterno,materno,nombres";
				if($listaAlum = mysqli_query($db,$sql)){ //ejecutando consulta
					$lista = array();
					while ($row = $listaAlum->fetch_object()) {//recorriendo los registros obtenidos de la consulta
						//Obtencion de la nota segun el bimestre
						if ($bimestre=='1') {$sql = "select nota1 as nota from notas where codigo = '".$row->codigo."' and cod_mat = '".$codMateria."' and estado = 1";}
						if ($bimestre=='2') {$sql = "select nota2 as nota from notas where codigo = '".$row->codigo."' and cod_mat = '".$codMateria."' and estado = 1";}
						if ($bimestre=='3') {$sql = "select nota3 as nota from notas where codigo = '".$row->codigo."' and cod_mat = '".$codMateria."' and estado = 1";}
						if ($bimestre=='4') {$sql = "select nota4 as nota from notas where codigo = '".$row->codigo."' and cod_mat = '".$codMateria."' and estado = 1";}
								
						$resultNota = mysqli_query($db,$sql);

						$nota = '';
						
						if (mysqli_num_rows($resultNota)>0) {
							$rowNota = $resultNota->fetch_object();
							$nota = $rowNota->nota;
						}
					
						$lista[]=array(	
										"codigo" => $row->codigo,
										"nombre" =>utf8_encode(trim($row->paterno))." ".utf8_encode(trim($row->materno))." ".utf8_encode(trim($row->nombre)),
										"nota" => $nota
									   );
					}
					
					if (count($lista)>0) {
						echo json_encode($lista);
					}else{
						echo "NoResult";
					}

					
				}else{
					echo "eData";
				}
			}else{
				echo "ParamError";
			}
			
		
		break;

		//guardar las notas de los estudiantes de una materia

		case 'saveListNota':
			if (isset($_POST['lista'])&&!empty($_POST['lista'])&&isset($_POST['materia'])&&!empty($_POST['materia'])){
				
				if ($lista = json_decode($_POST['lista'],true)) {
					
					require 'includes/config.php';
					$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

					$codMateria = $_POST['materia'];
					$bim = $_SESSION['app_user_bimestre'];

					$userId=$_SESSION['app_user_id'];

					for ($i=0; $i < count($lista); $i++){ 
						$codAlum = $lista[$i]['codigo'];
						$notaAlum = $lista[$i]['nota'];
                        if($notaAlum>100||$notaAlum<0){
                            echo "error";
                            exit();
                        }
						$sql = "select * from notas where codigo = '".$codAlum."' and cod_mat = '".$codMateria."' and estado = 1";
						$result = mysqli_query($db,$sql);
						$time = time();
                        
						if (mysqli_num_rows($result)>0) {

							$row = $result->fetch_object();
							$nota=0;

							if ($bim == 1) {$nota = trim($row->nota1);}
							if ($bim == 2) {$nota = trim($row->nota2);}
							if ($bim == 3) {$nota = trim($row->nota3);}
							if ($bim == 4) {$nota = trim($row->nota4);}

							if ($nota!=$notaAlum && $notaAlum!="") {

								$sql = "update notas set estado = 0 where codigo = '".$codAlum."' and cod_mat = '".$codMateria."' and estado = 1";
								$result = mysqli_query($db,$sql);

								

								if ($bim == 1) {$sql = "insert into notas(codigo,cod_mat,nota1,nota2,nota3,nota4,final,estado,usr,fecha,hora) values('".$codAlum."','".$codMateria."','".$notaAlum."','".$row->nota2."','".$row->nota3."','".$row->nota4."','".$row->final."','1','"./*$_SESSION['app_user_id']*/$userId."','".date('Y-m-d')."','".date("H:i:s",$time)."')";}
								if ($bim == 2) {$sql = "insert into notas(codigo,cod_mat,nota1,nota2,nota3,nota4,final,estado,usr,fecha,hora) values('".$codAlum."','".$codMateria."','".$row->nota1."','".$notaAlum."','".$row->nota3."','".$row->nota4."','".$row->final."','1','"./*$_SESSION['app_user_id']*/$userId."','".date('Y-m-d')."','".date("H:i:s",$time)."')";}
								if ($bim == 3) {$sql = "insert into notas(codigo,cod_mat,nota1,nota2,nota3,nota4,final,estado,usr,fecha,hora) values('".$codAlum."','".$codMateria."','".$row->nota1."','".$row->nota2."','".$notaAlum."','".$row->nota4."','".$row->final."','1','"./*$_SESSION['app_user_id']*/$userId."','".date('Y-m-d')."','".date("H:i:s",$time)."')";}
								if ($bim == 4) {$sql = "insert into notas(codigo,cod_mat,nota1,nota2,nota3,nota4,final,estado,usr,fecha,hora) values('".$codAlum."','".$codMateria."','".$row->nota1."','".$row->nota2."','".$row->nota3."','".$notaAlum."','".$row->final."','1','"./*$_SESSION['app_user_id']*/$userId."','".date('Y-m-d')."','".date("H:i:s",$time)."')";}

								$result = mysqli_query($db,$sql);
							}/*else if($nota==0&&$notaAlum!=0){
								if ($bim == 1) {$sql = "update notas set nota1='".$notaAlum."',usr='".$userId."',fecha='".date("Y-m-d")."',hora='".date("H:i:s",$time)."' where codigo='".$codAlum."' and cod_mat='".$codMateria."'";}
								if ($bim == 2) {$sql = "update notas set nota2='".$notaAlum."',usr='".$userId."',fecha='".date("Y-m-d")."',hora='".date("H:i:s",$time)."' where codigo='".$codAlum."' and cod_mat='".$codMateria."'";}
								if ($bim == 3) {$sql = "update notas set nota3='".$notaAlum."',usr='".$userId."',fecha='".date("Y-m-d")."',hora='".date("H:i:s",$time)."' where codigo='".$codAlum."' and cod_mat='".$codMateria."'";}
								if ($bim == 4) {$sql = "update notas set nota4='".$notaAlum."',usr='".$userId."',fecha='".date("Y-m-d")."',hora='".date("H:i:s",$time)."' where codigo='".$codAlum."' and cod_mat='".$codMateria."'";}
								
								$result = mysqli_query($db,$sql);
							}*/

						}else if($notaAlum!=""){
							if ($bim == 1) {$sql = "insert into notas(codigo,cod_mat,nota1,nota2,nota3,nota4,final,estado,usr,fecha,hora) values('".$codAlum."','".$codMateria."','".$notaAlum."','','','','','1','"./*$_SESSION['app_user_id']*/$userId."','".date('Y-m-d')."','".date("H:i:s",$time)."')";}
							if ($bim == 2) {$sql = "insert into notas(codigo,cod_mat,nota1,nota2,nota3,nota4,final,estado,usr,fecha,hora) values('".$codAlum."','".$codMateria."','','".$notaAlum."','','','','1','"./*$_SESSION['app_user_id']*/$userId."','".date('Y-m-d')."','".date("H:i:s",$time)."')";}
							if ($bim == 3) {$sql = "insert into notas(codigo,cod_mat,nota1,nota2,nota3,nota4,final,estado,usr,fecha,hora) values('".$codAlum."','".$codMateria."','','','".$notaAlum."','','','1','"./*$_SESSION['app_user_id']*/$userId."','".date('Y-m-d')."','".date("H:i:s",$time)."')";}
							if ($bim == 4) {$sql = "insert into notas(codigo,cod_mat,nota1,nota2,nota3,nota4,final,estado,usr,fecha,hora) values('".$codAlum."','".$codMateria."','','','','".$notaAlum."','','1','"./*$_SESSION['app_user_id']*/$userId."','".date('Y-m-d')."','".date("H:i:s",$time)."')";}
                            
							$result = mysqli_query($db,$sql);
	

						}
					}
					echo "ok";
						
				}else{
					echo "ParamErrorJSON";
				}

			}else{
				echo "ParamError";
			}
		break;
	
		default:
	
		break;
	}

}else{
	echo "ParamError";
}
?>