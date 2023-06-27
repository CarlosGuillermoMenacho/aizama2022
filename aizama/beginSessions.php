<?php 
switch ($_GET["op"]) {
		case '1':
			$curl = curl_init();
			curl_setopt_array(
				$curl, 
				array(
					CURLOPT_URL => 'http://190.186.185.117:21465/api/59177367545/start-session',
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_ENCODING => '',
					CURLOPT_MAXREDIRS => 10,
					CURLOPT_TIMEOUT => 0,
					CURLOPT_FOLLOWLOCATION => true,
					CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
					CURLOPT_CUSTOMREQUEST => 'POST',
					CURLOPT_POSTFIELDS => '{
						"webhook":null,
						"waitQrCode":false
					}',
					CURLOPT_HTTPHEADER => array(
						'Content-Type: application/json',
						'Authorization: Bearer $2b$10$NcGdjJ_HMmtP4.rytoMtQeq4KlIIQSYytLomMZ1oHT3i00S.DwP6G'
					),
				)
			);

			$response = curl_exec($curl);
			curl_close($curl);
			echo $response;
			break;
		case '4':
			$curl = curl_init();
			curl_setopt_array(
				$curl, 
				array(
					CURLOPT_URL => 'http://190.186.185.117:21465/api/59175014423CTM/start-session',
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_ENCODING => '',
					CURLOPT_MAXREDIRS => 10,
					CURLOPT_TIMEOUT => 0,
					CURLOPT_FOLLOWLOCATION => true,
					CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
					CURLOPT_CUSTOMREQUEST => 'POST',
					CURLOPT_POSTFIELDS => '{
						"webhook":null,
						"waitQrCode":false
					}',
					CURLOPT_HTTPHEADER => array(
						'Content-Type: application/json',
						'Authorization: Bearer $2b$10$ZH_UEWW9mGT4LvBpyP9K1uBY0YfWCxla25H7qT3irW3xltjENZi4C'
					),
				)
			);

			$response = curl_exec($curl);
			curl_close($curl);
			echo $response;
			break;
		case '2':
			$curl = curl_init();
			curl_setopt_array(
				$curl, 
				array(
					CURLOPT_URL => 'http://190.186.185.117:21465/api/59174609527/start-session',
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_ENCODING => '',
					CURLOPT_MAXREDIRS => 10,
					CURLOPT_TIMEOUT => 0,
					CURLOPT_FOLLOWLOCATION => true,
					CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
					CURLOPT_CUSTOMREQUEST => 'POST',
					CURLOPT_POSTFIELDS => '{
						"webhook":null,
						"waitQrCode":false
					}',
					CURLOPT_HTTPHEADER => array(
						'Content-Type: application/json',
						'Authorization: Bearer $2b$10$_Ma9rDJuwnn_STga.qDO3OQjag39HBf6BKivjbUTXTkIXkd61hUfm'
					),
				)
			);

			$response = curl_exec($curl);
			curl_close($curl);
			echo $response;
			break;
		case '3':
			$curl = curl_init();
			curl_setopt_array(
				$curl, 
				array(
					CURLOPT_URL => 'http://190.186.185.117:21465/api/59165851912/start-session',
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_ENCODING => '',
					CURLOPT_MAXREDIRS => 10,
					CURLOPT_TIMEOUT => 0,
					CURLOPT_FOLLOWLOCATION => true,
					CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
					CURLOPT_CUSTOMREQUEST => 'POST',
					CURLOPT_POSTFIELDS => '{
						"webhook":null,
						"waitQrCode":false
					}',
					CURLOPT_HTTPHEADER => array(
						'Content-Type: application/json',
						'Authorization: Bearer $2b$10$K80RAzLEzx.lgtQt2F.gyuT0pDtJrR2Tf2nUEzO7eyz4Q04SmfuYy'
					),
				)
			);

			$response = curl_exec($curl);
			curl_close($curl);
			echo $response;
			break;
		case '5':
			$curl = curl_init();
			curl_setopt_array(
				$curl, 
				array(
					CURLOPT_URL => 'http://190.186.185.117:21465/api/59175659436/start-session',
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_ENCODING => '',
					CURLOPT_MAXREDIRS => 10,
					CURLOPT_TIMEOUT => 0,
					CURLOPT_FOLLOWLOCATION => true,
					CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
					CURLOPT_CUSTOMREQUEST => 'POST',
					CURLOPT_POSTFIELDS => '{
						"webhook":null,
						"waitQrCode":false
					}',
					CURLOPT_HTTPHEADER => array(
						'Content-Type: application/json',
						'Authorization: Bearer $2b$10$CcE7J24WOFH3DOwdfRMyLuaXtZ8Ro5PMWdEFnn5xVFhVQ0NEOpFQG'
					),
				)
			);

			$response = curl_exec($curl);
			curl_close($curl);
			echo $response;
			break;
		case '6':
			$curl = curl_init();
			curl_setopt_array(
				$curl, 
				array(
					CURLOPT_URL => 'http://190.186.185.117:21465/api/59162243621/start-session',
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_ENCODING => '',
					CURLOPT_MAXREDIRS => 10,
					CURLOPT_TIMEOUT => 0,
					CURLOPT_FOLLOWLOCATION => true,
					CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
					CURLOPT_CUSTOMREQUEST => 'POST',
					CURLOPT_POSTFIELDS => '{
						"webhook":null,
						"waitQrCode":false
					}',
					CURLOPT_HTTPHEADER => array(
						'Content-Type: application/json',
						'Authorization: Bearer $2b$10$6mbpdIfNKZE5fp5YY6fwnOX0p6Na.3Y5Yyk6GLQXxXBEecZJYK6Mq'
					),
				)
			);

			$response = curl_exec($curl);
			curl_close($curl);
			echo $response;
			break;
		default:
			// code...
			break;
	}	
?>