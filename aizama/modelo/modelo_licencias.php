<?php 
class Licencia{
    private $db;
    
    public function __construct($conexion)
        {
            $this->db = $conexion;
            require_once'execute_sql.php';
            //$this->db = Conectar::conexion();
   
        }

	public function guardar_licencia($codigo, $cod_tut, $f_solicitud, $h_solicitud, $f_ini, $f_fin, $obs)
	{	$consulta ="INSERT INTO licencias(id, codigo, cod_tut, f_solicitud, h_solicitud, f_ini, f_fin, obs,estado)
		VALUES (?,?,?,?,?,?,?,?,?)";
		
		$estado=1;
		$resultado=mysqli_prepare($this->db, $consulta);
		$ok=mysqli_stmt_bind_param($resultado,"iiisssssi", $id, $codigo, $cod_tut, $f_solicitud, $h_solicitud, $f_ini, $f_fin, $obs,$estado);
		$ok=mysqli_stmt_execute($resultado);
		if ($ok) {
		mysqli_stmt_close($resultado);
		return true;
		}else{
		mysqli_stmt_close($resultado);
		return false;
		}

	}
    public function get_licencias($codalu)
    { $consulta="SELECT * FROM licencias WHERE codigo=? and  estado=1";
        $resultado=mysqli_prepare($this->db, $consulta);
        $ok=mysqli_stmt_bind_param($resultado,"i",$codalu);
        $ok=mysqli_stmt_execute($resultado);
        if($ok){
            $ok=mysqli_stmt_bind_result($resultado,$id,$codalu,$cod_tut,$f_solicitud, $h_solicitud, $f_ini,$f_fin, $obs,$estado);
            $lista=array();
            while(mysqli_stmt_fetch($resultado)){
                $lista[]=array(
                    "id"=>$id,
                    "codalu"=>$codalu,
                    "cod_tut"=>$cod_tut,
                    "f_solicitud"=>$f_solicitud,
                    "h_solicitud"=>$h_solicitud,
                    "f_ini"=>$f_ini,
                    "f_fin"=>$f_fin,
                    "obs"=> $obs,
                    "estado"=>$estado
                );
            }
            mysqli_stmt_close($resultado);
            return $lista;
        }else{
            mysqli_stmt_close($resultado);
            return false;
        }   
    }
    public function update_licencias($id,$f_solicitud, $h_solicitud, $f_ini, $f_fin, $obs)
    { 
        $consulta = " UPDATE licencias SET f_solicitud=?,
                                        h_solicitud=?,
                                        f_ini = ?,
                                        f_fin = ?,
                                        obs =? 
                where id = ?";

           $resultado=mysqli_prepare($this->db, $consulta);
        $ok=mysqli_stmt_bind_param($resultado,"sssssi", $f_solicitud, $h_solicitud, $f_ini , $f_fin, $obs,$id);
        
        $ok=mysqli_stmt_execute($resultado);
        if ($ok) {
            mysqli_stmt_close($resultado);
            return true;
        }else{
            mysqli_stmt_close($resultado);
            return false;
        }

    }

    public function delete_licencia($id){
			$consulta= "UPDATE licencias SET estado=? WHERE id=?";
            $estado = 0;            
			$resultado=mysqli_prepare($this->db,$consulta);
			$ok=mysqli_stmt_bind_param($resultado,"ii", $estado, $id);
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false;
    }

    public function get_licencia_id($id)
    { $consulta="SELECT * FROM licencias WHERE id=? and  estado=1";
        $resultado=mysqli_prepare($this->db, $consulta);
        $ok=mysqli_stmt_bind_param($resultado,"i",$id);
        $ok=mysqli_stmt_execute($resultado);
        if($ok){
            $ok=mysqli_stmt_bind_result($resultado,$id,$codalu,$cod_tut,$f_solicitud, $h_solicitud, $f_ini,$f_fin, $obs,$estado);
            $lista=array();
            while(mysqli_stmt_fetch($resultado)){
                $lista[]=array(
                    "id"=>$id,
                    "codalu"=>$codalu,
                    "cod_tut"=>$cod_tut,
                    "f_solicitud"=>$f_solicitud,
                    "h_solicitud"=>$h_solicitud,
                    "f_ini"=>$f_ini,
                    "f_fin"=>$f_fin,
                    "obs"=> $obs,
                    "estado"=>$estado
                );
            }
            mysqli_stmt_close($resultado);
            return $lista;
        }else{
            mysqli_stmt_close($resultado);
            return false;
        }   
    }
   
}

?>