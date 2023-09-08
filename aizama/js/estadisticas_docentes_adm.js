let lista_profesores = [];
let lista_search = [];
let lista_cursos = [];
const __Alumnos = 1;
const __Cursos = 2;
let selector = __Alumnos;
let practicos_fecha = [];
const request_profesores = async () => {
	await $.get(
		"controlador/profesor_controlador.php?op=get_profesores&usr=adm",
		datos => {
			if(datos.status == "eSession")location.href="administracion.php";
			if(datos.status == "noData")$('.no-cursos').removeClass('oculto');
			if (datos.status == "ok") {
				lista_profesores = datos.lista;
				//cargar_alumnos(0,0);
				//mostrar_lista(0,0);
			}
		},
		"json"
	)
}
const request_practicos_fecha = async (fi,ff) => {
	await $.post(
		"controlador/profesor_controlador.php?op=est_practicos_fecha&usr=adm",
		{fecha_i:fi,fecha_f:ff},
		data => {
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
				return;
			}
			if (data.status == "errorFecha") {
				Swal.fire("Las fechas son incorrectas...");
				return;
			}
			if (data.status == "ok") {
				practicos_fecha = data.profesores;
			}
		},"json"
	)
}
const request_practicos =async () => {
	await $.get(
		"controlador/profesor_controlador.php?op=est_practicos&usr=adm",
		data=>{
			if(data.status == "eSession")location.href="administracion.php";
			if (data.status == "ok") {
				mostrar_estadisticas_practicos(data.profesores);
				//cargar_alumnos(0,0);
				//mostrar_lista(0,0);
			}
		},"json"

		);
}
const promediar = l => {
	let suma = 0;
	l.forEach(n => {
		suma = suma + parseInt(n);
	});
	
	if(suma == 0) return "";
	return suma;
}

const get_alumno = async codalu => {
	$(".div-cuadro-estadisticas").empty();
	await $.post(
		"controlador/boletin_controlador.php?op=get_notas_to_centralizador_alu",
		{codalu:codalu},
		data => {
			if (data.status == "ok") {
				mostrar_alumno(data.alumno,data.header,data.row);
			}
		},"json"
		);
}


