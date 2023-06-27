
<?php 
if(!isset($_GET['text']) or !isset($_GET['phone'])){ die('Not enough data');}

$message = $_GET['text'];
$phone = $_GET['phone'];

try{
    $curl = curl_init('http://65.109.4.216');
    
    curl_setopt_array($curl, array(
      CURLOPT_URL => 'http://65.109.5.216:21465/api/59162243621/send-message',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS =>'{"phone": "'.$phone.'","message": "'.$message.'","isGroup": false}',
      CURLOPT_HTTPHEADER => array(
        'Content-Type: application/json',
        'Authorization: Bearer $2b$10$3u7nEr_hlKY.17WeJz97Juk4mSqnnbtU7uM.6FL4edwCuhFqVaFMG'
      ),
    ));
    
    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        echo "curl error: " . $err;
    } else {
        echo $response;
    }
}catch(Exception $e){
    echo $e->getCode();
    echo $e->getMessage();
}finally{
    if(is_resource($curl)){
        curl_close($curl);
    }
}

?>
<script src="js/jquery.min.js"></script>
<script>
var settings = {
  "url": "http://65.109.5.216:21465/api/59162243621/send-message",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Content-Type": ["application/json", "app"],
    "Authorization": "Bearer $2b$10$3u7nEr_hlKY.17WeJz97Juk4mSqnnbtU7uM.6FL4edwCuhFqVaFMG"
  },
  "data": "{\n    \"phone\": \"59162243621\",\n    \"message\": \"Hola dddddeditos\",\n    \"isGroup\": false\n}",
};

$.ajax(settings).done(function (response) {
  console.log(response);
    
});
</script>

    
