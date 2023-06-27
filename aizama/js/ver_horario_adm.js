var niveles;
var paralelos;
var materias;
var cursoMateria;
var codigoMaterias = [];
var arrayChecked = [];
var verTabla = false;


function mostrarTabla(codigoCurso, codigoParalelo) {
//    console.log(codigoCurso);
    $.post("horario_json.php?op=ghadm",{ccur:codigoCurso,cpar:codigoParalelo},function(respuesta){
		var jsonDataCursos = JSON.parse(respuesta);
			if (jsonDataCursos['status'] == 'ok') {
				var img = jsonDataCursos['horario'];
				document.getElementById('image').setAttribute('src', img);
			} else if ( jsonDataCursos['status'] == 'sinHorario' ) {
				Swal.fire('Horario no disponible');
			}
	});
}

function cargarParalelos() {
  $("#seleccionar_paralelo").empty();
  $("#seleccionar_paralelo").append('<option value="0"> -- Seleccionar paralelo -- </option>');
  for(var i = 0; i < paralelos.length; i++ ) {
    $("#seleccionar_paralelo").append('<option value ="'+(paralelos[i]['codpar'])+'">' + paralelos[i]['nombre'] + '</option>');
  }
}
function obtenerNivel(codigoCurso) {
    for(var i = 0; i< niveles.length; i++) {
        if(niveles[i]['codcur'] == codigoCurso) {
            return niveles[i]['nivel'];
        }
    }
    return alert('tu codigo curso esta mal');
}
function checkBox(codigoCurso, codigoParalelo, codigoMateria) {
    for(var i = 0; i<cursoMateria.length; i++ ) {
        if(cursoMateria[i]['codcur'] == codigoCurso &&
           cursoMateria[i]['codpar'] == codigoParalelo &&
           cursoMateria[i]['codmat'] == codigoMateria) {
               
               return true;
           }
    }
    return false;
}
function obtenerCurMat () {
    $.post("curso_materias_json.php",function(respuesta){
    var jsonData = JSON.parse(respuesta);
    if (jsonData['status'] == 'ok') {
        cursoMateria = jsonData['cursomaterias'];
        if(verTabla) {
            let codigoCurso = $('#seleccionar_curso').val();
            let codigoParalelo = $('#seleccionar_paralelo').val();
            mostrarTabla(codigoCurso, codigoParalelo);
        }
        
    }
    });    
}

$.post("obtener_curso_json.php?op=ca",function(respuesta){
  var jsonData = JSON.parse(respuesta);
  if (jsonData['status'] == 'ok') {
      niveles = jsonData['niveles'];
      $("#seleccionar_curso").empty();
      $("#seleccionar_curso").append('<option value="0"> -- Seleccionar curso -- </option>');
      for(var i = 0; i < niveles.length; i++ ) {
        $("#seleccionar_curso").append('<option value ="'+(niveles[i]['codcur'])+'">' + niveles[i]['nombre'] + '</option>');
      }
  }
 
  if(jsonData['status'] == 'eSession') {
    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
    return false;
  } else if (jsonData['status'] == 'noMaterias') {
      alert('Este colegio aun no tiene materias');
      
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
                for(var i = 0; i<codigoMaterias.length; i++) {
                  let codMat = codigoMaterias[i];
                  let isChecked = document.getElementById(codMat).checked;
                  let codigoCurso = document.querySelector('#seleccionar_curso').value;
                  let codigoParalelo = document.querySelector('#seleccionar_paralelo').value;
                  if(isChecked) {
                      let array = [codMat, codigoCurso, codigoParalelo, 1];
                      arrayChecked.push(array);
                  } else {
                      let array = [codMat, codigoCurso, codigoParalelo, 0];
                      arrayChecked.push(array);
                  }
               }
      
              $.ajax({
                url : 'asignar_materia_curso.php',
                data : {'datos':arrayChecked}, 
                method : 'POST', //en este caso
                success : function(response){
                    obtenerCurMat();
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


$('#formularioMaterias').on('submit', (e) => {
  e.preventDefault();
});

$(document).ready(function() {
    obtenerCurMat();
    
    
    

    $('#botonGuardar').click(function() {
      guardarCambiosMateria();
    });
    
    $("#seleccionar_curso").change(function(){
    
   let selectParalelo = document.getElementById('seleccionar_paralelo');
   
  $(".contenedor-lista").removeClass('active');
    if($("#seleccionar_curso").val()!=0 ) {
        $('#seleccionar_paralelo option[value="0"]').prop('selected', true);
        $("#seleccionar_paralelo").prop('selectedIndex', 0);
        document.getElementById('select2-seleccionar_paralelo-container').innerHTML = selectParalelo.options[0].textContent;
        cargarParalelos();
    } else {
        $("#seleccionar_paralelo").empty();
        $("#seleccionar_paralelo").append('<option value="0"> -- Seleccionar paralelo -- </option>');
    } 
});
    
    $("#seleccionar_paralelo").change(function(){
        if($("#seleccionar_paralelo").val() != 0) {
          var codigoCurso = $("#seleccionar_curso").val();
          var codigoParalelo = $("#seleccionar_paralelo").val() ;
          verTabla = true;
          mostrarTabla(codigoCurso, codigoParalelo);
        } else {
            $(".contenedor-lista").removeClass('active');
            verTabla = false;
            
        }
    
    });
    
});
