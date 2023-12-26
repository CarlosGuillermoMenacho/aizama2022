let gMouseDownX = 0;
let gMouseDownY = 0;
let gMouseDownOffsetX = 0;
let gMouseDownOffsetY = 0;
const azul = "#0D4BB0";
const rojo = "#FF0000";
const verde = "#00AF02";
const amarillo = "#FFFF00";
const blanco = "#fff";
const paleta = [blanco,rojo,amarillo,verde,azul];
let color = blanco;
let coordenadas = [];
let img;
const lapiz = n => {
    color = paleta[n];
    if(n == 0){
        $("#canvas").removeClass();
        $("#canvas").addClass("borrador");
    }
    if(n == 1){
        $("#canvas").removeClass();
        $("#canvas").addClass("rojo");
    }
    if(n == 2){
        $("#canvas").removeClass();
        $("#canvas").addClass("amarillo");
    }
    if(n == 3){
        $("#canvas").removeClass();
        $("#canvas").addClass("verde");
    }
    if(n == 4){
        $("#canvas").removeClass();
        $("#canvas").addClass("azul");
    }
}
function addListeners() {
    document.getElementById('cursorImage').addEventListener('mousedown', mouseDown, false);
    document.getElementById('cursorImage1').addEventListener('mousedown', mouseDown, false);
    document.getElementById('cursorImage2').addEventListener('mousedown', mouseDown, false);
    document.getElementById('cursorImage3').addEventListener('mousedown', mouseDown, false);
    document.getElementById('cursorImage4').addEventListener('mousedown', mouseDown, false);
    document.getElementById('cursorImage5').addEventListener('mousedown', mouseDown, false);
	document.getElementById('cursorImage6').addEventListener('mousedown', mouseDown, false);
    document.getElementById('cursorImage7').addEventListener('mousedown', mouseDown, false);
    document.getElementById('cursorImage8').addEventListener('mousedown', mouseDown, false);
    document.getElementById('cursorImage9').addEventListener('mousedown', mouseDown, false);

    document.getElementById('cursorImage').addEventListener("touchstart", mouseDownTouch);
    document.getElementById('cursorImage1').addEventListener("touchstart", mouseDownTouch);
    document.getElementById('cursorImage2').addEventListener("touchstart", mouseDownTouch);
    document.getElementById('cursorImage3').addEventListener("touchstart", mouseDownTouch);
    document.getElementById('cursorImage4').addEventListener("touchstart", mouseDownTouch);
    document.getElementById('cursorImage5').addEventListener("touchstart", mouseDownTouch);
    document.getElementById('cursorImage6').addEventListener("touchstart", mouseDownTouch);
    document.getElementById('cursorImage7').addEventListener("touchstart", mouseDownTouch);
    document.getElementById('cursorImage8').addEventListener("touchstart", mouseDownTouch);
    document.getElementById('cursorImage9').addEventListener("touchstart", mouseDownTouch);

    window.addEventListener('mouseup', mouseUp, false);
    window.addEventListener("touchend", mouseUpTouch);
    document.getElementById('canvas').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);
}
const redrawing = () => {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(coordenadas)
	coordenadas.forEach(o => {
		let c = o.c;
		let x = o.x;
		let y = o.y;
    	ctx.beginPath();
        let grosor = 4;
        if(c == blanco)grosor = 10;
    
        ctx.arc(x, y, grosor, 0, Math.PI * 2, true);
		//ctx.rect(gMoffsetX - 3, gMoffsety + 47, 6, 6);
		ctx.fillStyle = c;
		ctx.fill();
		ctx.closePath();
	})
		ctx.drawImage(img,0,0,img.width,img.height,0,0,canvas.width,canvas.height);
}
function mouseUp(e) {
    if(e.srcElement.id == "" || e.srcElement.id == "evaluaciones")return;
    redrawing();
    
    document.getElementById(e.srcElement.id).style.zIndex = 0;
    window.removeEventListener('mousemove', divMove, true);
}
function mouseUpTouch(e) {
    if(e.srcElement.id == "" || e.srcElement.id == "evaluaciones")return;
    document.getElementById(e.srcElement.id).style.zIndex = 0;
    window.removeEventListener('touchmove', divMoveTouch);
}
function mouseDown(e) {
    if(e.srcElement.id == "" || e.srcElement.id == "evaluaciones"){
        window.removeEventListener('mousemove', divMove, true);
        return;
    }
    gMouseDownX = e.clientX;
    gMouseDownY = e.clientY;
    let gMoffsetX = e.offsetX;
    let gMoffsety = e.offsetY;
    if(e.srcElement.id == "canvas"){
    	var canvas = document.getElementById("canvas");
    	var ctx = canvas.getContext("2d");
    	ctx.beginPath();
        let grosor = 4;
        if(color == blanco)grosor = 10;
        coordenadas.push({x:gMoffsetX,y:gMoffsety,c:color});
        ctx.arc(gMoffsetX, gMoffsety, grosor, 0, Math.PI * 2, true);
		//ctx.rect(gMoffsetX - 3, gMoffsety + 47, 6, 6);
		ctx.fillStyle = color;
		ctx.fill();
		ctx.closePath();
		window.addEventListener('mousemove', divMove, true);
    	return;
    }
    var div = document.getElementById(e.srcElement.id);

    //The following block gets the X offset (the difference between where it starts and where it was clicked)
    let leftPart = "";
    if(!div.style.left)
        leftPart+="0px";    //In case this was not defined as 0px explicitly.
    else
        leftPart = div.style.left;
    let leftPos = leftPart.indexOf("px");
    let leftNumString = leftPart.slice(0, leftPos); // Get the X value of the object.
    gMouseDownOffsetX = gMouseDownX - parseInt(leftNumString,10);

    //The following block gets the Y offset (the difference between where it starts and where it was clicked)
    let topPart = "";
    if(!div.style.top)
        topPart+="0px";     //In case this was not defined as 0px explicitly.
    else
        topPart = div.style.top;
    let topPos = topPart.indexOf("px");
    let topNumString = topPart.slice(0, topPos);    // Get the Y value of the object.
    gMouseDownOffsetY = gMouseDownY - parseInt(topNumString,10);

    window.addEventListener('mousemove', divMove, true);
}
function mouseDownTouch(e) {
    if(e.srcElement.id == "" || e.srcElement.id == "evaluaciones")return;
    gMouseDownX = e.changedTouches[0].clientX;
    gMouseDownY = e.changedTouches[0].clientY;
    var div = document.getElementById(e.srcElement.id);

    //The following block gets the X offset (the difference between where it starts and where it was clicked)
    let leftPart = "";
    if(!div.style.left)
        leftPart+="0px";    //In case this was not defined as 0px explicitly.
    else
        leftPart = div.style.left;
    let leftPos = leftPart.indexOf("px");
    let leftNumString = leftPart.slice(0, leftPos); // Get the X value of the object.
    gMouseDownOffsetX = gMouseDownX - parseInt(leftNumString,10);

    //The following block gets the Y offset (the difference between where it starts and where it was clicked)
    let topPart = "";
    if(!div.style.top)
        topPart+="0px";     //In case this was not defined as 0px explicitly.
    else
        topPart = div.style.top;
    let topPos = topPart.indexOf("px");
    let topNumString = topPart.slice(0, topPos);    // Get the Y value of the object.
    gMouseDownOffsetY = gMouseDownY - parseInt(topNumString,10);

    window.addEventListener("touchmove", divMoveTouch);
}
function divMove(e){
    if(e.srcElement.id == "canvas"){
    	let gMoffsetX = e.offsetX;
    	let gMoffsety = e.offsetY;
    	var canvas = document.getElementById("canvas");
    	var ctx = canvas.getContext("2d");
    	ctx.beginPath();
        let grosor = 4;
        if(color == blanco)grosor = 10;
        ctx.arc(gMoffsetX, gMoffsety, grosor, 0, Math.PI * 2, true);
        coordenadas.push({x:gMoffsetX,y:gMoffsety,c:color});
		//ctx.rect(gMoffsetX - 3, gMoffsety + 47, 6, 6);
		ctx.fillStyle = color;
		ctx.fill();
		ctx.closePath();
    	return;
    }
    if(e.srcElement.id == "" || e.srcElement.id == "evaluaciones"){
        window.removeEventListener('mousemove', divMove, true);
        return;
    }
    var div = document.getElementById(e.srcElement.id);
    div.style.position = 'relative';
    div.style.zIndex = 100;
    let topAmount = e.clientY - gMouseDownOffsetY;
    let leftAmount = e.clientX - gMouseDownOffsetX;
    div.style.top = topAmount + 'px';
    div.style.left = leftAmount + 'px';
}

