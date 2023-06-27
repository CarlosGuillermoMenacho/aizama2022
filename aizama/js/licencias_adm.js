let listaAlumnosLicencias = [];

function obtenerLicencias(fecha) {
  /* Datos a enviar para obtener la licencias */
  const formData = new FormData();
  formData.append('fecha', fecha)
  /* Peticion para obtener la licencias */
  var req = new XMLHttpRequest();
  req.onreadystatechange = function (aEvt) {
  if (req.readyState == 4) {
      if(req.status == 200)
        var jsonData = JSON.parse(req.responseText);
        if( jsonData['status'] == 'ok') {
          
          listaAlumnosLicencias = jsonData['lista'];
          mostrarTabla();
          $('.contenedor-table-general').css("display", "block");
        } else if ( jsonData['status'] == 'noLicencias' ) {
          $('#campos').children().remove();
          alert('No hay licencias para esta fecha');
        }
    }
  };
  req.open('POST', 'asistencia_json.php?op=gladm', false);
  req.send(formData);
}


$(document).ready(function() {
  /* Fecha */
  let fechaActual = '';    
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  if(day < 10){
    fechaActual = `${year}-${month}-0${day}`;
  }
  if( month < 10) {
    fechaActual = `${year}-0${month}-${day}`;
  } else {
    fechaActual = `${year}-${month}-${day}`;
  }
  
  obtenerLicencias(fechaActual);

  $('#buscarLicenciaFecha').click( function () {
    if( $('#fecha').val() != '') {
      const fechaSeleccionada = $('#fecha').val();
      obtenerLicencias(fechaSeleccionada);
    } else {
      alert('Elija una fecha');
    }
  });
});

/* Funciones */
function obtenerParalelos() {
  $('#seleccionar_paralelo').children().remove();
  $('#seleccionar_paralelo').append('<option value="0">-- Seleccione el paralelo --</option>')
  listaParalelos.forEach( paralelo =>  {
    const { codigo, nombre } = paralelo;
    $('#seleccionar_paralelo').append(`<option value="${codigo}">${nombre}</option>`);
  });
}

function mostrarTabla() {
  $('#campos').children().remove();
  let contador = 1;
  listaAlumnosLicencias.forEach( alumno => {
    const { nombre, curso, detalle} = alumno;
    $('#campos').append(`<tr>
      <td data-label="Nro" >${contador}</td>
      <td data-label="Nombre" >${nombre}</td>
      <td data-label="Curso" >${curso}</td>
      <td data-label="Detalle" >${detalle}</td>
    </tr>`);
    contador++;
  });
}