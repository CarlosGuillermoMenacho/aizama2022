<?php 
class Enlace{
	private $db;
		
	public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
		}
	public function save_enlace($enlace,$evento,$fechaReg,$admin){
		$consulta ="INSERT INTO enlaces_eventos(enlace,evento,fechareg,admin,estado)
					VALUES (?,?,?,?,1)";
		$resultado=mysqli_prepare($this->db, $consulta);
		$ok=mysqli_stmt_bind_param($resultado,"sisi", $enlace,$evento,$fechaReg,$admin);	
		$ok=mysqli_stmt_execute($resultado);
		mysqli_stmt_close($resultado);
		return $ok;

	}
}

?>