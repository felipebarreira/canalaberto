<?php
abstract Class baseController{

	protected $load;

	public function __construct($objRegistro){
		$this->setRegistro($objRegistro);
		$this->load->template->template = $this->load->template;
	}
	
	public function setRegistro($registro){
		$this->load = $registro;
	}

	/*
	 * todos os controllers devem conter o metodo index
	 */
	abstract function index();

}
?>
