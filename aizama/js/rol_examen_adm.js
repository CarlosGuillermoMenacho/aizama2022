const peticion_post = (url,datos)=>{
	return new Promise((resolve,reject)=>{
		$.post(
			url,
			datos,
			data=>{
				resolve(data);
			},
			"json"
		).fail((xhr,status,error)=>{
			reject(error);
		});	
	});
	
}
const mostrarLista = data => {
	lista = data;
	$("#body").empty();
	let listaAlumnos = data.lista;
	let tutores = data.tutores;
	let index = 1;
	data.forEach(rol => {
		let materia = rol[0];
		let descripcion = rol[1];
		let dia = rol[2];
		let fecha = rol[3];
		let hora = rol[4];
		$("#body").append(`
		    <tr id="rol${index}">
		        <td class="border-top index">${index}</td>
		        <td class="border-td">${dia}</td>
		        <td class="border-td">${fecha}</td>
		        <td class="border-td">${hora}</td>
		        <td class="border-td">${materia}</td>
		        <td class="border-td">${descripcion}</td>
		    </tr>   
		`);
		index++;
	});
	$('#noData').addClass('oculto');
	$('#tabla_lista').removeClass('oculto');

}
const get_rol = async () => {
	let codcur = $("#seleccionar_curso").val();
	let codpar = $("#seleccionar_paralelo").val();
	if(codcur != "" && codpar != ""){
		let url = "controlador/controlador_rol_de_examen.php?op=get_rol_adm";
		let datos = {codcur:codcur,codpar:codpar};
		try{
			let response = await peticion_post(url,datos);
			if(response.status=="eSession")location.href = "administracion.php";
			if(response.status=="ok")mostrarLista(response.data);
			if(response.status=="noData"){
				$('#noData').removeClass('oculto');
				$('#tabla_lista').addClass('oculto');
			}
		}catch(error){
			let msg = "Function: obtenerListaAlumnos,error:";
			//$.get(`www.aizama.net/aizama/whatsapp_msg.php?phone=59177367545&text=${msg}`);
			console.log(error);
		}
		


	}
}
$(document).ready(()=>{
	
	$("#seleccionar_curso").change(()=>{
		let index = $("#seleccionar_curso").val();
		if(index != ""){
			get_rol();
		}else{
			$('#tabla_lista').addClass('oculto');
		}
	});
	$("#seleccionar_paralelo").change(()=>{
		let index = $("#seleccionar_paralelo").val();
		if(index != ""){
			get_rol();
		}else{
			$('#tabla_lista').addClass('oculto');
		}
	});
});