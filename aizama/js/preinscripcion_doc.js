let listaCursos = [];
const get_cursos_prof = ()=>{
	$.post("obtener_curso_json.php?op=cp",function(respuesta){
	  var jsonDataCursos = JSON.parse(respuesta);
		if (jsonDataCursos['status'] == 'ok') {     
				listaCursos = jsonDataCursos['cursos'];
				for (let i = 0; i < listaCursos.length; i++) {    
					var cursos = listaCursos[i]['nombre']; 
					$("#seleccionar_curso").append('<option value ="'+ (i+1) +'">' + cursos + '</option>');
	      		}
	      		if(listaCursos.length > 0)$('.div-select').removeClass('oculto');
	  }
	  if(respuesta=='eSession') {
	    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	    location.href ="docentes.php";
	    return false;
	  }
	});
}
const mostrar_lista = lista => {
	let index = 1;
    lista.forEach(alumno => {
        
        let fila = '<td class="border-td center"> &nbsp; </td>';
        if(alumno.preinscripcion !== "" && alumno.preinscripcion.inscripcion == 1){
            fila = `<td class="border-td center">Pre - Inscrito</td>
            		<td class="border-td center">Modalidad Presencial</td>`;
        }
        if(alumno.preinscripcion !== "" && alumno.preinscripcion.inscripcion == 2){
            fila = `<td class="border-td center danger">No Continuar&aacute;</td>
            		<td class="border-td center">&nbsp;</td>`;
        }
        if(alumno.preinscripcion !== "" && alumno.preinscripcion.inscripcion == 3){
            fila = `<td class="border-td center">Pre - Inscrito</td>
            		<td class="border-td center">Modalidad Virtual</td>`;
        }    
        $("#body").append(`
                        <tr>
                            <td class="border-top index">${index}</td>
                            <td class="border-td">${alumno.nombre}</td>
                            ${fila}
                        </tr>   
                          `);
        index++;
      
    });
    $("#tabla_lista").removeClass('oculto');
};
const get_preinscripciones = ()=>{
	let index = $("#seleccionar_curso").val();
	$("#tabla_lista").addClass('oculto');
	$("#body").empty();
	if(index!=""){
		let codcur = listaCursos[index - 1].codcur;
		let codpar = listaCursos[index - 1].codpar;

		$.post(
	        "controlador/preinscripcion_controlador.php?op=pre_inscripcion_curso",
	        {codcur:codcur,codpar:codpar},
	        datos => {
	            if(datos.status == "ok"){
	                mostrar_lista(datos.datos);
	            }
	            if(datos.status == "eSession")location.href = 'familia.php';
	            
	        },
	        "json"
        );
	}
};
$(document).ready(()=>{
	get_cursos_prof();
	$("#seleccionar_curso").change(()=>{
		get_preinscripciones();
	});
})