
function init()
{
$.post("obtener_materias.php?id=1",function(r){
	//console.log(r);
	$("#materias").html(r);
	$('#materias').selectpicker('refresh');

});
$.post("obtener_cursos.php?id=1",function(r){
	//console.log(r);
	$("#cursos").html(r);
	$('#sursos').selectpicker('refresh');

});
}

init();