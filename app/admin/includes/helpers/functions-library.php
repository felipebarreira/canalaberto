<?php
/*
	Ginga Library - Functions
	@ ignite_loadtime(); return string;
	
	# CMS
	@ loadExtensionsCMS(); return null;
	
	# GinGa Funcions
	 @ exibeNivel($nivel){}
	 @ ginga_order($gets, $default = ""){}
	 @ ginga_urlorder($gets, $url){}
	
	# Pagination Structure functions
	 @ prepara_sql($primeiro_registro, $num_por_pagina){}
	 @ pagina($tabela, $num_por_pagina, $pagina, $link){}
	 
	# Random Functions
	 @ isJson($string); return bool;
	 @ escapeCharacters($string); return string;
	 @ encode_array($args); return string;
	 @ booleanVerifica($valorBooleano, $msgTrue, $msgErro){}
	 @ exibeData($data, $delimitador){}
	 @ exibeDataExtenso($data){}
	 @ exibeAno($data){}
	 @ exibeMes($data){}
	 @ exibeDia($data){}
	 @ exibeTimestamp($data, $delimitador){}
	 @ converteDataEn($data){}
	 @ limiteTexto($texto, $tamanho){}
	 @ textLimit($texto, $tamanho){}
	 @ criaSenha($quantidade){}
	 @ buscaBinaria($valorPesquisa, array $vetor){}
	 @ selec(){}
	# Security Functions
	 @ allReplace($valor){}
	 @ redirect($caminho, $aviso = ""){}
	 @ verifica_email($email){}
	
	# Slug Functions
*/

function ignite_loadtime($start = null)
{
	$mtime = microtime();
	$mtime = explode(' ', $mtime);
	$mtime = $mtime[1] + $mtime[0];

	return ($start == null) ? $mtime : round($mtime - $start, 2);
}


/*
 *	Ginga4 CMS Functions
 */
function isPDF($file)
{

	$array = explode('.', $file);
	$extension = end($array);

	if ($extension == "pdf") {
		return true;
	}

	return false;
}
function loadExtensionsCMS()
{

	$extentions = get_loaded_extensions();
	$required 	= array(
		"tidy",
		"gd",
		'PDO'
	);

	$l = array();
	for ($j = 0, $count = 0; $j < sizeof($required); $j++) {
		if (!in_array($required[$j], $extentions)) {
			if (!extension_loaded($required[$j])) {
				$l[$count] = $required[$j];
				$count++;
			}
		}
	}

	if (sizeof($l) > 0) {
		$strext = "";
		for ($i = 0; $i < sizeof($l); $i++) {
			$strext .= "<strong>" . $l[$i] . "</strong><br />";
		}
		$strext = substr($strext, 0, -6);
		return '
			<script type="text/javascript">
				$(document).ready(function(){
					$.msgbox("O Módulo de CMS não pode ser executado, as extensões são necessárias para funcionamento: <br /> ' . $strext . '");
				});
			</script>
			';
	}
	return null;
}

function exibeNivel($nivel)
{
	switch ($nivel) {
		case "0":
			$nivel = "Geral";
			break;
		case "1":
			$nivel = "Restrito";
			break;
		case "2":
			$nivel = "Financeiro";
			break;
	}

	return $nivel;
}

function ginga_order($gets, $default = "")
{

	if (!empty($gets['orderc']) && !empty($gets['ordert'])) {
		return $gets['orderc'] . ' ' . $gets['ordert'];
	}
	return $default;
}

function ginga_urlorder($gets, $url)
{
	if (!empty($gets['orderc']) && !empty($gets['ordert'])) {
		return $url . '&amp;orderc=' . $gets['orderc'] . '&amp;ordert=' . $gets['ordert'] . '&amp;page';
	}
	return $url . '&amp;page';
}

/*
 *	Functions Pagination
 */
function prepara_sql($primeiro_registro, $num_por_pagina)
{
	$var = " LIMIT $primeiro_registro, $num_por_pagina";
	return $var;
}

function pagina($tabela, $num_por_pagina, $pagina, $link)
{

	$objConexao = Conexao::singleton();

	list($total_usuarios) = $objConexao->fetchQueryCount($objConexao->select("COUNT(*)", $tabela));

	$total_paginas = $total_usuarios / $num_por_pagina;
	$prev   = $pagina - 1;
	$next   = $pagina + 1;
	$numpag = 10;
	$medianumpag = $numpag / 2;

	$primeiro = $pagina - $medianumpag <= 0 ? 1 : $pagina - $medianumpag;
	$ultimo   = $pagina + $medianumpag > $total_paginas ? $total_paginas : $pagina + $medianumpag;

	$total_paginas = ceil($total_paginas);
	$ultimo		   = ceil($ultimo);
	$primeiro 	   = ceil($primeiro);
	$painel 	   = "";

	if ($pagina > 1) {
		$prev_link = "<a href=\"" . $link . "=$prev\" class=\"pagseta\">&laquo;</a>";
	} else {
		$prev_link = "<a href=\"#\" class=\"pagseta none\">&laquo;</a>";
	}
	if ($total_paginas > $pagina) {
		$next_link = "<a href=\"" . $link . "=$next\" class=\"pagseta\">&raquo;</a>";
	} else {
		$next_link = "<a href=\"#\" class=\"pagseta none\">&raquo;</a>";
	}


	if (((int)$ultimo - (int)$primeiro) != $numpag) {
		if ($total_paginas >= ($numpag + 1)) {
			if (((int)$ultimo - (int)$primeiro) < $numpag && $ultimo <= $numpag) {
				$ultimo = ($numpag + 1);
			} elseif (((int)$ultimo - (int)$primeiro) < $numpag && $ultimo > $numpag) {
				$primeiro = $ultimo - $numpag;
			}
		}
	}

	for ($x = $primeiro; $x <= $ultimo; $x++) {
		if ($x == $pagina) {
			$painel .= "<a href=\"$link=$x\" class=\"selec\">$x</a>";
		} else {
			$painel .= "<a href=\"$link=$x\">$x</a>";
		}
	}

	if (!empty($painel)) {
		echo "$prev_link $painel $next_link";
	}
}

