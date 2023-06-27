let codigo_de_profesor; 
let cursos_del_profesor;
let materias_del_profesor;
let curso;
let paralelo;
let lista_de_evaluaciones = [];
let lista_de_preguntas = [];
let lista_de_alumnos = [];
let lista_de_notas = [];
var evaluacion;
let respuesta_de_alumno=[];
let observaciones=[];
let imagenes=[];
var npreg=1;
let alumno ;
let idPregunta;
let nro_evaluacion;
let nota_evaluacion;

var dominio = 'https://www.aizama.net';
var nombre_curso;
var nombre_materia;
var nuevo_msg;
var lista_celulares = [];
var lista2=[];
let evalucion_seleccionada;

let formNuevaEvaluacion = [];

let control_indicadores = [];
let espera = 0;
//var lista=[];
function noEvaluaron(){
    Swal.queue([{
                title: 'Advertencia',
                confirmButtonText: 'Aceptar',
                text: 'Se enviará una notificación a los tutores informando que el estudiante no realizó la evaluación',
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#E6344A',
                showLoaderOnConfirm: true,
                showCancelButton: true,
                preConfirm: function()
                {
                    lista_de_alumnos.forEach((alumno)=>{
                       if(!tieneNota(alumno.codalu)){
                           enviarMensaje2(alumno.codalu,0,"NO REALIZÓ SU EXAMEN");
                       } 
                    });
                }
            }]);
}
function tieneNota(codalu){
    for(let i = 0 ; i < lista_de_notas.length ; i++){
        if(lista_de_notas[i].codalu == codalu)return true;
    }
    return false;
}
function obtenerNombreEstudiante(id){
    for (var i = 0; i < lista_de_alumnos.length; i++) {
        if(lista_de_alumnos[i].codalu==id)return lista_de_alumnos[i].nombre;
    }
    return "";
}
function enviarMensaje2(id,notaAl,obsAl){
   let nombre = obtenerNombreEstudiante(id);
   let codalu = id;
   let mensajeAlumno = `Evaluación Escrita nro.: ${nro_evaluacion} - Nota: ${notaAl}/${nota_evaluacion} - Materia: ${nombre_materia} - Obs.: ${obsAl}`;
   let mensajeTutor = `Evaluación Escrita nro.: ${nro_evaluacion} - Nota: ${notaAl}/${nota_evaluacion} - Alumno: ${nombre} - Materia: ${nombre_materia} - Curso: ${nombre_curso} - Obs.: ${obsAl}`;
   lista_celulares.forEach(
    (alumno)=>{
        if(alumno.codalu == codalu && alumno.celular!=""){
            if (alumno.celular.includes('+')){
                alumno.celular=alumno.celular.slice(1);
    	        $.get(
    	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensajeTutor+"&phone="+alumno.celular
    	            );
            }
            else{
                $.get(
                    "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensajeTutor+"&phone=591"+alumno.celular
                    );
            }
        }
    }
   );
   $.post(
        'data_agenda.php?op=alumno_celular',
        {codalu:codalu},
        (nroCelular)=>{
            if(nroCelular!=""){
                if (nroCelular.includes('+')){
                    nroCelular=nroCelular.slice(1);
        	        $.get(
        	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensajeAlumno+"&phone="+nroCelular
        	            );
                }
                else{
                    $.get(
                        "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensajeAlumno+"&phone=591"+nroCelular
                    );
                }
            }
        }
        );
        
            var m = document.getElementById("seleccionar_materia");
            var materia = m.options[m.selectedIndex].value;    

            var c_recibe = id;
            var emite = $('#codprof').val();
            var msgr = mensajeTutor;
    		$.ajax({
                method: "POST",
                url: `${dominio}/agenda/mensajeprof`,
                data: JSON.stringify({ codEst: c_recibe, codEmit: emite,msg:msgr,codmat:materia}),
                contentType: "application/json",
                success:function(data){
                    if(data=="ok"){
                       // alert("Mensaje enviado correctamente gol de todos: "+c_recibe+" - "+emite+"-"+msgr+"-"+materia);
                    }else{
                        alert('error');
                    }    
                }
                });
    

}
function cargarLista(fechaini,fechafin,horaini,horafin,descripcion,nota_evaluacion)
{

	lista2=[];
	$.ajax({
			type:"POST",
			url:"data_agenda.php?op=lista&paralelo="+paralelo,
			data:"cod_curso=" + curso,
			success:function(r){
				if(r=='eSession'){
	  				alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  				return false;
					}
				var ac="";
				for (var i = 0; i < r.length; i++) {
					if (r[i]!=',') {
						ac=ac+r[i];	
					}else{
						lista2.push(ac);
						ac="";
					} 
				}

				lista2.push(ac);
				let fechai = fechaini;
				let horai = horaini;
				let fechaf = fechafin;
				let horaf = horafin;
				let descrip = descripcion;
				let nota2 = nota_evaluacion;
				//alert(3);
				getmsgallclass(`EXAMEN (Evaluación Escrita) sobre: ${nota2}, desde: ${fechai} - ${horai} hasta: ${fechaf} - ${horaf} Descripcion: ${descrip}`);

			}
			});
}
function obtenerCelulares(){


    $.post(
            "data_agenda.php?op=obtener_tutores_cel",
            {codcur:curso,codpar:paralelo},
            (datos,estado,xhr)=>{
				
                let status = datos.status;
				
                if(status=="ok"){
                    lista_celulares = datos.lista;

					

                    return;
                }
            },
            'json'
        );
}

function obtenerNombreMateria(){
	let codmat = $('#seleccionar_materia').val();
	for(let i = 0; i < materias_del_profesor.length; i++){
		if(materias_del_profesor[i].codmat==codmat){
			nombre_materia = materias_del_profesor[i].nombre;
			return;
		}

	}
}
function obtenerContactos (codalu){
    let lista20= [];

    lista_celulares.forEach((celular)=>{
        if(celular.codalu==codalu){
            lista20.push(celular.celular);
        }
        
    });
    return lista20;
}

