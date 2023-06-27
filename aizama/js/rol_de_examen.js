let cursos_prof = [];
let materias_prof = [];
let lista_roles = [];
const get_cursos_prof = ()=>{
	$.post("obtener_curso_json.php?op=cp",function(respuesta){
	  var jsonDataCursos = JSON.parse(respuesta);
		if (jsonDataCursos['status'] == 'ok') {     
				cursos_prof = jsonDataCursos['cursos'];
				for (let i = 0; i < cursos_prof.length; i++) {    
					var cursos = cursos_prof[i]['nombre']; 
					$("#seleccionar_curso").append('<option value ="'+ (i+1) +'">' + cursos + '</option>');
	      		}
	      		if(cursos_prof.length > 0)$('.div-select').removeClass('oculto');
	  }
	  if(respuesta=='eSession') {
	    alert('La sesion ha expirado...');
	    location.href ="docentes.php";
	    return false;
	  }
	});
}
const get_materias_prof = ()=>{
	$.post(
		"obtener_materias_json.php?op=getmatprof",
		function(respuesta){
			if(respuesta=='eSession') {
			    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
			    return false;
			}
  			var jsonDataMaterias = JSON.parse(respuesta);
	    	if (jsonDataMaterias['status'] == 'ok') {
		        materias_prof = jsonDataMaterias['materias'];
			}
		}
	);
}
const cargar_materias = (codcur,codpar)=>{
	$('#seleccionar_materia').empty();
	$('#seleccionar_materia').append('<option value="0"> -- Seleccionar Materia -- </option>');
	materias_prof.forEach(materia =>{
		if (materia.codcur == codcur && materia.codpar == codpar) {
			$('#seleccionar_materia').append(`<option value="${materia.codmat}">${materia.nombre}</option>`)
		}
	});
}
const curso_selected = ()=>{
	let index = $('#seleccionar_curso').val();
	$('#tabla_lista').addClass('oculto');
	$('#div-btn-nuevo').addClass('oculto');
	$('.div-formulario').addClass("oculto");
	$(".btn-float-back").addClass("oculto");
	$("#noData").addClass("oculto");
	if(index != '0'){
		let codcur = cursos_prof[index - 1].codcur;
		let codpar = cursos_prof[index - 1].codpar;
		cargar_materias(codcur,codpar);
	}else{
		$('#seleccionar_materia').empty();
		$('#seleccionar_materia').append('<option value="0"> -- Seleccionar materia -- </option>');
	}
}
const get_rol = id => {
	for (var i = 0; i < lista_roles.length; i++) {
		if(lista_roles[i].id == id)return lista_roles[i];
	}
	return [];
}
const refresh = () =>{
	mostrar_tabla(lista_roles);
}
const delete_rol = codigo => {
	$.post(
		"controlador/controlador_rol_de_examen.php?op=delete_rol",
		{id:codigo},
		data => {
			if(data.status=="eSession")location.href = "docentes.php";
			if(data.status=="ok")change_materias();
		},"json"
		);
} 
const send_update_rol = (elem,id)=>{
	let fr = document.getElementsByClassName('update_input');
	for (var i = 0; i < fr.length; i++) {
		if(fr[i].value == ""){
			fr[i].focus();
			Swal.fire("Debe llenar los campos correctamente...");
			return;
		}
	}
	
	let input_1 = fr[0].value;
	let input_2 = fr[1].value;
	let input_3 = fr[2].value;
	
	
	$.post(
		"controlador/controlador_rol_de_examen.php?op=update_rol",
		{id:id,descripcion:input_1,fecha:input_2,hora:input_3},
		data => {
			if(data.status == "eSession")location.href = "docentes.php";
			if(data.status == "ok")change_materias();
		},"json"
		);

	
}
const update_rol = (index,elem,idrol)=>{
	$(`#${elem}`).empty();
	let rol = get_rol(idrol);

	$(`#${elem}`).append(
					`<td class="border-top index">${index}</td>
				     `
	);
				 //    <td class="border-td padding2"><input class="update_input" type="text" name="descripcion" value="${rol.descripcion}"></td>
	let td = document.createElement('td');
	let input = document.createElement('input');
	input.type = 'text';
	input.classList.add('update_input');
	input.name = 'descripcion';
	input.value = rol.descripcion;
	td.append(input);
	$(`#${elem}`).append(td);
	$(`#${elem}`).append(
					`<td class="border-td padding2"><input class="update_input" type="date" name="fecha" value="${rol.fecha}"></td>
				     <td class="border-td padding2"><input class="update_input" type="time" name="hora" value="${rol.hora}"></td>
				     <td class="border-td cel-op padding2"><div class="cel-opciones"><img onClick="send_update_rol('${elem}',${idrol});" src="images/check.svg"><img onClick="refresh();" src="images/close.svg"></div></td>`
		);
}
const mostrar_tabla = data => {
	lista_roles = data;
	let index = 1;
	$("#body").empty();
	data.forEach(rol => {
		let descripcion = rol.descripcion;
		let fecha = rol.fecha;
		let hora = rol.hora;
		let id = rol.id;
		$("#body").append(`
		    <tr id="rol${index}">
		        <td class="border-top index">${index}</td>
		        <td class="border-td">${descripcion}</td>
		        <td class="border-td">${fecha}</td>
		        <td class="border-td">${hora}</td>
		        <td class="border-td cel-op"><div class="cel-opciones"><img onclick="update_rol(${index},'rol${index}',${id})" src="images/edit.svg"/><img onclick="delete_rol(${id});" src="images/close.svg"/></div></td>
		    </tr>   
		`);
		index++;
	});
	$('#tabla_lista').removeClass('oculto');
	$('#div-btn-nuevo').removeClass('oculto');
}
const obtener_rol_examen = (codcur,codpar,codmat) => {
	$.post(
		"controlador/controlador_rol_de_examen.php?op=get_rol_de_examen",
		{codcur:codcur,codpar:codpar,codmat:codmat},
		data => {
			if(data.status == "eSession"){
				alert("La sesión ha expirado...");
				location.href = "docentes.php";
			}
			if (data.status == "noData") {
				$("#div-btn-nuevo").removeClass("oculto");
				$("#noData").removeClass("oculto");
				$('#tabla_lista').addClass('oculto');
			}
			if (data.status == "eTrimestre") {
				Swal.fire("Debe seleccionar el trimestre...");
			}
			if(data.status == "ok"){
				mostrar_tabla(data.data);
			}
		},"json"
		);
}
const change_materias = () => {
	$('.div-formulario').addClass("oculto");
	$(".btn-float-back").addClass("oculto");
	$("#noData").addClass("oculto");
	
	let index = $('#seleccionar_curso').val(); 
	let codmat = $('#seleccionar_materia').val();
	if(index != '0' && codmat != '0'){
		let codcur = cursos_prof[index - 1].codcur;
		let codpar = cursos_prof[index - 1].codpar;
		obtener_rol_examen(codcur,codpar,codmat);
	}else{
		$('#tabla_lista').addClass('oculto');
		$('#div-btn-nuevo').addClass('oculto');
	} 
}
const mostrarForm = () => {
	$("#descripcion").val("");
	$("#fecha").val("");
	$("#hora").val("");
	$('#tabla_lista').addClass('oculto');
	$('.div-formulario').removeClass("oculto");
	$(".btn-float-back").removeClass("oculto");
	$("#noData").addClass("oculto");

}
const btn_back = () => {
	change_materias();
}
const save_rol  = (codcur,codpar,codmat,descripcion,fecha,hora) => {
	$.post(
		"controlador/controlador_rol_de_examen.php?op=save_new",
		{codcur:codcur,codpar:codpar,codmat:codmat,descripcion:descripcion,fecha:fecha,hora:hora},
		data => {
			if(data.status == "eSession"){
				alert("La sesión ha expirado...");
				location.href = "docentes.php";
			}
			if (data.status == "eTrimestre") {
				Swal.fire("Debe seleccionar el trimestre...");
			}
			if(data.status == "ok"){
				change_materias();
			}
		},"json"
		);
}
const click_guardar = () => {
	let descripcion = $("#descripcion").val();
	let fecha = $("#fecha").val();
	let hora = $("#hora").val();
	let index = $('#seleccionar_curso').val(); 
	let codmat = $('#seleccionar_materia').val();
	if(index != '0' && codmat != '0'){
		if(descripcion == ""){
			$("#descripcion").focus();
			Swal.fire("Debe ingresar la descripción del examen...");
			return;	
		}
		if(fecha == ""){
			$("#fecha").focus();
			Swal.fire("Debe seleccionar la fecha del examen...");
			return;	
		}
		if(hora == ""){
			$("#hora").focus();
			Swal.fire("Debe ingresar la hora del examen...");
			return;	
		}
		let codcur = cursos_prof[index - 1].codcur;
		let codpar = cursos_prof[index - 1].codpar;
		save_rol(codcur,codpar,codmat,descripcion,fecha,hora);
	}else{
		Swal.fire("Debe seleccionar curso y materia...");
	}
}
$(document).ready(()=>{
	get_cursos_prof();
	get_materias_prof();
	$('#seleccionar_curso').change(()=>{curso_selected()});
	$('#seleccionar_materia').change(()=>{change_materias()});
	$("#btn-nuevo").click(()=>{mostrarForm()});
	$(".btn-float-back").click(()=>{btn_back()});
	$('#btn-guardar').click(()=>{click_guardar()});
})