let __lista = [];
let __md = [];
const __delete = id => {
	$.post(
		"controlador/imagen_inicio_controlador.php?op=delete&usr=adm",
		{id:id},
		async data => {
			switch(data.trim()){
				case "eSession":
					Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
					break;
				case "ok":
					await get_imagenes();
					showTable(__lista.slice());
					break;
			}
		},"text"
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
	let descripcion =  $(`#fecha${id}`).val();
	if(descripcion == "" ){
		Swal.fire("Debe llenar los campos requeridos...");
		return;
	}
	let formData = new FormData($("#formulario")[0]);
	formData.append("fecha_ini",descripcion);
	let response = $.ajax({
		url:"controlador/imagen_inicio_controlador.php?op=update&usr=adm",
		type: "POST",
		data:formData,
		contentType: false, 
		processData: false,
		async:false
	}).responseText;
	let data = JSON.parse(response);
	if(data.status == "ok"){
		await get_imagenes();
		showTable(__lista.slice());
	}
	if(data.status == "noDisponible"){
		Swal.fire("La fecha elegida no está disponible...");
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
	if(e.imagen != "")img = `resources/${e.imagen}`;
	$(`#tr${tr}`).append(
		`
                <td class="border-top index">${tr}</td>
                <td class="border-td">${e.mdy}</td>
                <td class="border-td"><div class="content-center"><img class="img-miniatura" src="${img}" onclick="show_img('${e.imagen}')"></div></td>
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
		    <img src="resources/${id}" style="width:90%;">
		</div>
		`
	);
}
const editar = (tr,id) => {

	$(`#tr${tr}`).empty();
	let l = get_fila(id);
	$("#id").val(id);
	let img = "svg/imagen.svg";
	if(l.imagen != "")img = `resources/${l.imagen}`;
	$(`#tr${tr}`).append(
		`
                <td class="border-top index">${tr}</td>
                <td class="border-td"><input type="date" class="input-data" id="fecha${id}" value="${l.fecha}"></td>
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
const get_index = (d,l) => {
	for (var i = 0; i < l.length; i++) {
		if(l[i].md == d)return i;
	}
	return -1;
}
const showTable = lista => {
	$("#body").empty();
	let index = 1;
	__md.forEach(m => {
		let p = get_index(m,lista);
		if(p != -1){
			let l = lista[p];
			 lista.splice(p,1);
			let img = "svg/imagen.svg";
			if(l.imagen != "")img = `resources/${l.imagen}`;
			$("#body").append(
				`<tr id="tr${index}">
	                <td class="border-top index">${index}</td>
	                <td class="border-td">${l.mdy}</td>
	                <td class="border-td"><div class="content-center"><img class="img-miniatura" src="${img}" onclick="show_img('${l.imagen}')"></div></td>
	                <td class="border-td">
	                	<div class="content-center">
	                    	<img title="Editar" class="cursor-pointer" src="images/edit.svg" width="30px" onclick="editar(${index},${l.id})">
	                    	<img class="cursor-pointer" width="30px" src="images/delete.png" title="Eliminar" onclick="__delete(${l.id});">
	                	</div>
	                </td>
	            </tr>`
			);
			index++;
		}
	});
}
const get_imagenes = async () => {
	await $.get(
		"controlador/imagen_inicio_controlador.php?op=get_all_imagen_inicio&usr=adm",
		data => {
			switch(data.status){
				case "eSession":
					Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
					break;
				case "ok":
					__lista = data.data;
					__md = data.md;
					break;
			}
		},"json"
	);
}
const save = () => {
	let descripcion =  $("#fecha").val();
	let imagen =  $(`#imagen`).val();
	if(descripcion == "" || imagen == ""){
		Swal.fire("Debe llenar los campos requeridos...");
		return;
	}
	let formData = new FormData($("#formulario-save")[0]);
	$.ajax({
        url: "controlador/imagen_inicio_controlador.php?op=guardar_imagen&usr=adm",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        type: 'POST',
        success: async function (response) {
            let data = response.trim();
            switch(data){
				case "eSession":
					Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
					break;
				case "errorParam":
					Swal.fire("Faltan datos...");
					break;
				case "ok":
					limpiar();
					await get_imagenes();
					let l = __lista.slice();
					showTable(l);
					break;
			}
        }
    });
}

const limpiar = () => {
	$("#fecha").val("");
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
	await get_imagenes();
	let l = __lista.slice();
	showTable(l);
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