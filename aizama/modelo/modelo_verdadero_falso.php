<?php

class verdadero_falso
{
    private $db;
    private $vf;
    public function __construct($conexion)
        {
            $this->db = $conexion;
            require_once'execute_sql.php';
            //$this->db = Conectar::conexion();
        	$this->vf=array();
        }

	public function guardar_respuesta($codpreg, $fv, $codprof)	
	{	
			$estado=1;
			$fechaReg=date("Y-m-d H:i:s");
			$consulta="INSERT INTO verdadero_falso(codpreg, f_v,codprof, fechaReg, estado)VALUES (?,?,?,?,?)";
			$resultado=mysqli_prepare($this->db,$consulta);
			$ok=mysqli_stmt_bind_param($resultado,"iissi",$codpreg, $fv, $codprof, $fechaReg, $estado);
            $ok=mysqli_stmt_execute($resultado);
	    	mysqli_stmt_close($resultado);        
			return $ok!=false;
	}

	public function editar_verdadero_falso($correcto, $id)
	{ 	
			$fechaReg=date("Y-m-d H:i:s");
			$consulta="UPDATE verdadero_falso SET f_v=? WHERE id=?";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok = mysqli_stmt_bind_param($resultado,"ii",$correcto ,$id);
			$ok = mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false; 		
	}

    public function obtener_verdadero_falso($codpreg)
    {    
            $consulta = "SELECT f_v	
                        FROM verdadero_falso
                        WHERE codpreg=? and estado = 1";
          	$resultado=mysqli_prepare($this->db, $consulta);
			$ok = mysqli_stmt_bind_param($resultado,"i",$codpreg);
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $total);
			 	mysqli_stmt_fetch($resultado);
			 	mysqli_stmt_close($resultado);
			 	return $total;
			 }else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			 }
    }
	public function obtener_vf($codpreg)
    {   $consulta ="SELECT *	
		FROM verdadero_falso
		WHERE codpreg=? and estado = 1";

			$resultado= mysqli_prepare($this->db,$consulta);
			$ok = mysqli_stmt_bind_param($resultado,"i", $codpreg);
			$ok = mysqli_stmt_execute($resultado);

			if ($ok) {
			$ok= mysqli_stmt_bind_result($resultado, $id, $codpreg, $f_v,  $codProf,$fechaReg, $estado);
			$lista = array();
			while (mysqli_stmt_fetch($resultado)) {
				$lista[] = array(
								"id" => $id,
								"codpreg" => $codpreg,
								"f_v" => $f_v,
								"codprof" => $codProf,
								"fechaReg" => $fechaReg,
								"estado" => $estado
								);
			}
			mysqli_stmt_close($resultado);
			return $lista;
			}else{
			mysqli_stmt_close($resultado);
			return false;
			}	 
    }
	public function obtener_id_verdadero_falso($codpreg)
    {    
            $consulta = "SELECT id	
                        FROM verdadero_falso
                        WHERE codpreg=? and estado = 1";
          	$resultado=mysqli_prepare($this->db, $consulta);
			$ok = mysqli_stmt_bind_param($resultado,"i",$codpreg);
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $total);
			 	mysqli_stmt_fetch($resultado);
			 	mysqli_stmt_close($resultado);
			 	return $total;
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}
    }
}

?>