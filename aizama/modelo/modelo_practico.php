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
}
?>