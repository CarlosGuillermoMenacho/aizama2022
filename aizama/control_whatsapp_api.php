<?php 
session_start();
/*require_once"session_verify.php";
if($_SESSION['app_user_type'] != "adm"){
	header("Location: ../perfil.php");
}
if($_SESSION['app_user_id']==16){
    require 'header_dir.php';
}else{
    require 'header_adm.php';
}*/
//require 'header_adm.php';
?>
<link rel="stylesheet" type="text/css" href="css/control_whatsapp_api.css?v=<?php echo rand();?>">
<div class="div-main-content">
    <div class="div-title">
        <h1>Sesiones WhatsGO</h1>
    </div>
    <div class="div-tabla">
        <table>
            <thead>
                <tr>
                    <td>N°</td>
                    <td>Sesión</td>
                    <td>Token</td>
                    <td>Estado</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td><div><input type="text" name="" id="s1" value="59162243622"></div></td>
                    <td><div><textarea type="text" name="" id="t1">$2b$10$iIdqh8fL3tr9KOP_JLlud.NKmrp.nn3o3RbCcxWx9nW9mqLUWGEju</textarea></div></td>
                    <td id="e1">Desconectado</td>
                    <td><div><button class="submit" onclick="iniciar(1);" >Iniciar</button></div></td>
                </tr>
                <tr>
                    <td>2</td>
                    <td><div><input type="text" name="" id="s2" value="59165851912HCL"></div></td>
                    <td><div><textarea type="text" id="t2" name="">$2b$10$BYRearFaMZbceOrJmYsuf.8JCU9iFv53gX39wG4IBevj0gbGJXd6u</textarea></div></td>
                    <td id="e2">Desconectado</td>
                    <td><div><button class="submit" onclick="iniciar(2);">Iniciar</button></div></td>
                </tr>
                <tr>
                    <td>3</td>
                    <td><div><input type="text" name="" id="s3" value="59175014423TM"></div></td>
                    <td><div><textarea type="text" id="t3" name="">$2b$10$XIS4GuO8yW79xJVUU8p.yO3Io4oMVujj4_SDw4VokTb3OD9Wgqf8.</textarea></div></td>
                    <td id="e3">Desconectado</td>
                    <td><div><button class="submit" onclick="iniciar(3);">Iniciar</button></div></td>
                </tr>
                <tr>
                    <td>4</td>
                    <td><div><input type="text" id="s4" name="" value="59174609527TT"></div></td>
                    <td><div><textarea type="text" id="t4" name="">$2b$10$OEHSin.GwhK8pLGmTVZ6_e7KGf_ZiVZiGx.t3DroDZsPJ4XXFhs0O</textarea></div></td>
                    <td id="e4">Desconectado</td>
                    <td><div><button class="submit" onclick="iniciar(4);">Iniciar</button></div></td>
                </tr>
                <tr>
                    <td>5</td>
                    <td><div><input type="text" id="s5" name="" value="59175659436PDP"></div></td>
                    <td><div><textarea type="text" id="t5" name="">$2b$10$N8MGKBjnnRFExr8ViCa7aOT61D5sOJGbsCu9JtN7H.fLJM93ZChn6</textarea></div></td>
                    <td id="e5">Desconectado</td>
                    <td><div><button class="submit" onclick="iniciar(5);">Iniciar</button></div></td>
                </tr>
                <tr>
                    <td>6</td>
                    <td><div><input type="text" id="s6" name="" value="59176078338"></div></td>
                    <td><div><textarea type="text" id="t6" name="">$2b$10$LpyyYtecS4qlWBcpMrQtDuoW3cIf629IZHtFIQnYkItI.4exSG.5W</textarea></div></td>
                    <td id="e6">Desconectado</td>
                    <td><div><button class="submit" onclick="iniciar(6);">Iniciar</button></div></td>
                </tr>
                <tr>
                    <td>7</td>
                    <td><div><input type="text" id="s7" name="" value="59176078338COR"></div></td>
                    <td><div><textarea type="text" id="t7" name="">$2b$10$5g2QJx5krpuwXFEKmvhKf.1X_4kPQBZLQU7NC8rK5My1kkVOrE2ru</textarea></div></td>
                    <td id="e7">Desconectado</td>
                    <td><div><button class="submit" onclick="iniciar(7);">Iniciar</button></div></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
