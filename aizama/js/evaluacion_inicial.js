let gMouseDownX = 0;
let gMouseDownY = 0;
let gMouseDownOffsetX = 0;
let gMouseDownOffsetY = 0;

function addListeners() {
    document.getElementById('cursorImage').addEventListener('mousedown', mouseDown, false);
    document.getElementById('cursorImage1').addEventListener('mousedown', mouseDown, false);
    document.getElementById('cursorImage2').addEventListener('mousedown', mouseDown, false);
    document.getElementById('cursorImage3').addEventListener('mousedown', mouseDown, false);
    document.getElementById('cursorImage4').addEventListener('mousedown', mouseDown, false);
    //document.getElementById('cursorImage5').addEventListener('mousedown', mouseDown, false);

    document.getElementById('cursorImage').addEventListener("touchstart", mouseDownTouch);
    document.getElementById('cursorImage1').addEventListener("touchstart", mouseDownTouch);
    document.getElementById('cursorImage2').addEventListener("touchstart", mouseDownTouch);
    document.getElementById('cursorImage3').addEventListener("touchstart", mouseDownTouch);
    document.getElementById('cursorImage4').addEventListener("touchstart", mouseDownTouch);
   // document.getElementById('cursorImage5').addEventListener("touchstart", mouseDownTouch);
    window.addEventListener('mouseup', mouseUp, false);
    window.addEventListener("touchend", mouseUpTouch);
}

function mouseUp(e) {
    if(e.srcElement.id == "" || e.srcElement.id == "evaluaciones")return;
    document.getElementById(e.srcElement.id).style.zIndex = 0;
    window.removeEventListener('mousemove', divMove, true);
}
function mouseUpTouch(e) {
    if(e.srcElement.id == "" || e.srcElement.id == "evaluaciones")return;
    document.getElementById(e.srcElement.id).style.zIndex = 0;
    window.removeEventListener('touchmove', divMoveTouch);
}
function mouseDown(e) {
    if(e.srcElement.id == "" || e.srcElement.id == "evaluaciones")return;
    gMouseDownX = e.clientX;
    gMouseDownY = e.clientY;
    console.log(e)
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
    //console.log(e.changedTouches[0].clientX)
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
    console.log(e)
    if(e.srcElement.id == "" || e.srcElement.id == "evaluaciones")return;
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
    //console.log(e)

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
console.log("top: " + document.getElementById("evaluaciones").getBoundingClientRect().y + "    left: " + document.getElementById("evaluaciones").getBoundingClientRect().x);