var tabla;
var nuevo_eva;




function getParameterByName(name) {

    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),

    results = regex.exec(location.search);

    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

}

function agregar(){

	var sw1=getParameterByName('sw1');// codigo de evaluacion
	var sw2=getParameterByName('sw2');// nuemero de evaluacion
	//var sw2=nuevo_eva;// nuemero de evaluacion

	location.href='view_new_question.php?sw1='+sw1+'&sw2='+sw2;

	

	

}

function listar(){



var sw=getParameterByName('sw1');

var formdata = new FormData();

formdata.append('codexa',sw);

var request=$.ajax({

					url:"evaluaciones_json.php?op=evaluaciondetalle",

    				type: "POST",

    				data: formdata,

    				contentType: false,

    				processData: false,

    				async:false

    			}).responseText;

let jsonObject = JSON.parse(request);

if (jsonObject['status']=='eSession') {

	alert("La sesi贸n ha finalizado...");

	location.href = 'docentes.php';

	return;

}

if (jsonObject['status']=='ok') {

	let descripcion = jsonObject['descripcion'];

	let fechai = jsonObject['fechai'];

	let fechaf = jsonObject['fechaf'];

	let horai = jsonObject['horai'];

	let horaf = jsonObject['horaf'];



	$('#ta').val(descripcion);

	$('#fechai').val(fechai);

	$('#horai').val(horai);

	$('#fechaf').val(fechaf);

	$('#horaf').val(horaf);

}



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



			url:'listar_preguntas.php?sw1='+sw,



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

function actualizar(){

	if(validar()){



		var sw=getParameterByName('sw1');

		var desc = $('#ta').val();

		var fi = $('#fechai').val();

		var ff = $('#fechaf').val();

		var hi = $('#horai').val();

		var hf = $('#horaf').val();



		var formdata = new FormData();

		formdata.append('codexa',sw);

		formdata.append('descripcion',desc);

		formdata.append('fechai',fi);

		formdata.append('fechaf',ff);

		formdata.append('horai',hi);

		formdata.append('horaf',hf);

		



        //alert('entrando');

        //console.log('hola');



        var request=$.ajax({

        					url:"evaluaciones_json_10p.php?op=updateevaluacion",

            				type: "POST",

            				data: formdata,

            				contentType: false,

            				processData: false,

            				async:false

            			}).responseText;

		let jsonObject = JSON.parse(request);

		if (jsonObject['status']=="eSession") {

			alert('La sesi贸n ha finalizado...!!!');

			location.href='docentes.php';

			return;

		}

		if (jsonObject['status']=="ok") {

			//alert('Actualizado exitosamente...!!!');

			Swal.fire("Actualizado exitosamente...!!!");

			return;

		}

	}else{

		alert('Debe llenar correctamente todos los campos...!!!');

		if ($('#ta').val()=="") {$('#ta').focus();return;}

		if ($('#fechai').val()=="") {$('#fechai').focus();return;}

		if ($('#fechaf').val()=="") {$('#fechaf').focus();return;}

		if ($('#horai').val()=="") {$('#horai').focus();return;}

		if ($('#horaf').val()=="") {$('#horaf').focus();return;}

	}

}

function eliminarEvaluacion(){

	var sw1=getParameterByName('sw1');// codigo de evaluacion



	var sw2=getParameterByName('sw2');// nuemero de evaluacion



	let formdata = new FormData();

	formdata.append('codeva',sw1);

	/*

	let request = $.ajax({

							url:"evaluaciones_json_10p.php?op=deleteevaluacion",

							type:"POST",

							data: formdata,

		    				contentType: false,

		    				processData: false,

		    				async:false

							}).responseText;

	if (request=='ok') {

		alert("Se eliminó la evaluación...!!!");

		location.href = "regeval.php?sw1="+sw2;

	}

	if (request=='errorhayregistros') {

		alert("No se puede eliminar, ya hay alumnos que evaluaron este examen...!!!");

	}else{

		alert('No se pudo eliminar la evaluación\nIntente nuevamente...!!!')

	}

	*/

	

	Swal.queue([{

    title: 'Atención...!',

    confirmButtonText: 'Si',

    cancelButtonText: 'No',

    showCancelButton: true,

    text:'Se eliminará la evaluación',

    showLoaderOnConfirm: true,

    preConfirm: () => {

	let request = $.ajax({

							url:"evaluaciones_json_10p.php?op=deleteevaluacion",

							type:"POST",

							data: formdata,

		    				contentType: false,

		    				processData: false,

		    				async:false

							}).responseText;

    	if (request=='ok') {

			alert("Se eliminó la evaluación...!!!");

    		location.href = "regeval.php?sw1="+sw2;

    	}

    	if (request=='errorhayregistros') {

			Swal.fire("No se puede eliminar, ya hay alumnos que evaluaron este examen...!!!");

    	}

    	if (request=='errorsqldelete'){

 			Swal.fire("No se pudo eliminar la evaluación\nIntente nuevamente...!!!");

   	    }

							

    }

  }]);

}

function validar(){

	let desc = $('#ta').val();

	let fi = $('#fechai').val();

	let ff = $('#fechaf').val();

	let hi = $('#horai').val();

	let hf = $('#horaf').val();



	return (desc!=""&&hi!=""&&hf!=""&&fi!=""&&ff!=""); 

}

function editar(id){

	var sw=getParameterByName('sw2');

	var sw3=getParameterByName('sw1');

	

	location.href='view_edit_question.php?sw1='+id+'&sw2='+sw+'&sw3='+sw3;

}

$(document).ready(function()

				  {
					nuevo_eva = $('#nuevo_codeva').val();
					$('#btnSalir').bind('click',function(){var sw=getParameterByName('sw2');location.href='regeval.php?sw1='+sw;});

				   $('#btnNuevo').bind('click',function(){agregar();});

				   $('#print').bind('click',function(){var sw=getParameterByName('sw1');sw1=getParameterByName('sw2');location.href='view_print_test_content.php?sw1='+sw+'&sw2='+sw1;});

                      $('#btnEditarDetalle').bind('click',function(){actualizar();});

				   $('#btnEliminar').bind('click',function(){eliminarEvaluacion();});

				   })



listar();





