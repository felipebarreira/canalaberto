<?php
class logsModel extends baseModelList{

	public function __construct($objRegistro){
		$this->setRegistro($objRegistro);
		
		$busca = "";
		$gets  = $this->getGets();
		if(!empty($gets['busca']) && !empty($gets['opcao']))
			$busca = "&amp;busca=".urlencode($gets['busca'])."&amp;opcao=".$gets['opcao'];
		
		$itensBusca = new ArrayList;
		
			$itensBusca->addToPos(0, array("nome" => "Entidade" , "name" => "log_entidade"));
			$itensBusca->addToPos(1, array("nome" => "Cenário" , "name" => "log_entidadeLogin"));
			$itensBusca->addToPos(2, array("nome" => "Usuário" , "name" => "adm_nome"));
			$itensBusca->addToPos(3, array("nome" => "Data" , "name" => "log_data"));
			$itensBusca->addToPos(4, array("nome" => "IP" , "name" => "log_ip"));

			
		$itensTabela = new ArrayList;
		
			$itensTabela->addToPos(0, array("tit" => "Entidade" , "img" => '', "link" => 'orderc=log_entidade&amp;ordert=asc'.$busca , "name" => "log_entidade"));
			$itensTabela->addToPos(1, array("tit" => "Operação" , "img" => '', "link" => 'orderc=log_operacao&amp;ordert=asc'.$busca , "name" => "log_operacao"));
			$itensTabela->addToPos(2, array("tit" => "Cenário" , "img" => '', "link" => 'orderc=log_entidadeLogin&amp;ordert=asc'.$busca , "name" => "log_entidadeLogin"));
			$itensTabela->addToPos(3, array("tit" => "Usuário" , "img" => '', "link" => 'orderc=adm_nome&amp;ordert=asc'.$busca , "name" => "adm_nome"));
			$itensTabela->addToPos(4, array("tit" => "IP" , "img" => '', "link" => 'orderc=log_ip&amp;ordert=asc'.$busca , "name" => "log_ip"));
			$itensTabela->addToPos(5, array("tit" => "Data" , "img" => '', "link" => 'orderc=log_data&amp;ordert=asc'.$busca , "name" => "log_data"));
		
		
		$this->setItensBusca($itensBusca);
		$this->setItensTabela($itensTabela);
	}

}
