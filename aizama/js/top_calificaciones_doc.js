let __alumnos = [];
let __top = [];
let __cursos = [];
let __materias = [];
let __curmat = [];

let __curso_selected = [];
const init = async () => {
	await $.get(
		"controlador/top_calificaciones_controlador.php?op=get_top_doc",
		data => {
			if (data.status == "ok") {
				__alumnos = data.alumnos;
				__top = data.top;
				__cursos = data.cursos;
				__materias = data.materias;
				__curmat = data.curmat;
			}
		},
		"json"

	);
}
const cargar_cursos = () => {
	$(".div-curso-float").empty();
	let clase = 'class="float-selected"';
	let clase2 = 'div-float-selected';
	
	__cursos.forEach(curso => {
		let imagen = "svg/imagen.svg";
		if(curso.imagen != "")imagen = `img/${curso.imagen}`;
		
		$(".div-curso-float").append(
			`<div id="${curso.codcur}${curso.codpar}" class="div-curso ${clase2}" onclick="float_selected(${curso.codcur},${curso.codpar},'${curso.nombre}',this)">
	            <img src="${imagen}" ${clase}>
	        </div>`
		);
		clase = "";
		clase2 = "";
		
	});
	if(__cursos.length == 1){
		$(".div-cursos-float").addClass("oculto");
	}
	if(__cursos.length > 0)	{
		mostrar_top(__cursos[0].codcur,__cursos[0].codpar,__cursos[0].nombre);
		__curso_selected = [__cursos[0].codcur,__cursos[0].codpar];
	}
}
const float_selected = (codcur,codpar,nombre,e) => {
	if(codcur != __curso_selected[0] || codpar != __curso_selected[1]){
		__curso_selected = [codcur,codpar];
	}

	mostrar_top(codcur,codpar,nombre);
	
	$(".float-selected").css('transition','.5s');
	$(".float-selected").removeClass('float-selected');
	$(".div-float-selected").css("transition",".5s");
	$(".div-float-selected").removeClass('div-float-selected');
	let child = e.children;
	e.setAttribute.transition = ".5s";
	e.classList.add('div-float-selected');
	child[0].classList.add('float-selected');
}
const mostrar_top = (codcur,codpar,nombre) => {
	$(".div-tabla").empty();
	$(".div-tabla").append(
		`<h2>${nombre}</h2>`
	);
	let materias = get_materias_curso(codcur,codpar);
	let li_materias = "";
	for (var i = 0; i < materias.length; i++) {
		let cm = materias[i].codmat;
		let nombre = materias[i].nombre;
		let style = "";
		
		
		if( i == 0 )style = 'style="border-radius: 5px 0px 0px 5px;"';
		
		li_materias = `${li_materias}<li id="${cm}" onclick="materia_selected('${cm}')">${nombre}</li>`;
	}
	$(".div-tabla").append(`<div class="div-selector-materias">
			<ul>
				<li id="promedio" class="selected-b" style="border-radius: 5px 0px 0px 5px;" onclick="materia_selected('promedio')">Promedio Trimestral</li>
				${li_materias}
	        </ul>
	    </div>
	    <div id="divm"></div>`
	);
	mostrar_promedios(codcur,codpar); 
	$(".div-tabla").removeClass("oculto");
	$(".div-btn-refresh").removeClass("oculto");
}
const get_nota_final = codalu => {
	let c = 0;
	let n = 0;
	__top.forEach(t => {
		if(t.codalu == codalu && t.nota > 0){
			n = n + t.nota;
			c++;
		}
	});

	return n == 0?0: Math.round((n / c)*100)/100;
}
const get_top = (codcur,codpar) => {
	let lista_top = [];
	__alumnos.forEach(alumno => {
		if(codcur == alumno.codcur && codpar == alumno.codpar){
			let codalu = alumno.codalu;
			let nombre = alumno.nombre;
			let fila = [];
			fila.push(get_nota_final(codalu));
			fila.push(codalu);
			fila.push(nombre);
			lista_top.push(fila);
		}
	});
	lista_top.sort((a, b) => a[0] - b[0]);
	lista_top.reverse();
	return lista_top;
}
const get_notas_alumno = codalu => {
	let n = [];
	__top.forEach( a => {
		if(a.codalu == codalu){
			n.push(a);
		}
	});
	return n;
}
const get_curso = (codcur,codpar) => {
	for (var i = 0; i < __cursos.length; i++) {
		if(__cursos[i].codcur == codcur && __cursos[i].codpar == codpar)return __cursos[i];
	}
	return [];
}
const close_notas_materias = () => {
	$("#notas-materia").addClass("oculto");
	$(".div-tabla").removeClass("oculto");
}
const get_curso_alumno = codalu => {
	for (var i = 0; i < __alumnos.length; i++) {
		if(__alumnos[i].codalu == codalu )return __alumnos[i]; 
	}
	return [];
}
const get_data = codalu => {
	let na = get_notas_alumno(codalu);
	let ca = get_curso_alumno(codalu);
	let notas = "";
	na.forEach( n => {
		notas = `${notas}<tr>
			                <td width="100px">${get_materia(n.codmat).nombre}</td>
			                <td width="50px" class="center">${n.nota}</td>
			            </tr>`
	});
	$("#notas-materia").empty();
	$("#notas-materia").append(
		`<div class="btn-close">
		        <img src="images/close.svg" onclick="close_notas_materias();">
		 </div>
		<h2>Nota por Materia</h2>
		    <h3>${get_curso(ca.codcur,ca.codpar).nombre}</h3>
		    <h3>${ca.nombre}</h3>
		    <table class="table-notas-materias">
		        <thead>
		            <tr>
		                <td>Materia</td>
		                <td>Nota</td>
		            </tr>
		        </thead>
		        <tbody id="body-nota-materia">
		            <tr>
		                ${notas}
		            </tr>
		        </tbody>
		    </table>`
	);	
	$(".div-tabla").addClass("oculto");
	$("#notas-materia").removeClass("oculto");
}
const mostrar_promedios = (codcur,codpar) => {
	$("#divm").empty();
	$("#divm").append(
				`<h2>Promedios Trimestrales</h2>
			    <table class="table">
			        <thead id="head-tabla">
			            <tr>
			                <td>No.</td>
			                <td>Nombre</td>
			                <td>Nota</td>
			            </tr>
			        </thead>
			        <tbody id="body">
			            
			        </tbody>
			    </table>`
			);
	let index = 1;
	let top_notas = get_top(codcur,codpar);
	top_notas.forEach( t => {
				$("#body").append(
					`<tr onclick="get_data(${t[1]});" >
		                <td class="center w100">${index}</td>
		                <td>${t[2]}</td>
		                <td class="center w100">${t[0]}</td>
		            </tr>`
				);
				index++;

			})
}
const get_materia = codmat => {
	for (var i = 0; i < __materias.length; i++) {
		if( __materias[i].codmat == codmat )return __materias[i];
	}
	return [];
}
const get_materias_curso = (codcur,codpar) => {
	let m = [];
	__curmat.forEach( cm => {
		if(cm.codcur == codcur && cm.codpar == codpar)m.push(get_materia(cm.codmat));
	});
	return m;
}
const get_nota = (codalu,codmat) => {
	for (var i = 0; i < __top.length; i++) {
		if(__top[i].codalu == codalu && __top[i].codmat == codmat)return __top[i].nota;
	}
	return "";
}
const get_top_materia = (codcur,codpar,codmat) => {
	let lista = [];
	__alumnos.forEach( a => {
		if(a.codcur == codcur && a.codpar == codpar){
			let codalu = a.codalu;
			let nombre = a.nombre;
			let fila = [];
			fila.push(get_nota(a.codalu,codmat));
			fila.push(codalu);
			fila.push(nombre);
			lista.push(fila);
		}
	});
	lista.sort((a, b) => a[0] - b[0]);
	lista.reverse();
	return lista;
}
const mostrar_top_materias = (codcur,codpar,codmat,nombre) => {
	$("#divm").empty();
	$("#divm").append(
				`<h2>${nombre}</h2>
			    <table class="table">
			        <thead id="head-tabla">
			            <tr>
			                <td>No.</td>
			                <td>Nombre</td>
			                <td>Nota</td>
			            </tr>
			        </thead>
			        <tbody id="body">
			            
			        </tbody>
			    </table>`
			);
	let index = 1;
	let top_notas = get_top_materia(codcur,codpar,codmat);
	top_notas.forEach( t => {
				$("#body").append(
					`<tr>
		                <td class="center w100">${index}</td>
		                <td>${t[2]}</td>
		                <td class="center w100">${t[0]}</td>
		            </tr>`
				);
				index++;

			})
}
const materia_selected = codmat => {
	$(".selected-b").removeClass("selected-b");
	$(`#${codmat}`).addClass("selected-b");
	if(codmat == "promedio")mostrar_promedios(__curso_selected[0],__curso_selected[1]);
	else mostrar_top_materias(__curso_selected[0],__curso_selected[1],codmat,get_materia(codmat).nombre);
}
const update_top = () =>{
	let childs = $(".div-btn-refresh").children();
	$(".div-btn-refresh").empty();
	$(".div-btn-refresh").append(
		`<section style="padding-left:0px;">
		  <div class='sk-double-bounce'>
		    <div class='sk-child sk-double-bounce-1'></div>
		    <div class='sk-child sk-double-bounce-2'></div>
		  </div>
		</section>`
	);
	
	$.post(
		"controlador/top_calificaciones_controlador.php?op=update_top_cur",
		{codcur:__curso_selected[0],codpar:__curso_selected[1]},
		data => {
			
			if(data.status == "ok"){
				setTimeout(()=>{
		  			$(".div-btn-refresh").empty();
			  		$(".div-btn-refresh").append(
			  			`<img src="svg/controlar.svg" width="30px">`
			  		);
			  		setTimeout(()=>{
			  			$(".div-btn-refresh").empty();
			  			$(".div-btn-refresh").append(childs);
			  			$("#btn-refresh").click(()=>{
							update_top();
						})
						mostrar_top(__cursos[0].codcur,__cursos[0].codpar,__cursos[0].nombre);
			  		},2000)
		  		},3000);
		  		init();
			}
		},"json"
	);
}
$(document).ready(async ()=>{
	await init();
	cargar_cursos();
	$("#btn-refresh").click(()=>{
		update_top();
	})
})