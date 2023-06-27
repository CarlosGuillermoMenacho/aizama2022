let info = [];
let preguntas = [];
let imagenes = [];
let Preg = 1;
let observaciones = [];

function obtenerEvaluacion(){
	let codeva = $('#codeva').val();
	$.post(
		"evaluacion_escrita_json.php?op=ver_evaluacion&usr=alu",
		{id:codeva},
		(datos,estado)=>{
			let status = datos['status'];
			if(status=="noEval"){
				Swal.fire({
                    title: 'No se encontró ninguna evaluación disponible...!!!',
                    confirmButtonText: `OK`,
                  }).then((result) => {
                                    /* Read more about isConfirmed, isDenied below */
                                    if (result.isConfirmed) {
                                      location.href = "evaluacion_escrita_alu.php";
                                    }
                                  })
			}
			if (status=="ok") {
				info = datos['info'];
				preguntas = datos['preguntas'];
				imagenes = datos['imagenes'];
				observaciones = datos.observaciones;
				cargarDatos();
			}
		},
		"json"

		);

}
function cargarDatos() {
	document.getElementById('materia').innerHTML = "Materia: "+info['materia'];
	document.getElementById('tiempo').innerHTML = "Tiempo: "+getTiempo(info['tiempo']);
	document.getElementById('descripcion').innerHTML = info['descripcion'];
	document.getElementById('m1').innerHTML = sumarNota();
	let indice = 1;
	$('#botones').empty();
	preguntas.forEach(()=>{
		$('#botones').append(
				`<button class="unselected" id="btn${indice}" onclick="mostrarPregunta(${indice})">${indice}</button>`
			);
		indice++;
	});
	mostrarPregunta(Preg);
}
function sumarNota() {
	let nota = 0;
	preguntas.forEach((pregunta)=>{
		nota = nota + parseInt(pregunta.nota);
	});
	return nota;
}
function getTiempo(time) {
	let h = Math.floor(time/60);
	let m = time%60;
	let r = "";
	if (h == 1) r = h + " hora ";
	if (h > 1) r = h + " horas ";
	if (m == 1)	r = r + m +" minuto.";
	if (m > 1)	r = r + m +" minutos.";
	return r;
}


function salir(){
	location.href = "evaluacion_escrita_alu.php";
}

function mostrarPregunta(nroPreg) {
	$(`#btn${Preg}`).removeClass("selected");
	$(`#btn${Preg}`).addClass("unselected");
	$(`#btn${nroPreg}`).removeClass("unselected");
	$(`#btn${nroPreg}`).addClass("selected");
	mostrarImagen(nroPreg);
	document.getElementById('npreg').innerHTML = "Pregunta "+nroPreg;
	document.getElementById('pregunta').innerHTML = preguntas[nroPreg-1]['pregunta'];
	document.getElementById('respuesta').value = preguntas[nroPreg-1]['respuesta'];
	document.getElementById('nota-respuesta').innerHTML = preguntas[nroPreg-1].nota;
	document.getElementById('observacion').value = obtenerObservacion(nroPreg);
	Preg = nroPreg;
	
}
function mostrarImagen(nroPreg) {
	let codpreg = preguntas[nroPreg-1].idPreg;
	for (var i = 0; i < imagenes.length; i++) {
		if(imagenes[i].idPreg == codpreg){
			document.getElementById('image').src = 'imgResources/' + imagenes[i].link;
			$('#image').css('display','inline');
			return;
		}
	}
	$('#image').css('display','none');
	return;
}

function siguiente() {
	if (Preg<preguntas.length) {
		mostrarPregunta(Preg+1);
	}
}
function mostrarSRC() {
	Swal.fire({
			imageUrl: document.getElementById('image').src
	});
}
function obtenerObservacion(nroPreg) {
	let codpreg = preguntas[nroPreg-1].idPreg;
	for (var i = 0; i < observaciones.length; i++) {
		if(observaciones[i].codpreg == codpreg){
			return observaciones[i].observacion;
		}
	}
	return "";
}
function anterior() {
	if (Preg>1) {
		mostrarPregunta(Preg-1);
	}
}

$(document).ready(()=>{
	obtenerEvaluacion();
})