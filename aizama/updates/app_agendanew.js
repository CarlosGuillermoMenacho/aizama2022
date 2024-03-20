var lista=[];

var indice=0;

var listaCursos = [];

var listaMaterias = [];

var lista_celulares = [];

var dominio = 'https://www.comunidadcristianatm.com'
//let dominio = "http://192.168.100.65:3000";
var nombre_materia;

var nuevo_msg;

var nombre_curso='';

var mensaje = [];
var fechas = [];
var fechasGrupo = [];

/* Variable*/

var codmat;

var curso;

var paralelo;

var index;

var mensajeProf = [];

let codigoProfesor;

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

            "json"

        );

    

}

function cargarLista()

{

	lista=[];

	$('#vf_n3').val("");

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

						lista.push(ac);

						ac="";

					} 

				}



				lista.push(ac);

				indice=0;

			}

			});

}

function init(){

	$.post("obtener_curso_json.php?op=cp",function(respuesta){

    var jsonDataCursos = JSON.parse(respuesta);

    	if (jsonDataCursos['status'] == 'ok') {     

			listaCursos = jsonDataCursos['cursos'];

			for (let i = 0; i < listaCursos.length; i++) {    

				var cursos = listaCursos[i]['nombre']; 

				$("#slccurso").append('<option value ="'+ (i+1) +'">' + cursos + '</option>');

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

}



function obtenerMaterias(curso, paralelo) {

    

    $("#slcmateria").empty();

	$("#slcmateria").append('<option value="0"> -- Seleccionar materia -- </option>');

	console.log(listaMaterias)

	for(var i = 0 ; i < listaMaterias.length; i++) {

		if(listaMaterias[i]['codcur'] == curso && listaMaterias[i]['codpar'] == paralelo){

            $("#slcmateria").append('<option value ="'+(listaMaterias[i]['codmat'])+'">' + listaMaterias[i]['nombre'] + '</option>');

		}

    }

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

                }

                $('#slcalumnos').html(data);

          });

}

function updateindice(){

	var c=0;

	while(lista[c]!=$('#slcalumnos').val())

		{

			c=c+1;

		}

	indice=c+1;

}

function getNombre(){

	$.ajax({

			type:"POST",

			url:"data_agenda.php?op=est",

			data:"cod_alu=" + $('#slcalumnos').val(),

			success:function(r){

				if(r=='eSession'){

	  				alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');

	  				return false;

					}



				$('#vf_n3').val(r);

			}

			});



}

function validardatos(){

	if ($('#slccurso').val()!=0 && $('#slcmateria').val()!=0 && $('#slcalumnos').val()!=0) {

		return true;

	}

	return false;

}

function validardatos1(){

	if ($('#slccurso').val()!='' && $('#slcmateria').val()!=0) {

		return true;

	}

	$('#slccurso').focus();

	return false;

}

function validarmsgalu(){

	if ($('#msnalu').val()!='') {

		return true;

	}

	return false;

}

function validarmsgclass(){

	if ($('#msncurso').val()!='') {

		return true;

	}

	return false;

}
function limpiarbandeja() {
	$("#bandeja2").empty();
    $("#bandeja").empty();
    $("#bandeja2").append('<option value="0">  Seleccione curso y materia para cargar los mensajes  </option>');
}
function limpiarmensajes() {
	
    $("#bandeja").empty();
}
function obtenergroup(codcur) {

	$('#bandeja2').empty();
	$.post("data_agenda.php?op=mes_groups",
	{codcur:curso,codpar:paralelo,codmat:codmat},
	(datos,estado,xhr)=>{
		let status = datos ["status"];
		if (status == "ok") {
		mensaje = datos ["mes_groups"];	
		fechasGrupo = datos.fecha;
		
		fechasGrupo.forEach((fecha)=>{
			let html_cadena="";
			html_cadena = `<div class="bloque-mensaje" id="g${fecha}">
              				<div class="fecha-msg">${fecha}</div>`;
			mensaje.forEach((message)=>{
				if(message.fecha==fecha){
					html_cadena = `${html_cadena} <div class="div-mensaje-chat">
                								  <p>${message.mensaje}</p>
									              <div class="hora-mesaje">${message.hora}</div>
									              </div>`;
				}
			})
			html_cadena = `${html_cadena}</div>`;
			$('#bandeja2').append(html_cadena);
			var objDiv = document.getElementById("bandeja2");
			objDiv.scrollTop = objDiv.scrollHeight;
		})
        //document.getElementById('ta-cursos').value=groupsObtener(codcur);
        //let select_A = $('#ta-cursos');
        //select_A.scrollTop(select_A[0].scrollHeight - select_A.height());
      }
      
	},'json');
}
function groupsObtener(codcur) {
	if (mensaje.length==0) {
		return "No envió ningún mensaje al curso seleccionado";
	}
	let cadena = "";
	for (var i = 0; i < mensaje.length; i++) {

    
      cadena = cadena + mensaje[i]+"\n\n";
  } 
  return cadena;
}
function recargamensajes(codalu) {

	$.post(
  		'data_agenda.php?op=mes_students_last',
 		{codalu:codalu,codmat:codmat},
  		(datos)=>{
  			let status = datos.status;
  			if (status=="ok") {
  				const fechaMessage = datos.mes_students_last.fecha;
  				const mensaje = datos.mes_students_last.mensaje;
  				const hora = datos.mes_students_last.hora;
  				const existefecha = fechas.includes(fechaMessage);
  				console.log(existefecha);
  				if (existefecha) {
  					console.log("mensaje");
  					$(`#a${fechaMessage}`).append(`
  											<div class="div-mensaje-chat">
								                <p>${mensaje}</p>
								                <div class="hora-mesaje">${hora}</div>
								              </div>
  											`)
  				}else{
  					console.log("bloque");
  					fechas.push(fechaMessage);
  					$('#bandeja').append(`
  										<div class="bloque-mensaje" id="a${fechaMessage}">
							              <div class="fecha-msg">${fechaMessage}</div>
							              <div class="div-mensaje-chat">
							                <p>${mensaje}</p>
							                <div class="hora-mesaje">${hora}</div>
							              </div>
							            </div> 
  										`);
  				}
  				var div = document.getElementById('bandeja');
  				$('#bandeja').animate({
			      scrollTop: div.scrollHeight - div.clientHeight
			    }, 300);
  			}
  			$('#btne2').removeClass("bloqueado");
            $('#btne2').addClass("btn-send-message"); 
            $('#btne2').prop('disabled', false);
  			/*if (status=="noMessage") {
  				Swal.fire("No se envió el mensaje porque el estudiante\nno tiene tutores asignados...!!!");
  			}*/

    },'json');
}
function obtenermensajes(codalu){

	$('#bandeja').empty();

	$.post("data_agenda.php?op=mes_students",
	{codalu:codalu,codmat:codmat},
	(datos,estado,xhr)=>{
		let status = datos ["status"];
		if (status == "ok") {
		mensaje = datos.mes_students;	
		fechas = datos.fechas;
		
		fechas.forEach((fecha)=>{
			let html_cadena="";
			html_cadena = `<div class="bloque-mensaje" id="a${fecha}">
              				<div class="fecha-msg">${fecha}</div>`;
			mensaje.forEach((message)=>{
				if(message.fecha==fecha){
					html_cadena = `${html_cadena} <div class="div-mensaje-chat">
                								  <p>${message.mensaje}</p>
									              <div class="hora-mesaje">${message.hora}</div>
									              </div>`;
				}
			})
			html_cadena = `${html_cadena}</div>`;
			$('#bandeja').append(html_cadena);
			var objDiv = document.getElementById("bandeja");
			objDiv.scrollTop = objDiv.scrollHeight;
		})

        //document.getElementById('ta-alumno').value=mensajesObtener(codalu);
       // let select_A = $('#ta-alumno');
        //select_A.scrollTop(select_A[0].scrollHeight - select_A.height());
      }
      
	},'json');

}
function mensajesObtener(codcur) {
	if (mensaje.length==0) {
		return "No envió ningún mensaje al alumno seleccionado";
	}
	let cadena = "";
	for (var i = 0; i < mensaje.length-1; i++) {


      cadena = cadena + mensaje[i]+"\n\n";
  	}
  	cadena = cadena + mensaje[mensaje.length-1]; 
  	return cadena;
}

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

function getmsgalu(id,msg){

	if (validardatos()&&validarmsgalu()) {

	     //   alert ('aqui 1');

	    //nombre_materia ='';

	    var selc_alumno = document.getElementById("slcalumnos");

        var nombre_alumno = selc_alumno.options[selc_alumno.selectedIndex].text;

		nuevo_msg='Curso: '+nombre_curso+' - Materia: '+nombre_materia+' - Alumno: '+nombre_alumno+' - '+msg;

	    let contactos = obtenerContactos(id);

	    console.log(contactos);

	    contactos.forEach((contacto)=>{
            if (contacto.includes('+')){
                contacto=contacto.slice(1);
                $.get(
        	            "https://www.comunidadcristianatm.com/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone="+contacto
        	   );
            }
            else{
    	        $.get(
        	            "https://www.comunidadcristianatm.com/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto
	            );
            }
	        
	    });

		var formData = new FormData($("#fGrabar")[0]);

		var html1=$.ajax({url:"data_agenda2.php?op=getmsg&alu="+id+"&msg="+msg+"&paralelo="+paralelo,type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;

	   var html=html1.trim();

		if(html=='eNoResults'){

			alert('No EXISTE EL CODIGO EN EL PADRON');

			$('#vf_recinto').focus();

		  	return false;

		}

		if(html=='error'){

		  	alert('No se pudo guardar.');

		 	return false;

		}

		if(html=='eSession'){

		  	alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');

		  	return false;

		}

		if(html=='eGrabado')

		{

		   

             /*

            $.ajax({

            method: "POST",

            url: "http://www.comunidadcristianatm.com/agenda/mensaje",

            data: JSON.stringify({ codEst: "1",codEmit:"1",msg:"Hola"}),

            contentType: "application/json",

            success:function(data){

                if(data=="ok"){

                    alert("Enviado correctamente");

                }else{

                    alert('error');

                }    

            }

            }); */

            

		}

		var m = document.getElementById("slcmateria");

            var materia = m.options[m.selectedIndex].value;    

    		var e = document.getElementById("slcalumnos");

            var c_recibe = e.options[e.selectedIndex].value;

            var emite = $('#id_usr').val();

            var msgr = msg;
            try{
                $.ajax({

                method: "POST",

                url: `${dominio}/agenda/mensajeprof`,

                data: JSON.stringify({ codEst: c_recibe, codEmit: emite,msg:msgr,codmat:materia}),

                contentType: "application/json",

                success:function(data){

                    if(data=="ok"){

                        //alert("Mensaje enviado correctamente gol: "+c_recibe+" - "+emite+"-"+msgr+"-"+materia);

                        recargamensajes(id);

                    	$('#text-alumno').val("");

                       // alert("Mensaje enviado correctamente");

                    }else{

                        alert('error');

                    }    

                }

                });

            }
            catch(error){
                $('#btne2').removeClass("bloqueado");
                $('#btne2').addClass("btn-send-message"); 
                $('#btne2').prop('disabled', false);
                $.post(
                        "error_js.php",
                        {vista:"agenda.js",error:error.name + ' : '+error.message}
                        );
            }
    		
            /*$('#btne2').removeClass("bloqueado");
            $('#btne2').addClass("btn-send-message"); 
            $('#btne2').prop('disabled', false);*/
		  	return true;

	}else{

		alert('Debe seleccionar: Curso, Materia y Alumnos o actualizar la pagina');
		$('#btne2').removeClass("bloqueado");
        $('#btne2').addClass("btn-send-message"); 
        $('#btne2').prop('disabled', false);
		return false;

	}

}

function obtenerNombreMateria(){

	let codmat = $('#slcmateria').val();
    if(codmat == "0"){
        alert("Debe seleccionar el curso y la materia...");
        return false;
    }
	for(let i = 0; listaMaterias.length; i++){

		if(listaMaterias[i].codmat==codmat){

			nombre_materia = listaMaterias[i].nombre;

			return;

		}



	}

}



function getmsgalu2(id,msg){



		nuevo_msg='Curso: '+nombre_curso+' - Materia: '+nombre_materia+' - '+msg;

    

        var selc_alumno = document.getElementById("slcalumnos");

        var nombre_alumno = selc_alumno.options[selc_alumno.selectedIndex].text;

        let contactos = obtenerContactos(id);

	    console.log(contactos);

	    contactos.forEach((contacto)=>{
            if (contacto.includes('+')){
                contacto=contacto.slice(1);
                $.get(
        	            "https://www.comunidadcristianatm.com/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone="+contacto
        	   );
            }
            else{
    	        $.get(
        	            "https://www.comunidadcristianatm.com/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto
	            );
            }
	        

	    });

		var formData = new FormData($("#fGrabar")[0]);

		var html1=$.ajax({url:"data_agenda2.php?op=getmsg&alu="+id+"&msg="+msg+"&paralelo="+paralelo,type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;

	    var html=html1.trim();

		if(html=='eNoResults'){

		  	return false;

		}

		if(html=='error'){



		 	return false;

		}

		if(html=='eSession'){



		  	return false;

		}

		if(html=='eGrabado')

		{

            

		}

		var c_recibe = id;

		    /*var xhttp=new XMLHttpRequest();

		    xhttp.onreadystatechange = function () {

                if (this.readyState === 4 && this.status === 200) {

                    console.log(this.responseText);

                }

		     }

		     console.log(c_recibe);

		     xhttp.open('GET', `${dominio}/chat/nuevo?recibe=${c_recibe}`, true);

             xhttp.send();*/

             

            var m = document.getElementById("slcmateria");

            var materia = m.options[m.selectedIndex].value;    

    		var e = document.getElementById("slcalumnos");

//            var c_recibe = e.options[e.selectedIndex].value;

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



function grabar(id)

{

    let codi_alu =$('#slcalumnos').val();

    console.log('1er Codigo alumno: '+codi_alu);



	if (validardatos()) {

	    obtenerNombreMateria();

    	var formData = new FormData($("#fGrabar")[0]);

    	var html1=$.ajax({url:"data_agenda2.php?op=save&obs="+id+"&paralelo="+paralelo,type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;

    	var html=html1.trim();

    	console.log(html);

    	if(html=='eNoResults'){

    		  alert('No EXISTE EL CODIGO EN EL PADRON');

    		$('#vf_recinto').focus();

    		  return false;

    		}

     	if(html=='eSession'){

    		  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');

    		  return false;

    		}

      	if(html=='error'){

    		  alert('No se pudo guardar.');

    		  return false;

    	}else

    			//if(html=='eGrabado')

    	{

            var emite = $('#id_usr').val();

            var msgr = html;

    	    var selc_alumno = document.getElementById("slcalumnos");

            var nombre_alumno = selc_alumno.options[selc_alumno.selectedIndex].text;

    		nuevo_msg='Curso: '+nombre_curso+' - Materia: '+nombre_materia+' - Alumno: '+nombre_alumno+' - '+msgr;



    	//	nuevo_msg='Emite: '+emite+': Curso: '+nombre_curso+' - '+msgr;

            var selc_alumno = document.getElementById("slcalumnos");

            var nombre_alumno = selc_alumno.options[selc_alumno.selectedIndex].text;

            let contactos = obtenerContactos(codi_alu);

            console.log('Codigo alumno: '+codi_alu);

    	    console.log('Aqui 2 Contactos: '+contactos);

    	    contactos.forEach((contacto)=>{
                if (contacto.includes('+')){
                    contacto=contacto.slice(1);
                    $.get(
            	            "https://www.comunidadcristianatm.com/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone="+contacto
            	   );
                }
                else{
        	        $.get(
            	            "https://www.comunidadcristianatm.com/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto
    	            );
                }

    	    });



    	    

    		var m = document.getElementById("slcmateria");

            var materia = m.options[m.selectedIndex].value;    

    		var e = document.getElementById("slcalumnos");

            var c_recibe = e.options[e.selectedIndex].value;

//            var emite = $('#id_usr').val();

//            var msgr = html;

    		$.ajax({

                method: "POST",

                url: `${dominio}/agenda/mensajeprof`,

                data: JSON.stringify({ 

                    codEst: c_recibe,

                    codEmit: emite,

                    msg:msgr,

                    codmat:materia

                }),

                contentType: "application/json",

                success:function(data){

                    if(data=="ok"){

                        //alert("Mensaje enviado correctamente: "+c_recibe+" - "+emite+"-"+msgr+"-"+materia);

                        //alert("Mensaje enviado correctamente");

                        /*Swal.fire(

                          'Mensaje Enviado!',

                          'presiona ok para salir',

                          'success'

                        );*/

                    }else{

                        alert('error2424');

                    }    

                }

                }); 

    		  

    		return true;

		}

	}else{

		alert('Debe seleccionar: Curso, Materia y Alumnos o actualice la pagina');

		return false;

	}

}

function pedirUltimoMensajeAlCurso(){
	$.post(
  							'data_agenda.php?op=mes_groups_last',
  							{codcur:curso,codpar:paralelo,codmat:codmat},
  							(datos)=>{
  								let status = datos.status;
  								if(status=="ok"){
  									const fechaMensaje = datos.mes_groups_last.fecha;
  									const mensaje = datos.mes_groups_last.mensaje;
  									const hora = datos.mes_groups_last.hora;
  									const existefecha = fechasGrupo.includes(fechaMensaje);
  									console.log(existefecha);
  									if (existefecha) {
  									console.log("mensaje");
  									$(`#g${fechaMensaje}`).append(`
  											<div class="div-mensaje-chat">
								                <p>${mensaje}</p>
								                <div class="hora-mesaje">${hora}</div>
								              </div>
  											`)
  									}else{
  										console.log("bloque");
  										fechasGrupo.push(fechaMensaje);
  										$('#bandeja2').append(`
  											<div class="bloque-mensaje" id="g${fechaMensaje}">
							              	<div class="fecha-msg">${fechaMensaje}</div>
							              	<div class="div-mensaje-chat">
							                	<p>${mensaje}</p>
							                	<div class="hora-mesaje">${hora}</div>
							              	</div>
							            	</div> 
  											`);
  								}
  					var div = document.getElementById('bandeja2');
  					$('#bandeja2').animate({
			      		scrollTop: div.scrollHeight - div.clientHeight
			    		}, 300);
  					}
  				if (status=="noMessage") {
  					Swal.fire("No se envió el mensaje porque el estudiante\nno tiene tutores asignados...!!!");
  				}

		    },'json');


		

		    $('#msncurso').val("");

		    $('#msnalu').val("");
		    return;
}
function send_mesagge_curso(msg){
    for(var i = 0; i < listaCursos.length; i++){
        if(listaCursos[i].codcur == curso && listaCursos[i].codpar == paralelo){
            let token = listaCursos[i].token;
            $.get(
            	 "https://www.comunidadcristianatm.com/aizama/whatsapp_msg.php?text=Materia: "+nombre_materia+" - "+msg+"&phone="+token
            );
        }
    }
}
function getmsgallclass(msg){
    
    

	if (validardatos1()&&validarmsgclass()&&lista.length>0) {
        send_mesagge_curso(msg);
		try{$.ajax({
                method: "POST",
                url: `${dominio}/agenda/mensajeprofall`,
                data: JSON.stringify({ codCur: curso,codPar: paralelo, codEmit: codigoProfesor, msg:msg, codMat:codmat}),
                contentType: "application/json",
                success:function(data){
                    if(data=="ok"){
  						$('#text-curso').val("");
  						pedirUltimoMensajeAlCurso();					
                       // alert("Mensaje enviado correctamente gol de todos: "+c_recibe+" - "+emite+"-"+msgr+"-"+materia);
                    }    
                }
                });
		}catch(error){
		    $.post(
                    "error_js.php",
                    {vista:"agenda.js",error:error.name + ' : '+error.message}
                    );
		}    
            for (var i = 0; i < lista.length; i++) {
			    getmsgalu2(lista[i],msg);
		    }
		  	return true;

	}else{

		Swal.fire("Debe seleccionar: Curso y Materia o actualizar la página");

		return false;

	}



}


/*function getmsgallclass(msg){

	if (validardatos1()&&validarmsgclass()&&lista.length>0) {

		for (var i = 0; i < lista.length; i++) {

			if(!getmsgalu2(lista[i],msg)){
				pedirUltimoMensajeAlCurso();
				//alert('Error al enviar mensages,actualizar e intentar nuevamente');	

				//return false;

			}



		}

		

		    $('#msncurso').val("");

		    $('#msnalu').val("");

		  	alert('Mensaje enviado correctamente');	

		  	return true;

	}else{

		alert('Debe seleccionar: Curso y Materia o actualizar la página');

		return false;

	}



}*/

function updateview(index){

    if (index>0 && index<=lista.length) {

        indice=index;

        var nombre;

        nombre = document.getElementById('slcalumnos');

        var valor = nombre.options[indice].text;

        document.getElementById('select2-slcalumnos-container').innerHTML = valor;

        document.getElementById('slcalumnos').selectedIndex = indice;

        getNombre();	

    }

}

function asistencia(){

	if($('#slccurso').val() !=0 ){

		location.href='asistencia_claseVirtual2.php?curso='+curso+'&paralelo='+paralelo;

	}else{

		alert('Debe seleccionar un curso');

	}

}



$(document).ready(function()

						   {

						       
						   		codigoProfesor = $('#id_usr').val();
						   		$('#fGrabar').submit((e)=>e.preventDefault());
						       init();

							   $('#btnInicio').bind('click',function(){Inicio();});

							   $('#btnAnterior').bind('click',function(){Anterior();});

							   $('#btnSiguiente').bind('click',function(){Siguiente();});

							   $('#btnFin').bind('click',function(){Fin();});		

							   

							   /* Selects */

							   $('#slccurso').change(function() {
							   		limpiarbandeja();
							       if( $("#slccurso").val() != 0 ) {

    							       index 	 = $('#slccurso').val();

    							       curso 	= listaCursos[index-1]['codcur'];

                                       paralelo = listaCursos[index-1]['codpar'];

                                       nombre_curso = listaCursos[index-1]['nombre'];

                                       //console.log(nombre_curso);
                                       $("#bandeja2").empty();
                                       $("#bandeja2").empty();




    							       obtenerMaterias(curso, paralelo);

    							       getAlumnos(curso, paralelo);

    							       cargarLista();

    							       obtenerCelulares();
    							       codcur=$('#slccurso').val();
    							       //console.log(lista);

							       }

							   });

				

							   

							   

							   $('#slcmateria').change(()=>{codmat=$('#slcmateria').val();limpiarbandeja();obtenergroup($('#slcmateria').val())});							   

							   $('#slcalumnos').change(()=>{obtenermensajes($('#slcalumnos').val());limpiarmensajes()});

							   $('#btnSalir').bind('click',function(){location.href='menu_docente.php';});

							   $('#btnprimero').bind('click',function(){updateview(1)});

							   $('#btnanterior').bind('click',function(){updateview(indice-1)});

							   $('#btnsiguiente').bind('click',function(){updateview(indice+1)});

							   $('#btnultimo').bind('click',function(){updateview(lista.length)});

							   $('#btn1').bind('click',function(){grabar(1);recargamensajes($('#slcalumnos').val());});

							   $('#btn2').bind('click',function(){grabar(2);recargamensajes($('#slcalumnos').val());});

							   $('#btn3').bind('click',function(){grabar(3);recargamensajes($('#slcalumnos').val());});

							   $('#btn4').bind('click',function(){grabar(4);recargamensajes($('#slcalumnos').val());});

							   $('#btn5').bind('click',function(){grabar(5);recargamensajes($('#slcalumnos').val());});

							   $('#btn6').bind('click',function(){grabar(6);recargamensajes($('#slcalumnos').val());});

							   $('#btn7').bind('click',function(){grabar(7);recargamensajes($('#slcalumnos').val());});

							   $('#btn8').bind('click',function(){grabar(8);recargamensajes($('#slcalumnos').val());});

							   $('#btn9').bind('click',function(){grabar(9);recargamensajes($('#slcalumnos').val());});

							   $('#btn10').bind('click',function(){grabar(10);recargamensajes($('#slcalumnos').val());});

							   $('#btn11').bind('click',function(){grabar(11);recargamensajes($('#slcalumnos').val());});

							   $('#btn12').bind('click',function(){grabar(12);recargamensajes($('#slcalumnos').val());});

							   $('#btn13').bind('click',function(){grabar(13);recargamensajes($('#slcalumnos').val());});

							   $('#btn14').bind('click',function(){grabar(14);recargamensajes($('#slcalumnos').val());});

							   $('#btn15').bind('click',function(){grabar(15);recargamensajes($('#slcalumnos').val());});

							   $('#btn16').bind('click',function(){grabar(16);recargamensajes($('#slcalumnos').val());});

							   $('#btn17').bind('click',function(){grabar(17);recargamensajes($('#slcalumnos').val());});

							   $('#btn18').bind('click',function(){grabar(18);recargamensajes($('#slcalumnos').val());});

							   $('#btn19').bind('click',function(){grabar(19);recargamensajes($('#slcalumnos').val());});

							   $('#btn20').bind('click',function(){grabar(20);recargamensajes($('#slcalumnos').val());});

							   $('#btn21').bind('click',function(){grabar(21);recargamensajes($('#slcalumnos').val());});

							   $('#btn22').bind('click',function(){grabar(22);recargamensajes($('#slcalumnos').val());});

							   $('#btn23').bind('click',function(){grabar(23);recargamensajes($('#slcalumnos').val());});

							   $('#btn24').bind('click',function(){grabar(24);recargamensajes($('#slcalumnos').val());});
                                
                               $('#btna1').bind('click',function(){grabar(25);recargamensajes($('#slcalumnos').val());});
                               $('#btna2').bind('click',function(){grabar(26);recargamensajes($('#slcalumnos').val());});
                               $('#btna3').bind('click',function(){grabar(27);recargamensajes($('#slcalumnos').val());});
                               $('#btna4').bind('click',function(){grabar(28);recargamensajes($('#slcalumnos').val());});
                               $('#btna5').bind('click',function(){grabar(29);recargamensajes($('#slcalumnos').val());});
                               $('#btna6').bind('click',function(){grabar(30);recargamensajes($('#slcalumnos').val());});
							   

							   $('#btne2').bind('click',function(){
                                    let codmat = $('#slcmateria').val();
                                    $('#btne2').prop('disabled', true);
                                    $('#btne2').removeClass("btn-send-message");
                                    $('#btne2').addClass("bloqueado");
                                    if(codmat == "0"){
                                        alert("Debe seleccionar el curso y la materia...");
                                        $('#btne2').removeClass("bloqueado");
                                        $('#btne2').addClass("btn-send-message"); 
                                        $('#btne2').prop('disabled', false);
                                        return;
                                    }
							       obtenerNombreMateria();

							       getmsgalu($('#slcalumnos').val(),$('#text-alumno').val());

							   });

							   

							   $('#btne1').bind('click',function(){
                                    let codmat = $('#slcmateria').val();
                                    if(codmat == "0"){
                                        alert("Debe seleccionar el curso y la materia...");
                                        return;
                                    }
							       obtenerNombreMateria();

							       getmsgallclass($('#text-curso').val());

							   });

							   $('#btnListAsist').bind('click',function(){asistencia()});

							   

							}

							)

