/* Variables */
var curso;
var paralelo;
var cantidadInputs;

/* Variable global para la descripcion del practico */
var descripcionPracticos;

/* Variables que contienen informacion del JSON */
var listaMaterias = [];
var nombre_curso;
var nombre_materia;
var listaCursos = [];
var listaPracticos = [];
var listaPreguntasPracticos = [];
var listaAlumnos = [];
var lista=[];
var lista2=[];
var lista_celulares = [];
var nuevo_msg;
var nota_practico;
var nota2_practico;
var nro_practico;

//var dominio = 'http://192.168.100.65';
var dominio = 'https://www.aizama.net';

function obtenerMaterias(curso, paralelo){
    $("#seleccionar_materia").empty();
    $("#seleccionar_materia").append('<option value="0"> -- Seleccionar materia -- </option>');
    for(var i = 0 ; i < listaMaterias.length; i++) {
        if(listaMaterias[i]['codcur'] == curso && listaMaterias[i]['codpar'] == paralelo){
          $("#seleccionar_materia").append('<option value ="'+(listaMaterias[i]['codmat'])+'">' + listaMaterias[i]['nombre'] + '</option>');
        }
    }
}



function validarSelects() {
    if ( $('#seleccionar_materia').val() != 0 &&
       $('#seleccionar_curso').val() != 0  ) {
        return true;
    } else {
        return false;
    }
}

/* Eliminar la pregunta del practico */
function eliminarPregunta(input, posicionInput) {
    let pregunta = input.parentElement;
    pregunta.remove();
    for (var i = posicionInput; i < cantidadInputs; i++) {
        $(`#file${i+1}`).attr("id", `file${i}`);
    }
    cantidadInputs--;
}
function noPresentaron(){
    Swal.queue([{
                title: 'Advertencia',
                confirmButtonText: 'Aceptar',
                text: 'Se enviará una notificación a los tutores informando que el estudiante no presentó su práctico',
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#E6344A',
                showLoaderOnConfirm: true,
                showCancelButton: true,
                preConfirm: function()
                {
                    listaAlumnos.forEach((alumno)=>{
                       if(alumno.estado == "0"){
                           enviarMensaje2(alumno.codalu,0,"NO PRESENTÓ EL PRÁCTICO");
                       } 
                    });
                }
            }]);
}

