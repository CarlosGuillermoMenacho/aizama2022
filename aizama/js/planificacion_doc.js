let listaCursos = [];
let listaMaterias = [];
let curso_sel = "";
let paralelo_sel = "";
let planificaciones = [];
let planificacion_seleccionada = 0;
let lista_general = [];
const get_cursos_prof = ()=>{
	curso_sel = "";
	paralelo_sel = "";
	$.post("obtener_curso_json.php?op=cp",function(respuesta){
	  var jsonDataCursos = JSON.parse(respuesta);
		if (jsonDataCursos['status'] == 'ok') {     
				listaCursos = jsonDataCursos['cursos'];
				$("#seleccionar_curso").empty();
				$("#seleccionar_curso").append('<option value =""> -- Seleccionar Curso -- </option>');
				$("#seleccionar_materia").empty();
				$("#seleccionar_materia").append('<option value =""> -- Seleccionar Materia -- </option>');
				for (let i = 0; i < listaCursos.length; i++) {    
					var cursos = listaCursos[i]['nombre']; 
					$("#seleccionar_curso").append('<option value ="'+ (i+1) +'">' + cursos + '</option>');
					$("#seleccionar_curso-lg").append('<option value ="'+ (i+1) +'">' + cursos + '</option>');
	      		}
	      		//if(listaCursos.length > 0)$('.div-select').removeClass('oculto');
	  }
	  if(respuesta=='eSession') {
	    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	    location.href ="docentes.php";
	    return false;
	  }
	});
}
const eliminar = id =>{
	$.post(
	        "controlador/planificacion_controlador.php?op=delete",
	        {id:id},
	        datos => {
	            if(datos.status == "ok"){
	            	Swal.fire("Eliminado...");
	                get_planificaciones_fecha();
	            }
	            if(datos.status == "eSession")location.href = 'docentes.php';
	            
	        },
	        "json"
        );
}
const get_curso = (codcur,codpar) => {
	for (var i = 0; i < listaCursos.length; i++) {
		if(listaCursos[i].codcur == codcur && listaCursos[i].codpar == codpar)return i+1;
	}
	return 0;
}
const editar = async id => {
	planificacion_seleccionada = id;
	lista = planificaciones.planificaciones;
	
	for (var i = 0; i < lista.length; i++) {
		if(lista[i].id == id){
			if(lista[i].delete){
				let index = get_curso(lista[i].codcur,lista[i].codpar);
				await $("#seleccionar_curso").val(index).trigger('change');	
				await $("#seleccionar_materia").val(lista[i].codmat).trigger('change');
				await $("#fecha").val(lista[i].fecha);
				$("#actividad").val(lista[i].actividad);
				$("#recursos").val(lista[i].recursos);
				$("#actividad_complementaria").val(lista[i].actividad_complementaria);
			}
			let divs = $(".checks").children();
			check(divs[lista[i].periodo - 1]);
			$("#btn-guardar").addClass('oculto');
			$("#btn-update").removeClass('oculto');
			form_visible();
		}
	}
}
const ordenarListaGeneral = lista => {
	let lista2 = [];
	let listaFechas = [];
	let listaPeriodos = [];
	let fechaI = lista[0].fecha;
	lista.forEach(planificacion => {
		let act = planificacion.actividad;
		let id = planificacion.id;
        let fecha = planificacion.fecha;
        let dia = planificacion.dia;
        let periodos = JSON.parse(planificacion.periodo);  
        let materia = planificacion.materia;
        let actividad = planificacion.actividad;
        let actividad_complementaria = planificacion.actividad_complementaria;
        let recursos = planificacion.recursos;
        if (fecha != fechaI) {
        	listaFechas.push({
        		fecha:fechaI,periodos:listaPeriodos.sort()
        	});
        	listaPeriodos = [];
        	fechaI = fecha;
        }
        let _delete = true;
        periodos.forEach(periodo => {
        	listaPeriodos.push(periodo);
        	lista2.push({
        		act : actividad,
				id : id,
		        fecha : fecha,
		        dia : dia,
		        periodo : periodo, 
		        materia : materia,
		        actividad : actividad,
		        actividad_complementaria : actividad_complementaria,
		        recursos : recursos,
		        delete:_delete,
		        visible:true
        	});
        	_delete = false;
        });

	});
	listaFechas.push({
        fecha:fechaI,periodos:listaPeriodos.sort()
    });
	return {fechas:listaFechas,planificaciones:lista2};
}
const ordenarLista = lista => {
	let lista2 = [];
	let listaFechas = [];
	let listaPeriodos = [];
	let fechaI = lista[0].fecha;
	lista.forEach(planificacion => {
		let act = planificacion.actividad;
		let id = planificacion.id;
        let fecha = planificacion.fecha;
        let dia = planificacion.dia;
        let periodos = JSON.parse(planificacion.periodo);  
        let materia = planificacion.materia;
        let actividad = planificacion.actividad;
        let actividad_complementaria = planificacion.actividad_complementaria;
        let recursos = planificacion.recursos;
        let curso = planificacion.curso;
        let codcur = planificacion.codcur;
        let codpar = planificacion.codpar;
        let codmat =	planificacion.codmat;
        if (fecha != fechaI) {
        	listaFechas.push({
        		fecha:fechaI,periodos:listaPeriodos.sort()
        	});
        	listaPeriodos = [];
        	fechaI = fecha;
        }
        let _delete = true;
        periodos.forEach(periodo => {
        	listaPeriodos.push(periodo);
        	lista2.push({
        		act : actividad,
						id : id,
		        fecha : fecha,
		        dia : dia,
		        periodo : periodo, 
		        materia : materia,
		        actividad : actividad,
		        actividad_complementaria : actividad_complementaria,
		        recursos : recursos,
		        curso : curso,
		        delete:_delete,
		        visible:true,
		        codcur:codcur,
		        codpar:codpar,
		        codmat:codmat
        	});
        	_delete = false;
        });

	});
	listaFechas.push({
        fecha:fechaI,periodos:listaPeriodos.sort()
    });
	return {fechas:listaFechas,planificaciones:lista2};
}
const getPlanificacion = (lista,fecha,periodo) => {
	for (var i = 0; i < lista.length; i++) {
		if(lista[i].fecha == fecha && lista[i].periodo == periodo)return lista[i];
	}
	return null;
} 
const mostrar_lista = lista => {
	let index = 1;
	planificaciones = ordenarLista(lista);

	planificaciones.fechas.forEach( e =>{
		let fechaI = e.fecha;
		let periodos = e.periodos;
		periodos.forEach( p => {
			let planificacion = getPlanificacion(planificaciones.planificaciones,fechaI,p);
			if(planificacion != null){
				let id = planificacion.id;
		        let fecha = planificacion.fecha;
		        let dia = planificacion.dia;
		        let periodo = planificacion.periodo;
		        let materia = planificacion.materia;
		        let actividad = planificacion.actividad;
		        let actividad_complementaria = planificacion.actividad_complementaria;
		        let recursos = planificacion.recursos;
		        let curso = planificacion.curso;
		        let deleter = "";
		        if(planificacion.delete)deleter=`<div class="options">
		        																		<a href="#" onclick="editar(${id});" style="margin-right:5px;">
		        																			<img class="icon-edit" src="svg/lapiz.svg">
		        																		</a><a href="#" onclick="eliminar(${id});" style="margin-left:5px;">
		        																			<img class="icon-delete" src="svg/delete.png">
		        																		</a>
		        																	</div>`;    
		        $("#body").append(`
		                        <tr>
		                            <td class="border-top index">${index}</td>
		                            <td class="border-td">${fecha}</td>
		                            <td class="border-td">${dia}</td>
		                            <td class="border-td">${periodo}</td>
		                            <td class="border-td">${curso}</td>
		                            <td class="border-td">${materia}</td>
		                            <td class="border-td">${actividad}</td>
		                            <td class="border-td">${actividad_complementaria}</td>
		                            <td class="border-td">${recursos}</td>
		                            <td class="border-td center options">${deleter}</td>
		                        </tr>   
		                          `);
		        index++;
			}
		});
	});
    $("#tabla_lista").removeClass('oculto');
    $("#div-btn-nuevo").removeClass('oculto');
	$(".btn-float-back").addClass('oculto');
	$(".div-formulario").addClass('oculto');
	$(".noData").addClass('oculto');
};
function obtenerMateria(curso, paralelo){

  $("#seleccionar_materia").empty();

  $("#seleccionar_materia").append('<option value="0"> -- Seleccionar Materia -- </option>');

  for(var i = 0 ; i < listaMaterias.length; i++) {

      if(listaMaterias[i]['codcur'] == curso && listaMaterias[i]['codpar'] == paralelo){

        $("#seleccionar_materia").append('<option value ="'+(listaMaterias[i]['codmat'])+'">' + listaMaterias[i]['nombre'] + '</option>');

      }

  }

}

