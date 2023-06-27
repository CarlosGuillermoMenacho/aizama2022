var niveles;
var materias;

var paralelos;
var docentes = [];
var cursos;
var gestion = $('#gestion').val();
var prof_cur_mat= [];

var cursoMateria;
var codigoMaterias = [];
var arrayChecked = [];
var verTabla = false;

function mostrarTabla(codigoDocente, codigoCurso, codigoParalelo) {
    $('.contenedor-lista ul').children().remove();
    $('.contenedor-lista').addClass('active');
    codigoMaterias = [];
    
    var nivelCurso = obtenerNivel(codigoCurso);
    
    
        for(var i = 0; i < materias.length; i++ ) {
                
            var codigoMateria = materias[i]['codmat']; 
            var nombreMateria = materias[i]['nombre'];  
            var imagenMateria = materias[i]['img']; 
            var nivelMateria = materias[i]['nivel']; 
            
            
            
            if(nivelMateria == nivelCurso ) {
                codigoMaterias.push(codigoMateria);
                
                if(checkBox(codigoDocente, codigoCurso, codigoParalelo, codigoMateria)) {
                    console.log('tambien llegue aqui');
                     $('.contenedor-lista-materias ul').append(
                        `<li>
                          <div class="contenedor-materia">
                            <div class="materia">
                              <img src="${imagenMateria}" alt="Icono Materia">
                              <h3>${nombreMateria}</h3> 
                            </div>
                            <label class="switch">
                              <input type="checkbox" checked id="${codigoMateria}" name="${codigoMateria}">
                              <span class="slider round"></span>
                            </label>
                            <input type="hidden" id="${nivelMateria}" name="${nivelMateria}" >
                          </div>
                        </li>`
                    );
                } else {
                     $('.contenedor-lista-materias ul').append(
                        `<li>
                          <div class="contenedor-materia">
                            <div class="materia">
                              <img src="${imagenMateria}" alt="Icono Materia">
                              <h3>${nombreMateria}</h3> 
                            </div>
                            <label class="switch">
                              <input type="checkbox" id="${codigoMateria}" name="${codigoMateria}">
                              <span class="slider round"></span>
                            </label>
                            <input type="hidden" id="${nivelMateria}" name="${nivelMateria}" >
                          </div>
                        </li>`
                    );
                }
            
            }
      }
}


function obtenerNivel(codigoCurso) {
    for(var i = 0; i< cursos.length; i++) {
        if(cursos[i]['codcur'] == codigoCurso) {
            return cursos[i]['nivel'];
        }
    }
    return alert('tu codigo curso esta mal');
}


function checkBox(codigoDocente, codigoCurso, codigoParalelo, codigoMateria) {
    
    for(var i = 0; i<prof_cur_mat.length; i++ ) {
        if(prof_cur_mat[i]['codprof'] == codigoDocente &&
           prof_cur_mat[i]['codcur'] == codigoCurso &&
           prof_cur_mat[i]['codpar'] == codigoParalelo &&
           prof_cur_mat[i]['codmat'] == codigoMateria) {
               return true;
           }
    }
    return false;
}

function obtenerProfCurMat() {
    $.ajax({
    url : 'profesor_curso_materia_json.php?op=pcma',
    data : {'gestion':gestion }, 
    method : 'POST', //en este caso
    success : function(response){
        var jsonData = JSON.parse(response);
        if(jsonData['status'] == 'ok')
        prof_cur_mat = jsonData['prof_cur_mat'];
        if(verTabla) {
            console.log('llegue aqui');
            let codigoCurso = $('#seleccionar_curso').val();
            let codigoParalelo = $('#seleccionar_paralelo').val();
            let codigoDocente = $('#seleccionar_docente').val();
            mostrarTabla(codigoDocente, codigoCurso, codigoParalelo);
            
        }
    },
    error: function(error){
            console.log("error");
    }
});
}

//Cargar los paralelos al select
function cargarParalelos() {
  $("#seleccionar_paralelo").empty();
  $("#seleccionar_paralelo").append('<option value="0"> -- Seleccionar paralelo -- </option>');
  for(var i = 0; i < paralelos.length; i++ ) {
    $("#seleccionar_paralelo").append('<option value ="'+(paralelos[i]['codpar'])+'">' + paralelos[i]['nombre'] + '</option>');
  }
}

//Cargar los cursos al select
function cargarCursos () {
    $('#seleccionar_curso').empty();
    $('#seleccionar_curso').append(
        `<option value = "0"> -- Seleccionar curso -- </option> `
    );
    for(var i = 0; i < cursos.length; i++) {
        let codigoCurso = cursos[i]['codcur'];
        let nombre = cursos[i]['nombre'];
         $('#seleccionar_curso').append(
        `<option value = "${codigoCurso}">${nombre}</option> `
        );
    }   
}

