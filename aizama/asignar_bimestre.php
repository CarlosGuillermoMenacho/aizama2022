<?php
session_start();
require 'includes/functions.php';

if(!cliente_activo())
{
  echo 'eSession';
  exit();
}
$_SESSION['le_tot1'] = 0;
$_SESSION['ma_tot1'] = 0;
$_SESSION['cn_tot1'] = 0;
$_SESSION['cs_tot1'] = 0;
$_SESSION['mu_tot1'] = 0;
$_SESSION['ef_tot1'] = 0;
$_SESSION['qu_tot1'] = 0;
$_SESSION['fi_tot1'] = 0;
$_SESSION['hi_tot1'] = 0;
$_SESSION['va_tot1'] = 0;
$_SESSION['in_tot1'] = 0;
$_SESSION['ps_tot1'] = 0;
$_SESSION['fil_tot1'] = 0;
$_SESSION['co_tot1'] = 0;
$_SESSION['bi_tot1'] = 0;
$_SESSION['ap_tot1'] = 0;
$_SESSION['ci_tot1'] = 0;
$_SESSION['ge_tot1'] = 0;
$_SESSION['or_tot1'] = 0;
$_SESSION['gu_tot1'] = 0;
$_SESSION['na_tot1'] = 0;
	$_SESSION['le_tot2'] = 0;
	$_SESSION['ma_tot2'] = 0;
	$_SESSION['cn_tot2'] = 0;
	$_SESSION['cs_tot2'] = 0;
	$_SESSION['mu_tot2'] = 0;
	$_SESSION['ef_tot2'] = 0;
	$_SESSION['qu_tot2'] = 0;
	$_SESSION['fi_tot2'] = 0;
	$_SESSION['hi_tot2'] = 0;
	$_SESSION['va_tot2'] = 0;
	$_SESSION['in_tot2'] = 0;
	$_SESSION['ps_tot2'] = 0;
	$_SESSION['fil_tot2'] = 0;
	$_SESSION['co_tot2'] = 0;
	$_SESSION['bi_tot2'] = 0;
	$_SESSION['ap_tot2'] = 0;
	$_SESSION['ci_tot2'] = 0;
	$_SESSION['ge_tot2'] = 0;
	$_SESSION['or_tot2'] = 0;
	$_SESSION['gu_tot2'] = 0;
	$_SESSION['na_tot2'] = 0;

		$_SESSION['le_tot3'] = 0;
		$_SESSION['ma_tot3'] = 0;
		$_SESSION['cn_tot3'] = 0;
		$_SESSION['cs_tot3'] = 0;
		$_SESSION['mu_tot3'] = 0;
		$_SESSION['ef_tot3'] = 0;
		$_SESSION['qu_tot3'] = 0;
		$_SESSION['fi_tot3'] = 0;
		$_SESSION['hi_tot3'] = 0;
		$_SESSION['va_tot3'] = 0;
		$_SESSION['in_tot3'] = 0;
		$_SESSION['ps_tot3'] = 0;
		$_SESSION['fil_tot3'] = 0;
		$_SESSION['co_tot3'] = 0;
		$_SESSION['bi_tot3'] = 0;
		$_SESSION['ap_tot3'] = 0;
		$_SESSION['ci_tot3'] = 0;
		$_SESSION['ge_tot3'] = 0;
		$_SESSION['or_tot3'] = 0;
		$_SESSION['gu_tot3'] = 0;
		$_SESSION['na_tot3'] = 0;
			$_SESSION['le_tot4'] = 0;
			$_SESSION['ma_tot4'] = 0;
			$_SESSION['cn_tot4'] = 0;
			$_SESSION['cs_tot4'] = 0;
			$_SESSION['mu_tot4'] = 0;
			$_SESSION['ef_tot4'] = 0;
			$_SESSION['qu_tot4'] = 0;
			$_SESSION['fi_tot4'] = 0;
			$_SESSION['hi_tot4'] = 0;
			$_SESSION['va_tot4'] = 0;
			$_SESSION['in_tot4'] = 0;
			$_SESSION['ps_tot4'] = 0;
			$_SESSION['fil_tot4'] = 0;
			$_SESSION['co_tot4'] = 0;
			$_SESSION['bi_tot4'] = 0;
			$_SESSION['ap_tot4'] = 0;
			$_SESSION['ci_tot4'] = 0;
			$_SESSION['ge_tot4'] = 0;
			$_SESSION['or_tot4'] = 0;
			$_SESSION['gu_tot4'] = 0;
			$_SESSION['na_tot4'] = 0;