function getmsgalu2(id,msg){
			nuevo_msg='Curso: '+nombre_curso+' Materia: '+nombre_materia+' - '+msg;
			let contactos = obtenerContactos(id);

	    	contactos.forEach((contacto)=>{
                if (contacto.includes('+')){
                    contacto=contacto.slice(1);
        	        $.get(
        	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone="+contacto
        	            );
                }
                else{
        	        $.get(
	                    "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto
	                    );
                }
	    	});
	        $.post(
	    	    'data_agenda.php?alumno_celular',
	    	    {codalu:id},
	    	    (nroCelular)=>{
	    	        if(nroCelular!=""){
                        if (nroCelular.includes('+')){
                            nroCelular=nroCelular.slice(1);
                	        $.get(
                	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone="+nroCelular
                	            );
                        }
                        else{
    	    	            $.get(
                	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+nroCelular
                	            );
                        }
	    	        }
	    	    });

            var m = document.getElementById("seleccionar_materia");
            var materia = m.options[m.selectedIndex].value;    

            var c_recibe = id;
            var emite = $('#codprof').val();
            var msgr = msg;
            //alert ('Est.:'+c_recibe+' - Prof.: '+emite+' - Mensaje: '+msgr+' - Materia: '+materia);
    		$.ajax({
                method: "POST",
                url: `${dominio}/agenda/mensajeprof`,
                data: JSON.stringify({ codEst: c_recibe, codEmit: emite,msg:msgr,codmat:materia}),
                contentType: "application/json",
                success:function(data){
                    if(data=="ok"){
                       // alert("Mensaje enviado correctamente gol de todos: "+c_recibe+" - "+emite+"-"+msgr+"-"+materia);
                    }else{
                        alert('error');
                    }    
                }
                });
                return true;
}

function getmsgallclass(msg){

	if (validardatos1()&&lista2.length>0) {
		for (var i = 0; i < lista2.length; i++) {
			if(!getmsgalu2(lista2[i],msg)){
				alert('Error al enviar mensages,actualizar e intentar nuevamente');	
				return false;
			}

		}
		
		    //getmsgalu2(2,msg);
		
		    $('#msncurso').val("");
		    $('#msnalu').val("");
		  	//alert('Mensaje enviado correctamente a la agenda y al Whatsapp de los tutores');	
		  	return true;
	}else{
		alert('Debe seleccionar: Curso y Materia o actualizar la página');
		return false;
	}

}
function validardatos1(){
	if ($('#seleccionar_curso').val()!='' && $('#seleccionar_materia').val()!=0) {
		return true;
	}
	$('#seleccionar_curso').focus();
	return false;
}


function profesor(){
	codigo_de_profesor = document.getElementById('codprof').value;
}
function obetner_cursos_del_profesor(){
	$.post(
			'obtener_curso_json.php?op=cp',
			(datos,estado,xhr)=>{
				let status = datos['status'];
				if (status=='ok') {
					cursos_del_profesor = datos['cursos'];
					cargarCursos();
				}
			},
			"json"
		);
}
function cargarCursos(){
	let indice = 1;
	cursos_del_profesor.forEach((curso)=>{
		let nombre = curso['nombre'];

		$('#seleccionar_curso').append(`<option value="${indice}">${nombre}</option>`);
		indice++;

	});
}
function obtner_materias_del_profesor(){
	$.post(
			'obtener_materias_json.php?op=getmatprof',
			(datos,estado,xhr)=>{
				let status = datos['status'];
				if (status=='ok') {
					materias_del_profesor = datos['materias'];
				}
			},
			"json"
		);
}
function verPreguntas(idEvaluacion){
	$('#codeva').val(idEvaluacion);
	evaluacion = idEvaluacion;
	$('#campos-preguntas').empty();
	document.getElementById('label-preguntas').innerHTML = obtenerDescripcion(idEvaluacion);
	let indice = 1;
	let preg = obtenerPregunta(indice,idEvaluacion);
	while(preg){
		let idPreg = preg['idPreg'];
		let pregunta = preg['pregunta'];
		let idImg = preg['idImg'];
		let link = preg['link'];
		let opciones;
		if (idImg=="") {
			opciones = `<td data-label="Imagen">&nbsp;</td>
						<td data-label="Opciones">
							<button class="btn-editar bloque margen-btn" onclick="editarPregunta(${idPreg})">Editar Pregunta</button>
							<button class="btn-eliminar bloque margen-btn" onclick="eliminarPregunta(${idPreg})">Eliminar Pregunta</button>
						</td>`;
		}else{
			opciones = `<td data-label="Imagen"><a href="imgResources/${link}" target="_blank" style="text-decoration:none;">Abrir Imagen</a></td>
						<td data-label="Opciones">
							<button class="btn-editar bloque margen-btn" onclick="editarPregunta(${idPreg})">Editar Pregunta</button>
							<button class="btn-eliminar bloque margen-btn" onclick="eliminarImagen(${idImg})">Eliminar Imagen</button>
							<button class="btn-eliminar bloque margen-btn" onclick="eliminarPregunta(${idPreg})">Eliminar Pregunta</button>
						</td>`;
		}

		$('#campos-preguntas').append(
									`<tr>
										<td data-label="Nro.">${indice}</td>
										<td data-label="Pregunta" style="text-align: left;">${pregunta}</td>
										${opciones}
									</tr>`
										);
		indice++;
		preg = obtenerPregunta(indice,idEvaluacion);
	}
	$('#tabla').css('display','none');
	$('#tabla-preguntas').css('display','block');
	$('#nuevo').css('display','none');

}
function editarPregunta(idPreg) {
	let pregunta = obtenerpregunta(idPreg);
	let link = pregunta.link;
	let pre = pregunta.pregunta;
	let idpreg = pregunta.idPreg;
	$('#idpreg').val(idpreg);
	$('#btn-guardar-pregunta').css('display','none');
	$('#btn-editar-pregunta').css('display','inline');
	$('#form-pregunta').val(pre);
	$('#div-preguntas').css('display','block');
	$('#form-pregunta').focus();

}
function editarPregunta_edit(){
	if(validarForm()){
		let formdata = new FormData($('#form-preguntas')[0]);
		let respueta=$.ajax({
						url:"evaluacion_escrita_json.php?op=update_pregunta&usr=doc",
						type: "POST",
						data:formdata,
						contentType: false, 
						processData: false,
						async:false}).responseText;
		if (respueta=="ok") {
			Swal.fire("Se guardó la pregunta exitosamente...!!!");
			limpiarFormPreguntas();
			obtenerEvaluaciones2($('#codeva').val());
			$('#div-preguntas').css('display','none');
		}

	}
}
function calificar(codalu,codeva){
	alumno=codalu;
	document.getElementById('nombre-alumno').innerHTML=obtenerNombre(codalu);
	$.post("evaluacion_escrita_json.php?op=respuesta-alumno&usr=doc",
			{codalu:codalu,codeva:codeva},
			(datos,estado,xhr)=>{
				let status=datos["status"];
				if (status=="ok"){

					respuesta_de_alumno=datos["respuestas"];
					observaciones=datos["observaciones"];
					imagenes=datos["imagenes"];
					sumarNotas();
					mostrarRespuestas(1);
				}
			},"json");
	$('#tabla-lista-alumnos').css('display','none');
	$('#primera-evaluación').css('display','block');
	$("#nuevo").css("display","none");
}

