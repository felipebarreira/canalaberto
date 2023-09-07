<?php
Class removeAccessController Extends baseController{

	public function index(){
		
		# load vars
		$objGet = $this->load->gets;
		$gets = $objGet->getValores();
		
		# validação
		$this->load->administrador->isAuthenticated(false);
		
		# load vars template
		$this->load->template->administrador = $this->load->administrador;
		$this->load->template->gets = $gets;
		
		# model
		$this->load->model->remove();
	
	}
	
}
?>