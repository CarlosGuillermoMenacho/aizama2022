let listaCursos = [];
let listaParalelos = []; 
let listaMaterias = [];
let listaProfesores = [];
let listaHorario = [];
let listaPeriodos = [];
let listaProfesoresHorario = [];
let dias = ["","Lunes","Martes","Miércoles","Juéves","Viernes","Sábado"];
let periodo_seleccionado = "";
let dia_seleccionado = "";
const get_profesores = () => {
	$.post(
		"controlador/profesor_controlador.php?usr=doc&op=gap",
		data =>{
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión por favor...");
				return;
			}
			if (data.status == "ok") {
				listaProfesores = data.data;
			}
		},
		"json"
	);
}
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
const get_materias = () => {
	$.get(
		"controlador/materias_controlador.php?usr=adm&op=get_materias",
		data => {
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión por favor...");
				return;
			}
			if (data.status == "ok") {
				listaMaterias = data.data;
			}
		},"json"
	);
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
const cargar_profesores = () => {
	$("#seleccionar_profesor").empty();
	$("#seleccionar_profesor").append('<option value=""> -- Seleccionar Profesor -- </option>');
	$("#seleccionar_profesor_movil").empty();
	$("#seleccionar_profesor_movil").append('<option value=""> -- Seleccionar Profesor -- </option>');
	listaProfesores.forEach(profesor => {
		$("#seleccionar_profesor").append(`<option value="${profesor.CODPROF}">${profesor.CODPROF} ${profesor.APEPRO} ${profesor.NOMPRO} </option>`);
		$("#seleccionar_profesor_movil").append(`<option value="${profesor.CODPROF}">${profesor.CODPROF} ${profesor.APEPRO} ${profesor.NOMPRO} </option>`);
	});

}
const get_nombre = codprof => {
		
	for (var i = 0; i < listaProfesores.length; i++) {
		if(listaProfesores[i].CODPROF == codprof)return `${listaProfesores[i].APEPRO} ${listaProfesores[i].NOMPRO}`;
	}
	return "";
}
const get_profesor = codclase => {
	for (var i = 0; i < listaProfesoresHorario.length; i++) {
		if(listaProfesoresHorario[i].codclase == codclase){
			return get_nombre(listaProfesoresHorario[i].codprof);
		}
	}
	return "";
}
const get_materia = codmat => {
	for (var i = 0; i < listaMaterias.length; i++) {
		if(listaMaterias[i].codmat == codmat)return listaMaterias[i].nombre;
	}
	return "";
}
const get_datos = (dia,periodo) => {
	for (var i = 0; i < listaHorario.length; i++) {
		if(listaHorario[i].periodo == periodo && listaHorario[i].dia == dia){
			let codclase = listaHorario[i].id;
			let materia = get_materia(listaHorario[i].codmat);
			let profesor = get_profesor(codclase);
			return `<label class="materia pointer">${materia}</label><br><label class="profesor pointer">${profesor}</label>`;

		}
	}
	return "";
}
const cargar_tabla_escritorio = ()=>{
	$("#body-escritorio").empty();
	listaPeriodos.forEach(periodo => {
		let horai = periodo.horai;
		let horaf = periodo.horaf;
		if(periodo.periodo == 0){
			$("#body-escritorio").append(`
				<tr>
	                <td class="index"></td>
	                <td class="border-td2 center">${horai} a ${horaf}</td>
	                <td class="border-td center">RECREO</td>
	                <td class="border-td center">RECREO</td>
	                <td class="border-td center">RECREO</td>
	                <td class="border-td center">RECREO</td>
	                <td class="border-td center">RECREO</td>
	                <td class="border-td center">RECREO</td>
	            </tr>
			`);	
		}else{
			$("#body-escritorio").append(`
				<tr>
	                <td class="index">${periodo.periodo}</td>
	                <td class="border-td2 center">${horai} a ${horaf}</td>
	                <td class="border-td pointer" onclick="get_info(1,${periodo.periodo});"><div class="content-periodo pointer">${get_datos(1,periodo.periodo)}</div></td>
	                <td class="border-td pointer" onclick="get_info(2,${periodo.periodo});"><div class="content-periodo pointer">${get_datos(2,periodo.periodo)}</div></td>
	                <td class="border-td pointer" onclick="get_info(3,${periodo.periodo});"><div class="content-periodo pointer">${get_datos(3,periodo.periodo)}</div></td>
	                <td class="border-td pointer" onclick="get_info(4,${periodo.periodo});"><div class="content-periodo pointer">${get_datos(4,periodo.periodo)}</div></td>
	                <td class="border-td pointer" onclick="get_info(5,${periodo.periodo});"><div class="content-periodo pointer">${get_datos(5,periodo.periodo)}</div></td>
	                <td class="border-td pointer" onclick="get_info(6,${periodo.periodo});"><div class="content-periodo pointer">${get_datos(6,periodo.periodo)}</div></td>
	            </tr>
			`);	
		}
	});
	$(".div-table-escritorio").removeClass("oculto");
}
const cargar_tabla_movil = () =>{
	$(".div-table-movil").empty();
	for (var i = 1; i <= 6; i++) {
		let tr = "";
		listaPeriodos.forEach(periodo =>{
			if(periodo.periodo == 0){
				tr = `${tr}<tr>
	                        	<td class="index"></td>
	                        	<td class="border-td2 center">${periodo.horai} a ${periodo.horaf}</td>
	                        	<td class="border-td center">RECREO</td>
	                    	</tr>`;
			}else{
				tr = `${tr}<tr>
	                        	<td class="index">${periodo.periodo}</td>
	                        	<td class="border-td2 center">${periodo.horai} a ${periodo.horaf}</td>
	                        	<td class="border-td pointer" onclick="get_info(${i},${periodo.periodo});">${get_datos(i,periodo.periodo)}</td>
	                    	</tr>`;
			}
		});
		$(".div-table-movil").append(`
			<table class="table-movil">
                <thead class="thead-movil">
                    <tr>
                        <td class="center">Peri.</td>
                        <td class="center">Hora</td>
                        <td class="center">${dias[i]}</td>
                    </tr>
                </thead>
                <tbody class="tbody-movil" id="body-lunes">
                    ${tr}
                </tbody>
            </table>
		`);
	}
	$(".div-table-movil").removeClass("oculto");

}
const mostrar_horario = () => {
	cargar_tabla_escritorio();
	cargar_tabla_movil();
}
const get_horario = () => {
	
	let codcur = $("#select_curso").val();
	let codpar = $("#select_paralelo").val();
	if(codcur != "" && codpar != ""){
		$.post(
			"controlador/horario_controlador.php?usr=doc&op=get_horario_curso",
			{codcur:codcur,codpar:codpar},
			data =>{
				if (data.status == "eSession") {
					Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión por favor...");
					return;
				}
				if (data.status == "ok") {
					listaHorario = data.data.horario;
					listaPeriodos = data.data.periodos;
					listaProfesoresHorario = data.data.profesores;
					mostrar_horario();
				}
			},
			"json"
		);
	}
}
const get_nivel = codcur => {
	for (var i = 0; i < listaCursos.length; i++) {
		
		if(listaCursos[i].codigo == codcur)return listaCursos[i].cod_niv;
	}

	return "";
}
const cargar_materias = nivel => {
	listaMaterias.forEach(materia => {
		if(materia.nivel == nivel){
			$("#seleccionar_materia").append(`<option value="${materia.codmat}">${materia.nombre}</option>`);
			$("#seleccionar_materia_movil").append(`<option value="${materia.codmat}">${materia.nombre}</option>`);
		}
	});
}
const info_periodo = periodo =>{
	for (var i = 0; i < listaPeriodos.length; i++) {
		if(listaPeriodos[i].periodo == periodo){
			return `${listaPeriodos[i].horai} a ${listaPeriodos[i].horaf}`;
		}
	}
	return "";
}
const get_horario_datos = (dia,periodo) => {
	for (var i = 0; i < listaHorario.length; i++) {
		if(listaHorario[i].dia == dia && listaHorario[i].periodo == periodo){
			return listaHorario[i];
		}
	}
	return "";
}
const get_profesor_horario = codclase => {
	for (var i = 0; i < listaProfesoresHorario.length; i++) {
		if(listaProfesoresHorario[i].codclase == codclase){
			return listaProfesoresHorario[i];
		}
	}
	return "";
}
const get_info = (dia,periodo) => {
	let codcur = $("#select_curso").val();
	if(codcur == "")return;
	dia_seleccionado = dia;
	periodo_seleccionado = periodo;
	let info = `${dias[dia]} ${info_periodo(periodo)}`;
	$("#info").html(info);
	$("#info_movil").html(info);
	cargar_materias(get_nivel(codcur));
	cargar_profesores();
	let horario = get_horario_datos(dia,periodo);
	if(horario != ""){
		$(".btn-delet").removeClass("oculto");
		let codmat = horario.codmat;
		$("#seleccionar_materia").val(codmat).trigger('change');
		$("#seleccionar_materia_movil").val(codmat).trigger('change');
		let codclase = horario.id;
		let profesor_horario = get_profesor_horario(codclase);
		if(profesor_horario != ""){
			let codprof = profesor_horario.codprof;
			$("#seleccionar_profesor").val(codprof).trigger('change');
			$("#seleccionar_profesor_movil").val(codprof).trigger('change');
		}
	}else{
		$(".btn-delet").addClass("oculto");
	}
	$(".formulario_asignacion").removeClass("oculto");
	$(".formulario_asignacion_movil").removeClass("oculto");
}
const close_form = () => {
	cargar_profesores();
	$("#seleccionar_materia").empty();
	$("#seleccionar_materia").append('<option value=""> -- Seleccionar Materia -- </option>');
	$("#seleccionar_materia_movil").empty();
	$("#seleccionar_materia_movil").append('<option value=""> -- Seleccionar Materia -- </option>');
	$(".formulario_asignacion").addClass("oculto");
	$(".formulario_asignacion_movil").addClass("oculto");
}
const asignar_horario = () => {
	let codcur = $("#select_curso").val();
	let codpar = $("#select_paralelo").val();
	let codmat = $("#seleccionar_materia").val();
	let codprof = $("#seleccionar_profesor").val();
	if(codcur == "" || codpar == ""){
		Swal.fire("Debe seleccionar curso y paralelo...");
		return;
	}
	if(codmat == ""){
		Swal.fire("Debe seleccionar al menos la materia");
		return;	
	}

	$.post(
		"controlador/horario_controlador.php?op=asignar_horario",
		{
			codcur:codcur,
			codpar:codpar,
			codmat:codmat,
			dia:dia_seleccionado,
			periodo:periodo_seleccionado,
			codprof:codprof
		},
		data =>{
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión por favor...");
				return;
			}
			if(data.status == "ok"){
				get_horario();
				close_form();
			}
		},
		"json"
		);
}
const asignar_horario_movil = () => {
	let codcur = $("#select_curso").val();
	let codpar = $("#select_paralelo").val();
	let codmat = $("#seleccionar_materia_movil").val();
	let codprof = $("#seleccionar_profesor_movil").val();
	if(codcur == "" || codpar == ""){
		Swal.fire("Debe seleccionar curso y paralelo...");
		return;
	}
	if(codmat == ""){
		Swal.fire("Debe seleccionar al menos la materia");
		return;	
	}

	$.post(
		"controlador/horario_controlador.php?op=asignar_horario",
		{
			codcur:codcur,
			codpar:codpar,
			codmat:codmat,
			dia:dia_seleccionado,
			periodo:periodo_seleccionado,
			codprof:codprof
		},
		data =>{
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión por favor...");
				return;
			}
			if(data.status == "ok"){
				get_horario();
				close_form();
			}
		},
		"json"
		);
}
const delete_horario = (dia,periodo) => {
	let registro = get_horario_datos(dia,periodo);
	if(registro != ""){
		let id = registro.id;
		$.post(
			"controlador/horario_controlador.php?op=delete",
			{id:id},
			data => {
				if (data.status == "eSession") {
					Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión por favor...");
					return;
				}
				if(data.status == "ok"){
					get_horario();
					close_form();
				}

			},
			"json"
		);
	}
}
$(document).ready(()=>{
	get_cursos();
	get_materias();
	get_profesores();
	get_horario();
	$("#select_curso").change(()=>{
		$(".div-table-escritorio").addClass("oculto");
		$(".div-table-movil").addClass("oculto");
		close_form();
		get_horario();
	});
	$("#select_paralelo").change(()=>{
		$(".div-table-escritorio").addClass("oculto");
		$(".div-table-movil").addClass("oculto");
		close_form();
		get_horario();
	});
	$("#formulario").submit(e=>{e.preventDefault()});
	$("#formulario_movil").submit(e=>{e.preventDefault()});
	$("#btn-aceptar").click(()=>{asignar_horario()});
	$("#btn-aceptar-movil").click(()=>{asignar_horario_movil()});
	$(".btn-refresh-movil").click(() => {
		$(".div-table-escritorio").addClass("oculto");
		$(".div-table-movil").addClass("oculto");
		close_form();
		get_horario();});
	$(".btn-refresh").click(() => {
		$(".div-table-escritorio").addClass("oculto");
		$(".div-table-movil").addClass("oculto");
		close_form();get_horario();
	});
	$(".btn-delet").click(()=>{delete_horario(dia_seleccionado,periodo_seleccionado);});
	let h = $(window).height();
	console.log(h)
	$(".div-table-movil").height(h - 200);
});