function mostrarRespuestas(nrespuesta){
	let idresp=respuesta_de_alumno[nrespuesta-1]["idresp"];
	let idpreg=respuesta_de_alumno[nrespuesta-1]["idpreg"];
	let nota=respuesta_de_alumno[nrespuesta-1]["nota"];
	let pregunta=respuesta_de_alumno[nrespuesta-1]["pregunta"];
	let respuesta=respuesta_de_alumno[nrespuesta-1]["respuesta"];
	let notaExamen = evalucion_seleccionada.nota;
	document.getElementById("pregunta").innerHTML=pregunta;
	let imagen = obtenerImagen(idpreg);
	if (imagen==""){
		$("#imagen").css ("display","none");
	}
	else{
		$("#imagen").attr ("src","imgResources/"+imagen);
		$("#imagen").css ("display","block");
	}
	document.getElementById("respuesta").innerHTML=respuesta;
	$("#nota").val (nota);
	$("#observacion-respuesta").val (obtenerObservacion(idresp));
	$('#nota-examen').val(notaExamen);
	$('#nota-restante').val($('#nota-examen').val()-$('#nota-final').val());
	document.getElementById('respuestas-calificadas').innerHTML = totalCalificadas();
	$('#respuestas-calificadas').css('background','#E6344A');
	if(todasCalificadas()){
		$('#respuestas-calificadas').css('background','#2C8C2C');
	}
}
function obtenerObservacion(idresp){
	for (var i = 0; i < observaciones.length; i++) {
		if (observaciones[i]["id_resp"]==idresp){
			return observaciones[i]["observacion"];
		}
	}
	return "";
}
function obtenerImagen(idpreg){
	for (var i = 0; i < imagenes.length; i++) {
		imagenes[i]
		if (imagenes[i]["codpreg"]==idpreg ){
			return imagenes[i]["link"];
		}
	}
	return "";
}
function obtenerNombre(codalu){
	for (var i = 0; i < lista_de_alumnos.length; i++) {
		if (lista_de_alumnos[i]['codalu']==codalu) {
			return lista_de_alumnos[i]['nombre'];
		}
	}
	return '';
}
function cerrarLista(){
	$('#tabla-lista-alumnos').css('display','none');
	$('#tabla').css('display','block');
}
function siguientePregunta(){
	let nota=$("#nota").val();
	if(nota==""){
		Swal.fire({title:"Debe introducir una nota"});
		return;
	}
	if (npreg<respuesta_de_alumno.length){
		npreg++;
		mostrarRespuestas(npreg);
	}
}
function anteriorPregunta(){
	if(npreg>1){
		npreg--;
		mostrarRespuestas(npreg);
	}
}
function verificarSuma(nota,){
    let nroPregunta = npreg - 1;
    let sum = 0;
    for(let i = 0 ; i < respuesta_de_alumno.length ; i++){
        if(i != nroPregunta){
            if(respuesta_de_alumno[i].nota!=""&&respuesta_de_alumno[i].nota!=null){
                sum = sum + parseInt(respuesta_de_alumno[i].nota);
            }
        }
    }
    sum = sum + parseInt(nota);

    let notaExamen = $('#nota-examen').val();
    
    if(sum > parseInt(notaExamen))return false;
    return true;
}
function guardarCalificacion(){
	let nota=$("#nota").val ();
	let observacion=$("#observacion-respuesta").val();
	if (nota==""){
		Swal.fire({title:"Debe introducir una nota"});
		return ;
	}
	if(!verificarSuma(nota)){
	    Swal.fire({title:"La nota ingresada es incorrecta.\nLa suma total excede la nota del examen que es: "+$('#nota-examen').val()+"\nSólo puede añadir la nota restante: "+$('#nota-restante').val()});
	    $('#nota').val(respuesta_de_alumno[npreg-1].nota);
		return ; 
	}
	let notaA = respuesta_de_alumno[npreg-1]["nota"];
	let idresp = respuesta_de_alumno[npreg-1]["idresp"];
	let observacionA = obtenerObservacion(idresp);
	if (nota!=notaA || observacion!=observacionA){
		let idresp=respuesta_de_alumno[npreg-1]["idresp"];
		$.post("evaluacion_escrita_json.php?op=cra&usr=doc",
			{codalu:alumno, idresp:idresp,nota:nota,obs:observacion},
			(datos,estado,xhr)=>{
				if (datos=="ok"){

					Swal.fire({title:"Guardado exitosamente"});
					actualizarLista(nota,observacion);
					sumarNotas();
					$('#nota-restante').val($('#nota-examen').val()-$('#nota-final').val());
					document.getElementById('respuestas-calificadas').innerHTML = totalCalificadas();
                	$('#respuestas-calificadas').css('background','#E6344A');
                	if(todasCalificadas()){
                		$('#respuestas-calificadas').css('background','#2C8C2C');
                	}
					return;
				}
			},
			"text");
	}
}
const calificar_2 = (alu,eva)=>{
	let nota = $(`#input-${alu}`).val();
	if(nota == "" || nota < 1 || nota > nota_evaluacion){
		Swal.fire(`Debe introducir una nota entre 1 y ${nota_evaluacion}`);
		return;
	}
	$.post(
		"evaluacion_escrita_json.php?op=calificar_presencial&usr=doc",
		{codeva:eva,codalu:alu,nota:nota},
		data=>{
			if (data == "ok") {
				revisar(evaluacion,nro_evaluacion,nota_evaluacion);
				Swal.fire("Nota guardada exitosamente");
			}
			if(data == "eSession"){
				location.href = "docentes.php";
				return;
			}
		},
		"text"
		);
}
function actualizarLista(nota,observacion){
	respuesta_de_alumno[npreg-1]["nota"]=nota;
	let idresp = respuesta_de_alumno[npreg-1]['idresp'];
	actualizarObservacion(idresp,observacion);
	return;
}
function actualizarObservacion(idresp,observacion){

	for (var i = 0; i < observaciones.length; i++) {
		if (observaciones[i]["id_resp"]==idresp){
			observaciones[i]["observacion"]=observacion;
			return ;
		}
	}
	let obs = {id_resp : idresp,observacion : observacion};
	observaciones.push(obs);
}
function sumarNotas(){
	let notafinal=0;
	respuesta_de_alumno.forEach((respuesta)=>{
		if (respuesta["nota"]!=""&&respuesta["nota"]!=null)notafinal=notafinal+parseInt(respuesta["nota"]);
	});

	$("#nota-final").val (notafinal);
	return;
}
function obtenerPregunta(indice,idEvaluacion){
	for (var i = 0; i < lista_de_preguntas.length; i++) {
		if (lista_de_preguntas[i]['codeva']==idEvaluacion&&
			lista_de_preguntas[i]['nro']==indice){
			return lista_de_preguntas[i];
		}
	}
	return false;
}
function obtenerpregunta(idPreg){
	for (var i = 0; i < lista_de_preguntas.length; i++) {
		if (lista_de_preguntas[i]['idPreg']==idPreg){
			return lista_de_preguntas[i];
		}
	}
	return false;
}
function obtenerDescripcion(codeva) {
	for (var i = 0; i < lista_de_evaluaciones.length; i++) {
		if (lista_de_evaluaciones[i]['id']==codeva)return lista_de_evaluaciones[i]['descripcion'];
	}
}
function revisar(idEvaluacion,nroEval,notaEval){
	evalucion_seleccionada = obtnerEvaluacion_lista(idEvaluacion);
    nro_evaluacion = nroEval;
    nota_evaluacion = notaEval;
	$.post(
			"evaluacion_escrita_json.php?op=get_list_alumn&usr=doc",
			{codeva:idEvaluacion},
			(datos,estado,xhr)=>{
				if(datos['status']=="ok"){
					lista_de_alumnos = datos['lista'];
					lista_de_notas = datos['notas'];
					evaluacion = idEvaluacion;
					mostrarLista();
			
				}
			},"json"
			);
}
function editar(codeva) {
	$('#codeva').val(codeva);
	document.getElementById('title-new-eval').innerHTML = "EDITAR EVALUACIÓN";
	let datos_eval = obtnerEvaluacion_lista(codeva);
	let fechai = datos_eval.fechai.substring(0,10);
	let horai = datos_eval.fechai.substring(11,16);
	let fechaf = datos_eval.fechaf.substring(0,10);
	let horaf = datos_eval.fechaf.substring(11,16);
	$('#fechaini').val(fechai);
	$('#horaini').val(horai);
	$('#fechafin').val(fechaf);
	$('#horafin').val(horaf);
	$('#duracion').val(datos_eval.tiempo);
	$('#preguntas').val(datos_eval.preguntas);
	$('#descripcion').val(datos_eval.descripcion);
	$('#tabla').css('display','none');
	$('#guardar').css('display','none');
	$('#btn-actualizar-eval').css('display','inline');
	$('#form_nueva_eval').css('display','block');
	$('#nota_evaluacion').val(datos_eval.nota);
}

