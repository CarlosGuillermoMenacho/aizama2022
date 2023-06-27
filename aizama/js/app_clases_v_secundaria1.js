var materias;
var clases;

$.post("programar_clase_virtual.php?op=matcvalu",function(respuesta){
  console.log(respuesta);
  
  var jsonDataMaterias = JSON.parse(respuesta);
  if (jsonDataMaterias['status'] == 'ok') {
      $('.contenedor-lista').addClass('active');
      materias= jsonDataMaterias['materias'];
      clases= jsonDataMaterias['clases'];
      
      for(var i=0; i< materias.length; i++) {
        var codigoMateria = materias[i]['codmat']; 
        var nombreMateria = materias[i]['nombre']; 
        var clasesMateria = materias[i]['clases']; 
        var imagenMateria = materias[i]['img']; 
        
        $('.lista-materias').append(
            `<li>
                <button id="${codigoMateria}" class="info-materia" onclick="mostrarTablaMateria(\'${codigoMateria}'\)">
                    <div class="materia">
                        <img src="${imagenMateria}" >
                        <p>${nombreMateria}</p>
                    </div>
                    <span class="badge">${clasesMateria}</span>
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
function mostrarTablaMateria(codigoMateria) {
    $('#campos').children().remove();    
    $('.contenedor-lista').removeClass('active');
        $('.elija').text("elija una clase");
    
    var cantidad_clase = cantidadClases(codigoMateria);
    if(cantidad_clase > 0) {
        $('.contenedor-tabla-button').addClass('active');
        for(var i=0; i<clases.length; i++) {
        if(clases[i]['codmat'] == codigoMateria ) {
            
            var emnumeracion = i+1;
            var titulo = clases[i]['titulo'];
            var descripcion = clases[i]['descripcion'];
            var Fecha = clases[i]['fecha'];
            var horaInicio = clases[i]['horaIni'];
            var horaFin = clases[i]['horaFin'];
            var link = clases[i]['link'];
            
            
            $('#campos').append(
                `
                 <tr>
                 <td data-label="Nro" >${emnumeracion}</td>
                 <td data-label="Titulo" >${titulo}</td>
                 <td data-label="Descripcion" >${descripcion}</td>
                 <td data-label="Fecha" >${Fecha}</td>
                 <td data-label="Hora-Inicio" >${horaInicio}</td>
                 <td data-label="Hora-Fin" >${horaFin}</td>
                 <td data-label="Ver" >
                    <a href="${link}" class="link" target="_blank">
                        <img src="images/ver.svg">
                    <a/>
                 </td>
                 </tr>    
                `
            )
        }
      } 
    } else {
        $('.contenedor-no-classe').addClass('active');
    }
         
}

function cantidadClases(codigoMateria) {
    for(var i=0; i<materias.length; i++) {
        if(materias[i]['codmat'] == codigoMateria) {
            return materias[i]['clases'];
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




