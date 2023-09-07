<?php
Class listAccessController Extends baseController{

	public function index(){

		# load vars
		$objGet = $this->load->gets;
		$gets = $objGet->getValores();
		
		# validação
		$this->load->administrador->isAuthenticated(false);
		
		# load vars template
		$this->load->template->administrador = $this->load->administrador;
		$this->load->template->title = "Lista Acessos";
		$this->load->template->gets  = $gets;
		
		# model :: list config
		$this->load->model->setEntity("administracao");
		$this->load->model->setTable("tb_administracao");
		$this->load->model->setOrder("adm_nome asc");
		
		# model :: template
		$this->load->template->ladministrador = $this->load->model->lista();
		
		$total								 = $this->load->model->total();
		$this->load->template->numExibicao 	 = ($total >= $this->load->num && $total > ($this->load->page * $this->load->num)) ? ($this->load->page * $this->load->num) : $total ;
		$this->load->template->first 		 = ($total > 0) ? ($this->load->first + 1) : $this->load->first ;
		$this->load->template->num 			 = $this->load->num;
		$this->load->template->page 		 = $this->load->page;
		$this->load->template->total 		 = $total;
		
		$this->load->template->valueBusca = ($gets['busca'] == "") ? "busca" : $gets['busca'];
		$this->load->template->itensBusca = $this->load->model->getItensBusca();
		$this->load->template->checked    = $this->load->model->valorBusca();
		
		$this->load->template->campos     = $this->load->model->listaCamposOrdenacao();
		$this->load->template->pagination = $this->load->model->pagination("?rt=listAccess");
		
		
		# views
		$this->load->template->show('index');
		//$this->load->template->show('menu');
		$this->load->template->show('configuracoes/acessos/list-access');
		$this->load->template->show('rodape');
	
	}
	
}
?>