let calendario = [];
let hoy = {};
let mes_seleccionado = 0;
const __DIA = ["","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const __MES = ["","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const close_form = () => {
	$(".div-calendario").slideToggle("disappear");
	//$(".div-calendario").addClass("oculto");
} 
const calendar_show = () => {
	
	//$(".div-calendario").removeClass("oculto");
	
	$(".div-calendario").slideToggle("disappear");
}
const init = async () => {
	await $.get(
		"controlador/calendario_controlador.php?op=calendario",
		data =>{
			if(data.status == "ok"){
				calendario = data.data.calendario;
				hoy =data.data.hoy;
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
const hayActividad = (dia,mes)=>{
	return false;
}
const ver_actividades = (mes,dia,dds) => {
	$(".div-fecha").empty();
	$(".div-fecha").append(`	
		<h2>${__DIA[dds]} ${dia} de ${__MES[mes]}</h2>
	`);
	if(mes < 10)mes = "0"+ mes;
	if(dia < 10)dia = "0" + dia;
	get_planificaiones(`${mes}-${dia}`)
}
const cargarAvances = planificaciones => {
	if(planificaciones.length == 0)return;
	let sort = [];
	planificaciones.forEach(p => {
		let par = [];
		par.push(p.periodo);
		par.push(p.id);
		sort.push(par);
	});
	sort.sort();
	let pl = "";
	sort.forEach(s => {
		let id = s[1];
		for (var i = 0; i < planificaciones.length; i++) {
			if(planificaciones[i].id == id){
				pl = `${pl}
					<div class="practico">
			          <h3>${planificaciones[i].materia}</h3>
			          <p class="descripcion">
			            ${planificaciones[i].actividad}
			          </p>
			        </div>
					`;
			}
		}
	});
	$(".main-container").append(
		`<div class="div-section">
		<div class="div-img">
		        <img src="svg/avances.png">
		      </div>
		    <h3>Avance de Contenidos</h3>
		    <div class="div-practico-info">
		      
		      <div class="practicos">
		        ${pl}
		      </div>
		    </div>
	    </div>`
	);
}
const cargarDiasFestivos = df => {
	if(df.length == 0)return;
	let pl = "";
	df.forEach(p => {
		pl = `${pl}<div class="practico">
			          <p class="descripcion">
			            ${p.descripcion}
			          </p>
			        </div>`;
	});
	$(".main-container").append(
			`<div class="div-section">
			<div class="div-img">
			        <img src="images/globos.png">
			      </div>
			    <h3>Hoy se celebra</h3>
			    <div class="div-practico-info">
			      
			      <div class="practicos">
			        ${pl}
			      </div>

			    </div>
			  </div>`
		);
}
const cargarCalendarioAcademico = df => {
	if(df.length == 0)return;
	let pl = "";
	df.forEach(p => {
		let img = "";
		if(p.file != ""){
			img = `<img style="width: 100%; border-radius: 5px;" src="calendarioAcademico/${p.file}">`;
		}
		pl = `${pl}<div style="padding: 10px 0;" class="practico">
			          <p class="descripcion">
			            ${p.descripcion}
			          </p>
			          ${img}
			        </div>`;
	});
	$(".main-container").append(
			`<div class="div-section">
				<div class="div-img">
			        <img src="images/calendario.png">
			    </div>
			    <h3 style="margin-top:13px;">Calendario Académico</h3>
			    <div class="div-practico-info">
			      <div class="practicos">
			        ${pl}
			      </div>

			    </div>
			  </div>`
		);
}
const cargarPracticos = practicos => {
	if(practicos.length == 0)return;
	let pl = "";
	practicos.forEach(p => {
		pl = `${pl}<div class="practico">
			          <h3>${p.materia}</h3>
			          <p class="descripcion">
			            ${p.descripcion}
			          </p>
			          
			          <div style="text-align: right; font-size:.8em;color:var(--c3a);">${p.tipo}</div>
			        </div>`;
	});
	$(".main-container").append(
			`<div class="div-section">
				<div class="div-img">
			        <img src="svg/practico.png">
			     </div>
			    <h3>Prácticos</h3>
			    <div class="div-practico-info">
			      
			      <div class="practicos">
			        ${pl}
			      </div>

			    </div>
			  </div>`
		);
}
const cargarEvaluaciones = evaluaciones => {
	if(evaluaciones.length == 0)return;
	let pl = "";
	evaluaciones.forEach(p => {
		let r = "";
		if (p.estado == "Realizado")r = `<div style="text-align: right; font-size:.8em;color:var(--c1a);">${p.estado}</div>`;
		else r = `<div style="text-align: right; font-size:.8em;color:var(--c3a);">${p.estado}</div>`;
		pl = `${pl}<div class="practico">
			          <h3>${p.materia}</h3>
			          <p class="descripcion">
			            ${p.descripcion}
			          </p>
			          
			          ${r}
			          <div style="text-align: right; font-size:.8em;color:var(--c3a);">${p.tipo}</div>
			        </div>`;
	});
	$(".main-container").append(
			`<div class="div-section">
			<div class="div-img">
			        <img src="svg/evaluaciones.png">
			      </div>
			    <h3>Evaluaciones</h3>
			    <div class="div-practico-info">
			      
			      <div class="practicos">
			        ${pl}
			      </div>

			    </div>
			  </div>`
		);
}	
const get_planificaiones = fecha => {
	$(".main-container").empty();
	$.post(
		"controlador/calendario_controlador.php?op=get_actividades_alu",
		{fecha:fecha},
		data => {
			if(data.status == "ok"){
				let planificaciones = data.planificaciones;
				cargarDiasFestivos(data.dias_festivos);
				cargarCalendarioAcademico(data.calendario_academico);
				cargarAvances(planificaciones);
				cargarPracticos(data.practicos);
				cargarEvaluaciones(data.evaluaciones);
				
			}
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, vuelva a ingresar con su usuario y contraseña por favor...");
			}
		},"json"
	);
}	

$(document).ready(async ()=>{
	await init();
	get_planificaiones("");
	cargar_calendario(mes_seleccionado);
	$(".div-fecha").empty();
	$(".div-fecha").append(`	
		<h2>${__DIA[hoy.dia_sem]} ${hoy.dia_mes} de ${__MES[hoy.mes]}</h2>
	`);
	//ver_actividades(hoy.mes,hoy.dia_mes,hoy.dia_sem);
});