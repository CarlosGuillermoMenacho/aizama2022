<?php 

class Whatsapp{

	private $db;

	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}

    public function save($phone,$msg){
		$sql ="INSERT INTO whatsapp_send_msg(phone,msg,estado) VALUES (?,?,0)";
		$type = "ss";
		$params = array($phone,$msg);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function get_msg_to_send(){
		$sql ="SELECT * FROM whatsapp_send_msg WHERE estado = 0 limit 1";
		$type = "";
		$params = array();
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function set_msg_send($id){
		$sql ="UPDATE whatsapp_send_msg SET estado = 1 WHERE id = ?";
		$type = "i";
		$params = array($id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
}	
?>