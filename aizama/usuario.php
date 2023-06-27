<?php
session_start();

require 'includes/functions.php';

//if(isset($_POST['vf_usuario']) && isset($_POST['vf_clave']))

if(isset($_POST['vf_usuario']))
{
	$_SESSION['app_user_id'] = 0;
	$_SESSION['app_user_sysdat']= date("Y-n-j");

//	$db = odbc_connect(ODBC_NAME, ODBC_USER, ODBC_PASSWD, SQL_CUR_USE_ODBC) or die ('Error al intentar conectar con el servidor.');

	require 'includes/config.php';
	$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
//	$db = mysqli_connect('107.190.132.210', 'aizama_admin', 'admin160597', 'aizama_bdd_aizama') or die ('Error al intentar conectar con el servidor.');
	$vUsuario = strtoupper($_POST['vf_usuario']);
	$sql = "SELECT u.id_usr, a.paterno,a.materno,a.nombres,a.curso,a.codalu, u.password, c.nivel, u.servernt,c.codigo,c.descrip,p.descrip FROM cursos c, usr u, alumno a , paralelos p WHERE a.cod_cur=c.codigo AND u.id_usr=a.codigo AND a.codalu='$vUsuario' AND a.cod_par = p.cod_par";  
	if(trim($_POST['vf_usuario'])<>"")
	{
		$result = mysqli_query($db, $sql);
		if($row = mysqli_fetch_row($result))
		{
			$eError = array();
			if(trim($row[5])==$vUsuario)
			{
			   $_SESSION['c_curso'] = 0;  // variable para practica on line
			   $_SESSION['n_curso'] = '';  // variable para practica on line
			   $_SESSION['usuario'] = $vUsuario;
		       $_SESSION['app_user_id']     = $row[0];  // $row->id_usr;
	    	   $_SESSION['app_user_name']   = $row[3] . ' ' . $row[1] .' '. $row[2];
	    	   $_SESSION['curso'] = $row[10];
	    	   $_SESSION['app_curso']=$row[10].' - '.$row[11];
//	    	   $_SESSION['app_user_name']   = $row->nombres . $row->paterno . $row->materno;
//echo "Paso 8";
				$hora_actual = date("H:i:s");
				$detalle = 'Ingreso: Usr correcto: '.$_POST['vf_usuario'];
				$sql0logs = "INSERT INTO `logs` VALUES ('".$_SESSION['app_user_id']."','".$detalle."','".$_SESSION['app_user_sysdat']."','".$hora_actual."','".$_SERVER['REMOTE_ADDR']."')";  
				$result0logs = mysqli_query($db, $sql0logs);
				header('location: contrasena.php');
//echo "Paso 9";
			}
			else
			{
				$hora_actual = date("H:i:s");
				$detalle = 'Ingreso: Usr Incorrecto: '.$_POST['vf_usuario'];
				$sql0logs = "INSERT INTO `logs` VALUES ('".$_SESSION['app_user_id']."','".$detalle."','".$_SESSION['app_user_sysdat']."','".$hora_actual."','".$_SERVER['REMOTE_ADDR']."')";  
				$result0logs = mysqli_query($db, $sql0logs);
    			$eError[] = 'Nombre de usuario incorrecto. Envie un msg de whatsapp al nro. 77367545, 72635245 con el nombre del alumno, y se le enviara su usuario y contraseña';	
			}
		}
		else
		{
			$hora_actual = date("H:i:s");
			$detalle = 'Ingreso: Usr NO existe: '.$_POST['vf_usuario'];
			$sql0logs = "INSERT INTO `logs` VALUES ('".$_SESSION['app_user_id']."','".$detalle."','".$_SESSION['app_user_sysdat']."','".$hora_actual."','".$_SERVER['REMOTE_ADDR']."')";  
			$result0logs = mysqli_query($db, $sql0logs);
   			$eError[] = 'El usuario no existe. Envie un msg de whatsapp al nro. 77367545, 72635245 con el nombre del alumno, y se le enviara su usuario y contraseña';	
		}
	}
	else
	{
		$eError[] = 'Verifique su usuario. Envie un msg de whatsapp al nro. 77367545, 72635245 con el nombre del alumno, y se le enviara su usuario y contraseña';
	}
//echo "Paso 10";
//exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>COLEGIO AIZAMA</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />
  <link rel="stylesheet" href="css/style_login.css">
</head>
<body>
  <main class="login-user">
    <div class="contenedor-login-user">
      <form action="" method="post" id="fLogin">
        <div class="img-logo">
          <img src="images/logo.png" alt="Logotipo del Colegio">
        </div>
        <label for="nombre">Usuario:</label>
        <input type="text" id="vf_usuario" name="vf_usuario" placeholder="Tu c&oacute;digo de alumno">
        <p style="color:red;" >
            <?php
                if(!empty($eError)){
                  foreach($eError as $value)
                    echo $value, '<br />';
                }
            ?>
        </p>
        <input type="button" class="btn" id="btnAceptar" value="Ingresar">
        <input type="button" class="btn" id="btnSalir" value="Salir">
         <a href="videos_tutoriales_alumnos.php" target=_blank class="btn" style="text-decoration:none; background-color:#c4302b; padding:4px;">
            <div style="display:flex; align-items:center; justify-content:center;">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-youtube" width="44" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <rect x="3" y="5" width="18" height="14" rx="4" />
                  <path d="M10 9l5 3l-5 3z" />
                </svg> 
                <span>Ver videos</span> 
            </div>
         </a>
      </form>
    </div>
  </main>
  <script type="text/javascript" src="js/jquery.js"></script>
  <script type="text/javascript" src="js/app_administracion.js"></script>
</body>
</html>
