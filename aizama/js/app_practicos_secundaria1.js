var lista=[];
var indice=0;
var c_mate='';
function init(){
//	console.log(cur);
    $('#slcmateria').html('<option value="">Seleccionar Materia</option>');
    lista=[];
	$.ajax({
			type:"POST",
			url:"obtener_materias.php",
			data:"cod_curso=" + $('#vf_codi_curso').val(),
			success:function(r){
				if(r=='eSession'){
	  				alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  				return false;
					}

				$('#slcmateria').html(r);
			}
	});
}	


function getAsignarMateria(id)
{
//	  alert('holassss   1');
	var html=$.ajax({type:"GET",url:'asignar_materia.php',data:{id:id},async:false}).responseText;
//	  alert('holassss   2');
	if(html=='eNoNumeric'){
	  alert('No numerico o variable no declarada');
	  return false;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
	if(html=='eHecho'){
		// se asigno la materia correctamente
//	  alert('holassss  3');
	  return true;
	}
}

function lenguaje()
{
	$codm = 2;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function matematicas()
{
	$codm = 1;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function naturales()
{
	$codm = 5;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function sociales()
{
	$codm = 8;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function musica()
{
	$codm = 14;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function edu_fisica()
{
	$codm = 13;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function religion()
{
	$codm = 16;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function ingles()
{
	$codm = 12;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function psicologia()
{
	$codm = 4;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function filosofia()
{
	$codm = 3;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function computacion()
{
	$codm = 17;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function biologia()
{
	$codm = 10;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function quimica()
{
	$codm = 7;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function fisica()
{
	$codm = 6;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function artes_p()
{
	$codm = 15;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function civica()
{
	$codm = 11;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function geografia()
{
	$codm = 20;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function historia()
{
	$codm = 21;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}
function ortografia()
{
	$codm = 22;
	if (getAsignarMateria($codm))
	{
		location.href='ver_practicos.php?vista=3';
	}
}


function formSubmit()
{
	if (validarDato())
	{
		$('#fGrabar').submit();
		alert('GRABADO CON EXITO');
//		getSiguiente(1); // paso este valor 1 solo para que entre, no tiene ningun efecto
//		$('#vf_grabao').val('Si');
//		$('#vf_actual').focus();
	    $('#vf_nombre').val('');
    	$('#vf_anterior').val('');
	    $('#vf_actual').val('');
    	$('#vf_clave').val('');
	    $('#vf_claveuso').val('');
		$('#vf_anterior').focus();
		$('#vf_nombre').focus();
		return true;
	}
	else
	{
		alert('FALTAN DATOS PARA GRABAR ! O SON INCORRECTOS !!!');
	}
}
function listar(nro_p){
//	alert ('hola 6.1');
//	var bim = $('#bimestre').val();
	var codCurso = $('#vf_codi_curso').val();
	var codMateria = $('#slcmateria').val();	
//	var tot_prac = $('#vf_cantidad').val();
	var nro_prac = nro_p;
//	var cod_cuest = $('#vf_cod_cuest').val();

//	alert ('hola 7');
	if (parseInt(nro_prac)>0){
		var html=$.ajax({type:"POST",url:'get_lista_practicos.php?op=lista_llena',data:{materia:codMateria,curso:codCurso},async:false}).responseText;
	}
//	alert ('hola 6.8');
 	lista = JSON.parse(html);
//	alert ('hola 8');
}
function validarVer(nro_p)
{
	if ($('#vf_codi_curso').val() == '' || $('#slcmateria').val() == '' || nro_p == '')
	{
//		alert('1');
		return false;
	}
	else
	{
		if (parseInt($('#vf_codi_curso').val()) >= 0 && parseInt(nro_p) >= 0 )
		{
			return true;
		}
		else
		{
//			alert('2');
			return false;
		}
	}
}

function Ver_cuestionario(nro_c)
{
	if (validarVer(nro_c))
	{
	    var jsVar1 = parseInt($('#vf_codi_curso').val());
    	var jsVar2 = $('#slcmateria').val();
	    var jsVar3 = parseInt(nro_c);
    	var jsVar4 = $('#vf_name_curso').val();
    	var jsVar5 = $('#vf_name_curso').val();
		//    window.location.href = window.location.href + "?w1=" + jsVar1 + "&w2=" + jsVar2;
    	window.location.href = 'ver_cuestion_alu.php' + "?w1=" + jsVar1 + "&w2=" + jsVar2 + "&w3=" + jsVar3 + "&w4=" + jsVar4.trim() + "&w5=" + jsVar5.trim();
		return true;
	}
	else
	{
		alert('FALTAN DATOS PARA VISUALIZAR ! O SON INCORRECTOS !!!');
		return false;
	}
}

function crearTabla(){
    var col = 3;
    var combo = document.getElementById("slcmateria");
    var materia=combo.options[combo.selectedIndex].text;
    var filas = lista.length;
    var tabla='<table border="1px solid;" style="border-collapse:collapse;width:550px;">';
    
    tabla+='<tr align="center"><td><b>No.</b></td><td align="center"><b>DESCRIPCION DE PRACTICOS</b></td><td align="center"><b>VER PRACTICO</b></td>';
    tabla+="</tr>";
    
    for(i=0;i<filas;i++){
        tabla+="<tr>";
        //tabla+="<td>"+(i+1)+ '</td><td><div id="alum'+(i+1)+'"></div><textarea id="alum'+(i+1)+'" type="text" rows="5" cols="50" MAXLENGTH="250" placeholder="Escriba aqui su pregunta..." style="border:0;outline: none;" >'+lista[i]['pregunta']+'</textarea></td><td><input name="btn19" type="button" class="btn" id="btn19" value="Ver Practico" onclick="Ver_cuestionario('+(i+1)+')" /></td>';
        tabla+="<td>"+(i+1)+ '</td><td><div id="alum'+(i+1)+'"></div><textarea id="alum'+(i+1)+'" type="text" rows="5" cols="50" MAXLENGTH="250" placeholder="Escriba aqui su pregunta..." style="border:0;outline: none;" >'+lista[i]['pregunta']+'</textarea></td><td align="center"><a href="ver_cuestion_alu.php?w1='+$('#vf_codi_curso').val()+'&w2='+$('#slcmateria').val()+'&w3='+(i+1)+'&w4='+$('#vf_name_curso').val()+'&w5='+materia+'" target="_blank" class="btnVideo">Ver Práctico</a></td>';
        tabla+="</tr>";
    }
    tabla+="</table>";
    document.getElementById("TableNotasList").innerHTML=tabla;
    	$('#TableNotasList').show();
    	$('#btnGrabar2').show();
}

function cargarLista(){
//	alert('Listo para cargar !!!!');
	for (var i = 0; i <lista.length; i++) {
		$('#alum'+(i+1)).val(lista[i]['nombre']);
		$('#nota'+(i+1)).val(lista[i]['nota']);
	}
}

function CargarPractico(){
	var n_curso=$('#vf_codi_curso').val();
	var c_mat=$('#slcmateria').val();
	console.log(c_mat);
	var html=$.ajax({type:"POST",url:'get_lista_cuestionario.php',data:{id1:n_curso,id2:c_mat},async:false}).responseText;
	if(html=='Paso2'){
	  alert('Entro al paso 2');
	  return false;
	}
	if(html=='Paso1'){
	  alert('Entro al paso 1');
	  return false;
	}
	if(html=='eNoResults'){
	  alert('NO encontro practico');
		listar(c_mat);
	//	alert ('hola 6');
		crearTabla(); 
		cargarLista();
		$('#vf_n3').val('0');
		$('#vf_n3').focus();
	  return true;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
	eval(html);
	$('#vf_n3').val(total);
	$('#vf_n3').focus();
//	alert ('hola 5');
	
	if (parseInt($('#vf_n3').val())>0){
		listar($('#vf_n3').val());
		crearTabla(); 
		cargarLista();
	}
	else{
		lista=[];
		crearTabla();
		cargarLista();
	}

	return true;
	
}
$(document).ready(function()
						   {
	init();

//							   $('#btnGrabar').bind('click',function(){if(validarDato()){$('#fLogin').submit();}});
//							   $('#btnGrabar').bind('click',function(){formSubmit();});
//							   $('#btnGrabar').bind('click',function(){Grabar();});
//							   $('#btnAnterior').bind('click',function(){Anterior();});
//							   $('#btnSiguiente').bind('click',function(){Siguiente();});
//							   $('#btnLista').bind('click',function(){location.href='Lista.php';});
//							   $('#btn1').bind('click',function(){Volver();});
							   $('#slcmateria').change(function(){CargarPractico();});	
							   $('#btn1').bind('click',function(){lenguaje();});
							   $('#btn2').bind('click',function(){matematicas();});
							   $('#btn3').bind('click',function(){naturales();});
							   $('#btn4').bind('click',function(){sociales();});
							   $('#btn5').bind('click',function(){musica();});
							   $('#btn6').bind('click',function(){edu_fisica();});
							   $('#btn7').bind('click',function(){religion();});
							   $('#btn8').bind('click',function(){ingles();});
							   $('#btn9').bind('click',function(){psicologia();});
							   $('#btn10').bind('click',function(){filosofia();});
							   $('#btn11').bind('click',function(){computacion();});
							   $('#btn12').bind('click',function(){biologia();});
							   $('#btn13').bind('click',function(){quimica();});
							   $('#btn14').bind('click',function(){fisica();});
							   $('#btn15').bind('click',function(){artes_p();});
							   $('#btn16').bind('click',function(){civica();});
							   $('#btn17').bind('click',function(){geografia();});
							   $('#btn18').bind('click',function(){historia();});
							   $('#btn19').bind('click',function(){ortografia();});
							   $('#btnSalir').bind('click',function(){location.href='practicos_bim.php';});
							   $('#btnSalir2').bind('click',function(){location.href='http://www.aizama.net';});
							}
							)
