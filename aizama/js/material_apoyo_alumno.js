var materias = [];
var materialApoyo = [];

function pedirMaterialApoyo() {
  $.post("material_json.php?op=gmaalu", function(respuesta) {
    var jsonData = JSON.parse(respuesta);
    console.log(jsonData);
    if( jsonData['status'] == 'ok' ) {
      $('.contenedor-lista').addClass('active');
      materias = jsonData['materias'];
      materialApoyo = jsonData['materiales']
      for(var i=0; i< materias.length; i++) {
        var codigoMateria = materias[i]['codmat']; 
        var nombreMateria = materias[i]['nombre']; 
        var cantidadMateriales = materias[i]['materiales']; 
        var imagenMateria = materias[i]['img']; 
        
        $('.lista-materias').append(
            `<li>
                <button id="${codigoMateria}" class="info-materia" onclick="mostrarMaterias(\'${codigoMateria}'\)">
                    <div class="materia">
                        <img src="${imagenMateria}" >
                        <p>${nombreMateria}</p>
                    </div>
                    <span class="badge">${cantidadMateriales}</span>
                </button>
            </li>`
        );
      }
    } else if (jsonData['status'] == 'sinMaterias') {
        $('.boton-atras').remove();
        $('.contenedor-no-classe').addClass('active');
        
    } else if (jsonData['status'] == 'noPermitido') {
      alert('Esta permitido solo para los alumnos')
    } 
  });
}


function mostrarMaterias(codigoMateria) {
  $('#campos').children().remove();    
  $('.contenedor-lista').removeClass('active');
  $('.elija').text("elija una un material apoyo");  
  var cantidad_material = cantidadMaterial(codigoMateria);
  if(cantidad_material > 0) {
      $('.contenedor-tabla-button').addClass('active');
      var emnumeracion = 1;
      for(var i=0; i<materialApoyo.length; i++) {
        if( materialApoyo[i]['codmat'] == codigoMateria ) {
            var titulo = materialApoyo[i]['titulo'];
            var descripcion = materialApoyo[i]['descripcion'];            
            var tipoMaterial = materialApoyo[i]['tipomaterial'];
            var material = materialApoyo[i]['material'];
            switch(tipoMaterial) {
              case '1':
                $('#campos').append(
                    `<tr>
                      <td data-label="Nro" >${emnumeracion}</td>
                      <td data-label="Título" >${titulo}</td>
                      <td data-label="Descripción" >${descripcion}</td>
                      <td data-label="Ver" >
                        <a href="${material}" class="link" target="_blank">
                          <img src="images/pdf.png" height="50px" alt="icono_material">
                        <a/>
                      </td>
                    </tr>`
                );
                emnumeracion++;
                break;
              case '2':
                $('#campos').append(
                    `<tr>
                      <td data-label="Nro" >${emnumeracion}</td>
                      <td data-label="Título" >${titulo}</td>
                      <td data-label="Descripción" >${descripcion}</td>
                      <td data-label="Ver" >
                        <a href="${material}" class="link" target="_blank">
                          <img src="images/icono-docx.png" height="50px" alt="icono_material">
                        <a/>
                      </td>
                    </tr>`
                );
                emnumeracion++;
                break;
              case '3':
                $('#campos').append(
                    `<tr>
                      <td data-label="Nro" >${emnumeracion}</td>
                      <td data-label="Título" >${titulo}</td>
                      <td data-label="Descripción" >${descripcion}</td>
                      <td data-label="Ver" >
                        <a href="${material}" class="link" target="_blank">
                          <img src="images/point.png" height="50px" alt="icono_material">
                        <a/>
                      </td>
                    </tr>`
                );
                emnumeracion++;
                break;
              case '4':
                $('#campos').append(
                    `<tr>
                      <td data-label="Nro" >${emnumeracion}</td>
                      <td data-label="Título" >${titulo}</td>
                      <td data-label="Descripción" >${descripcion}</td>
                      <td data-label="Ver" >
                        <a href="${material}" class="link" target="_blank">
                          <img src="images/excel.png" height="50px" alt="icono_material">
                        <a/>
                      </td>
                    </tr>`
                );
                emnumeracion++;
                break;
              case '5':
                $('#campos').append(
                    `<tr>
                      <td data-label="Nro" >${emnumeracion}</td>
                      <td data-label="Título" >${titulo}</td>
                      <td data-label="Descripción" >${descripcion}</td>
                      <td data-label="Ver" >
                        <a href="${material}" class="link" target="_blank">
                         <img src="images/icon_video.svg" height="50px" alt="icono_material">
                        <a/>
                      </td>
                    </tr>`
                );
                emnumeracion++;
                break;
              case '6':
                $('#campos').append(
                    `<tr>
                      <td data-label="Nro" >${emnumeracion}</td>
                      <td data-label="Título" >${titulo}</td>
                      <td data-label="Descripción" >${descripcion}</td>
                      <td data-label="Ver" >
                        <a href="${material}" class="link" target="_blank">
                          <img src="images/musica.svg" height="50px" alt="icono_material">
                        <a/>
                      </td>
                    </tr>`
                );
                emnumeracion++;
                break;
              case '7':
                $('#campos').append(
                    `<tr>
                      <td data-label="Nro" >${emnumeracion}</td>
                      <td data-label="Título" >${titulo}</td>
                      <td data-label="Descripción" >${descripcion}</td>
                      <td data-label="Ver" >
                        <a href="${material}" class="link" target="_blank">
                          <img src="images/icono-docx.png" height="50px" alt="icono_material">
                        <a/>
                      </td>
                    </tr>`
                );
                emnumeracion++;
                break;
              case '8':
                $('#campos').append(
                    `<tr>
                      <td data-label="Nro" >${emnumeracion}</td>
                      <td data-label="Título" >${titulo}</td>
                      <td data-label="Descripción" >${descripcion}</td>
                      <td data-label="Ver" >
                        <a href="${material}" class="link" target="_blank">
                          <img src="images/icon-web.svg" height="50px" alt="icono_material">
                        <a/>
                      </td>
                    </tr>`
                );
                emnumeracion++;
                break;
            }            
        }
    } 
  } else {
      $('.contenedor-no-classe').addClass('active');
  }
}

function cantidadMaterial(codigoMateria) {
  for(var i=0; i<materias.length; i++) {
    if(materias[i]['codmat'] == codigoMateria) {
        return materias[i]['materiales'];
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
$(document).ready(function() {
  pedirMaterialApoyo();
});
