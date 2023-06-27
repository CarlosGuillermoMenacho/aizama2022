/* Variables */
var listaCursos;
var listaMaterias;
var index; 	
var curso; 	
var paralelo;
var nivel;
var listaAlumnos;

function obtenerNotas() {
    var notaAlumnos = [];
    for(let i=0; i < listaAlumnos.length; i++) {
        let codigoAlumno = listaAlumnos[i]['codigo'];
        let nota = $('#nota'+(i+1)).val();
        let obs1 = $(`#obs_s${(i+1)}`).val();
        let nota1 = $(`#deci${(i+1)}`).val();
        let obs2 = $(`#obs_d${(i+1)}`).val();
        console.log(nota);
        let notaAlumno = { 'codigo':codigoAlumno  , 'ser':nota,'decidir':nota1,'obs1':obs1,'obs2':obs2 };
        notaAlumnos.push(notaAlumno);
    }
    return notaAlumnos;
}
function validarNotas(){
   for(let i=0; i < listaAlumnos.length; i++) {
        let nota = $('#nota'+(i+1)).val();
        let nota1 = $(`#deci${(i+1)}`).val();
        if(parseInt(nota)<0 || parseInt(nota)>10){
            $('#nota'+(i+1)).focus();
            return false;
        }
        if(parseInt(nota1)<0 || parseInt(nota1)>10){
            $(`#deci${(i+1)}`).focus();
            return false;
        }
        

    }
    return true; 
    
}
function guardarNota(nivel) {
    let nivelCurso     = nivel;
    let codigoMateria  = $('#seleccionar_materia').val();
    let notas = obtenerNotas();
    let resp = "";
    if(!validarNotas()){
        Swal.fire('Debe ingresar valores entre 0 y 10');
        return;
    }
    if(nivelCurso != '1') {
        resp =$.ajax({
                         type:"POST",
                         url:'controlador/notas_controlador.php?op=guardar_ser_decidir&usr=doc',
                         data:{
                             materia:codigoMateria,
                             lista:JSON.stringify(notas),
                             codpar:paralelo
                         },
                         async:false
                        }).responseText;
    } else {
        resp =$.ajax({
                         type:"POST",
                         url:'get_notas_ini.php?op=saveListNota',
                         data:{
                             materia:codigoMateria,
                             lista:JSON.stringify(notas),
                             codpar:paralelo
                         },
                         async:false
                        }).responseText;
    }
    if(resp.trim() == "ok") {
        alert('Notas guardadas exitosamente!');
    } else {
        console.log(resp)
        alert('Error no se pudo guardar las notas');
    }
}
function mostrarAlumnos() {
    $(".contenedor-table-general tbody").children().remove();
    $(".contenedor-table-filtrada tbody").children().remove();
	$(".contenedor-table-general").addClass('active');
	for (var i = 0; i < listaAlumnos.length; i++)  {
	    var nombre = listaAlumnos[i]['nombre'];	
	    var nota   = listaAlumnos[i]['nota'];
	    var obs_s   = listaAlumnos[i]['obs_s'];
	    var deci   = listaAlumnos[i]['deci'];
	    var obs_d   = listaAlumnos[i]['obs_d'];
	    if(nota == null) {
	        nota = '';
	    }
	    if(obs_s == null) {
	        obs_s = '';
	    }
	    if(deci == null) {
	        deci = '';
	    }
	    if(obs_d == null) {
	        obs_d = '';
	    }
	    $('#campos').append(
	        `<tr>
	            <td data-label="Nro">${(i+1)} </td>
	            <td data-label="Nombre">${nombre}</td>
	            <td data-label="NotaSer"> 
	                <input style="" id="nota${(i+1)}" type="number" placeholder="Pts" min="1" max="10" value="${nota}">
	                <input style="" id="obs_s${(i+1)}" type="text" placeholder="Obs." value="${obs_s}">
                </td>
	            <td data-label="NotaDecidir"> 
	                <input style="" id="deci${(i+1)}" type="number" placeholder="Pts" min="1" max="10" value="${deci}">
	                <input style="" id="obs_d${(i+1)}" type="text" placeholder="Obs." value="${obs_d}">
                </td>
	         </tr>`    
        );
	}
}
function mostrarAlumnos_inicial() {
	$(".contenedor-table-general").removeClass('active');
    $(".contenedor-table-general tbody").children().remove();
    $(".contenedor-table-filtrada tbody").children().remove();
	$(".contenedor-table-filtrada").addClass('active');
	for (var i = 0; i < listaAlumnos.length; i++)  {
	    var nombre = listaAlumnos[i]['nombre'];	
	    var nota   = listaAlumnos[i]['nota'];
	    if(nota == null) {
	        nota = '';
	    }
	    $('.contenedor-table-filtrada #campos').append(
	        `<tr>
	            <td data-label="Nro">${(i+1)} </td>
	            <td data-label="Nombre">${nombre}</td>
	            <div class="nota_textarea">
    	            <td data-label="Nota Literal" class="nota-literal" style="padding:24px 15px"> 
    	                <textarea id="nota${(i+1)}" placeholder="Nota Literal" rows="5" cols="30" maxlength="250" style="width:100%;" >${nota}</textarea>
                    </td>
	            </div>
	            
	         </tr>`    
        );
	}
}

