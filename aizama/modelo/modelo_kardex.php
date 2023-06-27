<?php 
class Kardex{
	private $db;
	
	function __construct($conexion)
	{
		require_once("execute_sql.php");
		$this->db = $conexion;
	}
	public function pago_mes($codalu,$gestion,$cuota){
		$sql = "SELECT *  
				FROM kar_alu 
				WHERE estado=1 AND codigo = ? and 
					  ano_pago = ? and cuota = ? and sw = 'VERDADERO'";
		$params = array($codalu,$gestion,$cuota);
		$type = "iii";

		$result=ejecutar_consulta($this->db, $sql, $type, $params);

		return $result;
	}
}
?>