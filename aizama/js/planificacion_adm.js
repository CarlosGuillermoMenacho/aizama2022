let data_response = [];
const get_cursos = ()=>{
	$.get(
		"controlador/cursos_controlador.php?op=get_cursos",
		datos => {
			if(datos.status == "eSession")location.href="administracion.php";
			if(datos.status == "noData")$('.no-cursos').removeClass('oculto');
			if (datos.status == "ok") {
				datos.cursos.forEach(curso => {
					$("#seleccionar_curso").append(
						`<option value ="${curso.codigo}">${curso.descrip}</option>`);
				});
				datos.paralelos.forEach(paralelo => {
					$("#seleccionar_paralelo").append(
						`<option value ="${paralelo.cod_par}">${paralelo.descrip}</option>`);
				});
				$('.div-select').removeClass('oculto');
			}

		},
		"json"
		)
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
const getPlanificacion = (lista,fecha,periodo) => {
	for (var i = 0; i < lista.length; i++) {
		if(lista[i].fecha == fecha && lista[i].periodo == periodo)return lista[i];
	}
	return null;
} 
const mostrar_lista = lista => {
	$("#body").empty();
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
			        $("#body").append(`
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
		        			$("#body").append(`
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
		        			$("#body").append(`
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
		        			$("#body").append(`
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
    $("#tabla_lista").removeClass('oculto');
	$(".noData").addClass('oculto');
};
const get_planificaciones = ()=>{
	let codcur = $("#seleccionar_curso").val();
	let codpar = $("#seleccionar_paralelo").val();
	//$("#input_date").val("");
	$("#tabla_lista").addClass('oculto');
	$(".noData").addClass('oculto');
	$("#body").empty();

	if(codcur!="" && codpar != ""){
		$.post(
	        "controlador/planificacion_controlador.php?op=get_planificacion_adm",
	        {codcur:codcur,codpar:codpar},
	        datos => {
	            if(datos.status == "ok"){
	            	data_response = datos.datos; 
	                mostrar_lista(datos.datos);
	            }
	            if(datos.status == "noData"){
	                $(".noData").removeClass('oculto');
	            }
	            if(datos.status == "eSession")location.href = 'docentes.php';
	            
	        },
	        "json"
        );
	}
};
const search_data = () => {
	mostrar_lista(data_response);
}
$(document).ready(()=>{
	get_cursos();
	$("#seleccionar_curso").change(()=>{
		get_planificaciones();
	});
	$("#seleccionar_paralelo").change(()=>{
		get_planificaciones();
	});
})