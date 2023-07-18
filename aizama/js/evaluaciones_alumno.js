let lista_alumnos = [];
let lista_practicos = [];
let select;
let button_seletc = "pendientes";
let content_table;
let title_table;
let btnPendiente;
let btnPresentados;
const get_practicos = ()=>{
	$.get(
		'controlador/evaluacionSeleccion_controlador2.php?usr=tut&op=eval_alu',
		data => {
			if(data.status == "ok"){
				lista_alumnos = data.alumnos;
				lista_practicos = data.practicos;
				//cargarSelect();
                mostrarPracticos();
			}
			if (data.status == "eSession") {
				location.href = "usuario.php";
			}
		},"json"

	);
}

const cargarSelect = ()=>{
	lista_alumnos.forEach(alumno=>{
		codalu = alumno.codalu;
		nombre = alumno.nombre;

		let op = document.createElement('option');
		op.value = codalu;
		op.text = nombre;

		select.appendChild(op);
	});

}

const mostrarPracticos = ()=>{
	if(button_seletc == "pendientes"){
		btnPendiente.classList.add('selected');
		btnPresentados.classList.remove('selected');
		title_table.innerHTML = "Evaluaciones pendientes a realizar";
		content_table.innerHTML = "";
		let codalu = lista_alumnos[0].codalu;
		if(codalu == 0)return;
		for (var i = 0; i < lista_practicos.length; i++) {
			if(lista_practicos[i].codalu == codalu)	{
				let pendientes = lista_practicos[i].pendientes;
				let presentados = lista_practicos[i].realizados;
				let materias = lista_practicos[i].materias;
				materias.forEach(materia=>{
					let codmat = materia.codmat;
					let nombre = materia.nombre;
					let totalPendientes = contarPendientes(pendientes,codmat);
					if(totalPendientes>0){
						let totalPresentados = contarPresentados(presentados,codmat);
						let totalPracticos = totalPresentados+totalPendientes;
						let div_title = document.createElement('div');
						div_title.classList.add('title-materia');
						div_title.innerHTML = `<div class="div-materia">${nombre}</div>
	                						   <div>Total ${totalPendientes} de ${totalPracticos}</div>`;
	                	content_table.appendChild(div_title);
	                	let div_item = document.createElement('div');
	                	div_item.classList.add('div-content-items');
	                	pendientes.forEach(fila=>{
	                		if(fila.codmat==codmat){
	                			let div_conten_item = document.createElement('div');
	                			div_conten_item.classList.add('item');
	                			div_conten_item.innerHTML = `Evaluación: ${fila.codeva} ${fila.descripcion} Fecha de presentación: ${fila.fechai} ${fila.horai} hasta ${fila.fechaf} ${fila.horaf} Nota: 100`;
	                			div_item.appendChild(div_conten_item);
	                		}
	                	});
	                	content_table.appendChild(div_item);
					}

				});

			}	
		}
	}
	if(button_seletc == "presentados"){
		btnPendiente.classList.remove('selected');
		btnPresentados.classList.add('selected');
		title_table.innerHTML = "Evaluaciones realizadas y notas";
		content_table.innerHTML = "";
		let codalu = lista_alumnos[0].codalu;
		for (var i = 0; i < lista_practicos.length; i++) {
			if(lista_practicos[i].codalu == codalu)	{
				let pendientes = lista_practicos[i].pendientes;
				let presentados = lista_practicos[i].realizados;
				let materias = lista_practicos[i].materias;
				materias.forEach(materia=>{
					let codmat = materia.codmat;
					let nombre = materia.nombre;
					let totalPresentados = contarPresentados(presentados,codmat);					
					if(totalPresentados>0){
						let totalPendientes = contarPendientes(pendientes,codmat);
						let totalPracticos = totalPresentados+totalPendientes;
						let div_title = document.createElement('div');
						div_title.classList.add('title-materia');
						div_title.innerHTML = `<div class="div-materia">${nombre}</div>
	                						   <div>Total ${totalPresentados} de ${totalPracticos}</div>`;
	                	content_table.appendChild(div_title);
	                	let div_item = document.createElement('div');
	                	div_item.classList.add('div-content-items');
	                	presentados.forEach(fila=>{
	                		if(fila.codmat==codmat){
	                			let div_conten_item = document.createElement('div');
	                			div_conten_item.classList.add('item');
	                			div_conten_item.innerHTML = `Evaluación: ${fila.codeva} ${fila.descripcion} - Nota: ${fila.nota}`;
	                			div_item.appendChild(div_conten_item);
	                		}
	                	});
	                	content_table.appendChild(div_item);
					}

				});

			}	
		}
	}
}
const contarPendientes = (listaP,codmat)=>{
	let total = 0;
	listaP.forEach(fila=>{
		if(fila.codmat == codmat)total++;
	});
	return total;
}
const contarPresentados = (listaPr,codmat)=>{
	let total = 0;
	listaPr.forEach(fila=>{
		if(fila.codmat == codmat)total++;
	});
	return total;
}
$(document).ready(()=>{
	content_table = document.getElementById('content-table');
	title_table = document.getElementById('div-title-tabla');
	btnPendiente = document.getElementById('btn-select-pendientes');
	btnPresentados = document.getElementById('btn-select-presentados');
	btnPendiente.addEventListener('click',()=>{button_seletc="pendientes";mostrarPracticos()});
	btnPresentados.addEventListener('click',()=>{button_seletc="presentados";mostrarPracticos()});
	content_table.innerHTML = "";
	select = document.getElementById('select-alumno');
	$('#select-alumno').change(function(){mostrarPracticos()});
	get_practicos();
});

