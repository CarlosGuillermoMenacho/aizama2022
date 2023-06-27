var lista=[];
var indice=0;
var listaCursos = [];
var listaMaterias = [];
var listaParalelos = [];

var lista_celulares = [];
var dominio = 'https://www.aizama.net'
var nombre_materia;
var nuevo_msg;
var nombre_curso='';
/* Variable*/
var curso;
var paralelo;
//var index;
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
function init(){
	$.post("obtener_cursos_adm.php?op=adm",function(respuestaRecibida){
        let response = JSON.parse(respuestaRecibida);
        if( response['status'] == 'ok' ) {
            listaCursos = response['cursos'];
            cargarCursos();           
        } else {
            alert('No hay cursos');
        }
    });
}
function cargarCursos() {
    for(let i = 0; i < listaCursos.length; i++) {
        let codigoCurso = listaCursos[i]['codigo'];
        let nombre = listaCursos[i]['nombre'];
        $('#slccurso').append(
          `<option value=${codigoCurso}>${nombre}</option>`  
        );   
    }
}

function peticionParalelos() {
    $.post("get_paralelos.php",function(respuesta){
        let response = JSON.parse(respuesta);
        if( response['status'] == 'ok' ) {
            listaParalelos = response['paralelos'];
            cargarParalelos();           
        } else {
            alert('No hay paralelos');
        }
    });   
}
function cargarParalelos() {
    for(let i = 0; i < listaParalelos.length; i++) {
        let codigoParalelo = listaParalelos[i]['codigo'];
        let nombre = listaParalelos[i]['nombre'];
        $('#slcparalelo').append(
          `<option value=${codigoParalelo}>${nombre}</option>`  
        );   
    }  
}