function divMoveTouch(e){
    if(e.srcElement.id == "" || e.srcElement.id == "evaluaciones")return;

    var div = document.getElementById(e.srcElement.id);
    div.style.position = 'relative';
    div.style.zIndex = 100;
    let topAmount = e.changedTouches[0].clientY - gMouseDownOffsetY;
    let leftAmount = e.changedTouches[0].clientX - gMouseDownOffsetX;
    div.style.top = topAmount + 'px';
    div.style.left = leftAmount + 'px';
}
addListeners();

$(document).ready(function(){
	let div = document.getElementById("div-canvas");
	let canvas = document.getElementById("canvas");
	let rec = div.getBoundingClientRect();
	let width = rec.width;
	let height = rec.height;
	canvas.width = width;
	canvas.height = height;
	var ctx=canvas.getContext("2d");

    img=new Image();
    img.onload=function(){
        ctx.drawImage(img,0,0,img.width,img.height,0,0,width,height);
    }
    img.src="images/lienzo4.png";
$("#btn-save").on('click', function () {
    html2canvas($("#evaluaciones")[0]).then((canvas) => {
        var imgageData = canvas.toDataURL("image/png");
        // Now browser starts downloading it instead of just showing it
        var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
        $.post(
            "controlador/evaluacion_inicial_controlador.php?op=save_evaluacion",
            {evaluacion:newData},
            data => {
                if(data.status == "ok"){
                    Swal.fire("La evaluación se guardó exitosamente...");
                }
            },"json"
        );
    });
});
});