const cargar_cursos = lista => {
	let index = 1;
	lista.forEach( l => {
		$("#seleccionar_curso").append(`<option value="${index}">${l.curso}</option>`);
		index++;
	});
}
const get_cursos = async () => {
	await $.get(
		"controlador/cursos_controlador.php?op=get_cursos_a",
		data => {
			if (data.status == "ok") {
				lista_cursos = data.cursos;
				cargar_cursos(lista_cursos);
			}
		},"json"
	);

}
const mostrar_curso = () => {
	let index = $("#seleccionar_curso").val();
	if (index == 0) {
		cargar_alumnos(0,0);
	}else{
		let curso = lista_cursos[index - 1];
		cargar_alumnos(curso.codcur,curso.codpar);
	}

}
const get_key = (array_object,key,value) => {
	for (var i = 0; i < array_object.length; i++) {
		if(array_object[i][key] == value)return array_object[i];
	}
	return "";
}
const buscar_practicos = async() => {
	let fi = $("#fechai").val();
	let ff = $("#fechaf").val();
	if(fi == ""){
		Swal.fire("Debe llenar los campos requeridos...");
		return;
	}
	await request_practicos_fecha(fi,ff);
	$("#table-fecha").empty();
	let barras = "";
	let background = "#007d4d";
	practicos_fecha.forEach(profesor => {
		background = "#007d4d";
		let tp = profesor.practicos;
		if(tp == 0)background = "#ffffff00";
		barras = `${barras}<td><div style="height:${tp}%; background: ${background}; font-size:.75em;">${profesor.nombre} ${tp}</div></td>`;
	})
	$("#table-fecha").append(
		`<tbody>
	        <tr>
	            ${barras}
	        </tr>
	    </tbody>`
	);
}
const mostrar_estadisticas_practicos = (profesores) => {
	let trimestres = ["1er Trimestre","2do Trimestre","3er Trimestre"];
	let t = 0;
	let graficos = "";
	let prom = [];
	let barras = "";
	let background = "#007d4d";
	practicos_fecha.forEach(profesor => {
		background = "#007d4d";
		let tp = profesor.practicos;
		if(tp == 0)background = "#ffffff00";
		barras = `${barras}<td><div style="height:${tp}%; background: ${background}; font-size:.75em;">${profesor.nombre} ${tp}</div></td>`;
	})
	graficos = `${graficos}
	                <div class="grafic-background2">
	                <div class="div-input-fech">De: <input id="fechai" class="input-date" type="date"> A: <input id="fechaf" class="input-date" type="date"><button onclick="buscar_practicos()" width="50px" class="btn-options">Buscar</button></div>
	                    <table class="table-grafic-fecha">
	                        <tbody>
	                            <tr><td><div>100</div></td></tr>
	                            <tr><td><div>90</div></td></tr>
	                            <tr><td><div>80</div></td></tr>
	                            <tr><td><div>70</div></td></tr>
	                            <tr><td><div>60</div></td></tr>
	                            <tr><td><div>50</div></td></tr>
	                            <tr><td><div>40</div></td></tr>
	                            <tr><td><div>30</div></td></tr>
	                            <tr><td><div>20</div></td></tr>
	                            <tr><td><div>10</div></td></tr>
	                        </tbody>
	                    </table>
	                    <table class="table-grafic-bar-fecha" id="table-fecha">
	                        <tbody>
	                            <tr>
	                                ${barras}
	                            </tr>
	                        </tbody>

	                    </table>
	                    <div class="title-grafico-fecha">Prácticos</div>
	                </div>`;
	for (var i = 0; i < 3; i++) {
		barras = "";
		let index = 0;
		profesores.forEach(profesor => {
			let pr = get_key(profesor.practicos,"trimestre", i + 1);
			let tp = pr.length == 0 ? 0 : pr.total;
			background = "#007d4d";
			if(tp == 0)background = "#ffffff00";
			barras = `${barras}<td><div style="height:${tp*360/120}px; background: ${background}; font-size:.75em;">${profesor.nombre} ${tp}</div></td>`;
			if(profesores.length > prom.length){
				if(tp > 0){
					prom.push([tp]);
				}else{
					prom.push([]);
				}
			}else{
				if(tp > 0){
					prom[index].push(tp);
				}
			}
			index++;
		});
		graficos = `${graficos}
	                <div class="grafic-background2">
	                    <table class="table-grafic">
	                        <tbody>
	                        	<tr><td><div>120</div></td></tr>
	                        	<tr><td><div>110</div></td></tr>
	                            <tr><td><div>100</div></td></tr>
	                            <tr><td><div>90</div></td></tr>
	                            <tr><td><div>80</div></td></tr>
	                            <tr><td><div>70</div></td></tr>
	                            <tr><td><div>60</div></td></tr>
	                            <tr><td><div>50</div></td></tr>
	                            <tr><td><div>40</div></td></tr>
	                            <tr><td><div>30</div></td></tr>
	                            <tr><td><div>20</div></td></tr>
	                            <tr><td><div>10</div></td></tr>
	                        </tbody>
	                    </table>
	                    <table class="table-grafic-bar">
	                        <tbody>
	                            <tr>
	                                ${barras}
	                            </tr>
	                        </tbody>

	                    </table>
	                    <div class="title-grafico">${trimestres[i]}</div>
	                </div>`;
	}
	
	barras = "";
	
	for (var i = 0; i < prom.length; i++) {
		let promedio = promediar(prom[i]);
		let p = promedio == ""? "0": promedio;
		let background = "#007d4d";
		if(p == 0)background = "#ffffff00";
		//console.log(pro)
		barras = `${barras}<td><div style="height:${p*100/300}%; background: ${background};font-size:.75em;" >${profesores[i].nombre} ${p}</div></td>`;
	}
	graficos = `${graficos}
	                <div class="grafic-background2">
	                    <table class="table-grafic">
	                        <tbody>
	                        	<tr><td><div>300</div></td></tr>
	                        	<tr><td><div>275</div></td></tr>
	                            <tr><td><div>250</div></td></tr>
	                            <tr><td><div>225</div></td></tr>
	                            <tr><td><div>200</div></td></tr>
	                            <tr><td><div>175</div></td></tr>
	                            <tr><td><div>150</div></td></tr>
	                            <tr><td><div>125</div></td></tr>
	                            <tr><td><div>100</div></td></tr>
	                            <tr><td><div>75</div></td></tr>
	                            <tr><td><div>50</div></td></tr>
	                            <tr><td><div>25</div></td></tr>
	                        </tbody>
	                    </table>
	                    <table class="table-grafic-bar">
	                        <tbody>
	                            <tr>
	                                ${barras}
	                            </tr>
	                        </tbody>

	                    </table>
	                    <div class="title-grafico">Total Anual</div>
	                </div>`;
	$(".div-cuadro-estadisticas").append(
		`<h2 class="t-estadisticas">Estadísticas Generales</h2>
        <div class="div-head-info2">
            <div>
                            
            </div>
            <div class="div-img-est">
            	<!--img class="img-est" width="100px" src=""-->
            </div>
        </div>
        <div class="div-content-graficos2">
            <div class="grafico-notas-materias">
                <h2>Cantidad de Prácticos por Profesor</h2>
                <div class="content-graficos2">
                	${graficos}
                </div>
            </div>
        </div>`
		);
}
const get_nombre_curso = (codcur,codpar) => {
	for (var i = 0; i < lista_cursos.length; i++) {
		if(lista_cursos[i].codcur == codcur && lista_cursos[i].codpar == codpar)return lista_cursos[i].curso; 
	}
	return "";
}
const obtener_curso = (codcur,codpar,codmat) => {
	$(".div-cuadro-estadisticas").empty();
	$.post(
		"controlador/boletin_controlador.php?op=get_notas_to_centralizador_curso",
		{codcur:codcur,codpar:codpar,codmat:codmat},
		data => {
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
				return;
			}
			if (data.status == "ok") {
				let nombre_curso = get_nombre_curso(codcur,codpar);
				mostrar_estadisticas_curso(data.header,data.row,nombre_curso);
			}
		},"json"
	);
}
const mostrar_materias = (codcur,codpar,materias) => {
	$(".div-content-lista").empty();
	materias.forEach(m => {
		$(".div-content-lista").append(
			`<div class="item-materia" onclick="obtener_curso(${codcur},${codpar},'${m.codmat}')">
				<img src="${m.imagen}" width="30px">
				${m.nombre}
			</div>
			`
		);
	});
}
const get_materia_curso = async (codcur,codpar) => {
	await $.post(
		"controlador/cursos_controlador.php?op=get_materias_curso",
		{codcur:codcur,codpar:codpar},
		data => {
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
				return;
			}
			if (data.status == "ok") {
				mostrar_materias(codcur,codpar,data.materias);
			}
		},"json"
	);
}

