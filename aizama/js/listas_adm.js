let listaCursos = [];
let listaParalelos = []; 
let lista_alumnos = [];
let alumno_seleccionado = "";
const cargarCursos = (cursos,paralelos) => {
	$("#select_curso").empty();
	$("#select_paralelo").empty();
	$("#select_curso").append('<option value = ""> -- Seleccionar Curso -- </option>');
	$("#select_paralelo").append('<option value = ""> -- Seleccionar Paralelo -- </option>');
	cursos.forEach(curso => {
		$("#select_curso").append(`<option value = "${curso.codigo}"> ${curso.descrip} </option>`);
	});
	paralelos.forEach(paralelo => {
		$("#select_paralelo").append(`<option value = "${paralelo.cod_par}"> ${paralelo.descrip} </option>`);
	});
	$(".div-selects").removeClass("oculto");
}

const get_cursos = () => {
	$.get(
		"controlador/cursos_controlador.php?op=get_cursos",
		data => {
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión por favor...");
				return;
			}
			if (data.status == "ok") {
				listaCursos = data.cursos;
				listaParalelos = data.paralelos;
				cargarCursos(listaCursos,listaParalelos);
			}
		},
		"json"
		);
}

const quitar_de_lista = codalu => {
	$.post(
		"controlador/cursos_controlador.php?op=quitar_de_lista",
		{codalu:codalu},
		data => {
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión por favor...");
				return;
			}
			if (data.status == "ok") {
				get_listas();
			}
		},
		"json"
	);
}
const close_form = () => {
	$(".formulario_asignacion").addClass("oculto");
}
const get_nombre = codalu => {
	for (var i = 0; i < lista_alumnos.length; i++) {
		if(lista_alumnos[i].codigo == codalu){
			return `${lista_alumnos[i].paterno} ${lista_alumnos[i].materno} ${lista_alumnos[i].nombres}`;
		}
	}
	return "";
}
const mostrarForm = codalu => {
	alumno_seleccionado = codalu;
	$("#seleccionar_curso").empty();
	$("#seleccionar_paralelo").empty();
	$("#seleccionar_curso").append('<option value=""> -- Seleccionar Curso -- </option>');
	$("#seleccionar_paralelo").append('<option value=""> -- Seleccionar Paralelo -- </option>');
	$("#info").html(get_nombre(codalu));
	listaCursos.forEach(curso =>{
		$("#seleccionar_curso").append(`<option value="${curso.codigo}"> ${curso.descrip} </option>`);
	});
	listaParalelos.forEach(paralelo => {
		$("#seleccionar_paralelo").append(`<option value="${paralelo.cod_par}"> ${paralelo.descrip} </option>`);
	});
	$(".formulario_asignacion").removeClass("oculto");
}
const mostrar_lista = lista => {
	$("#body-escritorio").empty();
	let index = 1;
	lista_alumnos.forEach(alumno => {
		let nombre = `${alumno.paterno} ${alumno.materno} ${alumno.nombres}`;
		let codalu = alumno.codigo;
		
		$("#body-escritorio").append(`
			<tr>
	            <td class="index">${index}</td>
	            <td class="border-td">${nombre}</td>
	            <td class="border-td options"><label class="pointer" onclick="mostrarForm(${codalu})">Cambiar Curso</label><label class="pointer danger" onclick="quitar_de_lista(${codalu});">Quitar de lista</label></td>
	        </tr>
		`);	
		index++;
	});
	$(".div-table-escritorio").removeClass("oculto");
}
const get_listas = () => {
	let codcur = $("#select_curso").val();
	let codpar = $("#select_paralelo").val();
	if(codcur == "" || codpar == ""){
		//Swal.fire("Debe seleccionar curso y paralelo...");
		$(".div-table-escritorio").addClass("oculto");
		return;
	}

	$.post(
		"controlador/cursos_controlador.php?op=get_lista",
		{codcur:codcur,codpar:codpar},
		data => {
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, ingrese nuevamente con su usuario y contraseña...");
				return;
			}
			if (data.status == "ok") {
				lista_alumnos = data.data;
				mostrar_lista(lista_alumnos);
			}
		},
		"json"
	);
}
const set_curso = () => {
	let codcur = $("#seleccionar_curso").val();
	let codpar = $("#seleccionar_paralelo").val();
	if(codcur == "" || codpar == ""){
		Swal.fire("Debe seleccionar curso y paralelo...");
		return;
	}
	$.post(
		"controlador/alumno_controlador.php?op=change_grade&usr=adm",
		{codcur:codcur,codpar:codpar,codalu:alumno_seleccionado},
		data =>{
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, ingrese nuevamente con su usuario y contraseña...");
				return;
			}
			if (data.status == "ok") {
				close_form();
				get_listas();
			}
		},
		"json"
	);
}
$(document).ready(()=>{
	get_cursos();
	$("#formulario").submit(e=>{e.preventDefault()});
	$("#select_curso").change(()=>get_listas());
	$("#select_paralelo").change(()=>get_listas());
	$("#btn-aceptar").click(()=>{set_curso()});

});