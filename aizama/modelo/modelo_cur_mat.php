<?php 
	/**
	 * 
	 */
class CurMat{
	
	private $db;
	
	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once("execute_sql.php");
		}
    public function get_all(){
    	$sql = "SELECT * FROM cur_mat WHERE estado = 1";
		$type = "";
		$params = array();
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
    }
    public function get_materias($codcur,$codpar){
    	$sql = "SELECT * FROM cur_mat WHERE estado = 1 AND cod_cur = ? AND cod_par = ?";
		$type = "ii";
		$params = array($codcur,$codpar);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
    }
}	
?>