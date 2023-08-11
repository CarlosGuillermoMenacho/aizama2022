let __cursos = [];
let __alumnos = [];
let __kardex = [];
let __curso_selected = [0,0];
const get_cursos = async () => {
	await $.get(
		"controlador/cursos_controlador.php?op=get_cursos_a",
		data => {
			__cursos = data.cursos;
		},
		"json"
	);
}
const get_alumnos = async () => {
	await $.get(
		"controlador/alumno_controlador.php?op=get_all&usr=adm",
		data => {
			__alumnos = data.lista;
		},
		"json"
	);
}
const get_alumnos_kardex = async () => {
	await $.get(
		"controlador/alumno_controlador.php?op=get_kardex_all&usr=adm",
		data => {
			__kardex = data.lista;
		},
		"json"
	);
}
const get_kardex_alu = codalu => {
	for (var i = 0; i < __kardex.length; i++) {
		if(__kardex[i].codalu == codalu )return __kardex[i].kardex;
	}
	return [];
}
const get_curso = (c,p) => {
	for (var i = 0; i < __cursos.length; i++) {
		if(__cursos[i].codcur == c && __cursos[i].codpar == p)return __cursos[i];
	}
	return [];
}
const float_selected = (codcur,codpar,nombre,e) => {
	if(codcur != __curso_selected[0] || codpar != __curso_selected[1]){
		__curso_selected = [codcur,codpar];
	}
	let container = $('#tabla_lista');
	let scrollTo = $(`#table${codcur}${codpar}`);
	let position = scrollTo.offset().top - container.offset().top + container.scrollTop();
	console.log(position)
	$('html, body').stop().animate({
    'scrollTop': position
}, 100, 'swing');
	//$(`#table${codcur}${codpar}`).focus();
	$(".float-selected").css('transition','.5s');
	$(".float-selected").removeClass('float-selected');
	$(".div-float-selected").css("transition",".5s");
	$(".div-float-selected").removeClass('div-float-selected');
	let child = e.children;
	e.setAttribute.transition = ".5s";
	e.classList.add('div-float-selected');
	child[0].classList.add('float-selected');
}
const cargar_cursos = cursos => {
	$(".div-curso-float").empty();
	let clase = 'class="float-selected"';
	let clase2 = 'div-float-selected';

	cursos.forEach(curso => {
		let imagen = "svg/imagen.svg";
		if(curso.imagen != "")imagen = `img/${curso.imagen}`;
		
		$(".div-curso-float").append(
			`<div id="${curso.codcur}${curso.codpar}" class="div-curso ${clase2}" onclick="float_selected(${curso.codcur},${curso.codpar},'${curso.curso}',this)">
	            <img src="${imagen}" ${clase}>
	        </div>`
		);
		clase = "";
		clase2 = "";
		
	});
	if(cursos.length == 1){
		$(".div-cursos-float").addClass("oculto");
	}
}
const print = (c,p) => {
	let curso = get_curso(c,p);
	const currentDate = new Date();
    let fechaActual   = currentDate.getDate(),
        mesActual     = currentDate.getMonth()+ 1,
        anioActual    = currentDate.getFullYear();
    let horaActual    = currentDate.getHours(),
        minutosActual = currentDate.getMinutes();
    let fecha = '';
    let hora = '';
    /* Hora */
    if( horaActual < 10 ) {
        horaActual = `0${horaActual}`;
    }
    if( minutosActual < 10 ) {
        minutosActual = `0${minutosActual}`;
    }
    /* Fecha */
    if( fechaActual < 10 ) {
        fechaActual = `0${fechaActual}`;
    }
    if( mesActual < 10 ) {
        mesActual = `0${mesActual}`;
    }
    hora = `${horaActual}:${minutosActual}`;
    fecha = `${fechaActual}/${mesActual}/${anioActual}`;
        

    var printWindow = window.open("", "", "height=900,width=600");
    printWindow.document.write("<html><head>");
    printWindow.document.write("</head>");
    printWindow.document.write('<link rel="stylesheet" type="text/css" href="css/reporte_mensualidades.css?v=8">');
    printWindow.document.write(`<body><table class="table-print">
								    	<div class="print__header">
								      <img src="http://www.aizama.net/images/logo.png" width="50px">
								      <h1 style="margin-left: 100px">Reporte de Mensualidades</h1>
								      <img src="./images/escudo-bolivia.svg" style="margin-left: 100px;" width="50px">
								    </div>
								    <div class="print__info">
								      <div style="margin-right: 10px">
								        <div class="print__info-curso">
								          <label>Curso: </label><span>${curso.curso}</span>
								        </div>
								        <div class="print__info-turno">
								          <label>Turno: </label><span>Mañana</span>
								        </div>
								      </div>
								      <div style="display: flex;flex-direction: column;align-items: flex-end;">
								        <div class="info-label">
								          <label>Unidad Educativa: </label><span>Aizama</span>
								        </div>
								        <div class="info-label"><label>Gestión: </label><span>2023</span></div>
								        <div class="info-label">
								          <label>Departamento: </label><span>Santa Cruz</span>
								        </div>
								      </div>
								    </div>`);
    var divContents = document.getElementById(`table${c}${p}`).innerHTML;
    printWindow.document.write(divContents);
    printWindow.document.write("</table></body>");
    printWindow.document.write("</html>");
    printWindow.document.close();
}
const mostrarLista = () => {
	$("#tabla_lista").empty();
	__cursos.forEach(c => {
		let index = 0;
		let filas = "";
		__alumnos.forEach(a => {
			if(a.codcur == c.codcur && a.codpar == c.codpar){
				let k = get_kardex_alu(a.codalu);
				index++;
				let fk = "";
				let border = "";
				k.forEach(it => {
					let split_it = it.detalle.split("/");
					fk = `${fk}<div class="cuota ${border}">
						        	<div class="detalle">${split_it[1].trim()})</div>
						        	<div class="monto">Bs. ${it.haber} | ${it.fecha.substring(5)}</div>
					        	</div>`;
					border = "border-l";
				});
				filas = `${filas}<tr>
							        <td class="border-top index">${index}</td>
							        <td class="border-td">${a.name}</td>
							        <td class="border-td">
							        	<div class="main-cuota">
							        		${fk}
							        	</div>
							        </td>
								</tr> `;
			}
		})

		$("#tabla_lista").append(
			`<h3>${c.curso}
				<div class="btn-close">
		        	<img title="Imprimir" src="svg/print.svg" onclick="print(${c.codcur},${c.codpar});">
	    		</div>
	    	</h3>
		    <table id="table${c.codcur}${c.codpar}"> 
		        <thead>
		            <tr>
		                <td class="index">Nro.</td>
		                <td class="border-left" style="width: 250px;">Nombre</td>
		                <td class="border-left">Kardex</td>
		            </tr>
		        </thead>
		        <tbody id="body">
				    ${filas} 
				</tbody>
		    </table>
			`
		);
		$
		
	});
}
const init = async () => {
	await get_cursos();
	await get_alumnos();
	await get_alumnos_kardex();
	mostrarLista();
	cargar_cursos(__cursos);
}
$(document).ready(()=>{
	init();
})