/*
 *	Functions
 */
function image_fix_orientation(&$image, $filename)
{
	$exif = @exif_read_data($filename);

	if (!empty($exif['Orientation'])) {
		switch ($exif['Orientation']) {
			case 3:
				$image->rotate(180);
				$image->save($filename);
				break;

			case 6:
				$image->rotate(-90);
				$image->save($filename);
				break;

			case 8:
				$image->rotate(90);
				$image->save($filename);
				break;
		}
	}
}

function addhttp($url)
{
	if (!preg_match("~^(?:f|ht)tps?://~i", $url)) {
		$url = "http://" . $url;
	}
	return $url;
}

function addmask($mask, $str)
{
	$str = str_replace(" ", "", $str);
	for ($i = 0; $i < strlen($str); $i++)
		$mask[strpos($mask, "#")] = $str[$i];

	return $mask;
}

function array2csv(array &$array)
{
	if (count($array) == 0) {
		return null;
	}

	ob_start();
	$df = fopen("php://output", 'w');


	//fputcsv($df, array_keys(reset($array)));

	foreach ($array as $row) {
		fputcsv($df, $row);
	}

	fclose($df);
	return ob_get_clean();
}

function download_send_headers($filename)
{
	// disable caching
	$now = gmdate("D, d M Y H:i:s");
	header("Expires: Tue, 03 Jul 2001 06:00:00 GMT");
	header("Cache-Control: max-age=0, no-cache, must-revalidate, proxy-revalidate");
	header("Last-Modified: {$now} GMT");

	// force download  
	header("Content-Type: application/force-download");
	header("Content-Type: application/octet-stream");
	header("Content-Type: application/download");
	header("Content-Type: text/csv");

	// disposition / encoding on response body
	header("Content-Disposition: attachment;filename={$filename}");
	header("Content-Transfer-Encoding: binary");
}

function percent($num_amount, $num_total, $numberformat = 0)
{
	if ($num_total <= 0) return 0;
	$count1 = $num_amount / $num_total;
	$count2 = $count1 * 100;
	$count = number_format($count2, $numberformat);
	return $count;
}

function get_numberformat($num, $numberformat = 0)
{
	if ($num <= 0) return 0;

	if ($num <= 999) {
		$count = number_format($num, $numberformat);
	} else {
		$count = number_format($num, $numberformat, '.', '');
	}
	return $count;
}

function TimeToSec($time)
{
	$sec = 0;
	foreach (array_reverse(explode(':', $time)) as $k => $v) $sec += pow(60, $k) * $v;
	return $sec;
}

function TimeToMinute($time)
{
	$sec = TimeToSec($time);
	return ($sec / 60);
}

function displayChoose($value, $param1, $param2)
{
	if ($value == 1)
		return $param1;

	return $param2;
}
/*
 *	Functions
 */


function isCnpjValid($cnpj)
{
	//Etapa 1: Cria um array com apenas os digitos numéricos, isso permite receber o cnpj em diferentes formatos como "00.000.000/0000-00", "00000000000000", "00 000 000 0000 00" etc...
	$j = 0;
	$num = array();
	for ($i = 0; $i < (strlen($cnpj)); $i++) {
		if (is_numeric($cnpj[$i])) {
			$num[$j] = $cnpj[$i];
			$j++;
		}
	}
	//Etapa 2: Conta os dígitos, um Cnpj válido possui 14 dígitos numéricos.
	if (count($num) != 14) {
		$isCnpjValid = false;
	}
	//Etapa 3: O número 00000000000 embora não seja um cnpj real resultaria um cnpj válido após o calculo dos dígitos verificares e por isso precisa ser filtradas nesta etapa.
	if ($num[0] == 0 && $num[1] == 0 && $num[2] == 0 && $num[3] == 0 && $num[4] == 0 && $num[5] == 0 && $num[6] == 0 && $num[7] == 0 && $num[8] == 0 && $num[9] == 0 && $num[10] == 0 && $num[11] == 0) {
		$isCnpjValid = false;
	}

	return true;
}

