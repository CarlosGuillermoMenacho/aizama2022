let clases = [];
function getClases() {
	$.post(
			"programar_clase_virtual.php?op=gcpfech",
			(datos,estado,xhr)=>{
				clases = datos;
				mostrarClases();
			},
			"json"

		);
}
function mostrarClases() {
	if (clases.length>0) {
		let indice = 1;
		$('#campos').empty();
		clases.forEach((clase)=>{
			let curso = clase['curso'];
			let materia = clase['materia'];
			let titulo = clase['titulo'];
			let descripcion = clase['descripcion'];
			let horaIni = clase['horaIni'];
			let horaFin = clase['horaFin'];
			let profesor = clase['profesor'];
			let fechareg = clase['fechaReg'];
			let enlace = clase['enlace'];
			$('#campos').append(
								`<tr>
									<td data-label="Nro.">${indice}</td>
									<td data-label="Curso">${curso}</td>
									<td data-label="Materia">${materia}</td>
									<td data-label="Título">${titulo}</td>
									<td data-label="Descripción">${descripcion}</td>
									<td data-label="Hora Inicio">${horaIni}</td>
									<td data-label="Hora Fin">${horaFin}</td>
									<td data-label="Profesor">${profesor}</td>
									<td data-label="Fecha de Registro">${fechareg}</td>
									<td data-label="Enlace"><a href="${enlace}" targe="_blank">Entrar</td>
								 </tr>`
				);
			indice++;

		});
		$("#table").css('display','block');

	}else{
		alert("No hay clases programadas");
		$("#table").css('display','none');
	}
}
function buscarClases() {
	if($('#fecha').val()==""){
		alert("Debe seleccionar una fecha...");
		$('#fecha').focus();
	}else{
		let fecha = $('#fecha').val();
		$.post(
			"programar_clase_virtual.php?op=gcpfech",
			{fecha:fecha},
			(datos,estado,xhr)=>{
				clases = datos;
				mostrarClases();
			},
			"json"

		);
	}
}
$(document).ready(()=>{
	getClases();

})