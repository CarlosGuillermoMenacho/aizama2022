<?php 
	/**
	 * 
	 */
class HoraEntrada{
	
	private $db;
	
	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
		}

	public function getDatos(){
	    $sql = "SELECT * FROM hor_ent_salida WHERE estado = 1";
		$type = "";
		$params = array();
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
}	
?>