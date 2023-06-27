var tabla;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var sw=getParameterByName('sw1');
function lista(examen){	

location.href='ver_notas_de_examenes.php?sw1='+examen+'&sw2='+sw;		
}
function listar(){
	
	tabla=$('#tbllistado').dataTable({
		"aProcessing":true,
		"aServerSide":true,
		dom:'Bfrtip',
		"ajax":{
			url:'get_materias_prof.php?sw1='+sw,
			type: "get",
			dataType: "json",
			error: function(e){
				console.log(e.responseText);
			}
		}
	}).DataTable();



}
$(document).ready(function()
				  {$('#btnSalir').bind('click',function(){location.href='ver_examenes.php';});
				   })

listar();


