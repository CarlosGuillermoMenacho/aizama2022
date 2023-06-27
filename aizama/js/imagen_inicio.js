let id_seleccionado;
let fecha_seleccionado;
let lista=[];
const selectimg =()=>{
    $('#btn-input').click();
}

function cargaImagen(event,imagen) {
    var Imagen = event.target.files[0];
    if (Imagen.type === "image/png" || Imagen.type === "image/jpeg"|| Imagen.type === "image/jpg") {
      document.getElementById(imagen).src = URL.createObjectURL(event.target.files[0]);
    } else {
      alert("De momento solo aceptamos imágenes PNG, JPG y JPEG");
    }
}
const limpiar_form = ()=>{
    $('#fechaReg').val("");
    //$('#btn-input').val("")
    //$("img#imagen")[0].setAttribute("src","");
    $("#imagen").css("display","none")
}
const nuevaImagen = ()=>{
     limpiar_form();
    $('#guardar-form').css('display','block');
    $('#cancelar-form').css('display','block');
    $('#actualizar-form').css('display','none');
    $('#nuevo-form').css('display','none');
   
}
const validar_form = ()=>{
	let fecha = $('#fechaReg').val();
    let img = document.getElementById("imagen").src;
    let imagen = img.replace(/^.*[\\\/]/, '');
	if(fecha==""||imagen=="")return false;
	return true;
}

const obtener_imagen = (fecha_ini)=>{
   
    fecha_seleccionado = fecha_ini;
    $.post(
        "controlador/imagen_inicio_controlador.php?usr=doc&op=obtener_imagen",
        {fecha_ini:fecha_ini},
        datos=>{
            let status=datos.status;
                if (status=="ok"){
                    lista= datos.lista;
                }
               // console.log('llega');
                cargarImagen();
        },
        "json"
        );
}

const cargarImagen=()=>{
    $('.contenido-principal').css("display","block");
    $('.content').children().remove();
    if (lista.length<=0) {
        $('.content').append(
            `<div>
                <div class="divisor">
                    <div class="container">
                        <div class="wrapper">
                            <div class="image">
                                <img id="imagen">
                            </div>
                        </div>
                        <div class="seleccionar">
                            <input name="imagen" type="file" class="archivo" id="btn-input" onchange="cargaImagen(event,'imagen')" hidden>
                            <button id="file" onclick="selectimg()">Seleccionar imagen</button>
                        </div>
    
                    </div>
                <div>
            </div>`
          );        
            $('#guardar-form').css('display','block');
            $('#actualizar-form').css('display','none');
            $('#nuevo-form').css('display','none');
    }else{
        for (var i = 0; i < lista.length; i++) {
            let id=lista[i]['id'];
            let fecha = lista[i]['fecha'];
            let imagen= lista[i]['imagen'];
            let texto = lista[i]['texto'];
            id_seleccionado=id;
        $('.content').append(
            `<div>
                <div class="divisor">
                    <input type="hidden" name="id" value="${id}">
                    <div class="container">
                        <div class="wrapper">
                            <div class="image">
                                <img id="imagen" src="resources/${imagen}">
                            </div>
                        </div>
                        <div class="seleccionar">
                            <input name="imagen" type="file" class="archivo" id="btn-input" onchange="cargaImagen(event,'imagen')" hidden>
                            <button id="file" onclick="selectimg()">Seleccionar imagen</button>
                        </div>

                    </div>
                </div>
            </div>`
        );
        $('#nuevo-form').css('display','block');
        $('#guardar-form').css('display','none');
        $('#actualizar-form').css('display','block');
        $('#nuevo-form').css('display','block');
        
        } 
    }
}

const guardar_imagen = ()=>{
	if(validar_form()){
		let formData = new FormData($('#form-imagen_inicio')[0]);
		
		let request = $.ajax({
							  url: "controlador/imagen_inicio_controlador.php?usr=doc&op=guardar_imagen",
							  type: "POST",
							  data: formData,
							  processData: false,  // tell jQuery not to process the data
							  contentType: false,
							  async:false   // tell jQuery not to set contentType
							}).responseText;
                            
		if(request.trim()=="ok"){
            
			Swal.fire("Imagen guardada exitosamente");
            $('#guardar-form').css('display','none');
            $('#actualizar-form').css('display','block');
        }
        if (request=="errorCant"){
            Swal.fire("Ya hay una imagen para esta fecha");
        }
	}else{
		Swal.fire("Debe llenar los campos requeridos...");
	}
}

const eliminar_imagen = fecha_seleccionado=>{
	Swal.fire({
	    title: 'Alerta',
	    text: "Se eliminará la imagen...\ndesea continuar?",
	    icon: 'warning',
	    showCancelButton: true,
	    confirmButtonColor: '#3085d6',
	    cancelButtonColor: '#d33',
	    confirmButtonText: 'Si',
	    cancelButtonText: 'No'
	}).then((result) => {
		    if (result.isConfirmed) {
		      $.post(
					"controlador/imagen_inicio_controlador.php?usr=doc&op=eliminar_imagen",
					 {fecha_ini:fecha_seleccionado},
					data=>{
						if (data.trim()=="ok") {
							Swal.fire("Imagen eliminada exitosamente...");
                            limpiar_form();
							$('#actualizar-form').css("display","none");
                            $('#guardar-form').css("display","block");
                            
						}
					}
				);     
		    }
	}); 	
}

const editar_imagen = fecha_seleccionado=>{
	if(validar_form()){
		Swal.fire({
		    title: 'Alerta',
		    text: "Se realizarán cambios en la imagen...\ndesea continuar?",
		    icon: 'warning',
		    showCancelButton: true,
		    confirmButtonColor: '#3085d6',
		    cancelButtonColor: '#d33',
		    confirmButtonText: 'Si',
		    cancelButtonText: 'No'
		}).then((result) => {
			    if (result.isConfirmed) {
                    let formData = new FormData($('#form-imagen_inicio')[0]);
					//formData.append("id",id_seleccionado);
					let request = $.ajax({
										  url: "controlador/imagen_inicio_controlador.php?usr=doc&op=editar_imagen",
										  type: "POST",
										  data: formData,
										  processData: false,  // tell jQuery not to process the data
										  contentType: false,
										  async:false   // tell jQuery not to set contentType
										}).responseText;
					if(request=="ok"){
                        Swal.fire("Imagen actualizada exitosamente..."); 
					}   
			    }
			  }); 
	}else{
		Swal.fire("Debe llenar los campos  requeridos...");
	}
}

$(document).ready(()=>{
   $('#guardar-form').click(()=>guardar_imagen());
   $('#nuevo-form').click(()=>nuevaImagen());
   $('#actualizar-form').click(()=>editar_imagen(fecha_seleccionado));
   $('#eliminar-form').click(()=>eliminar_imagen(fecha_seleccionado));
   $('#cancelar-form').click(()=>obtener_imagen(fecha_seleccionado));
   $('.contenido-principal').css("display","none");
   $('#fechaReg').change( ()=> {
    let fecha_ini = $('#fechaReg').val();
        obtener_imagen(fecha_ini); 
})
    $('#form-imagen_inicio').submit((e)=>{e.preventDefault()}); 
});