function obtnerEvaluacion_lista(codeva) {
	for (var i = 0; i < lista_de_evaluaciones.length; i++) {
		if(lista_de_evaluaciones[i].id == codeva){
			return lista_de_evaluaciones[i];
		}
	}
	return [];
}
function mostrarLista(){
	$('#campos-lista-alumnos').empty();
	let indice = 1;
	lista_de_alumnos.forEach((alumno)=>{
		let codalu = alumno['codalu'];
		let nombre = alumno['nombre'];
		
		if(evaluado(codalu)){
			let nota = obtenerNota(codalu);
			if(calificado(codalu)){
				$('#campos-lista-alumnos').append(
											`<tr>
												<td data-label="No.">${indice}</td>
												<td data-label="Nombre" style="text-align:left;">${nombre}</td>
												<td data-label="Nota">${nota}</td>
												<td data-label="Opción"><button onclick="calificar(${codalu},${evaluacion})">Calificar</button></td>
											</tr>`
											);
			
			}else{
				if(calificado_presencial(codalu)){
					console.log(nota);
					$('#campos-lista-alumnos').append(
											`<tr>
												<td data-label="No.">${indice}</td>
												<td data-label="Nombre" style="text-align:left;">${nombre}</td>
												<td data-label="Nota"><input type="number" max="100" min="1" id="input-${codalu}" value="${nota}"/></td>
												<td data-label="Opción"><button onclick="calificar_2(${codalu},${evaluacion})">Calificar</button></td>
											</tr>`
											);
				}else{

					$('#campos-lista-alumnos').append(
												`<tr>
													<td data-label="No.">${indice}</td>
													<td data-label="Nombre" style="text-align:left;">${nombre}</td>
													<td data-label="Nota">&nbsp;</td>
													<td data-label="Opción"><button onclick="calificar(${codalu},${evaluacion})">Calificar</button></td>
												</tr>`
												);
				}
			}
		}else{

			$('#campos-lista-alumnos').append(
											`<tr>
												<td data-label="No.">${indice}</td>
												<td data-label="Nombre" style="text-align:left;">${nombre}</td>
												<td data-label="Nota"><input type="number" max="100" min="1" id="input-${codalu}"/></td>
												<td data-label="Opción"><button onclick="calificar_2(${codalu},${evaluacion})">Calificar</button></td>
											</tr>`
											);
		}
		indice++;
	});
	$('#tabla').css('display','none');
	$('#primera-evaluación').css('display','none');
	$('#tabla-lista-alumnos').css('display','block');
}

