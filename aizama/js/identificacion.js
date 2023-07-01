let __respuestas = [];
let __preguntas = [];

const get_pregunta = async () => {
    await $.post(
        "controlador/identificacion_controlador.php?op=get_pregunta",
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
            }
        },
        "json"
    );
}
const evaluar = () => {
    $.post(
        "controlador/identificacion_controlador.php?op=evaluar",
        {respuestas:__respuestas , preguntas : __preguntas},
        data => {
            if(data.status == "ok"){
                console.log(data.status)
            }
        },
        "json"
    );
}
const key_press = e => {
    let key_code = e.keyCode || e.which;
    if (key_code == 13) {
        let text = $("#mensaje").val();
        if(text){
            $(".bandeja-chat").append(
                `<div class="div-msn-send">
                    <div class="msn-send">
                        ${text}
                    </div>
                </div>`
            );
            __respuestas.push(text);
            $(".bandeja-chat").scrollTop(1000);
            if(__respuestas.length > 7)evaluar();
            $("#mensaje").val("");
            setTimeout(async ()  => {
                await get_pregunta();
            }, 3000);
        }
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
        let text = $("#mensaje").val();
        if(text){
            $(".bandeja-chat").append(
                `<div class="div-msn-send">
                    <div class="msn-send">
                        ${text}
                    </div>
                </div>`
            );
            __respuestas.push(text);
            $(".bandeja-chat").scrollTop(1000);
            if(__respuestas.length > 7)evaluar();
        }

        $("#mensaje").val("");
        setTimeout(async ()  => {
            await get_pregunta();
        }, 3000);
        
    })
    
})