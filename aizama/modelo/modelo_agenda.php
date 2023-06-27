<?php 
class Agenda{
	private $db;
		
	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}
	public function get_mensages_alu($codalu){
		$consulta ="SELECT * FROM msg_pend WHERE cod_tutor = ?";
		$type = "s";
		$params = array("-".$codalu);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return $result;
	}
}
?>