function evaluado(codalu){
	for (var i = 0; i < lista_de_notas.length; i++) {
		if(lista_de_notas[i]['codalu']==codalu)return true;
	}

	return false;
}
const calificado_presencial = codalu=>{
	for (var i = 0; i < lista_de_notas.length; i++) {
		if(lista_de_notas[i]['codalu']==codalu && lista_de_notas[i]['calificado'] == 2)return true;
	}
	return false;
}
function calificado(codalu){
	for (var i = 0; i < lista_de_notas.length; i++) {
		if(lista_de_notas[i]['codalu']==codalu&&lista_de_notas[i]['calificado']==1)return true;
	}

	return false;
}
function obtenerNota(codalu){
	for (var i = 0; i < lista_de_notas.length; i++) {
		if(lista_de_notas[i]['codalu']==codalu)return lista_de_notas[i]['nota'];
	}

	return "";
}
function cargarMaterias(){
	let indice = document.getElementById('seleccionar_curso').value;
	$('#tabla').css('display','none');
	$('#tabla-preguntas').css('display','none');
	$('#nuevo').css('display','none');
	$('#tabla-lista-alumnos').css('display','none');
	$('#primera-evaluación').css('display','none');

	if (indice>0) {
		obtenerCursoParaleo(indice);
		$('#seleccionar_materia').empty();
		$('#seleccionar_materia').append('<option value="0">--Seleccionar materia --</option>');
		materias_del_profesor.forEach((materia)=>{
			if(materia['codcur']==curso && materia['codpar']==paralelo){
				let nombre = materia['nombre'];
				let codmat = materia['codmat'];

				$('#seleccionar_materia').append(`<option value="${codmat}">${nombre}</option>`);
			}
		});

	}else{
		$('#seleccionar_materia').empty();
		$('#seleccionar_materia').append('<option value="0">--Seleccionar materia --</option>');
		curso = "";
		paralelo = "";
		return;
	}
}

