<?php
/*
	Classe: Browser
	
	Desenvolvido por: Felipe Gallo
	www.arkantas.com
*/
Class Browser{

	private $browsers;
	private $agent;
	private $nome;
	private $versao;
	
	public function __construct($useragent = ""){
		$useragent = (empty($useragent)) ? strtolower($_SERVER['HTTP_USER_AGENT']) : $useragent;
		
		$this->setAgent($useragent);
		$this->setBrowsers(new ArrayList);
		
			$this->addBrowser("firefox");
			$this->addBrowser("msie");
			$this->addBrowser("opera");
			$this->addBrowser("chrome");
			$this->addBrowser("safari");
			$this->addBrowser("netscape");
			$this->addBrowser("konqueror");
			$this->addBrowser("seamonkey");
			$this->addBrowser("mozilla");
			$this->addBrowser("gecko");
			$this->addBrowser("navigator");
			$this->addBrowser("mosaic");
			$this->addBrowser("lynx");
			$this->addBrowser("amaya");
			$this->addBrowser("omniweb");
			$this->addBrowser("avant");
			$this->addBrowser("omniweb");
			$this->addBrowser("camino");
			$this->addBrowser("flock");
			$this->addBrowser("aol");
		
	}
	
	public function getBrowsers(){
		return $this->browsers;
	}
	
	public function getAgent(){
		return $this->agent;
	}
	
	public function getNome(){
		return $this->nome;
	}
	
	public function getVersao(){
		return $this->versao;
	}
	
	private function setConfig(){

        foreach($this->getBrowsers()->toArray() as $browser){
			if(@eregi("($browser)[/ ]?([0-9.]*)", $this->getAgent(), $match)){	
				$this->setNome($match[1]);
			
				switch($this->getNome()){
					
					case "opera":
						@eregi("(version)[/ ]?([0-9.]*)", $this->getAgent(), $versao);
						$this->setVersao($versao[2]);
					break;
					
					default:
						$this->setVersao($match[2]);
					break;
					
				}
				break;
			}
        }

	}
	
	public function setBrowsers(ArrayList $objArrayList){
		$this->browsers = $objArrayList;
	}
	
	public function setAgent($agent){
		$this->agent = $agent;
	}
	
	public function setNome($nome){
		$this->nome = $nome;
	}
	
	public function setVersao($versao){
		$this->versao = $versao;
	}
	
	public function addBrowser($browser){
		
		for($i = 0, $arr = $this->getBrowsers()->toArray() ; $i < $this->getBrowsers()->size() ; $i++){
			if($arr[$i] == $browser){
				return false;
				break;
			}
		}
		
		$this->getBrowsers()->add($browser);
		$this->setConfig();
		return true;
		
	}
}

/*
$objBrowser = new Browser;
echo $objBrowser->getAgent();
echo "<br /><br />";
echo $objBrowser->getNome();
echo "<br />";
echo $objBrowser->getVersao();
*/
?>