function isCpfValid($cpf = false)
{

	/**
	 * Multiplica dígitos vezes posições 
	 *
	 * @param string $digitos Os digitos desejados
	 * @param int $posicoes A posição que vai iniciar a regressão
	 * @param int $soma_digitos A soma das multiplicações entre posições e dígitos
	 * @return int Os dígitos enviados concatenados com o último dígito
	 *
	 */
	if (!function_exists('calc_digitos_posicoes')) {
		function calc_digitos_posicoes($digitos, $posicoes = 10, $soma_digitos = 0)
		{
			// Faz a soma dos dígitos com a posição
			// Ex. para 10 posições: 
			//   0    2    5    4    6    2    8    8   4
			// x10   x9   x8   x7   x6   x5   x4   x3  x2
			//   0 + 18 + 40 + 28 + 36 + 10 + 32 + 24 + 8 = 196
			for ($i = 0; $i < strlen($digitos); $i++) {
				$soma_digitos = $soma_digitos + ($digitos[$i] * $posicoes);
				$posicoes--;
			}

			// Captura o resto da divisão entre $soma_digitos dividido por 11
			// Ex.: 196 % 11 = 9
			$soma_digitos = $soma_digitos % 11;

			// Verifica se $soma_digitos é menor que 2
			if ($soma_digitos < 2) {
				// $soma_digitos agora será zero
				$soma_digitos = 0;
			} else {
				// Se for maior que 2, o resultado é 11 menos $soma_digitos
				// Ex.: 11 - 9 = 2
				// Nosso dígito procurado é 2
				$soma_digitos = 11 - $soma_digitos;
			}

			// Concatena mais um dígito aos primeiro nove dígitos
			// Ex.: 025462884 + 2 = 0254628842
			$cpf = $digitos . $soma_digitos;

			// Retorna
			return $cpf;
		}
	}

	// Verifica se o CPF foi enviado
	if (!$cpf) {
		return false;
	}

	// Remove tudo que não é número do CPF
	// Ex.: 025.462.884-23 = 02546288423
	$cpf = preg_replace('/[^0-9]/is', '', $cpf);

	// Verifica se o CPF tem 11 caracteres
	// Ex.: 02546288423 = 11 números
	if (strlen($cpf) != 11) {
		return false;
	}

	// Captura os 9 primeiros dígitos do CPF
	// Ex.: 02546288423 = 025462884
	$digitos = substr($cpf, 0, 9);

	// Faz o cálculo dos 9 primeiros dígitos do CPF para obter o primeiro dígito
	$novo_cpf = calc_digitos_posicoes($digitos);

	// Faz o cálculo dos 10 dígitos do CPF para obter o último dígito
	$novo_cpf = calc_digitos_posicoes($novo_cpf, 11);

	// Verifica se todos os números são iguais
	if (verifica_igualdade($cpf)) {
		return false;
	}

	// Verifica se o novo CPF gerado é idêntico ao CPF enviado
	if ($novo_cpf === $cpf) {
		// CPF válido
		return true;
	} else {
		// CPF inválido
		return false;
	}
}

function verifica_igualdade($value)
{
	// Todos os caracteres em um array
	$caracteres = str_split($value);
	// Considera que todos os números são iguais
	$todos_iguais = true;
	// Primeiro caractere
	$last_val = $caracteres[0];
	// Verifica todos os caracteres para detectar diferença
	foreach ($caracteres as $val) {
		// Se o último valor for diferente do anterior, já temos
		// um número diferente no CPF ou CNPJ
		if ($last_val != $val) {
			$todos_iguais = false;
		}
		// Grava o último número checado
		$last_val = $val;
	}
	// Retorna true para todos os números iguais
	// ou falso para todos os números diferentes
	return $todos_iguais;
}

function addCaracter($var, $caracter, $lim)
{
	$tamanho = strlen($var);
	if ($tamanho > $lim) {
		$ini = 0;
		$fim = $lim;
		$nova = "";

		$nova .= substr($var, $ini, $lim) . $caracter;
		$nova .= substr($var, $lim);

		return $nova;
	} else {
		return $var;
	}
}

# check if is json
function uuidcode($str)
{

	$str = str_replace('.', '', $str);
	$str = str_replace('/', '', $str);
	$str = str_replace('-', '', $str);
	$str = str_replace('(', '', $str);
	$str = str_replace(')', '', $str);
	$str = str_replace(' ', '', $str);

	return $str;
}

function findExtension($filename)
{
	$filename = strtolower($filename);
	$exts = explode(".", $filename);
	$n = count($exts) - 1;
	$exts = $exts[$n];
	return $exts;
}


function isJson($string)
{
	json_decode($string);
	return (json_last_error() == JSON_ERROR_NONE) ? 1 : 0;
}

function escapeCharacters($string)
{
	return str_replace('"', '&quot;', $string);
}

function encode_array($args)
{

	if (!is_array($args)) return false;

	$c = 0;
	$out = '';
	foreach ($args as $name => $value) {
		if ($c++ != 0) $out .= '&';
		$out .= urlencode("$name") . '=';

		if (is_array($value)) {
			$out .= urlencode(serialize($value));
		} else {
			$out .= urlencode("$value");
		}
	}

	return $out . "\n";
}

function booleanVerifica($valorBooleano, $msgTrue, $msgErro)
{
	return ($valorBooleano == true) ? $msgTrue : $msgErro;
}

function getDaysBetweenTwoDates($datetime1, $datetime2)
{

	$date1 = new DateTime($datetime1);
	$date2 = new DateTime($datetime2);

	$diff = $date2->diff($date1);
	return $diff->days;
}


function validDate($date, $format = 'YYYY-MM-DD')
{
	if (strlen($date) >= 8 && strlen($date) <= 10) {
		$separator_only = str_replace(array('M', 'D', 'Y'), '', $format);
		$separator = $separator_only[0];
		if ($separator) {
			$regexp = str_replace($separator, "\\" . $separator, $format);
			$regexp = str_replace('MM', '(0[1-9]|1[0-2])', $regexp);
			$regexp = str_replace('M', '(0?[1-9]|1[0-2])', $regexp);
			$regexp = str_replace('DD', '(0[1-9]|[1-2][0-9]|3[0-1])', $regexp);
			$regexp = str_replace('D', '(0?[1-9]|[1-2][0-9]|3[0-1])', $regexp);
			$regexp = str_replace('YYYY', '\d{4}', $regexp);
			$regexp = str_replace('YY', '\d{2}', $regexp);
			if ($regexp != $date && preg_match('/' . $regexp . '$/', $date)) {
				foreach (array_combine(explode($separator, $format), explode($separator, $date)) as $key => $value) {
					if ($key == 'YY') $year = '20' . $value;
					if ($key == 'YYYY') $year = $value;
					if ($key[0] == 'M') $month = $value;
					if ($key[0] == 'D') $day = $value;
				}
				if (checkdate($month, $day, $year)) return true;
			}
		}
	}
	return false;
}

