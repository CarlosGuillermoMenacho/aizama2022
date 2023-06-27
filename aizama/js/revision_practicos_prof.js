var listaPracticos = [];
var curso;
var paralelo;
var codigo_materia;
var listaAlumnos = [];

function guardarNotaAlumno(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Se registrara esta nota",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
      if (result.isConfirmed) {
        var http = new XMLHttpRequest();
        var url = 'practicos_json.php?op=califprac';
        var nota = document.getElementById(`${id}`).value;
        var formData = new FormData();
        formData.append('id', id);
        formData.append('nota', nota);
        http.open('POST', url, false);
        http.onreadystatechange = function() {
            if(http.readyState == 4 && http.status == 200) {
                if(http.responseText == 'ok') {
                  Swal.fire(
                    'Éxito nota registrada',
                    'Presione ok para salir',
                    'success'
                    );
                } else {
                  Swal.fire(
                    'Error',
                    'Ingrese una nota mayor a 0 y menor a 100',
                    'error'
                  );
                }
            }
        }
        http.send(formData);
      }    
  });
   
}

function volverAtras() {
    $('.contenedor-table-general').css("display", "block");
    $('.contenedor-table-filtrada').css("display", "none");
    $('.btn-atras').css("display", "none");
}

function mostrarAlumnosPracticos() {
    $('.contenedor-table-general').css("display", "none");
    $('.contenedor-table-filtrada #campos').children().remove();
    $('.contenedor-table-filtrada').css("display", "block");
    $('.btn-atras').css("display", "block");
    for(let i=0; i<listaAlumnos.length; i++) {
        var codigoAlumno = listaAlumnos[i]['codalu'];
        var nombre = listaAlumnos[i]['nombre'];
        var pdf = listaAlumnos[i]['pdf'];
        var nota = listaAlumnos[i]['nota'];
        var id = listaAlumnos[i]['id'];
        var fec = listaAlumnos[i]['fecha'];
        var hor = listaAlumnos[i]['hora'];
        
        if( pdf == '' ) {
            $('.contenedor-table-filtrada #campos').append(
              `<tr>
                <td data-label="Nro">${( i+1)}</td>
                <td class="nombreAlumno" data-label="Nombre">${nombre}</td>
                <td data-label="Pdf">No presento</td>
                <td data-label="Nota">
                    <input id="${id}" type="number" value="${nota}" style="width:70px"/>
                </td>
                <td data-label="Fecha">
                </td>
                <td data-label="Hora">
                </td>
              </tr>`  
              
            );
        } else if(pdf != '') {
            $('.contenedor-table-filtrada #campos').append(
              `<tr>
                <td data-label="Nro">${(i+1)}</td>
                <td class="nombreAlumno" data-label="Nombre">${nombre}</td>
                <td data-label="Pdf">
                    <a href="${pdf}" target="_blank">
                        <img src="images/pdf.png" height="50px">
                    </a>
                </td>
                <td data-label="Nota" style="display:flex; height:79px; align-items:center">
                    <input id="${id}" type="number" value="${nota}" style="width:50px"/>
                    <button style="background-color:teal; color:white; border-radius:5px; padding:5px 10px;" class="link" onclick="guardarNotaAlumno(${id})">
                        Grabar Nota
                    <button/>
                    
                </td>
                <td data-label="Fecha">
                    ${fec}
                </td>
                <td data-label="Hora">
                    ${hor}

                </td>
              </tr>` 
              
            );
        }
        
    }
}

function obtenerEstudiantes(idpractico) {
    var http = new XMLHttpRequest();
    var url = 'practicos_json.php?op=pracpres';
    var formData = new FormData();
    formData.append('codcur', curso);
    formData.append('codpar', paralelo);
    formData.append('codmat', codigo_materia);
    formData.append('codpractico', idpractico);
    http.open('POST', url, false);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var respuesta = http.responseText;
            var jsonData = JSON.parse(respuesta);
            if(jsonData['status'] == 'ok') {
                listaAlumnos = jsonData['lista'];
                mostrarAlumnosPracticos();
            }
            
        }
    }
    http.send(formData);
}

