/* Variable */

var listaCursos;
var listaMaterias;
var jsonDataListaVideos;



/* Funciones */

function  obtenerVideos () {

    var formData = new FormData($("#formulario")[0]);

    var html=$.ajax({
    url:"videos_json.php?op=vp",
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,
    async:false}).responseText;
    if (html == 'noVideos') {
        jsonDataListaVideos = '';
        $(".contenedor-table-filtrada tbody").children().remove();
        $(".contenedor-table-general tbody").children().remove();
        return false;
    } else {
        var jsonData = JSON.parse(html);
        if( jsonData['status'] == 'ok'  ) {
            jsonDataListaVideos = jsonData['videos'];
            return true;
        } else {
            jsonDataListaVideos = '';
        }
    return false;
    }

}

function mostrarDatosTabla() {

  if (obtenerVideos()) {
    $(".contenedor-table-general tbody").children().remove(); 
    $(".contenedor-table-filtrada").removeClass('active');
    var tabla = document.querySelector(".contenedor-table-general");
    tabla.classList.add("active");
    for (var i = 0; i < jsonDataListaVideos.length; i++) {
        var codigoMateria = jsonDataListaVideos[i]['codmat'];
        var dataCampoId = jsonDataListaVideos[i]['id'];
        var dataCampoTitulo = jsonDataListaVideos[i]['titulo'];
        var dataCampoDescripcion = jsonDataListaVideos[i]['descripcion'];
        var dataCampoMateria = jsonDataListaVideos[i]['materia'];
        var dataCampoLink = jsonDataListaVideos[i]['link'];



        $('#campos').append('<tr>');

        $('#campos').append('<td data-label="Nro">' + (i+1) + '</td>');

        $('#campos').append('<td data-label="Titulo">' + dataCampoTitulo + '</td>');

        $('#campos').append('<td data-label="Descripcion">' + dataCampoDescripcion + '</td>');

        $('#campos').append('<td data-label="Materia">' + dataCampoMateria + '</td>');

        

        /* Icono ver */

        $('#campos').append('<td data-label="Ver">' + '<a href="'+dataCampoLink+'" target="_blank">      <img src="images/ver.svg" alt="Icono ver" height="50px"> </a>' + '</td>');

        /* Icono editar */

        $('#campos').append('<td data-label="Editar">' + '<button onclick="editarFila(\'' + codigoMateria + '\', '+ dataCampoId+' )"> <img src="images/edit.svg" alt="Icono editar" height="50px"> </button>' + '</td>');

        /* Icono eliminar */

        $('#campos').append('<td data-label="Eliminar">' + '<button onclick="eliminarFila('+ dataCampoId +')" > <img src="images/delete.svg" alt="Icono eliminar" height="50px"> </button>' + '</td>');

        $('#campos').append('</tr>');

    }

  }else{

        Swal.fire('No existe Videos asignadas para este curso');

        $('.contenedor-table-general').removeClass('active');

        $('.contenedor-table-filtrada').removeClass('active');

  }

}



function mostrarDatosTablaFiltrada() {
  var count;
  var tabla = document.querySelector(".contenedor-table-filtrada");
    if( $('#seleccionar_materia').val() != 0 ){
      count = 1;  
      if(jsonDataListaVideos!=''){
          $(".contenedor-table-filtrada tbody").children().remove();
          $('.contenedor-table-general').removeClass('active');
          tabla.classList.add("active");
          for (var i = 0; i < jsonDataListaVideos.length; i ++) {
            if( $('#seleccionar_materia').val() == jsonDataListaVideos[i]['codmat']) {
              var codigoMateria = jsonDataListaVideos[i]['codmat'];
              var dataCampoId = jsonDataListaVideos[i]['id'];
              var dataCampoTitulo = jsonDataListaVideos[i]['titulo'];
              var dataCampoDescripcion = jsonDataListaVideos[i]['descripcion'];
              var dataCampoLink = jsonDataListaVideos[i]['link'];
              $('.contenedor-table-filtrada #campos').append('<tr>');
              $('.contenedor-table-filtrada #campos').append('<td data-label="Nro"> '+count+'</td>');
              $('.contenedor-table-filtrada #campos').append('<td data-label="Titulo">' + dataCampoTitulo + '</td>');
              $('.contenedor-table-filtrada #campos').append('<td data-label="Descripcion">' + dataCampoDescripcion + '</td>');
    
              /* Icono ver */

              $('.contenedor-table-filtrada #campos').append('<td data-label="Ver">' + '<a href="'+dataCampoLink+'" target="_blank">      <img src="images/ver.svg" alt="Icono ver" height="50px"> </a>' + '</td>');

              /* Icono editar */ 

              $('.contenedor-table-filtrada #campos').append('<td data-label="Editar">' + '<button onclick="editarFila(\'' + codigoMateria + '\', '+ dataCampoId+')"> <img src="images/edit.svg" alt="Icono editar" height="50px"> </button>' + '</td>');

              /* Icono eliminar */

              $('.contenedor-table-filtrada #campos').append('<td data-label="Eliminar">' + '<button onclick="eliminarFila('+ dataCampoId +')" > <img src="images/delete.svg" alt="Icono eliminar" height="50px"> </button>' + '</td>');

              $('.contenedor-table-filtrada #campos').append('</tr>');
              count++;
            }
          }
      } else {
          $('.contenedor-table-general').removeClass('active');
          $('.contenedor-table-filtrada').removeClass('active');
      }
    } else {
      $('.contenedor-table-filtrada').removeClass('active');
      mostrarDatosTabla();
      $('.contenedor-table-general').addClass('active'); 
    }
}