const get_planificaciones = ()=>{
	let index = $("#seleccionar_curso").val();
	$("#tabla_lista").addClass('oculto');
	$(".div-formulario").addClass('oculto');
	$(".noData").addClass('oculto');
	$("#div-btn-nuevo").removeClass('oculto');
	$("#body").empty();
	curso_sel = "";
	paralelo_sel = "";
	if(index!=""){
		let codcur = listaCursos[index - 1].codcur;
		let codpar = listaCursos[index - 1].codpar;
		curso_sel = codcur;
		paralelo_sel = codpar;
		obtenerMateria(codcur, codpar);
		$.post(
	        "controlador/planificacion_controlador.php?op=get_planificacion",
	        {codcur:codcur,codpar:codpar},
	        datos => {
	            if(datos.status == "ok"){
	                mostrar_lista(datos.datos);
	            }
	            if(datos.status == "noData"){
	                $(".noData").removeClass('oculto');
	                $("#div-btn-nuevo").removeClass('oculto');
	                $(".div-formulario").addClass('oculto');
	            }
	            if(datos.status == "eSession")location.href = 'docentes.php';
	            
	        },
	        "json"
        );
	}
};
const get_planificaciones_fecha = ()=>{
	let fecha = $("#fecha").val();
	$("#tabla_lista").addClass('oculto');
	$("#fecha2").css('visibility',"visible");
	$(".div-formulario").addClass('oculto');
	$(".noData").addClass('oculto');
	$("#div-btn-nuevo").removeClass('oculto');
	$("#body").empty();
	if(fecha!=""){
		$.post(
	        "controlador/planificacion_controlador.php?op=get_planificacion_prof",
	        {fecha:fecha},
	        datos => {
	            if(datos.status == "ok"){
	                mostrar_lista(datos.datos);
	            }
	            if(datos.status == "noData"){
	                $(".noData").removeClass('oculto');
	                $("#div-btn-nuevo").removeClass('oculto');
	                $(".div-formulario").addClass('oculto');
	            }
	            if(datos.status == "eSession")location.href = 'docentes.php';
	            
	        },
	        "json"
        );
	}
};
const check = e =>{
	if(e.children[0].checked){
		e.classList.remove('selected');
	}else{
		e.classList.add('selected');
	}
	
	e.children[0].checked = !e.children[0].checked;
}
const form_visible = ()=>{
	$("#div-btn-nuevo").addClass('oculto');
	$("#tabla_lista").addClass('oculto');
	$(".btn-float-back").removeClass('oculto');
	$(".div-formulario").removeClass('oculto');
	$(".btn-float-back").removeClass('oculto');
	$(".noData").addClass('oculto');
	$('#fecha2').css("visibility","hidden");
}
const init_Form = () => {
	let checkboxs = document.getElementsByName('checkbox');

	for (var i = 0; i < checkboxs.length; i++) {
		checkboxs[i].checked = false;
	}
	$('.button-check').removeClass('selected');
	$('#recursos').val("");
	$('#seleccionar_curso').val("");
	$('#seleccionar_materia').val("");
	$('#seleccionar_curso').val("");
	$('#actividad').val("");
	$('#actividad_complementaria').val("");
}
const mostrarForm = ()=>{
	let checkboxs = document.getElementsByName('checkbox');

	for (var i = 0; i < checkboxs.length; i++) {
		checkboxs[i].checked = false;
	}
	$('.button-check').removeClass('selected');
	$('#recursos').val("");
	$('#seleccionar_curso').val("");
	$('#seleccionar_materia').val("");
	$('#seleccionar_curso').val("");
	$('#actividad').val("");
	$('#actividad_complementaria').val("");
	$("#btn-guardar").removeClass('oculto');
	$("#btn-update").addClass('oculto');
	form_visible();
}

