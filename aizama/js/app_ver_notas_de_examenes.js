var tabla;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function reevaluar(codalu,codexa){
	let alumno = codalu;
	let examen = codexa;
	let formdata = new FormData();
	formdata.append("codalu",alumno);
	formdata.append("codexa",examen);
	let request = $.ajax({
						url:'reevaluar_json.php',
						type:'POST',
						data:formdata,
						contentType:false,
						processData:false,
						async:false

					}).responseText;
	if (request=="ok") {
		alert("Alumno habilitado para realizar el examen");
		listar();
	}else{
		alert("Error");
	}
}
function listar(){
var sw=getParameterByName('sw1')
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
		buttons:[
		'copyHtml5',
		'excelHtml5',
		'csvHtml5',
		'pdf'
		],
		"ajax":{
			url:'listar_notas_de_examen.php?sw1='+sw,
			type: "get",
			dataType: "json",
			error: function(e){
				console.log(e.responseText);
			}
		},
		"bDestroy":true,
		"iDisplayLength": 50,
		"order": [[1,"asc"]]
	}).DataTable();



}
$(document).ready(function()
				  {$('#btnSalir').bind('click',function(){var sw=getParameterByName('sw2');location.href='lista_de_examenes.php?sw1='+sw;});

				   })

listar();


