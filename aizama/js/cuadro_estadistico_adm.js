let lista_alumnos = [];
const request_alumnos = () => {
	$.get(
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
const mostrar_alumno = (alu,mat,notas) => {
	let trimestres = ["1er Trimestre","2do Trimestre","3er Trimestre"];
	let t = 0;
	let graficos = "";
	notas.forEach(n => {
		let barras = "";
		for (var i = 0; i < mat.length; i++) {
			let p = n[i] == ""? "0": n[i];
			barras = `${barras}<td><div style="height:${p}%;">${mat[i]}</div></td>`;
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
	$(".div-cuadro-estadisticas").empty();
	$(".div-cuadro-estadisticas").append(
		`<h2 class="t-estadisticas">Estadísticas Generales</h2>
        <div class="div-head-info">
            <div>
                <h3>Estudiante: ${alu.nombre}</h3>
                <h3>Curso: ${alu.curso}</h3>                
                <h3>Código: ${alu.codalu}</h3>
            </div>
            <img class="img-est" width="100px" src="${alu.foto}">
        </div>
        <div class="div-content-graficos">
            <div class="grafico-notas-materias">
                <h2>Calificaciones por materia</h2>
                ${graficos}
            </div>
        </div>`
		);
}
const get_alumno = codalu => {
	$.post(
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
		
	if(codcur == 0){
		lista_alumnos.forEach(alumno => {
			$(".div-content-lista").append(
				`<div class="item_alumnos" onclick="get_alumno(${alumno.codalu})"><div class="div-codalu">${alumno.codalu}</div><div>${alumno.name}</div></div>`);
		});
	}

	if(codcur != 0){
		if(codpar == 0){
			lista_alumnos.forEach(alumno => {
				if(alumno.codcur == codcur){
					$(".div-content-lista").append(
				`<div>${alumno.nombre}</div>`);
				}
			});
		}else{
			lista_alumnos.forEach(alumno => {
				if(alumno.codcur == codcur && alumno.codpar == codpar){
					$(".div-content-lista").append(
				`<div>${alumno.nombre}</div>`);
				}
			});
		}
	}
}
$(document).ready(()=>{
	$("#seleccionar_alumno").select2({width:"320px"});
	get_alumno(3);
	request_alumnos();
})