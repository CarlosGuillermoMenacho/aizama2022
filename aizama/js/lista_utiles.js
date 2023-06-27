let listas = [];
let materias = [];
let curso;
let div_listas;
const lista = nivel=>{
	listas = [];
	materias = [];
	curso = "";
	$.post(
		"controlador/lista_utiles_controlador.php",
		{curso:nivel},
		data=>{
			if(data.status=="ok"){			
				listas = data.listas;
				materias = data.materias;
				curso = data.curso;
				
				paralelo(1);
			}
		},
		"json"

		);
}
const mostrarBtnParalelos =() => {
	for (var i = 0; i < listas.length; i++) {
		if(listas[i].cod_par == "2")return true;
	}
	/*listas.forEach(fila=>{
		if(fila.cod_par=="2"){
			console.log(fila.cod_par);
			
		}
	});*/
	return false;
}
const paralelo = codpar=>{
	if (listas.length == 0) {
		Swal.fire('No hay lista de útiles para este curso...');
		return;
	}
	div_listas = document.getElementById('listas');
	div_listas.innerHTML = "";
	let div_cabecera = document.createElement('div');
	div_listas.appendChild(div_cabecera);
	div_cabecera.classList.add('cabecera_listas');
	div_cabecera.innerHTML = `<div class="nombre_curso" id="nombre_curso">${curso}</div>
							  <div class="btn_cerrar" onclick="cerrarListas();"><img src="svg/close.svg"></div>`;
	let div_bloque_lista = document.createElement('div');
	div_bloque_lista.classList.add('bloque_lista');
	if(mostrarBtnParalelos()){
		let div_btn_paralelo = document.createElement('div');
		div_btn_paralelo.classList.add('btn_paralelo');
		if(codpar == "2"){
			div_btn_paralelo.innerHTML = `<button class="btn-paralelo borderA" onclick="paralelo(1);">Paralelo A</button>
										  <button class="btn-paralelo borderB selected" onclick="paralelo(2);">Paralelo B</button>`;
		}else{
			div_btn_paralelo.innerHTML = `<button class="btn-paralelo borderA selected" onclick="paralelo(1);">Paralelo A</button>
										  <button class="btn-paralelo borderB" onclick="paralelo(2);">Paralelo B</button>`;
		}
		div_bloque_lista.appendChild(div_btn_paralelo);
	}
	listas.forEach(fila =>{
		if(fila.cod_par == codpar){
			let materia = materias[fila.codmat].nombre;
			let lista = fila.lista;
			let div_bloque_materia = document.createElement('div');
			div_bloque_materia.classList.add('bloque_materia');
			div_bloque_materia.innerHTML = materia;
			div_bloque_lista.appendChild(div_bloque_materia);
			let div_content_list = document.createElement('div');
			div_content_list.classList.add('content_lista');
			let textarea = document.createElement('p');
			textarea.innerHTML = lista;
			
			div_content_list.appendChild(textarea);
			div_bloque_lista.appendChild(div_content_list);

		}
	});
	div_listas.appendChild(div_bloque_lista);
	let li = document.getElementById('listas');
	li.classList.remove('oculto');
	let cur = document.getElementById('selec_nivel');
	cur.classList.add('oculto');
}
const cerrarListas = ()=>{
	let li = document.getElementById('listas');
	li.classList.add('oculto');
	let cur = document.getElementById('selec_nivel');
	cur.classList.remove('oculto');
}
$(document).ready(()=>{
	//lista(20);
});