function guardarPracticoRegistro() {
    /* FormData para enviar informacion al POST para guardar practico */
    let formData = new FormData();
    
    if( $('#descripcion_practico').val() != '' ) {
        formData.append('descripcion', $('#descripcion_practico').val());
    } else {
        Swal.fire('Agrege una descripción a sus prácticos');
        return false;
    }
    if( $('#fecha').val() != '' ) {
        formData.append('fecha', $('#fecha').val());
    } else {
        Swal.fire('Agrege una fecha límite a sus práctico');
        return false;
    }
    if( $('#hora').val() != '' ) {
        formData.append('hora', $('#hora').val());
    }else{
        Swal.fire('Agrege la hora límite a sus práctico');
        return false;
    }
    if($('#nota-practico').val()!=""){
        formData.append('nota', $('#nota-practico').val());
    }else{
        Swal.fire('Agrege la nota a su práctico');
        return false;
    }
    formData.append('codpractico', $('#codpractico').val())

    
    Swal.fire({
        title: 'Subiendo en el práctico',
        html: 'cargando...',
        timer: 500,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
        
                let preguntasAgregadas = document.querySelectorAll('.preguntas .pregunta input[type="text"]');
                let enlacesAgregados = document.querySelectorAll('.preguntas .pregunta a');
                let cantidadPreguntas = preguntasAgregadas.length;
                formData.append('codcur', curso);
                formData.append('npreg', cantidadPreguntas);
                formData.append('codpar', paralelo);
                formData.append('codmat', $('#seleccionar_materia').val());
                

                /* Cargar preguntas al formData */
                for( let i = 0; i< preguntasAgregadas.length; i++) {
                    let preguntasName = preguntasAgregadas[i].name=`preg${i+1}`;
                    let preguntas = preguntasAgregadas[i].value;
                    if( preguntasAgregadas[i].value != ''  ) {
                        formData.append(preguntasName, preguntas);
                    } else {
                        Swal.fire('Agrege preguntas a sus campos creados');
                        return false;
                    }
                }

                /* Cargar enlaces al formData */
                for (let i = 0; i < enlacesAgregados.length; i++) {
                    let enlacesName = enlacesAgregados[i].name = `src${i+1}`;
                    let enlaces = enlacesAgregados[i];
                    let href = enlaces.getAttribute("href");
                    formData.append(enlacesName, href);
                }

                if( cantidadPreguntas > 0) {
                    /* Cargar archivos al formData */
                    for (let i = 0; i < cantidadInputs; i++) {
                        var archivos = $(`#file${i+1}`).prop('files')[0];
                        formData.append(`file${i+1}`, archivos);
                    }


                    /* Peticion post para guardar el practico */ 
                    let req = new XMLHttpRequest();
                    var contador =1
                        
                    req.onreadystatechange = function (aEvt) {   
                    if (req.readyState == 4) {
                        if(req.status == 200) {
                            
                            if( req.responseText == 'ok') {

                                swal.closeModal();
                                $('#campos').children().remove();
                                pedirPracticos();
                                $('.btn-nuevo').css("display", "block");
                                $('.practico').css("display", "block");
                                $('.practico-nuevo').css("display", "none");
                                verPracticos(curso, paralelo, $('#seleccionar_materia').val());
                                Swal.fire('Éxito', 'Práctico asignado correctamente', 'success');
								cargarLista();
                                    
                            } else if (req.responseText == 'noEdit') {
                                Swal.fire('Error', 'Solo puede editar la fecha y hora', 'error');
                            }else if(req.responseText == 'editFecha'){
                                if( $('#codpractico').val() === '' ) {
									/*console.log("Aqui");
                                    cargarListaEstudiantes( curso );
                                    getmsgallclass("Hola");*/
                                } 
                                $('#campos').children().remove();
                                pedirPracticos();
                                $('.btn-nuevo').css("display", "block");
                                $('.practico').css("display", "block");
                                $('.practico-nuevo').css("display", "none");
                                verPracticos(curso, paralelo, $('#seleccionar_materia').val());
                                Swal.fire('Aviso', 'Sólo se pudo actualizar la fecha y hora de presentación...', 'success');
                            } else {
                                Swal.fire('Error', 'Se produjo un error al asignar práctico', 'error');
                            }
                        }
                    }
                    };
                    req.open('POST', 'practicos_json.php?op=savepractdocument', false);
                    req.send(formData);
                } else {
                    Swal.fire('Debe tener al menos una pregunta');
                }  
        }
    })
}
function cargarListaEstudiantes( curso,paralelo ){
	let codigoCurso = curso;
    let codigoParalelo = paralelo;
		
	
}
function obtenerContactos (codalu){
    let lista20= [];
   	console.log(codalu);

	console.log(lista_celulares);
    lista_celulares.forEach((celular)=>{
        if(celular.codalu==codalu){
            lista20.push(celular.celular);
        }
        
    });
    return lista20;
}

