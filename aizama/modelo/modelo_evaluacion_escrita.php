<?php 
/**
 * 
 */
class EvaluacionEscrita
{
	
	private $db;
		
		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
		}

		public function get_evaluaciones($gestion,$trimestre,$codcur,$codpar,$codmat){
			$sql = "SELECT * 
					FROM evaluacion_escrita 
					WHERE gestion = ? AND trimestre = ? AND codcur = ? AND codpar = ? AND codmat = ? AND estado = 1";
			$type = "iiiis";
			$params = array($gestion,$trimestre,$codcur,$codpar,$codmat);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			return $result;
		}

		public function get_evaluaciones_alumnos($gestion,$trimestre,$codcur,$codpar,$codmat){

			$sql = "SELECT * FROM evaluacion_proceso WHERE estado = 1 AND codeva IN (SELECT id 
																					 FROM evaluacion_escrita 
																					 WHERE gestion = ? AND trimestre = ? AND 
																					 	   codcur = ? AND codpar = ? AND 
																					 	   codmat = ? AND estado = 1)";
			$type = "iiiis";
			$params = array($gestion,$trimestre,$codcur,$codpar,$codmat);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			return $result;
		}
		public function get_evaluaciones_alumno($gestion,$trimestre,$codcur,$codpar,$codmat,$codalu){

			$sql = "SELECT * FROM evaluacion_proceso WHERE codalu = ? AND estado = 1 AND codeva IN (SELECT id 
																					 FROM evaluacion_escrita 
																					 WHERE gestion = ? AND trimestre = ? AND 
																					 	   codcur = ? AND codpar = ? AND 
																					 	   codmat = ? AND estado = 1)";
			$type = "iiiiis";
			$params = array($codalu,$gestion,$trimestre,$codcur,$codpar,$codmat);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			return $result;
		}
		public function get_evaluacion($codeva){
			$sql = "SELECT * FROM evaluacion_escrita WHERE estado = 1 AND id = ? ";
			$type = "i";
			$params = array($codeva);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_evaluacion_alumno($codalu,$codeva){
			$sql = "SELECT * FROM evaluacion_proceso WHERE estado = 1 AND codeva = ? AND codalu = ? AND estado = 1";
			$type = "ii";
			$params = array($codeva,$codalu);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			return $result;
		}
		public function update_nota($id_proceso,$nota){
			$sql = "UPDATE evaluacion_proceso SET nota = ?,fecha_inicio = ?, fecha_fin = ? WHERE id = ?";
			$type = "issi";
			$fecha = date("Y-m-d H:i:s");
			$params = array($nota,$fecha,$fecha,$id_proceso);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			return $result;

		}
		public function update_nota2($id_proceso,$nota){
			$sql = "UPDATE evaluacion_proceso SET nota = ?,fecha_inicio = ?, fecha_fin = ?,calificado = 2, proceso = 0 WHERE id = ?";
			$type = "issi";
			$fecha = date("Y-m-d H:i:s");
			$params = array($nota,$fecha,$fecha,$id_proceso);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			return $result;

		}
		public function save_nota($codalu,$codeva,$fecha,$nota){
			$sql = "INSERT INTO evaluacion_proceso(codalu,codeva,fecha_inicio,fecha_fin,nota,calificado,estado)
											values(?,?,?,?,?,2,1)";
			$type = "iissi";
			$params = array($codalu,$codeva,$fecha,$fecha,$nota);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			return $result;
		}

		public function save_calificacion($codalu,$codeva,$nota){
			$result_eval = $this->get_evaluacion($codeva);
			$nota_eval = "";
			if($fila = $result_eval->fetch_object()){
				$nota_eval = $fila->nota;
			}else{
				return "noEval";
			}
			if($nota < 1 || $nota > $nota_eval){
				return "errorNota";
			}

			$result_eval = $this->get_evaluacion_alumno($codalu,$codeva);
			if($fila = $result_eval->fetch_object()){
				$id_proceso = $fila->id;
				$this->update_nota2($id_proceso,$nota);
				return "ok";
			}else{
				$this->save_nota($codalu,$codeva,date("Y-m-d H:i:s"),$nota);
				return "ok";
			}
		}
		public function get_evaluacion_fechas($profe,$fi,$ff){
			$sql = "SELECT * FROM evaluacion_escrita WHERE estado = 1 AND codprof = ? AND fechaReg >= ? AND fechaReg < ?";
			$type = "sss";
			$params = array($profe,$fi,$ff);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function get_evaluaciones_prof($gestion,$codprof){
			$sql = "SELECT e.id,e.codcur,e.codpar,e.codmat,e.nro,e.preguntas,e.fecha_inicio,e.fecha_fin,e.tiempo,e.descripcion,e.completo,e.nota FROM evaluacion_escrita e INNER JOIN prof_cur_mat p ON e.gestion = ? AND p.gestion = e.gestion AND e.codcur = p.codcur AND e.codpar = p.codpar AND e.codmat = p.codmat AND e.estado = 1 AND p.prof = ? AND p.estado = 'activo'";
			$type = "is";
			$params = array($gestion,$codprof);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_preguntas($id){
			$sql = "SELECT * FROM pregunta_eval_escrito WHERE estado = 1 AND codeva = ?";
			$type = "i";
			$params = array($id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_n_preguntas($id){
			$sql = "SELECT count(*) as total FROM pregunta_eval_escrito WHERE estado = 1 AND codeva = ?";
			$type = "i";
			$params = array($id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function evaluacion_realizada($id,$codcur,$codpar){
			$sql = "SELECT count(*) as total FROM alumno WHERE cod_cur = ? and cod_par = ? AND estado = 1 AND codigo IN (SELECT codalu FROM evaluacion_proceso where codeva = ? AND estado = 1 GROUP by codalu);";
			$type = "iii";
			$params = array($codcur,$codpar,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function evaluacion_no_realizada($id,$codcur,$codpar){
			$sql = "SELECT count(*) as total FROM alumno WHERE cod_cur = ? and cod_par = ? AND estado = 1 AND codigo NOT IN (SELECT codalu FROM evaluacion_proceso where codeva = ? AND estado = 1 GROUP by codalu);";
			$type = "iii";
			$params = array($codcur,$codpar,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
}
?>