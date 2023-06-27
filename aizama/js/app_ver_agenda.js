var lista=[];
var indice=0;
var observaciones;
var registrosES;
var alumno;
var materia;

function convertDateFormat(string) {
        var info = string.split('/').reverse().join('-');
        return info;
}

function validate_fechaMayorQue(fechaInicial,fechaFinal){
    
    valuesStart=fechaInicial.split("/");
    valuesEnd=fechaFinal.split("/");
 
    var dateStart=new Date(valuesStart[2],(valuesStart[1]-1),valuesStart[0]);
    var dateEnd=new Date(valuesEnd[2],(valuesEnd[1]-1),valuesEnd[0]);

    if(dateStart>=dateEnd){
        return 0;
    }
    return 1;
}

function validarFecha(fecha){
    
    var fechaf = fecha.split("/");
    var day = fechaf[0];
    var month = fechaf[1];
    var year = fechaf[2];
    var date = new Date(year,month,'0');
    if((day-0)>(date.getDate()-0) || fecha==''){
        return false;
    }
    
    return true;
}
function cargar_mensajes(){
	tabla=$('#tbllistadomsn').dataTable({
			language: {
        		"decimal": "",
        		"emptyTable": "No hay información",
        		"info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
        		"infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
        		"infoFiltered": "(Filtrado de _MAX_ total entradas)",
        		"infoPostFix": "",
        		"thousands": ",",
        		"lengthMenu": "Mostrar _MENU_ Entradas",
        		"loadingRecords": "Cargando...",
        		"processing": "Procesando...",
        		"search": "Buscar:",
        		"zeroRecords": "Sin resultados encontrados",
        		"paginate": {
            		"first": "Primero",
            		"last": "Ultimo",
            		"next": "Siguiente",
            		"previous": "Anterior"
        		}
    		},
			"aProcessing":true,
			"aServerSide":true,
			dom:'Bfrtip',
			"ajax":{
				url:"data_agenda2.php?op=listmsn"+"&codalu="+$('#slcalumnos').val(),
				type: "get",
				dataType: "json",
				error: function(e){
					console.log(e.responseText);
				}
			},
			"bDestroy":true,
			"iDisplayLength": 15,
			"order": [[0,"asc"]]
		}).DataTable();
}

function cargar_observaciones(){

		tabla=$('#tbllistado').dataTable({
			language: {
        		"decimal": "",
        		"emptyTable": "No hay información",
        		"info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
        		"infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
        		"infoFiltered": "(Filtrado de _MAX_ total entradas)",
        		"infoPostFix": "",
        		"thousands": ",",
        		"lengthMenu": "Mostrar _MENU_ Entradas",
        		"loadingRecords": "Cargando...",
        		"processing": "Procesando...",
        		"search": "Buscar:",
        		"zeroRecords": "Sin resultados encontrados",
        		"paginate": {
            		"first": "Primero",
            		"last": "Ultimo",
            		"next": "Siguiente",
            		"previous": "Anterior"
        		}
    		},
			"aProcessing":true,
			"aServerSide":true,
			dom:'Bfrtip',
			"ajax":{
				url:"data_agenda2.php?op=listobs"+"&codalu="+$('#slcalumnos').val(),
				type: "get",
				dataType: "json",
				error: function(e){
					console.log(e.responseText);
				}
			},
			"bDestroy":true,
			"iDisplayLength": 15,
			"order": [[0,"asc"]]
		}).DataTable();
		


		//$('#listaobs').show();
		$('#tbllistado').focus();
		return true;
}

function cargarRegistrosES(){
	
		if ($('#sinfiltro').prop("checked")){
			consulta="data_agenda2.php?op=listares&id="+$('#slcalumnos').val();
		}else{
			if ($('#flagenda').prop("checked")) {
				consulta="data_agenda2.php?op=listares1&id="+$('#slcalumnos').val();
			}else{
				consulta="data_agenda2.php?op=listares3&id="+$('#slcalumnos').val();
			}
		}

		tabla=$('#tbllistado2').dataTable({
			language: {
        		"decimal": "",
        		"emptyTable": "No hay información",
        		"info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
        		"infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
        		"infoFiltered": "(Filtrado de _MAX_ total entradas)",
        		"infoPostFix": "",
        		"thousands": ",",
        		"lengthMenu": "Mostrar _MENU_ Entradas",
        		"loadingRecords": "Cargando...",
        		"processing": "Procesando...",
        		"search": "Buscar:",
        		"zeroRecords": "Sin resultados encontrados",
        		"paginate": {
            		"first": "Primero",
            		"last": "Ultimo",
            		"next": "Siguiente",
            		"previous": "Anterior"
        		}
    		},
				"aProcessing":true,
				"aServerSide":true,
				dom:'Bfrtip',
				"ajax":{
						url:consulta,
						type: "get",
						dataType: "json",
						error: function(e){
											console.log(e.responseText);
										  }
						},
				"bDestroy":true,
				"iDisplayLength": 15,
				"order": [[0,"asc"]]
				}).DataTable();	
}

function mostrarfiltro(){

	$('#flagenda').prop("checked","true");
	$('#filtrocsagenda').show();
	cargarRegistrosES();
}

function ocultarfiltro(){

	cargarRegistrosES();
	$('#filtrocsagenda').hide();
}

function init(){
	
		$.ajax({
			type:"POST",
			url:"data_agenda.php?op=Allalumnos",
			success:function(r){
				if(r=='eSession'){
	  				alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  				return false;
					}

				$('#slcalumnos').html(r);
			}
			});
		

}
function listarMaterias(curso){
	console.log(curso);
	$.ajax({
			type:"POST",
			url:"obtener_materias.php",
			data:{"cod_curso":curso},
			success:function(r){
				if(r=='eSession'){
	  				alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  				return false;
					}

				$('#slcmateria').html(r);
			}
			});
}
function cargarCurso(){
	var cursos;
$.ajax({type:"POST",url:"data_agenda.php?op=cur_alu",data:{"cod_alu":$('#slcalumnos').val()},success:function(r){$('#cursoDescrip').val($.parseJSON(r).curso);listarMaterias($.parseJSON(r).codigo);}});
}
function checkc(){
	if ($("#materiafilter").prop("checked")) {
	if ($('#slcmateria').val()==null) {
		alert("Debe seleccionar una materia.");
	}else{
		console.log($('#slcmateria').val());
		cargar_observaciones();
	}
}else{
	$("#materiafilter").prop("checked",false);
}
}

$(document).ready(function()
						   {							   					 							  
							   $('#btnSalir').bind('click',function(){location.href='m_examen.php';});
							   $('#slcalumnos').select2();
							   $('#slcalumnos').change(function(){cargarCurso();cargar_observaciones();cargarRegistrosES();cargar_mensajes()});
							   $('#slcmateria').select2();
							   $('#slcmateria').change(function(){cargar_observaciones();})
							}
							)
init();
