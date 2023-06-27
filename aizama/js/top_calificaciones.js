let __top = [];
let __cursos = [];
let __curmat = [];
let __alumnos = [];
let __fecha = "";
const __GLOBAL = 1;
const __MATERIAS = 2;
const __PRIMARIA = 2;
const __SECUNDARIA = 3;
let __nivel = __PRIMARIA;
let __tops = __GLOBAL;
let __curso_selected = [0,0];
let __materia_selected = "";
let __materias = [];
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
	
	$.get(
		"controlador/top_calificaciones_controlador.php?op=update",
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
			  		},2000)
		  		},3000);
		  		init();
			}
		},"json"
	);
}
const cargar_cursos = cursos => {
	$(".div-curso-float").empty();
	let clase = 'class="float-selected"';
	let clase2 = 'div-float-selected';
	$(".div-curso-float").append(
			`<div id="00" class="div-curso ${clase2}" onclick="float_selected(0,0,'Global',this)">
	            <img src="images/logo.png" ${clase}>
	        </div>`
		);
	clase = "";
	clase2 = "";
	cursos.forEach(curso => {
		let imagen = "svg/imagen.svg";
		if(curso.imagen != "")imagen = `img/${curso.imagen}`;
		
		$(".div-curso-float").append(
			`<div id="${curso.codcur}${curso.codpar}" class="div-curso ${clase2}" onclick="float_selected(${curso.codcur},${curso.codpar},'${curso.nombre}',this)">
	            <img src="${imagen}" ${clase}>
	        </div>`
		);
		
	});
	/*$(".div-curso-float").append(
		`<div id="btn-other" class="div-curso ${clase2}" onclick="other_tops(this)">
	        <img src="svg/agregar.svg" ${clase}>
	    </div>`
	);*/
	if(cursos.length == 1){
		$(".div-cursos-float").addClass("oculto");
	}
}
const other_tops = e => {
	$(".div-tabla").empty();
	$(".div-tabla").append(
		`<h2 id="title-tabla">TOP'S por materias</h2>`
	);
	$(".div-btn-refresh").addClass("oculto");
	$(".float-selected").css('transition','.5s');
	$(".float-selected").removeClass('float-selected');
	$(".div-float-selected").css("transition",".5s");
	$(".div-float-selected").removeClass('div-float-selected');
	let child = e.children;
	e.setAttribute.transition = ".5s";
	e.classList.add('div-float-selected');
	child[0].classList.add('float-selected');
}
const get_top = async () => {
	await $.get(
			"controlador/top_calificaciones_controlador.php?op=get_top",
			data => {
				if(data.status == "ok"){
					__top = data.top;
					__alumnos = data.alumnos;
					__cursos = data.cursos;
					__fecha = data.fecha;
					__curmat = data.curmat;
					__materias =data.materias;
				}
			},"json"
		);	
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
const get_notas_alumno = codalu => {
	let n = [];
	__top.forEach( a => {
		if(a.codalu == codalu){
			n.push(a);
		}
	});
	return n;
}
const get_materias_curso = (codcur,codpar) => {
	let m = [];
	__curmat.forEach( cm => {
		if(cm.codcur == codcur && cm.codpar == codpar)m.push(get_materia(cm.codmat));
	});
	return m;
}
const get_curso_alumno = codalu => {
	for (var i = 0; i < __alumnos.length; i++) {
		if(__alumnos[i].codalu == codalu )return __alumnos[i]; 
	}
	return [];
}
const close_notas_materias = () => {
	$("#notas-materia").addClass("oculto");
	$(".div-tabla").removeClass("oculto");
}
const get_data = codalu => {
	let na = get_notas_alumno(codalu);
	let ca = get_curso_alumno(codalu);
	let notas = "";
	na.forEach( n => {
		notas = `${notas}<tr>
			                <td width="100px">${n.materia}</td>
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
const get_curso = (codcur,codpar) => {
	for (var i = 0; i < __cursos.length; i++) {
		if(__cursos[i].codcur == codcur && __cursos[i].codpar == codpar)return __cursos[i];
	}
	return [];
}
const mostrar_top = (codcur,codpar,nombre) => {
	$(".div-tabla").empty();
	let lista_top = [];
	__alumnos.forEach(alumno => {
		if((codcur == 0 && codpar == 0) || (codcur == alumno.codcur && codpar == alumno.codpar)){
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
	//$("#title-tabla").html(nombre);
	$(".div-tabla").append(`<h2 id="title-tabla">${nombre}</h2>`);
	$(".div-tabla").append(
		`<table class="table">
	        <thead id="head-tabla">
	            <tr>
	                <td>No.</td>
	                <td>Nombre</td>
	                <td>Nota</td>
	            </tr>
	        </thead>
	        <tbody id="body">
	    
	        </tbody>
	    </table>`);
	//$("#body").empty();
	let index = 1;
	
	lista_top.forEach( e => {
		let ca = get_curso_alumno(e[1]);
		let cu = get_curso(ca.codcur,ca.codpar);
		$("#body").append(
			`<tr onclick="get_data(${e[1]});" title="${cu.nombre}">
                <td class="center w60">${index}</td>
                <td>${e[2]}</td>
                <td class="center w60">${e[0]}</td>
            </tr>`
		);
		index++;
	});
}

const top_materias = (codcur,codpar,codmat,nombre) => {
	let priS = 'class="selected"';
	let secS = 'class="selected"';
	if(__nivel == __PRIMARIA)secS = "";
	if(__nivel == __SECUNDARIA)priS = "";
	$(".div-tabla").empty();
	if(codcur == 0 && codpar == 0){
		$(".div-tabla").append(
			`<div class="div-select-nivel">
		        <button ${priS} style="border-radius: 5px 0px 0px 5px;" onclick="nivel(${__PRIMARIA});">PRIMARIA</button>
		        <button ${secS}  style="border-radius: 0px 5px 5px 0px;" onclick="nivel(${__SECUNDARIA});">SECUNDARIA</button>
		    </div>`
		);
	}else{
		$(".div-tabla").append(
			`<h2>${get_curso(codcur,codpar).nombre}</h2>`
		);
	}
	let materias = [];
	if(codcur == 0 && codpar == 0)materias = get_materias(__nivel);
	else materias = get_materias_curso(codcur,codpar);
	let li_materias = "";
	for (var i = 0; i < materias.length; i++) {
		let cm = materias[i].codmat;
		let nombre = materias[i].nombre;
		let style = "";
		let selected = "";
		if(codmat == cm)selected = 'class="selected-b"';
		if( i == 0 )style = 'style="border-radius: 5px 0px 0px 5px;"';
		if( i == materias.length - 1)style = 'style="border-radius: 0px 5px 5px 0px;"';
		li_materias = `${li_materias}<li id="${cm}" ${style} ${selected} onclick="materia_selected('${cm}')">${nombre}</li>`;
	}
	$(".div-tabla").append(`<div class="div-selector-materias">
			<ul>
				${li_materias}
	        </ul>
	    </div>
	    <div id="divm"></div>`
	);
}
const float_selected = (codcur,codpar,nombre,e) => {
	if(codcur != __curso_selected[0] || codpar != __curso_selected[1]){
		__curso_selected = [codcur,codpar];
	}
	console.log(__curso_selected)
	if(__tops == __GLOBAL)mostrar_top(codcur,codpar,nombre);
	if(__tops == __MATERIAS)top_materias(codcur,codpar,"","TOP GLOBAL");
	$(".float-selected").css('transition','.5s');
	$(".float-selected").removeClass('float-selected');
	$(".div-float-selected").css("transition",".5s");
	$(".div-float-selected").removeClass('div-float-selected');
	let child = e.children;
	e.setAttribute.transition = ".5s";
	e.classList.add('div-float-selected');
	child[0].classList.add('float-selected');
}
const nivel = n => {
	__nivel = n;
	top_materias(0,0,"","");
	mostrar_top_materias(0,0,"");
}
const get_materias = nivel => {
	let mat = [];
	__materias.forEach( m => {
		if(m.nivel == nivel)mat.push(m);
	});
	return mat;
}
const get_materia = codmat => {
	for (var i = 0; i < __materias.length; i++) {
		if( __materias[i].codmat == codmat )return __materias[i];
	}
	return [];
}
const materia_selected = codmat => {
	$(".selected-b").removeClass("selected-b");
	$(`#${codmat}`).addClass("selected-b");
	__materia_selected = codmat;
	mostrar_top_materias(__curso_selected[0],__curso_selected[1],__materia_selected,get_materia(__materia_selected).nombre);
}
const get_nota = (codalu,codmat) => {
	for (var i = 0; i < __top.length; i++) {
		if(__top[i].codalu == codalu && __top[i].codmat == codmat)return __top[i].nota;
	}
	return "";
}
const get_top_materia = (nivel,codmat) => {
	let lista = [];
	__alumnos.forEach( a => {
		if(a.nivel == nivel){
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
const get_top_curso_materia = (codcur,codpar,codmat) => {
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
	__materia_selected = codmat;
	
	$("#divm").empty();
	if(codcur == 0 && codpar == 0){
		if(__materia_selected != ""){
			let top_notas = get_top_materia(__nivel,__materia_selected);
			$("#divm").append(
				`<h2 id="title-tabla">${get_materia(__materia_selected).nombre}</h2>
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
			top_notas.forEach( t => {
				let ca = get_curso_alumno(t[1]);
				let cu = get_curso(ca.codcur,ca.codpar);
				$("#body").append(
					`<tr onclick="get_data(${t[1]});" title="${cu.nombre}">
		                <td class="center w100">${index}</td>
		                <td>${t[2]}</td>
		                <td class="center w100">${t[0]}</td>
		            </tr>`
				);
				index++;

			})
		}
	}else{
		if(__materia_selected != ""){
			let top_notas = get_top_curso_materia(codcur,codpar,__materia_selected);
			$("#divm").append(
				`<h2 id="title-tabla">${get_materia(__materia_selected).nombre}</h2>
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
	}
}
const init = async () => {
	await get_top();
	cargar_cursos(__cursos);
	if(__tops == __GLOBAL)mostrar_top(0,0,"Global");
	if(__tops == __MATERIAS)top_materias(0,0,"","GLOBAL MATERIAS");
	$(".div-tabla").removeClass("oculto");
}
const top_selected = t => {
	__tops = t;
	__materia_selected = "";
	let n = get_curso(__curso_selected[0],__curso_selected[1]);
	let nombre = n.length == 0?"GLOBAL":n.nombre;
	if(__tops == __GLOBAL)mostrar_top(__curso_selected[0],__curso_selected[1],nombre);
	if(__tops == __MATERIAS)top_materias(__curso_selected[0],__curso_selected[1],__materia_selected,"GLOBAL MATERIAS")
}
$(document).ready(()=>{
	init();
	$("#btn-refresh").click(()=>{
		update_top();
	})
	$("#btn-adjust").click(()=>{
		let _global = __tops == __GLOBAL ? "checked":"";
		let _materias = __tops == __MATERIAS ? "checked":"";
		Swal.fire(
			`<div class="div-adjust">
				<div class="div-op-adjust">Top Global <input type="radio" name="top" ${_global} onclick="top_selected(${__GLOBAL});"></div>
				<div class="div-op-adjust">Top por materias <input type="radio" name="top" ${_materias} onclick="top_selected(${__MATERIAS});"></div>
			</div>`
		);
	})
});