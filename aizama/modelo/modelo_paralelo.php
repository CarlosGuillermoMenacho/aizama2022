<?php 
class Paralelo{
	
	private $db;
	
	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
		}

	public function getNombreParalelo($id){
		$sql= "SELECT descrip 
			   FROM paralelos 
			   WHERE cod_par = ? and estado = 1";

		$resultado=mysqli_prepare($this->db, $sql);
		$ok=mysqli_stmt_bind_param($resultado,"i", $id);
			
		$ok=mysqli_stmt_execute($resultado);
		$lista = array();
		if ($ok) {
			$ok= mysqli_stmt_bind_result($resultado,$nombre);
			if(mysqli_stmt_fetch($resultado)){
				return $nombre;
			}
			
			return "";
			mysqli_stmt_close($resultado);
		}else{
			mysqli_stmt_close($resultado);
			return false;
		}
	}
	public function getParalelosIndex(){
		$consulta = "SELECT * FROM paralelos";
		$result = mysqli_query($this->db,$consulta);
		$lista = array();
		while ($fila = $result->fetch_object()) {
			$lista[$fila->cod_par] = $fila->descrip;
		}
		return $lista;
	}
	public function get_paralelos(){
		$consulta ="SELECT * FROM paralelos";
		$type = "";
		$params = array();
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return $result;
	}
}	
?>