<?php 
/**
 * 
 */
class Indicador
{
	private $db;
	/*
		Tipo de indicador se refiere a la actividad
		1 : Prácticos digitales
		2 : Prácticos Web
		3 : Evaluaciones de Selección
		4 : Evaluaciones Escritas
		5 : Evaluaciones Mixtas
	*/
	public function __construct($db)
	{
		$this->db = $db;
		require_once'execute_sql.php';
	}
	public function save($codigo,$tipo,$indicador){
		$result = $this->get_by_code_type($codigo,$tipo); 
		if($row = $result->fetch_object()){
			return $this->update_indicador_by_code_type($codigo,$tipo,$indicador);
		}else{
			return $this->save_indicador($codigo,$tipo,$indicador);
		}
	}

	public function save_indicador($codigo,$tipo,$indicador){
		$sql = "INSERT INTO indicador(codigo,tipo,indicador,estado) VALUES(?,?,?,1)";
		$type = "iis";
		$params = array($codigo,$tipo,$indicador);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function get_by_id($id){
		$sql = "SELECT * FROM indicador WHERE id = ? AND estado = 1";
		$type = "i";
		$params = array($id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function get_by_codexa($codexa){
		$sql = "SELECT * FROM indicador WHERE codigo = ? AND tipo = 3 AND estado = 1";
		$type = "i";
		$params = array($codexa);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function get_by_code_type($codigo,$tipo){
		$sql = "SELECT * FROM indicador WHERE codigo = ? AND tipo = ? AND estado = 1";
		$type = "ii";
		$params = array($codigo,$tipo);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}

	public function update_indicador_by_id($id,$indicador){
		$sql = "UPDATE indicador SET indicador = ? WHERE id = ?";
		$type = "si";
		$params = array($indicador,$id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function update_indicador_by_code_type($codigo,$tipo,$indicador){
		$sql = "UPDATE indicador SET indicador = ? WHERE codigo = ? AND tipo = ? AND estado = 1";
		$type = "sii";
		$params = array($indicador,$codigo,$tipo);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}

	public function delete_by_id($id){
		$sql = "UPDATE indicador SET estado = 0 WHERE id = ?";
		$type = "i";
		$params = array($id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function delete_by_code_type($codigo,$tipo){
		$sql = "UPDATE indicador SET estado = 0 WHERE codigo = ? AND tipo = ?";
		$type = "ii";
		$params = array($codigo,$tipo);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function get_indicadores($gestion,$trimestre,$codcur,$codpar,$codmat){
		$sql = "SELECT i.codigo,i.indicador,i.tipo FROM cuestionarios c INNER JOIN indicador i ON  
				c.cod_cuest = i.codigo AND c.gestion = ? AND c.bimestre = ? 
				AND c.cod_cur = ? AND c.cod_par = ? AND c.cod_mat = ? AND 
				c.estado = 1 AND i.tipo = 1 AND i.estado = 1
				UNION 
				SELECT i.codigo,i.indicador,i.tipo FROM practicos_web pw INNER JOIN indicador i ON  
				pw.id = i.codigo AND pw.gestion = ? AND pw.trimestre = ? 
				AND pw.codcur = ? AND pw.codpar = ? AND pw.codmat = ? AND 
				pw.estado = 1 AND i.tipo = 2 AND i.estado = 1
				UNION
				SELECT i.codigo,i.indicador,i.tipo FROM evaluacion pw INNER JOIN indicador i ON  
				pw.id = i.codigo AND pw.gestion = ? AND pw.bimestre = ? 
				AND pw.codigo = ? AND pw.cod_par = ? AND pw.codmat = ? AND 
				pw.estado = 1 AND i.tipo = 3 AND i.estado = 1
				UNION
				SELECT i.codigo,i.indicador,i.tipo FROM evaluacion_escrita pw INNER JOIN indicador i ON  
				pw.id = i.codigo AND pw.gestion = ? AND pw.trimestre = ? 
				AND pw.codcur = ? AND pw.codpar = ? AND pw.codmat = ? AND 
				pw.estado = 1 AND i.tipo = 4 AND i.estado = 1
				UNION
				SELECT i.codigo,i.indicador,i.tipo FROM evaluacion_mixta pw INNER JOIN indicador i ON  
				pw.em_id = i.codigo AND pw.em_gestion = ? AND pw.em_trimestre = ? 
				AND pw.em_codcur = ? AND pw.em_codpar = ? AND pw.em_codmat = ? AND 
				pw.em_estado = 1 AND i.tipo = 5 AND i.estado = 1";
		$type = "iiiisiiiisiiiisiiiisiiiis";
		$params = array($gestion,$trimestre,$codcur,$codpar,$codmat,$gestion,$trimestre,$codcur,$codpar,$codmat,$gestion,$trimestre,$codcur,$codpar,$codmat,$gestion,$trimestre,$codcur,$codpar,$codmat,$gestion,$trimestre,$codcur,$codpar,$codmat);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
}
?>