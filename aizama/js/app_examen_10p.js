$contador=0;
let seconds = 0;
var timer;
let lista_celulares=[];
let alumno ;
function obtenerContactos (codalu){
    let lista2 = [];
    console.log(lista_celulares);
    lista_celulares.forEach((celular)=>{
        if(celular.codalu==codalu){
            lista2.push(celular.celular);
        }
        
    });
    return lista2;
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

function getAlu(e,param,c_curso,c_materia)
{
	c_materia = c_materia.toUpperCase();
	if(isKeyEnter(e))
	{
		getAlumnos(param,c_curso,c_materia);
		return true;
	}
}
function getResultados(e,param)
{
	if(isKeyEnter(e))
	{
		if(parseInt(param)!=param)  //ESTO VERIFICA QUE EL DATO SEA NUMERO
		{
			alert ('El dato introducido no es correcto');
			$('#vf_codigo').val('');
			$('#vf_codigo').focus();
			return false;
		}
		getCurso(param);
		return true;
	}
}

function grabar(id8,id9,id11,id12,id13,id14)
{
	var html=$.ajax({type:"GET",url:'grabar_eval_online_10p.php',data:{id1:id8,id2:id9,id3:id11,id4:id12,id5:id13,id6:id14},async:false}).responseText;

	if(html=='eNoResults'){
	  alert('No EXISTE EL CODIGO EN EL PADRON');
	  return false;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
	if(html=='eGrabado'){
//		alert('gol 4');
		$('#vf_n1').val('9');
		$('#vf_n5').val('FUERA DE TIEMPO');
	  return true;
	}
	if(html=='eCorrecto')
	{
//		alert('1');
		if(parseInt($('#vf_nota_final').val()) == 0)
		{
			$('#vf_nota_final').val(parseInt($('#vf_valor').val()));
			document.getElementById('nota').innerHTML = parseInt($('#vf_valor').val());
		}
		else
		{
			$suma=parseInt($('#vf_nota_final').val()) + parseInt($('#vf_valor').val());
			$('#vf_nota_final').val($suma);
			document.getElementById('nota').innerHTML = $suma;
		}
		$('#vf_nota').val(parseInt($('#vf_valor').val()));
		$('#vf_n5').val('CORRECTO');
		return true;
	}
	if(html=='eIncorrecto'){
	  $('#vf_n5').val('INCORRECTO');
	  return true;
	}
	//alert('gol 5');

}
function btnOpcion(val_resp)
{
	//alert('btnOpcion !!!');

	if (!(verificarGrabado())) // si no esta grabado que grabe
		{
			if(grabar($('#vf_codalu').val(),$('#vf_codpre').val(),val_resp,$('#vf_valor').val(),$('#vf_hora_inicio').val(),$('#vf_hora_fin').val()))
			{	
				if (parseInt($('#vf_n1').val()) == 9)
				{
					Swal.fire('Grabado FUERA DE TIEMPO !!!');
				}
				else
				{
					if ($('#vf_n5').val() == 'INCORRECTO')
					{
						Swal.fire('Grabado !!!  INCORRECTO  !!!');
					}
					else
					{
						Swal.fire('Grabado con exito !!!  CORRECTO  !!!');
					}
				}
				$('#btnSiguiente').focus();
				return true;
			}
			else
			{
				alert('NO Grabo  !!!');
				return false;
			}
		}
		else
		{
			Swal.fire('Esta respuesta ya esta grabada !!!');
			return true;
		}
}


function isKeyEnter(e)
{
	var evt=e?e:event;
	var key=window.Event?evt.which:evt.keyCode;
	if(key==13)  // presiono ENTER
	{
		if (!(verificarGrabado())) // si no esta grabado que grabe
		{
			if(grabar($('#vf_codalu').val(),$('#vf_codpre').val(),$('#vf_n1').val(),$('#vf_valor').val(),$('#vf_hora_inicio').val(),$('#vf_hora_fin').val()))
			{	
				if (parseInt($('#vf_n1').val()) == 9)
				{
					Swal.fire('Grabado FUERA DE TIEMPO !!!');
				}
				else
				{
					if ($('#vf_n5').val() == 'INCORRECTO')
					{
						Swal.fire('Grabado !!!  INCORRECTO  !!!');
					}
					else
					{
						Swal.fire('Grabado con exito !!!  CORRECTO  !!!');
					}
				}
				$('#btnSiguiente').focus();
				return true;
			}
			else
			{
				alert('NO Grabo  !!!');
				return false;
			}
		}
		else
		{
			Swal.fire('Esta respuesta ya esta grabada !!!');
			return true;
		}
	}
	else
	{
		return false;
	}
}

function clearInputs()
{
	$('#vf_catastro').val('');
	$('#vf_contrato').val('');
	$('#vf_nombre').val('');
	$('#vf_anterior').val('');
	$('#vf_actual').val('');
	$('#vf_promedio').val('');
	$('#vf_periodo').val('');
	$('#vf_nrocor').val('');
	$('#vf_medidor').val('');
	$('#vf_ubicacion').val('');
	$('#vf_clave').val('');
	$('#vf_desclave').val('');
	$('#vf_claveuso').val('');
	$('#vf_desclaveuso').val('');
	$('#vf_categoria').val('');
	$('#vf_descategoria').val('');
	$('#vf_grabados').val('');
}
function verificarGrabado()
{
//	codmate = codmate.toUpperCase();
	$codalu = parseInt($('#vf_codalu').val());
	$codpre = parseInt($('#vf_codpre').val());
//	alert('alumno: '+ $codalu +' pregunta: '+ $codpre);
  if (parseInt($codpre) == 0)
  {
	return true;  
  }
  else
  {
	var html=$.ajax({type:"GET",url:'get_grabado_preg_10p.php',data:{id1:$codalu,id2:$codpre},async:false}	).responseText;

	if(html=='eNoResults'){
	// EL ALUMNO NO TIENE REGISTRADA NINGUNA RESPUESTA
	  return false;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
		return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
	// EL ALUMNO YA TIENE REGISTRADA SU RESPUESTA
//	alert('oye 1');
	eval(html);
//	alert('oye 2');
	$('#vf_n1').val(resp);
	$('#btnSiguiente').focus();
    return true;
  }
}

function getDatosGrabados(id)
{
//		alert ('voy : ' + id);
	var html=$.ajax({type:"GET",url:'get_datos_eval_10p.php',data:{id:id},async:false}).responseText;

//	alert ('voy : 1');
	if(html=='eFin'){
	  alert('Examen Finalizado 1');
	  return false;
	}
//	alert ('voy : 2');
	if(html=='eNoResults'){
		// no esta grabada la respuesta
//	  alert('Fin de Archivo');
//	alert ('voy : 3');
//	$('#vf_hora_inicio').val(hora2);
//	alert ('voy : 4');
	  return true;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
//	clearInputs();
// la pregunta esta grabada
//	alert ('voy : grabao ' + id);
	eval(html);
	$('#vf_n1').val(resp);
	$('#vf_n5').val(nota);
	$('#vf_nota').val(nota);
	$('#vf_fecha').val(fecha);
	$('#vf_hora_inicio').val(hora_ini);
	$('#vf_hora_fin').val(hora_fin);
	$('#vf_nota_final').val(nota_final);
	document.getElementById('nota').innerHTML = nota_final;
	$('#vf_tiempo2').val(tiempo);
	if (parseInt($('#vf_n1').val()) == 9)
	{
		$('#vf_n5').val('FUERA DE TIEMPO');
	}
	else
	{
		if (parseInt($('#vf_n5').val()) == 0)
		{
			$('#vf_n5').val('INCORRECTO');
		}
		else
		{
			$('#vf_n5').val('CORRECTO');
		}
	}
	$('#vf_n1').focus();
	return true;
}
function getObtHora(id1)
{
//	alert ('bola 1');
	var html=$.ajax({type:"GET",url:'get_hora.php',data:{id:id1},async:false}).responseText;
//	alert ('bola 2');

	if(html=='eNoResults'){
		// no esta grabada la respuesta
//	  alert('Fin de Archivo');
//	$('#vf_hora_inicio').val(hora2);
	  return true;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
//	clearInputs();
// la pregunta esta grabada
	eval(html);
	$('#vf_hora_inicio').val(hora_ini);
	$('#vf_hora_fin').val(hora_fin);
	$('#vf_n1').focus();
	return true;
}

function cantidad_grabada(id1)
{   //id1 es el codigo del alumno, tambien necesita el nro de examen pero ese dato esta en $_SESSION['app_user_examen'] lo asigna advertencia1 o 2
//	alert ('bola 21');
	var html=$.ajax({type:"GET",url:'get_cantidad_10p.php',data:{id:id1},async:false}).responseText;
//	alert ('bola 22');

	if(html=='eNoResults'){
		// no esta grabada la respuesta
	  alert('Fin de Archivo  23');
//	$('#vf_hora_inicio').val(hora2);
	  return false;
	}
	if(html=='eFin'){
		// no esta grabada la respuesta
	  alert('La materia NO tiene examen para evaluar');
//	$('#vf_hora_inicio').val(hora2);
	  return 99;
	}
	if(html=='eFin2'){
	  alert('2 No tiene respuestas grabadas');
	  return 0;
	}
	if(html=='eFin3'){
	  alert('3 No tiene respuestas grabadas');
	  return 0;
	}
	if(html=='eFin4'){
//	  alert('4 No tiene respuestas grabadas');
	  return 0;
	}
	if(html=='eFin5'){
	  alert('5 No tiene respuestas grabadas');
	  return 0;
	}
	if(html=='eFin6'){
	  alert('6 No tiene respuestas grabadas');
	  return 0;
	}
	if(html=='eFin7'){
	  alert('7 No tiene respuestas grabadas');
	  return 0;
	}
	if(html=='eFin8'){
	  alert('8 No tiene respuestas grabadas');
	  return 0;
	}
	if(html=='eFin9'){
	  alert('9 No tiene respuestas grabadas');
	  return 0;
	}
	if(html=='eFin10'){
	  alert('10 No tiene respuestas grabadas');
	  return 0;
	}
	if(html=='eFin11'){
	  alert('11 No tiene respuestas grabadas');
	  return 0;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
//	alert('La 1');
	eval(html);
//	alert('La 2');
	$('#vf_contador').val(num);
    $('#vf_nota_final').val(notita);
    document.getElementById('nota').innerHTML = notita;
	return parseInt($('#vf_contador').val());
}
function Siguiente()
{
	//finalizarTimer();
	indice++;
	asignarPregunta(indice);
//	alert(' m 0');
  if (parseInt($('#vf_numero').val()) == 0 && parseInt($('#vf_contador').val()) == 0 && parseInt($('#vf_codpre').val()) == 0)
  {
//	alert(' m 1');
	$grabao = cantidad_grabada(parseInt($('#vf_codalu').val())); // saca la cantidad de preguntas respondidas por el alumno
//	alert(' m 2');
	$('#vf_contador').val($grabao); // se lo asigno al contador de preguntas
	if ($('#vf_contador').val() == 99)
	{
		alert('Examen NO existente');
		$('#vf_contador').val('0');
		return true;
	}
	else
	{
		// if ($('#vf_contador').val() == 5)  // esto era asi cuando era 5 preguntas
		if ($('#vf_contador').val() == 10 || $('#vf_contador').val() > 10)
		{
			alert('Examen ya realizado y terminado por el alumno. NOTA FINAL : ' + $('#vf_nota_final').val()+'     SOBRE 100');
			//$('#vf_contador').val('0');
			$('#vf_n1').val('7');   // asigno 7 solo para poder salir
		}
		else
		{
			$contador = parseInt($('#vf_contador').val());
			$contador=$contador+1;
//			alert('Nrosssss: ' + $contador);
			getSiguiente($contador);
//			alert('vol 1');
			getObtHora(parseInt($('#vf_tiempo').val()));
			getDatosGrabados(parseInt($('#vf_codpre').val()));
			$('#vf_n1').focus();
		}
		return true;
	}
  }
  else  // aqui entra cuando ya tiene registradas respuestas del examen
  {
	  if (parseInt($('#vf_numero').val()) == 0 && parseInt($('#vf_contador').val()) > 0)
	  {
	//	alert ('hoy 43');
		$contador = parseInt($('#vf_contador').val());
		getSiguemismo($contador,parseInt($('#vf_codpre').val()));
	//	getObtHora(parseInt($('#vf_tiempo').val()));
		getDatosGrabados(parseInt($('#vf_codpre').val()));
		$('#vf_n1').focus();
		return true;
	  }
	  else
	  {
//		alert ('hoy 44');
		if (verificarGrabado())  // verifica si se grabo o esta grabado el que esta mostrando nada mas 
		{				// verifica con el codigo del alumno y codigo de pregunta
//			alert ('hoy 45');
			$('#vf_n1').val('');
			$('#vf_n5').val('');
			$contador = parseInt($('#vf_contador').val());
	//		if (parseInt($('#vf_codpre').val()) == parseInt($('#vf_numero').val()))
			if (parseInt($('#vf_codpre').val()) >0 && parseInt($('#vf_numero').val()) > 0 && parseInt($('#vf_contador').val()) > 0 )
			{
//				alert ('hoy 46');
				$contador=$contador+1;
				getSiguiente($contador);
				getObtHora(parseInt($('#vf_tiempo').val()));
			}
			else
			{
//				alert ('hoy 47');
	//			getSiguemismo($contador);
				$contador = parseInt($('#vf_contador').val());
				getSiguemismo($contador,parseInt($('#vf_codpre').val()));
			}
	//		  alert(' contador22 : ' + $contador);
	//		alert('fo 1');
	//		getObtHora(parseInt($('#vf_tiempo').val()));
	//		alert('fo 2');
			getDatosGrabados(parseInt($('#vf_codpre').val()));
	//		alert('fo 3');
			$('#vf_nota').val('0');
			$('#vf_n1').focus();
			return true;
		}
		else
		{
			Swal.fire('Debe Responder la pregunta !!!');

			indice--;
			asignarPregunta2(indice);
			asignarPregunta(indice);
			$('#vf_n1').focus();
			return false;
		}
	  }
  }
}

function getSiguiente(id)
{
//	alert('cv 1');
	var html=$.ajax({type:"GET",url:'get_pregunta_10p.php',data:{id:id},async:false}).responseText;
//	alert('cv 2');

	if(html=='eFin'){
	  Swal.fire('Examen Finalizado');
	  	$('#btnSalir').removeClass('display-none');
	  	$('#btn-siguiente').addClass('display-none');
	  	$('#bloque-examen').addClass('display-none');
	  	$('#botones').addClass('display-none');
	  	$('#npreg').addClass('display-none');
      //$('#vf_contador').val('6');
      $('#vf_contador').val('11');
	  return false;
	}
//	alert('cv 3');
	if(html=='eNoResults1'){
	  alert('Sin Resultados, ni entro ');
	  return false;
	}
	if(html=='eNoResults'){
	  alert('Fin de Archivo hoooyyyy');
	  return false;
	}
	if(html=='eNo200'){
	  alert('Sin Resultados 200 ');
	  return false;
	}
	if(html=='eNo300'){
	  alert('Sin Resultados 300');
	  return false;
	}
	if(html=='eNo400'){
	  alert('Prueba de ingreso');
	  return false;
	}
//	alert('cv 4');
	if(html=='eNo1'){
	  alert('Falla en los parametros No 1');
	  return false;
	}
	if(html=='eNo2'){
	  alert('Falla en los parametros No 2');
	  return false;
	}
	if(html=='eNo3'){
	  alert('Falla en los parametros No 3');
	  return false;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
//	alert ('tt1');
//	clearInputs();
console.log(html);
	eval(html);
//	alert ('tt2');
    $('#vf_total').val(total);
    $('#vf_numero').val(num);
    $('#vf_valor').val(val);
    $('#vf_opcion1').val(n_o1);
    $('#vf_opcion2').val(n_o2);
    $('#vf_opcion3').val(n_o3);
    document.getElementById('vf_op1').innerHTML = o1;
    document.getElementById('vf_op2').innerHTML = o2;
    document.getElementById('vf_op3').innerHTML = o3;
    document.getElementById('vf_pregunta').innerHTML = pre;
    $('#vf_codpre').val(codpre);
    $('#vf_contador').val(cuenta);
    $('#vf_tiempo').val(tie);
    seconds = (tie*60) - 3;
    finalizarTimer();
    iniciarReloj();
    $('#vf_nota_final').val(notita);
    document.getElementById('nota').innerHTML = notita;
	$('#vf_n1').focus();
	if(o4!=""){
		$('#img').attr('src',"resources/"+o4);
		$('#img').removeClass('display-none');
	}else{
		$('#img').addClass('display-none');
	}
	




		return true;
}
function mostrarimagen()
{
	document.write('<img src="resources/123.jpg"/>');
}
function getSiguemismo(id1,id3)
{
	var html=$.ajax({type:"GET",url:'get_preg_mismo_10p.php',data:{id:id1,id2:id3},async:false}).responseText;

	if(html=='eFin'){
	  alert('Examen Finalizado 3');
	  return false;
	}
	if(html=='eNoResults'){
	  alert('Fin de Archivo');
	  return false;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
//	clearInputs();
	eval(html);
    $('#vf_total').val(total);
    $('#vf_numero').val(num);
    $('#vf_valor').val(val);
    $('#vf_opcion1').val(n_o1);
    $('#vf_opcion2').val(n_o2);
    $('#vf_opcion3').val(n_o3);
    $('#vf_op1').val(o1);
    $('#vf_op2').val(o2);
    $('#vf_op3').val(o3);
    $('#vf_pregunta').val(pre);
    $('#vf_codpre').val(codpre);
    $('#vf_contador').val(cuenta);
    $('#vf_tiempo').val(tie);
    $('#vf_nota_final').val(notita);
    document.getElementById('nota').innerHTML = notita;
	$('#vf_n1').focus();
	return true;
}
function grabarAbandono(id8,id9,id11,id12,id13,id14)
{
	var html=$.ajax({type:"GET",url:'grabar_abandono_10p.php',data:{id1:id8,id2:id9,id3:id11,id4:id12,id5:id13,id6:id14},async:false}).responseText;

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
	  return false;
	}
	if(html=='eGrabado'){
//		alert('gol 4');
//		$('#vf_n1').val('9');
//		$('#vf_n5').val('FUERA DE TIEMPO');
	  return true;
	}
}

function Confirmar(cont,resp)
{
	console.log(cont+" "+resp);
//	alert('numero: '+ cont);
//	alert('paso tete 0');
  if(cont>10)
  {
			Salir();
			return true;
  }
  else
  {
	if (cont < 10)
	{
	    var txt;
    	var r = confirm("CONFIRMAR SI Desea ABANDONAR EL EXAMEN!. Recuerde que ya no podra evaluar de nuevo este examen");
	    if (r == true)
		{
			// debe grabar lo restante. Primero sacando lo que ya tienen grabao
			$grabao = cantidad_grabada(parseInt($('#vf_codalu').val())); // saca la cantidad de preguntas respondidas por el alumno
			cont = $grabao;
			while (cont < 10)
			{
				if(grabarAbandono($('#vf_codalu').val(),-1,8,0,$('#vf_hora_inicio').val(),$('#vf_hora_fin').val()))
				{
					++cont;
				}
				else
				{
					alert('Error en la grabacion del complemento a 10 respuestas');
				}
			}
//			location.href='materias2do_p.php';
//		alert('paso tete 1');

			Salir();
//		alert('paso tete 100');
			return true;
			//txt = "You pressed OK!";
    	}
		else
		{
//			alert('paso 2');

        	//txt = "You pressed Cancel!";
			$('#vf_n1').focus();
			return false;
	    }
	}
	else
	{
//		alert('paso 3');
		if (cont == 10 && (resp == 1 || resp == 2 || resp == 3 || resp == 7 || resp == 8 || resp == 9))
		{
//			location.href='materias2do_p.php';
			Salir();
			return true;
		}
		else
		{
			Swal.fire('Debe responder esta ultima pregunta, antes de salir');
			$('#vf_n1').focus();
			return false;
		}
	}
  }
}

function enviarWhatsapp(data) {
	//let nota = $('#vf_nota_final').val();
	let nota = data;
	let nombre = $('#nombre_alumno').val();
	let materia = $('#nombre_materia').val();
	let curso = $('#nombre_curso').val();
	let nro_eval = $('#nro_eval').val();
	if(parseInt(nro_eval)<=0)return;
	let codalu = $('#vf_codalu').val();
	let trimestre = $('#vf_perfil2').val();
	let mensaje = `Nota de Examen: ${nota} / 100 - Evaluacion Nro.: ${nro_eval} - Trimestre: ${trimestre} - Alumno: ${nombre} - Materia: ${materia} - Curso: ${curso}`;
	
	let contactos = obtenerContactos(codalu);
    	    console.log(contactos);
    	    contactos.forEach((contacto)=>{
    	        $.get(
    	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensaje+"&phone=591"+contacto
    	            );
    	        
    	    });
    	  enviarAPPAgenda(codalu,mensaje);
  					
}
function enviarAPPAgenda(codalu,mensaje) {
	var c_recibe = codalu;
            var emite = "administracion";
            let nombre2 = "Sistema";
            //var fecha = getfecha();
   
    	$.ajax({
                method: "POST",
                url: `${dominio}/agenda/mensajeIngreso`,
                data: JSON.stringify({ codEst: c_recibe, codEmit: emite,msg:mensaje,nombre:nombre2}),
                contentType: "application/json",
                success:function(data){
                    if(data=="ok"){
                        //alert("Mensaje enviado correctamente gol: "+c_recibe+" - "+emite+"-"+msgr+"-"+materia);
                        //alert("Mensaje enviado correctamente");
                    }else{
                        alert('error');
                    }    
                }
                });
	// body...
}
async function Salir()
{
    await $.get(`get_nota_examen.php?codalu=${$('#vf_codalu').val()}&codexa=${$('#vf_perfil3').val()}`,
            data=>{
                enviarWhatsapp(data);
            },"text");
//	alert('hola 10000000');
	switch ($('#vf_perfil2').val())
	{
		case '1':
			switch ($('#vf_perfil').val())
			{
				case 'PRIMARIA':
					location.href='evaluacion_alumnos_10p.php';
					return true;
					break;
				case 'SECUNDARIA':
					location.href='evaluacion_alumnos_10p.php';
					return true;
					break;
				case 'INICIAL':
					location.href='evaluacion_alumnos_10p.php';
					return true;
					break;
			}
			break;
		case '2':
			switch ($('#vf_perfil').val())
			{
				case 'PRIMARIA':
					location.href='evaluacion_alumnos_10p.php';
					return true;
					break;
				case 'SECUNDARIA':
					location.href='evaluacion_alumnos_10p.php';
					return true;
					break;
				case 'INICIAL':
					location.href='evaluacion_alumnos_10p.php';
					return true;
					break;
			}
			break;
		case '3':
			switch ($('#vf_perfil').val())
			{
				case 'PRIMARIA':
					location.href='evaluacion_alumnos_10p.php';
					return true;
					break;
				case 'SECUNDARIA':
					location.href='evaluacion_alumnos_10p.php';
					return true;
					break;
				case 'INICIAL':
					location.href='evaluacion_alumnos_10p.php';
					return true;
					break;
			}
			break;
		case '4':
			switch ($('#vf_perfil').val())
			{
				case 'PRIMARIA':
					location.href='evaluacion_alumnos_10p.php';
					return true;
					break;
				case 'SECUNDARIA':
					location.href='evaluacion_alumnos_10p.php';
					return true;
					break;
				case 'INICIAL':
					location.href='evaluacion_alumnos_10p.php';
					return true;
					break;
			}
			break;
	}
}


function Validar1(e,param)
{
  if(isKeyEnter(e))  // presiono ENTER
  {	
	if (parseInt(param) < 0 || parseInt(param) > 3)
	{
		alert('El valor es invalido')
		return false;
	}
	else
	{
		$('#btnSiguiente').focus();
		return true;
	}
  }
}
function Validar2(e,param)
{
	if (parseInt(param) < 0 || parseInt(param) > 3)
	{
		alert('El valor es invalido')
		return false;
	}
	else
	{
		if(isKeyEnter(e))  // presiono ENTER
		{
			//alert('siguiente');
			$('#btnSiguiente').focus();
			return true;
		}
		else
		{
			$('#vf_n1').focus();
			return false;
		}
	}
}
function Opcion1()
{
	if(btnOpcion(1))  // presiono ENTER
	{
	//	alert('Opcion 1');
		$('#vf_n1').val(1);
		$('#btnSiguiente').focus();
		return true;
	}
	else
	{
		$('#vf_n1').focus();
		return false;
	}
}
function Opcion2()
{
	if(btnOpcion(2))  // presiono ENTER
	{
	//	alert('Opcion 2');
		$('#vf_n1').val(2);
		$('#btnSiguiente').focus();
		return true;
	}
	else
	{
		$('#vf_n1').focus();
		return false;
	}
}
function Opcion3()
{
	if(btnOpcion(3))  // presiono ENTER
	{
	//	alert('Opcion 3');
		$('#vf_n1').val(3);
		$('#btnSiguiente').focus();
		return true;
	}
	else
	{
		$('#vf_n1').focus();
		return false;
	}
}

function validarDato()
{
		if (parseInt($('#vf_n1').val()) >= 0 && parseInt($('#vf_n1').val()) <= 3)
		{
			return true;
		}
		else
		{
			return false;
		}
}
let indice = 0;
function iniciar() {
	indice = parseInt($('#vf_contador').val());
	$('#bloque-examen').removeClass('display-none');
	$('#btn-iniciar').addClass('display-none');
	$('#btn-siguiente').removeClass('display-none');
	$('#npreg').removeClass('display-none');
	$('#botones').removeClass('display-none');
	asignarPregunta(indice);
	Siguiente();
}
function asignarPregunta(preg) {
	if (preg>1) {
		$('#btn-p'+(preg-1)).removeClass('selected');
		$('#btn-p'+(preg-1)).addClass('unselected');	

		$('#btn-p'+preg).removeClass('unselected');
		$('#btn-p'+preg).addClass('selected');	
	}else{
		$('#btn-p'+preg).removeClass('unselected');
		$('#btn-p'+preg).addClass('selected');
	}
	
}
function asignarPregunta2(preg) {
	if (preg<11) {
		$('#btn-p'+(preg+1)).removeClass('selected');
		$('#btn-p'+(preg+1)).addClass('unselected');	
	}
}
function contador(){
		let minutos = Math.floor(seconds/60)%60;
		let segundos = seconds%60;

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

		if (seconds==0) {
			clearInterval(timer);
		}
		seconds--;
	}
function finalizarTimer(){
	clearInterval(timer);
		document.getElementById('m1').innerHTML = "0";
		document.getElementById('m2').innerHTML = "0";
		document.getElementById('s1').innerHTML = "0";
		document.getElementById('s2').innerHTML = "0";
}
function iniciarReloj(){
	timer = setInterval('contador()',1000);
}
$(document).ready(function()
						   {   
						       alumno = $('#vf_codalu').val();
						   	   obtenerCelularTutor(alumno);
//							   $('#btnGrabar').bind('click',function(){if(validarDato()){$('#fLogin').submit();}});
//							   $('#btnGrabar1').bind('click',function(){formSubmit();});
							   $('#btnOpcion1').bind('click',function(){Opcion1();});
							   $('#btnOpcion2').bind('click',function(){Opcion2();});
							   $('#btnOpcion3').bind('click',function(){Opcion3();});
							   $('#btnInicio').bind('click',function(){Inicio();});
							   $('#btnAnterior').bind('click',function(){Anterior();});
							   $('#btnSiguiente').bind('click',function(){Siguiente();});
							   $('#btn-iniciar').bind('click',function(){iniciar();});
							   $('#btnFin').bind('click',function(){Fin();});
							   $('#btnNuevo').bind('click',function(){Nuevo();});
							   $('#btnBuscar').bind('click',function(){Buscar();});
							//   $('#btnVer').bind('click',function(){location.href='ver_datos.php';});
							//   $('#btnEncargado').bind('click',function(){location.href='Encargado.php';});
							   $('#btnSalir').bind('click',function(){Confirmar($('#vf_contador').val(),$('#vf_n1').val());});
//							   $('#btnSalir').bind('click',function(){location.href='materias2do_p.php';});
							}
							)