function getmsgalu2(id,msg){
			//nombre_materia=toUpperCase(nombre_materia);
			nuevo_msg='Curso: '+nombre_curso+' Materia: '+nombre_materia+' - '+msg;
			let contactos = obtenerContactos(id);
			
	    	console.log(contactos);
			console.log(nombre_materia);
	    	contactos.forEach((contacto)=>{
	        $.get(
	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto
	            );
	        
	    	});
	    	$.post(
	    	    'data_agenda.php?alumno_celular',
	    	    {codalu:id},
	    	    (nroCelular)=>{
	    	        if(nroCelular!=""){
	    	            $.get(
            	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+nroCelular
            	            );
	    	        }
	    	    });
	
	        //    "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto

            var m = document.getElementById("seleccionar_materia");
            var materia = m.options[m.selectedIndex].value;    

            var c_recibe = id;
            var emite = $('#id_usr').val();
            var msgr = msg;
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
    console.log(lista2.length);
	if (validardatos1()&&lista2.length>0) {
		console.log(lista2.length);
		for (var i = 0; i < lista2.length; i++) {
			if(!getmsgalu2(lista2[i],msg)){
				alert('Error al enviar mensages,actualizar e intentar nuevamente');	
				return false;
			}

		}
		    //getmsgalu2(2,msg);
		
		    $('#msncurso').val("");
		    $('#msnalu').val("");
		  	alert('Mensaje enviado correctamente a la agenda y al Whatsapp de los tutores');	
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

function crearPractico() { 
    cantidadInputs = 0;
    $('.preguntas').children().remove();
    $('#codpractico').val('');
    $('#fecha').val('');
    $('#hora').val('');
    
    if (validarSelects()) {
        $('.preguntas').children().remove();
        $('#descripcion_practico').val('');
        $('.practico-nuevo').css("display", "block");
        $('.btn-nuevo').css("display", "none");
        $('.contenedor-table-general').css("display", "none");
    } else {
        Swal.fire('Seleccione curso y materia');
    }
}

function volverAtras() {
  $('.practico-nuevo').css("display", "none");
  $('.practico').css("display", "block");
  $('.contenedor-table-general').css("display", "block");
  $('.btn-nuevo').css("display", "block");
}
function volverAtrasAlumno() {
    $('.contenedor-table-filtrada').css("display", "none");
    $('.contenedor-table-general').css("display", "block");
    $('.btn-nuevo').css("display", "block");
}

function obtenerExtension(filename) {
  return filename.split('.').pop();
}

function obtenerDescripcionPractico(id) {
    for(let i = 0; i < listaPracticos.length; i++) {
        let idPractico = listaPracticos[i]['id'];
        if( idPractico == id ) {
            nota_practico=listaPracticos[i]['nota'];
            return listaPracticos[i]['descripcion'];
        }
    }
}

function obtenerFechaPractico(id) {
    for(let i = 0; i < listaPracticos.length; i++) {
        let idPractico = listaPracticos[i]['id'];
        if( idPractico == id ) {
            return listaPracticos[i]['fecha'];
        }
    }
}

function obtenerHoraPractico(id) {
    for(let i = 0; i < listaPracticos.length; i++) {
        let idPractico = listaPracticos[i]['id'];
        if( idPractico == id ) {
            return listaPracticos[i]['hora'];
        }
    }
}
function obtenerNotaPractico(id) {
    for(let i = 0; i < listaPracticos.length; i++) {
        let idPractico = listaPracticos[i]['id'];
        if( idPractico == id ) {
            return listaPracticos[i]['nota'];
        }
    }
}



function editarPractico(id) {

    $('.practico-nuevo').css("display", "block");
    $('.practico').css("display", "none");
    $('.contenedor-table-general').css("display", "none");
    $('.btn-nuevo').css("display", "none");
    $('.preguntas').children().remove();
    $('#codpractico').val(id);

    var valorDescripcion = obtenerDescripcionPractico(id);
    var fechaPractico = obtenerFechaPractico(id);
    var horaPractico = obtenerHoraPractico(id);
    var notaPractico = obtenerNotaPractico(id);
    
    console.log(fechaPractico);
    console.log(horaPractico);


    $('#descripcion_practico').val(valorDescripcion);

    console.log($('#fecha'));
    console.log($('#hora'));

    $('#fecha').val(fechaPractico);
    $('#hora').val(horaPractico);
    $('#nota-practico').val(notaPractico);

    var count =1;
    for(let i = 0; i < listaPreguntasPracticos.length; i++ ) {
        let idPractico = listaPreguntasPracticos[i]['codpractico'];
        if(id == idPractico) {
            let estado = listaPreguntasPracticos[i]['estadoarchivo'];
            let pregunta = listaPreguntasPracticos[i]['pregunta'];
            let archivo = listaPreguntasPracticos[i]['archivo'];      

            if( estado == '1') {
                let archivoFile = `${archivo}`;
                $('.preguntas').append( 
                    
                    `<div class="pregunta" style="margin-bottom:15px">
                        
                        <input type="text" value="${pregunta}" style="background-color:#e1e1e1; border:none; border-radius:5px;padding:20px 10px;">
                        
                        <a href="${archivoFile}" target="_blank"> 
                            <img src="images/ver.svg" alt="ver" height="40px">
                        </a>
                        
                        <button style="margin-left:8px" onclick="eliminarPregunta(this, ${i})">
                            <img src=images/close.svg alt="img" height="40px">
                        </button>
                        
                        <div class="archivo" style="margin-left:8px;">
                            <label for="file${count}"><img src="images/adjunto.svg" height="40px"></label>
                            <input type="file" id="file${count}" name="file1" onchange="cambioInputFile(file${count})"/>
                        </div>

                    </div>`

                );

                let id = `file${count}`;
                cambioInputFile(id, archivoFile);
                count++;

            } else if( estado == '0') {

                $('.preguntas').append( 
                    `<div class="pregunta" style="margin-bottom:15px">
                        <input type="text" value="${pregunta}" placeholder="Escribe tu pregunta" style="background-color:#e1e1e1; border:none; border-radius:5px;padding:20px 10px;">

                        <a href="" target="_blank" style="display:none;">
                        </a>

                        <button style="margin-left:8px" onclick="eliminarPregunta(this, ${i})">
                            <img src=images/close.svg alt="img" height="40px">
                        </button>

                        <div class="archivo" style="margin-left:8px;">
                            <label for="file${count}"><img src="images/adjunto.svg" height="40px"></label>
                            <input type="file" id="file${count}" name="file1" onchange="cambioInputFile(file${count})"/>
                        </div>
                    </div>`
                );
                count++;
            } 
        }
    }

    let archivoAgregados = document.querySelectorAll('.preguntas .pregunta input[type="file"]');
    cantidadInputs = archivoAgregados.length;
}



function cambiarIcono(extension, iconoCambiar) {

    switch (extension) {

        case 'pdf':

            iconoCambiar.value = "images/pdf.png"

            break;

        case 'ppt':

        case 'pptx':

            iconoCambiar.value = "images/point.png"

            break;

        case 'doc':

        case 'docx':

            iconoCambiar.value = "images/icono-docx.png"

            break;

        case 'xls':

        case 'xlsx':

            iconoCambiar.value = "images/excel.png"

            break;

        case 'jpg':
        case 'JPG':
        case 'png':
        case 'jpeg':
        case 'JPEG':
        case 'svg':
            iconoCambiar.value = "images/icono_img.svg"
            break;
        default:
            break;
    }
}



function verificarExtensiones(extension) {
    if( extension == 'pdf' || extension == 'ppt' || extension == 'pptx' || extension == 'doc' ||
        extension == 'doc' || extension == 'docx' || extension == 'xls' || extension == 'xlsx' ||
        extension == 'jpg' || extension == 'JPG' || extension == 'png' || extension == 'jpeg' ||
        extension == 'JPEG' || extension == 'svg') {
        return true;
    } else {
        return false;
    }
}





function cambioInputFile(id, archivo = 'noValue') {
    let extension;
    let icono;
    let idFile;
    if(archivo != 'noValue') {
        idFile = document.querySelector(`#${id}`);
        icono = idFile.parentElement.parentElement.children[1].attributes[0].value;
        extension = obtenerExtension(archivo);
        if(verificarExtensiones(extension)) {

            let iconoCambiar = idFile.parentElement.parentElement.children[1].children[0].attributes[0];

            cambiarIcono(extension, iconoCambiar);

        } 

        

    } else {

        id.parentElement.parentElement.children[1].style.display = "none";

        icono = id.parentElement.parentElement.children[1].attributes[0].value;

        extension = obtenerExtension(id.value);

        if( verificarExtensiones(extension) ) {
            let iconoCambiar = id.parentElement.parentElement.children[3].children[0].children[0].attributes[0];
            cambiarIcono(extension, iconoCambiar);
        } else {
            id.value = null;
            Swal.fire('Formato de archivo no valido');
        }
    }
}



function agregarPreguntaPractico() {

    cantidadInputs++;

    $('.preguntas').append( 

        `<div class="pregunta" style="margin-bottom:15px">

            <input type="text" value="" placeholder="Escribe tu pregunta" style="background-color:#e1e1e1; border:none; border-radius:5px;padding:20px 10px;">

            <a href="" target="_blank" style="display:none;"> 

            </a>

            <button style="margin-left:8px" onclick="eliminarPregunta(this)">

                <img src=images/close.svg alt="img" height="40px">

            </button>

            <div class="archivo" style="margin-left:8px;">

                <label for="file${cantidadInputs}">

                    <img src="images/adjunto.svg" height="40px">

                </label>

                <input type="file" id="file${cantidadInputs}" name="file1" onchange="cambioInputFile(file${cantidadInputs}, 'noValue')"/>

            </div>

        </div>`

    );

}



function eliminarPractico(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Eliminarás el práctico",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',

        confirmButtonText: 'Si',

        cancelButtonText: 'No'

    }).then((result) => {

        if (result.isConfirmed) {

            var req = new XMLHttpRequest();

            let formData = new FormData()

            formData.append('codpractico', id);

            req.onreadystatechange = function (aEvt) {

                if (req.readyState == 4) {

                    if(req.status == 200) {

                        if( req.responseText == 'ok') {
                            $('#campos').children().remove();
                            pedirPracticos();
                            verPracticos(curso, paralelo, $('#seleccionar_materia').val());
                            $('.btn-nuevo').css("display", "block");
                            $('.practico-nuevo').css("display", "none")
                            Swal.fire('Éxito', 'Se eliminó el práctico', 'success');
                        } else {
                            Swal.fire('Error', 'Error al eliminar el práctico', 'error');
                        }
                    }

                }

            };
            

            req.open('POST', 'practicos_json.php?op=deletepa', false);

            req.send(formData);

        }

    });  

}
function limitar_practico(id,estado){
    for(let i = 0 ; i < listaPracticos.length; i++){
        if(listaPracticos[i].id == id){
            if(estado){
                listaPracticos[i].limite = 1;
            }else{
                listaPracticos[i].limite = 0;
            }
            return;
        }
    }
}
function limitar(obj,id_practico){
    //console.log(obj.checked);
    //alert(id_practico);
    if(obj.checked){
        $.post(
                "practicos_json.php?op=liberar_practico",
                {codprac:id_practico},
                (datos)=>{
                    if(datos=="ok"){
                        limitar_practico(id_practico,true);
                        Swal.fire("Los estudiantes aún podrán subir su práctico después de la fecha límite establecida...!!!");
                    }
                },
                "text"
            );
    }else{
        $.post(
                "practicos_json.php?op=limitar_practico",
                {codprac:id_practico},
                (datos)=>{
                    if(datos=="ok"){
                        limitar_practico(id_practico,false);
                        Swal.fire("Los estudiantes no podrán subir su práctico después de la fecha límite establecida...!!!");
                    }
                },
                "text"
            );
    }

}