function strftimefixed($format, $timestamp = null)
{

	if ($timestamp === null) $timestamp = time();

	if (strtoupper(substr(PHP_OS, 0, 3)) == 'WIN') {
		$format = preg_replace('#(?<!%)((?:%%)*)%e#', '\1%#d', $format);
		$locale = setlocale(LC_TIME, 0);

		switch (true) {
			case (preg_match('#\.(874|1256)$#', $locale, $matches)):
				return @iconv('UTF-8', "$locale_charset", strftime($format, $timestamp));

			case (preg_match('#\.1250$#', $locale)):
				return @mb_convert_encoding(strftime($format, $timestamp), 'UTF-8', 'ISO-8859-2');

			case (preg_match('#\.(1251|1252|1254)$#', $locale, $matches)):
				return @mb_convert_encoding(strftime($format, $timestamp), 'UTF-8', 'Windows-' . $matches[1]);

			case (preg_match('#\.(1255|1256)$#', $locale, $matches)):
				return @iconv('UTF-8', "Windows-{$matches[1]}", strftime($format, $timestamp));

			case (preg_match('#\.1257$#', $locale)):
				return @mb_convert_encoding(strftime($format, $timestamp), 'UTF-8', 'ISO-8859-13');

			case (preg_match('#\.(932|936|950)$#', $locale)):
				return @mb_convert_encoding(strftime($format, $timestamp), 'UTF-8', 'CP' . $matches[1]);

			case (preg_match('#\.(949)$#', $locale)):
				return @mb_convert_encoding(strftime($format, $timestamp), 'UTF-8', 'EUC-KR');

			default:
				trigger_error("Unknown charset for system locale ($locale)", E_USER_NOTICE);
				return @mb_convert_encoding(strftime($format, $timestamp), 'UTF-8', 'auto');
		}
	}

	return @strftime($format, $timestamp);
}

function showDateDMY($data, $delimitador = "/")
{
	$data = substr($data, 0, 10);
	$array = explode("-", $data);
	$dataBr = $array[2] . $delimitador . $array[1] . $delimitador . $array[0];

	return $dataBr;
}

function exibeData($data, $delimitador = "/")
{
	$data = substr($data, 0, 10);
	$array = explode("-", $data);
	$dataBr = $array[2] . $delimitador . $array[1] . $delimitador . $array[0];

	return $dataBr;
}

function exibeDataExtenso($data)
{
	$data  = substr($data, 0, 10);
	$array = explode("-", $data);
	$mes = strftimefixed("%B", strtotime($data));
	return $array[2] . " de " . $mes . " de " . $array[0];
}

function exibeDataExtensoMes($data)
{
	$data  = substr($data, 0, 10);
	$array = explode("-", $data);
	$mes = strftimefixed("%B", strtotime($data));
	return $array[2] . " de " . $mes;
}

function exibeDataMes($data)
{
	$data  = substr($data, 0, 10);
	$array = explode("-", $data);
	$mes = strftimefixed("%B", strtotime($data));
	$mes = substr($mes, 0, 3);
	return $array[2] . " de " . $mes;
}

function exibeMesExtenso($data)
{
	$data  = substr($data, 0, 10);
	$array = explode("-", $data);
	$mes = strftimefixed("%B", strtotime($data));
	return ucfirst($mes);
}

function getYear($data, $d = '-')
{
	if ($data == "")
		return null;

	$array = explode($d, $data);
	return $array[0];
}

function getMonth($data, $d = '-')
{
	if ($data == "")
		return null;

	$array = explode($d, $data);
	return $array[1];
}

function getDay($data, $d = '-')
{
	if ($data == "")
		return null;

	$array = explode($d, $data);
	return $array[2];
}

function exibeAno($data)
{
	$array = explode("-", $data);
	return $array[0];
}

function exibeDia($data)
{
	$array = explode("-", $data);
	return $array[2];
}

function getMonthDate($data)
{
	$data  = substr($data, 0, 10);
	$array = explode("-", $data);
	$mes = strftimefixed("%B", strtotime($data));
	return $array[2] . " de " . $mes;
}

function exibeMes($data)
{
	$data = strftimefixed("%B", strtotime($data));
	$data = substr($data, 0, 3);
	return $data;
}

function exibeTimestamp($data, $delimitador)
{
	$data  = substr($data, 0, 10);
	$array = explode("-", $data);
	$dataBr = $array[2] . $delimitador . $array[1] . $delimitador . $array[0];

	return $dataBr;
}

function converteDataEn($data)
{
	$array = explode("/", $data);
	return $array[2] . "-" . $array[1] . "-" . $array[0];
}

function limiteTexto($texto, $tamanho)
{
	return (strlen($texto) > $tamanho) ? substr($texto, 0, $tamanho) . '...' : $texto;
}

function textLimit($texto, $tamanho, $string = "...")
{
	return (strlen($texto) > $tamanho) ? substr($texto, 0, $tamanho) . $string : $texto;
}

function getLetterArrayByKey($key)
{
	$alphas = array_merge(range('A', 'Z'));
	return $alphas[$key];
}

function criaSenha($quantidade)
{
	$senha = '';
	for ($i = 0; $i < $quantidade; $i++) {
		$senha .= rand(0, 9);
	}
	return $senha;
}

function convertToHoursMins($time, $format = '%d:%d')
{
	settype($time, 'integer');
	if ($time < 1) {
		return 0;
	}
	$hours = floor($time / 60);
	$minutes = ($time % 60);
	if ($minutes == 0) {
		$format = '%2d horas';
	}

	return sprintf($format, $hours, $minutes);
}

function formatarString($string)
{
	$string = ucfirst($string);
	$string = str_replace("-", "° ", $string);
	return $string;
}

function get_months($date1, $date2)
{
	$time1  = strtotime($date1);
	$time2  = strtotime($date2);
	$my     = date('mY', $time2);

	$months = array();
	$f      = '';

	while ($time1 < $time2) {
		$time1 = strtotime((date('Y-m-d', $time1) . ' +15days'));
		if (date('Y-m', $time1) != $f) {
			$f = date('Y-m', $time1);
			if (date('mY', $time1) != $my && ($time1 < $time2))
				$months[] = date('Y-m', $time1);
		}
	}

	$months[] = date('Y-m', $time2);
	return $months;
}

