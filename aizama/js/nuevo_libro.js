const url = "https://agendaaizama.net/biblioteca_digital/biblioteca_digital.php";
function nombre_curso() {
	let codigo_de_curso = $('#codcur').val();
	$.post(
			url+"?op=nc",
			{cur: codigo_de_curso},
			(datos,estado,xhr) => {
				$('#curso').val(datos);
			}
			
			)
}
function nombre_materia() {
	let codigo_de_materia = $('#codmat').val();
	$.post(
			url+"?op=nm",
			{mat: codigo_de_materia},
			(datos,estado,xhr) => {
				$('#materia').val(datos);
			}
			
			)
}
function get_editoriales(){
	$.post(
			url+"?op=get_editoriales",
			(datos,estado,xhr) => {
				$('#select_editorial').append(`<option value="0">Elegir Editorial....</option>`);
				datos.forEach((editorial)=>{
					let id = editorial['id'];
					let nombre = editorial['nombre'];
					$('#select_editorial').append(`<option value="${id}">${nombre}</option>`);
				});
			},
			"json"
			);
}
function nuevo_libro(){

	let nombre = document.getElementById('enlace').value;
	let edicion = document.getElementById('descripcion').value;
	let editorial = document.getElementById('select_editorial').value;
	let codigo_de_curso = document.getElementById('codcur').value;
	let codigo_de_materia = document.getElementById('codmat').value;
	let profesor = document.getElementById('codprof').value;

	if(nombre == "" || edicion == "" || editorial == "0"){
		alert("Debe llenar los campos necesarios...!!!");
		if (nombre==""){
			$('#enlace').focus();
		}else if (edicion==""){
			$('#descripcion').focus();
		}else if (editorial=="0"){
			$('#select_editorial').focus();
		}
		return;
	}
	$.post(
			url+"?op=crear_libro",
			{ nombre : nombre,
			  edicion : edicion,
			  editorial : editorial,
			  codcur : codigo_de_curso,
			  codmat : codigo_de_materia,
			  codprof : profesor},
			(datos,estado,xhr) => {
				if (datos=="ok") {
					alert("Libro creado exitosamente...!!!");
					location.href = "registro_libros.php";
					return;
				}
				
			},
			"text"
			);

	
}
$(document).ready(function() {
	nombre_curso();	
	nombre_materia();
	get_editoriales();
	$('#asignarMateria').click(()=>nuevo_libro());
	$('#formulario').on('submit',(event)=>event.preventDefault());	
})
