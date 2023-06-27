<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <title>Menú Primaria</title>
  <link rel="stylesheet" href="css/estiloDoc.css">
  <link rel="stylesheet" href="fonts/style.css">
  <script src="js/jquery.min.js"></script>
  <script src="js/main_prim2.js"></script>
</head>
<body>
<header>
    <div class="menu_bar">
      <a href="#" class="bt-menu">
        <span class="imgUser"><img src="<?=$_SESSION['foto'];?>" alt=""/></span>
        <span id="user">
          <strong>
            <?=$_SESSION['app_user_name'];?>
          </strong>
        </span>
        <div>Menú Principal<span class="icon-menu" id="btn-menu"></span></div>
      </a>
    </div>
 
    <nav>
      <ul>
        <li><a href="#" id="i_c"><span class="icon-video"></span>ver videos tutoriales</a></li>
        <li><a href="#" id="i_c"><span class="icon-mobile"></span>boletín de notas</a></li>
        
        <li><a href="#" id="salir"><span class="icon-cross"></span>Salir</a></li>
      </ul>
    </nav>
  </header>
  <section id="wraper">
    
