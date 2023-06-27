let listaCursos = [];
let listaMaterias = [];
let curso_sel = "";
let paralelo_sel = "";
const get_cursos_prof = ()=>{
	$.post("obtener_curso_json.php?op=cp",function(respuesta){
	  var jsonDataCursos = JSON.parse(respuesta);
		if (jsonDataCursos['status'] == 'ok') {     
				listaCursos = jsonDataCursos['cursos'];
				for (let i = 0; i < listaCursos.length; i++) {    
					var cursos = listaCursos[i]['nombre']; 
					$("#seleccionar_curso").append('<option value ="'+ (i+1) +'">' + cursos + '</option>');
	      		}
	      		if(listaCursos.length > 0)$('.div-select').removeClass('oculto');
	  }
	  if(respuesta=='eSession') {
	    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	    location.href ="docentes.php";
	    return false;
	  }
	});
}
const eliminar = id =>{
	$.post(
	        "controlador/planificacion_controlador.php?op=delete",
	        {id:id},
	        datos => {
	            if(datos.status == "ok"){
	            	Swal.fire("Eliminado...");
	                get_planificaciones();
	            }
	            if(datos.status == "eSession")location.href = 'docentes.php';
	            
	        },
	        "json"
        );
}
const mostrar_lista = lista => {
	let index = 1;
    lista.forEach(planificacion => {
        let id = planificacion.id;
        let fecha = planificacion.fecha;
        let dia = planificacion.dia;
        let periodo = planificacion.periodo;
        let materia = planificacion.materia;
        let actividad = planificacion.actividad;
        let recursos = planificacion.recursos;
        periodo = periodo.replace('[',"");
        periodo = periodo.replace(']',"");
            
        $("#body").append(`
                        <tr>
                            <td class="border-top index">${index}</td>
                            <td class="border-td">${fecha}</td>
                            <td class="border-td">${dia}</td>
                            <td class="border-td">${periodo}</td>
                            <td class="border-td">${materia}</td>
                            <td class="border-td">${actividad}</td>
                            <td class="border-td">${recursos}</td>
                            <td class="border-td center"><a href="#" onclick="eliminar(${id});"><img class="icon-delete" src="svg/delete.png"></a></td>
                        </tr>   
                          `);
        index++;
      
    });
    $("#tabla_lista").removeClass('oculto');
    $("#div-btn-nuevo").removeClass('oculto');
	$(".btn-float-back").addClass('oculto');
	$(".div-formulario").addClass('oculto');
	$(".noData").addClass('oculto');
};
function obtenerMateria(curso, paralelo){

  $("#seleccionar_materia").empty();

  $("#seleccionar_materia").append('<option value="0"> -- Seleccionar materia -- </option>');

  for(var i = 0 ; i < listaMaterias.length; i++) {

      if(listaMaterias[i]['codcur'] == curso && listaMaterias[i]['codpar'] == paralelo){

        $("#seleccionar_materia").append('<option value ="'+(listaMaterias[i]['codmat'])+'">' + listaMaterias[i]['nombre'] + '</option>');

      }

  }

}

