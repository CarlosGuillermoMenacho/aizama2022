<?php
header("Content-Type: application/json;charset=utf-8");

require 'includes/functions.php';

if($_POST){
	if(isset($_POST['id']) && is_numeric($_POST['id'])){
		require 'includes/config.php';
		$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

		$v_id = $_POST['id'];
		//Validando que el alumno esté habilitado para ver el boletin
		$sql = "select * from usr where id_usr=".$v_id;
		$result = mysqli_query($db,$sql);
		if ($rowPermiso = $result->fetch_object()) {
			if ($rowPermiso->bdesktop=="FALSO") {
				$array=array("status"=>'404',
					 "message"=>"NO HABILITADO...\nCOMUNIQUESE CON ADMINISTRACION"
					);
				echo json_encode($array);
				exit();
			}
		}
		$alumno=array();
		$sql = "SELECT paterno,materno,nombres,curso,cod_cur FROM alumno WHERE codigo=".$v_id;
		$result = mysqli_query($db, $sql);
		if($row = $result->fetch_object()){
			$alumno = array(
					"paterno"=>utf8_encode(trim($row->paterno)),
					"materno"=>utf8_encode(trim($row->materno)),
					 "nombres"=>utf8_encode(trim($row->nombres)),
					 "curso"=>utf8_encode(trim($row->curso))
			);
		}

		if($row->cod_cur>4){
    		$sql3 = "SELECT n.codigo,n.cod_mat,m.descri, nota1, nota2, nota3 FROM notas n, materia m WHERE n.cod_mat=m.codmat AND n.codigo=".$v_id." and n.estado=1 ORDER BY m.descri";
		    
		}else{
		    $sql3 = "SELECT n.codigo,n.cod_mat,m.descri, nota1, nota2, nota3 FROM notas_inicial n, materia m WHERE n.cod_mat=m.codmat AND n.codigo=".$v_id." and n.estado=1 ORDER BY m.descri";

		}
		$result3 = mysqli_query($db, $sql3);

		$notas=array();
		$acumulado = 0;
		$cont = 1;
		$acum_total=0;
		while($row3 = $result3->fetch_object()){
		//   $acumulado = ($row3[3] + $row3[4] + $row3[5]) / 3;
			$notas[] = array(
					"codigo"=>(($row3->codigo)),
					"cod_mat"=>utf8_encode(trim($row3->cod_mat)),
					"descri"=>utf8_encode(trim($row3->descri)),
					"nota1"=>(($row3->nota1)),
					 "nota2"=>(($row3->nota2)),
					 "nota3"=>(($row3->nota3))
			);
		//   $acum_total = $acumulado + $acum_total;
		//   $cont++;
		}

/*
		$sql2 = "SELECT 1 as codigo, 'SSS' as codmat, '-------PROMEDIO FINAL:' as descri, sum(nota1) as nota1, sum(nota2) as nota2, sum(nota3) as nota3 FROM notas WHERE ESTADO=1 && codigo=".$v_id;

		$result2 = mysqli_query($db, $sql2);
		$cont = 1;
		$nombre = 'PROMEDIO';
		$acum_total = $acum_total/11;
		while($row = mysqli_fetch_row($result2)){
		   $acumulado = ($row[3] + $row[4] + $row[5]) ;
		   $html .= '<tr>';
		   $html .= '<td><input class="dtotal" type="hidden" value="'.$row[3].'" name="F_'.$cont.'" id="F_'.$cont.'" /><input  type="hidden" value="'.$row[1].'" name="FCOD_'.$cont.'" id="FCOD_'.$cont.'" />'.$row[1].'</td>';
		   $html .= '<td>'.$row[2].'</td>';
		   $html .= '<td>'.number_format($row[3]/12, 2).'</td>';
		   $html .= '<td>'.number_format($row[4]/12, 2).'</td>';
		   $html .= '<td>'.number_format($row[5]/12, 2).'</td>';
		   $html .= '<td>'.number_format(($acumulado/12)/4, 2).'</td>';
		   $html .= '</tr>';
		   $cont++;
		}


		if($html=='') echo $MsgApp;
		else echo $html;
		*/
		
//		odbc_free_result($result);
//		odbc_close($db);

		if (count($alumno)>0) {
			$array=array("status"=>'200',
					 "message"=>"DATOS OBTENIDOS EXITOSAMENTE",
					 "alumno"=>$alumno,
					 "notas"=>$notas
					);
			echo json_encode($array);
		}else{
			$array=array(
						"status"=>"404",
						"message"=>"DATOS INCORRECTOS");
			echo json_encode($array);
		}

	}  
}else{
	$array=array(
				"status"=>"404",
				"message"=>"DATOS INCORRECTOS 22222");
	echo json_encode($array);
}
?>