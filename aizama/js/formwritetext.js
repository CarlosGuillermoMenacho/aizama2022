let info = [];
let preguntas = [];
let imagenes = [];
let Preg = 1;
let tiempo = 0;
var timer;
let fin = 1;
let hora_device;
function obtenerEvaluacion(){
	$.get(
		"evaluacion_escrita_json.php?op=getEvalInProccess&usr=alu",
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
				cargarDatos();
			}
			if(status=="evalFinalized"){
				Swal.fire({
                    title: 'El tiempo para resolver la evaluación ha terminado...!!!',
                    confirmButtonText: `OK`,
                   }).then((result) => {
                                    /* Read more about isConfirmed, isDenied below */
                                    if (result.isConfirmed) {
                                      location.href = "evaluacion_escrita_alu.php";
                                    }
                           })
			}
		},
		"json"

		);

}
function cargarDatos() {
	document.getElementById('materia').innerHTML = "Materia: "+info['materia'];
	document.getElementById('tiempo').innerHTML = "Tiempo: "+getTiempo(info['tiempo']);
	document.getElementById('descripcion').innerHTML = info['descripcion'];
	let indice = 1;
	$('#botones').empty();
	preguntas.forEach(()=>{
		$('#botones').append(
				`<button class="unselected" id="btn${indice}" onclick="guardarRespuesta(${indice})">${indice}</button>`
			);
		indice++;
	});
	mostrarPregunta(Preg);
	iniciarReloj();

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
function contador(){
	let horaActual = new Date();
	let dif = Math.abs(Math.floor((horaActual.getTime() - hora_device.getTime())/1000));
	if(dif<2){
		hora_device = horaActual; 
		let minutos = Math.floor(tiempo/60)%60;
		let horas = Math.floor(tiempo/3600);
		let segundos = tiempo%60;
			if (horas<10) {
				document.getElementById('h1').innerHTML = '0';
				document.getElementById('h2').innerHTML = horas;
			}else{
				document.getElementById('h1').innerHTML = Math.floor(horas/10);
				document.getElementById('h2').innerHTML = horas%10;
			}


		if (minutos<10) {
			document.getElementById('m1').innerHTML = '0';
			document.getElementById('m2').innerHTML = minutos;
		}else{
			document.getElementById('m1').innerHTML = Math.floor(minutos/10);
			document.getElementById('m2').innerHTML = minutos%10;
		}
		if (segundos<10) {
			document.getElementById('s1').innerHTML = '0';
			document.getElementById('s2').innerHTML = segundos;
		}else{
			document.getElementById('s1').innerHTML = Math.floor(segundos/10);
			document.getElementById('s2').innerHTML = segundos%10;
		}

		
		if (tiempo==0) {
			clearInterval(timer);
			finalizarEvaluacion();
		}
		tiempo--;
	}else{
		finalizarTimer();
		obtenerEvaluacion();
	}
}
function finalizarEvaluacion() {
    guardarRespuesta2(Preg+1);
	Swal.queue([{
					    title: 'Advertencia',
					    confirmButtonText: 'Aceptar',
					    text: 'Se finalizará la evaluación...',
					    cancelButtonText: 'Cancelar',
					    cancelButtonColor: '#E6344A',
					    showLoaderOnConfirm: true,
					    showCancelButton: true,
					    preConfirm: function()
					    {
					    	//guardarRespuesta(Preg+1);
					    	let idProc = info['idProc'];
								$('#respuesta').attr('readonly','readonly');
								return $.post(
											'evaluacion_escrita_json.php?op=finalizarEvaluacion&usr=alu',
											{id:idProc},
											(datos,estado,xhr)=>{
												if (datos=="ok") {
													$('#btn-finalizar').css('display','none');
													$('#btn-salir').removeClass('display-none')
													fin = 0;
													finalizarTimer();
													Swal.fire({
						                          title: 'Evaluación finalizada...!!!',
						                          confirmButtonText: `OK`,
						                        })
												}
											},"text"
									);				        
					    }
					}]);
		
}

function salir(){
	location.href = "evaluacion_escrita_alu.php";
}
function finalizarTimer(){
	clearInterval(timer);
		document.getElementById('h1').innerHTML = "0";
		document.getElementById('h2').innerHTML = "0";
		document.getElementById('m1').innerHTML = "0";
		document.getElementById('m2').innerHTML = "0";
		document.getElementById('s1').innerHTML = "0";
		document.getElementById('s2').innerHTML = "0";
}
function iniciarReloj(){
	tiempo = info['resto'];
	hora_device = new Date();
	timer = setInterval('contador()',1000);
}
function mostrarPregunta(nroPreg) {
	$(`#btn${Preg}`).removeClass("selected");
	$(`#btn${Preg}`).addClass("unselected");
	$(`#btn${nroPreg}`).removeClass("unselected");
	mostrarImagen(nroPreg);
	$(`#btn${nroPreg}`).addClass("selected");
	document.getElementById('npreg').innerHTML = "Pregunta "+nroPreg;
	document.getElementById('pregunta').innerHTML = preguntas[nroPreg-1]['pregunta'];
	document.getElementById('respuesta').value = preguntas[nroPreg-1]['respuesta'];
	Preg = nroPreg;
	
}
function mostrarImg(){
	Swal.fire({
			imageUrl: document.getElementById('imagen').src
	});
}
function mostrarImagen(nroPreg) {
	let codpreg = preguntas[nroPreg-1].idPreg;
	for (var i = 0; i < imagenes.length; i++) {
		if(imagenes[i].idPreg == codpreg){
			document.getElementById('imagen').src = 'imgResources/'+imagenes[i].link;
			$('#imagen').css('display','inline');
			return;
		}
	}
	$('#imagen').css('display','none');
	return;
}

function siguiente() {
	if (Preg<preguntas.length) {
		guardarRespuesta(Preg+1);
	}
}
function anterior() {
	if (Preg>1) {
		guardarRespuesta(Preg-1);
	}
}
function guardarRespuesta(nroPreg) {
	let resp = $('#respuesta').val();
	let respA = preguntas[Preg-1]['respuesta'];
	let proceso = info['idProc'];
	if(resp!=""&&resp!=respA&&fin!=0){
		preguntas[Preg-1]['respuesta'] = resp;
		let idResp = preguntas[Preg-1]['idResp'];
		$.post(
					'evaluacion_escrita_json.php?op=save_resp&usr=alu',
					{idResp:idResp,respuesta:resp,idProc:proceso}
				);
	}
	mostrarPregunta(nroPreg);
}
function guardarRespuesta2(nroPreg) {
	let resp = $('#respuesta').val();
	let respA = preguntas[Preg-1]['respuesta'];
	let proceso = info['idProc'];
	if(resp!=""&&resp!=respA&&fin!=0){
		preguntas[Preg-1]['respuesta'] = resp;
		let idResp = preguntas[Preg-1]['idResp'];
		$.post(
					'evaluacion_escrita_json.php?op=save_resp&usr=alu',
					{idResp:idResp,respuesta:resp,idProc:proceso}
				);
	}
}


$(document).ready(()=>{
	obtenerEvaluacion();
})