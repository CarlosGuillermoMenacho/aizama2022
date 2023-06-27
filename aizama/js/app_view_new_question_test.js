let preguntas_al_alumno;
let nro_exa;
let mensajeEnviado = false;
let curso;
let paralelo;
let nombre_materia;
let nombre_curso;
function getParameterByName(name) {

    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),

    results = regex.exec(location.search);

    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

}



function iraworksheet(codeva,codcur,codmat,codpar){
	location.href = "liveworksheep.php?ce="+codeva+"&cc="+codcur+"&cm="+codmat+"&cp="+codpar;
	return;
}	

function guardar(){
//    	  alert('paso 1');
    
	var formData = new FormData($("#fGrabar")[0]);
//	var sw=getParameterByName('sw1');
	var sw=nro_exa;
	var sw1=getParameterByName('sw2');
	var sw2=getParameterByName('sw3');
	var codpar=$('#codpar').val();
	let fechaIni = $('#fechaini').val()+' '+$('#horaini').val();
	let fechaFin = $('#fechafin').val()+' '+$('#horafin').val();
	let descripcion = $('#descrip').val();
	
//	return;
	formData.append("totPreg",preguntas_al_alumno);
    var html=$.ajax({url:"save_new_question_test.php?sw1="+sw+"&sw2="+sw1+"&sw3="+sw2+"&codpar="+codpar,type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
	console.log(html);
//    	  alert('paso 2');

    if(html=='eNoResults'){
    	  alert('No EXISTE EL CODIGO EN EL PADRON');
    	$('#vf_recinto').focus();
    	  return false;
    }
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  location.href = 'docentes.php';
	  return false;
	}
	if(html=='errorFecha'){
	  alert('Las fechas y horas no son correctas...!!!');
	  return false;
	}
	if(html=='eGrabado')
	{
        //alert('ya 3');
      enviarMensajes(fechaIni,fechaFin,descripcion);
	  return true;
	}
	if(html=='eEnviarWhatsApp')
	{
		
		
		
		
	    return true;
	}
}
function enviarMensajes(inicio,fin,descrip){
    if(!mensajeEnviado){
        let codprof = $('#codprof').val();
        $.get(
            "fechaCompleta.php",
            fecha =>{
                let nuevo_msg = `${fecha} - Curso: ${nombre_curso} - Materia: ${nombre_materia} - Evaluación de seleción múltiple de ${preguntas_al_alumno} preguntas. - Disponible en Fechas inicio: ${inicio}, fin: ${fin} - Descripción: ${descrip}`;
                $.post(
                    "data_agenda.php?op=obtener_tutores_cel",
                    {codcur:curso,codpar:paralelo},
                    (datos,estado,xhr)=>{
        				
                        let status = datos.status;
        				
                        if(status=="ok"){
                            lista_celulares = datos.lista;
                            lista_celulares.forEach(contacto=>{
                                if(contacto.celular!=""){
                                    if (contacto.celular.includes('+')){
                                        contacto.celular=contacto.celular.slice(1);
                                        $.get(
                                	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone="+contacto.celular
                                	   );
                                    }
                                    else{

                                        $.get(
                    	                        "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto.celular
                    	                );
                                    }
                                }
                            });
                            mensajeEnviado=true;
        					//alert('Hola '+lista_celulares[0].celular);
        					
        					
                            return;
                        }
                    },
                    'json'
                );
            },
            "text"
            );
        
    }
}
function validar_opcion(e)

{

	if (parseInt(e) > 0 && parseInt(e) <= 3)

	{

		return true;

	}

	else

	{

		alert('El valor de la opcion es invalido (el valor es entre 1 y 3)')

		return false;	

	}

}

function validar_tiempo(e)
{
	if (parseInt(e) > 0 && parseInt(e) <= 30)
	{
		return true;
	}
	else
	{
		alert('El valor del tiempo NO es valido (el tiempo es entre 1 y 30 minutos)')
		return false;	
	}
}

function verificarImg()

{

	 var alto=document.getElementById('imagenmuestra').width;

	  var ancho=document.getElementById('imagenmuestra').height;

	 if(alto > 500 || ancho > 500){

		 $('#imagenmuestra').hide();

		 $('#imagen').val("");

		 alert("La dimension de la imagen no es correcta. Debe ser menor a: 500x500 pixels");
		 $('#imagen').focus();
		 return false;

				   }else{return true;}	 	

}
function validardetalle(){
	let descrip = $('#descrip').val();
	let fechaini = $('#fechaini').val();
	let horaini = $('#horaini').val();
	let fechafin = $('#fechafin').val();
	let horafin = $('#horafin').val();
	let pregunta = $('#pregunta').val();
	let op1 = $('#op1').val();
	let op2 = $('#op2').val();
	let op3 = $('#op3').val();
	if(descrip!=""&&fechaini!=""&&fechafin!=""&&horaini!=""&&horafin!=""&&pregunta!=""&&op1!=""&&op2!=""&&op3!=""){
		return true;
	}
	alert('Debe llenar todos los campos...!!!');
	if (descrip=="") {$('#descrip').focus();return false;}
	if (fechaini=="") {$('#fechaini').focus();return false;}
	if (horaini=="") {$('#horaini').focus();return false;}
	if (fechafin=="") {$('#fechafin').focus();return false;}
	if (horafin=="") {$('#horafin').focus();return false;}
	if (pregunta=="") {$('#pregunta').focus();return false;}
	if (op1=="") {$('#op1').focus();return false;}
	if (op2=="") {$('#op2').focus();return false;}
	if (op3=="") {$('#op3').focus();return false;}
	
}

function validar(){
	if(verificarImg()&&validar_opcion($('#resp').val())&&validar_tiempo($('#time').val())&&validardetalle()){
		if(guardar()){
			$('#td-top-preg').empty();
			if (preguntas_al_alumno==5) {
				$('#td-top-preg').append("<p>Preguntas al alumno: 5</p>");
			}else{
				$('#td-top-preg').append("<p>Preguntas al alumno: 10</p>");
			}
			alert('GRABADO CON EXITO');
			$('#pregunta').val("");
			$('#op1').val("");
			$('#op2').val("");
			$('#op3').val("");
			$('#resp').val("");
			$('#time').val("");
			$('#imagen').val("");
			$('#imagenmuestra').attr("src","");
			return true;
		}
				return false;
	}else{
		return false;
	}
}

  function fileOnload(e) {

      var result=e.target.result;

      $('#imagenmuestra').attr("src",result);

	  $('#imagenmuestra').show();

}

function addImage(e)

{

      var file = e.target.files[0];

      imageType = /image.*/; 

      if (!file.type.match(imageType))

       return;

      var reader = new FileReader();

      reader.onload = fileOnload;

      reader.readAsDataURL(file);

}

function init(){

	$('#imagenmuestra').hide();

}

init();

$(document).ready(function()
				  {
				  curso = $('#codcur').val();
				  paralelo = $('#codpar').val();
				  nombre_curso = document.getElementById('nombre_curso').value;
				  nombre_materia = document.getElementById('nombre_materia').value;
				  nro_exa = $('#codeva').val();
				  $('#btnCancelar').bind('click',function(){var sw=getParameterByName('sw1');var sw1=getParameterByName('sw2');location.href='regeval.php?sw1='+sw;});

				  $('#imagen').change(function(e){addImage(e);});

				  $('#btnGuardar').bind('click',function(){validar()});
				  $('#slc_preguntas').change(()=>preguntas_al_alumno = $('#slc_preguntas').val());
				  preguntas_al_alumno = $('#slc_preguntas').val();


				   })