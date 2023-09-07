<?php
Class Language{
	
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
	private $languages = array();
	private $dir = 'lang';
	private static $instance;
	
	final public static function init($domain = ''){
		if(empty(self::$instance)):
			self::$instance = new self($domain);
		endif;
		return self::$instance;
	}
	
	
	public function __construct($domain = ''){
	
		$directory = PATH.$this->getDir();
		$locale = $domain.".utf8";
		
		if (extension_loaded('gettext')) {
			putenv("LANG=".$locale);
			
			setlocale(LC_ALL, NULL);
			setlocale(LC_ALL, $locale);
			
			bindtextdomain($domain, $directory);
			textdomain($domain);
			
			bind_textdomain_codeset($domain, 'UTF-8');
		}else{
			require_once(PATH . PATH_ADMIN . '/library/phpgettext/gettext.inc');
			
			// gettext setup
			T_setlocale(LC_MESSAGES, $locale);
			// set the text domain as 'messages'
			T_bindtextdomain($domain, $directory);
			T_bind_textdomain_codeset($domain, 'UTF-8');
			T_textdomain($domain);
		}
		
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

	public function getLanguages(){
		return $this->languages;
	}

	public function getDir(){
		return $this->dir;
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
	
	public function setDir($dir){
		$this->dir = $dir;
	}
	
	public function addLanguage($languages){
		if(!in_array($languages, $this->languages)){
			$this->languages[$languages] = $languages;
		}
	}
	
	public function loadLanguageIP(){
	
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

?>