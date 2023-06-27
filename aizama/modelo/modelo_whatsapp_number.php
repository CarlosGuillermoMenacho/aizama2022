<?php 
/**
 * 
 */
class Whatsapp_Number
{
	private $db;
	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			
		}
	public function save($number){
		$sql="INSERT INTO whatsapp_number(number) VALUES(?)";
		$type="s";
		$params=array($number);
		$result=ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
}

?>