const esta_alumnos = () => {
	$(".div-content-lista").empty();
	$(".div-content-lista").height("calc(100vh - 307px)");
	$(".div-cuadro-estadisticas").empty();
	$(".div-search").removeClass("oculto");
	$("#sCur").removeClass("selected");
	$("#sAlu").addClass("selected");
	selector = __Alumnos;
	mostrar_curso();
}
const esta_cursos = async () => {
	$(".div-content-lista").empty();
	$(".div-content-lista").height("calc(100vh - 264px)");
	$(".div-cuadro-estadisticas").empty();
	$(".div-search").addClass("oculto");
	$("#sAlu").removeClass("selected");
	$("#sCur").addClass("selected");
	selector = __Cursos;
	let index = $("#seleccionar_curso").val();
	if(index == 0){
		$(".div-content-lista").empty();
		$(".div-cuadro-estadisticas").empty();
	}else{
		await get_materia_curso(lista_cursos[index-1].codcur,lista_cursos[index-1].codpar);
	}
}
$(document).ready(async ()=>{
	$("#seleccionar_curso").select2({width:"100%"});
	await request_practicos_fecha("","");
	request_practicos();

	await get_cursos();
	await request_profesores();
	$("#input-search").keyup(() => {
		let str = $("#input-search").val();
		search($("#input-search").val());
	})
	$("#seleccionar_curso").change(async ()=>{
		if(selector == __Alumnos) mostrar_curso();
		if(selector == __Cursos){
			let index = $("#seleccionar_curso").val();
			if(index == 0){
				$(".div-content-lista").empty();
				$(".div-cuadro-estadisticas").empty();
			}else{
				await get_materia_curso(lista_cursos[index-1].codcur,lista_cursos[index-1].codpar);
			}
		}
	})
})