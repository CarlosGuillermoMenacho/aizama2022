<?php 
/**
 * 
 */
class Evaluacion_Seleccion
{
	
	private $db;
		
		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			require_once'execute_sql.php';
		}

		public function getEvaluacionesMes($year,$mes,$codcur,$codpar){
			$mess = strlen($mes) == 2 ? $mes : "0".$mes;
			$fecha = $year.'-'.$mess.'%';

			$consulta ="SELECT m.descri,e.codeva,e.descrip,e.horaf,e.tot_preg,e.f_fin   
						FROM evaluacion e INNER JOIN materia m ON 
						e.codmat = m.codmat and e.gestion = ? and 
						e.codigo = ? and e.cod_par = ? and 
						e.f_fin LIKE ? and e.estado = 1";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"iiis",$year,$codcur,$codpar,$fecha);	
			$ok=mysqli_stmt_execute($resultado);
			$lista = array();
			if($ok){
				$ok= mysqli_stmt_bind_result($resultado,$materia,$nroEval,$descripcion,$horaFin,$totalPreg,$fecha);
				
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"materia"=>$materia,
									"nroEval"=>$nroEval,
									"descripcion"=>utf8_decode($descripcion),
									"dia"=>substr($fecha,8,2)
									);
				}
			}
			return $lista;
			mysqli_stmt_close($resultado);
			return $ok!=false;
		}
		public function get_evaluaciones_pendientes($codalu,$codcur,$codpar,$trimestre,$gestion){
			$consulta ="SELECT codexa,codmat,descrip,f_inicio,f_fin,horai,horaf,codeva 
						FROM evaluacion 
						WHERE codigo = ? and cod_par = ? and gestion = ? and bimestre = ? and estado = 1 and 
							  codexa NOT IN (SELECT codexa 
							  					FROM resp_alu_exa 
							  					WHERE codigo = ? GROUP BY codexa) order by codexa asc";
			$resultado=mysqli_prepare($this->db, $consulta);
			//return $year."-".$fecha."-".$codcur."-".$codpar;
			$ok=mysqli_stmt_bind_param($resultado,"iiiii",$codcur,$codpar,$gestion,$trimestre,$codalu);	
			$ok=mysqli_stmt_execute($resultado);
			$lista = array();
			if($ok){
			$ok= mysqli_stmt_bind_result($resultado,$codexa,$cod_mat,$descrip,$fechai,$fechaf,$horai,$horaf ,$codeva);
					
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"codexa"=>$codexa,
									"codmat"=>$cod_mat,
									"descripcion"=>$descrip,
									"fechai"=>$fechai,
									"fechaf"=>$fechaf,
									"horai"=>substr($horai,0,5),
									"horaf"=>substr($horaf,0,5),
									"codeva"=>"Selección ".$codeva
									);
				}
				$sql = "SELECT id,codmat,descripcion,fecha_inicio,fecha_fin,nro  
						FROM evaluacion_escrita 
						WHERE gestion = ? AND trimestre = ? AND codcur = ? AND codpar = ? AND estado = 1 AND id NOT IN 
							 (SELECT codeva FROM evaluacion_proceso WHERE codalu = ? AND estado = 1)";

				$type = "iiiii";
				$params = array($gestion,$trimestre,$codcur,$codpar,$codalu);

				$result = ejecutar_consulta($this->db,$sql,$type,$params);

				while ($fila = $result->fetch_object()) {
					$lista[] = array(
									"codexa"=>$fila->id,
									"codmat"=>$fila->codmat,
									"descripcion"=>$fila->descripcion,
									"fechai"=>substr($fila->fecha_inicio,0,10),
									"fechaf"=>substr($fila->fecha_fin,0,10),
									"horai"=>substr($fila->fecha_inicio,11,5),
									"horaf"=>substr($fila->fecha_fin,11,5),
									"codeva"=>"Escrita ".$fila->nro
									);
				}

			}
			return $lista;
			mysqli_stmt_close($resultado);
			return $ok!=false;
		}
		public function get_evaluaciones_realizadas($codalu,$trimestre,$gestion){
			$consulta ="SELECT e.codexa,e.descrip,sum(a.nota) as nota,e.codmat,e.codeva  
						FROM resp_alu_exa a INNER JOIN evaluacion e ON 
							 a.codexa = e.codexa and a.codigo = ? and 
							 e.bimestre = ? and e.gestion = ? and e.estado = 1 GROUP BY e.codexa";
			$resultado=mysqli_prepare($this->db, $consulta);
			//return $year."-".$fecha."-".$codcur."-".$codpar;
			$ok=mysqli_stmt_bind_param($resultado,"iii",$codalu,$trimestre,$gestion);	
			$ok=mysqli_stmt_execute($resultado);
			$lista = array();
			if($ok){
			$ok= mysqli_stmt_bind_result($resultado,$codexa,$descrip,$nota,$codmat,$codeva);
					
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"codexa"=>$codexa,
									"codmat"=>$codmat,
									"descripcion"=>$descrip,
									"nota"=>$nota."/100",
									"codeva"=>"Selección ".$codeva
									);
				}
				$sql = "SELECT ep.codeva,ee.codmat,ee.descripcion,ep.nota,ee.nro,ee.nota AS notaExa ,ep.calificado  
						FROM evaluacion_proceso ep INNER JOIN evaluacion_escrita ee ON 
						ep.codeva = ee.id AND ep.codalu = ? AND ee.gestion = ? AND ee.trimestre = ? AND ee.estado = 1
						AND ep.estado = 1";
				$type = "iii";
				$params = array($codalu,$gestion,$trimestre);

				$result = ejecutar_consulta($this->db,$sql,$type,$params);
				while ($fila = $result->fetch_object()) {
					$codeva = $fila->codeva;
					$codmat = $fila->codmat;
					$descripcion = $fila->descripcion;
					$nota = $fila->nota;
					$notaExamen = $fila->notaExa;
					$nro = $fila->nro;
					$nota = $fila->calificado == 0?"Sin nota/".$notaExamen:$nota."/".$notaExamen;

					$lista[] = array(
									"codexa"=>$codeva,
									"codmat"=>$codmat,
									"descripcion"=>$descripcion,
									"nota"=>$nota,
									"codeva"=>"Escrita ".$nro
									);


				}


			}
			return $lista;
			mysqli_stmt_close($resultado);
			return $ok!=false;
		}	

		public function get_evaluaciones($gestion,$trimestre,$codcur,$codpar,$codmat){
			$sql = "SELECT * 
					FROM evaluacion 
					WHERE gestion = ? AND bimestre = ? AND codmat = ? AND codigo = ? AND cod_par = ? AND estado = 1";
			$type = "iisii";
			$params = array($gestion,$trimestre,$codmat,$codcur,$codpar);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			return $result;
		}

		public function get_evaluaciones_alumnos($gestion,$trimestre,$codcur,$codpar,$codmat){

			$type = "iisii";
			$sql = "SELECT codigo, sum(nota) as nota, codexa FROM resp_alu_exa WHERE codigo > 0 AND codexa IN (SELECT id FROM evaluacion WHERE gestion = ? AND bimestre = ? AND 
																								codmat = ? AND codigo =? AND 
																								cod_par = ? AND estado = 1) GROUP BY codigo,codexa";
			$params = array($gestion,$trimestre,$codmat,$codcur,$codpar);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			return $result;
		}
}
?>