<div class="div-qr" style="display:none;">
    <div class="content-qr">
        <div class="div-title">
            <h1>Escanear el QR</h1>
        </div>
        <div class="qr-img">
            <img src="" id="qr-code" title="qr">
        </div>
    </div>
</div>
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript">
    let dominio = "http://190.186.185.116:21465/api/";
    let qr_vivsible = false;
    $(document).ready(()=>{
        init();
    })
    const init = () => {
        estado(1);
        estado(2);
        estado(3);
        estado(4);
        estado(5);
        estado(6);
        estado(7);
    }
    const estado = i => {
        let s = $(`#s${i}`).val();
        let t = $(`#t${i}`).val();

        var settings = {
          "url": `${dominio}${s}/check-connection-session`,
          "method": "GET",
          "timeout": 0,
          "headers": {
            "Authorization": `Bearer ${t}`
          },
        };

        $.ajax(settings).done(function (response) {
            $(`#e${i}`).text(response.message)
          console.log(response.message);
        });
    }
    const request_init_session = (sesion,token) => {
          try{
                var settings = {
              "url": `${dominio}${sesion}/start-session`,
              "method": "POST",
              "timeout": 0,
              "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              "data": JSON.stringify({
                "webhook": null,
                "waitQrCode": false
              }),
            };

            $.ajax(settings).done(function (response) {
              console.log(response);
              if(response.status == "CLOSED" || response.status == "QRCODE" || response.status == "INITIALIZING"){
                let qr = response.qrcode;
                if(qr != null){
                    $("#qr-code").prop("src",qr);
                    if(!qr_vivsible){
                        $(".div-qr").slideToggle();
                        qr_vivsible = true;
                    }     
                }
                
              }

              if(response.status == "CONNECTED"){
                if(qr_vivsible){
                  $(".div-qr").slideToggle();
                  qr_vivsible = false;  
                }
                init();

              }
            }).fail((data,textStatus,xhr)=>{
              if(data.status == 401){
                console.log(data.s)
              }
            });
          }catch(error){
            console.log(error);
          }
          get_status_session(sesion,token);
          get_qr_status(sesion,token);
        }
    const get_status_session = (sesion,token) => {
        var settings = {
          "url": `${dominio}${sesion}/check-connection-session`,
          "method": "GET",
          "timeout": 0,
          "headers": {
            "Authorization": `Bearer ${token}`
          },
        };

        $.ajax(settings).done(function (response) {
          console.log(response);
          if(response.status == false){
            setTimeout(()=>{get_status_session(sesion,token)},1000);
          }
        }).fail((data,textStatus,xhr)=>{
        if(data.status == 401){
          alert("Los datos de la sesión son incorrectos...");

        }
      });
    }
    const get_qr_status = (sesion,token) => {
        var settings = {
          "url": `${dominio}${sesion}/status-session`,
          "method": "GET",
          "timeout": 0,
          "headers": {
            "Authorization": `Bearer ${token}`
          },
        };

        $.ajax(settings).done(function (response) {
          console.log(response);
          let qr = response.qrcode;
        if(qr != null){
          $("#qr-code").prop("src",qr);
          if(!qr_vivsible){
            $(".div-qr").slideToggle();
            qr_vivsible = true;
          }
        }  
        //if(response.status == "CLOSED")return;
          if(response.status != "CONNECTED"){
            setTimeout(()=>{get_qr_status(sesion,token)},1000)  
          }
        if(response.status == "CONNECTED"){
            if(qr_vivsible){
              $(".div-qr").slideToggle();
              qr_vivsible = false;  
            }
          init();
        }

        }).fail((data,textStatus,xhr)=>{
        console.log(data.status);
      });
    }
    const iniciar = i => {
        let s = $(`#s${i}`).val();
        let t = $(`#t${i}`).val();
        if(s == ""){
            alert("Debe ingresar la sesión...!!!");
            
            return;
        }

        if(t == ""){
            alert("Debe ingresar el token de sesión...!!!");
            
            return;
        }
        request_init_session(s,t);
    }
</script>