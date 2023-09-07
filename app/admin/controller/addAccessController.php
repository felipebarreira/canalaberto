<?php
Class addAccessController Extends baseController{

	public function index(){
	
		# load vars
		$objGet = $this->load->gets;
		$gets = $objGet->getValores();
		
		# validação
		$this->load->administrador->isAuthenticated(false);
		
		# load variaveis template
		$this->load->template->administrador = $this->load->administrador;
		$this->load->template->title = "Adicionar Acesso";
		$this->load->template->gets = $gets;
		
		# model
		$this->load->template->msg = $this->load->model->add();
		
		
		# views
		$this->load->template->show('index');
		//$this->load->template->show('menu');
			$this->load->template->show('configuracoes/acessos/add-access');
		$this->load->template->show('rodape');
	
	}
	
}
