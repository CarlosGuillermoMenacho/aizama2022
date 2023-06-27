<?php 
session_start();
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
require '../includes/functions.php';


$codcur= isset($_POST['codcur'])? $_POST['codcur']:"";
$codpar= isset($_POST['codpar'])? $_POST['codpar']:"";
if(empty($codcur)||empty($codpar)){
			echo "errorParam";
			exit();
}
$file = "";
require_once('../modelo/modelo_tutor.php');
require_once'../modelo/conexion.php';
$db = Conectar::conexion();
$tutor = new Tutor($db);
$result = $tutor->get_tutores($codcur,$codpar);
require_once'../send_multimedia.php';
$sender = new SendMultimedia();
$msg = "";
$contador = 0;
if (!file_exists($_FILES['file']['tmp_name'])||!is_uploaded_file($_FILES['file']['tmp_name'])) {
	echo "noFile";
	exit();
}else{
	$ext=explode(".",$_FILES["file"]["name"]);
	$filename=generateFileName();
	$file=$filename.'.'. end($ext);	
	move_uploaded_file($_FILES["file"]["tmp_name"],"../whatsapp_image/".$file);	
	echo $contador;
}


while ($row = $result->fetch_object()) {
	$phone = "591".$row->cel;
    $contador++;
	if(!empty($phone)){
		$sender->sendMultimediaFile($phone,$file,$msg);
	}
	sleep(5);
}

unlink("../whatsapp_image/$file");
function generateFileName()
{
$chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789_";
$name = "";
for($i=0; $i<12; $i++)
$name.= $chars[rand(0,strlen($chars))];
return $name;
}

?>