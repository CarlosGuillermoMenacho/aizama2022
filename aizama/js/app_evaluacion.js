/* Variables */
var materias = [];
var evaluaciones = [];

function cargarMaterias() {
  $('.contenedor-lista').addClass('active');
  for(var i=0; i< materias.length; i++) {
    var codigoMateria = materias[i]['codmat']; 
    var nombreMateria = materias[i]['nombre']; 
    var numeroEvaluaciones = materias[i]['n_eva']; 
    var imagenMateria = materias[i]['img']; 
    $('.lista-materias').append(
        `<li>
            <button id="${codigoMateria}" class="info-materia" onclick="mostrarTablaExamen(\'${codigoMateria}\')">
                <div class="materia">
                    <img src="${imagenMateria}" >
                    <p>${nombreMateria}</p>
                </div>
                <span class="badge">${numeroEvaluaciones}</span>
            </button>
        </li>`
    );
  }
}

function verExamen(codigoExamen,n_eva) {
  var html=$.ajax({type:"GET",url:'asignar_examen.php',data:{id:n_eva},async:false}).responseText;
  if(html=='eNoNumeric'){
    alert('No numerico o variable no declarada');
    return false;
  }
  if(html=='eNo1'){
    alert('No existe examen para este curso de esta materia');
    return false;
  }
  if(html=='eParamError'){
    alert('Se han enviado parametros incorrectos.');
    return false;
  }
  if(html=='eSession'){
    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
    return false;
  }
  if(html=='eHecho'){
    // se asigno la materia correctamente
    //    alert('holassss');
    location.href='advertencia.php';
    return true;
  }
  
}

function mostrarTablaExamen(codigoMateria) {

  /* Asigno la materia */
  var html=$.ajax({type:"GET",url:'asignar_materia.php',data:{id:codigoMateria},async:false}).responseText;

  var count = 0;
  var codigo_materia = codigoMateria;
  $('#campos').children().remove();    
  $('.contenedor-lista').removeClass('active');
  $('.elija').text("elija una examen");  
  var cantidad_clase = cantidadEvaluaciones(codigoMateria);
  if(cantidad_clase > 0) {
      $('.contenedor-tabla-button').addClass('active');
      var count = 1;
      for(var i=0; i<evaluaciones.length; i++) {
        if( evaluaciones[i]['codmat'] == codigoMateria ) {
            
            var codigoExamen = evaluaciones[i]['codeva'].toString();
            var fechaInicio = evaluaciones[i]['fechai']; 
            var fechaFinal = evaluaciones[i]['fechaf'];
            var descripcion = evaluaciones[i]['descripcion']; 
            var presentado = evaluaciones[i]['estado'];
            var nota = evaluaciones[i]['nota'];
            var nro = evaluaciones[i]['nro'];

            
            
            switch(presentado) {
                case '1':
                    $('#campos').append(
                        `<tr>
                          <td data-label="Nro" >${count}</td>
                          <td data-label="Descripcion" >${descripcion}</td>
                          <td data-label="Fecha Inicio" >${fechaInicio}</td>
                          <td data-label="Fecha Fin" >${fechaFinal}</td>
                          <td data-label="Ver">Realizado</td>
                          <td data-label="Nota">${nota}</td>
                        </tr>`
                    );
                    
                    break;
                case '0':
                    $('#campos').append(
                        `<tr>
                          <td data-label="Nro" >${count}</td>
                          <td data-label="Descripcion">${descripcion}</td>
                          <td data-label="Fecha Inicio">${fechaInicio}</td>
                          <td data-label="Fecha Fin">${fechaFinal}</td>
                          <td data-label="Ver" >
                            <button class="link" onclick="verExamen(${codigoExamen},${nro})">
                                <img src="images/icon-examen.svg">
                            <button/>
                          </td>
                          <td data-label="Nota">Sin nota</td> 
                        </tr>`
                    );
                    
                    break;
                    case '2':
                    $('#campos').append(
                        `<tr>
                          <td data-label="Nro" >${count}</td>
                          <td data-label="Descripcion">${descripcion}</td>
                          <td data-label="Fecha Inicio">${fechaInicio}</td>
                          <td data-label="Fecha Fin">${fechaFinal}</td>
                          <td data-label="Ver" >
                            No Disponible
                          </td>
                          <td data-label="Nota">&nbsp;</td> 
                        </tr>`
                    );
                    
                    break;
            }
            count++;
          }
        
    } 
  } else {
      $('.contenedor-no-classe').addClass('active');
  }
}
function cantidadEvaluaciones(codigoMateria) {
  for(var i=0; i<materias.length; i++) {
      if(materias[i]['codmat'] == codigoMateria) {
          return materias[i]['n_eva'];
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

function obtenerEvaluaciones() {
  var peticion =new XMLHttpRequest();
  peticion.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      var respuesta = this.responseText;
      var jsonData = JSON.parse(respuesta);
      if ( jsonData['status'] == 'ok') {
        materias = jsonData['materias'];
        evaluaciones = jsonData['evaluaciones'];
      } else if (jsonData['status'] == 'noMaterias') {
        $('.boton-atras').remove();
        $('.contenedor-no-classe').addClass('active');
      } else if (jsonData['status'] == 'noPermitido') {
        alert('Esta permitido solo para los alumnos')
      } else {
        alert('error');
      }
    }
  }
  peticion.open('POST', 'evaluaciones_json.php?op=evalu', false);
  peticion.send();
}

$(document).ready(function(e) {
  obtenerEvaluaciones();
  cargarMaterias();
});