function verPracticos(curso, paralelo, materia) {
    $('#campos').children().remove();
    var count = 1;
    for(let i = 0; i < listaPracticos.length; i++) {
        let id = listaPracticos[i]['id'];
        let descripcion = listaPracticos[i]['descripcion'];
        let codigoCurso = listaPracticos[i]['codcur'];
        let codigoParalelo = listaPracticos[i]['codpar'];
        let codigoMateria = listaPracticos[i]['codmat'];
        let presentacion = listaPracticos[i]['fechalimite'];
        let fecha = listaPracticos[i]['hora'];
        let hora = listaPracticos[i]['fecha'];
        let limite = listaPracticos[i]['limite'];
        console.log(limite);
        let check = "";
            
        if(limite == "1"){
            check = `<td data-label="Permitir presentar pasada la fecha límite"><label class="switch">
                              <input type="checkbox" checked id="${codigoMateria}" name="${codigoMateria}" onclick="limitar(this,${id})">
                              <span class="slider round"></span>
                            </label>
                            </td>`;
        }else{
            check = `<td data-label="Permitir presentar pasada la fecha límite"><label class="switch">
                              <input type="checkbox" id="${codigoMateria}" name="${codigoMateria}" onclick="limitar(this,${id})">
                              <span class="slider round"></span>
                            </label>
                            </td>`;
        }
        
        if( codigoCurso == curso && codigoParalelo == paralelo && codigoMateria == materia ) {
            nota_practico = listaPracticos[i]['nota'];
            console.log('verPracticos - Nota_practico: '+nota_practico);
            descripcionPracticos = descripcion;

            $('.contenedor-table-general').css("display", "block");

            $('#campos').append(

                `<tr>

                    <td data-label="Nro"> ${count} </td>

                    <td data-label="Descripción">${descripcion}</td>
                    <td data-label="Presentación">${presentacion}</td>
                    <td data-label="Nota">${nota_practico}</td>
                    <td data-label="Revisar">
                        <button onclick="obtenerEstudiantes(${id},${count})">
                            <img src="images/icon-examen.svg" height="50px">
                        </button>
                    </td>
                    <td data-label="Ver o Editar">

                        <button onclick="editarPractico(${id})">

                            <img src="images/edit.svg" height="50px">

                        </button>

                    </td>

                    <td data-label="Eliminar">

                        <button onclick="eliminarPractico(${id})">

                            <img src="images/delete.svg" height="50px">

                            </button>

                    </td>
                    ${check}

                </tr>`  

            );

            count++;

        } 

    }

}

