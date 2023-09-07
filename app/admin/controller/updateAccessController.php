<?php
Class updateAccessController Extends baseController{

	public function index(){
	
		# load vars
		$objGet = $this->load->gets;
		$gets = $objGet->getValores();
		
		$this->load->objAdministrador = new Administrador($gets['id-administrador::escape']);
		
		# validação
		$this->load->administrador->isAuthenticated(false);
		
		# model
		$this->load->template->msg = $this->load->model->update();
		
		# load vars template
		$this->load->template->administrador = $this->load->administrador;
		$this->load->template->title = "Editar usuário";
		$this->load->template->gets  = $gets;
		
		$this->load->template->objAdministrador = $this->load->objAdministrador;
		
		
		# views
		$this->load->template->show('index');
		//$this->load->template->show('menu');
			$this->load->template->show('configuracoes/acessos/update-access');
		$this->load->template->show('rodape');
	
	}
	
}
