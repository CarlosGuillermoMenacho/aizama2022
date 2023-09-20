let lista_cursos = [];
let lista_actividades = [];
let lista_evaluaciones = [];
let lista_alumnos = [];
let registros = [];
let __codcur = "";
let __codpar = "";
let __curso = 0;
let centesimas = 0;
let segundos = 0;
let minutos = 0;
let __codalu = "";
let __cronometrando = false;
let __id_actividad = "";
let __id_registro = "";
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
const close_form2 = () => {
	$(".div-formulario2").slideToggle();
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
const get_registro = codalu => {
	for (var i = 0; i < registros.length; i++) {
		if(registros[i].codalu == codalu)return registros[i];
	}
	return "";
}
const get_actividad = id => {
	for (var i = 0; i < lista_actividades.length; i++) {
		if(lista_actividades[i].id == id)return lista_actividades[i];
	}
	return "";
}
const cronometro = () => {
	if (centesimas < 99) {
		centesimas++;
		if (centesimas < 10) { centesimas = "0"+centesimas }
		Centesimas.innerHTML = centesimas;
	}
	if (centesimas == 99) {
		centesimas = -1;
	}
	if (centesimas == 0) {
		segundos ++;
		if (segundos < 10) { segundos = "0"+segundos }
		Segundos.innerHTML = segundos;
	}
	if (segundos == 59) {
		segundos = -1;
	}
	if ( (centesimas == 0)&&(segundos == 0) ) {
		minutos++;
		if (minutos < 10) { minutos = "0"+minutos }
		Minutos.innerHTML = minutos;
	}
	if (minutos == 59) {
		minutos = -1;
	}
}
const restablecer_reloj = () => {
	clearInterval(control);
	__cronometrando = false;
	centesimas = 0;
	minutos = 0;
	segundos = 0;
	$(".div-button-crono").empty();
	$(".div-button-crono").append('<button class="btn-submit" onclick="iniciar_reloj()">Iniciar</button>')
	document.getElementById("Minutos").innerHTML = "00";
	document.getElementById("Segundos").innerHTML = "00";
	document.getElementById("Centesimas").innerHTML = "00";
}
const guardar_reloj = () => {
	let evaluacion = `${minutos}:${segundos}:${centesimas}`;
	$.post(
		"controlador/actividad_fisica_controlador.php?op=save_actividad_alumno",
		{id_eva:__id_actividad,codalu:__codalu,evaluacion:evaluacion,id:__id_registro},
		data => {
			if(data.status == "eSession"){
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
				return;
			}
			if (data.status == "ok") {
				for (var i = 0; i < lista_evaluaciones.length; i++) {
					if(lista_evaluaciones[i].codalu == __codalu){
						lista_evaluaciones[i].evaluacion = data.data.evaluacion;
						$(`#eva${__codalu}`).text(data.data.evaluacion);
						close_cronometro();
						return;
					}
				}
				lista_evaluaciones.push(data.data);
				$(`#eva${__codalu}`).text(data.data.evaluacion);
				$(`#ta${__codalu}`).append(`<div class="div-textarea">
				                                <textarea id="ta${__codalu}"></textarea> 
				                                <div class="div-option-text">
				                                    <img src="images/check.svg" title="Guardar" width="20px" style="cursor:pointer;">                               
				                                    <img src="images/close.svg" title="Cancelar" width="20px" style="cursor:pointer;">
				                                </div>
				                            </div>`);
				close_cronometro();
			}
		},"json"
	);
}
const detener_reloj = () => {
	clearInterval(control);
	__cronometrando = false;
	$(".div-button-crono").empty();
	$(".div-button-crono").append('<button class="btn-submit" onclick="reanudar_reloj()">Reanudar</button>')
	$(".div-button-crono").append('<button class="btn-danger" onclick="restablecer_reloj()">Restablecer</button>')
	$(".div-button-crono").append('<button class="btn-submit2" onclick="guardar_reloj()">Guardar</button>')
}
const close_cronometro = () => {
	if (__cronometrando) {
		__cronometrando = false;
		clearInterval(control)
	}
	close_form2();

}
const iniciar_reloj = () => {
	document.getElementById("Minutos").innerHTML = "00";
	document.getElementById("Segundos").innerHTML = "00";
	document.getElementById("Centesimas").innerHTML = "00";
	$(".div-button-crono").empty();
	$(".div-button-crono").append('<button class="btn-danger" onclick="detener_reloj()">Detener</button>')
	control = setInterval(cronometro,10);
	__cronometrando = true;
	//cronometro();
}
const reanudar_reloj = () => {
	control = setInterval(cronometro,10);
	__cronometrando = true;
	$(".div-button-crono").empty();
	$(".div-button-crono").append('<button class="btn-danger" onclick="detener_reloj()">Detener</button>')
}

const mostrar_cronometro = (a,n,i) => {
	__codalu = a;
	__id_registro = i;
	Alumno.innerHTML = `${n}`;
	centesimas = 0;
	minutos = 0;
	segundos = 0;
	$(".div-button-crono").empty();
	$(".div-button-crono").append('<button class="btn-submit" onclick="iniciar_reloj()">Iniciar</button>')
	document.getElementById("Minutos").innerHTML = "00";
	document.getElementById("Segundos").innerHTML = "00";
	document.getElementById("Centesimas").innerHTML = "00";
	close_form2();

}
const mostrar_lista = (id_eva) => {
	let act = get_actividad(id_eva);
	console.log(act)
	$(".div-lista-alumnos").empty();
	let html = "";
	let index = 1;
	lista_alumnos.forEach(a => {
		//console.log(a)
		let codalu = a.codigo;
		let nombre = `${a.paterno} ${a.materno} ${a.nombres}`;
		let reg = get_registro(codalu);
		if(reg != ""){
			let html_input = `<div class="div-input-data"><input class="input-data" type="text" id="in${codalu}"><div class="div-option-text">
                                    <img src="images/check.svg" title="Guardar" width="20px" style="cursor:pointer;">                               
                                    <img src="images/close.svg" title="Cancelar" width="20px" style="cursor:pointer;">
                                </div></div>`;
			if(act.id == 1)html_input = `<img style="cursor: pointer;" width="35px" src="img/cronometro.png" onclick="mostrar_cronometro(${codalu},'${nombre}',${reg.id})">`;
			html = `${html}<tr>
                        <td style="width:5%">${index}</td>
                        <td style="width:30%">${nombre}</td>
                        <td style="width:10%" id="eva${codalu}">${reg.evaluacion}</td>
                        <td style="width:25%">${html_input}</td>
                        <td style="width:30%">
                        	<div class="div-textarea">
                                <textarea id="ta${codalu}">${reg.observacion}</textarea> 
                                <div class="div-option-text">
                                    <img src="images/check.svg" title="Guardar" width="20px" style="cursor:pointer;">                               
                                    <img src="images/close.svg" title="Cancelar" width="20px" style="cursor:pointer;">
                                </div>
                            </div>
                        </td>
                    </tr>`;
		}else{
			let html_input = `<div class="div-input-data"><input class="input-data" type="text" id="in${codalu}"><div class="div-option-text">
                                    <img src="images/check.svg" title="Guardar" width="20px" style="cursor:pointer;">                               
                                    <img src="images/close.svg" title="Cancelar" width="20px" style="cursor:pointer;">
                                </div></div>`;
			if(act.id == 1)html_input = `<img style="cursor: pointer;" width="35px" src="img/cronometro.png" onclick="mostrar_cronometro(${codalu},'${nombre}',${reg.id})">`;
			html = `${html}<tr>
                        <td style="width:5%">${index}</td>
                        <td style="width:30%">${a.paterno} ${a.materno} ${a.nombres}</td>
                        <td style="width:10%" id="eva${codalu}"> Sin registro</td>
                        <td style="width:25%">${html_input}</td>
                        <td style="width:30%" id="ta${codalu}">
                        	
                        </td>
                    </tr>`;
		}
		index++;
	});
	$(".div-lista-alumnos").append(`<div class="head-actividad">
					                    <h2>${act.descripcion}</h2>
					                </div>
					                <div class="lista-alumnos">
					                    <table class="table">
					                        <thead>
					                            <tr>
					                                <td style="width:5%">No.</td>
					                                <td style="width:30%">Estudiante</td>
					                                <td style="width:10%">Marca Actual</td>
					                                <td style="width:25%">Evaluar</td>
					                                <td style="width:30%">Observación</td>
					                            </tr>
					                        </thead>
					                        <tbody>
					                            ${html}
					                        </tbody>
					                    </table>
					                </div>`);
}
const ver_actividad = (a,c,p) => {
	$(".selecteds").addClass("item-curso");
	$(".selecteds").removeClass("selecteds");
	$(`#a${a}`).removeClass("item-curso");
	$(`#a${a}`).addClass("selecteds");
	__id_actividad = a;
	$.post(
		"controlador/actividad_fisica_controlador.php?op=get_registros",
		{id_eva:a},
		data => {
			if(data.status == "eSession"){
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
				return;
			}
			if (data.status == "ok") {
				registros = data.data;
				mostrar_lista(a);
			}
		},"json"
	);
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
		"controlador/cursos_controlador.php?op=get_lista",
		{codcur:__codcur,codpar:__codpar},
		data => {
			if(data.status == "eSession"){
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
				return;
			}
			if (data.status == "ok") {
				lista_alumnos = data.data;
			}
		},"json"
	);
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