function obtenerEstudiantes(idpractico,nro) {
    var http = new XMLHttpRequest();
    var url = 'practicos_json.php?op=pracpres';
    var formData = new FormData();
    formData.append('codcur', curso);
    formData.append('codpar', paralelo);
    formData.append('codmat', $('#seleccionar_materia').val());
    formData.append('codpractico', idpractico);
//    sacarNotaPractico(idpractico,nro);
    cargarDescripcion(idpractico,nro);
    console.log('ultimo: '+nota_practico);
    http.open('POST', url, false);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var respuesta = http.responseText;
            var jsonData = JSON.parse(respuesta);
            if(jsonData['status'] == 'ok') {
                listaAlumnos = jsonData['lista'];
                mostrarAlumnosPracticos();
            }
        }
    }
    http.send(formData);
}

function cargarDescripcion(idpractico,nro){
    nro_practico = nro;
    let descripcion = obtenerDescripcionPractico(idpractico);
    let nota2 = obtenerNotaPractico(idpractico);
    document.getElementById('head-lista').innerHTML = `Práctico ${nro} ${descripcion} NOTA: ${nota2}`;
}
function mostrarAlumnosPracticos() {
    $('#camposAlumnos').children().remove();
    let nro = 1;
    listaAlumnos.forEach( alumnos => {
        const { id ,codalu, nombre, pdf, hora, fecha, editable, estado, nota,observacion } = alumnos;
        if (estado === '1') {
            if (editable === '1') {
                $('#camposAlumnos').append(`<tr>
                    <td data-label="Nro">${nro}</td>
                    <td class="nombreAlumno" data-label="Alumno">${nombre}</td>
                    <td data-label="Pdf">
                        <a href="${pdf}" target="_blank">
                            <img src="images/pdf.png" height="50px">
                        </a>
                    </td>
                    <td data-label="Habilitar Edición">
                        <input type="checkbox" checked onchange="habilitacionEdicion(this, ${id})">   
                    </td>
                    <td data-label="Nota">
                        <div style="display:flex; align-items:center;">
                            <input id="${id}" type="number" style="width:70px; margin-right:5px;" value="${nota}">
                            <button onclick="guardarNotaAlumno(${id})" style="background-color:teal; padding:5px; color:white; border-radius:5px;">Grabar</button>
                        </div>
                    </td>
                    <td data-label="Fecha">${fecha}</td>
                    <td data-label="Hora">${hora}</td>
                    <td data-label="Observación"><div style="display:flex; align-items:center;"><textarea id="obs${id}" type="text" style="width:250px; margin-right:5px;padding:5px;height:80px;resize:none;" >${observacion}</textarea></div></td>
                </tr>`);    
                nro++;    
            } else {
                $('#camposAlumnos').append(`<tr>
                    <td data-label="Nro">${nro}</td>
                    <td class="nombreAlumno" data-label="Alumno">${nombre}</td>
                    <td data-label="Pdf">
                        <a href="${pdf}" target="_blank">
                            <img src="images/pdf.png" height="50px">
                        </a>
                    </td>
                    <td data-label="Habilitar Edición">
                    <input type="checkbox" onchange="habilitacionEdicion(this, ${id})">
                    </td>
                    <td data-label="Nota">
                        <div style="display:flex; align-items:center;">
                            <input id="${id}" type="number" style="width:70px; margin-right:5px;" value="${nota}">
                            <button onclick="guardarNotaAlumno(${id})" style="background-color:teal; padding:5px; color:white; border-radius:5px;">Grabar</button>
                        </div>
                    </td>
                    <td data-label="Fecha">${fecha}</td>
                    <td data-label="Hora">${hora}</td>
                    <td data-label="Observación"><div style="display:flex; align-items:center;"><textarea id="obs${id}" type="text" style="width:250px; margin-right:5px;height:80px;padding:5px;resize:none;">${observacion}</textarea></div></td>
                </tr>`);    
                nro++;
            }
            
        } else {
            $('#camposAlumnos').append(`<tr>
                <td data-label="Nro">${nro}</td>
                <td class="nombreAlumno" data-label="Alumno">${nombre}</td>
                <td data-label="Pdf">&nbsp;</td>
                <td data-label="Habilitar Edición">&nbsp;</td>
                <td data-label="Nota">&nbsp;</td>
                <td data-label="Hora">&nbsp;</td>
                <td data-label="Fecha">&nbsp;</td>
                <td data-label="Observación">&nbsp;</td>
            </tr>`);
            nro++;
        }
    });

    $('.contenedor-table-general').css('display', 'none');
    $('.btn-nuevo').css('display', 'none');
    $('.contenedor-table-filtrada').css('display', 'block');

}