$MsgApp = 'eParamError';
if($_GET)
{
  $MsgApp = 'eNoNumeric';
  if(isset($_GET['id']) && is_numeric($_GET['id']))
  {
	$codimate = $_GET['id'] ;
	switch ($codimate)
	{
		case 1:
			$_SESSION['app_user_bimestre'] = 1;
			break;
		case 2:
			$_SESSION['app_user_bimestre'] = 2;
			break;
		case 3:
			$_SESSION['app_user_bimestre'] = 3;
			break;
		case 4:
			$_SESSION['app_user_bimestre'] = 4;
			break;
	}
	
    require 'includes/config.php';
	$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
//  SACA TODOS LOS VIDEOS	
	/*$sql10 = "SELECT cod_mat,cod_cur,count(cod_mat) total FROM videos where cod_cur=".$_SESSION['app_user_curso']." and bimestre=".$_SESSION['app_user_bimestre']." GROUP BY cod_mat";
	$result10 = mysqli_query($db, $sql10);
	$cont = 0;
	while($row101 = $result10->fetch_object())
	{
		switch ($row101->cod_mat)
		{
			case 'P2':
				$_SESSION['ma_tot1'] = $row101->total;
				break;
			case 'P1':
				$_SESSION['le_tot1'] = $row101->total;
				break;
			case 'P3':
				$_SESSION['cn_tot1'] = $row101->total;
				break;
			case 'P4':
				$_SESSION['cs_tot1'] = $row101->total;
				break;
			case 'P7':
				$_SESSION['in_tot1'] = $row101->total;
				break;
			case 'P11':
				$_SESSION['ef_tot1'] = $row101->total;
				break;
			case 'P9':
				$_SESSION['mu_tot1'] = $row101->total;
				break;
			case 'P10':
				$_SESSION['ap_tot1'] = $row101->total;
				break;
			case 'P6':
				$_SESSION['va_tot1'] = $row101->total;
				break;
			case 'P15':
				$_SESSION['co_tot1'] = $row101->total;
				break;
			case 'P14':
				$_SESSION['gu_tot1'] = $row101->total;
				break;
			case 'P5':
				$_SESSION['na_tot1'] = $row101->total;
				break;
			case 'P17':
				$_SESSION['or_tot1'] = $row101->total;
				break;

			case 'S1':
				$_SESSION['ma_tot1'] = $row101->total;
				break;
			case 'S2':
				$_SESSION['le_tot1'] = $row101->total;
				break;
			case 'S3':
				$_SESSION['fil_tot1'] = $row101->total;
				break;
			case 'S4':
				$_SESSION['ps_tot1'] = $row101->total;
				break;
			case 'S5':
				$_SESSION['cn_tot1'] = $row101->total;
				break;
			case 'S6':
				$_SESSION['fi_tot1'] = $row101->total;
				break;
			case 'S7':
				$_SESSION['qu_tot1'] = $row101->total;
				break;
			case 'S8':
				$_SESSION['cs_tot1'] = $row101->total;
				break;
			case 'S9':
				$_SESSION['te_tot1'] = $row101->total;
				break;
			case 'S10':
				$_SESSION['bi_tot1'] = $row101->total;
				break;
			case 'S11':
				$_SESSION['ci_tot1'] = $row101->total;
				break;
			case 'S12':
				$_SESSION['in_tot1'] = $row101->total;
				break;
			case 'S13':
				$_SESSION['ef_tot1'] = $row101->total;
				break;
			case 'S14':
				$_SESSION['mu_tot1'] = $row101->total;
				break;
			case 'S15':
				$_SESSION['ap_tot1'] = $row101->total;
				break;
			case 'S16':
				$_SESSION['va_tot1'] = $row101->total;
				break;
			case 'S17':
				$_SESSION['co_tot1'] = $row101->total;
				break;
			case 'S18':
				$_SESSION['gu_tot1'] = $row101->total;
				break;
			case 'S19':
				$_SESSION['na_tot1'] = $row101->total;
				break;
			case 'S20':
				$_SESSION['ge_tot1'] = $row101->total;
				break;
			case 'S21':
				$_SESSION['hi_tot1'] = $row101->total;
				break;
			case 'S22':
				$_SESSION['or_tot1'] = $row101->total;
				break;

			case 'p2':
				$_SESSION['ma_tot1'] = $row101->total;
				break;
			case 'p1':
				$_SESSION['le_tot1'] = $row101->total;
				break;
			case 'p3':
				$_SESSION['cn_tot1'] = $row101->total;
				break;
			case 'p4':
				$_SESSION['cs_tot1'] = $row101->total;
				break;
			case 'p7':
				$_SESSION['in_tot1'] = $row101->total;
				break;
			case 'p11':
				$_SESSION['ef_tot1'] = $row101->total;
				break;
			case 'p9':
				$_SESSION['mu_tot1'] = $row101->total;
				break;
			case 'p10':
				$_SESSION['ap_tot1'] = $row101->total;
				break;
			case 'p6':
				$_SESSION['va_tot1'] = $row101->total;
				break;
			case 'p15':
				$_SESSION['co_tot1'] = $row101->total;
				break;
			case 'p14':
				$_SESSION['gu_tot1'] = $row101->total;
				break;
			case 'p5':
				$_SESSION['na_tot1'] = $row101->total;
				break;
			case 'p17':
				$_SESSION['or_tot1'] = $row101->total;
				break;

			case 's1':
				$_SESSION['ma_tot1'] = $row101->total;
				break;
			case 's2':
				$_SESSION['le_tot1'] = $row101->total;
				break;
			case 's3':
				$_SESSION['fil_tot1'] = $row101->total;
				break;
			case 's4':
				$_SESSION['ps_tot1'] = $row101->total;
				break;
			case 's5':
				$_SESSION['cn_tot1'] = $row101->total;
				break;
			case 's6':
				$_SESSION['fi_tot1'] = $row101->total;
				break;
			case 's7':
				$_SESSION['qu_tot1'] = $row101->total;
				break;
			case 's8':
				$_SESSION['cs_tot1'] = $row101->total;
				break;
			case 's9':
				$_SESSION['te_tot1'] = $row101->total;
				break;
			case 's10':
				$_SESSION['bi_tot1'] = $row101->total;
				break;
			case 's11':
				$_SESSION['ci_tot1'] = $row101->total;
				break;
			case 's12':
				$_SESSION['in_tot1'] = $row101->total;
				break;
			case 's13':
				$_SESSION['ef_tot1'] = $row101->total;
				break;
			case 's14':
				$_SESSION['mu_tot1'] = $row101->total;
				break;
			case 's15':
				$_SESSION['ap_tot1'] = $row101->total;
				break;
			case 's16':
				$_SESSION['va_tot1'] = $row101->total;
				break;
			case 's17':
				$_SESSION['co_tot1'] = $row101->total;
				break;
			case 's18':
				$_SESSION['gu_tot1'] = $row101->total;
				break;
			case 's19':
				$_SESSION['na_tot1'] = $row101->total;
				break;
			case 's20':
				$_SESSION['ge_tot1'] = $row101->total;
				break;
			case 's21':
				$_SESSION['hi_tot1'] = $row101->total;
				break;
			case 's22':
				$_SESSION['or_tot1'] = $row101->total;
				break;
		}
		$cont++;
	}*/
//  SACA TODOS LOS PRACTICOS
    $session_curso = isset($_SESSION['app_user_curso'])?$_SESSION['app_user_curso']:"0";
	$sql10 = "SELECT cod_mat,cod_cur,count(cod_mat) total FROM cuestionarios where cod_cur=".$session_curso." and bimestre=".$_SESSION['app_user_bimestre']." GROUP BY cod_mat";
	$result102 = mysqli_query($db, $sql10);
	$cont = 0;
	while($row1012 = $result102->fetch_object())
	{
		switch ($row1012->cod_mat)
		{
			case 'P2':
				$_SESSION['ma_tot2'] = $row1012->total;
				break;
			case 'P1':
				$_SESSION['le_tot2'] = $row1012->total;
				break;
			case 'P3':
				$_SESSION['cn_tot2'] = $row1012->total;
				break;
			case 'P4':
				$_SESSION['cs_tot2'] = $row1012->total;
				break;
			case 'P7':
				$_SESSION['in_tot2'] = $row1012->total;
				break;
			case 'P11':
				$_SESSION['ef_tot2'] = $row1012->total;
				break;
			case 'P9':
				$_SESSION['mu_tot2'] = $row1012->total;
				break;
			case 'P10':
				$_SESSION['ap_tot2'] = $row1012->total;
				break;
			case 'P6':
				$_SESSION['va_tot2'] = $row1012->total;
				break;
			case 'P15':
				$_SESSION['co_tot2'] = $row1012->total;
				break;
			case 'P14':
				$_SESSION['gu_tot2'] = $row1012->total;
				break;
			case 'P5':
				$_SESSION['na_tot2'] = $row1012->total;
				break;
			case 'P17':
				$_SESSION['or_tot2'] = $row1012->total;
				break;

			case 'S1':
				$_SESSION['ma_tot2'] = $row1012->total;
				break;
			case 'S2':
				$_SESSION['le_tot2'] = $row1012->total;
				break;
			case 'S3':
				$_SESSION['fil_tot2'] = $row1012->total;
				break;
			case 'S4':
				$_SESSION['ps_tot2'] = $row1012->total;
				break;
			case 'S5':
				$_SESSION['cn_tot2'] = $row1012->total;
				break;
			case 'S6':
				$_SESSION['fi_tot2'] = $row1012->total;
				break;
			case 'S7':
				$_SESSION['qu_tot2'] = $row1012->total;
				break;
			case 'S8':
				$_SESSION['cs_tot2'] = $row1012->total;
				break;
			case 'S9':
				$_SESSION['te_tot2'] = $row1012->total;
				break;
			case 'S10':
				$_SESSION['bi_tot2'] = $row1012->total;
				break;
			case 'S11':
				$_SESSION['ci_tot2'] = $row1012->total;
				break;
			case 'S12':
				$_SESSION['in_tot2'] = $row1012->total;
				break;
			case 'S13':
				$_SESSION['ef_tot2'] = $row1012->total;
				break;
			case 'S14':
				$_SESSION['mu_tot2'] = $row1012->total;
				break;
			case 'S15':
				$_SESSION['ap_tot2'] = $row1012->total;
				break;
			case 'S16':
				$_SESSION['va_tot2'] = $row1012->total;
				break;
			case 'S17':
				$_SESSION['co_tot2'] = $row1012->total;
				break;
			case 'S18':
				$_SESSION['gu_tot2'] = $row1012->total;
				break;
			case 'S19':
				$_SESSION['na_tot2'] = $row1012->total;
				break;
			case 'S20':
				$_SESSION['ge_tot2'] = $row1012->total;
				break;
			case 'S21':
				$_SESSION['hi_tot2'] = $row1012->total;
				break;
			case 'S22':
				$_SESSION['or_tot2'] = $row1012->total;
				break;

			case 'p2':
				$_SESSION['ma_tot2'] = $row1012->total;
				break;
			case 'p1':
				$_SESSION['le_tot2'] = $row1012->total;
				break;
			case 'p3':
				$_SESSION['cn_tot2'] = $row1012->total;
				break;
			case 'p4':
				$_SESSION['cs_tot2'] = $row1012->total;
				break;
			case 'p7':
				$_SESSION['in_tot2'] = $row1012->total;
				break;
			case 'p11':
				$_SESSION['ef_tot2'] = $row1012->total;
				break;
			case 'p9':
				$_SESSION['mu_tot2'] = $row1012->total;
				break;
			case 'p10':
				$_SESSION['ap_tot2'] = $row1012->total;
				break;
			case 'p6':
				$_SESSION['va_tot2'] = $row1012->total;
				break;
			case 'p15':
				$_SESSION['co_tot2'] = $row1012->total;
				break;
			case 'p14':
				$_SESSION['gu_tot2'] = $row1012->total;
				break;
			case 'p5':
				$_SESSION['na_tot2'] = $row1012->total;
				break;
			case 'p17':
				$_SESSION['or_tot2'] = $row1012->total;
				break;

			case 's1':
				$_SESSION['ma_tot2'] = $row1012->total;
				break;
			case 's2':
				$_SESSION['le_tot2'] = $row1012->total;
				break;
			case 's3':
				$_SESSION['fil_tot2'] = $row1012->total;
				break;
			case 's4':
				$_SESSION['ps_tot2'] = $row1012->total;
				break;
			case 's5':
				$_SESSION['cn_tot2'] = $row1012->total;
				break;
			case 's6':
				$_SESSION['fi_tot2'] = $row1012->total;
				break;
			case 's7':
				$_SESSION['qu_tot2'] = $row1012->total;
				break;
			case 's8':
				$_SESSION['cs_tot2'] = $row1012->total;
				break;
			case 's9':
				$_SESSION['te_tot2'] = $row1012->total;
				break;
			case 's10':
				$_SESSION['bi_tot2'] = $row1012->total;
				break;
			case 's11':
				$_SESSION['ci_tot2'] = $row1012->total;
				break;
			case 's12':
				$_SESSION['in_tot2'] = $row1012->total;
				break;
			case 's13':
				$_SESSION['ef_tot2'] = $row1012->total;
				break;
			case 's14':
				$_SESSION['mu_tot2'] = $row1012->total;
				break;
			case 's15':
				$_SESSION['ap_tot2'] = $row1012->total;
				break;
			case 's16':
				$_SESSION['va_tot2'] = $row1012->total;
				break;
			case 's17':
				$_SESSION['co_tot2'] = $row1012->total;
				break;
			case 's18':
				$_SESSION['gu_tot2'] = $row1012->total;
				break;
			case 's19':
				$_SESSION['na_tot2'] = $row1012->total;
				break;
			case 's20':
				$_SESSION['ge_tot2'] = $row1012->total;
				break;
			case 's21':
				$_SESSION['hi_tot2'] = $row1012->total;
				break;
			case 's22':
				$_SESSION['or_tot2'] = $row1012->total;
				break;

		}
		$cont++;
	}
//  SACA TODOS LOS EXAMENES	
	$sql10 = "SELECT codmat,codigo,count(codmat) total FROM evaluacion where codigo=".$session_curso." and bimestre=".$_SESSION['app_user_bimestre']." GROUP BY codmat";
	$result103 = mysqli_query($db, $sql10);
	$cont = 0;
	while($row1013 = $result103->fetch_object())
	{
		switch ($row1013->codmat)
		{
			case 'P2':
				$_SESSION['ma_tot3'] = $row1013->total;
				break;
			case 'P1':
				$_SESSION['le_tot3'] = $row1013->total;
				break;
			case 'P3':
				$_SESSION['cn_tot3'] = $row1013->total;
				break;
			case 'P4':
				$_SESSION['cs_tot3'] = $row1013->total;
				break;
			case 'P7':
				$_SESSION['in_tot3'] = $row1013->total;
				break;
			case 'P11':
				$_SESSION['ef_tot3'] = $row1013->total;
				break;
			case 'P9':
				$_SESSION['mu_tot3'] = $row1013->total;
				break;
			case 'P10':
				$_SESSION['ap_tot3'] = $row1013->total;
				break;
			case 'P6':
				$_SESSION['va_tot3'] = $row1013->total;
				break;
			case 'P15':
				$_SESSION['co_tot3'] = $row1013->total;
				break;
			case 'P14':
				$_SESSION['gu_tot3'] = $row1013->total;
				break;
			case 'P5':
				$_SESSION['na_tot3'] = $row1013->total;
				break;
			case 'P17':
				$_SESSION['or_tot3'] = $row1013->total;
				break;

			case 'S1':
				$_SESSION['ma_tot3'] = $row1013->total;
				break;
			case 'S2':
				$_SESSION['le_tot3'] = $row1013->total;
				break;
			case 'S3':
				$_SESSION['fil_tot3'] = $row1013->total;
				break;
			case 'S4':
				$_SESSION['ps_tot3'] = $row1013->total;
				break;
			case 'S5':
				$_SESSION['cn_tot3'] = $row1013->total;
				break;
			case 'S6':
				$_SESSION['fi_tot3'] = $row1013->total;
				break;
			case 'S7':
				$_SESSION['qu_tot3'] = $row1013->total;
				break;
			case 'S8':
				$_SESSION['cs_tot3'] = $row1013->total;
				break;
			case 'S9':
				$_SESSION['te_tot3'] = $row1013->total;
				break;
			case 'S10':
				$_SESSION['bi_tot3'] = $row1013->total;
				break;
			case 'S11':
				$_SESSION['ci_tot3'] = $row1013->total;
				break;
			case 'S12':
				$_SESSION['in_tot3'] = $row1013->total;
				break;
			case 'S13':
				$_SESSION['ef_tot3'] = $row1013->total;
				break;
			case 'S14':
				$_SESSION['mu_tot3'] = $row1013->total;
				break;
			case 'S15':
				$_SESSION['ap_tot3'] = $row1013->total;
				break;
			case 'S16':
				$_SESSION['va_tot3'] = $row1013->total;
				break;
			case 'S17':
				$_SESSION['co_tot3'] = $row1013->total;
				break;
			case 'S18':
				$_SESSION['gu_tot3'] = $row1013->total;
				break;
			case 'S19':
				$_SESSION['na_tot3'] = $row1013->total;
				break;
			case 'S20':
				$_SESSION['ge_tot3'] = $row1013->total;
				break;
			case 'S21':
				$_SESSION['hi_tot3'] = $row1013->total;
				break;
			case 'S22':
				$_SESSION['or_tot3'] = $row1013->total;
				break;

			case 'p2':
				$_SESSION['ma_tot3'] = $row1013->total;
				break;
			case 'p1':
				$_SESSION['le_tot3'] = $row1013->total;
				break;
			case 'p3':
				$_SESSION['cn_tot3'] = $row1013->total;
				break;
			case 'p4':
				$_SESSION['cs_tot3'] = $row1013->total;
				break;
			case 'p7':
				$_SESSION['in_tot3'] = $row1013->total;
				break;
			case 'p11':
				$_SESSION['ef_tot3'] = $row1013->total;
				break;
			case 'p9':
				$_SESSION['mu_tot3'] = $row1013->total;
				break;
			case 'p10':
				$_SESSION['ap_tot3'] = $row1013->total;
				break;
			case 'p6':
				$_SESSION['va_tot3'] = $row1013->total;
				break;
			case 'p15':
				$_SESSION['co_tot3'] = $row1013->total;
				break;
			case 'p14':
				$_SESSION['gu_tot3'] = $row1013->total;
				break;
			case 'p5':
				$_SESSION['na_tot3'] = $row1013->total;
				break;
			case 'p17':
				$_SESSION['or_tot3'] = $row1013->total;
				break;

			case 's1':
				$_SESSION['ma_tot3'] = $row1013->total;
				break;
			case 's2':
				$_SESSION['le_tot3'] = $row1013->total;
				break;
			case 's3':
				$_SESSION['fil_tot3'] = $row1013->total;
				break;
			case 's4':
				$_SESSION['ps_tot3'] = $row1013->total;
				break;
			case 's5':
				$_SESSION['cn_tot3'] = $row1013->total;
				break;
			case 's6':
				$_SESSION['fi_tot3'] = $row1013->total;
				break;
			case 's7':
				$_SESSION['qu_tot3'] = $row1013->total;
				break;
			case 's8':
				$_SESSION['cs_tot3'] = $row1013->total;
				break;
			case 's9':
				$_SESSION['te_tot3'] = $row1013->total;
				break;
			case 's10':
				$_SESSION['bi_tot3'] = $row1013->total;
				break;
			case 's11':
				$_SESSION['ci_tot3'] = $row1013->total;
				break;
			case 's12':
				$_SESSION['in_tot3'] = $row1013->total;
				break;
			case 's13':
				$_SESSION['ef_tot3'] = $row1013->total;
				break;
			case 's14':
				$_SESSION['mu_tot3'] = $row1013->total;
				break;
			case 's15':
				$_SESSION['ap_tot3'] = $row1013->total;
				break;
			case 's16':
				$_SESSION['va_tot3'] = $row1013->total;
				break;
			case 's17':
				$_SESSION['co_tot3'] = $row1013->total;
				break;
			case 's18':
				$_SESSION['gu_tot3'] = $row1013->total;
				break;
			case 's19':
				$_SESSION['na_tot3'] = $row1013->total;
				break;
			case 's20':
				$_SESSION['ge_tot3'] = $row1013->total;
				break;
			case 's21':
				$_SESSION['hi_tot3'] = $row1013->total;
				break;
			case 's22':
				$_SESSION['or_tot3'] = $row1013->total;
				break;
		
		}
		$cont++;
	}

	$sql109 = "SELECT cod_mat,cod_cur,count(cod_mat) total FROM clases_v where cod_cur=".$session_curso." and bimestre=".$_SESSION['app_user_bimestre']." GROUP BY cod_mat";
	$result109 = mysqli_query($db, $sql109);
	$cont = 0;
	while($row1019 = $result109->fetch_object())
	{
		switch ($row1019->cod_mat)
		{
			case 'P2':
				$_SESSION['ma_tot4'] = $row1019->total;
				break;
			case 'P1':
				$_SESSION['le_tot4'] = $row1019->total;
				break;
			case 'P3':
				$_SESSION['cn_tot4'] = $row1019->total;
				break;
			case 'P4':
				$_SESSION['cs_tot4'] = $row1019->total;
				break;
			case 'P7':
				$_SESSION['in_tot4'] = $row1019->total;
				break;
			case 'P11':
				$_SESSION['ef_tot4'] = $row1019->total;
				break;
			case 'P9':
				$_SESSION['mu_tot4'] = $row1019->total;
				break;
			case 'P10':
				$_SESSION['ap_tot4'] = $row1019->total;
				break;
			case 'P6':
				$_SESSION['va_tot4'] = $row1019->total;
				break;
			case 'P15':
				$_SESSION['co_tot4'] = $row1019->total;
				break;
			case 'P14':
				$_SESSION['gu_tot4'] = $row1019->total;
				break;
			case 'P5':
				$_SESSION['na_tot4'] = $row1019->total;
				break;
			case 'P17':
				$_SESSION['or_tot4'] = $row1019->total;
				break;

			case 'S1':
				$_SESSION['ma_tot4'] = $row1019->total;
				break;
			case 'S2':
				$_SESSION['le_tot4'] = $row1019->total;
				break;
			case 'S3':
				$_SESSION['fil_tot4'] = $row1019->total;
				break;
			case 'S4':
				$_SESSION['ps_tot4'] = $row1019->total;
				break;
			case 'S5':
				$_SESSION['cn_tot4'] = $row1019->total;
				break;
			case 'S6':
				$_SESSION['fi_tot4'] = $row1019->total;
				break;
			case 'S7':
				$_SESSION['qu_tot4'] = $row1019->total;
				break;
			case 'S8':
				$_SESSION['cs_tot4'] = $row1019->total;
				break;
			case 'S9':
				$_SESSION['te_tot4'] = $row1019->total;
				break;
			case 'S10':
				$_SESSION['bi_tot4'] = $row1019->total;
				break;
			case 'S11':
				$_SESSION['ci_tot4'] = $row1019->total;
				break;
			case 'S12':
				$_SESSION['in_tot4'] = $row1019->total;
				break;
			case 'S13':
				$_SESSION['ef_tot4'] = $row1019->total;
				break;
			case 'S14':
				$_SESSION['mu_tot4'] = $row1019->total;
				break;
			case 'S15':
				$_SESSION['ap_tot4'] = $row1019->total;
				break;
			case 'S16':
				$_SESSION['va_tot4'] = $row1019->total;
				break;
			case 'S17':
				$_SESSION['co_tot4'] = $row1019->total;
				break;
			case 'S18':
				$_SESSION['gu_tot4'] = $row1019->total;
				break;
			case 'S19':
				$_SESSION['na_tot4'] = $row1019->total;
				break;
			case 'S20':
				$_SESSION['ge_tot4'] = $row1019->total;
				break;
			case 'S21':
				$_SESSION['hi_tot4'] = $row1019->total;
				break;
			case 'S22':
				$_SESSION['or_tot4'] = $row1019->total;
				break;

			case 'p2':
				$_SESSION['ma_tot4'] = $row1019->total;
				break;
			case 'p1':
				$_SESSION['le_tot4'] = $row1019->total;
				break;
			case 'p3':
				$_SESSION['cn_tot4'] = $row1019->total;
				break;
			case 'p4':
				$_SESSION['cs_tot4'] = $row1019->total;
				break;
			case 'p7':
				$_SESSION['in_tot4'] = $row1019->total;
				break;
			case 'p11':
				$_SESSION['ef_tot4'] = $row1019->total;
				break;
			case 'p9':
				$_SESSION['mu_tot4'] = $row1019->total;
				break;
			case 'p10':
				$_SESSION['ap_tot4'] = $row1019->total;
				break;
			case 'p6':
				$_SESSION['va_tot4'] = $row1019->total;
				break;
			case 'p15':
				$_SESSION['co_tot4'] = $row1019->total;
				break;
			case 'p14':
				$_SESSION['gu_tot4'] = $row1019->total;
				break;
			case 'p5':
				$_SESSION['na_tot4'] = $row1019->total;
				break;
			case 'p17':
				$_SESSION['or_tot4'] = $row1019->total;
				break;

			case 's1':
				$_SESSION['ma_tot4'] = $row1019->total;
				break;
			case 's2':
				$_SESSION['le_tot4'] = $row1019->total;
				break;
			case 's3':
				$_SESSION['fil_tot4'] = $row1019->total;
				break;
			case 's4':
				$_SESSION['ps_tot4'] = $row1019->total;
				break;
			case 's5':
				$_SESSION['cn_tot4'] = $row1019->total;
				break;
			case 's6':
				$_SESSION['fi_tot4'] = $row1019->total;
				break;
			case 's7':
				$_SESSION['qu_tot4'] = $row1019->total;
				break;
			case 's8':
				$_SESSION['cs_tot4'] = $row1019->total;
				break;
			case 's9':
				$_SESSION['te_tot4'] = $row1019->total;
				break;
			case 's10':
				$_SESSION['bi_tot4'] = $row1019->total;
				break;
			case 's11':
				$_SESSION['ci_tot4'] = $row1019->total;
				break;
			case 's12':
				$_SESSION['in_tot4'] = $row1019->total;
				break;
			case 's13':
				$_SESSION['ef_tot4'] = $row1019->total;
				break;
			case 's14':
				$_SESSION['mu_tot4'] = $row1019->total;
				break;
			case 's15':
				$_SESSION['ap_tot4'] = $row1019->total;
				break;
			case 's16':
				$_SESSION['va_tot4'] = $row1019->total;
				break;
			case 's17':
				$_SESSION['co_tot4'] = $row1019->total;
				break;
			case 's18':
				$_SESSION['gu_tot4'] = $row1019->total;
				break;
			case 's19':
				$_SESSION['na_tot4'] = $row1019->total;
				break;
			case 's20':
				$_SESSION['ge_tot4'] = $row1019->total;
				break;
			case 's21':
				$_SESSION['hi_tot4'] = $row1019->total;
				break;
			case 's22':
				$_SESSION['or_tot4'] = $row1019->total;
				break;
		
		}
		$cont++;
	}



	
	$MsgApp = 'eHecho';
	echo $MsgApp;    
  }
  else
  {
	echo $MsgApp;    
  }
}
else
{
  echo $MsgApp;
}
?>