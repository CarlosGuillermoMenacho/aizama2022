<?php
session_start();
    if ($_SESSION['app_user_nivel']=='portero'){
        require 'header_por.php';
    }else{
        if($_SESSION['app_user_id']==16){
            require 'header_dir.php';
        }else{
            require 'header_adm.php';
        }
        
    }
?>
 <style type="text/css">
  .slcCamera{
  	display: grid;
  	grid-template-columns: 95%;
    width: 95%;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .reader{
  	width: 95px;
  	margin-top: 15px;
  }
  .btnStop{
  	text-align: center;
  }
  .btnStart{
  	text-align: center;
  }
  .btnStop button{
  	width: 150px;
  	padding: 10px;
  	border-radius: 5px;
  	border: 1px solid #000;
  }
  .title{
  	text-align: center;
  	font-size: 1.5em;
  	margin-top: 15px;
  }
  .btnStart button{
  	width: 150px;
  	padding: 10px;
  	border-radius: 5px;
  	border: 1px solid #000;
  }
</style>
<div class="title">
	REGISTRO DE INGRESO
</div>
<div class="slcCamera">
  <select id="slc-Camera"><option value="">Seleccionar Cámara</option></select>
</div>
<div id="reader"></div>
<div class="btnStop" style="display:none;"><button id="btn-stop">STOP</button></div>
<div class="btnStart" style="display:none;"><button id="btn-start">START</button></div>
<script type="text/javascript" src="js/jquery.min.js"></script>
<script src="js/html5-qrcode.min.js"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />

<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>
<script type="text/javascript">
	let dominio = "https://www.comunidadcristianatm.com";
	$(document).ready(()=>{
	$('#slc-Camera').select2();
	$('#slc-Camera').change(()=>{
		let slcCamera = document.getElementById('slc-Camera');
        let cameraId = slcCamera.value;
        //console.log(devices.label);
        if(cameraId!=""){
          //starScanning(cameraId);
          $('.btnStart').css("display","block");

        }else{
        	html5QrCode.stop();
        	$('#reader').empty();
			$('.btnStop').css("display","none");
			$('.btnStart').css("display","none");
        }

	});
	$('#btn-stop').click(()=>{
		html5QrCode.stop();
		$('#reader').empty();
		$('.btnStop').css("display","none");
		$('.btnStart').css("display","block");


	});
	$('#btn-start').click(()=>{
		let slcCamera = document.getElementById('slc-Camera');
        let cameraId = slcCamera.value;
		starScanning(cameraId);
		$('.btnStop').css("display","block");
		$('.btnStart').css("display","none");


	});
})
  const html5QrCode = new Html5Qrcode("reader");
  Html5Qrcode.getCameras().then(devices => {
    /**
     * devices would be an array of objects of type:
     * { id: "id", label: "label" }
     */
    if (devices && devices.length) {
      var cameraId = devices[0].id;
      let slcCamera = document.getElementById('slc-Camera');
      devices.forEach(camera=>{
        let option = document.createElement('option');
        option.value = camera.id;
        option.innerHTML = camera.label;
        slcCamera.appendChild(option);
      });

      //starScanning(cameraId);
      // .. use this to start scanning.
    }
  }).catch(err => {
    // handle err
  });
const starScanning = cameraId =>{
  html5QrCode.stop();
  html5QrCode.start(
  cameraId,     // retreived in the previous step.
  {
    fps: 10,    // sets the framerate to 10 frame per second
    qrbox: 250  // sets only 250 X 250 region of viewfinder to
                // scannable, rest shaded.
  },
  qrCodeMessage => {
    // do something when code is read. For example:
    enviarMensaje(qrCodeMessage);
    console.log(`QR Code detected: ${qrCodeMessage}`);
    alert(`QR Code detected: ${qrCodeMessage}`);
    
    
  },
  errorMessage => {
    // parse error, ideally ignore it. For example:
   // console.log(`QR Code no longer in front of camera.`);
  })
.catch(err => {
  // Start failed, handle it. For example,
  //console.log(`Unable to start scanning, error: ${err}`);
});
}
const horaServidor = async ()=>{
  let result;
  await $.get(
              "fechaCompleta.php",
              fecha=>{
                result = fecha;
              },
              "text");
  return result;
}
const enviarMensaje = async mensaje=>{
    let substrings = mensaje.split(",");
    console.log(substrings);

    let codigo = substrings[0];
    var html=$.ajax({type:"GET",url:'reg_hora_entrada.php',data:{id:codigo},async:false}).responseText;
    	let fecha = await horaServidor();
	    let contactos = await obtenerCelularTutor(codigo);
	    await $.post( 
	            "controlador/alumno_controlador.php?op=getAlumnoNombreCurso&usr=adm",
	            {codalu:codigo},
	            datos=>{
	              if(datos.status=="ok"){
	                let nombre = datos.nombre;
	                let curso = datos.curso;
	                
	                let msg = `${fecha} - ${nombre} - ${curso} - El alumno ha ingresado al colegio...`;
	                contactos.forEach(contacto=>{
	                	if (contacto.celular!="") {
	                		 $.get(
		                      `https://www.comunidadcristianatm.com/aizama/whatsapp_msg.php?text=${msg}&phone=591${contacto.celular}`
		                      );
	                	}

	                })
	               
	              }
	            },
	            "json"
	            );
	    	var c_recibe = codigo;
            var emite = "administracion";
            let nombre = "Sistema";
            let msgr = `${fecha} - El estudiante ha ingresado al colegio`;
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

        
}
const obtenerCelularTutor = async alucod=>{
					//	alert('Hola 2 - Cod alumno: '+alucod);
	let lista = [];
    await $.post(
            "data_agenda.php?op=obtener_cel_tutor",
            {codpar:alucod},
            (datos,estado,xhr)=>{				
                let status = datos.status;				
                if(status=="ok"){
                    lista = datos.lista;
                }
            },
            'json'
        );
    return lista;
}
 </script>
