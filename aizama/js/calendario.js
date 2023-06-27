let input_codalu;
let primerDia; //Variable que tiene el número de día de la semana 1(Lunes) al 7(Domingo)
let diasDelMes; //Variable que contiene el número de días que tiene el mes actual
let mes; //Variable que contiene el numero de mes 1 (enero) 12 (diciembre)
let year; //Variable que contiene en año actual
let diasSemana = ["Lunes","Martes","Miércoles","Juéves","Viernes","Sábado","Domingo"];
let calendario = document.getElementById('caja-mes');
let nombreMesHTML = document.getElementById('nombreMes');
let nombreMesHTML2 = document.getElementById('nombreMes2');
let nombreMes;
let listadiasFestivos = [];
let listaEventos = [];
let listaPracticos = [];
let listaEvaluaciones = [];
let listaActividades = [];
const obtenerMes = async()=>{
	await $.get(
		'obtenerMes.php',
		datos=>{
			primerDia = datos.first;
			diasDelMes = datos.dias;
			mes = datos.mes;
			nombreMes = datos.nombreMes;
		},
		"json"
		);
	return;
}
const obtenerMes2 = async nmes=>{
	await $.get(
		`obtenerMes.php?mes=${nmes}`,
		datos=>{
			primerDia = datos.first;
			diasDelMes = datos.dias;
			mes = datos.mes;
			nombreMes = datos.nombreMes;
		},
		"json"
		);
	return;
}
const mostrarCalendario = ()=>{
	calendario.innerHTML = ""; // Limpiando la caja que mostrará el calendario
	calendario.classList.add('dias-semana');
	calendario.classList.remove('lista-Actividades');
	nombreMesHTML.innerHTML = nombreMes;
	nombreMesHTML2.innerHTML = nombreMes;
	for (let i = 0; i < diasSemana.length; i++) {
		let div = document.createElement('div');
		div.classList.add('dia');
		div.innerHTML = diasSemana[i];
		calendario.append(div);
	}
	let inicio = 1;
	let diaMax = (parseInt(diasDelMes)+parseInt(primerDia)) > 36?42:35;

	for (var i = 0; i < diaMax; i++) {
		let contenido = "&nbsp;"
		let div = document.createElement('div');
		div.classList.add('caja-dia');
		let descripcion = "";
		if( i + 1 >= primerDia  && inicio <= diasDelMes){
			contenido = inicio;
			inicio++;
			let fec = inicio-1>9?inicio-1:`0${inicio-1}`;
			if(hayActividad(fec)){
				descripcion = `<img src="svg/clipboard-list.svg" onclick="mostrarActividad(${contenido})">`;
			}
		}
		


		div.innerHTML = `<div class="numero-dia">${contenido}</div>
						 <div class="actividad">${descripcion}</div>`;
		calendario.append(div);
		$('#content-acti').empty();
	}
}
const obtenerActividadesMes = async () =>{
	await $.post(
				'controlador/calendario_controlador.php?op=get_calendario',
				{mes:mes,codalu:input_codalu.value},
				data =>{
						if(data.status=="ok"){
							listaEventos = data.eventos;
							listadiasFestivos = data.fechas_civicas;
							listaActividades = data.actividades;
							listaEvaluaciones = data.evaluaciones;
							listaPracticos = data.practicos;
							mostrarCalendario();
						}
				},
				"json"
				);
}




const init = async() =>{
    
	await obtenerMes();
	await $.post(
		'controlador/calendario_controlador.php?op=get_calendario',
		{codalu:input_codalu.value},
		data=>{
			if(data.status=="ok"){
				listaEventos = data.eventos;
				listadiasFestivos = data.fechas_civicas;
				listaActividades = data.actividades;
				listaEvaluaciones = data.evaluaciones;
				listaPracticos = data.practicos;
				mostrarCalendario();
			}
		},
		"json"
		);
}

const siguienteMes = async()=>{
	if (mes<12) {
		await obtenerMes2(parseInt(mes)+1);
		obtenerActividadesMes();
	}

}
const anteriorMes = async()=>{
	if (mes>1) {
		await obtenerMes2(parseInt(mes)-1);
		obtenerActividadesMes();
	}
}
const mostrarActividad = dia =>{
	let div_activi = document.getElementById('div_actividades');
	let el = window.getComputedStyle(div_activi);
	if(el.display=='block'){
		nombreMesHTML2.innerHTML = `${nombreMes} - ${dia}`;
		obtenerActividades2(dia,div_activi);
	}else{
		nombreMesHTML.innerHTML = `${nombreMes} - ${dia}`;
		calendario.innerHTML="";
		calendario.classList.remove('dias-semana');
		calendario.classList.add('lista-Actividades');
		let btnCerrarDia = document.createElement('button');
		btnCerrarDia.classList.add('btnCerrarDia');
		let imagenBtn = document.createElement('img');
		imagenBtn.src = "svg/close.svg";
		btnCerrarDia.appendChild(imagenBtn);
		btnCerrarDia.onclick = ()=>{mostrarCalendario()};
		calendario.appendChild(btnCerrarDia);
		obtenerActividades(dia);
	}
	
	
	/*let actividades = obtenerActividades(dia);
	Swal.fire(actividades);*/
}

