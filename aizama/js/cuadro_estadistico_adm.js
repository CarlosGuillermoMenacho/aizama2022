let lista_alumnos = [];
let lista_search = [];
let lista_cursos = [];
const __Alumnos = 1;
const __Cursos = 2;
let selector = __Alumnos;
const request_alumnos = async () => {
	await $.get(
		"controlador/alumno_controlador.php?op=get_all&usr=adm",
		datos => {
			if(datos.status == "eSession")location.href="administracion.php";
			if(datos.status == "noData")$('.no-cursos').removeClass('oculto');
			if (datos.status == "ok") {
				lista_alumnos = datos.lista;
				cargar_alumnos(0,0);
				//mostrar_lista(0,0);
			}


		},
		"json"
	)
}
const promediar = l => {
	let suma = 0;
	l.forEach(n => {
		suma = suma + n;
	});
	if(suma == 0)return 0;
	let p = suma/l.length;
	return Math.round(p*100)/100;
}
const mostrar_alumno = (alu,mat,notas) => {
	let trimestres = ["1er Trimestre","2do Trimestre","3er Trimestre"];
	let t = 0;
	let graficos = "";
	let prom = [];
	notas.forEach(n => {
		let barras = "";
		for (var i = 0; i < mat.length; i++) {
			let p = n[i] == ""? "0": n[i];
			let background = "#007d4d";
			if(p < 90)background = "#1370b9";
			if(p < 70)background = "#ffeb3b";
			if(p < 51)background = "#c10000";
			if(p == 0)background = "#ffffff00";
			barras = `${barras}<td><div style="height:${p}%; background: ${background};">${mat[i]} ${p} pts.</div></td>`;
			if(n.length > prom.length){
				if(p > 0){
					prom.push([p]);
				}else{
					prom.push([]);
				}
			}else{
				if(p > 0){
					prom[i].push(p);
				}
			}
		}
		graficos = `${graficos}
	                <div class="grafic-background">
	                    <table class="table-grafic">
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
	                    <table class="table-grafic-bar">
	                        <tbody>
	                            <tr>
	                                ${barras}
	                            </tr>
	                        </tbody>

	                    </table>
	                    <div class="title-grafico">${trimestres[t]}</div>
	                </div>`;

		t++;

	});
	barras = "";
	for (var i = 0; i < prom.length; i++) {
		let promedio = promediar(prom[i]);
		let p = promedio == ""? "0": promedio;
		let background = "#007d4d";
		if(p < 90)background = "#1370b9";
		if(p < 70)background = "#ffeb3b";
		if(p < 51)background = "#c10000";
		if(p == 0)background = "#ffffff00";
		barras = `${barras}<td><div style="height:${p}%; background: ${background};">${mat[i]} ${p} pts.</div></td>`;
	}
	graficos = `${graficos}
	                <div class="grafic-background">
	                    <table class="table-grafic">
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
	                    <table class="table-grafic-bar">
	                        <tbody>
	                            <tr>
	                                ${barras}
	                            </tr>
	                        </tbody>

	                    </table>
	                    <div class="title-grafico">Promedio Anual</div>
	                </div>`;
	$(".div-cuadro-estadisticas").append(
		`<h2 class="t-estadisticas">Estadísticas Generales</h2>
        <div class="div-head-info">
            <div>
                <h3>Estudiante: ${alu.nombre}</h3>
                <h3>Curso: ${alu.curso}</h3>                
                <h3>Código: ${alu.codalu}</h3>
            </div>
            <div class="div-img-est">
            	<img class="img-est" width="100px" src="${alu.foto}">
            </div>
        </div>
        <div class="div-content-graficos">
            <div class="grafico-notas-materias">
                <h2>Calificaciones por materia</h2>
                <div class="content-graficos">
                	${graficos}
                </div>
            </div>
        </div>`
		);


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
const cargar_alumnos = (codcur,codpar) => {
	$(".div-content-lista").empty();
	lista_search = [];
	if(codcur == 0){
		lista_alumnos.forEach(alumno => {
			lista_search.push(alumno);
			$(".div-content-lista").append(
				`<div class="item_alumnos" onclick="get_alumno(${alumno.codalu})"><div class="div-codalu">${alumno.codalu}</div><div>${alumno.name}</div></div>`);
		});
	}

	if(codcur != 0){
		if(codpar == 0){
			lista_alumnos.forEach(alumno => {
				if(alumno.codcur == codcur){
					lista_search.push(alumno);
					$(".div-content-lista").append(
				`<div class="item_alumnos" onclick="get_alumno(${alumno.codalu})"><div class="div-codalu">${alumno.codalu}</div><div>${alumno.name}</div></div>`);
				}
			});
		}else{
			lista_alumnos.forEach(alumno => {
				if(alumno.codcur == codcur && alumno.codpar == codpar){
					lista_search.push(alumno);
					$(".div-content-lista").append(
				`<div class="item_alumnos" onclick="get_alumno(${alumno.codalu})"><div class="div-codalu">${alumno.codalu}</div><div>${alumno.name}</div></div>`);
				}
			});
		}
	}
}
const search = str => {
	$(".div-content-lista").empty();
	let UCstr = str.trim().toUpperCase();
	lista_search.forEach(alumno => {
		let name_Alu = alumno.nombre;
		if(name_Alu.includes(UCstr))$(".div-content-lista").append(
			`<div class="item_alumnos" onclick="get_alumno(${alumno.codalu})"><div class="div-codalu">${alumno.codalu}</div><div>${alumno.name}</div></div>`);
	});
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
const mostrar_estadisticas_curso = (mat,lista,curso) => {
	let trimestres = ["1er Trimestre","2do Trimestre","3er Trimestre"];
	let t = 0;
	let graficos = "";
	let prom = [];
	lista.forEach(n => {
		let barras = "";
		for (var i = 0; i < n.length; i++) {
			let p = n[i][2] == ""? "0": n[i][2];
			let background = "#007d4d";
			if(p < 90)background = "#1370b9";
			if(p < 70)background = "#ffeb3b";
			if(p < 51)background = "#c10000";
			if(p == 0)background = "#ffffff00";
			barras = `${barras}<td><div style="height:${p}%; background: ${background}; font-size:.75em;">${n[i][1]} ${p} pts.</div></td>`;
			if(n.length > prom.length){
				if(p > 0){
					prom.push([p]);
				}else{
					prom.push([]);
				}
			}else{
				if(p > 0){
					prom[i].push(p);
				}
			}
		}
		graficos = `${graficos}
	                <div class="grafic-background2">
	                    <table class="table-grafic">
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
	                    <table class="table-grafic-bar">
	                        <tbody>
	                            <tr>
	                                ${barras}
	                            </tr>
	                        </tbody>

	                    </table>
	                    <div class="title-grafico">${trimestres[t]}</div>
	                </div>`;

		t++;

	});
	barras = "";
	for (var i = 0; i < prom.length; i++) {
		let promedio = promediar(prom[i]);
		let p = promedio == ""? "0": promedio;
		let background = "#007d4d";
		if(p < 90)background = "#1370b9";
		if(p < 70)background = "#ffeb3b";
		if(p < 51)background = "#c10000";
		if(p == 0)background = "#ffffff00";
		barras = `${barras}<td><div style="height:${p}%; background: ${background};font-size:.75em;" >${lista[0][i][1]} ${p} pts.</div></td>`;
	}
	graficos = `${graficos}
	                <div class="grafic-background2">
	                    <table class="table-grafic">
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
	                    <table class="table-grafic-bar">
	                        <tbody>
	                            <tr>
	                                ${barras}
	                            </tr>
	                        </tbody>

	                    </table>
	                    <div class="title-grafico">Promedio Anual</div>
	                </div>`;
	$(".div-cuadro-estadisticas").append(
		`<h2 class="t-estadisticas">Estadísticas Generales</h2>
        <div class="div-head-info2">
            <div>
                <h3>Curso: ${curso}</h3>  
                <h3>Materia: ${mat}</h3>              
            </div>
            <div class="div-img-est">
            	<!--img class="img-est" width="100px" src=""-->
            </div>
        </div>
        <div class="div-content-graficos2">
            <div class="grafico-notas-materias">
                <h2>Calificaciones por Estudiante</h2>
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
	//await get_alumno(3);
	await get_cursos();
	await request_alumnos();
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