let lista_alumnos = [];
let alumno_seleccionado;
let agenda_alumno = [];
let lista_accesos = [];
let show_tabla = 1;
const request_cursos = ()=>{
	$.get(
		"controlador/cursos_controlador.php?op=get_cursos",
		datos => {
			if(datos.status == "eSession")Swal.fire("La sesión ha finalizado...\nVuelva a iniciar sesión con su usuario y contraseña.");
			if(datos.status == "noData")$('.no-cursos').removeClass('oculto');
			if (datos.status == "ok") {
				datos.cursos.forEach(curso => {
					$("#seleccionar_curso").append(
						`<option value ="${curso.codigo}">${curso.descrip}</option>`);
					$("#slcform_curso").append(
						`<option value ="${curso.codigo}">${curso.descrip}</option>`);
				});
				datos.paralelos.forEach(paralelo => {
					$("#seleccionar_paralelo").append(
						`<option value ="${paralelo.cod_par}">${paralelo.descrip}</option>`);
					$("#slcform_paralelo").append(
						`<option value ="${paralelo.cod_par}">${paralelo.descrip}</option>`);
				});
			}

		},
		"json"
		)
}
const cargar_alumnos = (codcur,codpar) => {
	$("#seleccionar_alumno").empty();
		$("#seleccionar_alumno").append(
			`<option value =""> -- Seleccionar Alumno -- </option>`
	);
	if(codcur == 0){
			lista_alumnos.forEach(alumno => {
				$("#seleccionar_alumno").append(
					`<option value ="${alumno.codalu}">${alumno.nombre}</option>`);
			});
	}

	if(codcur != 0){
		if(codpar == 0){
			lista_alumnos.forEach(alumno => {
				if(alumno.codcur == codcur){
					$("#seleccionar_alumno").append(
						`<option value ="${alumno.codalu}">${alumno.nombre}</option>`);
				}
			});
		}else{
			lista_alumnos.forEach(alumno => {
				if(alumno.codcur == codcur && alumno.codpar == codpar){
					$("#seleccionar_alumno").append(
						`<option value ="${alumno.codalu}">${alumno.nombre}</option>`);
				}
			});
		}
	}


	$('.div-selects').removeClass('oculto');
}
const set_Boletin = e =>{
	if(alumno_seleccionado == "")return;
	let estado = "F";
	if(e.checked){
		estado = "V";
	}
	$.post(
		"controlador/alumno_controlador.php?op=set_Boletin&usr=adm",
		{estado:estado,codalu:alumno_seleccionado},
		data => {
			if (data.status=="eSession")Swal.fire("La sesión ha finalizado... Vuelva a iniciar sesión con su usuario y contraseña.");
		},"json"
	);
}
const set_Plataforma = e =>{
	if(alumno_seleccionado == "")return;
	let estado = "F";
	if(e.checked){
		estado = "V";
	}
	$.post(
		"controlador/alumno_controlador.php?op=set_Plataforma&usr=adm",
		{estado:estado,codalu:alumno_seleccionado},
		data => {
			if (data.status=="eSession")Swal.fire("La sesión ha finalizado... Vuelva a iniciar sesión con su usuario y contraseña.");
		},"json"
	);
}
const set_Evaluacion = e =>{
	if(alumno_seleccionado == "")return;
	let estado = "F";
	if(e.checked){
		estado = "V";
	}
	$.post(
		"controlador/alumno_controlador.php?op=set_Evaluacion&usr=adm",
		{estado:estado,codalu:alumno_seleccionado},
		data => {
			if (data.status=="eSession")Swal.fire("La sesión ha finalizado... Vuelva a iniciar sesión con su usuario y contraseña.");
		},"json"
	);
}
const set_BoletinA = (e,codalu) =>{
	
	let estado = "F";
	if(e.checked){
		estado = "V";
	}
	$.post(
		"controlador/alumno_controlador.php?op=set_Boletin&usr=adm",
		{estado:estado,codalu:codalu},
		data => {
			if (data.status=="eSession")Swal.fire("La sesión ha finalizado... Vuelva a iniciar sesión con su usuario y contraseña.");
		},"json"
	);
}
const set_PlataformaA = (e,codalu) =>{
	
	let estado = "F";
	if(e.checked){
		estado = "V";
	}
	$.post(
		"controlador/alumno_controlador.php?op=set_Plataforma&usr=adm",
		{estado:estado,codalu:codalu},
		data => {
			if (data.status=="eSession")Swal.fire("La sesión ha finalizado... Vuelva a iniciar sesión con su usuario y contraseña.");
		},"json"
	);
}
const set_EvaluacionA = (e,codalu) =>{
	
	let estado = "F";
	if(e.checked){
		estado = "V";
	}
	$.post(
		"controlador/alumno_controlador.php?op=set_Evaluacion&usr=adm",
		{estado:estado,codalu:codalu},
		data => {
			if (data.status=="eSession")Swal.fire("La sesión ha finalizado... Vuelva a iniciar sesión con su usuario y contraseña.");
		},"json"
	);
}
const mostrar_kardex = () => {
	$(".content").addClass("oculto");
	$(".main-div-escritorio").addClass("oculto");
	$(".formulario_asignacion").addClass("oculto");
	$(".main-div-kardex-escritorio").removeClass("oculto");
}
const close_kardex = () =>{
	$(".formulario_asignacion").addClass("oculto");
	$(".main-div-kardex-escritorio").addClass("oculto");
	$(".content").removeClass("oculto");
	$(".main-div-escritorio").removeClass("oculto");
	alumno_seleccionado = "";
	$("#input-gestion").val("");
}

