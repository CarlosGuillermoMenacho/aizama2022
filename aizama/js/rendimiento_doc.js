let lista_cursos = [];
let lista_actividades = [];
let lista_evaluaciones = [];
let __codcur = "";
let __codpar = "";
let __curso = 0;

const save_actividad = () => {
	let actividad = $("#ta-actividad").val();
	let cb = document.getElementsByName("acti");
	let act = 0;
	for (var i = 0; i < cb.length; i++) {
		if(cb[i].checked)act = i+1;
	}
	if(actividad == "" || act == 0){
		Swal.fire("Debe llenar los campos requeridos...");
		return;
	}
	$.post(
		"controlador/actividad_fisica_controlador.php?op=save_actividad",
		{codcur:__codcur,codpar:__codpar,descripcion:actividad,id_eva:act},
		data => {
			if(data.status == "eSession"){
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
				return;
			}
			if (data.status == "ok") {
				lista_actividades.push(data.data);
				$("#actividades").append(`
		            	<div id="a${data.data.id}" class="item-curso" onclick="ver_actividad(${data.data.id},${__codcur},${__codpar})">
			                ${data.data.descripcion}
			            </div>
				`);
				close_form();
			}
		},"json"
	);
}
const close_form = () => {
	$(".div-formulario").slideToggle()
}
const nueva_actividad = () => {
	$(".div-formulario").empty();
	let html = "";
	lista_evaluaciones.forEach(l => {
		html = `${html}<div class="div-check-label">
			                <p style="padding-bottom: 5px; font-size :.85em; font-weight: 500;">${l.descripcion}</p>
			                <div>
			                    <input type="radio" name="acti" value="Tiempo">
			                </div>
			            </div>
		`;
	});
	$(".div-formulario").append(
		`<form id="formulario" class="formulario">
	        <div class="title"><h1>Registrar Nueva Actividad</h1></div>
	        <label class="label-form">Curso</label>
	        <textarea id="ta-curso" placeholder="Descripción de la actividad..." readonly>${lista_cursos[__curso].nombre}</textarea>
	        <label class="label-form">Actividad</label>
	        <textarea id="ta-actividad" placeholder="Descripción de la actividad..."></textarea>
	        <label class="label-form">Tipo de evaluación</label>
	        <div class="div-checks-eval">
	            ${html}
	        </div>
	        <div class="div-button-form">
	            <img width="35px" src="images/check.svg" title="Guardar" onclick="save_actividad()">
	            <img width="35px" src="images/close.svg" title="Cancelar" onclick="close_form()">
	        </div>
	    </form>`
	);
	$(".div-formulario").slideToggle();
}
const ver_actividad = a => {
	$(".selecteds").addClass("item-curso");
	$(".selecteds").removeClass("selecteds");
	$(`#a${a}`).removeClass("item-curso");
	$(`#a${a}`).addClass("selecteds");
}
const mostrar_actividades = lista => {
	$("#actividades").empty();
	let html = "";
	lista.forEach(a => {
		html = `${html}<div id="a${a.id}" class="item-curso" onclick="ver_actividad(${a.id},${__codcur},${__codpar})">
		                ${a.descripcion}
		            </div>`
	});
	$("#actividades").append(`
			<div class="div-categoria">
                <h2>Actividades</h2>
            </div>
            	${html}
			<div class="div-button-add">
                <img width="30px" src="images/plus.png" title="Agregar actividad" onclick="nueva_actividad()">
            </div>
		`);

}
const ver_curso = (c,p,i) => {
	__codcur = c;
	__codpar = p;
	__curso = i;
	$(".selected").addClass("item-curso");
	$(".selected").removeClass("selected");
	$(`#c${c}${p}`).removeClass("item-curso");
	$(`#c${c}${p}`).addClass("selected");
	$.post(
		"controlador/actividad_fisica_controlador.php?op=get_actividades",
		{codcur:__codcur,codpar:__codpar},
		data => {
			if(data.status == "eSession"){
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
				return;
			}
			if (data.status == "ok") {
				lista_actividades = data.data;
				mostrar_actividades(lista_actividades);
			}
		},"json"
	);
}
const get_gursos_prof = async () => {
	await $.get(
		"obtener_curso_json.php?op=cp",
		data => {
			if(data.status == "eSession"){
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
				return;
			}
			if (data.status == "ok") {
				lista_cursos = data.cursos;
				let index = 0;
				$("#menu-cursos").empty();

				$("#menu-cursos").append(
						`<div class="div-categoria">
			                <h2>Cursos</h2>
			            </div>`
					);
				lista_cursos.forEach(c => {
					let nombre = c.nombre.split(" - ");
					$("#menu-cursos").append(
						`<div id="c${c.codcur}${c.codpar}" class="item-curso" onclick="ver_curso(${c.codcur},${c.codpar},${index})">
			                <label>${nombre[0]}</label><label>${nombre[1]}</label>
			            </div>`
					);
					index++;
				})
				if(lista_cursos.length > 0)ver_curso(lista_cursos[0].codcur,lista_cursos[0].codpar,0);

			}
		},"json"
	);
}
const get_evaluaciones = async () => {
	await $.get(
		"controlador/actividad_fisica_controlador.php?op=get_evaluaciones",
		data => {
			if(data.status == "eSession"){
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
				return;
			}
			if(data.status == "ok"){
				lista_evaluaciones = data.data;
			}
		},"json"
	);
}
$(document).ready(async ()=>{
	$("#select_curso").select2({width:"100%"});
	$("#select_disciplina").select2({width:"100%"});
	await get_gursos_prof();
	await get_evaluaciones();
})