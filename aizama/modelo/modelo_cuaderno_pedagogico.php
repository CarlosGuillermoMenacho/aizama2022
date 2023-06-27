<?php 
	class CuadernoPedagogico
	{
		private $db;
		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			require_once'execute_sql.php';
			require_once'modelo_practico_digital.php';
			require_once'modelo_practico_web.php';
			require_once'modelo_Evaluacion.php';
			require_once'modelo_evaluacion_escrita.php';
			require_once'modelo_curso.php';
			require_once'modelo_autoevaluacion.php';
			require_once'modelo_autoevaluacion_alumno.php';
			require_once'modelo_ser_decidir.php';
			require_once'modelo_ponderacion.php';
			require_once'modelo_evaluacion_mixta.php';
			require_once'modelo_indicador.php';
		}
		
		public function get_cuaderno_pedagogico($gestion,$trimestre,$codcur,$codpar,$codmat){
			//Obteniendo la lista de alumnos del curso
		    $curso = new Curso($this->db);
		    $result_alumnos = $curso->obtener_ListaAlumnos($codcur,$codpar);

		    $lista_alumnos = array();
		    foreach ($result_alumnos as $fila) {
		    	$lista_alumnos[] = array(
		    							"codalu"=>$fila['codalu'],
		    							"nombre"=>$fila['paterno']." ".$fila['materno']." ".$fila['nombres']
		    							);
		    }
		    //Obteniendo los practicos de la materia
		    $practico_digital = new PracticoDigital($this->db);
		    
		    $anio_escolaridad = "";
		    $anio_escolaridad = $codcur == 5||$codcur == 11?"Primero":$anio_escolaridad;
		    $anio_escolaridad = $codcur == 6||$codcur == 12?"Segundo":$anio_escolaridad;
		    $anio_escolaridad = $codcur == 7||$codcur == 13?"Tercero":$anio_escolaridad;
		    $anio_escolaridad = $codcur == 8||$codcur == 14?"Cuarto":$anio_escolaridad;
		    $anio_escolaridad = $codcur == 9||$codcur == 15?"Quinto":$anio_escolaridad;
		    $anio_escolaridad = $codcur == 10||$codcur == 16?"Sexto":$anio_escolaridad;
		    $nivel = "";

		    $nivel = $codcur > 10?"SECUNDARIA":"";
		    $nivel = $codcur < 11?"PRIMARIA":$nivel;
		    $nivel = $codcur < 5?"INICIAL":$nivel;
		    $result_practicos_digital_alumnos = $practico_digital->get_practicos_alumnos($gestion,$trimestre,$codcur,$codpar,$codmat);
		    $lista_practicos_digitales_alumnos = array();
		    while($fila = $result_practicos_digital_alumnos->fetch_object()){
		    	$lista_practicos_digitales_alumnos[] = $fila;
		    }

		    //Obteniendo todos los practicos realizados por los estudiantes
		    $result_practicos_digital = $practico_digital->get_practicos_digital($gestion,$trimestre,$codcur,$codpar,$codmat);

		    $lista_practicos_digitales = array();
		    while ($fila = $result_practicos_digital->fetch_object()) {
		    	$lista_practicos_digitales[] = $fila;
		    }
		    //Obteniendo los practicos web del curso
		    $practico_web = new PracticoWeb($this->db);
		    $result_practicos_web = $practico_web->get_practicos_web($gestion,$trimestre,$codcur,$codpar,$codmat);
		    $lista_practicos_web = array();
		    while ($fila = $result_practicos_web->fetch_object()) {
		    	$lista_practicos_web[] = $fila;
		    }
		    $total_practicos = count($lista_practicos_web) + count($lista_practicos_digitales);

		    //Obteniendo la lista de practicos web realidos por los estudiantes
		    $result_practicos_web_alumnos = $practico_web->get_practicos_web_alumnos($gestion,$trimestre,$codcur,$codpar,$codmat);
		    $lista_practicos_web_alumnos = array();
		    while ($fila = $result_practicos_web_alumnos->fetch_object()) {
		    	$lista_practicos_web_alumnos[] = $fila;
		    }
		    //Obtenindo las evaluaciones de la materia
		    $evaluacion = new Evaluacion_Seleccion($this->db);
		    $result_evaluaciones = $evaluacion->get_evaluaciones($gestion,$trimestre,$codcur,$codpar,$codmat);
		    $lista_evaluaciones_seleccion = array();
		    while ($fila = $result_evaluaciones->fetch_object()) {
		    	$lista_evaluaciones_seleccion[] = $fila;
		    }
		    //Obteniendo la lista de evaluaciones realizadas por los estudiantes
		    $result_evaluaciones_alumnos = $evaluacion->get_evaluaciones_alumnos($gestion,$trimestre,$codcur,$codpar,$codmat);
		    $lista_evaluaciones_seleccion_alumnos = array();
		    while ($fila = $result_evaluaciones_alumnos->fetch_object()) {
		    	$lista_evaluaciones_seleccion_alumnos[] = $fila;
		    }
		    //Obteniendo las evaluaciones escritas de la materia
		    $eval_escrito = new EvaluacionEscrita($this->db);
		    $result_eval_escrita = $eval_escrito->get_evaluaciones($gestion,$trimestre,$codcur,$codpar,$codmat);
		    $lista_evaluaciones_escritas = array();
		    while ($fila = $result_eval_escrita->fetch_object()) {
		    	$lista_evaluaciones_escritas[] = $fila;
		    }
		    
		    
		    //Obteniendo la lista de evaluciones escritas realizadas por los estudiantes 
		    $result_eval_escrito_alumno = $eval_escrito->get_evaluaciones_alumnos($gestion,$trimestre,$codcur,$codpar,$codmat);
		    $lista_evaluaciones_escritas_alumnos = array();
		    while ($fila = $result_eval_escrito_alumno->fetch_object()) {
		    	$lista_evaluaciones_escritas_alumnos[] = $fila;
		    }
		    //Obteniendo las evaluaciones mixtas de la materia
		    $eval_mixta = new Evaluacion_mixta($this->db);
		    $lista_eval_mixtas = $eval_mixta->EvaluacionesCursoMaterias2($codcur,$codpar,$codmat,$trimestre,$gestion);
		    //Obteniendo la lista de evaluaciones mixtas realizadas por los estudiantes
		    $result_em_alumno = $eval_mixta->get_evaluaciones_alumnos($gestion,$trimestre,$codcur,$codpar,$codmat);
		    $lista_em_alumnos = array();
		    while ($fila = $result_em_alumno->fetch_object()) {
		    	$lista_em_alumnos[] = $fila;
		    }
            //Obteniendo indicadores de las actividades
		    $Indicador = new Indicador($this->db);
		    $result_indicadores = $Indicador->get_indicadores($gestion,$trimestre,$codcur,$codpar,$codmat);
		    $indicadores = array();
		    while ($fila = $result_indicadores->fetch_object()) {
		    	$indicadores[] = $fila;
		    }
            $total_evaluaciones = count($lista_evaluaciones_escritas)+count($lista_evaluaciones_seleccion)+count($lista_eval_mixtas);
		    //Obteniendo el ser y decidir
		    $Ser_decidir = new SerDecidir($this->db);
		    $result_ser_decidir_alumnos = $Ser_decidir->get_ser_decidir_materia($gestion,$trimestre,$codmat);
		    $lista_ser_decidir_alumnos = array();
		    while ($fila = $result_ser_decidir_alumnos->fetch_object()) {
		    	$lista_ser_decidir_alumnos[] = $fila;
		    }
		    //Obteniendo la autoevaluaciones relizadas por los estudiantes
		    $autoEvalAlumno = new Autoevaluacion_alumno($this->db);
		    $result_autoeval_alumno = $autoEvalAlumno->get_autoevaluacioines($gestion,$trimestre,$codcur,$codpar,$codmat);
		    $lista_auto_eval_alumno = array();
		    while ($fila = $result_autoeval_alumno->fetch_object()) {
		    	$lista_auto_eval_alumno[] = $fila;
		    }
		    //Obteniendo las autoevaluciaones de la materia
		    $autoEval = new Autoevaluacion($this->db);
		    $result_Autoeval = $autoEval->get_auto_evaluaciones($gestion,$trimestre,$codcur,$codpar,$codmat);
		    $lista_autoevaluaciones = array();
		    while ($fila = $result_Autoeval->fetch_object()) {
		    	$lista_autoevaluaciones[] = $fila;
		    }
		    //Obteniendo la ponderacion del ser y decidir
		    $ponderacion = new Ponderacion($this->db);
		    $result_ponderacion = $ponderacion->get_ponderacion($gestion);

		    
		    $ponderaciones = $result_ponderacion->fetch_object();
		    
		    $lista_registros = array();
		    foreach ($lista_alumnos as $fila) {
		    	$codalu = $fila['codalu'];
		    	$nombre = $fila['nombre'];
		    	$lista_notas_practicos_digitales = array();
		    	foreach ($lista_practicos_digitales as $practico) {
		    		$codpractico = $practico->cod_cuest;
		    		$nota = $practico->nota;

		    		$nota_practico = $this->get_nota($codalu,$codpractico,$lista_practicos_digitales_alumnos);
		    		//$lista_notas_practicos_digitales[] = $nota_practico;
		    		$lista_notas_practicos_digitales[] = $nota_practico==""?"":round($nota_practico * $ponderaciones->hacer / $nota);
		    	}
		    	$lista_notas_practicos_web = array();
		    	foreach ($lista_practicos_web as $practicoweb) {
		    		$codprac = $practicoweb->id;
		    		$nota = $practicoweb->nota;
		    		$nota_practico = $this->get_nota_web($codalu,$codprac,$lista_practicos_web_alumnos);
		    		$lista_notas_practicos_web[] = $nota_practico==""?"":round($nota_practico * $ponderaciones->hacer / $nota);
		    	}
		    	
		    	$lista_notas_eval_seleccion = array();
		    	foreach ($lista_evaluaciones_seleccion as $fila) {
		    		$codeval = $fila->id;
		    		$nota = 100;
		    		$nota_eval = $this->get_nota_eval($codalu,$codeval,$lista_evaluaciones_seleccion_alumnos);
		    		//return $nota;
		    		$lista_notas_eval_seleccion[] = $nota_eval==""?"":round($nota_eval * $ponderaciones->saber / $nota); 
		    	}
		    	//return $lista_evaluaciones_seleccion_alumnos;
		    	$lista_notas_eval_escrito = array();
		    	foreach ($lista_evaluaciones_escritas as $eval) {
		    		$codeva = $eval->id;
		    		$nota = $eval->nota;
		    		$nota_eval = $this->get_nota_eval_escrito($codalu,$codeva,$lista_evaluaciones_escritas_alumnos);
		    		$lista_notas_eval_escrito[] = $nota_eval==""?"":round($nota_eval * $ponderaciones->saber / $nota);
		    	}
		    	$lista_notas_eval_mixta = array();
		    	
		    	foreach ($lista_eval_mixtas as $fila) {
		    		$codeva_mixta = $fila['id'];
		    		$nota = $fila['nota'];
		    		$nota_eval = $this->get_nota_eval_mixta($codalu,$codeva_mixta,$lista_em_alumnos);
		    		$lista_notas_eval_mixta[] = $nota_eval==""?"":round($nota_eval * $ponderaciones->saber / $nota);
		    		

		    	}
		    	//return $lista_auto_eval_alumno;
		    	$nota_ser_decidir = (object) $this->get_nota_ser_decidir($codalu,$lista_ser_decidir_alumnos);
		    	$nota_auto_eval = (object) $this->get_nota_autoeval($codalu,$lista_auto_eval_alumno);
		    	$promedio_hacer = $total_practicos == 0 ? 0 : $this->promedio_hacer($lista_notas_practicos_digitales,$lista_notas_practicos_web)/$total_practicos;
		    	$promedio_saber =$total_evaluaciones == 0 ? 0: $this->promedio_saber($lista_notas_eval_seleccion,$lista_notas_eval_escrito,$lista_notas_eval_mixta)/$total_evaluaciones;
                $promedio_hacer = $promedio_hacer == 0?"":round($promedio_hacer);
                $promedio_saber = $promedio_saber == 0?"":round($promedio_saber);
                $notafinal = $promedio_hacer + $promedio_saber + $nota_ser_decidir->ser+$nota_ser_decidir->decidir+$nota_auto_eval->ser+$nota_auto_eval->decidir;
		    	$notafinal = $notafinal == 0?"":$notafinal;
		    	$lista_registros[] = array(
		    								"codalu"=>$codalu,
		    								"nombre"=>$nombre,
		    								"nota_eval_seleccion"=>$lista_notas_eval_seleccion,
		    								"nota_eval_escrito"=>$lista_notas_eval_escrito,
		    								"nota_eval_mixta"=>$lista_notas_eval_mixta,
		    								"nota_practico_digital"=>$lista_notas_practicos_digitales,
		    								"nota_practicos_web"=>$lista_notas_practicos_web,
		    								"ser_decidir"=>$nota_ser_decidir,
		    								"autoeval"=>$nota_auto_eval,
		    								"promedio_hacer"=>$promedio_hacer,
		    								"promedio_saber"=>$promedio_saber,
		    								"nota_final"=>$notafinal
		    							  );

		    }
		    //return $lista_practicos_digitales_alumnos;
		    return array(
		    			"lista_notas"=>$lista_registros,
		    			"eval_seleccion"=>$lista_evaluaciones_seleccion,
		    			"eval_escrito"=>$lista_evaluaciones_escritas,
		    			"eval_mixta"=>$lista_eval_mixtas,
		    			"practico_digital"=>$lista_practicos_digitales,
		    			"indicadores"=>$indicadores,
		    			"practico_web"=>$lista_practicos_web,
		    			"anio_escolaridad"=>$anio_escolaridad,
		    			"trimestre"=>$trimestre,
		    			"nivel"=>$nivel
		    			);




		}

		function get_nota($codalu,$codpractico,$lista_practicos_digitales_alumnos){
			for ($i=0; $i < count($lista_practicos_digitales_alumnos); $i++) { 
				if($lista_practicos_digitales_alumnos[$i]->cod_cuest==$codpractico&&$lista_practicos_digitales_alumnos[$i]->codalumno==$codalu){
					return $lista_practicos_digitales_alumnos[$i]->nota;
				}
			}
			return "";
		}

		function get_nota_web($codalu,$codprac,$lista_practicos_web_alumnos){
			for ($i=0; $i < count($lista_practicos_web_alumnos); $i++) { 
				if($lista_practicos_web_alumnos[$i]->codpractweb==$codprac&&$lista_practicos_web_alumnos[$i]->codalumno==$codalu){
					return $lista_practicos_web_alumnos[$i]->nota;
				}
			}
			return "";
		}

		function get_nota_eval($codalu,$codeval,$lista_evaluaciones_seleccion_alumnos){
			for ($i=0; $i < count($lista_evaluaciones_seleccion_alumnos); $i++) { 
				if($lista_evaluaciones_seleccion_alumnos[$i]->codexa==$codeval&&$lista_evaluaciones_seleccion_alumnos[$i]->codigo==$codalu){
					return $lista_evaluaciones_seleccion_alumnos[$i]->nota;
				}
			}
			return "";
		}

		function get_nota_eval_escrito($codalu,$codeva,$lista_evaluaciones_escritas_alumnos){
			for ($i=0; $i < count($lista_evaluaciones_escritas_alumnos); $i++) { 
				if($lista_evaluaciones_escritas_alumnos[$i]->codeva==$codeva&&$lista_evaluaciones_escritas_alumnos[$i]->codalu==$codalu){
					return $lista_evaluaciones_escritas_alumnos[$i]->nota;
				}
			}
			return "";
		}
		function get_nota_eval_mixta($codalu,$codeva,$lista_emixta_alumnos){
			for ($i=0; $i < count($lista_emixta_alumnos); $i++) { 
				if($lista_emixta_alumnos[$i]->codeva==$codeva&&$lista_emixta_alumnos[$i]->codalu==$codalu){
					return $lista_emixta_alumnos[$i]->notafinal;
				}
			}
			return "";
		}

		function get_nota_ser_decidir($codalu,$lista_ser_decidir_alumnos){
			for ($i=0; $i < count($lista_ser_decidir_alumnos); $i++) { 
				if($lista_ser_decidir_alumnos[$i]->codalu==$codalu){
					return $lista_ser_decidir_alumnos[$i];
				}
			}
			return array("ser"=>"","decidir"=>"");
		}

		function get_nota_autoeval($codal,$lista_auto_eval_alumno){
			for ($i=0; $i < count($lista_auto_eval_alumno); $i++) { 
				if($lista_auto_eval_alumno[$i]->codalu==$codal){
					return $lista_auto_eval_alumno[$i];
				}
			}
			return array("ser"=>"","decidir"=>"");
		}

		function promedio_hacer($lista_notas_practicos_digitales,$lista_notas_practicos_web){
			$nota = 0;
			$cont = 0;
			foreach ($lista_notas_practicos_digitales as $fila) {
				if(!empty($fila)){
					$nota = $nota + $fila;
					$cont++;
				}
				
			}
			foreach ($lista_notas_practicos_web as $fila) {
				if(!empty($fila)){
					$nota = $nota + $fila;
					$cont++;
				}
			}
			
			return $nota==0?0:round($nota);
		}

		function promedio_saber($lista_notas_eval_seleccion,$lista_notas_eval_escrito,$lista_notas_eval_mixta){
			$nota = 0;
			$cont = 0;
			foreach ($lista_notas_eval_seleccion as $fila) {
				if(!empty($fila)){
					$nota = $nota + $fila;
					$cont++;
				}
			}
			foreach ($lista_notas_eval_escrito as $fila) {
				if(!empty($fila)){
					$nota = $nota + $fila;
					$cont++;
				}
			}
			foreach ($lista_notas_eval_mixta as $fila) {
				if(!empty($fila)){
					$nota = $nota + $fila;
					$cont++;
				}
			}
			

			return $nota==0?0:round($nota);
		}
		function get_all($gestion,$trimestre){
			$consulta ="SELECT DISTINCT a.cod_cur,a.cod_par,cm.cod_mat FROM alumno a INNER JOIN cur_mat cm ON a.cod_cur > 4 AND a.cod_cur = cm.cod_cur AND a.cod_par = cm.cod_par AND a.estado = 1 AND cm.estado = 1";
			$type = "";
			$params = array();
			$result = ejecutar_consulta($this->db,$consulta,$type,$params);
			$response = [];
			while ($row = $result->fetch_object()) {
				$codcur = $row->cod_cur;
				$codpar = $row->cod_par;
				$codmat = $row->cod_mat;
				$cp = $this->get_cuaderno_pedagogico($gestion,$trimestre,$codcur,$codpar,$codmat);
				

				$response[] = [
					"codcur"=>$codcur,
					"codpar"=>$codpar,
					"codmat"=>$codmat,
					"cuaderno"=>$cp
				];
			}	
			return $response;
		}
		function get_cuaderno_pedagogicos_curso($gestion,$trimestre,$codcur,$codpar){
			$consulta ="SELECT DISTINCT a.cod_cur,a.cod_par,cm.cod_mat FROM alumno a INNER JOIN cur_mat cm ON a.cod_cur > 4 AND a.cod_cur = ? AND a.cod_par = ? AND a.cod_cur = cm.cod_cur AND a.cod_par = cm.cod_par AND a.estado = 1 AND cm.estado = 1 ";
			$type = "ii";
			$params = array($codcur,$codpar);
			$result = ejecutar_consulta($this->db,$consulta,$type,$params);
			$response = [];
			while ($row = $result->fetch_object()) {
				$codcur = $row->cod_cur;
				$codpar = $row->cod_par;
				$codmat = $row->cod_mat;
				$cp = $this->get_cuaderno_pedagogico($gestion,$trimestre,$codcur,$codpar,$codmat);
				

				$response[] = [
					"codcur"=>$codcur,
					"codpar"=>$codpar,
					"codmat"=>$codmat,
					"cuaderno"=>$cp
				];
			}	
			return $response;
		}
	}
?>