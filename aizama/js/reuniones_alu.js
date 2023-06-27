let reuniones = [];
function obtenerReuniones(){
	$.post(
		"reuniones_json.php?op=grp&usr=alu",
		(datos,estado,xhr)=>{
			reuniones = datos;
			mostrarTabla();
		},
		"json"
		);
}
function mostrarTabla(){
	$('#campos').empty();
	let indice = 1;
	reuniones.forEach((reunion)=>{
		let descripcion = reunion['descripcion'];
		let fecha = reunion['fecha'];
		let horai = reunion['horai'];
		let horaf = reunion['horaf'];
		let enlace = reunion['enlace'];

		let fil_enlace = "";

		if(enlace == ""){
			fil_enlace = '<td data-label="Opción">&nbsp;</td>';
		}else{
			fil_enlace = `<td data-label="Opción"><a href="${enlace}" target="_blank">Ingresar</a></td>`;
		}
		$('#campos').append(`<tr>
								<td data-label="Nro.">${indice}</td>
								<td data-label="Descripción">${descripcion}</td>
								<td data-label="Fecha">${fecha}</td>
								<td data-label="Hora Inicio">${horai}</td>
								<td data-label="Hora Fin">${horaf}</td>
								${fil_enlace}
							</tr>`);
		indice++;
	});
}
$(document).ready(()=>{
	obtenerReuniones();

})