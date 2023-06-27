const url = "https://agendaaizama.net/biblioteca_digital";
function get_cursos(){
	$.post(
			url+"/biblioteca_digital.php?op=cursos",
			function (datos,estado,xhr) {
				let cursos = JSON.parse(datos);
				cursos.forEach(curso=>{
					let id = curso['id'];
					let nombre = curso['nombre']
					$('#seleccionar_curso').append(`<option value="${id}">${nombre}</option>`);
				});		
			}
			);
}

function get_materias_del_curso(){
	let codigo_de_curso = document.getElementById('seleccionar_curso').value;
	$('#seleccionar_materia').empty();
	$('#seleccionar_materia').append(`<option value="0">-- Seleccionar materia --</option>`);
	$('#tabla').css('display','none');
	$('#nuevo').css('display','none');
	if(codigo_de_curso == 0 ){
		return;
	}
	$('#tabla').css('display','none');
	

	$.post(
			url+"/biblioteca_digital.php?op=mc",
			{curso : codigo_de_curso},
			function (datos,estado,xhr) {
				datos.forEach(materia=>{
					let id = materia['id'];
					let nombre = materia['nombre']
					$('#seleccionar_materia').append(`<option value="${id}">${nombre}</option>`);
				});		
			},
			"json"
			);

}

function get_libros_del_curso(){
	let codigo_de_curso = document.getElementById('seleccionar_curso').value;
	let codigo_de_materia = document.getElementById('seleccionar_materia').value;
	if (codigo_de_curso == 0 || codigo_de_materia == 0) {
		$('#tabla').css('display','none');
		$('#nuevo').css('display','none');
		return;
	}
	$.post(
			url+"/biblioteca_digital.php?op=lcm",
			{curso : codigo_de_curso, materia : codigo_de_materia},
			(datos,estado,xhr) => {
				if (datos.length == 0) {
				    $('#nuevo').css('display','inline');
					return;
				}
				$('#campos').empty();
				let indice = 1;
				datos.forEach((libro) =>{
					let nombre = libro['lib_nombre'];
					let editorial = libro['lib_editorial'];
					let edicion = libro['lib_edicion'];
					let id = libro['lib_id'];

					$('#campos').append(`<tr>
											<td data-label = "Nro.">${indice}</td>
											<td data-label = "Nombre">${nombre}</td>
											<td data-label = "Editorial">${editorial}</td>
											<td data-label = "Edición">${edicion}</td>
											<td data-label = "Contenido"><a href="contenido_libro.php?lib=${id}" style="text-decoration:none;">Ver</a></td>
										</tr>`);
				});
				$('#tabla').css('display','block');
				$('#nuevo').css('display','inline');
			},
			"json"
		);
}

function nuevo() {
	let codigo_de_curso = document.getElementById('seleccionar_curso').value;
	let codigo_de_materia = document.getElementById('seleccionar_materia').value;

	if (codigo_de_curso == 0 || codigo_de_materia == 0) {
		alert("Debe seleccionar curso y materia");
	}

	location.href = `nuevo_libro.php?cur=${codigo_de_curso}&mat=${codigo_de_materia}`;
	return;
}

$(document).ready(function(){
	get_cursos();
	$('#seleccionar_curso').change(()=>{get_materias_del_curso()});
	$('#seleccionar_materia').change(()=>{get_libros_del_curso()});
	$('#nuevo').click(()=>{nuevo()});


})