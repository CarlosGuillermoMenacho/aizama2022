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
                <td class="border-td" colspan="3">
                	<form id="formulario-save">
	                	<div class="fecha">
	                		<div>
	                			Desde: <input type="date" class="input-data" id="desde" name="">
	                		</div>
	                		<div>
	                			Hasta: <input type="date" class="input-data" id="hasta" name="">
	                		</div>
	                		<div style="display: flex; align-items: center; gap: 10px;">
	                			Imagen: <img id="img" src="svg/imagen.svg" style="width: 45px; border-radius: 5px; cursor: pointer;" onclick="select_img()">
	                		</div>
	                		<div><textarea class="input-data2" id="descripcion"></textarea></div>
	                	</div>
                	</form>
                </td>
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
	let desde =  $(`#desde${id}`).val();
	let hasta =  $(`#hasta${id}`).val();
	if(descripcion == "" || desde == "" || hasta == ""){
		Swal.fire("Debe llenar los campos requeridos...");
		return;
	}
	await $.post(
		"controlador/calendario_academico_controlador.php?op=update",
		{id:id,desde:desde,hasta:hasta,descripcion:descripcion},
		async data => {
			switch(data.status){
				case "eSession":
					Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
					break;
				case "errorFecha":
					Swal.fire("Las fechas ingresadas son incorrectas...");
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
		if(__lista[i].id == id)return __lista[i];
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
	let e = get_fecha(id);
	let img = "svg/imagen.svg";
	if(e.file != "")img = `calendarioAcademico/${e.file}`;
	$(`#tr${tr}`).append(
		`
                <td class="border-top index">${tr}</td>
                <td class="border-td">
                	<div class="fecha">
                		<div>Desde: ${e.desde}</div>
                		<div>Hasta: ${e.hasta}</div>
                	</div>
                </td>
                <td class="border-td">${get_descripcion(id)}</td>
                <td class="border-td">
                	<div class="div-img">
                		<img id="img${id}" src="${img}" style="width: 45px; border-radius: 5px; cursor: pointer;" onclick="change_img(${id})">
                	</div>
                </td>
                <td class="border-td" >
                	<div class="content-center">
	                    <img title="Editar" class="cursor-pointer" onclick="editar(${tr},${id});" width="30px" src="images/edit.svg">
	                    <img title="Eliminar" class="cursor-pointer" src="images/delete.png" width="30px" onclick="__delete(${id});">
	                </div>
                </td>
            `
	);
}
const select_imagen = () => {
	$("#imagen").click();
}
const change_img = id => {
	$("#id").val(id);
	$("#img-change").click();
}
const show_img = id => {
	let l = get_fecha(id);
	if(l.file == "")return;
	Swal.fire(
		`<div class="show-img">
		    <img src="calendarioAcademico/${l.file}" style="width:90%;">
		</div>

		`
	);
}
const editar = (tr,id) => {
	$(`#tr${tr}`).empty();
	let l = get_fecha(id);
	let img = "svg/imagen.svg";
	if(l.file != "")img = `calendarioAcademico/${l.file}`;
	$(`#tr${tr}`).append(
		`
                <td class="border-top index">${tr}</td>
                <td class="border-td fecha" colspan="2">
                	<div class="fecha">
                		<div>
                			Desde: <input type="date" class="input-data" id="desde${id}" name="" value="${l.desde}">
                		</div>
                		<div>
                			Desde: <input type="date" class="input-data" id="hasta${id}" name="" value="${l.hasta}">
                		</div>
                	</div>
                </td>
                <td class="border-td"><textarea class="input-data2" id="descripcion${id}">${get_descripcion(id)}</textarea></td>
                <td class="border-td">
                	<div class="div-img">
                		<img id="img${id}" src="${img}" style="width: 45px; border-radius: 5px; cursor: pointer;" onclick="change_img(${id})">
                	</div>
                </td>
                <td class="border-td" >
                	<div class="content-center">
	                    <img title="Guardar" class="cursor-pointer" onclick="update(${tr},${id});" width="30px" src="images/check.svg">
	                    <img title="Cancelar" class="cursor-pointer" src="images/cerrar.svg" width="30px" onclick="cancelar(${tr},${id});">
                	</div>
                </td>
            `
	);
}
const showTable = lista => {
	$("#body").empty();
	let index = 1;
	lista.forEach(l => {
		let img = "svg/imagen.svg";
		if(l.file != "")img = `calendarioAcademico/${l.file}`;
		$("#body").append(
			`<tr id="tr${index}">
                <td class="border-top index">${index}</td>
                <td class="border-td">
                	<div class="fecha">
                		<div>Desde: ${l.desde}</div>
                		<div>Hasta: ${l.hasta}</div>
                	</div>
                </td>
                <td class="border-td">${l.descripcion}</td>
                <td class="border-td">
                	<div class="div-img">
                		<img id="img${l.id}" src="${img}" style="width: 45px; border-radius: 5px; cursor: pointer;" onclick="show_img(${l.id})">
                	</div>
                </td>
                <td class="border-td">
                	<div class="content-center">
                    	<img title="Editar" class="cursor-pointer" src="images/edit.svg" width="30px" onclick="editar(${index},${l.id})">
                    	<img class="cursor-pointer" width="30px" src="images/delete.png" title="Eliminar" onclick="__delete(${l.id});">
                	</div>
                </td>
            </tr>`
		);
		index++;
	});
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
	let desde =  $(`#desde`).val();
	let hasta =  $(`#hasta`).val();

	if(descripcion == "" || desde == "" || hasta == ""){
		Swal.fire("Debe llenar los campos requeridos...");
		return;
	}
	let formData = new FormData($("#formulario-save")[0]);
	$.ajax({
        url: "controlador/calendario_academico_controlador.php?op=save",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        type: 'POST',
        success: async function (response) {
            let data = JSON.parse(response);
            switch(data.status){
				case "eSession":
					Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
					break;
				case "errorFecha":
					Swal.fire("Las fechas ingresadas son incorrectas...");
					break;
				case "ok":
					limpiar();
					await get_calendario();
					showTable(__lista);
					break;
			}
        }
    });
}

const limpiar = () => {
	$("#descripcion").val("");
	$("#desde").val("");
	$("#hasta").val("");
	$("#img").attr("src","svg/imagen.svg");
	$("#imagen").val("");
}
const update_lista = (id,img) => {
	for (var i = 0; i < __lista.length; i++) {
		if(__lista[i].id == id){
			__lista[i].file = img;
			return;
		}
	}
}
const update_imagen = () => {
	if($("#img-change").val() != ""){
			let id = $("#id").val();
			let formData = new FormData($("#formulario")[0]);
			let response = $.ajax({
				url:"controlador/calendario_academico_controlador.php?op=set_img",
				type: "POST",
				data:formData,
				contentType: false, 
				processData: false,
				async:false
			}).responseText;
			let data = JSON.parse(response);
			if(data.status == "ok"){
				$(`#img${id}`).attr("src","calendarioAcademico/"+data.img);
				$("#img-change").val("");
				update_lista(id,data.img);
			}
		}
}
$(document).ready( async ()=>{
	await get_calendario();
	showTable(__lista);
	$("#imagen").change((e)=>{
		let tgt = e.target || window.event.srcElement;
		let files = tgt.files;
		if(FileReader && files && files.length){
			let fr = new FileReader();
			fr.onload = () => {
				$("#img").attr("src",fr.result);
			}
			fr.readAsDataURL(files[0]);
		}
		
	});
	$("#img-change").change((e)=>{
		update_imagen();		
	});
})