const get_materias_prof = ()=>{
	$.get(
		"obtener_materias_json.php?op=getmatprof",
		respuesta=>{
  			let jsonDataMaterias = respuesta;
  			if (jsonDataMaterias.status == 'ok') {
    			listaMaterias = jsonDataMaterias.materias;
  			}
  			if(respuesta.status == 'eSession') {
  				location.href = "docentes.php";
  			}

		},
		"json");
}
const validar = ()=>{
	if(curso_sel == "" || paralelo_sel == ""){
		$('#seleccionar_curso').focus();
			Swal.fire("Debes seleccionar el curso...");
			return false;
	}
	let materia = $("#seleccionar_materia").val();

	if(materia == null|| materia == "" || materia == "0"){
		$("#seleccionar_materia").focus();
		Swal.fire("Debes seleccionar la materia...");
		return false;
	}
	let fecha = $("#fecha").val();
	if(fecha == ""){
		$("#fecha").focus();
		Swal.fire("Debes seleccionar la fecha...");
		return false;
	}
	let checkboxs = document.getElementsByName('checkbox');

	let bandera = false;
	for (var i = 0; i < checkboxs.length; i++) {
		if(checkboxs[i].checked)bandera = true;
	}
	if(!bandera){
		Swal.fire("Debes seleccionar uno o m&aacute;s periodos...");
		return false;
	}

	let actividad = $("#actividad").val();
	if(actividad == ""){
		$("#actividad").focus();
		Swal.fire("Debes ingresar la actividad a realizar...");
		return false;
	}
	let recursos = $("#recursos").val();
	if(recursos == ""){
		$("#recursos").focus();
		Swal.fire("Debes ingresar el material bibliogr&aacute;fico...");
		return false;
	}
	return true;
}

