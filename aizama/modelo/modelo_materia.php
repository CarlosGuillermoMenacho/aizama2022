<?php 
/**
 * 
 */
class Materia
{
	private $db;
	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
			
		}

	public function getMaterias(){
		$sql = "select * from materia where estado = 1";
		$result = mysqli_query($this->db,$sql);
		$lista = array();
		while ($fila = $result->fetch_object()) {
			$lista[$fila->CODMAT] = array(
							"nombre" => $fila->DESCRI,
							"nivel" => $fila->cod_niv,
							"imagen" => $fila->imagen
							);
		}
		return $lista;
	}
	public function getMaterias2(){
		$sql = "select * from materia where estado = 1";
		$result = mysqli_query($this->db,$sql);
		$lista = array();
		while ($fila = $result->fetch_object()) {
			$lista[] = array(
							"codmat" => $fila->CODMAT,
							"nombre" => $fila->DESCRI,
							"nivel" => $fila->cod_niv
							);
		}
		return $lista;
	}
	public function materiasCurso($codcur,$codpar){
		$sql= "SELECT cod_mat 
			   from cur_mat 
			   where cod_cur = ? and cod_par = ? and 
			   		 estado = 1 order by cod_mat asc";

		$resultado=mysqli_prepare($this->db, $sql);
		$ok=mysqli_stmt_bind_param($resultado,"ii",$codcur, $codpar);
			
		$ok=mysqli_stmt_execute($resultado);
		$fila = array();
		
		if ($ok) {
			$ok= mysqli_stmt_bind_result($resultado,$codmat);
			$lista = array();
			while (mysqli_stmt_fetch($resultado)) {
				$lista[] = $codmat;
				}
			 	return $lista;
		}else{
			return false;
		}
	}
	//Función que devuelve la lista de materias que el profesor tiene en un curso por gestion
	public function getMateriasProf($codprof,$codcur,$codpar,$gestion){
		$sql= "SELECT pc.codmat,m.descri,m.imagen FROM prof_cur_mat pc inner join materia m on 
			   pc.codmat = m.codmat and pc.estado = 'activo' and 
			   pc.gestion = ? and pc.codcur = ? and pc.codpar = ? 
			   and pc.prof = ?";

		$resultado=mysqli_prepare($this->db, $sql);
		$ok=mysqli_stmt_bind_param($resultado,"iiis",$gestion,$codcur, $codpar,$codprof);
			
		$ok=mysqli_stmt_execute($resultado);
		$fila = array();
		
		if ($ok) {
			$ok= mysqli_stmt_bind_result($resultado,$codmat,$nombre,$imagen);
			$lista = array();
			while (mysqli_stmt_fetch($resultado)) {
				$lista[] = array(
								"codmat" => $codmat,
								"nombre" => $nombre,
								"imagen"=>$imagen
								);
				}
			 	return $lista;
		}else{
			return false;
		}
	}
	public function getMateriasCurso($codcur,$codpar){
		$sql= "SELECT cm.cod_mat,m.descri,m.imagen  
			   FROM cur_mat cm inner join materia m on 
			   cm.cod_mat = m.codmat and 
			   cm.cod_cur = ? and cm.cod_par = ? and cm.estado = 1";

		$resultado=mysqli_prepare($this->db, $sql);
		$ok=mysqli_stmt_bind_param($resultado,"ii",$codcur, $codpar);
			
		$ok=mysqli_stmt_execute($resultado);
		$fila = array();
		
		if ($ok) {
			$ok= mysqli_stmt_bind_result($resultado,$codmat,$nombre,$imagen);
			$lista = array();
			while (mysqli_stmt_fetch($resultado)) {
				$lista[] = array(
								"codmat" => $codmat,
								"nombre" => $nombre,
								"imagen"=>$imagen
								);
				}
			 	return $lista;
		}else{
			return false;
		}
	}
	public function get_nombre($codmat){
		$sql="select * FROM materia WHERE CODMAT = ? AND estado = 1";
		$type="s";
		$params=array($codmat);
		$result=ejecutar_consulta($this->db,$sql,$type,$params);
		if ($fila = $result->fetch_object()) {
			return $fila->DESCRI;
		}

		return null;
	}
	public function getNameMateria($codmat){
		$sql = "SELECT DESCRI FROM materia WHERE CODMAT=? AND estado = 1";
		$resultado = mysqli_prepare($this->db,$sql);
		$ok=mysqli_stmt_bind_param($resultado,"s",$codmat);
		$ok=mysqli_stmt_execute($resultado);	
		if ($ok) {
			$ok= mysqli_stmt_bind_result($resultado,$descri);
			mysqli_stmt_fetch($resultado);
			mysqli_stmt_close($resultado);
			return $descri;
		}else{
			mysqli_stmt_close($resultado);
			return false;
		}
	}
	public function getMateriasNivel($codniv){
		$sql="select * FROM materia WHERE cod_niv = ? AND estado = 1";
		$type="i";
		$params=array($codniv);
		$result=ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
}

?>