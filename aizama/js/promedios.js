let curso;
let paralelo;
let trimestre;
let lista_paralelos = [];
let lista_promedios = [];
const obtenereCursos = ()=>{
	$.post(
		"obtener_curso_json.php?op=ca",
		(respuesta)=>{
  			if (respuesta['status'] == 'ok') {
      			niveles = respuesta['niveles'];
      			$("#select-curso").empty();
      			$("#select-curso").append('<option value="0"> -- Seleccionar curso -- </option>');
      			for(var i = 0; i < niveles.length; i++ ) {
        			$("#select-curso").append('<option value ="'+(niveles[i]['codcur'])+'">' + niveles[i]['nombre'] + '</option>');
      			}	
  			}
 
  			if(respuesta['status'] == 'eSession') {
    			alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
    			return false;
  			} else if (respuesta['status'] == 'noMaterias') {
      			alert('Este colegio aun no tiene materias');
      
  			} else if (respuesta['status'] == 'noPermitido') {
    			alert('Esta permitido para los administrador');
  			} 
		},
		"json"
	);
}
const obtenerParalelos = ()=>{
	$.post(
		"paralelos_json.php",
		(respuesta)=>{
  			if (respuesta['status'] == 'ok') {
      			lista_paralelos = respuesta['paralelos'];
      			for(var i = 0; i < lista_paralelos.length; i++ ) {
        			$("#select-paralelo").append('<option value ="'+(lista_paralelos[i]['codpar'])+'">' + lista_paralelos[i]['nombre'] + '</option>');
      			}	
  			}  
		},
		"json"
	);
}

const pedirPromedios = ()=>{
	if(validarDatos()){
		$.post(
			"promedios_json.php?op=pc&usr=adm",
			{codcur:curso,codpar:paralelo,trimestre:trimestre},
			(datos,estado,xhr)=>{
				let status = datos.status;
				if(status == "ok"){
					lista_promedios = datos.lista;
					mostrarListaPromedios();
				}
			},
			"json"
		);
	}else{
		$('.div-tpromedios').css('display','none');
	}
} 

const mostrarListaPromedios = ()=>{
	$('#campos').empty();
	let indice = 1;
	lista_promedios.forEach((promedio)=>{
		let nombre = promedio.nombre;
		let nota = promedio.promedio;
		$('#campos').append(
							`<tr>
							   <td>${indice}</td>
							   <td>${nombre}</td>
							   <td>${nota}</td>
							 <tr>`
							);
		indice++;

	});
	$('.div-tpromedios').css('display','block');
}

const validarDatos = ()=>{
	curso = $('#select-curso').val();
	paralelo = $('#select-paralelo').val();
	trimestre = $('#select-trimestre').val();

	return curso>0&&paralelo>0&&trimestre>0;
}

$(document).ready(()=>{

	$('#select-curso').select2({width:'300px'});
	$('#select-paralelo').select2({width:'300px'});
	$('#select-trimestre').select2({width:'300px'});

	obtenereCursos();
	obtenerParalelos();

	$('#select-curso').change(()=>pedirPromedios());
	$('#select-paralelo').change(()=>pedirPromedios());
	$('#select-trimestre').change(()=>pedirPromedios());
});