function obtenerCursoParaleo(indice){

	for (var i = 0; i < cursos_del_profesor.length; i++) {
		if(i == indice - 1){
			curso = cursos_del_profesor[i]['codcur'];
			nombre_curso = cursos_del_profesor[i]['nombre'];
			paralelo = cursos_del_profesor[i]['codpar'];
			return;
		}
	}
}
function FormPreguntas(visvility){
	if(visvility=="none"){
		$('#div-preguntas').css('display','none');
		$('#label-preguntas').focus();
	}
	if(visvility=="display"){
		$('#div-preguntas').css('display','block');
		$('#form-pregunta').focus();
		$('#btn-guardar-pregunta').css('display','block');
		$('#btn-editar-pregunta').css('display','none');

	}
}
function atualizarListaEvaluaciones() {
	let codmat = document.getElementById('seleccionar_materia').value;
	$.post(
				'evaluacion_escrita_json.php?op=get_evaluacion&usr=doc',
				{codcur : curso,
				 codpar : paralelo,
				 codmat : codmat},
				 (datos,estado,xhr)=>{
				 	
				 	lista_de_evaluaciones = [];
				 	let status = datos['status'];
				 	if (status=="ok") {
				 		lista_de_evaluaciones = datos['lista'];
				 		lista_de_preguntas = datos['preguntas'];
				 	}
				 	verPreguntas($('#codeva').val());
				 },
				 "json"

			);
}
function obtenerEvaluaciones(){
	let codmat = document.getElementById('seleccionar_materia').value;
    var m = document.getElementById("seleccionar_materia");
    var materia = m.options[m.selectedIndex].value;


	if (codmat!="0") {
		obtenerNombreMateria();
		$.post(
				'evaluacion_escrita_json.php?op=get_evaluacion&usr=doc',
				{codcur : curso,
				 codpar : paralelo,
				 codmat : codmat},
				 (datos,estado,xhr)=>{
				 	
				 	lista_de_evaluaciones = [];
				 	let status = datos['status'];
				 	if (status=="ok") {
				 		lista_de_evaluaciones = datos['lista'];
				 		lista_de_preguntas = datos['preguntas'];
				 	}
				 	mostrarEvaluaciones();
				 	

				 },
				 "json"

			);
	}else{
		$('#nuevo').css('display','none');
		$('#tabla').css('display','none');
		$('#primera-evaluación').css('display','none');
		$('#tabla-lista-alumnos').css('display','none');
		
	}
}
function obtenerEvaluaciones2(codeva){
	let codmat = document.getElementById('seleccionar_materia').value;
	if (codmat!="0") {
		$.post(
				'evaluacion_escrita_json.php?op=get_evaluacion&usr=doc',
				{codcur : curso,
				 codpar : paralelo,
				 codmat : codmat},
				 (datos,estado,xhr)=>{
				 	
				 	lista_de_evaluaciones = [];
				 	let status = datos['status'];
				 	if (status=="ok") {
				 		lista_de_evaluaciones = datos['lista'];
				 		lista_de_preguntas = datos['preguntas'];
				 	}
				 	verPreguntas(codeva);
				 },
				 "json"

			);
	}else{
		$('#nuevo').css('display','none');
		$('#tabla').css('display','none');
		$('#primera-evaluación').css('display','none');
		$('#tabla-lista-alumnos').css('display','none');
		
	}
}
function eliminar(codeva) {

	Swal.queue([{
    title: 'Atención...!',
    confirmButtonText: 'Si',
    cancelButtonText: 'No',
    showCancelButton: true,
    text:'Se eliminará la evaluación',
    showLoaderOnConfirm: true,
    preConfirm: () => {
      document.querySelector('.swal2-styled.swal2-cancel').style.display ="none";
      return $.post(
				'evaluacion_escrita_json.php?op=delete_evaluacion&usr=doc',
				{codeva:codeva},
				 (datos,estado,xhr)=>{
				 	if (datos=="ok") {
				 		mostrarAlert();	
				 	}
				 },
				 "text"

			);
    }
  }]);
	
}
function mostrarAlert() {
	obtenerEvaluaciones();
	Swal.fire('Evaluación eliminada...!!!');

	return;
}
function mostrarEvaluaciones(){
	$('#campos').empty();
	if (lista_de_evaluaciones.length > 0) {
		let indice = 1;
		control_indicadores = [];
		lista_de_evaluaciones.forEach((evaluacion)=>{
			let descripcion = evaluacion['descripcion'];
			let fechaf = evaluacion['fechaf'];
			let fechai = evaluacion['fechai'];
			let preguntas = evaluacion['preguntas'];
			let tiempo = evaluacion['tiempo'];
			let id = evaluacion['id'];
			let nota = evaluacion.nota;
            let indicador = evaluacion.indicador;
            control_indicadores.push([id,indicador])
			$('#campos').append(
								`<tr>
								 	<td data-label="Nro">${indice}</td>
								 	<td data-label="Descripción">${descripcion}</td>
								 	<td data-label="Indicador">

				                        <textarea class="indicador" style="padding:5px; max-height:50px;" placeholder="Indicador" >${indicador}</textarea>

				                    </td>
								 	<td data-label="Inicio">${fechai}</td>
								 	<td data-label="Fin">${fechaf}</td>
								 	<td data-label="Preguntas a resolver">${preguntas}</td>
								 	<td data-label="Tiempo(min)">${tiempo}</td>
								 	<td data-label="Nota">${nota}</td>
								 	<td data-label="Opciones">
								 		<button class="btn-editar bloque margen-btn" onclick="editar(${id})">Editar</button>
								 		<button class="btn-revisar bloque margen-btn" onclick="revisar(${id},${indice},${nota})">Revisar</button>
								 		<button class="btn-preguntas bloque margen-btn" onclick="verPreguntas(${id})">Preguntas</button>
								 		<button class="btn-eliminar bloque margen-btn" onclick="eliminar(${id})">Eliminar</button>
								 	</td>
								 </tr>`
								);
			indice++;

		});
        document.querySelectorAll('.indicador').forEach( item => {
	        item.addEventListener("keyup", ()=>{
	            if(espera > 0){
	                espera = 3;
	            }else{
	                espera = 3;
	                bucle();
	            }
	        });
	    });
		
		$('#tabla').css('display','block');
	}else{
		$('#tabla').css('display','none');
	}
	$('#form_nueva_eval').css('display','none');
	$('#div-preguntas').css('display','none');
	$('#tabla-preguntas').css('display','none');
	
	$('#nuevo').css('display','inline');
}
const task = i => {
    return new Promise((res,rej)=>{
        setTimeout(()=>{
        res(i);
        },1000)
    });
    
}
async function bucle(){
    while(espera > 0){
        let time = await task(espera);
        
        espera--;
    }
    guardar_Indicador();
}
const guardar_Indicador = () => {
    let inputs_indicadores = document.querySelectorAll('.indicador');
    for (var i = 0; i < inputs_indicadores.length; i++) {
        let tex_ind = inputs_indicadores[i].value.trim();
        if( tex_ind != control_indicadores[i][1]){
            control_indicadores[i][1] = tex_ind;
            let codpract = control_indicadores[i][0];
            $.post(
                    'controlador/indicador_controlador.php?op=save_indicador',
                    {id:codpract,texto:tex_ind,tipe:4},
                    response => {
                        if(response.status == "eSession"){
                            alert("La sesión ha expirado...");
                            location.href = "docentes.php";
                        }
                        if(response.status == "ok"){
                            mostrar_mensaje("Guardado exitosamente","success");
                            update_registros(codpract,tex_ind);
                            //pedirPracticos();
                        }
                    },
                    "json"
                  );
        }
    }
}
const update_registros = (codpract,inid) => {

  for (var i = 0; i < lista_de_evaluaciones.length; i++) {
    if(lista_de_evaluaciones[i].id == codpract){
      lista_de_evaluaciones[i].indicador = inid;
      return;
    }
  }
  return;
} 
const mostrar_mensaje = (mensaje,estilo) => {
    if(estilo == "success"){
        $('#notificacion').removeClass('no-visible');
        $('#notificacion').addClass("notifications_success");
        $('#notificacion').addClass('visible');
        setTimeout(()=>{
            $('#notificacion').removeClass('visible');
            //$('#notificacion').removeClass("notifications_success");
            $('#notificacion').addClass('no-visible');
        },3000);
    }
}
function mostrarFormNuevaEvaluacion(){
	limpiarForm();
	$('#nuevo').css('display','none');
	$('#form_nueva_eval').css('display','block');
	$('#tabla').css('display','none');
	$('#tabla-lista-alumnos').css('display','none');
}
function eliminarImagen(idImagen) {
	Swal.queue([{
    title: 'Atención...!',
    confirmButtonText: 'Si',
    cancelButtonText: 'No',
    showCancelButton: true,
    text:'Se eliminará la imagen...!!!',
    showLoaderOnConfirm: true,
    preConfirm: () => {
      document.querySelector('.swal2-styled.swal2-cancel').style.display ="none";
      return $.post(
									"evaluacion_escrita_json.php?op=delete_imagen&usr=doc",
									{idImagen : idImagen},
									(datos,estado,xhr)=>{
										if(datos == "ok"){
											swal.fire("Imágen eliminada...!!!");
											obtenerEvaluaciones2($('#codeva').val());

										}
									}
								);
    }
  }]);
}
function eliminarPregunta(codpreg) {
	Swal.queue([{
    title: 'Atención...!',
    confirmButtonText: 'Si',
    cancelButtonText: 'No',
    showCancelButton: true,
    text:'Se eliminará la pregunta',
    showLoaderOnConfirm: true,
    preConfirm: () => {
      document.querySelector('.swal2-styled.swal2-cancel').style.display ="none";
      return $.post(
									"evaluacion_escrita_json.php?op=delete_pregunta&usr=doc",
									{codpreg : codpreg},
									(datos,estado,xhr)=>{
										if(datos == "ok"){
											swal.fire("Pregunta eliminada...!!!");
											obtenerEvaluaciones2($('#codeva').val());

										}
									}
								);
    }
  }]);


	
}

