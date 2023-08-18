const set_trimestre = id =>{
	var html=$.ajax({type:"GET",url:'asignar_bimestre.php',data:{id:id},async:false}).responseText;
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
//	  alert('holassss');
	  location.reload();
	  return true;
	}

}
const Boletin = () => {
   if($('#boletin').val()=='VERDADERO')
   {
	   location.href='boletin_alumno.php';
       return true;
   }
	else
	{
		alert('NO TIENE ACCESO A VER EL BOLETIN !!!, Comuniquese con el 77344300');
		return false; 
   } 
}
const go_page = page => {
	location.href = page;
}
const evento_en_linea = () => {
	var html=$.ajax({type:"GET",url:'obtener_evento.php?op=evonline',async:false}).responseText;
	if(html==='noClase'){
		    alert('No hay Evento en linea...');
	}else{
	    window.open(html, '_blank');
	}
}
$(document).ready(()=>{
	$(".div-menu").click(()=>{
		$(".navegation").slideToggle("disappear");
	})
	$(".div-user").click(()=>{
		$(".div-info-user-card").slideToggle("disappear")
	});
	$("#btn-close-st").click(()=>{
		$(".select-trimestre").slideToggle("disappear");
	})
	$("#item-trimestre").click(()=>{
		$(".navegation").slideToggle("disappear");
		$(".select-trimestre").slideToggle("disappear");
	})
})