function buscaBinaria($valorPesquisa, array $vetor)
{
	$n_elementos = count($vetor);
	$inicio = 0;
	$fim = $n_elementos - 1;
	$meio = (int) (($fim - $inicio) / 2) + $inicio;

	while ($inicio <= $fim) {
		if ($vetor[$meio] < $valorPesquisa) {
			$inicio = $meio + 1;
		} elseif ($vetor[$meio] > $valorPesquisa) {
			$fim = $meio - 1;
		} else {
			return $meio;
		}
		$meio = (int) (($fim - $inicio) / 2) + $inicio;
	}
	return -1;
}

function selec($get = "", $value = "", $selec = 'class="selec"')
{

	if (!is_array($value))
		$value = array($value);

	for ($i = 0; $i < sizeof($value); $i++) {

		if ($value[$i] == $get) {
			return $selec;
		}
	}

	return null;
}

function is_urlEncoded($string)
{
	$test_string = $string;
	while (urldecode($test_string) != $test_string) {
		$test_string = urldecode($test_string);
	}
	return (urlencode($test_string) == $string) ? True : False;
}

function urlencodesanit($string)
{

	$is_encoded = is_urlEncoded($string);
	if ($is_encoded)
		return $string;

	return urlencode($string);
}

function remove_path($file, $path)
{
	if (strpos($file, $path) !== FALSE) {
		return substr($file, strlen($path));
	}
}

function FileSizeConvert($bytes)
{
	$bytes = floatval($bytes);
	$arBytes = array(
		0 => array(
			"UNIT" => "TB",
			"VALUE" => pow(1024, 4)
		),
		1 => array(
			"UNIT" => "GB",
			"VALUE" => pow(1024, 3)
		),
		2 => array(
			"UNIT" => "MB",
			"VALUE" => pow(1024, 2)
		),
		3 => array(
			"UNIT" => "KB",
			"VALUE" => 1024
		),
		4 => array(
			"UNIT" => "B",
			"VALUE" => 1
		),
	);

	$result = 0;
	foreach ($arBytes as $arItem) {
		if ($bytes >= $arItem["VALUE"]) {
			$result = $bytes / $arItem["VALUE"];
			$result = str_replace(".", ",", strval(round($result, 2))) . " " . $arItem["UNIT"];
			break;
		}
	}
	return $result;
}

function toAlpha($data)
{
	$alphabet =   array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
	$alpha_flip = array_flip($alphabet);
	if ($data <= 25) {
		return strtoupper($alphabet[$data]);
	} elseif ($data > 25) {
		$dividend = ($data + 1);
		$alpha = '';
		$modulo = 0;
		while ($dividend > 0) {
			$modulo = ($dividend - 1) % 26;
			$alpha = $alphabet[$modulo] . $alpha;
			$dividend = floor((($dividend - $modulo) / 26));
		}
		return strtoupper($alpha);
	}
}

/*
 *	Security Functions
 */

function allReplace($valor)
{
	$var = ($valor != null) ? str_replace("'", "", $valor) : $valor;
	return $var;
}

function redirect($caminho, $aviso = "")
{
	if (!empty($aviso)) {
		$aviso = "ginga_alert('" . $aviso . "');";
	}
	echo "<script type='text/Javascript'> " . $aviso . " location.href='" . $caminho . "'; </script>";
}

function decode_characters($info)
{
	$info = mb_convert_encoding($info, "HTML-ENTITIES", "UTF-8");
	$info = preg_replace('~^(&([a-zA-Z0-9]);)~', htmlentities('${1}'), $info);
	return ($info);
}

############# INIT :: SLUG ##################
/**
 * Converts all accent characters to ASCII characters.
 *
 * If there are no accent characters, then the string given is just returned.
 *
 * @since 1.2.1
 *
 * @param string $string Text that might have accent characters
 * @return string Filtered string with replaced "nice" characters.
 */
