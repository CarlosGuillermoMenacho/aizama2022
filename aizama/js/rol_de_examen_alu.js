
const mostrar_tabla = data => {
	let index = 1;
	$("#body").empty();
	data.forEach(rol => {
		let materia = rol[0];
		let descripcion = rol[1];
		let dia = rol[2];
		let fecha = rol[3];
		let hora = rol[4];
		$("#body").append(`
		    <tr id="rol${index}">
		        <td class="border-top index">${index}</td>
		        <td class="border-td">${materia}</td>
		        <td class="border-td">${descripcion}</td>
		        <td class="border-td">${dia}</td>
		        <td class="border-td">${fecha}</td>
		        <td class="border-td">${hora}</td>
		    </tr>   
		`);
		index++;
	});
	$('#tabla_lista').removeClass('oculto');
}
const obtener_rol_examen = () => {
	$.get(
		"controlador/controlador_rol_de_examen.php?op=get_rol_alu",
		data => {
			if(data.status == "eSession"){
				alert("La sesión ha expirado...");
				location.href = "usuarios.php";
			}
			if (data.status == "noData") {
				$("#noData").removeClass("oculto");
				$('#tabla_lista').addClass('oculto');
			}
			if (data.status == "eTrimestre") {
				Swal.fire("Debe seleccionar el trimestre...");
			}
			if(data.status == "ok"){
				mostrar_tabla(data.data);
			}
		},"json"
		);
}

$(document).ready(()=>{
	obtener_rol_examen();
})