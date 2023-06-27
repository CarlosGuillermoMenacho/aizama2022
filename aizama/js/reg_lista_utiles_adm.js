/* Variables */
var listaDocentes = [];
var codigoDocente;


function listar(){
 var formData = new FormData($("#formulario")[0]);
 var html=$.ajax({
                   url:"request_lista_utiles.php?op=listar2",
                   type: "POST",
                   data: formData,
                   contentType: false,
                   processData: false,
                   async:false}).responseText;

 if(html=='eNoResult') {
 	 alert('No existe lista de utiles para este curso');
 } else {
    document.getElementById("utiles").value=html;
 }
}
function validar(){
  if($('#utiles').val()!='' && 
     $('#seleccionar_materia').val()!= 0 &&
     $('#seleccionar_curso').val()!=0) {
        return true;
  }
  return false;
}

function grabarUtiles() {
  if (validar()) {
    var formData = new FormData($("#formulario")[0]);
    var html=$.ajax({
                      url:"request_lista_utiles.php?op=grabar",
                      type: "POST",
                      data:formData,
                      contentType: false,
                      processData: false,
                      async:false}).responseText;
    if (html=='eGrabado') {
        document.querySelector('#utiles').value = '';
        $('#seleccionar_materia').val(0);
        $('#select2-seleccionar_materia-container').text('-- Seleccione una materia --');
        alert('Grabado con Exito.');
    }else{
      alert('No se grabó.');
    }
  }else{
    alert('Faltan datos.');
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

$.post("docentes_json.php",function(respuesta) {
   var response = JSON.parse(respuesta);
   if(response['status'] == 'ok') {
        listaDocentes = response['docentes'];
        cargarDocente();
   } else {
       alert('No hay docentes');
   }
});

function cargarDocente() {
    for(let i = 0; i < listaDocentes.length; i++) {
        let nombre = listaDocentes[i]['nombre'];
        let codigo = listaDocentes[i]['codigo'];
        $('#seleccionar_profesor').append(
            `<option value="${codigo}">${nombre}</option> `  
        );   
    }
}
function obtenerCursosDocentes(codigo) {
    $('#seleccionar_curso').empty();
    $("#seleccionar_curso").append('<option value ="0">-- Seleccionar curso --</option>');
    var codigoDocente = codigo
    $.post("obtener_curso_json.php?op=admcurprof&codigoDocente="+codigoDocente,function(respuesta){
        console.log(respuesta);
        var jsonDataCursos = JSON.parse(respuesta);
        if (jsonDataCursos['status'] == 'ok') {
            
            listaCursos = jsonDataCursos['cursos'];   
            for (let i = 0; i < listaCursos.length; i++) {
              var cursos = listaCursos[i]['nombre']; 
              $("#seleccionar_curso").append('<option value ="'+ (i+1) +'">' + cursos + '</option>');
          }
        }
        obtenerMateriasProfesor(codigoDocente)
        if(respuesta=='eSession') {
            alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
            return false;
        }
    }); 
}



function obtenerMateriasProfesor(codigo) {
    let codigoDocente = codigo;
    $.post("obtener_materias_json.php?op=admgetmatprof&codigoDocente="+codigoDocente,function(respuesta){
        
        var jsonDataMaterias = JSON.parse(respuesta);
        if (jsonDataMaterias['status'] == 'ok') {
            listaMaterias = jsonDataMaterias['materias'];
        }
        if(respuesta=='eSession') {
            alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
            return false;
      }
    });    
}


$(document).ready(function() { 
    $('#formulario').on('submit',function(e) {
        e.preventDefault();
    });
    $('#seleccionar_profesor').change( () => {
        $('#seleccionar_materia').val(0);
        $('#select2-seleccionar_materia-container').text('-- Seleccione una materia --');
        $('#seleccionar_curso').val(0);
        $('#select2-seleccionar_curso-container').text('-- Seleccione una curso --');
        document.getElementById("utiles").value='';
        if($('#seleccionar_profesor').val() != '' ){
            codigoDocente = $('#seleccionar_profesor').val();
            obtenerCursosDocentes(codigoDocente);
        } 
    });
    
    
    
    $('#seleccionar_curso').change(function() {
        $('#seleccionar_materia').val(0)
        $('#select2-seleccionar_materia-container').text('-- Seleccione una materia --');
        document.querySelector('#utiles').value = '';
        if( $('#seleccionar_curso').val() != 0 ) {
            var index = $('#seleccionar_curso').val();
            var curso = listaCursos[index-1]['codcur'];
            var paralelo = listaCursos[index-1]['codpar'];
            $('#codigoCurso').val(curso);
            obtenerMaterias(curso, paralelo);
            $('#slcparalelo').val(paralelo);

        }
    });
    $('#seleccionar_materia').change(function() {
        document.querySelector('#utiles').value = '';
        if( $('#seleccionar_curso').val() != 0 &&  $('#seleccionar_materia').val() != 0 ) {
            listar();
        }
    });
    $('.btn-grabar').bind('click',function(){
        grabarUtiles();
    });
    
    
});