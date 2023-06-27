<?php 
/*require_once"modelo/conexion.php";
require_once"modelo/modelo_phone.php";
require_once"modelo/modelo_whatsapp_number.php";
$db = Conectar::conexion();
$Number = new Phone($db);
$Whatsapp_Number = new Whatsapp_Number($db);
$result = $Number->getPhones();
while ($phone = $result->fetch_object()) {
    $id = $phone->id;
    $number = $phone->number;
    $status = json_decode(phone_status($number));
    if($status->status == "success"){
        $Number->set_estado($id);
        if($status->response->canReceiveMessage){
            $Whatsapp_Number->save($number);
            echo $number;
        }else{
            echo "No existe";
        }
    }  
}*/
require_once"modelo/conexion_local.php";
require_once"modelo/modelo_whatsapp_number.php";
$db = Conectar::conexion();
$Whatsapp_Number = new Whatsapp_Number($db);
$phone = $_GET['phone'];
$server = $_GET["server"];
$status = "";
$counter = fopen("counter$server.txt", "w");
for ($i=0; $i < 20; $i++) { 
    fwrite($counter, substr("$phone\n",3));
    switch ($server) {
        case "1":
            $status = json_decode(phone_status($phone));

            break;
        case "2":
            $status = json_decode(phone_status2($phone));
            break;
        case "3":
            $status = json_decode(phone_status3($phone));
            break;
        case "4":
            $status = json_decode(phone_status4($phone));
            break;
        case "5":
            $status = json_decode(phone_status5($phone));
            break;
        case "6":
            $status = json_decode(phone_status6($phone));
            break;
        default:
            // code...
            break;
    }
    if($status->status == "success"){
        if($status->response->canReceiveMessage){
            $Whatsapp_Number->save($phone);
            $file = fopen("WhatsappNumber$server.txt", "a");
            fwrite($file, substr("$phone\n",3));
            
        }else{
            //echo json_encode($status);
        }
    }else{
        //echo json_encode($status);
    }
    $phone = $phone + 6;
}
echo json_encode($status);


function phone_status($phone){
    try{
        $curl = curl_init('http://190.186.185.117');
        
        curl_setopt_array($curl, array(
          CURLOPT_URL => "http://190.186.185.117:21465/api/59177367545/check-number-status/$phone",
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'GET',
          CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json',
            'Authorization: Bearer $2b$10$NcGdjJ_HMmtP4.rytoMtQeq4KlIIQSYytLomMZ1oHT3i00S.DwP6G'
          ),
        ));
        
        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            //echo "curl error: " . $err;
            return $err;
        } else {
            return $response;
        }
    }catch(Exception $e){
        echo $e->getCode();
        echo $e->getMessage();
    }finally{
        if(is_resource($curl)){
            curl_close($curl);
        }
    }
}
function phone_status2($phone){
    try{
        $curl = curl_init('http://190.186.185.117');
        
        curl_setopt_array($curl, array(
          CURLOPT_URL => "http://190.186.185.117:21465/api/59174609527/check-number-status/$phone",
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'GET',
          CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json',
            'Authorization: Bearer $2b$10$_Ma9rDJuwnn_STga.qDO3OQjag39HBf6BKivjbUTXTkIXkd61hUfm'
          ),
        ));
        
        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            //echo "curl error: " . $err;
            return $err;
        } else {
            return $response;
        }
    }catch(Exception $e){
        echo $e->getCode();
        echo $e->getMessage();
    }finally{
        if(is_resource($curl)){
            curl_close($curl);
        }
    }
}
function phone_status3($phone){
    try{
        $curl = curl_init('http://190.186.185.117');
        
        curl_setopt_array($curl, array(
          CURLOPT_URL => "http://190.186.185.117:21465/api/59165851912/check-number-status/$phone",
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'GET',
          CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json',
            'Authorization: Bearer $2b$10$K80RAzLEzx.lgtQt2F.gyuT0pDtJrR2Tf2nUEzO7eyz4Q04SmfuYy'
          ),
        ));
        
        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            //echo "curl error: " . $err;
            return $err;
        } else {
            return $response;
        }
    }catch(Exception $e){
        echo $e->getCode();
        echo $e->getMessage();
    }finally{
        if(is_resource($curl)){
            curl_close($curl);
        }
    }
}
function phone_status4($phone){
    try{
        $curl = curl_init('http://190.186.185.117');
        
        curl_setopt_array($curl, array(
          CURLOPT_URL => "http://190.186.185.117:21465/api/59175014423CTM/check-number-status/$phone",
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'GET',
          CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json',
            'Authorization: Bearer $2b$10$ZH_UEWW9mGT4LvBpyP9K1uBY0YfWCxla25H7qT3irW3xltjENZi4C'
          ),
        ));
        
        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            //echo "curl error: " . $err;
            return $err;
        } else {
            return $response;
        }
    }catch(Exception $e){
        echo $e->getCode();
        echo $e->getMessage();
    }finally{
        if(is_resource($curl)){
            curl_close($curl);
        }
    }
}
function phone_status5($phone){
    try{
        $curl = curl_init('http://190.186.185.117');
        
        curl_setopt_array($curl, array(
          CURLOPT_URL => "http://190.186.185.117:21465/api/59175659436/check-number-status/$phone",
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'GET',
          CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json',
            'Authorization: Bearer $2b$10$CcE7J24WOFH3DOwdfRMyLuaXtZ8Ro5PMWdEFnn5xVFhVQ0NEOpFQG'
          ),
        ));
        
        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            //echo "curl error: " . $err;
            return $err;
        } else {
            return $response;
        }
    }catch(Exception $e){
        echo $e->getCode();
        echo $e->getMessage();
    }finally{
        if(is_resource($curl)){
            curl_close($curl);
        }
    }
}
function phone_status6($phone){
    try{
        $curl = curl_init('http://190.186.185.117');
        
        curl_setopt_array($curl, array(
          CURLOPT_URL => "http://190.186.185.117:21465/api/59162243621/check-number-status/$phone",
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'GET',
          CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json',
            'Authorization: Bearer $2b$10$6mbpdIfNKZE5fp5YY6fwnOX0p6Na.3Y5Yyk6GLQXxXBEecZJYK6Mq'
          ),
        ));
        
        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            //echo "curl error: " . $err;
            return $err;
        } else {
            return $response;
        }
    }catch(Exception $e){
        echo $e->getCode();
        echo $e->getMessage();
    }finally{
        if(is_resource($curl)){
            curl_close($curl);
        }
    }
}
?>