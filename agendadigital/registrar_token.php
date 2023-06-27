<?php
header("Content-Type: application/json;charset=utf-8");
require 'includes/config.php';
require 'includes/functions.php';
$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
$codigo = isset($_POST['codigo'])?$_POST['codigo']:"";
$token = isset($_POST['token'])?$_POST['token']:"";
$tipo = isset($_POST['tipo'])?$_POST['tipo']:"";
if(empty($codigo)||empty($token)||empty($tipo)){
    echo "paramError";
    exit();
}
$sql = "select * from UserToken where UserId = '".$codigo."' and UserType = ".$tipo." and State = 1";
$consulta = mysqli_query($db,$sql);
$fecha = date("Y-m-d H:i:s");
if($row = $consulta->fetch_object()){
    $id = $row->Id;
    $sql = "update UserToken set FirebaseToken = ".$token.",UpdatedAt='".$fecha."' where Id = ".$id;
    echo $sql;
    $result = mysqli_query($db,$sql);
}else{
    $sql = "insert into UserToken(UserId,UserType,FirebaseToken,State,CreatedAt) values('".$codigo."',".$tipo.",'".$token."',1,'".$fecha."')";
    echo $sql;
    $result = mysqli_query($db,$sql);
}
echo "ok";
?>
