let __lista = [];
const __delete = id => {
	$.post(
		"controlador/videos_youtube_controlador.php?op=delete",
		{id:id},
		async data => {
			switch(data.status){
				case "eSession":
					Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
					break;
				case "ok":
					await get_videos();
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
	let titulo =  $(`#titulo${id}`).val();
	let enlace =  $(`#enlace${id}`).val();
	if(descripcion == "" || titulo == "" || enlace == ""){
		Swal.fire("Debe llenar los campos requeridos...");
		return;
	}
	let formData = new FormData($("#formulario")[0]);
	formData.append("titulo",titulo);
	formData.append("descripcion",descripcion);
	formData.append("enlace",enlace);
	let response = $.ajax({
		url:"controlador/videos_youtube_controlador.php?op=update",
		type: "POST",
		data:formData,
		contentType: false, 
		processData: false,
		async:false
	}).responseText;
	let data = JSON.parse(response);
	if(data.status == "ok"){
		await get_videos();
		refresh_item(tr,id);
	}
}
const get_fila = id => {
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
	let e = get_fila(id);
	let img = "svg/imagen.svg";
	if(e.captura != "")img = `miniaturas/${e.captura}`;
	$(`#tr${tr}`).append(
		`
                <td class="border-top index">${tr}</td>
                <td class="border-td">${e.titulo}</td>
                <td class="border-td">${e.descripcion}</td>
                <td class="border-td"><a href="${e.enlace}" target="__blank">${e.enlace}</a></td>
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
	let l = get_fila(id);
	if(l.captura == "")return;
	Swal.fire(
		`<div class="show-img">
		    <img src="miniaturas/${l.captura}" style="width:90%;">
		</div>

		`
	);
}
const editar = (tr,id) => {
	$(`#tr${tr}`).empty();
	let l = get_fila(id);
	$("#id").val(id);
	let img = "svg/imagen.svg";
	if(l.file != "")img = `miniaturas/${l.captura}`;
	$(`#tr${tr}`).append(
		`
                <td class="border-top index">${tr}</td>
                <td class="border-td"><textarea class="input-data2" id="titulo${id}">${l.titulo}</textarea></td>
                <td class="border-td"><textarea class="input-data2" id="descripcion${id}">${l.descripcion}</textarea></td>
                <td class="border-td"><textarea class="input-data2" id="enlace${id}">${l.enlace}</textarea></td>
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
		if(l.captura != "")img = `miniaturas/${l.captura}`;
		$("#body").append(
			`<tr id="tr${index}">
                <td class="border-top index">${index}</td>
                <td class="border-td">${l.titulo}</td>
                <td class="border-td">${l.descripcion}</td>
                <td class="border-td"><a href="${l.enlace}" target="__blank"> ${l.enlace}</a></td>
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
const get_videos = async () => {
	await $.get(
		"controlador/videos_youtube_controlador.php?op=get_videos",
		data => {
			switch(data.status){
				case "eSession":
					Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
					break;
				case "ok":
					__lista = data.data;
					
					break;
			}
		},"json"
	);
}
const save = () => {
	let descripcion =  $("#descripcion").val();
	let titulo =  $(`#titulo`).val();
	let enlace =  $(`#enlace`).val();
	let imagen =  $(`#imagen`).val();
	if(descripcion == "" || titulo == "" || enlace == "" || imagen == ""){
		Swal.fire("Debe llenar los campos requeridos...");
		return;
	}
	let formData = new FormData($("#formulario-save")[0]);
	$.ajax({
        url: "controlador/videos_youtube_controlador.php?op=save",
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
				case "errorParam":
					Swal.fire("Faltan datos...");
					break;
				case "ok":
					limpiar();
					await get_videos();
					showTable(__lista);
					break;
			}
        }
    });
}

const limpiar = () => {
	$("#descripcion").val("");
	$("#titulo").val("");
	$("#enlace").val("");
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
const refresh_item = (tr,id) => {
	$(`#tr${tr}`).empty();
	let e = get_fila(id);
	let img = "svg/imagen.svg";
	if(e.captura != "")img = `miniaturas/${e.captura}`;
	$(`#tr${tr}`).append(
		`
                <td class="border-top index">${tr}</td>
                <td class="border-td">${e.titulo}</td>
                <td class="border-td">${e.descripcion}</td>
                <td class="border-td"><a href="${e.enlace}" target="__blank">${e.enlace}</a></td>
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
const update_imagen = e => {
	if($("#img-change").val() != ""){
			let id = $("#id").val();
			let tgt = e.target || window.event.srcElement;
			let files = tgt.files;
			if(FileReader && files && files.length){
				let fr = new FileReader();
				fr.onload = () => {
					$(`#img${id}`).attr("src",fr.result);
				}
				fr.readAsDataURL(files[0]);
			}
		}
}
$(document).ready( async ()=>{
	await get_videos();
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
		update_imagen(e);		
	});
})