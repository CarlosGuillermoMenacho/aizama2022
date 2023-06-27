let lista_cursos = [];
let lista_materias = [];
let lista_actividades = [];
let curso_seleccionado;
let paralelo_seleccionado;
let materia_seleccionada;
let indice_selccionado;
let actividad_seleccionada;
const obtener_cursos = ()=>{
	$.post(
			"controlador/profesor_controlador.php?usr=doc&op=get_cursos",
			datos=>{
				lista_cursos = datos.cursos;
				mostrarCursos();
			},
			"json"
			);
}

const contarMaterias = (codcur,codpar)=>{
	let n = 0;
	lista_curso_materias.forEach(cur_mat=>{
		if(cur_mat.codcur==codcur&cur_mat.codpar==codpar)n++;
	})
	return n;
}
const mostrarCursos = ()=>{
	$("#lista_cursos").empty();
	let indice = 0;
	lista_cursos.forEach(fila=>{
		let nombre = fila.nombre;
		let codcur = fila.codcur;
		let codpar = fila.codpar;
		let materias = fila.materias;
		$("#lista_cursos").append(
			`<div class="item-curso" onclick="ver_materias(${indice})">
				<div class="icon-index">${materias}</div>
				<div class="nombre-curso">${nombre}</div>
				<div class="icon-arrow"><img src="svg/chevron-right.svg"></div>
			</div>`
			
		);
		indice++;
	})
	if(lista_cursos.length>0){
		$('#lc').removeClass('active');
		$('#lm').addClass('active');
		$('#la').addClass('active');
		$('#div_detalle').addClass('active');
		$('#btn-cursos').removeClass('active');
		$('#btn-curso').addClass('active');
		$('#btn-materia').addClass('active');
		$('#btn-actividad').addClass('active');
	}
}
const ver_materias = id =>{
	indice_selccionado = id;
	curso_seleccionado = lista_cursos[id].codcur;
	paralelo_seleccionado = lista_cursos[id].codpar;
	$.post(
			"controlador/profesor_controlador.php?usr=doc&op=get_materias",
			{codcur:curso_seleccionado,codpar:paralelo_seleccionado},
			data=>{
				if(data.status == "ok"){
					lista_materias = data.lista;
					mostrarMaterias();
				}
			},
			"json"
			);
}
const mostrarMaterias = ()=>{

	$("#lista_materias").empty();
	lista_materias.forEach(fila=>{
		let nombre = fila.nombre;
		let codmat = fila.codmat;
		let actividades = fila.actividades;

		$("#lista_materias").append(
			`<div class="item-curso" onclick="ver_actividades('${codmat}')">
				<div class="icon-index">${actividades}</div>
				<div class="nombre-curso">${nombre}</div>
				<div class="icon-arrow"><img src="svg/chevron-right.svg"></div>
			</div>`
			
		);
	})
	if(lista_materias.length>0){
		$('#lc').addClass('active');
		$('#lm').removeClass('active');
		$('#la').addClass('active');
		$('#div_detalle').addClass('active');
		$('#btn-cursos').removeClass('active');
		$('#btn-curso').text(`materias de ${getNombreCurso(curso_seleccionado,paralelo_seleccionado)}`);
		$('#btn-curso').removeClass('active');
		$('#btn-materia').addClass('active');
		$('#btn-actividad').addClass('active');
	}
}
const getNombreCurso = (codcur,codpar)=>{
	for (var i = 0; i < lista_cursos.length; i++) {
		if(lista_cursos[i].codcur==codcur&lista_cursos[i].codpar==codpar){
			return lista_cursos[i].nombre;
		}
	}
	return "Sin Nombre";
}
const ver_actividades = codmat=>{
	materia_seleccionada = codmat;
	$.post(
			"controlador/profesor_controlador.php?usr=doc&op=get_actividades",
			{codcur:curso_seleccionado,codpar:paralelo_seleccionado,codmat:materia_seleccionada},
			data =>{
				if(data.status=="ok"){
					lista_actividades = data.lista;
					mostrar_actividades();
				}
			},
			"json"
		);
}
const mostrar_actividades = ()=>{
	$("#lista_actividades").empty();
	let i = 1;
	lista_actividades.forEach(fila=>{
		let descripcion = fila.descripcion;
		let id = fila.id;
		let actividades = fila.actividades;

		$("#lista_actividades").append(
			`<div class="item-curso" onclick="ver_actividad(${id})">
				<div class="icon-index">${i}</div>
				<div class="descripcion">${descripcion}</div>
				<div class="icon-arrow"><img src="svg/chevron-right.svg"></div>
			</div>`
			
		);
		i++;
	})
	if(lista_actividades.length>0){
		$('#lc').addClass('active');
		$('#lm').addClass('active');
		$('#la').removeClass('active');
		$('#div_detalle').addClass('active');
		$('#btn-cursos').removeClass('active');
		$('#btn-curso').removeClass('active');
		$('#btn-materia').removeClass('active');
		$('#btn-materia').text(`actividades de ${getNombreMateria(materia_seleccionada)}`);
		$('#btn-actividad').addClass('active');
	}else{
		$('#lc').addClass('active');
		$('#lm').addClass('active');
		$('#la').removeClass('active');
		$('#div_detalle').addClass('active');
		$('#btn-cursos').removeClass('active');
		$('#btn-curso').removeClass('active');
		$('#btn-materia').removeClass('active');
		$('#btn-materia').text(`actividades de ${getNombreMateria(materia_seleccionada)}`);
		$('#btn-actividad').addClass('active');
		Swal.fire("No hay actividades...");
	}
}
const getNombreMateria = codmat=>{
	for (var i = 0; i < lista_materias.length; i++) {
		if(lista_materias[i].codmat==codmat)return lista_materias[i].nombre;
	}
	return "Sin Nombre";
}
const ver_actividad = id=>{
	actividad_seleccionada = id;
	let datos_actividad = get_actividad(id);
	if (datos_actividad) {
		$('#form_curso').text(getNombreCurso(curso_seleccionado,paralelo_seleccionado));
		$('#form_materia').text(getNombreMateria(materia_seleccionada));
		$('#descripcion').val(datos_actividad.descripcion);
		$('#fecha').val(datos_actividad.fecha);
		$('#horai').val(datos_actividad.horai);
		$('#horaf').val(datos_actividad.horaf);

		$('#lc').addClass('active');
		$('#lm').addClass('active');
		$('#la').addClass('active');
		$('#div_detalle').removeClass('active');
		$('#btn-guardar').addClass('active');
		$('#btn-actualizar').removeClass('active');
		$('#btn_delete').removeClass('active');
	}
}
const get_actividad = id =>{
	for (var i = 0; i < lista_actividades.length; i++) {
		if(lista_actividades[i].id == id)return lista_actividades[i];
	}
	return false;
}
const limpiar_form = ()=>{
	$('#descripcion').val("");
	$('#fecha').val("");
	$('#horai').val("");
	$('#horaf').val("");
}
const form_nueva_actividad = ()=>{
	limpiar_form();
	$('#lc').addClass('active');
	$('#lm').addClass('active');
	$('#la').addClass('active');
	$('#form_curso').text(getNombreCurso(curso_seleccionado,paralelo_seleccionado));
	$('#form_materia').text(getNombreMateria(materia_seleccionada));
	$('#div_detalle').removeClass('active');
	$('#btn-guardar').removeClass('active');
	$('#btn-actualizar').addClass('active');
	$('#btn_delete').addClass('active');

}
const guardar_actividad = ()=>{
	if(validar_form()){
		let formData = new FormData($('#form_detalle')[0]);
		formData.append("codcur",curso_seleccionado);
		formData.append("codpar",paralelo_seleccionado);
		formData.append("codmat",materia_seleccionada);
		let request = $.ajax({
							  url: "controlador/profesor_controlador.php?usr=doc&op=save_actividad",
							  type: "POST",
							  data: formData,
							  processData: false,  // tell jQuery not to process the data
							  contentType: false,
							  async:false   // tell jQuery not to set contentType
							}).responseText;
		if(request=="ok"){
			Swal.fire("Actividad guardada exitosamente...");
			ver_actividades(materia_seleccionada);
		}

	}else{
		Swal.fire("Debe llenar los campos requeridos...");
	}
}
const validar_form = ()=>{
	let descripcion = $('#descripcion').val();
	let fecha = $('#fecha').val();
	let horai = $('#horai').val();
	let horaf = $('#horaf').val();

	if(descripcion==""||fecha==""||horai==""||horaf=="")return false;

	return true;
}
const update_actividad = id=>{
	if(validar_form()){
		Swal.fire({
		    title: 'Alerta',
		    text: "Se realizarán cambios en la actividad...\ndesea continuar?",
		    icon: 'warning',
		    showCancelButton: true,
		    confirmButtonColor: '#3085d6',
		    cancelButtonColor: '#d33',
		    confirmButtonText: 'Si',
		    cancelButtonText: 'No'
		}).then((result) => {
			    if (result.isConfirmed) {
			      	let formData = new FormData($('#form_detalle')[0]);
					formData.append("id",id);
					let request = $.ajax({
										  url: "controlador/profesor_controlador.php?usr=doc&op=update_actividad",
										  type: "POST",
										  data: formData,
										  processData: false,  // tell jQuery not to process the data
										  contentType: false,
										  async:false   // tell jQuery not to set contentType
										}).responseText;
					if(request=="ok"){
						Swal.fire("Actividad guardada exitosamente...");
						ver_actividades(materia_seleccionada);
					}    
			    }
			  }); 
		

	}else{
		Swal.fire("Debe llenar los campos requeridos...");
	}
}
const delete_actividad = id=>{
	Swal.fire({
	    title: 'Alerta',
	    text: "Se eliminará la actividad...\ndesea continuar?",
	    icon: 'warning',
	    showCancelButton: true,
	    confirmButtonColor: '#3085d6',
	    cancelButtonColor: '#d33',
	    confirmButtonText: 'Si',
	    cancelButtonText: 'No'
	}).then((result) => {
		    if (result.isConfirmed) {
		      $.post(
					"controlador/profesor_controlador.php?usr=doc&op=delete_actividad",
					{id:id},
					data=>{
						if (data=="ok") {
							Swal.fire("Actividad eliminada exitosamente...");
							ver_actividades(materia_seleccionada);
						}
					}
				);     
		    }
		  }); 
	
}
$(document).ready(()=>{
	obtener_cursos();
	$('#form_detalle').submit((e)=>{e.preventDefault()});
	$('#btn-cursos').click(()=>obtener_cursos());
	$('#btn-curso').click(()=>ver_materias(indice_selccionado));
	$('#btn-materia').click(()=>ver_actividades(materia_seleccionada));
	$('#btn_nueva_actividad').click(()=>form_nueva_actividad());
	$('#btn-guardar').click(()=>guardar_actividad());
	$('#btn-actualizar').click(()=>update_actividad(actividad_seleccionada));
	$('#btn_delete').click(()=>delete_actividad(actividad_seleccionada));

});