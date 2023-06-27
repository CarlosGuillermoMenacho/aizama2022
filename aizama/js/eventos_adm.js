let datos_obtenidos = [];
let size_window = 0;
let window_mobil = false;
let item_select;
let form_activo = false;
const obtener_eventos = ()=>{
	$.post(
		"controlador/eventos_controlador.php?usr=adm&op=get_eventos",
		data =>{
			datos_obtenidos = data;
			mostrar_datos(datos_obtenidos);
		},
		"json"
	);
}
const mostrar_tabla = ()=>{
	$('#btn-nuevo').css('display','block');
	if(window_mobil){
		$('#conten-tabla-mobil').css('display','block');
		$('#div-eventos').css('display','none');
	}else{
		$('#div-eventos').css('display','block');
		$('#conten-tabla-mobil').css('display','none');
	}
	$('#div-formulario').css('display','none');
	$('#btn-guardar').css('display','none');
	$('#btn-actualizar').css('display','none');
}
const mostrar_datos = datos =>{
	if (size_window>400 && !window_mobil) {
		window_mobil = false;
		
		$('#div-eventos').empty();
		$('#div-eventos').append(
								`<div class="head-tabla">
									<div class="nro">Nro.</div>
									<div class="descripcion">Descripción</div>
									<div class="fecha">Fecha</div>
									<div class="opcion">Opciones</div>
								</div>`
								);
		let indice = 1;
		datos.forEach(evento=>{
			$('#div-eventos').append(
									`<div class="item">
										<div class="nro">${indice}</div>
										<div class="descripcion-item">${evento.descripcion}</div>
										<div class="fecha">${evento.fecha}\n${evento.horai}-${evento.horaf}</div>
										<div class="opcion-item">
											<img class="pointer-hover" src="svg/close.svg" onclick="delete_item(${evento.id})">
											<img class="pointer-hover" src="svg/edit-2.svg" onclick="edit_item(${evento.id})">
											<!--img class="pointer-hover" src="svg/world.svg"-->
										</div>
									</div>`
									);
			indice++;
		});
	}
	if (size_window<=400 && window_mobil) {
		window_mobil = true;
		$('#conten-tabla-mobil').empty();
		
		let indice = 1;
		datos.forEach(fila=>{
			$('#conten-tabla-mobil').append(
														`<div class="tabla-mobil">
															<div class="item-mobil">
																<div class="index-icon"><label>${indice}</label></div>
															</div>
															<div class="div-descripcion-mobil">
																<div class="label-descripcion">Descripción de la Actividad</div>
																<p class="descripcion-p">${fila.descripcion}</p>
															</div>
															<div class="fecha-mobil">
																<div class="label-fecha">Fecha:</div>
																<div class="data-fecha">${fila.fecha}</div>
																<div class="label-fecha">de</div>
																<div class="data-fecha">${fila.horai} hrs.</div>
																<div class="label-fecha">a </div>
																<div class="data-fecha">${fila.horaf} hrs.</div>
															</div>

															<div class="opciones-mobil1">
																<div><img class="pointer-hover" src="svg/close.svg" onclick="delete_item(${fila.id})"><div>Eliminar</div></div>
																<div><img class="pointer-hover" src="svg/edit-2.svg" onclick="edit_item(${fila.id})"><div>Editar</div></div>
																<div><!--img class="pointer-hover" src="svg/world.svg"><div>Enlace</div--></div>
															</div>
														</div>`

														);
			indice++;
		});

	}
	mostrar_tabla();

}
const delete_item = id =>{
	Swal.fire({
    title: '¿Estás seguro?',
    text: "Se eliminará el evento",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      $.post(
      		"controlador/eventos_controlador.php?usr=adm&op=delete_evento",
      		{id:id},
      		data=>{
      			if(data=="ok"){
      				Swal.fire("Evento eliminado..!!!");

      			}else{
      				Swal.fire("No se pudo eliminar el evento !!!");
      			}
      			obtener_eventos();
      		},
      		"text"
      		);      
    }
  }); 
}
const edit_item = id =>{
	let datos_item = get_item(id);
	item_select = id;
	if(datos_item.length==0)return;

	$('#btn-nuevo').css('display','none');
	$('#div-eventos').css('display','none');
	$('#div-formulario').css('display','block');
	$('#btn-guardar').css('display','none');
	$('#btn-actualizar').css('display','inline-block');
	$('#textarea-descripcion').val(datos_item.descripcion);
	$('#fecha-form').val(datos_item.fecha);
	$('#horai-form').val(datos_item.horai);
	$('#horaf-form').val(datos_item.horaf);
}
const get_item = id =>{
	for (var i = 0; i < datos_obtenidos.length; i++) {
		if(datos_obtenidos[i].id == id){
			return datos_obtenidos[i];
		}
	}
	return [];
}
const limpiar_form = ()=>{
	$('#textarea-descripcion').val("");
	$('#fecha-form').val("");
	$('#horai-form').val("");
	$('#horaf-form').val("");
	$('#textarea-from').val("");
}
const validar_form = ()=>{
	let descripcion = $('#textarea-descripcion').val();
	let fecha = $('#fecha-form').val();
	let inicio = $('#horai-form').val();
	let fin = $('#horaf-form').val();
	let enlace = $('#textarea-from').val();

	if(descripcion==""||fecha==""||inicio==""||fin==""){
		return false;
	}
	return true;
}
const save_evento = ()=>{
	if(validar_form()){
		let descripcion = $('#textarea-descripcion').val();
		let fecha = $('#fecha-form').val();
		let inicio = $('#horai-form').val();
		let fin = $('#horaf-form').val();
		let enlace = $('#textarea-from').val();
		$.post(
			"controlador/eventos_controlador.php?usr=adm&op=nuevo_evento",
			{descripcion:descripcion,fecha:fecha,inicio:inicio,fin:fin,enlace:enlace},
			data=>{
				if (data=="ok") {
					Swal.fire("Evento registrado exitosamente...!!!");
					limpiar_form();
				}
				if (data=="error") {
					Swal.fire("Hubo un error no se pudo guardar el evento vuelve a intentar...!!!");
				}
				obtener_eventos();
			},
			"text"
			);
	}else{
		Swal.fire("Debe llenar los campos requeridos...");
	}
}
const actualizar_item = ()=>{
	if(validar_form()){
		let descripcion = $('#textarea-descripcion').val();
		let fecha = $('#fecha-form').val();
		let inicio = $('#horai-form').val();
		let fin = $('#horaf-form').val();
		let enlace = $('#textarea-from').val();
		$.post(
			"controlador/eventos_controlador.php?usr=adm&op=update_evento",
			{id:item_select,descripcion:descripcion,fecha:fecha,inicio:inicio,fin:fin},
			data=>{
				if (data=="ok") {
					Swal.fire("Evento actualizado exitosamente...!!!");
					limpiar_form();
				}
				if (data=="error") {
					Swal.fire("Hubo un error no se pudo guardar el evento vuelve a intentar...!!!");
				}
				obtener_eventos();
			},
			"text"
			);
	}else{
		Swal.fire("Debe llenar los campos requeridos...");
	}

}
$(document).ready(()=>{
	size_window = window.innerWidth;
	if(!form_activo){
	    if (size_window>400) {
		    window_mobil = false;
    	}else{
    		window_mobil = true;
    	}    
	}
	
	obtener_eventos();
	window.addEventListener('resize',()=>{
		size_window = window.innerWidth;
		if(!form_activo){
		   if (size_window>400) {
    			window_mobil = false;
    		}else{
    			window_mobil = true;
    		}
    		mostrar_datos(datos_obtenidos); 
		}
		
	})
	
	$('#btn-nuevo').click(()=>{
		limpiar_form();
		$('#btn-nuevo').css('display','none');
		$('#div-eventos').css('display','none');
		$('#div-formulario').css('display','block');
		$('#btn-guardar').css('display','inline-block');
		$('#btn-actualizar').css('display','none');
		form_activo = true;
		
	})
	$('#btn-cancelar').click(()=>{
	    form_activo = false;
		obtener_eventos();
		limpiar_form();
		$('#btn-nuevo').css('display','block');
		$('#div-eventos').css('display','block');
		$('#div-formulario').css('display','none');
	})
	$('#btn-guardar').click(()=>{save_evento();})
	$('#btn-actualizar').click(()=>{actualizar_item()});
});