<?php 
class Profesor{
	private $db;
		
	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
		}
	public function get_prof_cur_mat($codprof,$gestion){
		$sql= "SELECT codcur,codmat,codpar 
			   FROM prof_cur_mat 
			   WHERE prof = ? and gestion = ? and estado = 'activo'";

		$resultado=mysqli_prepare($this->db, $sql);
		$ok=mysqli_stmt_bind_param($resultado,"si", $codprof,$gestion);
			
		$ok=mysqli_stmt_execute($resultado);
		$lista = array();
		if ($ok) {
			$ok= mysqli_stmt_bind_result($resultado,$codcur,$codmat,$codpar);
			$lista = array();
			while(mysqli_stmt_fetch($resultado)){
				$lista[] = array(
								"codcur"=>$codcur,
								"codpar"=>$codpar,
								"codmat"=>$codmat
								);
			}
			
			return $lista;
			mysqli_stmt_close($resultado);
		}else{
			mysqli_stmt_close($resultado);
			return false;
		}
	}
	public function get_nombre($codprof){
		$sql="select * FROM profe WHERE CODPROF = ?";
		$type="s";
		$params=array($codprof);
		$result=ejecutar_consulta($this->db,$sql,$type,$params);
		if($fila = $result->fetch_object()){
			return $fila->APEPRO.' '.$fila->NOMPRO;
		}

		return null;
	}
	public function get_profesor($codprof){
		$sql="select * FROM profe WHERE CODPROF = ? AND estado = 'activo'";
		$type="s";
		$params=array($codprof);
		$result=ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function get_profesores(){
		$sql="SELECT * FROM profe WHERE estado = 'activo'";
		$type="";
		$params=array();
		$result=ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function get_cursos_prof($gestion,$codprof){
		$sql="SELECT * FROM prof_cur_mat WHERE prof = ? AND estado = 'activo' AND gestion = ? GROUP BY codcur,codpar ORDER BY codcur,codpar ASC";
		$type="si";
		$params=array($codprof,$gestion);
		$result=ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function get_profesores_index(){
		$sql="SELECT * FROM profe";
		$type="";
		$params=array();
		$result=ejecutar_consulta($this->db,$sql,$type,$params);
		$profesores = [];
		while ($row = $result->fetch_object()) {
			$profesores[$row->CODPROF] = $row;
		}
		return $profesores;
	}
}
?>