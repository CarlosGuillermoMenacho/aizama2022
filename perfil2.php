<?php $page = 'perfil'; include_once 'includes/templates/header.php' ?>

  <style>

      .videos {

          max-width:1300px;

          margin:0 auto;

          margin-bottom:25px;

          justify-content: center;

          text-align:center;

          vertical-align: 0%;

       

      }

      .videos a {

        position: relative;

        text-decoration:none;

        color:white;

        background-color:teal;

        padding:3px 30px;

        border-radius:5px;

        margin-right:10px;

        

      }

      .swal2-popup {

          width:800px;

      }

  </style>

  <main class="perfil">

    <div class="container section container-perfil">

      <h1 class="centrar-texto no-margin">Bienvenido</h1>

      <h2 class="centrar-texto no-margin">Elije tu tipo de Cuenta</h2>

      <div class="contenedor-card container-card-perfil">        

          <div class="contenido-card">

            <!--a href="aizama/mantenimiento.php"-->

                <a href="aizama/nivel.php">

              <img src="images/alumnos.svg" alt="Alumnos Aizama Ingreso" width="280" height="280">

            </a>

          </div>

          <div class="contenido-card">

            <a href="aizama/docentes.php">

              <img src="images/docentes.svg" alt="Docentes Aizama Ingreso" width="280" height="280">

            </a>

          </div>

          <div class="contenido-card">

            <a href="http://www.aizama.net/aizama/familia.php">

              <img src="images/familia.svg" alt="Familia Aizama Ingreso" width="280" height="280">

            </a>

          </div>

            <div class="contenido-card">

            <a href="http://www.aizama.net/aizama/direccion.php">

              <img src="images/director4.svg" alt="Direcci���n Aizama Ingreso" width="280" height="280">

            </a>

          </div>

          <div class="contenido-card">

            <a href="aizama/administracion.php">

              <img src="images/administracion.svg" alt="Administracion Aizama Ingreso" width="280" height="280">

            </a>

          </div>

      </div>

    </div>

  </main>

  <!--<div class="videos">

       <h2>VIDEOS TUTORIALES</h2>

        <a href="https://www.youtube.com/watch?v=q9sfXw_IOKA" target="_blank">

            Ingreso

        </a>    

        <a href="https://www.youtube.com/watch?v=-k3trZCEeQM" target="_blank">

            Registro ingreso

        </a>    

        <a href="https://www.youtube.com/watch?v=_HEIlL9ubrI" target="_blank">

            Registro salida

        </a>    

        <a href="https://www.youtube.com/watch?v=PxoMrH5IEmw" target="_blank">

            Cambiar contraseña

        </a>    

        <a href="https://www.youtube.com/watch?v=0TpdB2z22Uc" target="_blank">

            Clase en vivo

        </a>    

         <a href="https://www.youtube.com/watch?v=Rvhp20JGxKs" target="_blank">

            Examen de pr&aacute;ctica

        </a>    

         <a href="https://www.youtube.com/watch?v=NEAp32P5YMw" target="_blank">

            Mirar un video

        </a>    

         <a href="https://www.youtube.com/watch?v=LNJIGcX4vEM" target="_blank">

            Libro digital

        </a>    

        <a href="https://www.youtube.com/watch?v=A4ZWuHBi3qk" target="_blank">

            Alumno: Subir Pr&aacute;ctico 

        </a>    

          <a href="https://www.youtube.com/watch?v=F0QoPyxxi5A" target="_blank">

            Alumno: Material de apoyo

        </a>    

        

      </div>-->
  <script type="text/javascript" src="js/jquery.min.js"></script>
  <script>
      const obtener_imagen_inicio = ()=>{
    
      $.post(
      "aizama/controlador/imagen_inicio_controlador.php?usr=doc&op=obtener_imagen_inicio",
      datos=>{
        if(datos.status == "ok"){
          Swal.fire({

              /*title: 'Sweet!',

              text: 'Modal with a custom image.',*/

              imageUrl: datos.imagen,

              imageWidth: 800,

              imageHeight: 400,

              /*imageAlt: 'Custom image',*/

            })

        }
      },
      "json"
      );
      }

      document.addEventListener('DOMContentLoaded', ()=> {

        obtener_imagen_inicio();

            
      })

      

  </script>

  <script src="js/main.js" type="module"></script>

</body>

</html>