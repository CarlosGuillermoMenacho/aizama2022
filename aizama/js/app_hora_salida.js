var codalu; 
var dominio = 'https://www.aizama.net';
function isKeyEnter(e)
{
	var evt=e?e:event;
	var key=window.Event?evt.which:evt.keyCode;
	if(key==13)	return true;return false;
}
let nombre_alumno;
let nombre_curso;
let lista_celulares=[];
function validar_alumno(cod){
//	var html=$.ajax({type:"GET",url:'get_alumno.php',data:{id:cod},async:false}).responseText;
//	if (html=='eNoResults') {
//		return false;
//	}
//	codalu=html;
	return true;
}

function getalu(e,param)
{
	param = param.toUpperCase();
	if(isKeyEnter(e))
	{
		if (validar_alumno(param))
		{
			$('#nomalu').val(codalu);
			$('#btngrabar').focus();
			return true;
		}else{
			alert('El codigo ingresado no está en el sistema.');
		}

	}
	return false;
}
function grabar(){
//	alert('1');

	if (validar_alumno($('#codalu').val())) {
//		alert('2');
		var html=$.ajax({type:"GET",url:'reg_hora_salida.php',data:{id:$('#codalu').val()},async:false}).responseText;
//		alert('3');
		if (html=='error') {
			alert("Error no se pudo registrar la salida");
			return false;
		}
		if (html=='eYaGrabado') {
			alert('Ya registro su salida anteriormente');
			return false;
		}
		if (html=='eGrabado') {
		//	$('#codalu').val("");
		//	$('#nomalu').val("");
		//	$('#codalu').focus();
		    getmsgalu();
			alert('Grabado con Exito');
			return true;
		}

	}else{
		alert("Debe ingresar un codigo valido");
		return false;
	}
}
function getfecha(){
    let f = new Date();
    let y = f.getFullYear();
    let m = (f.getMonth()+1);
    let d = f.getDate();
    if(m<10){
        if(d<10){
            return '0'+d+'-0'+m+'-'+y;
        }else{
            return d+'-0'+m+'-'+y;
        }
    }else{
        if(d<10){
            return '0'+d+'-'+m+'-'+y;
        }else{
            return d+'-'+m+'-'+y;
        }
    }
}
function gethora(){
    let f = new Date();
    let h = f.getHours();
    let m = f.getMinutes();
    
    if(h<10){
        if(m<10){
            return '0'+h+':0'+m;
        }else{
            return '0'+h+':'+m;
        }
    }else{
        if(m<10){
            return h+':0'+m;
        }else{
            return h+':'+m;
        }
    }
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
    let lista2 = [];
    console.log(lista_celulares);
    lista_celulares.forEach((celular)=>{
        if(celular.codalu==codalu){
            lista2.push(celular.celular);
        }
        
    });
    return lista2;
}
function getmsgalu(){
     $.get(
        "horaServidor.php",
            (horaServidor)=>{
            //let hora = gethora();
            var msgr = "Hora de salida del colegio: "+horaServidor;
            nuevo_msg='Curso: '+nombre_curso+' - Alumno: '+nombre_alumno+' - '+msgr;
    	    let contactos = obtenerContactos(codalu);
    	    console.log(contactos);
    	    contactos.forEach((contacto)=>{
    	        $.get(
    	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto
    	            );
    	        
    	    });
            var c_recibe = codalu;
            var emite = "administracion";
            let nombre = "Sistema";
            //var fecha = getfecha();
            
            
            
            
    		$.ajax({
                method: "POST",
                url: `${dominio}/agenda/mensajeIngreso`,
                data: JSON.stringify({ codEst: c_recibe, codEmit: emite,msg:msgr,nombre:nombre}),
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
            },"text");
		  	return true;
	
}
$(document).ready(function()
						   {
						       nombre_alumno = $('#nombre_alumno').val();
						       nombre_curso = $('#nombre_curso').val();
						       codalu = $('#codalu').val();
						       obtenerCelularTutor(codalu);
						       let nivelAlumno = $('#nivel_alumno').val();
							   $('#btnsalir').bind('click',function(){
    						       if(nivelAlumno == 'SECUNDARIA') {
    						           location.href = 'inicios_sec.php';	           
    						       } else if(nivelAlumno == 'PRIMARIA') {
							           location.href = 'inicios_prim.php';
    						       }
							   });
                                
							   $('#btngrabar').bind('click',function(){grabar();});
							}
							)