function habilitacionEdicion(html, id) {
    console.log(html.value);
    if(html.checked) {
        habilitarEdicionEstudiante(id);
    } else {
        desabilitarEdicionEstudiante(id);
    }
    console.log(id);
}
/* hpa
dpa */
function habilitarEdicionEstudiante(id) {
    var http = new XMLHttpRequest();
    var url = 'practicos_json.php?op=hpa';
    var formData = new FormData();
    formData.append('idpracticoPres', id);

    http.open('POST', url, false);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            if(http.responseText === 'ok') {
                Swal.fire(
                    'Éxito',
                    'Edición habilitada',
                    'success'
                )
            } else {
                Swal.fire('Error');
            }
        }
    }
    http.send(formData);
}
function desabilitarEdicionEstudiante(id) {
    var http = new XMLHttpRequest();
    var url = 'practicos_json.php?op=dpa';
    var formData = new FormData();
    formData.append('idpracticoPres', id);

    http.open('POST', url, false);
    http.onreadystatechange = function() {
        if(http.responseText === 'ok') {
            console.log('llegue aca');
            Swal.fire(
                'Éxito',
                'Edición deshabilitada',
                'success'
            )
        } else {
            Swal.fire('Error');
        }
    }
    http.send(formData);
}

function guardarNotaAlumno(id) {
    let nota_calificacion = $('#'+id).val();
    console.log('Alumno: '+nota_calificacion);
    console.log('Practico: '+nota_practico);

    if(parseInt(nota_calificacion)>parseInt(nota_practico)){
        Swal.fire('Nota Incorrecta.\n La nota debe ser menor o igual a la nota del práctico...!!!');
        return;
    }
    
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se registrará esta nota",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
          var http = new XMLHttpRequest();
          var url = 'practicos_json.php?op=califprac';
          var nota = document.getElementById(`${id}`).value;
          var observacion = document.getElementById(`obs${id}`).value;
          var formData = new FormData();
          formData.append('id', id);
          formData.append('observacion', observacion);  
          if (nota > 0 && nota <= 100) {
            formData.append('nota', nota);  
          } else {
            Swal.fire(
            'Error',
            'Ingrese una nota mayor a 0 y menor a 100',
            'error'
            );
            return false;
          }
          http.open('POST', url, false);
          http.onreadystatechange = function() {
              if(http.readyState == 4 && http.status == 200) {
                  if(http.responseText == 'ok') {
                    desabilitarEdicionEstudiante(id);
                    let checked = document.getElementById(`${id}`).parentElement.parentElement.parentElement.children[3].children[0].checked = false;
                    enviarMensaje(id,nota,observacion);
                    Swal.fire(
                      'Éxito nota registrada',
                      'Presione ok para salir',
                      'success'
                      );
                  } else {
                    Swal.fire(
                      'Error',
                      'Ingrese una nota mayor a 0 y menor a 100',
                      'error'
                    );
                  }
              }
          }
          http.send(formData);
        }    
    });  
}

