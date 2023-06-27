<?php

session_start();

require 'includes/functions.php';



if(!cliente_activo())

{

  echo 'eSession';

  exit();

}

switch ($_GET['op']) {

	case 'alumnos':

	    require 'includes/config.php';

		$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

		$curso=$_POST['cod_curso'];

		$paralelo=$_POST['cod_par'];

		$sql="select descrip from cursos where codigo='".$curso."'";

		$result=mysqli_query($db,$sql);

		$result1=$result->fetch_object();

		$sql="select codigo,paterno,materno,nombres from alumno where cod_cur='{$curso}' and estado='1' and cod_par='{$paralelo}' order by paterno,materno,nombres";

		$result=mysqli_query($db,$sql);

		echo '<option value="0">Seleccionar alumno</option>';

		while ($reg = $result->fetch_object()) {

			echo '<option value=' . $reg->codigo . '>' . $reg->codigo .' '.$reg->paterno.' '.$reg->materno.' '.$reg->nombres. '</option>'; 

		}

		break;

	

	case 'est':

		 require 'includes/config.php';

		$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

		$codalu=$_POST['cod_alu'];

		$sql="select paterno,materno,nombres from alumno where codigo='".$codalu."'";

		$result=mysqli_query($db,$sql);

		$result1=$result->fetch_object();



		$nombre=$result1->paterno." ".$result1->materno." ".$result1->nombres;

		echo $nombre;



		break;

	case 'lista':

		 require 'includes/config.php';

		$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

		$curso=$_POST['cod_curso'];

		$paralelo=$_GET['paralelo'];

		$sql="select codigo,paterno,materno,nombres from alumno where cod_cur=".$curso." and estado='1' and cod_par='".$paralelo."' order by paterno,materno,nombres";

	

		$result=mysqli_query($db,$sql);

		$data="";

		$reg=$result->fetch_object();

		$data.=$reg->codigo;

		while ($reg=$result->fetch_object()) {

			$data.=",".$reg->codigo;

			

		}

		echo $data;

		break;

	case 'save':

		require 'includes/config.php';

		$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

		$obs=$_GET['obs'];

		$fecha = $_SESSION['app_user_sysdat'];

		$hora_actual = date("H:i:s");

		$codcur=$_POST['slccurso'];

		$codmat=$_POST['slcmateria'];

		$codalu=$_POST['slcalumnos'];



		$sql="select count(*) as cantidad from agenda";

		$result=mysqli_query($db,$sql);

		$result1=$result->fetch_object();

		$cant=$result1->cantidad;

		$cant=$cant+1;

		$sql="insert into agenda values(".$cant.",".$codcur.",'".$codmat."',".$codalu.",".$obs.",'".$_SESSION['app_user_id']."','".$fecha."','".$hora_actual."')";

		

		if($result=mysqli_query($db,$sql))

		{

			echo "eGrabado";

		}else{

			echo "error";

		}



			break;



		case 'asistentes':

			require 'includes/config.php';

			$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

			$curso = $_POST['slccurso'];

			$sql="select descrip from cursos where codigo='".$curso."'";

			$rspta=mysqli_query($db,$sql);



			if ($reg=$rspta->fetch_object()) {

				$cursodescrip=$reg->descrip;

				$fecha = date("H:i:s");

				$sql="select a.paterno as paterno,a.materno as materno,a.nombres as nombres from chat c inner join alumno a on c.c_recibe=a.codigo and c.fecha_e='".$fecha."' and a.curso='".$cursodescrip."' and c.idagenda='-1' order by paterno,materno,nombres";

				if($rspta=mysqli_query($db,$sql)){

				echo '<ul style="list-style:none;">';

				$cont=1;

				while ($reg=$rspta->fetch_object()) {

					echo "<li>".$cont.".- ".$reg->paterno." ".$reg->materno." ".$reg->nombres."</li>";

					$cont=$cont+1;

				}

				echo "</ul>";

			}else{

				echo "noResult";

			}



			}else{

				echo "error";

			}

			

		break;

		case 'Allalumnos':

			require 'includes/config.php';

			$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

			$sql="select codigo,paterno,materno,nombres from alumno where estado='1' order by paterno,materno,nombres";

			$result=mysqli_query($db,$sql);

			echo '<option value="">Seleccionar</option>';

			while ($reg = $result->fetch_object()) {

				echo '<option value=' . $reg->codigo . '>' . $reg->codigo .' '.$reg->paterno.' '.$reg->materno.' '.$reg->nombres. '</option>'; 

			}

		break;

		case 'cur_alu':

				require 'includes/config.php';

				$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

				$sql="select c.descrip as curso,c.codigo as codigo from alumno a inner join cursos c on c.descrip=a.curso and a.estado='1' and a.codigo='".$_POST['cod_alu']."'";

				$result=mysqli_query($db,$sql);

					if($reg=$result->fetch_object()){

						echo json_encode($reg);

					}

				break;	

		case 'obtener_tutores_cel':

		    $codcur = isset($_POST["codcur"])?$_POST["codcur"]:"";

		    $codpar = isset($_POST["codpar"])?$_POST["codpar"]:"";

		    

		    if(empty($codcur) || empty($codpar)){

		        echo "errorParam";

		        exit();

		    }

		    require 'includes/config.php';

		    $db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

		    

		    $sql = "select a.codigo, t.cod_tut,t.cel  

		            from alumno a inner join alu_tut at on 

		            a.codigo = at.codigo inner join tutor t on 

		            at.cod_tut = t.cod_tut and a.estado = 1 and at.estado = 1 and 

		            a.cod_cur = ".$codcur." and a.cod_par = ".$codpar;

		            

		    $result = mysqli_query($db,$sql);

		    $lista = array();

		    while($row = $result->fetch_object()){

		        $lista[] = array(

		                        "codalu"=>$row->codigo,

		                        "codtut"=>$row->cod_tut,

		                        "celular"=>$row->cel

		                        );

		    }

		    

		    echo json_encode(array("status"=>"ok","lista"=>$lista));

		    

		 break;

		case 'obtener_cel_tutor':

//		    $codcur = isset($_POST["codcur"])?$_POST["codcur"]:"";

//		    $codpar = isset($_POST["codpar"])?$_POST["codpar"]:"";

		    $codigo = isset($_POST["codpar"])?$_POST["codpar"]:"";

		    

		    if(empty($codigo)){

		        echo "errorParam";

		        exit();

		    }

		    require 'includes/config.php';

		    $db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

		    

		    $sql = "select a.codigo, t.cod_tut,t.cel  

		            from alumno a inner join alu_tut at on 

		            a.codigo = at.codigo inner join tutor t on 

		            at.cod_tut = t.cod_tut and a.estado = 1 and at.estado = 1 and 

		            a.codigo = ".$codigo;

		            

		    $result = mysqli_query($db,$sql);

		    $lista = array();

		    while($row = $result->fetch_object()){

		        $lista[] = array(

		                        "codalu"=>$row->codigo,

		                        "codtut"=>$row->cod_tut,

		                        "celular"=>$row->cel

		                        );

		    }

		    

		    echo json_encode(array("status"=>"ok","lista"=>$lista));

		    

		 break;
		 case 'alumno_celular':
		 	$codalu = isset($_POST['codalu'])?$_POST['codalu']:"";

		 	if(empty($codalu)){
		 		echo "";
		 		exit();
		 	}
		 	require 'includes/config.php';
		  $db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

		  $sql = "select * from alumno where codigo = ".$codalu." and estado = 1";
		  $result = mysqli_query($db,$sql);
		  if($row = $result->fetch_object()){
		  	echo $row->cel1;
		  }else{
		  	echo "";
		  }
		 	// code...
		 	break;
		 case 'mes_students':

				if (!isset($_POST['codalu'])||empty($_POST['codalu'])||!isset($_POST['codmat'])||empty($_POST['codmat'])) {
					echo "errorParam";
					exit();
				}
				$codmat = $_POST['codmat'];
				$codalu = $_POST['codalu'];
        		$codprof = $_SESSION['app_user_id'];

				require 'includes/config.php';	

				$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

        		$sql = "select * 
        				from alumno 
        				where codigo = ".$codalu;

        		$result = mysqli_query($db,$sql);
        		$row = $result->fetch_object();
        		$codcur = $row->cod_cur;
        		$codpar = $row->cod_par;


				$sql ="select mp.id, a.codigo, mp.mensaje,mp.hora,mp.fecha  
						from msg_pend mp inner join alumno a on 
						mp.cod_est = a.codigo and a.cod_cur=".$codcur." and a.cod_par = ".$codpar." and 
						mp.emisor = '".$codmat."' and mp.codusr = '".$codprof."' and tipo = 1 group by a.codigo, mp.mensaje,mp.hora order by mp.id asc";
				$result=mysqli_query($db,$sql);
				$lista_de_mensajes = array();
				while ($row = $result->fetch_object()) {
					$mens = $row->fecha == substr($row->mensaje,0,10)?substr($row->mensaje,12):$row->mensaje;
					$lista_de_mensajes[] = array(
												"codalu"=>$row->codigo,
												"fecha"=>$row->fecha,
												"mensaje"=>utf8_encode($mens),
												"hora"=>substr($row->hora,0,5),
												"segundo"=>substr($row->hora,6,2)
												);
				}
				//echo json_encode($lista_de_mensajes);
				//exit();

				$msg_groups= array();
				$lista_fechas = array();
        for ($i=0; $i < count($lista_de_mensajes); $i++) { 
        	$mensaje = array(
        					"mensaje"=>$lista_de_mensajes[$i]['mensaje'],
        					"hora"=>$lista_de_mensajes[$i]['hora'],
        					"fecha"=>$lista_de_mensajes[$i]['fecha'],
        					"segundo"=>$lista_de_mensajes[$i]['segundo']);
          if (!en_array($mensaje, $msg_groups)&&contarMensajes3($mensaje,$lista_de_mensajes)==1&&$lista_de_mensajes[$i]['codalu']==$codalu) {

            		$msg_groups[] = $mensaje;
            	}
            

        }
        for ($i=0; $i < count($msg_groups) ; $i++) { 
            	if(!in_array($msg_groups[$i]['fecha'],$lista_fechas)){
            		$lista_fechas[] = $msg_groups[$i]['fecha'];
            	}
            }
        echo json_encode(array("status"=>"ok","mes_students"=>$msg_groups,"fechas"=>$lista_fechas));

                break;
        case 'mes_students_last':

				if (!isset($_POST['codalu'])&&empty($_POST['codalu'])&&!isset($_POST['codmat'])&&empty($_POST['codmat'])) {
					echo "errorParam";
					exit();
				}
				$codmat = $_POST['codmat'];
				$codalu = $_POST['codalu'];
        		$codprof = $_SESSION['app_user_id'];
				//$codprof = 'D39';
				require 'includes/config.php';	

				$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

        		$sql = "select * 
        				from alumno 
        				where codigo = ".$codalu;

        		$result = mysqli_query($db,$sql);
        		$row = $result->fetch_object();
        		$codcur = $row->cod_cur;
        		$codpar = $row->cod_par;


				$sql ="select mp.id, a.codigo, mp.mensaje,mp.hora 
						from msg_pend mp inner join alumno a on 
						mp.cod_est = a.codigo and a.cod_cur=".$codcur." and a.cod_par = ".$codpar." and 
						mp.emisor = '".$codmat."' and mp.codusr = '".$codprof."' and tipo = 1 group by a.codigo, mp.mensaje,mp.hora order by mp.id asc";

				$result=mysqli_query($db,$sql);
				$lista_de_mensajes = array();
				while ($row = $result->fetch_object()) {
					$lista_de_mensajes[] = array(
												"codalu"=>$row->codigo,
												"mensaje"=>substr($row->mensaje,12),
												"fecha"=>substr($row->mensaje, 0,10),
												"hora"=>substr($row->hora,0,5),
												"segundo"=>substr($row->hora,6,2)
												);
				}
				
				$msg_groups= array();

				//echo json_encode($lista_de_mensajes);
                for ($i=0; $i < count($lista_de_mensajes); $i++) { 
                	//echo in_array($lista_de_mensajes[$i]['mensaje'],$msg_groups)==true?"true":"false";
                	$mensaje = array(
                					"fecha"=>$lista_de_mensajes[$i]['fecha'],
                					"hora"=>$lista_de_mensajes[$i]['hora'],
                					"mensaje"=>utf8_encode($lista_de_mensajes[$i]['mensaje']),
                					"segundo"=>$lista_de_mensajes[$i]['segundo']

                				);

                	if (!en_array($mensaje,$msg_groups)&&contarMensajes3($mensaje,$lista_de_mensajes)==1&&$lista_de_mensajes[$i]['codalu']==$codalu) {
                		$msg_groups[] = $mensaje;
                	}
                }

                	$n = count($msg_groups);
                	if($n>0){
                		echo json_encode(array("status"=>"ok","mes_students_last"=>$msg_groups[$n-1]));
                	}else{
                		echo json_encode(array("status"=>"noMessage"));
                	}
                	//echo $n;exit();
                	

                    break;

        case 'mes_groups':

        		if(!isset($_POST['codmat'])||empty($_POST['codmat'])||
        		   !isset($_POST['codcur'])||empty($_POST['codcur'])||
        		   !isset($_POST['codpar'])||empty($_POST['codpar'])) {
					echo "errorParam";
					exit();
				}
				$codmat = $_POST['codmat'];
				$codcur = $_POST['codcur'];
				$codpar = $_POST['codpar']; 
        		$codprof = $_SESSION['app_user_id'];

        		require 'includes/config.php';	

				$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
				$sql ="select mp.id, a.codigo, mp.mensaje,mp.hora,mp.fecha  
						from msg_pend mp inner join alumno a on 
						mp.cod_est = a.codigo and a.cod_cur=".$codcur." and a.cod_par = ".$codpar." and 
						mp.emisor = '".$codmat."' and mp.codusr = '".$codprof."' and tipo = 1 group by a.codigo, mp.mensaje,mp.fecha,mp.hora order by mp.id asc";

				$result=mysqli_query($db,$sql);
				$lista_de_mensajes = array();
				while ($row = $result->fetch_object()) {
					$cad1 = substr($row->mensaje,0,10);
					$mensaje = $cad1==$row->fecha?substr($row->mensaje,12):$row->mensaje;
					$lista_de_mensajes[] = array(
												"fecha"=>$row->fecha,
												"mensaje"=>$mensaje,
												"hora"=>$row->hora
												);
				}

				$msg_groups= array();
				$lista_fechas = array();

                for ($i=0; $i < count($lista_de_mensajes); $i++) { 
                	if ($lista_de_mensajes[$i]['mensaje']!="El alumno se encuentra presente en la clase."&&!en_array2($lista_de_mensajes[$i], $msg_groups)&&contarMensajes($lista_de_mensajes[$i],$lista_de_mensajes)>1) {
            			$msg_groups[] = array(
            								  "fecha"=>$lista_de_mensajes[$i]['fecha'],
											  "mensaje"=>$lista_de_mensajes[$i]['mensaje'],
											  "hora"=>$lista_de_mensajes[$i]['hora']
																);

                	}
                }
                //echo json_encode($msg_groups);
               // exit();
                $lista_msg = array();
   				for ($i=0; $i < count($msg_groups) ; $i++) { 
   							$lista_msg[] = array(
   																	"fecha"=>$msg_groups[$i]['fecha'],
   																	"mensaje"=>utf8_encode($msg_groups[$i]['mensaje']),
   																	"hora"=>substr($msg_groups[$i]['hora'],0,5));
	            	if(!in_array($msg_groups[$i]['fecha'],$lista_fechas)){
	            		$lista_fechas[] = $msg_groups[$i]['fecha'];
	            	}
            	}

                    echo json_encode(array("status"=>"ok","mes_groups"=>$lista_msg,"fecha"=>$lista_fechas));

                    break;
      case 'mes_groups_last':

        		if(!isset($_POST['codmat'])||empty($_POST['codmat'])||
        		   !isset($_POST['codcur'])||empty($_POST['codcur'])||
        		   !isset($_POST['codpar'])||empty($_POST['codpar'])) {
					echo "errorParam";
					exit();
				}
				$codmat = $_POST['codmat'];
				$codcur = $_POST['codcur'];
				$codpar = $_POST['codpar']; 
        		$codprof = $_SESSION['app_user_id'];

        		require 'includes/config.php';	

				$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
				
				$sql ="select mp.id, mp.mensaje,mp.hora 
						from msg_pend mp inner join alumno a on 
						mp.cod_est = a.codigo and a.cod_cur=".$codcur." and a.cod_par = ".$codpar." and 
						mp.emisor = '".$codmat."' and mp.codusr = '".$codprof."' and tipo = 1 group by mp.mensaje,mp.emisor,mp.codusr,mp.fecha,mp.hora having count(mp.mensaje)>1 order by mp.id asc";
				

				      $result=mysqli_query($db,$sql);				      
				      $lista_de_mensajes[] = array();
                    while($row=$result->fetch_object()){
                      $lista_de_mensajes[]=array(

                                                "fecha"=>substr($row->mensaje,0,10),
												"mensaje"=>utf8_encode(substr($row->mensaje,12)),
												"hora"=>substr($row->hora,0,5)
												);
					}
               
                	if(count($lista_de_mensajes)>0){
                    echo json_encode(array("status"=>"ok","mes_groups_last"=>$lista_de_mensajes[count($lista_de_mensajes)-1]));
                	}else{
                	echo json_encode(array("status"=>"noMessage"));
                	}

                    break;

		    

}
function en_array2($fila,$array){
	for ($i=0; $i < count($array); $i++) { 
		if($fila['fecha']==$array[$i]['fecha']&&
			 $fila['mensaje']==$array[$i]['mensaje']){
			$ti = strtotime($fila['fecha'].' '.$fila['hora']);
			$tf = strtotime($array[$i]['fecha'].' '.$array[$i]['hora']);
			$dif = abs($ti-$tf);
			if($dif<3){
				return true;
			}
		}
	}
	return false;
}
function contarMensajes($mensaje,$array){
	$cont = 0;
	for ($i=0; $i <count($array) ; $i++) { 
		if($array[$i]['fecha']==$mensaje['fecha']&&
			 $array[$i]['mensaje']==$mensaje['mensaje']){
				$timeMsg = strtotime($mensaje['fecha'].' '.$mensaje['hora']);
				$timeArray = strtotime($array[$i]['fecha'].' '.$array[$i]['hora']);
				$diferncia = abs($timeArray - $timeMsg);
				if($diferncia<3)$cont++;
		}
	}
	return $cont;

}
function contarMensajes2($mensaje,$array){
	$cont = 0;
	for ($i=0; $i <count($array) ; $i++) { 
		if($array[$i]['mensaje']==$mensaje['mensaje']&&
		   $array[$i]['hora']==$mensaje['hora'])$cont++;
	}
	return $cont;

}
function contarMensajes3($mensaje,$array){
	$cont = 0;
	for ($i=0; $i <count($array) ; $i++) { 
		if($array[$i]['mensaje']==$mensaje['mensaje']&&$array[$i]['fecha']==$mensaje['fecha']&&$array[$i]['hora']==$mensaje['hora']&&
			$array[$i]['segundo']==$mensaje['segundo'])$cont++;
	}
	return $cont;
}                

function en_array($mensaje,$msg_groups){
for ($i=0; $i < count($msg_groups); $i++) { 
	if($msg_groups[$i]['mensaje']==$mensaje['mensaje']&&
	   $msg_groups[$i]['fecha']==$mensaje['fecha']&&
	   $msg_groups[$i]['hora']==$mensaje['hora']&&
	   $msg_groups[$i]['segundo']==$mensaje['segundo']){
		return true;
	}
}
return false;

}
?>