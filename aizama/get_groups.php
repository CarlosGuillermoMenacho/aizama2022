<?php 
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'http://65.109.5.216:21465/api/59162243622/all-groups',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/json',
    'Authorization: Bearer $2b$10$iIdqh8fL3tr9KOP_JLlud.NKmrp.nn3o3RbCcxWx9nW9mqLUWGEju'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
$grupos = [];
$status = json_decode($response);
if($status->status == "success"){

	foreach ($status->response as $grupo) {
		$grupos[] = ["id"=>$grupo->id->user,"name"=>$grupo->contact->name];
	}
}
echo json_encode($grupos);
?>