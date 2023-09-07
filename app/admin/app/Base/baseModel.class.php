<?php
abstract Class baseModel{

	protected $load;

	public function __construct($objRegistro){
		$this->setRegistro($objRegistro);
	}
	
	public function setRegistro($registro){
		$this->load = $registro;
	}

}
?>