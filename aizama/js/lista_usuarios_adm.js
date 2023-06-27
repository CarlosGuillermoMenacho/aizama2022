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
	let index = 1;
		lista.forEach( p => {
				let id = p.user;
		        let fecha = p.nombre;
		        let dia = p.user;
		        let periodo = p.clave;
		        let plataforma = p.plataforma;
		        let boletin = p.boletin;
		        let evaluaciones = p.evaluaciones;

		        $("#body").append(`
		                        <tr>
		                            <td class="border-top index">${index}</td>
		                            <td class="border-td">${fecha}</td>
		                            <td class="border-td">${dia}</td>
		                            <td class="border-td">${periodo}</td>
		                            <td class="border-td danger">${plataforma}</td>
		                            <td class="border-td danger">${evaluaciones}</td>
		                            <td class="border-td danger">${boletin}</td>
		                        </tr>   
		                          `);
		        index++;
			
		});

    $("#tabla_lista").removeClass('oculto');
	$(".noData").addClass('oculto');
};
function pedirAlumnos(curso, paralelo) {

    var req = new XMLHttpRequest();

    var formData = new FormData();

    formData.append('codcur', curso);

    formData.append('codpar', paralelo);

    req.onreadystatechange = function (aEvt) {

    if (req.readyState == 4) {

        if(req.status == 200)

          var jsonData = JSON.parse(req.responseText);

          if( jsonData['status'] == 'ok') {

            

            

            mostrar_lista(jsonData['lista']);

          }

      }

    };

    req.open('POST', 'lista_alumnnos_usuario_clave.php?op=list_alu_usr_pass', false);

    req.send(formData);

  



}
const get_planificaciones = ()=>{
	let codcur = $("#seleccionar_curso").val();
	let codpar = $("#seleccionar_paralelo").val();
	$("#tabla_lista").addClass('oculto');
	$(".noData").addClass('oculto');
	$("#body").empty();
	
	if(codcur!="" && codpar != ""){
		pedirAlumnos(codcur,codpar);
	}
};
$(document).ready(()=>{
	get_cursos();
	$("#seleccionar_curso").change(()=>{
		get_planificaciones();
	});
	$("#seleccionar_paralelo").change(()=>{
		get_planificaciones();
	});
})