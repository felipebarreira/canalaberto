<?php
/*
	Classe: GZip
	Objetivo:
		- compressão .gz
	
	Desenvolvido por: Felipe Gallo
	www.arkantas.com
*/
class GZip{
	
	private $file;
	private $browserException;
	private $browser;
	
	
	public function __construct(){
		$objBrowser = new Browser;
		$this->file = new ArrayList;
		$this->browserException = new ArrayList;
		
		$this->setBrowser($objBrowser->getNome());
	}
	
	
	public function getFile(){
		return $this->file;
	}
	
	private function getExtFile($indice){
		$ext = strtolower(end(explode('.', $this->getFile()->get($indice))));
		if($ext == "js"){ $ext = "javascript"; }
		
		return $ext;
	}
	
	public function getBrowser(){
		return $this->browser;
	}
	
	public function getException(){
		return $this->browserException;
	}
	
	
	public function setBrowser($browser){
		$this->browser = $browser;
	}
	
	public function add($file){
		$this->file->add($file);
	}
	
	public function addException($browser){
		$this->browserException->add($browser);
	}
	
	
	public function load(){
	
		//echo $this->getBrowser() . "<br />";
		
		for($i = 0 ; $i < $this->getFile()->size() ; $i++){
			if(!$this->getException()->contains($this->getBrowser())){
				ob_start ("ob_gzhandler");
						
						header("Content-type: text/".$this->getExtFile($i)."; charset: UTF-8");
						header("Content-Encoding: gzip,deflate");
						header("Expires: ".gmdate("D, d M Y H:i:s", time() + (24 * 60 * 60)) . " GMT");
						header("Cache-Control: must-revalidate, proxy-revalidate" );
						
						include($this->getFile()->get($i));
						return true;
						
				ob_flush();
			}else{
				header("Content-type: text/".$this->getExtFile($i)."; charset: UTF-8");
				header("Cache-Control: must-revalidate, proxy-revalidate");
				
				include($this->getFile()->get($i));
				return true;
			}
		}
	
	}
	
}
/* 
	$gzip = new Gzip;
	$gzip->addException("opera");
	$gzip->add("http://weeby.me/js/core.site.js");
	
	$gzip->load(); */
?>