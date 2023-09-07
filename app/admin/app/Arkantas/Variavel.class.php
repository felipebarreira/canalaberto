<?php
/*
 * @classname: Variavel <change>
*/
class Variavel
{

	private $tipo;
	private $campos = array();
	private $escape = false;

	public function getTipo()
	{
		return $this->tipo;
	}

	public function getCampos()
	{
		return $this->campos;
	}

	public function getEscape()
	{
		return $this->escape;
	}

	public function getValores()
	{
		$arr       = array();
		$campos    = $this->getCampos();

		foreach ($campos as $key => $value) {
			$arr[$key] = $this->obterConteudo($key, $value);
			if ($this->getEscape() == false) {
				$arr[$key . "::escape"] = $arr[$key];
				$arr[$key] = (isset($arr[$key])) ? stripslashes($arr[$key]) : "";
			} else {
				$arr[$key . "::unscape"] = (isset($arr[$key])) ? stripslashes($arr[$key]) : "";
			}
		}
		return $arr;
	}

	public function setTipo($tipo)
	{
		$this->tipo = strtolower($tipo);
	}

	public function setCampos(array $campos)
	{
		$this->campos = $campos;
	}

	public function setEscape($escape)
	{
		$this->escape = $escape;
	}


	public function valida()
	{
		$campos  = $this->getCampos();
		$valores = $this->getValores();
		$array   = array();

		foreach ($campos as $key => $value) {
			switch (strtolower($value)) {
				case "html":
				case "text":
					if (empty($valores[$key])) {
						$array[$key] = "Campo obrigatoriamente do tipo texto.";
					}
					break;

				case "numeric":
					if (!is_numeric($valores[$key])) {
						$array[$key] = "Campo obrigatoriamente do tipo numérico.";
					}
					break;

				case "float":
					if (!is_float($valores[$key])) {
						$array[$key] = "Campo obrigatoriamente do tipo float.";
					}
					break;

				case "int":
					if (!is_int($valores[$key])) {
						$array[$key] = "Campo obrigatoriamente do tipo inteiro.";
					}
					break;

				case "boolean":
					if (!is_bool($valores[$key])) {
						$array[$key] = "Campo obrigatoriamente do tipo booleano.";
					}
					break;

				case "char":
					if (strlen($valores[$key]) > 1) {
						$array[$key] = "Campo obrigatoriamente do tipo char.";
					}
					break;

				case "email":
					// !eregi("^[a-z0-9_\.\+\-]+@[a-z0-9_\.\-]*[a-z0-9_\-]+\.[a-z]{2,4}$", $valores[$key]) -- decapreted
					// /^[^0-9][a-zA-Z0-9_\.\-\+]+([.][a-zA-Z0-9_]+)*[@][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,4}$/ -- decapreted
					// /^[^0-9][a-zA-Z0-9_\.\-\+]+([.][a-zA-Z0-9_]+)*[@][a-zA-Z0-9_\.\-]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,4}$/ -- decapreted
					if (!preg_match('/^[a-zA-Z0-9_\.\-\+]+([.][a-zA-Z0-9_]+)*[@][a-zA-Z0-9_\.\-]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,10}$/', $valores[$key])) {
						$array[$key] = "Campo obrigatoriamente deve ter um e-mail válido.";
					}
					break;

				case "null":
					break;

				default:

					if (!empty($valores[$key])) {
						if ($valores[$key] != $valores[$value]) {
							$array[$key] = "Campo deve ser preenchido corretamente.";
							break;
						}
						break;
					}

					$array[$key] = "Campo deve ser preenchido obrigatóriamente.";

					break;
			}
		}

		if (count($array) == 0) {
			return true;
		} else {
			return $array;
		}
	}

	public function retornaErros($formato = "json")
	{
		$array = $this->valida();

		if (is_array($array)) {

			switch ($formato) {

				case "json":
					$json = array();
					foreach ($array as $key => $value) {
						$json[$key] = $value;
					}

					return "<script type='text/javascript'> validaForm('" . json_encode($json) . "'); </script>";
					break;

				case "xml":
					header("content-type: text/xml");
					$xml = "<xml version=\"1.0\" encoding=\"UTF-8\">";
					$xml .= "<root>";
					foreach ($array as $key => $value) {
						$xml .= "<erro>";
						$xml .= "<nome>" . $key . "</nome>";
						$xml .= "<descricao>" . $value . "</descricao>";
						$xml .= "</erro>";
					}
					$xml .= "</root>";
					$xml .= "</xml>";

					return $xml;
					break;

				case "html":
					$html = "<ul>";
					foreach ($array as $key => $value) {
						$html .= "<li>" . $key . " - " . $value . "</li>";
					}
					$html .= "</ul>";

					return $html;
					break;
			}
		}
		return false;
	}

	private function obterConteudo($value, $type)
	{

		switch ($this->getTipo()) {
			case "post":
				if (isset($_POST[$value])) {
					switch ($type) {
						case "html":
							return addslashes($_POST[$value]);
							break;

						default:
							return strip_tags(addslashes($_POST[$value]), "<br><br/><br />");
							break;
					}
				}
				break;

			case "get":
				if (isset($_GET[$value])) {
					switch ($type) {
						case "html":
							return addslashes($_GET[$value]);
							break;

						default:
							return strip_tags(addslashes($_GET[$value]), "<br><br/><br />");
							break;
					}
				}
				break;

			case "file":
				return $_FILES[$value]['name'];
				break;
		}
	}


	private function replace($valor)
	{
		$var = str_replace("'", "", $valor);
		return $var;
	}

	public function clean($except = array())
	{

		$campos  = $this->getCampos();
		$valores = $this->getValores();
		$arr   = array();

		foreach ($campos as $key => $value) {
			if (!in_array($key, $except)) {
				$arr[$key] = $this->obterConteudo($key, $value);
				if ($this->getEscape() == false) {
					$arr[$key . "::escape"] = null;
					$arr[$key] = null;
				} else {
					$arr[$key . "::unscape"] = null;
				}
			}
		}
		return $arr;
	}
}
/* 
		$objVariavel = new Variavel;
		$objVariavel->setTipo('get');
		$objVariavel->setCampos(
			array(
				'rt' => 'text',
				'secao'  => 'text'
			)
		);
		//$objVariavel->setEscape(true);
		$gets = $objVariavel->getValores();
		
		echo $gets["rt"]; */
