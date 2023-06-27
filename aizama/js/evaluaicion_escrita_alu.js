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

function verExamen(codigoExamen) {
	$.post(
			"evaluacion_escrita_json.php?op=get_eval_proceso&usr=alu",
			{id:codigoExamen},
			(datos,estado,xhr)=>{
				if(datos=="ok"){
					location.href = 'formwritetext.php';
					return;
				}
				if (datos==codigoExamen) {
					Swal.queue([{
				        title: 'Advertencia',
				        confirmButtonText: 'Si',
				        cancelButtonText: 'No',
				        showCancelButton: true,
				        text:'Tienes una evaluación ya iniciada... \n¿Deseas continuar con la evaluación?',
				        showLoaderOnConfirm: true,
				        preConfirm: () => {
				          location.href = 'formwritetext.php';
				        }
				      }]);
				}
				if (datos=="sinproceso") {
					Swal.queue([{
				        title: 'Advertencia',
				        confirmButtonText: 'Si',
				        cancelButtonText: 'No',
				        showCancelButton: true,
				        text:'Una vez ingreses debes terminar la evaluación...',
				        showLoaderOnConfirm: true,
				        preConfirm: () => {
				        	$.post(
				        			"evaluacion_escrita_json.php?op=init_eval&usr=alu",
				        			{id:codigoExamen},
				        			(datos,estado,xhr)=>{
				        				if(datos=="ok"){
				        					location.href = 'formwritetext.php';
                          return;
				        				}
                        if (datos=="evalFinalized") {
                          Swal.fire({
                                    title: 'El tiempo para realizar esta evaluación ha terminado...!!!',
                                    confirmButtonText: `OK`,
                                  }).then((result) => {
                                    /* Read more about isConfirmed, isDenied below */
                                    if (result.isConfirmed) {
                                      location.href = "evaluacion_escrita_alu.php";
                                    }
                                  })
                        }
                        if (datos=="expired") {
                          Swal.fire({
                                    title: 'La evaluación ya no está disponible...!!!',
                                    confirmButtonText: `OK`,
                                  }).then((result) => {
                                    /* Read more about isConfirmed, isDenied below */
                                    if (result.isConfirmed) {
                                      location.href = "evaluacion_escrita_alu.php";
                                    }
                                  })
                        }

				        			}
				        			);
				        }
				      }]);
				}
			},
			"text"
			);
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
            var codeva = evaluaciones[i]['nro'];
            let detalle = evaluaciones[i]['detalle'];
            
            
            switch(presentado) {
                case '1':
                    $('#campos').append(
                        `<tr>
                          <td data-label="Nro" >${count}</td>
                          <td data-label="Descripcion" >${descripcion}</td>
                          <td data-label="Detalle" >${detalle}</td>
                          
                          <td data-label="Ver">Realizado</td>
                          <td data-label="Nota">${nota}</td>
                          <td data-label="Ver"><a href="verExamen.php?i=${codigoExamen}" style="text-decoration:none;color:#043c5c">Revisar</a></td>
                        </tr>`
                    );
                    
                    break;
                case '0':
                    $('#campos').append(
                        `<tr>
                          <td data-label="Nro" >${count}</td>
                          <td data-label="Descripcion">${descripcion}</td>
                          <td data-label="Detalle">${detalle}</td>
                          
                          <td data-label="Ver" >
                            <button class="link" onclick="verExamen(${codigoExamen})">
                                <img src="images/icon-examen.svg">
                            <button/>
                          </td>
                          <td data-label="Nota">Sin nota</td> 
                          <td data-label="Ver">&nbsp;</td>
                        </tr>`
                    );
                    
                    break;
                    case '2':
                    $('#campos').append(
                        `<tr>
                          <td data-label="Nro" >${count}</td>
                          <td data-label="Descripcion">${descripcion}</td>
                          <td data-label="Detalle">${detalle}</td>
                          
                          <td data-label="Ver" >
                            No disponible
                          </td>
                          <td data-label="Nota">Sin nota</td>
                          <td data-label="Ver">&nbsp;</td> 
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
  peticion.open('POST', 'evaluacion_escrita_json.php?op=get_eval_alu&usr=alu', false);
  peticion.send();
}

$(document).ready(function(e) {
  obtenerEvaluaciones();
  cargarMaterias();
});


