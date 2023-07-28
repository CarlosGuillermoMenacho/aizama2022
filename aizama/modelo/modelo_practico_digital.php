<?php 

class PracticoDigital{
	
	private $db;

	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
		}

	public function get_precticos_prof($codcur,$codpar,$codmat,$codprof){

	}
	
	public function get_practicos_digital($gestion,$trimestre,$codcur,$codpar,$codmat){
	    $sql = "SELECT * 
	            FROM cuestionarios 
	            WHERE gestion = ? AND bimestre = ? AND cod_cur = ? AND cod_par = ? AND 
	            cod_mat = ? AND estado = 1 ORDER BY cod_cuest ASC";
		$type = "iiiis";
		$params = array($gestion,$trimestre,$codcur,$codpar,$codmat);

		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}

	public function get_practicos_mes($codcur,$codpar,$mes,$year){
		$mess = strlen($mes)==2?$mes:"0".$mes;
		$fecha = $year.'-'.$mess.'%';
		$consulta ="SELECT m.descri,c.descrip,c.fecha,c.nota 
					FROM cuestionarios c inner join materia m ON 
					m.codmat = c.cod_mat and c.gestion = ? and 
					c.cod_cur = ? and c.cod_par = ? and c.fecha LIKE ? 
					and c.estado = 1";
		$resultado=mysqli_prepare($this->db, $consulta);
		//return $year."-".$fecha."-".$codcur."-".$codpar;
		$ok=mysqli_stmt_bind_param($resultado,"iiis",$year,$codcur,$codpar,$fecha);	
		$ok=mysqli_stmt_execute($resultado);
		$lista = array();
		if($ok){
		$ok= mysqli_stmt_bind_result($resultado, $materia,$descripcion,$fecha,$nota);
				
			while (mysqli_stmt_fetch($resultado)) {
				$lista[] = array(
								"materia"=>$materia,
								"descripcion"=>$descripcion,
								"dia"=>substr($fecha,8,2),
								"nota"=>$nota
								);
			}

		}
		return $lista;
		mysqli_stmt_close($resultado);
		return $ok!=false;
	}
	public function get_practicos_pendientes($codalu,$codcur,$codpar,$trimestre,$gestion){
		$consulta ="SELECT cod_cuest,cod_mat,descrip,nota,fecha,hora 
					FROM cuestionarios 
					WHERE cod_cur = ? and cod_par = ? and gestion = ? and bimestre = ? and estado = 1 and 
						  cod_cuest NOT IN (SELECT codpractico 
						  					FROM practico_alumno 
						  					WHERE codalumno = ? and estado > 0) order by cod_cuest asc";
		$resultado=mysqli_prepare($this->db, $consulta);
		//return $year."-".$fecha."-".$codcur."-".$codpar;
		$ok=mysqli_stmt_bind_param($resultado,"iiiii",$codcur,$codpar,$gestion,$trimestre,$codalu);	
		$ok=mysqli_stmt_execute($resultado);
		$lista = array();
		if($ok){
		$ok= mysqli_stmt_bind_result($resultado,$cod_cuest,$cod_mat,$descrip,$nota,$fecha,$hora );
				
			while (mysqli_stmt_fetch($resultado)) {
				$lista[] = array(
								"cod_cuest"=>$cod_cuest,
								"codmat"=>$cod_mat,
								"descripcion"=>$descrip,
								"nota"=>$nota,
								"fecha"=>$fecha,
								"hora"=>$hora
								);
			}
		}
		return $lista;
		mysqli_stmt_close($resultado);
		return $ok!=false;
	}
	public function get_practicos_presentados($codalu,$trimestre,$gestion){
		$consulta ="SELECT c.cod_mat,c.descrip,pa.nota,c.nota as notaP ,c.cod_cuest,pa.codprof,pa.observacion    
					FROM practico_alumno pa INNER JOIN cuestionarios c ON 
						 pa.codpractico = c.cod_cuest and pa.estado > 0 and pa.codalumno = ? and 
						 c.bimestre = ? and c.gestion = ? and c.estado = 1 order by c.cod_cuest asc";
		$resultado=mysqli_prepare($this->db, $consulta);
		//return $year."-".$fecha."-".$codcur."-".$codpar;
		$ok=mysqli_stmt_bind_param($resultado,"iii",$codalu,$trimestre,$gestion);	
		$ok=mysqli_stmt_execute($resultado);
		$lista = array();
		if($ok){
		$ok= mysqli_stmt_bind_result($resultado,$codmat,$descrip,$nota,$notaP,$codcuest,$codprof,$observacion);
				
			while (mysqli_stmt_fetch($resultado)) {
			    $descrip1 = $descrip;
			    if(empty($codprof)){
			        $nota = "Sin calificar";
			    }else{
			        $nota = $nota.'/'.$notaP;
			        if(!empty($observacion))$descrip1 = $descrip.' '."- Observación: ".$observacion;
			    }
				$lista[] = array(
								"codmat"=>$codmat,
								"descripcion"=>$descrip1,
								"nota"=>$nota,
								"notaP"=>$notaP,
								"cod_cuest"=>$codcuest
								);
			}
		}
		return $lista;
		mysqli_stmt_close($resultado);
		return $ok!=false;
	}
	public function get_practicos_alumnos($gestion,$trimestre,$codcur,$codpar,$codmat){
	    $sql = "SELECT c.cod_cuest,pa.codalumno,pa.archivo,pa.fecha,pa.hora,pa.nota,pa.observacion,pa.fechaCalif,pa.codprof
	            FROM cuestionarios c INNER JOIN practico_alumno pa ON 
	            c.cod_cuest = pa.codpractico AND c.gestion = ? AND c.bimestre = ? AND c.cod_cur = ? AND c.cod_par = ? AND 
	            c.cod_mat = ? AND c.estado = 1 AND pa.estado > 0 ORDER BY c.cod_cuest ASC";
		$type = "iiiis";
		$params = array($gestion,$trimestre,$codcur,$codpar,$codmat);

		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	public function get_practicos_fechas($profe,$fi,$ff){
		$sql = "SELECT * FROM cuestionarios WHERE estado = 1 AND codprof = ? AND fechaReg >= ? AND fechaReg < ?";
		$type = "sss";
		$params = array($profe,$fi,$ff);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function get_practicos_prof($gestion,$codprof){
		$sql = "SELECT c.cod_cuest,c.cod_cur,c.cod_par,c.cod_mat,c.descrip,c.n_cuest,c.fecha,c.hora,c.nota,c.limite FROM cuestionarios c INNER JOIN prof_cur_mat p ON c.gestion = ? AND p.gestion = c.gestion AND c.cod_cur = p.codcur AND c.cod_par = p.codpar AND c.cod_mat = p.codmat AND c.estado = 1 AND p.estado = 'activo' AND p.prof = ?";
		$type = "is";
		$params = array($gestion,$codprof);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function get_practicos_curso_fecha($codcur,$codpar,$fecha){
		$sql = "SELECT * FROM cuestionarios WHERE estado = 1 AND cod_cur = ? AND cod_par = ? AND fecha = ?";
		$type = "iis";
		$params = array($codcur,$codpar,$fecha);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
}
?>