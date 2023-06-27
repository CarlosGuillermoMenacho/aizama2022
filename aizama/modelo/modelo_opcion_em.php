<?php

class opciones_pregunta_seleccion
{
	private $db;
	private $opciones;
	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
			$this->opciones=array();
		}

	public function cantidad_opciones($codpreg)
	{  
			$sql= "SELECT count(*) AS total FROM em_opciones WHERE em_o_pregunta=? and em_o_estado=1";
			$resultado=mysqli_prepare($this->db, $sql);
			$ok=mysqli_stmt_bind_param($resultado,"i", $codpreg);
			$ok=mysqli_stmt_execute($resultado);
		
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $total);
			 	mysqli_stmt_fetch($resultado);
			 	return $total;
			 }else{
			 	return false;
			 }
	}	

	public function guardar_opcion($codpreg, $opciones, $codprof)	//guardar lista de opciones
	{	
		foreach($opciones as $opcion){
			$nro = $this->cantidad_opciones($codpreg);
			$nro++;
			$estado=1;
			$fechaReg=date("Y-m-d H:i:s");
			$consulta="INSERT INTO em_opciones(em_o_pregunta, em_o_nro, em_o_opcion, em_o_fechaReg, em_o_codprof, em_o_estado)VALUES (?,?,?,?,?,?)";
			$resultado=mysqli_prepare($this->db,$consulta);
			$ok=mysqli_stmt_bind_param($resultado,"iisssi",$codpreg, $nro, $opcion,$fechaReg, $codprof, $estado);
			$ok=mysqli_stmt_execute($resultado);	
		}
		mysqli_stmt_close($resultado);
			return $ok!=false;
	}

	public function guardar_una_opcion($codpreg, $opcion, $codprof)	//guarda una opcion 
	{
			$nro = $this->cantidad_opciones($codpreg);
			$nro++;
			$estado=1;
			$fechaReg=date("Y-m-d H:i:s");
			$consulta="INSERT INTO em_opciones(em_o_pregunta, em_o_nro, em_o_opcion, em_o_fechaReg, em_o_codprof, em_o_estado)VALUES (?,?,?,?,?,?)";
			$resultado=mysqli_prepare($this->db,$consulta);
			$ok=mysqli_stmt_bind_param($resultado,"iisssi",$codpreg, $nro, $opcion,$fechaReg, $codprof, $estado);
			$ok=mysqli_stmt_execute($resultado);	
		mysqli_stmt_close($resultado);
			return $ok!=false;
	}
	public function editar_opcion($idopcion ,$opcion ,$codProf)
	{ 	
			$fechaReg=date("Y-m-d H:i:s");
			$consulta="UPDATE em_opciones SET em_o_opcion=?,
											em_o_fechaReg=?,
											em_o_codprof=?
					WHERE em_o_id=?";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok = mysqli_stmt_bind_param($resultado,"sssi",$opcion , $fechaReg, $codProf ,$idopcion);
			$ok = mysqli_stmt_execute($resultado);

			mysqli_stmt_close($resultado);
			return $ok!=false; 		
	}

	public function obtener_nro($idopcion)
	{ 
			$consulta = $this->db->query("SELECT em_o_nro FROM em_opciones WHERE em_o_id = '".$idopcion."'");
			$lista_opciones = array();
			while($row = $consulta->fetch_object()){
				$lista_opciones[] = $row;
			}
			return $lista_opciones;
	}
	public function eliminar_opcion($idopcion,$codpreg, $nro, $codprof)
	{
		$fechaReg=date("Y-m-d H:i:s");
		$estado=0;
		$consulta="UPDATE em_opciones SET em_o_estado=?,
											em_o_fechaReg=?,
											em_o_codprof=?
				WHERE em_o_id=?";
		$resultado=mysqli_prepare($this->db, $consulta);
		$ok=mysqli_stmt_bind_param($resultado,"issi", $estado, $fechaReg, $codprof, $idopcion);
			
		$ok=mysqli_stmt_execute($resultado);
		mysqli_stmt_close($resultado);

		$sql= "UPDATE em_opciones SET em_o_nro= em_o_nro-1 
				 WHERE em_o_pregunta=? AND em_o_estado=1 and em_o_nro>? ";
		$resultado=mysqli_prepare($this->db, $sql);
		$ok=mysqli_stmt_bind_param($resultado,"ii", $codpreg, $nro);
			
		$ok=mysqli_stmt_execute($resultado);
		mysqli_stmt_close($resultado);
        require_once'modelo_opcion_correcta_em.php';
        $Opcion = new opcion_correcta($this->db);
        $nro2 = $Opcion->obtener_opcion_correcta($codpreg);
        if($nro<=$nro2){
            $nro2--;
            $Opcion->editar_opcion_correcta_preg($codpreg, $nro2);
        }
		$nro=$this->obtener_nro($idopcion);

		return $ok!=false;
	}

/*	public function obtener_opcion($codpreg)
	{ 
			$consulta = $this->db->query("SELECT em_o_id, em_o_pregunta, em_o_nro, em_o_opcion, em_o_fechaReg, em_o_codprof, em_o_estado 
										FROM em_opciones 
										WHERE em_o_pregunta = '".$codpreg."' and em_o_estado=1");
			$lista_opciones = array();
			while($row = $consulta->fetch_object()){
				$lista_opciones[] = $row;
			}
			return $lista_opciones;

	}*/
	public function obtener_opcion($codpreg)
	{ 
			$consulta ="SELECT em_o_id, em_o_pregunta, em_o_nro, em_o_opcion, em_o_fechaReg, em_o_codprof, em_o_estado 
						FROM em_opciones 
						WHERE em_o_pregunta =? and em_o_estado=1";
			
			$resultado= mysqli_prepare($this->db,$consulta);
			$ok = mysqli_stmt_bind_param($resultado,"i", $codpreg);
			$ok = mysqli_stmt_execute($resultado);
			
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $id, $codpreg, $nro, $opcion, $fechaReg, $codProf, $estado);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"em_o_id" => $id,
									"em_o_pregunta" => $codpreg,
									"em_o_nro" => $nro,
									"em_o_opcion" => $opcion,
									"em_o_fechaReg" => $fechaReg,
									"em_o_codprof" => $codProf,
									"em_o_estado" => $estado
									);
				}
				mysqli_stmt_close($resultado);
			 	return $lista;
			 }else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			 }	
	}

	public function obtener_id_opcion($codpreg)
	{ 
			$consulta = $this->db->query("SELECT em_o_id , em_o_nro, em_o_opcion
										FROM em_opciones 
										WHERE em_o_pregunta = '".$codpreg."' and em_o_estado=1 order by em_o_nro asc");
			$lista_opciones = array();
			while($row = $consulta->fetch_object()){
					$lista_opciones[] = $row;
			}
			return $lista_opciones;
	}
}
?>