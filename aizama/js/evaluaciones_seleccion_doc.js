let lista_cursos = [];
let lista_materias = [];
let lista_evaluaciones = [];
let elem_html = "";
const save_calificaciones = codexa => {
	let formData = new FormData($(`#form_calif${codexa}`)[0]);
	formData.append("codexa",codexa);
	$.ajax({
		  url: "controlador/evaluacionSeleccion_controlador.php?op=save_calificaciones&usr=doc",
		  type: "POST",
		  data: formData,
		  processData: false, 
		  contentType: false,
		  success: async data =>{
		  	let response = JSON.parse(data);
		  	if (response.status == "eSession")Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
		  	if(response.status == "ok"){
		  		Swal.fire("Calificaciones guardadas exitosamente...");	
		  	}
		  },
		  error: (xhr, status, error) => {
		  	$("#div-btn-update").empty();
			$("#div-btn-update").append(childs);
		  	alert("Hubo un problema al actualizar los datos, no se pudo conectar con el servidor, asegúrate de estar conectado a internet...");
		  }  
		});
}
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
				Revisar<img style="width:25px; cursor:pointer;" src="svg/cheque-de-boleta.svg" onclick="revisar('${codmat}',${evaluacion.codeva})">
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
		  		
		  		setTimeout(async()=>{
		  			$(`#div-btn-update${codmat}${codexa}`).empty();
			  		$(`#div-btn-update${codmat}${codexa}`).append(
			  			`<img src="svg/controlar.svg" width="30px">`
			  		);
			  		await setTimeout(async()=>{
			  			$(`#div-btn-update${codmat}${codexa}`).empty();
			  			$(`#div-btn-update${codmat}${codexa}`).append(childs);
			  		},3000)
		  			await update_view(codmat,codexa);
		  		},2000)
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
		`<!--div class="btn-close2">
	        <img src="images/close.svg" onclick="close_formulario('${evaluacion.codmat}',${codexa});">
	    </div-->
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
	            <!--div style="display: flex; align-items: center;">
	                <div>Preguntas a resolver:</div>&nbsp;<input class="input-data" type="text"  name="preguntas" value="${evaluacion.preguntas}" style="width:30px; height:30px; text-align:center;">
	            </div-->
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
	        <div class="div-inputss">
	        	<label class="fs09 ta-l" style="margin-left: 5px;">Preguntas</label>
	        	<select class="input-data p-5" name="preguntas" required>
	        		<option value="0" ${evaluacion.preguntas == 0?"selected":""}>Sin preguntas</option>
                   	<option value="5" ${evaluacion.preguntas == 5?"selected":""}>5 Preguntas</option>
                   	<option value="10" ${evaluacion.preguntas == 10?"selected":""}>10 Preguntas</option>
                </select>
	        </div>
	        <div style="display:flex; margin-top:15px;">
	            Visible para los estudiantes:&nbsp;<input class="input-data" type="checkbox" ${checked} style="cursor:pointer;" name="visible"/> 
	        </div>
	        <div style="display:flex; margin-top:15px;">
	            Notificar a la agenda y whatsapps:&nbsp;<input class="input-data" type="checkbox" checked style="cursor:pointer;" name="notificar"/> 
	        </div>
	        <div style="display: flex; justify-content: center; gap:10px; margin-top: 30px;" id="div-btn-update${evaluacion.codmat}${codexa}">
	            <button id="btn-update" class="submit" onclick="update_evaluacion('${evaluacion.codmat}',${codexa})">GUARDAR</button>
	            <button class="danger2" onclick="close_formulario('${evaluacion.codmat}',${codexa});">CANCELAR</button>
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
const actualizar_calificaciones = codexa => {
	$.post(
		"controlador/evaluacionSeleccion_controlador.php?op=get_calificaciones&usr=doc",
		{codexa:codexa},
		data => {
			if (data.status == "eSession")Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
			if (data.status == "ok") {
				let lista = data.data;
				let html = "";
				let index = 1;
				lista.forEach(a => {
					let readonly = "";
					let estado = "";
					if(a.estado == 1){//El alumno realizó la evaluación en plataforma
						estado = `<div style="display: flex;justify-content: space-between;">
									<div style"display: flex;align-items: center;">
										<img style="width: 35px;border-radius: 50%; cursor:pointer;" src="images/test-report.png" title="Ver respuestas" onclick="ver_respuestas(${a.codalu},${codexa});">
									</div>
									<div style="display: flex;align-items: center;">
										<img style="width:25px;cursor:pointer;" src="images/delete.png" title="Eliminar examen" onclick="delete_examen(${a.codalu},${codexa},this)">
									</div>
								  </div>`;
						readonly = "readonly";
					}
					html = `${html}<tr>
			            				<td>${index}</td>
			            				<td>${a.nombre}</td>
			            				<td><input type="hidden" name="alumno[]" value="${a.codalu}"><input ${readonly} type="number" name="nota[]" min="0" max="100" class="input-data p-10" value="${a.nota == null?"":a.nota}" style="width:50px"></td>
			            				<td>${estado}</td>
			            			</tr>`;
			        index++;
				})
				$(`#calificaciones${codexa}`).empty();
				$(`#calificaciones${codexa}`).append(
							`<form id="form_calif${codexa}">
				            	<table class="lista-notas" style="width:100%;">
				            		<thead style="font-weight:bold;">
				            			<tr>
				            				<td>No.</td>
				            				<td>Nombre</td>
				            				<td>Nota</td>
				            				<td></td>
				            			</tr>
				            		</thead>
				            		<tbody>
				            			${html}
				            		</tbody>
				            	</table>
				            </form>`
				);
			}
		},"json"
	)
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
const removeImg = e => {
	let parent = e.parentNode;
	e.classList.add("oculto");
	let childs = parent.children;
	childs[1].style.width = "47px";
	childs[1].src = "svg/imagen.svg";
	childs[2].value = "";
}
const removeImgUpdate = e => {
	let parent = e.parentNode;
	e.classList.add("oculto");
	let childs = parent.children;
	childs[1].style.width = "47px";
	childs[1].src = "svg/imagen.svg";
	childs[2].value = "";
	childs[3].value = "";
}
const get_file = e => {
	let parent = e.parentNode;
	let childs = parent.children;
	let input_file = "";
	input_file = childs[2];
	input_file.click();
	input_file.addEventListener("change",(__if)=>{
		if(input_file.value == ""){
			e.style.width = "47px";
			e.src = "svg/imagen.svg";
			childs[0].classList.add("oculto");
			return;
		}
		let file = __if.target.files[0];
		let reader = new FileReader();
		reader.onload = function(event){
			e.src = event.target.result;
			e.style.width = "100%";
			childs[0].classList.remove("oculto");
		}
		if(file.type)reader.readAsDataURL(file);
	})
}
const add_opcion = (e,codexa) => {
	$(`#${e}`).append(
		`<div class="div-opcion">
            <input type="radio" name="opcion${codexa}" style="cursor: pointer;" title="Seleccionar como respuesta correcta...">
            <input type="hidden" name="text-option[]">
            <div class="divtext input-data" style="width: calc(100% - 50px);" contenteditable="" onkeyup="copiar(this);"></div>
            <img src="svg/quitar.svg" width="20px" style="cursor: pointer;" title="Eliminar opción..." onclick="delete_opcion(this);">
        </div>`
	)
}
const delete_opcion = e => {	
	let parent = e.parentNode;
	let main_parent = parent.parentNode;
	let childs = main_parent.children;
	let n = childs.length; 	
	console.log(childs)
	if( n <= 2){
		Swal.fire("Debe tener al menos dos opciones...");
		return;
	}
	main_parent.removeChild(parent);
}
const agregar_pregunta = (codmat,codexa,n) => {
	let e = `${codmat}${codexa}`;
	$(`.b${e}`).children().last().remove();
	$(`#ban${e}`).append(
		`<div class="div-pregunta" style="margin-top:10px;">
            <h3>Pregunta ${n}</h3>
            <form id="formulario-pregunta${e}" style="background: #efefef; padding: 15px 5px; border-radius:5px; position:relative;">
                <input type="hidden" name="codexa" value="${codexa}">
                <div class="div-pregunta-img">
                    <input type="hidden" name="descripcion">
                    <div class="divtext input-data" style="width: 100%" contentEditable onkeyup="copiar(this);"></div>
                    
                </div>
                <div class="div-img-preg">
                	<img class="img-close oculto" src="images/close.svg" title="Quitar imagen" onclick="removeImg(this)">
                    <img src="svg/imagen.svg" width="47px" style="cursor: pointer;" title="Selecciona una imagen para la pregunta..." onclick="get_file(this);">                
                    <input type="file" name="imagen" hidden accept="image/png, image/gif, image/jpeg, image/jpg">
                </div>
                <h3>Opciones</h3>
                <div id="opciones${codmat}${codexa}">
                    <div class="div-opcion">
                        <input type="radio" name="opcion${codexa}"  style="cursor: pointer;" title="Seleccionar como respuesta correcta...">
                        <input type="hidden" name="text-option[]">
                        <div class="divtext input-data" style="width: calc(100% - 30px)" contentEditable onkeyup="copiar(this);"></div>
                        <!--img src="svg/quitar.svg" width="20px" style="cursor: pointer;" title="Eliminar opción..." onclick="delete_opcion(this);"-->
                    </div>
                    <div class="div-opcion">
                        <input type="radio" name="opcion${codexa}" style="cursor: pointer;" title="Seleccionar como respuesta correcta..." />
                        <input type="hidden" name="text-option[]">
                        <div class="divtext input-data" style="width: calc(100% - 30px);" contentEditable onkeyup="copiar(this);"></div>
                        <!--img src="svg/quitar.svg" width="20px" style="cursor: pointer;" title="Eliminar opción..." onclick="delete_opcion(this);"-->
                    </div>
                    <div class="div-opcion">
                        <input type="radio" name="opcion${codexa}" style="cursor: pointer;" title="Seleccionar como respuesta correcta..." />
                        <input type="hidden" name="text-option[]">
                        <div class="divtext input-data" style="width: calc(100% - 30px)" contentEditable onkeyup="copiar(this);"></div>
                        <!--img src="svg/quitar.svg" width="20px" style="cursor: pointer;" title="Eliminar opción..." onclick="delete_opcion(this);"-->
                    </div>
                </div>
                <!--div class="div-add-opcion">
                    <img src="svg/agregar.svg" width="25px" title="Agregar una opción..." onclick="add_opcion('opciones${codmat}${codexa}',${codexa})">
                </div-->
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
	let radio = document.getElementsByName(`opcion${formData.get('codexa')}`);
	let op = 0;
	for (var i = 0; i < radio.length; i++) {
		if(radio[i].checked)op = i+1;
	}
	if(op == 0){
		Swal.fire("Debe seleccionar una opción como respuesta correcta...");
		return;
	}
	formData.append("opcion",op);
	let html1 = $.ajax(
		{
			url:"controlador/evaluacionSeleccion_controlador.php?op=save_pregunta&usr=doc",
			type: "POST",
			data:formData,
			contentType: false, 
			processData: false,
			async:false
		}
		).responseText;
	let response = JSON.parse(html1);
	if (response.status == "eSession")Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
	if (response.status == "errorParam")Swal.fire("Debe llenar todos los campos del formulario...");
	if(response.status == "ok"){
		let parent = $(`#${e}`).parent();
		parent.children().last().remove();
		parent.append(
			`<form id="form_preg${response.codpre}" style="background: #efefef; padding: 15px 5px; border-radius:5px; position:relative;"> 
			</form>`
		);
		actualizar_view_pregunta(response.codpre);
	}
}
const close_form_pregunta = (codmat,codexa) => {
	$(`#${codmat}${codexa}`).children().last().remove();
	banco(codmat,codexa);
}
const close_banco = (e) => {

	$(`#${e}`).children().last().remove();
	$(`#op${e}`).removeClass("oculto");
}
const delete_pregunta = (codmat,codexa,codpreg) => {
	$.post(
		"controlador/evaluacionSeleccion_controlador.php?op=delete_pregunta&usr=doc",
		{codpreg:codpreg},
		data => {
			if (data.status == "eSession")Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
			if (data.status == "eTrimestre")Swal.fire("Debe seleccionar un trimestre por favor...");
			if (data.status == "ok") {
				update_banco(codmat,codexa);
			}
		},"json"
	);
}
const update_banco = (codmat,codexa) => {
	$.post(
		"controlador/evaluacionSeleccion_controlador.php?op=banco&usr=doc",
		{codexa:codexa},
		data => {
			if (data.status == "eSession")Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
			if (data.status == "eTrimestre")Swal.fire("Debe seleccionar un trimestre por favor...");
			if(data.status == "ok"){
				let lista = data.data;
				let html = "";
				let index = 1;
				lista.forEach(p => {
					let img = p.imagen == ""?"svg/imagen.svg":p.imagen;
					let cls = p.imagen == ""?"oculto":"div-img-preg";
					let opciones = p.opciones;
					let html_op = "";
					opciones.forEach(op => {
						let checked = op.n_opcion == p.respuesta?"checked":"";
						html_op = `${html_op}<div class="div-opcion">
						                        <input type="radio" name="opcion${p.codpreg}" ${checked}  style="cursor: pointer;" title="Seleccionar como respuesta correcta..." disabled>
						                        <input type="hidden" name="text-option[]" value="${op.opcion}">
						                        <div class="divtext input-data" style="width: calc(100% - 50px);" onkeyup="copiar(this);">${op.opcion}</div>
						                        <img src="svg/quitar.svg" width="20px" style="cursor: pointer;" title="Eliminar opción..." onclick="delete_opcion(this);" class="oculto">
						                    </div>`;
					});
					html = `${html}<div class="div-pregunta" style="margin-top:10px;">
						            <h3>Pregunta ${index}</h3>
						            <form id="form_preg${p.codpreg}" style="background: #efefef; padding: 15px 5px; border-radius:5px; position:relative;">
						                <input type="hidden" name="codpre" value="${p.codpreg}">
						                <div class="div-pregunta-img">
						                    <input type="hidden" name="descripcion" value="${p.pregunta}">
						                    <div class="divtext input-data" style="width: 100%"  onkeyup="copiar(this);">${p.pregunta}</div>
						                </div>
						                <div class="${cls}">
						                	<img class="img-close oculto" src="images/close.svg" title="Quitar imagen" onclick="removeImg(this)">
						                    <img src="${img}" width="47px" style="cursor: pointer;" title="Selecciona una imagen para la pregunta...">                
						                    <input type="file" name="imagen" hidden accept="image/png, image/gif, image/jpeg, image/jpg">
						                </div>
						                <h3>Opciones</h3>
						                <div id="opciones${p.codpreg}">
						                    ${html_op}
						                </div>
						         		<div class="div-add-opcion oculto">
						                    <img src="svg/agregar.svg" width="25px" title="Agregar una opción..." onclick="add_opcion('opciones${codmat}${codexa}',${codexa})">
						                </div>
						                <div class="div-tempo" style="font-size: .9em; margin-top: 10px;">
						                    Tiempo: <input class="input-data" type="text" name="tiempo" readonly value="${p.tiempo}" max="30" min="1" style="width:25px; padding: 3px;"> minutos.
						                </div>
						                <div class="btn-delete-float" style="position: absolute;bottom: 5px;right: 5px; display:flex; gap:5px;">
						                    <img style="width:18px; padding:2px; cursor:pointer; border:1px solid #ccc; border-radius:5px;" src="svg/edit.svg" onclick="edit_pregunta(${p.codpreg});" title="Editar pregunta.">
						                    <img style="width:18px; padding:2px; cursor:pointer; border:1px solid #ccc; border-radius:5px;" src="svg/basura.svg" onclick="delete_pregunta('${codmat}',${codexa},${p.codpreg});" title="Eliminar pregunta.">
						                </div>
						            </form>
						        </div>`;
					index++;
				})
				
				$(`.b${codmat}${codexa}`).empty();
				$(`.b${codmat}${codexa}`).append(
					`   <div class="btn-close2">
			                <img src="images/close.svg" onclick="close_banco('${codmat}${codexa}');">
			            </div>
			            <h2 style="margin: 20px;">Banco de Preguntas</h2>

			            <div id="ban${codmat}${codexa}">${html}</div>
			            <div class="div-add" style="font-size:.8em">
			                <img src="svg/agregar-documento.svg" style="width:30px; cursor:pointer" onclick="agregar_pregunta('${codmat}',${codexa},${lista.length + 1});">Agregar Pregunta
			            </div>
					`)

			}
		},"json"
	);
}
const edit_pregunta = codpreg => {
	$.post(
		"controlador/evaluacionSeleccion_controlador.php?op=get_pregunta&usr=doc",
		{codpre:codpreg},
		data => {
			if (data.status == "eSession")Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
			if (data.status == "eTrimestre")Swal.fire("Debe seleccionar un trimestre por favor...");
			if (data.status == "ok") {
				let p = data.data;
				let img = p.dir_imagen == ""?'<img src="svg/imagen.svg" width="47px" style="cursor: pointer;" title="Selecciona una imagen para la pregunta..." onclick="get_file(this);">':`<img src="resources/${p.dir_imagen}" style="cursor: pointer; width:100%;" title="Selecciona una imagen para la pregunta..." onclick="get_file(this);">`;
				let oc = p.dir_imagen == ""?"oculto":"";
				let opciones = p.opciones;
				let html_op = "";
				opciones.forEach(op => {
						let checked = op.n_opcion == p.respuesta?"checked":"";
						html_op = `${html_op}<div class="div-opcion">
						                        <input type="radio" name="opcion${codpreg}" ${checked}  style="cursor: pointer;" title="Seleccionar como respuesta correcta...">
						                        <input type="hidden" name="text-option[]" value="${op.opcion}">
						                        <div class="divtext input-data" style="width: calc(100% - 50px);" contentEditable onkeyup="copiar(this);">${op.opcion}</div>
						                        <!--img src="svg/quitar.svg" width="20px" style="cursor: pointer;" title="Eliminar opción..." onclick="delete_opcion(this);"-->
						                    </div>`;
					});
				$(`#form_preg${codpreg}`).empty();
				$(`#form_preg${codpreg}`).submit(e=>{e.preventDefault()});
				$(`#form_preg${codpreg}`).append(
					`<input type="hidden" name="codpre" value="${codpreg}">
		                <div class="div-pregunta-img">
		                    <input type="hidden" name="descripcion" value="${data.data.pregunta}">
		                    <div class="divtext input-data" style="width: 100%" contentEditable onkeyup="copiar(this);">${data.data.pregunta}</div>
		                </div>
		                <div class="div-img-preg">
		                	<img class="img-close ${oc}" src="images/close.svg" title="Quitar imagen" onclick="removeImgUpdate(this)">
		                    ${img}                
		                    <input type="file" name="imagen" hidden accept="image/png, image/gif, image/jpeg, image/jpg">
		                    <input type="hidden" name="img" value="${p.dir_imagen}">
		                </div>
		                <h3>Opciones</h3>
		                <div id="opciones${codpreg}">
		                    ${html_op}
		                </div>
		                <!--div class="div-add-opcion">
		                    <img src="svg/agregar.svg" width="25px" title="Agregar una opción..." onclick="add_opcion('opciones${codpreg}',${codpreg})">
		                </div-->
		                <div class="div-tempo" style="font-size: .9em;">
		                    Tiempo: <input class="input-data" type="text" name="tiempo" value="3" max="30" min="1" style="width:25px; padding: 3px;"> minutos.
		                </div>
		                <div class="btn-pregunta" style="padding: 10px; text-align: center;">
		                    <button class="submit2" onclick="update_pregunta('form_preg${codpreg}')">GUARDAR</button>
		                    <button class="danger2" onclick="actualizar_view_pregunta(${codpreg})">CANCELAR</button>
		                </div>`
				);
			}
		},"json"
	);
}
const actualizar_view_pregunta = codpre => {
	$.post(
			"controlador/evaluacionSeleccion_controlador.php?op=get_pregunta&usr=doc",
			{codpre:codpre},
			response => {
				if (response.status == "eSession")Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
				if(response.status == "ok"){
					$(`#form_preg${codpre}`).empty();
					let p = response.data;
					let opciones = p.opciones;
					let html_op = "";
					let img = p.dir_imagen == ""?'<img src="svg/imagen.svg" width="47px" style="cursor: pointer;" title="Selecciona una imagen para la pregunta...">':`<img src="resources/${p.dir_imagen}" style="cursor: pointer; width:100%;" title="Selecciona una imagen para la pregunta...">`;
					let cls = p.dir_imagen == ""?"oculto":"div-img-preg";
					opciones.forEach(op => {
						let checked = op.n_opcion == p.respuesta?"checked":"";
						html_op = `${html_op}<div class="div-opcion">
						                        <input type="radio" name="opcion${p.codpreg}" ${checked}  style="cursor: pointer;" title="Seleccionar como respuesta correcta..." disabled>
						                        <input type="hidden" name="text-option[]" value="${op.opcion}">
						                        <div class="divtext input-data" style="width: calc(100% - 50px);" onkeyup="copiar(this);">${op.opcion}</div>
						                        <img src="svg/quitar.svg" width="20px" style="cursor: pointer;" title="Eliminar opción..." onclick="delete_opcion(this);" class="oculto">
						                    </div>`;
					});
					$(`#form_preg${codpre}`).append(
										`<input type="hidden" name="codpre" value="${codpre}">
						                <div class="div-pregunta-img">
						                    <input type="hidden" name="descripcion" value="${p.pregunta}">
						                    <div class="divtext input-data" style="width: 100%"  onkeyup="copiar(this);">${p.pregunta}</div>
						                </div>
						                <div class="${cls}">
						                	<img class="img-close oculto" src="images/close.svg" title="Quitar imagen" onclick="removeImg(this)">
						                    ${img}                
						                    <input type="file" name="imagen" hidden accept="image/png, image/gif, image/jpeg, image/jpg">
						                </div>
						                <h3>Opciones</h3>
						                <div id="opciones${p.codpreg}">
						                    ${html_op}
						                </div>
						         		<div class="div-add-opcion oculto">
						                    <img src="svg/agregar.svg" width="25px" title="Agregar una opción..." onclick="add_opcion('opciones${p.codmat}${p.codexa}',${p.codexa})">
						                </div>
						                <div class="div-tempo" style="font-size: .9em; margin-top: 10px;">
						                    Tiempo: <input class="input-data" type="text" name="tiempo" readonly value="${p.tiempo}" max="30" min="1" style="width:25px; padding: 3px;"> minutos.
						                </div>
						                <div class="btn-delete-float" style="position: absolute;bottom: 5px;right: 5px; display:flex; gap:5px;">
						                    <img style="width:18px; padding:2px; cursor:pointer; border:1px solid #ccc; border-radius:5px;" src="svg/edit.svg" onclick="edit_pregunta(${codpre});" title="Editar pregunta.">
						                    <img style="width:18px; padding:2px; cursor:pointer; border:1px solid #ccc; border-radius:5px;" src="svg/basura.svg" onclick="delete_pregunta('${p.codmat}',${p.codexa},${codpre});" title="Eliminar pregunta.">
						                </div>`
					);
				}
			},"json"
		);
}
const update_pregunta = e => {
	let formData = new FormData($(`#${e}`)[0]);
	let codpre = formData.get('codpre');
	let radio = document.getElementsByName(`opcion${codpre}`);
	let op = 0;
	for (var i = 0; i < radio.length; i++) {
		if(radio[i].checked)op = i+1;
	}
	if(op == 0){
		Swal.fire("Debe seleccionar una opción como respuesta correcta...");
		return;
	}
	formData.append("opcion",op);
	let html1 = $.ajax(
		{
			url:"controlador/evaluacionSeleccion_controlador.php?op=update_pregunta&usr=doc",
			type: "POST",
			data:formData,
			contentType: false, 
			processData: false,
			async:false
		}
		).responseText;
	let data = JSON.parse(html1);
	if (data.status == "eSession")Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
	if (data.status == "ok") {
		actualizar_view_pregunta(codpre);
	}
}
const banco = (codmat,codexa) =>{
	$.post(
		"controlador/evaluacionSeleccion_controlador.php?op=banco&usr=doc",
		{codexa:codexa},
		data => {
			if (data.status == "eSession")Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
			if (data.status == "eTrimestre")Swal.fire("Debe seleccionar un trimestre por favor...");
			if(data.status == "ok"){
				let lista = data.data;
				let html = "";
				let index = 1;
				lista.forEach(p => {
					let img = p.imagen == ""?'<img src="svg/imagen.svg" width="47px" style="cursor: pointer;" title="Selecciona una imagen para la pregunta...">':`<img src="resources/${p.imagen}" style="cursor: pointer; width:100%;" title="Selecciona una imagen para la pregunta...">`;
					let cls = p.imagen == ""?"oculto":"div-img-preg";
					let opciones = p.opciones;
					let html_op = "";
					opciones.forEach(op => {
						let checked = op.n_opcion == p.respuesta?"checked":"";
						html_op = `${html_op}<div class="div-opcion">
						                        <input type="radio" name="opcion${p.codpreg}" ${checked}  style="cursor: pointer;" title="Seleccionar como respuesta correcta..." disabled>
						                        <input type="hidden" name="text-option[]" value="${op.opcion}">
						                        <div class="divtext input-data" style="width: calc(100% - 50px);" onkeyup="copiar(this);">${op.opcion}</div>
						                        <img src="svg/quitar.svg" width="20px" style="cursor: pointer;" title="Eliminar opción..." onclick="delete_opcion(this);" class="oculto">
						                    </div>`;
					});
					html = `${html}<div class="div-pregunta" style="margin-top:10px;">
						            <h3>Pregunta ${index}</h3>
						            <form id="form_preg${p.codpreg}" style="background: #efefef; padding: 15px 5px; border-radius:5px; position:relative;">
						                <input type="hidden" name="codpre" value="${p.codpreg}">
						                <div class="div-pregunta-img">
						                    <input type="hidden" name="descripcion" value="${p.pregunta}">
						                    <div class="divtext input-data" style="width: 100%"  onkeyup="copiar(this);">${p.pregunta}</div>
						                </div>
						                <div class="${cls}">
						                	<img class="img-close oculto" src="images/close.svg" title="Quitar imagen" onclick="removeImg(this)">
						                    ${img}                
						                    <input type="file" name="imagen" hidden accept="image/png, image/gif, image/jpeg, image/jpg">
						                </div>
						                <h3>Opciones</h3>
						                <div id="opciones${p.codpreg}">
						                    ${html_op}
						                </div>
						         		<div class="div-add-opcion oculto">
						                    <img src="svg/agregar.svg" width="25px" title="Agregar una opción..." onclick="add_opcion('opciones${codmat}${codexa}',${codexa})">
						                </div>
						                <div class="div-tempo" style="font-size: .9em; margin-top: 10px;">
						                    Tiempo: <input class="input-data" type="text" name="tiempo" readonly value="${p.tiempo}" max="30" min="1" style="width:25px; padding: 3px;"> minutos.
						                </div>
						                <div class="btn-delete-float" style="position: absolute;bottom: 5px;right: 5px; display:flex; gap:5px;">
						                    <img style="width:18px; padding:2px; cursor:pointer; border:1px solid #ccc; border-radius:5px;" src="svg/edit.svg" onclick="edit_pregunta(${p.codpreg});" title="Editar pregunta.">
						                    <img style="width:18px; padding:2px; cursor:pointer; border:1px solid #ccc; border-radius:5px;" src="svg/basura.svg" onclick="delete_pregunta('${codmat}',${codexa},${p.codpreg});" title="Eliminar pregunta.">
						                </div>
						            </form>
						        </div>`;
					index++;
				})
				
				$(`#op${codmat}${codexa}`).addClass("oculto");
				$(`#${codmat}${codexa}`).append(
					`<div class="div-banco b${codmat}${codexa}">
			            <div class="btn-close2">
			                <img src="images/close.svg" onclick="close_banco('${codmat}${codexa}');">
			            </div>
			            <h2 style="margin: 20px;">Banco de Preguntas</h2>

			            <div id="ban${codmat}${codexa}">${html}</div>
			            <div class="div-add" style="font-size:.8em">
			                <img src="svg/agregar-documento.svg" style="width:30px; cursor:pointer" onclick="agregar_pregunta('${codmat}',${codexa},${lista.length + 1});">Agregar Pregunta
			            </div>
			        </div>
					`)

			}
		},"json"
	);
	/*
	*/
}
const delete_examen = (codalu,codexa,e) => {
	Swal.queue([{
    title: '¿Estás seguro?',
    confirmButtonText: 'Si',
    cancelButtonText: 'No',
    showCancelButton: true,
    text:'Se eliminará los registros de la evaluación del estudiante...',
    showLoaderOnConfirm: true,
    preConfirm: () => {
      document.querySelector('.swal2-styled.swal2-cancel').style.display ="none";
      return $.post(
				"controlador/evaluacionSeleccion_controlador.php?op=delete_examen&usr=doc",
				{codexa:codexa,codalu:codalu},
				data => {
					if (data.status == "eSession")Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
					if (data.status == "ok") {
						Swal.fire("El examen ha sido anulado...");
						let parent = e.parentElement.parentElement.parentElement;
						parent.innerHTML = "";
						let tr = parent.parentElement;
						let childs = tr.children;
						let input = childs[2].children;
						input[1].value= "";
						input[1].removeAttribute('readonly');
					}
				},"json"
			);
      
    }
  }]);	
}
const close_respuestas = () => {
	$(".div-respuestas").slideToggle();
}
const ver_respuestas = (codalu,codexa) => {
	$.post(
		"controlador/evaluacionSeleccion_controlador.php?op=get_respuestas&usr=doc",
		{codalu,codexa},
		data => {
			if (data.status == "eSession")Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
			if (data.status == "ok") {
				let respuestas = data.data;
				let html = "";
				let index = 1;
				respuestas.forEach(r => {
					let html_op = "";
					let opciones = r.opciones;
					let imagen = "";
					if(r.imagen != ""){
						imagen = `<div class="div-img-preg">
				                    <img src="resources/${r.imagen}" width="100%" style="cursor: pointer;" title="Selecciona una imagen para la pregunta...">          
				                </div>`;
					}
					opciones.forEach(op => {

						let background = "";
						if(op.n_op == r.respuesta && r.respuesta == r.opcion){
							background = "background:#76efa770;";
						}
						if(op.n_op == r.respuesta && r.respuesta != r.opcion){
							background = "background:#fb646470;";
						}
						if(op.n_op == r.opcion && r.respuesta != r.opcion){
							background = "background:#ccc;";
						}
						html_op = `${html_op}<div class="div-opcion">
						                        <div class="divtext input-data" style="width: 100%;${background}" >${op.opcion}</div>
						                    </div>`
					})
					html = `${html}<div class="div-pregunta" style="margin-top:10px;border: 1px solid #ccc;border-radius: 5px;padding: 10px;">
				                <h3>Pregunta ${index}</h3>
				                <div class="div-pregunta-img">
				                    <div class="divtext input-data" style="width: 100%">${r.pregunta}</div>
				                </div>
				                ${imagen}
				                <h3>Opciones</h3>
				                <div>
				                    ${html_op}
				                </div>
				                <div class="div-tempo" style="font-size: .9em;padding: 10px;display: flex;justify-content: space-between;align-items: center;">
				                        Hora: inicio ${r.horai} - fin ${r.horaf}
				                </div>
				            </div>`;
				    index++;
				});
				$(".div-resp").empty();
				$(".div-resp").append(
					`<div class="btn-close2">
			            <img src="images/close.svg" onclick="close_respuestas();">
			        </div>
			        <div class="main-info">
			            <div class="div-info">
			                <strong>Curso:</strong>&nbsp; ${data.curso}  
			            </div>
			            <div class="div-info">
			                <strong>Meteria:</strong>&nbsp; ${data.materia}
			            </div>
			            <div class="div-info">
			                <strong>Alumno:</strong>&nbsp; ${data.alumno} 
			            </div>
			            
			            <div class="div-info">
			                <strong>Nota:</strong>&nbsp; ${data.nota}
			            </div>
			        </div>
			        <div class="div-content-respuestas">
			        	<div class="div-info">
			                <strong>Tema:</strong>&nbsp; ${data.evaluacion} 
			            </div>
			            ${html}
			        </div>`
				);
				$(".div-respuestas").slideToggle("disappear");
			}
		},"json"
	);
}
const revisar = (codmat,codexa) => {
	$.post(
		"controlador/evaluacionSeleccion_controlador.php?op=get_calificaciones&usr=doc",
		{codexa:codexa},
		data => {
			if (data.status == "eSession")Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
			if (data.status == "ok") {
				let lista = data.data;
				let html = "";
				let index = 1;
				lista.forEach(a => {
					let readonly = "";
					let estado = "";
					if(a.estado == 1){//El alumno realizó la evaluación en plataforma
						estado = `<div style="display: flex;justify-content: space-between;">
									<div style"display: flex;align-items: center;">
										<img style="width: 35px;border-radius: 50%; cursor:pointer;" src="images/test-report.png" title="Ver respuestas" onclick="ver_respuestas(${a.codalu},${codexa});">
									</div>
									<div style="display: flex;align-items: center;">
										<img style="width:25px;cursor:pointer;" src="images/delete.png" title="Eliminar examen" onclick="delete_examen(${a.codalu},${codexa},this)">
									</div>
								  </div>`;
						readonly = "readonly";
					}
					html = `${html}<tr>
			            				<td>${index}</td>
			            				<td>${a.nombre}</td>
			            				<td><input type="hidden" name="alumno[]" value="${a.codalu}"><input ${readonly} type="number" name="nota[]" min="0" max="100" class="input-data p-10" value="${a.nota == null?"":a.nota}" style="width:50px"></td>
			            				<td>${estado}</td>
			            			</tr>`;
			        index++;
				})
				$(`#op${codmat}${codexa}`).addClass("oculto");
				$(`#${codmat}${codexa}`).append(
					`<div class="div-banco b${codmat}${codexa}">
			            <div class="btn-close2">
			                <img src="images/close.svg" onclick="close_banco('${codmat}${codexa}');">
			            </div>
			            <h2 style="margin: 20px;">Lista de Notas</h2>
			            <div id="calificaciones${codexa}">
			            	<form id="form_calif${codexa}">
				            	<table class="lista-notas" style="width:100%;">
				            		<thead style="font-weight:bold;">
				            			<tr>
				            				<td>No.</td>
				            				<td>Nombre</td>
				            				<td>Nota</td>
				            				<td></td>
				            			</tr>
				            		</thead>
				            		<tbody>
				            			${html}
				            		</tbody>
				            	</table>
				            </form>
			            </div>
			            <div class="btn-submit-cancel" id="btnNewEval111S5">
		                    <button class="submit" onclick="save_calificaciones(${codexa})">GUARDAR</button>
		                    <button class="danger2" onclick="actualizar_calificaciones(${codexa})">CANCELAR</button>
		                </div>
			        </div>`
				);
			}
		},"json"
	)
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
													Revisar<img style="width:25px; cursor:pointer;" src="svg/cheque-de-boleta.svg" onclick="revisar('${codmat}',${evaluacion.codeva})">
												</div>
												<div class="div-option" style="font-size:.8em;">
													Banco<img style="width:25px; cursor:pointer;" src="svg/votacion.svg" onclick="banco('${codmat}',${evaluacion.codeva})">
												</div>
												<!--div class="div-option" style="font-size:.8em;">
													Config.<img style="width:25px; cursor:pointer;" src="svg/ajustes.svg">
												</div-->
												<div class="div-option" style="font-size:.8em; color:var(--c3);">
													Eliminar<img style="width:25px; cursor:pointer;" src="svg/basura.svg" onclick="delete_evaluacion(${evaluacion.codeva});">
												</div>
											</div>
										</div>`
		}
	});
	$(`#${codcur}${codpar}${codmat}`).append(
		`<div class="div-evaluaciones">
			<div class="btn-close2">
		        <img src="images/close.svg" onclick="close_materia(${codcur},${codpar},'${codmat}','${nombre}');">
		    </div>
			<h2 class="h-class-name materia-name" style="margin-bottom:10px;">${nombre}</h2>
			${evaluaciones}
			<div class="div-add" id="add${codcur}${codpar}${codmat}"><img src="svg/agregar-documento.svg" style="width:30px; cursor:pointer" onclick="mostrar_formulario(${codcur},${codpar},'${codmat}');">Agregar Evaluación</div>`
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
const cerrarFormulario = (codcur,codpar,codmat) => {
	$(`#add${codcur}${codpar}${codmat}`).empty();
	$(`#add${codcur}${codpar}${codmat}`).append(`<img src="svg/agregar-documento.svg" style="width:30px; cursor:pointer" onclick="mostrar_formulario(${codcur},${codpar},'${codmat}');">Agregar Evaluación`);
}
const mostrar_formulario = (codcur,codpar,codmat) => {
	$(`#add${codcur}${codpar}${codmat}`).empty();
	$(`#add${codcur}${codpar}${codmat}`).append(
		`<div class="div-formulario">
                <div class="div-title"><h2>Nueva Evaluación</h2></div>
                <form id="formulario${codcur}${codpar}${codmat}" class="formulario">
                    <div class="div-input">
                    	<input type="hidden" name="codcur" value="${codcur}">
                    	<input type="hidden" name="codpar" value="${codpar}">
                    	<input type="hidden" name="codmat" value="${codmat}">
                        <label class="fs09 ta-l" style="margin-left: 5px;">Curso</label>
                        <input type="text" name="" readonly value="${get_nombre_curso(codcur,codpar)}" class="input-data p-5 fs1">
                    </div>
                    <div class="div-input">
                        <label class="fs09 ta-l" style="margin-left: 5px;">Meteria</label>
                        <input type="text" name="" readonly value="${get_materia(codmat).nombre}" class="input-data p-5 fs1">
                    </div>
                    <div class="div-input">
                        <label class="fs09 ta-l" style="margin-left: 5px;">Número de Evaluación</label>
                        <input type="number" class="input-data p-5" name="nro_eva" value="" required>
                    </div>
                    <div class="div-input">
                        <label class="fs09 ta-l" style="margin-left: 5px;">Descripción</label>
                        <textarea class="input-data fs1-5" style="height:50px" name="descripcion" required></textarea>
                    </div>
                    <div class="div-input">
                        <label class="fs09 ta-l" style="margin-left: 5px;">Indicador</label>
                        <textarea class="input-data fs1-5" style="height:50px" name="indicador" required></textarea>
                    </div>
                    <div class="div-input">
                        <label class="fs09 ta-l" style="margin-left: 5px;">Fecha inicio</label>
                        <input type="date" class="input-data p-5" name="fini" value="" required>
                    </div>
                    <div class="div-input">
                        <label class="fs09 ta-l" style="margin-left: 5px;">Hora inicio</label>
                        <input type="time" class="input-data p-5" name="horaini" value="" required>
                    </div>
                    <div class="div-input">
                        <label class="fs09 ta-l" style="margin-left: 5px;">Fecha fin</label>
                        <input type="date" class="input-data p-5" name="ffin" value="" required>
                    </div>
                    <div class="div-input">
                        <label class="fs09 ta-l" style="margin-left: 5px;">Hora fin</label>
                        <input type="time" class="input-data p-5" name="horafin" value="" required>
                    </div>
                    <div class="div-input">
                        <label class="fs09 ta-l" style="margin-left: 5px;">Preguntas</label>
                        <select class="input-data p-5" name="preguntas" required>
                        	<option value="0">Sin preguntas</option>
                        	<option value="5">5 Preguntas</option>
                        	<option value="10">10 Preguntas</option>
                        </select>
                    </div>
	                <div class="btn-submit-cancel" id="btnNewEval${codcur}${codpar}${codmat}">
	                    <button class="submit" onclick="save_evaluacion('${codcur}${codpar}${codmat}')">GUARDAR</button>
	                    <button class="danger2" onclick="cerrarFormulario(${codcur},${codpar},'${codmat}')">CANCELAR</button>
	                </div>
                </form>
            </div>`
	);
	return;
}
const save_evaluacion = id_form => {
	let formData = new FormData($(`#formulario${id_form}`)[0]);
	if(formData.get('nro_eva') == ""){
		return;
	}
	if(formData.get('descripcion') == "")return;
	if(formData.get('indicador') == "")return;
	if(formData.get('fini') == "")return;
	if(formData.get('horaini') == "")return;
	if(formData.get('ffin') == "")return;
	if(formData.get('horafin') == "")return;
	if(formData.get('preguntas') == "")return;
	let childs = $(`#btnNewEval${id_form}`).children();
	$(`#btnNewEval${id_form}`).empty();
	$(`#btnNewEval${id_form}`).append(
		`<section style="padding-left:0px;">
		  <div class='sk-double-bounce'>
		    <div class='sk-child sk-double-bounce-1'></div>
		    <div class='sk-child sk-double-bounce-2'></div>
		  </div>
		</section>`
	);

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
		  			$(`#btnNewEval${id_form}`).empty();
			  		$(`#btnNewEval${id_form}`).append(
			  			`<img src="svg/controlar.svg" width="30px">`
			  		);
			  		setTimeout(()=>{
			  			cerrarFormulario(formData.get('codcur'),formData.get('codpar'),formData.get('codmat'));
			  			mostrar_evaluaciones(formData.get('codcur'),formData.get('codpar'),formData.get('codmat'),get_materia(formData.get('codmat')).nombre);
			  		},2000)
		  		},3000)
		  	}
		  	if(response.status == "errorFechas"){
		  		Swal.fire("Hay un error en las fechas de inicio y fin...");
		  		$(`#btnNewEval${id_form}`).empty();
				$(`#btnNewEval${id_form}`).append(childs);
		  	}
		  	if(response.status == "errorPreguntas"){
		  		Swal.fire("Debe introducir un valor numérico para la cantidad de preguntas...");
		  		$(`#btnNewEval${id_form}`).empty();
				$(`#btnNewEval${id_form}`).append(childs);
		  	}
		  	if(response.status == "errorPreguntas"){
		  		Swal.fire("Debe introducir un valor numérico para la cantidad de preguntas...");
		  		$(`#btnNewEval${id_form}`).empty();
				$(`#btnNewEval${id_form}`).append(childs);
		  	}
		  	if(response.status == "errorParam"){
		  		Swal.fire("Hubo un error recarga la página por favor...");
		  		$(`#btnNewEval${id_form}`).empty();
				$(`#btnNewEval${id_form}`).append(childs);
		  	}
		  },
		  error: (xhr, status, error) => {
		  	$(`#btnNewEval${id_form}`).empty();
			$(`#btnNewEval${id_form}`).append(childs);
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
	//print_eval(3);
});