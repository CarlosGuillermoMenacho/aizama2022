<?php 
class Prof_cur_mat{
	
	private $db;
	
	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
		}

	public function get_materias($prof,$codcur,$codpar,$gestion){
		$sql= "SELECT codmat 
			   FROM prof_cur_mat  
			   WHERE prof = ? and codcur = ? and 
			   		 codpar = ? and gestion = ? and 
			   		 estado = 'activo'";

		$resultado=mysqli_prepare($this->db, $sql);
		$ok=mysqli_stmt_bind_param($resultado,"siii", $prof,$codcur,$codpar,$gestion);
			
		$ok=mysqli_stmt_execute($resultado);
		$lista = array();
		if ($ok) {
			$ok= mysqli_stmt_bind_result($resultado,$codmat);
			$lista = array();
			while(mysqli_stmt_fetch($resultado)){
				$lista[] = $codmat;
			}
			
			return $lista;
			mysqli_stmt_close($resultado);
		}else{
			mysqli_stmt_close($resultado);
			return false;
		}
	}
    public function get_registros($codprof,$gestion){
		$sql = "SELECT * FROM prof_cur_mat WHERE prof = ? AND gestion = ? AND estado = 'activo'";
		$type = "si";
		$params = array($codprof,$gestion);

		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	public function get_profesor($codcur,$codpar,$codmat,$gestion){
	    $sql = "SELECT p.APEPRO,p.NOMPRO FROM prof_cur_mat pcm INNER JOIN profe p ON p.CODPROF = pcm.prof AND pcm.codcur = ? AND pcm.gestion = ? AND pcm.estado = 'activo' AND pcm.codpar = ? AND pcm.codmat = ?";
		$type = "iiis";
		$params = array($codcur,$gestion,$codpar,$codmat);

		$result = ejecutar_consulta($this->db,$sql,$type,$params);
        if($fila = $result->fetch_object()){
            return $fila->APEPRO.' '.$fila->NOMPRO;
        }
		return null;
	}
	public function es_profesor($codprof,$codcur,$codmat,$codpar,$gestion){
		$sql = "SELECT * FROM prof_cur_mat WHERE prof = ? AND codcur = ? AND codmat = ? AND codpar = ? AND gestion = ? AND estado = 'activo'";
		$type = "sisii";
		$params = array($codprof,$codcur,$codmat,$codpar,$gestion);

		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		if($fetch = $result->fetch_object())return true;
		return false;
	}
	public function get_registro($codprof,$codcur,$codmat,$codpar,$gestion){
		$sql = "SELECT * FROM prof_cur_mat WHERE prof = ? AND codcur = ? AND codmat = ? AND codpar = ? AND gestion = ?";
		$type = "sisii";
		$params = array($codprof,$codcur,$codmat,$codpar,$gestion);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);	
		return $result;	
	}
	public function habilitar_registro($id){
		$sql = "UPDATE prof_cur_mat SET estado = 'activo' WHERE id = ?";
		$type = "i";
		$params = array($id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);		
	}
	public function save($codprof,$codcur,$codmat,$codpar,$gestion){
		$result = $this->get_registro($codprof,$codcur,$codmat,$codpar,$gestion);
		if($row = $result->fetch_object()){
			$id = $row->id;
			$estado = $row->estado;
			if($estado == "pasivo"){
				$this->habilitar_registro($id);
			}
		}else{
			$sql = "INSERT INTO prof_cur_mat(prof,codcur,codmat,estado,codpar,gestion) VALUES(?,?,?,'activo',?,?)";
			$type = "sisii";
			$params = array($codprof,$codcur,$codmat,$codpar,$gestion);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
		}
	}
}
?>