function alumnos(){
    if( $('#seleccionar_materia').val() != 0 ) {
        var codMateria = $('#seleccionar_materia').val();	
    	var bim = $('#bimestre').val();
    	var html=$.ajax({
    						type:"POST",
    						url:'controlador/notas_controlador.php?op=lista&usr=doc',
    						data: { 
    								 materia:codMateria,
    								 codpar: paralelo,
    								 curso:curso,
    								 bimestre:bim
    							   },
    						async:false
    					}).responseText;
    	if(html == 'NoResult') {
            alert('No hay alumnos para este curso');
    	} else {
     	    listaAlumnos = JSON.parse(html);
    	    mostrarAlumnos();
    	}
    } else {
        $(".contenedor-table-general").removeClass('active');
		$(".contenedor-table-filtrada").removeClass('active');  
    }
	
}
function alumnos_inicial(){
    if( $('#seleccionar_materia').val() != 0 ){
        var codMateria = $('#seleccionar_materia').val();	
	    var bim = $('#bimestre').val();
    	var html=$.ajax({
						type:"POST",
						url:'get_notas_ini.php?op=lista',
						data:{
									materia:codMateria,
									curso:curso,
									codpar: paralelo,
									bimestre:bim
									}
						,async:false
					}).responseText;
		if(html == 'NoResult') {
	        alert('No hay alumnos para este curso');
	    } else {
     	    listaAlumnos = JSON.parse(html);
     	    mostrarAlumnos_inicial();
    	}
    } else {
        $(".contenedor-table-general").removeClass('active');
		$(".contenedor-table-filtrada").removeClass('active');   
    }
	
	
}

function mostrarTabla(nivel) {
	let nivelCurso = nivel;
	if (nivelCurso != '1' ) {
		alumnos();
	} else {
		alumnos_inicial();
	}
	
}
/* Otiene las materias que le pertenecen a ese profesor */
function obtenerMaterias(curso, paralelo) {
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
	
	$("#seleccionar_curso").change(function(){
		if( $('#seleccionar_curso').val() != 0 ) {
				$(".contenedor-table-general").removeClass('active');
				$(".contenedor-table-filtrada").removeClass('active');
				index 	 = $('#seleccionar_curso').val();
				curso 	 = listaCursos[index-1]['codcur'];
                paralelo = listaCursos[index-1]['codpar'];
				nivel    = listaCursos[index-1]['codniv']
                obtenerMaterias(curso, paralelo);
        } else {
            $(".contenedor-table-general").removeClass('active');
			$(".contenedor-table-filtrada").removeClass('active');
			$('#seleccionar_materia').html('<option value ="0"> -- Seleccionar materia -- </option>');
        }
	});

	$("#seleccionar_materia").change(function(){
		if( $('#seleccionar_curso').val() != 0 ) {
			$(".contenedor-table-general").removeClass('active');
			$(".contenedor-table-filtrada").removeClass('active');
			mostrarTabla(nivel);
		} 
	});
	
	$(".btn_grabarNota").click(function() {
        guardarNota(nivel);	    
	});

});