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
  if(isset($_GET['sw1']))
  {
    $MsgApp = 'eNoResults';

    require 'includes/config.php';
    require_once'tipo_indicador.php';

	$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

	$v_id = $_GET['sw1'];
    
    $sql = "select c.codigo as codigo,concat(c.descrip,' ',pl.descrip) as curso,m.codmat as codigomat,m.descri as materia,e.codexa as examen,count(*) as preguntas, e.tot_preg 
    from preguntas p inner join evaluacion e on p.codexa=e.codexa inner join paralelos pl on e.cod_par=pl.cod_par 
    and e.bimestre='".$_SESSION['app_user_bimestre']."' and e.estado=1 and e.codeva='".$v_id."' 
    and p.codprof='".$_SESSION['app_user_id']."' inner join materia m on e.codmat=m.codmat inner join cursos c on e.codigo=c.codigo group by c.codigo ,c.descrip, m.CODMAT,m.DESCRI ,e.codexa";

	$rspta = mysqli_query($db, $sql);
	//echo json_encode($rspta);
    $data=array();
    $indicadores = array();
	while ($reg=$rspta->fetch_object()) {
	    $sql = "SELECT * FROM indicador WHERE codigo = ".$reg->examen." AND tipo = ".EVALUACION_SELECCION." AND estado = 1";
      $result_inidcador = mysqli_query($db,$sql);
      $indicador = "";
      if($row_indicador = $result_inidcador->fetch_object()){
        $indicador = utf8_encode($row_indicador->indicador);
      }
      $indicadores[] = [$reg->examen,$indicador];
			$data[]=array(
				
				//"0"=>$reg->codigo,
				"0"=>$reg->curso,
				//"1"=>$reg->codigomat,
				"1"=>utf8_encode($reg->materia),
				//"3"=>$reg->examen,
				"2"=>'<textarea class="indicador" style="padding:5px; max-height:50px;" placeholder="Indicador" >'.$indicador.'</textarea>',
				"3"=>$reg->preguntas,
				"4"=>'<input type="button" class="btn" size="4px" onclick="lista('.$reg->examen.')" value="ver">',
				"5"=>$reg->tot_preg
			);
		}
		$results =array(
			"sEcho"=>1,//Información para el datatables
			"iTotalRecords"=>count($data),//enviamos el total de registros al datatable
			"iTotalDisplayRecords"=>count($data),//enviamos el total registroa a visualizar
			"aaData"=>$data,
			"indicadores"=>$indicadores);
		echo json_encode($results);
	
	  

 
  }  
}
else
{
  echo $MsgApp;
}
?>