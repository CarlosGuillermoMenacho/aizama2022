<?php 

class ClaseVirtual{
	private $db;

	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}

	public function save($gestion,$trimestre,$codcur,$codpar,$codprof,$codmat,$titulo,$descripcion,$fecha,$horai,$horaf,$link,$fechareg){
		$consulta ="INSERT INTO claseVirtual(gestion,trimestre,codCur,codPar,codprof,codMat,titulo,descripcion,fecha,horaIni,horaFin,link,estado,fechareg) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,1,?)";
		$type = "iiiisssssssss";
		$params = array($gestion,$trimestre,$codcur,$codpar,$codprof,$codmat,$titulo,$descripcion,$fecha,$horai,$horaf,$link,$fechareg);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
	}
	public function get_clase_virtuales_trimestre($gestion,$trimestre,$codcur,$codpar){
		$consulta ="SELECT * FROM claseVirtual WHERE gestion = ? AND trimestre = ? AND codCur = ? AND codPar = ? AND estado = 1";
		$type = "iiii";
		$params = array($gestion,$trimestre,$codcur,$codpar);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return $result;
	}
	public function get_clases_en_vivo(){
		$fechaActual = date("Y-m-d");
		$horaActual = date("H:i");
		//$horaActual = "08:00";
		$consulta ="SELECT * FROM claseVirtual WHERE estado = 1 AND fecha = ? AND horaIni <= ? AND horaFin >= ?";
		$type = "sss";
		$params = array($fechaActual,$horaActual,$horaActual);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return $result;
	}	
	public function get_clases_virtuales_cursos_prof($gestion,$trimestre,$codcur,$codpar,$codprof){
		$consulta ="SELECT * FROM claseVirtual WHERE gestion = ? AND trimestre = ? AND codCur = ? AND codPar = ? AND codprof = ? AND estado = 1";
		$type = "iiiis";
		$params = array($gestion,$trimestre,$codcur,$codpar,$codprof);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return $result;
	}
}	

?>