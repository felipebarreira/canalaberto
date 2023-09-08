<?php
Class cRegistryController extends baseController{

	private function init(){
		
		# validation
		$this->load->administrador->isAuthenticated(false);

		# load vars
		$objGet = $this->load->gets;
		$gets = $objGet->getValores();

		# 

		# load vars template
		$this->load->template->administrador = $this->load->administrador;
		$this->load->template->gets = $gets;

	}

	public function index(){
	
		# load
		$this->init();
		$gets = $this->load->gets->getValores();

		# load vars template
		$this->load->template->title  = "Registros";

		# model :: list config
		$this->load->model->setEntity("complaint_registry");
		$this->load->model->setTable("tb_complaint_registry");

		$this->load->model->setOrder("registry_id desc");
		$this->load->model->setQuery(); //sobrescreve método, contendo select do método
		
		# model :: template
		$this->load->template->list 		= $this->load->model->lista();
		
		$total 								= $this->load->model->total();
		$this->load->template->numExibicao 	= ($total >= $this->load->num && $total > ($this->load->page*$this->load->num)) ? ($this->load->page*$this->load->num) : $total ;
		$this->load->template->first 		= ($total > 0) ? ($this->load->first + 1) : $this->load->first ;
		$this->load->template->num 			= $this->load->num;
		$this->load->template->page 		= $this->load->page;
		$this->load->template->total 		= $total;
		
		$this->load->template->valueBusca = ($gets['busca'] == "") ? "" : $gets['busca'];
		$this->load->template->itensBusca = $this->load->model->getItensBusca();
		$this->load->template->checked    = $this->load->model->valorBusca();
		
		$this->load->template->campos     = $this->load->model->listaCamposOrdenacao();
		$this->load->template->pagination = $this->load->model->pagination("?rt=cRegistry".$this->load->model->getFilter(), "where " . $this->load->model->getWhereByFilters());
		
		$this->load->template->filters = $this->load->model->hasFilter;

		$this->load->template->template = $this->load->template;


		# views
		$this->load->template->show('index');
			$this->load->template->show('complaint/list-registry');
		$this->load->template->show('rodape');
	
	}
	
	public function update(){
		
		# load
		$this->init();
		$this->load->post = $this->load->model->getPost()->getValores();
		
		# model
		$this->load->template->msg = $this->load->model->update();
		
		# load vars template
		$this->load->template->title 	= "Aprovação Registro " . $this->load->registry->getKey();		

		$this->load->template->registry = $this->load->registry;
		
		
		# views
		$this->load->template->show('index');
			$this->load->template->show('complaint/update-registry');
		$this->load->template->show('rodape');
		
	}


	public function delete(){

		# load
		$this->init();

		# model
		$this->load->model->delete();
	}
	
}
?>