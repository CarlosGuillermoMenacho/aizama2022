var dominio = 'https://www.aizama.net';
var cod1;
var nom1;

var presen1 ;
var descrip1;

var materias = [];

var practicos = [];

var cod_mat;
var materiaSeleccionada = '';
var tester="";
var sendCodpract = "";

var lista_celulares = [];


function cargarMaterias() {
  $('.lista-materias').children().remove();
  $('.contenedor-lista').addClass('active');
      for(var i=0; i< materias.length; i++) {
        var codigoMateria = materias[i]['codmat']; 
        var nombreMateria = materias[i]['nombre']; 
        var practicosMateria = materias[i]['practicos']; 
        var imagenMateria = materias[i]['img']; 

        $('.lista-materias').append(
            `<li>
                <button id="${codigoMateria}" class="info-materia" onclick="mostrarTablaCuestionarios(\'${codigoMateria}'\)">
                    <div class="materia">

                        <img src="${imagenMateria}" >

                        <p>${nombreMateria}</p>

                    </div>

                    <span class="badge">${practicosMateria}</span>
                </button>
            </li>`

        );

      }

}



function obtenerPracticos() {
  var peticion =new XMLHttpRequest();
  peticion.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
          var respuesta = this.responseText;
          var jsonData = JSON.parse(respuesta);
          if ( jsonData['status'] == 'ok') {
              materias = jsonData['materias'];
              practicos = jsonData['practicos'];
          } else if (jsonData['status'] == 'noMaterias') {
              $('.boton-atras').remove();
              $('.contenedor-no-classe').addClass('active');    
          } else if (jsonData['status'] == 'noPermitido') {
              alert('Esta permitido solo para los alumnos')
          } 
      }
  }
  peticion.open('POST', 'practicos_json.php?op=getPracticos', false);
  peticion.send();
}



function subirPractico( codigoPractico, tipo ) {
  let codalumno = $('#codalumno').val();
  let formData = new FormData(document.forms.namedItem("fileinfo"));
    nom1 =    $('#id_nombre').val();
  //  ape1 =    $('#id_apellido').val();
    //alert ('subirPractico - Alumno: '+nom1+' '+ape1);
    console.log('subirPractico Alumno: '+nom1);
 	obtenerCelularTutor(codalumno);
 
  //formData.append('idpractico', codigoPractico);
  /*
  tipo 1 : archivo Pdf
  tipo 2 : enlace
  */
  //if ( tipo === 1 ) { 
   // let archivoPdf = document.getElementById('arch');
    //console.log(archivoPdf);
   // if(archivoPdf[0].size>10485760){
  //    let peso =  (archivoPdf[0].size/(1024*1024)).toFixed(1);

  //    Swal.fire('Aviso',`El documento que desea subir tiene un peso de ${peso} MB, para subir debe tener un peso menor a 10 MB...!!!`,'warning');
  //    return;
  //  }
  //} /*else {

  //  let archivoPdf = document.getElementById(`enlace${codigoPractico}`).value;
   // formData.append('file', archivoPdf );
  //}*/
  //formData.append('tipo', tipo.toString());
  /*var object = {};
    formData.forEach(function(value, key){
    object[key] = value;
  });
  var json = JSON.stringify(object);*/
  
  //const url = 'practicos_json.php?op=sp'
  Swal.queue([{
    title: '¿Estás seguro?',
    confirmButtonText: 'Si',
    cancelButtonText: 'No',
    showCancelButton: true,
    text:'Se subira el practico',
    showLoaderOnConfirm: true,
    preConfirm: () => {
      document.querySelector('.swal2-styled.swal2-cancel').style.display ="none";
      return $.ajax({
          url:'practicos_json.php?op=sp',
          type:'POST',
          data:formData,
          processData:false,
          contentType:false,
          success: function(result){
            resultRequest(result,codalumno);
          }
        })
      /*
      return fetch(url, {
        method: 'POST',
        body: formData

      }) 
      .then(response => response.text())
      .then(data =>  {
        $.ajax({url:"tester.php",type:"POST",data:codalumno+" Ha recibido respuesta: "+data+"\n"});
        if (IsValidJSONString(data)) {
          let resp = JSON.parse(data);
          if (resp['status']=='eSession') {
            Swal.fire('Aviso',"La sesión ha finalizado...!!!",'warning');
            $.ajax({url:"tester.php",type:"POST",data:codalumno+" La sesion ha finalizado\n"});
            location.href="usuario.php";
            return;
          }
        }
        switch (data) {
          case 'ok':
            $.ajax({url:"tester.php",type:"POST",data:codalumno+" OK\n"});
            obtenerPracticos();
            mostrarTablaCuestionarios(cod_mat);                    
            Swal.fire(
              'Archivo subido',
              'Presione ok para salir',
              'success'
            );  
            break;
          case 'errorFile':
            $.ajax({url:"tester.php",type:"POST",data:codalumno+" ErrorFile\n"});
            Swal.fire('Solo se admiten pdf');
            break;
          case 'errorLimite':
          $.ajax({url:"tester.php",type:"POST",data:codalumno+" ErrorLimite\n"});
            Swal.fire('Error', 'El plazo para presentar este práctico ha finalizado', 'error');
            break;
          case 'noEdit':
          $.ajax({url:"tester.php",type:"POST",data:codalumno+" No editable\n"});
            Swal.fire(
              'Aviso',
              'No se puede editar este practico, porqué ya fue calificado',
              'warning'
            );
            break;
          case 'errorSize':
          $.ajax({url:"tester.php",type:"POST",data:codalumno+" Error Size\n"});
            Swal.fire('Aviso', 'El documento debe tener un peso menor a 10 MB...!!!', 'warning');
            break;
          case 'errorEnlace':
          $.ajax({url:"tester.php",type:"POST",data:codalumno+" Error Enlace\n"});
            Swal.fire('Ingrese un enlace valido');
            break;
          default:
            $.ajax({url:"tester.php",type:"POST",data:codalumno+" "+data+"\n"});
            Swal.fire('Error');
            break;
        }
      })
      .catch((error) => {
        $.ajax({url:"tester.php",type:"POST",data:codalumno+" Hubo un error: "+error+"\n"});
        Swal.insertQueueStep({
          icon: 'error',
          title: 'No se puedo subir el practico'
        });
      });*/
    }
  }]);
      
}
function enviarArchivo(){
  location.href = "practicopdf.php?cp="+sendCodpract;
  return;
}