const get_kardex = (codalu) =>{
	alumno_seleccionado = codalu;
	if(codalu == "")return;
	let gestion = $("#input-gestion").val();
	$.post(
		"../agendadigital/get_kardex_pago.php",
		{id:codalu,gestion:gestion},
		data=>{
			if(data.status == "200"){
				$("#name-student").html(`
					Estudiante: <b>${data.alumno.paterno} ${data.alumno.materno} ${data.alumno.nombres}</b>
				`);
				$("#gestion-kardex").text(`GESTIÓN ${data.gestion}`);
				$("#body-kardex-escritorio").empty();
				let index = 1;
				$("#input-gestion").val(data.gestion);
				data.pagos.forEach(pago=>{
					$("#body-kardex-escritorio").append(
						`<tr class="onCursor">
		                    <td class="index">${index}</td>
		                    <td class="border-td2">${pago.fecha}</td>
		                    <td class="border-td2">${pago.detalle}</td>
		                    <td class="border-td right">${pago.haber}</td>
		                    <td class="border-td right">${pago.acreedor}</td>
		                </tr>`
					);
					index++;
				});

				mostrar_kardex();

			}
		},"json"
	);
}
const mostrar_lista = (codcur,codpar) => {
	show_tabla = 1;
	$("#body-escritorio").empty();
	$("#head-escritorio").empty();
	$("#head-escritorio").append(
		`<tr>
            <td>No.</td>
            <td>Nombre</td>
            <td>Código</td>
            <td class="cur">Curso</td>
            <td>Info.</td>
            <td>Kardex</td>
            <td>Agenda</td>
        </tr>`
		);
	$("#btn_lista_general").css("background","var(--c1a)");
	$("#btn_lista_general").css("border","1px solid var(--c1a)");
	$("#btn_congig").css("background","var(--c1)");
	$("#btn_congig").css("border","1px solid var(--c1)");
	if(codcur == 0){
		let index = 1;
		lista_alumnos.forEach(alumno => {
			let nombre = alumno.nombre;
			let curso = alumno.curso;
			let name = alumno.name;
			let codigo = alumno.codalu;
			$("#body-escritorio").append(`
				<tr class="onCursor" id="alu${codigo}">
                    <td class="index">${index}</td>
                    <td class="border-td2">${name}</td>
                    <td class="border-td2">${codigo}</td>
                    <td class="border-td cur">${curso}</td>
                    <td class="border-td info"><img src="svg/info.svg" onclick="get_datos_alu(${codigo});"></td>
                    <td class="border-td info"><img src="svg/kardex.svg" onclick="get_kardex(${codigo})"></td>
                    <td class="border-td info"><img src="svg/agenda.svg" onclick="get_agenda(${codigo})"></td>
                </tr>
			`);
			index++;
		});
		$(".div-table-escritorio").removeClass("oculto");
	}

	if(codcur != 0){
		let index = 1;
		if(codpar == 0){

			lista_alumnos.forEach(alumno => {
				if(alumno.codcur == codcur){
					let nombre = alumno.nombre;
					let curso = alumno.curso;
					let name = alumno.name;
					let codigo = alumno.codalu;
					$("#body-escritorio").append(`
						<tr class="onCursor" id="alu${codigo}">
		                    <td class="index">${index}</td>
		                    <td class="border-td2">${name}</td>
		                    <td class="border-td">${codigo}</td>
		                    <td class="border-td cur">${curso}</td>
		                    <td class="border-td info"><img src="svg/info.svg" onclick="get_datos_alu(${codigo});"></td>
		                    <td class="border-td info"><img src="svg/kardex.svg" onclick="get_kardex(${codigo})"></td>
		                    <td class="border-td info"><img src="svg/agenda.svg" onclick="get_agenda(${codigo})"></td>
		                </tr>
					`);
					index++;
				}
			});
			$(".div-table-escritorio").removeClass("oculto");
		}else{
			lista_alumnos.forEach(alumno => {
				if(alumno.codcur == codcur && alumno.codpar == codpar){
					let nombre = alumno.nombre;
					let curso = alumno.curso;
					let name = alumno.name;
					let codigo = alumno.codalu;
					$("#body-escritorio").append(`
						<tr class="onCursor" id="alu${codigo}">
		                    <td class="index">${index}</td>
		                    <td class="border-td2">${name}</td>
		                    <td class="border-td">${codigo}</td>
		                    <td class="border-td cur">${curso}</td>
		                    <td class="border-td info"><img src="svg/info.svg" onclick="get_datos_alu(${codigo});"></td>
		                    <td class="border-td info2"><img src="svg/kardex.svg" onclick="get_kardex(${codigo})"></td>
		                    <td class="border-td info"><img src="svg/agenda.svg" onclick="get_agenda(${codigo})"></td>
		                </tr>
					`);
					index++;
				}
			});
			$(".div-table-escritorio").removeClass("oculto");
		}
	}
}
const delete_tutor = codtut => {
	if(alumno_seleccionado == "")return;
	$.post(
		"controlador/alumno_controlador.php?op=delete_tutor&usr=adm",
		{codalu:alumno_seleccionado,codtut:codtut},
		data => {
			if (data.status=="eSession")Swal.fire("La sesión ha finalizado... Vuelva a iniciar sesión con su usuario y contraseña.");
			if(data.status == "ok"){
				cargar_tutores(data.data);
			}
		},"json"
	);
}
const cargar_tutores = tutores => {
	$("#body-tutores").empty();
	let index = 1;
	tutores.forEach(tutor => {
		let contacto = "";
		if(tutor.cel != ""){
			contacto = `<div class="contacto">${tutor.cel}
	                	<a style="display:flex;" href="https://api.whatsapp.com/send?phone=591${tutor.cel}" target="_blank">
	                        <img class="icon-option" src="svg/whatsapp.svg" width="20px">
	                    </a></div>`;
		}
		$("#body-tutores").append(
			`<tr>
                <td class="index">${index}</td>
                <td>${tutor.nombre}</td>
                <td class="ctc">${tutor.cod_tut}</td>
                <td>${contacto}</td>
                <td class="td-options">
                    <img class="icon-option" src="svg/close.svg" width="20px" onclick="delete_tutor(${tutor.cod_tut});">
                </td>
            </tr>`
		);
		index++;
	});
}
const mostrar_formulario = data => {
	let datos_alumno =  data.datos_alu;
	let tutores = data.tutores;
	$("#paterno").val(datos_alumno.paterno);
	$("#materno").val(datos_alumno.materno);
	$("#nombres").val(datos_alumno.nombres);
	$("#usuario").val(datos_alumno.usuario);
	$("#clave").val(datos_alumno.clave);
	$("#gestion").val(datos_alumno.gestion);
	$("#slcform_curso").val(datos_alumno.codcur).trigger('change');
	$("#slcform_paralelo").val(datos_alumno.codpar).trigger('change');
	$(".container-checkbox").empty();
	let boletin = datos_alumno.boletin == "VERDADERO"?"checked":"";
	let evaluacion = datos_alumno.evaluacion == "VERDADERO"?"checked":"";
	let plataforma = datos_alumno.plataforma == "VERDADERO"?"checked":"";
	
	$(".container-checkbox").append(
		`<div class="div-checkbox">
            <div style="display:flex; align-items:center;">
                <img src="images/boletin_icon.svg" alt="icono" width="40px">
                <h3 style="font-weight:normal; margin-left:10px">Boletín</h3>
            </div>
            <div class="checkbox-wrapper-64">
                <label class="switch">
                    <input type="checkbox" id="cb-boletin" onclick="set_Boletin(this);" ${boletin}>
                    <span class="slider"></span>
                </label>
            </div>
        </div>
        <div class="div-checkbox">
            <div style="display:flex; align-items:center;">
                <img src="images/icon-examen.svg" alt="icono" width="40px">
                <h3 style="font-weight:normal; margin-left:10px">Evaluación</h3>
            </div>
            <div class="checkbox-wrapper-64">
                <label class="switch">
                    <input type="checkbox" id="cb-evaluacion" onclick="set_Evaluacion(this);" ${evaluacion}>
                    <span class="slider"></span>
                </label>
            </div>
        </div>
        <div class="div-checkbox">
            <div style="display:flex; align-items:center;">
                <img src="images/plataforma_icon.svg" alt="icono" width="40px">
                <h3 style="font-weight:normal; margin-left:10px">Plataforma</h3>
            </div>
            <div class="checkbox-wrapper-64">
                <label class="switch">
                    <input type="checkbox" id="cb-plataforma" onclick="set_Plataforma(this);" ${plataforma}>
                    <span class="slider"></span>
                </label>
            </div>
        </div>`
	);
	
	cargar_tutores(tutores);
	$(".content").addClass("oculto");
	$(".main-div-escritorio").addClass("oculto");
	$(".formulario_asignacion").removeClass("oculto");
}

