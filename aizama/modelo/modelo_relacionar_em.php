<?php
    /*
    *
    */
    class relacionar_pregunta
    {
        private $db;
        private $relacionar;
        public function __construct($conexion)
        {
            $this->db = $conexion;
            require_once'execute_sql.php';
            //$this->db = Conectar::conexion();
            $this->relacionar=array();
        }

        public function cantidad_relacion($codpreg){  
                $sql= "SELECT count(*) AS total FROM em_relacionar WHERE codpreg=? and estado=1";
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
    
        public function guardar_relacion($codpreg, $campo1, $tipo1,$op_correcto, $campo2, $tipo2, $codprof)
        {  
            $nro = $this->cantidad_relacion($codpreg);
                $nro++;
                $estado=1;
                $fechaReg=date("Y-m-d H:i:s");
                $consulta="INSERT INTO em_relacionar(codpreg,
                                                    nro,
                                                    campo1,
                                                    tipo1,
                                                    op_correcto,
                                                    campo2, 
                                                    tipo2,
                                                    codprof,
                                                    fechaReg,
                                                    estado)
                            VALUES (?,?,?,?,?,?,?,?,?,?)";
                $resultado=mysqli_prepare($this->db,$consulta);
                $ok=mysqli_stmt_bind_param($resultado,"iisiisissi",$codpreg, $nro, $campo1, $tipo1,$op_correcto, $campo2, $tipo2, $codprof,$fechaReg,$estado);
                $ok=mysqli_stmt_execute($resultado);                
            mysqli_stmt_close($resultado);
            return $ok!=false; 
        }

        public function obtener_nro($id)
        {
            $consulta = $this->db->query("SELECT nro FROM em_relacionar WHERE id = '".$id."'");
			$lista_relacion = array();
			while($row = $consulta->fetch_object()){
				$lista_relacion[] = $row;
			}
			return $lista_relacion;
        }

        public function delete_relacion($id,$codpreg, $nro, $codprof){
            $estado=0;
			$fechaReg=date("Y-m-d H:i:s");
			$consulta="UPDATE em_relacionar SET  estado=?,
                                                fechaReg=?,
                                                codprof=?
                            where id=?";
			$resultado=mysqli_prepare($this->db,$consulta);
			$ok=mysqli_stmt_bind_param($resultado,"issi", $estado, $fechaReg, $codprof, $id);
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
            $sql= "UPDATE em_relacionar SET nro= nro-1 
            WHERE codpreg=? AND estado=1 and nro>?  ";
            $resultado=mysqli_prepare($this->db, $sql);
            $ok=mysqli_stmt_bind_param($resultado,"ii", $codpreg, $nro);
                
            $ok=mysqli_stmt_execute($resultado);
            mysqli_stmt_close($resultado);           
            $nro=$this->obtener_nro($id);            
			return $ok!=false;
        }

        public function obtener_relaciones($codpreg)// obtiene todas la relacion de una poregunta
        {   
            $consulta = "SELECT * FROM em_relacionar WHERE codpreg =? AND estado=1 ";
            $resultado= mysqli_prepare($this->db,$consulta);
			$ok = mysqli_stmt_bind_param($resultado,"i", $codpreg);
			$ok = mysqli_stmt_execute($resultado);
			
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $id, $codpreg, $nro, $campo1, $tipo1, $op_correcto, $campo2, $tipo2, $codProf, $fechaReg, $estado);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $id,
									"codpreg" => $codpreg,
									"nro" => $nro,
									"campo1" => $campo1,
									"tipo1" => $tipo1,
									"op_correcto" => $op_correcto,
                                    "campo2"=> $campo2,
                                    "tipo2" => $tipo2,
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

        public function update_relacion($id,$campo1,$tipo1,$op_correcto, $campo2, $tipo2,$codprof)
        {
            $fechaReg=date("Y-m-d H:i:s");
			$consulta= "UPDATE em_relacionar SET  campo1 =?,
                                                tipo1 =?,
                                                op_correcto =?,
                                                campo2 =?,
                                                tipo2 =?,
                                                codprof =?,
                                                fechaReg =?
						WHERE id = ?";
			$resultado=mysqli_prepare($this->db,$consulta);
			$ok=mysqli_stmt_bind_param($resultado,"siisissi",$campo1, $tipo1, $op_correcto,$campo2,$tipo2,$codprof, $fechaReg, $id);
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false;
        }

        public function get_relacion($id)
        {
            $consulta=$this->db->query("SELECT * FROM em_relacionar WHERE id= '".$id."' ");
			$lista_relacion=array();
			while($row=$consulta->fetch_object()){
				$lista_relacion[]=$row;
			}
			return $lista_relacion;   
        }       
        public function obtener_id_relacion($codpreg)
        {       $consulta = $this->db->query("SELECT *
                                            FROM em_relacionar
                                            WHERE codpreg = '".$codpreg."' and estado=1 order by nro asc");
                $lista_relaciones = array();
                while($row = $consulta->fetch_object()){
                        $lista_relaciones[] = $row;
                }
                return $lista_relaciones;
        }

    }
?>