function resultRequest(result,codalumno){
    cod1 =    $('#id_usr').val();
    presen1 = $('#presentacion_practico').val();
	descrip1 = $('#descripcion_practico').val();
    console.log($('#presentacion_practico').val());
    console.log($('#descripcion_practico').val());
//	cargarLista(); 

//    console.log(cod1);
//    alert (cod1);

  if (IsValidJSONString(result)) {
              let resp = JSON.parse(result);
              if (resp['status']=='eSession') {
                Swal.fire('Aviso',"La sesión ha finalizado...!!!",'warning');
                location.href="usuario.php";
                return;
              }
            }
            switch (result) {
              case 'ok':
				cargarLista();            

                obtenerPracticos();
                mostrarTablaCuestionarios(cod_mat);                    
                Swal.fire(
                  'Archivo subido',
                  'Presione ok para salir',
                  'success'
                );  
                break;
              case 'errorFile':
                Swal.fire('Solo se admiten pdf');
                break;
              case 'errorLimite':
                Swal.fire('Error', 'El plazo para presentar este práctico ha finalizado', 'error');
                break;
              case 'noEdit':
                Swal.fire(
                  'Aviso',
                  'No se puede editar este practico, porqué ya fue calificado',
                  'warning'
                );
                break;
              case 'errorSize':
                Swal.fire('Aviso', 'El documento debe tener un peso menor a 10 MB...!!!', 'warning');
                break;
              case 'errorEnlace':
                Swal.fire('Ingrese un enlace valido');
                break;
              default:
                Swal.fire('Error');
                break;
            }
}


