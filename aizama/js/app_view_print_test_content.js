var tabla;


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function listar(){
var sw=getParameterByName('sw1');
	tabla=$('#tbllistado').dataTable({
		"aProcessing":true,
		"aServerSide":true,
		dom:'Bfrtip',
		"ajax":{
			url:'listar_preguntas_print.php?sw1='+sw,
			type: "get",
			dataType: "json",
			error: function(e){
				console.log(e.responseText);
			}
		},
		"bDestroy":true,
		"iDisplayLength":200

	}).DataTable();



}
function imprimir()
{
	$('#btnSalir').hide();
	$('#print').hide();
	var mode = 'iframe'; //popup
    var close = mode == "popup";
    var options = { mode : mode, popClose : close};
        $("#textprint").printArea( options );
	$('#btnSalir').show();
	$('#print').show();
	
}
$(document).ready(function()
				  {$('#btnSalir').bind('click',function(){var sw=getParameterByName('sw1');sw1=getParameterByName('sw2');location.href='view_test_content.php?sw1='+sw+'&sw2='+sw1;});
				   $('#print').bind('click',function(){imprimir()});

				   })

listar();


