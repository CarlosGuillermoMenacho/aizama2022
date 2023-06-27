var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
function init(){
	var cur=getParameterByName('curso');
    var paralelo=getParameterByName('paralelo');
	var request=$.ajax({type:"POST",url:"getCurso_and_getParalelo.php?curso="+cur+"&paralelo="+paralelo,contentType: false, processData: false,async:false}).responseText;
	$('#curdescrip').val(request);
	var f=new Date();
	$('#fecha').val(diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear());
//	request=$.ajax({type:"POSt",url:"list_asistencia.php?op=asistencia",data:{cod_curso:cur},async:false}).responseText;
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
			url:'list_asistencia.php?op=asistencia',
			type: "post",
			data:{cod_curso:cur, cod_par:paralelo},
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
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function newFecha(){

	var cur=getParameterByName('curso');
	var request=$.ajax({type:"POST",url:"get_curso.php?id="+cur,contentType: false, processData: false,async:false}).responseText;
	eval(request);
	$('#curdescrip').attr("value",descrip);
    var paralelo=getParameterByName('paralelo');

	var f1=$('#newFecha').val().split('-');
	var f=new Date(f1[1]+'-'+f1[2]+'-'+f1[0]);
	$('#fecha').val(diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear());
//	request=$.ajax({type:"POSt",url:"list_asistencia.php?op=fechaAsistencia",data:{"cod_curso":cur,"fecha":$('#newFecha').val()},async:false}).responseText;
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
			url:'list_asistencia.php?op=fechaAsistencia',
			type: "post",
			data:{"cod_curso":cur,"fecha":$('#newFecha').val(), "cod_par":paralelo },
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
function convertDateFormat(string) {
  var info = string.split('-');
  return info[1] + '/' + info[2] + '/' + info[0];
}
init();
$(document).ready(function(){
								$('#btnSalir').bind('click',function(){location.href='agenda.php';});
								$('#btnNewFecha').bind('click',function(){newFecha();});	   
							}
							)
