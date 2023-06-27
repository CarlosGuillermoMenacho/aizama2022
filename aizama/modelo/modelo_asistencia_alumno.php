<?php 
	class Asistencias
	{
		private $db;
		
		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			require_once'execute_sql.php';
			require_once'../modelo/modelo_trimestre.php';
		}

		public function get_asistencias($trimestre,$codcur,$codpar,$materia){
			$tri = new Trimestre($this->db);
            $result_trimestre = $tri->get_trimestre($trimestre);
            $trim = $result_trimestre->fetch_object();
            $inicio = $trim->inicio;
            $fin = $trim->fin;
			$sql = "SELECT distinct ra.codalu,ra.codclase,ra.fecha,ra.estado 
					FROM horario_curso hc INNER JOIN registro_asistencias ra ON  
					hc.id = ra.codclase AND ra.status = 1 AND hc.estado = 1 AND hc.codmat = ? AND 
					hc.codcur = ? AND hc.codpar = ? AND ra.fecha >= ? AND ra.fecha <= ?";

			$type = "siiss";
			$params = array($materia,$codcur,$codpar,$inicio,$fin);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}

		public function get_fechas($trimestre,$codcur,$codpar,$materia){
			$tri = new Trimestre($this->db);
            $result_trimestre = $tri->get_trimestre($trimestre);
            $trim = $result_trimestre->fetch_object();
            $inicio = $trim->inicio;
            $fin = $trim->fin;
			$sql = "SELECT DISTINCT ra.codclase,ra.fecha
					FROM horario_curso hc INNER JOIN registro_asistencias ra ON  
					hc.id = ra.codclase AND ra.status = 1 AND hc.estado = 1 AND hc.codmat = ? AND 
					hc.codcur = ? AND hc.codpar = ? AND ra.fecha >= ? AND ra.fecha <= ?";
			$type = "siiss";
			$params = array($materia,$codcur,$codpar,$inicio,$fin);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_registros($trimestre,$codcur,$codpar){
			$tri = new Trimestre($this->db);	
			$result_trimestre = $tri->get_trimestre($trimestre);
            $trim = $result_trimestre->fetch_object();
            $inicio = $trim->inicio;
            $fin = $trim->fin;

            $sql = "SELECT hc.codmat,hc.dia,ra.codalu,ra.estado,ra.fecha,ra.fechaReg 
            		FROM horario_curso hc INNER JOIN registro_asistencias ra ON 
            		hc.codcur = ? AND hc.codpar = ? AND hc.estado = 1 AND hc.id = ra.codclase AND 
            		ra.fecha >= ? AND ra.fecha <= ? AND ra.status = 1";
			$type = "iiss";
			$params = array($codcur,$codpar,$inicio,$fin);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;

		}
		public function get_fechas_all($trimestre,$codcur,$codpar){
			$tri = new Trimestre($this->db);
            $result_trimestre = $tri->get_trimestre($trimestre);
            $trim = $result_trimestre->fetch_object();
            $inicio = $trim->inicio;
            $fin = $trim->fin;
			$sql = "SELECT DISTINCT ra.fecha
					FROM horario_curso hc INNER JOIN registro_asistencias ra ON  
					hc.id = ra.codclase AND ra.status = 1 AND hc.estado = 1 AND 
					hc.codcur = ? AND hc.codpar = ? AND ra.fecha >= ? AND ra.fecha <= ? ORDER BY ra.fecha ASC";
			$type = "iiss";
			$params = array($codcur,$codpar,$inicio,$fin);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
	}
?>