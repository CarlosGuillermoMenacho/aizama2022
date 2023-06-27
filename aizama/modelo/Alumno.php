<?php
  include  __DIR__ . '/../includes/functions.php';
  class Alumno {

    protected static $tabla = 'alumno';
    protected static $columnDB = ['id', 'codigo', 'codalu', 'paterno', 'materno', 'nombres', 'curso', 'clave', 'turno', 'cel1', 'cod_cur', 'cod_par', 'fotoperfil', 'estado', 'beca_id', 'direccion', 'sigla', 'nacido', 'sexo', 'credo', 'futbol', 'basquet', 'volibol', 'futsal', 'natacion', 'atletismo', 'otros', 'sangre', 'seguro', 'telseg', 'cuota', 'ncoutas', 'aporte', 'pago', 'dscto', 'fecha', 'ncomp', 'obs', 'Ffact', 'proxpago', 'codipapa', 'rude', 'ci'];
    
    public $id = null;
    /* Tabla alumno */
    public $codigo, $codalu, $paterno, $materno, $nombres, $curso, $clave, $turno, $cel1, $cod_cur, $cod_par, 
    $fotoperfil, $estado, $beca_id, $direccion, $sigla, $nacido, $sexo, $credo, $futbol, $basquet, $volibol, 
    $futsal, $natacion, $atletismo, $otros, $sangre, $seguro, $telseg, $cuota, $ncoutas, $aporte, $pago, $dscto, 
    $fecha, $ncomp, $obs, $Ffact, $proxpago, $codipapa, $rude, $ci;

    /* Tutores atributos */
    public $tutor1, $tutor2, $tutor3;
    /* Tabla usr */
    public $servernt, $usrimple, $bdesktop;

    public function __construct( $args = [] ) {
      $this->id = !empty($args['id']) ? strtoupper($args['id']) : '';
      $this->codigo = !empty($args['codigo']) ? strtoupper($args['codigo']) : '';
      $this->paterno = !empty($args['paterno']) ? strtoupper($args['paterno']) : '';
      $this->materno = !empty($args['materno']) ? strtoupper($args['materno']) : '';
      $this->nombres = !empty($args['nombres']) ? strtoupper($args['nombres']) : '';
      $this->nacido = !empty($args['nacido']) ? strtoupper($args['nacido']) : '';
      $this->codalu = !empty($this->obtenerUsuarioWeb()) ? strtoupper($this->obtenerUsuarioWeb()) : '';
      $this->curso =  '';
      $this->clave = !empty($args['ci']) ? strtoupper($args['ci']) : '';
      $this->turno = !empty($args['turno']) ? strtoupper($args['turno']) : '';
      $this->cel1 = !empty($args['cel1']) ? strtoupper($args['cel1']) : '';
      $this->cod_cur = !empty($args['cod_cur']) ? strtoupper($args['cod_cur']) : '';
      $this->cod_par = !empty($args['cod_par']) ? strtoupper($args['cod_par']) : '';
      $this->fotoperfil = ''; // Aun no se puede guardar foto
      $this->estado = !empty($args['estado']) ? strtoupper($args['estado']) : '';
      $this->beca_id =  '1';
      $this->direccion = !empty($args['direccion']) ? strtoupper($args['direccion']) : '';
      $this->sigla = !empty($this->obtenerSiglaAlumno()) ? strtoupper($this->obtenerSiglaAlumno()) : '';
      $this->sexo = !empty($args['sexo']) ? strtoupper($args['sexo']) : '';
      $this->credo =  '';
      $this->futbol = !empty($args['futbol']) ? strtoupper($args['futbol']) : '';
      $this->basquet = !empty($args['basquet']) ? strtoupper($args['basquet']) : '';
      $this->volibol = !empty($args['volibol']) ? strtoupper($args['volibol']) : '';
      $this->futsal = !empty($args['futsal']) ? strtoupper($args['futsal']) : '';
      $this->natacion = !empty($args['natacion']) ? strtoupper($args['natacion']) : '';
      $this->atletismo = !empty($args['atletismo']) ? strtoupper($args['atletismo']) : '';
      $this->otros = !empty($args['otros']) ? strtoupper($args['otros']) : '';
      $this->sangre = !empty($args['sangre']) ? strtoupper($args['sangre']) : '';
      $this->seguro = !empty($args['seguro']) ? strtoupper($args['seguro']) : '';
      $this->telseg = !empty($args['telseg']) ? strtoupper($args['telseg']) : '';
      $this->cuota = !empty($args['cuota']) ? strtoupper($args['cuota']) : '';
      $this->ncoutas = !empty($args['ncoutas']) ? strtoupper($args['ncoutas']) : '';
      $this->aporte = !empty($args['aporte']) ? strtoupper($args['aporte']) : '';
      $this->pago =  !empty($args['pago']) ? strtoupper($args['pago']) : '';
      $this->dscto = '';
      $this->fecha = !empty($args['fecha']) ? strtoupper($args['fecha']) : '';
      $this->ncomp = '';
      $this->obs = !empty($args['obs']) ? strtoupper($args['obs']) : '';
      $this->Ffact = '';
      $this->proxpago = '';
      $this->codipapa = '';
      $this->rude = !empty($args['rude']) ? strtoupper($args['rude']) : '';
      $this->ci = !empty($args['ci']) ? strtoupper($args['ci']) : '';
      $this->servernt = !empty($args['servernt']) ? strtoupper($args['servernt']) : '';
      $this->usrimple = !empty($args['usrimple']) ? strtoupper($args['usrimple']) : '';
      $this->bdesktop = !empty($args['bdesktop']) ? strtoupper($args['bdesktop']) : '';

      $this->tutor1 = !empty($args['tutor1']) ? strtoupper($args['tutor1']) : ''; 
      $this->tutor2 = !empty($args['tutor2']) ? strtoupper($args['tutor2']) : '';
      $this->tutor3 = !empty($args['tutor3']) ? strtoupper($args['tutor3']) : '';
    }

    public function update() {
      $valores =[];
      $this->codalu = $this->obtenerUsuarioWeb();
      $this->sigla = $this->obtenerSiglaAlumno();
      $atributosSanitizados = $this->sanitizarAtributo();
      $this->updateDBGlobal();
      $this->updateTableUsr();
      
      foreach ($atributosSanitizados as $key => $value) {
        $valores[] = "{$key}='{$value}'";
      }
      $query  = "UPDATE ". static::$tabla ." SET ";
      $query .= join(', ', $valores);
      $query .= " WHERE codigo='".$this->codigo."' ";
      $query .=" LIMIT 1";

      $db = connectDB();
      $db->set_charset("utf8");
      $resultado = $db->query($query);
      /* if ($this->tutor1 != "" || $this->tutor2 != "" || $this->tutor3 != "") {
        $this->agregarTutores();
      } */
      $db->close();
      return $resultado ? true : false;
    }

    public function create() {
      $idAlumnoGlobal =  $this->insertDBGlobal();
      $this->codigo = $idAlumnoGlobal;
      $this->insertInicialKardexOperativos();
      $this->insertInicialKardexAlumno($this->cuota, $this->ncoutas);
      if ( !empty($this->pago) ) {
        $recnum = $this->insertNumeroFacturaGastoOperativo();
        $this->insertKardexGastosOperativos($this->pago, $recnum);
        $this->insertLibro($this->pago, $recnum);
      }
      if ($this->insertTableUsr()) {
        $db = connectDB();
        $db->set_charset("utf8");
        $atributosSanitizados = $this->sanitizarAtributo();
        $query = "INSERT INTO ". static::$tabla ." ( ";
        $query .= join(', ', array_keys($atributosSanitizados));
        $query .= ") VALUES (' ";
        $query .= join("',   '" , array_values($atributosSanitizados));
        $query .= "')";
        $resultado = $db->query($query);
        /* if ($this->tutor1 != "" || $this->tutor2 != "" || $this->tutor3 != "") {
          $this->agregarTutores();
        } */
        return $resultado ? $this->codigo : false;
        $db->close();
      }  
    }
    
    public static function all() {
      $query = "SELECT * FROM ". static::$tabla ." WHERE estado = '1'";
      $resultado = self::consultarSQL($query);     
      return $resultado;
    }
    
    public static function delete( $id ) {
      $db = connectDB();
      $query = "UPDATE ". static::$tabla;
      $query.= " SET estado = '0' ";
      $query.= "WHERE codigo = '{$id}' LIMIT 1";
      $resultado = $db->query($query);
      $db->close();     
      return $resultado ? true : false;
    }

    public function atributos() {
      $atributos = [] ;
      foreach ( static::$columnDB as $columna ) {
        if($columna === 'id') continue;
        $atributos[$columna] = $this->$columna;
      }
      return $atributos;
    }

    public function sanitizarAtributo() {
      $db = connectDB();
      $db->set_charset("utf8");
      $sanitizado = [];
      $atributos = $this->atributos();
      foreach( $atributos as $key => $value ) {
        $sanitizado[$key] = $db->escape_string($value);
        if ($key == "turno") {
          switch ($value) {
            case '1':
              $sanitizado[$key] = "Mañana";
              break;
            case '2':
              $sanitizado[$key] = "Tarde";
              break;
            case '3':
              $sanitizado[$key] = "Noche";
              break;
            default:
              $sanitizado[$key] = "";
              break;
          }
        }
      }

      return $sanitizado;
    }



    public static function find($id) {
      $query = "SELECT * FROM ". static::$tabla ." WHERE codigo={$id}";
      $resultado = self::consultarSQL($query);
      return array_shift($resultado); 
    }

    public static function consultarSQL($query) {
      $db = connectDB();
      $db->set_charset("utf8");
      $resultado = $db->query($query);
      $array = [];
      while ($row = $resultado->fetch_assoc()) {
        $array[] = static::crearObjeto($row);
      }
      $resultado->free();
      return $array;
    }

    protected static function crearObjeto($registro) {
      $objecto = new static;
      foreach ($registro as $key => $value) {
        if (property_exists($objecto, $key) ) {
          $objecto->$key = $value;
        }
      }
      return $objecto;
    }

    public function sincronizar($args = []) {
      foreach ($args as $key => $value) {
        if(property_exists($this, $key) && !is_null($value)) {
          $this->$key = strtoupper($value);
        }
      }
    }


    /* Funciones helpers  */
    public function obtenerSiglaAlumno() {
      $sigla = "";
      if( !empty($this->paterno) && !empty($this->materno) ) {
        $sigla = "{$this->paterno[0]}{$this->materno[0]}{$this->nombres[0]}";
      } else if(!empty($this->paterno) ) {
        $sigla = "{$this->paterno[0]}{$this->nombres[0]}";
      } else if(!empty($this->paterno) ) {
        $sigla = "{$this->materno[0]}{$this->nombres[0]}";
      }
      return $sigla;
    }
    public function obtenerUsuarioWeb() {
      $usuarioWeb = "";
      if (!empty($this->nacido)) {
        $dia  = $this->nacido[8].$this->nacido[9];
        $anio  = $this->nacido[0].$this->nacido[1].$this->nacido[2].$this->nacido[3];
        $mes = $this->nacido[5].$this->nacido[6];
  
        if( !empty($this->paterno) && !empty($this->materno) ) {
          $usuarioWeb = "{$this->paterno[0]}{$this->materno[0]}{$this->nombres[0]}/{$dia}/{$mes}/{$anio}";
        } else if(!empty($this->paterno) ) {
          $usuarioWeb = "{$this->paterno[0]}{$this->nombres[0]}/{$dia}/{$mes}/{$anio}";
        } else if(!empty($this->paterno) ) {
          $usuarioWeb = "{$this->materno[0]}{$this->nombres[0]}/{$dia}/{$mes}/{$anio}";
        }
      }
      return $usuarioWeb;
    }
    public function insertDBGlobal() {
      $idAlumno = 0;
      $idColegio = 1; /* Este id es para identificar el colegio 1:Aizama, 2:Principe de Paz, 3:Comunidad Cristiana */
      $db = connectDBGlobal();
      $stmt = $db->prepare("SELECT insertaluglo(?, ?, ?, ?, ?, ?, ?, ?, ?)");
      $stmt->bind_param("issssssss", $idColegio, $this->cod_cur, $this->cod_par, $this->paterno, $this->materno, $this->nombres, $this->clave, $this->estado, $this->rude);
      $stmt->execute();
      $stmt->bind_result($idAlumno);
      $stmt->fetch();
      $stmt->close();
      $db->close();
      return $idAlumno;
    }

    public function insertTableUsr() {
      $db = connectDB();
      $db->set_charset("utf8");
      $nombre = "{$this->nombres} {$this->paterno} {$this->materno}";
      $plataforma = $this->resetValuePlataforma($this->servernt);
      $boletin = $this->resetValuePlataforma($this->bdesktop);
      $examen = $this->resetValuePlataforma($this->usrimple);
      $query = "INSERT INTO usr (id_usr, nombre_usr, login, password, servernt, usrimple, bdesktop) 
                VALUES ('{$this->codigo}', '{$nombre}', '{$this->codalu}', '{$this->clave}', '{$plataforma}', '{$examen}', '{$boletin}')";;
      $resultado = $db->query($query);
      $db->close();
      return $resultado ? true : false; 
    }

    public function insertKardexGastosOperativos($pago, $recnum) {
      $db = connectDB();
      $db->set_charset("utf8");
      $meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      $mes = date('n');
      $mes = $meses[$mes - 1];
      $anio = date('Y');
      $fecha = date("Y-m-d");
      $acreedor = intval($this->aporte) - intval($pago);
      $query = "INSERT INTO kar_gas_ope(codigo, cuota, tipo, sw, mes_pago, ano_pago, fecha, detalle, recnum, haber, acreedor, estado) 
                VALUES ('{$this->codigo}', '1', '1', 'T', '${mes}', '{$anio}', '{$fecha}', 'Pago Gasto Operativos', '{$recnum}', '{$pago}', '{$acreedor}', '1')";
      $db->query($query);
      $db->close();
    }

    public function insertLibro($pago, $nrecibo) {
      $db = connectDB();
      $db->set_charset("utf8");
      $fecha = date("Y-m-d");
      $nombre = "{$this->paterno} {$this->materno} {$this->nombres}";
      $hora = date("H-i-s");
      $query = "INSERT INTO libro(fecha, codigo, nombre, nreci, haber, debe, cambio, tipo, hora) 
                VALUES ('{$fecha}', '{$this->codigo}', '{$nombre}', '{$nrecibo}', '0.00', '{$pago}', '6.90', 'r', '{$hora}')";
      $db->query($query);
      $db->close();
    }

    public function insertNumeroFacturaGastoOperativo() {
      $nrecibo = -999;
      $db = connectDB();
      $query = "SELECT nrecibo FROM numero WHERE nfactura = '1'";
      $result = $db->query($query);
      if ($result->num_rows > 0) {
        $nrecibo = $result->fetch_object()->nrecibo;
        intval($nrecibo);
        ++$nrecibo;
        $query = "UPDATE numero SET nrecibo = '{$nrecibo}' WHERE nfactura = '1'";
        $result = $db->query($query);
        return $nrecibo;
      }
    }

    
    public function updateDBGlobal() {
      $db = connectDBGlobal();
      $query = "UPDATE alumnos ";
      $query.= "SET cod_cur = '{$this->cod_cur}', cod_par = '{$this->cod_par}', 
                paterno = '{$this->paterno}' , materno = '{$this->materno}', 
                nombres = '{$this->nombres}', rude = '{$this->rude}'";
      $query.= "WHERE codigo='{$this->codigo}'";
      $db->query($query);
      $db->close();
    }

    public function updateTableUsr() {
      $db = connectDB();
      $db->set_charset("utf8");
      $nombre = "{$this->nombres} {$this->paterno} {$this->materno}";
      $plataforma = $this->resetValuePlataforma($this->servernt);
      $boletin = $this->resetValuePlataforma($this->bdesktop);
      $examen = $this->resetValuePlataforma($this->usrimple);
      $query = "UPDATE usr ";
      $query.= "SET login = '{$this->codalu}', nombre_usr = '{$nombre}', 
                servernt = '{$plataforma}', usrimple = '{$examen}', 
                bdesktop = '{$boletin}'";
      $query.= "WHERE id_usr ='{$this->codigo}'";
      $db->query($query);
      $db->close();
    }

    public function updateKardexGastosOperativos($pago) {
      $db = connectDB();
      $db->set_charset("utf8");
      $query = "UPDATE kar_gas_ope ";
      $query.= "SET haber = '{$pago}'";
      $query.= "WHERE codigo ='{$this->codigo}'";
      $db->query($query);
      $db->close();
    }

    public function existePago() {
      $existe = false;
      $db = connectDB();
      $query = "SELECT * FROM kar_gas_ope ";
      $query.= "WHERE codigo = '{$this->codigo}'";
      if ($result =  $db->query($query)) {
        $filaEncontrada = $result->num_rows;
        $existe = $filaEncontrada > 0 ? true : false;
        return $existe;
      }
      $db->close();
      return $existe;
    }

    protected function resetValuePlataforma($value) {
      return $value == "1" ? "VERDADERO" : "FALSO";
    }

    public function insertInicialKardexOperativos() {
      $db = connectDB();
      $db->set_charset("utf8");
      $meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      $mes = date('n');
      $mes = $meses[$mes - 1];
      $anio = date('Y');
      $fecha = date("Y-m-d");
      $query = "INSERT INTO kar_gas_ope(codigo, cuota, tipo, sw, mes_pago, ano_pago, fecha, detalle, acreedor, estado) 
                VALUES ('{$this->codigo}', '0', '0', 'T', '${mes}', '{$anio}', '{$fecha}', 'Inicio de Kardex (Gasto Operativo)','250', '1')";
      $db->query($query);
      $db->close();
      
    }
    public function insertInicialKardexAlumno($cuota, $ncuotas) {
      $acreedor = intval($cuota) * intval($ncuotas); 
      $db = connectDB();
      $db->set_charset("utf8");
      $meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      $mes = date('n');
      $mes = $meses [$mes - 1];
      $anio = date('Y');
      $fecha = date("Y-m-d");
      $query = "INSERT INTO kar_alu(codigo, cuota, tipo, sw, mes_pago, ano_pago, fecha, detalle, recnum, debe, haber, deudor, acreedor, estado) 
                VALUES ('{$this->codigo}', '0', '0', 'VERDADERO', 'Ene', '{$anio}', '{$fecha}', 'Inicio de Kardex', '0', '0', '0','0', '{$acreedor}', '1')";
      $db->query($query); 
      $db->close();
      
    }

    public function agregarTutores() {
      $db = connectDB();
      $query = "SELECT * FROM alu_tut WHERE codigo='{$this->codigo}' AND estado='1' ORDER BY nro";
      $result = $db->query($query);
      $tutores = [];
      if ($result->num_rows > 0) {
        while ($row = $result->fetch_object()) {
          $tutores[] = $row;
        }
      }
      
      for ($i=0; $i < 3; $i++) {
        $tutor = "tutor".($i + 1);
        $codigoTutor = $this->$tutor;
        if ($codigoTutor != "") {
          if (isset($tutores[$i])) {
            $query = "UPDATE alu_tut SET cod_tut='{$codigoTutor}' WHERE cod_tut='{$tutores[$i]->cod_tut}' AND codigo='{$this->codigo}' AND nro='{$tutores[$i]->nro}'";
            $result = $db->query($query);
          } else {
            $query = "INSERT INTO alu_tut (codigo, cod_tut, parentesco, estado) 
                      VALUES ('{$this->codigo}', '{$codigoTutor}', 'tutor', '1')";
            $result = $db->query($query);
          }
        } else {
          $query = "UPDATE alu_tut SET estado='0' WHERE cod_tut='{$tutores[$i]->cod_tut}' AND codigo='{$this->codigo}' AND nro='{$tutores[$i]->nro}'";
          $result = $db->query($query);
        }
      }
      $db->close();
    }

  }
