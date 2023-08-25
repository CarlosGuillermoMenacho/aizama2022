let lista_cursos = [];
let lista_materias = [];
let lista_evaluaciones = [];

let elem_html = "";
const contar_evaluaciones = (codcur,codpar,codmat) => {
	let cont = 0;
	lista_evaluaciones.forEach(evaluacion =>{
		if(evaluacion.codcur == codcur && evaluacion.codpar == codpar && evaluacion.codmat == codmat)cont++;
	});
	return cont;
}
const get_imagen_materia = codmat => {
	for (var i = 0; i < lista_materias.length; i++) {
		if(lista_materias[i].codmat == codmat)return lista_materias[i].imagen;
	}
	return "#";
}
const close_materia = (codcur,codpar,codmat,nombre) => {
	$(`#${codcur}${codpar}${codmat}`).empty();
	$(`#${codcur}${codpar}${codmat}`).append(
		`<div class="div-main-materia" id="${codcur}${codpar}${codmat}" >
			<div class="div-materia" onclick="mostrar_evaluaciones(${codcur},${codpar},'${codmat}','${nombre}')">
		        <div class="icon-name-materia">
		            <img src="${get_imagen_materia(codmat)}" class="icon-materia">
		            <h2 class="materia-name">${nombre}</h2> 
		        </div>
		        <span class="span-materia">Evaluaciones <b>${contar_evaluaciones(codcur,codpar,codmat)}</b></span>
		    </div>
		</div>`
	);
	
}
const get_nombre_curso = (codcur,codpar) => {
	for (var i = 0; i < lista_cursos.length; i++) {
		if(lista_cursos[i].codcur == codcur && lista_cursos[i].codpar == codpar)return lista_cursos[i].nombre; 
	}
	return "";
}
const get_evaluacion = codexa => {
	for (var i = 0; i < lista_evaluaciones.length; i++) {
		if(lista_evaluaciones[i].codeva == codexa)return lista_evaluaciones[i];
	}
	return [];
}
const get_materia = codmat => {
	for (var i = 0; i < lista_materias.length; i++) {
		if(lista_materias[i].codmat == codmat)return lista_materias[i];
	}
	return [];
}
const update_view = (codmat,codexa) => {
	$(`#${codmat}${codexa}`).empty();
	let evaluacion = get_evaluacion(codexa);
	let visible = evaluacion.visible == 1?"La evaluación está visible para los estudiantes.":"La evaluación no está visible para los estudiantes.";
	$(`#${codmat}${codexa}`).append(
		`<div class="data-evaluacion">
			<p><b>Evaluación: ${evaluacion.nro_eva}</b></p>
			<p class="descripcion">${evaluacion.indicador}</p>
			<p class="descripcion">${evaluacion.descripcion}</p>
			<p style="display: flex;flex-wrap: wrap;"><label style="width:100px; display: block;">Fecha inicio: </label>${evaluacion.fini}  ${evaluacion.hi} hrs.</p>
			<p style="display: flex;flex-wrap: wrap;"><label style="width:100px; display: block;">Fecha fin: </label>${evaluacion.ffin}  ${evaluacion.hf} hrs.</p>
			<p>Preguntas a responder: ${evaluacion.preguntas}</p>
			<p>Código: ${evaluacion.codeva}</p>
			<p>Visible: ${visible}</p>
		</div>
		<div class="div-evaluacion-options" id="op${codmat}${evaluacion.codeva}">
			<div class="div-option" style="font-size:.8em;" onclick="editar_evaluacion(${evaluacion.codeva},'${codmat}${codexa}');">
				Editar<img style="width:25px; cursor:pointer;" src="svg/editar.svg">
			</div>
			<div class="div-option" style="font-size:.8em;">
				Revisar<img style="width:25px; cursor:pointer;" src="svg/cheque-de-boleta.svg">
			</div>
			<div class="div-option" style="font-size:.8em;">
				Banco<img style="width:25px; cursor:pointer;" src="svg/votacion.svg" onclick="banco('${codmat}',${evaluacion.codeva})">
			</div>
			<div class="div-option" style="font-size:.8em;">
				Config.<img style="width:25px; cursor:pointer;" src="svg/ajustes.svg">
			</div>
			<div class="div-option" style="font-size:.8em; color:var(--c3);">
				Eliminar<img style="width:25px; cursor:pointer;" src="svg/basura.svg" onclick="delete_evaluacion(${evaluacion.codeva});">
			</div>
		</div>`
	);


	
}
const update_evaluacion = (codmat,codexa)  =>  {
	let childs = $("#div-btn-update").children();
	$(`#div-btn-update${codmat}${codexa}`).empty();
	$(`#div-btn-update${codmat}${codexa}`).append(
		`<section style="padding-left:0px;">
		  <div class='sk-double-bounce'>
		    <div class='sk-child sk-double-bounce-1'></div>
		    <div class='sk-child sk-double-bounce-2'></div>
		  </div>
		</section>`
	);
	let formData = new FormData($(`#formulario${codmat}${codexa}`)[0]);
	$.ajax({
		  url: "controlador/evaluacionSeleccion_controlador.php?op=update_evaluacion&usr=doc",
		  type: "POST",
		  data: formData,
		  processData: false, 
		  contentType: false,
		  success: async data =>{
		  	let response = JSON.parse(data);
		  	if(response.status == "ok"){
		  		await get_evaluaciones();
		  		await update_view(codmat,codexa);
		  		
		  		setTimeout(()=>{
		  			$(`#div-btn-update${codmat}${codexa}`).empty();
			  		$(`#div-btn-update${codmat}${codexa}`).append(
			  			`<img src="svg/controlar.svg" width="30px">`
			  		);
			  		setTimeout(()=>{
			  			$(`#div-btn-update${codmat}${codexa}`).empty();
			  			$(`#div-btn-update${codmat}${codexa}`).append(childs);
			  		},2000)
		  		},3000)
		  	}
		  	if(response.status == "errorFechas"){
		  		alert("Hay un error en las fechas de inicio y fin...");
		  		$("#div-btn-update").empty();
				$("#div-btn-update").append(childs);
		  	}
		  	if(response.status == "errorPreguntas"){
		  		alert("Debe introducir un valor numérico para la cantidad de preguntas...");
		  		$("input[name='preguntas']").focus();
		  		$("#div-btn-update").empty();
				$("#div-btn-update").append(childs);
		  	}
		  	if(response.status == "errorParam"){
		  		alert("Faltan datos, por favor complete el formulario...");
		  		$("#div-btn-update").empty();
				$("#div-btn-update").append(childs);
		  	}
		  },
		  error: (xhr, status, error) => {
		  	$("#div-btn-update").empty();
			$("#div-btn-update").append(childs);
		  	alert("Hubo un problema al actualizar los datos, no se pudo conectar con el servidor, asegúrate de estar conectado a internet...");
		  }  
		});
}
function adjustHeight(el){
    el.style.height = (el.scrollHeight > el.clientHeight) ? (el.scrollHeight)+"px" : "60px";
}
const editar_evaluacion = (codexa,ele) => {
	
	$("#formulario-evaluacion").empty();
	let evaluacion = get_evaluacion(codexa);
	let nombre_curso = get_nombre_curso(evaluacion.codcur,evaluacion.codpar);
	let materia = get_materia(evaluacion.codmat);
	let checked = evaluacion.visible == 0 ?"":"checked";
	elem_html = $(`#${ele}`).children();
	$(`#${ele}`).empty();
	//$("#formulario-evaluacion").append(
	$( `#${ele}`).append(
		`<div class="btn-close">
	        <img src="images/close.svg" onclick="close_formulario('${evaluacion.codmat}',${codexa});">
	    </div>
	    <form id="formulario${ele}">
	        <input type="hidden" name="codcur" value="${evaluacion.codcur}">
	        <input type="hidden" name="codpar" value="${evaluacion.codpar}">
	        <input type="hidden" name="codexa" value="${codexa}">
	        <div class="div-title-formulario"><h2 style="font-size: .9em; color: var(--c1); text-align: center;">${nombre_curso}</h2></div>
	        <br>
	        <div class="form-descrip-materia" style="display:flex; margin-top:10px">
	            <div style="width: 100%; display:flex; justify-content:space-between;">
	                <p style="color:var(--c1);">Materia: ${materia.nombre}</p>
	                <div>
	                    Código: <input type="text" name="codmat" value="${evaluacion.codmat}" class="input-info" readonly/>
	                </div>                
	            </div>
	        </div>
	        <div style="display:flex; flex-wrap: nowrap; gap: 50px; margin-top:10px;justify-content: space-between;">
	            <div style="display: flex; align-items: center;">
	                <div style="width: 89px;">Evaluación:</div>&nbsp;<input class="input-data" type="text"  name="nro_eva" value="${evaluacion.nro_eva}" style="width:30px; height:30px; text-align:center;">
	            </div>
	            <div style="display: flex; align-items: center;">
	                <div>Preguntas a resolver:</div>&nbsp;<input class="input-data" type="text"  name="preguntas" value="${evaluacion.preguntas}" style="width:30px; height:30px; text-align:center;">
	            </div>
	        </div>
	        <div class="div-inputss">
	            <div>Indicador:</div><textarea class="input-data" type="text"  name="indicador" style="width:100%; min-height: 70px; padding: 5px; font-size: 1em;">${evaluacion.indicador}</textarea>
	        </div>
	        <div class="div-inputss">
	            <div>Descripción:</div><textarea class="input-data" type="text"  name="descripcion" style="width:100%; min-height: 70px; padding: 5px; font-size: 1em;">${evaluacion.descripcion}</textarea>
	        </div>
	        <div class="div-inputss">
	            <div style="width: 90px;">Fecha inicio:</div><input class="input-data" type="date"  name="fini" value="${evaluacion.fini}" style="width:150px; height:30px; text-align:center;">&nbsp;&nbsp;<input class="input-data" type="time" name="horaini" value="${evaluacion.hi}" style="width:80px; height:30px; text-align:center;">
	        </div>
	        <div class="div-inputss">
	            <div style="width: 90px;">Fecha fin:</div><input class="input-data" type="date"  name="ffin" value="${evaluacion.ffin}" style="width:150px; height:30px; text-align:center;">&nbsp;&nbsp;<input class="input-data" type="time" name="horafin" value="${evaluacion.hf}" style="width:80px; height:30px; text-align:center;">
	        </div>
	        <div style="display:flex; margin-top:15px;">
	            Visible para los estudiantes:&nbsp;<input class="input-data" type="checkbox" ${checked} style="cursor:pointer;" name="visible"/> 
	        </div>
	        <div style="display:flex; margin-top:15px;">
	            Notificar a la agenda y whatsapps:&nbsp;<input class="input-data" type="checkbox" checked style="cursor:pointer;" name="notificar"/> 
	        </div>
	        <div style="text-align:center; margin-top: 30px;" id="div-btn-update${evaluacion.codmat}${codexa}">
	            <button id="btn-update" class="submit" onclick="update_evaluacion('${evaluacion.codmat}',${codexa})">GUARDAR</button>
	        </div>

	    </form>`
	);
	$(`#formulario${evaluacion.codmat}${codexa}`).submit(e => {e.preventDefault()});
	
}
const close_formulario = (codmat,codexa) => {
	update_view(codmat,codexa);
	/*$(`#${e}`).empty();
	$(`#${e}`).append(elem_html);*/
}
const close_formulario2 = () => {
	$("#formulario-evaluacion").empty();
	$("#formulario-evaluacion").addClass("oculto");
	$("#container").removeClass("oculto");

	if(lista_cursos.length>1)$(".div-cursos-float").removeClass("oculto");
	
}
const delete_evaluacion = codexa => {
	let e = get_evaluacion(codexa);
	Swal.queue([{
	    title: 'Atención...!',
	    confirmButtonText: 'Si',
	    cancelButtonText: 'No',
	    showCancelButton: true,
	    text:'Se eliminará la evaluación, desea continuar?',
	    showLoaderOnConfirm: true,
	    preConfirm: () => {
	    	$.post(
	    		"controlador/evaluacionSeleccion_controlador.php?op=delete&usr=doc",
	    		{codexa:codexa},
	    		async data => {
	    			if(data.status == "eSession"){
	    				alert("La sesión ha finalizado por favor vuelva a ingresar con su usuario y contraseña...");
	    				return;
	    			}
	    			if(data.status == "ok"){
	    				await get_evaluaciones();
	    				mostrar_evaluaciones(e.codcur,e.codpar,e.codmat,get_materia(e.codmat).nombre);
	    			}
	    		},"json"
	    	);
	    }
  	}]);
}
const copiar = (e) => {
	let parent = e.parentNode;
	let childs = parent.childNodes;
	childs.forEach( c => {
		if(c.type == "hidden")c.value = e.textContent;
	});
}
const genRandonString = (length) => {
   var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
   var charLength = chars.length;
   var result = '';
   for ( var i = 0; i < length; i++ ) {
      result += chars.charAt(Math.floor(Math.random() * charLength));
   }
   return result;
}