function enviarMensaje(id,notaAl,obsAl){
   let presentacion = obtenerEstudiante(id);
   let codalu = presentacion.codalu;
   let nombre = presentacion.nombre;
   let mensajeAlumno = `Práctico nro.: ${nro_practico} - Nota: ${notaAl}/${nota_practico} - Materia: ${nombre_materia} - Obs.: ${obsAl}`;
   let mensajeTutor = `Práctico nro.: ${nro_practico} - Nota: ${notaAl}/${nota_practico} - Alumno: ${nombre} - Materia: ${nombre_materia} - Curso: ${nombre_curso} - Obs.: ${obsAl}`;
   lista_celulares.forEach(
    (alumno)=>{
        if(alumno.codalu == codalu && alumno.celular!=""){
            $.get(
                "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensajeTutor+"&phone=591"+alumno.celular
                );
        }
    }
   );
   $.post(
        'data_agenda.php?op=alumno_celular',
        {codalu:codalu},
        (nroCelular)=>{
            if(nroCelular!=""){
                $.get(
                "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensajeAlumno+"&phone=591"+nroCelular
                );
            }
        }
        );
        
            var m = document.getElementById("seleccionar_materia");
            var materia = m.options[m.selectedIndex].value;    

            var c_recibe = id;
            var emite = $('#id_usr').val();
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
function obtenerNombreEstudiante(id){
    for (var i = 0; i < listaAlumnos.length; i++) {
        if(listaAlumnos[i].codalu==id)return listaAlumnos[i].nombre;
    }
    return "";
}
function enviarMensaje2(id,notaAl,obsAl){
   let nombre = obtenerNombreEstudiante(id);
   let codalu = id;
   let mensajeAlumno = `Práctico nro.: ${nro_practico} - Nota: ${notaAl}/${nota_practico} - Materia: ${nombre_materia} - Obs.: ${obsAl}`;
   let mensajeTutor = `Práctico nro.: ${nro_practico} - Nota: ${notaAl}/${nota_practico} - Alumno: ${nombre} - Materia: ${nombre_materia} - Curso: ${nombre_curso} - Obs.: ${obsAl}`;
   lista_celulares.forEach(
    (alumno)=>{
        if(alumno.codalu == codalu && alumno.celular!=""){
            $.get(
                "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensajeTutor+"&phone=591"+alumno.celular
                );
        }
    }
   );
   $.post(
        'data_agenda.php?op=alumno_celular',
        {codalu:codalu},
        (nroCelular)=>{
            if(nroCelular!=""){
                $.get(
                "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensajeAlumno+"&phone=591"+nroCelular
                );
            }
        }
        );
        
            var m = document.getElementById("seleccionar_materia");
            var materia = m.options[m.selectedIndex].value;    

            var c_recibe = id;
            var emite = $('#id_usr').val();
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

function obtenerEstudiante(id){
    for (var i = 0; i < listaAlumnos.length; i++) {
        if(listaAlumnos[i].id==id)return listaAlumnos[i];
    }
    return [];
}



$.post("obtener_curso_json.php?op=cp",function(respuesta){
    var jsonDataCursos = JSON.parse(respuesta);
    if (jsonDataCursos['status'] == 'ok') {
        listaCursos = jsonDataCursos['cursos'];
        for (let i = 0; i < listaCursos.length; i++) {
            var cursos = listaCursos[i]['nombre']; 
            $("#seleccionar_curso").append('<option value ="'+ (i+1) +'">' + cursos + '</option>');
        }
    }
    if(respuesta=='eSession') {
      alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
      return false;
    }
});

  

$.post("obtener_materias_json.php?op=getmatprof",function(respuesta){
    var jsonDataMaterias = JSON.parse(respuesta);
        if (jsonDataMaterias['status'] == 'ok') {
            listaMaterias = jsonDataMaterias['materias'];
    }
    if(respuesta=='eSession') {
        alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
        return false;
    }
});

function pedirPracticos() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function (aEvt) {
    if (req.readyState == 4) {
        if(req.status == 200) {
            var jsonData = JSON.parse(req.responseText);
            if( jsonData['status'] == 'ok') {
                listaPracticos = jsonData['practicos'];
                listaPreguntasPracticos = jsonData['preguntas'];
            } else if(jsonData['status'] == 'noPracticos'){
                listaPracticos = [];
                listaPreguntasPracticos = [];
            }
        } else {
            alert('Error en la peticion');
        }
      }

    };

    req.open('POST', 'practicos_json.php?op=gppadjunto', false);

    req.send();

}
function getAlumnos(curso, paralelo) {
    let codigoCurso = curso;
    let codigoParalelo = paralelo;
	$.post('data_agenda.php?op=alumnos', {
              "cod_curso": codigoCurso,
              "cod_par": codigoParalelo
            },function(data) {
                if(data=='eSession') {
                    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  				return false;
                }else{
					listaAlumnos = data;
				}
				
               
          });
}
function cargarLista()
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
				let fecha = $('#fecha').val();
				let hora = $('#hora').val();
			//	getmsgallclass("NUEVO práctico, presentar hasta: "+fecha+' - '+hora);
				let descrip = $('#descripcion_practico').val();
				getmsgallclass("Práctico, presentar hasta: "+fecha+' - '+hora+' Desc.:'+descrip);

			}
			});
}
function obtenerCelulares(){
						//alert('Hola 2');

    $.post(
            "data_agenda.php?op=obtener_tutores_cel",
            {codcur:curso,codpar:paralelo},
            (datos,estado,xhr)=>{
				
                let status = datos.status;
				
                if(status=="ok"){
                    lista_celulares = datos.lista;
					//alert('Hola '+lista_celulares[0].celular);
					
					console.log('Hola 2: '+lista_celulares);
                    return;
                }
            },
            'json'
        );
    
}
function obtenerNombreMateria(){
	let codmat = $('#seleccionar_materia').val();
	for(let i = 0; listaMaterias.length; i++){
		if(listaMaterias[i].codmat==codmat){
			nombre_materia = listaMaterias[i].nombre;
			return;
		}

	}
}

