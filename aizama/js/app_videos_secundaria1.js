var materias;

var videos;

var nombreMateria;



$.post("videos_json.php?op=matvpalu",function(respuesta){

  console.log(respuesta);

  

  var jsonDataMaterias = JSON.parse(respuesta);

  if (jsonDataMaterias['status'] == 'ok') {

      $('.contenedor-lista').addClass('active');

      materias= jsonDataMaterias['materias'];

      videos= jsonDataMaterias['videos'];

      

      for(var i=0; i< materias.length; i++) {

        var codigoMateria = materias[i]['codmat']; 

        var nombreMateria = materias[i]['nombre']; 

        var videosMateria = materias[i]['videos']; 

        var imagenMateria = materias[i]['img']; 

        

        $('.lista-materias').append(

            `<li>

                <button id="${codigoMateria}" class="info-materia" onclick="mostrarTablaMateria(\'${codigoMateria}'\, \'${nombreMateria}'\)">

                    <div class="materia">

                        <img src="${imagenMateria}" >

                        <p>${nombreMateria}</p>

                    </div>

                    <span class="badge">${videosMateria}</span>

                </button>

            </li>`

        );

        

      }

  }

  if(jsonDataMaterias['status'] == 'eSession') {

    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');

    return false;

  } else if (jsonDataMaterias['status'] == 'noMaterias') {

      $('.boton-atras').remove();

      $('.contenedor-no-classe').addClass('active');

      

  } else if (jsonDataMaterias['status'] == 'noPermitido') {

    alert('Esta permitido solo para los alumnos')

  } 

  



});

function mostrarTablaMateria(codigoMateria, nombreMateria) {

    $('#campos').children().remove();    

    $('.contenedor-lista').removeClass('active');

        $('.elija').text(`${nombreMateria}`);

    

    var cantidad_clase = cantidadClases(codigoMateria);

    if(cantidad_clase > 0) {

        $('.contenedor-tabla-button').addClass('active');
        let contador = 1;
        for(var i=0; i<videos.length; i++) {

        if(videos[i]['codmat'] == codigoMateria ) {
            var titulo = videos[i]['titulo'];
            var descripcion = videos[i]['descripcion'];
            var link = videos[i]['link'];

            

            

            $('#campos').append(

                `

                 <tr>

                 <td data-label="Nro" >${contador}</td>

                 <td data-label="Titulo" >${titulo}</td>

                 <td data-label="Descripcion" >${descripcion}</td>

                 <td data-label="Ver" >

                    <a href="${link}" class="link" target="_blank">

                        <img src="images/ver.svg">

                    <a/>
                 </td>
                 </tr>    
                `

            )
            contador++;
        }

      } 

    } else {

        $('.contenedor-no-classe').addClass('active');

    }

         

}



function cantidadClases(codigoMateria) {

    for(var i=0; i<materias.length; i++) {

        if(materias[i]['codmat'] == codigoMateria) {

            return materias[i]['videos'];

        }

    }

    return 0;

}



function volverAtras() {

    $('.elija').text("elija una materia");

    $('.contenedor-tabla-button').removeClass('active');

    $('.contenedor-lista').addClass('active');

    $('.contenedor-no-classe').removeClass('active');

}









