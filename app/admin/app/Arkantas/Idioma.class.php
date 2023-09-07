<?php
/*
	Classe: Idioma
	Objetivo:
		- Com a classe idiomas do arkantas existe a possibilidade de voc?dicionar a sua aplica? a quantidade de idiomas 
        que desejar sem muito esforco da sua parte.
        
    Requisitos:
        - GeoIP
	
	Desenvolvido por: Felipe Gallo
	www.arkantas.com
*/

Class Idioma{
	
	private $ip;
	private $packLanguage;
	private $language;
	private $geoDat;
	private $geoIp;
	private $countryCode;
	private $countryName;
	private $city;
	private $cityRegion;
	private $latitude;
	private $longitude;
	private $idioma = array();
	private $valores = array();
	private static $instancia;
	
	final public static function singleton(){
		if(empty(self::$instancia)):
			self::$instancia = new self();
		endif;
		return self::$instancia;
	}
	
	public function getIp(){
		return $this->ip;
	}
	
	public function getPackLanguage(){
		return $this->packLanguage;
	}
	
	public function getLanguage(){
		return $this->language;
	}
	
	public function getDat(){
		return $this->geoDat;
	}
	
	public function getGeoIP(){
		return $this->geoIp;
	}
	
	public function getCountryCode(){
		return $this->countryCode;
	}
	
	public function getCountryName(){
		return $this->countryName;
	}
	
	public function getCity(){
		return $this->city;
	}
	
	public function getCityRegion(){
		return $this->cityRegion;
	}
	
	public function getLatitude(){
		return $this->latitude;
	}
	
	public function getLongitude(){
		return $this->longitude;
	}

	
	public function getIdiomas(){
		return $this->idioma;
	}

    
	
	public function setIp($ip){
		$this->ip = $ip;
	}
	
	public function setPackLanguage($pack){
		if(is_array($pack)){
			$this->packLanguage = $pack;
		}
	}
	
	public function setLanguage($language){
		$this->language = strtolower($language);
	}

	public function setDat($dat){
		$this->geoDat = $dat;
	}
	
	public function setGeoIP($geoIp){
		$this->geoIp = $geoIp;
	}
	
	private function setCountryCode($countryCode){
		$this->countryCode = strtolower($countryCode);
	}
	
	private function setCountryName($countryName){
		$this->countryName = $countryName;
	}
	
	public function setCity($city){
		$this->city = $city;
	}
	
	public function setCityRegion($region){
		$this->cityRegion = $region;
	}
	
	public function setLatitude($latitude){
		$this->latitude = $latitude;
	}
	
	public function setLongitude($longitude){
		$this->longitude = $longitude;
	}
	
	
	public function addIdioma($idioma){
		if(!in_array($idioma, $this->idioma)){
			$this->idioma[$idioma] = $idioma;
		}
	}
	
	public function addValores($idioma, $valor){
		if(in_array($idioma, $this->idioma)){
			$key = array_search($idioma, $this->idioma);
			$val = array_keys($valor);
			
			$this->valores[$key][$val[0]] = $valor[$val[0]];
			return true;
		}
		return false;
	}
	
	public function get($key, $idioma = ""){
		if(!empty($idioma)){
			return $this->valores[$idioma][$key];
		}
		return $this->valores[$this->getLanguage()][$key];
	}
	
	public function load(){
	
		include($this->getGeoIP());
		$geoip = Net_GeoIP::getInstance($this->getDat());
		try{
			$location = $geoip->lookupLocation($this->getIp());
			
			$this->setCountryCode($location->countryCode);
			$this->setCountryName($location->countryName);
			$this->setCity(utf8_encode($location->city));
			$this->setCityRegion($location->region);
			$this->setLatitude($location->latitude);
			$this->setLongitude($location->longitude);
			
			if($this->getLanguage() == ""){
				$this->setLanguage($this->getCountryCode());
			}
			
			$pack = $this->getPackLanguage();
			if(is_array($pack)){
				for($i = 0, $bool = false ; $i < count($pack) ; $i++){
					$keys  = array_keys($pack);
					$cCode = $pack[$keys[$i]];
					for($j = 0 ; $j < count($cCode) ; $j++){
						//echo $cCode[$j] . " = " . $this->getCountryCode() . "<br />";
						if($cCode[$j] == $this->getCountryCode()){
							$this->setLanguage($keys[$i]);
							$bool = true;
							break;
						}else{
							//só default cai no if abaixo
							if($keys[$i] == "default"){
								//echo $keys[$j];
								$this->setLanguage($cCode[$j]);
								$bool = true;
							}
						}
					}
					if($bool == true){
						break;
					}
				}
			}
			
		} catch (Exception $e) {
			die("IP not found.");
		}
	}

}

/* 	
	$idioma = Idioma::singleton();
	$idioma->setIp($_SERVER['REMOTE_ADDR']);
	$idioma->setPackLanguage(array('br' => array("br", "fi"), 'en' => array('en', 'nl'), 'default' => array('en')));
	//$idioma->setLanguage('br');
	$idioma->setGeoIP("/home/weeby/php/Net/GeoIP.php");
    $idioma->setDat("/home/weeby/public_html/externas/geoip/dat/GeoLiteCity.dat");

		$idioma->addIdioma('br');
		
		$idioma->addValores('br', array("contato" => "Contato"));
		$idioma->addValores('br', array("mapa" => "Mapa"));

		
		$idioma->addIdioma('en');
		
		$idioma->addValores('en', array("contato" => "Contact"));
		$idioma->addValores('en', array("mapa" => "Map"));

	$idioma->load();
	echo $idioma->genericGet('contato') . "<br />";
	echo $idioma->genericGet('mapa', 'en') . "<br />";
	
	//echo $idioma->getLanguage(); */

?>