function remove_accents($string)
{
	if (!preg_match('/[\x80-\xff]/', $string))
		return $string;

	if (seems_utf8($string)) {
		$chars = array(
			// Decompositions for Latin-1 Supplement
			chr(195) . chr(128) => 'A', chr(195) . chr(129) => 'A',
			chr(195) . chr(130) => 'A', chr(195) . chr(131) => 'A',
			chr(195) . chr(132) => 'A', chr(195) . chr(133) => 'A',
			chr(195) . chr(135) => 'C', chr(195) . chr(136) => 'E',
			chr(195) . chr(137) => 'E', chr(195) . chr(138) => 'E',
			chr(195) . chr(139) => 'E', chr(195) . chr(140) => 'I',
			chr(195) . chr(141) => 'I', chr(195) . chr(142) => 'I',
			chr(195) . chr(143) => 'I', chr(195) . chr(145) => 'N',
			chr(195) . chr(146) => 'O', chr(195) . chr(147) => 'O',
			chr(195) . chr(148) => 'O', chr(195) . chr(149) => 'O',
			chr(195) . chr(150) => 'O', chr(195) . chr(153) => 'U',
			chr(195) . chr(154) => 'U', chr(195) . chr(155) => 'U',
			chr(195) . chr(156) => 'U', chr(195) . chr(157) => 'Y',
			chr(195) . chr(159) => 's', chr(195) . chr(160) => 'a',
			chr(195) . chr(161) => 'a', chr(195) . chr(162) => 'a',
			chr(195) . chr(163) => 'a', chr(195) . chr(164) => 'a',
			chr(195) . chr(165) => 'a', chr(195) . chr(167) => 'c',
			chr(195) . chr(168) => 'e', chr(195) . chr(169) => 'e',
			chr(195) . chr(170) => 'e', chr(195) . chr(171) => 'e',
			chr(195) . chr(172) => 'i', chr(195) . chr(173) => 'i',
			chr(195) . chr(174) => 'i', chr(195) . chr(175) => 'i',
			chr(195) . chr(177) => 'n', chr(195) . chr(178) => 'o',
			chr(195) . chr(179) => 'o', chr(195) . chr(180) => 'o',
			chr(195) . chr(181) => 'o', chr(195) . chr(182) => 'o',
			chr(195) . chr(182) => 'o', chr(195) . chr(185) => 'u',
			chr(195) . chr(186) => 'u', chr(195) . chr(187) => 'u',
			chr(195) . chr(188) => 'u', chr(195) . chr(189) => 'y',
			chr(195) . chr(191) => 'y',
			// Decompositions for Latin Extended-A
			chr(196) . chr(128) => 'A', chr(196) . chr(129) => 'a',
			chr(196) . chr(130) => 'A', chr(196) . chr(131) => 'a',
			chr(196) . chr(132) => 'A', chr(196) . chr(133) => 'a',
			chr(196) . chr(134) => 'C', chr(196) . chr(135) => 'c',
			chr(196) . chr(136) => 'C', chr(196) . chr(137) => 'c',
			chr(196) . chr(138) => 'C', chr(196) . chr(139) => 'c',
			chr(196) . chr(140) => 'C', chr(196) . chr(141) => 'c',
			chr(196) . chr(142) => 'D', chr(196) . chr(143) => 'd',
			chr(196) . chr(144) => 'D', chr(196) . chr(145) => 'd',
			chr(196) . chr(146) => 'E', chr(196) . chr(147) => 'e',
			chr(196) . chr(148) => 'E', chr(196) . chr(149) => 'e',
			chr(196) . chr(150) => 'E', chr(196) . chr(151) => 'e',
			chr(196) . chr(152) => 'E', chr(196) . chr(153) => 'e',
			chr(196) . chr(154) => 'E', chr(196) . chr(155) => 'e',
			chr(196) . chr(156) => 'G', chr(196) . chr(157) => 'g',
			chr(196) . chr(158) => 'G', chr(196) . chr(159) => 'g',
			chr(196) . chr(160) => 'G', chr(196) . chr(161) => 'g',
			chr(196) . chr(162) => 'G', chr(196) . chr(163) => 'g',
			chr(196) . chr(164) => 'H', chr(196) . chr(165) => 'h',
			chr(196) . chr(166) => 'H', chr(196) . chr(167) => 'h',
			chr(196) . chr(168) => 'I', chr(196) . chr(169) => 'i',
			chr(196) . chr(170) => 'I', chr(196) . chr(171) => 'i',
			chr(196) . chr(172) => 'I', chr(196) . chr(173) => 'i',
			chr(196) . chr(174) => 'I', chr(196) . chr(175) => 'i',
			chr(196) . chr(176) => 'I', chr(196) . chr(177) => 'i',
			chr(196) . chr(178) => 'IJ', chr(196) . chr(179) => 'ij',
			chr(196) . chr(180) => 'J', chr(196) . chr(181) => 'j',
			chr(196) . chr(182) => 'K', chr(196) . chr(183) => 'k',
			chr(196) . chr(184) => 'k', chr(196) . chr(185) => 'L',
			chr(196) . chr(186) => 'l', chr(196) . chr(187) => 'L',
			chr(196) . chr(188) => 'l', chr(196) . chr(189) => 'L',
			chr(196) . chr(190) => 'l', chr(196) . chr(191) => 'L',
			chr(197) . chr(128) => 'l', chr(197) . chr(129) => 'L',
			chr(197) . chr(130) => 'l', chr(197) . chr(131) => 'N',
			chr(197) . chr(132) => 'n', chr(197) . chr(133) => 'N',
			chr(197) . chr(134) => 'n', chr(197) . chr(135) => 'N',
			chr(197) . chr(136) => 'n', chr(197) . chr(137) => 'N',
			chr(197) . chr(138) => 'n', chr(197) . chr(139) => 'N',
			chr(197) . chr(140) => 'O', chr(197) . chr(141) => 'o',
			chr(197) . chr(142) => 'O', chr(197) . chr(143) => 'o',
			chr(197) . chr(144) => 'O', chr(197) . chr(145) => 'o',
			chr(197) . chr(146) => 'OE', chr(197) . chr(147) => 'oe',
			chr(197) . chr(148) => 'R', chr(197) . chr(149) => 'r',
			chr(197) . chr(150) => 'R', chr(197) . chr(151) => 'r',
			chr(197) . chr(152) => 'R', chr(197) . chr(153) => 'r',
			chr(197) . chr(154) => 'S', chr(197) . chr(155) => 's',
			chr(197) . chr(156) => 'S', chr(197) . chr(157) => 's',
			chr(197) . chr(158) => 'S', chr(197) . chr(159) => 's',
			chr(197) . chr(160) => 'S', chr(197) . chr(161) => 's',
			chr(197) . chr(162) => 'T', chr(197) . chr(163) => 't',
			chr(197) . chr(164) => 'T', chr(197) . chr(165) => 't',
			chr(197) . chr(166) => 'T', chr(197) . chr(167) => 't',
			chr(197) . chr(168) => 'U', chr(197) . chr(169) => 'u',
			chr(197) . chr(170) => 'U', chr(197) . chr(171) => 'u',
			chr(197) . chr(172) => 'U', chr(197) . chr(173) => 'u',
			chr(197) . chr(174) => 'U', chr(197) . chr(175) => 'u',
			chr(197) . chr(176) => 'U', chr(197) . chr(177) => 'u',
			chr(197) . chr(178) => 'U', chr(197) . chr(179) => 'u',
			chr(197) . chr(180) => 'W', chr(197) . chr(181) => 'w',
			chr(197) . chr(182) => 'Y', chr(197) . chr(183) => 'y',
			chr(197) . chr(184) => 'Y', chr(197) . chr(185) => 'Z',
			chr(197) . chr(186) => 'z', chr(197) . chr(187) => 'Z',
			chr(197) . chr(188) => 'z', chr(197) . chr(189) => 'Z',
			chr(197) . chr(190) => 'z', chr(197) . chr(191) => 's',
			// Euro Sign
			chr(226) . chr(130) . chr(172) => 'E',
			// GBP (Pound) Sign
			chr(194) . chr(163) => ''
		);

		$string = strtr($string, $chars);
	} else {
		// Assume ISO-8859-1 if not UTF-8
		$chars['in'] = chr(128) . chr(131) . chr(138) . chr(142) . chr(154) . chr(158)
			. chr(159) . chr(162) . chr(165) . chr(181) . chr(192) . chr(193) . chr(194)
			. chr(195) . chr(196) . chr(197) . chr(199) . chr(200) . chr(201) . chr(202)
			. chr(203) . chr(204) . chr(205) . chr(206) . chr(207) . chr(209) . chr(210)
			. chr(211) . chr(212) . chr(213) . chr(214) . chr(216) . chr(217) . chr(218)
			. chr(219) . chr(220) . chr(221) . chr(224) . chr(225) . chr(226) . chr(227)
			. chr(228) . chr(229) . chr(231) . chr(232) . chr(233) . chr(234) . chr(235)
			. chr(236) . chr(237) . chr(238) . chr(239) . chr(241) . chr(242) . chr(243)
			. chr(244) . chr(245) . chr(246) . chr(248) . chr(249) . chr(250) . chr(251)
			. chr(252) . chr(253) . chr(255);

		$chars['out'] = "EfSZszYcYuAAAAAACEEEEIIIINOOOOOOUUUUYaaaaaaceeeeiiiinoooooouuuuyy";

		$string = strtr($string, $chars['in'], $chars['out']);
		$double_chars['in'] = array(chr(140), chr(156), chr(198), chr(208), chr(222), chr(223), chr(230), chr(240), chr(254));
		$double_chars['out'] = array('OE', 'oe', 'AE', 'DH', 'TH', 'ss', 'ae', 'dh', 'th');
		$string = str_replace($double_chars['in'], $double_chars['out'], $string);
	}

	return $string;
}
/**
 * Checks to see if a string is utf8 encoded.
 *
 * NOTE: This function checks for 5-Byte sequences, UTF8
 *       has Bytes Sequences with a maximum length of 4.
 *
 * @author bmorel at ssi dot fr (modified)
 * @since 1.2.1
 *
 * @param string $str The string to be checked
 * @return bool True if $str fits a UTF-8 model, false otherwise.
 */
