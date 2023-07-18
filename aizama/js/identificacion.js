let __respuestas = [];
let __preguntas = [];

const get_pregunta = async () => {
    await $.post(
        "controlador/identificacion_controlador.php?op=get_pregunta_alu",
        {lista:JSON.stringify(__preguntas)},
        data => {
            if(data.status == "ok"){
                let pregunta = data.pregunta.pregunta;
                __preguntas.push(data.pregunta.id);
                $(".bandeja-chat").append(
                    `<div class="div-msn-response">
                        <div class="msn-response">
                            ${pregunta}   
                        </div>
                    </div>`
                );
                $(".bandeja-chat").scrollTop(1000);
                $("#mensaje").attr("disabled",false);
                $("#btn-send").attr("disabled",false);
                $("#mensaje").focus();
            }
        },
        "json"
    );
}
const evaluar = () => {
    $.post(
        "controlador/identificacion_controlador.php?op=evaluar",
        {respuestas:JSON.stringify(__respuestas) , preguntas : JSON.stringify(__preguntas)},
        data => {
            if(data.status == "ok"){
                console.log(data.status)
            }
            if (data.status == "noIde") {
                $(".bandeja-chat").append(
                    `<div class="div-msn-response">
                        <div class="msn-response">
                           No hemos logrado identificarte, asegúrate de haber proporcionado correctamente la información que te hemos solicitado, vuelve a intentarlo otra vez.   
                        </div>
                    </div>`
                );
                $(".bandeja-chat").scrollTop(1000);
                $("#mensaje").attr("disabled",true);
                $("#btn-send").attr("disabled",true);
            }
        },
        "json"
    );
}
const key_press = e => {
    let key_code = e.keyCode || e.which;
    if (key_code == 13) {
        let text =$.trim($("#mensaje").val());
        console.log(text)
        if(text){
            $("#mensaje").attr("disabled",true);
            $("#btn-send").attr("disabled",true);
            $(".bandeja-chat").append(
                `<div class="div-msn-send">
                    <div class="msn-send">
                        ${text}
                    </div>
                </div>`
            );
            __respuestas.push(text);
            $(".bandeja-chat").scrollTop(1000);
            if(__respuestas.length > 7){
                evaluar();
            }else{
                setTimeout(async ()  => {
                    await get_pregunta();
                }, 3000);   
            }
            $("#mensaje").val("");
            
        }
        return false;
    }
}
$(document).ready(()=>{
    setTimeout(() => {
        $(".bandeja-chat").append(
            `<div class="div-msn-response">
                <div class="msn-response">
                    Hola, bienvenido al asistente de identificación, por favor responde a las siguientes preguntas para poder identificarte...        
                </div>
            </div>`
        );
        $(".bandeja-chat").scrollTop(1000);
        setTimeout(() => {
            get_pregunta();
        }, 5000);
    }, 1000);
    
    $("#btn-send").click((e)=>{
        let text = $.trim($("#mensaje").val());
        if(text){
            $("#mensaje").attr("disabled",true);
            $("#btn-send").attr("disabled",true);
            $(".bandeja-chat").append(
                `<div class="div-msn-send">
                    <div class="msn-send">
                        ${text}
                    </div>
                </div>`
            );
            __respuestas.push(text);
            $(".bandeja-chat").scrollTop(1000);
            if(__respuestas.length > 7){
                evaluar();
            }else{
                setTimeout(async ()  => {
                    await get_pregunta();
                }, 3000);
            }
            $("#mensaje").val("");
            
        }

        
        
    })
    
})