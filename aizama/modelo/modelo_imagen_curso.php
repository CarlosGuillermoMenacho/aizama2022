<?php 
	/**
	 * 
	 */
class ImagenCurso{
	
	private $db;
	private $cursos = [];
	public function __construct($conexion)
	{
		$this->db = $conexion;
		require_once("execute_sql.php");
		$sql = "SELECT * FROM cur_par_img WHERE estado = 1";
		$type = "";
		$params = array();
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		while ($row = $result->fetch_object()) {
			$this->cursos[] = $row;
		}
	}
    public function get_imagen($codcur,$codpar){
    	for ($i=0; $i < count($this->cursos); $i++) { 
    		if($this->cursos[$i]->codcur == $codcur && $this->cursos[$i]->codpar == $codpar)return $this->cursos[$i]->img;
    	}
    	return "";
    }
}	
?>