function seems_utf8($str)
{
	$length = strlen($str);
	for ($i = 0; $i < $length; $i++) {
		$c = ord($str[$i]);
		if ($c < 0x80) $n = 0; # 0bbbbbbb
		elseif (($c & 0xE0) == 0xC0) $n = 1; # 110bbbbb
		elseif (($c & 0xF0) == 0xE0) $n = 2; # 1110bbbb
		elseif (($c & 0xF8) == 0xF0) $n = 3; # 11110bbb
		elseif (($c & 0xFC) == 0xF8) $n = 4; # 111110bb
		elseif (($c & 0xFE) == 0xFC) $n = 5; # 1111110b
		else return false; # Does not match any model
		for ($j = 0; $j < $n; $j++) { # n bytes matching 10bbbbbb follow ?
			if ((++$i == $length) || ((ord($str[$i]) & 0xC0) != 0x80))
				return false;
		}
	}
	return true;
}
/**
 * Encode the Unicode values to be used in the URI.
 *
 * @since 1.5.0
 *
 * @param string $utf8_string
 * @param int $length Max length of the string
 * @return string String with Unicode encoded for URI.
 */
function utf8_uri_encode($utf8_string, $length = 0)
{
	$unicode = '';
	$values = array();
	$num_octets = 1;
	$unicode_length = 0;

	$string_length = strlen($utf8_string);
	for ($i = 0; $i < $string_length; $i++) {

		$value = ord($utf8_string[$i]);

		if ($value < 128) {
			if ($length && ($unicode_length >= $length))
				break;
			$unicode .= chr($value);
			$unicode_length++;
		} else {
			if (count($values) == 0) $num_octets = ($value < 224) ? 2 : 3;

			$values[] = $value;

			if ($length && ($unicode_length + ($num_octets * 3)) > $length)
				break;
			if (count($values) == $num_octets) {
				if ($num_octets == 3) {
					$unicode .= '%' . dechex($values[0]) . '%' . dechex($values[1]) . '%' . dechex($values[2]);
					$unicode_length += 9;
				} else {
					$unicode .= '%' . dechex($values[0]) . '%' . dechex($values[1]);
					$unicode_length += 6;
				}

				$values = array();
				$num_octets = 1;
			}
		}
	}

	return $unicode;
}
/**
 * Sanitizes title, replacing whitespace with dashes.
 *
 * Limits the output to alphanumeric characters, underscore (_) and dash (-).
 * Whitespace becomes a dash.
 *
 * @since 1.2.0
 *
 * @param string $title The title to be sanitized.
 * @return string The sanitized title.
 */
function sanitize_title_with_dashes($title)
{
	$title = strip_tags($title);
	// Preserve escaped octets.
	$title = preg_replace('|%([a-fA-F0-9][a-fA-F0-9])|', '---$1---', $title);
	// Remove percent signs that are not part of an octet.
	$title = str_replace('%', '', $title);
	// Restore octets.
	$title = preg_replace('|---([a-fA-F0-9][a-fA-F0-9])---|', '%$1', $title);

	$title = remove_accents($title);
	if (seems_utf8($title)) {
		if (function_exists('mb_strtolower')) {
			$title = mb_strtolower($title, 'UTF-8');
		}
		$title = utf8_uri_encode($title, 200);
	}

	$title = strtolower($title);
	$title = preg_replace('/&.+?;/', '', $title); // kill entities
	$title = str_replace('.', '-', $title);
	$title = preg_replace('/[^%a-z0-9 _-]/', '', $title);
	$title = preg_replace('/\s+/', '-', $title);
	$title = preg_replace('|-+|', '-', $title);
	$title = trim($title, '-');

	return $title;
}