const get_file = e => {
	let parent = e.parentNode;
	let childs = parent.childNodes;
	let input_file = "";
	childs.forEach(c => {	
		if(c.type == "file"){
			input_file = c;
		}
	});
	input_file.click();
	input_file.addEventListener("change",(__if)=>{
		if(input_file.value == ""){
			e.style.width = "47px";
			e.src = "svg/imagen.svg";
			return;
		}
		let file = __if.target.files[0];
		let reader = new FileReader();
		reader.onload = function(event){
			e.src = event.target.result;
			e.style.width = "100%";
		}
		if(file.type)reader.readAsDataURL(file);
	})
}
const add_opcion = e => {
	$(`#${e}`).append(
		`<div class="div-opcion">
            <input type="radio" name="opcion" style="cursor: pointer;" title="Seleccionar como respuesta correcta...">
            <input type="hidden" name="text-option[]">
            <div class="divtext input-data" style="width: calc(100% - 50px);" contenteditable="" onkeyup="copiar(this);">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
            <img src="svg/quitar.svg" width="20px" style="cursor: pointer;" title="Eliminar opción..." onclick="delete_opcion(this);">
        </div>`
	)
}
const delete_opcion = e => {	
	let parent = e.parentNode;
	let main_parent = parent.parentNode;
	let childs = main_parent.childNodes;
	let n = childs.length - 3; 	
	if( n <= 2){
		Swal.fire("Debe tener al menos dos opciones...");
		return;
	}
	main_parent.removeChild(parent);
}
const agregar_pregunta = (codmat,codexa) => {
	let e = `${codmat}${codexa}`;
	$(`.b${e}`).children().last().remove();
	$(`#ban${e}`).append(
		`<div class="div-pregunta" style="margin-top:10px;">
            <h3>Pregunta 1</h3>
            <form id="formulario-pregunta${e}" style="background: #efefef; padding: 15px 5px; border-radius:5px; position:relative;">
                <div class="div-pregunta-img">
                    <input type="hidden" name="descripcion">
                    <div class="divtext input-data" style="width: 100%" contentEditable onkeyup="copiar(this);">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                    
                </div>
                <div  style="display: flex; padding:5px; width:100%; max-width: 360px; margin: 15px auto; justify-content: center; border: 1px solid #ccc; border-radius: 5px;">
                    <img src="svg/imagen.svg" width="47px" style="cursor: pointer;" title="Selecciona una imagen para la pregunta..." onclick="get_file(this);">                
                    <input type="file" name="imagen" hidden accept="image/png, image/gif, image/jpeg, image/jpg">
                </div>
                <h3>Opciones</h3>
                <div id="opciones${codmat}${codexa}">
                    <div class="div-opcion">
                        <input type="radio" name="opcion" style="cursor: pointer;" title="Seleccionar como respuesta correcta...">
                        <input type="hidden" name="text-option[]">
                        <div class="divtext input-data" style="width: calc(100% - 50px);" contentEditable onkeyup="copiar(this);">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
                        <img src="svg/quitar.svg" width="20px" style="cursor: pointer;" title="Eliminar opción..." onclick="delete_opcion(this);">
                    </div>
                    <div class="div-opcion">
                        <input type="radio" name="opcion" style="cursor: pointer;" title="Seleccionar como respuesta correcta..." />
                        <input type="hidden" name="text-option[]">
                        <div class="divtext input-data" style="width: calc(100% - 50px);" contentEditable onkeyup="copiar(this);">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
                        <img src="svg/quitar.svg" width="20px" style="cursor: pointer;" title="Eliminar opción..." onclick="delete_opcion(this);">
                    </div>
                </div>
                <div class="div-add-opcion">
                    <img src="svg/agregar.svg" width="25px" title="Agregar una opción..." onclick="add_opcion('opciones${codmat}${codexa}')">
                </div>
                <div class="div-tempo" style="font-size: .9em;">
                    Tiempo: <input class="input-data" type="text" name="tiempo" value="3" max="30" min="1" style="width:25px; padding: 3px;"> minutos.
                </div>
                <div class="btn-pregunta" style="padding: 10px; text-align: center;">
                    <button class="submit2" onclick="save_pregunta('formulario-pregunta${e}')">GUARDAR</button>
                    <button class="danger2" onclick="close_form_pregunta('${codmat}',${codexa})">CANCELAR</button>
                </div>
                <!--div class="btn-delete-float" style="position: absolute;bottom: 5px;right: 5px;">
                    <img style="width:20px;cursor:pointer;" src="svg/basura.svg" onclick="delete_pregunta(65);" title="Eliminar pregunta.">
                </div-->
            </form>
        </div>`
	);
	$(`#formulario-pregunta${e}`).submit(e => {e.preventDefault()});
}
const save_pregunta = e => {
	let formData = new FormData($(`#${e}`)[0]);
	let html1 = $.ajax(
		{
			url:"controlador/evaluacionSeleccion_controlador.php?op=save_pregunta",
			type: "POST",
			data:formData,
			contentType: false, 
			processData: false,
			async:false
		}
		).responseText;

}
const close_form_pregunta = (codmat,codexa) => {
	$(`#${codmat}${codexa}`).children().last().remove();
	banco(codmat,codexa);
}
const close_banco = (e) => {

	$(`#${e}`).children().last().remove();
	$(`#op${e}`).removeClass("oculto");
}
const banco = (codmat,codexa) =>{
	$(`#op${codmat}${codexa}`).addClass("oculto");
	$(`#${codmat}${codexa}`).append(
		`<div class="div-banco b${codmat}${codexa}">
            <div class="btn-close">
                <img src="images/close.svg" onclick="close_banco('${codmat}${codexa}');">
            </div>
            <h2 style="margin: 20px;">Banco de Preguntas</h2>
            <div id="ban${codmat}${codexa}"></div>
            <div class="div-add" style="font-size:.8em">
                <img src="svg/agregar-documento.svg" style="width:30px; cursor:pointer" onclick="agregar_pregunta('${codmat}',${codexa});">Agregar Pregunta
            </div>
        </div>
		`)
}
const mostrar_evaluaciones = (codcur,codpar,codmat,nombre) => {
	$(`#${codcur}${codpar}${codmat}`).empty();
	$(`#${codcur}${codpar}${codmat}`).css("transition",".5s");

	let evaluaciones = "";
	lista_evaluaciones.forEach(evaluacion =>{
		if (evaluacion.codcur == codcur && evaluacion.codpar == codpar && evaluacion.codmat == codmat) {
			let visible = evaluacion.visible == 1?"La evaluación está visible para los estudiantes.":"La evaluación no está visible para los estudiantes.";
			evaluaciones = `${evaluaciones}<div class="div-evaluacion" id="${codmat}${evaluacion.codeva}">
											<div class="data-evaluacion">
												<p><b>Evaluación: ${evaluacion.nro_eva}</b></p>
												<p class="descripcion">${evaluacion.indicador}</p>
												<p class="descripcion">${evaluacion.descripcion}</p>
												<p style="display: flex;flex-wrap: wrap;"><label style="width:100px; display: block;">Fecha inicio: </label>${evaluacion.fini}  ${evaluacion.hi} hrs.</p>
												<p style="display: flex;flex-wrap: wrap;"><label style="width:100px; display: block;">Fecha fin: </label>${evaluacion.ffin}  ${evaluacion.hf} hrs.</p>
												<p>Preguntas a responder: ${evaluacion.preguntas}</p>
												<p>Código: ${evaluacion.codeva}</p>
												<p>Visible: ${visible}</p>
											</div>
											<div class="div-evaluacion-options" id="op${codmat}${evaluacion.codeva}">
												<div class="div-option" style="font-size:.8em;" onclick="editar_evaluacion(${evaluacion.codeva},'${codmat}${evaluacion.codeva}');">
													Editar<img style="width:25px; cursor:pointer;" src="svg/editar.svg">
												</div>
												<div class="div-option" style="font-size:.8em;">
													Revisar<img style="width:25px; cursor:pointer;" src="svg/cheque-de-boleta.svg">
												</div>
												<div class="div-option" style="font-size:.8em;">
													Banco<img style="width:25px; cursor:pointer;" src="svg/votacion.svg" onclick="banco('${codmat}',${evaluacion.codeva})">
												</div>
												<div class="div-option" style="font-size:.8em;">
													Config.<img style="width:25px; cursor:pointer;" src="svg/ajustes.svg">
												</div>
												<div class="div-option" style="font-size:.8em; color:var(--c3);">
													Eliminar<img style="width:25px; cursor:pointer;" src="svg/basura.svg" onclick="delete_evaluacion(${evaluacion.codeva});">
												</div>
											</div>
										</div>`
		}
	});
	$(`#${codcur}${codpar}${codmat}`).append(
		`<div class="div-evaluaciones">
			<div class="btn-close">
		        <img src="images/close.svg" onclick="close_materia(${codcur},${codpar},'${codmat}','${nombre}');">
		    </div>
			<h2 class="h-class-name materia-name" style="margin-bottom:10px;">${nombre}</h2>
			${evaluaciones}
			<div class="div-add"><img src="svg/agregar-documento.svg" style="width:30px; cursor:pointer" onclick="mostrar_formulario(${codcur},${codpar},'${codmat}');">Agregar Evaluación</div>`
	);
	
}
const mostrar_materias = (codcur,codpar,nombre) => {
	$("#content-table").empty();
	$("#content-table").append(
		`<h2 class="h-class-name">${nombre}</h2>`
	);
	lista_materias.forEach(materia => {
		if(materia.codcur == codcur && materia.codpar == codpar){
			$("#content-table").append(
				`<div class="div-main-materia" id="${codcur}${codpar}${materia.codmat}" >
					<div class="div-materia" onclick="mostrar_evaluaciones(${codcur},${codpar},'${materia.codmat}','${materia.nombre}')">
		            	<div class="icon-name-materia">
		                	<img src="${materia.imagen}" class="icon-materia">
		                	<h2 class="materia-name">${materia.nombre}</h2> 
		            	</div>
		            	<span class="span-materia">Evaluaciones <b>${contar_evaluaciones(codcur,codpar,materia.codmat)}</b></span>
		        	</div>
		        </div>`
			);
		}
	});
}
const float_selected = (codcur,codpar,nombre,e) => {
	mostrar_materias(codcur,codpar,nombre);
	$(".float-selected").css('transition','.5s');
	$(".float-selected").removeClass('float-selected');
	$(".div-float-selected").css("transition",".5s");
	$(".div-float-selected").removeClass('div-float-selected');
	let child = e.children;
	e.setAttribute.transition = ".5s";
	e.classList.add('div-float-selected');
	child[0].classList.add('float-selected');
}
const cargar_cursos = cursos => {
	$(".div-curso-float").empty();
	let clase = 'class="float-selected"';
	let clase2 = 'div-float-selected';
	mostrar_materias(cursos[0].codcur,cursos[0].codpar,cursos[0].nombre);
	cursos.forEach(curso => {
		$(".div-curso-float").append(
			`<div id="${curso.codcur}${curso.codpar}" class="div-curso ${clase2}" onclick="float_selected(${curso.codcur},${curso.codpar},'${curso.nombre}',this)">
	            <img src="img/${curso.imagen}" ${clase}>
	        </div>`
		);
		clase = "";
		clase2 = "";
	});
	if(cursos.length == 1){
		$(".div-cursos-float").addClass("oculto");
	}

}
const get_cursos = () =>{
	$.get(
		"controlador/profesor_controlador.php?op=get_cursos&usr=doc",
		data => {
			if (data.status == "eSession")Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
			
				lista_cursos = data.cursos;
				lista_materias = data.materias;
				cargar_cursos(lista_cursos);
			
		},	
		"json"
	);
}
const get_evaluaciones = async () => {
	await $.get(
		"controlador/evaluacionSeleccion_controlador.php?op=gepm&usr=doc",
		data => {
			if (data.status == "eSession")Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
			if (data.status == "eTrimestre")Swal.fire("Debe seleccionar un trimestre por favor...");
			if (data.status == "ok") {
				lista_evaluaciones = data.data;
			}
		},"json"
	);
}
const init = async () => {
	await get_evaluaciones();
	get_cursos();
}
const mostrar_formulario = (codcur,codpar,codmat) => {
	$("#formulario-evaluacion").empty();
	$("#formulario-evaluacion").append(
		`<div class="btn-close">
	        <img src="images/close.svg" onclick="close_formulario2();">
	    </div>
	    <form id="formulario">
	        <input type="hidden" name="codcur" value="${codcur}">
	        <input type="hidden" name="codpar" value="${codpar}">
	        <div class="div-title-formulario"><h2 style="font-size: .9em; color: var(--c1); text-align: center;">${get_nombre_curso(codcur,codpar)}</h2></div>
	        <br>
	        <div class="form-descrip-materia" style="display:flex; margin-top:10px">
	            <div style="width: 100%; display:flex; justify-content:space-between;">
	                <p style="color:var(--c1);">Materia: ${get_materia(codmat).nombre}</p>
	                <div>
	                    Código: <input type="text" name="codmat" value="${codmat}" class="input-info" readonly/>
	                </div>                
	            </div>
	        </div>
	        <div style="display:flex; flex-wrap: nowrap; gap: 50px; margin-top:10px;justify-content: space-between;">
	            <div style="display: flex; align-items: center;">
	                <div style="width: 89px;">Evaluación:</div>&nbsp;<input class="input-data" type="text"  name="nro_eva" value="${contar_evaluaciones(codcur,codpar,codmat) + 1}" style="width:30px; height:30px; text-align:center;">
	            </div>
	            <div style="display: flex; align-items: center;">
	                <div>Preguntas a resolver:</div>&nbsp;<input class="input-data" type="text"  name="preguntas" value="5" style="width:30px; height:30px; text-align:center;">
	            </div>
	        </div>
	        <div class="div-inputss">
	            <div>Indicador:</div><textarea class="input-data" type="text"  name="indicador" style="width:100%; min-height: 70px; padding: 5px; font-size: 1em;"></textarea>
	        </div>
	        <div class="div-inputss">
	            <div>Descripción:</div><textarea class="input-data" type="text"  name="descripcion" style="width:100%; min-height: 70px; padding: 5px; font-size: 1em;"></textarea>
	        </div>
	        <div class="div-inputss">
	            <div style="width: 90px;">Fecha inicio:</div><input class="input-data" type="date"  name="fini" value="" style="width:150px; height:30px; text-align:center;">&nbsp;&nbsp;<input class="input-data" type="time" name="horaini" value="" style="width:80px; height:30px; text-align:center;">
	        </div>
	        <div class="div-inputss">
	            <div style="width: 90px;">Fecha fin:</div><input class="input-data" type="date"  name="ffin" value="" style="width:150px; height:30px; text-align:center;">&nbsp;&nbsp;<input class="input-data" type="time" name="horafin" value="" style="width:80px; height:30px; text-align:center;">
	        </div>
	        <div style="display:flex; margin-top:15px;">
	            Visible para los estudiantes:&nbsp;<input class="input-data" type="checkbox" style="cursor:pointer;" name="visible"/> 
	        </div>
	        <div style="display:flex; margin-top:15px;">
	            Notificar a la agenda y whatsapps:&nbsp;<input class="input-data" type="checkbox" checked style="cursor:pointer;" name="notificar" disabled/> 
	        </div>
	        <div style="text-align:center; margin-top: 30px;" id="div-btn-update">
	            <button id="btn-update" class="submit" onclick="save_evaluacion()">GUARDAR</button>
	        </div>

	    </form>`
	);
	$("#formulario").submit(e => {e.preventDefault()});
	$("#container").addClass("oculto");
	$(".div-cursos-float").addClass("oculto");
	$("#formulario-evaluacion").removeClass("oculto");
}
const save_evaluacion = () => {
	let childs = $("#div-btn-update").children();
	$("#div-btn-update").empty();
	$("#div-btn-update").append(
		`<section style="padding-left:0px;">
		  <div class='sk-double-bounce'>
		    <div class='sk-child sk-double-bounce-1'></div>
		    <div class='sk-child sk-double-bounce-2'></div>
		  </div>
		</section>`
	);
	let formData = new FormData($("#formulario")[0]);
	$.ajax({
		  url: "controlador/evaluacionSeleccion_controlador.php?op=save_evaluacion&usr=doc",
		  type: "POST",
		  data: formData,
		  processData: false, 
		  contentType: false,
		  success: async data =>{
		  	let response = JSON.parse(data);
		  	if(response.status == "ok"){
		  		await get_evaluaciones();
		  		
		  		setTimeout(()=>{
		  			$("#div-btn-update").empty();
			  		$("#div-btn-update").append(
			  			`<img src="svg/controlar.svg" width="30px">`
			  		);
			  		setTimeout(()=>{
			  			close_formulario2();
			  			mostrar_evaluaciones(formData.get('codcur'),formData.get('codpar'),formData.get('codmat'),get_materia(formData.get('codmat')).nombre);
			  		},2000)
		  		},3000)
		  	}
		  	if(response.status == "errorFechas"){
		  		alert("Hay un error en las fechas de inicio y fin...");
		  		$("#div-btn-update").empty();
				$("#div-btn-update").append(childs);
		  	}
		  	if(response.status == "errorPreguntas"){
		  		alert("Debe introducir un valor numérico para la cantidad de preguntas...");
		  		$("input[name='preguntas']").focus();
		  		$("#div-btn-update").empty();
				$("#div-btn-update").append(childs);
		  	}
		  },
		  error: (xhr, status, error) => {
		  	$("#div-btn-update").empty();
			$("#div-btn-update").append(childs);
		  	alert("Hubo un problema al actualizar los datos, no se pudo conectar con el servidor, asegúrate de tener conexión a internet...");
		  }  
		});
}
const print = (evaluacion,preguntas) => {

    var printWindow = window.open("", "", "height=900,width=600");
    printWindow.document.write("<html><head>");
    printWindow.document.write("</head>");
    printWindow.document.write('<link rel="stylesheet" type="text/css" href="css/reporte_mensualidades.css?v=8">');
    //Print the DIV contents i.e. the HTML Table.
    printWindow.document.write(`<body><table class="table-print">
								    	<div class="print__header">
								      <img src="http://www.aizama.net/images/logo.png" width="50px">
								      <h1 style="margin-left: 100px">Evaluación</h1>
								      <img src="./images/escudo-bolivia.svg" style="margin-left: 100px;" width="50px">
								    </div>
								    <div class="print__info">
								      <div style="margin-right: 10px">
								        <div class="print__info-curso">
								          <label>Curso: </label><span>${evaluacion.curso}</span>
								        </div>
								        <div class="print__info-turno">
								          <label>Materia: </label><span>${evaluacion.materia}</span>
								        </div>
								      </div>
								      <div style="display: flex;flex-direction: column;align-items: flex-end;">
								        <div class="info-label">
								          <label>Unidad Educativa: </label><span>Aizama</span>
								        </div>
								        <div class="info-label"><label>Gestión: </label><span>${evaluacion.gestion}</span></div>
								        <div class="info-label">
								          <label>Departamento: </label><span>Santa Cruz</span>
								        </div>
								      </div>
								    </div>`);
    let index = 1;
    preguntas.forEach(p => {
    	printWindow.document.write(`<div style="padding:10px;">${index}.- ${p.pregunta}</div>`);
    	if(p.imagen != ""){
    		printWindow.document.write(`<div><img src="resources/${p.imagen}" width="350px" style="margin-left:20px;"></div>`);    		
    	}
    	index++;
    });
    printWindow.document.write("</table></body>");
    printWindow.document.write("</html>");
    printWindow.document.close();
}
const print_eval = codexa => {
	$.post(
		"controlador/evaluacionSeleccion_controlador.php?op=print-eval&usr=doc",
		{codexa:1},
		data => {
			if(data.status == "ok"){
				print(data.evaluacion,data.preguntas);
			}
		},"json"
	);
}
$(document).ready(() =>{
	init();
	$("#title-pag").click(()=>{init()});
	print_eval(3);
});