$(document).ready(function() {

    var element;

    element = document.getElementsByName('file1');

    let archivoAgregados = document.querySelectorAll('.preguntas .pregunta input[type="file"]');

    for (var i = 0; i < element.length; i++) {

        var name =  element[i].id = `file${i+1}`;

    }

    pedirPracticos();

    $('.practico-nuevo').css("display", "none");

    $('#seleccionar_curso').change( function() {
        $('.contenedor-table-filtrada').css("display", "none");
        $('.contenedor-table-general').css("display", "none");

        if( $('#seleccionar_curso').val() != 0 ) {

            var index = $('#seleccionar_curso').val();
        //    console.log('index: '+index);
            curso = listaCursos[index-1]['codcur'];
        //    console.log('curso: '+curso);
 
            nombre_curso = listaCursos[index-1]['nombre'];
        //    console.log('curso: '+nombre_curso);

            paralelo = listaCursos[index-1]['codpar'];
        //    console.log('paralelo: '+paralelo);
            
			obtenerCelulares();
			
            obtenerMaterias(curso, paralelo);
			
			

        } else {

            $('#seleccionar_materia').html('<option value="0">-- Seleccionar materia --</option>')

            $('.contenedor-table-general').css("display", "none");

        }

    });

    $('#seleccionar_materia').change( function() {
        $('.practico-nuevo').css("display", "none"); 
        $('.contenedor-table-filtrada').css("display", "none");
        $('.btn-nuevo').css("display", "block");
        if( $('#seleccionar_materia').val() != 0 ) {
            let materia = $('#seleccionar_materia').val();
            verPracticos(curso, paralelo, materia);
			if( $("#slccurso").val() != 0 ) {
    							       getAlumnos(curso, paralelo);
										obtenerNombreMateria();
  							       
							       }
        } else {
            $('.contenedor-table-general').css("display", "none");
        }
    });

});

