var tabla;

function getParameterByName(name) {

    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),

    results = regex.exec(location.search);

    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

}

var sw=getParameterByName('sw1');

function crear(codcur,codmat,codpar){

	//var html=$.ajax({type:"GET",url:'create_eval.php',data:{sw1:sw,sw2:codcur,sw3:codmat},async:false}).responseText;

	//eval(html);

	//if(exito==1){

		location.href='view_new_question_test.php?sw1='+sw+'&sw2='+codcur+'&sw3='+codmat+'&codpar='+codpar;

	//}

}

function listar(){
var sw=getParameterByName('sw1');	
	tabla=$('#tbllistado').dataTable({
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
			url:'listar_tests_10p.php?sw1='+sw,
			type: "get",
			dataType: "json",
			error: function(e){
				console.log(e.responseText);
			}},
			"bDestroy": true
	}).DataTable();
}

$(document).ready(function()

				  {$('#btnCancelar').bind('click',function(){var sw=getParameterByName('sw1');var sw1=getParameterByName('sw2');location.href='regeval.php?sw1='+sw;});

				   })

listar();