function mostrarPracticos( curso, paralelo, materia) {
    console.log(typeof(curso) , paralelo, materia);
    $('.contenedor-table-general').css("display", "block");
    $('#campos').children().remove();
    var count = 1;
    for(let i= 0; i < listaPracticos.length; i++) {
        let codigoCurso = listaPracticos[i]['codcur'];
        let codigoParalelo = listaPracticos[i]['codpar'];
        let codigoMateria = listaPracticos[i]['codmat'];
        if( codigoCurso == curso && codigoParalelo == paralelo && codigoMateria == materia ) {
            let descripcion = listaPracticos[i]['descripcion'];
            let id = listaPracticos[i]['id'];
            $('#campos').append(
              `<tr>
                <td data-label="Nro">${count}</td>
                <td data-label="Descripción">
                    <button onclick="obtenerEstudiantes(${id})">
                        ${descripcion}
                    </button>
                </td>
                <td data-label="Revisar">
                    <button onclick="obtenerEstudiantes(${id})">
                        <img src="images/icon-examen.svg" alt="icono" height="50px">
                    </button>
                </td>
              </tr>`  
            );
            count++;
        }
    }
}

function obtenerMaterias(curso, paralelo){
    $("#seleccionar_materia").empty();
    $("#seleccionar_materia").append('<option value="0"> -- Seleccionar materia -- </option>');
    for(var i = 0 ; i < listaMaterias.length; i++) {
        if(listaMaterias[i]['codcur'] == curso && listaMaterias[i]['codpar'] == paralelo){
          $("#seleccionar_materia").append('<option value ="'+(listaMaterias[i]['codmat'])+'">' + listaMaterias[i]['nombre'] + '</option>');
        }
    }
}


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
    alert('sistema y vuelva a ingresar con sus datos');
  }
});
$.post("obtener_materias_json.php?op=getmatprof",function(respuesta){
  var jsonDataMaterias = JSON.parse(respuesta);
    if (jsonDataMaterias['status'] == 'ok') {
        listaMaterias = jsonDataMaterias['materias'];
  }
  if(respuesta=='eSession') {
    alert('sistema y vuelva a ingresar con sus datos');
    return false;
  }
});
$.post("practicos_json.php?op=gpp",function(respuesta){
  var jsonData = JSON.parse(respuesta);
    if (jsonData['status'] == 'ok') {
        listaPracticos = jsonData['lista'];
        console.log(listaPracticos);
        
  }
  if(respuesta=='eSession') {
    alert('sistema y vuelva a ingresar con sus datos');
    return false;
  }
});



$(document).ready(function() {

  $('.btn-atras').css("display", "none");
  $('#seleccionar_curso').change(function() {
  
    if( $('#seleccionar_curso').val() != 0 ) {
        var index = $('#seleccionar_curso').val();
        curso = listaCursos[index-1]['codcur'];
        paralelo = listaCursos[index-1]['codpar'];
        obtenerMaterias(curso, paralelo);
        
        /*$('#codcur').val(curso);
        $('#codpar').val(paralelo);
        mostrarDatosTabla();*/
    } else {
        $('.contenedor-table-general').removeClass('active');
        $('.contenedor-table-filtrada').removeClass('active');
        $('#seleccionar_materia').html('<option value ="0"> -- Seleccionar materia -- </option>');
        
        
    }
    
  });
  
  $('#seleccionar_materia').change(function() {
    $('.contenedor-table-filtrada').css("display", "none");
    $('.btn-atras').css("display", "none");
    if($('#seleccionar_materia').val() != 0) {
        codigo_materia = $('#seleccionar_materia').val(); 
        mostrarPracticos(curso, paralelo, codigo_materia);
    } else {
        $('.contenedor-table-filtrada').css("display", "none");
        $('.contenedor-table-general').css("display", "none");
        $('.btn-atras').css("display", "none");
    }
  });
  
});