function obtenerNombreMateria(){
    for(let i = 0 ; i < materias.length; i++){
        if(materias[i].codmat==cod_mat){
            return materias[i].nombre;
        }
    }
    return "";
}
function cargarLista()
{
    //alert ('cargarLista - Alumno: '+nom1+' '+ape1);
//	getmsgallclass("PRACTICO PRESENTADO Desc.:"+descrip1+' - Fecha de presentacion:'+presen1);
	getmsgallclass('Alumno: '+nom1+' - PRESENTO SU PRACTICO - Desc.: '+descrip1+' - Fecha de presentacion: '+presen1);
}
function obtenerCelularTutor(alucod){
					//	alert('Hola 2 - Cod alumno: '+alucod);

    $.post(
            "data_agenda.php?op=obtener_cel_tutor",
            {codpar:alucod},
            (datos,estado,xhr)=>{
				
                let status = datos.status;
				
                if(status=="ok"){
                    lista_celulares = datos.lista;
				//	alert('Hola 3 - Celular : '+lista_celulares[0].celular);
					
				//	console.log(lista_celulares);
                    return;
                }
            },
            'json'
        );
    
}
function obtenerContactos (codalu){
    let lista20= [];
   	console.log(codalu);

//	console.log(lista_celulares);
    lista_celulares.forEach((celular)=>{
            lista20.push(celular.celular);
    });
    return lista20;
}
function getmsgalu2(id,msg){
    var materia = obtenerNombreMateria();    
    var c_recibe = id;
    var emite = 'adm';
    var msgr = msg;

    console.log('paso 5');
    
	nuevo_msg='Materia: '+materia+' - '+msg;
	let contactos = obtenerContactos(id);

//	console.log(lista_celulares);

	console.log(contactos);
	console.log(materia);
	
	contactos.forEach((contacto)=>{
    $.get(
        "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto
        );
    
	});

    //    "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto

	$.ajax({
        method: "POST",
        url: `${dominio}/agenda/mensajeIngreso`,
        data: JSON.stringify({ codEst: c_recibe, codEmit: emite,msg:msgr,nombre:materia}),
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

		    getmsgalu2(cod1,msg);
		  	alert('Mensaje enviado a la Agenda Digital del tutor');	
		  	return true;
}




function IsValidJSONString(str) {
try {
JSON. parse(str);
} catch (e) {
return false;
}
return true;
}
function mostrarTablaCuestionarios(codigoMateria) {
  cod_mat = codigoMateria;
  $('#campos').children().remove();    
  $('.contenedor-lista').removeClass('active');

  $('.elija').text("elija una un práctico");  

  var codMat = codigoMateria;
  var cantidad_clase = cantidadClases(codigoMateria);
  if(cantidad_clase > 0) {

      var emnumeracion = 1;
      $('.contenedor-tabla-button').addClass('active');

      for(var i=0; i<practicos.length; i++) {
        if( practicos[i]['codmat'] == codigoMateria ) {
            var codigoPractico = practicos[i]['id'].toString();
            var descripcion = practicos[i]['descripcion']; 
            var presentado = practicos[i]['presentado'];
            var nota = practicos[i]['nota'];
            var editable = practicos[i]['editable'];
            var fechaLimite = practicos[i]['fechalimite'];
            var fechaRegistro = practicos[i]['fechareg']==""?"&nbsp;":practicos[i]['fechareg'];
            var archivo = practicos[i]['pdf'];
            var observacion = practicos[i]['observacion']==""?"&nbsp;":practicos[i]['observacion'];
            let fechaPresentacion = practicos[i].fechaPresentacion;
            switch(presentado) {
                case '1':
                if ( editable == '1') {
                    $('#campos').append(
                      `<tr>
                        <td data-label="Nro" >${emnumeracion}</td>
                        <td data-label="Descripción" class="descripcion-practico" >${descripcion}</td>
                        <td data-label="Ver" >
                          <button class="link" style="width:50px" onclick="verPractico(${codigoPractico})">
                              <img src="images/ver.svg" >
                          <button/>
                        </td>

                        <td data-label="Subir">
                          <button onclick="mostrarSubirPractico(${codigoPractico})">
                            <img style="cursor:pointer;" src="images/icon_subirArchivo.svg" height="50px">
                          </button>
                          
                        </td>

                        <td data-label="Nota">${nota}</td>
                        <td data-label="Fecha de registro">${fechaRegistro}</td>
                        <td data-label="Fecha límite de presentación">${fechaLimite}</td>
                        <td data-label="Práctico presentado">
                          <a href="${archivo}" target="_blank">
                            <img src="images/icon_document.svg" alt="icono" height="50px">
                          </a>  
                        </td>
                        <td data-label="Práctico presentado en fecha">${fechaPresentacion}</td>
                        <td data-label="Observación">${observacion}</td>
                      </tr>`
                    );
                  } else {
                    let __arc = "";
                    if(archivo!="#"){
                        __arc = `<a href="${archivo}" target="_blank">
                                    <img src="images/icon_document.svg" alt="icono" height="50px">
                                 </a> `;
                    }else{
                        __arc = "Presentado en Clases";
                    }
                    $('#campos').append(
                      `<tr>
                        <td data-label="Nro" >${emnumeracion}</td>
                        <td data-label="Descripción" class="descripcion-practico" >${descripcion}</td>
                        <td data-label="Ver" >
                          <button class="link" style="width:50px" onclick="verPractico(${codigoPractico})">
                              <img src="images/ver.svg" height="50px">
                          <button/>
                        </td>
                        <td data-label="Subir">Presentado</td>
                        <td data-label="Nota">${nota}</td>
                        <td data-label="Fecha de registro">${fechaRegistro}</td>
                        <td data-label="Presentación">${fechaLimite}</td>
                        <td data-label="Práctico presentado">
                          ${__arc}  
                        </td>
                        <td data-label="Práctico presentado en fecha">${fechaPresentacion}</td>
                        <td data-label="observación">${observacion}</td>
                      </tr>`
                    );
                  }     
                  emnumeracion++;
                  break;
                case '0':
                    $('#campos').append(
                        `<tr>
                          <td data-label="Nro" >${emnumeracion}</td>
                          <td data-label="Descripción" class="descripcion-practico">${descripcion}</td>
                          <td data-label="Ver" >
                            <button class="link" style="width:50px" onclick="verPractico(${codigoPractico})">
                                <img src="images/ver.svg" height="50px">
                            <button/>
                          </td>
                          <td data-label="Subir">
                            <button onclick="mostrarSubirPractico(${codigoPractico})">
                              <img style="cursor:pointer;" src="images/icon_subirArchivo.svg" height="50px">
                            </button>
                          </td>
                          <td data-label="Nota">&nbsp;</td>
                          <td data-label="Fecha de registro">${fechaRegistro}</td>
                          <td data-label="Presentación">${fechaLimite}</td>
                          <td data-label="Práctico presentado">&nbsp;</td>
                          <td data-label="Práctico presentado en fecha">&nbsp;</td>
                          <td data-label="observación">&nbsp;</td>
                        </tr>`

                    );
                    emnumeracion++;
                    break;
            }
        }
    } 

  } else {
    $('.contenedor-no-classe').addClass('active');
  }
  $('.contenedor-table').css("display", "flex");
  $('.subir-practicos').css("display", "none");
  $('.titulos').css("display", "block");
}

function mostrarSubirPractico(codPractico) {
    $('#mostrarEnlace').css('display', 'block');
    $('#mostrarArchivo').css('display', 'block');
    $('.cargarArchivoPdf').css('display', 'none');
    $('.cargarEnlace').css('display', 'none');
    sendCodpract = codPractico;
  $('#codigoPractico').val(codPractico);
  $('.titulos').css("display", "none");

  /* Asignando id a los tipos de archivos */
  $('.cargarEnlace input').attr('id', `enlace${codPractico}`)
  $('.cargarArchivoPdf input').attr('id', `archivo${codPractico}`);

  /* Para sacar el nombre de la materia */
  let nombreMateria;
  materias.forEach( materia => {
    const { codmat, nombre } = materia;
    if( codmat == cod_mat ) {
      nombreMateria = nombre;
    }
  });

  /* Para sacar informacion del practico */
  let descripcionPractico;
  let presentacionPractico;
  let presentadoPractico;
  let archivoPresentado;
  practicos.forEach( practico =>  {
    const { id, descripcion, fechalimite, presentado, pdf } = practico;
    if( id  == codPractico.toString()) {
      descripcionPractico = descripcion;
      presentacionPractico = fechalimite;
      presentadoPractico = presentado;
      archivoPresentado = pdf;
    }
  });

  if ( presentadoPractico == '1') {
    $('.practico-subido').css("display", "block");
    $('.archivo_pdf h3').html('¿Quieres cambiarlo? Elige un nuevo archivo');  
    $('.practico-subido a').attr("href", archivoPresentado);
  } else {
    $('.archivo_pdf h3').html('Elige un nuevo archivo');
    $('.practico-subido').css("display", "none");
  }
  
  /* Asignando Informacion */
  $('.nombre_materia').text(nombreMateria);
  $('#descripcion_practico').val(descripcionPractico);
  $('#presentacion_practico').val(presentacionPractico);

  /* Mostrando tablas */
  $('.contenedor-table').css("display", "none");
  $('.subir-practicos').css("display", "block");

}

function guardarTipoArchivo() {
  let tipo;
  if ( $('.cargarEnlace input').val() == '' && $('.cargarArchivoPdf input').val() == ''  ) {
    Swal.fire('Por favor elija un archivo o un enlace');
    return;
  } else {
        if ( $('.cargarArchivoPdf input').val() != '' ) {
          tipo = 1;
    
        } else {
          tipo = 2;
    
        }
        subirPractico( $('#codigoPractico').val(), tipo); 
    }

  
}

function verPractico(codigoPractico) {   
  $('.contenedor-table-practicos').css("display", "block");
  $('.contenedor-table').css("display", "none");
  $('#camposPreguntas').children().remove();

  for(var i=0; i<practicos.length; i++) {
    if(practicos[i]['id'] == codigoPractico.toString() ) {
      var preguntas = practicos[i]['preguntas']
      for(var j=0; j<preguntas.length; j++) {
        var pregunta = preguntas[j]['pregunta'];
        var enlance = preguntas[j]['enlace'];
        var extension = preguntas[j]['extension'];

        switch(extension) {
            case'png':
            case'jpg':
            case'jpeg':
            case'JPG':
            case 'JPEG':

                $('#camposPreguntas').append(

                        `<tr>

                          <td data-label="Nro" >${(j+1)}</td>

                          <td data-label="Pregunta" >${pregunta}</td>

                          <td data-label="Ver" >

                            <a href="${enlance}" class="link" target="_blank">

                                <img src="images/icono_img.svg">

                            <a/>

                          </td>

                        </tr> `

                );

                break;

            case 'doc':
            case 'docx':

                 $('#camposPreguntas').append(
                  `<tr>
                    <td data-label="Nro" >${(j+1)}</td>
                    <td data-label="Pregunta" >${pregunta}</td>
                    <td data-label="Ver" >
                      <a href="${enlance}" class="link" target="_blank">
                        <img src="images/icono-docx.png">
                      <a/>
                    </td>
                  </tr> `
                );

                break;
            case 'xls':
            case 'xlsx':

                 $('#camposPreguntas').append(

                        `<tr>

                          <td data-label="Nro" >${(j+1)}</td>

                          <td data-label="Pregunta" >${pregunta}</td>

                          <td data-label="Ver" >

                            <a href="${enlance}" class="link" target="_blank">

                                <img src="images/excel.png">

                            <a/>

                          </td>

                        </tr> `

                );

                break;

            case 'ppt':
            case 'pptx':
                 $('#camposPreguntas').append(
                        `<tr>

                          <td data-label="Nro" >${(j+1)}</td>

                          <td data-label="Pregunta" >${pregunta}</td>

                          <td data-label="Ver" >

                            <a href="${enlance}" class="link" target="_blank">

                                <img src="images/point.png">

                            <a/>

                          </td>

                        </tr> `

                );

                break;

            case 'pdf':

                 $('#camposPreguntas').append(

                        `<tr>

                          <td data-label="Nro" >${(j+1)}</td>

                          <td data-label="Pregunta" >${pregunta}</td>

                          <td data-label="Ver" >

                            <a href="${enlance}" class="link" target="_blank">

                                <img src="images/pdf.png">

                            <a/>

                          </td>

                        </tr> `

                );

                break;

            default:

                $('#camposPreguntas').append(

                        `<tr>

                          <td data-label="Nro" >${(j+1)}</td>

                          <td data-label="Pregunta" >${pregunta}</td>

                          <td data-label="Ver" >

                            No hay material

                          </td>

                        </tr> `

                );

                break;        

        }

      }

    }

  }

}



function cantidadClases(codigoMateria) {
  for(var i=0; i<materias.length; i++) {
    if(materias[i]['codmat'] == codigoMateria) {
      return materias[i]['practicos'];
    }
  }
  return 0;
}



function volverAtras() {
  obtenerPracticos();
  cargarMaterias();
  $('.elija').text("elija una materia");
  $('.contenedor-tabla-button').removeClass('active');
  $('.contenedor-lista').addClass('active');
  $('.contenedor-no-classe').removeClass('active');

}

function volverAtrasPractico() {
  $('.contenedor-table-practicos').css("display", "none");
  $('.contenedor-table').css("display", "flex");
}

$( document ).ready(function(e) {
    
  obtenerPracticos();
  cargarMaterias();
  $('#volverTablaPractico').click( function() {
    obtenerPracticos();
    mostrarTablaCuestionarios(cod_mat);
    $('.contenedor-table').css("display", "flex");
    $('.subir-practicos').css("display", "none");
    $('.titulos').css("display", "block");
    $('#mostrarEnlace').css('display', 'none');
    $('#mostrarArchivo').css('display', 'none');
  });
});
