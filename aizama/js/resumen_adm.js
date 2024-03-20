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
const gestion = (e) => {
	if(e.checked){
		$("#t1")[0].checked = false;
		$("#t2")[0].checked = false;
		$("#t3")[0].checked = false;
		$("#input_date_ini").val("");
		$("#input_date").val("");
	}
	mostrar_lista(data_response);
}
const trimestre = (e) => {
	if(e.checked){
		$("#tt")[0].checked = false;
		$("#input_date_ini").val("");
		$("#input_date").val("");
	}
	mostrar_lista(data_response);
}
const mostrar_lista = lista => {
	$("#body").empty();
	let materias = lista.materias;
	let practicos = lista.practicos;
	let evaluaciones = lista.evaluaciones;
	let materiales = lista.materiales;
	let t1 = $("#t1")[0].checked;
	let t2 = $("#t2")[0].checked;
	let t3 = $("#t3")[0].checked;
	let tt = $("#tt")[0].checked;
	let fi = $("#input_date_ini").val();
	let ff = $("#input_date").val();
	let tabla = {};
	materias.forEach(m => {
		tabla[m.codmat] = [m.materia,0,0,0];
	});
	practicos.forEach(p => {
		if(tt || (t1 && p.trimestre == 1) || (t2 && p.trimestre == 2) || (t3 && p.trimestre == 3)){
			if(tabla.hasOwnProperty(p.codmat)){
				let n = tabla[p.codmat][1];
				n++;
				tabla[p.codmat][1] = n; 
			}
		}else if(fi != "" && ff != "" && new Date(p.fecha) >= new Date(fi) && new Date(p.fecha) <= new Date(ff)){
			if(tabla.hasOwnProperty(p.codmat)){
				let n = tabla[p.codmat][1];
				n++;
				tabla[p.codmat][1] = n; 
			}			
		}
	});
	evaluaciones.forEach(p => {
		if(tt || (t1 && p.trimestre == 1) || (t2 && p.trimestre == 2) || (t3 && p.trimestre == 3)){
			if(tabla.hasOwnProperty(p.codmat)){
				let n = tabla[p.codmat][2];
				n++;
				tabla[p.codmat][2] = n; 
			} 
		}else if(fi != "" && ff != "" && new Date(p.fecha) >= new Date(fi) && new Date(p.fecha) <= new Date(ff)){
			if(tabla.hasOwnProperty(p.codmat)){
				let n = tabla[p.codmat][2];
				n++;
				tabla[p.codmat][2] = n; 
			}			
		}
	});
	materiales.forEach(p => {
		if(tt || (t1 && p.trimestre == 1) || (t2 && p.trimestre == 2) || (t3 && p.trimestre == 3)){
			if(tabla.hasOwnProperty(p.codmat)){
				let n = tabla[p.codmat][3];
				n++;
				tabla[p.codmat][3] = n; 
			}
		}else if(fi != "" && ff != "" && new Date(p.fecha) >= new Date(fi) && new Date(p.fecha) <= new Date(ff)){
			if(tabla.hasOwnProperty(p.codmat)){
				let n = tabla[p.codmat][3];
				n++;
				tabla[p.codmat][3] = n; 
			}		
		}
	});
	materias.forEach(m => {
		let fila = tabla[m.codmat];
		$("#body").append(`
			                <tr>
			                    <td class="border-top index" style="text-align:left;">${fila[0]}</td>
			                    <td class="border-td" style="text-align:center;">${fila[1]}</td>
			                    <td class="border-td" style="text-align:center;">${fila[2]}</td>
			                    <td class="border-td" style="text-align:center;">${fila[3]}</td>
			                </tr>   
			             `);
	})

    $("#tabla_lista").removeClass('oculto');
	$(".noData").addClass('oculto');
};
const get_resumen = ()=>{
	let codcur = $("#seleccionar_curso").val();
	let codpar = $("#seleccionar_paralelo").val();
	$("#tabla_lista").addClass('oculto');
	$(".noData").addClass('oculto');
	$("#body").empty();

	if(codcur!="" && codpar != ""){
		$.post(
	        "controlador/reportes_controlador.php?op=resumen",
	        {codcur:codcur,codpar:codpar},
	        datos => {
	            if(datos.status == "ok"){
	            	data_response = datos.data; 
	                mostrar_lista(datos.data);
	            }
	            if(datos.status == "noData"){
	                $(".noData").removeClass('oculto');
	            }
	            if(datos.status == "eSession")Swal.fire("La sesión ha finalizado por favor vuelva a ingresar con su usuario y contraseña por favor...");
	            
	        },
	        "json"
        );
	}
};
const search_data = () => {
	
	let fi = $("#input_date_ini").val();
	let ff = $("#input_date").val();
	if(fi != "" && ff != ""){
		$("#t1")[0].checked = false;
		$("#t2")[0].checked = false;
		$("#t3")[0].checked = false;
		$("#tt")[0].checked = false;
		mostrar_lista(data_response);
	}
	
}
$(document).ready(()=>{
	get_cursos();
	$("#seleccionar_curso").change(()=>{
		get_resumen();
	});
	$("#seleccionar_paralelo").change(()=>{
		get_resumen();
	});
})