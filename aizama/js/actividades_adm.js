let __CURSOS = [];
let __MATERIAS = [];
let __EVALUACIONES = [];
let __PRACTICOS = [];
let __MATERIALES = [];
let __MESES = ["","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
let __BANCO = [];
let __C = ""; //Código de curso
let __P = ""; //Código de paralelo
let __M = ""; //Código de materia
const get_materia = m => {
	for (var i = 0; i < __MATERIAS.length; i++) {
		if(__MATERIAS[i].codmat == m) return __MATERIAS[i];
	}
	return false;
}
const get_curso = (c,p) => {
	for (var i = 0; i < __CURSOS.length; i++) {
		if(__CURSOS[i].codcur == c && __CURSOS[i].codpar == p)return __CURSOS[i];
	}
	return false;
}
const mostrar_lista_banco = (l,t,i) => {
	$(".lista-evaluaciones").empty();
	let e = __EVALUACIONES[i];
	if (t == 1) {
		let html = "";
		l.forEach(p => {
			html = `${html}<div class="div-pregunta">
						<span class="span-pregunta"><b>${p.pregunta}</b></span>
						<div class="info-pregunta">
							<div class="opciones-pregunta">
								<div class="opciones">
									<span ${p.respuesta == 1?'class="opcion-selected"':""}>1. ${p.opciones[0].opcion}</span>
									<span ${p.respuesta == 2?'class="opcion-selected"':""}>2. ${p.opciones[1].opcion}</span>
									<span ${p.respuesta == 3?'class="opcion-selected"':""}>3. ${p.opciones[2].opcion}</span>
								</div>
								<span>Tiempo: <b>${p.tiempo} min.</b></span>
							</div>
							${p.imagen != ""?`<div class="img-pregunta">
								<img src="resources/${p.imagen}">
							</div>`:''}
						</div>
					</div>`;
		})
		$(".lista-evaluaciones").append(
			`<div class="div-banco">
						<img class="icon-close" src="images/close.svg" title="Cerrar" onclick="get_evaluaciones(${__C},${__P},'${__M}')">
						<span class="card-descripcion-pregunta">${e.descripcion}</span>
						<span class="title-banco">Banco de Preguntas</span>
						<div class="info-evaluacion-pregunta">
							${html}
						</div>
					</div>`
		);
	}
	if (t == 2) {
		let html = "";
		l.forEach(p => {
			html = `${html}<div class="div-pregunta">
						<span class="span-pregunta">${p.pregunta}</span>
					</div>`;
		})
		$(".lista-evaluaciones").append(
			`<div class="div-banco">
						<img class="icon-close" src="images/close.svg" title="Cerrar" onclick="get_evaluaciones(${__C},${__P},'${__M}')">
						<span class="card-descripcion-pregunta">${e.descripcion}</span>
						<span class="title-banco">Banco de Preguntas</span>
						<div class="info-evaluacion-pregunta">
							${html}
						</div>
					</div>`
		);
	}
}
const get_banco = (id,t,i) => {
	let url = "controlador/evaluacionSeleccion_controlador.php?op=banco&usr=adm";
	if (t == 2) url = "controlador/evaluacion_escrita_controlador.php?op=get_banco"; 
	$.post(
		url,
		{codexa:id},
		data => {
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña...");
				return;
			}
			if(data.status == "ok"){
				__BANCO = data.data;
				mostrar_lista_banco(__BANCO,t,i);
			} 
		},"json"
	);
}
const mostrar_lista_evaluaciones = (l,c,p,m) =>{
	__C = c;
	__P = p;
	__M = m;
	$(".lista-evaluaciones").empty();
	let index = 0;
	l.forEach(e => {
		$(".lista-evaluaciones").append(
			`<div class="card-evaluacion">
						<span class="card-descripcion">${e.descripcion}</span>
						<span class="puntaje">${e.nota} Pts.</span>
						<div class="info-evaluacion">
							<span>Trimestre: <b>${e.trimestre} </b></span>
							<span>Disponible desde: <b>${e.fi.substring(8,10)} de ${__MESES[parseInt(e.fi.substring(5,7))]}, ${e.hi} hrs.</b></span>
							<span>hasta: <b>${e.ff.substring(8,10)} de ${__MESES[parseInt(e.ff.substring(5,7))]}, ${e.hf} hrs.</b></span>
							${e.tiempo != ""?`<span>Tiempo: <b>${e.tiempo}</b></span>`:''}
							<span>Tipo de evaluación: <b>${e.tipo_nombre}</b></span>
						</div>
						<div class="contenido-actividades">
							<div class="item">
								<span class="underline" onclick="get_banco(${e.id},${e.tipo},${index})">Banco de Preguntas</span>
								<span class="badget-blue">${e.banco}</span>
							</div>
							<div class="item">
								<span>Preguntas a responder</span>
								<span class="badget-blue">${e.preguntas}</span>
							</div>
						</div>
						<div class="contenido-actividades">
							<div class="item">
								<span class="underline">Alumnos que realizaron la evaluación</span>
								<span class="badget-green">${e.realizados}</span>
							</div>
							<div class="item">
								<span class="underline">Faltan</span>
								<span class="badget">${e.pendientes}</span>
							</div>
						</div>
					</div>
				</div>`
		);
		index++;
	});
	if(l.length == 0){
		$(".lista-evaluaciones").append(
			`<div class="card-evaluacion">
						<span class="no-material">No hay evaluaciones</span>
					</div>`
		);
	}
	$("#mc").html(`Evaluaciones de ${get_materia(m).nombre}`);
	$(".content-list-materias").addClass("oculto");
	$(".div-lista-evaluaciones").removeClass("oculto");

}
const get_evaluaciones = (c,p,m) => {
	$.post(
		"controlador/evaluacionSeleccion_controlador.php?op=get_evaluaciones&usr=adm",
		{codcur:c,codpar:p,codmat:m},
		data => {
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña...");
				return;
			}
			if(data.status == "ok"){
				__EVALUACIONES = data.evaluaciones;
				mostrar_lista_evaluaciones(__EVALUACIONES,c,p,m);
			} 
		},"json"
	);
}
const mostrar_lista_practicos = (l,c,p,m) => {
	$(".lista-evaluaciones").empty();
	l.forEach(p => {
		$(".lista-evaluaciones").append(
			`<div class="card-evaluacion">
						<span class="card-descripcion">${p.descripcion}</span>
						<span class="puntaje">${p.nota} Pts.</span>
						<div class="info-evaluacion">
							<span>Trimestre: <b>${p.trimestre}</b></span>
							<span>Fecha límite de presentación: <b>${p.fl.substring(8,10)} de ${__MESES[parseInt(p.fl.substring(5,7))]}, ${p.hl} hrs.</b></span>
							<span>Fecha de creación: <b>${p.registro.substring(8,10)} de ${__MESES[parseInt(p.registro.substring(5,7))]}, ${p.registro.substring(11,16)} hrs.</b></span>
							<span>Los estudiantes pueden presentar después de la fecha límite: <b>${p.limite}</b></span>
							<span>Tipo de práctico: <b>${p.nombre_tipo}</b></span>
						</div>
						<div class="contenido-actividades">
							<div class="item">
								<span class="underline">Actividades</span>
								<span class="badget-blue">${p.actividades}</span>
							</div>
						</div>
						<div class="contenido-actividades">
							<div class="item">
								<span class="underline">Alumnos que realizaron el práctico</span>
								<span class="badget-green">${p.realizados}</span>
							</div>
							<div class="item">
								<span class="underline">Faltan</span>
								<span class="badget">${p.pendientes}</span>
							</div>
						</div>
					</div>
				</div>`
		);
	})
	if(l.length == 0){
		$(".lista-evaluaciones").append(
			`<div class="card-evaluacion">
						<span class="no-material">No hay prácticos</span>
					</div>`
		);
	}
	$("#mc").html(`Prácticos de ${get_materia(m).nombre}`);
	$(".content-list-materias").addClass("oculto");
	$(".div-lista-evaluaciones").removeClass("oculto");
}
const get_practicos = (c,p,m) => {
	$.post(
		"controlador/practicoDigital_controlador.php?usr=adm&op=get_practicos",
		{codcur:c,codpar:p,codmat:m},
		data => {
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña...");
				return;
			}
			if(data.status == "ok"){
				__PRACTICOS = data.practicos;
				mostrar_lista_practicos(__PRACTICOS,c,p,m);
			}
		},"json"
	);
}
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
const mostrar_lista_material = (l,c,p,m) => {
	$(".lista-evaluaciones").empty();
	l.forEach(m => {
		$(".lista-evaluaciones").append(
			`<div class="card-evaluacion">
						<span class="card-descripcion">${m.titulo}</span>
						<div class="info-evaluacion">
							<span>Trimestre: <b>${m.trimestre}</b></span>
							<span>${m.descripcion}</span>
							<span>Fecha de creación: <b>${m.fecha.substring(8,10)} de ${__MESES[parseInt(m.fecha.substring(5,7))]}, ${m.hora} hrs.</b></span>
						</div>
						<div class="contenido-actividades">
							<div class="item">
								<span class="underline"><a href="${m.material}" target="__blank">Contenido</a></span>
							</div>
						</div>
					</div>`
		);
	})
	if(l.length == 0){
		$(".lista-evaluaciones").append(
			`<div class="card-evaluacion">
						<span class="no-material">No hay material</span>
					</div>`
		);
	}
	$("#mc").html(`Material de apoyo de ${get_materia(m).nombre}`);
	$(".content-list-materias").addClass("oculto");
	$(".div-lista-evaluaciones").removeClass("oculto");
}
const get_material = (c,p,m) => {
	$.post(
		"controlador/material_de_apoyo_controlador.php?op=get_material",
		{codcur:c,codpar:p,codmat:m},
		data => {
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña...");
				return;
			}
			if(data.status == "ok"){
				__MATERIALES = data.materiales;
				mostrar_lista_material(__MATERIALES,c,p,m);
			}
		},"json"
	);
}
const mostrar_lista_materias = (l,c,p) => {
	$(".lista-materias").empty();
	l.sort(dynamicSort("nombre"));
	l.forEach(m => {
		let info_prof = "";
		if(m.nombre != ""){
			if(m.celular != ""){
				info_prof = `
					<div class="info-prof">
						<span>${m.profesor}</span>
						<div class="contac-prof">
							<span class="underline">${m.celular}</span>
							<a href="https://api.whatsapp.com/send?phone=591${m.celular}" target="__blank"><img src="svg/whatsapp.svg" title="Abrir en whatsapp"></a>
						</div>
					</div>
				`;
			}else{
				info_prof = `
					<div class="info-prof">
						<span>${m.profesor}</span>
					</div>
				`;
			}
		}
		$(".lista-materias").append(
			`<div class="card">
				<span class="card-materia">${m.nombre}</span>
				${info_prof}
				<div class="contenido-actividades">
					<div class="item">
						<span class="underline" onclick="get_evaluaciones(${c},${p},'${m.codmat}')">Evaluaciones</span>
						<span class="badget">${m.evaluaciones}</span>
					</div>
					<div class="item">
						<span class="underline" onclick="get_practicos(${c},${p},'${m.codmat}')">Prácticos</span>
						<span class="badget">${m.practicos}</span>
					</div>
					<div class="item">
						<span class="underline" onclick="get_material(${c},${p},'${m.codmat}')">Material de apoyo</span>
						<span class="badget">${m.material}</span>
					</div>
				</div>
			</div>`
		);
	});

	$(".div-lista-evaluaciones").addClass("oculto");
	$(".content-list-materias").removeClass("oculto");
}
const ver_curso = (e,c,p) => {
	$.post(
		"controlador/cursos_controlador.php?op=get_materias_curso_adm",
		{codcur : c , codpar : p},
		data => {
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña...");
				return;
			}
			if(data.status == "ok"){
				$(".selected").removeClass("selected");
				let curso = get_curso(c,p);
				$("#nc").html(curso.curso);
				e.classList.add("selected");
				__MATERIAS = data.materias;
				mostrar_lista_materias(__MATERIAS,c,p);
			} 
		},"json"
	);
}
const mostrar_lista_cursos = l => {
	$("#lista-cursos").empty();
	l.forEach(c => {
		if(c.codcur < 20){
			$("#lista-cursos").append(
				`<li onclick="ver_curso(this,${c.codcur},${c.codpar})">${c.curso}</li>`
			);
		}
	})
	$(".main").removeClass("oculto");
}
const get_cursos = () => {
	$.get(
		"controlador/cursos_controlador.php?op=get_cursos_a",
		data => {
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña...");
				return;
			}
			if(data.status == "ok"){
				__CURSOS = data.cursos;
				mostrar_lista_cursos(__CURSOS);
			} 
		},"json"
	);
}
$(document).ready(()=>{
	get_cursos();
})