const get_planificaciones = ()=>{
	let index = $("#seleccionar_curso").val();
	$("#tabla_lista").addClass('oculto');
	$(".div-formulario").addClass('oculto');
	$(".noData").addClass('oculto');
	$("#body").empty();
	curso_sel = "";
	paralelo_sel = "";
	if(index!=""){
		let codcur = listaCursos[index - 1].codcur;
		let codpar = listaCursos[index - 1].codpar;
		curso_sel = codcur;
		paralelo_sel = codpar;
		obtenerMateria(codcur, codpar);
		$.post(
	        "controlador/planificacion_controlador.php?op=get_planificacion",
	        {codcur:codcur,codpar:codpar},
	        datos => {
	            if(datos.status == "ok"){
	                mostrar_lista(datos.datos);
	            }
	            if(datos.status == "noData"){
	                $(".noData").removeClass('oculto');
	                $("#div-btn-nuevo").removeClass('oculto');
	                $(".div-formulario").addClass('oculto');
	            }
	            if(datos.status == "eSession")location.href = 'docentes.php';
	            
	        },
	        "json"
        );
	}
};
const check = e =>{
	if(e.children[0].checked){
		e.classList.remove('selected');
	}else{
		e.classList.add('selected');
	}
	
	e.children[0].checked = !e.children[0].checked;
}
const mostrarForm = ()=>{
	let checkboxs = document.getElementsByName('checkbox');

	for (var i = 0; i < checkboxs.length; i++) {
		checkboxs[i].checked = false;
	}
	$('.button-check').removeClass('selected');
	$('#fecha').val("");
	$('#recursos').val("");
	$('#seleccionar_materia').val("");
	$('#actividad').val("");
	$("#div-btn-nuevo").addClass('oculto');
	$("#tabla_lista").addClass('oculto');
	$(".btn-float-back").removeClass('oculto');
	$(".div-formulario").removeClass('oculto');
	$(".btn-float-back").removeClass('oculto');
	$(".noData").addClass('oculto');


}
const get_materias_prof = ()=>{
	$.get(
		"obtener_materias_json.php?op=getmatprof",
		respuesta=>{
  			let jsonDataMaterias = respuesta;
  			if (jsonDataMaterias.status == 'ok') {
    			listaMaterias = jsonDataMaterias.materias;
  			}
  			if(respuesta.status == 'eSession') {
  				location.href = "docentes.php";
  			}

		},
		"json");
}
const validar = ()=>{
	if(curso_sel == "" || paralelo_sel == ""){
		$('#seleccionar_curso').focus();
			Swal.fire("Debes seleccionar el curso...");
			return false;
	}
	let fecha = $("#fecha").val();
	if(fecha == ""){
		$("#fecha").focus();
		Swal.fire("Debes seleccionar la fecha...");
		return false;
	}
	let checkboxs = document.getElementsByName('checkbox');

	let bandera = false;
	for (var i = 0; i < checkboxs.length; i++) {
		if(checkboxs[i].checked)bandera = true;
	}
	if(!bandera){
		Swal.fire("Debes seleccionar uno o m&aacute;s periodos...");
		return false;
	}

	let materia = $("#seleccionar_materia").val();
	console.log(materia)
	if(materia == "null"){
		$("#seleccionar_materia").focus();
		Swal.fire("Debes seleccionar la materia...");
		return false;
	}
	let actividad = $("#actividad").val();
	if(actividad == ""){
		$("#actividad").focus();
		Swal.fire("Debes ingresar la actividad a realizar...");
		return false;
	}
	let recursos = $("#recursos").val();
	if(recursos == ""){
		$("#recursos").focus();
		Swal.fire("Debes ingresar el material bibliogr&aacute;fico...");
		return false;
	}
	return true;
}
const save = () => {

	if(validar()){
		let fecha = $("#fecha").val();
		let periodo = $("#periodo").val();
		let materia = $("#seleccionar_materia").val();
		let actividad = $("#actividad").val();
		let recursos = $("#recursos").val();
		let checkboxs = document.getElementsByName('checkbox');
		let array_periodos = [];
		for (var i = 0; i < checkboxs.length; i++) {
			if(checkboxs[i].checked)array_periodos.push(i+1);
		}
		$.post(
	        "controlador/planificacion_controlador.php?op=save",
	        {codcur:curso_sel,codpar:paralelo_sel,fecha:fecha,periodo:JSON.stringify(array_periodos),codmat:materia,actividad:actividad,recursos:recursos},
	        datos => {
	            if(datos.status == "ok"){
	                get_planificaciones();
	            }
	            if(datos.status == "eSession")location.href = 'docentes.php';
	            
	        },
	        "json"
        );
	}
}
$(document).ready(()=>{
	get_cursos_prof();
	get_materias_prof();
	$("#seleccionar_curso").change(()=>{
		get_planificaciones();
	});
	$("#btn-nuevo").click(()=>{
		mostrarForm();
	})
	$(".btn-float-back").click(()=>{
		get_planificaciones();
	})
	$("#btn-guardar").click(()=>{
		save();
	})
})