const close_form  = () =>{
	$(".content").removeClass("oculto");
	$(".main-div-escritorio").removeClass("oculto");
	$(".formulario_asignacion").addClass("oculto");
	alumno_seleccionado = "";
}
const get_datos_alu = codalu => {
	alumno_seleccionado = codalu;
	$.post(
		"controlador/alumno_controlador.php?op=get_datos_alumno&usr=adm",
		{codalu:codalu},
		data => {
			if(data.status == "eSession")Swal.fire("La sesión ha finalizado...\nVuelva a iniciar sesión con su usuario y contraseña.");
			if (data.status=="ok") {
				mostrar_formulario(data.data);
			}
		},"json"
	);
}
const request_alumnos = () => {
	$.get(
		"controlador/alumno_controlador.php?op=get_all&usr=adm",
		datos => {
			if(datos.status == "eSession")location.href="administracion.php";
			if(datos.status == "noData")$('.no-cursos').removeClass('oculto');
			if (datos.status == "ok") {
				lista_alumnos = datos.lista;
				cargar_alumnos(0,0);
				mostrar_lista(0,0);
			}


		},
		"json"
	)
}
const change_selects = () =>{
	let codcur = $("#seleccionar_curso").val()==""?0:$("#seleccionar_curso").val();
	let codpar = $("#seleccionar_paralelo").val() == ""?0:$("#seleccionar_paralelo").val();
	cargar_alumnos(codcur,codpar);
	if(show_tabla == 1)mostrar_lista(codcur,codpar);
	else mostrar_accesos(codcur,codpar);

}
const close_agenda = () => {
	$(".formulario_asignacion").addClass("oculto");
	$(".main-div-kardex-escritorio").addClass("oculto");
	$(".main-div-agenda-escritorio").addClass("oculto");
	$(".content").removeClass("oculto");
	$(".main-div-escritorio").removeClass("oculto");
	alumno_seleccionado = "";
}
const get_name_alumno = codalu => {
	
	for (var i = 0; i < lista_alumnos.length; i++) {
		if(lista_alumnos[i].codalu == codalu){
			return lista_alumnos[i].name;
		}
	}
	return "";
}
const filtrado = msn => {
	let fi = $("#input_date_ini").val();
	let ff = $("#input_date").val();
	if (fi == "" && ff == "")return true;
	let fecha = msn.fecha;
	let fecha_number = new Date(fecha.replace("-","/"));
	if(fi != "" && ff == ""){
		let fi_number = new Date(fi.replace("-","/"));
		
		if(fecha_number >= fi_number)return true;
		return false;
	}
	if (fi == "" && ff != "") {
		let ff_number = new Date(ff.replace("-","/"));
		if(fecha_number <= ff_number)return true;
		return false;
	}
	let fi_number = new Date(fi.replace("-","/"));
	let ff_number = new Date(ff.replace("-","/"));
	if(fecha_number >= fi_number && fecha_number <= ff_number)return true;
	return false;
}
const print_agenda = () => {
	$("#body-agenda-escritorio").printThis();
}
const mostrar_agenda = agenda =>{
	$("#body-agenda-escritorio").empty();
	$("#name-student-agenda").html(`
					Estudiante: <b>${get_name_alumno(alumno_seleccionado)}</b>
				`);
	let index = 1;
	agenda.forEach(row=>{
		if(row.emisor != "caj" && row.emisor != "caja"){
			if(filtrado(row)){
				$("#body-agenda-escritorio").append(
					`<tr class="onCursor">
		                    <td class="index">${index}</td>
		                    <td class="border-td2">${row.mensaje}</td>
		                    <td class="border-td2">${row.hora}</td>
		                    <td class="border-td">${row.emisor}</td>
		                    <td class="border-td">${row.asignatura}</td>
		                </tr>`
				);
				index++;
			}
		}
	});
	$(".content").addClass("oculto");
	$(".main-div-escritorio").addClass("oculto");
	$(".formulario_asignacion").addClass("oculto");
	$(".main-div-kardex-escritorio").addClass("oculto");
	$(".main-div-agenda-escritorio").removeClass("oculto");
}
const get_agenda = codalu => {
	alumno_seleccionado = codalu;
	$.post(
		"controlador/agenda_controlador.php?op=get_agenda",
		{codalu:codalu},
		data => {
			if(data.status == "eSession")Swal.fire("La sesión ha finalizado...\nVuelva a iniciar sesión con su usuario y contraseña.");
			if (data.status=="ok") {
				agenda_alumno = data.data;
				mostrar_agenda(data.data);
			}
		},"json"

	);
}
const search_data = () =>{
	mostrar_agenda(agenda_alumno);
}
const buscar_Alumno = () => {
	let codalu = $("#seleccionar_alumno").val();
	$("#body-escritorio").empty();
	if(codalu != ""){
		let index = 1;
		if(show_tabla == 1){
			lista_alumnos.forEach(alumno => {
					if(alumno.codalu == codalu){
						let nombre = alumno.nombre;
						let curso = alumno.curso;
						let name = alumno.name;
						let codigo = alumno.codalu;
						$("#body-escritorio").append(`
							<tr class="onCursor" id="alu${codigo}">
			                    <td class="index">${index}</td>
			                    <td class="border-td2">${name}</td>
			                    <td class="border-td">${codigo}</td>
			                    <td class="border-td cur">${curso}</td>
			                    <td class="border-td info"><img src="svg/info.svg" onclick="get_datos_alu(${codigo});"></td>
			                    <td class="border-td info2"><img src="svg/kardex.svg" onclick="get_kardex(${codigo})"></td>
			                    <td class="border-td info"><img src="svg/agenda.svg" onclick="get_agenda(${codigo})"></td>
			                </tr>
						`);
						index++;
					}
				});
			}else{
				lista_accesos.forEach(alumno => {
					if(alumno.codalu == codalu){
						let nombre = alumno.nombre;
						let curso = alumno.curso;
						let codigo = alumno.codalu;
						let plataforma = alumno.plataforma == "VERDADERO"?`<div class="checkbox-wrapper-64">
														                      <label class="switch">
														                        <input type="checkbox" checked id="cb-plataforma" onclick="set_PlataformaA(this,${codigo});">
														                        <span class="slider"></span>
														                      </label>
														                    </div>`:`<div class="checkbox-wrapper-64">
														                      <label class="switch">
														                        <input type="checkbox" id="cb-plataforma" onclick="set_PlataformaA(this,${codigo});">
														                        <span class="slider"></span>
														                      </label>
														                    </div>`;
						let boletin = alumno.boletin == "VERDADERO"?`<div class="checkbox-wrapper-64">
													                      <label class="switch">
													                        <input type="checkbox" id="cb-boletin" checked onclick="set_BoletinA(this,${codigo});">
													                        <span class="slider"></span>
													                      </label>
													                    </div>`:`<div class="checkbox-wrapper-64">
													                      <label class="switch">
													                        <input type="checkbox" id="cb-boletin" onclick="set_BoletinA(this,${codigo});">
													                        <span class="slider"></span>
													                      </label>
													                    </div>`;
						let evaluacion = alumno.evaluacion == "VERDADERO"?`<div class="checkbox-wrapper-64">
														                      <label class="switch">
														                        <input type="checkbox" checked id="cb-evaluacion" onclick="set_EvaluacionA(this,${codigo});">
														                        <span class="slider"></span>
														                      </label>
														                    </div>`:`<div class="checkbox-wrapper-64">
														                      <label class="switch">
														                        <input type="checkbox" id="cb-evaluacion" onclick="set_EvaluacionA(this,${codigo});">
														                        <span class="slider"></span>
														                      </label>
														                    </div>`;
						$("#body-escritorio").append(`
							<tr class="onCursor" id="alu${codigo}">
			                    <td class="index">${index}</td>
			                    <td class="border-td2">${nombre}</td>
			                    <td class="border-td2">${codigo}</td>
			                    <td class="border-td cur">${curso}</td>
			                    <td class="border-td info">${plataforma}</td>
			                    <td class="border-td info">${boletin}</td>
			                    <td class="border-td info">${evaluacion}</td>
			                </tr>
						`);
						index++;
					}
				});
			}
			$(".div-table-escritorio").removeClass("oculto");
	}else{
		change_selects();
	}
}
const actualizar_datos = () => {
	let paterno = $("#paterno").val();
	let materno = $("#materno").val();
	let nombres = $("#nombres").val();
	let usuario = $("#usuario").val();
	let clave = $("#clave").val();
	let gestion = $("#gestion").val();
	let codcur = $("#slcform_curso").val();
	let codpar = $("#slcform_paralelo").val();

	if(paterno == ""){
		$("#paterno").focus();
		Swal.fire("Debe ingresar apellido paterno...");
		return;
	}
	if(materno == ""){
		$("#materno").focus();
		Swal.fire("Debe ingresar apellido materno...");
		return;
	}
	if(nombres == ""){
		$("#nombres").focus();
		Swal.fire("Debe ingresar nombre(s) del alumno...");
		return;
	}
	if(usuario == ""){
		$("#usuario").focus();
		Swal.fire("Debe asignar usuario al alumno...");
		return;
	}
	if(clave == ""){
		$("#clave").focus();
		Swal.fire("Debe asignar una clave para el alumno...");
		return;
	}
	if(gestion == ""){
		$("#gestion").focus();
		Swal.fire("Debe asignar gestión...");
		return;
	}
	if(codcur == ""){
		$("#slcform_curso").focus();
		Swal.fire("Debe asignar curso...");
		return;
	}
	if(codpar == ""){
		$("#slcform_paralelo").focus();
		Swal.fire("Debe asignar paralelo...");
		return;
	}
	$.post(
		"controlador/alumno_controlador.php?op=update_data_alumno&usr=adm",
		{
			codalu:alumno_seleccionado,
			paterno:paterno,
			materno:materno,
			nombres:nombres,
			usuario:usuario,
			clave:clave,
			gestion:gestion,
			codcur:codcur,
			codpar:codpar
		},
		data => {
			if(data.status == "eSession")Swal.fire("La sesión ha finalizado...\nVuelva a iniciar sesión con su usuario y contraseña.");
			if(data.status == "ok")Swal.fire("Datos actualizados...");
		},"json"
	);
}
const asignar_tutor = () =>{
	let codtut = $("#seleccionar_tutor").val();
	if(alumno_seleccionado == "" || codtut == "")return;
	$.post(
		"controlador/alumno_controlador.php?op=asignar_tutor&usr=adm",
		{codalu:alumno_seleccionado,codtut:codtut},
		data => {
			if(data.status == "eSession")Swal.fire("La sesión ha finalizado...\nVuelva a iniciar sesión con su usuario y contraseña.");
			if(data.status == "ok"){
				cargar_tutores(data.data);
				$("#seleccionar_tutor").val("").trigger('change');
			}
		},"json"
	);
}
const request_tutores = () => {
	$.get(
		"controlador/tutor_controlador.php?op=get_tutores&usr=adm",
		data => {
			if(data.status == "eSession")Swal.fire("La sesión ha finalizado...\nVuelva a iniciar sesión con su usuario y contraseña.");
			if(data.status == "ok"){
				let tutores = data.data;
				tutores.forEach(tutor=>{
					$("#seleccionar_tutor").append(
						`<option value="${tutor.codtut}">${tutor.paterno} ${tutor.materno} ${tutor.nombres}</option>`
					);
				})
				
			}
		},"json"
	);
}
const mostrar_accesos = (codcur,codpar) => {
	$("#btn_congig").css("background","var(--c1a)");
	$("#btn_congig").css("border","1px solid var(--c1a)");
	$("#btn_lista_general").css("background","var(--c1)");
	$("#btn_lista_general").css("border","1px solid var(--c1)");
	$("#body-escritorio").empty();
	$("#head-escritorio").empty();
	$("#head-escritorio").append(
		`<tr>
	        <td>No.</td>
	        <td>Nombre</td>
	        <td>Código</td>
	        <td class="cur">Curso</td>
	        <td>Plataforma</td>
	        <td>Evaluación</td>
	        <td>Boletín</td>
	    </tr>`
	);
	if(codcur == 0){
		let index = 1;
		lista_accesos.forEach(alumno => {
			let nombre = alumno.nombre;
			let curso = alumno.curso;
			let codigo = alumno.codalu;
			let plataforma = alumno.plataforma == "VERDADERO"?`<div class="checkbox-wrapper-64">
											                      <label class="switch">
											                        <input type="checkbox" checked id="cb-plataforma" onclick="set_PlataformaA(this,${codigo});">
											                        <span class="slider"></span>
											                      </label>
											                    </div>`:`<div class="checkbox-wrapper-64">
											                      <label class="switch">
											                        <input type="checkbox" id="cb-plataforma" onclick="set_PlataformaA(this,${codigo});">
											                        <span class="slider"></span>
											                      </label>
											                    </div>`;
			let boletin = alumno.boletin == "VERDADERO"?`<div class="checkbox-wrapper-64">
										                      <label class="switch">
										                        <input type="checkbox" id="cb-boletin" checked onclick="set_BoletinA(this,${codigo});">
										                        <span class="slider"></span>
										                      </label>
										                    </div>`:`<div class="checkbox-wrapper-64">
										                      <label class="switch">
										                        <input type="checkbox" id="cb-boletin" onclick="set_BoletinA(this,${codigo});">
										                        <span class="slider"></span>
										                      </label>
										                    </div>`;
			let evaluacion = alumno.evaluacion == "VERDADERO"?`<div class="checkbox-wrapper-64">
											                      <label class="switch">
											                        <input type="checkbox" checked id="cb-evaluacion" onclick="set_EvaluacionA(this,${codigo});">
											                        <span class="slider"></span>
											                      </label>
											                    </div>`:`<div class="checkbox-wrapper-64">
											                      <label class="switch">
											                        <input type="checkbox" id="cb-evaluacion" onclick="set_EvaluacionA(this,${codigo});">
											                        <span class="slider"></span>
											                      </label>
											                    </div>`;
			$("#body-escritorio").append(`
				<tr class="onCursor" id="alu${codigo}">
                    <td class="index">${index}</td>
                    <td class="border-td2">${nombre}</td>
                    <td class="border-td2">${codigo}</td>
                    <td class="border-td cur">${curso}</td>
                    <td class="border-td info">${plataforma}</td>
                    <td class="border-td info">${boletin}</td>
                    <td class="border-td info">${evaluacion}</td>
                </tr>
			`);
			index++;
		});
	}

	if(codcur != 0){
		let index = 1;
		if(codpar == 0){

			lista_accesos.forEach(alumno => {
				if(alumno.codcur == codcur){
					let nombre = alumno.nombre;
					let curso = alumno.curso;
					let codigo = alumno.codalu;
					let plataforma = alumno.plataforma == "VERDADERO"?`<div class="checkbox-wrapper-64">
													                      <label class="switch">
													                        <input type="checkbox" checked id="cb-plataforma" onclick="set_PlataformaA(this,${codigo});">
													                        <span class="slider"></span>
													                      </label>
													                    </div>`:`<div class="checkbox-wrapper-64">
													                      <label class="switch">
													                        <input type="checkbox" id="cb-plataforma" onclick="set_PlataformaA(this,${codigo});">
													                        <span class="slider"></span>
													                      </label>
													                    </div>`;
					let boletin = alumno.boletin == "VERDADERO"?`<div class="checkbox-wrapper-64">
												                      <label class="switch">
												                        <input type="checkbox" id="cb-boletin" checked onclick="set_BoletinA(this,${codigo});">
												                        <span class="slider"></span>
												                      </label>
												                    </div>`:`<div class="checkbox-wrapper-64">
												                      <label class="switch">
												                        <input type="checkbox" id="cb-boletin" onclick="set_BoletinA(this,${codigo});">
												                        <span class="slider"></span>
												                      </label>
												                    </div>`;
					let evaluacion = alumno.evaluacion == "VERDADERO"?`<div class="checkbox-wrapper-64">
													                      <label class="switch">
													                        <input type="checkbox" checked id="cb-evaluacion" onclick="set_EvaluacionA(this,${codigo});">
													                        <span class="slider"></span>
													                      </label>
													                    </div>`:`<div class="checkbox-wrapper-64">
													                      <label class="switch">
													                        <input type="checkbox" id="cb-evaluacion" onclick="set_EvaluacionA(this,${codigo});">
													                        <span class="slider"></span>
													                      </label>
													                    </div>`;
					$("#body-escritorio").append(`
						<tr class="onCursor" id="alu${codigo}">
		                    <td class="index">${index}</td>
		                    <td class="border-td2">${nombre}</td>
		                    <td class="border-td">${codigo}</td>
		                    <td class="border-td cur">${curso}</td>
		                    <td class="border-td info">${plataforma}</td>
		                    <td class="border-td info">${boletin}</td>
		                    <td class="border-td info">${evaluacion}</td>
		                </tr>
					`);
					index++;
				}
			});
			$(".div-table-escritorio").removeClass("oculto");
		}else{
			lista_accesos.forEach(alumno => {
				if(alumno.codcur == codcur && alumno.codpar == codpar){
					let nombre = alumno.nombre;
					let curso = alumno.curso;
					let codigo = alumno.codalu;
					let plataforma = alumno.plataforma == "VERDADERO"?`<div class="checkbox-wrapper-64">
													                      <label class="switch">
													                        <input type="checkbox" checked id="cb-plataforma" onclick="set_PlataformaA(this,${codigo});">
													                        <span class="slider"></span>
													                      </label>
													                    </div>`:`<div class="checkbox-wrapper-64">
													                      <label class="switch">
													                        <input type="checkbox" id="cb-plataforma" onclick="set_PlataformaA(this,${codigo});">
													                        <span class="slider"></span>
													                      </label>
													                    </div>`;
					let boletin = alumno.boletin == "VERDADERO"?`<div class="checkbox-wrapper-64">
												                      <label class="switch">
												                        <input type="checkbox" id="cb-boletin" checked onclick="set_BoletinA(this,${codigo});">
												                        <span class="slider"></span>
												                      </label>
												                    </div>`:`<div class="checkbox-wrapper-64">
												                      <label class="switch">
												                        <input type="checkbox" id="cb-boletin" onclick="set_BoletinA(this,${codigo});">
												                        <span class="slider"></span>
												                      </label>
												                    </div>`;
					let evaluacion = alumno.evaluacion == "VERDADERO"?`<div class="checkbox-wrapper-64">
													                      <label class="switch">
													                        <input type="checkbox" checked id="cb-evaluacion" onclick="set_EvaluacionA(this,${codigo});">
													                        <span class="slider"></span>
													                      </label>
													                    </div>`:`<div class="checkbox-wrapper-64">
													                      <label class="switch">
													                        <input type="checkbox" id="cb-evaluacion" onclick="set_EvaluacionA(this,${codigo});">
													                        <span class="slider"></span>
													                      </label>
													                    </div>`;
					$("#body-escritorio").append(`
						<tr class="onCursor" id="alu${codigo}">
		                    <td class="index">${index}</td>
		                    <td class="border-td2">${nombre}</td>
		                    <td class="border-td">${codigo}</td>
		                    <td class="border-td cur">${curso}</td>
		                    <td class="border-td info">${plataforma}</td>
		                    <td class="border-td info">${boletin}</td>
		                    <td class="border-td info">${evaluacion}</td>
		                </tr>
					`);
					index++;
				}
			});
			$(".div-table-escritorio").removeClass("oculto");
		}
	}
}
const get_accesos = () =>{
	show_tabla = 2;
	$.get(
		"controlador/alumno_controlador.php?op=get_access_all&usr=adm",
		data => {
			if (data.status=="eSession")Swal.fire("La sesión ha finalizado... Vuelva a iniciar sesión con su usuario y contraseña.");
			if (data.status == "ok") {
				lista_accesos = data.lista;
				mostrar_accesos($("#seleccionar_curso").val(),$("#seleccionar_paralelo").val());
			}
		},"json"
		);
	

}
$(document).ready(()=>{
	request_cursos();
	request_alumnos();
	request_tutores();
	$("#seleccionar_curso").change(()=>{change_selects();});
	$("#seleccionar_paralelo").change(()=>{change_selects();});
	$("#seleccionar_alumno").change(()=>{buscar_Alumno();});
	$("#formulario").submit(e=>{
		e.preventDefault();
	});
	$("#btn-update-datos").click(()=>{actualizar_datos()});
	$("#btn-asignar").click(()=>{asignar_tutor()});
	$("#btn-gestion").click(()=>{get_kardex(alumno_seleccionado)});
	$("#btn_congig").click(()=>{get_accesos()});
	$("#btn_lista_general").click(()=>{mostrar_lista($("#seleccionar_curso").val(),$("#seleccionar_paralelo").val())});
});