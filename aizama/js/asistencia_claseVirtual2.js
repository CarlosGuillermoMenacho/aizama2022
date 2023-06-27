let codcur;
let codpar;
let asistencias = [];
let clases = [];
let licencias = [];
let lista = [];
let codprof;
let estados = ["Falta","Presente","Con Licencia","Retraso"];
let dominio = 'https://www.aizama.net';
let clase_seleccionada = 0;
let nombre_Curso;
let listaDeTutores = [];
function obtener_curso_paralelo(){
	codcur = getParameterByName('curso');
	codpar = getParameterByName('paralelo');
	codprof = $('#codprof').val();
}
function ObtenerNombreCurso() {
    let nombreCurso; 
    const url = `getCurso_and_getParalelo.php?curso=${codcur}&paralelo=${codpar}`;
    var obtenerCurso = new XMLHttpRequest();
    obtenerCurso.onload = () => {
	    if (obtenerCurso.status >= 200 && obtenerCurso.status < 300) {
	        nombreCurso = obtenerCurso.response;
	        nombre_Curso = nombreCurso;
	    } else {
		    console.log('Error en la petición!');
	    }
    }
    obtenerCurso.open('POST', url, false);
    obtenerCurso.send();
    return nombreCurso;
}
function obtenerListaTutores(){
	$.post(
			'data_agenda.php?op=obtener_tutores_cel',
			{codcur:codcur,codpar:codpar},
			(datos)=>{
				let status = datos.status;
				
				if (status=="ok") {
					listaDeTutores = datos.lista;
				}
			},
			"json"
		);
}
function obtenerListas(){
	let fecha = $('#fecha').val();
	if(fecha != ""){
		$.post(
				'asistencia_json.php?op=asistencia_horario',
				{codcur : codcur,
				 codpar : codpar,
				 fecha : fecha},
				 (datos,estado,xhr)=>{
				 	let status = datos['status'];
				 	if (status == "ok") {
				 		asistencias = datos['asistencias'];
				 		clases = datos['clases'];
				 		mostrarFecha(datos['fecha']);
				 		licencias = datos['licencias'];
				 		lista = datos['lista'];
				 		cargarClases();
				 	}
				 	if(status=="noClases"){
				 		clase_seleccionada = 0;
				 		limpiar();
				 	}
				 },
				 "json"

				);
	}else{
		$('#fecha').focus();
		Swal.fire('Debe ingresar una fecha...!!!');
	}
}
function limpiar() {
	clase_seleccionada = 0;
	$('#seleccionar_materia').empty();
	$('#seleccionar_materia').append('<option value=0>-- Seleccionar una clase --</option>');
	$('#campos').empty();
}
function cargarClases(){
	$('#seleccionar_materia').empty();
	$('#seleccionar_materia').append('<option value=0>-- Selecciona una clase --</option>');
	clases.forEach((clase)=>{
		let fin = clase['fin'];
		let inicio = clase['inicio'];
		let id_clase = clase['id_clase'];
		let materia = clase['materia'];
		$('#seleccionar_materia').append(`<option value=${id_clase}>${materia} ${inicio} a ${fin}</option>`);
	});
	if (clase_seleccionada == 0) {
		let id_clase = clases[0]['id_clase'];
		$('#seleccionar_materia').val(id_clase);
		mostrarLista();
	}else{
		$('#seleccionar_materia').val(clase_seleccionada);
		mostrarLista();
	}
}
function mostrarCurso(){
	document.getElementById('curso').innerHTML = ObtenerNombreCurso();
}
function mostrarFecha(fecha){
	document.getElementById('fechaText').innerHTML = fecha;
}
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function mostrarLista(){
	let id_clase = $('#seleccionar_materia').val();
	clase_seleccionada = id_clase;
	if(id_clase>0){
		let indice = 1;
		$('#campos').empty();
		lista.forEach((alumno)=>{
			let codalu = alumno['codalu'];
			let nombre = alumno['nombre'];
			let licencia = obtenereLicencia(codalu);
			let asistencia = obtenerAsistencia(codalu,id_clase);
			let estado = asistencia.length>0?estados[asistencia[0]] :"&nbsp;";
			let id_a = asistencia.length>0?asistencia[1] :0;
			let lic = licencia==""?"&nbsp;":`<button onclick="mostrarDetalleLicencia(${codalu})">Licencia</button>`;
			
			$('#campos').append(
								`<tr>
									<td data-label="Nro">${indice}</td>
									<td data-label="Nombre">${nombre}</td>
									<td data-label="Estado">${estado}</td>
									<td data-label="Registrar">
										<button class="btn-asistencia btn-presente" onclick="registrar(${codalu},1,${id_a})">P</button>
										<button class="btn-asistencia btn-presente" onclick="registrar(${codalu},2,${id_a})">L</button>
										<button class="btn-asistencia btn-falta" onclick="registrar(${codalu},3,${id_a})">R</button>
										<button class="btn-asistencia btn-falta" onclick="registrar(${codalu},0,${id_a})">F</button>
									</td>
									<td data-label="Liccencia">
										${lic}
									</td>
								 </tr>`
								);
			indice++;
		});
	}
}
function registrar(codalu,estado,id_asistencia){
	let fecha = $('#fecha').val();
	$.post(
			'asistencia_json.php?op=reg_asistencia',
			{codalu : codalu,
			 codclase : clase_seleccionada,
			 fecha : fecha,
			 estado : estado,
			 id_asistencia : id_asistencia},
			 (datos,est,xhr)=>{
			 	if (datos=="ok") {
			 		Swal.fire({title:"Grabado con Éxito...!!!"});
			 		enviarMensaje(codalu,estado,clase_seleccionada);
			 		obtenerListas();
			 	}
			 }
			);
}
function obtenerNombreAlumno(cod_alu) {
	for (var i = 0; i < lista.length; i++) {
		if(lista[i].codalu == cod_alu)return lista[i].nombre;
	}
	return "";
}
function obtenerNombreMateria(codclase) {
	for (var i = 0; i < clases.length; i++) {
		if(clases[i].id_clase == codclase)return clases[i].materia;
	}
	return "";
}
function enviarMsgWhatsapp(codalu,msg){
	let nombre_Alumno = obtenerNombreAlumno(codalu);
	let materia = obtenerNombreMateria(clase_seleccionada);

	let mensaje = `Curso: ${nombre_Curso} - Materia: ${materia} - Alumno: ${nombre_Alumno} - ${msg}`;
	console.log(listaDeTutores);
	listaDeTutores.forEach((tutor)=>{
		let codigo = tutor.codalu;
		let celular = tutor.celular;
		if(codigo==codalu&&celular!=""){
            if (celular.includes('+')){
                celular=celular.slice(1);
                $.post("https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensaje+"&phone="+celular);
            }
            else{
    			$.post("https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensaje+"&phone=591"+celular);
            }
		}
	});
}

function enviarMensaje(codalu,estado,codclase){
	let clase = obtenerClase(codclase);
	let codmat = clase['codmat'];
	let msg = "";
	console.log(estado);
	if(estado == 0) msg = `El estudiante NO se encuentra presente en la clase`;
	if(estado == 1) msg = `El estudiante se encuentra presente en la clase`;
	if(estado == 2) msg = `El estudiante se ha registrado con licencia`;
	if(estado == 3) msg = `El estudiante ha ingresado con retraso a la clase`;
	enviarMsgWhatsapp(codalu,msg);
	//return;
	$.ajax({
        method: "POST",
        url: `${dominio}/agenda/mensajeprof`,
        data: JSON.stringify({ codEst: codalu, codEmit: codprof,msg:msg,codmat:codmat}),
        contentType: "application/json",
        success:function(data){
            if( data=="ok" ) {
                return;
            } else {
                alert('error');
                return;
            }    
        }
    });
}

function obtenerClase(codclase){
	for (var i = 0; i < clases.length; i++) {
		if(clases[i]['id_clase'] == codclase)return clases[i];
	}
	return "";
}

function mostrarDetalleLicencia(codalu) {
    
    Swal.fire({
       title: obtenereLicencia(codalu)
    });
    
}
function obtenereLicencia(codalu) {
	for (var i = 0; i < licencias.length; i++) {
		if (licencias[i]['codalu']==codalu) {
			return licencias[i]['obs'];
		}
	}
	return "";
}
function obtenerAsistencia(codalu,clase) {
	for (var i = 0; i < asistencias.length; i++) {
		if(asistencias[i]['codalu']==codalu && asistencias[i]['codclase']==clase){
			return [asistencias[i]['estado'],asistencias[i]['id_asistencia']];
		}
	}
	return [];
}
function cambioFecha() {
	obtenerListas();
}
$(document).ready(()=>{
	obtener_curso_paralelo();
	obtenerListas();
	mostrarCurso();
	obtenerListaTutores();
	$('#btn_buscar').click(()=>obtenerListas());
	$('#seleccionar_materia').change(()=>mostrarLista());
	$('#fecha').change(()=>cambioFecha());
});