<?php
/*
	Classe: Cookie
	Objetivo:
		- Cookie, reformulado.
	
	Desenvolvido por: Felipe Gallo
	www.arkantas.com
*/
class Cookie{
	
	private $nome;
	private $path;
	private $dominio = "";
	
	public function __construct($nome = ""){
		if(empty($nome)){
			$this->setNome($this->criaNome());
		}else{
			$this->setNome($nome);
		}
		$this->setPath("/");
	}
	
	public function getNome(){
		return $this->nome;
	}
	
	public function getPath(){
		return $this->path;
	}
	
	public function getDominio(){
		return $this->dominio;
	}
	
	public function getCookie(){
		return @$_COOKIE[$this->getNome()];
	}
	
	
	public function setNome($nome){
        $this->nome = $nome;
	}
	
	public function setPath($path){
        $this->path = $path;
	}
	
	public function setDominio($dominio){
        $this->dominio = $dominio;
	}
	
	public function setCookie($valor = "", $tempo = 86400){
		if($this->isEmpty() == false){ $this->destroi(); }
		setcookie($this->getNome(), $valor, (time() + $tempo), $this->getPath(), $this->getDominio());		
	}
	
	private function criaNome(){
		for($i = 0 ; $i < rand(10, 20) ; $i++){
			$nome .= rand(0, 9);
		}
		return md5($nome);
	}
	
	
	public function criaArray(){
		$array = explode($this->divisoes(1), $this->getCookie());
		return $array;
	}
	
	private function divisoes($ordem){
		for($i = 0 ; $i < $ordem ; $i++){
			$valor .= "|";
		}
		return $valor;
	}
	
	public function isEmpty(){
		$cookie = $this->getCookie();
		return (empty($cookie)) ? true : false;
	}
	
	public function altera($valor){
		setcookie($this->getNome(), $valor, (time() + 86400), $this->getPath(), $this->getDominio());
		return null;	
	}
	
	public function concatena($valor){
		setcookie($this->getNome(), $this->getCookie() . $valor, (time() + 86400), $this->getPath(), $this->getDominio());
		return null;
	}
	
	public function destroi(){
		setcookie($this->getNome(), "", (time() + 0), $this->getPath(), $this->getDominio());
		return true;
	}

	public function destroy(){
		return $this->destroi();
	}
	
	public function __call($m, $a){
		echo "\n<strong>Método invocado não existe: $m</strong>\n";
	}
}

?>