function obtenerCursos(curso, paralelo){
    $("#seleccionar_materia").empty();
    $("#seleccionar_materia").append('<option value="0"> -- Seleccionar materia -- </option>');
    for(var i = 0 ; i < listaMaterias.length; i++) {
        if(listaMaterias[i]['codcur'] == curso && listaMaterias[i]['codpar'] == paralelo){
          $("#seleccionar_materia").append('<option value ="'+(listaMaterias[i]['codmat'])+'">' + listaMaterias[i]['nombre'] + '</option>');
        }
    }   
}



function loadingData(id) {

    for(var i=0; i< jsonDataListaVideos.length; i++) {

        if(jsonDataListaVideos[i]['id'] == id )  {

            $('#titulo').val(jsonDataListaVideos[i]['titulo']); 

            $('#enlace').val(jsonDataListaVideos[i]['link']); 

            $('#descripcion').val(jsonDataListaVideos[i]['descripcion']);

            $('#id').val(id);

        }

    }

}



function validarCampos () {

    if( $('#seleccionar_curso').val() != 0 &&

        $('#seleccionar_materia').val() != 0 && 

        $('#titulo').val() != '' && 

        $('#enlace').val() != '' && 

        $('#descripcion').val() != '') {

            return true;

    }

    return false;

}



function limpiarCampos() {

    $('#titulo').val("");

    $('#enlace').val("");

    $('#descripcion').val("");

}





function asignarClase() {
    if (validarCampos()) {
        var formData = new FormData($("#formulario")[0]);
        var enviarDatos = $.ajax({
          url: 'videos_json.php?op=svp',
          type: 'POST',
          data: formData,
          contentType: false,
          processData: false,
          async: false
        }).responseText;

        if (enviarDatos == 'ok') {
            Swal.fire(
              'Asignación con éxito',
              'Presione ok para salir',
              'success'
            );
            mostrarDatosTabla();
            if($('#seleccionar_materia').val() != 0) {
              mostrarDatosTablaFiltrada();
            }
            limpiarCampos();
        } else if (enviarDatos == 'errorTime') {
          Swal.fire('Error Datos', 'Verifique la Fecha, Hora Inicio y Hora Fin', 'error');
        } else if(enviarDatos == 'enlaceNoValido'){
          $('#enlace').focus()
          Swal.fire('Error', 'El enlace ingresado no es valido', 'error');
        }
        else {
          Swal.fire('Error', 'Este horario no está disponible', 'error');
        }
    } else {
      Swal.fire('Faltan datos', 'Por favor rellene todo los campos', 'error');
    }

}



function actualizarClase() {
    if (validarCampos()) {
        Swal.fire({
          title: '¿Estás seguro?',
          text: "Se actualizará los datos",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
            if(result.isConfirmed) {
              $('#asignarMateria').css("display" ,"block");
              $('#actualizarCampos').removeClass('active');
              $('#cancelarActualizacion').removeClass('active');
              var formData = new FormData($("#formulario")[0]);
              var enviarDatos = $.ajax({
                                  url: 'videos_json.php?op=updatevp',
                                  type: 'POST',
                                  data: formData,
                                  contentType: false,
                                  processData: false,
                                  async: false
                                }).responseText;
            if (enviarDatos == 'ok') {
              if($('#seleccionar_materia').val() != 0) {
                  obtenerVideos();
                  mostrarDatosTablaFiltrada();
                  limpiarCampos();
                  $('#asignarMateria').css("display" ,"block");
                  $('#actualizarCampos').css("display", "none");
                  $('#cancelarActualizacion').css("display", "none");
                  Swal.fire(
                    'Actualización con éxito',
                    'Presione ok para salir',
                    'success'
                  );
                } 
            } else if (enviarDatos == 'errorTime') {
              Swal.fire('error');
            } else if(enviarDatos == 'enlaceNoValido'){
              $('#enlace').focus()
              $('#asignarMateria').css("display" ,"none");
              $('#actualizarCampos').css("display", "block");
              $('#cancelarActualizacion').css("display", "block");
              mostrarDatosTablaFiltrada();
              Swal.fire('Error', 'El enlace ingresado no es valido', 'error');
            } 
            else {
              Swal.fire('Error');
            }
          }
        });
    } else {
    Swal.fire('Faltan campos', 'Por favor llene todos los campos', 'error');
   }

}



/* Editar fila */

