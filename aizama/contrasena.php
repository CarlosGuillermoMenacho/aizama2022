<?php

session_start();

require 'includes/config.php';

require 'includes/functions.php';



//if(isset($_POST['vf_usuario']) && isset($_POST['vf_clave']))

if(isset($_POST['vf_clave']))

{

//  $db = odbc_connect(ODBC_NAME, ODBC_USER, ODBC_PASSWD, SQL_CUR_USE_ODBC) or die ('Error al intentar conectar con el servidor.');

	$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

/*	if (!$db) {

    	die("Hola Fallado JWRA " . mysqli_connect_error());

	}

	echo "Coneccion BUENA.";

*/

  $vUsuario = strtoupper($_SESSION['usuario']);

//  $vClave   = strtoupper($_POST['vf_clave']);

  $vClave   = $_POST['vf_clave'];



//  $sql = "SELECT u.id_usr, a.paterno,a.materno,a.nombres,a.curso,a.codalu, u.password, c.nivel, u.servernt,c.codigo,u.usrimple,u.bdesktop,a.fotoperfil FROM cursos c, usr u, alumno a WHERE a.curso=c.descrip AND u.id_usr=a.codigo AND a.codalu='$vUsuario' AND u.password=$vClave";

  

$sql = "SELECT u.id_usr, a.paterno,a.materno,a.nombres,a.curso,a.codalu, u.password, c.nivel, u.servernt,c.codigo,u.usrimple,u.bdesktop,a.fotoperfil, a.cod_cur, a.cod_par FROM cursos c, usr u, alumno a WHERE a.cod_cur=c.codigo AND u.id_usr=a.codigo AND a.codalu='$vUsuario' AND u.password=$vClave";

$fp = fopen('tester.txt', 'w');

        fwrite($fp, "$fecha contraseña.php sql = $sql - \n");

        fclose($fp);

if(!empty(trim($vUsuario))&& !empty(trim($_POST['vf_clave'])))

/*ESTE IF ME PERMITE SALIR Y VOLVER A INDEX.PHP */

{

//  $result = odbc_exec($db, $sql);

  if($result = mysqli_query($db, $sql)){

      

  }else{

    /*$eError[] = 'Verifique su clave';*/

  }

//  if ($row = odbc_fetch_object($result))

  if($row = mysqli_fetch_row($result))

  {

	  $eError = array();

	  if(trim($row[5])==$vUsuario)

	  {

//		if($row->password==$vClave)

		if($row[6]==$vClave)

		{

			

			   $_SESSION['app_user_tope'] = 0;

			   $_SESSION['app_user_type'] = "est";

			   $_SESSION['bandera'] = 0;

			   $_SESSION['ubicacion'] = 0;

				$_SESSION['app_user_contador'] = 0;

			   $_SESSION['app_user_active'] = true;

			   $_SESSION['app_user_id']     = $row[0];

//			   $_SESSION['app_user_id']     = $row->id_usr;

	    	   $_SESSION['app_user_name']   = $row[3] . ' ' . $row[1] .' '. $row[2];

	    	   $_SESSION['app_docente']   = $row[3] . ' ' . $row[1] .' '. $row[2];

//			   $_SESSION['app_user_name']   = $row->nombres . $row->paterno . $row->materno;

			   $_SESSION['app_user_login']  = $row[5];

//			   $_SESSION['app_user_login']  = $row->codalu;

			   $_SESSION['app_user_nivel']  = $row[7];

//			   $_SESSION['app_user_nivel']  = $row->nivel;

	//		   $_SESSION['app_user_perfil']  = $row->perfil;

			   $_SESSION['app_user_acceso']  = $row[8];

//			   $_SESSION['app_user_acceso']  = $row->servernt;

			   $_SESSION['app_curso']= $row[4];

//			   $_SESSION['app_curso']= $row->curso;

//			   $_SESSION['app_user_curso']= $row[9];

			   $_SESSION['app_user_curso']= $row[13];

			   $_SESSION['app_user_paral']= $row[14];

//			   $_SESSION['app_user_curso']= $row->codigo;

			   $_SESSION['usrimple'] = $row[10];  // ESTO ES PARA BRINDAR ACCESO AL EXAMEN--- SI ES VERDADERO DA EXAMEN

			   $_SESSION['bdesktop'] = $row[11];  // ESTO ES PARA BRINDAR ACCESO AL BOLETIN--- SI ES VERDADERO VE EL BOLETIN

			   $_SESSION['app_user_bimestre']= 0;

			   $_SESSION['app_user_materia']= '';

			   $_SESSION['app_nom_materia']= '';

			   $_SESSION['app_user_examen']= 0;

			   $_SESSION['app_user_res']= 0;

			   $_SESSION['app_user_access'] = date("Y-n-j H:i:s");

			   $_SESSION['app_user_sysdat']= date("Y-n-j");

			   $_SESSION['codpre'] = 0;

			   $_SESSION['app_user_h_ini']= '';

			   $_SESSION['app_user_h_fin']= '';

			   $_SESSION['cod_examen'] = 0;

			   $_SESSION['total_preg']= 5;  // almacena la cantidad de preguntas por examen que se tomara al alumno

			   $_SESSION['foto']=$row[12];



			$hora_actual = date("H:i:s");

			$sql0logs = "INSERT INTO `logs` VALUES ('".$_SESSION['app_user_id']."','Ingreso al sistema: Contraseña Correcta: ".$vClave."','".$_SESSION['app_user_sysdat']."','".$hora_actual."','".$_SERVER['REMOTE_ADDR']."')";  

			$result0logs = mysqli_query($db, $sql0logs);



//			if(!$row->servernt) // si es falso se sale porque no esta al dia en sus pagos

//				echo "Paso 0";



//			if($row[8]==0) // si es falso se sale porque no esta al dia en sus pagos

			if($row[8]=='FALSO') // si es falso se sale porque no esta al dia en sus pagos

			{

				$eError[] = 'Acceso Restringido. Envie un msg de whatsapp al nro. 77344300, 72635245 o llame al 3888561 para su habilitación';

			}

			else

			{

			

//			   if(strtoupper($row->nivel)=='I') 

			   if(strtoupper($row[7])=='I') 

			   {

			 	   if(strtoupper($row[9])==3) {  // PRE-KINDER

    

    				//   header('location: menu_inicial.php');

    				header('location: informativo.php');

    				  // header('location: https://imperiopublimarket.com/index.php?option=com_gridbox&view=page&id=5');

    				   $_SESSION['app_user_perfil']  = 'INICIAL';

    				   exit();

			 	   }

			 	   else{

			 	       if(strtoupper($row[9])==4) {  // KINDER

    

        				//   header('location: menu_inicial.php');

        				header('location: informativo.php');

        				   //header('location: https://imperiopublimarket.com/index.php?option=com_gridbox&view=page&id=6');

        				   $_SESSION['app_user_perfil']  = 'INICIAL';

        				   exit();

    			 	   }

			 	   }

			   }

			   else

			   {

//					if(strtoupper($row->nivel)=='P')

					if(strtoupper($row[7])=='P')

					{

//						echo "Paso 4";

						//header('location: menu_primaria.php');

						header('location: informativo.php');

					   $_SESSION['app_user_perfil']  = 'PRIMARIA';

					   exit();

					}

					else

					{

//						if(strtoupper($row->nivel)=='S')

						if(strtoupper($row[7])=='S')

						{

						    header('location: informativo.php');

						//	header('location: menu_secundaria.php');

						   $_SESSION['app_user_perfil']  = 'SECUNDARIA';

						   exit();

						}

						else

						{

							 $eError[] = 'No existe una ventana en el sistema para este perfil de usuario. Envie un msg de whatsapp al nro. 77367545,72635245 con el nombre del alumno, y se le enviara su usuario y contraseña';

						}

					}

			   }  

			}

		}

		else

		{

			$hora_actual = date("H:i:s");

			$sql0logs = "INSERT INTO `logs` VALUES ('".$_SESSION['app_user_id']."','NO pudo ingresar al sistema: Clave incorrecta: ".$vClave."','".$_SESSION['app_user_sysdat']."','".$hora_actual."','".$_SERVER['REMOTE_ADDR']."')";  

			$result0logs = mysqli_query($db, $sql0logs);

			

			$eError[] = 'Clave incorrecta. Envie un msg de whatsapp al nro. 72635245 con el nombre del alumno, y se le enviara su usuario y contraseña';

		}    

	  }

	  else

	  {

		$hora_actual = date("H:i:s");

		$sql0logs = "INSERT INTO `logs` VALUES ('".$_SESSION['app_user_id']."','NO pudo ingresar al sistema: NO existe usuario','".$_SESSION['app_user_sysdat']."','".$hora_actual."','".$_SERVER['REMOTE_ADDR']."')";  

		$result0logs = mysqli_query($db, $sql0logs);

		$eError[] = 'Nombre de usuario incorrecto. Envie un msg de whatsapp al nro. 72635245 con el nombre del alumno, y se le enviara su usuario y contraseña';	

	  }

  }

  else

  {

		$hora_actual = date("H:i:s");

		$sql0logs = "INSERT INTO `logs` VALUES ('".$_SESSION['app_user_id']."','NO pudo ingresar al sistema: Clave NO existe: ".$vClave."','".$_SESSION['app_user_sysdat']."','".$hora_actual."','".$_SERVER['REMOTE_ADDR']."')";  

		$result0logs = mysqli_query($db, $sql0logs);

		

		$eError[] = 'Clave NO existente. Envie un msg de whatsapp al nro. 72635245 con el nombre del alumno, y se le enviara su usuario y contraseña';

  }

}

else

{

   $eError[] = 'Verifique su clave. Envie un msg de whatsapp al nro. 77367545, 72635245 con el nombre del alumno, y se le enviara su usuario y contraseña'; 

}

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

        <p style="text-align:center; font-weight:bold;">

            <?=$_SESSION['app_user_name'];?>

        </p>

        <p style="text-align:center; font-weight:bold;">

          <?=$_SESSION['app_curso'];?>  

        </p>

        <label for="password" >Clave:</label>

        <input type="password" id="vf_clave" name="vf_clave" placeholder="Tu clave">

        <p style="color:red;" >

          <?php

            if(!empty($eError)){

              foreach($eError as $value)

                echo $value, '<br />';

            }

          ?>

        </p>

        <input type="button" class="btn" id="btnAceptar" value="Ingresar">

        <input type="button" class="btn" id="btnAtras" value="Salir">

      </form>

    </div>

  </main>

  <script type="text/javascript" src="js/jquery.js"></script>

  <script type="text/javascript" src="js/app_administracion.js"></script>

</body>

</html>