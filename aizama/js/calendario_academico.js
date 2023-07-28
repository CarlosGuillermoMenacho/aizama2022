let __lista = [];
const __delete = id => {
	$.post(
		"controlador/calendario_academico_controlador.php?op=delete",
		{id:id},
		async data => {
			switch(data.status){
				case "eSession":
					Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
					break;
				case "ok":
					await get_calendario();
					showTable(__lista);
					break;
			}
		},"json"
	);
}
const add_fila = () => {
	/*$("#btn-add").removeClass("div-add");
	$("#btn-add").addClass("oculto");*/
	let index = __lista.length + 1;
	$("#body").append(
		`<tr>
                <td class="border-top index">${index}</td>
                <td class="border-td fecha"><input type="date" class="input-data" id="fecha" name=""></td>
                <td class="border-td"><textarea class="input-data2" id="descripcion"></textarea></td>
                <td class="border-td">
                	<div class="content-center">
                    	<img title="Guardar" class="cursor-pointer" onclick="save();" width="30px" src="images/check.svg">
                    	<img title="Cancelar" class="cursor-pointer" src="images/cerrar.svg" width="30px" onclick="limpiar();">
                	</div>
                </td>
            </tr>`
	);
}
const update = async (tr,id) => {
	let descripcion =  $(`#descripcion${id}`).val();
	let fecha =  $(`#fecha${id}`).val();

	if(descripcion == "" || fecha == ""){
		Swal.fire("Debe llenar los campos requeridos...");
		return;
	}
	await $.post(
		"controlador/calendario_academico_controlador.php?op=update",
		{id:id,fecha:fecha,descripcion:descripcion},
		async data => {
			switch(data.status){
				case "eSession":
					Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
					break;
				case "ok":
					await get_calendario();
					cancelar(tr,id);
					break;
			}
		},"json"
	);
}
const get_fecha = id => {
	for (var i = 0; i < __lista.length; i++) {
		if(__lista[i].id == id)return __lista[i].fecha;
	}
	return "";
}
const get_descripcion = id => {
	for (var i = 0; i < __lista.length; i++) {
		if(__lista[i].id == id)return __lista[i].descripcion;
	}
	return "";
}
const cancelar = (tr,id) => {
	$(`#tr${tr}`).empty();
	$(`#tr${tr}`).append(
		`
                <td class="border-top index">${tr}</td>
                <td class="border-td fecha">${get_fecha(id)}</td>
                <td class="border-td">${get_descripcion(id)}</td>
                <td class="border-td content-center" >
                    <img title="Guardar" class="cursor-pointer" onclick="editar(${tr},${id});" width="30px" src="images/edit.svg">
                    <img title="Cancelar" class="cursor-pointer" src="images/delete.png" width="30px" onclick="__delete(${id});">
                </td>
            `
	);
}
const editar = (tr,id) => {
	$(`#tr${tr}`).empty();
	$(`#tr${tr}`).append(
		`
                <td class="border-top index">${tr}</td>
                <td class="border-td fecha"><input type="date" class="input-data" id="fecha${id}" name="" value="${get_fecha(id)}"></td>
                <td class="border-td"><textarea class="input-data2" id="descripcion${id}">${get_descripcion(id)}</textarea></td>
                <td class="border-td content-center" >
                    <img title="Guardar" class="cursor-pointer" onclick="update(${tr},${id});" width="30px" src="images/check.svg">
                    <img title="Cancelar" class="cursor-pointer" src="images/cerrar.svg" width="30px" onclick="cancelar(${tr},${id});">
                </td>
            `
	);
}
const showTable = lista => {
	$("#body").empty();
	let index = 1;
	lista.forEach(l => {
		$("#body").append(
			`<tr id="tr${index}">
                <td class="border-top index">${index}</td>
                <td class="border-td fecha">${l.fecha}</td>
                <td class="border-td">${l.descripcion}</td>
                <td class="border-td content-center" >
                    <img title="Editar" class="cursor-pointer" src="images/edit.svg" width="30px" onclick="editar(${index},${l.id})">
                    <img class="cursor-pointer" width="30px" src="images/delete.png" title="Eliminar" onclick="__delete(${l.id});">
                </td>
            </tr>`
		);
		index++;
	});
	add_fila();
	/**$("#btn-add").addClass("div-add");
	$("#btn-add").removeClass("oculto");*/
}
const get_calendario = async () => {
	await $.get(
		"controlador/calendario_academico_controlador.php?op=get_calendario_academico",
		data => {
			switch(data.status){
				case "eSession":
					Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
					break;
				case "ok":
					__lista = data.calendario;
					
					break;
			}
		},"json"
	);
}
const save = () => {
	let descripcion =  $("#descripcion").val();
	let fecha =  $("#fecha").val();

	if(descripcion == "" || fecha == ""){
		Swal.fire("Debe llenar los campos requeridos...");
		return;
	}
	$.post(
		"controlador/calendario_academico_controlador.php?op=save",
		{fecha:fecha,descripcion:descripcion},
		async data => {
			switch(data.status){
				case "eSession":
					Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
					break;
				case "ok":
					await get_calendario();
					showTable(__lista);
					break;
			}
		},"json"
	);
}

const limpiar = () => {
	$("#descripcion").val("");
	$("#fecha").val("");
}

$(document).ready( async ()=>{
	await get_calendario();
	showTable(__lista);
})