const obtenerActividades = dia =>{
	let dia2 = dia>9?dia:`0${dia}`;
	let p = document.createElement('p');
	let div = document.createElement('div');
	div.classList.add('div-item');
	listadiasFestivos.forEach(fila=>{
		if(fila.dia==dia){
			p.innerHTML = fila.descripcion;
			p.classList.add('item-actividad');
			div.appendChild(p);
			calendario.appendChild(div);
		}
	} );
	listaPracticos.forEach(practico=>{
		if (practico.dia==dia) {
			let nota = practico.nota==0?"":` - Nota: ${practico.nota} pts.`;
			let parraf = document.createElement('p');
			parraf.innerHTML = `Materia: ${practico.materia} - Práctico: ${practico.descripcion}${nota}`;
			parraf.classList.add('item-actividad')
			let item = document.createElement('div');
			item.appendChild(parraf);
			item.classList.add('div-item');
			calendario.appendChild(item);
		}
	});
	listaEvaluaciones.forEach(evaluacion=>{
		if (evaluacion.dia==dia) {
			let nota = evaluacion.nota==0?"":` - Nota: ${evaluacion.nota} pts.`;
			let parraf = document.createElement('p');
			parraf.innerHTML = `Materia: ${evaluacion.materia} - Evaluación: ${evaluacion.descripcion} 100 pts.`;
			parraf.classList.add('item-actividad')
			let item = document.createElement('div');
			item.appendChild(parraf);
			item.classList.add('div-item');
			calendario.appendChild(item);
		}
	});
	listaEventos.forEach(evento=>{
		if(evento.dia==dia){
			let descripcion = evento.descripcion;
			let parraf = document.createElement('p');
			parraf.innerHTML = descripcion;
			parraf.classList.add('item-actividad')
			let item = document.createElement('div');
			item.appendChild(parraf);
			item.classList.add('div-item');
			calendario.appendChild(item);
		}
	});
	listaActividades.forEach(act =>{
		if(act.dia==dia){
			let descripcion = act.descripcion;
			let parraf = document.createElement('p');
			parraf.innerHTML = descripcion;
			parraf.classList.add('item-actividad')
			let item = document.createElement('div');
			item.appendChild(parraf);
			item.classList.add('div-item');
			calendario.appendChild(item);
		}
	});
}
const obtenerActividades2 = (dia) =>{
	let dia2 = dia>9?dia:`0${dia}`;
	let p = document.createElement('p');
	let div = document.createElement('div');
	let cont_acti = document.getElementById('content-acti');
	cont_acti.innerHTML = "";
	div.classList.add('div-item');
	listadiasFestivos.forEach(fila=>{
		if(fila.dia==dia){
			p.innerHTML = fila.descripcion;
			p.classList.add('item-actividad');
			div.appendChild(p);
			cont_acti.appendChild(div);
		}
	} );
	listaPracticos.forEach(practico=>{
		if (practico.dia==dia) {
			let nota = practico.nota==0?"":` - Nota: ${practico.nota} pts.`;
			let parraf = document.createElement('p');
			parraf.innerHTML = `Materia: ${practico.materia} - Práctico: ${practico.descripcion}${nota}`;
			parraf.classList.add('item-actividad')
			let item = document.createElement('div');
			item.appendChild(parraf);
			item.classList.add('div-item');
			cont_acti.appendChild(item);
		}
	});
	listaEvaluaciones.forEach(evaluacion=>{
		if (evaluacion.dia==dia) {
			let nota = evaluacion.nota==0?"":` - Nota: ${evaluacion.nota} pts.`;
			let parraf = document.createElement('p');
			parraf.innerHTML = `Materia: ${evaluacion.materia} - Evaluación: ${evaluacion.descripcion} 100 pts.`;
			parraf.classList.add('item-actividad')
			let item = document.createElement('div');
			item.appendChild(parraf);
			item.classList.add('div-item');
			cont_acti.appendChild(item);
		}
	});
	listaEventos.forEach(evento=>{
		if(evento.dia==dia){
			let descripcion = evento.descripcion;
			let parraf = document.createElement('p');
			parraf.innerHTML = descripcion;
			parraf.classList.add('item-actividad')
			let item = document.createElement('div');
			item.appendChild(parraf);
			item.classList.add('div-item');
			cont_acti.appendChild(item);
		}
	});
	listaActividades.forEach(act =>{
		if(act.dia==dia){
			let descripcion = act.descripcion;
			let parraf = document.createElement('p');
			parraf.innerHTML = descripcion;
			parraf.classList.add('item-actividad')
			let item = document.createElement('div');
			item.appendChild(parraf);
			item.classList.add('div-item');
			cont_acti.appendChild(item);
		}
	});
}
const hayActividad = dia =>{
	let dia2 = dia+"";
	for (let i = 0 ; i<listadiasFestivos.length; i++){
		if(listadiasFestivos[i].dia==dia)return true;
	} 

	for (var i = 0; i < listaPracticos.length; i++) {
		if(listaPracticos[i].dia == dia)return true;
	}

	for (var i = 0; i < listaEvaluaciones.length; i++) {
		if(listaEvaluaciones[i].dia==dia)return true;
	}
	for (var i = 0; i < listaEventos.length; i++) {
		if(listaEventos[i].dia==dia)return true;
	}
	for (var i = 0; i < listaActividades.length; i++) {
		if(listaActividades[i].dia==dia)return true;
	}

	return false;
}
$(document).ready(()=>{
    input_codalu = document.getElementById('input-codalu');
	init();
	$('#next').click(()=>{siguienteMes();});
	$('#last').click(()=>{anteriorMes();});
})