function guardarPregunta() {
	if(validarForm()){
		let formdata = new FormData($('#form-preguntas')[0]);
		let respueta=$.ajax({
						url:"evaluacion_escrita_json.php?op=guardarPregunta&usr=doc",
						type: "POST",
						data:formdata,
						contentType: false, 
						processData: false,
						async:false}).responseText;
		if (respueta=="ok") {
			alert("Se guardó la pregunta exitosamente...!!!");
			limpiarFormPreguntas();
			atualizarListaEvaluaciones();


		}

	}
}
function limpiarFormPreguntas() {
	$('#form-pregunta').val("");
	$('#imagen-form').val("");
}
function validarForm(argument) {
	let pregunta = document.getElementById('form-pregunta').value;
	if (pregunta == "") {
		alert("Debe escribir su pregunta...");
		$('#form-pregunta').focus();
		return false;
	}else{
		return true;
	}
}
function guardarEvaluacion(){

	let fechaini = document.getElementById('fechaini').value;
	let fechafin = document.getElementById('fechafin').value;
	let horaini = document.getElementById('horaini').value;
	let horafin = document.getElementById('horafin').value;
	let duracion = document.getElementById('duracion').value;
	let descripcion = document.getElementById('descripcion').value;
	let codmat = document.getElementById('seleccionar_materia').value;
	let preguntas = document.getElementById('preguntas').value;
	let nota_evaluacion = document.getElementById('nota_evaluacion').value;   

	formNuevaEvaluacion = [{
							fechaini:fechaini,
							fechafin:fechafin,
							horaini:horaini,
							horafin:horafin,
							duracion:duracion,
							descripcion:descripcion,
							codmat:codmat,
							preguntas:preguntas,
							nota:nota_evaluacion
						  }]; 
    
	if (validar(fechaini,fechafin,horaini,horafin,duracion,descripcion,preguntas,nota_evaluacion)) {

 		//cargarLista(fechaini,fechafin,horaini,horafin,duracion,descripcion,preguntas,nota_evaluacion);
    
		$.post(
				'evaluacion_escrita_json.php?op=save_evaluacion&usr=doc',
				{fechaini : fechaini,
				 fechafin : fechafin,
				 horaini  : horaini,
				 horafin  : horafin,
				 duracion :duracion,
				 descripcion : descripcion,
				 codcur : curso,
				 codpar : paralelo,
				 codmat : codmat,
				 preguntas : preguntas,
				 nota:nota_evaluacion},
				 (datos,estado,xhr)=>{
				 	if(datos=="ok"){
				 		alert("Evaluación registrada exitosamente...!!!");
				 		limpiarForm();
				 		obtenerEvaluaciones();
				 		cargarLista(fechaini,fechafin,horaini,horafin,descripcion,nota_evaluacion);
				 	}
				 	if(datos=="errorTime"){
				 		alert("Hubo un error, verifique las fechas y horas de la evaluación...!!!");
				 		$('#horaini').focus();
				 	}
				 },
				 "text"
			);
	}else{
		alert("Debe llenar los campos solicitados...!!!");
		return;
	}
}
function limpiarForm(){
	$('#fechaini').val("");
	$('#horaini').val("");
	$('#fechafin').val("");
	$('#horafin').val("");
	$('#duracion').val("");
	$('#preguntas').val("");
	$('#descripcion').val("");
	$('#nota_evaluacion').val("100");
}
function validar(fechaini,fechafin,horaini,horafin,duracion,descripcion,preguntas,nota_evaluacion){
	if (fechaini==""){$('#fechaini').focus(); return false;}
	if (horaini==""){$('#horaini').focus(); return false;}
	if (fechafin==""){$('#fechafin').focus(); return false;}
	if (horafin==""){$('#horafin').focus(); return false;}
	if (duracion==""){$('#duracion').focus(); return false;}
	if (preguntas==""){$('#preguntas').focus(); return false;}
	if (descripcion==""){$('#descripcion').focus(); return false;}
	if (nota_evaluacion==""){$('#nota_evaluacion').focus(); return false;}

	return true;
}
function mostrarImagem() {
	let resource = document.getElementById('imagen').src;

	Swal.fire({
				imageUrl: resource
			});
}
function actualizar_evaluacion() {
	let fechaini = document.getElementById('fechaini').value;
	let fechafin = document.getElementById('fechafin').value;
	let horaini = document.getElementById('horaini').value;
	let horafin = document.getElementById('horafin').value;
	let duracion = document.getElementById('duracion').value;
	let descripcion = document.getElementById('descripcion').value;
	let codmat = document.getElementById('seleccionar_materia').value;
	let preguntas = document.getElementById('preguntas').value;
	let codeva = $('#codeva').val();
	let nota_evaluacion = document.getElementById('nota_evaluacion').value;

	if (validar(fechaini,fechafin,horaini,horafin,duracion,descripcion,preguntas,nota_evaluacion)) {
		$.post(
				'evaluacion_escrita_json.php?op=update_evaluacion&usr=doc',
				{fechaini : fechaini,
				 fechafin : fechafin,
				 horaini  : horaini,
				 horafin  : horafin,
				 duracion :duracion,
				 descripcion : descripcion,
				 codeva :codeva,
				 preguntas : preguntas,
				 nota:nota_evaluacion},
				 (datos,estado,xhr)=>{
				 	if(datos=="ok"){
				 		alert("Evaluación actualizada exitosamente...!!!");
				 		limpiarForm();
				 		obtenerEvaluaciones();
				 	}
				 	if(datos=="errorTime"){
				 		alert("Hubo un error, verifique las fechas y horas de la evaluación...!!!");
				 		$('#horaini').focus();
				 	}
				 },
				 "text"
			);
	}else{
		alert("Debe llenar los campos solicitados...!!!");
		return;
	}
}
function evaluacionCalificada() {
	for (var i = 0; i < respuesta_de_alumno.length; i++) {
		if(respuesta_de_alumno[i].nota == ""||respuesta_de_alumno[i].nota == null)return false;
	}
	return true;
}
function totalCalificadas() {
	let nCalificadas = 0;
	respuesta_de_alumno.forEach((respuesta)=>{
		if(respuesta.nota!=""&&respuesta.nota!=null)nCalificadas++;
	});
	return nCalificadas+" / "+respuesta_de_alumno.length;
}
function todasCalificadas() {
	let nCalificadas = 0;
	respuesta_de_alumno.forEach((respuesta)=>{
		if(respuesta.nota!=""&&respuesta.nota!=null)nCalificadas++;
	});
	return nCalificadas==respuesta_de_alumno.length;
}
function notificar() {
	if(evaluacionCalificada()){

		let nro_evaluacion = evalucion_seleccionada.nro;
		let nota_evaluacion = evalucion_seleccionada.nota;
		let nota_final = $('#nota-final').val();
		let not_observacion = $('#txt-observacion-notificar').val();
		$('#txt-observacion-notificar').val("");
		let not_nombreAlumno = obtenerNombre(alumno);
		let mensaje = `Nota de Examen: ${nota_final} / ${nota_evaluacion} de la evaluación Nro. ${nro_evaluacion} - Alumno: ${not_nombreAlumno} - Materia: ${nombre_materia} - Curso: ${nombre_curso}. Obs.: ${not_observacion}`;
		for (var i = 0; i < lista_celulares.length; i++) {
			if(lista_celulares[i].codalu == alumno){
				let not_celular = lista_celulares[i].celular;
				if(not_celular!=""){
                    if (not_celular.includes('+')){
                        not_celular=not_celular.slice(1);
            	        $.post(
            	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensaje+"&phone="+not_celular
            	            );
                    }
                    else{
    					$.post( 
    						"https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensaje+"&phone=591"+not_celular
        					);
                    }
				}
			}
		}
		$.post(
        'data_agenda.php?op=alumno_celular',
        {codalu:alumno},
        (nroCelular)=>{
            if(nroCelular!=""){
                if (nroCelular.includes('+')){
                    nroCelular=nroCelular.slice(1);
        	        $.get(
        	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensaje+"&phone="+nroCelular
        	            );
                }
                else{
                    $.get(
                        "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensaje+"&phone=591"+nroCelular
                        );
                }
            }
        }
        );
		Swal.fire('Se ha enviado la notificación al whatsapp de los tutores...');

		   var m = document.getElementById("seleccionar_materia");
            var materia = m.options[m.selectedIndex].value;    

            var c_recibe = alumno;
            var emite = $('#codprof').val();
            var msgr = mensaje;
            //alert ('Est.:'+c_recibe+' - Prof.: '+emite+' - Mensaje: '+msgr+' - Materia: '+materia);

    		$.ajax({
                method: "POST",
                url: `${dominio}/agenda/mensajeprof`,
                data: JSON.stringify({ codEst: c_recibe, codEmit: emite,msg:msgr,codmat:materia}),
                contentType: "application/json",
                success:function(data){
                    if(data=="ok"){
                       // alert("Mensaje enviado correctamente gol de todos: "+c_recibe+" - "+emite+"-"+msgr+"-"+materia);
                    }else{
                        alert('error');
                    }    
                }
                });
	}else{
		Swal.fire("Debe calificar todas las respuestas...");
	}
}
$(document).ready(()=>{
//    alert('1');
	obtner_materias_del_profesor();
//    alert('2');
	profesor();
	obetner_cursos_del_profesor();
//	$('#seleccionar_curso').change(()=>cargarMaterias());
	$('#seleccionar_curso').change(()=>{
	    cargarMaterias();
	    obtenerCelulares();
	    
	    
	});

	$('#seleccionar_materia').change(function(){
	    obtenerEvaluaciones();
	    });
	$('#nuevo').click(()=>mostrarFormNuevaEvaluacion());
	$('#cancelar').click(()=>{mostrarEvaluaciones();npreg = 1});
	$('#guardar').click(()=>guardarEvaluacion());
	$('#btn-calif-atras').click(()=>{revisar(evaluacion,nro_evaluacion,nota_evaluacion);npreg = 1});
	$('#imagen').click(()=>mostrarImagem());
	$('#btn-actualizar-eval').click(()=>actualizar_evaluacion());
	$('#btn-notificar').click(()=>notificar());
});
