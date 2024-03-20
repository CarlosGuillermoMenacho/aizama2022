<?php 

class Practico{
	
	private $db;

	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}

	public function get_practicos_profesor($gestion,$codprof){
		$sql = "SELECT trimestre,sum(total) as total FROM (SELECT trimestre,count(*) as total FROM practicos_web WHERE estado = 1 AND gestion = ? AND codprof = ? 		GROUP BY trimestre
				UNION
				SELECT bimestre as trimestre,count(bimestre) as total FROM cuestionarios WHERE estado = 1 AND gestion = ? AND codprof = ? GROUP BY trimestre) as t GROUP BY trimestre";
		$type = "isis";
		$params = array($gestion,$codprof,$gestion,$codprof);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function get_practicos_profesor_fecha($gestion,$codprof,$fecha_i,$fecha_f){
		$sql = "SELECT sum(total) as total FROM (SELECT count(*) as total FROM practicos_web WHERE estado = 1 AND gestion = ? AND codprof = ? AND fechaReg >= ? AND fechaReg <= ?
				UNION
				SELECT count(*) as total FROM cuestionarios WHERE estado = 1 AND gestion = ? AND codprof = ? AND fechaReg >= ? AND fechaReg <= ?) as t ";
		$type = "isssisss";
		$params = array($gestion,$codprof,$fecha_i,$fecha_f,$gestion,$codprof,$fecha_i,$fecha_f);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function get_practicos_gestion($gestion,$codcur,$codpar){
		$sql = "SELECT cod_cuest as id, bimestre as trimestre,cod_mat as codmat,descrip as descripcion,fechaReg as fecha,'1' as tipo FROM cuestionarios WHERE gestion = ? AND estado = 1 AND cod_cur = ? AND cod_par = ? UNION SELECT id,trimestre,codmat,descripcion,fechaReg as fecha,'2' as tipo FROM practicos_web WHERE gestion = ? AND estado = 1 AND codcur = ? AND codpar = ?";
		$type = "iiiiii";
		$params = array($gestion,$codcur,$codpar,$gestion,$codcur,$codpar);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function get_practicos_count($gestion,$codcur,$codpar,$codmat){
		$sql = "SELECT COUNT(*) as n FROM cuestionarios WHERE gestion = ? AND estado = 1 AND cod_cur = ? AND cod_par = ? AND cod_mat = ? ";
		$type = "iiis";
		$params = array($gestion,$codcur,$codpar,$codmat);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		$row = $result->fetch_object();
		$total = $row->n;
		$sql = "SELECT COUNT(*) as n FROM practicos_web WHERE gestion = ? AND estado = 1 AND codcur = ? AND codpar = ? AND codmat = ?";
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		$row = $result->fetch_object();
		$total = $total + $row->n;
		return $total;
	}
}
?>