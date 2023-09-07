<?php
namespace Component;
use \DateTime;
use \IntlDateFormatter;

interface IntlDate {

	public function format($datetime);

}

class IntlDateFormatterAdapter implements IntlDate {

	public $intlInstance;
	public $formatObj = 'd/m/Y';

	public function __construct($locale, $datetype, $timetype, $timezone = NULL, $calendar = NULL){

		if (class_exists('IntlDateFormatter')) {

			$datetype = $this->getTypeFormat($datetype);
			$timetype = $this->getTypeFormat($timetype);

			$this->intlInstance = new IntlDateFormatter(
			    $locale, //locale
			    $datetype, //datetype
			    $timetype, //timetype
			    $timezone, //timezone
			    $calendar //calendar
			);
		}

	}

	public function getTypeFormat($format){
		switch(strtolower($format)){
			case "none":
				$format = IntlDateFormatter::NONE;
			break;
			
			case "short":
				$format = IntlDateFormatter::SHORT;
			break;
			
			case "medium":
				$format = IntlDateFormatter::MEDIUM;
			break;

			case "long":
				$format = IntlDateFormatter::LONG;
			break;

			case "full":
				$format = IntlDateFormatter::FULL;
			break;

		}

		return $format;
	}

	public function format($datetime){

		$datetime = (is_object($datetime)) ? $datetime : new \DateTime($datetime) ;

		if(!is_object($this->intlInstance))
			return $datetime->format($this->formatObj);

		return $this->intlInstance->format($datetime);
	}

}

?>