function editarFila(codigoMateria, id) {
    $('#codmat').val(codigoMateria);
    let select = document.getElementById('seleccionar_materia');
    $('#asignarMateria').css("display" ,"none");
    $('#actualizarCampos').css("display", "block");
    $('#cancelarActualizacion').css("display", "block");
    for(var i = 0 ; i < select.options.length; i++) {
        if(select.options[i].value == codigoMateria) {
          $('#seleccionar_materia option[value="'+codigoMateria+'"]').prop('selected', true);
          $("#seleccionar_materia").prop('selectedIndex', i);
          mostrarDatosTablaFiltrada();
          document.getElementById('select2-seleccionar_materia-container').innerHTML = select.options[i].textContent;
          break;
        }
    }  
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    loadingData(id);

}



function eliminarFila(id) {

    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminará la clase",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
           var enviarDatos = $.ajax({
                                    url: 'videos_json.php?op=deletevp',
                                    type: 'POST',
                                    data: "id=" + id,
                                    async: false
                                }).responseText;

        if (enviarDatos == 'ok') {
          limpiarCampos();
            if( $('#seleccionar_materia').val() == 0 ) {
              $('#asignarMateria').css("display" ,"block");
              $('#actualizarCampos').css("display", "none");
              $('#cancelarActualizacion').css("display", "none");
              
              mostrarDatosTabla();
              Swal.fire(
                'Video Eliminado',
                'Se eliminó el video',
                'success'
              )
            } else {
              $('#asignarMateria').css("display" ,"block");
              $('#actualizarCampos').css("display", "none");
              $('#cancelarActualizacion').css("display", "none");
              if(obtenerVideos()) {
                  mostrarDatosTablaFiltrada();
              } else {
                $(".contenedor-table-filtrada tbody").children().remove();
                $(".contenedor-table-general tbody").children().remove();
              }
              Swal.fire(
                'Video Eliminado',
                'Se eliminó el video',
                'success'
              )
            }      
        } else {
          Swal.fire('Error', 'No se pudo eliminar la clase', 'error');
        }
    }});

}



/* Evitar enviar informacion del formulario 

   hasta que no de el de asignar

*/

$('#formulario').on('submit', (e) => {

  e.preventDefault();

});



$.post("obtener_curso_json.php?op=cp",function(respuesta){

  var jsonDataCursos = JSON.parse(respuesta);

    if (jsonDataCursos['status'] == 'ok') {

        

        listaCursos = jsonDataCursos['cursos'];

        

        for (let i = 0; i < listaCursos.length; i++) {

          

          var cursos = listaCursos[i]['nombre']; 

          $("#seleccionar_curso").append('<option value ="'+ (i+1) +'">' + cursos + '</option>');

      }

  }



  if(respuesta=='eSession') {

    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');

    location.href ="http://www.aizama.net/aizama/docentes.php";

    return false;

  }

});

$.post("obtener_materias_json.php?op=getmatprof",function(respuesta){

  var jsonDataMaterias = JSON.parse(respuesta);

    if (jsonDataMaterias['status'] == 'ok') {

        listaMaterias = jsonDataMaterias['materias'];

  }



  if(respuesta=='eSession') {

    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');

    location.href ="http://www.aizama.net/aizama/docentes.php";

    return false;

  }

});



$(document).ready(function() {

  $('#seleccionar_curso').change(function() {
    limpiarCampos();
    $('#asignarMateria').css("display" ,"block");
    $('#actualizarCampos').css("display", "none");
    $('#cancelarActualizacion').css("display", "none");
    if( $('#seleccionar_curso').val() != 0 ) {

        var index = $('#seleccionar_curso').val();

        var curso = listaCursos[index-1]['codcur'];

        var paralelo = listaCursos[index-1]['codpar'];

        obtenerCursos(curso, paralelo);

        

        $('#codcur').val(curso);

        $('#codpar').val(paralelo);

        mostrarDatosTabla();

    } else {

        $('.contenedor-table-general').removeClass('active');

        $('.contenedor-table-filtrada').removeClass('active');

        $('#seleccionar_materia').html('<option value ="0"> -- Seleccionar materia -- </option>');

    }

    

  });

  

  $('#seleccionar_materia').change(function() {
    limpiarCampos();
    $('#asignarMateria').css("display" ,"block");
    $('#actualizarCampos').css("display", "none");
    $('#cancelarActualizacion').css("display", "none");
    if($('#seleccionar_materia').val() != 0) {
        var codigo_materia = $('#seleccionar_materia').val(); 
        $('#codmat').val(codigo_materia);
        mostrarDatosTablaFiltrada();
    } else {
        mostrarDatosTabla();
        $('#codmat').val("");
    }

  });



    $('#asignarMateria').bind('click', function () {

        if( validarCampos()) {

            asignarClase();

        } else {

            Swal.fire('Faltan Datos', 'Por favor rellene todo los campos', 'error');

        }

     

    });

    

    $('#actualizarCampos').bind('click', function () {

        if( validarCampos()) {

            actualizarClase();

        } else {

            Swal.fire('Faltan Datos', 'Por favor rellene todo los campos', 'error');

        }

    });

  

    $('#cancelarActualizacion').bind('click', function () {
      limpiarCampos();
      $('#asignarMateria').css("display" ,"block");
      $('#actualizarCampos').css("display", "none");
      $('#cancelarActualizacion').css("display", "none");

    });



});