let calendario = [];
let hoy = {};
let mes_seleccionado = 0;
let dias_festivos = [];
let evaluaciones_escritas = [];
let evaluaciones_seleccion = [];
let evaluaciones_mixtas = [];
let practicos_digitales = [];
let practicos_web = [];
let lista_cursos = [];
const __DIA = ["","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const __MES = ["","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const init = async () => {
	await $.get(
		"controlador/calendario_controlador.php?op=calendario_profesor",
		data =>{
			if(data.status == "ok"){
				calendario = data.data.calendario;
				hoy =data.data.hoy;
				evaluaciones_mixtas = data.data.evaluaciones_mixtas;
				evaluaciones_seleccion = data.data.evaluaciones_seleccion;
				evaluaciones_escritas = data.data.evaluaciones_escritas;
				practicos_digitales = data.data.practicos_digitales;
				practicos_web = data.data.practicos_web;
				dias_festivos = data.data.dias_festivos;
				lista_cursos = data.data.curso_materias;
				mes_seleccionado = parseInt(hoy.mes);
			}
		},"json"
		);
}
const mes_anterior = () => {
	if(mes_seleccionado > 1){
		mes_seleccionado--;
		cargar_calendario(mes_seleccionado);
	}
}
const mes_siguiente = () =>{
	if(mes_seleccionado < 12){
		mes_seleccionado++;
		cargar_calendario(mes_seleccionado);
	}	
}
const hayActividad = (dia,mes)=>{
	for (var i = 0; i < dias_festivos.length; i++) {
		let fecha = dias_festivos[i].fecha;
		let split = fecha.split("-");
		let sMes = parseInt(split[1]);
		let sDia = parseInt(split[2]);
		if(mes == sMes && dia == sDia){
			return true;
		}
	}
	for (var i = 0; i < evaluaciones_escritas.length; i++) {
		let sff = evaluaciones_escritas[i].fechaf.split("-");
		let sfi = evaluaciones_escritas[i].fechai.split("-");
		let sMesf = parseInt(sff[1]);
		let sDiaf = parseInt(sff[2]);
		let sMesi = parseInt(sfi[1]);
		let sDiai = parseInt(sfi[2]);
		//if(mes == sMesi && dia == sDiai)return true;
		if(mes == sMesf && dia == sDiaf)return true;
	}
	for (var i = 0; i < evaluaciones_seleccion.length; i++) {
		let sff = evaluaciones_seleccion[i].fechafin.split("-");
		let sfi = evaluaciones_seleccion[i].fechaini.split("-");
		let sMesf = parseInt(sff[1]);
		let sDiaf = parseInt(sff[2]);
		let sMesi = parseInt(sfi[1]);
		let sDiai = parseInt(sfi[2]);
		//if(mes == sMesi && dia == sDiai)return true;
		if(mes == sMesf && dia == sDiaf)return true; 
	}
	for (var i = 0; i < evaluaciones_mixtas.length; i++) {
		let sff = evaluaciones_mixtas[i].fechaf.split("-");
		let sfi = evaluaciones_mixtas[i].fechai.split("-");
		let sMesf = parseInt(sff[1]);
		let sDiaf = parseInt(sff[2]);
		let sMesi = parseInt(sfi[1]);
		let sDiai = parseInt(sfi[2]);
		//if(mes == sMesi && dia == sDiai)return true;
		if(mes == sMesf && dia == sDiaf)return true;
	}
	for (var i = 0; i < practicos_digitales.length; i++) {
		let fecha = practicos_digitales[i].fecha;
		let split = fecha.split("-");
		let sMes = parseInt(split[1]);
		let sDia = parseInt(split[2]);
		if(mes == sMes && dia == sDia){
			return true;
		}
	}
	for (var i = 0; i < practicos_web.length; i++) {
		let fecha = practicos_web[i].fecha;
		let split = fecha.split("-");
		let sMes = parseInt(split[1]);
		let sDia = parseInt(split[2]);
		if(mes == sMes && dia == sDia){
			return true;
		}
	}
	return false;
}
const cargar_calendario = mes =>{
	$("#body-calendario").empty();
	if (mes == 1) {
		$("#mes-ant").html("");
		$("#mes-act").html(calendario[mes - 1].mes);
		$("#mes-sig").html(calendario[mes].mes);
		let data_mes = calendario[mes - 1];
		let dia_mes = 1;
		let semana = "<tr>";
		let cont_semana = 0;
		let cont_dia = 0;
		for (var i = 1; i < data_mes.inicio; i++) {
			if (i == 1) semana = `${semana}<td class="border-top"></td>`;
			else semana = `${semana}<td class="border-td"></td>`;
			cont_dia++;	
		}
		for (var i = cont_dia; i < 7; i++) {
			let style = "";
			let actividad = "";
			if(hayActividad(dia_mes,mes))actividad = `<img src="img/nota.png" style="width:18px;">`;
			if(dia_mes == hoy.dia_mes && mes == hoy.mes)style = "hoy";
			semana = `${semana}<td class="border-td ${style}" onclick="ver_actividades(${mes},${dia_mes},${i + 1});"><span class="number-day">${dia_mes}</span>${actividad}</td>`;
			dia_mes++;
		}
		semana = `${semana}</tr>`;
		$("#body-calendario").append(semana);
		cont_semana++;
		while(dia_mes <= data_mes.dias){
			semana = "<tr>";
			cont_dia = 1;
			for (var i = 0; i < 7; i++) {
				if(dia_mes <= data_mes.dias){
					let style = "";
					let actividad = "";
					if(hayActividad(dia_mes,mes))actividad = `<img src="img/nota.png" style="width:18px;">`;
					if(dia_mes == hoy.dia_mes && mes == hoy.mes)style = "hoy";
					semana = `${semana}<td class="border-td ${style}" onclick="ver_actividades(${mes},${dia_mes},${i + 1});"><span class="number-day">${dia_mes}</span>${actividad}</td>`;
					dia_mes++;
				}else{
					semana = `${semana}<td class="border-td" onclick="ver_actividades(${mes},${dia_mes},${i + 1});"><span class="number-day" style="color:var(--c1a);">${cont_dia}</span></td>`;
					cont_dia++;
				}
			}
			semana = `${semana}</tr>`;
			$("#body-calendario").append(semana);
			cont_semana++;
		}
	}

	if(mes == 12){
		$("#mes-ant").html(calendario[mes - 2].mes);
		$("#mes-act").html(calendario[mes - 1].mes);
		$("#mes-sig").html("");
		let data_mes = calendario[mes - 1];
		let dia_mes = 1;
		let semana = "<tr>";
		let cont_semana = 0;
		let cont_dia = 0;
		let data_mes_anterior = calendario[mes - 2];
		for (var i = 1; i < data_mes.inicio; i++) {
			let actividad = "";
			if(hayActividad(dia_mes,mes))actividad = `<img src="img/nota.png" style="width:18px;">`;
			if (i == 1) semana = `${semana}<td class="border-top" onclick="ver_actividades(${mes},${dia_mes},${i});"><span class="number-day" style="color:var(--c1a);">${data_mes_anterior.dias - data_mes.inicio + i + 1}</span>${actividad}</td>`;
			else semana = `${semana}<td class="border-td" onclick="ver_actividades(${mes},${dia_mes},${i});"><span class="number-day">${data_mes_anterior.dias - data_mes.inicio + i + 1}</span>${actividad}</td>`;
			cont_dia++;	
		}
		for (var i = cont_dia; i < 7; i++) {
			let style = "";
			let actividad = "";
			if(hayActividad(dia_mes,mes))actividad = `<img src="img/nota.png" style="width:18px;">`;
			if(dia_mes == hoy.dia_mes && mes == hoy.mes)style = "hoy";
			semana = `${semana}<td class="border-td ${style}" onclick="ver_actividades(${mes},${dia_mes},${i + 1});"><span class="number-day">${dia_mes}</span>${actividad}</td>`;
			dia_mes++;
		}
		semana = `${semana}</tr>`;
		$("#body-calendario").append(semana);
		cont_semana++;
		while(dia_mes < data_mes.dias){
			semana = "<tr>";
			for (var i = 0; i < 7; i++) {
				if(dia_mes <= data_mes.dias){
					let actividad = "";
					if(hayActividad(dia_mes,mes))actividad = `<img src="img/nota.png" style="width:18px;">`;
					let style = "";
					if(dia_mes == hoy.dia_mes && mes == hoy.mes)style = "hoy";
					semana = `${semana}<td class="border-td ${style}" onclick="ver_actividades(${mes},${dia_mes},${i + 1});"><span class="number-day">${dia_mes}</span>${actividad}</td>`;
					dia_mes++;
				}else{
					semana = `${semana}<td class="border-td" onclick="ver_actividades(${mes},${dia_mes},${i + 1});"></td>`;
				}
			}
			semana = `${semana}</tr>`;
			$("#body-calendario").append(semana);
			cont_semana++;
		}
	}
	if(mes != 1 && mes != 12){
		$("#mes-ant").html(calendario[mes - 2].mes);
		$("#mes-act").html(calendario[mes - 1].mes);
		$("#mes-sig").html(calendario[mes].mes);
		let data_mes = calendario[mes - 1];
		let dia_mes = 1;
		let semana = "<tr>";
		let cont_semana = 0;
		let cont_dia = 0;
		let data_mes_anterior = calendario[mes - 2];
		for (var i = 1; i < data_mes.inicio; i++) {
			let actividad = "";
			if(hayActividad(data_mes_anterior.dias - data_mes.inicio + i + 1,mes - 1))actividad = `<img src="img/nota.png" style="width:18px;">`;
			if (i == 1) semana = `${semana}<td class="border-top" onclick="ver_actividades(${mes - 1},${data_mes_anterior.dias - data_mes.inicio + i + 1},${i});"><span class="number-day" style="color:var(--c1a);">${data_mes_anterior.dias - data_mes.inicio + i + 1}</span>${actividad}</td>`;
			else semana = `${semana}<td class="border-td" onclick="ver_actividades(${mes - 1},${data_mes_anterior.dias - data_mes.inicio + i + 1},${i});"><span class="number-day" style="color:var(--c1a);">${data_mes_anterior.dias - data_mes.inicio + i + 1}</span>${actividad}</td>`;
			cont_dia++;	
		}
		for (var i = cont_dia; i < 7; i++) {
			let style = "";
			if(dia_mes == hoy.dia_mes && mes == hoy.mes)style = "hoy";
			let actividad = "";
			if(hayActividad(dia_mes,mes))actividad = `<img src="img/nota.png" style="width:18px;">`;
			semana = `${semana}<td class="border-td ${style}" onclick="ver_actividades(${mes},${dia_mes},${i + 1});"><span class="number-day">${dia_mes}</span>${actividad}</td>`;
			dia_mes++;
		}
		semana = `${semana}</tr>`;
		$("#body-calendario").append(semana);
		cont_semana++;
		while(dia_mes < data_mes.dias){
			cont_dia = 1;
			semana = "<tr>";
			for (var i = 0; i < 7; i++) {
				if(dia_mes <= data_mes.dias){
					let actividad = "";
					if(hayActividad(dia_mes,mes))actividad = `<img src="img/nota.png" style="width:18px;">`;
					let style = "";
					if(dia_mes == hoy.dia_mes && mes == hoy.mes)style = "hoy";
					semana = `${semana}<td class="border-td ${style}" onclick="ver_actividades(${mes},${dia_mes},${i + 1});"><span class="number-day">${dia_mes}</span>${actividad}</td>`;
					dia_mes++;
				}else{
					let actividad = "";
					if(hayActividad(dia_mes,mes))actividad = `<img src="img/nota.png" style="width:18px;">`;
					semana = `${semana}<td class="border-td" onclick="ver_actividades(${mes + 1},${cont_dia},${i + 1});"><span class="number-day" style="color:var(--c1a);">${cont_dia}</span>${actividad}</td>`;
					cont_dia++;
				}
			}
			semana = `${semana}</tr>`;
			$("#body-calendario").append(semana);
			cont_semana++;
		}
	}

}
const get_curso = (codcur,codpar) => {
	for (var i = 0; i < lista_cursos.length; i++) {
		if(lista_cursos[i].codcur == codcur && lista_cursos[i].codpar == codpar)return lista_cursos[i].curso;
	}
	return "";
}
const get_materia = codmat => {
	for (var i = 0; i < lista_cursos.length; i++) {
		if(lista_cursos[i].codmat == codmat)return lista_cursos[i].materia;
	}
	return "";
}
const ver_actividades = (mes,dia,dds) => {
	$(".div-info-fecha").empty();
	$(".div-info-fecha").append(`
		<div class="div-dia-data">
			<h2>${__DIA[dds]} ${dia} de ${__MES[mes]}</h2>
		</div>
	`);
	dias_festivos.forEach(df => {
		let fecha = df.fecha;
		let split = fecha.split("-");
		let sMes = parseInt(split[1]);
		let sDia = parseInt(split[2]);
		if(mes == sMes && dia == sDia){
			$(".div-info-fecha").append(
				`<div class="div-tarjeta-e">
					<div class="descripcion-actividad">${df.descripcion}</div>
				</div>`
			);
		}
	});
	let acts = [];
	let sort_list = [];
	evaluaciones_seleccion.forEach(e => {
		let sff = e.fechafin.split("-");
		let sMesf = parseInt(sff[1]);	
		let sDiaf = parseInt(sff[2]);
		if(mes == sMesf && dia == sDiaf){
			acts.push(e);
			sort_list.push(e.strtotimef);
		}
	});
	evaluaciones_mixtas.forEach(e => {
		let sff = e.fechaf.split("-");
		let sMesf = parseInt(sff[1]);	
		let sDiaf = parseInt(sff[2]);
		if(mes == sMesf && dia == sDiaf){
			acts.push(e);
			sort_list.push(e.strtotimef);
		}
	});
	evaluaciones_escritas.forEach(e => {
		let sff = e.fechaf.split("-");
		let sMesf = parseInt(sff[1]);	
		let sDiaf = parseInt(sff[2]);
		if(mes == sMesf && dia == sDiaf){
			acts.push(e);
			sort_list.push(e.strtotimef);
		}
	});
	practicos_digitales.forEach(p=>{
		let fecha = p.fecha;
		let split = fecha.split("-");
		let sMes = parseInt(split[1]);
		let sDia = parseInt(split[2]);
		if(mes == sMes && dia == sDia){
			acts.push(p);
			sort_list.push(p.strtotime);
		}
	});
	practicos_web.forEach(p=>{
		let fecha = p.fecha;
		let split = fecha.split("-");
		let sMes = parseInt(split[1]);
		let sDia = parseInt(split[2]);
		if(mes == sMes && dia == sDia){
			acts.push(p);
			sort_list.push(p.strtotime);
		}
	});
	sort_list.sort();
	console.log(acts);
	sort_list.forEach(n=>{
		let b = true;
		let con = 0;
		while(b && con < acts.length){
			if(acts[con].type > 2 )acts[con].strtotime = acts[con].strtotimef;
			if(acts[con].strtotime == n){
				let acti = acts[con];
				switch (acti.type){
					case 1://Practico digital
					case 2://Practico Web	
						$(".div-info-fecha").append(
							`<div class="div-tarjeta-e">
								<div class="div-hora-actividad">${acti.hora}</div>
								<div class="nombre-actividad">${acti.actividad}</div>
								<div class="curso-actividad">${acti.curso}</div>
								<div class="materia-actividad">${acti.materia}</div>
								<div class="descripcion-actividad">${acti.descripcion}</div>
							</div>`
						);
					break;
 					case 3:
 						var sp = acti.fechaini.split("-");
 						var d = new Date(`${acti.fechaini}T00:00:00`).getDay();
 						$(".div-info-fecha").append(
							`<div class="div-tarjeta-e">
								<div class="div-hora-actividad">${acti.horafin}</div>
								<div class="nombre-actividad">${acti.actividad}</div>
								<div class="curso-actividad">${acti.curso}</div>
								<div class="materia-actividad">${acti.materia}</div>
								<div class="descripcion-actividad">${acti.descripcion}</div>
								<div class="descripcion-actividad">Inicio de actividad: ${__DIA[d]} ${parseInt(sp[2])} de ${__MES[parseInt(sp[1])]} desde las ${acti.horaini} hrs.</div>
							</div>`
						);
 					break;
 					case 4:
 					case 5:
 						var sp = acti.fechai.split("-");
 						var d = new Date(`${acti.fechai}T00:00:00`).getDay();
 						console.log(d)
 						$(".div-info-fecha").append(
							`<div class="div-tarjeta-e">
								<div class="div-hora-actividad">${acti.horaf}</div>
								<div class="nombre-actividad">${acti.actividad}</div>
								<div class="curso-actividad">${acti.curso}</div>
								<div class="materia-actividad">${acti.materia}</div>
								<div class="descripcion-actividad">${acti.descripcion}</div>
								<div class="descripcion-actividad">Inicio de actividad: ${__DIA[d]} ${parseInt(sp[2])} de ${__MES[parseInt(sp[1])]} desde las ${acti.horai} hrs.</div>
							</div>`
						);
 					break;
				} 
				acts.splice(con,1);
				b = false;
			}
			con++;
		}
	});
	
	
}
const device = () => {
	let navegador = navigator.userAgent;
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        alert("Estás usando un dispositivo móvil!!");
    } else {
            alert("No estás usando un móvil");
    }
}
const close_form = () => {
	$(".div-calendario").removeClass("show-calendar");
} 
const calendar_show = () => {
	
	$(".div-calendario").addClass("show-calendar");/*
	$(".div-calendario").css("display","block");
	$(".div-calendario").css("width","100%");
	$(".div-calendario").css("left","5px");
	$(".div-calendario").css("bottom","5px");
	$(".div-calendario").css("position","fixed");*/
}
$(document).ready(async ()=>{
	//device();
	//console.log(Date.parse("2023-02-05 10:00:00"))
	await init();
	cargar_calendario(mes_seleccionado);
	ver_actividades(hoy.mes,hoy.dia_mes,hoy.dia_sem);
})