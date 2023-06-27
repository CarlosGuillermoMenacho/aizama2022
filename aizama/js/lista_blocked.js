let lista_preinscritos = [];
let lista_bloqueads = [];
let div_tabla;
let div_alerta;

let btn_bloqueo;
let btn_pre_inscritos;

const no_inscritos = () => {
	$.post(
			'controlador/preinscripcion_controlador.php?op=no_inscritos',
			data=>{
				div_tabla.innerHTML = "";
				if(data.status=="ok"){
					let filas = "";
					let lista = data.lista;
					let index = 1;
					lista.forEach(fila=>{
						
						filas = filas+`<tr>
											<td>${index}</td>
											<td class="b-name">${fila.nombre}</td>
											
										</tr>`;
						index++;
					});
					if(lista.length == 0 ){
						div_tabla.classList.add('oculto');
						div_alerta.innerHTML = "NO HAY REGISTROS";
						div_alerta.classList.remove('oculto');
						return;
					}
					div_tabla.classList.remove('oculto');
					div_alerta.classList.add('oculto');
					div_tabla.innerHTML = `<div class="table-title" id="table-title">No Continuar&aacute;n</div>
												<div class="div-content-table" id="tabla">
													<table class="table">
														<thead>
															<tr class="t-header">
																<td class="index">Nro.</td>
																<td class="h-name">Nombre</td>
															</tr>
														</thead>
														<tbody>
															${filas}
														</tbody>
													</table>
												</div>
											</div>`
				}
			},
			"json"
			);

}
const preinscritos = () => {
	$.post(
			'controlador/preinscripcion_controlador.php?op=pre_inscritos',
			data=>{
				div_tabla.innerHTML = "";
				if(data.status=="ok"){
					let filas = "";
					let lista = data.lista;
					let index = 1;
					lista.forEach(fila=>{
						let modalidad = "";
						if (fila.inscripcion == 1) {
							modalidad = '<td class="b-name">Presencial</td>';
						}else{
							modalidad = '<td class="b-name">Virtual</td>';
						}
						filas = filas+`<tr>
											<td>${index}</td>
											<td class="b-name">${fila.nombre}</td>
											${modalidad}
										</tr>`;
						index++;
					});
					if(lista.length == 0 ){
						div_tabla.classList.add('oculto');
						div_alerta.innerHTML = "NO HAY REGISTROS";
						div_alerta.classList.remove('oculto');
						return;
					}
					div_tabla.classList.remove('oculto');
					div_alerta.classList.add('oculto');
					div_tabla.innerHTML = `<div class="table-title" id="table-title">CONFIRMADOS</div>
												<div class="div-content-table" id="tabla">
													<table class="table">
														<thead>
															<tr class="t-header">
																<td class="index">Nro.</td>
																<td class="h-name">Nombre</td>
																<td class="h-name">Modalidad</td>
															</tr>
														</thead>
														<tbody>
															${filas}
														</tbody>
													</table>
												</div>
											</div>`
				}
			},
			"json"
			);

}
const bloqueados = () =>{
	$.get(
			'controlador/bloked_preisncripcion_controlador.php?op=get_lista',
			data => {
				div_tabla.innerHTML = "";
				if (data.status=="ok") {
					let filas = "";
					let lista = data.lista;
					lista_bloqueados = data.bloqued;
					div_tabla.classList.remove('oculto');
					div_alerta.classList.add('oculto');
					let index = 1;
					lista.forEach( fila => {
						let codalu = fila.codigo;
						if(esta_bloqueado(codalu)){
							filas = filas + `<tr>
												<td>${index}</td>
												<td class="b-name">${fila.paterno+' '+fila.materno+' '+fila.nombres}</td>
												<td class="b-bloqueo">
													<input type="checkbox" name="bloqueo" checked onclick="checkar(this,${codalu});">
													<div id="al${codalu}">Si</div>
												</td>
											</tr>`;
						}else{
							filas = filas + `<tr>
												<td>${index}</td>
												<td class="b-name">${fila.paterno+' '+fila.materno+' '+fila.nombres}</td>
												<td class="b-bloqueo">
													<input type="checkbox" name="bloqueo" onclick="checkar(this,${codalu});">
													<div id="al${codalu}">No</div>
												</td>
											</tr>`;
						}
						index++;
					});

					div_tabla.innerHTML = `<div class="table-title" id="table-title">BLOQUEADOS</div>
											<div class="div-content-table" id="tabla">
												<table class="table">
													<thead>
														<tr class="t-header">
															<td class="index">Nro.</td>
															<td class="h-name">Nombre</td>
															<td class="h-opcion">Bloqueado</td>
														</tr>
													</thead>
													<tbody>
														${filas}
													</tbody>
												</table>
											</div>`;


				}
			},
			"json"
			);
}
const esta_bloqueado = codalu =>{
	for (var i = 0; i < lista_bloqueados.length; i++) {
		if(lista_bloqueados[i].codalu == codalu)return true;
	}

	return false;
}
const checkar = (e,codalu)=>{
	let bloqueo = e.checked?1:0;
	$.post(
		'controlador/bloked_preisncripcion_controlador.php?op=bloqueo',
		{codalu:codalu,bloqueo:bloqueo},
		data => {
			if (data.trim()=="ok") {
				bloqueados();
				//alert("Éxito...");
			}

			if (data=="eSession") {
				location.href = 'administracion.php';
			}
		},
		"text"
		)
}
$(document).ready(()=>{
	div_tabla = document.getElementById('div-tabla');

	btn_bloqueo = document.getElementById('btn-bloqueo');
	btn_no_continuaran = document.getElementById('btn-no-continuaran');
	btn_pre_inscritos = document.getElementById('btn-pre-inscritos');
	btn_bloqueo.addEventListener('click',()=>bloqueados());
	btn_pre_inscritos.addEventListener('click',()=>preinscritos());
	btn_no_continuaran.addEventListener('click',()=>no_inscritos());
	div_alerta = document.getElementById('alerta');
	preinscritos();
});