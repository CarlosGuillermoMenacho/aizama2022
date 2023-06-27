let reuniones = [];

function guardar(){

	if(validar()){
		let formdata = new FormData($('#formulario')[0]);
		$.ajax({
          		url:'reuniones_json.php?op=sr&usr=adm',
          		type:'POST',
          		data:formdata,
          		processData:false,
          		contentType:false,
          		success: (result)=>{
            		if (result=="ok") {
            			alert("Reunión registrada exitosamente...!!!");
            			limpiarForm();
            			obtenerReuniones();
            		}
            		if (result == "errorTime") {
            			alert("Error en la hora de inicio y fin!!!");  
            			$('#horai').focus();          			
            		}
            		if (result == "errorEnlace") {
            			alert("Error enlace no válido!!!");  
            			$('#enlace').focus();          			
            		}
          		}
        });
	}else{
		alert("Debe llenar los campos necesarios...!!!");
		return;
	}
}
function validar(){
	let fecha = document.getElementById('fecha').value;
	let horai = document.getElementById('horai').value;
	let horaf = document.getElementById('horaf').value;
	let enlace = document.getElementById('enlace').value;
	let descripcion = document.getElementById('descripcion').value;

	if (fecha == "") {$('#fecha').focus();return false;}
	if (horai == "") {$('#horai').focus();return false;}
	if (horaf == "") {$('#horaf').focus();return false;}
	if (enlace == "") {$('#enlace').focus();return false;}
	if (descripcion == "") {$('#descripcion').focus();return false;}

	return true;
}
function limpiarForm(){
	$('#fecha').val("");
	$('#horai').val("");
	$('#horaf').val("");
	$('#enlace').val("");
	$('#descripcion').val("");
}
function obtenerReuniones() {
	$.post(
			"reuniones_json.php?op=gr&usr=adm",
			(datos,estado,xhr)=>{
				reuniones = datos;
				mostrarReuniones();
			},
			"json"

		);
}
function mostrarReuniones(){
	$('#campos').empty();
	let inidice = 1;
	reuniones.forEach((reunion)=>{
		let id = reunion['id'];
		let descripcion = reunion['descripcion'];
		let enlace = reunion['enlace'];
		let fecha = reunion['fecha'];
		let horai = reunion['horai'];
		let horaf = reunion['horaf'];

		$('#campos').append(`<tr>
								<td data-label="Nro.">${inidice}</td>
								<td data-label="Descripción"><a href="${enlace}" target="_blanck">${descripcion}</td>
								<td data-label="Fecha">${fecha}</td>
								<td data-label="Hora Inicio">${horai}</td>
								<td data-label="Hora Fin">${horaf}</td>
								<td data-label="Opciones">
									<button class="btn-light" onclick="eliminarReunion(${id})" style="margin-right:10px; color:#e6344a;">Eliminar</button>
									<button class="btn-light" onclick="editarReunion(${id})" style="color:#023859;">Editar</button>
								</td>
							</tr>`);
		inidice++;
	});
	ocultarForm();
}
function editarReunion(id){
	cargarForm(id);
	$('#id').val(id);
	mostrarFormEdit();
}
function cargarForm(id) {
	reuniones.forEach((reunion)=>{
		let id_r = reunion['id'];
		if (id == id_r) {
			$('#fecha').val(reunion['fecha']);
			$('#horai').val(reunion['horai']);
			$('#horaf').val(reunion['horaf']);
			$('#enlace').val(reunion['enlace']);
			$('#descripcion').val(reunion['descripcion']);
			return;
		}
	});
}
function mostrarForm() {

	$('#tabla').css('display','none');
	$('#conten-form').css('display','block');

}
function mostrarFormEdit() {

	$('#tabla').css('display','none');
	$('#btn-guardar').css('display','none');
	$('#btn-actualizar').css('display','inline');
	$('#conten-form').css('display','block');

}
function ocultarForm() {
	limpiarForm();
	$('#btn-nuevo').css('display','block');
	$('#tabla').css('display','block');
	$('#btn-actualizar').css('display','none');
	$('#btn-guardar').css('display','inline');
	$('#conten-form').css('display','none');

}
function actualizar() {
	if(validar()){
		let formdata = new FormData($('#formulario')[0]);
		$.ajax({
          		url:'reuniones_json.php?op=ur&usr=adm',
          		type:'POST',
          		data:formdata,
          		processData:false,
          		contentType:false,
          		success: (result)=>{
            		if (result=="ok") {
            			alert("Reunión registrada exitosamente...!!!");
            			limpiarForm();
            			obtenerReuniones();
            		}
            		if (result == "errorTime") {
            			alert("Error en la hora de inicio y fin!!!");  
            			$('#horai').focus();          			
            		}
            		if (result == "errorEnlace") {
            			alert("Error enlace no válido!!!");  
            			$('#enlace').focus();          			
            		}
          		}
        });
	}else{
		alert("Debe llenar los campos necesarios...!!!");
		return;
	}
}
function eliminarReunion(id) {
	$.post(
			"reuniones_json.php?op=dr&usr=adm",
			{id:id},
			(datos,estado,xhr)=>{
				if(datos == "ok"){
					alert("Reunión eliminada...!!!");
					obtenerReuniones();
					return;
				}
				
			},
			"text"

		);
}
$(document).ready(()=>{
	obtenerReuniones();
	$('#formulario').on('submit',(e)=>e.preventDefault());
	$('#btn-guardar').click(()=>guardar());
	$('#btn-nuevo').click(()=>mostrarForm());
	$('#btn-cancelar').click(()=>ocultarForm());
	$('#btn-actualizar').click(()=>actualizar());
})