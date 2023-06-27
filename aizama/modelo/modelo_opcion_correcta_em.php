<?php

class opcion_correcta
 {
 	private $db;
 	private $opcion;
 	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
			$this->opcion=array();
		}
 	
 	public function guardar_opcion_correcta($codpreg, $nro)
 	{
 		$estado=1;
 		$consulta="INSERT INTO em_o_correcta(codpre,codopcion,estado)VALUES(?,?,?)";
 		$resultado=mysqli_prepare($this->db,$consulta);
 		$ok=mysqli_stmt_bind_param($resultado,"iii",$codpreg, $nro,$estado);
 		$ok=mysqli_stmt_execute($resultado);
 		mysqli_stmt_close($resultado);
 		return$ok!=false;
 	}

 	public function editar_opcion_correcta($idcorrecto, $nro)
 	{ 
 		$consulta="UPDATE em_o_correcta SET codopcion=? WHERE id=?";
 		$resultado=mysqli_prepare($this->db,$consulta);
 		$ok=mysqli_stmt_bind_param($resultado,"ii",$nro,$idcorrecto);
 		$ok=mysqli_stmt_execute($resultado);
 		mysqli_stmt_close($resultado);
 		return$ok!=false;
 	}
    public function editar_opcion_correcta_preg($codpreg, $nro)
 	{ 
 		$sql="UPDATE em_o_correcta SET codopcion=? WHERE codpre=?";
 		$params = array($nro,$codpreg);
 		$type = "ii";
 		$result = ejecutar_consulta($this->db,$sql,$type,$params);
 		
 		return $result;
 	}
 	public function eliminar_opcion_correcta($id)
 	{
 		$estado=0;
 		$consulta="UPDATE em_o_correcta SET estado=? WHERE id=?";
 		$resultado=mysqli_prepare($this->db, $consulta);
 		$ok=mysqli_stmt_bind_param($resultado,"ii",$estado, $id);
 		$ok=mysqli_stmt_execute($resultado);
 		mysqli_stmt_close($resultado);
 		return$ok!=false;
 	}

 	public function obtener_opcion_correcta($codpreg)
 	{
 			$opcionReturn = 0;
 			$consulta = "SELECT codopcion	
 						FROM em_o_correcta
 						WHERE codpre=? and estado = 1";
 			$resultado=mysqli_prepare($this->db, $consulta);
	 		$lista_opcion=mysqli_stmt_bind_param($resultado,"i",$codpreg);
	 		$lista_opcion=mysqli_stmt_execute($resultado);
	 		$lista_opcion = mysqli_stmt_bind_result($resultado, $opcion_correcta);
	 		while (mysqli_stmt_fetch($resultado)) {
				$opcionReturn = $opcion_correcta;
			}
			return $opcionReturn; 
 	}
	 public function obtener_idopcion_correcta($codpreg)
 	{
 			$opcionReturn = 0;
 			$consulta = "SELECT id	
 						FROM em_o_correcta
 						WHERE codpre=? and estado = 1";
 			$resultado=mysqli_prepare($this->db, $consulta);
	 		$lista_opcion=mysqli_stmt_bind_param($resultado,"i",$codpreg);
	 		$lista_opcion=mysqli_stmt_execute($resultado);
	 		$lista_opcion = mysqli_stmt_bind_result($resultado, $opcion_correcta);
	 		while (mysqli_stmt_fetch($resultado)) {
				$opcionReturn = $opcion_correcta;
			}
			return $opcionReturn; 
 	}
 }
?>