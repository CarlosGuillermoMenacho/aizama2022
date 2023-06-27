<?php 
class Evento{
	private $db;
		
	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
		}
	public function get_eventos($year){
		$year = $year."%";
		$consulta ="SELECT id,descripcion,fecha,horai,horaf,
						   fechaReg,admin 
					FROM eventos 
					WHERE estado = 1 AND fecha LIKE ?";
		$resultado=mysqli_prepare($this->db, $consulta);
		$ok=mysqli_stmt_bind_param($resultado,"s", $year);	
		$ok=mysqli_stmt_execute($resultado);
		$lista = array();
		if($ok){
			$ok= mysqli_stmt_bind_result(
										$resultado, 
										$id,
										$descripcion,
										$fecha,
										$horai,
										$horaf,
									    $fechaReg,
									    $admin
										);
			
			while (mysqli_stmt_fetch($resultado)) {
				$lista[] = array(
								"id"=>$id,
								"descripcion"=>$descripcion,
								"fecha"=>$fecha,
								"horai"=>$horai,
								"horaf"=>$horaf,
								"fechaReg"=>$fechaReg,
								"admin"=>$admin
								);
			}
		}
		return $lista;
		mysqli_stmt_close($resultado);
	}
	public function delete_evento($id){
		$consulta ="UPDATE eventos 
					SET estado = 0 
					WHERE id = ?";
		$resultado=mysqli_prepare($this->db, $consulta);
		$ok=mysqli_stmt_bind_param($resultado,"i", $id);	
		$ok=mysqli_stmt_execute($resultado);
		
		mysqli_stmt_close($resultado);
		return $ok!=false;
	}
	public function save_evento($descripcion,$fecha,$inicio,$fin,$fechaReg,$admin){
		$consulta ="SELECT save_evento(?,?,?,?,?,?) AS id_evento";
		$resultado=mysqli_prepare($this->db, $consulta);
		$ok=mysqli_stmt_bind_param($resultado,"sssssi", $descripcion,$fecha,$inicio,$fin,$fechaReg,$admin);	
		$ok=mysqli_stmt_execute($resultado);
		/*if($ok){
			if (!empty($enlace)) {
				$ok= mysqli_stmt_bind_result($resultado, $evento);
				mysqli_stmt_fetch($resultado);
				require_once('modelo_enlace_eventos.php');
				$enlace_evento = new Enlace();
				$enlace_evento->save_enlace($enlace,$evento,$fechaReg,$admin);
			}
		}*/
		mysqli_stmt_close($resultado);
		return $ok;
	}
	public function update_evento($id,$descripcion,$fecha,$inicio,$fin,$fechaReg,$admin){
		$consulta ="UPDATE eventos SET descripcion = ?,
									   fecha = ? ,
									   horai = ? ,
									   horaf = ? ,
									   fechareg = ? ,
									   admin = ? 
					WHERE id = ?";
		$resultado=mysqli_prepare($this->db, $consulta);
		$ok=mysqli_stmt_bind_param($resultado,"sssssii",$descripcion,$fecha,$inicio,$fin,$fechaReg,$admin,$id);	
		$ok=mysqli_stmt_execute($resultado);
		mysqli_stmt_close($resultado);
		return $ok;
	}
	public function get_eventos_mes($mes){
		$mes = "%-".$mes."-%";
		$consulta ="SELECT id,descripcion,fecha,horai,horaf,fechareg,admin  
					FROM eventos 
					WHERE fecha LIKE ? and estado = 1";
		$resultado=mysqli_prepare($this->db, $consulta);
		$ok=mysqli_stmt_bind_param($resultado,"s",$mes);	
		$ok=mysqli_stmt_execute($resultado);
		$lista = array();
		if($ok){
			mysqli_stmt_bind_result($resultado,$id,$descripcion,$fecha,$horai,$horaf,$fechaReg,$admin);
			while(mysqli_stmt_fetch($resultado)){
				$lista[] = array(
								"id"=>$id,
								"descripcion"=>$descripcion.' desde las '.substr($horai,0,5)." hrs. hasta las ".substr($horaf,0,5)." hrs.",
								"fecha"=>$fecha,
								"horai"=>$horai,
								"horaf"=>$horaf,
								"fechaReg"=>$fechaReg,
								"admin"=>$admin,
								"dia"=>substr($fecha,8,2)
								);
			}
			mysqli_stmt_close($resultado);
			return $lista;
		}
	}
}

?>