const save = () => {

	if(validar()){
		let fecha = $("#fecha").val();
		let periodo = $("#periodo").val();
		let materia = $("#seleccionar_materia").val();
		let actividad = $("#actividad").val();
		let recursos = $("#recursos").val();
		let actcompl = $("#actividad_complementaria").val();
		let checkboxs = document.getElementsByName('checkbox');
		let array_periodos = [];
		for (var i = 0; i < checkboxs.length; i++) {
			if(checkboxs[i].checked)array_periodos.push(i+1);
		}
		$.post(
	        "controlador/planificacion_controlador.php?op=save",
	        {id:planificacion_seleccionada,codcur:curso_sel,codpar:paralelo_sel,fecha:fecha,
	         periodo:JSON.stringify(array_periodos),codmat:materia,
	         actividad:actividad,recursos:recursos,act_complementaria:actcompl},
	        datos => {
	            if(datos.status == "ok"){
	            	init_Form();
	            	Swal.fire("Planificaci&oacute;n guardada exitosamente...");
	            	get_cursos_prof();
	              get_planificaciones_fecha();
	            }
	            if(datos.status == "errorPeriodo"){
	            	Swal.fire("Hubo un error al guardar, ya se asignó una planaificación para el periodo seleccionado...");
	              $(".checks").focus();
	            }
	            if(datos.status == "eSession")location.href = 'docentes.php';
	            
	        },
	        "json"
        );
	}
}
const filtrar = () => {
	alert($('#fecha2').val());
}; 
const cargar_materias = ()=>{
	let index = $("#seleccionar_curso").val();
		if(index != '' && index!= null){
			let codcur = listaCursos[index - 1].codcur;
			let codpar = listaCursos[index - 1].codpar;
			curso_sel = codcur;
			paralelo_sel = codpar;
			obtenerMateria(codcur, codpar);
		}else{
			$("#seleccionar_materia").empty();
			$("#seleccionar_materia").append('<option value="0"> -- Seleccionar Materia -- </option>');
		}
}
const show_lista_general = () => {
	$("#container").addClass("oculto");
	$("#container-lista-general").removeClass("oculto");
}
const show_lista = () =>{
	$("#container").removeClass("oculto");
	$("#container-lista-general").addClass("oculto");
}
const mostrar_lista_general = lista => {
	$("#body-lista-general").empty();
	let index = 1;
	let fech = $("#input_date").val();
	let fechini = $("#input_date_ini").val();
	planificaciones = ordenarLista(lista);
	planificaciones.fechas.forEach( e =>{
		let fechaI = e.fecha;
		let periodos = e.periodos;
		periodos.forEach( p => {
			let planificacion = getPlanificacion(planificaciones.planificaciones,fechaI,p);
			if(planificacion != null){
				let id = planificacion.id;
		        let fecha = planificacion.fecha;
		        let fec = fecha;
		        let f = new Date(fec.replace("-","/"));

		        let dia = planificacion.dia;
		        let periodo = planificacion.periodo;
		        let materia = planificacion.materia;
		        let actividad = planificacion.actividad;
		        let actividad_complementaria = planificacion.actividad_complementaria;
		        let recursos = planificacion.recursos;
		        
		        let deleter = "";
		        if(planificacion.delete)deleter=`<a href="#" onclick="eliminar(${id});"><img class="icon-delete" src="svg/delete.png"></a>`;    
		        if(fech == "" && fechini == ""){
			        $("#body-lista-general").append(`
			                        <tr>
			                            <td class="border-top index">${index}</td>
			                            <td class="border-td fecha">${fecha}</td>
			                            <td class="border-td">${dia}</td>
			                            <td class="border-td">${periodo}</td>
			                            <td class="border-td">${materia}</td>
			                            <td class="border-td">${actividad}</td>
			                            <td class="border-td">${actividad_complementaria}</td>
			                            <td class="border-td">${recursos}</td>
			                        </tr>   
			                          `);
			        index++;		        	
		        }else{
		        	if(fech == ""){
		        		let fi = new Date(fechini.replace("-","/"));
		        		if(f >= fi){
		        			$("#body-lista-general").append(`
			                        <tr>
			                            <td class="border-top index">${index}</td>
			                            <td class="border-td fecha">${fecha}</td>
			                            <td class="border-td">${dia}</td>
			                            <td class="border-td">${periodo}</td>
			                            <td class="border-td">${materia}</td>
			                            <td class="border-td">${actividad}</td>
			                            <td class="border-td">${actividad_complementaria}</td>
			                            <td class="border-td">${recursos}</td>
			                        </tr>   
			                          `);
		        			index++;
		        		}
		        		
		        	}
		        	if(fechini == ""){
		        		let ff = new Date(fech.replace("-","/"));
		        		if(f <= ff){
		        			$("#body-lista-general").append(`
			                        <tr>
			                            <td class="border-top index">${index}</td>
			                            <td class="border-td fecha">${fecha}</td>
			                            <td class="border-td">${dia}</td>
			                            <td class="border-td">${periodo}</td>
			                            <td class="border-td">${materia}</td>
			                            <td class="border-td">${actividad}</td>
			                            <td class="border-td">${actividad_complementaria}</td>
			                            <td class="border-td">${recursos}</td>
			                        </tr>   
			                          `);
		        			index++;
		        		}
		        	}
		        	if(fech != "" && fechini != ""){
		        		let ff = new Date(fech.replace("-","/"));
		        		let fi = new Date(fechini.replace("-","/"));
		        		if(f >= fi && f <= ff){
		        			$("#body-lista-general").append(`
			                        <tr>
			                            <td class="border-top index">${index}</td>
			                            <td class="border-td fecha">${fecha}</td>
			                            <td class="border-td">${dia}</td>
			                            <td class="border-td">${periodo}</td>
			                            <td class="border-td">${materia}</td>
			                            <td class="border-td">${actividad}</td>
			                            <td class="border-td">${actividad_complementaria}</td>
			                            <td class="border-td">${recursos}</td>
			                        </tr>   
			                          `);
		        			index++;
		        		}
		        	}
		        }
			}
		});
	});
    $("#tabla_lista_general").removeClass('oculto');
	$(".noData").addClass('oculto');
};
const search_data = () => {
	mostrar_lista_general(lista_general);
}
const get_lista_general = () => {
	let index = $("#seleccionar_curso-lg").val();
	if(index == ""){
		$("#tabla_lista_general").addClass("oculto");
		return;
	}
	let curso = listaCursos[index-1];
	$.post(
	        "controlador/planificacion_controlador.php?op=get_planificacion_adm",
	        {codcur:curso.codcur,codpar:curso.codpar},
	        datos => {
	            if(datos.status == "ok"){ 
	            		lista_general = datos.datos;
	                mostrar_lista_general(lista_general);
	            }
	            if(datos.status == "noData"){
	                $(".noData").removeClass('oculto');
	            }
	            if(datos.status == "eSession")location.href = 'docentes.php';
	            
	        },
	        "json"
        );
}
$(document).ready(()=>{
	get_cursos_prof();
	get_materias_prof();
	get_planificaciones_fecha();
	$("#seleccionar_curso").change(()=>{cargar_materias();});
	$("#btn-nuevo").click(()=>{
		mostrarForm();
	})
	$(".btn-float-back").click(()=>{
		planificacion_seleccionada = 0;
		init_Form();
		get_cursos_prof();
		get_materias_prof();
		get_planificaciones_fecha();
	})
	$("#btn-guardar").click(()=>{
		save();
	});
	$("#btn-update").click(()=>{
		save();
	});
	$('#fecha2').change(()=>filtrar());
	$("#btn-lista-general").click(()=>{show_lista_general()});
	$("#seleccionar_curso-lg").change(()=>{get_lista_general()});
	$("#btn-lista-general-back").click(()=>{show_lista()});
})