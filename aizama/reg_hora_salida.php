<?php
session_start();
require 'includes/functions.php';

if(!cliente_activo())
{
  echo 'eSession';
  exit();
}

$MsgApp = 'eParamError';
if($_GET)
{
  if(isset($_GET['id']))
  {
    $MsgApp = 'eNoGrabado';

    require 'includes/config.php';
	  $db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
	$v_id = $_GET['id'];
	$dias=array("DOM","LUN","MAR","MIE","JUE","VIE","SAB");
	$emisor=$dias[date('w')].'-'.date('Y').'/'.date('m').'/'.date('d').'-Administracion';
	$codalu=$_GET['id'];
	$hora_actual = date("H:i:s");
	$mensage2="Hora de Salida - ".$hora_actual;
	$idagenda="-2";
	$idage2='-2';
	$fecha = $_SESSION['app_user_sysdat'];
	$fecha = date("Y-n-j");
	$numbDia = date("N");
    //Obteniendo el curso y paralelo del estudiante
    $sql = "select cod_cur,cod_par from alumno where codigo=".$_SESSION['app_user_id'];
    $result = mysqli_query($db,$sql);
    $hora = "Sin hora de salida";
    if($row=$result->fetch_object()){
        $codcur=$row->cod_cur;
        $codpar=$row->cod_par;
        if($numbDia==1)$sql="select lu_f as hora from hor_ent_salida where cod_cur=".$codcur." and cod_par=".$codpar." and estado=1";
        if($numbDia==2)$sql="select ma_f as hora from hor_ent_salida where cod_cur=".$codcur." and cod_par=".$codpar." and estado=1";
        if($numbDia==3)$sql="select mi_f as hora from hor_ent_salida where cod_cur=".$codcur." and cod_par=".$codpar." and estado=1";
        if($numbDia==4)$sql="select ju_f as hora from hor_ent_salida where cod_cur=".$codcur." and cod_par=".$codpar." and estado=1";
        if($numbDia==5)$sql="select vi_f as hora from hor_ent_salida where cod_cur=".$codcur." and cod_par=".$codpar." and estado=1";
        if($numbDia==6)$sql="select sa_f as hora from hor_ent_salida where cod_cur=".$codcur." and cod_par=".$codpar." and estado=1";
        
        if($result = mysqli_query($db,$sql)){
            $row1 = $result->fetch_object();
            $hora = $row1->hora;
        }
    }
//    $sql="insert into chat (c_envia,c_recibe,fecha_e,hora_e,msg,s_enviado,c_recibido,estado,idagenda,codprof) values('".$emisor."','".$codalu."','".$fecha."','".$hora_actual."','".$mensage2."',0,0,1,".$idage2.",'".$_SESSION['app_user_id']."')";

	  $sql="insert into asistencia (codigo,fecha,hora,tipo,hora_fija,usr,estado,agenda,nube) values(".$codalu.",'".$fecha."','".$hora_actual."','S','".$hora."',".$codalu.",1,1,1)";
//    $sql2="select nromsg from chat where c_envia='".$emisor."' and c_recibe='".$codalu."' and fecha_e='".$fecha."' and idagenda='-2';";
	  $sql2="select count(codigo) as cod from asistencia where estado=1 and codigo=".$codalu." and fecha='".$fecha."' and tipo='S'";
//	  $sql2="select count(codigo) as cod from asistencia where estado=1 and codigo=2 and fecha='2020-12-08' and tipo='S'";
	  if($result13=mysqli_query($db,$sql2))
	  {
		  $resultado=$result13->fetch_object();
		  if ($resultado->cod == 0){
			  if($result3=mysqli_query($db,$sql))
			  {
				  echo "eGrabado";
			  }else{
				  echo "error";
			  }
			  
		  }else{
			  echo "eYaGrabado";
		  }
	  }else{
			echo "error";
	  }	
  }  
}
else
{
  echo $MsgApp;
}
?>