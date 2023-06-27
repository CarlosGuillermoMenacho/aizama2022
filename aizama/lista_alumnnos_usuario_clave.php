<?php  
session_start();
require 'includes/functions.php';
if(!cliente_activo())
{
  $respuesta = array("status"=>"eSession");
				echo json_encode($respuesta);
  exit();
}
if ($_GET) {
  switch ($_GET['op']) {
    case 'list_alu_usr_pass'://Retorna la lista de practicos presentados para ser revisados por el profesor
    if (isset($_POST['codcur'])&&!empty($_POST['codcur'])&&
      isset($_POST['codpar'])&&!empty($_POST['codpar'])) {
      
      $codcur = $_POST['codcur'];
      $codpar = $_POST['codpar'];

      require 'includes/config.php';
      $db = mysqli_connect($servername, $username, $password, $database) 
              or die('Error al intentar conectar con el servidor.');

      $sql = "select u.login,concat(a.paterno,' ',a.materno,' ',a.nombres)as nombre_usr,u.password, u.bdesktop,u.servernt,u.usrimple  
              from alumno a inner join usr u on 
              a.codigo = u.id_usr and a.cod_cur=".$codcur." and 
              a.cod_par=".$codpar." and a.estado=1 order by nombre_usr";
            
      if($result = mysqli_query($db,$sql)){
          $lista = array();
          while($row = $result->fetch_object()){
            $plataforma = "";
            $boletin = "";
            $evaluaciones = "";
            if ($row->servernt == 'FALSO')$plataforma = "Bloqueado";
            if ($row->usrimple == 'FALSO')$evaluaciones = "Bloqueado";
            if ($row->bdesktop == 'FALSO')$boletin = "Bloqueado";
              $lista[]=array(
                            "user"=>$row->login,
                            "clave"=>$row->password,
                            "nombre"=>utf8_encode($row->nombre_usr),
                            "plataforma" => $plataforma,
                            "boletin" => $boletin,
                            "evaluaciones" => $evaluaciones
                            );
          }
          if(count($lista)>0){
               $resp = array("status"=>"ok","lista"=>$lista);
                echo json_encode($resp);
          }else{
              $resp = array("status"=>"noAlumnos");
              echo json_encode($resp);
          }
      }else{
          echo "errorSql";
      }
    }else{
        $resp = array("status"=>"errorParam");
        echo json_encode($resp);
    }               
    break;
  }
}else{
    echo "errorGET";
}