//Cargar los docentes al docente
$.post("docentes_json.php",function(respuesta) {
    console.log(respuesta);
    var jsonData = JSON.parse(respuesta);
      if (jsonData['status'] == 'ok') {
          docentes = jsonData['docentes'];
          $("#seleccionar_docente").empty();
          $("#seleccionar_docente").append('<option value="0"> -- Seleccionar docentes -- </option>');
          for(var i = 0; i < docentes.length; i++ ) {
            $("#seleccionar_docente").append('<option value ="'+(docentes[i]['codigo'])+'">' + docentes[i]['nombre'] + '</option>');
          }
      }
});


//obtener cursos
$.post("obtener_curso_json.php?op=ca",function(respuesta){
  var jsonData = JSON.parse(respuesta);
  if (jsonData['status'] == 'ok') {
      cursos = jsonData['niveles'];
  }
  if(jsonData['status'] == 'eSession') {
    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
    return false;
  } else if (jsonData['status'] == 'noCursos') {
      alert('Este colegio aun no tiene cursos');
      
  } else if (jsonData['status'] == 'noPermitido') {
    alert('Esta permitido para los administrador');
  } 

});



 $.post("paralelos_json.php",function(respuesta){
  var jsonData = JSON.parse(respuesta);
  if (jsonData['status'] == 'ok') {
      paralelos = jsonData['paralelos'];
     
  }
});

$.post("obtener_materias_json.php?op=ma",function(respuesta){
    var jsonData = JSON.parse(respuesta);
    if (jsonData['status'] == 'ok') {
        materias = jsonData['materias'];
    }
});

// Guardar cambios en base de datos de materias checkeadas
function guardarCambiosMateria() {
  arrayChecked = [];
    Swal.fire({
          title: 'Estas seguro',
          text: "Se actualizara los datos",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                for(var i = 0; i< codigoMaterias.length; i++) {
                  let codMat = codigoMaterias[i];
                  let isChecked = document.getElementById(codMat).checked;
                  let codigoCurso = document.querySelector('#seleccionar_curso').value;
                  let codigoParalelo = document.querySelector('#seleccionar_paralelo').value;
                  let codigoDocente = document.querySelector('#seleccionar_docente').value;
                  if(isChecked) {
                      let array = [codigoDocente, codigoCurso, codigoParalelo, codMat, 1];
                      arrayChecked.push(array);
                  } else {
                      let array = [codigoDocente, codigoCurso, codigoParalelo, codMat, 0];
                      arrayChecked.push(array);
                  }
               }
                console.log(arrayChecked);
              $.ajax({
                url : 'profesor_curso_materia_json.php?op=spcma',
                data : {'datos':arrayChecked, 'gestion':gestion}, 
                method : 'POST', //en este caso
                success : function(response){
                    if(response == 'ok') {
                        obtenerProfCurMat();
                    }
                    console.log("Success");
                },
                error: function(error){
                    console.log("error");
                }
              });
            }
            Swal.fire(
              'Actualizacion con exito',
              'Presione ok para salir',
              'success'
            );
        });
}

$(document).ready(function() {
    
    obtenerProfCurMat();
    
    $('#seleccionar_docente').change( ()=> {
       $('.contenedor-lista').removeClass('active');
           $('#seleccionar_paralelo').children().remove();
           $('#seleccionar_paralelo').append(
               `<option value = "0"> -- Seleccionar paralelo -- </option> `
           );
       if( $('#seleccionar_docente').val() != 0 ) {
           cargarCursos();
       } else {
           $('.contenedor-lista').removeClass('active');
           $('#seleccionar_curso').children().remove();
           $('#seleccionar_curso').append(
               `<option value = "0"> -- Seleccionar curso -- </option> `
           );
           $('#seleccionar_paralelo').children().remove();
           $('#seleccionar_paralelo').append(
               `<option value = "0"> -- Seleccionar paralelo -- </option> `
           );
       }
    });
    
    $('#seleccionar_curso').change( ()=> {
        if( $('#seleccionar_curso').val() != 0 ) {
           $('.contenedor-lista').removeClass('active');
           $('#seleccionar_paralelo').append(
               `<option value = "0"> -- Seleccionar paralelo -- </option> `
           );
           cargarParalelos();
       } else {
           $('.contenedor-lista').removeClass('active');
           $('#seleccionar_paralelo').children().remove();
           $('#seleccionar_paralelo').append(
               `<option value = "0"> -- Seleccionar paralelo -- </option> `
           );
       }
    });
    
    $("#seleccionar_paralelo").change(function(){
        if($("#seleccionar_paralelo").val() != 0) {
          $('.contenedor-lista').addClass('active');
          var codigoCurso = $("#seleccionar_curso").val();
          var codigoParalelo = $("#seleccionar_paralelo").val();
          var codigoDocente = $("#seleccionar_docente").val();
          verTabla = true;
          mostrarTabla(codigoDocente, codigoCurso, codigoParalelo);
        } else {
            $(".contenedor-lista").removeClass('active');
            verTabla = false;
        }
    });
    
    $('#botonGuardar').click(function() {
      guardarCambiosMateria();
    });

});
