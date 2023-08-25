<?php

use LDAP\Result;

use function PHPSTORM_META\sql_injection_subst;

    class imagen_de_inicio
    {
        private $db;
        private $imagen;
        function __construct($conexion)
        {
            //require_once("conexion.php");
            require_once'execute_sql.php';
            //$this->db = Conectar::conexion();
            $this->db = $conexion;
        }
        public function get_all()
        {
            $sql = "SELECT * FROM imagen_inicio WHERE estado = 1";
            $type = "";
            $params = array();
            $result = ejecutar_consulta($this->db,$sql,$type,$params);
            return $result;
        }
        public function get_by_id($id)
        {
            $sql = "SELECT * FROM imagen_inicio WHERE estado = 1 AND id = ?";
            $type = "i";
            $params = array($id);
            $result = ejecutar_consulta($this->db,$sql,$type,$params);
            return $result;
        }
        public function get_by_md($md)
        {
        	$f = "%$md";
            $sql = "SELECT * FROM imagen_inicio WHERE estado = 1 AND fecha_ini LIKE ?";
            $type = "s";
            $params = array($f);
            $result = ejecutar_consulta($this->db,$sql,$type,$params);
            return $result;
        }
        public function delete($id)
        {
            $sql = "UPDATE imagen_inicio SET estado = 0 WHERE id = ?";
            $type = "i";
            $params = array($id);
            $result = ejecutar_consulta($this->db,$sql,$type,$params);
            return true;
        }
        public function set_fecha($id,$fecha_ini,$fechareg,$usr)
        {
            $sql = "UPDATE imagen_inicio SET fecha_ini = ?, fechaReg = ? , usr = ? WHERE id = ?";
            $type = "sssi";
            $params = array($fecha_ini,$fechareg,$usr,$id);
            $result = ejecutar_consulta($this->db,$sql,$type,$params);
            return true;
        }
        public function set_imagen($id,$imagen)
        {
            $sql = "UPDATE imagen_inicio SET imagen = ? WHERE id = ?";
            $type = "si";
            $params = array($imagen,$id);
            $result = ejecutar_consulta($this->db,$sql,$type,$params);
            return true;
        }
        public function guardar_imagen($fecha_ini, $imagen, $usr, $fechaReg)
        {
            $sql = "INSERT INTO imagen_inicio (fecha_ini,
                                                imagen,
                                                usr,
                                                fechaReg,
                                                estado)
                    values(?,?,?,?,1)";
            $type = "ssis";
            $params = array($fecha_ini, $imagen, $usr, $fechaReg);
            $result = ejecutar_consulta($this->db,$sql,$type,$params);
            return true;
        }

        public function editar_imagen($fecha_ini,$imagen, $usr, $fechaReg)
        {   $consulta =" UPDATE imagen_inicio SET imagen = ?,
                                               fechaReg = ?,
                                                usr = ?
                            where fecha_ini = ?";
            $resultado=mysqli_prepare($this->db, $consulta);
            $ok=mysqli_stmt_bind_param($resultado,"ssis", $imagen, $fechaReg, $usr, $fecha_ini);
            $ok=mysqli_stmt_execute($resultado);
            if ($ok) {
                mysqli_stmt_close($resultado);
                return true;
            }else{
                mysqli_stmt_close($resultado);
                return false;
            }
        }

        public function eliminar_imagen($fecha_ini){
            $estado=0;
			$consulta= "UPDATE imagen_inicio set estado = ? where fecha_ini =?";
			$resultado= mysqli_prepare($this->db,$consulta);
			$ok=mysqli_stmt_bind_param($resultado,"is",$estado, $fecha_ini);
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false;	

        }

        public function obtener_imagen($fecha_ini)
        {
            $sql = "SELECT id, fecha_ini, imagen, usr, fechaReg, estado
                    FROM imagen_inicio WHERE fecha_ini=? and estado=1";
            $resultado= mysqli_prepare($this->db, $sql);
			$ok = mysqli_stmt_bind_param($resultado,"s", $fecha_ini);
			$ok = mysqli_stmt_execute($resultado);

			if ($ok) {
				$ok = mysqli_stmt_bind_result($resultado, $id, $fecha_ini, $imagen, $usr, $fechaReg, $estado);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $id,
									"fecha_ini" => $fecha_ini,
                                    "imagen" =>$imagen,
									"usr" => $usr,
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
        public function get_imagen($fecha_ini){
			$estado=1;
			$consulta= "SELECT imagen 
				   FROM imagen_inicio 
				   WHERE fecha_ini= ? and estado=?";
	
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"si", $fecha_ini, $estado);
				
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado,$imagen);
				if(mysqli_stmt_fetch($resultado)){
					return $imagen;
				}
				return false;
				mysqli_stmt_close($resultado);
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
		}

        public function obtener_imagen_inicio(){
			$estado=1;
            $fechaActual=date("Y-m-d H:i:s");
			/*$consulta= "SELECT imagen,CONCAT (MAX(DAY(fecha_ini)),'-',MAX(MONTH(fecha_ini)))AS MES
						FROM imagen_inicio
						WHERE MONTH(fecha_ini)<= MONTH(?) AND DAY(fecha_ini)<= DAY(?) and estado=?";*/
			$consulta = "SELECT imagen,dayofyear(fecha_ini) as dia FROM imagen_inicio
						WHERE MONTH(fecha_ini)<= MONTH(?) AND DAY(fecha_ini)<= DAY(?) and estado=? ORDER BY dia DESC LIMIT 1";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"ssi", $fechaActual,$fechaActual, $estado);
				
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado,$imagen,$mes);
				if(mysqli_stmt_fetch($resultado)){
					return $imagen;
				}
				return "noImage";
				mysqli_stmt_close($resultado);
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
		}

		public function get_cant_imagen($fecha_ini)
		{	$estado=1;
			$sql = "SELECT COUNT(*) as total 
					FROM imagen_inicio 
					WHERE fecha_ini=? and estado = ?"; 

			$resultado= mysqli_prepare($this->db, $sql);
			$ok = mysqli_stmt_bind_param($resultado,"si",$fecha_ini, $estado);
			$ok = mysqli_stmt_execute($resultado);

			if ($ok) {
				$ok = mysqli_stmt_bind_result($resultado, $total);
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