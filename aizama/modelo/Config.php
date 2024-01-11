<?php
/*define('ODBC_NAME', 'BDD_aizama');
define('ODBC_USER', '');
define('ODBC_PASSWD', '');
define('DB_PASSWD', '');
*/
$gestion = isset($_SESSION['app_user_gestion'])?$_SESSION['app_user_gestion']:date('Y');
$servername = "localhost";
$database = "aizama_bdd_2023";
$username = "root";
$password = "";
/*

$servername = "198.136.62.113";
$database = "aizama_bdd_aizama";
$username = "aizama_admin";
$password = "admin160597";




$servername = "198.136.62.113";
$database = "aizama_bdd_aizama";
$username = "aizama";
$password = "";
*/
?>