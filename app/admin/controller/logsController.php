<?php
Class logsController Extends baseController{

	public function index(){

		# load vars
		$objGet = $this->load->gets;
		$gets = $objGet->getValores();
		
		# validacao
		$this->load->administrador->isAuthenticated(false);
		
		# load vars template
		$this->load->template->administrador = $this->load->administrador;
		$this->load->template->title = "Logs de acesso";
		$this->load->template->gets  = $gets;
		
		# model :: list config
		$this->load->model->setEntity("log");
		$this->load->model->setTable("tb_log, tb_administracao");
		$this->load->model->setOrder("log_id desc");
		
		# model :: template
		$this->load->template->loglist = $this->load->model->lista("tb_administracao.adm_id = tb_log.log_entidadeId");
		
		$total 								= $this->load->model->total("tb_administracao.adm_id = tb_log.log_entidadeId");
		$this->load->template->numExibicao 	= ($total >= $this->load->num && $total > ($this->load->page*$this->load->num)) ? ($this->load->page*$this->load->num) : $total ;
		$this->load->template->first 		= ($total > 0) ? ($this->load->first + 1) : $this->load->first ;
		$this->load->template->num 			= $this->load->num;
		$this->load->template->page 		= $this->load->page;
		$this->load->template->total 		= $total;
		
		$this->load->template->valueBusca = ($gets['busca'] == "") ? "busca" : $gets['busca'];
		$this->load->template->itensBusca = $this->load->model->getItensBusca();
		$this->load->template->checked    = $this->load->model->valorBusca();
		
		$this->load->template->campos 	  = $this->load->model->listaCamposOrdenacao();
		$this->load->template->pagination = $this->load->model->pagination("?rt=logs", "where tb_administracao.adm_id = tb_log.log_entidadeId");
		
		
		# views
		$this->load->template->show('index');
		//$this->load->template->show('menu');
		$this->load->template->show('configuracoes/logs/list-logs');
		$this->load->template->show('rodape');
	
	}
}