/* 
	echo sanitize_title_with_dashes("E então?! Como você irá fazer para olhar lá em cima? A pêra é uma coisa de paçoca.");
	echo "<hr>";
	echo sanitize_title_with_dashes("Condomínio do Palácio da Maçonaria Primeiro Sólo ");
*/
############# END :: SLUG ##################

function price_format($format, $number)
{
	$fmt = numfmt_create('pt_BR', NumberFormatter::CURRENCY);
	$symbol = $fmt->getSymbol(NumberFormatter::INTL_CURRENCY_SYMBOL);
	return $fmt->formatCurrency($number, $symbol);
}

if (!function_exists('money_format')) {
	function money_format($format, $number)
	{
		$regex  = '/%((?:[\^!\-]|\+|\(|\=.)*)([0-9]+)?' .
			'(?:#([0-9]+))?(?:\.([0-9]+))?([in%])/';
		if (setlocale(LC_MONETARY, 0) == 'C') {
			setlocale(LC_MONETARY, '');
		}
		$locale = localeconv();
		preg_match_all($regex, $format, $matches, PREG_SET_ORDER);
		foreach ($matches as $fmatch) {
			$value = floatval($number);
			$flags = array(
				'fillchar'  => preg_match('/\=(.)/', $fmatch[1], $match) ?
					$match[1] : ' ',
				'nogroup'   => preg_match('/\^/', $fmatch[1]) > 0,
				'usesignal' => preg_match('/\+|\(/', $fmatch[1], $match) ?
					$match[0] : '+',
				'nosimbol'  => preg_match('/\!/', $fmatch[1]) > 0,
				'isleft'    => preg_match('/\-/', $fmatch[1]) > 0
			);
			$width      = trim($fmatch[2]) ? (int)$fmatch[2] : 0;
			$left       = trim($fmatch[3]) ? (int)$fmatch[3] : 0;
			$right      = trim($fmatch[4]) ? (int)$fmatch[4] : $locale['int_frac_digits'];
			$conversion = $fmatch[5];

			$positive = true;
			if ($value < 0) {
				$positive = false;
				$value  *= -1;
			}
			$letter = $positive ? 'p' : 'n';

			$prefix = $suffix = $cprefix = $csuffix = $signal = '';

			$signal = $positive ? $locale['positive_sign'] : $locale['negative_sign'];
			switch (true) {
				case $locale["{$letter}_sign_posn"] == 1 && $flags['usesignal'] == '+':
					$prefix = $signal;
					break;
				case $locale["{$letter}_sign_posn"] == 2 && $flags['usesignal'] == '+':
					$suffix = $signal;
					break;
				case $locale["{$letter}_sign_posn"] == 3 && $flags['usesignal'] == '+':
					$cprefix = $signal;
					break;
				case $locale["{$letter}_sign_posn"] == 4 && $flags['usesignal'] == '+':
					$csuffix = $signal;
					break;
				case $flags['usesignal'] == '(':
				case $locale["{$letter}_sign_posn"] == 0:
					$prefix = '(';
					$suffix = ')';
					break;
			}
			if (!$flags['nosimbol']) {
				$currency = $cprefix .
					($conversion == 'i' ? $locale['int_curr_symbol'] : $locale['currency_symbol']) .
					$csuffix;
			} else {
				$currency = '';
			}
			$space  = $locale["{$letter}_sep_by_space"] ? ' ' : '';

			$value = number_format(
				$value,
				$right,
				$locale['mon_decimal_point'],
				$flags['nogroup'] ? '' : $locale['mon_thousands_sep']
			);
			$value = @explode($locale['mon_decimal_point'], $value);

			$n = strlen($prefix) + strlen($currency) + strlen($value[0]);
			if ($left > 0 && $left > $n) {
				$value[0] = str_repeat($flags['fillchar'], $left - $n) . $value[0];
			}
			$value = implode($locale['mon_decimal_point'], $value);
			if ($locale["{$letter}_cs_precedes"]) {
				$value = $prefix . $currency . $space . $value . $suffix;
			} else {
				$value = $prefix . $value . $space . $currency . $suffix;
			}
			if ($width > 0) {
				$value = str_pad($value, $width, $flags['fillchar'], $flags['isleft'] ?
					STR_PAD_RIGHT : STR_PAD_LEFT);
			}

			$format = str_replace($fmatch[0], $value, $format);
		}
		return $format;
	}
}

/**
 * Get the hash of the current git HEAD
 * @param str $branch The git branch to check
 * @return mixed Either the hash or a boolean false
 */
function get_current_git_commit($branch = 'master')
{
	if ($hash = file_get_contents(sprintf('.git/refs/heads/%s', $branch))) {
		return trim($hash);
	} else {
		return false;
	}
}

/**
 * Get cache string composed of the hash of git or date
 * @return str hash of git or date
 */
function get_cache()
{
	$cacheString = false;

	try {
		$cacheString = substr(@get_current_git_commit(), -8);
	} finally {
		if (!$cacheString) $cacheString = date("dmY");
	}

	return $cacheString;
}

if (!function_exists('mime_content_type')) {
	function _mime_content_type($filename)
	{
		$result = new finfo();

		if (is_resource($result) === true) {
			return $result->file($filename, FILEINFO_MIME_TYPE);
		}

		return false;
	}
}
