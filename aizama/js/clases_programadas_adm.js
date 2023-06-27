/* Variables */

var listaCursos = [];

var listaParalelos = [];

var fechaActual;







var listaCursosVirtuales = [];



/* Pedimos con los cursos */

$.post("obtener_cursos_adm.php?op=adm",function(respuestaRecibida){

  let response = JSON.parse(respuestaRecibida);

  if( response['status'] == 'ok' ) {

      listaCursos = response['cursos'];

      cargarCursos();           

  } else {

      alert('No hay cursos');

  }

});

/* Cargamos los cursos */

function cargarCursos() {

  for(let i = 0; i < listaCursos.length; i++) {

      let codigoCurso = listaCursos[i]['codigo'];

      let nombre = listaCursos[i]['nombre'];

      $('#seleccionar_curso').append(

        `<option value=${codigoCurso}>${nombre}</option>`  

      );   

  }

}

/* Pedimos los paralelo */

$.post("get_paralelos.php",function(respuesta){

  let response = JSON.parse(respuesta);

  if( response['status'] == 'ok' ) {

      listaParalelos = response['paralelos'];

  } else {

      alert('No hay paralelos');

  }

});   



/* Cargamos los paralelos */

function cargarParalelos() {

  for(let i = 0; i < listaParalelos.length; i++) {

      let codigoParalelo = listaParalelos[i]['codigo'];

      let nombre = listaParalelos[i]['nombre'];

      $('#seleccionar_paralelo').append(

        `<option value=${codigoParalelo}>${nombre}</option>`  

      );   

  }  

}



function pedirClasesVirtuales(fechaActual) {

    let formData = new FormData();

    formData.append('codcur', $('#seleccionar_curso').val());

    formData.append('codpar', $('#seleccionar_paralelo').val());

    formData.append('fecha', fechaActual);

    var peticion = new XMLHttpRequest();

    peticion.addEventListener("readystatechange", () => {

      if (peticion.readyState === 4 && peticion.status === 200){

        

        var respuesta = peticion.responseText;

        console.log(respuesta);

        var jsonData = JSON.parse(respuesta);

        if( jsonData['status'] == 'ok') {

            listaCursosVirtuales = jsonData['lista'];

            mostrarTabla();

        } else {

            alert('No hay clases para este curso');

            $('.contenedor-table-general').css("display", "none");

        }
      }

    });

    

    peticion.open("POST", "programar_clase_virtual.php?op=gcvadm", false);

    peticion.send(formData);

}



function mostrarTabla() {

    $('#campos').children().remove();

    console.log(listaCursosVirtuales);

    $('.contenedor-table-general').css("display", "block");

    for( let i = 0; i < listaCursosVirtuales.length; i++ ) {

        var titulo = listaCursosVirtuales[i]['titulo'];

        var materia = listaCursosVirtuales[i]['materia'];

        var horaInicio = listaCursosVirtuales[i]['horai'];

        var horaFin = listaCursosVirtuales[i]['horaf'];

        var profesor = listaCursosVirtuales[i]['profesor'];

        var link = listaCursosVirtuales[i]['link'];

        $('#campos').append(

          `<tr>

                <td data-label="Nro">${(i+1)} </td>

                <td data-label="Titulo">${titulo}</td>

                <td data-label="Materia">${materia}</td>

                <td data-label="Hora-Inicio">${horaInicio}</td>

                <td data-label="Hora-Fin">${horaFin}</td>

                <td data-label="Profesor">${profesor}</td>

                <td data-label="Ver">

                    <a href="${link}" target="_blank">

                        <img src="images/ver.svg" height="50px">

                    </a>

                </td>

          </tr>`  

        );

    }

    

}



function buscarClases() {

    if( $('#seleccionar_paralelo').val() != 0 && $('#seleccionar_curso').val() != 0  && $('#fecha').val() != '') {

        pedirClasesVirtuales($('#fecha').val())

    } else {

        alert('Porfavor seleccione curso, paralelo y elija fecha');

    }

}





$(document).ready(function() {



  /* Obtenemos la fecha actual de hoy dia */

  let date = new Date()

  let day = date.getDate()

  let month = date.getMonth() + 1

  let year = date.getFullYear()

  fechaActual = ''; 

  if(day < 10) {

      fechaActual = `${year}-${month}-0${day}`;

  } 

  if(month < 10) {

      fechaActual = `${year}-0${month}-${day}`;

  }

  

  else {

      fechaActual = `${year}-${month}-${day}`;

  }







  $('#seleccionar_curso').change(function() {

    if( $('#seleccionar_curso').val() != 0 ) {

      $('.contenedor-table-general').css("display", "none");

      $('#seleccionar_paralelo').html("<option value=0>-- Seleccione el paralelo --</option> ");

      cargarParalelos();

    } else {

        $('#seleccionar_paralelo').html("<option value=0>-- Seleccione el paralelo --</option> ");

        $('.contenedor-table-general').css("display", "none");

    }

    

  });



  $('#seleccionar_paralelo').change(function() {

    if( $('#seleccionar_paralelo').val() != 0  && $('#seleccionar_curso').val() != 0) {

      pedirClasesVirtuales(fechaActual);

    } else {

      

        $('.contenedor-table-general').css("display", "none");

    } 

  });

  

});







