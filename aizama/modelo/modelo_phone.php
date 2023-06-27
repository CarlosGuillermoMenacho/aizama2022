<?php 
/**
 * 
 */
class Phone
{
	private $db;
	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			
		}
	public function getPhones(){
		$sql="SELECT * FROM phone WHERE estado = 0";
		$type="";
		$params=array();
		$result=ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function set_estado($id){
		$sql="UPDATE phone SET estado = 1 WHERE id = ?";
		$type="i";
		$params=array($id);
		$result=ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
}

?>