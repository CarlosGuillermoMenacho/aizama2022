<?php 
	class Usuario
	{
		private $db;
		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}
		public function get_data($user_id,$tipo){
			switch ($tipo) {
				case 'adm':
					$sql ="SELECT * FROM personal WHERE cod_per = ? ";
					break;
				case 'tut':
					$sql ="SELECT * FROM tutor WHERE cod_tut = ? ";	
						break;	
				case 'doc':
					$sql ="SELECT * FROM profe WHERE CODPROF = ? ";
					break;
				case 'est':
					$sql = "SELECT u.id_usr, a.paterno,a.materno,a.nombres,a.curso,a.codalu, u.password, c.nivel, u.servernt,c.codigo,c.descrip,p.descripp FROM cursos c, usr u, alumno a , paralelos p WHERE a.cod_cur=c.codigo AND u.id_usr=a.codigo AND a.codigo = ? AND a.cod_par = p.cod_par";
					//$sql ="SELECT * FROM usr u INNER JOIN alumno a ON WHERE id_usr = ? ";
					break;
				default:
					
					break;
			}
		    
			$type = "s";
			$params = array($user_id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}		
		public function delete($token){
			$sql ="DELETE FROM session WHERE token = ? ";
			$type = "s";
			$params = array($token);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_hora_periodo($nivel,$periodo){
			$sql ="SELECT * FROM periodos WHERE nivel = ? AND numero = ? AND estado = 1 ";
			$type = "ii";
			$params = array($nivel,$periodo);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
	}
?>