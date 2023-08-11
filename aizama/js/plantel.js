let __profesores = [];
const get_profesor = codprof => {
	for (var i = 0; i < __profesores.length; i++) {
		if(__profesores[i].codprof == codprof)return __profesores[i];
	}
	return [];
}
const close_form = () => {
	$(".car-asignatura").addClass("oculto");
}
const mostrar_asignaturas = (p,m,c) => {
	let profesor = get_profesor(p);
	$(".car-asignatura").empty();
	$(".car-asignatura").append(
		`<div class="btn-close">
	        <img src="images/close.svg" onclick="close_form();">
	    </div>`);
	let imagen = "img/user.svg";
	if(profesor.perfil != "")imagen = `fotoperfil/${profesor.perfil}`;
	$(".car-asignatura").append(
		`<div class="div-perfil-docente">
			<img src="${imagen}">
		</div>`);
	$(".car-asignatura").append(
		`<div class="nombre-docente">
			${profesor.apeprof} ${profesor.nompro}
		</div>`);
	let materias = `<div class="asignaturas">`;
	c.forEach(curso=>{
		materias = `${materias}<div class="info-asignaturas">`;
		let nombre_curso = curso.curso;
		materias = `${materias}<h3>${nombre_curso}</h3><div class="materias">`
		let codcur = curso.codcur;
		let codpar = curso.codpar;
		for (var i = 0; i < m.length; i++) {
			if(m[i].codcur == codcur && m[i].codpar==codpar){
				materias = `${materias}<p>${m[i].materia}</p>`
			}
		}
		materias = `${materias}</div></div>`;
	})
	$(".car-asignatura").append(`${materias}</div>`);
	$(".car-asignatura").removeClass("oculto")
}
const get_asignaturas = codprof => {
	$.post(
		"controlador/profesor_controlador.php?op=asignatura&usr=ext",
		{codprof:codprof},
		data => {
			if(data.status == "ok"){
				let materias = data.materias_curso;
				let cursos = data.cursos;
				mostrar_asignaturas(codprof,materias,cursos);
			}
		},"json"
	);
}
const mostrarProfesores = lista => {
	$(".main-div").empty();
	lista.forEach(l => {
		let imagen = "img/user.svg";
		if(l.perfil != "")imagen = `fotoperfil/${l.perfil}`;
		$(".main-div").append(
			`<div class="card-div">
				<div class="cuadro-div">
					<img src="${imagen}">
				</div>
				<div class="info-div">
					<p class="nombre">${l.apeprof} ${l.nompro}</p>
					<label onclick="get_asignaturas('${l.codprof}')">Asignaturas</label>
				</div>
			</div>`
		);
	})
}
const init = () => {
	$.get(
		"controlador/profesor_controlador.php?op=get_profesores&usr=ext",
		data => {
			if(data.status=="ok"){
				__profesores = data.data;
				mostrarProfesores(__profesores);
			}
		},"json"
	);
}

$(document).ready(()=>{
	init();
});