function cargarLista() {
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
	if ($('#slccurso').val()!=0 && $('#slcparalelo').val()!=0 && $('#slcalumnos').val()!=0) {
		return true;
	}
	return false;
}
function validardatos1(){
	if ($('#slccurso').val()!=0 && $('#slcparalelo').val()!=0) {
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
function getmsgalu(id,msg){
	if (validardatos()&&validarmsgalu()) {
	     //   alert ('aqui 1');
        var emite2 = $('#id_usr').val();
	    var selc_alumno = document.getElementById("slcalumnos");
        var nombre_alumno = selc_alumno.options[selc_alumno.selectedIndex].text;
		nuevo_msg=`Emite: ${emite2} -  Curso: ${nombre_curso} - Alumno: ${nombre_alumno} - ${msg}`;
		nuevo_msg = nuevo_msg;
	    let contactos = obtenerContactos(id);
	    console.log('Aqui 5: '+contactos);
	    contactos.forEach((contacto)=>{
	        //alert('1: '+contacto);
            if (contacto.includes('+')){
                //alert('2: '+contacto);
                contacto=contacto.slice(1);
                //alert('4: '+contacto);
                $.get(
        	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone="+contacto
        	   );
            }
            else{
                
                //alert('3: '+contacto);
                
                $.get(
        	           
        	           "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto
        	           
	            );
	            //alert('333: '+contacto);
            }
	        
	    });
	    //msg = JSON.stringify(msg);
		var formData = new FormData($("#fGrabar")[0]);
		var msgr = msg;
		var html1=$.ajax({url:"data_agenda2.php?op=getmsg&alu="+id+"&msg="+JSON.stringify(msg)+"&paralelo="+paralelo,type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
	   var html=html1.trim();
	   var e = document.getElementById("slcalumnos");
            var c_recibe = e.options[e.selectedIndex].value;
            var emite = $('#id_usr').val();
            
    		$.ajax({
                method: "POST",
                url: `${dominio}/agenda/mensajeDirAlumno`,
                data: JSON.stringify({ codEst: c_recibe, codEmit: 'administracion',nombre:emite,msg:msgr}),
                contentType: "application/json",
                success:function(data){
                    if(data=="ok"){
                        //alert("Mensaje enviado correctamente gol: "+c_recibe+" - "+emite+"-"+msgr+"-"+materia);
                        alert("Mensaje enviado correctamente");
                    }else{
                        alert('error');
                    }    
                }
                });
		if(html=='eNoResults'){
			alert('No EXISTE EL CODIGO EN EL PADRON');
			$('#vf_recinto').focus();
		  	return false;
		}
		if(html=='error'){
		  	//alert('No se pudo guardar.');
		 	return true;
		}
		if(html=='eSession'){
		  	alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
		  	return false;
		}
		if(html=='eGrabado')
		{
/*            var m = document.getElementById("slcmateria");
            var materia = m.options[m.selectedIndex].value;*/
            
            
    		
             
		  	return true;
		}
	}else{
		alert('Debe seleccionar: Curso, Paralelo y Alumnos o actualizar la pagina');
		return false;
	}
}
function remplazar(cad){
    let c = "";
    for (var i = 0; i < cad.length; i++) {
        if(cad[i] == "'"){
            c = `${c}\\${cad[i]}`;
        }else{
            c = `${c}${cad[i]}`;
        }
    } 
    
    return c;
    
}
function getmsgalu2(id,msg){
//		nuevo_msg='Materia: '+nombre_materia+' - '+msg;
        var emite2 = $('#id_usr').val();
		nuevo_msg='Emite: '+emite2+': Curso: '+nombre_curso+' - '+msg;
        var selc_alumno = document.getElementById("slcalumnos");
        var nombre_alumno = selc_alumno.options[selc_alumno.selectedIndex].text;
        let contactos = obtenerContactos(id);
	    console.log(contactos);
	    contactos.forEach((contacto)=>{
            //alert('1: '+contacto);
            if (contacto.includes('+')){
                //alert('2: '+contacto);
                contacto=contacto.slice(1);
                //alert('4: '+contacto);
                $.get(
        	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone="+contacto
        	   );
            }
            else{
                //alert('3: '+contacto);
    	        $.get(
        	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto
	            );
            }

	    });
	         //   "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto
      
		var formData = new FormData($("#fGrabar")[0]);
        var html1=$.ajax({url:"data_agenda2.php?op=getmsg&alu="+id+"&msg="+msg+"&paralelo="+paralelo,type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
		var html = html1.trim();
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
            /*var c_recibe = id;
		    var xhttp=new XMLHttpRequest();
		    xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    console.log(this.responseText);
                }
		     }
		     console.log(c_recibe);
		     xhttp.open('GET', `${dominio}/chat/nuevo?recibe=${c_recibe}`, true);
             xhttp.send();*/
             
            
    		/*$.ajax({
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
                });*/

		  	return true;
		}
}

function grabar(idq)
{
    let codi_alu =$('#slcalumnos').val();
    console.log('1er Codigo alumno: '+codi_alu);

	if (validardatos()) {

    	var formData = new FormData($("#fGrabar")[0]);
    	var html1=$.ajax({url:"data_agenda2.php?op=save&obs="+idq,type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
    	var html=html1.trim();
    	console.log('Aqui 1: '+html);
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
    		nuevo_msg='Emite: '+emite+': Curso: '+nombre_curso+' - '+msgr;
            var selc_alumno = document.getElementById("slcalumnos");
            var nombre_alumno = selc_alumno.options[selc_alumno.selectedIndex].text;
            let contactos = obtenerContactos(codi_alu);
            console.log('Codigo alumno: '+codi_alu);
    	    console.log('Aqui 2 Contactos: '+contactos);
    	    contactos.forEach((contacto)=>{
    	        //alert('1: '+contacto);
                if (contacto.includes('+')){
                    //alert('2: '+contacto);
                    contacto=contacto.slice(1);
                    //alert('4: '+contacto);
                    $.get(
            	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone="+contacto
            	   );
                }
                else{
                    //alert('3: '+contacto);
        	        $.get(
            	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto
    	            );
                }
    	        
    	    });

    		var e = document.getElementById("slcalumnos");
            var c_recibe = e.options[e.selectedIndex].value;
    		$.ajax({
                method: "POST",
                url: `${dominio}/agenda/mensajeDirAlumno`,
                data: JSON.stringify({ 
                    codEst: c_recibe,
                    codEmit: 'administracion',
                    msg:msgr,
                    nombre:emite
                }),
                contentType: "application/json",
                success:function(data){
                    if(data=="ok"){
                        Swal.fire(
                          'Mensaje Enviado!',
                          'presiona ok para salir',
                          'success'
                        );
                    }else{
                        alert('error2424');
                    }    
                }
                }); 
    		  
    		return true;
		}
	}else{
		alert('Debe seleccionar: Curso, Paralelo y Alumno o actualice la pagina');
		return false;
	}
}

function getmsgallclass(msg){
	if (validardatos1()&&validarmsgclass()&&lista.length>0) {
		for (var i = 0; i < lista.length; i++) {
			if(!getmsgalu2(lista[i],msg)){
				alert('Error al enviar mensages,actualizar e intentar nuevamente');	
				return false;
			}
		}
	let nombreEmitente = $('#id_usr').val();;
	    var html1=$.ajax({
	                        url:`${dominio}/agenda/mensajeDirCurso`,
	                        type: "POST",
	                        data: JSON.stringify({ 
                                codCur:curso,
                                codPar:paralelo ,
                                codEmit:'administracion',
                                nombre:nombreEmitente  ,
                                msg: msg
                            }),
                        contentType: "application/json",
                        success:function(data){
                            if(data=="ok"){
                                Swal.fire(
                                  'Mensaje Enviado!',
                                  'presiona ok para salir',
                                  'success'
                                );
                            }else{
                                alert('error2424');
                            }    
                        }
                });
		    $('#msncurso').val("");
		    $('#msnalu').val("");
		  	alert('Mensaje enviado correctamente');	
		  	return true;
	}else{
		alert('Debe seleccionar: Curso y Paralelo o actualizar la página');
		return false;
	}

}
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
		location.href='view_lista_asistentes.php?curso='+curso+'&paralelo='+paralelo;
	}else{
		alert('Debe seleccionar un curso');
	}
}
function obtenerNombreCurso(){
	let codcur = $('#slccurso').val();
	for(let i = 0; listaCursos.length; i++){
		if(listaCursos[i].codigo==codcur){
			nombre_curso = listaCursos[i].nombre;
			return;
		}

	}
}
function obtenerContactos (codalu){
    let lista2 = [];
    console.log('Aqui 3: '+lista_celulares);
    lista_celulares.forEach((celular)=>{
        if(celular.codalu==codalu){
            lista2.push(celular.celular);
        }
        
    });
    return lista2;
}

$(document).ready(function()
						   {
						       
						       init();
							   $('#btnInicio').bind('click',function(){Inicio();});
							   $('#btnAnterior').bind('click',function(){Anterior();});
							   $('#btnSiguiente').bind('click',function(){Siguiente();});
							   $('#btnFin').bind('click',function(){Fin();});		
							   
							   /* Selects */
							   $('#slccurso').change(function() {
							       $('#slcparalelo').empty();
							       $('#slcparalelo').append(`<option value="0">-- Seleccionar paralelo --</option>`);
							       if( $("#slccurso").val() != 0 ) {
							            peticionParalelos();
							            obtenerNombreCurso();
							            //nombre_curso = listaCursos[i]['nombre'];
                                        console.log(nombre_curso);


							       }
							   });

							   $('#slcparalelo').change(function() {
							       if( $("#slcparalelo").val() != 0 ) {
       							       curso = $('#slccurso').val();
                                       paralelo = $('#slcparalelo').val();
    							       getAlumnos(curso, paralelo);
    							       cargarLista();							            
    							       obtenerCelulares();
    							       console.log('Aqui 4:'+lista);

							       }
							   });

							   $('#btnSalir').bind('click',function(){location.href='menu_docente.php';});
							   $('#btnprimero').bind('click',function(){updateview(1)});
							   $('#btnanterior').bind('click',function(){updateview(indice-1)});
							   $('#btnsiguiente').bind('click',function(){updateview(indice+1)});
							   $('#btnultimo').bind('click',function(){updateview(lista.length)});
							   $('#btn1').bind('click',function(){grabar(1);});
							   $('#btn2').bind('click',function(){grabar(2);});
							   $('#btn3').bind('click',function(){grabar(3);});
							   $('#btn4').bind('click',function(){grabar(4);});
							   $('#btn5').bind('click',function(){grabar(5);});
							   $('#btn6').bind('click',function(){grabar(6);});
							   $('#btn7').bind('click',function(){grabar(7);});
							   $('#btn8').bind('click',function(){grabar(8);});
							   $('#btn9').bind('click',function(){grabar(9);});
							   $('#btn10').bind('click',function(){grabar(10);});
							   $('#btn11').bind('click',function(){grabar(11);});
							   $('#btn12').bind('click',function(){grabar(12);});
							   $('#btn13').bind('click',function(){grabar(13);});
							   $('#btn14').bind('click',function(){grabar(14);});
							   $('#btn15').bind('click',function(){grabar(15);});
							   $('#btn16').bind('click',function(){grabar(16);});
							   $('#btn17').bind('click',function(){grabar(17);});
							   $('#btn18').bind('click',function(){grabar(18);});
							   $('#btn19').bind('click',function(){grabar(19);});
							   $('#btn20').bind('click',function(){grabar(20);});
							   $('#btn21').bind('click',function(){grabar(21);});
							   $('#btn22').bind('click',function(){grabar(22);});
							   $('#btn23').bind('click',function(){grabar(23);});
							   $('#btn24').bind('click',function(){grabar(24);});
							   
							   $('#btne2').bind('click',function(){
							       getmsgalu($('#slcalumnos').val(),$('#msnalu').val());
							   });
							   
							   $('#btne1').bind('click',function(){getmsgallclass($('#msncurso').val());});
							   $('#btnListAsist').bind('click',function(){asistencia()});
							}
							)
