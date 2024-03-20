let __CURSOS = [];
let __MATERIAS = [];
const get_curso = (c,p) => {
	for (var i = 0; i < __CURSOS.length; i++) {
		if(__CURSOS[i].codcur == c && __CURSOS[i].codpar == p)return __CURSOS[i];
	}
	return false;
}
const get_evaluaciones = (c,p,m) => {
	
}
const mostrar_lista_materias = (l,c,p) => {
	$(".lista-materias").empty();
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
						<span class="underline">Evaluaciones</span>
						<span class="badget" onclick="get_evaluaciones(${c},${p},'${m.codmat}')">${m.evaluaciones}</span>
					</div>
					<div class="item">
						<span class="underline">Prácticos</span>
						<span class="badget">${m.practicos}</span>
					</div>
					<div class="item">
						<span class="underline">Material de apoyo</span>
						<span class="badget">${m.material}</span>
					</div>
				</div>
			</div>`
		);
	})
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